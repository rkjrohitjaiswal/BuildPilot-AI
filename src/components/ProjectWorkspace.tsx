'use client';

import React, { useState } from 'react';
import { RecommendedProject, ProfileFormState } from '../types/profile';
import { AIMentor } from './AIMentor';

interface ProjectWorkspaceProps {
  project: RecommendedProject | null;
  studentProfile: ProfileFormState;
  onBackToRecommendations: () => void;
}

export function ProjectWorkspace({ project, studentProfile, onBackToRecommendations }: ProjectWorkspaceProps) {
  // Store checked task IDs for interactive checklist
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [openVivaIndex, setOpenVivaIndex] = useState<number | null>(0);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  // Flatten roadmap tasks for interactive checklist
  const allTasks = project?.roadmap
    ? project.roadmap.flatMap((rm, phaseIdx) =>
        (rm.tasks || []).map((taskText, taskIdx) => ({
          id: `phase-${phaseIdx}-task-${taskIdx}`,
          phaseTitle: rm.phase,
          duration: rm.duration,
          text: taskText,
        }))
      )
    : [];

  const completedCount = allTasks.filter((t) => checkedTasks[t.id]).length;
  const totalTasks = allTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleCheckAllTasks = () => {
    const allChecked: Record<string, boolean> = {};
    allTasks.forEach((t) => {
      allChecked[t.id] = true;
    });
    setCheckedTasks(allChecked);
  };

  const handleResetTasks = () => {
    setCheckedTasks({});
  };

  const handleCopyBlueprint = () => {
    if (!project) return;
    const blueprintMarkdown = `# ${project.title}
**Tagline:** ${project.tagline}

## 1. Problem Statement
${project.problem}

## 2. Proposed Solution
${project.solution}

## 3. Fit Scores
- Skill Match: ${project.skillMatch}%
- Feasibility: ${project.feasibility}%
- Innovation: ${project.innovation}%
- Overall Fit: ${project.overallScore}%

## 4. Recommended Tech Stack
- Frontend: ${project.techStack.frontend?.join(', ') || 'N/A'}
- Backend: ${project.techStack.backend?.join(', ') || 'N/A'}
- Database: ${project.techStack.database?.join(', ') || 'N/A'}
- AI/ML: ${project.techStack.ai?.join(', ') || 'N/A'}
- Deployment: ${project.techStack.deployment?.join(', ') || 'N/A'}

## 5. Development Roadmap
${project.roadmap
  .map(
    (rm) => `### ${rm.phase} (${rm.duration})
Milestone: ${rm.deliverable}
Tasks:
${rm.tasks?.map((t) => `- ${t}`).join('\n')}`
  )
  .join('\n\n')}

## 6. Viva Examiner Q&A Preparation
${project.vivaQuestions?.map((q, i) => `Q${i + 1}: ${q}`).join('\n')}
`;

    navigator.clipboard.writeText(blueprintMarkdown).then(() => {
      setCopiedBlueprint(true);
      setTimeout(() => setCopiedBlueprint(false), 2500);
    });
  };

  if (!project) {
    return null;
  }

  const overallScore =
    project.overallScore ||
    Math.round((project.skillMatch + project.feasibility + project.innovation) / 3);

  return (
    <section id="project-workspace" className="relative py-12 sm:py-16 border-b border-white/[0.06] bg-[#06090F]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <button
            type="button"
            onClick={onBackToRecommendations}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0B101B] px-3.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white hover:border-white/20 hover:bg-[#101726] transition-all"
          >
            <span>← Back to Directions</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyBlueprint}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0B101B] px-3.5 py-1.5 text-xs font-mono text-slate-200 hover:border-white/20 hover:text-white transition-all"
              title="Copy markdown blueprint to clipboard"
            >
              {copiedBlueprint ? (
                <>
                  <span className="text-emerald-400">✓</span>
                  <span>Copied Markdown</span>
                </>
              ) : (
                <>
                  <span>Export Markdown</span>
                </>
              )}
            </button>

            <div className="inline-flex items-center gap-2 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              <span>AI ANALYZED</span>
            </div>
          </div>
        </div>

        {/* Sticky Sub-Navigation */}
        <div className="sticky top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2.5 bg-[#06090F]/95 backdrop-blur-md border-y sm:border sm:rounded-lg border-white/[0.08] flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-1 min-w-max">
            <a
              href="#workspace-overview"
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-[#101726] transition-colors"
            >
              Overview
            </a>
            <a
              href="#workspace-architecture"
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-[#101726] transition-colors"
            >
              Architecture
            </a>
            <a
              href="#workspace-tech"
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-[#101726] transition-colors"
            >
              Tech Stack
            </a>
            <a
              href="#workspace-roadmap"
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-[#101726] transition-colors"
            >
              Roadmap
            </a>
            <a
              href="#workspace-checklist"
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-[#101726] transition-colors"
            >
              Checklist
            </a>
            <a
              href="#ai-mentor"
              className="px-3 py-1.5 rounded-md text-blue-300 hover:text-blue-200 hover:bg-blue-950/40 transition-colors font-semibold"
            >
              AI Mentor
            </a>
            <a
              href="#workspace-viva"
              className="px-3 py-1.5 rounded-md text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950/40 transition-colors font-semibold"
            >
              Viva Defense
            </a>
          </div>
          <div className="hidden md:flex items-center gap-2 pl-4 text-slate-400 font-mono text-[11px] shrink-0 border-l border-white/[0.08]">
            <span>Tasks:</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
        </div>

        {/* SECTION A: COMMAND CENTER HEADER */}
        <div id="workspace-overview" className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                <span>Project Blueprint</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-words">
                {project.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {project.tagline}
              </p>
            </div>

            {/* Clean Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 w-full lg:w-auto font-mono text-center">
              <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-3">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">SKILL MATCH</span>
                <span className="text-xl font-bold text-emerald-400">{project.skillMatch}%</span>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-3">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">FEASIBILITY</span>
                <span className="text-xl font-bold text-blue-300">{project.feasibility}%</span>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-3">
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">INNOVATION</span>
                <span className="text-xl font-bold text-indigo-300">{project.innovation}%</span>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                <span className="block text-[10px] text-blue-400 uppercase tracking-wider font-bold">OVERALL FIT</span>
                <span className="text-xl font-bold text-white">{overallScore}%</span>
              </div>
            </div>
          </div>

          {/* Implementation Progress Bar */}
          <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                Implementation Progress ({completedCount}/{totalTasks} Tasks Complete)
              </span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* SECTION B: SYSTEM ARCHITECTURE & DATA FLOW */}
        <div id="workspace-architecture" className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
                System Topology
              </span>
              <h2 className="text-lg font-bold text-white">
                5-Tier Engineering Architecture
              </h2>
            </div>
            <span className="font-mono text-xs text-slate-500">Live Stack Flow</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
            {/* Tier 1: Client */}
            <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-400 font-bold">01 / CLIENT</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
              </div>
              <p className="font-bold text-white text-sm">
                {project.techStack.frontend?.[0] || 'Next.js Client'}
              </p>
              <p className="text-[11px] text-slate-400">
                {project.techStack.frontend?.slice(1).join(', ') || 'Tailwind, TypeScript'}
              </p>
            </div>

            {/* Tier 2: API Gateway */}
            <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-indigo-400 font-bold">02 / API LAYER</span>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
              </div>
              <p className="font-bold text-white text-sm">
                {project.techStack.backend?.[0] || 'REST / Router'}
              </p>
              <p className="text-[11px] text-slate-400">
                {project.techStack.backend?.slice(1).join(', ') || 'Route Handlers, Auth'}
              </p>
            </div>

            {/* Tier 3: AI Inference */}
            <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 font-bold">03 / AI ENGINE</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
              </div>
              <p className="font-bold text-white text-sm">
                {project.techStack.ai?.[0] || 'Gemini Flash'}
              </p>
              <p className="text-[11px] text-slate-400">
                {project.techStack.ai?.slice(1).join(', ') || 'Prompt Pipeline, RAG'}
              </p>
            </div>

            {/* Tier 4: Database */}
            <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-bold">04 / STORAGE</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <p className="font-bold text-white text-sm">
                {project.techStack.database?.[0] || 'PostgreSQL'}
              </p>
              <p className="text-[11px] text-slate-400">
                {project.techStack.database?.slice(1).join(', ') || 'Prisma / SQL Schema'}
              </p>
            </div>

            {/* Tier 5: Deployment */}
            <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">05 / DEPLOY</span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
              </div>
              <p className="font-bold text-white text-sm">
                {project.techStack.deployment?.[0] || 'Vercel / Cloud'}
              </p>
              <p className="text-[11px] text-slate-400">
                {project.techStack.deployment?.slice(1).join(', ') || 'CI/CD, Monitoring'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION C: SPECS & TECH STACK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Features & Problem/Solution */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Problem & Scope Specifications</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    Problem Definition
                  </span>
                  <p className="text-slate-300 leading-relaxed">{project.problem}</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Technical Solution
                  </span>
                  <p className="text-slate-300 leading-relaxed">{project.solution}</p>
                </div>
              </div>
            </div>

            {/* Core Features */}
            <div className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 space-y-4">
              <h2 className="text-base font-bold text-white">
                Core Feature Modules
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-white/[0.06] bg-[#06090F] p-3.5 space-y-1.5"
                  >
                    <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      Module 0{idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Tech Stack Directory */}
          <div id="workspace-tech" className="lg:col-span-4 rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 space-y-4">
            <h2 className="text-base font-bold text-white">
              Tech Stack Breakdown
            </h2>

            <div className="space-y-3.5 text-xs font-mono">
              {project.techStack.frontend?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Frontend</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.frontend.map((t) => (
                      <span key={t} className="rounded bg-[#06090F] border border-white/[0.06] px-2 py-0.5 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.techStack.backend?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Backend &amp; API</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.backend.map((t) => (
                      <span key={t} className="rounded bg-[#06090F] border border-white/[0.06] px-2 py-0.5 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.techStack.database?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Database</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.database.map((t) => (
                      <span key={t} className="rounded bg-[#06090F] border border-white/[0.06] px-2 py-0.5 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.techStack.ai?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">AI Inference</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.ai.map((t) => (
                      <span key={t} className="rounded bg-[#06090F] border border-white/[0.06] px-2 py-0.5 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.techStack.deployment?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Deployment</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.deployment.map((t) => (
                      <span key={t} className="rounded bg-[#06090F] border border-white/[0.06] px-2 py-0.5 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION D & E: ROADMAP & CHECKLIST */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Roadmap */}
          <div id="workspace-roadmap" className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Sprint Roadmap
                </span>
                <h2 className="text-lg font-bold text-white">
                  Phased Development Timeline
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-500">{project.roadmap.length} Phases</span>
            </div>

            <div className="space-y-6">
              {project.roadmap.map((rm, idx) => (
                <div key={idx} className="relative pl-5 border-l border-white/10 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-xs">
                    <span className="font-bold text-blue-400 uppercase">
                      Phase 0{idx + 1} • {rm.phase}
                    </span>
                    <span className="text-slate-500 bg-[#06090F] px-2 py-0.5 rounded border border-white/[0.06]">
                      {rm.duration}
                    </span>
                  </div>

                  {rm.deliverable && (
                    <p className="text-sm font-semibold text-white">
                      Deliverable: {rm.deliverable}
                    </p>
                  )}

                  {rm.tasks && rm.tasks.length > 0 && (
                    <ul className="space-y-1 text-xs text-slate-300 pt-1">
                      {rm.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-slate-600 font-mono">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Checklist */}
          <div id="workspace-checklist" className="lg:col-span-5 rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Task Board
                </span>
                <h2 className="text-lg font-bold text-white">
                  Checklist
                </h2>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleCheckAllTasks}
                  className="text-blue-400 hover:text-blue-300"
                >
                  All
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={handleResetTasks}
                  className="text-slate-500 hover:text-slate-400"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {allTasks.map((t) => {
                const isChecked = Boolean(checkedTasks[t.id]);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTask(t.id)}
                    className={`w-full text-left rounded-md p-3 border text-xs flex items-start gap-3 transition-all ${
                      isChecked
                        ? 'bg-[#06090F] border-emerald-500/30 text-slate-400 line-through'
                        : 'bg-[#06090F] border-white/[0.06] text-slate-200 hover:border-white/15'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-600 bg-[#0B101B]'
                      }`}
                    >
                      {isChecked && (
                        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-blue-400 font-semibold uppercase">
                          {t.phaseTitle}
                        </span>
                        <span className="text-slate-500">{t.duration}</span>
                      </div>
                      <span className="font-medium leading-snug">{t.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION F: AI MENTOR COPILOT */}
        <AIMentor project={project} studentProfile={studentProfile} />

        {/* SECTION G: VIVA DEFENSE PREPARATION */}
        {project.vivaQuestions && project.vivaQuestions.length > 0 && (
          <div id="workspace-viva" className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Academic Scrutiny
                </span>
                <h2 className="text-xl font-bold text-white">
                  Viva Defense Preparation
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Can you defend every technical decision?</p>
              </div>
              <span className="font-mono text-xs text-slate-500">
                {project.vivaQuestions.length} Examiner Questions
              </span>
            </div>

            <div className="space-y-3">
              {project.vivaQuestions.map((q, idx) => {
                const isOpen = openVivaIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-white/[0.06] bg-[#06090F] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenVivaIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 flex items-start justify-between gap-4 hover:bg-[#101726] transition-colors focus:outline-none"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-blue-400 mt-0.5">
                          0{idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-white leading-snug">{q}</span>
                      </div>
                      <span className="font-mono text-slate-400 font-bold text-sm">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/[0.06] bg-[#0B101B] p-4 text-xs text-slate-300 space-y-1.5">
                        <span className="font-mono text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                          Examiner Defense Reasoning:
                        </span>
                        <p className="leading-relaxed text-slate-200">
                          State your rationale directly: Explain the design pattern or protocol choice (e.g. REST/WebSockets vs polling, relational schemas, or token rate-limiting controls). Highlight trade-offs between implementation complexity, runtime latency, and academic defense feasibility.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={onBackToRecommendations}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0B101B] px-5 py-2.5 text-xs font-mono text-slate-300 hover:text-white hover:border-white/20 transition-all"
          >
            <span>← Back to Directions</span>
          </button>
        </div>
      </div>
    </section>
  );
}


