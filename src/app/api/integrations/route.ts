import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';
import { GitHubIntegration, SandboxConnector } from '@/packages/integrations';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || 'biz_quickcart';
  const applications = db.getApplications(businessId);
  const githubInfo = await GitHubIntegration.getRepoDetails();

  return NextResponse.json({
    applications,
    githubInfo,
  });
}
