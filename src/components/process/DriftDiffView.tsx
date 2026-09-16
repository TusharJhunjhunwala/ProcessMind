'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Clock,
  Eye,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DriftEvent, ProcessVersion } from '@/packages/shared/types';
import { useBusiness } from '@/components/providers/BusinessContext';

interface DriftDiffViewProps {
  driftEvents?: DriftEvent[];
  baselineVersion?: ProcessVersion;
  currentVersion?: ProcessVersion;
  onResolved?: () => void;
}

export function DriftDiffView({
  driftEvents = [],
  baselineVersion,
  currentVersion,
  onResolved,
}: DriftDiffViewProps) {
  const { currentUser } = useBusiness();
  const [resolutionStatus, setResolutionStatus] = useState<'pending' | 'approved_v2' | 'dismissed'>('pending');
  const isOwner = currentUser.role === 'owner';

  const driftEvent = driftEvents.length > 0 ? driftEvents[0] : null;

  const handleApproveAsBaseline = () => {
    setResolutionStatus('approved_v2');
    if (onResolved) onResolved();
  };

  const handleDismissDrift = () => {
    setResolutionStatus('dismissed');
    if (onResolved) onResolved();
  };

  return (
    <div className="bg-slate-950/90 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-sm font-bold text-rose-200">
              Process Drift Auditor & Baseline Comparison
            </h3>
            <span className="text-[10px] uppercase font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded">
              Deviation Flagged
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Drift Agent continuously compares newly uploaded employee recordings against the approved baseline (Section 17).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Baseline: <strong className="text-slate-200">v1.0</strong> vs Observed: <strong className="text-rose-300">v1.1</strong>
          </span>
        </div>
      </div>

      {/* Side-by-Side Visual Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Approved Baseline v1.0 */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Approved Baseline v1.0 (QuickCart)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              7 Steps · Clean API Flow
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">1. New Order Notification (Shopify)</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">2. Open Store Dashboard & Order Details</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">3. Check Customer Fraud Risk Score</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">4. Check Stripe Payment Status</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">5. Create Invoice in QuickBooks</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">6. Update Google Sheets Ledger</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">7. Send Confirmation Email</div>
          </div>
        </div>

        {/* Right: Observed Recording v1.1 with DRIFT */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Observed Employee Recording (v1.1 Drift)
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-mono">
              8 Steps · 1 Unauthorized
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">1. New Order Notification (Shopify)</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">2. Open Store Dashboard & Order Details</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">3. Check Customer Fraud Risk Score</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">4. Check Stripe Payment Status</div>
            
            {/* DRIFT INSERTED STEP */}
            <div className="p-2.5 rounded-lg bg-rose-950/80 border-2 border-rose-500 text-white shadow-lg animate-pulse">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-200">⚠️ NEW STEP: Excel Secondary Audit Check</span>
                <span className="text-[10px] font-mono text-rose-300">00:31</span>
              </div>
              <p className="text-[11px] text-rose-200/90 mt-1">
                Employee manually inspected "DiscountCodes_2026.xlsx" before invoicing.
              </p>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">6. Create Invoice in QuickBooks</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">7. Update Google Sheets Ledger</div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">8. Send Confirmation Email</div>
          </div>
        </div>
      </div>

      {/* Drift Evidence Card (Section 17) */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Eye className="w-4 h-4 text-rose-400" />
            Computer Vision Evidence: frame_14.png @ 00:31
          </span>
          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">
            Confidence: 96%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl overflow-hidden border border-rose-500/40 bg-slate-950">
            <img
              src="/demo/excel_drift.png"
              alt="Excel Drift Evidence"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Drift Audit Summary:</span>
              <p>
                Employee Ayush opened local workbook <strong className="text-white">DiscountCodes_2026.xlsx</strong> to cross-reference code <strong className="text-emerald-400">"SUMMER15"</strong>.
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                Adds 2 minutes 40 seconds of manual latency per order. Not in certified workflow v1.0.
              </p>
            </div>

            {/* Owner Decision Gate (Section 17 & 24) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">
                Owner Review Decision (Tushar)
              </span>

              {resolutionStatus === 'pending' ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleApproveAsBaseline}
                    disabled={!isOwner}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isOwner
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Approve as Baseline v2.0 (Automate Excel Check)</span>
                  </button>

                  <button
                    onClick={handleDismissDrift}
                    disabled={!isOwner}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Disallow & Flag Deviation
                  </button>
                </div>
              ) : resolutionStatus === 'approved_v2' ? (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approved by Tushar: Baseline updated to v2.0. Spreadsheet API connector mapped.</span>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Deviation dismissed. Notification sent to employee Ayush to adhere to baseline v1.0.</span>
                </div>
              )}

              {!isOwner && resolutionStatus === 'pending' && (
                <p className="text-[10px] text-amber-300">
                  Switch to <strong>Tushar (Owner)</strong> role in the navbar to decide on this drift alert.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
