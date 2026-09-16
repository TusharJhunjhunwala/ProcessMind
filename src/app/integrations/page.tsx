'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code2,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  ExternalLink,
  Zap,
  Play,
  Terminal,
  RefreshCw,
  Plus,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';
import { Application } from '@/packages/shared/types';

export default function IntegrationsPage() {
  const { businessId } = useBusiness();
  const [apps, setApps] = useState<Application[]>([]);
  const [githubInfo, setGithubInfo] = useState<any>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Custom API form
  const [newApiName, setNewApiName] = useState('ERP Inventory REST API');
  const [newApiUrl, setNewApiUrl] = useState('https://api.quickcart-erp.demo/v1/inventory');

  const fetchIntegrations = async () => {
    try {
      const res = await fetch(`/api/integrations?businessId=${businessId}`);
      const data = await res.json();
      setApps(data.applications || []);
      setGithubInfo(data.githubInfo);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [businessId]);

  const handleTestSandboxConnection = async (appName: string) => {
    try {
      setIsTestingApi(true);
      const res = await fetch(`/api/integrations/api/connect?businessId=${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: appName,
          baseUrl: 'https://api.mock.sandbox',
        }),
      });
      const data = await res.json();
      setTestResult(data.status);
    } catch (err) {
      console.error('Error testing API:', err);
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-200">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">Developer Tools & Software APIs</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Developer Tools & API Integration Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Auction Constraint Mapping: "Software Agent maps visible actions to Git repositories, APIs, webhooks and developer tools."
            </p>
          </div>
        </div>
      </div>

      {/* GitHub Repository Connector Banner (Section 13 & 21) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
              <GitBranch className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  GitHub Automation Repository: quickcart/store-automations
                </h3>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Connected & Synced
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Branch: <span className="font-mono text-slate-300">main</span> · Last commit: <span className="font-mono text-indigo-300">7e9b42a</span> "feat: add QuickBooks invoice line item calculation hook"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTestSandboxConnection('GitHub Webhook Dispatcher')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Test Webhook Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sandbox Test Latency Feedback */}
      {testResult && (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sandbox Connection Verified: <strong>{testResult.service}</strong> (Roundtrip Latency: {testResult.latencyMs}ms)</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">HTTP 200 OK</span>
        </div>
      )}

      {/* Connected Business Applications Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200">
          Connected Business SaaS & APIs ({apps.length} Active)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <div
              key={app._id}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded">
                  {app.type}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {app.connectionStatus}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-100">{app.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: {app._id}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTestSandboxConnection(app.name)}
                  disabled={isTestingApi}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Ping Sandbox</span>
                </button>
                <span className="text-[10px] text-slate-400">
                  {app.lastSyncedAt ? 'Synced' : 'Active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
