'use client';

import React, { useState } from 'react';
import { PlanApiResponse, RecommendedProject } from '../types/profile';

// Static preview fallback when no real generation has occurred yet
const SAMPLE_PROJECTS: RecommendedProject[] = [
  {
    title: 'SmartCampus AI: Automated Viva & Code Defense Simulator',
    tagline: 'Simulates live university external viva examinations with personalized code AST analysis',
    problem: 'Students struggle to articulate their architectural choices and code logic during intense external viva reviews.',
    solution: 'An AI engine that parses student repositories, extracts function call graphs, and asks technical defense questions.',
    skillMatch: 95,
    feasibility: 92,
    innovation: 90,
    overallScore: 92,
    whyItFits: [
      'Uses your existing React and Python skills effectively',
      'High academic valuation during final-year project defense',
      'Realistic scope for a 2-member team over 3-4 months',
    ],
    targetUsers: ['Final-year Engineering Students', 'University Professors', 'Hackathon Teams'],
    features: [
      'AST-based repository symbol extractor',
      'AI Examiner voice & text Q&A simulator',
      'Viva readiness score report with PDF export',
      'Interactive architecture diagram generator',
    ],
    techStack: {
      frontend: ['Next.js 16', 'Tailwind CSS', 'TypeScript'],
      backend: ['Python', 'FastAPI', 'Node.js'],
      database: ['PostgreSQL', 'Prisma'],
      ai: ['OpenAI / OpenRouter API', 'LangChain'],
      deployment: ['Vercel', 'Render'],
    },
    roadmap: [
      {
        phase: 'Phase 1: Architecture & AST Parser',
        duration: 'Weeks 1–3',
        tasks: ['Initialize repo', 'Build Python AST code scanner', 'Define DB schema'],
        deliverable: 'Functional code symbol parser CLI',
      },
      {
        phase: 'Phase 2: AI Examiner Engine',
        duration: 'Weeks 4–7',
        tasks: ['Integrate AI API prompt pipeline', 'Build question scoring module', 'Create REST endpoints'],
        deliverable: 'Working examiner API',
      },
      {
        phase: 'Phase 3: UI & Defense Report',
        duration: 'Weeks 8–10',
        tasks: ['Develop Next.js dashboard', 'Add voice input handling', 'Export defense score report'],
        deliverable: 'Deployable production app & viva presentation',
      },
    ],
    risks: [
      'Handling large repos with high file counts (mitigated by setting 50-file scan limits)',
      'API rate limits during peak demo usage',
    ],
    futureScope: [
      'Multi-language AST support for C++ and Java',
      'Automated plagiarism and AI code detection integration',
    ],
    vivaQuestions: [
      'Why choose FastAPI over Flask for async code parsing endpoints?',
      'How does your system restrict AI API token consumption on big repos?',
      'What design pattern was used for the AST symbol extractor module?',
    ],
  },
  {
    title: 'ShieldVault: Zero-Trust Micro-Access Verification System',
    tagline: 'Continuous contextual session authentication with biometrics and audit logging',
    problem: 'Traditional static password/session authentication is vulnerable to credential theft and session hijacking.',
    solution: 'A zero-trust middleware that continuously computes risk scores based on user behavior and biometric cues.',
    skillMatch: 88,
    feasibility: 86,
    innovation: 94,
    overallScore: 89,
    whyItFits: [
      'Applies your web development and cybersecurity interest',
      'Solves a critical real-world enterprise security issue',
      'Demonstrates advanced authentication & cryptography knowledge',
    ],
    targetUsers: ['Enterprise Dev SecOps', 'University IT Networks', 'Healthcare Data Portals'],
    features: [
      'Continuous session risk scoring engine',
      'WebAuthn hardware key & biometric MFA',
      'Immutable cryptographic event audit log',
      'Real-time threat alert dashboard',
    ],
    techStack: {
      frontend: ['React', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js', 'Express', 'Redis'],
      database: ['MongoDB', 'Redis Store'],
      ai: ['Scikit-learn Anomaly Detection'],
      deployment: ['Docker', 'AWS ECS'],
    },
    roadmap: [
      {
        phase: 'Phase 1: Threat Model & Auth Core',
        duration: 'Weeks 1–3',
        tasks: ['Define threat vectors', 'Implement WebAuthn registration', 'Setup Redis session store'],
        deliverable: 'Core zero-trust authentication server',
      },
      {
        phase: 'Phase 2: Risk Scoring & Anomaly Detection',
        duration: 'Weeks 4–7',
        tasks: ['Build risk calculation algorithm', 'Integrate continuous telemetry', 'Add crypto token rotation'],
        deliverable: 'Risk evaluation middleware',
      },
      {
        phase: 'Phase 3: Admin Console & Audit Report',
        duration: 'Weeks 8–10',
        tasks: ['Create real-time event dashboard', 'Run penetration tests', 'Finalize defense slides'],
        deliverable: 'Complete security portal & test suite',
      },
    ],
    risks: [
      'False positives during normal user IP shifts',
      'Latency overhead in risk middleware',
    ],
    futureScope: [
      'Hardware token integration (YubiKey)',
      'Decentralized identity (DID) compatibility',
    ],
    vivaQuestions: [
      'How does continuous authentication differ from standard OAuth 2.0?',
      'What cryptographic algorithm guarantees audit log immutability?',
      'How do you prevent session replay attacks when risk scores fluctuate?',
    ],
  },
  {
    title: 'PulseSense IoT: Edge AI Patient Vital Anomalies Monitor',
    tagline: 'Low-latency physiological signal processing with local TFLite anomaly classification',
    problem: 'Centralized cloud health monitors incur high transmission latency during critical patient cardiac events.',
    solution: 'Edge computing pipeline running quantized neural networks locally on microcontrollers to flag cardiac anomalies instantly.',
    skillMatch: 91,
    feasibility: 84,
    innovation: 96,
    overallScore: 90,
    whyItFits: [
      'Perfect match for Python and IoT hardware interests',
      'High innovation score for biomedical engineering showcases',
      'Strong hardware-software integration for academic defense',
    ],
    targetUsers: ['Hospitals & ICU Wards', 'Remote Rural Clinics', 'Elderly Care Facilities'],
    features: [
      'Multi-sensor MQTT telemetry ingestion',
      'Local TFLite arrhythmia signal classifier',
      'WebSockets real-time ECG waveform charting',
      'Emergency SMS & Web push notification pipeline',
    ],
    techStack: {
      frontend: ['Flutter', 'Dart', 'WebSockets'],
      backend: ['Python', 'MQTT Broker', 'FastAPI'],
      database: ['TimescaleDB', 'SQLite Edge'],
      ai: ['TensorFlow Lite', 'NumPy/SciPy'],
      deployment: ['Raspberry Pi / ESP32', 'Docker'],
    },
    roadmap: [
      {
        phase: 'Phase 1: Sensor Hardware & MQTT Stream',
        duration: 'Weeks 1–3',
        tasks: ['Connect sensors to ESP32', 'Publish telemetry over MQTT', 'Setup time-series DB'],
        deliverable: 'Streaming sensor hardware pipeline',
      },
      {
        phase: 'Phase 2: TFLite Anomaly Classifier',
        duration: 'Weeks 4–7',
        tasks: ['Train ECG spike model', 'Quantize model for edge deployment', 'Benchmarking inference speed'],
        deliverable: 'Edge AI inference engine',
      },
      {
        phase: 'Phase 3: Flutter UI & Alert System',
        duration: 'Weeks 8–10',
        tasks: ['Build live waveform UI', 'Configure emergency SMS alerts', 'Field testing & documentation'],
        deliverable: 'Operational IoT health system',
      },
    ],
    risks: [
      'Sensor noise causing false arrhythmia alarms',
      'Memory constraints on microcontrollers',
    ],
    futureScope: [
      'Wearable BLE integration',
      'FDA software medical device compliance framework',
    ],
    vivaQuestions: [
      'Why choose TensorFlow Lite over sending raw sensor streams to cloud AI?',
      'How does TimescaleDB optimize time-series sensor data over standard SQL?',
      'What window size was used for ECG signal segmentation?',
    ],
  },
];

interface WhatYouGetProps {
  data: PlanApiResponse | null;
  onOpenWorkspace: (project: RecommendedProject) => void;
}

export function WhatYouGet({ data, onOpenWorkspace }: WhatYouGetProps) {
  const isRealData = data !== null && data.projects && data.projects.length > 0;
  const projectsList = isRealData ? data.projects : SAMPLE_PROJECTS;

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const selectedProject = projectsList[selectedIdx] || projectsList[0];

  const handleOpenWorkspace = () => {
    onOpenWorkspace(selectedProject);
  };

  return (
    <section id="what-you-get" className="relative py-16 sm:py-20 border-b border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0B101B] px-3 py-1 text-xs font-mono uppercase tracking-wider text-slate-400">
            <span>04 / Recommendations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Your Project Directions
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-300">
            {isRealData
              ? 'Based on your profile, BuildPilot synthesized three viable engineering blueprints.'
              : 'Based on your profile, BuildPilot synthesizes three tailored engineering blueprints.'}
          </p>
        </div>

        {/* Real AI Summary Banner if present */}
        {isRealData && data.summary && (
          <div className="mb-8 rounded-lg border border-white/[0.08] bg-[#0B101B] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              <span>⚡ Profile Synthesis Assessment</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1 bg-[#06090F] p-4 rounded-md border border-white/[0.06]">
                <span className="font-mono text-xs font-semibold text-blue-300 block uppercase">Skill Alignment</span>
                <p className="text-slate-300 leading-relaxed text-xs">{data.summary.profileFit}</p>
              </div>
              <div className="space-y-1 bg-[#06090F] p-4 rounded-md border border-white/[0.06]">
                <span className="font-mono text-xs font-semibold text-slate-300 block uppercase">Strategic Recommendation</span>
                <p className="text-slate-300 leading-relaxed text-xs">{data.summary.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* 3 Horizontal Recommendation Option Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {projectsList.map((p, idx) => {
            const isCurrent = selectedIdx === idx;
            const score = p.overallScore || Math.round((p.skillMatch + p.feasibility + p.innovation) / 3);
            const primaryTech = [
              ...(p.techStack.frontend?.slice(0, 2) ?? []),
              ...(p.techStack.backend?.slice(0, 1) ?? []),
              ...(p.techStack.database?.slice(0, 1) ?? []),
            ].slice(0, 4);

            return (
              <button
                key={p.title + idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`text-left rounded-lg p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'bg-[#101726] border-blue-500 shadow-sm'
                    : 'bg-[#0B101B] border-white/[0.06] hover:border-white/15 hover:bg-[#0E1522]'
                }`}
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      0{idx + 1} / OPTION
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {score}% FIT
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight leading-snug line-clamp-2">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {p.tagline}
                  </p>
                </div>

                <div className="space-y-3 w-full border-t border-white/[0.06] pt-3">
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    <div className="bg-[#06090F] p-1.5 rounded border border-white/[0.04]">
                      <span className="text-slate-500 block text-[9px]">SKILL</span>
                      <span className="text-emerald-400 font-bold">{p.skillMatch}%</span>
                    </div>
                    <div className="bg-[#06090F] p-1.5 rounded border border-white/[0.04]">
                      <span className="text-slate-500 block text-[9px]">FEASIBLE</span>
                      <span className="text-blue-300 font-bold">{p.feasibility}%</span>
                    </div>
                    <div className="bg-[#06090F] p-1.5 rounded border border-white/[0.04]">
                      <span className="text-slate-500 block text-[9px]">INNOV</span>
                      <span className="text-indigo-300 font-bold">{p.innovation}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {primaryTech.map((t) => (
                      <span key={t} className="rounded bg-[#06090F] px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/[0.04]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-semibold">
                    <span className={isCurrent ? 'text-blue-400' : 'text-slate-500'}>
                      {isCurrent ? 'Active Blueprint' : 'Select Direction'}
                    </span>
                    <span className={isCurrent ? 'text-blue-400' : 'text-slate-500'}>→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Blueprint Detail Preview */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
                Option 0{selectedIdx + 1} Blueprint Analysis
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedProject.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {selectedProject.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenWorkspace}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm shrink-0"
            >
              <span>Launch Workspace (Option 0{selectedIdx + 1})</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M3 12h18" />
              </svg>
            </button>
          </div>

          {/* Problem / Solution and Roadmap Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Problem & Solution & Why It Fits */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    Problem
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedProject.problem}</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Solution & Technical Scope
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedProject.solution}</p>
                </div>
              </div>

              {selectedProject.whyItFits && selectedProject.whyItFits.length > 0 && (
                <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Why It Fits Your Constraints
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {selectedProject.whyItFits.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Phased Roadmap Breakdown */}
            <div className="lg:col-span-5 rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
                  Roadmap Phases
                </span>
                <span className="font-mono text-[10px] text-slate-500">Execution Timeline</span>
              </div>

              <div className="space-y-3">
                {selectedProject.roadmap.map((rm, idx) => (
                  <div key={rm.phase + idx} className="relative pl-4 border-l border-white/10 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-blue-400 font-semibold uppercase">
                        Phase 0{idx + 1}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{rm.duration}</span>
                    </div>
                    {rm.deliverable && (
                      <p className="text-xs font-medium text-slate-200 mt-0.5">{rm.deliverable}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

