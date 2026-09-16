'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  Maximize2,
  Clock,
  Sparkles,
  Sliders,
  Layers,
  Film,
} from 'lucide-react';
import { ProcessNode, ProcessEvidence } from '@/packages/shared/types';

interface RecordingPlayerProps {
  recordingUrl?: string;
  durationSec?: number;
  evidence?: ProcessEvidence[];
  nodes?: ProcessNode[];
  onSelectNode?: (node: ProcessNode) => void;
}

export function RecordingPlayer({
  recordingUrl = '/demo/quickcart_order_flow.mp4',
  durationSec = 58,
  evidence = [],
  nodes = [],
  onSelectNode,
}: RecordingPlayerProps) {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);

  // Use real process nodes/evidence if available, otherwise fallback to demo markers
  const dynamicMarkers = nodes.length > 0
    ? nodes.map((n, i) => ({
        sec: n.timestampSec || (i + 1) * 8,
        timestamp: n.timestamp || `00:${String((i + 1) * 8).padStart(2, '0')}`,
        label: n.label,
        screenshot: n.screenshot || '/demo/order_inbox.png',
        app: n.application,
        action: n.action,
        ocr: evidence[i]?.ocrText,
      }))
    : [
        { sec: 4, timestamp: '00:04', label: 'Shopify Inbox', screenshot: '/demo/order_inbox.png', app: 'Shopify Store', action: 'Review order', ocr: ['#9831', 'David K.'] },
        { sec: 11, timestamp: '00:11', label: 'Order #9831', screenshot: '/demo/order_detail.png', app: 'Shopify Store', action: 'Open order', ocr: ['Wireless Headphones'] },
        { sec: 19, timestamp: '00:19', label: 'Fraud Risk Check', screenshot: '/demo/risk_assessment.png', app: 'Shopify Fraud', action: 'Risk check', ocr: ['Risk: Low'] },
        { sec: 26, timestamp: '00:26', label: 'Stripe Payment', screenshot: '/demo/stripe_payment.png', app: 'Stripe Payments', action: 'Verify capture', ocr: ['$142.50'] },
        { sec: 37, timestamp: '00:37', label: 'QuickBooks Invoice', screenshot: '/demo/quickbooks_invoice.png', app: 'QuickBooks Online', action: 'Generate bill', ocr: ['INV-2026-1049'] },
        { sec: 48, timestamp: '00:48', label: 'Google Sheet Entry', screenshot: '/demo/google_sheet.png', app: 'Google Sheets', action: 'Append row', ocr: ['Orders!A:H'] },
        { sec: 55, timestamp: '00:55', label: 'Email Dispatch', screenshot: '/demo/email_confirm.png', app: 'SendGrid Mail', action: 'Send mail', ocr: ['Order Confirmed'] },
      ];

  const currentKeyframe = dynamicMarkers[activeFrameIndex] || dynamicMarkers[0];

  return (
    <div className="bg-slate-950/90 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl space-y-4 p-5">
      {/* Player Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Employee Screen Recording & Keyframe Inspector
          </h3>
          <span className="text-[10px] font-mono bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
            {durationSec}s Total · {dynamicMarkers.length} Keyframes Extracted
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              showAnnotations
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showAnnotations ? 'Computer Vision HUD: Active' : 'HUD: Hidden'}</span>
          </button>
        </div>
      </div>

      {/* Frame Screen Display */}
      <div className="relative aspect-video max-h-[460px] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl flex items-center justify-center group">
        <img
          src={currentKeyframe.screenshot}
          alt={currentKeyframe.label}
          className="w-full h-full object-contain bg-slate-950"
        />

        {/* Dynamic CV HUD Overlay */}
        {showAnnotations && (
          <div className="absolute top-3 left-3 bg-slate-900/90 border border-cyan-500/40 text-slate-200 text-xs px-3 py-1.5 rounded-lg backdrop-blur-md shadow-lg flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>CV ACTIVE: {currentKeyframe.app}</span>
            <span className="text-slate-400">|</span>
            <span className="text-amber-400">KEYFRAME @ {currentKeyframe.timestamp}</span>
          </div>
        )}

        {showAnnotations && currentKeyframe.ocr && currentKeyframe.ocr.length > 0 && (
          <div className="absolute top-3 right-3 bg-slate-900/90 border border-indigo-500/40 text-indigo-200 text-[11px] px-3 py-1.5 rounded-lg backdrop-blur-md font-mono hidden md:flex items-center gap-1.5">
            <span className="text-indigo-400">OCR:</span>
            <span>{currentKeyframe.ocr.slice(0, 3).join(' · ')}</span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-mono px-3 py-1.5 rounded-lg backdrop-blur-md max-w-sm truncate">
          Step: <strong className="text-white">{currentKeyframe.label}</strong>
          {currentKeyframe.action && <span className="text-slate-400"> — {currentKeyframe.action}</span>}
        </div>
      </div>

      {/* Scrubber & Keyframe Thumbnails */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>00:00</span>
          <span className="text-indigo-400 font-bold">
            Keyframe {activeFrameIndex + 1} of {dynamicMarkers.length}: {currentKeyframe.timestamp} — {currentKeyframe.label}
          </span>
          <span>00:{String(durationSec).padStart(2, '0')}</span>
        </div>

        {/* Thumbnail Track */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 overflow-x-auto">
          {dynamicMarkers.map((marker, idx) => {
            const isActive = activeFrameIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveFrameIndex(idx);
                  if (nodes[idx] && onSelectNode) onSelectNode(nodes[idx]);
                }}
                className={`p-1.5 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-400 ring-2 ring-indigo-500/30 shadow-md scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="aspect-video w-full rounded overflow-hidden mb-1 bg-slate-950">
                  <img
                    src={marker.screenshot}
                    alt={marker.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-200">
                    {marker.timestamp}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate max-w-[55px]">
                    {marker.app?.split(' ')[0] || 'Step'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
