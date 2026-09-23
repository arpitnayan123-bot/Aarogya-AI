'use client';

// ============================================
// AAROGYA AI — MEDICINE RESPONSE PROFILE
// Track past medicine reactions, family history,
// known allergies, and medicines to avoid.
// All data saved in localStorage.
// Emerald + rose accents (NO indigo primary).
// ============================================

import React, { useState, useEffect } from 'react';
import {
  Pill, AlertTriangle, ShieldAlert, HeartPulse, UserPlus,
  Plus, Trash2, CheckCircle2, X, Sparkles, Activity,
  Bandage, Beaker, Stethoscope, FileWarning, Info,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type ReactionSeverity = 'mild' | 'moderate' | 'severe' | 'life_threatening';

interface AllergyEntry {
  id: string;
  substance: string;
  reaction: string;
  severity: ReactionSeverity;
  notedOn: string;
}

interface MedicineReaction {
  id: string;
  medicine: string;
  symptom: string;
  severity: ReactionSeverity;
  year: string;
  notes: string;
}

interface FamilyReaction {
  id: string;
  relation: string;
  medicine: string;
  reaction: string;
}

interface AvoidItem {
  id: string;
  medicine: string;
  reason: string;
}

interface ResponseProfile {
  allergies: AllergyEntry[];
  medicineReactions: MedicineReaction[];
  familyReactions: FamilyReaction[];
  avoidList: AvoidItem[];
  conditions: string[]; // existing health conditions that change medicine choices
}

const EMPTY_PROFILE: ResponseProfile = {
  allergies: [],
  medicineReactions: [],
  familyReactions: [],
  avoidList: [],
  conditions: [],
};

const STORAGE_KEY = 'aarogya_medicine_response_profile';

// ============================================
// SEVERITY METADATA
// ============================================
const SEVERITY_META: Record<ReactionSeverity, { label: string; color: string; bg: string; text: string }> = {
  mild:               { label: 'Mild',              color: 'amber',   bg: 'bg-amber-50 border-amber-200',   text: 'text-amber-700' },
  moderate:           { label: 'Moderate',          color: 'orange',  bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  severe:             { label: 'Severe',            color: 'rose',    bg: 'bg-rose-50 border-rose-200',     text: 'text-rose-700' },
  life_threatening:   { label: 'Life-threatening',  color: 'red',     bg: 'bg-red-50 border-red-200',       text: 'text-red-700' },
};

const KNOWN_CONDITIONS = [
  'Asthma', 'Diabetes', 'High BP', 'Kidney disease', 'Liver disease',
  'Heart disease', 'Stomach ulcer', 'Glaucoma', 'Pregnancy', 'Breastfeeding',
  'G6PD deficiency', 'Porphyria',
];

// ============================================
// MAIN COMPONENT
// ============================================
export const MedicineResponseProfile: React.FC = () => {
  const [profile, setProfile] = useState<ResponseProfile>(EMPTY_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'allergies' | 'reactions' | 'family' | 'avoid'>('allergies');

  // Form state
  const [newAllergy, setNewAllergy] = useState({ substance: '', reaction: '', severity: 'mild' as ReactionSeverity });
  const [newReaction, setNewReaction] = useState({ medicine: '', symptom: '', severity: 'mild' as ReactionSeverity, year: '', notes: '' });
  const [newFamily, setNewFamily] = useState({ relation: '', medicine: '', reaction: '' });
  const [newAvoid, setNewAvoid] = useState({ medicine: '', reason: '' });

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile({ ...EMPTY_PROFILE, ...parsed });
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, loaded]);

  // --- CRUD helpers ---
  const addItem = <K extends keyof ResponseProfile>(key: K, item: ResponseProfile[K][number]) => {
    setProfile(prev => ({ ...prev, [key]: [item, ...(prev[key] as any[])] }));
  };
  const removeItem = <K extends keyof ResponseProfile>(key: K, id: string) => {
    setProfile(prev => ({ ...prev, [key]: (prev[key] as any[]).filter(i => i.id !== id) }));
  };

  const toggleCondition = (c: string) => {
    setProfile(prev => ({
      ...prev,
      conditions: prev.conditions.includes(c)
        ? prev.conditions.filter(x => x !== c)
        : [...prev.conditions, c],
    }));
  };

  // --- Risk summary ---
  const severeCount =
    profile.allergies.filter(a => a.severity === 'severe' || a.severity === 'life_threatening').length +
    profile.medicineReactions.filter(a => a.severity === 'severe' || a.severity === 'life_threatening').length;

  const riskLevel: 'low' | 'medium' | 'high' =
    severeCount > 0 ? 'high' :
    (profile.allergies.length + profile.medicineReactions.length) > 3 ? 'medium' : 'low';

  const RISK_META = {
    low:    { label: 'Low Risk',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',   bar: 'bg-emerald-500' },
    medium: { label: 'Medium Risk', color: 'bg-amber-100 text-amber-700 border-amber-200',         bar: 'bg-amber-500' },
    high:   { label: 'High Risk',   color: 'bg-rose-100 text-rose-700 border-rose-200',             bar: 'bg-rose-500' },
  };

  const TABS = [
    { id: 'allergies' as const,  label: 'Allergies',          icon: Bandage,      count: profile.allergies.length },
    { id: 'reactions' as const,  label: 'Medicine Reactions', icon: AlertTriangle, count: profile.medicineReactions.length },
    { id: 'family' as const,     label: 'Family History',     icon: HeartPulse,   count: profile.familyReactions.length },
    { id: 'avoid' as const,      label: 'Must Avoid',         icon: ShieldAlert,  count: profile.avoidList.length },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-rose-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">Medicine Response Profile</h1>
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-emerald-50/90 text-sm mt-1">Allergy & reaction memory · Saved on your device</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ShieldAlert className="w-3 h-3" /> Private</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> Smart Alerts</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-2xl border ${RISK_META[riskLevel].color} font-bold text-sm`}>
            {RISK_META[riskLevel].label}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* RISK SUMMARY CARD */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800">Your Safety Summary</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryTile label="Allergies"      value={profile.allergies.length}        icon={Bandage}       tone="emerald" />
          <SummaryTile label="Reactions"      value={profile.medicineReactions.length} icon={AlertTriangle} tone="amber" />
          <SummaryTile label="Family Notes"   value={profile.familyReactions.length}  icon={HeartPulse}    tone="teal" />
          <SummaryTile label="Must Avoid"     value={profile.avoidList.length}        icon={ShieldAlert}   tone="rose" />
        </div>
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            This profile helps doctors and pharmacists pick safer medicines for you.
            Always share it before any new treatment. Saved only on this device.
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* EXISTING CONDITIONS */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-800">Existing Health Conditions</h2>
        </div>
        <p className="text-sm text-slate-500 mb-3">
          These change which medicines are safe for you. Tap to select.
        </p>
        <div className="flex flex-wrap gap-2">
          {KNOWN_CONDITIONS.map(c => {
            const active = profile.conditions.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  active
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {active && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* TABS */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === t.id
                  ? 'text-emerald-600 bg-emerald-50/50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === t.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {t.count}
              </span>
              {activeTab === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ---------- ALLERGIES ---------- */}
          {activeTab === 'allergies' && (
            <div className="space-y-4">
              <FormRow
                icon={Plus}
                title="Add a Known Allergy"
                fields={[
                  { name: 'substance', placeholder: 'e.g. Penicillin, Peanuts, Latex', value: newAllergy.substance, onChange: v => setNewAllergy(s => ({ ...s, substance: v })) },
                  { name: 'reaction',  placeholder: 'Reaction (e.g. rash, swelling)', value: newAllergy.reaction,  onChange: v => setNewAllergy(s => ({ ...s, reaction: v })) },
                ]}
                severity={newAllergy.severity}
                onSeverityChange={sev => setNewAllergy(s => ({ ...s, severity: sev }))}
                onSubmit={() => {
                  if (!newAllergy.substance.trim()) return;
                  addItem('allergies', { id: `a-${Date.now()}`, substance: newAllergy.substance, reaction: newAllergy.reaction, severity: newAllergy.severity, notedOn: new Date().toISOString() });
                  setNewAllergy({ substance: '', reaction: '', severity: 'mild' });
                }}
              />
              <EntryList
                empty="No allergies added yet. Add one above to keep your records safe."
                items={profile.allergies.map(a => ({
                  id: a.id,
                  title: a.substance,
                  subtitle: a.reaction || 'No reaction noted',
                  severity: a.severity,
                  meta: `Noted ${new Date(a.notedOn).toLocaleDateString()}`,
                }))}
                onDelete={id => removeItem('allergies', id)}
              />
            </div>
          )}

          {/* ---------- MEDICINE REACTIONS ---------- */}
          {activeTab === 'reactions' && (
            <div className="space-y-4">
              <FormRow
                icon={AlertTriangle}
                title="Add a Past Medicine Reaction"
                fields={[
                  { name: 'medicine', placeholder: 'Medicine name (e.g. Crocin, Aspirin)', value: newReaction.medicine, onChange: v => setNewReaction(s => ({ ...s, medicine: v })) },
                  { name: 'symptom',  placeholder: 'Symptom (e.g. itching, breathing issue)', value: newReaction.symptom,  onChange: v => setNewReaction(s => ({ ...s, symptom: v })) },
                  { name: 'year',     placeholder: 'Year (e.g. 2022)', value: newReaction.year, onChange: v => setNewReaction(s => ({ ...s, year: v })) },
                ]}
                extraField={
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={newReaction.notes}
                    onChange={e => setNewReaction(s => ({ ...s, notes: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                }
                severity={newReaction.severity}
                onSeverityChange={sev => setNewReaction(s => ({ ...s, severity: sev }))}
                onSubmit={() => {
                  if (!newReaction.medicine.trim()) return;
                  addItem('medicineReactions', { id: `r-${Date.now()}`, medicine: newReaction.medicine, symptom: newReaction.symptom, severity: newReaction.severity, year: newReaction.year, notes: newReaction.notes });
                  setNewReaction({ medicine: '', symptom: '', severity: 'mild', year: '', notes: '' });
                }}
              />
              <EntryList
                empty="No medicine reactions logged. Add any past bad reaction so doctors can choose safer options."
                items={profile.medicineReactions.map(r => ({
                  id: r.id,
                  title: r.medicine,
                  subtitle: r.symptom || 'Reaction not noted',
                  severity: r.severity,
                  meta: [r.year && `Year: ${r.year}`, r.notes].filter(Boolean).join(' · '),
                }))}
                onDelete={id => removeItem('medicineReactions', id)}
              />
            </div>
          )}

          {/* ---------- FAMILY HISTORY ---------- */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start gap-3">
                <HeartPulse className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-sm text-teal-800">
                  Family reactions can hint at medicine risks for you. Add what your
                  parents, brothers, sisters, or children experienced.
                </p>
              </div>
              <FormRow
                icon={UserPlus}
                title="Add Family Member Reaction"
                fields={[
                  { name: 'relation', placeholder: 'Relation (e.g. Mother, Brother)', value: newFamily.relation, onChange: v => setNewFamily(s => ({ ...s, relation: v })) },
                  { name: 'medicine', placeholder: 'Medicine name', value: newFamily.medicine, onChange: v => setNewFamily(s => ({ ...s, medicine: v })) },
                  { name: 'reaction', placeholder: 'Reaction they had', value: newFamily.reaction, onChange: v => setNewFamily(s => ({ ...s, reaction: v })) },
                ]}
                hideSeverity
                onSubmit={() => {
                  if (!newFamily.relation.trim() || !newFamily.medicine.trim()) return;
                  addItem('familyReactions', { id: `f-${Date.now()}`, relation: newFamily.relation, medicine: newFamily.medicine, reaction: newFamily.reaction });
                  setNewFamily({ relation: '', medicine: '', reaction: '' });
                }}
              />
              <EntryList
                empty="No family reactions recorded yet."
                items={profile.familyReactions.map(f => ({
                  id: f.id,
                  title: `${f.relation} — ${f.medicine}`,
                  subtitle: f.reaction || 'No reaction noted',
                  meta: 'Family history',
                }))}
                onDelete={id => removeItem('familyReactions', id)}
              />
            </div>
          )}

          {/* ---------- MUST AVOID ---------- */}
          {activeTab === 'avoid' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                <FileWarning className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-800">
                  Build your personal "do not prescribe" list. Show this card to any
                  doctor, nurse, or chemist before treatment.
                </p>
              </div>
              <FormRow
                icon={ShieldAlert}
                title="Add a Medicine to Avoid"
                fields={[
                  { name: 'medicine', placeholder: 'Medicine to avoid', value: newAvoid.medicine, onChange: v => setNewAvoid(s => ({ ...s, medicine: v })) },
                  { name: 'reason',  placeholder: 'Reason (e.g. caused rash, doctor advised)', value: newAvoid.reason, onChange: v => setNewAvoid(s => ({ ...s, reason: v })) },
                ]}
                hideSeverity
                onSubmit={() => {
                  if (!newAvoid.medicine.trim()) return;
                  addItem('avoidList', { id: `v-${Date.now()}`, medicine: newAvoid.medicine, reason: newAvoid.reason });
                  setNewAvoid({ medicine: '', reason: '' });
                }}
              />
              <EntryList
                empty="Your avoid-list is empty. Add medicines that have caused problems before."
                items={profile.avoidList.map(v => ({
                  id: v.id,
                  title: v.medicine,
                  subtitle: v.reason || 'No reason noted',
                  meta: 'Must avoid',
                  danger: true,
                }))}
                onDelete={id => removeItem('avoidList', id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================
const SummaryTile: React.FC<{ label: string; value: number; icon: React.ElementType; tone: 'emerald' | 'amber' | 'teal' | 'rose' }> = ({ label, value, icon: Icon, tone }) => {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber:   'bg-amber-50 text-amber-700 border-amber-100',
    teal:    'bg-teal-50 text-teal-700 border-teal-100',
    rose:    'bg-rose-50 text-rose-700 border-rose-100',
  };
  return (
    <div className={`p-4 rounded-2xl border ${tones[tone]}`}>
      <Icon className="w-5 h-5 mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
};

interface FormRowProps {
  icon: React.ElementType;
  title: string;
  fields: { name: string; placeholder: string; value: string; onChange: (v: string) => void }[];
  extraField?: React.ReactNode;
  severity?: ReactionSeverity;
  onSeverityChange?: (s: ReactionSeverity) => void;
  hideSeverity?: boolean;
  onSubmit: () => void;
}

const FormRow: React.FC<FormRowProps> = ({ icon: Icon, title, fields, extraField, severity, onSeverityChange, hideSeverity, onSubmit }) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-emerald-600" />
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {fields.map(f => (
        <input
          key={f.name}
          type="text"
          placeholder={f.placeholder}
          value={f.value}
          onChange={e => f.onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
        />
      ))}
    </div>
    {extraField && <div className="mt-2">{extraField}</div>}
    <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
      {!hideSeverity && severity && onSeverityChange ? (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500">Severity:</span>
          {(Object.keys(SEVERITY_META) as ReactionSeverity[]).map(s => (
            <button
              key={s}
              onClick={() => onSeverityChange(s)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full border transition ${
                severity === s
                  ? SEVERITY_META[s].bg + ' ' + SEVERITY_META[s].text + ' border-current'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {SEVERITY_META[s].label}
            </button>
          ))}
        </div>
      ) : <span />}
      <button
        onClick={onSubmit}
        className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-sm transition flex items-center gap-1"
      >
        <Plus className="w-4 h-4" /> Add
      </button>
    </div>
  </div>
);

interface EntryListProps {
  empty: string;
  items: { id: string; title: string; subtitle: string; severity?: ReactionSeverity; meta?: string; danger?: boolean }[];
  onDelete: (id: string) => void;
}

const EntryList: React.FC<EntryListProps> = ({ empty, items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-2xl">
        <Beaker className="w-8 h-8 mx-auto mb-2 opacity-50" />
        {empty}
      </div>
    );
  }
  return (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
      {items.map(item => (
        <div
          key={item.id}
          className={`flex items-center gap-3 p-3 rounded-xl border ${
            item.danger ? 'bg-rose-50/60 border-rose-100' :
            item.severity ? SEVERITY_META[item.severity].bg :
            'bg-white border-slate-100'
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-slate-800">{item.title}</span>
              {item.severity && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${SEVERITY_META[item.severity].bg} ${SEVERITY_META[item.severity].text}`}>
                  {SEVERITY_META[item.severity].label}
                </span>
              )}
              {item.danger && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">AVOID</span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">{item.subtitle}</div>
            {item.meta && <div className="text-[10px] text-slate-400 mt-0.5">{item.meta}</div>}
          </div>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
            aria-label="Remove entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MedicineResponseProfile;
