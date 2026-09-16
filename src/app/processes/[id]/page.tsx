'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Code2,
  Eye,
  Film,
  ShieldCheck,
  RotateCcw,
  Clock,
  ChevronRight,
  History,
  FileCheck,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';
import {
  Process,
  ProcessVersion,
  Workflow,
  AgentRun,
  WorkflowRun,
  DriftEvent,
} from '@/packages/shared/types';
import { ProcessGraphView } from '@/components/process/ProcessGraphView';
import { RecordingPlayer } from '@/components/process/RecordingPlayer';
import { MultiAgentLiveConsole } from '@/components/process/MultiAgentLiveConsole';
import { AutomationApprovalView } from '@/components/process/AutomationApprovalView';
import { SandboxVerificationView } from '@/components/process/SandboxVerificationView';
import { DriftDiffView } from '@/components/process/DriftDiffView';

export default function ProcessDetailPage({ params }: { params: { id: string } }) {
  const { businessId, currentUser } = useBusiness();
  const [activeTab, setActiveTab] = useState<'graph' | 'recording' | 'agents' | 'automation' | 'verification' | 'drift' | 'history'>('graph');
  const [processData, setProcessData] = useState<Process | null>(null);
  const [baselineVersion, setBaselineVersion] = useState<ProcessVersion | undefined>();
  const [currentVersion, setCurrentVersion] = useState<ProcessVersion | undefined>();
  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [driftEvents, setDriftEvents] = useState<DriftEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcess = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/processes/${params.id}?businessId=${businessId}`);
      if (!res.ok) throw new Error('Failed to fetch process');
      const data = await res.json();
      setProcessData(data.process);
      setBaselineVersion(data.baselineVersion);
      setCurrentVersion(data.currentVersion);
      setWorkflow(data.workflow);
      setAgentRuns(data.agentRuns || []);
      setWorkflowRuns(data.workflowRuns || []);
      setDriftEvents(data.driftEvents || []);
    } catch (err) {
      console.error('Error loading process:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcess();
  }, [params.id, businessId]);

  if (loading && !processData) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-400" />
        <p className="text-sm">Loading process graph and agent telemetry...</p>
      </div>
    );
  }

  if (!processData) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p className="text-sm">Process not found.</p>
        <Link href="/" className="text-xs text-indigo-400 underline mt-2 block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'graph', label: 'Process Graph & Evidence', icon: Layers, badge: baselineVersion?.nodes?.length ? `${baselineVersion.nodes.length} Steps` : undefined },
    { id: 'recording', label: 'Screen Recording & CV Scrubber', icon: Film, badge: `${processData.recordingDurationSec || 58}s` },
    { id: 'agents', label: 'Multi-Agent Swarm (SSE)', icon: Sparkles, badge: 'Live' },
    { id: 'automation', label: 'Automation & Approval', icon: Code2, badge: workflow?.status === 'approved' ? 'Approved' : 'Review' },
    { id: 'verification', label: 'Sandbox Verification', icon: PlayCircle, badge: workflowRuns.length > 0 ? 'Verified' : undefined },
    { id: 'drift', label: 'Process Drift Auditor', icon: AlertTriangle, badge: driftEvents.length > 0 ? `${driftEvents.length} Alert` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-200 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-semibold">{processData.name}</span>
      </div>

      {/* Main Process Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                processData.status === 'drift_detected'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                  : processData.status === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              {processData.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {processData._id}</span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-400">Version: {baselineVersion?.version || 'v1.0'}</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-100">{processData.name}</h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">{processData.description}</p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('agents')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Re-Analyze Recording</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            <span>Sandbox Replay</span>
          </button>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    tab.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'graph' && (
          <ProcessGraphView version={baselineVersion} />
        )}

        {activeTab === 'recording' && (
          <RecordingPlayer
            recordingUrl={processData.recordingUrl}
            durationSec={processData.recordingDurationSec}
            nodes={baselineVersion?.nodes}
            evidence={baselineVersion?.evidence}
          />
        )}

        {activeTab === 'agents' && (
          <MultiAgentLiveConsole
            processId={processData._id}
            initialRuns={agentRuns}
            onPipelineComplete={fetchProcess}
          />
        )}

        {activeTab === 'automation' && (
          <AutomationApprovalView
            workflow={workflow}
            onApproved={fetchProcess}
            onTriggerSandbox={() => setActiveTab('verification')}
          />
        )}

        {activeTab === 'verification' && workflow && (
          <SandboxVerificationView
            workflowId={workflow._id}
            initialRuns={workflowRuns}
          />
        )}

        {activeTab === 'drift' && (
          <DriftDiffView
            driftEvents={driftEvents}
            baselineVersion={baselineVersion}
            currentVersion={currentVersion}
            onResolved={fetchProcess}
          />
        )}
      </div>
    </div>
  );
}
