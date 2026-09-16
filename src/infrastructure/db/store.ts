import fs from 'fs';
import path from 'path';
import {
  Business,
  User,
  Application,
  Process,
  ProcessVersion,
  Workflow,
  AgentRun,
  WorkflowRun,
  DriftEvent,
  AuditLog,
} from '@/packages/shared/types';

interface DatabaseSchema {
  businesses: Business[];
  users: User[];
  applications: Application[];
  processes: Process[];
  processVersions: ProcessVersion[];
  workflows: Workflow[];
  agentRuns: AgentRun[];
  workflowRuns: WorkflowRun[];
  driftEvents: DriftEvent[];
  auditLogs: AuditLog[];
}

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export function getInitialSeedData(): DatabaseSchema {
  const businessId = 'biz_quickcart';
  const ownerId = 'user_sarah';

  const defaultBusiness: Business = {
    _id: businessId,
    name: 'QuickCart Online Store',
    ownerId: ownerId,
    plan: 'business',
    createdAt: new Date('2026-08-01T10:00:00Z').toISOString(),
  };

  const defaultUsers: User[] = [
    {
      _id: ownerId,
      businessId,
      name: 'Sarah Lin',
      email: 'sarah@quickcart.demo',
      role: 'owner',
    },
    {
      _id: 'user_alex',
      businessId,
      name: 'Alex Chen',
      email: 'alex@quickcart.demo',
      role: 'member',
    },
  ];

  const defaultApplications: Application[] = [
    {
      _id: 'app_shopify',
      businessId,
      name: 'Shopify Store',
      type: 'ecommerce',
      connectionStatus: 'connected',
      config: { storeUrl: 'quickcart-demo.myshopify.com', apiVersion: '2026-04' },
      lastSyncedAt: new Date().toISOString(),
    },
    {
      _id: 'app_stripe',
      businessId,
      name: 'Stripe Payments',
      type: 'custom_api',
      connectionStatus: 'connected',
      config: { liveMode: false, webhooksActive: true },
      lastSyncedAt: new Date().toISOString(),
    },
    {
      _id: 'app_quickbooks',
      businessId,
      name: 'QuickBooks Online',
      type: 'accounting',
      connectionStatus: 'connected',
      config: { companyId: 'QC-98421' },
      lastSyncedAt: new Date().toISOString(),
    },
    {
      _id: 'app_sheets',
      businessId,
      name: 'Google Sheets (Orders DB)',
      type: 'spreadsheet',
      connectionStatus: 'connected',
      config: { sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' },
      lastSyncedAt: new Date().toISOString(),
    },
    {
      _id: 'app_sendgrid',
      businessId,
      name: 'SendGrid Email API',
      type: 'email',
      connectionStatus: 'connected',
      config: { fromAddress: 'orders@quickcart.demo' },
      lastSyncedAt: new Date().toISOString(),
    },
    {
      _id: 'app_github',
      businessId,
      name: 'GitHub Webhook Connector',
      type: 'developer',
      connectionStatus: 'connected',
      config: { repo: 'quickcart/ecommerce-automation-scripts', branch: 'main' },
      lastSyncedAt: new Date().toISOString(),
    },
  ];

  const processId = 'proc_quickcart_order';
  const baselineVersionId = 'ver_quickcart_v1_0';
  const driftVersionId = 'ver_quickcart_v1_1_drifted';

  const baselineVersion: ProcessVersion = {
    _id: baselineVersionId,
    processId,
    version: 'v1.0 (Baseline)',
    isBaseline: true,
    createdAt: new Date('2026-08-10T14:30:00Z').toISOString(),
    nodes: [
      {
        id: 'node_1',
        label: 'New Order Notification',
        application: 'Shopify Store',
        action: 'Review incoming customer order notification in dashboard inbox',
        timestamp: '00:04',
        timestampSec: 4,
        screenshot: '/demo/order_inbox.png',
        confidence: 0.98,
        automationMethod: 'api',
        apiEndpoint: 'POST /api/webhooks/shopify/orders/create',
        suggestedTools: ['Shopify Webhooks', 'REST Admin API'],
        parameters: { event: 'orders/create', payloadId: 'order_9831' },
        notes: 'Can be replaced 100% with direct Shopify webhook subscription',
      },
      {
        id: 'node_2',
        label: 'Open Store Dashboard',
        application: 'Shopify Store',
        action: 'Navigate to Orders view and open pending Order #9831',
        timestamp: '00:11',
        timestampSec: 11,
        screenshot: '/demo/order_detail.png',
        confidence: 0.96,
        automationMethod: 'api',
        apiEndpoint: 'GET /admin/api/2026-04/orders/9831.json',
        suggestedTools: ['Shopify SDK'],
        parameters: { orderId: '9831' },
        notes: 'API provides line items, customer name, shipping address immediately',
      },
      {
        id: 'node_3',
        label: 'Check Customer Details & Risk',
        application: 'Shopify Store',
        action: 'Inspect customer fraud risk score and address validation flags',
        timestamp: '00:19',
        timestampSec: 19,
        screenshot: '/demo/risk_assessment.png',
        confidence: 0.94,
        automationMethod: 'api',
        apiEndpoint: 'GET /admin/api/2026-04/orders/9831/risks.json',
        suggestedTools: ['Shopify Fraud Analysis API'],
        parameters: { threshold: 'low' },
        notes: 'Rule: If risk recommendation is "accept", proceed automatically; if "investigate", route to human',
      },
      {
        id: 'node_4',
        label: 'Check Payment Status',
        application: 'Stripe Payments',
        action: 'Verify transaction capture ID and 3D Secure verification status',
        timestamp: '00:26',
        timestampSec: 26,
        screenshot: '/demo/stripe_payment.png',
        confidence: 0.99,
        automationMethod: 'api',
        apiEndpoint: 'GET /v1/payment_intents/pi_3N92jkdlsw92',
        suggestedTools: ['Stripe Node SDK'],
        parameters: { status: 'succeeded' },
        notes: 'Payment confirmed via payment_intent.succeeded event',
      },
      {
        id: 'node_5',
        label: 'Create Invoice in QuickBooks',
        application: 'QuickBooks Online',
        action: 'Enter item SKU, price, sales tax breakdown and generate invoice PDF',
        timestamp: '00:37',
        timestampSec: 37,
        screenshot: '/demo/quickbooks_invoice.png',
        confidence: 0.95,
        automationMethod: 'api',
        apiEndpoint: 'POST /v3/company/QC-98421/invoice',
        suggestedTools: ['Intuit QuickBooks API'],
        parameters: { customerRef: 'QC-Cust-441', autoSend: 'false' },
        notes: 'Replaces 4 minutes of manual bookkeeping data entry per order',
      },
      {
        id: 'node_6',
        label: 'Update Master Order Sheet',
        application: 'Google Sheets',
        action: 'Append order row to Logistics Tracking spreadsheet',
        timestamp: '00:48',
        timestampSec: 48,
        screenshot: '/demo/google_sheet.png',
        confidence: 0.97,
        automationMethod: 'api',
        apiEndpoint: 'POST https://sheets.googleapis.com/v4/spreadsheets/1Bxi.../values:append',
        suggestedTools: ['Google Sheets API v4'],
        parameters: { range: 'Orders!A:H', valueInputOption: 'USER_ENTERED' },
        notes: 'Appends [Date, Order#, Customer, Amount, Status, TrackingID]',
      },
      {
        id: 'node_7',
        label: 'Send Confirmation Email',
        application: 'SendGrid Email API',
        action: 'Trigger transactional email with PDF invoice attachment and tracking link',
        timestamp: '00:55',
        timestampSec: 55,
        screenshot: '/demo/email_confirm.png',
        confidence: 0.98,
        automationMethod: 'api',
        apiEndpoint: 'POST /v3/mail/send',
        suggestedTools: ['SendGrid Mailer', 'Postmark'],
        parameters: { template_id: 'd-98427189a0' },
        notes: 'Includes order summary and delivery window details',
      },
    ],
    edges: [
      { id: 'e1_2', source: 'node_1', target: 'node_2', label: 'Order ID' },
      { id: 'e2_3', source: 'node_2', target: 'node_3', label: 'Customer ID' },
      { id: 'e3_4', source: 'node_3', target: 'node_4', label: 'Payment Intent' },
      { id: 'e4_5', source: 'node_4', target: 'node_5', label: 'Line Items' },
      { id: 'e5_6', source: 'node_5', target: 'node_6', label: 'Invoice Num' },
      { id: 'e6_7', source: 'node_6', target: 'node_7', label: 'Tracking & Mail' },
    ],
    evidence: [
      {
        id: 'ev_1',
        frameId: 'frame_04',
        timestamp: '00:04',
        screenshotUrl: '/demo/order_inbox.png',
        detectedElements: [
          { label: 'Shopify Admin Sidebar', box: [0, 0, 100, 20], confidence: 0.99 },
          { label: 'Unfulfilled Order #9831 Row', box: [22, 22, 34, 98], confidence: 0.97 },
        ],
        activeWindow: 'Google Chrome - Shopify Admin - Orders',
        ocrText: ['Orders', 'Unfulfilled', '#9831', 'David K.', '$142.50', 'Paid'],
      },
      {
        id: 'ev_2',
        frameId: 'frame_11',
        timestamp: '00:11',
        screenshotUrl: '/demo/order_detail.png',
        detectedElements: [
          { label: 'Order Summary Card', box: [15, 20, 70, 75], confidence: 0.98 },
          { label: 'Customer Contact Info', box: [15, 78, 45, 98], confidence: 0.96 },
        ],
        activeWindow: 'Google Chrome - Shopify Admin - Order #9831',
        ocrText: ['Order #9831', 'Items: 2', 'Wireless Headphones Pro x1', 'Replacement Ear Cushions x1'],
      },
      {
        id: 'ev_4',
        frameId: 'frame_26',
        timestamp: '00:26',
        screenshotUrl: '/demo/stripe_payment.png',
        detectedElements: [
          { label: 'Stripe Payment Intent Card', box: [20, 25, 65, 85], confidence: 0.99 },
        ],
        activeWindow: 'Google Chrome - Stripe Dashboard',
        ocrText: ['Payment Intent: pi_3N92jkdlsw92', 'Amount: $142.50', 'Status: Succeeded', 'Risk: Normal'],
      },
      {
        id: 'ev_5',
        frameId: 'frame_37',
        timestamp: '00:37',
        screenshotUrl: '/demo/quickbooks_invoice.png',
        detectedElements: [
          { label: 'QuickBooks Invoice Form', box: [10, 15, 90, 85], confidence: 0.97 },
        ],
        activeWindow: 'Google Chrome - QuickBooks Online - Invoicing',
        ocrText: ['Invoice #INV-2026-1049', 'Subtotal: $130.00', 'Tax: $12.50', 'Total: $142.50'],
      },
    ],
  };

  // Section 17 & 24: Process Drift Example
  // "Original: Order -> Payment -> Invoice -> Email. Two weeks later employees start doing: Order -> Payment -> Excel Check -> Invoice -> Email"
  const driftVersion: ProcessVersion = {
    _id: driftVersionId,
    processId,
    version: 'v1.1 (Observed Drift)',
    isBaseline: false,
    createdAt: new Date('2026-08-28T16:15:00Z').toISOString(),
    nodes: [
      baselineVersion.nodes[0],
      baselineVersion.nodes[1],
      baselineVersion.nodes[2],
      baselineVersion.nodes[3],
      {
        id: 'node_drift_excel',
        label: 'Excel Secondary Audit Check (UNAUTHORIZED STEP)',
        application: 'Microsoft Excel / Desktop Sheet',
        action: 'Manual cross-referencing against internal discount approval spreadsheet before invoice generation',
        timestamp: '00:31',
        timestampSec: 31,
        screenshot: '/demo/excel_drift.png',
        confidence: 0.96,
        automationMethod: 'human_review',
        suggestedTools: ['Excel Spreadsheet Reader'],
        notes: 'Employee manually opened Excel to verify a promotional discount code. Adds 2m 40s manual latency.',
      },
      baselineVersion.nodes[4],
      baselineVersion.nodes[5],
      baselineVersion.nodes[6],
    ],
    edges: [
      { id: 'ed_1', source: 'node_1', target: 'node_2' },
      { id: 'ed_2', source: 'node_2', target: 'node_3' },
      { id: 'ed_3', source: 'node_3', target: 'node_4' },
      { id: 'ed_drift_in', source: 'node_4', target: 'node_drift_excel', label: 'Drift Insert' },
      { id: 'ed_drift_out', source: 'node_drift_excel', target: 'node_5', label: 'Manual Verification' },
      { id: 'ed_5', source: 'node_5', target: 'node_6' },
      { id: 'ed_6', source: 'node_6', target: 'node_7' },
    ],
    evidence: [
      ...baselineVersion.evidence,
      {
        id: 'ev_drift_14',
        frameId: 'frame_14',
        timestamp: '00:31',
        screenshotUrl: '/demo/excel_drift.png',
        detectedElements: [
          { label: 'Microsoft Excel - DiscountCodes_2026.xlsx', box: [5, 5, 95, 95], confidence: 0.98 },
          { label: 'Row 42: "SUMMER15 - 15% Off VIP"', box: [40, 10, 50, 80], confidence: 0.95 },
        ],
        activeWindow: 'Microsoft Excel - DiscountCodes_2026.xlsx',
        ocrText: ['DiscountCodes_2026.xlsx', 'Code', 'Discount', 'Approved By', 'SUMMER15', '15%', 'Manager'],
      },
    ],
  };

  const defaultProcess: Process = {
    _id: processId,
    businessId,
    name: 'Order Processing & Fulfillment',
    description: 'Autonomous multi-app pipeline: Shopify order ingestion, Stripe payment confirmation, QuickBooks invoicing, Google Sheets ledger update, and customer email notification.',
    status: 'drift_detected',
    baselineVersionId,
    currentVersionId: driftVersionId,
    recordingUrl: '/demo/quickcart_order_flow.mp4',
    recordingDurationSec: 58,
    sampleVideoType: 'quickcart_orders',
    createdAt: new Date('2026-08-10T14:00:00Z').toISOString(),
    updatedAt: new Date('2026-08-28T16:20:00Z').toISOString(),
  };

  const defaultWorkflow: Workflow = {
    _id: 'wf_quickcart_order_auto',
    businessId,
    processId,
    processVersionId: baselineVersionId,
    name: 'QuickCart Auto-Fulfillment Flow v1.0',
    status: 'approved',
    approvedBy: ownerId,
    approvedAt: new Date('2026-08-11T09:15:00Z').toISOString(),
    steps: [
      {
        id: 'wf_step_1',
        name: 'Ingest Webhook',
        type: 'api_call',
        target: 'Shopify Store',
        action: 'POST /api/webhooks/shopify/orders/create',
        method: 'api',
      },
      {
        id: 'wf_step_2',
        name: 'Validate Fraud & Risk Score',
        type: 'api_call',
        target: 'Shopify Store',
        action: 'GET /admin/api/orders/{id}/risks.json',
        method: 'api',
      },
      {
        id: 'wf_step_3',
        name: 'Verify Stripe Charge',
        type: 'api_call',
        target: 'Stripe Payments',
        action: 'GET /v1/payment_intents/{id}',
        method: 'api',
      },
      {
        id: 'wf_step_4',
        name: 'Generate QuickBooks Invoice',
        type: 'api_call',
        target: 'QuickBooks Online',
        action: 'POST /v3/company/invoice',
        method: 'api',
      },
      {
        id: 'wf_step_5',
        name: 'Append Google Sheet Row',
        type: 'api_call',
        target: 'Google Sheets',
        action: 'POST /v4/spreadsheets/{id}/values:append',
        method: 'api',
      },
      {
        id: 'wf_step_6',
        name: 'Send Customer Confirmation Email',
        type: 'api_call',
        target: 'SendGrid Email API',
        action: 'POST /v3/mail/send',
        method: 'api',
      },
    ],
    codeScript: `/**
 * QuickCart Automated Order Processing Runner
 * Generated by ProcessMind Automation Agent
 * Verified in Sandbox by ProcessMind Verification Agent
 */
import { shopify, stripe, quickbooks, sheets, sendgrid } from '@processmind/connectors';

export async function processQuickCartOrder(event: { orderId: string; paymentIntentId: string }) {
  console.log('[ProcessMind] Starting order fulfillment pipeline for Order #' + event.orderId);
  
  // 1. Fetch Order details from Shopify API
  const order = await shopify.getOrder(event.orderId);
  console.log('[Shopify API] Order retrieved:', order.id, 'Customer:', order.customer.email);
  
  // 2. Risk check
  const risks = await shopify.getOrderRisks(event.orderId);
  if (risks.recommendation === 'cancel') {
    throw new Error('High risk order flagged by Shopify');
  }
  
  // 3. Confirm Stripe charge
  const payment = await stripe.paymentIntents.retrieve(event.paymentIntentId);
  if (payment.status !== 'succeeded') {
    throw new Error('Payment capture unverified: ' + payment.status);
  }
  
  // 4. QuickBooks Invoice
  const invoice = await quickbooks.createInvoice({
    customer: order.customer.name,
    items: order.line_items,
    total: payment.amount_received / 100
  });
  console.log('[QuickBooks API] Invoice generated:', invoice.docNumber);
  
  // 5. Append to Google Sheets ledger
  await sheets.appendRow({
    spreadsheetId: process.env.ORDERS_SHEET_ID,
    row: [new Date().toISOString(), order.id, order.customer.name, invoice.total, 'COMPLETED']
  });
  
  // 6. SendGrid notification
  await sendgrid.send({
    to: order.customer.email,
    template: 'order-confirmed',
    data: { orderId: order.id, invoiceUrl: invoice.pdfUrl }
  });
  
  return { success: true, orderId: order.id, invoiceId: invoice.id };
}`,
    createdAt: new Date('2026-08-11T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-08-11T09:15:00Z').toISOString(),
  };

  const defaultDriftEvent: DriftEvent = {
    _id: 'drift_event_981',
    processId,
    businessId,
    baselineVersionId,
    observedVersionId: driftVersionId,
    recordingUrl: '/demo/quickcart_order_flow_drift.mp4',
    status: 'review_required',
    changes: [
      {
        id: 'dc_1',
        type: 'added_step',
        stepLabel: 'Excel Secondary Audit Check',
        position: 'Between Payment Check (00:26) and Create Invoice (00:37)',
        evidenceFrame: '/demo/excel_drift.png',
        timestamp: '00:31',
        description: 'New employee screen recording showed manual inspection of "DiscountCodes_2026.xlsx" before triggering QuickBooks invoice. This step is not in the approved baseline v1.0.',
        impact: 'medium',
      },
    ],
    createdAt: new Date('2026-08-28T16:20:00Z').toISOString(),
  };

  const defaultAgentRun: AgentRun = {
    _id: 'run_analysis_init',
    businessId,
    processId,
    agentType: 'orchestrator',
    status: 'completed',
    output: {
      stepsFound: 7,
      apiFeasibility: '94%',
      browserRequiredSteps: 0,
      humanReviewRequiredSteps: 0,
    },
    timeline: [
      {
        id: 'tl_1',
        agentType: 'vision',
        phase: 'PREPROCESSING & KEYFRAME EXTRACTION',
        message: 'Preprocessed 58-second video. Sampled 42 high-entropy keyframes. Detected 5 distinct application windows.',
        timestamp: '2026-08-10T14:30:05Z',
        level: 'info',
      },
      {
        id: 'tl_2',
        agentType: 'vision',
        phase: 'UI BOUNDING BOX & ELEMENT RECOGNITION',
        message: 'Identified Shopify Admin table, Stripe dashboard payment status, QuickBooks invoice inputs, and Google Sheets rows.',
        timestamp: '2026-08-10T14:30:12Z',
        level: 'success',
      },
      {
        id: 'tl_3',
        agentType: 'process_analyst',
        phase: 'SEMANTIC GRAPH EXTRACTION',
        message: 'Synthesized 42 raw UI interactions into 7 clean business process nodes with dependency edges and data propagation paths.',
        timestamp: '2026-08-10T14:30:18Z',
        level: 'info',
      },
      {
        id: 'tl_4',
        agentType: 'software',
        phase: 'DEVELOPER TOOLS CONTEXT MAPPING',
        message: 'Mapped 6 of 7 steps to direct REST APIs (Shopify Admin API, Stripe REST, QuickBooks Intuit v3, Google Sheets v4, SendGrid v3). Zero browser scraping required.',
        timestamp: '2026-08-10T14:30:24Z',
        level: 'success',
      },
      {
        id: 'tl_5',
        agentType: 'automation',
        phase: 'WORKFLOW SCRIPT SYNTHESIS',
        message: 'Generated complete TypeScript orchestration script and execution plan with retry policies and audit logging.',
        timestamp: '2026-08-10T14:30:30Z',
        level: 'success',
      },
      {
        id: 'tl_6',
        agentType: 'verification',
        phase: 'SANDBOX VERIFICATION EXECUTION',
        message: 'Executed end-to-end sandbox mock order #9831. Verified 6/6 step outputs. Execution duration: 1.28s. Zero errors.',
        timestamp: '2026-08-10T14:30:36Z',
        level: 'success',
      },
    ],
    createdAt: new Date('2026-08-10T14:30:00Z').toISOString(),
    updatedAt: new Date('2026-08-10T14:30:36Z').toISOString(),
  };

  const defaultWorkflowRun: WorkflowRun = {
    _id: 'wfr_sandbox_test_1',
    workflowId: 'wf_quickcart_order_auto',
    businessId,
    processId,
    status: 'success',
    durationMs: 1280,
    logs: [
      { timestamp: '14:31:01.100', stepId: 'wf_step_1', message: 'Received simulated Shopify Webhook payload for order #9831', level: 'info' },
      { timestamp: '14:31:01.320', stepId: 'wf_step_2', message: 'Shopify Risk check: Score 0.02 (Low). Passed validation rule.', level: 'success' },
      { timestamp: '14:31:01.550', stepId: 'wf_step_3', message: 'Stripe API call: Verified charge of $142.50 captured successfully', level: 'success' },
      { timestamp: '14:31:01.890', stepId: 'wf_step_4', message: 'QuickBooks API call: Generated Invoice #INV-2026-1049 ($142.50)', level: 'success' },
      { timestamp: '14:31:02.110', stepId: 'wf_step_5', message: 'Google Sheets API call: Appended row to Orders Tracking tab', level: 'success' },
      { timestamp: '14:31:02.380', stepId: 'wf_step_6', message: 'SendGrid API call: Sent confirmation dispatch email to david@kramer.io', level: 'success' },
    ],
    screenshots: ['/demo/order_inbox.png', '/demo/stripe_payment.png', '/demo/quickbooks_invoice.png', '/demo/email_confirm.png'],
    createdAt: new Date('2026-08-11T09:20:00Z').toISOString(),
  };

  const defaultAuditLogs: AuditLog[] = [
    {
      _id: 'audit_1',
      businessId,
      actorId: ownerId,
      actorName: 'Sarah Lin (Owner)',
      action: 'PROCESS_CREATED',
      entityId: processId,
      entityType: 'process',
      timestamp: new Date('2026-08-10T14:00:00Z').toISOString(),
      details: { name: 'Order Processing & Fulfillment' },
    },
    {
      _id: 'audit_2',
      businessId,
      actorId: ownerId,
      actorName: 'Sarah Lin (Owner)',
      action: 'WORKFLOW_APPROVED',
      entityId: defaultWorkflow._id,
      entityType: 'workflow',
      timestamp: new Date('2026-08-11T09:15:00Z').toISOString(),
      details: { version: 'v1.0' },
    },
    {
      _id: 'audit_3',
      businessId,
      actorId: 'system_agent_drift',
      actorName: 'Process Auditor (Drift Agent)',
      action: 'DRIFT_DETECTED',
      entityId: defaultDriftEvent._id,
      entityType: 'drift_event',
      timestamp: new Date('2026-08-28T16:20:00Z').toISOString(),
      details: { deviation: 'Excel Secondary Audit Check inserted between payment and invoice' },
    },
  ];

  // Example B: Small Accounting Firm Workflow (Section 10)
  const accProcessId = 'proc_accounting_firm';
  const accVersionId = 'ver_accounting_v1_0';
  const accVersion: ProcessVersion = {
    _id: accVersionId,
    processId: accProcessId,
    version: 'v1.0 (Baseline)',
    isBaseline: true,
    createdAt: new Date('2026-08-15T11:00:00Z').toISOString(),
    nodes: [
      {
        id: 'acc_node_1',
        label: 'Receive Client Invoice PDF',
        application: 'Thunderbird / Gmail Client',
        action: 'Ingest attached invoice_apex_881.pdf from billing@apexconsulting.com',
        timestamp: '00:05',
        timestampSec: 5,
        screenshot: '/demo/acc_invoice_email.png',
        confidence: 0.99,
        automationMethod: 'api',
        apiEndpoint: 'GET /v1/inbox/attachments/invoice_apex_881.pdf',
        suggestedTools: ['Email Parser SDK'],
        notes: 'Direct email attachment parser extracts vendor and PDF bytes',
      },
      {
        id: 'acc_node_2',
        label: 'Open QuickBooks Accounting',
        application: 'QuickBooks Online',
        action: 'Launch accounting vendor ledger view',
        timestamp: '00:12',
        timestampSec: 12,
        screenshot: '/demo/quickbooks_invoice.png',
        confidence: 0.96,
        automationMethod: 'api',
        apiEndpoint: 'GET /v3/company/QC-98421/vendor',
        suggestedTools: ['QuickBooks API'],
        notes: 'API provides vendor list directly',
      },
      {
        id: 'acc_node_3',
        label: 'Find Client Record: Apex Consulting',
        application: 'QuickBooks Online',
        action: 'Query vendor record matching "Apex Consulting LLC"',
        timestamp: '00:18',
        timestampSec: 18,
        screenshot: '/demo/quickbooks_invoice.png',
        confidence: 0.97,
        automationMethod: 'api',
        apiEndpoint: 'GET /v3/company/QC-98421/query?select=* from Vendor where DisplayName=\'Apex Consulting LLC\'',
        suggestedTools: ['QuickBooks Query API'],
        parameters: { vendor: 'Apex Consulting LLC' },
      },
      {
        id: 'acc_node_4',
        label: 'Enter Invoice Line Items ($3,450.00)',
        application: 'QuickBooks Online',
        action: 'Enter line item description "Monthly Retainer July 2026", amount $3,450.00',
        timestamp: '00:28',
        timestampSec: 28,
        screenshot: '/demo/quickbooks_invoice.png',
        confidence: 0.98,
        automationMethod: 'api',
        apiEndpoint: 'POST /v3/company/QC-98421/bill',
        suggestedTools: ['QuickBooks Bill API'],
        parameters: { amount: '3450.00', term: 'Net 30' },
      },
      {
        id: 'acc_node_5',
        label: 'Verify Amount & Sales Tax',
        application: 'QuickBooks Online',
        action: 'Verify subtotal $3,450.00 matches attached PDF total',
        timestamp: '00:34',
        timestampSec: 34,
        screenshot: '/demo/quickbooks_invoice.png',
        confidence: 0.99,
        automationMethod: 'api',
        apiEndpoint: 'POST /v3/company/QC-98421/bill/validate',
        suggestedTools: ['Tax Calculation Engine'],
      },
      {
        id: 'acc_node_6',
        label: 'Save Ledger Record',
        application: 'Google Sheets',
        action: 'Update Accounts Payable master register',
        timestamp: '00:41',
        timestampSec: 41,
        screenshot: '/demo/google_sheet.png',
        confidence: 0.97,
        automationMethod: 'api',
        apiEndpoint: 'POST https://sheets.googleapis.com/v4/spreadsheets/ledger/values:append',
      },
      {
        id: 'acc_node_7',
        label: 'Send Receipt Confirmation',
        application: 'SendGrid Email API',
        action: 'Email billing@apexconsulting.com acknowledging bill receipt',
        timestamp: '00:45',
        timestampSec: 45,
        screenshot: '/demo/email_confirm.png',
        confidence: 0.98,
        automationMethod: 'api',
        apiEndpoint: 'POST /v3/mail/send',
      },
    ],
    edges: [
      { id: 'ea_1', source: 'acc_node_1', target: 'acc_node_2' },
      { id: 'ea_2', source: 'acc_node_2', target: 'acc_node_3' },
      { id: 'ea_3', source: 'acc_node_3', target: 'acc_node_4' },
      { id: 'ea_4', source: 'acc_node_4', target: 'acc_node_5' },
      { id: 'ea_5', source: 'acc_node_5', target: 'acc_node_6' },
      { id: 'ea_6', source: 'acc_node_6', target: 'acc_node_7' },
    ],
    evidence: [
      {
        id: 'ev_acc_1',
        frameId: 'frame_acc_05',
        timestamp: '00:05',
        screenshotUrl: '/demo/acc_invoice_email.png',
        detectedElements: [{ label: 'PDF Invoice Attachment', box: [20, 20, 80, 80], confidence: 0.99 }],
        activeWindow: 'Thunderbird - Inbox',
        ocrText: ['invoice_apex_881.pdf', '$3,450.00', 'Apex Consulting LLC'],
      },
    ],
  };

  const accProcess: Process = {
    _id: accProcessId,
    businessId,
    name: 'Client Invoice Entry & Accounting (Example B)',
    description: 'Automated invoice extraction and bookkeeping: ingests client PDF invoices from email, queries QuickBooks vendor profiles, logs bill items, updates master ledger, and dispatches confirmation.',
    status: 'verified',
    baselineVersionId: accVersionId,
    currentVersionId: accVersionId,
    recordingUrl: '/demo/accounting_invoices.mp4',
    recordingDurationSec: 45,
    sampleVideoType: 'accounting_invoices',
    createdAt: new Date('2026-08-15T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-08-15T11:30:00Z').toISOString(),
  };

  const accWorkflow: Workflow = {
    _id: 'wf_accounting_auto',
    businessId,
    processId: accProcessId,
    processVersionId: accVersionId,
    name: 'QuickBooks Automated AP Bill Runner',
    status: 'approved',
    approvedBy: ownerId,
    approvedAt: new Date('2026-08-15T11:20:00Z').toISOString(),
    steps: [
      { id: 'as_1', name: 'Extract PDF Attachment', type: 'api_call', target: 'Thunderbird', action: 'GET /inbox/attachments', method: 'api' },
      { id: 'as_2', name: 'Query Vendor in QuickBooks', type: 'api_call', target: 'QuickBooks Online', action: 'GET /v3/company/vendor', method: 'api' },
      { id: 'as_3', name: 'Create Bill Record ($3,450.00)', type: 'api_call', target: 'QuickBooks Online', action: 'POST /v3/company/bill', method: 'api' },
      { id: 'as_4', name: 'Update AP Ledger Sheet', type: 'api_call', target: 'Google Sheets', action: 'POST /v4/spreadsheets/values:append', method: 'api' },
      { id: 'as_5', name: 'Send Vendor Receipt Confirmation', type: 'api_call', target: 'SendGrid Email', action: 'POST /v3/mail/send', method: 'api' },
    ],
    codeScript: `import { emailParser, quickbooks, sheets, sendgrid } from '@processmind/connectors';

export async function processClientInvoice(emailEvent: { attachmentUrl: string }) {
  const invoice = await emailParser.extractInvoice(emailEvent.attachmentUrl);
  const vendor = await quickbooks.findVendorByName(invoice.vendorName);
  const bill = await quickbooks.createBill({
    vendorId: vendor.id,
    amount: invoice.totalAmount,
    dueDate: invoice.dueDate,
    items: invoice.lineItems
  });
  await sheets.appendRow({ spreadsheetId: process.env.AP_SHEET_ID, row: [new Date().toISOString(), bill.id, invoice.vendorName, invoice.totalAmount] });
  await sendgrid.sendReceipt({ to: invoice.vendorEmail, billId: bill.id });
  return { success: true, billId: bill.id };
}`,
    createdAt: new Date('2026-08-15T11:15:00Z').toISOString(),
    updatedAt: new Date('2026-08-15T11:20:00Z').toISOString(),
  };

  // Example E: Developer Tools Use Case (Section 13)
  const devProcessId = 'proc_developer_bugfix';
  const devVersionId = 'ver_developer_v1_0';
  const devVersion: ProcessVersion = {
    _id: devVersionId,
    processId: devProcessId,
    version: 'v1.0 (Baseline)',
    isBaseline: true,
    createdAt: new Date('2026-08-20T16:00:00Z').toISOString(),
    nodes: [
      {
        id: 'dev_node_1',
        label: 'Open GitHub Issue #402',
        application: 'GitHub Web',
        action: 'Review issue description "Stripe Webhook timeout on 10+ items cart"',
        timestamp: '00:06',
        timestampSec: 6,
        screenshot: '/demo/dev_github_issue.png',
        confidence: 0.99,
        automationMethod: 'api',
        apiEndpoint: 'GET /repos/quickcart/store-automations/issues/402',
        suggestedTools: ['GitHub Octokit REST API'],
      },
      {
        id: 'dev_node_2',
        label: 'Open Git Repository & Branch',
        application: 'GitHub Web / Git',
        action: 'Create feature branch fix-qb-batch from main',
        timestamp: '00:14',
        timestampSec: 14,
        screenshot: '/demo/dev_github_issue.png',
        confidence: 0.98,
        automationMethod: 'api',
        apiEndpoint: 'POST /repos/quickcart/store-automations/git/refs',
        suggestedTools: ['Git CLI / GitHub API'],
      },
      {
        id: 'dev_node_3',
        label: 'Search Error in Stack Trace',
        application: 'Sentry / VS Code',
        action: 'Search ETIMEDOUT in QuickBooks invoice line items connector',
        timestamp: '00:22',
        timestampSec: 22,
        screenshot: '/demo/dev_vscode_editor.png',
        confidence: 0.96,
        automationMethod: 'api',
        apiEndpoint: 'GET /api/0/projects/quickcart/issues/?query=ETIMEDOUT',
        suggestedTools: ['Sentry REST API'],
      },
      {
        id: 'dev_node_4',
        label: 'Locate Source File: quickbooks-connector.ts',
        application: 'Visual Studio Code',
        action: 'Apply chunk batching logic to createQuickBooksInvoice()',
        timestamp: '00:33',
        timestampSec: 33,
        screenshot: '/demo/dev_vscode_editor.png',
        confidence: 0.97,
        automationMethod: 'api',
        suggestedTools: ['GitHub Codespaces / Git API'],
      },
      {
        id: 'dev_node_5',
        label: 'Run Automated Test Suite (Jest)',
        application: 'Terminal / Jest',
        action: 'Execute npm test -- tests/quickbooks-connector.spec.ts',
        timestamp: '00:42',
        timestampSec: 42,
        screenshot: '/demo/dev_test_runner.png',
        confidence: 0.99,
        automationMethod: 'api',
        apiEndpoint: 'POST /repos/quickcart/store-automations/actions/workflows/test.yml/dispatches',
        suggestedTools: ['GitHub Actions Runner'],
      },
      {
        id: 'dev_node_6',
        label: 'Inspect CI Execution Logs',
        application: 'Terminal / GitHub Actions',
        action: 'Verify all 18 unit tests and tax calculations passed',
        timestamp: '00:48',
        timestampSec: 48,
        screenshot: '/demo/dev_test_runner.png',
        confidence: 0.99,
        automationMethod: 'api',
        apiEndpoint: 'GET /repos/quickcart/store-automations/actions/runs/{runId}/jobs',
        suggestedTools: ['GitHub Actions API'],
      },
      {
        id: 'dev_node_7',
        label: 'Create Pull Request & Trigger CI',
        application: 'GitHub Web',
        action: 'Submit PR #403 "fix(quickbooks): batch line items to eliminate webhook timeouts"',
        timestamp: '00:52',
        timestampSec: 52,
        screenshot: '/demo/dev_pull_request.png',
        confidence: 0.98,
        automationMethod: 'api',
        apiEndpoint: 'POST /repos/quickcart/store-automations/pulls',
        suggestedTools: ['GitHub Pull Request API'],
      },
    ],
    edges: [
      { id: 'edv_1', source: 'dev_node_1', target: 'dev_node_2' },
      { id: 'edv_2', source: 'dev_node_2', target: 'dev_node_3' },
      { id: 'edv_3', source: 'dev_node_3', target: 'dev_node_4' },
      { id: 'edv_4', source: 'dev_node_4', target: 'dev_node_5' },
      { id: 'edv_5', source: 'dev_node_5', target: 'dev_node_6' },
      { id: 'edv_6', source: 'dev_node_6', target: 'dev_node_7' },
    ],
    evidence: [
      {
        id: 'ev_dev_1',
        frameId: 'frame_dev_06',
        timestamp: '00:06',
        screenshotUrl: '/demo/dev_github_issue.png',
        detectedElements: [{ label: 'GitHub Issue #402', box: [10, 10, 80, 80], confidence: 0.99 }],
        activeWindow: 'Google Chrome - GitHub Issue #402',
        ocrText: ['Issue #402', 'Stripe Webhook timeout', 'Open'],
      },
    ],
  };

  const devProcess: Process = {
    _id: devProcessId,
    businessId,
    name: 'Developer Bug Investigation & PR (Example E)',
    description: 'Developer Tools context automation: connects visible developer actions to GitHub Issues, Git repositories, VS Code source files, Jest test runner, and automated Pull Request creation.',
    status: 'verified',
    baselineVersionId: devVersionId,
    currentVersionId: devVersionId,
    recordingUrl: '/demo/dev_bugfix.mp4',
    recordingDurationSec: 52,
    sampleVideoType: 'dev_bugfix',
    createdAt: new Date('2026-08-20T16:00:00Z').toISOString(),
    updatedAt: new Date('2026-08-20T16:45:00Z').toISOString(),
  };

  const devWorkflow: Workflow = {
    _id: 'wf_developer_auto',
    businessId,
    processId: devProcessId,
    processVersionId: devVersionId,
    name: 'GitHub CI/CD Automated Bug Fix Pipeline',
    status: 'approved',
    approvedBy: ownerId,
    approvedAt: new Date('2026-08-20T16:30:00Z').toISOString(),
    steps: [
      { id: 'ds_1', name: 'Fetch Issue Details', type: 'api_call', target: 'GitHub', action: 'GET /repos/{repo}/issues/{id}', method: 'api' },
      { id: 'ds_2', name: 'Create Git Fix Branch', type: 'api_call', target: 'GitHub', action: 'POST /repos/{repo}/git/refs', method: 'api' },
      { id: 'ds_3', name: 'Trigger Remote Test Suite', type: 'api_call', target: 'GitHub Actions', action: 'POST /actions/workflows/test.yml/dispatches', method: 'api' },
      { id: 'ds_4', name: 'Create Pull Request', type: 'api_call', target: 'GitHub', action: 'POST /repos/{repo}/pulls', method: 'api' },
    ],
    codeScript: `import { Octokit } from '@octokit/rest';

export async function automateBugFix(issueNumber: number) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const issue = await octokit.rest.issues.get({ owner: 'quickcart', repo: 'store-automations', issue_number: issueNumber });
  const branchName = 'fix-issue-' + issueNumber;
  const mainRef = await octokit.rest.git.getRef({ owner: 'quickcart', repo: 'store-automations', ref: 'heads/main' });
  await octokit.rest.git.createRef({ owner: 'quickcart', repo: 'store-automations', ref: 'refs/heads/' + branchName, sha: mainRef.data.object.sha });
  const pr = await octokit.rest.pulls.create({
    owner: 'quickcart',
    repo: 'store-automations',
    title: 'fix: automated patch for issue #' + issueNumber,
    head: branchName,
    base: 'main',
    body: 'Automated pull request synthesized by ProcessMind Software Agent.'
  });
  return { success: true, prUrl: pr.data.html_url };
}`,
    createdAt: new Date('2026-08-20T16:25:00Z').toISOString(),
    updatedAt: new Date('2026-08-20T16:30:00Z').toISOString(),
  };

  return {
    businesses: [defaultBusiness],
    users: defaultUsers,
    applications: defaultApplications,
    processes: [defaultProcess, accProcess, devProcess],
    processVersions: [baselineVersion, driftVersion, accVersion, devVersion],
    workflows: [defaultWorkflow, accWorkflow, devWorkflow],
    agentRuns: [defaultAgentRun],
    workflowRuns: [defaultWorkflowRun],
    driftEvents: [defaultDriftEvent],
    auditLogs: defaultAuditLogs,
  };
}

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DatabaseStore] Could not read db file, initializing with seed data:', err);
    }
    const seed = getInitialSeedData();
    this.save(seed);
    return seed;
  }

  private save(data?: DatabaseSchema) {
    try {
      const toSave = data || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DatabaseStore] Failed to write db file:', err);
    }
  }

  public resetToSeed(): DatabaseSchema {
    this.data = getInitialSeedData();
    this.save();
    return this.data;
  }

  // Tenant Scoped Accessors (Section 28 Security requirement)
  public getBusiness(businessId: string): Business | undefined {
    return this.data.businesses.find(b => b._id === businessId);
  }

  public getBusinesses(): Business[] {
    return this.data.businesses;
  }

  public saveBusiness(business: Business): Business {
    const idx = this.data.businesses.findIndex(b => b._id === business._id);
    if (idx >= 0) this.data.businesses[idx] = business;
    else this.data.businesses.push(business);
    this.save();
    return business;
  }

  public getUsers(businessId: string): User[] {
    return this.data.users.filter(u => u.businessId === businessId);
  }

  public addUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public getApplications(businessId: string): Application[] {
    return this.data.applications.filter(a => a.businessId === businessId);
  }

  public saveApplication(app: Application): Application {
    const idx = this.data.applications.findIndex(a => a._id === app._id && a.businessId === app.businessId);
    if (idx >= 0) this.data.applications[idx] = app;
    else this.data.applications.push(app);
    this.save();
    return app;
  }

  public getProcesses(businessId: string): Process[] {
    return this.data.processes.filter(p => p.businessId === businessId);
  }

  public getProcess(businessId: string, processId: string): Process | undefined {
    return this.data.processes.find(p => p._id === processId && p.businessId === businessId);
  }

  public saveProcess(process: Process): Process {
    const idx = this.data.processes.findIndex(p => p._id === process._id && p.businessId === process.businessId);
    if (idx >= 0) this.data.processes[idx] = process;
    else this.data.processes.push(process);
    this.save();
    return process;
  }

  public updateProcessStatus(businessId: string, processId: string, status: Process['status']): Process | undefined {
    const process = this.getProcess(businessId, processId);
    if (process) {
      process.status = status;
      process.updatedAt = new Date().toISOString();
      this.saveProcess(process);
    }
    return process;
  }

  public getProcessVersion(versionId: string): ProcessVersion | undefined {
    return this.data.processVersions.find(v => v._id === versionId);
  }

  public getProcessVersions(processId: string): ProcessVersion[] {
    return this.data.processVersions.filter(v => v.processId === processId);
  }

  public saveProcessVersion(version: ProcessVersion): ProcessVersion {
    const idx = this.data.processVersions.findIndex(v => v._id === version._id);
    if (idx >= 0) this.data.processVersions[idx] = version;
    else this.data.processVersions.push(version);
    this.save();
    return version;
  }

  public getWorkflowByProcess(businessId: string, processId: string): Workflow | undefined {
    return this.data.workflows.find(w => w.businessId === businessId && w.processId === processId);
  }

  public getWorkflow(workflowId: string): Workflow | undefined {
    return this.data.workflows.find(w => w._id === workflowId);
  }

  public saveWorkflow(workflow: Workflow): Workflow {
    const idx = this.data.workflows.findIndex(w => w._id === workflow._id);
    if (idx >= 0) this.data.workflows[idx] = workflow;
    else this.data.workflows.push(workflow);
    this.save();
    return workflow;
  }

  public getAgentRuns(businessId: string, processId?: string): AgentRun[] {
    return this.data.agentRuns.filter(r => 
      r.businessId === businessId && (!processId || r.processId === processId)
    );
  }

  public getAgentRun(runId: string): AgentRun | undefined {
    return this.data.agentRuns.find(r => r._id === runId);
  }

  public saveAgentRun(run: AgentRun): AgentRun {
    const idx = this.data.agentRuns.findIndex(r => r._id === run._id);
    if (idx >= 0) this.data.agentRuns[idx] = run;
    else this.data.agentRuns.push(run);
    this.save();
    return run;
  }

  public appendAgentTimeline(runId: string, event: any) {
    const run = this.getAgentRun(runId);
    if (run) {
      run.timeline.push(event);
      run.updatedAt = new Date().toISOString();
      this.save();
    }
  }

  public getWorkflowRuns(businessId: string, processId?: string): WorkflowRun[] {
    return this.data.workflowRuns.filter(r => 
      r.businessId === businessId && (!processId || r.processId === processId)
    );
  }

  public saveWorkflowRun(run: WorkflowRun): WorkflowRun {
    const idx = this.data.workflowRuns.findIndex(r => r._id === run._id);
    if (idx >= 0) this.data.workflowRuns[idx] = run;
    else this.data.workflowRuns.push(run);
    this.save();
    return run;
  }

  public getDriftEvents(businessId: string, processId?: string): DriftEvent[] {
    return this.data.driftEvents.filter(d => 
      d.businessId === businessId && (!processId || d.processId === processId)
    );
  }

  public getDriftEvent(driftId: string): DriftEvent | undefined {
    return this.data.driftEvents.find(d => d._id === driftId);
  }

  public saveDriftEvent(drift: DriftEvent): DriftEvent {
    const idx = this.data.driftEvents.findIndex(d => d._id === drift._id);
    if (idx >= 0) this.data.driftEvents[idx] = drift;
    else this.data.driftEvents.push(drift);
    this.save();
    return drift;
  }

  public getAuditLogs(businessId: string): AuditLog[] {
    return this.data.auditLogs
      .filter(a => a.businessId === businessId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addAuditLog(log: AuditLog): AuditLog {
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }
}

// Global Singleton for Next.js App
declare global {
  // eslint-disable-next-line no-var
  var __processMindDb: DatabaseStore | undefined;
}

export const db: DatabaseStore = globalThis.__processMindDb ?? new DatabaseStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__processMindDb = db;
}
