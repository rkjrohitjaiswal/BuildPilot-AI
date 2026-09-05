'use client';

import React, { useState } from 'react';
import { ProfileFormState, PlanApiResponse, ExperienceLevel, TeamSize, ProjectDuration, BudgetOption } from '../types/profile';
import {
  PRESET_SKILLS,
  PRESET_INTERESTS,
  EXPERIENCE_LEVELS,
  TEAM_SIZES,
  DURATION_OPTIONS,
  BUDGET_OPTIONS,
  DOMAIN_OPTIONS,
} from '../data/options';

interface ProfileFormProps {
  onResultsGenerated: (data: PlanApiResponse, profile: ProfileFormState) => void;
  hasResults: boolean;
}

// Preset personas for 1-click hackathon demoing
const DEMO_PERSONAS: { name: string; icon: string; profile: ProfileFormState }[] = [
  {
    name: 'Fullstack AI Student',
    icon: '⚡',
    profile: {
      skills: ['React', 'Next.js', 'Python', 'FastAPI', 'PostgreSQL'],
      interests: ['AI/ML', 'Web Development', 'Education'],
      experienceLevel: 'Intermediate',
      teamSize: '2',
      duration: '3–4 months',
      budget: 'Under ₹5,000',
      domain: 'Artificial Intelligence & Data Science',
      additionalNotes: 'Need a production-ready web app with automated AI evaluation for university final-year viva defense.',
    },
  },
  {
    name: 'IoT & Edge Systems',
    icon: '📡',
    profile: {
      skills: ['Python', 'C++', 'Machine Learning', 'Docker'],
      interests: ['IoT', 'Healthcare', 'AI/ML'],
      experienceLevel: 'Intermediate',
      teamSize: '3',
      duration: '5–6 months',
      budget: '₹5,000–₹15,000',
      domain: 'IoT, Embedded Systems & Hardware',
      additionalNotes: 'Connecting low-power edge microcontrollers with real-time cloud telemetry and anomaly detection.',
    },
  },
  {
    name: 'Cybersecurity Analyst',
    icon: '🛡️',
    profile: {
      skills: ['JavaScript', 'Node.js', 'Docker', 'SQL', 'Python'],
      interests: ['Cybersecurity', 'Cloud Computing', 'FinTech'],
      experienceLevel: 'Advanced',
      teamSize: '2',
      duration: '3–4 months',
      budget: 'Under ₹5,000',
      domain: 'Cybersecurity & Network Defense',
      additionalNotes: 'Building zero-trust access verification with cryptographic audit logs for enterprise security defense.',
    },
  },
];

export function ProfileForm({ onResultsGenerated, hasResults }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormState>({
    skills: ['React', 'Python', 'SQL'],
    interests: ['AI/ML', 'Web Development'],
    experienceLevel: 'Intermediate',
    teamSize: '2',
    duration: '3–4 months',
    budget: 'Under ₹5,000',
    domain: 'Any Domain (Recommended)',
    additionalNotes: '',
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customInterestInput, setCustomInterestInput] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiError, setApiError] = useState<{ title: string; message: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const applyDemoPersona = (persona: typeof DEMO_PERSONAS[0]) => {
    setFormData({ ...persona.profile });
    setValidationError(null);
    setApiError(null);
  };

  // Toggle skills
  const toggleSkill = (skill: string) => {
    setValidationError(null);
    setApiError(null);
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setCustomSkillInput('');
      setValidationError(null);
      setApiError(null);
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Toggle interests
  const toggleInterest = (interest: string) => {
    setValidationError(null);
    setApiError(null);
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const addCustomInterest = () => {
    const trimmed = customInterestInput.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, trimmed] }));
      setCustomInterestInput('');
      setValidationError(null);
      setApiError(null);
    }
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.skills.length === 0 && formData.interests.length === 0) {
      setValidationError('Please select at least 1 skill AND at least 1 interest area.');
      return;
    }
    if (formData.skills.length === 0) {
      setValidationError('Please select or add at least 1 skill.');
      return;
    }
    if (formData.interests.length === 0) {
      setValidationError('Please select or add at least 1 interest area.');
      return;
    }

    setValidationError(null);
    setApiError(null);
    setSuccessMessage(null);
    setLoading(true);
    setLoadingStep(1);

    const stepTimer = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (!response.ok) {
        setApiError({
          title: json.error || 'Generation Failed',
          message: json.message || 'An error occurred while generating project recommendations.',
        });
      } else {
        onResultsGenerated(json, formData);
        setSuccessMessage('Successfully generated 3 personalized AI project blueprints! Scrolling to results...');

        setTimeout(() => {
          const resultsElem = document.getElementById('what-you-get');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 400);
      }
    } catch (err: any) {
      setApiError({
        title: 'Connection Error',
        message: err?.message || 'Failed to connect to the server. Please check your network connection.',
      });
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  };

  return (
    <section id="profile-setup" className="relative py-16 sm:py-20 border-b border-white/[0.06]">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#0B101B] px-3 py-1 text-xs font-mono uppercase tracking-wider text-slate-400">
            <span>03 / Configuration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Define your engineering profile.
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-300">
            Your skills, domain interests, and execution constraints directly configure the synthesis engine.
          </p>

          {/* Quick Demo Personas */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Presets:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.name}
                  type="button"
                  onClick={() => applyDemoPersona(persona)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0B101B] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-blue-500/50 hover:text-white hover:bg-[#101726] transition-all disabled:opacity-50"
                  title={`Load preset: ${persona.name}`}
                >
                  <span>{persona.icon}</span>
                  <span>{persona.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Form Panel */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 sm:p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. SKILLS SECTION */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="text-blue-400">01</span>
                  Technical Skills <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">Select or type custom tags</span>
              </div>

              {/* Selected skills tags display */}
              <div className="flex flex-wrap items-center gap-2 min-h-[44px] rounded-lg border border-white/10 bg-[#06090F] p-3">
                {formData.skills.length === 0 ? (
                  <span className="text-xs text-slate-400 font-mono">No skills selected yet. Click tags below to add.</span>
                ) : (
                  formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 text-xs font-mono font-medium text-blue-300"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-400 hover:text-white focus:outline-none"
                        aria-label={`Remove ${skill}`}
                        disabled={loading}
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  disabled={loading}
                  placeholder="Type a skill (e.g. OpenCV, Kubernetes, PostgreSQL) and press Enter..."
                  className="flex-1 rounded-lg border border-white/10 bg-[#06090F] px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 font-mono"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  disabled={loading}
                  className="rounded-lg border border-white/10 bg-[#101726] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#162035] hover:text-white transition-colors disabled:opacity-50"
                >
                  + Add
                </button>
              </div>

              {/* Preset Skills Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_SKILLS.map((skill) => {
                  const active = formData.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      disabled={loading}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-md px-2.5 py-1 text-xs font-mono transition-all ${
                        active
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-[#06090F] text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:border-white/15'
                      } disabled:opacity-50`}
                    >
                      {active ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* 2. INTERESTS SECTION */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span className="text-blue-400">02</span>
                  Project Interests & Focus Areas <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">Select domains</span>
              </div>

              {/* Selected interests tags display */}
              <div className="flex flex-wrap items-center gap-2 min-h-[44px] rounded-lg border border-white/10 bg-[#06090F] p-3">
                {formData.interests.length === 0 ? (
                  <span className="text-xs text-slate-400 font-mono">No interests selected yet. Click tags below to add.</span>
                ) : (
                  formData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs font-mono font-medium text-indigo-300"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="text-indigo-400 hover:text-white focus:outline-none"
                        aria-label={`Remove ${interest}`}
                        disabled={loading}
                      >
                        &times;
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Custom Interest Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomInterest();
                    }
                  }}
                  disabled={loading}
                  placeholder="Type an interest (e.g. Autonomous Drones, BioTech) and press Enter..."
                  className="flex-1 rounded-lg border border-white/10 bg-[#06090F] px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 font-mono"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  disabled={loading}
                  className="rounded-lg border border-white/10 bg-[#101726] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#162035] hover:text-white transition-colors disabled:opacity-50"
                >
                  + Add
                </button>
              </div>

              {/* Preset Interests Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_INTERESTS.map((interest) => {
                  const active = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      disabled={loading}
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-md px-2.5 py-1 text-xs font-mono transition-all ${
                        active
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-[#06090F] text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:border-white/15'
                      } disabled:opacity-50`}
                    >
                      {active ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* 3. EXPERIENCE LEVEL */}
            <div className="space-y-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span className="text-blue-400">03</span>
                Experience Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EXPERIENCE_LEVELS.map((lvl) => {
                  const selected = formData.experienceLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      disabled={loading}
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
                      className={`flex flex-col items-start p-4 rounded-lg border text-left transition-all ${
                        selected
                          ? 'bg-[#101726] border-blue-500 text-white'
                          : 'bg-[#06090F] border-white/[0.06] text-slate-400 hover:border-white/15 hover:text-slate-200'
                      } disabled:opacity-50`}
                    >
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-1">
                        {lvl.label}
                      </span>
                      <span className="text-xs text-slate-300 leading-snug">{lvl.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* 4. CONSTRAINTS (Team Size, Duration, Budget) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Team Size */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  04 / Team Size
                </label>
                <div className="grid grid-cols-4 gap-1.5 rounded-lg border border-white/10 bg-[#06090F] p-1">
                  {TEAM_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      disabled={loading}
                      onClick={() => setFormData({ ...formData, teamSize: size })}
                      className={`rounded-md py-1.5 text-xs font-mono font-semibold transition-all ${
                        formData.teamSize === size
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      } disabled:opacity-50`}
                    >
                      {size} {size === '1' ? 'Solo' : 'Dev'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  disabled={loading}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value as ProjectDuration })
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#06090F] px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50 font-mono"
                >
                  {DURATION_OPTIONS.map((dur) => (
                    <option key={dur} value={dur} className="bg-[#0B101B] text-white">
                      {dur}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Budget
                </label>
                <select
                  value={formData.budget}
                  disabled={loading}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value as BudgetOption })
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#06090F] px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50 font-mono"
                >
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b} value={b} className="bg-[#0B101B] text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. PREFERRED DOMAIN */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                05 / Preferred Domain Focus
              </label>
              <select
                value={formData.domain}
                disabled={loading}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#06090F] px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50 font-mono"
              >
                {DOMAIN_OPTIONS.map((dom) => (
                  <option key={dom} value={dom} className="bg-[#0B101B] text-white">
                    {dom}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. OPTIONAL TEXTAREA */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex justify-between">
                <span>06 / Technical Constraints or Custom Notes</span>
                <span className="text-slate-500 lowercase font-normal">optional</span>
              </label>
              <textarea
                rows={3}
                value={formData.additionalNotes}
                disabled={loading}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Mention hardware restrictions, university syllabus rules, specific APIs you want to explore, or preliminary ideas..."
                className="w-full rounded-lg border border-white/10 bg-[#06090F] p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-400 resize-y focus:outline-none focus:border-blue-500 disabled:opacity-50 font-mono"
              />
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200 text-xs sm:text-sm flex items-center gap-3">
                <svg className="h-5 w-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{validationError}</span>
              </div>
            )}

            {/* API Error Display */}
            {apiError && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-4 sm:p-5 text-rose-200 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
                  <svg className="h-5 w-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{apiError.title}</span>
                </div>
                <p className="text-slate-300 leading-relaxed pl-7">{apiError.message}</p>
                <div className="pl-7 pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-md bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 px-3 py-1.5 text-xs font-semibold text-rose-100 transition-colors"
                  >
                    ↻ Retry Generation
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Verify your OPENROUTER_API_KEY if credentials failed.
                  </span>
                </div>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
                <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Animated Loading Progress Overlay */}
            {loading && (
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-5 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-300">
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-blue-400 border-t-transparent rounded-full" />
                    Synthesizing Project Blueprints...
                  </span>
                  <span className="text-blue-400">Step {loadingStep} of 3</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className={loadingStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {loadingStep >= 1 ? '✓' : '○'}
                    </span>
                    <span>1. Scoping technical skills ({formData.skills.length}) & domain constraints...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={loadingStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {loadingStep >= 2 ? '✓' : '○'}
                    </span>
                    <span>2. Evaluating timeline ({formData.duration}), team ({formData.teamSize}) & budget feasibility...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={loadingStep >= 3 ? 'text-blue-400 font-bold animate-pulse' : 'text-slate-600'}>
                      {loadingStep >= 3 ? '⚡' : '○'}
                    </span>
                    <span>3. Generating 3 custom architectures, tech stacks & viva defense roadmaps...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Primary Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Synthesizing Blueprints with BuildPilot...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Project Blueprints</span>
                    <svg className="h-4 w-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7M3 12h18" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

