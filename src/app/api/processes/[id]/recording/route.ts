import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

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

    const body = await req.json();
    process.recordingUrl = body.recordingUrl || '/demo/quickcart_order_flow.mp4';
    process.recordingDurationSec = body.durationSec || 58;
    process.status = 'recording_uploaded';
    process.sampleVideoType = body.sampleVideoType || 'quickcart_orders';
    process.updatedAt = new Date().toISOString();

    db.saveProcess(process);

    db.addAuditLog({
      _id: `audit_${Date.now()}`,
      businessId,
      actorId: body.userId || 'user_tushar',
      actorName: body.userName || 'Tushar (Owner)',
      action: 'RECORDING_UPLOADED',
      entityId: process._id,
      entityType: 'process',
      timestamp: new Date().toISOString(),
      details: {
        recordingUrl: process.recordingUrl,
        duration: process.recordingDurationSec,
      },
    });

    return NextResponse.json({
      process,
      message: 'Screen recording uploaded and ready for Computer Vision agent pipeline.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
