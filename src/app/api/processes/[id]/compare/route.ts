import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';
import { ProcessPipelineCoordinator } from '@/packages/process-engine/coordinator';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId') || 'biz_quickcart';
    
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {}

    const { driftEvent, driftOutput } = await ProcessPipelineCoordinator.detectDrift(
      businessId,
      params.id,
      body.observedVersionId
    );

    db.addAuditLog({
      _id: `audit_${Date.now()}`,
      businessId,
      actorId: 'drift_agent',
      actorName: 'Drift Agent (Auditor)',
      action: 'DRIFT_DETECTED',
      entityId: driftEvent._id,
      entityType: 'drift_event',
      timestamp: new Date().toISOString(),
      details: {
        baselineId: driftEvent.baselineVersionId,
        changesCount: driftEvent.changes.length,
      },
    });

    return NextResponse.json({
      driftEvent,
      driftOutput,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
