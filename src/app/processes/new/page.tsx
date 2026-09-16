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
  Cpu,
  Eye,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useBusiness } from '@/components/providers/BusinessContext';

interface ExtractedFrame {
  base64: string;
  mimeType: string;
  timestampSec: number;
  dataUrl: string;
}

export default function NewProcessPage() {
  const router = useRouter();
  const { businessId, currentUser } = useBusiness();
  const [activeMode, setActiveMode] = useState<'upload' | 'record' | 'sample'>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState('quickcart_orders');
  const [processName, setProcessName] = useState('New Business Process');
  const [description, setDescription] = useState(
    'Employee screen recording showing digital repetitive operations across software tools.'
  );

  // Video / Frame state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [isExtractingFrames, setIsExtractingFrames] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);

  // Screen recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Submission / AI Swarm state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [swarmStep, setSwarmStep] = useState<number>(0);
  const [swarmError, setSwarmError] = useState<string | null>(null);

  /**
   * Client-Side Frame Extraction using HTML5 Video + Canvas
   * No ffmpeg required - works 100% natively in all modern browsers!
   */
  const extractFrames = async (
    fileOrBlob: Blob,
    numFrames = 7
  ): Promise<ExtractedFrame[]> => {
    setIsExtractingFrames(true);
    setExtractionProgress(10);

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(fileOrBlob);
      video.src = url;

      video.onloadedmetadata = async () => {
        const duration = video.duration || 30;
        setVideoDuration(Math.round(duration));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          setIsExtractingFrames(false);
          return reject(new Error('Canvas 2D rendering context not available'));
        }

        // Standardize resolution for efficient multimodal token usage (max width 960px)
        const maxWidth = 960;
        const scale = Math.min(1, maxWidth / Math.max(video.videoWidth || maxWidth, 1));
        canvas.width = Math.round((video.videoWidth || 960) * scale);
        canvas.height = Math.round((video.videoHeight || 540) * scale);

        const frames: ExtractedFrame[] = [];
        const interval = duration / (numFrames + 1);

        try {
          for (let i = 1; i <= numFrames; i++) {
            const seekTime = Math.max(0.5, Math.min(duration - 0.5, i * interval));
            video.currentTime = seekTime;

            await new Promise((res) => {
              const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                res(true);
              };
              video.addEventListener('seeked', onSeeked);
            });

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const base64 = dataUrl.split(',')[1];

            frames.push({
              base64,
              mimeType: 'image/jpeg',
              timestampSec: Math.round(seekTime * 10) / 10,
              dataUrl,
            });

            setExtractionProgress(Math.round((i / numFrames) * 100));
          }

          URL.revokeObjectURL(url);
          setIsExtractingFrames(false);
          resolve(frames);
        } catch (err) {
          URL.revokeObjectURL(url);
          setIsExtractingFrames(false);
          reject(err);
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        setIsExtractingFrames(false);
        reject(new Error('Could not parse video file. Ensure format is .mp4, .webm, or .mov.'));
      };
    });
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setProcessName(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    setDescription(`Employee digital workflow recorded from ${file.name}`);

    try {
      const frames = await extractFrames(file, 7);
      setExtractedFrames(frames);
    } catch (err: any) {
      console.error('Frame extraction failed:', err);
      setSwarmError(err.message);
    }
  };

  // Live Screen Recording via getDisplayMedia
  const startScreenRecording = async () => {
    try {
      setSwarmError(null);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);

        setProcessName(`Live Screen Recording (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);

        try {
          const frames = await extractFrames(blob, 7);
          setExtractedFrames(frames);
        } catch (err: any) {
          console.error('Live frame extraction failed:', err);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Screen recording cancelled or not supported:', err);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Templates list (architecture scenarios)
  const templates = [
    {
      id: 'quickcart_orders',
      title: 'QuickCart Order Processing & Fulfillment',
      category: 'E-commerce Small Business (Example A)',
      duration: '58s',
      steps: '7 steps: Shopify → Stripe → QuickBooks → Sheets → Email',
      desc: 'Employee processes incoming order #9831. Computer Vision extracts all application transitions and converts to API workflow.',
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
    {
      id: 'quickcart_drift',
      title: 'QuickCart with Employee Excel Shadow Drift',
      category: 'Drift Auditor Demo (Section 17)',
      duration: '64s',
      steps: '8 steps: Contains unauthorized spreadsheet discount lookup',
      desc: 'Observed 2 weeks later. An employee introduces a manual Excel verification step. Drift Agent flags deviation with frame evidence.',
    },
  ];

  const handleTemplateSelect = (tmpl: any) => {
    setSelectedTemplate(tmpl.id);
    setProcessName(tmpl.title);
    setDescription(tmpl.desc);
  };

  // Launch AI Pipeline (Real Gemini AI Swarm or Template)
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSwarmError(null);
      setSwarmStep(1);

      // CASE 1: REAL UPLOAD OR RECORDING (REAL GEMINI AI SWARM)
      if ((activeMode === 'upload' || activeMode === 'record') && extractedFrames.length > 0) {
        // Step 1: Vision Agent
        setSwarmStep(1);

        const payload = {
          frames: extractedFrames.map((f) => ({
            base64: f.base64,
            mimeType: f.mimeType,
            timestampSec: f.timestampSec,
          })),
          processName,
          description,
          businessId,
          userId: currentUser._id,
          userName: currentUser.name,
          recordingVideoUrl: recordedBlobUrl || undefined,
        };

        // Artificial step progression for visual feedback while Gemini thinks
        const stepTimer1 = setTimeout(() => setSwarmStep(2), 2500);
        const stepTimer2 = setTimeout(() => setSwarmStep(3), 5000);
        const stepTimer3 = setTimeout(() => setSwarmStep(4), 7500);

        const res = await fetch('/api/processes/analyze-recording', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);

        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Gemini AI Swarm failed to analyze recording');
        }

        setSwarmStep(5);
        setTimeout(() => {
          router.push(`/processes/${data.processId}`);
        }, 1200);
        return;
      }

      // CASE 2: INSTANT ARCHITECTURE TEMPLATE DEMO
      setSwarmStep(2);
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
        setSwarmStep(3);
        await fetch(`/api/processes/${data.process._id}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sampleVideoType: selectedTemplate }),
        });

        setSwarmStep(5);
        setTimeout(() => {
          router.push(`/processes/${data.process._id}`);
        }, 800);
      }
    } catch (err: any) {
      console.error('Pipeline execution error:', err);
      setSwarmError(err.message || 'An unexpected error occurred during AI analysis');
      setIsSubmitting(false);
    }
  };

  const swarmSteps = [
    { num: 1, title: 'Vision Agent ("Eyes")', desc: 'Multimodal computer vision scanning extracted keyframes and recognizing software UI elements...' },
    { num: 2, title: 'Process Analyst Agent ("Business Analyst")', desc: 'Synthesizing visual clicks into business milestones, dependencies, and bottlenecks...' },
    { num: 3, title: 'Software Agent ("Developer")', desc: 'Context-mapping application steps to developer REST APIs, webhooks, and SDKs...' },
    { num: 4, title: 'Automation Agent ("Automation Engineer")', desc: 'Compiling production TypeScript automation script with retry policies...' },
    { num: 5, title: 'Verification Agent ("Tester")', desc: 'Auditing schema integrity, building baseline process graph, and deploying sandbox...' },
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
          <span className="text-slate-200 font-semibold">New Process Recording Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
            Teach ProcessMind a New Business Task
          </h1>
          <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini 3.6 Flash Active</span>
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Show ProcessMind how your business does a repetitive computer task once using a screen recording. Google Gemini AI understands the process with Computer Vision, identifies repeatable steps, coordinates 6 specialized agents, and creates automation.
        </p>
      </div>

      {/* Input Mode Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveMode('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMode === 'upload'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Employee Screen Recording (.mp4 / .webm)</span>
        </button>

        <button
          onClick={() => setActiveMode('record')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMode === 'record'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Record Screen Live in Browser</span>
        </button>

        <button
          onClick={() => setActiveMode('sample')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeMode === 'sample'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Preloaded Small Business Scenarios (Instant)</span>
        </button>
      </div>

      {/* Error Alert */}
      {swarmError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Pipeline Notice:</strong>
            <span>{swarmError}</span>
          </div>
        </div>
      )}

      {/* Mode 1: Real Local Video Upload */}
      {activeMode === 'upload' && (
        <div className="space-y-4">
          <div className="p-8 rounded-2xl bg-slate-950/80 border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 transition-colors text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <Upload className="w-7 h-7" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-slate-100">
                Upload Employee Screen Recording
              </h3>
              <p className="text-xs text-slate-400">
                Drop any desktop or browser screen recording (.mp4, .webm, .mov). The browser automatically extracts keyframes for the Gemini Vision Agent.
              </p>
            </div>

            <div className="pt-2">
              <input
                type="file"
                id="screen-upload"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="screen-upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Select Recording File from Computer</span>
              </label>
            </div>

            {videoFile && (
              <div className="text-xs text-slate-300 font-mono pt-2 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Selected: <strong>{videoFile.name}</strong> ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
              </div>
            )}
          </div>

          {/* Keyframe Extraction Progress */}
          {isExtractingFrames && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-400 font-semibold flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Extracting Computer Vision Keyframes across timeline...
                </span>
                <span className="font-mono text-slate-300">{extractionProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${extractionProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Extracted Keyframe Previews */}
          {extractedFrames.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-slate-200">
                    Extracted {extractedFrames.length} Keyframes Ready for Multimodal Vision Agent
                  </h4>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                  CV Preprocessing Ready
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {extractedFrames.map((frame, i) => (
                  <div key={i} className="space-y-1">
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src={frame.dataUrl}
                        alt={`Keyframe ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Frame {i + 1}</span>
                      <span className="text-cyan-400 font-bold">{frame.timestampSec}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Live Browser Screen Recorder */}
      {activeMode === 'record' && (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center mx-auto text-rose-400">
            <Video className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-100">Live Browser Screen Recorder</h3>
            <p className="text-xs text-slate-400">
              Select your application window, tab, or desktop. Perform the repetitive task once, then click stop.
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
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 shadow-md"
              >
                ■ Stop Recording & Extract Frames
              </button>
            </div>
          )}

          {/* Extracted Frames from Live Recording */}
          {extractedFrames.length > 0 && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully Extracted {extractedFrames.length} Frames from Recording
                </span>
                <span className="text-[10px] font-mono text-slate-400">{recordingTime}s Recorded</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {extractedFrames.map((frame, i) => (
                  <div key={i} className="space-y-1">
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                      <img
                        src={frame.dataUrl}
                        alt={`Live Frame ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 block text-right">
                      {frame.timestampSec}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Pre-packaged Architecture Scenarios */}
      {activeMode === 'sample' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200">
            Choose an Architecture Scenario for Instant Simulation:
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

      {/* Process Metadata Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Process Metadata & Business Context</h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Process Name</label>
            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="e.g. Order Processing & QuickBooks Invoicing"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">
              Business Context / Instructions for AI Swarm
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what apps the employee uses and the expected business outcome..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>
              {extractedFrames.length > 0
                ? `${extractedFrames.length} keyframes will be analyzed with Gemini 3.6 Flash`
                : 'Upload or record a screen session, or select an architecture scenario above.'}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (activeMode !== 'sample' && extractedFrames.length === 0)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                AI Swarm Analyzing...
              </span>
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

      {/* Live Multi-Agent Swarm Execution Overlay Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Cpu className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    ProcessMind AI Swarm In Progress
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Google Gemini Multimodal Reasoning Architecture
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                6 Agents Active
              </span>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-3">
              {swarmSteps.map((step) => {
                const isCurrent = swarmStep === step.num;
                const isDone = swarmStep > step.num;

                return (
                  <div
                    key={step.num}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500 text-slate-100 shadow-md ring-1 ring-indigo-500/30'
                        : isDone
                        ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                        : 'bg-slate-950/20 border-slate-800/40 text-slate-500'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {step.num}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold">{step.title}</h4>
                      <p className="text-[11px] leading-relaxed opacity-80">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2 text-[11px] text-slate-400">
              Synthesizing process graph, evidence refs, and automation script...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
