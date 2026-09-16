'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Terminal,
  RefreshCw,
  Sparkles,
  Eye,
  Briefcase,
  Code2,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { AgentTimelineEvent, AgentRun } from '@/packages/shared/types';

interface MultiAgentLiveConsoleProps {
  processId: string;
  initialRuns?: AgentRun[];
  onPipelineComplete?: () => void;
}

export function MultiAgentLiveConsole({
  processId,
  initialRuns = [],
  onPipelineComplete,
}: MultiAgentLiveConsoleProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [activeRunId, setActiveRunId] = useState<string | null>(
    initialRuns.length > 0 ? initialRuns[0]._id : null
  );
  const [timeline, setTimeline] = useState<AgentTimelineEvent[]>(
    initialRuns.length > 0 ? initialRuns[0].timeline : []
  );

  const startAnalysis = async () => {
    try {
      setIsRunning(true);
      setTimeline([]);

      const res = await fetch(`/api/processes/${processId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSimulated: true }),
      });
      const data = await res.json();
      const runId = data.runId;
      setActiveRunId(runId);

      // Start SSE listener
      const eventSource = new EventSource(`/api/agent-runs/${runId}/stream`);

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'COMPLETE') {
            setIsRunning(false);
            eventSource.close();
            if (onPipelineComplete) onPipelineComplete();
            return;
          }
          setTimeline((prev) => {
            const exists = prev.some((e) => e.id === parsed.id);
            if (exists) return prev;
            return [...prev, parsed];
          });
        } catch (e) {
          console.error('Error parsing SSE event:', e);
        }
      };

      eventSource.onerror = () => {
        setIsRunning(false);
        eventSource.close();
        if (onPipelineComplete) onPipelineComplete();
      };
    } catch (err) {
      console.error('Failed to trigger analysis:', err);
      setIsRunning(false);
    }
  };

  const getAgentBadge = (type: string) => {
    switch (type) {
      case 'vision':
        return {
          name: 'Vision Agent',
          tag: 'Eyes',
          icon: Eye,
          color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        };
      case 'process_analyst':
        return {
          name: 'Process Analyst',
          tag: 'Business Analyst',
          icon: Briefcase,
          color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        };
      case 'software':
        return {
          name: 'Software Agent',
          tag: 'Developer Tools',
          icon: Code2,
          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        };
      case 'automation':
        return {
          name: 'Automation Agent',
          tag: 'Automation Eng',
          icon: Cpu,
          color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        };
      case 'verification':
        return {
          name: 'Verification Agent',
          tag: 'Tester',
          icon: CheckCircle2,
          color: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
        };
      case 'drift':
        return {
          name: 'Drift Agent',
          tag: 'Process Auditor',
          icon: ShieldAlert,
          color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        };
      default:
        return {
          name: 'Coordinator',
          tag: 'Orchestrator',
          icon: Bot,
          color: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  return (
    <div className="bg-slate-950/90 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl space-y-0">
      {/* Console Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Multi-Agent Orchestration Engine
              {isRunning && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Live Pipeline Running
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              Coordinated state transitions: Vision → Process Analyst → Software → Automation → Verification
            </p>
          </div>
        </div>

        <button
          onClick={startAnalysis}
          disabled={isRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Video Stream...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trigger Multi-Agent Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Agents Swarm Roster Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-3 bg-slate-900/40 border-b border-slate-800/60 text-[10px]">
        {[
          { label: 'Vision Agent', role: 'Computer Vision', icon: Eye, color: 'text-cyan-400' },
          { label: 'Process Analyst', role: 'Business Logic', icon: Briefcase, color: 'text-indigo-400' },
          { label: 'Software Agent', role: 'Developer APIs', icon: Code2, color: 'text-emerald-400' },
          { label: 'Automation Agent', role: 'Workflow Codegen', icon: Cpu, color: 'text-purple-400' },
          { label: 'Verification Agent', role: 'Sandbox Tester', icon: CheckCircle2, color: 'text-teal-400' },
          { label: 'Drift Agent', role: 'Process Auditor', icon: ShieldAlert, color: 'text-rose-400' },
        ].map((agent, i) => {
          const Icon = agent.icon;
          return (
            <div
              key={i}
              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center gap-2"
            >
              <Icon className={`w-3.5 h-3.5 ${agent.color}`} />
              <div className="truncate">
                <span className="font-bold text-slate-200 block truncate">{agent.label}</span>
                <span className="text-slate-400 block truncate">{agent.role}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Stream Terminal Output */}
      <div className="p-4 max-h-96 overflow-y-auto font-mono text-xs space-y-3 bg-[#060a12]">
        {timeline.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <Terminal className="w-8 h-8 text-slate-400 mx-auto" />
            <p>Click "Trigger Multi-Agent Analysis" to run the 6 specialized agents against the recording.</p>
          </div>
        ) : (
          timeline.map((evt, idx) => {
            const badge = getAgentBadge(evt.agentType);
            const Icon = badge.icon;
            const isSuccess = evt.level === 'success';
            const isWarn = evt.level === 'warn';

            return (
              <div
                key={evt.id || idx}
                className={`p-3 rounded-lg border transition-all ${
                  isSuccess
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${badge.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      {badge.name} ({badge.tag})
                    </span>
                    <span className="text-slate-400 text-[10px] font-semibold">{evt.phase}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {evt.message}
                </p>

                {evt.data && (
                  <details className="mt-2">
                    <summary className="text-[10px] text-indigo-400 cursor-pointer hover:underline select-none">
                      Inspect Structured Agent Payload
                    </summary>
                    <pre className="mt-1 p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                      {JSON.stringify(evt.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
