import { z } from 'zod';

export const AgentInputSchema = z.object({
  businessId: z.string().min(1),
  processId: z.string().min(1),
  runId: z.string().min(1),
  inputRefs: z.record(z.any()).default({}),
  context: z.record(z.any()).default({}),
});

export const AgentOutputSchema = z.object({
  status: z.enum(['success', 'failed', 'warning']),
  summary: z.string(),
  structuredData: z.any(),
  evidenceRefs: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  nextAction: z.string().optional(),
});

export const ProcessNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  application: z.string(),
  action: z.string(),
  timestamp: z.string(),
  timestampSec: z.number(),
  screenshot: z.string(),
  confidence: z.number().min(0).max(1),
  automationMethod: z.enum(['api', 'browser', 'human_review']),
  selector: z.string().optional(),
  apiEndpoint: z.string().optional(),
  suggestedTools: z.array(z.string()).optional(),
  parameters: z.record(z.string()).optional(),
  notes: z.string().optional(),
});

export const ProcessEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
});

export const VisionAgentOutputSchema = z.object({
  framesExtracted: z.number(),
  applicationsDetected: z.array(z.string()),
  actionsDetected: z.array(
    z.object({
      timestamp: z.string(),
      timestampSec: z.number(),
      activeWindow: z.string(),
      eventType: z.enum(['click', 'type', 'navigate', 'scroll', 'submit']),
      targetElement: z.string(),
      confidence: z.number(),
      frameRef: z.string(),
      ocrHighlights: z.array(z.string()).optional(),
    })
  ),
});

export const ProcessAnalystOutputSchema = z.object({
  processSummary: z.string(),
  nodes: z.array(ProcessNodeSchema),
  edges: z.array(ProcessEdgeSchema),
  totalSteps: z.number(),
  estimatedAutomationFeasibility: z.number(), // 0 - 100%
  bottlenecks: z.array(z.string()),
});

export const SoftwareAgentOutputSchema = z.object({
  identifiedSoftware: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      hasPublicApi: z.boolean(),
      detectedEndpoints: z.array(z.string()),
      authRequirement: z.string(),
      gitRepoLinked: z.boolean().optional(),
    })
  ),
  stepMappings: z.record(
    z.object({
      application: z.string(),
      bestAutomationType: z.enum(['api', 'browser', 'human_review']),
      reason: z.string(),
      apiEndpoint: z.string().optional(),
      suggestedPackage: z.string().optional(),
    })
  ),
});

export const AutomationAgentOutputSchema = z.object({
  workflowName: z.string(),
  steps: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['browser_action', 'api_call', 'approval_gate', 'notification']),
      target: z.string(),
      action: z.string(),
      payload: z.record(z.any()).optional(),
      method: z.enum(['api', 'browser', 'human_review']),
    })
  ),
  requiresHumanApproval: z.boolean(),
  executableScript: z.string(),
  estimatedExecutionTimeSec: z.number(),
});

export const VerificationAgentOutputSchema = z.object({
  verified: z.boolean(),
  testedInSandbox: z.boolean(),
  sandboxEnvironment: z.string(),
  stepsPassed: z.number(),
  stepsFailed: z.number(),
  executionLogs: z.array(
    z.object({
      timestamp: z.string(),
      stepId: z.string(),
      message: z.string(),
      level: z.enum(['info', 'warn', 'error', 'success']),
      screenshot: z.string().optional(),
    })
  ),
  verificationScreenshots: z.array(z.string()),
  discrepancies: z.array(z.string()),
});

export const DriftAgentOutputSchema = z.object({
  driftDetected: z.boolean(),
  driftScore: z.number(), // 0.0 to 1.0
  baselineVersion: z.string(),
  observedVersion: z.string(),
  changes: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['added_step', 'removed_step', 'modified_step', 'timing_anomaly']),
      stepLabel: z.string(),
      position: z.string(),
      evidenceFrame: z.string(),
      timestamp: z.string(),
      description: z.string(),
      impact: z.enum(['low', 'medium', 'high']),
    })
  ),
  recommendation: z.string(),
});
