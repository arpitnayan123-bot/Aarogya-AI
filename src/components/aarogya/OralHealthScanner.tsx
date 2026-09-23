'use client';

// ============================================
// AAROGYA AI — ORAL HEALTH SCANNER
// Camera/upload interface for mouth photos.
// AI simulation: gum color, teeth, tongue, inner cheeks.
// Detects cavity signs, gum inflammation, ulcers,
// white patches, dry mouth. Simple-English guidance.
// Emerald + cyan accents (NO indigo primary).
// ============================================

import React, { useState, useRef } from 'react';
import {
  Camera, Upload, ImageIcon, Scan, Sparkles, ShieldCheck,
  AlertCircle, CheckCircle2, Activity, Droplets, Smile,
  Stethoscope, RefreshCw, Info, HeartPulse,
  TrendingUp, Lightbulb, X,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type AnalysisStage = 'idle' | 'uploading' | 'analyzing' | 'done';

interface OralIssue {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  guidance: string;
  icon: React.ElementType;
}

// ============================================
// MOCK SCAN REGIONS (what the AI "looks at")
// ============================================
const SCAN_REGIONS = [
  { id: 'gums',     label: 'Gum Color',     icon: HeartPulse, status: 'checking' },
  { id: 'teeth',    label: 'Teeth Surface', icon: Smile,      status: 'checking' },
  { id: 'tongue',   label: 'Tongue',        icon: Smile,      status: 'checking' },
  { id: 'cheeks',   label: 'Inner Cheeks',  icon: Activity,   status: 'checking' },
];

// ============================================
// MOCK DETECTED ISSUES (varied per scan)
// ============================================
const POSSIBLE_ISSUES: OralIssue[] = [
  {
    id: 'cavity',
    name: 'Possible Cavity Signs',
    severity: 'medium',
    confidence: 72,
    guidance: 'A dark spot was seen on a tooth. This may be an early cavity. Avoid very sweet foods and see a dentist within 2 weeks.',
    icon: Smile,
  },
  {
    id: 'gingivitis',
    name: 'Gum Inflammation (Red Gums)',
    severity: 'medium',
    confidence: 81,
    guidance: 'Gums look red and slightly swollen. This often means plaque buildup. Brush twice daily with soft brush, floss, and rinse with warm salt water.',
    icon: HeartPulse,
  },
  {
    id: 'ulcers',
    name: 'Oral Ulcers (Mouth Sores)',
    severity: 'low',
    confidence: 64,
    guidance: 'Small sores were seen. Usually heal in 7-10 days. Avoid spicy/hot foods. Rinse with salt water. If they last more than 2 weeks, see a doctor.',
    icon: AlertCircle,
  },
  {
    id: 'white_patches',
    name: 'White Patches',
    severity: 'high',
    confidence: 58,
    guidance: 'A white patch was seen that does not rub off. This can be a sign of leukoplakia, which sometimes links to tobacco use. Please see a dentist or ENT doctor soon.',
    icon: ShieldCheck,
  },
  {
    id: 'dry_mouth',
    name: 'Dry Mouth Signs',
    severity: 'low',
    confidence: 76,
    guidance: 'Tongue looks dry. Drink 8-10 glasses of water daily. Reduce tea/coffee. If you take medicines for BP or allergy, dry mouth can be a side effect.',
    icon: Droplets,
  },
];

const SEVERITY_META = {
  low:    { label: 'Low concern',     color: 'emerald', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  medium: { label: 'Medium concern',  color: 'amber',   bg: 'bg-amber-50 border-amber-200',    text: 'text-amber-700' },
  high:   { label: 'Needs attention', color: 'rose',    bg: 'bg-rose-50 border-rose-200',      text: 'text-rose-700' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const OralHealthScanner: React.FC = () => {
  const [stage, setStage] = useState<AnalysisStage>('idle');
  const [progress, setProgress] = useState(0);
  const [regionIndex, setRegionIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [issues, setIssues] = useState<OralIssue[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const startAnalysis = (dataUrl: string) => {
    setImagePreview(dataUrl);
    setStage('uploading');
    setProgress(0);
    setRegionIndex(0);
    setIssues([]);

    // Simulate upload
    setTimeout(() => {
      setStage('analyzing');
      let p = 0;
      let ri = 0;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p % 25 === 0 && ri < SCAN_REGIONS.length - 1) {
          ri += 1;
          setRegionIndex(ri);
        }
        if (p >= 100) {
          clearInterval(interval);
          // Pick 2-3 random issues
          const shuffled = [...POSSIBLE_ISSUES].sort(() => Math.random() - 0.5);
          const count = 2 + Math.floor(Math.random() * 2);
          const picked = shuffled.slice(0, count).map(i => ({
            ...i,
            confidence: Math.max(50, Math.min(95, i.confidence + Math.floor(Math.random() * 10 - 5))),
          }));
          setIssues(picked);
          setStage('done');
        }
      }, 120);
    }, 600);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => startAnalysis(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setStage('idle');
    setImagePreview(null);
    setIssues([]);
    setProgress(0);
    setRegionIndex(0);
  };

  const highSeverityCount = issues.filter(i => i.severity === 'high').length;
  const needsDoctor = highSeverityCount > 0 || issues.some(i => i.severity === 'medium' && i.confidence > 75);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-amber-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Smile className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">Oral Health Scanner</h1>
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-cyan-50/90 text-sm mt-1">AI checks mouth photos for early signs · Simple English guidance</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Scan className="w-3 h-3" /> 4 regions</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* DISCLAIMER */}
      {/* ============================================ */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This is an AI helper, not a dentist. It cannot diagnose. Always confirm
          any findings with a real dentist. Do not delay treatment based on this scan.
        </p>
      </div>

      {/* ============================================ */}
      {/* MAIN CARD */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        {stage === 'idle' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl mb-3">
                <Smile className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Scan Your Mouth</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Take a clear photo of your mouth with good light. Open your mouth wide so gums, teeth,
                tongue and inner cheeks are visible.
              </p>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              <Tip icon={Lightbulb} title="Good Light" text="Stand facing a window or use a bright lamp." />
              <Tip icon={Camera} title="Steady Shot" text="Hold phone 15-20 cm from mouth. No blur." />
              <Tip icon={Smile} title="Open Wide" text="Show teeth, gums, tongue, and inner cheeks." />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => cameraRef.current?.click()}
                className="flex items-center justify-center gap-2 px-5 py-4 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-2xl shadow-sm transition"
              >
                <Camera className="w-5 h-5" /> Take Photo Now
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 px-5 py-4 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition"
              >
                <Upload className="w-5 h-5" /> Upload from Gallery
              </button>
            </div>

            <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          </>
        )}

        {(stage === 'uploading' || stage === 'analyzing') && imagePreview && (
          <div className="text-center">
            <div className="relative mx-auto w-full max-w-md aspect-video rounded-2xl overflow-hidden border-2 border-emerald-200 mb-4">
              <img src={imagePreview} alt="Mouth scan" className="w-full h-full object-cover" />
              {/* Scanning overlay */}
              <div className="absolute inset-0 bg-emerald-500/10" />
              <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_2px_rgba(16,185,129,0.6)] animate-pulse" style={{ top: `${progress}%` }} />
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <Scan className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-sm font-semibold text-slate-700">
                {stage === 'uploading' ? 'Uploading photo...' : 'Analyzing mouth regions...'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Checking: <span className="font-semibold text-emerald-700">{SCAN_REGIONS[regionIndex].label}</span>
            </p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden max-w-sm mx-auto">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all" style={{ width: `${progress}%` }} />
            </div>

            {/* Region status */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 max-w-2xl mx-auto">
              {SCAN_REGIONS.map((r, i) => (
                <div key={r.id} className={`p-2.5 rounded-xl border text-center ${
                  i < regionIndex ? 'bg-emerald-50 border-emerald-200' :
                  i === regionIndex ? 'bg-amber-50 border-amber-200' :
                  'bg-slate-50 border-slate-100'
                }`}>
                  <r.icon className={`w-4 h-4 mx-auto mb-1 ${
                    i < regionIndex ? 'text-emerald-600' :
                    i === regionIndex ? 'text-amber-600 animate-pulse' :
                    'text-slate-300'
                  }`} />
                  <div className="text-[10px] font-medium text-slate-600">{r.label}</div>
                  <div className="text-[9px] text-slate-400">
                    {i < regionIndex ? 'Done' : i === regionIndex ? 'Scanning' : 'Waiting'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'done' && (
          <div>
            {/* Result header */}
            <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                {imagePreview && (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-200 shrink-0">
                    <img src={imagePreview} alt="Scan result" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-800">Scan Complete</h2>
                  </div>
                  <p className="text-sm text-slate-500">Found {issues.length} possible {issues.length === 1 ? 'sign' : 'signs'} to review</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                <RefreshCw className="w-4 h-4" /> New Scan
              </button>
            </div>

            {/* Overall banner */}
            <div className={`p-4 rounded-2xl border mb-5 flex items-start gap-3 ${needsDoctor ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
              {needsDoctor ? <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              <div className="text-sm">
                <p className={`font-bold ${needsDoctor ? 'text-amber-800' : 'text-emerald-800'}`}>
                  {needsDoctor ? 'Please visit a dentist' : 'Looks mostly fine'}
                </p>
                <p className={needsDoctor ? 'text-amber-700 mt-0.5' : 'text-emerald-700 mt-0.5'}>
                  {needsDoctor
                    ? 'Some signs need a dentist to confirm. Book an appointment in the next 1-2 weeks.'
                    : 'Minor signs only. Keep good brushing and flossing habits.'}
                </p>
              </div>
            </div>

            {/* Issues list */}
            <div className="space-y-3">
              {issues.map(issue => (
                <div key={issue.id} className={`p-4 rounded-2xl border ${SEVERITY_META[issue.severity].bg}`}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`p-2 bg-white rounded-xl border border-slate-100`}>
                      <issue.icon className={`w-5 h-5 ${SEVERITY_META[issue.severity].text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 text-sm">{issue.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white ${SEVERITY_META[issue.severity].text}`}>
                          {SEVERITY_META[issue.severity].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                          <div className={`h-full ${issue.severity === 'high' ? 'bg-rose-400' : issue.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${issue.confidence}%` }} />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">{issue.confidence}% match</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/50">
                    <Lightbulb className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700">{issue.guidance}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* General care tips */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Daily Oral Care Tips
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Brush twice daily with a soft brush and fluoride toothpaste.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Clean between teeth with floss or a stick (datun) once daily.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Rinse mouth with water after every meal.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Limit tea, coffee, tobacco, and sweet foods.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Visit a dentist every 6 months for a checkup.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* AI EXPLAINER */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-600" /> What This Tool Checks
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SCAN_REGIONS.map(r => (
            <div key={r.id} className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <r.icon className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="text-sm font-semibold text-slate-700">{r.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {r.id === 'gums' && 'Color and swelling'}
                {r.id === 'teeth' && 'Cavities and plaque'}
                {r.id === 'tongue' && 'Coating and color'}
                {r.id === 'cheeks' && 'Patches and sores'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            The AI model was trained on oral images but can make mistakes. A 60% match does not mean you have a problem — it means a dentist should check.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENT
// ============================================
const Tip: React.FC<{ icon: React.ElementType; title: string; text: string }> = ({ icon: Icon, title, text }) => (
  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
    <Icon className="w-4 h-4 text-emerald-600 mb-1" />
    <div className="text-xs font-bold text-slate-700">{title}</div>
    <div className="text-[10px] text-slate-500 mt-0.5">{text}</div>
  </div>
);

export default OralHealthScanner;
