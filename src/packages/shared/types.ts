export type UserRole = 'owner' | 'admin' | 'member';
export type BusinessPlan = 'starter' | 'business' | 'pro';

export interface Business {
  _id: string;
  name: string;
  ownerId: string;
  plan: BusinessPlan;
  createdAt: string;
}

export interface User {
  _id: string;
  businessId: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ApplicationType = 'ecommerce' | 'accounting' | 'spreadsheet' | 'email' | 'developer' | 'crm' | 'custom_api';

export interface Application {
  _id: string;
  businessId: string;
  name: string;
  type: ApplicationType;
  connectionStatus: 'connected' | 'disconnected' | 'mock_sandbox';
  config?: Record<string, any>;
  lastSyncedAt?: string;
}

export type ProcessStatus = 
  | 'draft'
  | 'recording_uploaded'
  | 'analyzing'
  | 'extracted'
  | 'awaiting_approval'
  | 'approved'
  | 'verified'
  | 'monitoring'
  | 'drift_detected';

export interface Process {
  _id: string;
  businessId: string;
  name: string;
  description: string;
  status: ProcessStatus;
  baselineVersionId?: string;
  currentVersionId?: string;
  recordingUrl?: string;
  recordingDurationSec?: number;
  sampleVideoType?: 'quickcart_orders' | 'quickcart_drift' | 'accounting_invoices' | 'dev_bugfix';
  createdAt: string;
  updatedAt: string;
}

export type AutomationMethod = 'api' | 'browser' | 'human_review';

export interface ProcessNode {
  id: string;
  label: string;
  application: string;
  action: string;
  timestamp: string; // e.g., "00:12"
  timestampSec: number;
  screenshot: string; // URL or data URI
  confidence: number; // 0.0 - 1.0
  automationMethod: AutomationMethod;
  selector?: string;
  apiEndpoint?: string;
  suggestedTools?: string[];
  parameters?: Record<string, string>;
  notes?: string;
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface ProcessEvidence {
  id: string;
  frameId: string;
  timestamp: string;
  screenshotUrl: string;
  annotatedUrl?: string;
  detectedElements: {
    label: string;
    box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
    confidence: number;
  }[];
  activeWindow: string;
  ocrText?: string[];
}

export interface ProcessVersion {
  _id: string;
  processId: string;
  version: string; // e.g. "v1.0", "v1.1"
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  evidence: ProcessEvidence[];
  isBaseline: boolean;
  createdAt: string;
}

export type WorkflowStatus = 'draft' | 'pending_approval' | 'approved' | 'active' | 'archived';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'browser_action' | 'api_call' | 'approval_gate' | 'notification';
  target: string;
  action: string;
  payload?: Record<string, any>;
  method?: AutomationMethod;
  retryCount?: number;
  status?: 'idle' | 'running' | 'completed' | 'failed';
}

export interface Workflow {
  _id: string;
  businessId: string;
  processId: string;
  processVersionId: string;
  name: string;
  steps: WorkflowStep[];
  codeScript?: string;
  status: WorkflowStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AgentType = 
  | 'vision' 
  | 'process_analyst' 
  | 'software' 
  | 'automation' 
  | 'verification' 
  | 'drift';

export type AgentRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'needs_approval';

export interface AgentTimelineEvent {
  id: string;
  agentType: AgentType;
  phase: string;
  message: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  data?: any;
}

export interface AgentRun {
  _id: string;
  businessId: string;
  processId: string;
  agentType: AgentType | 'orchestrator';
  status: AgentRunStatus;
  output?: Record<string, any>;
  parentRunId?: string;
  timeline: AgentTimelineEvent[];
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRun {
  _id: string;
  workflowId: string;
  businessId: string;
  processId: string;
  status: 'running' | 'success' | 'failed';
  logs: {
    timestamp: string;
    stepId: string;
    message: string;
    level: 'info' | 'warn' | 'error' | 'success';
    screenshot?: string;
  }[];
  screenshots: string[];
  durationMs: number;
  createdAt: string;
}

export interface DriftChange {
  id: string;
  type: 'added_step' | 'removed_step' | 'modified_step' | 'timing_anomaly';
  stepLabel: string;
  position: string;
  evidenceFrame: string;
  timestamp: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface DriftEvent {
  _id: string;
  processId: string;
  businessId: string;
  baselineVersionId: string;
  observedVersionId: string;
  recordingUrl?: string;
  changes: DriftChange[];
  status: 'review_required' | 'approved_as_baseline' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  _id: string;
  businessId: string;
  actorId: string;
  actorName: string;
  action: string;
  entityId: string;
  entityType: 'process' | 'workflow' | 'drift_event' | 'integration' | 'member';
  timestamp: string;
  details?: Record<string, any>;
}

// Section 31: Suggested Agent Interface
export interface AgentInput {
  businessId: string;
  processId: string;
  runId: string;
  inputRefs: Record<string, any>;
  context: Record<string, any>;
}

export interface AgentOutput {
  status: 'success' | 'failed' | 'warning';
  summary: string;
  structuredData: any;
  evidenceRefs: string[];
  warnings: string[];
  nextAction?: string;
}
