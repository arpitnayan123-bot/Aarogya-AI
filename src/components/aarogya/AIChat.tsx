'use client';

// ============================================
// AAROGYA AI — AI COMPANION CHAT
// Multi-session conversational health assistant
// Connects to real AI via /api/ai/chat
// Falls back to simulateHealthChatReply on error
// ============================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Plus,
  MessageSquare,
  ShieldAlert,
  Bot,
  User,
  HelpCircle,
  Trash2,
  ArrowRight,
  Globe,
  Zap,
  AlertTriangle,
  RotateCw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import type { UserMetrics, Message, ChatSession } from '@/types/aarogya';
import { simulateHealthChatReply } from '@/data/aiSimulator';

interface AIChatProps {
  metrics: UserMetrics;
  setTab: (tab: string) => void;
}

const STORAGE_KEY = 'aarogya_chat_sessions_v1';

// ---- Default welcome session ----
const buildDefaultSession = (): ChatSession => ({
  id: 'session-default',
  title: 'Initial Symptoms Assessment',
  category: 'general',
  updatedAt: new Date().toISOString(),
  messages: [
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Namaste! I'm your **Aarogya AI Companion** — a clinical-grade conversational health assistant. I can help analyze your symptoms, give lifestyle guidance, suggest nutrition tips, and connect you with the right specialist.\n\nWhat health questions do you have today? You can type in English, Hindi, Tamil, Telugu, or any of 11 Indian languages.",
      timestamp: new Date().toISOString(),
      suggestions: [
        'Analyze my headache',
        'What is a healthy BMI?',
        'Go to AI Diet Planner',
        'Book a doctor',
      ],
    },
  ],
});

// ---- Helpers ----
const formatTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const AIChat: React.FC<AIChatProps> = ({ metrics, setTab }) => {
  // Sessions — SSR-safe (initialize with default, hydrate from localStorage in effect)
  const [sessions, setSessions] = useState<ChatSession[]>(() => [buildDefaultSession()]);
  const [hydrated, setHydrated] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-default');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSessionsMobile, setShowSessionsMobile] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatSession[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist sessions
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // storage full or blocked — non-fatal
    }
  }, [sessions, hydrated]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [sessions, activeSessionId, isTyping]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [inputText]);

  // ---- Send message to real AI ----
  const handleSendMessage = useCallback(
    async (textToSend: string) => {
      const cleanText = textToSend.trim();
      if (!cleanText || isTyping) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: cleanText,
        timestamp: new Date().toISOString(),
      };

      const sessionId = activeSessionId;
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const isFirstRealMsg =
            s.messages.length === 1 && s.messages[0].id === 'welcome-msg';
          return {
            ...s,
            messages: [...s.messages, userMsg],
            updatedAt: new Date().toISOString(),
            title: isFirstRealMsg
              ? cleanText.substring(0, 32) + (cleanText.length > 32 ? '…' : '')
              : s.title,
          };
        }),
      );

      setInputText('');
      setIsTyping(true);

      // Build context from active session for conversational memory
      const priorMessages = activeSession.messages
        .filter((m) => m.id !== 'welcome-msg')
        .slice(-6)
        .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      let aiText = '';
      let aiConfidence: number | undefined;
      let aiSafetyFlags: string[] = [];
      let usedFallback = false;

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: cleanText,
            context: {
              metrics,
              age: metrics.age,
              gender: metrics.gender,
              conversationHistory: [
                ...priorMessages,
                { role: 'user', content: cleanText },
              ],
            },
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (json.success && json.data?.response) {
          aiText = json.data.response as string;
          aiConfidence = typeof json.data.confidence === 'number' ? json.data.confidence : json.confidence;
          aiSafetyFlags = Array.isArray(json.safetyFlags) ? json.safetyFlags : [];
        } else {
          throw new Error(json.error || 'Empty AI response');
        }
      } catch (err) {
        // Fallback to local simulator — keep UX graceful
        console.warn('AIChat API failed, using simulator fallback:', err);
        const fallback = simulateHealthChatReply(cleanText, metrics);
        aiText = fallback.text;
        aiConfidence = 70;
        usedFallback = true;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toISOString(),
        confidence: aiConfidence,
        sources: usedFallback ? ['local-simulator'] : undefined,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                messages: [...s.messages, aiMsg],
                updatedAt: new Date().toISOString(),
              }
            : s,
        ),
      );
      // Stash safety flags on the session via a transient marker (not persisted as a separate field)
      if (aiSafetyFlags.length > 0) {
        (aiMsg as Message & { safetyFlags?: string[] }).safetyFlags = aiSafetyFlags;
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: [...s.messages, { ...aiMsg }],
                  updatedAt: new Date().toISOString(),
                }
              : s,
          ),
        );
      }
      setIsTyping(false);
    },
    [activeSession.messages, activeSessionId, isTyping, metrics],
  );

  const createNewSession = () => {
    const id = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id,
      title: 'New Aarogya Consultation',
      category: 'general',
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          sender: 'ai',
          text: "Hello! I'm your clinical conversational assistant. Ask me anything about your symptoms, vitals, nutrition, or daily wellness — I'll do my best to guide you.",
          timestamp: new Date().toISOString(),
          suggestions: ['Should I take pain relievers?', 'How to naturally boost immunity?', 'Book a doctor'],
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    setShowSessionsMobile(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      if (prev.length === 1) return prev; // keep at least one
      const remaining = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) setActiveSessionId(remaining[0].id);
      return remaining;
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    const s = suggestion.toLowerCase();
    if (s.includes('diet planner') || s.includes('diet plan')) {
      setTab('diet_plan');
    } else if (s.includes('book') || s.includes('schedule') || s.includes('appointment')) {
      setTab('appointments');
    } else if (s.includes('symptom checker') || s.includes('symptom check')) {
      setTab('symptom_checker');
    } else if (s.includes('breathing') || s.includes('mental health') || s.includes('mind')) {
      setTab('mental_health');
    } else if (s.includes('lab report') || s.includes('lab')) {
      setTab('lab_report');
    } else {
      handleSendMessage(suggestion);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  // ---- Render ----
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 md:h-[78vh] animate-fadeIn">
      {/* Sessions Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col bg-white border border-slate-100 rounded-3xl p-4 shadow-sm h-full">
        <button
          onClick={createNewSession}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-600/25 flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 mb-4"
        >
          <Plus className="w-4 h-4" /> New Consultation
        </button>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-slim">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
            Previous Consultations
          </span>
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                s.id === activeSessionId
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 font-semibold ring-1 ring-emerald-200/60'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg flex-shrink-0 ${
                    s.id === activeSessionId ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}
                >
                  <MessageSquare
                    className={`w-3.5 h-3.5 ${
                      s.id === activeSessionId ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {relativeTime(s.updatedAt)} · {s.messages.length} msg
                  </div>
                </div>
              </div>
              {sessions.length > 1 && (
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  aria-label="Delete session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Interface */}
      <section className="md:col-span-3 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-full overflow-hidden md:h-auto min-h-[70vh]">
        {/* Chat Header */}
        <header className="relative p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-white opacity-10 rounded-full blur-2xl -mr-12 -mt-12" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-emerald-300 opacity-20 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm text-white rounded-2xl border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-300 border-2 border-emerald-600 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
                Aarogya AI
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white uppercase tracking-wide">
                  Companion
                </span>
              </h2>
              <p className="text-xs text-emerald-50/90">
                Clinical-grade symptom analysis · 24/7 support
              </p>
              <p className="text-[10px] text-emerald-100/80 font-semibold mt-0.5 flex items-center gap-1">
                <Globe className="w-3 h-3" /> 11 Indian languages · Real AI
              </p>
            </div>
          </div>
          {/* Mobile session switcher */}
          <div className="relative z-10 md:hidden">
            <button
              onClick={() => setShowSessionsMobile((v) => !v)}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Sessions
              <ChevronDown className={`w-3 h-3 transition-transform ${showSessionsMobile ? 'rotate-180' : ''}`} />
            </button>
            {showSessionsMobile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20 animate-fadeInScale max-h-72 overflow-y-auto scrollbar-slim">
                <button
                  onClick={() => {
                    createNewSession();
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 mb-2"
                >
                  <Plus className="w-3.5 h-3.5" /> New
                </button>
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      setShowSessionsMobile(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs ${
                      s.id === activeSessionId
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative z-10 hidden sm:flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Not for emergencies
          </div>
        </header>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-slim bg-slate-50/40">
          {activeSession.messages.map((msg) => {
            const isEmergency = (msg as Message & { safetyFlags?: string[] }).safetyFlags?.includes(
              'emergency_symptom',
            );
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`p-2.5 rounded-2xl w-fit h-fit flex-shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="space-y-2 min-w-0">
                  <div
                    className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm whitespace-pre-line break-words ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    {/* Render basic markdown bold + bullets lightly (no extra deps) */}
                    {renderMarkdownLite(msg.text)}
                    {/* Confidence + fallback badges */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {msg.sender === 'ai' && typeof msg.confidence === 'number' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                          <Sparkles className="w-2.5 h-2.5" /> {Math.round(msg.confidence)}% confidence
                        </span>
                      )}
                      {msg.sender === 'ai' && msg.sources?.includes('local-simulator') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                          <RotateCw className="w-2.5 h-2.5" /> Offline mode
                        </span>
                      )}
                      {msg.sender === 'ai' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                          {formatTime(msg.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Emergency disclaimer */}
                  {isEmergency && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl p-3 animate-fadeInScale">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-red-700">
                        <strong className="font-bold">Emergency detected.</strong>{' '}
                        If you are experiencing a life-threatening symptom, call your local
                        emergency number (e.g. <span className="font-bold">112</span> in India /{' '}
                        <span className="font-bold">911</span> in the US) or go to the nearest
                        emergency room immediately. Do not wait for an AI response.
                      </div>
                    </div>
                  )}

                  {/* Suggestion chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-600 font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all"
                        >
                          {suggestion} <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 w-fit h-fit flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                <span
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
                <span className="text-[10px] text-slate-400 font-medium ml-2">
                  Aarogya AI is thinking…
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-2 sm:gap-3 items-end"
          >
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Describe symptoms in English, Hindi, Tamil, Telugu…  (Enter to send · Shift+Enter for newline)"
                rows={1}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 focus:bg-white shadow-sm resize-none scrollbar-slim transition-all"
                disabled={isTyping}
                style={{ minHeight: 48, maxHeight: 140 }}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-4 sm:px-5 h-12 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 hover:shadow-emerald-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0"
              disabled={isTyping || !inputText.trim()}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Send</span>
            </button>
          </form>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold justify-center mt-2.5 px-2">
            <HelpCircle className="w-3 h-3 flex-shrink-0" />
            <span className="text-center">
              Tip: Try <em className="text-emerald-600 not-italic font-bold">"I have a headache"</em> or{' '}
              <em className="text-emerald-600 not-italic font-bold">"What is my healthy BMI?"</em> — responses
              integrate with your dashboard metrics.
            </span>
          </div>
        </div>
      </section>

      {/* Scoped styles — minimal, only for Zappy entry animation */}
      <style jsx>{`
        @keyframes nxZapFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// ============================================
// Lite Markdown renderer (bold + bullet support, no deps)
// ============================================
function renderMarkdownLite(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, idx) => {
        const bullet = /^\s*[-•]\s+/.test(line);
        const content = bullet ? line.replace(/^\s*[-•]\s+/, '') : line;
        return (
          <div
            key={idx}
            className={bullet ? 'flex gap-2 before:content-["•"] before:text-emerald-500 before:font-bold' : ''}
          >
            <span>{renderInlineBold(content)}</span>
          </div>
        );
      })}
    </>
  );
}

function renderInlineBold(text: string): React.ReactNode {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-emerald-700">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default AIChat;
