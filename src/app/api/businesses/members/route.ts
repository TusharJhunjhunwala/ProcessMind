import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const businessId = body.businessId || 'biz_quickcart';
    const newUser = {
      _id: `user_${Date.now()}`,
      businessId,
      name: body.name,
      email: body.email,
      role: body.role || 'member',
    };
    db.addUser(newUser);
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
