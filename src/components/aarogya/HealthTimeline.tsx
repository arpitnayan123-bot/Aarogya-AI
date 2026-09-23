'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity, Droplets, Heart, Pill, Calendar, TrendingUp,
  Stethoscope, Apple, Brain, Bell, Plus, Filter, Clock,
  ChevronRight, Zap, Award, Footprints
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'symptom' | 'lab' | 'medication' | 'appointment' | 'exercise' | 'nutrition' | 'mood' | 'vitals' | 'challenge';
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
  bg: string;
  metadata?: Record<string, string | number>;
}

const EVENT_CONFIG = {
  symptom: { icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50', label: 'Symptom Check' },
  lab: { icon: Activity, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Lab Report' },
  medication: { icon: Pill, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Medication' },
  appointment: { icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Appointment' },
  exercise: { icon: Footprints, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Exercise' },
  nutrition: { icon: Apple, color: 'text-red-600', bg: 'bg-red-50', label: 'Nutrition' },
  mood: { icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Mood Log' },
  vitals: { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Vitals' },
  challenge: { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Challenge' },
};

function generateSampleEvents(): TimelineEvent[] {
  const now = Date.now();
  return [
    { id: 'e1', type: 'vitals', title: 'Blood Pressure Logged', description: '120/80 mmHg — Normal range', timestamp: new Date(now - 2 * 3600000).toISOString(), icon: EVENT_CONFIG.vitals.icon, color: EVENT_CONFIG.vitals.color, bg: EVENT_CONFIG.vitals.bg, metadata: { systolic: 120, diastolic: 80, status: 'Normal' } },
    { id: 'e2', type: 'medication', title: 'Vitamin D3 Taken', description: '60K IU — After breakfast', timestamp: new Date(now - 4 * 3600000).toISOString(), icon: EVENT_CONFIG.medication.icon, color: EVENT_CONFIG.medication.color, bg: EVENT_CONFIG.medication.bg, metadata: { dosage: '60K IU', status: 'Taken' } },
    { id: 'e3', type: 'exercise', title: 'Morning Walk', description: '4,200 steps · 35 minutes', timestamp: new Date(now - 8 * 3600000).toISOString(), icon: EVENT_CONFIG.exercise.icon, color: EVENT_CONFIG.exercise.color, bg: EVENT_CONFIG.exercise.bg, metadata: { steps: 4200, duration: '35 min' } },
    { id: 'e4', type: 'nutrition', title: 'Breakfast Logged', description: 'Oats with fruits · 320 kcal', timestamp: new Date(now - 10 * 3600000).toISOString(), icon: EVENT_CONFIG.nutrition.icon, color: EVENT_CONFIG.nutrition.color, bg: EVENT_CONFIG.nutrition.bg, metadata: { calories: 320, meal: 'Breakfast' } },
    { id: 'e5', type: 'challenge', title: 'Daily Challenge: 3L Water', description: 'Completed hydration goal', timestamp: new Date(now - 24 * 3600000).toISOString(), icon: EVENT_CONFIG.challenge.icon, color: EVENT_CONFIG.challenge.color, bg: EVENT_CONFIG.challenge.bg, metadata: { points: 20, status: 'Complete' } },
    { id: 'e6', type: 'symptom', title: 'Headache Analysis', description: 'AI symptom check completed — mild tension headache', timestamp: new Date(now - 2 * 86400000).toISOString(), icon: EVENT_CONFIG.symptom.icon, color: EVENT_CONFIG.symptom.color, bg: EVENT_CONFIG.symptom.bg, metadata: { urgency: 'routine', confidence: 82 } },
    { id: 'e7', type: 'lab', title: 'Lipid Panel Results', description: 'Total cholesterol: 195 mg/dL — Normal', timestamp: new Date(now - 5 * 86400000).toISOString(), icon: EVENT_CONFIG.lab.icon, color: EVENT_CONFIG.lab.color, bg: EVENT_CONFIG.lab.bg, metadata: { overall: 'Normal', biomarkers: 7 } },
    { id: 'e8', type: 'mood', title: 'Mood: Calm', description: 'Feeling relaxed after meditation session', timestamp: new Date(now - 6 * 86400000).toISOString(), icon: EVENT_CONFIG.mood.icon, color: EVENT_CONFIG.mood.color, bg: EVENT_CONFIG.mood.bg, metadata: { mood: 'calm' } },
  ];
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export const HealthTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_timeline_events');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return generateSampleEvents();
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('aarogya_timeline_events', JSON.stringify(events));
  }, [events]);

  const filtered = activeFilter === 'all' ? events : events.filter(e => e.type === activeFilter);
  const sorted = [...filtered].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Group by date
  const grouped: Record<string, TimelineEvent[]> = {};
  sorted.forEach(e => {
    const date = new Date(e.timestamp);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    let label: string;
    if (date.toDateString() === today.toDateString()) label = 'Today';
    else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = date.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(e);
  });

  const stats = {
    total: events.length,
    today: events.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length,
    thisWeek: events.filter(e => Date.now() - new Date(e.timestamp).getTime() < 7 * 86400000).length,
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500 opacity-10 rounded-full blur-2xl -ml-12 -mb-12" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Health Timeline</h1>
            <p className="text-slate-300/90 text-sm mt-1">Your complete health activity history</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><Activity className="w-3 h-3" /> {stats.total} total events</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><Zap className="w-3 h-3" /> {stats.today} today</span>
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" /> {stats.thisWeek} this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Events', value: stats.total, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Today', value: stats.today, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'This Week', value: stats.thisWeek, icon: TrendingUp, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-xl ${s.bg}`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1"><Filter className="w-3.5 h-3.5" /> Filter:</span>
        <button
          onClick={() => setActiveFilter('all')}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${activeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All ({events.length})
        </button>
        {Object.entries(EVENT_CONFIG).map(([type, cfg]) => {
          const count = events.filter(e => e.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${activeFilter === type ? `${cfg.bg} ${cfg.color} ring-1 ring-current` : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <cfg.icon className="w-3 h-3" /> {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No events found</p>
            <p className="text-xs mt-1">Try a different filter or add a new event</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([dateLabel, dayEvents]) => (
              <div key={dateLabel}>
                {/* Date label */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-1 bg-slate-900 text-white text-xs font-extrabold rounded-full">{dateLabel}</div>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-400">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Events */}
                <div className="relative pl-6 space-y-3">
                  {/* Vertical line */}
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200" />

                  {dayEvents.map((event, i) => {
                    const cfg = EVENT_CONFIG[event.type];
                    return (
                      <div key={event.id} className="relative animate-fadeIn" style={{ animationDelay: `${i * 0.05}s` }}>
                        {/* Dot */}
                        <div className={`absolute -left-4 top-3 w-3 h-3 rounded-full ${cfg.bg} border-2 border-white shadow-sm flex items-center justify-center`}>
                          <div className={`w-1 h-1 rounded-full ${cfg.color.replace('text-', 'bg-')}`} />
                        </div>

                        {/* Card */}
                        <div className={`p-3 ${cfg.bg} bg-opacity-30 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow`}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 bg-white rounded-xl flex-shrink-0 shadow-sm`}>
                              <event.icon className={`w-4 h-4 ${cfg.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-bold text-sm text-slate-900 truncate">{event.title}</h3>
                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{formatRelativeTime(event.timestamp)}</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{event.description}</p>
                              {event.metadata && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {Object.entries(event.metadata).map(([k, v]) => (
                                    <span key={k} className="text-[9px] bg-white px-1.5 py-0.5 rounded font-bold text-slate-600 border border-slate-100">
                                      {k}: <span className={cfg.color}>{String(v)}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Heatmap (last 30 days) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h2 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" /> Activity Heatmap (30 Days)
        </h2>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => {
            const date = new Date(Date.now() - (29 - i) * 86400000);
            const dateStr = date.toDateString();
            const dayEvents = events.filter(e => new Date(e.timestamp).toDateString() === dateStr);
            const count = dayEvents.length;
            const intensity = Math.min(4, Math.ceil(count / 2));
            const colors = ['bg-slate-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'];
            return (
              <div
                key={i}
                className={`aspect-square rounded ${colors[intensity]} hover:ring-2 hover:ring-emerald-300 transition-all cursor-pointer`}
                title={`${date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}: ${count} event${count !== 1 ? 's' : ''}`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 font-bold">
          <span>30 days ago</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {colors.map((c, i) => <div key={i} className={`w-2.5 h-2.5 rounded ${c}`} />)}
            <span>More</span>
          </div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

const colors = ['bg-slate-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'];

export default HealthTimeline;
