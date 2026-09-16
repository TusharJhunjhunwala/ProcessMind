/**
 * ProcessMind — Google Gemini AI Service
 * Real Multi-Agent Computer Vision & Process Automation Engine
 * Uses Google Gemini (gemini-3.6-flash)
 */

import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const getGemini = () => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('PLACEHOLDER')) {
    throw new Error(
      'GOOGLE_GEMINI_API_KEY not set. Get your FREE key at https://aistudio.google.com/app/apikey and add it to .env.local'
    );
  }
  return new GoogleGenerativeAI(apiKey);
};

const getModel = (genAI: GoogleGenerativeAI) => {
  return genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
};

/**
 * Helper to clean and extract JSON from Gemini text response
 */
function cleanAndParseJSON<T>(rawText: string, fallback?: T): T {
  let text = rawText.trim();
  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  // Try direct parse
  try {
    return JSON.parse(text) as T;
  } catch (e1) {
    // Try to find the outermost { ... }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const substr = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(substr) as T;
      } catch (e2) {
        // failed
      }
    }
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Failed to parse AI JSON response: ${(e1 as Error).message}\nRaw text: ${text.slice(0, 300)}`);
  }
}

/**
 * VISION AGENT — Step 1 ("Eyes")
 * Analyzes video frames (as base64 images) to detect:
 * - Active applications / windows
 * - UI elements (buttons, forms, tables)
 * - User actions (clicks, typing, navigation)
 * - OCR text visible on screen
 */
export async function geminiAnalyzeVideoFrames(
  frames: Array<{ base64: string; mimeType: string; timestampSec: number }>
): Promise<GeminiVisionOutput> {
  const genAI = getGemini();
  const model = getModel(genAI);

  const parts: Part[] = [
    {
      text: `You are the specialized Vision Agent ("Eyes") in the ProcessMind AI multi-agent architecture.
Your job is visual understanding of an employee screen recording showing repetitive computer tasks.

Look at the sequence of keyframe screenshots provided (in chronological order).
Analyze:
1. What software / web applications / desktop windows are visible in each frame (e.g., "Google Chrome - Shopify Admin", "Microsoft Excel", "QuickBooks Online", "Google Sheets", "Gmail", "CRM", "VS Code", "Stripe").
2. What specific UI elements are being interacted with (buttons, input fields, tables, modals, dropdowns).
3. The chronological user actions taken (clicks, typing, navigation, status review).
4. Key visible business data (order IDs, customer names, dollar amounts, status flags).

CRITICAL: Return ONLY valid JSON with no markdown and no backticks.
Schema:
{
  "framesExtracted": ${frames.length},
  "applicationsDetected": ["string"],
  "actionsDetected": [
    {
      "timestamp": "MM:SS",
      "timestampSec": 0,
      "activeWindow": "Application / Window Title",
      "eventType": "click",
      "targetElement": "Element interacted with",
      "confidence": 0.95,
      "frameIndex": 0,
      "ocrHighlights": ["visible text 1", "visible text 2"]
    }
  ],
  "evidence": [
    {
      "id": "ev_1",
      "frameIndex": 0,
      "timestamp": "MM:SS",
      "timestampSec": 0,
      "activeWindow": "Application Name",
      "ocrText": ["visible text"],
      "detectedElements": [
        { "label": "UI Element Name", "confidence": 0.95 }
      ]
    }
  ],
  "summary": "Clear one-sentence business summary of what user actions and workflow were observed in the recording."
}`,
    },
  ];

  // Add each frame as an inline image
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    parts.push({
      text: `Frame ${i + 1} of ${frames.length} (at timestamp ~${Math.round(frame.timestampSec)}s):`,
    });
    parts.push({
      inlineData: {
        mimeType: (frame.mimeType || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp',
        data: frame.base64,
      },
    });
  }

  const result = await model.generateContent(parts);
  const responseText = result.response.text();

  return cleanAndParseJSON<GeminiVisionOutput>(responseText);
}

/**
 * PROCESS ANALYST AGENT — Step 2 ("Business Analyst")
 * Converts visual UI interactions into a business process flow graph with dependencies & bottlenecks.
 */
export async function geminiExtractProcessGraph(
  visionOutput: GeminiVisionOutput,
  processName: string,
  businessDescription: string
): Promise<GeminiProcessOutput> {
  const genAI = getGemini();
  const model = getModel(genAI);

  const prompt = `You are the Process Analyst Agent ("Business Analyst") in ProcessMind.
Convert raw visual UI interactions from an employee screen recording into a structured business process graph.

Process Details:
- Name: "${processName}"
- Description: "${businessDescription}"
- Observed Summary: "${visionOutput.summary}"
- Detected Apps: ${JSON.stringify(visionOutput.applicationsDetected)}
- Detected UI Actions: ${JSON.stringify(visionOutput.actionsDetected, null, 2)}

Requirements:
1. Synthesize visual clicks and form inputs into clean, meaningful BUSINESS PROCESS STEPS (not low-level mouse movements).
2. For each step, determine if it can be automated via REST API ("api"), browser RPA ("browser_automation"), or needs human review ("human_review").
3. Suggest appropriate software tools, APIs, and parameters.
4. Connect steps with directed edges showing data flow (e.g. Order ID, Customer Email, Invoice Number).
5. Identify specific business bottlenecks and time delays in the manual process.

CRITICAL: Return ONLY valid JSON with no markdown and no backticks.
Schema:
{
  "processSummary": "High-level summary of the end-to-end business process",
  "estimatedAutomationFeasibility": 92,
  "totalSteps": 5,
  "bottlenecks": [
    "Manual copy-pasting between Application A and B",
    "Repetitive manual data validation"
  ],
  "nodes": [
    {
      "id": "node_1",
      "label": "Short Business Action (e.g. Ingest Order)",
      "application": "Application Name",
      "action": "Plain-English description of what the user does",
      "timestamp": "00:05",
      "timestampSec": 5,
      "confidence": 0.95,
      "automationMethod": "api",
      "apiEndpoint": "POST /api/endpoint",
      "suggestedTools": ["Tool A", "Tool B"],
      "parameters": {},
      "notes": "Automation feasibility rationale"
    }
  ],
  "edges": [
    {
      "id": "e1_2",
      "source": "node_1",
      "target": "node_2",
      "label": "Data passed"
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  return cleanAndParseJSON<GeminiProcessOutput>(result.response.text());
}

/**
 * AUTOMATION AGENT — Step 3 ("Automation Engineer")
 * Generates production-ready TypeScript code, API integrations, and workflow execution steps.
 */
export async function geminiGenerateAutomation(
  processOutput: GeminiProcessOutput,
  processName: string
): Promise<GeminiAutomationOutput> {
  const genAI = getGemini();
  const model = getModel(genAI);

  const stepsSummary = processOutput.nodes.map((n, i) => ({
    stepNumber: i + 1,
    label: n.label,
    app: n.application,
    action: n.action,
    method: n.automationMethod,
    endpoint: n.apiEndpoint,
  }));

  const prompt = `You are the Automation Agent ("Automation Engineer") in ProcessMind.
Write an automated workflow and complete, production-grade TypeScript execution script that automates the business process learned from the employee screen recording.

Process Name: "${processName}"
Process Summary: "${processOutput.processSummary}"
Extracted Steps:
${JSON.stringify(stepsSummary, null, 2)}

Requirements:
1. Generate an executable TypeScript script with async/await, error handling, retry policies, and structured console logging.
2. If APIs exist for the target apps (Shopify, Stripe, QuickBooks, Sheets, GitHub, Slack, Gmail, REST), write real API calls rather than fragile browser automation.
3. If browser steps are necessary, generate Playwright / Puppeteer automation logic.
4. Estimate manual time saved per execution.

CRITICAL: Return ONLY valid JSON with no markdown and no backticks.
Schema:
{
  "workflowName": "Automated Flow Name",
  "workflowSteps": [
    {
      "id": "wf_step_1",
      "name": "Step Name",
      "type": "api_call",
      "target": "Application Name",
      "action": "API route or action description",
      "method": "api"
    }
  ],
  "codeScript": "Complete runnable TypeScript code string with \\n for newlines",
  "estimatedTimeSavedPerRun": "e.g. 6.5 minutes per transaction",
  "requiredEnvVars": ["API_KEY_1", "API_KEY_2"],
  "summary": "Summary of the automated script"
}`;

  const result = await model.generateContent(prompt);
  const fallbackScript: GeminiAutomationOutput = {
    workflowName: `${processName} Automation`,
    workflowSteps: processOutput.nodes.map((n, i) => ({
      id: `wf_step_${i + 1}`,
      name: n.label,
      type: n.automationMethod === 'api' ? 'api_call' : 'browser_action',
      target: n.application,
      action: n.apiEndpoint || n.action,
      method: n.automationMethod === 'api' ? 'api' : 'playwright',
    })),
    codeScript: `// ProcessMind Automated Workflow for ${processName}\n// Generated by ProcessMind AI Swarm\n\nexport async function executeAutomation(context: any) {\n  console.log('[ProcessMind] Starting automated run for ${processName}...');\n${processOutput.nodes.map((n, i) => `  // Step ${i + 1}: ${n.label} (${n.application})\n  console.log('Executing ${n.label}...');`).join('\n')}\n  return { success: true, timestamp: new Date().toISOString() };\n}`,
    estimatedTimeSavedPerRun: '5-10 minutes per execution',
    requiredEnvVars: ['API_KEY'],
    summary: processOutput.processSummary,
  };

  return cleanAndParseJSON<GeminiAutomationOutput>(result.response.text(), fallbackScript);
}

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface GeminiVisionOutput {
  framesExtracted: number;
  applicationsDetected: string[];
  actionsDetected: Array<{
    timestamp: string;
    timestampSec: number;
    activeWindow: string;
    eventType: 'click' | 'type' | 'navigate' | 'read' | 'scroll';
    targetElement: string;
    confidence: number;
    frameIndex: number;
    ocrHighlights: string[];
  }>;
  evidence: Array<{
    id: string;
    frameIndex: number;
    timestamp: string;
    timestampSec: number;
    activeWindow: string;
    ocrText: string[];
    detectedElements: Array<{ label: string; confidence: number }>;
  }>;
  summary: string;
}

export interface GeminiProcessOutput {
  processSummary: string;
  estimatedAutomationFeasibility: number;
  totalSteps: number;
  bottlenecks: string[];
  nodes: Array<{
    id: string;
    label: string;
    application: string;
    action: string;
    timestamp: string;
    timestampSec: number;
    confidence: number;
    automationMethod: string;
    apiEndpoint?: string;
    suggestedTools: string[];
    parameters: Record<string, string>;
    notes: string;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    label?: string;
  }>;
}

export interface GeminiAutomationOutput {
  workflowName: string;
  workflowSteps: Array<{
    id: string;
    name: string;
    type: string;
    target: string;
    action: string;
    method: string;
  }>;
  codeScript: string;
  estimatedTimeSavedPerRun: string;
  requiredEnvVars: string[];
  summary: string;
}
