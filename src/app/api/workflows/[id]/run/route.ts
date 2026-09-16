import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';
import { ProcessPipelineCoordinator } from '@/packages/process-engine/coordinator';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = db.getWorkflow(params.id);
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    if (workflow.status !== 'approved' && workflow.status !== 'active') {
      return NextResponse.json(
        { error: 'Workflow must be approved by business owner before execution (Section 28).' },
        { status: 403 }
      );
    }

    const { agentRun, workflowRun, verificationOutput } = await ProcessPipelineCoordinator.verifyWorkflow(
      workflow.businessId,
      workflow._id
    );

    // Audit log
    db.addAuditLog({
      _id: `audit_${Date.now()}`,
      businessId: workflow.businessId,
      actorId: 'system_verification',
      actorName: 'Verification Agent',
      action: 'WORKFLOW_VERIFIED_IN_SANDBOX',
      entityId: workflow._id,
      entityType: 'workflow',
      timestamp: new Date().toISOString(),
      details: {
        runId: workflowRun._id,
        durationMs: workflowRun.durationMs,
        stepsPassed: verificationOutput.structuredData.stepsPassed,
      },
    });

    return NextResponse.json({
      success: true,
      workflowRun,
      agentRun,
      verification: verificationOutput.structuredData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
