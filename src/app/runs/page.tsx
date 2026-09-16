'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Terminal,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';
import { WorkflowRun } from '@/packages/shared/types';

export default function RunsPage() {
  const { businessId } = useBusiness();
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRuns() {
      try {
        const res = await fetch(`/api/processes/proc_quickcart_order?businessId=${businessId}`);
        const data = await res.json();
        setRuns(data.workflowRuns || []);
      } catch (err) {
        console.error('Failed to load runs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRuns();
  }, [businessId]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-200">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">Workflow Runs & Execution Logs</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Workflow Runs & Sandbox Verification Audit
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspecting execution logs, latency milestones, and visual verification artifacts.
            </p>
          </div>
        </div>
      </div>

      {/* Runs List */}
      <div className="space-y-4">
        {runs.map((run) => (
          <div
            key={run._id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  ✓
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    QuickCart Auto-Fulfillment Flow v1.0
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Run ID: {run._id}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {run.durationMs}ms runtime
                </span>
                <span className="text-[10px] uppercase font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {run.status}
                </span>
              </div>
            </div>

            {/* Step Logs */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Execution Telemetry
              </span>
              <div className="p-4 rounded-xl bg-[#060a12] border border-slate-800 font-mono text-xs space-y-2">
                {run.logs.map((l, i) => (
                  <div key={i} className="flex items-start gap-3 text-slate-300">
                    <span className="text-slate-400 shrink-0">{l.timestamp}</span>
                    <span className="text-indigo-400 font-bold shrink-0">[{l.stepId}]</span>
                    <span className={l.level === 'success' ? 'text-emerald-400' : 'text-slate-200'}>
                      {l.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Screenshots */}
            {run.screenshots && run.screenshots.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  Verified Screenshot Captures
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {run.screenshots.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video"
                    >
                      <img src={s} alt="Screenshot" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
