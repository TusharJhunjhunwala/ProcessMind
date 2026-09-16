import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';
import { AutomationAgent } from '@/packages/agents/automation';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId') || 'biz_quickcart';
    const process = db.getProcess(businessId, params.id);

    if (!process) {
      return NextResponse.json({ error: 'Process not found' }, { status: 404 });
    }

    const output = await AutomationAgent.execute({
      businessId,
      processId: params.id,
      runId: `run_gen_${Date.now()}`,
      inputRefs: {},
      context: {},
    });

    const workflowId = `wf_${Date.now()}`;
    const workflow = {
      _id: workflowId,
      businessId,
      processId: params.id,
      processVersionId: process.currentVersionId || process.baselineVersionId || 'v1',
      name: output.structuredData.workflowName,
      steps: output.structuredData.steps,
      codeScript: output.structuredData.executableScript,
      status: 'pending_approval' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.saveWorkflow(workflow);

    return NextResponse.json({
      workflow,
      summary: output.summary,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
