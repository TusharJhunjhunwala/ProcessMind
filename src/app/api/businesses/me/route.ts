import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || 'biz_quickcart';
  const business = db.getBusiness(businessId);
  const users = db.getUsers(businessId);
  const applications = db.getApplications(businessId);

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  return NextResponse.json({
    business,
    users,
    applications,
    currentUser: users.find(u => u.role === 'owner') || users[0],
  });
}
