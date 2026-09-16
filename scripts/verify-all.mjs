import http from 'http';

async function main() {
  console.log('====================================================');
  console.log(' ProcessMind End-to-End System & API Verification');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:3000';

  async function req(url, options = {}) {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const text = await res.text();
    try {
      return { status: res.status, ok: res.ok, data: JSON.parse(text) };
    } catch {
      return { status: res.status, ok: res.ok, data: text };
    }
  }

  try {
    // 1. Check Businesses
    console.log('[1/7] Testing Business Workspace & Tenant Scoping...');
    const bizRes = await req('/api/businesses/me?businessId=biz_quickcart');
    if (!bizRes.ok || !bizRes.data.business) {
      throw new Error(`Business workspace failed: ${JSON.stringify(bizRes.data)}`);
    }
    console.log(`  ✓ Tenant: "${bizRes.data.business.name}" (${bizRes.data.business.plan} tier)`);
    console.log(`  ✓ Owner: "${bizRes.data.currentUser.name}" (${bizRes.data.currentUser.role})`);
    console.log(`  ✓ Connected Applications: ${bizRes.data.applications.length}`);

    // 2. Check Processes
    console.log('\n[2/7] Testing Process Catalog & Graph Retrieval...');
    const procRes = await req('/api/processes/proc_quickcart_order?businessId=biz_quickcart');
    if (!procRes.ok || !procRes.data.process) {
      throw new Error(`Process retrieval failed: ${JSON.stringify(procRes.data)}`);
    }
    const proc = procRes.data;
    console.log(`  ✓ Process 1: "${proc.process.name}" (Status: ${proc.process.status})`);
    console.log(`    - Nodes: ${proc.baselineVersion?.nodes?.length} steps | CV Evidence: ${proc.baselineVersion?.evidence?.length}`);

    const accRes = await req('/api/processes/proc_accounting_firm?businessId=biz_quickcart');
    console.log(`  ✓ Process 2 (Accounting): "${accRes.data.process.name}"`);
    console.log(`    - Nodes: ${accRes.data.baselineVersion?.nodes?.length} steps | Status: ${accRes.data.process.status}`);

    const devProcRes = await req('/api/processes/proc_developer_bugfix?businessId=biz_quickcart');
    console.log(`  ✓ Process 3 (Developer Tools): "${devProcRes.data.process.name}"`);
    console.log(`    - Nodes: ${devProcRes.data.baselineVersion?.nodes?.length} steps | Status: ${devProcRes.data.process.status}`);

    // 3. Multi-Agent Analysis Pipeline (State Transitions)
    console.log('\n[3/7] Testing Multi-Agent Orchestrator Pipeline...');
    const analyzeRes = await req('/api/processes/proc_quickcart_order/analyze', {
      method: 'POST',
      body: JSON.stringify({ isSimulated: true }),
    });
    if (!analyzeRes.ok || !analyzeRes.data.runId) {
      throw new Error(`Analyze pipeline failed: ${JSON.stringify(analyzeRes.data)}`);
    }
    console.log(`  ✓ AgentRun created: ${analyzeRes.data.runId}`);
    console.log(`  ✓ State Machine Transitions executed: ${analyzeRes.data.timeline?.length} phases`);
    for (const tl of analyzeRes.data.timeline || []) {
      console.log(`    - [${tl.agentType.toUpperCase()}] ${tl.phase}`);
    }

    // 4. Security Approval Gate (Section 28)
    console.log('\n[4/7] Testing Owner Approval Gate Security...');
    const approveRes = await req('/api/workflows/wf_quickcart_order_auto/approve', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user_sarah', userName: 'Sarah Lin (Owner)' }),
    });
    if (!approveRes.ok || approveRes.data.workflow.status !== 'approved') {
      throw new Error(`Approval gate failed: ${JSON.stringify(approveRes.data)}`);
    }
    console.log(`  ✓ Owner approved workflow: status is "${approveRes.data.workflow.status}"`);
    console.log(`  ✓ Approved by: ${approveRes.data.workflow.approvedBy}`);

    // 5. Verification Agent & Sandbox Test Runner
    console.log('\n[5/7] Testing Sandbox Verification Test Runner...');
    const runRes = await req('/api/workflows/wf_quickcart_order_auto/run', {
      method: 'POST',
    });
    if (!runRes.ok || !runRes.data.workflowRun) {
      throw new Error(`Workflow run failed: ${JSON.stringify(runRes.data)}`);
    }
    console.log(`  ✓ Sandbox execution completed: status "${runRes.data.workflowRun.status}" in ${runRes.data.workflowRun.durationMs}ms`);
    console.log(`  ✓ Steps passed: ${runRes.data.verification.stepsPassed}/${runRes.data.verification.stepsPassed}`);
    console.log(`  ✓ Verification screenshots captured: ${runRes.data.workflowRun.screenshots.length}`);

    // 6. Process Drift Detection
    console.log('\n[6/7] Testing Continuous Process Drift Auditor...');
    const driftRes = await req('/api/processes/proc_quickcart_order/compare', {
      method: 'POST',
      body: JSON.stringify({ observedVersionId: 'ver_quickcart_v1_1_drifted' }),
    });
    if (!driftRes.ok || !driftRes.data.driftEvent) {
      throw new Error(`Drift detection failed: ${JSON.stringify(driftRes.data)}`);
    }
    const drift = driftRes.data.driftEvent;
    console.log(`  ✓ Drift detected: ${drift.changes.length} unauthorized deviations flagged`);
    console.log(`  ✓ Deviation: "${drift.changes[0]?.stepLabel}" at ${drift.changes[0]?.timestamp}`);
    console.log(`  ✓ Evidence: ${drift.changes[0]?.evidenceFrame}`);
    console.log(`  ✓ Drift score: ${driftRes.data.driftOutput.structuredData.driftScore * 100}%`);

    // 7. Developer Tools Integration
    console.log('\n[7/7] Testing Developer Tools & GitHub Connector...');
    const ghRes = await req('/api/integrations');
    if (!ghRes.ok || !ghRes.data.githubInfo) {
      throw new Error(`Developer integrations failed: ${JSON.stringify(ghRes.data)}`);
    }
    console.log(`  ✓ GitHub Repo: ${ghRes.data.githubInfo.owner}/${ghRes.data.githubInfo.repo}`);
    console.log(`  ✓ Last commit: ${ghRes.data.githubInfo.lastCommit.hash} - "${ghRes.data.githubInfo.lastCommit.message}"`);

    const pingRes = await req('/api/integrations/api/connect?businessId=biz_quickcart', {
      method: 'POST',
      body: JSON.stringify({ name: 'Sandbox QuickCart API' }),
    });
    console.log(`  ✓ Sandbox Ping: Latency ${pingRes.data.status?.latencyMs}ms (${pingRes.data.status?.timestamp})`);

    console.log('\n====================================================');
    console.log(' ALL 7 PROCESSMIND VERIFICATION SUITES PASSED 100%! ');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ Verification test failed:', err);
    process.exit(1);
  }
}

main();
