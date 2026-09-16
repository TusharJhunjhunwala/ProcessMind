'use client';

import React, { useState } from 'react';
import {
  ProcessNode,
  ProcessEdge,
  ProcessVersion,
  ProcessEvidence,
} from '@/packages/shared/types';
import {
  Layers,
  ArrowRight,
  Code2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Sparkles,
  Zap,
  Globe,
  UserCheck,
  X,
  FileCode,
} from 'lucide-react';

interface ProcessGraphViewProps {
  version?: ProcessVersion;
  onSelectNode?: (node: ProcessNode) => void;
}

export function ProcessGraphView({ version, onSelectNode }: ProcessGraphViewProps) {
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);

  if (!version || !version.nodes || version.nodes.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
        <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-300">No Process Graph Available</p>
        <p className="text-xs text-slate-400 mt-1">Upload a recording and trigger the Multi-Agent pipeline to extract the graph.</p>
      </div>
    );
  }

  const handleNodeClick = (node: ProcessNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'api':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Zap className="w-3 h-3" /> API Automated
          </span>
        );
      case 'browser':
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Browser Replay
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Human Gate
          </span>
        );
    }
  };

  const getAppColor = (app: string) => {
    if (app.includes('Shopify')) return 'from-emerald-950/40 border-emerald-600/40 hover:border-emerald-500';
    if (app.includes('Stripe')) return 'from-indigo-950/40 border-indigo-600/40 hover:border-indigo-500';
    if (app.includes('QuickBooks')) return 'from-teal-950/40 border-teal-600/40 hover:border-teal-500';
    if (app.includes('Google Sheets') || app.includes('Excel')) return 'from-green-950/40 border-green-600/40 hover:border-green-500';
    if (app.includes('SendGrid')) return 'from-sky-950/40 border-sky-600/40 hover:border-sky-500';
    return 'from-slate-900 border-slate-700 hover:border-slate-500';
  };

  return (
    <div className="space-y-6">
      {/* Visual Canvas View */}
      <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800/80 shadow-2xl relative overflow-x-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200">
              Interactive Process Flowchart ({version.version})
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              {version.nodes.length} Steps · Click any step to inspect Computer Vision evidence
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> API: {version.nodes.filter(n => n.automationMethod === 'api').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Browser: {version.nodes.filter(n => n.automationMethod === 'browser').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Human: {version.nodes.filter(n => n.automationMethod === 'human_review').length}
            </span>
          </div>
        </div>

        {/* Nodes Sequence */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 py-4 min-w-[850px]">
          {version.nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const isDrift = node.id.includes('drift');

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => handleNodeClick(node)}
                  className={`flex-1 min-w-[170px] p-3.5 rounded-xl bg-gradient-to-b ${getAppColor(
                    node.application
                  )} border transition-all cursor-pointer select-none group relative ${
                    isSelected
                      ? 'ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.03]'
                      : isDrift
                      ? 'border-rose-500/70 bg-rose-950/40 animate-pulse'
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  {/* Step Sequence Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900/90 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center border border-slate-700">
                      {index + 1}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-300">
                      {node.timestamp}
                    </span>
                  </div>

                  {/* Node Label & App */}
                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 min-h-[32px]">
                    {node.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {node.application}
                  </p>

                  {/* Method & Confidence */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    {getMethodBadge(node.automationMethod)}
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {Math.round(node.confidence * 100)}%
                    </span>
                  </div>

                  {/* Hover Eye indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                </div>

                {/* Arrow Connector between nodes */}
                {index < version.nodes.length - 1 && (
                  <div className="hidden md:flex flex-col items-center justify-center px-1 shrink-0 text-slate-400">
                    <ArrowRight className="w-4 h-4 text-indigo-400/80" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Evidence Drawer / Modal */}
      {selectedNode && (
        <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-semibold">
                  Timestamp: {selectedNode.timestamp}
                </span>
                {getMethodBadge(selectedNode.automationMethod)}
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  Vision Confidence: {Math.round(selectedNode.confidence * 100)}%
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{selectedNode.label}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Target Application: <strong className="text-slate-200">{selectedNode.application}</strong></p>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: Computer Vision Screenshot Evidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  Computer Vision Frame Capture
                </span>
                <span className="text-[10px] text-slate-400 font-mono">frame @ {selectedNode.timestamp}</span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner group relative">
                <img
                  src={selectedNode.screenshot}
                  alt={selectedNode.label}
                  className="w-full h-auto object-cover max-h-64"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-700 text-slate-300 text-[10px] font-mono px-2 py-1 rounded backdrop-blur">
                  Extracted via Canvas Frame Preprocessor
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <strong className="text-slate-200">Employee Visible Action: </strong>
                {selectedNode.action}
              </p>
            </div>

            {/* Right: Developer Tools Mapping & Automation Context */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Developer Tools & Software Context
                </span>

                {selectedNode.apiEndpoint ? (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="text-[11px] uppercase font-semibold text-slate-400">Target REST API Endpoint</p>
                    <code className="text-xs font-mono text-emerald-400 block bg-slate-900 p-2 rounded border border-slate-800 overflow-x-auto">
                      {selectedNode.apiEndpoint}
                    </code>
                    {selectedNode.suggestedTools && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedNode.suggestedTools.map((tool, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="text-[11px] uppercase font-semibold text-slate-400">Browser Fallback Automation</p>
                    <p className="text-xs text-slate-400">
                      No public REST API detected. Automation Agent assigned Playwright DOM selector:
                    </p>
                    <code className="text-xs font-mono text-sky-300 block bg-slate-900 p-2 rounded border border-slate-800">
                      {selectedNode.selector || 'button[data-action="submit"]'}
                    </code>
                  </div>
                )}
              </div>

              {selectedNode.notes && (
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                  <strong className="text-indigo-300">Agent Note: </strong>
                  {selectedNode.notes}
                </div>
              )}

              {selectedNode.parameters && (
                <div className="text-xs space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Extracted Parameters:</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                    {Object.entries(selectedNode.parameters).map(([k, v]) => (
                      <div key={k} className="truncate">
                        <span className="text-slate-400">{k}:</span> {v}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
