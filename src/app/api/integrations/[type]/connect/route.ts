import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/db/store';
import { GitHubIntegration, SandboxConnector } from '@/packages/integrations';

export async function POST(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId') || 'biz_quickcart';
    const body = await req.json();

    if (params.type === 'github') {
      const repo = body.repo || 'quickcart/ecommerce-automation-scripts';
      const repoDetails = await GitHubIntegration.getRepoDetails(repo);

      const app = {
        _id: 'app_github',
        businessId,
        name: `GitHub: ${repo}`,
        type: 'developer' as const,
        connectionStatus: 'connected' as const,
        config: { repo, branch: body.branch || 'main' },
        lastSyncedAt: new Date().toISOString(),
      };
      db.saveApplication(app);

      db.addAuditLog({
        _id: `audit_${Date.now()}`,
        businessId,
        actorId: body.userId || 'user_tushar',
        actorName: body.userName || 'Tushar (Owner)',
        action: 'DEVELOPER_TOOLS_CONNECTED',
        entityId: app._id,
        entityType: 'integration',
        timestamp: new Date().toISOString(),
        details: { repo, branch: app.config.branch },
      });

      return NextResponse.json({
        success: true,
        integration: app,
        repoDetails,
        message: 'GitHub developer repository connected. Workflow dispatch enabled.',
      });
    }

    if (params.type === 'api') {
      const appName = body.name || 'Custom REST API Connector';
      const status = await SandboxConnector.testConnection(appName);

      const app = {
        _id: `app_${Date.now()}`,
        businessId,
        name: appName,
        type: 'custom_api' as const,
        connectionStatus: 'connected' as const,
        config: { baseUrl: body.baseUrl, authType: body.authType || 'Bearer' },
        lastSyncedAt: new Date().toISOString(),
      };
      db.saveApplication(app);

      db.addAuditLog({
        _id: `audit_${Date.now()}`,
        businessId,
        actorId: body.userId || 'user_tushar',
        actorName: body.userName || 'Tushar (Owner)',
        action: 'API_CONNECTOR_CONNECTED',
        entityId: app._id,
        entityType: 'integration',
        timestamp: new Date().toISOString(),
        details: { name: appName, baseUrl: body.baseUrl },
      });

      return NextResponse.json({
        success: true,
        integration: app,
        status,
        message: `API connector ${appName} connected and verified in sandbox environment.`,
      });
    }

    return NextResponse.json({ error: `Unsupported integration type: ${params.type}` }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
