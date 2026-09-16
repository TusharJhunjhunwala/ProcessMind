'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Users,
  ShieldCheck,
  CreditCard,
  Building,
  Check,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';

export default function SettingsPage() {
  const { businessName, currentUser, switchUserRole } = useBusiness();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'business' | 'pro'>('business');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '$49 / mo',
      desc: 'For very small teams beginning to capture repetitive manual tasks.',
      features: [
        'Up to 3 Learned Processes',
        'Vision & Process Analyst Agents',
        'Browser automation runner',
        '7-day drift audit retention',
      ],
    },
    {
      id: 'business',
      name: 'Business Plan (Active)',
      price: '$199 / mo',
      desc: 'For growing e-commerce & SMB teams with multi-agent orchestration.',
      features: [
        'Unlimited Learned Processes',
        'All 6 Specialized AI Agents',
        'Developer Tools & API Connectors',
        'Continuous Process Drift Auditor',
        'Owner Approval Security Gates',
      ],
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro / Scale',
      price: '$499 / mo',
      desc: 'For automation-heavy businesses with high-frequency execution.',
      features: [
        'Everything in Business',
        'Custom Playwright sandbox clusters',
        'GitHub Enterprise SSO & RBAC',
        'Dedicated Process Auditor SLAs',
      ],
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-200">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">Workspace Settings</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Small Business Workspace Settings
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Tenant Isolation ID: <span className="font-mono text-indigo-300">biz_quickcart</span> · Multi-tenant scoped
            </p>
          </div>
        </div>
      </div>

      {/* Business Profile */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Building className="w-4 h-4 text-indigo-400" />
          Business Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Company Name</label>
            <input
              type="text"
              readOnly
              value={businessName}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Primary Industry</label>
            <input
              type="text"
              readOnly
              value="Online Retail & E-Commerce"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Team Members & Security Roles (Section 28) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Team Members & Owner Roles
          </h3>
          <span className="text-xs text-slate-400">
            Current active: <strong className="text-slate-200">{currentUser.name}</strong>
          </span>
        </div>

        <div className="divide-y divide-slate-800 rounded-xl overflow-hidden border border-slate-800 text-xs">
          <div className="p-4 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300">
                T
              </div>
              <div>
                <p className="font-bold text-slate-200">Tushar</p>
                <p className="text-[11px] text-slate-400">tushar@quickcart.demo</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                Owner (Full Approval Rights)
              </span>
              <button
                onClick={() => switchUserRole('owner')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  currentUser.role === 'owner'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {currentUser.role === 'owner' ? 'Active User' : 'Switch to Tushar'}
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400">
                A
              </div>
              <div>
                <p className="font-bold text-slate-200">Ayush</p>
                <p className="text-[11px] text-slate-400">ayush@quickcart.demo</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded">
                Member (Recording Upload Only)
              </span>
              <button
                onClick={() => switchUserRole('member')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  currentUser.role === 'member'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {currentUser.role === 'member' ? 'Active User' : 'Switch to Ayush'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SaaS Subscription Plans (Section 26) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            SaaS Subscription Tier (Section 26)
          </h3>
          <p className="text-xs text-slate-400">
            ProcessMind subscription packages designed for 5–50 employee businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-4 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100">{plan.name}</h4>
                  {plan.popular && (
                    <span className="text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-2xl font-bold text-slate-100">{plan.price}</span>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
