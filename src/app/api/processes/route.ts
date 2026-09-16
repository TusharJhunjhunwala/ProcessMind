import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || 'biz_quickcart';
  const processes = db.getProcesses(businessId);
  return NextResponse.json({ processes });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const businessId = body.businessId || 'biz_quickcart';
    const newProcess = {
      _id: `proc_${Date.now()}`,
      businessId,
      name: body.name,
      description: body.description || '',
      status: 'draft' as const,
      sampleVideoType: body.sampleVideoType || 'quickcart_orders',
      recordingUrl: body.recordingUrl || '/demo/quickcart_order_flow.mp4',
      recordingDurationSec: body.recordingDurationSec || 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.saveProcess(newProcess);

    db.addAuditLog({
      _id: `audit_${Date.now()}`,
      businessId,
      actorId: body.userId || 'user_sarah',
      actorName: body.userName || 'Sarah Lin (Owner)',
      action: 'PROCESS_CREATED',
      entityId: newProcess._id,
      entityType: 'process',
      timestamp: new Date().toISOString(),
      details: { name: newProcess.name },
    });

    return NextResponse.json({ process: newProcess }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
