import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'demo');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createSvg(title, appName, headerBg, contentHtml, badge = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540" style="background:#0f172a; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <filter id="shadow" x="-2%" y="-2%" width="104%" height="104%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <rect width="960" height="540" fill="#0f172a"/>
  
  <g filter="url(#shadow)">
    <rect x="20" y="20" width="920" height="500" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <rect x="20" y="20" width="920" height="42" rx="10" fill="${headerBg}"/>
    <rect x="20" y="52" width="920" height="10" fill="${headerBg}"/>
    
    <circle cx="45" cy="41" r="6" fill="#ef4444"/>
    <circle cx="65" cy="41" r="6" fill="#f59e0b"/>
    <circle cx="85" cy="41" r="6" fill="#10b981"/>
    
    <text x="120" y="46" fill="#f8fafc" font-size="13" font-weight="600">${appName}</text>
    <text x="320" y="46" fill="#94a3b8" font-size="12">${title}</text>
    
    ${badge ? `
    <rect x="760" y="30" width="160" height="22" rx="4" fill="#059669"/>
    <text x="770" y="45" fill="#ffffff" font-size="10" font-weight="700">${badge}</text>
    ` : ''}

    <g transform="translate(20, 62)">
      ${contentHtml}
    </g>
  </g>
</svg>`;
}

const assets = [
  {
    name: 'acc_invoice_email.png',
    svgName: 'acc_invoice_email.svg',
    svg: createSvg(
      'Inbox: New Client Invoice Received',
      'Thunderbird / Gmail Client',
      '#1e3a5f',
      `
      <rect x="0" y="0" width="920" height="458" fill="#1e293b"/>
      <rect x="40" y="30" width="840" height="380" rx="8" fill="#0f172a" stroke="#334155"/>
      <text x="70" y="70" fill="#f8fafc" font-size="20" font-weight="700">Subject: Invoice #2026-881 from Apex Consulting LLC</text>
      <text x="70" y="95" fill="#94a3b8" font-size="12">From: billing@apexconsulting.com | Attached: invoice_apex_881.pdf ($3,450.00)</text>
      <rect x="70" y="120" width="780" height="240" rx="6" fill="#1e293b"/>
      <text x="90" y="160" fill="#e2e8f0" font-size="14">Dear Accounting Team,</text>
      <text x="90" y="190" fill="#cbd5e1" font-size="13">Please find attached our monthly retainer invoice #2026-881 for July 2026.</text>
      <text x="90" y="220" fill="#cbd5e1" font-size="13">Amount Due: $3,450.00 | Net 30 Terms.</text>
      <rect x="90" y="260" width="220" height="38" rx="6" fill="#0284c7"/>
      <text x="110" y="284" fill="#ffffff" font-size="12" font-weight="600">📥 View invoice_apex_881.pdf</text>
      `
    )
  },
  {
    name: 'dev_github_issue.png',
    svgName: 'dev_github_issue.svg',
    svg: createSvg(
      'Issue #402 · Stripe Webhook timeout on large cart checkout',
      'GitHub.com / quickcart/store-automations',
      '#1e293b',
      `
      <rect x="0" y="0" width="920" height="458" fill="#0f172a"/>
      <text x="40" y="45" fill="#f8fafc" font-size="20" font-weight="700">Stripe Webhook timeout on 10+ items cart #402</text>
      <rect x="40" y="65" width="80" height="24" rx="4" fill="#166534"/>
      <text x="52" y="81" fill="#4ade80" font-size="11" font-weight="700">Open</text>
      <text x="135" y="81" fill="#94a3b8" font-size="12">opened 2 hours ago by alex-chen · 4 comments</text>

      <rect x="40" y="105" width="840" height="280" rx="8" fill="#1e293b" stroke="#334155"/>
      <text x="65" y="140" fill="#e2e8f0" font-size="13" font-weight="600">Problem Description:</text>
      <text x="65" y="170" fill="#cbd5e1" font-size="12">When a customer checks out with more than 10 line items, QuickBooks Online API</text>
      <text x="65" y="195" fill="#cbd5e1" font-size="12">invoice creation takes > 4.8s, triggering a Stripe webhook retry loop.</text>
      <text x="65" y="230" fill="#fca5a5" font-size="12" font-family="monospace">Error: ETIMEDOUT POST https://quickbooks.api.intuit.com/v3/company/invoice</text>

      <rect x="65" y="270" width="220" height="36" rx="6" fill="#4f46e5"/>
      <text x="90" y="293" fill="#ffffff" font-size="12" font-weight="600">Open in VS Code Workspace</text>
      `
    )
  },
  {
    name: 'dev_vscode_editor.png',
    svgName: 'dev_vscode_editor.svg',
    svg: createSvg(
      'quickbooks-connector.ts — quickcart/store-automations',
      'Visual Studio Code',
      '#1e1e1e',
      `
      <rect x="0" y="0" width="920" height="458" fill="#181818"/>
      <rect x="0" y="0" width="180" height="458" fill="#252526"/>
      <text x="20" y="30" fill="#cccccc" font-size="11" font-weight="600">EXPLORER</text>
      <text x="20" y="60" fill="#38bdf8" font-size="12">📄 quickbooks-connector.ts</text>
      <text x="20" y="90" fill="#94a3b8" font-size="12">📄 stripe-handler.ts</text>
      <text x="20" y="120" fill="#94a3b8" font-size="12">📄 sheets-sync.ts</text>
      <text x="20" y="150" fill="#94a3b8" font-size="12">📄 order-runner.ts</text>

      <!-- Code editor -->
      <g transform="translate(190, 20)">
        <text x="20" y="30" fill="#6a9955" font-family="monospace" font-size="12">// Fix: Chunk line items and enable batch invoice creation</text>
        <text x="20" y="60" fill="#569cd6" font-family="monospace" font-size="12">export async function <tspan fill="#dcdcaa">createQuickBooksInvoice</tspan>(order) {</text>
        <text x="40" y="90" fill="#c586c0" font-family="monospace" font-size="12">  const <tspan fill="#9cdcfe">batches</tspan> = chunk(order.line_items, 10);</text>
        <text x="40" y="120" fill="#569cd6" font-family="monospace" font-size="12">  return await <tspan fill="#dcdcaa">intuitClient</tspan>.post('/invoice/batch', { batches });</text>
        <text x="20" y="150" fill="#569cd6" font-family="monospace" font-size="12">}</text>
      </g>
      `
    )
  },
  {
    name: 'dev_test_runner.png',
    svgName: 'dev_test_runner.svg',
    svg: createSvg(
      'Jest Test Suite: All 18 Test Suites Passed',
      'Terminal / npm test',
      '#0f172a',
      `
      <rect x="0" y="0" width="920" height="458" fill="#090d16"/>
      <text x="30" y="40" fill="#10b981" font-family="monospace" font-size="13">PASS tests/quickbooks-connector.spec.ts</text>
      <text x="50" y="70" fill="#34d399" font-family="monospace" font-size="12">✓ should batch line items without timeout (142 ms)</text>
      <text x="50" y="95" fill="#34d399" font-family="monospace" font-size="12">✓ should verify sales tax roundoff precision (18 ms)</text>
      <text x="30" y="130" fill="#10b981" font-family="monospace" font-size="13">PASS tests/stripe-webhook.spec.ts</text>
      <text x="50" y="160" fill="#34d399" font-family="monospace" font-size="12">✓ should acknowledge webhook in &lt; 200ms (45 ms)</text>
      <text x="30" y="210" fill="#f8fafc" font-family="monospace" font-size="13">Test Suites: 2 passed, 2 total</text>
      <text x="30" y="235" fill="#f8fafc" font-family="monospace" font-size="13">Tests:       18 passed, 18 total</text>
      <text x="30" y="260" fill="#f8fafc" font-family="monospace" font-size="13">Snapshots:   0 total</text>
      <text x="30" y="285" fill="#34d399" font-family="monospace" font-size="13">Time:        1.42s</text>
      `
    )
  },
  {
    name: 'dev_pull_request.png',
    svgName: 'dev_pull_request.svg',
    badge: 'CI CHECKS: PASSED',
    svg: createSvg(
      'Pull Request #403: fix(quickbooks): batch line items to eliminate webhook timeouts',
      'GitHub.com / Pull Requests',
      '#1e293b',
      `
      <rect x="0" y="0" width="920" height="458" fill="#0f172a"/>
      <text x="40" y="45" fill="#f8fafc" font-size="20" font-weight="700">fix(quickbooks): batch line items to eliminate webhook timeouts #403</text>
      <rect x="40" y="65" width="80" height="24" rx="4" fill="#166534"/>
      <text x="52" y="81" fill="#4ade80" font-size="11" font-weight="700">Open</text>
      <text x="135" y="81" fill="#94a3b8" font-size="12">sarah-lin wants to merge 1 commit into main from fix-qb-batch</text>

      <rect x="40" y="110" width="840" height="150" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
      <text x="65" y="145" fill="#34d399" font-size="14" font-weight="700">✓ All checks have passed (2 successful checks)</text>
      <text x="65" y="175" fill="#cbd5e1" font-size="12">✓ build-and-test / jest-node-20 (pull_request) — Successful in 42s</text>
      <text x="65" y="200" fill="#cbd5e1" font-size="12">✓ security / snyk-code-audit (pull_request) — No vulnerabilities</text>

      <rect x="40" y="280" width="180" height="38" rx="6" fill="#10b981"/>
      <text x="65" y="304" fill="#ffffff" font-size="13" font-weight="700">Merge Pull Request</text>
      `
    )
  }
];

for (const asset of assets) {
  fs.writeFileSync(path.join(outDir, asset.svgName), asset.svg, 'utf-8');
  fs.writeFileSync(path.join(outDir, asset.name), asset.svg, 'utf-8');
}

console.log('Successfully generated all additional demo assets!');
