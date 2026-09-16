'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Clock,
  Eye,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';
import { DriftEvent } from '@/packages/shared/types';
import { DriftDiffView } from '@/components/process/DriftDiffView';

export default function DriftAuditorPage() {
  const { businessId } = useBusiness();
  const [driftEvents, setDriftEvents] = useState<DriftEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrift = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/processes/proc_quickcart_order/drift?businessId=${businessId}`);
      const data = await res.json();
      setDriftEvents(data.driftEvents || []);
    } catch (err) {
      console.error('Failed to load drift events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrift();
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
          <span className="text-slate-200 font-semibold">Continuous Process Drift Auditor</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Continuous Process Drift Auditor
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Section 17 & 27: "The business does not only pay to analyze one video. It continues using the platform as its processes evolve."
            </p>
          </div>
        </div>
      </div>

      {/* Main Drift Comparison View */}
      <DriftDiffView driftEvents={driftEvents} onResolved={fetchDrift} />
    </div>
  );
}
