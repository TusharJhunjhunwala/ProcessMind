import { AgentInput, AgentOutput, ProcessEvidence } from '@/packages/shared/types';
import { VisionAgentOutputSchema } from '@/packages/shared/schemas';

export class VisionAgent {
  public static readonly agentName = 'Vision Agent';
  public static readonly role = 'Visual Computer Vision Specialist ("Eyes")';

  /**
   * Analyzes recording frames and identifies active windows, UI widgets, and user click/keystroke coordinates.
   */
  public static async execute(input: AgentInput): Promise<AgentOutput> {
    const { context, processId } = input;
    const recordingType = context?.sampleVideoType || 'quickcart_orders';

    // Simulate Computer Vision inference over frame sequence
    const evidenceList: ProcessEvidence[] = [
      {
        id: `ev_${processId}_1`,
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
        id: `ev_${processId}_2`,
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
        id: `ev_${processId}_3`,
        frameId: 'frame_19',
        timestamp: '00:19',
        screenshotUrl: '/demo/risk_assessment.png',
        detectedElements: [
          { label: 'Shopify Fraud Analysis Card', box: [10, 10, 80, 90], confidence: 0.95 },
        ],
        activeWindow: 'Google Chrome - Shopify Fraud Guard',
        ocrText: ['Risk Level: LOW', 'CVV Match: PASS', 'Address Match: PASS'],
      },
      {
        id: `ev_${processId}_4`,
        frameId: 'frame_26',
        timestamp: '00:26',
        screenshotUrl: '/demo/stripe_payment.png',
        detectedElements: [
          { label: 'Stripe Payment Intent Card', box: [20, 25, 65, 85], confidence: 0.99 },
        ],
        activeWindow: 'Google Chrome - Stripe Dashboard',
        ocrText: ['Payment Intent: pi_3N92jkdlsw92', 'Amount: $142.50', 'Status: Succeeded'],
      },
      {
        id: `ev_${processId}_5`,
        frameId: 'frame_37',
        timestamp: '00:37',
        screenshotUrl: '/demo/quickbooks_invoice.png',
        detectedElements: [
          { label: 'QuickBooks Invoice Form', box: [10, 15, 90, 85], confidence: 0.97 },
        ],
        activeWindow: 'Google Chrome - QuickBooks Online - Invoicing',
        ocrText: ['Invoice #INV-2026-1049', 'Subtotal: $130.00', 'Tax: $12.50', 'Total: $142.50'],
      },
      {
        id: `ev_${processId}_6`,
        frameId: 'frame_48',
        timestamp: '00:48',
        screenshotUrl: '/demo/google_sheet.png',
        detectedElements: [
          { label: 'Spreadsheet Grid Row Entry', box: [15, 5, 30, 95], confidence: 0.97 },
        ],
        activeWindow: 'Google Chrome - Google Sheets (Orders DB)',
        ocrText: ['2026-08-10', '#9831', 'David Kramer', '$142.50', 'COMPLETED'],
      },
      {
        id: `ev_${processId}_7`,
        frameId: 'frame_55',
        timestamp: '00:55',
        screenshotUrl: '/demo/email_confirm.png',
        detectedElements: [
          { label: 'Email Template Preview Card', box: [10, 15, 85, 85], confidence: 0.98 },
        ],
        activeWindow: 'Google Chrome - SendGrid Email Composer',
        ocrText: ['QuickCart Store — Order Confirmed', 'David Kramer', 'INV-2026-1049'],
      },
    ];

    const structuredData = {
      framesExtracted: 42,
      applicationsDetected: [
        'Shopify Admin',
        'Stripe Dashboard',
        'QuickBooks Online',
        'Google Sheets',
        'SendGrid Email',
      ],
      actionsDetected: [
        {
          timestamp: '00:04',
          timestampSec: 4,
          activeWindow: 'Google Chrome - Shopify Admin - Orders',
          eventType: 'click' as const,
          targetElement: 'Table Row #9831',
          confidence: 0.97,
          frameRef: 'frame_04',
          ocrHighlights: ['#9831', 'Unfulfilled', '$142.50'],
        },
        {
          timestamp: '00:11',
          timestampSec: 11,
          activeWindow: 'Google Chrome - Shopify Admin - Order #9831',
          eventType: 'navigate' as const,
          targetElement: 'Order Detail View',
          confidence: 0.98,
          frameRef: 'frame_11',
          ocrHighlights: ['Wireless Studio Headphones Pro', 'Velour Ear Cushions'],
        },
        {
          timestamp: '00:19',
          timestampSec: 19,
          activeWindow: 'Google Chrome - Shopify Fraud Guard',
          eventType: 'click' as const,
          targetElement: 'Fraud Analysis Panel',
          confidence: 0.95,
          frameRef: 'frame_19',
          ocrHighlights: ['Risk Level: LOW'],
        },
        {
          timestamp: '00:26',
          timestampSec: 26,
          activeWindow: 'Google Chrome - Stripe Dashboard',
          eventType: 'navigate' as const,
          targetElement: 'Payment Intent #pi_3N92jkdlsw92',
          confidence: 0.99,
          frameRef: 'frame_26',
          ocrHighlights: ['$142.50', 'Succeeded'],
        },
        {
          timestamp: '00:37',
          timestampSec: 37,
          activeWindow: 'Google Chrome - QuickBooks Online - Invoicing',
          eventType: 'type' as const,
          targetElement: 'Invoice Line Items Form',
          confidence: 0.96,
          frameRef: 'frame_37',
          ocrHighlights: ['Invoice #INV-2026-1049', '$142.50'],
        },
        {
          timestamp: '00:48',
          timestampSec: 48,
          activeWindow: 'Google Chrome - Google Sheets',
          eventType: 'type' as const,
          targetElement: 'Row A42:F42',
          confidence: 0.97,
          frameRef: 'frame_48',
          ocrHighlights: ['#9831', 'David Kramer', 'COMPLETED'],
        },
        {
          timestamp: '00:55',
          timestampSec: 55,
          activeWindow: 'Google Chrome - SendGrid Email Composer',
          eventType: 'click' as const,
          targetElement: 'Send Template Button',
          confidence: 0.98,
          frameRef: 'frame_55',
          ocrHighlights: ['Order Confirmed', 'INV-2026-1049'],
        },
      ],
      evidence: evidenceList,
    };

    // Schema Validation
    VisionAgentOutputSchema.parse(structuredData);

    return {
      status: 'success',
      summary: `Computer Vision analyzed 42 frames across 5 SaaS web applications. Detected 7 sequential user actions with average 97.1% visual confidence.`,
      structuredData,
      evidenceRefs: evidenceList.map(e => e.id),
      warnings: [],
      nextAction: 'PROCESS_EXTRACTION',
    };
  }
}
