import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function GET() {
  const businesses = db.getBusinesses();
  return NextResponse.json({ businesses });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newBiz = {
      _id: `biz_${Date.now()}`,
      name: body.name || 'New Small Business',
      ownerId: body.ownerId || `user_${Date.now()}`,
      plan: body.plan || 'business',
      createdAt: new Date().toISOString(),
    };
    db.saveBusiness(newBiz);
    return NextResponse.json({ business: newBiz }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
