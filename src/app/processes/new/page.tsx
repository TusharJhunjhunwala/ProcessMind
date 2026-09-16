'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Video,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Clock,
  Film,
  Layers,
  Code2,
  FileSpreadsheet,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';

export default function NewProcessPage() {
  const router = useRouter();
  const { businessId, currentUser } = useBusiness();
  const [activeMode, setActiveMode] = useState<'record' | 'upload' | 'sample'>('sample');
  const [selectedTemplate, setSelectedTemplate] = useState('quickcart_orders');
  const [processName, setProcessName] = useState('QuickCart Order Processing');
  const [description, setDescription] = useState(
    'Employee processes incoming orders from Shopify, verifies Stripe charge, enters QuickBooks invoice, updates Google Sheets, and sends SendGrid dispatch confirmation.'
  );

  // Screen recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Start real screen capture in browser
  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Screen recording access was cancelled or not supported:', err);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const templates = [
    {
      id: 'quickcart_orders',
      title: 'QuickCart Order Processing & Fulfillment (Recommended Demo)',
      category: 'E-commerce Small Business (Example A)',
      duration: '58s',
      steps: '7 steps: Shopify → Stripe → QuickBooks → Sheets → Email',
      desc: 'Employee processes incoming order #9831. Computer Vision extracts all application transitions and converts to API workflow.',
    },
    {
      id: 'quickcart_drift',
      title: 'QuickCart with Employee Excel Shadow Drift',
      category: 'Drift Auditor Demo (Section 17)',
      duration: '64s',
      steps: '8 steps: Contains unauthorized spreadsheet discount lookup',
      desc: 'Observed 2 weeks later. An employee introduces a manual Excel verification step. Drift Agent flags deviation with frame evidence.',
    },
    {
      id: 'accounting_invoices',
      title: 'Small Accounting Firm — Client Invoice Entry',
      category: 'Professional Services (Example B)',
      duration: '45s',
      steps: '6 steps: Email invoice → Find Client → Enter Data → Save',
      desc: 'Employee receives PDF client invoice, matches client record in accounting software, and records balance.',
    },
    {
      id: 'dev_bugfix',
      title: 'Developer Bug Investigation & Pull Request',
      category: 'Developer Tools Use Case (Example E)',
      duration: '52s',
      steps: '7 steps: Issue → GitHub Repo → Run Tests → Inspect Logs → PR',
      desc: 'Developer investigates error log in Git repo, runs test suite, and generates pull request. Connected to GitHub API.',
    },
  ];

  const handleTemplateSelect = (tmpl: any) => {
    setSelectedTemplate(tmpl.id);
    setProcessName(tmpl.title);
    setDescription(tmpl.desc);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          name: processName,
          description,
          sampleVideoType: selectedTemplate,
          recordingUrl:
            selectedTemplate === 'quickcart_drift'
              ? '/demo/quickcart_order_flow_drift.mp4'
              : '/demo/quickcart_order_flow.mp4',
          recordingDurationSec: selectedTemplate === 'quickcart_drift' ? 64 : 58,
          userId: currentUser._id,
          userName: currentUser.name,
        }),
      });

      const data = await res.json();
      if (data.process) {
        // Automatically trigger multi-agent pipeline!
        await fetch(`/api/processes/${data.process._id}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sampleVideoType: selectedTemplate }),
        });

        router.push(`/processes/${data.process._id}`);
      }
    } catch (err) {
      console.error('Failed to create process:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link href="/" className="hover:text-slate-200">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">New Process Recording Studio</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
          Teach ProcessMind a New Business Task
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          "Show ProcessMind how your business does a repetitive computer task once, and it turns that task into an understandable, testable, and automatable workflow."
        </p>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveMode('sample')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMode === 'sample'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Select Small Business Scenario (Instant Demo)
        </button>
        <button
          onClick={() => setActiveMode('record')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMode === 'record'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Record Screen Live in Browser
        </button>
        <button
          onClick={() => setActiveMode('upload')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMode === 'upload'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Upload Local Video File (.mp4 / .webm)
        </button>
      </div>

      {/* Mode 1: Pre-packaged Sample Scenarios */}
      {activeMode === 'sample' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200">
            Choose an Architecture Demo Scenario:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer select-none space-y-2.5 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                      {tmpl.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {tmpl.duration}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{tmpl.title}</h4>
                  <p className="text-xs text-slate-400">{tmpl.desc}</p>
                  <div className="pt-1 text-[11px] text-emerald-400 font-medium">
                    {tmpl.steps}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Live Browser Screen Recorder */}
      {activeMode === 'record' && (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            <Video className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-100">Live Browser Screen Recorder</h3>
            <p className="text-xs text-slate-400 mt-1">
              Capture your repetitive work window or desktop tab. ProcessMind extracts high-entropy frames for the Vision Agent.
            </p>
          </div>

          {!isRecording ? (
            <button
              onClick={startScreenRecording}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            >
              ● Start Live Screen Recording
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-rose-400 text-sm font-mono font-bold animate-pulse">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>RECORDING IN PROGRESS: {recordingTime}s</span>
              </div>
              <button
                onClick={stopScreenRecording}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600"
              >
                ■ Stop Recording & Process Frames
              </button>
            </div>
          )}

          {recordedBlobUrl && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-lg mx-auto">
              <p className="text-xs font-bold text-emerald-400 mb-2">
                ✓ Recording Captured ({recordingTime}s)
              </p>
              <video src={recordedBlobUrl} controls className="w-full rounded-lg max-h-48" />
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Local Upload */}
      {activeMode === 'upload' && (
        <div className="p-8 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-3">
          <Upload className="w-10 h-10 text-indigo-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-200">Drag & Drop Screen Recording</h4>
          <p className="text-xs text-slate-400">Supported formats: .mp4, .webm, .mov (30–90 seconds recommended)</p>
          <input type="file" accept="video/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500" />
        </div>
      )}

      {/* Metadata Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Process Identification</h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Process Name</label>
            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Business Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Clicking Launch triggers the 6 specialized AI agents through the state machine.
          </span>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            {isSubmitting ? (
              <span>Initializing Multi-Agent Pipeline...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Launch Multi-Agent Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
