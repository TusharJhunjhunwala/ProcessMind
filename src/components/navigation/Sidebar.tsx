'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitGraph,
  Video,
  AlertTriangle,
  Code2,
  PlayCircle,
  Settings,
  Sparkles,
  Bot,
  Layers,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';

export function Sidebar() {
  const pathname = usePathname();
  const { businessName, currentUser } = useBusiness();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      label: 'Processes & Recordings',
      href: '/processes/proc_quickcart_order',
      icon: GitGraph,
      badge: '12',
    },
    {
      label: 'Recording Studio',
      href: '/processes/new',
      icon: Video,
      badge: 'New',
    },
    {
      label: 'Process Drift Auditor',
      href: '/drift',
      icon: AlertTriangle,
      badge: '2 Alerts',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      label: 'Developer Tools',
      href: '/integrations',
      icon: Code2,
      badge: 'GitHub',
    },
    {
      label: 'Workflow Runs',
      href: '/runs',
      icon: PlayCircle,
      badge: 'Live',
    },
    {
      label: 'Workspace Settings',
      href: '/settings',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-lg tracking-tight">ProcessMind</span>
              <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Small Business Edition</p>
          </div>
        </Link>
      </div>

      {/* Active Business Tenant Pill */}
      <div className="mx-4 mt-4 p-3 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-center justify-between">
        <div className="truncate">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Tenant Workspace</p>
          <p className="text-xs font-semibold text-slate-200 truncate">{businessName}</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Multi-Agent System Status Box */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-gradient-to-b from-slate-900/90 to-indigo-950/40 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="text-[11px] font-semibold text-slate-300">Multi-Agent Swarm</span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-400 font-medium text-center">
          <div className="p-1 rounded bg-slate-900 border border-slate-800">Vision: Ready</div>
          <div className="p-1 rounded bg-slate-900 border border-slate-800">Analyst: Ready</div>
          <div className="p-1 rounded bg-slate-900 border border-slate-800">Audit: Active</div>
        </div>
      </div>

      {/* Current User Role Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300">
            {currentUser.name.charAt(0)}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{currentUser.role} Role</p>
          </div>
        </div>
        <span
          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
            currentUser.role === 'owner'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {currentUser.role}
        </span>
      </div>
    </aside>
  );
}
