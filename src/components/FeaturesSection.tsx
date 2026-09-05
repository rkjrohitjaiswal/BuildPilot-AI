import React from 'react';

const FEATURES = [
  {
    num: '01',
    title: 'Deterministic Blueprint Engine',
    desc: 'Structured architecture specifications instead of endless unstructured chatbot conversations.',
  },
  {
    num: '02',
    title: 'Skill & Constraint Alignment',
    desc: 'Only suggests stacks you know or can pick up within your graduation semester duration.',
  },
  {
    num: '03',
    title: 'Timeline & Budget Guardrails',
    desc: 'Filters out excessive hardware costs or multi-year scopes for short-turnaround university deadlines.',
  },
  {
    num: '04',
    title: 'Viva Defense Strategy',
    desc: 'Prepares you for harsh external examiner questions with technical defense reasoning and trade-offs.',
  },
  {
    num: '05',
    title: 'Role & Module Allocation',
    desc: 'Divides project responsibilities cleanly among team members across frontend, API, AI, and database.',
  },
  {
    num: '06',
    title: '5-Tier Architectural Clarity',
    desc: 'Includes client UI, backend APIs, inference layers, database schemas, and hosting configurations.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-16 sm:py-20 border-b border-white/[0.06] bg-[#06090F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0B101B] px-3 py-1 text-xs font-mono uppercase tracking-wider text-slate-400">
            <span>05 / Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Built for rigorous academic review.
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-300">
            Engineered to solve the primary challenge of capstone projects: building an impressive system you can technically defend.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-white/[0.06] bg-[#0B101B]/80 p-5 space-y-2.5 hover:border-white/15 hover:bg-[#101726] transition-all"
            >
              <span className="font-mono text-xs font-bold text-blue-400">
                {f.num} / CAPABILITY
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

