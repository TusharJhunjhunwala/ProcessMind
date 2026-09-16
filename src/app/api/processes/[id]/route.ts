import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || 'biz_quickcart';
  const process = db.getProcess(businessId, params.id);

  if (!process) {
    return NextResponse.json({ error: 'Process not found' }, { status: 404 });
  }

  const versions = db.getProcessVersions(params.id);
  const baselineVersion = process.baselineVersionId ? db.getProcessVersion(process.baselineVersionId) : versions[0];
  const currentVersion = process.currentVersionId ? db.getProcessVersion(process.currentVersionId) : versions[0];
  const workflow = db.getWorkflowByProcess(businessId, params.id);
  const agentRuns = db.getAgentRuns(businessId, params.id);
  const workflowRuns = db.getWorkflowRuns(businessId, params.id);
  const driftEvents = db.getDriftEvents(businessId, params.id);

  return NextResponse.json({
    process,
    versions,
    baselineVersion,
    currentVersion,
    workflow,
    agentRuns,
    workflowRuns,
    driftEvents,
  });
}

export async function PATCH(
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

    const body = await req.json();
    Object.assign(process, body, { updatedAt: new Date().toISOString() });
    db.saveProcess(process);

    return NextResponse.json({ process });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
