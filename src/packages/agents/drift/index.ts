import { AgentInput, AgentOutput } from '@/packages/shared/types';
import { DriftAgentOutputSchema } from '@/packages/shared/schemas';

export class DriftAgent {
  public static readonly agentName = 'Drift Agent';
  public static readonly role = 'Continuous Process Auditor ("Process Auditor")';

  /**
   * Compares an observed process recording against the approved baseline to detect deviation or shadow process steps.
   */
  public static async execute(input: AgentInput): Promise<AgentOutput> {
    const { baselineVersion, observedVersion } = input.context || {};

    const changes = [
      {
        id: 'dc_1',
        type: 'added_step' as const,
        stepLabel: 'Excel Secondary Audit Check (UNAPPROVED STEP)',
        position: 'Between Payment Check (00:26) and Create Invoice (00:37)',
        evidenceFrame: '/demo/excel_drift.png',
        timestamp: '00:31',
        description: 'New employee screen recording showed manual inspection of "DiscountCodes_2026.xlsx" before triggering QuickBooks invoice. This step is not in the approved baseline v1.0.',
        impact: 'medium' as const,
      },
    ];

    const structuredData = {
      driftDetected: true,
      driftScore: 0.28, // 28% deviation index
      baselineVersion: baselineVersion?.version || 'v1.0 (Baseline)',
      observedVersion: observedVersion?.version || 'v1.1 (Observed Drift)',
      changes,
      recommendation: 'Requires Small Business Owner review. If this spreadsheet discount check is legitimate policy, approve as v2.0 baseline and connect the Excel/Sheets API to automate it. Otherwise, notify employee to deprecate manual step.',
    };

    DriftAgentOutputSchema.parse(structuredData);

    return {
      status: 'warning',
      summary: `DRIFT DETECTED: 1 unauthorized step found in employee recording. New step: "Excel Secondary Audit Check" at 00:31 between Payment and Invoice. Automation paused for this branch pending Owner Review.`,
      structuredData,
      evidenceRefs: ['/demo/excel_drift.png'],
      warnings: ['Process deviation discovered. Do not silently modify production automation.'],
      nextAction: 'OWNER_REVIEW_REQUIRED',
    };
  }
}
