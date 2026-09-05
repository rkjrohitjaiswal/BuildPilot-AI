# BuildPilot 🚀⚡
### AI-Powered Project Intelligence • Build Better. Defend Smarter.

**BuildPilot** transforms student skills, interests, constraints, and goals into realistic project blueprints, technical roadmaps, AI mentoring, and viva preparation — complete with 5-tier system architectures, week-by-week roadmaps, interactive checklists, external examiner viva defense questions, and a context-aware AI Mentor.

---

## 🎯 Problem
- **Decision Paralysis:** Final-year engineering and CS students struggle to choose capstone projects that match their actual technical capability.
- **Unfeasible Scopes:** Many students pick overly ambitious ideas without proper database, API, or cost planning, leading to missed deadlines.
- **Viva Defense Anxiety:** Students often struggle during external viva examinations because they cannot defend their architectural trade-offs, security choices, or system designs.
- **Generic AI Flaws:** Standard AI chatbots produce open-ended prose without realistic constraints, structured roadmaps, or actionable engineering blueprints.

---

## 💡 Solution
BuildPilot analyzes student constraints and synthesizes **exactly 3 personalized project blueprints** scored across Skill Match, Feasibility, and Innovation. It provides a dedicated **BuildPilot Project Workspace** featuring 5-tier architecture visualization, phased execution roadmaps, interactive checklists, an embedded **AI Technical Mentor**, and university viva examination preparation.

### The Core Workflow
```text
Student Profile (Skills, Interests, Team Size, Timeline, Budget)
      ↓
AI Analysis & Scoring (Skill Match, Feasibility, Innovation)
      ↓
3 Tailored Project Directions (Option 01 / 02 / 03)
      ↓
Dedicated Project Workspace
      ↓
5-Tier Architecture + Phased Roadmap + Interactive Checklist
      ↓
Context-Aware AI Mentor & Viva Defense Preparation
```

---

## 🌟 Key Features
1. **Intelligent Capability Onboarding & 1-Click Demo Personas**
   - Configure custom skills, domains, experience level, team size, duration, and budget.
   - 1-click Quick Demo Profiles (*Fullstack AI Student*, *IoT & Edge Systems*, *Cybersecurity Analyst*).
2. **AI Recommendation Engine (`/api/plan`)**
   - Synthesizes 3 distinct, defendable blueprints via OpenRouter and Google Gemini 2.5 Flash.
   - Computes Skill Match, Feasibility, Innovation, and Overall Fit percentages (0–100).
3. **BuildPilot Project Workspace**
   - Comprehensive project overview, problem statement, and solution architecture.
   - **5-Tier System Architecture Map:** Visualizes Client, API Gateway, Application Logic, Data & AI, and Deployment layers.
   - **Phased Sprint Roadmap:** Structured timeline with concrete milestone deliverables.
   - **Interactive Implementation Checklist:** Task completion tracking with live completion percentages and batch actions.
4. **BuildPilot AI Mentor (`/api/mentor`)**
   - Initialized with the selected project's full tech stack, roadmap, and student background.
   - Generates structured answers, key takeaways, next steps, copyable code snippets, and scope risk warnings.
   - Quick action prompts (*Explain Architecture*, *Help Me Code*, *Design Database*, *Prepare My Viva*, *Debug My Problem*).
   - Conversation history memory and JSON chat export.
5. **Academic Viva Defense Strategy**
   - Anticipates examiner questions tailored to the project's specific architectural trade-offs.
   - Provides structured technical defense pointers and reasoning.
6. **1-Click Blueprint & Chat Export**
   - Export full project specifications to formatted Markdown (`.md`).
   - Export AI Mentor conversations to JSON (`.json`).

---

## 🤖 AI Architecture
- **Inference Gateway:** OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`).
- **Foundation Model:** `google/gemini-2.5-flash` for high reasoning speed, strong JSON adherence, and low latency.
- **Defensive Parser & Normalizer:** Server-side sanitization strips markdown fences, bounds numeric scores (0–100), and populates guaranteed schema defaults.
- **Context Injection:** Injects active blueprint parameters into the AI Mentor prompt for high-precision technical answers.

---

## 🏗️ System Architecture

```
[ Browser Client / Next.js 16 UI ]
          │
          ├───────────────► POST /api/plan ───────────────┐
          │                 (Zod Profile Validation)       │
          │                                               ▼
          │                                      [ OpenRouter Gateway ]
          │                                               │ (Gemini 2.5 Flash)
          │                                               ▼
          ├───────────────► POST /api/mentor ─────────────┤
          │                 (Zod Mentor Validation)       │
          │                                               ▼
          └───────────────◄ [ Normalized JSON Responses ] ┘
```

---

## 🛠️ Tech Stack
- **Framework:** Next.js 16.3.4 (App Router, Turbopack)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Vanilla Tailwind CSS with Glassmorphism & Custom Dark Palette
- **AI Backend:** OpenRouter (`google/gemini-2.5-flash`)
- **Validation:** Zod
- **Icons & UI:** Custom SVG system icons, zero bulky external UI bloat

---

## 📡 API Endpoints

### 1. `POST /api/plan`
Generates 3 personalized final-year project blueprints.

**Request Body:**
```json
{
  "skills": ["React", "Python", "PostgreSQL"],
  "interests": ["AI/ML", "Web Development"],
  "experienceLevel": "Intermediate",
  "teamSize": "2",
  "duration": "3–4 months",
  "budget": "Under ₹5,000",
  "domain": "Artificial Intelligence & Data Science",
  "additionalNotes": "Optional syllabus constraints or notes"
}
```

### 2. `POST /api/mentor`
Engages the contextual AI Mentor with project and conversation history.

**Request Body:**
```json
{
  "project": { "title": "Smart Campus Assistant", "techStack": { "frontend": ["Next.js"] } },
  "studentProfile": { "skills": ["Next.js", "Python"], "experienceLevel": "Intermediate" },
  "conversation": [{ "role": "user", "content": "How do I structure the API?" }],
  "question": "What database schema should we start with for Phase 1?"
}
```

---

## 🔐 Environment Variables
Create `.env.local` in the project root:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
An example template is provided in `.env.example`:
```env
OPENROUTER_API_KEY=
```

---

## 💻 Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/rkjrohitjaiswal/BuildPilot-AI.git
cd BuildPilot-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Environment Variable
Add your `OPENROUTER_API_KEY` to `.env.local`.

---

## 🏃 Running the Project

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Production Build & Release
```bash
npm run build
npm run git:push
```

---

## 🧪 Testing

Run the automated regression test suite:
```bash
node test_final.mjs
```
The test suite validates:
- `POST /api/plan` HTTP 200, valid JSON, exactly 3 projects with full fields and 0–100 scores.
- `POST /api/mentor` HTTP 200, valid JSON, structured answer, key points, next steps, code, and warnings.
- `POST /api/plan` invalid payload HTTP 400 rejection.
- `POST /api/mentor` invalid payload HTTP 400 rejection.

---

## 🛡️ Security & Reliability
- **Zero Client Token Exposure:** `OPENROUTER_API_KEY` is accessed exclusively in server route handlers.
- **Git Security:** `.gitignore` protects all `.env*` files while tracking `.env.example`.
- **Zod Input Hardening:** Payload character limits and schema boundaries prevent injection attacks.
- **30-Second Timeout Protection:** Upstream requests are bound by `AbortController` timeouts.
- **No Mock Fallbacks:** Authentic error reporting with 1-click retry mechanisms.

---

## 🎬 Demo Walkthrough Flow
1. **Select Quick Demo Profile:** Click **⚡ Fullstack AI Student** (or IoT / Cybersecurity).
2. **Generate Blueprints:** Click **Generate 3 Project Blueprints** to watch real-time generation.
3. **Compare Options:** Compare scores across Option 01, 02, and 03.
4. **Open BuildPilot Workspace:** Select Option 01 to view the comprehensive workspace.
5. **Explore Architecture & Roadmap:** Inspect the 5-tier system design and phase deliverables.
6. **Complete Checklist:** Check off sprint tasks to observe dynamic progress updates.
7. **Ask BuildPilot AI Mentor:** Use quick actions (*Design Database*, *Explain Architecture*) or ask a custom question.
8. **Prepare for Viva:** Expand viva questions to review technical examiner defense points.
9. **Export Blueprint:** Download the markdown report or JSON chat transcript.

---

## 🏆 Hackathon Value
BuildPilot solves a ubiquitous problem for millions of university students by converting vague project ideas into structured, buildable, and defendable engineering roadmaps.

---

## ⚠️ Limitations
- **Code Scaffolding:** Provides code snippets and architecture blueprints, but does not auto-scaffold complete Git repositories in the current version.
- **Model Upstream:** Dependent on active internet connectivity and OpenRouter API availability.

---

## 🔮 Future Scope
- **1-Click GitHub Repository Scaffolding:** Generate starter boilerplate repositories with CI/CD workflows.
- **Audio Viva Simulator:** Real-time conversational AI examiner conducting mock viva sessions.
- **LMS Integration:** Export progress reports directly to university capstone portals.

---

## 📂 Project Structure
```
BuildPilot-AI/
├── .github/
│   └── workflows/
│       └── ci.yml            # Automated CI build & lint workflow
├── public/                 # Static assets
├── scripts/
│   └── git-push.mjs        # Professional 1-command release workflow
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── plan/route.ts     # Recommendation Engine Route
│   │   │   └── mentor/route.ts   # Contextual AI Mentor Route
│   │   ├── globals.css           # Tailwind CSS & Theme Tokens
│   │   ├── layout.tsx            # Root Layout
│   │   └── page.tsx              # Main Application Orchestrator
│   ├── components/
│   │   ├── AIMentor.tsx          # Interactive BuildPilot AI Mentor Console
│   │   ├── FeaturesSection.tsx   # Feature Highlights
│   │   ├── Footer.tsx            # Footer & Legal Notice
│   │   ├── Hero.tsx              # Hero Section
│   │   ├── HeroVisual.tsx        # Hero Graphic
│   │   ├── HowItWorks.tsx        # 4-Step Process Guide
│   │   ├── Navbar.tsx            # Navigation Bar
│   │   ├── ProfileForm.tsx       # Student Capability Onboarding & Demo Personas
│   │   ├── ProjectWorkspace.tsx  # BuildPilot Workspace, Architecture, Checklist, Viva
│   │   ├── TrustStrip.tsx        # Trust & Credibility Badges
│   │   └── WhatYouGet.tsx        # 3-Option Comparison & Blueprint Selector
│   ├── data/
│   │   └── options.ts            # Preset Skills, Interests & Options
│   └── types/
│       └── profile.ts            # TypeScript Interfaces & Zod Schemas
├── .env.example            # Environment Variable Template
├── .gitignore              # Git Ignore Configuration
├── ARCHITECTURE.md         # System Architecture & Flow Specification
├── DEMO_SCRIPT.md          # 3-Minute Live Hackathon Demo Script
├── HACKATHON_PITCH.md      # Pitch Materials & Elevator Pitches
├── JUDGE_QA.md             # Judge Q&A Preparation & Defensibility
├── package.json            # Project Dependencies & Scripts
├── README.md               # Main Documentation
└── tsconfig.json           # TypeScript Configuration
```
