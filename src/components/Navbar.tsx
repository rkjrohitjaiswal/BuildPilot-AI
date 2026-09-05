'use client';

import React, { useState } from 'react';

interface NavbarProps {
  hasActiveWorkspace?: boolean;
}

export function Navbar({ hasActiveWorkspace = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#06090F]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand & Wordmark */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 border border-blue-400/40 text-white font-mono font-bold text-xs shadow-sm">
            BP
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
              Build<span className="text-blue-400">Pilot</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
              Project Intelligence
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors duration-150"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="hover:text-white transition-colors duration-150"
          >
            Capabilities
          </a>
          <a
            href="#what-you-get"
            className="hover:text-white transition-colors duration-150"
          >
            Recommendations
          </a>
          <a
            href="#profile-setup"
            className="hover:text-white transition-colors duration-150"
          >
            Profile Setup
          </a>
          {hasActiveWorkspace && (
            <a
              href="#project-workspace"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 text-xs font-mono text-blue-300 hover:text-white hover:bg-blue-500/20 transition-all"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>Active Workspace</span>
            </a>
          )}
        </nav>

        {/* Right Action */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-slate-400 border-r border-white/[0.08] pr-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>Gemini 2.5 Flash</span>
          </div>

          <a
            href="#profile-setup"
            className="rounded-md bg-blue-600 hover:bg-blue-500 border border-blue-400/40 px-3.5 py-1.5 text-xs font-semibold text-white transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            Build My Project
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {hasActiveWorkspace && (
            <a
              href="#project-workspace"
              className="inline-flex items-center gap-1 rounded bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-mono text-blue-300"
            >
              <span>Workspace</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090E17] px-4 pt-3 pb-5 space-y-2 text-xs">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-slate-300 hover:bg-slate-800/80 hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-slate-300 hover:bg-slate-800/80 hover:text-white"
          >
            Capabilities
          </a>
          <a
            href="#what-you-get"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-slate-300 hover:bg-slate-800/80 hover:text-white"
          >
            Recommendations
          </a>
          <a
            href="#profile-setup"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded px-3 py-2 text-slate-300 hover:bg-slate-800/80 hover:text-white"
          >
            Profile Setup
          </a>
          {hasActiveWorkspace && (
            <a
              href="#project-workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded px-3 py-2 text-blue-300 bg-blue-950/40 border border-blue-500/30"
            >
              Open Active Workspace
            </a>
          )}
          <div className="pt-2">
            <a
              href="#profile-setup"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-sm"
            >
              Build My Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}


