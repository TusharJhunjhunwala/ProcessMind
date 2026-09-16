'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Zap,
  PlayCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Code,
  Eye,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';
import { Process, DriftEvent, AuditLog } from '@/packages/shared/types';

export default function DashboardPage() {
  const { businessId, currentUser } = useBusiness();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [driftEvents, setDriftEvents] = useState<DriftEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [procRes, meRes] = await Promise.all([
          fetch(`/api/processes?businessId=${businessId}`),
          fetch(`/api/businesses/me?businessId=${businessId}`),
        ]);
        const procData = await procRes.json();
        const meData = await meRes.json();

        setProcesses(procData.processes || []);
        
        // Fetch drift events
        const driftRes = await fetch(`/api/processes/proc_quickcart_order/drift?businessId=${businessId}`);
        const driftData = await driftRes.json();
        setDriftEvents(driftData.driftEvents || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [businessId]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              ProcessMind Architecture Demo
            </span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              Live & Fully Operational
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            ProcessMind captures screen recordings of repetitive computer work, extracts UI actions with Computer Vision, coordinates 6 specialized AI agents, and monitors for process drift.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/processes/proc_quickcart_order"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open QuickCart Demo Flow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Auction Resources Mapping Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Code className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">1. Developer Tools</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Connects Shopify, Stripe, QuickBooks & GitHub repo APIs to eliminate fragile browser clicking.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">2. Computer Vision</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Analyzes employee screen recordings, extracts keyframes, and pinpoints active windows and UI elements.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">3. Multi-Agent Swarm</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Vision, Analyst, Software, Automation, Verification & Drift agents collaborate via state machine.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">4. Small Businesses</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Zero-engineer setup for QuickCart store. Owner approvals ensure safety before automated runs.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row (Section 18) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Processes</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">12</span>
            <span className="text-xs text-emerald-400 font-medium">+2 this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">E-commerce, Invoicing, CRM</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Automations</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">5</span>
            <span className="text-xs text-emerald-400 font-medium">100% verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Saves ~14.5 hours / week</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Running Jobs</span>
            <PlayCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100">1</span>
            <span className="text-xs text-sky-400 font-medium">Sandbox active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Order #9831 in test suite</p>
        </div>

        <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-800/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Drift Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-100">2</span>
            <span className="text-xs text-rose-400 font-semibold">Needs Review</span>
          </div>
          <p className="text-[11px] text-rose-300/70 mt-1">Unauthorized Excel Check step</p>
        </div>
      </div>

      {/* Process Drift Attention Alert */}
      {driftEvents.length > 0 && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-rose-200">
                  Process Drift Detected by Drift Agent (Auditor)
                </h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-semibold uppercase">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                A new screen recording from employee Alex revealed an extra manual step: <strong className="text-white">"Excel Secondary Audit Check"</strong> between Payment and Invoice creation at <span className="font-mono text-rose-300">00:31</span>.
              </p>
            </div>
          </div>

          <Link
            href="/drift"
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shrink-0 shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
          >
            <span>Review & Resolve Drift</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Business Processes Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Learned Business Processes</h2>
              <p className="text-xs text-slate-400">Processes extracted from small business employee recordings</p>
            </div>
            <Link
              href="/processes/new"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>+ Record New</span>
            </Link>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="divide-y divide-slate-800/80">
              {processes.map(proc => (
                <div
                  key={proc._id}
                  className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/processes/${proc._id}`}
                        className="text-sm font-bold text-slate-100 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                      >
                        {proc.name}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                          proc.status === 'drift_detected'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : proc.status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        }`}
                      >
                        {proc.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{proc.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {proc.recordingDurationSec}s recording
                      </span>
                      <span className="text-slate-400">●</span>
                      <span className="text-indigo-300 font-medium">94% API Feasibility</span>
                      <span className="text-slate-400">●</span>
                      <span className="text-slate-400">v1.0 Baseline</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/processes/${proc._id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>Inspect Graph</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Preloaded Example Workflows from Section 9-13 */}
              <div className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-85">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-200">
                      Example B: Client Invoice Entry & Accounting
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-800 text-slate-300 border-slate-700 uppercase">
                      Catalog Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Receive Client Invoice → Open Accounting Software → Find Client → Enter Invoice Data → Save Record → Confirmation.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Accounting Firm Workflow</span>
                    <span>●</span>
                    <span>6 Steps</span>
                  </div>
                </div>
                <Link
                  href="/processes/new?template=accounting"
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 shrink-0"
                >
                  Load Template
                </Link>
              </div>

              <div className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-85">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-200">
                      Example E: Developer Bug Investigation & PR
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-indigo-500/20 text-indigo-300 border-indigo-500/30 uppercase">
                      Dev Tools
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Open Issue → Open Git Repo → Search Error → Run Test → Inspect Logs → Create Pull Request.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Developer Tools Context</span>
                    <span>●</span>
                    <span>7 Steps</span>
                  </div>
                </div>
                <Link
                  href="/processes/new?template=developer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 shrink-0"
                >
                  Load Template
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Connected Software */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Small Business Fast Start</h3>
            
            <div className="space-y-2">
              <Link
                href="/processes/proc_quickcart_order"
                className="w-full p-3 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                      View QuickCart Order Process
                    </p>
                    <p className="text-[10px] text-slate-400">Interactive process graph & evidence</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/drift"
                className="w-full p-3 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-500/20 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-rose-300">
                      Inspect Detected Process Drift
                    </p>
                    <p className="text-[10px] text-slate-400">Side-by-side v1.0 vs v1.1 diff</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/integrations"
                className="w-full p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-700/50 flex items-center justify-center text-slate-300">
                    <Code className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-slate-100">
                      Developer Tools & APIs
                    </p>
                    <p className="text-[10px] text-slate-400">GitHub, Webhooks & REST sandbox</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Connected Developer Tools & Applications */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">Connected Software & APIs</h3>
              <Link href="/integrations" className="text-[11px] text-indigo-400 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Shopify Store', type: 'E-commerce REST', status: 'Connected', badge: 'Shopify Admin' },
                { name: 'Stripe Payments', type: 'Payment Gateway', status: 'Connected', badge: 'Webhooks active' },
                { name: 'QuickBooks Online', type: 'Invoicing / Tax', status: 'Connected', badge: 'Intuit v3' },
                { name: 'Google Sheets', type: 'Cloud Ledger', status: 'Connected', badge: 'Orders DB' },
                { name: 'SendGrid Email API', type: 'Transactional', status: 'Connected', badge: 'Verified' },
                { name: 'GitHub Repo', type: 'Dev Scripts', status: 'Connected', badge: 'quickcart/store' },
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{app.name}</span>
                    <span className="text-[10px] text-slate-400 block">{app.type}</span>
                  </div>
                  <span className="text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {app.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
