'use client';

import React from 'react';
import Link from 'next/link';
import { useBusiness } from '@/components/providers/BusinessContext';
import { Video, ShieldCheck, UserCheck, Sparkles, ExternalLink, Cpu } from 'lucide-react';

export function Navbar() {
  const { currentUser, switchUserRole, businessName } = useBusiness();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: QuickCart Workspace & Auction Badges */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200">{businessName}</span>
          <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            Active Plan: Business
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-800 pl-4">
          <span className="text-[11px] text-slate-400 mr-1">Auction Features:</span>
          <span className="text-[10px] bg-slate-800/80 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
            🛠️ Dev Tools
          </span>
          <span className="text-[10px] bg-slate-800/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
            👁️ Computer Vision
          </span>
          <span className="text-[10px] bg-slate-800/80 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
            🤖 Multi-Agent
          </span>
          <span className="text-[10px] bg-slate-800/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
            🏢 Small Business
          </span>
        </div>
      </div>

      {/* Right: Role Switcher & New Process Button */}
      <div className="flex items-center gap-3">
        {/* Role toggle for testing Section 28 owner approval */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            Active Role:
          </span>
          <button
            onClick={() => switchUserRole('owner')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              currentUser.role === 'owner'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tushar (Owner)
          </button>
          <button
            onClick={() => switchUserRole('member')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              currentUser.role === 'member'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ayush (Member)
          </button>
        </div>

        {/* New Process CTA */}
        <Link
          href="/processes/new"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Video className="w-4 h-4" />
          <span>Record / New Process</span>
        </Link>
      </div>
    </header>
  );
}
