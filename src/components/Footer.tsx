import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#06090F] py-10 text-slate-400 text-xs font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-xs">
              BP
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight font-sans">
                BuildPilot
              </span>
              <p className="text-[11px] text-slate-400">
                AI-Powered Project Intelligence • Build Better. Defend Smarter.
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap gap-6 font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#profile-setup" className="hover:text-white transition-colors">
              Profile Setup
            </a>
            <a href="#what-you-get" className="hover:text-white transition-colors">
              Recommendations
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Capabilities
            </a>
          </div>

          {/* Status */}
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0B101B] px-3 py-1 text-[11px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} BuildPilot. Engineering Project Intelligence.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Powered by</span>
            <span className="text-slate-300">OpenRouter (Google Gemini 2.5 Flash)</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

