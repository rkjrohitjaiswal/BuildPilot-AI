import React from 'react';

const STEPS = [
  {
    num: '01',
    label: 'PROFILE',
    title: 'Capability Mapping',
    desc: 'Tell BuildPilot about your skills, interests, team size, duration, and budget constraints.',
  },
  {
    num: '02',
    label: 'ANALYZE',
    title: 'Feasibility Engine',
    desc: 'AI evaluates feasibility, technical scope, graduation deadlines, and academic defense value.',
  },
  {
    num: '03',
    label: 'BLUEPRINT',
    title: 'System Architecture',
    desc: 'Receive three viable project directions with 5-tier architecture, tech stack, and phase breakdown.',
  },
  {
    num: '04',
    label: 'BUILD',
    title: 'Execution & Defense',
    desc: 'Execute using the interactive roadmap, AI Mentor co-pilot, and viva examiner preparation.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-20 border-b border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0B101B] px-3 py-1 text-xs font-mono uppercase tracking-wider text-slate-400">
            <span>02 / Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            From skill mapping to viva defense.
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-300">
            A structured, 4-stage engineering pipeline designed to eliminate project uncertainty.
          </p>
        </div>

        {/* Horizontal Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => (
            <div
              key={s.num}
              className="relative rounded-lg border border-white/[0.06] bg-[#0B101B]/70 p-6 space-y-4 hover:border-white/15 transition-all group"
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="font-mono text-2xl font-black text-blue-400 group-hover:text-blue-300 transition-colors">
                  {s.num}
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
                  {s.label}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

