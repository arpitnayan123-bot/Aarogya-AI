'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Ambulance, Heart, AlertTriangle, X, ChevronUp, MapPin } from 'lucide-react';

interface EmergencyButtonProps {
  onNavigate?: (tab: string) => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onNavigate }) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 2 seconds on page
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const emergencyNumbers = [
    { name: 'Ambulance (108)', number: '108', icon: Ambulance, color: 'from-red-500 to-rose-600', desc: 'Medical Emergency' },
    { name: 'Police (100)', number: '100', icon: AlertTriangle, color: 'from-blue-500 to-indigo-600', desc: 'Police Emergency' },
    { name: 'Women Helpline', number: '1091', icon: Heart, color: 'from-pink-500 to-fuchsia-600', desc: 'Women in Distress' },
    { name: 'Senior Helpline', number: '14567', icon: Heart, color: 'from-violet-500 to-purple-600', desc: 'Elder Care Support' },
  ];

  if (!visible) return null;

  return (
    <>
      {/* Expanded Panel */}
      {expanded && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[60] w-80 max-w-[calc(100vw-2rem)] animate-fadeInScale">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-red-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-extrabold">Emergency Quick Dial</span>
              </div>
              <button onClick={() => setExpanded(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Emergency numbers */}
            <div className="p-3 space-y-2">
              {emergencyNumbers.map((num, i) => (
                <a
                  key={i}
                  href={`tel:${num.number}`}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${num.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <num.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900">{num.name}</div>
                    <div className="text-[10px] text-slate-500">{num.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-red-600">{num.number}</div>
                    <div className="text-[9px] text-slate-400 flex items-center gap-0.5 justify-end">
                      <Phone className="w-2.5 h-2.5" /> Tap to call
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick actions */}
            <div className="border-t border-slate-100 p-3 space-y-2">
              <button
                onClick={() => { onNavigate?.('symptom_checker'); setExpanded(false); }}
                className="w-full flex items-center gap-2 p-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl text-sm font-bold text-amber-700 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" /> Check Symptoms (AI)
              </button>
              <button
                onClick={() => { onNavigate?.('appointments'); setExpanded(false); }}
                className="w-full flex items-center gap-2 p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-sm font-bold text-emerald-700 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Find Nearest Doctor
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-red-50 p-3 text-center">
              <p className="text-[10px] text-red-600 font-medium">
                ⚠️ For life-threatening emergencies, call 108 immediately
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`fixed bottom-6 right-4 sm:right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${
          expanded
            ? 'bg-slate-700 text-white'
            : 'bg-gradient-to-r from-red-600 to-rose-600 text-white animate-pulseGlow'
        }`}
        aria-label="Emergency quick access"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-5 h-5" />
            <span className="text-sm font-bold">Close</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Ambulance className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-sm font-extrabold">EMERGENCY</span>
          </>
        )}
      </button>
    </>
  );
};

export default EmergencyButton;
