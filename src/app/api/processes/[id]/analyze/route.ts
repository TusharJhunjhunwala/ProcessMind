import { NextResponse } from 'next/server';
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
    } catch (_) {
      // Empty body is okay
    }

    const agentRun = await ProcessPipelineCoordinator.runAnalysisPipeline(
      businessId,
      params.id,
      {
        sampleVideoType: body.sampleVideoType,
        isSimulated: body.isSimulated ?? true,
      }
    );

    return NextResponse.json({
      runId: agentRun._id,
      status: agentRun.status,
      message: 'Multi-agent analysis pipeline initiated successfully.',
      timeline: agentRun.timeline,
      output: agentRun.output,
    });
  } catch (err: any) {
    console.error('[API analyze] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
