export interface GitHubRepoDetails {
  owner: string;
  repo: string;
  branch: string;
  connected: boolean;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    date: string;
  };
  workflowDispatchAvailable: boolean;
}

export class GitHubIntegration {
  public static async getRepoDetails(repo = 'quickcart/ecommerce-automation-scripts'): Promise<GitHubRepoDetails> {
    return {
      owner: 'quickcart',
      repo: 'ecommerce-automation-scripts',
      branch: 'main',
      connected: true,
      lastCommit: {
        hash: '7e9b42a',
        message: 'feat: add QuickBooks invoice line item calculation hook',
        author: 'Tushar',
        date: '2026-08-25T11:42:00Z',
      },
      workflowDispatchAvailable: true,
    };
  }

  public static async triggerWorkflowDispatch(inputs: Record<string, any>) {
    return {
      status: 'queued',
      runId: `gh_run_${Math.floor(Math.random() * 1000000)}`,
      workflowName: 'order-fulfillment-pipeline.yml',
      dispatchedAt: new Date().toISOString(),
      inputs,
    };
  }
}

export class SandboxConnector {
  public static async testConnection(appType: string) {
    const latency = Math.floor(Math.random() * 80) + 20;
    return {
      connected: true,
      service: appType,
      latencyMs: latency,
      environment: 'sandbox',
      authenticated: true,
      timestamp: new Date().toISOString(),
    };
  }
}
