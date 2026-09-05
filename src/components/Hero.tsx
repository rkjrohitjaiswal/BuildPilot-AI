import React from 'react';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-white/[0.06]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              <span>Engineering Project Intelligence</span>
            </div>

            {/* Large headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Turn an idea into a project <span className="text-blue-400">you can defend.</span>
            </h1>

            {/* Short supporting paragraph */}
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              BuildPilot transforms your technical skills, interests, and constraints into production-grade engineering blueprints — complete with system architectures, execution roadmaps, and viva defense coaching.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#profile-setup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#06090F]"
              >
                <span>Build My Project</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7-7 7M3 12h18"
                  />
                </svg>
              </a>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0B101B] px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-[#101726] hover:border-white/20 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Micro value strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>No generic clone apps</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>5-tier system architectures</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Viva defense coaching</span>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Project Intelligence Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
