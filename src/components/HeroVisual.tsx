'use client';

import React, { useState } from 'react';

export function HeroVisual() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'metrics' | 'defense'>('architecture');

  return (
    <div className="relative w-full max-w-xl lg:max-w-none mx-auto">
      {/* Outer subtle shadow container */}
      <div className="relative rounded-lg border border-white/[0.08] bg-[#090E17] p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="font-mono text-[11px] text-slate-300 font-semibold tracking-wide">
              BUILDPILOT // PROJECT INTELLIGENCE
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>FIT: 92%</span>
          </div>
        </div>

        {/* Project Header Overview */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>SYNTHESIS_ID: BP-2026-CAPSTONE</span>
            <span className="text-blue-400">3 PATHS VIABLE</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Smart Campus AI: Automated Viva &amp; Code Defense System
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fullstack evaluation platform with AST repository parsing and automated examiner simulation.
          </p>
        </div>

        {/* Metric Bar Row */}
        <div className="grid grid-cols-3 gap-2 text-center py-1">
          <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
            <span className="font-mono text-xs font-bold text-emerald-400">96%</span>
            <span className="block text-[9px] font-mono text-slate-400 uppercase">Skill Match</span>
          </div>
          <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
            <span className="font-mono text-xs font-bold text-blue-400">91%</span>
            <span className="block text-[9px] font-mono text-slate-400 uppercase">Feasibility</span>
          </div>
          <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
            <span className="font-mono text-xs font-bold text-purple-400">89%</span>
            <span className="block text-[9px] font-mono text-slate-400 uppercase">Innovation</span>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex space-x-1 rounded bg-black/40 p-1 border border-white/[0.06] text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 rounded py-1 font-mono transition-all ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Architecture
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 rounded py-1 font-mono transition-all ${
              activeTab === 'metrics'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Roadmap
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('defense')}
            className={`flex-1 rounded py-1 font-mono transition-all ${
              activeTab === 'defense'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Viva Defense
          </button>
        </div>

        {/* Tab 1: Architecture Pipeline */}
        {activeTab === 'architecture' && (
          <div className="rounded border border-white/[0.06] bg-black/30 p-3.5 space-y-2.5">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
              5-Tier System Data Flow
            </span>
            <div className="flex items-center justify-between gap-1 overflow-x-auto text-[10px] font-mono">
              <div className="px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-center shrink-0">
                Next.js 16
              </div>
              <span className="text-slate-600">→</span>
              <div className="px-2 py-1.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 text-center shrink-0">
                FastAPI Gateway
              </div>
              <span className="text-slate-600">→</span>
              <div className="px-2 py-1.5 rounded bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-center shrink-0">
                Gemini Flash
              </div>
              <span className="text-slate-600">→</span>
              <div className="px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-center shrink-0">
                PostgreSQL
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/[0.04]">
              <span>Stack: React • Python • PostgreSQL • Vercel</span>
              <span className="text-emerald-400 font-semibold">Verified</span>
            </div>
          </div>
        )}

        {/* Tab 2: Roadmap */}
        {activeTab === 'metrics' && (
          <div className="rounded border border-white/[0.06] bg-black/30 p-3 space-y-2 text-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
              Execution Timeline (10 Weeks)
            </span>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between rounded bg-slate-900/60 p-1.5 border border-white/[0.04]">
                <span className="text-blue-400">PHASE 01 // W1-3</span>
                <span className="text-slate-300">AST Parser &amp; DB Schema</span>
              </div>
              <div className="flex items-center justify-between rounded bg-slate-900/60 p-1.5 border border-white/[0.04]">
                <span className="text-blue-400">PHASE 02 // W4-7</span>
                <span className="text-slate-300">AI Scoring &amp; API Router</span>
              </div>
              <div className="flex items-center justify-between rounded bg-slate-900/60 p-1.5 border border-white/[0.04]">
                <span className="text-blue-400">PHASE 03 // W8-10</span>
                <span className="text-slate-300">Viva Simulator &amp; Cloud Deploy</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Viva Defense */}
        {activeTab === 'defense' && (
          <div className="rounded border border-white/[0.06] bg-black/30 p-3 space-y-2 text-xs">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
              Anticipated Examiner Scrutiny
            </span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="rounded bg-slate-900/60 p-1.5 border border-white/[0.04]">
                <span className="text-purple-400 font-mono text-[10px] block">Q1 // ARCHITECTURE</span>
                <span>Why choose FastAPI over Flask for asynchronous code analysis?</span>
              </div>
              <div className="rounded bg-slate-900/60 p-1.5 border border-white/[0.04]">
                <span className="text-purple-400 font-mono text-[10px] block">Q2 // SECURITY</span>
                <span>How do you protect API tokens during client repository ingestion?</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Status Ribbon */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
          <span>CONTEXT: 2 MEMBERS • 3-4 MOS • ₹0-5K BUDGET</span>
          <span className="text-blue-400 font-semibold">DEPLOY READY</span>
        </div>
      </div>
    </div>
  );
}

