'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RecommendedProject, ProfileFormState } from '../types/profile';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  keyPoints?: string[];
  nextSteps?: string[];
  code?: string;
  warnings?: string[];
  isError?: boolean;
  originalQuestion?: string;
}

interface AIMentorProps {
  project: RecommendedProject;
  studentProfile: ProfileFormState;
}

const QUICK_ACTIONS = [
  {
    label: 'Explain Architecture',
    icon: '🏗️',
    question:
      'Explain the architecture of my selected project and how each component communicates with the others.',
  },
  {
    label: 'Help Me Code',
    icon: '💻',
    question:
      'What should I implement first, and show me a practical code structure for the next module?',
  },
  {
    label: 'Design Database',
    icon: '🗄️',
    question:
      'Design the database structure for my selected project and explain the main tables, columns, and relationships.',
  },
  {
    label: 'Debug My Problem',
    icon: '🔍',
    question:
      'I am stuck while implementing my project. Give me a systematic debugging approach and ask me for the relevant error or code if necessary.',
  },
  {
    label: 'Prepare My Viva',
    icon: '🎓',
    question:
      'Act as my external examiner. Ask me important viva questions based specifically on this project and its architecture choices.',
  },
  {
    label: 'What Should I Build Next?',
    icon: '🗺️',
    question:
      'Based on my current roadmap, what should I implement next and why? Give me a concrete development priority order.',
  },
] as const;

// ─── Lightweight response formatter ───────────────────────────────────────────
function FormatAnswer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Numbered list item
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-outside pl-5 space-y-1 text-slate-200 text-sm">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list item
    if (/^[-*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-none space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-200">
              <span className="text-blue-400 font-bold mt-0.5 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Heading line (## or ###)
    if (/^#{1,3}\s/.test(line)) {
      elements.push(
        <p key={`h-${i}`} className="text-sm font-bold text-cyan-300 pt-1">
          {line.replace(/^#{1,3}\s/, '')}
        </p>
      );
      i++;
      continue;
    }

    // Bold-only line (entire line is **text**)
    if (/^\*\*(.+)\*\*:?\s*$/.test(line)) {
      elements.push(
        <p key={`bold-${i}`} className="text-sm font-bold text-white pt-0.5">
          {line.replace(/\*\*/g, '')}
        </p>
      );
      i++;
      continue;
    }

    // Empty line → spacer
    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} className="h-1" />);
      i++;
      continue;
    }

    // Normal paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="text-sm text-slate-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
      />
    );
    i++;
  }

  return <div className="space-y-2">{elements}</div>;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="font-mono text-xs bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700">$1</code>');
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Clipboard API may be unavailable in some contexts
    });
  };

  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden mt-2">
      <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="text-[11px] font-mono text-slate-500 ml-1">code snippet</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 rounded-lg hover:bg-slate-700 px-2 py-1"
          aria-label="Copy code"
        >
          {copied ? (
            <><span className="text-emerald-400">✓</span> Copied!</>
          ) : (
            <>📋 Copy</>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#0d1117] p-4 text-xs text-slate-200 font-mono leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function AIMentor({ project, studentProfile }: AIMentorProps) {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the chat container (not the whole page)
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversation, isLoading]);

  // Reset textarea height after clearing
  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
  };

  const submitQuestion = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed || isLoading) return;

      setQuestion('');
      resetTextarea();

      // Capture history snapshot BEFORE appending the new user message
      const historySnapshot = conversation
        .filter((m) => !m.isError)
        .slice(-18) // keep last 18 prior turns for context
        .map((m) => ({ role: m.role, content: m.content }));

      const userMsg: ConversationMessage = { role: 'user', content: trimmed };
      setConversation((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch('/api/mentor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project: {
              title: project.title,
              tagline: project.tagline,
              problem: project.problem,
              solution: project.solution,
              features: project.features,
              techStack: project.techStack,
              roadmap: project.roadmap,
              risks: project.risks,
              futureScope: project.futureScope,
            },
            studentProfile: {
              skills: studentProfile.skills,
              interests: studentProfile.interests,
              experienceLevel: studentProfile.experienceLevel,
              teamSize: studentProfile.teamSize,
              duration: studentProfile.duration,
              budget: studentProfile.budget,
              domain: studentProfile.domain,
            },
            conversation: historySnapshot,
            question: trimmed,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          const errMsg = data?.message || data?.error || `Server error (${res.status})`;
          setConversation((prev) => [
            ...prev,
            { role: 'assistant', content: errMsg, isError: true, originalQuestion: trimmed },
          ]);
          return;
        }

        const assistantMsg: ConversationMessage = {
          role: 'assistant',
          content: data.answer || '',
          keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
          nextSteps: Array.isArray(data.nextSteps) ? data.nextSteps : [],
          code: typeof data.code === 'string' ? data.code : '',
          warnings: Array.isArray(data.warnings) ? data.warnings : [],
        };
        setConversation((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Network error. Check your connection.';
        setConversation((prev) => [
          ...prev,
          { role: 'assistant', content: message, isError: true, originalQuestion: trimmed },
        ]);
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, conversation, project, studentProfile]
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const downloadConversation = () => {
    if (conversation.length === 0) return;
    const jsonStr = JSON.stringify(conversation, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-mentor-chat.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitQuestion(question);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    const el = e.target;
    el.style.height = '44px';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  const handleClearConversation = () => {
    setConversation([]);
    textareaRef.current?.focus();
  };

  const overallScore =
    project.overallScore ||
    Math.round((project.skillMatch + project.feasibility + project.innovation) / 3);

  const primaryTech = [
    ...(project.techStack.frontend?.slice(0, 2) ?? []),
    ...(project.techStack.backend?.slice(0, 1) ?? []),
    ...(project.techStack.ai?.slice(0, 1) ?? []),
  ].slice(0, 4);

  return (
    <section id="ai-mentor" aria-label="AI Mentor">
      <div className="rounded-xl border border-white/[0.08] bg-[#0B101B] p-6 sm:p-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-wider">
                Copilot
              </span>
              <span className="text-white font-mono">•</span>
              <h2 className="text-xl font-bold text-white">AI Mentor</h2>
            </div>
            <p className="text-xs text-slate-400">Context-aware engineering assistance for implementation, architecture, and viva defense.</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#06090F] px-3 py-1 text-xs font-mono text-slate-400 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            <span>Gemini Flash Active</span>
          </div>
        </div>

        {/* ── Context Card ── */}
        <div className="rounded-lg border border-white/[0.06] bg-[#06090F] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Active Context:
            </span>
            <p
              className="text-sm font-semibold text-white leading-snug truncate"
              title={project.title}
            >
              {project.title}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5 font-mono text-[10px]">
              {primaryTech.map((t) => (
                <span
                  key={t}
                  className="rounded bg-[#0B101B] border border-white/[0.06] px-2 py-0.5 text-slate-300"
                >
                  {t}
                </span>
              ))}
              {studentProfile.domain && studentProfile.domain !== 'Any Domain (Recommended)' && (
                <span className="rounded bg-[#0B101B] border border-white/[0.06] px-2 py-0.5 text-blue-300">
                  {studentProfile.domain}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 font-mono text-right hidden sm:block">
            <span className="text-xs text-slate-500 block">FIT SCORE</span>
            <span className="text-lg font-bold text-emerald-400">{overallScore}%</span>
          </div>
        </div>

        {/* ── Chat Container ── */}
        <div className="rounded-lg border border-white/[0.08] bg-[#06090F] overflow-hidden flex flex-col">

          {/* Messages scrollable area */}
          <div
            ref={chatScrollRef}
            className="min-h-[280px] max-h-[480px] overflow-y-auto p-4 sm:p-5 space-y-4 font-mono text-xs"
            role="log"
            aria-label="Conversation with AI Mentor"
            aria-live="polite"
          >
            {/* Empty state */}
            {conversation.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[220px] space-y-2 text-center">
                <p className="text-sm font-semibold text-slate-300 font-sans">Ready for your technical questions</p>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-sans">
                  Ask about code architecture, database schemas, API implementations, or viva examination strategy.
                </p>
              </div>
            )}

            {/* Conversation messages */}
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.isError
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-[#101726] text-blue-400 border border-white/10'
                  }`}
                  aria-hidden
                >
                  {msg.role === 'user' ? 'DEV' : 'AI'}
                </div>

                {/* Bubble */}
                <div
                  className={`min-w-0 max-w-[calc(100%-40px)] sm:max-w-[88%] rounded-lg p-4 space-y-3 font-sans ${
                    msg.role === 'user'
                      ? 'bg-[#101726] border border-blue-500/30 text-white'
                      : msg.isError
                      ? 'bg-rose-950/20 border border-rose-500/30'
                      : 'bg-[#0B101B] border border-white/[0.06] text-slate-200'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  ) : msg.isError ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-rose-300 font-mono">MENTOR ERROR</p>
                      <p className="text-xs text-rose-200 leading-relaxed break-words">{msg.content}</p>
                      {msg.originalQuestion && (
                        <button onClick={() => submitQuestion(msg.originalQuestion!)} className="text-[11px] underline text-rose-400 mt-1 block hover:text-rose-300 font-mono">Retry request</button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 min-w-0">
                      {/* Main answer */}
                      <FormatAnswer text={msg.content} />

                      {/* Key Points */}
                      {msg.keyPoints && msg.keyPoints.length > 0 && (
                        <div className="rounded-md border border-white/[0.06] bg-[#06090F] p-3 space-y-1.5 font-mono">
                          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                            Key Points
                          </span>
                          <ul className="space-y-1">
                            {msg.keyPoints.map((kp, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                <span className="text-blue-400 font-bold shrink-0">→</span>
                                <span className="break-words min-w-0 font-sans">{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Code block */}
                      {msg.code && msg.code.trim() && <CodeBlock code={msg.code} />}

                      {/* Next Steps */}
                      {msg.nextSteps && msg.nextSteps.length > 0 && (
                        <div className="rounded-md border border-white/[0.06] bg-[#06090F] p-3 space-y-1.5 font-mono">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                            Next Steps
                          </span>
                          <ol className="space-y-1 list-decimal list-outside pl-4 font-sans text-xs text-slate-300">
                            {msg.nextSteps.map((ns, i) => (
                              <li key={i} className="break-words">
                                {ns}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Warnings */}
                      {msg.warnings && msg.warnings.length > 0 && (
                        <div className="rounded-md border border-amber-500/20 bg-amber-950/10 p-3 space-y-1.5 font-mono">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            Scope Warnings &amp; Risks
                          </span>
                          <ul className="space-y-1 font-sans text-xs text-amber-200">
                            {msg.warnings.map((w, i) => (
                              <li key={i} className="break-words leading-relaxed">
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing / loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="shrink-0 h-6 w-6 rounded bg-[#101726] border border-white/10 text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5" aria-hidden>
                  AI
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-[#0B101B] px-4 py-2.5 flex items-center gap-2.5 font-mono text-xs text-slate-400">
                  <span className="animate-pulse text-blue-400">●</span>
                  <span>Synthesizing engineering context...</span>
                </div>
              </div>
            )}

            <div ref={scrollAnchorRef} />
          </div>

          {/* ── Input Area ── */}
          <div className="border-t border-white/[0.08] bg-[#0B101B] p-3 sm:p-4 space-y-2">
            <div className="flex gap-2 items-end">
              <textarea
                ref={textareaRef}
                id="mentor-chat-input"
                value={question}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
                placeholder="Ask about system architecture, code structures, viva defense, or debugging..."
                aria-label="Ask the AI Mentor a question"
                className="flex-1 resize-none rounded-lg border border-white/10 bg-[#06090F] px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 font-mono overflow-hidden"
                style={{ minHeight: '42px', maxHeight: '140px', height: '42px' }}
              />
              <button
                type="button"
                id="mentor-send-btn"
                onClick={() => submitQuestion(question)}
                disabled={isLoading || !question.trim()}
                aria-label="Send message to AI Mentor"
                className="shrink-0 h-[42px] px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-mono text-xs font-semibold flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Send ↵</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Engineering Queries:
          </span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick action buttons">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                disabled={isLoading}
                onClick={() => submitQuestion(action.question)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#06090F] hover:border-white/20 hover:bg-[#101726] hover:text-white px-2.5 py-1.5 text-xs font-mono text-slate-400 transition-all disabled:opacity-40"
              >
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Clear conversation ── */}
        {conversation.length > 0 && (
          <div className="flex justify-between items-center border-t border-white/[0.06] pt-3 text-xs font-mono text-slate-400">
            <span>
              {conversation.filter(m => m.role === 'user').length} prompt{conversation.filter(m => m.role === 'user').length !== 1 ? 's' : ''} in session
            </span>
            <div className="flex items-center gap-4">
              <button onClick={downloadConversation} className="hover:text-white transition-colors">Export JSON</button>
              <button
                type="button"
                onClick={handleClearConversation}
                disabled={isLoading}
                className="hover:text-rose-400 transition-colors disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
