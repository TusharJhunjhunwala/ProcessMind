import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'demo');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createSvg(title, appName, headerBg, contentHtml, badge = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540" style="background:#0f172a; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <linearGradient id="windowGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <filter id="shadow" x="-2%" y="-2%" width="104%" height="104%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Desktop Backdrop -->
  <rect width="960" height="540" fill="#0f172a"/>
  
  <!-- App Window Container -->
  <g filter="url(#shadow)">
    <rect x="20" y="20" width="920" height="500" rx="10" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    
    <!-- Titlebar -->
    <rect x="20" y="20" width="920" height="42" rx="10" fill="${headerBg}"/>
    <rect x="20" y="52" width="920" height="10" fill="${headerBg}"/>
    
    <!-- Window controls -->
    <circle cx="45" cy="41" r="6" fill="#ef4444"/>
    <circle cx="65" cy="41" r="6" fill="#f59e0b"/>
    <circle cx="85" cy="41" r="6" fill="#10b981"/>
    
    <!-- App Badge & Window Title -->
    <text x="120" y="46" fill="#f8fafc" font-size="13" font-weight="600">${appName}</text>
    <text x="320" y="46" fill="#94a3b8" font-size="12">${title}</text>
    
    ${badge ? `
    <rect x="760" y="30" width="160" height="22" rx="4" fill="#dc2626"/>
    <text x="770" y="45" fill="#ffffff" font-size="10" font-weight="700">${badge}</text>
    ` : ''}

    <!-- Content Area -->
    <g transform="translate(20, 62)">
      ${contentHtml}
    </g>
  </g>
</svg>`;
}

const assets = [
  {
    name: 'order_inbox.png',
    svgName: 'order_inbox.svg',
    svg: createSvg(
      'Orders / Unfulfilled Queue',
      'Shopify Admin',
      '#1e3a5f',
      `
      <!-- Sidebar -->
      <rect x="0" y="0" width="180" height="458" fill="#0f172a"/>
      <text x="24" y="36" fill="#e2e8f0" font-size="14" font-weight="700">QuickCart Store</text>
      <text x="24" y="80" fill="#38bdf8" font-size="13" font-weight="600">● Orders (14)</text>
      <text x="24" y="115" fill="#94a3b8" font-size="13">Products</text>
      <text x="24" y="150" fill="#94a3b8" font-size="13">Customers</text>
      <text x="24" y="185" fill="#94a3b8" font-size="13">Analytics</text>
      <text x="24" y="220" fill="#94a3b8" font-size="13">Discounts</text>

      <!-- Main Area -->
      <rect x="180" y="0" width="740" height="458" fill="#1e293b"/>
      <text x="210" y="40" fill="#f8fafc" font-size="20" font-weight="700">Incoming Orders</text>
      
      <!-- Filter Bar -->
      <rect x="210" y="60" width="680" height="36" rx="6" fill="#334155"/>
      <text x="225" y="83" fill="#94a3b8" font-size="12">Filter: All · Unfulfilled (1) · Paid (1) · Ready for Invoicing</text>

      <!-- Table Header -->
      <rect x="210" y="110" width="680" height="32" fill="#0f172a" rx="4"/>
      <text x="230" y="131" fill="#94a3b8" font-size="11" font-weight="600">ORDER</text>
      <text x="320" y="131" fill="#94a3b8" font-size="11" font-weight="600">DATE</text>
      <text x="420" y="131" fill="#94a3b8" font-size="11" font-weight="600">CUSTOMER</text>
      <text x="560" y="131" fill="#94a3b8" font-size="11" font-weight="600">TOTAL</text>
      <text x="660" y="131" fill="#94a3b8" font-size="11" font-weight="600">PAYMENT</text>
      <text x="760" y="131" fill="#94a3b8" font-size="11" font-weight="600">FULFILLMENT</text>

      <!-- Target Row #9831 Highlighted -->
      <rect x="210" y="150" width="680" height="52" rx="6" fill="#1e40af" stroke="#60a5fa" stroke-width="2"/>
      <text x="230" y="181" fill="#ffffff" font-size="13" font-weight="700">#9831</text>
      <text x="320" y="181" fill="#e2e8f0" font-size="12">Today, 2:14 PM</text>
      <text x="420" y="181" fill="#ffffff" font-size="13" font-weight="600">David Kramer</text>
      <text x="560" y="181" fill="#34d399" font-size="13" font-weight="700">$142.50</text>
      <rect x="655" y="166" width="65" height="22" rx="4" fill="#065f46"/>
      <text x="672" y="181" fill="#34d399" font-size="11" font-weight="600">PAID</text>
      <rect x="755" y="166" width="105" height="22" rx="4" fill="#991b1b"/>
      <text x="767" y="181" fill="#fca5a5" font-size="11" font-weight="600">UNFULFILLED</text>

      <!-- Computer Vision Annotation Box -->
      <rect x="205" y="145" width="690" height="62" rx="8" fill="none" stroke="#e11d48" stroke-width="2" stroke-dasharray="6,4"/>
      <rect x="730" y="135" width="165" height="20" rx="4" fill="#e11d48"/>
      <text x="740" y="149" fill="#ffffff" font-size="10" font-weight="700">CV: TARGET_ORDER_CLICK</text>
      `
    )
  },
  {
    name: 'order_detail.png',
    svgName: 'order_detail.svg',
    svg: createSvg(
      'Order #9831 · Customer & Line Items',
      'Shopify Admin',
      '#1e3a5f',
      `
      <rect x="0" y="0" width="920" height="458" fill="#1e293b"/>
      <text x="40" y="45" fill="#f8fafc" font-size="22" font-weight="700">Order #9831</text>
      <text x="210" y="45" fill="#34d399" font-size="13" font-weight="600">● Paid via Stripe</text>

      <!-- Left Card: Items -->
      <rect x="40" y="70" width="540" height="260" rx="8" fill="#0f172a" stroke="#334155"/>
      <text x="65" y="105" fill="#f8fafc" font-size="15" font-weight="600">Line Items (2)</text>
      
      <rect x="65" y="125" width="490" height="50" rx="6" fill="#1e293b"/>
      <text x="85" y="155" fill="#ffffff" font-size="13">Wireless Studio Headphones Pro</text>
      <text x="410" y="155" fill="#94a3b8" font-size="12">Qty: 1</text>
      <text x="480" y="155" fill="#34d399" font-size="13" font-weight="600">$120.00</text>

      <rect x="65" y="185" width="490" height="50" rx="6" fill="#1e293b"/>
      <text x="85" y="215" fill="#ffffff" font-size="13">Velour Replacement Ear Cushions</text>
      <text x="410" y="215" fill="#94a3b8" font-size="12">Qty: 1</text>
      <text x="480" y="215" fill="#34d399" font-size="13" font-weight="600">$22.50</text>

      <text x="410" y="275" fill="#94a3b8" font-size="13">Total Amount:</text>
      <text x="500" y="275" fill="#38bdf8" font-size="16" font-weight="700">$142.50</text>

      <!-- Right Card: Customer -->
      <rect x="600" y="70" width="280" height="260" rx="8" fill="#0f172a" stroke="#334155"/>
      <text x="625" y="105" fill="#f8fafc" font-size="15" font-weight="600">Customer Details</text>
      <text x="625" y="140" fill="#ffffff" font-size="13" font-weight="600">David Kramer</text>
      <text x="625" y="165" fill="#38bdf8" font-size="12">david.kramer@techstudio.com</text>
      <text x="625" y="195" fill="#94a3b8" font-size="12">Shipping Address:</text>
      <text x="625" y="220" fill="#cbd5e1" font-size="12">742 Market St, Suite 400</text>
      <text x="625" y="240" fill="#cbd5e1" font-size="12">San Francisco, CA 94103</text>
      `
    )
  },
  {
    name: 'risk_assessment.png',
    svgName: 'risk_assessment.svg',
    svg: createSvg(
      'Fraud Analysis & Risk Evaluation',
      'Shopify Fraud Guard',
      '#1e3a5f',
      `
      <rect x="0" y="0" width="920" height="458" fill="#1e293b"/>
      <rect x="60" y="40" width="800" height="340" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      
      <text x="90" y="85" fill="#10b981" font-size="20" font-weight="700">✓ Risk Level: LOW</text>
      <text x="90" y="115" fill="#94a3b8" font-size="13">Recommendation: Automatically fulfill order. Verification indicators passed.</text>

      <rect x="90" y="140" width="740" height="40" rx="4" fill="#1e293b"/>
      <text x="110" y="165" fill="#e2e8f0" font-size="13">✓ Billing address matches credit card registered address</text>
      <text x="750" y="165" fill="#34d399" font-size="12" font-weight="600">PASS</text>

      <rect x="90" y="190" width="740" height="40" rx="4" fill="#1e293b"/>
      <text x="110" y="215" fill="#e2e8f0" font-size="13">✓ CVV and 3D Secure verified by issuing bank</text>
      <text x="750" y="215" fill="#34d399" font-size="12" font-weight="600">PASS</text>

      <rect x="90" y="240" width="740" height="40" rx="4" fill="#1e293b"/>
      <text x="110" y="265" fill="#e2e8f0" font-size="13">✓ IP geolocation is within 8 miles of shipping location</text>
      <text x="750" y="265" fill="#34d399" font-size="12" font-weight="600">PASS</text>
      `
    )
  },
  {
    name: 'stripe_payment.png',
    svgName: 'stripe_payment.svg',
    svg: createSvg(
      'PaymentIntent pi_3N92jkdlsw92 · Succeeded',
      'Stripe Dashboard',
      '#6366f1',
      `
      <rect x="0" y="0" width="920" height="458" fill="#0f172a"/>
      <rect x="50" y="30" width="820" height="380" rx="10" fill="#1e293b" stroke="#4f46e5" stroke-width="1.5"/>

      <text x="80" y="75" fill="#94a3b8" font-size="13">PAYMENT INTENT</text>
      <text x="80" y="105" fill="#f8fafc" font-size="24" font-weight="700">$142.50 USD</text>
      <rect x="250" y="85" width="90" height="24" rx="4" fill="#065f46"/>
      <text x="265" y="102" fill="#34d399" font-size="12" font-weight="700">SUCCEEDED</text>

      <!-- Details grid -->
      <text x="80" y="160" fill="#94a3b8" font-size="12">Payment Method</text>
      <text x="80" y="185" fill="#ffffff" font-size="14" font-weight="600">Visa ending in 4242</text>

      <text x="320" y="160" fill="#94a3b8" font-size="12">Customer</text>
      <text x="320" y="185" fill="#38bdf8" font-size="14" font-weight="600">david.kramer@techstudio.com</text>

      <text x="580" y="160" fill="#94a3b8" font-size="12">Stripe Fee / Net</text>
      <text x="580" y="185" fill="#ffffff" font-size="14" font-weight="600">Fee: $4.43 · Net: $138.07</text>

      <!-- API Box Annotation -->
      <rect x="80" y="240" width="760" height="120" rx="6" fill="#0f172a" stroke="#334155"/>
      <text x="100" y="270" fill="#a5b4fc" font-size="12" font-weight="600">ProcessMind Software Agent Note:</text>
      <text x="100" y="295" fill="#94a3b8" font-size="12">Direct REST Endpoint available: GET https://api.stripe.com/v1/payment_intents/:id</text>
      <text x="100" y="320" fill="#34d399" font-size="12">Webhook subscription active: payment_intent.succeeded (Confidence 0.99)</text>
      `
    )
  },
  {
    name: 'quickbooks_invoice.png',
    svgName: 'quickbooks_invoice.svg',
    svg: createSvg(
      'Invoice #INV-2026-1049 · Draft & Tax Applied',
      'QuickBooks Online',
      '#059669',
      `
      <rect x="0" y="0" width="920" height="458" fill="#1e293b"/>
      <rect x="40" y="30" width="840" height="380" rx="8" fill="#0f172a" stroke="#334155"/>

      <text x="70" y="70" fill="#f8fafc" font-size="20" font-weight="700">QuickBooks Online — Create Invoice</text>
      
      <!-- Form fields -->
      <rect x="70" y="95" width="230" height="45" rx="4" fill="#1e293b" stroke="#475569"/>
      <text x="85" y="112" fill="#94a3b8" font-size="10">CUSTOMER</text>
      <text x="85" y="132" fill="#ffffff" font-size="12" font-weight="600">David Kramer (QC-441)</text>

      <rect x="330" y="95" width="230" height="45" rx="4" fill="#1e293b" stroke="#475569"/>
      <text x="345" y="112" fill="#94a3b8" font-size="10">INVOICE DATE</text>
      <text x="345" y="132" fill="#ffffff" font-size="12">2026-08-10</text>

      <rect x="590" y="95" width="230" height="45" rx="4" fill="#1e293b" stroke="#475569"/>
      <text x="605" y="112" fill="#94a3b8" font-size="10">INVOICE NO.</text>
      <text x="605" y="132" fill="#38bdf8" font-size="12" font-weight="600">INV-2026-1049</text>

      <!-- Table -->
      <rect x="70" y="160" width="750" height="130" rx="4" fill="#1e293b"/>
      <text x="90" y="190" fill="#e2e8f0" font-size="12">1. Wireless Studio Headphones Pro — $120.00</text>
      <text x="90" y="220" fill="#e2e8f0" font-size="12">2. Replacement Ear Cushions — $22.50</text>
      <line x1="70" y1="240" x2="820" y2="240" stroke="#334155" stroke-width="1"/>
      <text x="620" y="270" fill="#94a3b8" font-size="13">Total Due: </text>
      <text x="710" y="270" fill="#34d399" font-size="18" font-weight="700">$142.50</text>

      <!-- Save Button -->
      <rect x="710" y="320" width="110" height="38" rx="6" fill="#10b981"/>
      <text x="735" y="344" fill="#ffffff" font-size="13" font-weight="700">Save PDF</text>
      `
    )
  },
  {
    name: 'google_sheet.png',
    svgName: 'google_sheet.svg',
    svg: createSvg(
      'Order Fulfillment Tracker 2026',
      'Google Sheets',
      '#047857',
      `
      <rect x="0" y="0" width="920" height="458" fill="#1e293b"/>
      
      <!-- Sheets Grid -->
      <rect x="20" y="20" width="880" height="38" fill="#0f172a"/>
      <text x="40" y="45" fill="#38bdf8" font-size="13" font-weight="700">Sheet1: Daily Orders Tracking</text>

      <!-- Column headers -->
      <rect x="20" y="60" width="880" height="30" fill="#334155"/>
      <text x="40" y="80" fill="#f1f5f9" font-size="11" font-weight="600">A: DATE</text>
      <text x="160" y="80" fill="#f1f5f9" font-size="11" font-weight="600">B: ORDER #</text>
      <text x="280" y="80" fill="#f1f5f9" font-size="11" font-weight="600">C: CUSTOMER</text>
      <text x="440" y="80" fill="#f1f5f9" font-size="11" font-weight="600">D: AMOUNT</text>
      <text x="560" y="80" fill="#f1f5f9" font-size="11" font-weight="600">E: STATUS</text>
      <text x="700" y="80" fill="#f1f5f9" font-size="11" font-weight="600">F: TRACKING ID</text>

      <!-- Appended row -->
      <rect x="20" y="95" width="880" height="40" fill="#1e3a5f" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="40" y="120" fill="#ffffff" font-size="12">2026-08-10</text>
      <text x="160" y="120" fill="#38bdf8" font-size="12" font-weight="600">#9831</text>
      <text x="280" y="120" fill="#ffffff" font-size="12">David Kramer</text>
      <text x="440" y="120" fill="#34d399" font-size="12" font-weight="600">$142.50</text>
      <text x="560" y="120" fill="#34d399" font-size="12">COMPLETED</text>
      <text x="700" y="120" fill="#cbd5e1" font-size="12">QC-TRK-8921</text>
      `
    )
  },
  {
    name: 'email_confirm.png',
    svgName: 'email_confirm.svg',
    svg: createSvg(
      'Dispatch Notification Sent · Order #9831',
      'SendGrid Dispatcher',
      '#0284c7',
      `
      <rect x="0" y="0" width="920" height="458" fill="#1e293b"/>
      <rect x="80" y="30" width="760" height="380" rx="8" fill="#ffffff"/>

      <rect x="80" y="30" width="760" height="60" rx="8" fill="#0f172a"/>
      <text x="110" y="68" fill="#ffffff" font-size="18" font-weight="700">QuickCart Store — Order Confirmed</text>

      <text x="110" y="130" fill="#1e293b" font-size="16" font-weight="600">Hi David,</text>
      <text x="110" y="160" fill="#475569" font-size="13">Thank you for your order #9831! We have received your payment of $142.50.</text>
      <text x="110" y="190" fill="#475569" font-size="13">Your invoice INV-2026-1049 is attached. Tracking number: QC-TRK-8921.</text>

      <rect x="110" y="230" width="220" height="40" rx="6" fill="#4f46e5"/>
      <text x="145" y="255" fill="#ffffff" font-size="13" font-weight="600">Track Your Package</text>
      `
    )
  },
  {
    name: 'excel_drift.png',
    svgName: 'excel_drift.svg',
    badge: 'DRIFT DETECTED: UNAUTHORIZED STEP',
    svg: createSvg(
      'DiscountCodes_2026.xlsx [Local Workbook]',
      'Microsoft Excel 365',
      '#15803d',
      `
      <rect x="0" y="0" width="920" height="458" fill="#1e293b"/>
      
      <!-- Warning Banner -->
      <rect x="20" y="10" width="880" height="45" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
      <text x="40" y="38" fill="#fee2e2" font-size="13" font-weight="700">⚠️ ProcessMind Drift Alert: New manual step discovered between Payment & Invoice (00:31)</text>

      <!-- Excel grid -->
      <rect x="20" y="70" width="880" height="340" fill="#0f172a" rx="6"/>
      
      <!-- Column headers -->
      <rect x="20" y="70" width="880" height="30" fill="#334155"/>
      <text x="40" y="90" fill="#ffffff" font-size="11" font-weight="700">A: CODE</text>
      <text x="180" y="90" fill="#ffffff" font-size="11" font-weight="700">B: DISCOUNT</text>
      <text x="320" y="90" fill="#ffffff" font-size="11" font-weight="700">C: APPROVER</text>
      <text x="480" y="90" fill="#ffffff" font-size="11" font-weight="700">D: STATUS</text>
      <text x="620" y="90" fill="#ffffff" font-size="11" font-weight="700">E: AUDIT NOTE</text>

      <!-- Row with cursor box -->
      <rect x="20" y="105" width="880" height="38" fill="#1e293b"/>
      <text x="40" y="130" fill="#f8fafc" font-size="12">SUMMER15</text>
      <text x="180" y="130" fill="#34d399" font-size="12">15%</text>
      <text x="320" y="130" fill="#cbd5e1" font-size="12">Sarah Lin</text>
      <text x="480" y="130" fill="#38bdf8" font-size="12">ACTIVE</text>
      <text x="620" y="130" fill="#94a3b8" font-size="12">Checked manually by employee Alex</text>

      <!-- Computer Vision detection overlay -->
      <rect x="30" y="100" width="860" height="50" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="8,4"/>
      <rect x="660" y="85" width="220" height="22" rx="4" fill="#ef4444"/>
      <text x="670" y="100" fill="#ffffff" font-size="11" font-weight="700">DRIFT AGENT: NEW STEP DETECTED</text>
      `,
      'UNAPPROVED WORKFLOW STEP'
    )
  }
];

for (const asset of assets) {
  // Write the SVG file
  fs.writeFileSync(path.join(outDir, asset.svgName), asset.svg, 'utf-8');
  // Also write as png extension (SVG content serves fine directly or in img tags with unoptimized)
  fs.writeFileSync(path.join(outDir, asset.name), asset.svg, 'utf-8');
}

console.log('Successfully generated all demo screenshot assets in public/demo/');
