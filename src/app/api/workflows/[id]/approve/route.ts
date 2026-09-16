import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = db.getWorkflow(params.id);
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}

    const actorId = body.userId || 'user_sarah';
    const actorName = body.userName || 'Sarah Lin (Owner)';

    workflow.status = 'approved';
    workflow.approvedBy = actorId;
    workflow.approvedAt = new Date().toISOString();
    workflow.updatedAt = new Date().toISOString();
    db.saveWorkflow(workflow);

    // Update parent process status
    const process = db.getProcess(workflow.businessId, workflow.processId);
    if (process) {
      process.status = 'approved';
      db.saveProcess(process);
    }

    // Add Audit Log
    db.addAuditLog({
      _id: `audit_${Date.now()}`,
      businessId: workflow.businessId,
      actorId,
      actorName,
      action: 'WORKFLOW_APPROVED',
      entityId: workflow._id,
      entityType: 'workflow',
      timestamp: new Date().toISOString(),
      details: {
        workflowName: workflow.name,
        stepsCount: workflow.steps.length,
      },
    });

    return NextResponse.json({
      workflow,
      message: 'Workflow approved by owner. Ready for sandbox verification and runner execution.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
