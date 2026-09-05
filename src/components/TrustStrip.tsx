import React from 'react';

const TRUST_ITEMS = [
  {
    tag: 'CUSTOM FIT',
    title: 'Profile-Driven Synthesis',
    description: 'Generated against your exact stack, interests, team size, and timeline constraints.',
  },
  {
    tag: 'FEASIBILITY',
    title: 'Academic & Scope Scoring',
    description: 'Evaluated against graduation deadlines, hardware budgets, and skill maturity levels.',
  },
  {
    tag: 'ARCHITECTURE',
    title: '5-Tier System Blueprints',
    description: 'Includes client UI, backend APIs, AI inference, relational schemas, and hosting tiers.',
  },
  {
    tag: 'DEFENSE',
    title: 'Examiner Viva Coaching',
    description: 'Anticipates external review questions with technical defense reasoning and trade-offs.',
  },
];

export function TrustStrip() {
  return (
    <section className="relative border-b border-white/[0.06] bg-[#080D17] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item, idx) => (
            <div
              key={item.title}
              className="relative rounded-lg border border-white/[0.06] bg-[#0B101B]/80 p-4 transition-all duration-150 hover:border-white/[0.12] hover:bg-[#101726]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-semibold text-blue-400 tracking-wider">
                  0{idx + 1} / {item.tag}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

