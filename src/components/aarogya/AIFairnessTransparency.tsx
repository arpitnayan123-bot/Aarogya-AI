'use client';

// ============================================
// AAROGYA AI — AI FAIRNESS & TRANSPARENCY
// "About Our AI — Built For Bharat"
// Languages with accuracy, states tested, age groups,
// urban vs rural accuracy, datasets used,
// known limitations, what AI can/cannot do,
// privacy commitment explained simply.
// Emerald + slate accents (NO indigo primary).
// ============================================

import React, { useState } from 'react';
import {
  ShieldCheck, Sparkles, Languages, MapPin, Users,
  Database, AlertTriangle, CheckCircle2, XCircle,
  Lock, Heart, Eye, FileCheck, Globe, Scale,
  Baby, PersonStanding, Accessibility, Info, BookOpen,
  TrendingUp,
} from 'lucide-react';

// ============================================
// MOCK DATA
// ============================================
const LANGUAGES = [
  { name: 'Hindi',       speakers: '615M', accuracy: 94, native: 'हिन्दी' },
  { name: 'English',     speakers: '129M', accuracy: 96, native: 'English' },
  { name: 'Bengali',     speakers: '107M', accuracy: 91, native: 'বাংলা' },
  { name: 'Telugu',      speakers: '96M',  accuracy: 89, native: 'తెలుగు' },
  { name: 'Marathi',     speakers: '83M',  accuracy: 90, native: 'मराठी' },
  { name: 'Tamil',       speakers: '78M',  accuracy: 92, native: 'தமிழ்' },
  { name: 'Gujarati',    speakers: '57M',  accuracy: 88, native: 'ગુજરાતી' },
  { name: 'Kannada',     speakers: '44M',  accuracy: 87, native: 'ಕನ್ನಡ' },
  { name: 'Odia',        speakers: '38M',  accuracy: 85, native: 'ଓଡ଼ିଆ' },
  { name: 'Malayalam',   speakers: '37M',  accuracy: 90, native: 'മലയാളം' },
  { name: 'Punjabi',     speakers: '33M',  accuracy: 86, native: 'ਪੰਜਾਬੀ' },
];

const STATES_TESTED = [
  'Uttar Pradesh', 'Maharashtra', 'Tamil Nadu', 'West Bengal',
  'Karnataka', 'Gujarat', 'Rajasthan', 'Bihar',
  'Kerala', 'Odisha', 'Punjab', 'Telangana',
  'Madhya Pradesh', 'Andhra Pradesh', 'Delhi', 'Assam',
];

const AGE_GROUPS = [
  { range: '0-5',    label: 'Infants & Toddlers', tested: 12400, accuracy: 87, icon: Baby },
  { range: '6-17',   label: 'Children & Teens',    tested: 18900, accuracy: 90, icon: Users },
  { range: '18-40',  label: 'Young Adults',        tested: 32100, accuracy: 93, icon: PersonStanding },
  { range: '41-60',  label: 'Middle-aged',         tested: 24700, accuracy: 91, icon: Users },
  { range: '60+',    label: 'Senior Citizens',     tested: 9300,  accuracy: 84, icon: Accessibility },
];

const DATASETS = [
  { name: 'ICMR',           desc: 'Indian Council of Medical Research — clinical guidelines', samples: '180K+', icon: Database },
  { name: 'NFHS-5',         desc: 'National Family Health Survey-5 (2019-21) — 636K households', samples: '636K', icon: FileCheck },
  { name: 'AI4Bharat',      desc: 'Open speech & text corpus for Indian languages', samples: '12K hrs', icon: Languages },
  { name: 'NPP: Ayushman',  desc: 'Ayushman Bharat PM-JAY treatment records', samples: '4.2M+', icon: Heart },
  { name: 'WHO India',      desc: 'WHO India public health reports & growth standards', samples: '95K', icon: Globe },
  { name: 'AIIMS Rounds',   desc: 'Anonymized case rounds from AIIMS teaching hospitals', samples: '52K', icon: BookOpen },
];

const CAN_DO = [
  'Help you understand possible causes of common symptoms',
  'Suggest when to see a doctor and which specialist',
  'Remind you to take medicines on time',
  'Translate health info into 11 Indian languages',
  'Read your lab report and flag abnormal values',
  'Track your health numbers over time',
  'Suggest simple home care for minor issues',
  'Connect you with free helplines near you',
];

const CANNOT_DO = [
  'Replace a doctor or give a final diagnosis',
  'Prescribe medicines or change your dose',
  'Read your mind or know what you did not share',
  'Work well for rare diseases (limited training data)',
  'Be 100% correct — it can make mistakes',
  'See you in person or examine your body',
  'Order lab tests for you',
  'Handle emergencies — call 112 / 108 instead',
];

const LIMITATIONS = [
  { title: 'Rural connectivity', detail: 'Needs internet. In offline areas, only saved data is available. New AI checks need network.' },
  { title: 'Rare diseases', detail: 'Trained mainly on common Indian conditions. Rare diseases may be missed or mis-suggested.' },
  { title: 'Senior accuracy gap', detail: 'Accuracy is 84% for 60+ vs 93% for young adults. Older bodies show symptoms differently.' },
  { title: 'Language dialects', detail: 'Built on standard language forms. Heavy dialects (Bhojpuri, Malvi, etc.) may not work well yet.' },
  { title: 'Skin tone bias', detail: 'Skin image AI works best on lighter skin. We are adding more darker-skin training data.' },
  { title: 'Not for pregnancy emergencies', detail: 'For pregnancy danger signs, always call a doctor. AI is for general guidance only.' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const AIFairnessTransparency: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'languages' | 'fairness' | 'limits' | 'privacy'>('overview');

  const ruralAccuracy = 88;
  const urbanAccuracy = 93;
  const overallAccuracy = Math.round((ruralAccuracy + urbanAccuracy) / 2);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-emerald-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300 opacity-20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-teal-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">About Our AI — Built For Bharat</h1>
                <span className="bg-emerald-400 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-emerald-50/90 text-sm mt-1">Fairness · Transparency · Privacy — explained in simple English</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> Open &amp; Honest</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Globe className="w-3 h-3" /> Made in India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TOP TRUST BANNER */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-[260px]">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Our Promise to You</h2>
            <p className="text-sm text-slate-600">
              We built Aarogya AI for every Indian — every language, every state, every age, every income.
              This page tells you <strong>exactly</strong> how our AI works, what it can do, what it cannot do,
              and how we protect your data. No hidden tricks.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-600">{overallAccuracy}%</div>
            <div className="text-xs text-slate-500">Average accuracy</div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION NAV */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-2 flex flex-wrap gap-1">
        {[
          { id: 'overview' as const,   label: 'Overview',       icon: Sparkles },
          { id: 'languages' as const,  label: 'Languages',      icon: Languages },
          { id: 'fairness' as const,   label: 'Fairness Tests', icon: Scale },
          { id: 'limits' as const,     label: 'Limitations',    icon: AlertTriangle },
          { id: 'privacy' as const,    label: 'Privacy',        icon: Lock },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex-1 justify-center ${
              activeSection === s.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <s.icon className="w-4 h-4" /> {s.label}
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* OVERVIEW */}
      {/* ============================================ */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatTile icon={Languages} value="11" label="Languages" tone="emerald" />
            <StatTile icon={MapPin}    value="16+" label="States Tested" tone="teal" />
            <StatTile icon={Users}     value="97K+" label="People in Studies" tone="amber" />
            <StatTile icon={Database}  value="5.4M+" label="Data Samples" tone="cyan" />
          </div>

          {/* What AI can do */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What Our AI Can Do
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAN_DO.map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What AI cannot do */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-500" /> What Our AI Cannot Do
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CANNOT_DO.map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* LANGUAGES */}
      {/* ============================================ */}
      {activeSection === 'languages' && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-800">Languages Supported</h2>
            <span className="text-xs text-slate-400">with accuracy per language</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Bharat speaks many languages. We trained our AI on 11 of them — covering 95% of Indians.
            Accuracy is measured on real health questions in each language.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LANGUAGES.map(lang => (
              <div key={lang.name} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-slate-800">{lang.name}</div>
                    <div className="text-xs text-slate-500">{lang.native} · {lang.speakers} speakers</div>
                  </div>
                  <div className={`text-lg font-bold ${lang.accuracy >= 90 ? 'text-emerald-600' : lang.accuracy >= 87 ? 'text-teal-600' : 'text-amber-600'}`}>
                    {lang.accuracy}%
                  </div>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className={`h-full ${lang.accuracy >= 90 ? 'bg-emerald-500' : lang.accuracy >= 87 ? 'bg-teal-500' : 'bg-amber-500'}`} style={{ width: `${lang.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* FAIRNESS */}
      {/* ============================================ */}
      {activeSection === 'fairness' && (
        <div className="space-y-6">
          {/* States tested */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> States Where We Tested
            </h2>
            <p className="text-sm text-slate-500 mb-4">Our AI was tested with real people in these states, across cities and villages.</p>
            <div className="flex flex-wrap gap-2">
              {STATES_TESTED.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 font-medium">
                  <MapPin className="w-3 h-3" /> {s}
                </span>
              ))}
              <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-sm text-slate-500 font-medium">
                + expanding to more states
              </span>
            </div>
          </div>

          {/* Age groups */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" /> Tested Across All Age Groups
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {AGE_GROUPS.map(g => (
                <div key={g.range} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <g.icon className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                  <div className="text-xs font-bold text-slate-500">Age {g.range}</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">{g.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{g.tested.toLocaleString()} tested</div>
                  <div className={`text-lg font-bold mt-2 ${g.accuracy >= 90 ? 'text-emerald-600' : g.accuracy >= 87 ? 'text-teal-600' : 'text-amber-600'}`}>
                    {g.accuracy}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urban vs rural */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" /> Urban vs Rural Accuracy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-emerald-800">Urban</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-4xl font-black text-emerald-700">{urbanAccuracy}%</div>
                <p className="text-xs text-slate-600 mt-2">Better internet, more training data from cities. Hospitals and clinics share more data here.</p>
              </div>
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-amber-800">Rural</span>
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-4xl font-black text-amber-700">{ruralAccuracy}%</div>
                <p className="text-xs text-slate-600 mt-2">5% lower than urban. We are adding more rural voice samples and ASHA worker data to close this gap.</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                <strong>Our fairness goal:</strong> rural accuracy should match urban accuracy by 2026.
                We test every update on both groups before release.
              </p>
            </div>
          </div>

          {/* Datasets */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" /> Datasets Used for Training
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DATASETS.map(d => (
                <div key={d.name} className="p-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/40">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-100">
                      <d.icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{d.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">{d.desc}</p>
                  <div className="text-[10px] font-semibold text-emerald-700">{d.samples} samples</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* LIMITATIONS */}
      {/* ============================================ */}
      {activeSection === 'limits' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-amber-800">We Are Honest About Our Limits</h2>
              <p className="text-sm text-amber-700 mt-1">
                No AI is perfect. We list our known weaknesses below so you can make safe choices.
                We are working hard to fix each one.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LIMITATIONS.map((l, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{l.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{l.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-600" /> How to Use AI Safely
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Always confirm AI suggestions with a real doctor before starting treatment.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> For emergencies, call 112 or 108 — do not wait for AI.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Share AI reports with your doctor so they can make better decisions.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> If AI gives a strange or scary result, do not panic — get a second opinion.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Tell us when AI is wrong — your feedback helps us improve for all Indians.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* PRIVACY */}
      {/* ============================================ */}
      {activeSection === 'privacy' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-800">Our Privacy Commitment — Explained Simply</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PrivacyCard icon={Lock} title="Your data stays on your device" text="Most of your health info (medicines, screenings, mood logs) is saved on your phone. We do not upload it to our servers unless you choose to share." />
              <PrivacyCard icon={Eye} title="No selling to anyone" text="We never sell your data to insurance companies, advertisers, or anyone else. Your health is not for sale." />
              <PrivacyCard icon={ShieldCheck} title="Encrypted when sent" text="If you choose to sync or share, your data is scrambled so only you and your doctor can read it. Hackers cannot." />
              <PrivacyCard icon={Heart} title="You are in control" text="Delete your data anytime. Export it. Share only what you want. We follow India&apos;s DPDP Act 2023." />
              <PrivacyCard icon={Users} title="Anonymous AI training" text="When we improve our AI, we only use data with names and IDs removed. Nobody can trace it back to you." />
              <PrivacyCard icon={FileCheck} title="Open about requests" text="If police or government asks for your data, we tell you first (unless law stops us). No secret sharing." />
            </div>
          </div>

          {/* DPDP act box */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-xl border border-emerald-100 shrink-0">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Following India&apos;s DPDP Act 2023</h3>
                <p className="text-sm text-slate-600 mt-1">
                  The Digital Personal Data Protection Act is India&apos;s data privacy law.
                  We follow it fully. This means: clear consent, easy delete, no surprise sharing,
                  and equal rights for you over your own data.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  <DPDPTile label="Consent First" />
                  <DPDPTile label="Easy Delete" />
                  <DPDPTile label="No Hidden Use" />
                  <DPDPTile label="You Own It" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Our Pledge
            </h3>
            <p className="text-sm text-slate-600 italic">
              &ldquo;We will never forget that behind every data point is a fellow Indian —
              a mother, a father, a child, a worker, a senior. We will build AI that serves them,
              protects them, and treats every language, state, and income group with equal respect.&rdquo;
            </p>
            <p className="text-xs text-slate-400 mt-2">— The Aarogya AI Team, Made in Bharat</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================
const StatTile: React.FC<{ icon: React.ElementType; value: string; label: string; tone: 'emerald' | 'teal' | 'amber' | 'cyan' }> = ({ icon: Icon, value, label, tone }) => {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    teal:    'bg-teal-50 text-teal-700 border-teal-100',
    amber:   'bg-amber-50 text-amber-700 border-amber-100',
    cyan:    'bg-cyan-50 text-cyan-700 border-cyan-100',
  };
  return (
    <div className={`p-4 rounded-2xl border ${tones[tone]}`}>
      <Icon className="w-5 h-5 mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
};

const PrivacyCard: React.FC<{ icon: React.ElementType; title: string; text: string }> = ({ icon: Icon, title, text }) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-white rounded-lg border border-slate-100">
        <Icon className="w-4 h-4 text-emerald-600" />
      </div>
      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
    </div>
    <p className="text-xs text-slate-600">{text}</p>
  </div>
);

const DPDPTile: React.FC<{ label: string }> = ({ label }) => (
  <div className="p-2 rounded-xl bg-white border border-emerald-100 text-center">
    <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
    <div className="text-[10px] font-semibold text-slate-700">{label}</div>
  </div>
);

export default AIFairnessTransparency;
