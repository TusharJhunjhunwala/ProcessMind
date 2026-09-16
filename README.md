# ProcessMind 🧠⚡

> **Small Business AI Process Learning & Automation SaaS**  
> *Show ProcessMind how your business does a repetitive computer task once using a screen recording, and it turns that task into an understandable, testable, and automatable workflow.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Multimodal-4285f4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Architecture](https://img.shields.io/badge/Architecture-6--Agent%20Swarm-purple?style=flat-square)](https://github.com/TusharJhunjhunwala/ProcessMind)

---

## 📌 The Product in Simple Words

A small business usually does not have a large automation or engineering team. Employees often spend hours doing repetitive computer tasks: copying order details, preparing invoices, updating spreadsheets, replying to customers, or updating CRMs.

**ProcessMind** lets the business owner or employee **show the system how the work is done once** using a screen recording. AI then understands the process with Computer Vision, identifies repeatable steps, proposes automation, checks whether the automation works, and monitors for ongoing process drift.

---

## 🏛️ Core End-to-End Architecture

```text
SMALL BUSINESS OWNER / EMPLOYEE
             │
             ▼
    Upload Screen Recording (or Live Capture)
             │
             ▼
   HTML5 Canvas / Keyframe Preprocessor
             │
             ▼
  👁️ VISION AGENT ("Eyes" - Gemini Multimodal Vision)
             │
             ▼
  📊 PROCESS ANALYST AGENT ("Business Analyst")
             │
             ▼
       PROCESS GRAPH (Nodes, Edges, Bottlenecks)
             │
             ▼
  🛠️ SOFTWARE / DEVELOPER AGENT ("Developer Tools Context")
             │
             ▼
  ⚡ AUTOMATION AGENT ("Automation Engineer")
             │
             ▼
      OWNER APPROVAL GATE
             │
             ▼
  🛡️ VERIFICATION AGENT ("Tester" - Sandbox Runner)
             │
             ▼
  🕵️ DRIFT AGENT ("Process Auditor" - Behavioral Diff)
             │
             ▼
     BUSINESS DASHBOARD & METRICS
```

---

## 🤖 The 6 Specialized AI Agents

| Agent | Analogous Role | Primary Responsibility |
|---|---|---|
| **Vision Agent** | *"Eyes"* | Examines chronological video keyframes using multimodal vision. Detects active windows, UI widgets (buttons, tables, inputs), and visible business data (OCR). |
| **Process Analyst** | *"Business Analyst"* | Synthesizes raw clicks into high-level business milestones, establishes data dependencies between steps, and flags operational bottlenecks. |
| **Software Agent** | *"Developer"* | Maps visual software steps to native developer tools, REST APIs (Shopify, Stripe, QuickBooks, Sheets), webhooks, and code repositories. |
| **Automation Agent** | *"Automation Engineer"* | Compiles production-grade TypeScript / Playwright automation scripts with error boundaries and retry logic. |
| **Verification Agent** | *"Tester"* | Validates schema integrity, runs automated sandbox test simulations, and records execution logs and timing. |
| **Drift Agent** | *"Process Auditor"* | Compares new employee recordings against the approved baseline to detect unauthorized manual steps (shadow IT/process drift). |

---

## 🎯 Auction Constraint & Resource Mapping

1. **Developer Tools**: Connects a business's software, REST APIs, and developer-facing tools (Shopify, Stripe, QuickBooks, Google Sheets, GitHub, SendGrid) to replace fragile browser clicking with robust API workflows.
2. **Computer Vision**: Ingests screen recordings, extracts keyframes at regular intervals in-browser, and performs multimodal scene understanding with Google Gemini.
3. **Multi-Agent Orchestration**: Coordinates specialized AI agents sequentially through a state machine with full audit trails and timeline telemetry.
4. **Small Businesses**: Zero-engineer setup designed for teams of 5–50 employees. Includes owner approval gates before any automated code runs in production.

---

## ✨ Features

- 🎥 **Video Recording Studio**:
  - **Upload**: Drag-and-drop any `.mp4`, `.webm`, or `.mov` file.
  - **Client-Side Keyframe Extraction**: Native HTML5 `<video>` + `<canvas>` frame extraction (no ffmpeg server binaries needed).
  - **Live Screen Recorder**: In-browser screen capture via `navigator.mediaDevices.getDisplayMedia`.
- 📊 **Interactive Process Graph**: Visually inspect discovered steps, state transitions, application icons, and data propagation edges.
- 🔍 **Computer Vision Scrubber & HUD**: Scrub through the employee's recording frame-by-frame with detected UI elements and OCR overlay.
- ⚡ **Automation & Approval Center**: Review AI-generated TypeScript scripts and approve workflows before execution.
- 🧪 **Sandbox Verification**: Execute real-time mock test runs with execution logs, step durations, and status checks.
- 🚨 **Process Drift Auditor**: Side-by-side visual diff detecting unauthorized manual steps introduced by employees over time.

---

## 📁 Preloaded Small Business Scenarios

The platform includes ready-to-run architecture scenarios demonstrating that the recording defines the process across different industries:

- **Example A (E-Commerce)**: QuickCart Order Processing (Shopify → Stripe → QuickBooks → Google Sheets → SendGrid).
- **Example B (Professional Services)**: Accounting Firm Client Invoice Entry (Email PDF → QuickBooks Bill → AP Ledger → Email).
- **Example C (Real Estate)**: Lead Ingestion & Property Availability (Portal Lead → CRM → MLS Availability → Agent Assignment).
- **Example D (Field Services)**: Service Business Request & Technician Dispatch (Customer Request → Work Order → Dispatch).
- **Example E (Developer Tools)**: Developer Bug Investigation (Issue → GitHub Repo → Run Tests → Inspect Logs → PR).
- **Process Drift Demo**: Shows an employee introducing an unauthorized "Excel Secondary Audit Check" between payment and invoice steps.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9 or higher
- **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TusharJhunjhunwala/ProcessMind.git
   cd ProcessMind
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your environment:**
   Copy `.env.example` to `.env.local` and add your free Google Gemini API key:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   NEXT_PUBLIC_APP_NAME=ProcessMind
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open ProcessMind:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Server Components & Route Handlers
- **AI / Multimodal Vision**: Google Gemini 3.6 Flash (`@google/generative-ai`)
- **Storage / Database**: Embedded JSON tenant-scoped store (`.data/db.json`)
- **Automation**: Playwright / REST API Connectors

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
