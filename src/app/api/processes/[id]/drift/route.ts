import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || 'biz_quickcart';
  const driftEvents = db.getDriftEvents(businessId, params.id);
  const process = db.getProcess(businessId, params.id);
  const baseline = process?.baselineVersionId ? db.getProcessVersion(process.baselineVersionId) : undefined;
  const current = process?.currentVersionId ? db.getProcessVersion(process.currentVersionId) : undefined;

  return NextResponse.json({
    driftEvents,
    baseline,
    current,
  });
}
