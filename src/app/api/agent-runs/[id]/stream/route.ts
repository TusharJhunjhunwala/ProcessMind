import { db } from '@/infrastructure/db/store';
import { ProcessPipelineCoordinator } from '@/packages/process-engine/coordinator';
import { AgentTimelineEvent } from '@/packages/shared/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const runId = params.id;
  const initialRun = db.getAgentRun(runId);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // 1. Send existing timeline events
      if (initialRun && initialRun.timeline) {
        for (const evt of initialRun.timeline) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
        }
        if (initialRun.status === 'completed' || initialRun.status === 'needs_approval') {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'COMPLETE', status: initialRun.status })}\n\n`)
          );
        }
      }

      // 2. Subscribe to live events
      const listener = (event: AgentTimelineEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch (e) {
          // Client disconnected
        }
      };

      ProcessPipelineCoordinator.subscribe(runId, listener);

      // Heartbeat ping every 15s to keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch (_) {
          clearInterval(interval);
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        ProcessPipelineCoordinator.unsubscribe(runId, listener);
        try {
          controller.close();
        } catch (_) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
