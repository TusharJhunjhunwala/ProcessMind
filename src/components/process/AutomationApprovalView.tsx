'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Lock,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Workflow } from '@/packages/shared/types';
import { useBusiness } from '@/components/providers/BusinessContext';

interface AutomationApprovalViewProps {
  workflow?: Workflow;
  onApproved?: () => void;
  onTriggerSandbox?: () => void;
}

export function AutomationApprovalView({
  workflow,
  onApproved,
  onTriggerSandbox,
}: AutomationApprovalViewProps) {
  const { currentUser } = useBusiness();
  const [copied, setCopied] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | undefined>(workflow);

  const isOwner = currentUser.role === 'owner';
  const isApproved = currentWorkflow?.status === 'approved' || currentWorkflow?.status === 'active';

  const handleCopy = () => {
    if (currentWorkflow?.codeScript) {
      navigator.clipboard.writeText(currentWorkflow.codeScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApprove = async () => {
    if (!currentWorkflow || !isOwner) return;

    try {
      setIsApproving(true);
      const res = await fetch(`/api/workflows/${currentWorkflow._id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          userName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.workflow) {
        setCurrentWorkflow(data.workflow);
        if (onApproved) onApproved();
      }
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setIsApproving(false);
    }
  };

  if (!currentWorkflow) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
        <Code2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-300">No Automation Plan Generated Yet</p>
        <p className="text-xs text-slate-400 mt-1">Run the Multi-Agent pipeline to synthesize the automation plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Approval Banner (Section 28) */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isApproved
            ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
            : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isApproved
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              {isApproved ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {isApproved
                    ? 'Automation Approved & Certified by Business Owner'
                    : 'Owner Approval Security Gate — Awaiting Verification'}
                </h3>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isApproved ? 'Approved' : 'Pending Owner Sign-off'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {isApproved
                  ? `Approved by ${currentUser.role === 'owner' ? currentUser.name : 'Sarah Lin (Owner)'}. Workflow authorized to run safely in sandbox testing environments.`
                  : 'To protect small businesses from unintended actions (Section 28), consequential automations require explicit Owner sign-off before sandbox or live deployment.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isApproved ? (
              <button
                onClick={handleApprove}
                disabled={!isOwner || isApproving}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                  isOwner
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:scale-105 active:scale-95'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                {isApproving ? (
                  <span>Signing Approval...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isOwner ? 'Approve Automation as Owner' : 'Owner Approval Required'}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onTriggerSandbox}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>Run Sandbox Verification Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!isOwner && !isApproved && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              You are currently logged in as <strong>Alex Chen (Member)</strong>. Switch to <strong>Sarah Lin (Owner)</strong> in the topbar to sign off on this automation.
            </span>
          </div>
        )}
      </div>

      {/* Planned Steps Table */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          Synthesized Workflow Steps ({currentWorkflow.steps.length} Steps)
        </h3>

        <div className="divide-y divide-slate-800/80 rounded-xl overflow-hidden border border-slate-800">
          {currentWorkflow.steps.map((step, idx) => (
            <div
              key={step.id}
              className="p-3.5 bg-slate-900/40 hover:bg-slate-800/40 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-bold text-slate-200">{step.name}</p>
                  <p className="text-[11px] font-mono text-slate-400">{step.action}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded">
                  {step.target}
                </span>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {step.method || 'API'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Executable Code Script Viewer */}
      {currentWorkflow.codeScript && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200">
                Generated TypeScript Workflow Script (Automation Agent Output)
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-80">
            {currentWorkflow.codeScript}
          </pre>
        </div>
      )}
    </div>
  );
}
