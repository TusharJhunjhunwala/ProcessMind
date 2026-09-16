import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const run = db.getAgentRun(params.id);
  if (!run) {
    return NextResponse.json({ error: 'Agent run not found' }, { status: 404 });
  }
  return NextResponse.json({ run });
}
