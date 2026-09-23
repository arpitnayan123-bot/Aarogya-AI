'use client';

// ============================================
// AAROGYA AI — MATERNAL & CHILD HEALTH
// Two tabs: Pregnancy Companion & Child Growth Monitor.
// Pregnancy: week-by-week tracker, fetal info,
//   danger signs, nutrition guide.
// Child: profiles, weight/height/head circumference,
//   WHO growth comparison, immunization schedule.
// localStorage persistence.
// Emerald + pink/rose accents (NO indigo primary).
// ============================================

import React, { useState, useEffect } from 'react';
import {
  Baby, Heart, Flower2, Apple, AlertTriangle, Calendar,
  TrendingUp, Activity, Plus, Trash2, ShieldCheck,
  Sparkles, Syringe, Ruler, Weight, ChevronRight,
  Info, Stethoscope, Brain, Moon, Sun, Egg, Milestone,
  Droplets,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface ChildProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  measurements: GrowthMeasurement[];
  immunizations: ImmunizationStatus[];
}

interface GrowthMeasurement {
  id: string;
  date: string;
  weight: number;  // kg
  height: number;  // cm
  headCirc: number; // cm
}

interface ImmunizationStatus {
  vaccine: string;
  givenDate: string | null; // null = pending
}

const STORAGE_KEY = 'aarogya_maternal_child';

// ============================================
// PREGNANCY WEEK-BY-WEEK DATA (selected weeks)
// ============================================
interface WeekInfo {
  week: number;
  trimester: 1 | 2 | 3;
  babySize: string;
  development: string;
  motherChanges: string;
}

const PREGNANCY_WEEKS: WeekInfo[] = [
  { week: 4,  trimester: 1, babySize: 'Poppy seed',   development: 'Tiny embryo implants in the uterus. Heart tube begins to form.', motherChanges: 'Missed period. Maybe mild cramps and spotting. Take a pregnancy test.' },
  { week: 8,  trimester: 1, babySize: 'Raspberry',    development: 'Fingers and toes start to form. Heart beats about 150 times/min.', motherChanges: 'Morning sickness, tiredness, breast soreness. Smells may bother you.' },
  { week: 12, trimester: 1, babySize: 'Lime',         development: 'All organs formed. Baby can yawn and stretch.', motherChanges: 'End of first trimester. Morning sickness often reduces. Energy returns.' },
  { week: 16, trimester: 2, babySize: 'Avocado',      development: 'Baby can hear sounds, makes facial expressions.', motherChanges: 'Belly may show. You may feel baby move (flutter). Skin may darken.' },
  { week: 20, trimester: 2, babySize: 'Banana',       development: 'Halfway! Baby has hair, eyebrows. Can taste food you eat.', motherChanges: 'You likely feel clear kicks. Sleep on left side for blood flow.' },
  { week: 24, trimester: 2, babySize: 'Corn',         development: 'Lungs developing. Baby has a sleep-wake cycle.', motherChanges: 'Skin may itch as belly grows. Use moisturizer. Sleep with a pillow between legs.' },
  { week: 28, trimester: 3, babySize: 'Eggplant',     development: 'Brain growing fast. Eyes open and close. Baby can blink.', motherChanges: 'Start of third trimester. Watch for swelling and BP. Count kicks daily.' },
  { week: 32, trimester: 3, babySize: 'Coconut',      development: 'Bones harden. Baby gains fat quickly.', motherChanges: 'Shortness of breath as baby pushes up. Eat small meals. Stay hydrated.' },
  { week: 36, trimester: 3, babySize: 'Papaya',       development: 'Baby drops lower into pelvis. Lungs nearly ready.', motherChanges: 'More pelvic pressure. Pack hospital bag. Weekly doctor visits start.' },
  { week: 40, trimester: 3, babySize: 'Watermelon',   development: 'Full term! Ready to meet the world.', motherChanges: 'Due date! Watch for labor signs — contractions, water break, bleeding.' },
];

// ============================================
// DANGER SIGNS
// ============================================
const DANGER_SIGNS = [
  { sign: 'Heavy bleeding',        action: 'Go to hospital now' },
  { sign: 'Severe headache',       action: 'Check BP, see doctor today' },
  { sign: 'Blurred vision',        action: 'Could be pre-eclampsia — see doctor' },
  { sign: 'Swelling of face/hands', action: 'Check BP, see doctor today' },
  { sign: 'High fever',            action: 'See doctor same day' },
  { sign: 'Baby moves less',       action: 'Drink cold water, lie left, count kicks. If still low — see doctor' },
  { sign: 'Water breaks',          action: 'Go to hospital — labor may be starting' },
  { sign: 'Severe stomach pain',   action: 'Go to hospital now' },
];

// ============================================
// NUTRITION GUIDE
// ============================================
const NUTRITION = [
  { icon: Egg,      title: 'Protein',     items: 'Eggs, dal, paneer, fish, chicken, soya', benefit: 'Builds baby\'s muscles and brain' },
  { icon: Apple,    title: 'Iron',        items: 'Palak, beetroot, jaggery, dates',         benefit: 'Prevents anemia, makes blood' },
  { icon: Sun,      title: 'Calcium',     items: 'Milk, curd, paneer, ragi, sesame',        benefit: 'Strong bones and teeth for baby' },
  { icon: Brain,    title: 'Folic acid',  items: 'Leafy greens, citrus, fortified grains',  benefit: 'Prevents birth defects in brain/spine' },
  { icon: Droplets, title: 'Fluids',      items: 'Water, coconut water, buttermilk',         benefit: 'Maintains amniotic fluid, prevents constipation' },
];

// ============================================
// IMMUNIZATION SCHEDULE (National schedule)
// ============================================
const IMMUNIZATION_SCHEDULE = [
  { vaccine: 'BCG + OPV-0 + Hep-B1',     dueAt: 'Birth',        ageDays: 0 },
  { vaccine: 'OPV-1 + Pentavalent-1 + Rotavirus-1 + PCV-1',  dueAt: '6 weeks',   ageDays: 42 },
  { vaccine: 'OPV-2 + Pentavalent-2 + Rotavirus-2 + PCV-2',  dueAt: '10 weeks',  ageDays: 70 },
  { vaccine: 'OPV-3 + Pentavalent-3 + Rotavirus-3 + PCV-3',  dueAt: '14 weeks',  ageDays: 98 },
  { vaccine: 'MR-1 (Measles-Rubella)',   dueAt: '9 months',    ageDays: 270 },
  { vaccine: 'JE-1 (Japanese Encephalitis)', dueAt: '9-12 months', ageDays: 300 },
  { vaccine: 'MR-2',                     dueAt: '16-24 months', ageDays: 540 },
  { vaccine: 'OPV Booster + DPT Booster', dueAt: '18 months',   ageDays: 540 },
  { vaccine: 'DPT, OPV, MR, TT — School', dueAt: '5-6 years',   ageDays: 2000 },
];

// ============================================
// WHO GROWTH REFERENCE (simplified median values per age)
// (Based on WHO Child Growth Standards — boys median)
// ============================================
const WHO_MEDIAN = [
  // months: [weight_kg, height_cm, head_circ_cm]
  { months: 0,  w: 3.3,  h: 49.9, hc: 34.5 },
  { months: 1,  w: 4.5,  h: 54.7, hc: 37.3 },
  { months: 2,  w: 5.6,  h: 58.4, hc: 39.1 },
  { months: 3,  w: 6.4,  h: 61.4, hc: 40.5 },
  { months: 6,  w: 7.9,  h: 67.6, hc: 43.3 },
  { months: 9,  w: 8.9,  h: 72.0, hc: 44.5 },
  { months: 12, w: 9.6,  h: 75.7, hc: 45.3 },
  { months: 18, w: 10.9, h: 82.3, hc: 46.5 },
  { months: 24, w: 12.2, h: 87.8, hc: 47.5 },
  { months: 36, w: 14.3, h: 96.1, hc: 48.6 },
  { months: 48, w: 16.3, h: 103.3, hc: 49.5 },
  { months: 60, w: 18.3, h: 110.0, hc: 50.2 },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const MaternalChildHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pregnancy' | 'child'>('pregnancy');
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Pregnancy state
  const [selectedWeek, setSelectedWeek] = useState(20);
  const [lmp, setLmp] = useState('');
  const [autoWeek, setAutoWeek] = useState<number | null>(null);

  // New child form
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChild, setNewChild] = useState({ name: '', birthDate: '', gender: 'male' as 'male' | 'female' });

  // Active child + new measurement form
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [newMeasure, setNewMeasure] = useState({ weight: '', height: '', headCirc: '' });

  // Helper: calculate pregnancy weeks from LMP date string
  const calcWeeks = (lmpStr: string): number => {
    const lmpDate = new Date(lmpStr);
    const now = new Date();
    const days = Math.floor((now.getTime() - lmpDate.getTime()) / 86400000);
    return Math.max(0, Math.min(42, Math.floor(days / 7)));
  };

  // Load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChildren(parsed.children || []);
        if (parsed.lmp) {
          setLmp(parsed.lmp);
          setAutoWeek(calcWeeks(parsed.lmp));
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save
  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ children, lmp }));
  }, [children, lmp, loaded]);

  // Auto-update pregnancy week
  useEffect(() => {
    if (lmp) setAutoWeek(calcWeeks(lmp));
  }, [lmp]);

  const effectiveWeek = autoWeek ?? selectedWeek;
  const weekInfo = PREGNANCY_WEEKS.reduce((closest, w) =>
    Math.abs(w.week - effectiveWeek) < Math.abs(closest.week - effectiveWeek) ? w : closest
  , PREGNANCY_WEEKS[0]);

  const addChild = () => {
    if (!newChild.name.trim() || !newChild.birthDate) return;
    const child: ChildProfile = {
      id: `c-${Date.now()}`,
      name: newChild.name.trim(),
      birthDate: newChild.birthDate,
      gender: newChild.gender,
      measurements: [],
      immunizations: IMMUNIZATION_SCHEDULE.map(i => ({ vaccine: i.vaccine, givenDate: null })),
    };
    setChildren(prev => [child, ...prev]);
    setNewChild({ name: '', birthDate: '', gender: 'male' });
    setShowAddChild(false);
    setActiveChildId(child.id);
  };

  const removeChild = (id: string) => {
    setChildren(prev => prev.filter(c => c.id !== id));
    if (activeChildId === id) setActiveChildId(null);
  };

  const addMeasurement = () => {
    if (!activeChildId) return;
    if (!newMeasure.weight && !newMeasure.height && !newMeasure.headCirc) return;
    const m: GrowthMeasurement = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString(),
      weight: parseFloat(newMeasure.weight) || 0,
      height: parseFloat(newMeasure.height) || 0,
      headCirc: parseFloat(newMeasure.headCirc) || 0,
    };
    setChildren(prev => prev.map(c => c.id === activeChildId ? { ...c, measurements: [m, ...c.measurements] } : c));
    setNewMeasure({ weight: '', height: '', headCirc: '' });
  };

  const toggleImmunization = (childId: string, vaccine: string) => {
    setChildren(prev => prev.map(c => {
      if (c.id !== childId) return c;
      return {
        ...c,
        immunizations: c.immunizations.map(i =>
          i.vaccine === vaccine
            ? { ...i, givenDate: i.givenDate ? null : new Date().toISOString() }
            : i
        ),
      };
    }));
  };

  const activeChild = children.find(c => c.id === activeChildId) || null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">Maternal &amp; Child Health</h1>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-pink-50/90 text-sm mt-1">Pregnancy companion + Child growth tracker · WHO standards</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Heart className="w-3 h-3" /> Private</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><ShieldCheck className="w-3 h-3" /> Saved locally</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TABS */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('pregnancy')}
            className={`flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold transition relative ${activeTab === 'pregnancy' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Flower2 className="w-4 h-4" /> Pregnancy Companion
            {activeTab === 'pregnancy' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
          </button>
          <button
            onClick={() => setActiveTab('child')}
            className={`flex items-center justify-center gap-2 px-5 py-4 text-sm font-semibold transition relative ${activeTab === 'child' ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Baby className="w-4 h-4" /> Child Growth Monitor
            {activeTab === 'child' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'pregnancy' && (
            <PregnancyCompanion
              lmp={lmp}
              setLmp={setLmp}
              autoWeek={autoWeek}
              effectiveWeek={effectiveWeek}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              weekInfo={weekInfo}
            />
          )}

          {activeTab === 'child' && (
            <ChildGrowthMonitor
              childrenList={children}
              activeChild={activeChild}
              activeChildId={activeChildId}
              setActiveChildId={setActiveChildId}
              showAddChild={showAddChild}
              setShowAddChild={setShowAddChild}
              newChild={newChild}
              setNewChild={setNewChild}
              addChild={addChild}
              removeChild={removeChild}
              newMeasure={newMeasure}
              setNewMeasure={setNewMeasure}
              addMeasurement={addMeasurement}
              toggleImmunization={toggleImmunization}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// PREGNANCY COMPANION
// ============================================
const PregnancyCompanion: React.FC<{
  lmp: string; setLmp: (v: string) => void;
  autoWeek: number | null; effectiveWeek: number;
  selectedWeek: number; setSelectedWeek: (w: number) => void;
  weekInfo: WeekInfo;
}> = ({ lmp, setLmp, autoWeek, effectiveWeek, selectedWeek, setSelectedWeek, weekInfo }) => {
  const dueDate = lmp ? new Date(new Date(lmp).getTime() + 280 * 86400000) : null;
  return (
    <div className="space-y-6">
      {/* LMP input */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
        <h3 className="text-sm font-bold text-rose-800 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> First Day of Last Period (LMP)
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={lmp}
            onChange={e => setLmp(e.target.value)}
            className="px-3 py-2 text-sm border border-pink-200 rounded-xl bg-white outline-none focus:border-rose-400"
          />
          {autoWeek !== null && (
            <div className="px-3 py-2 text-sm font-bold text-white bg-rose-500 rounded-xl">
              Week {autoWeek} + {Math.floor(((new Date().getTime() - new Date(lmp).getTime()) / 86400000) % 7)} days
            </div>
          )}
          {dueDate && (
            <div className="px-3 py-2 text-xs font-medium text-rose-700 bg-white border border-rose-200 rounded-xl">
              Due: {dueDate.toLocaleDateString()}
            </div>
          )}
        </div>
        <p className="text-[10px] text-rose-600 mt-2">We auto-calculate your week. Or pick a week below to learn about it.</p>
      </div>

      {/* Week selector */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" /> Pick Week to Explore (1-40)
        </h3>
        <input
          type="range" min={1} max={40} value={selectedWeek}
          onChange={e => setSelectedWeek(parseInt(e.target.value))}
          className="w-full accent-rose-500"
        />
        <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
          <span>Week 1</span>
          <span className="font-bold text-rose-600">Selected: Week {selectedWeek}</span>
          <span>Week 40</span>
        </div>
      </div>

      {/* Current week info */}
      <div className="p-5 rounded-2xl bg-white border-2 border-rose-100 shadow-sm">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="p-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl text-white">
            <div className="text-3xl font-black">{weekInfo.week}</div>
            <div className="text-[10px] font-medium uppercase">Week</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Trimester {weekInfo.trimester}</span>
              <span className="text-xs text-slate-500">Baby is the size of a {weekInfo.babySize}</span>
            </div>
            <h4 className="font-bold text-slate-800 mb-1">This week, your baby</h4>
            <p className="text-sm text-slate-600 mb-2">{weekInfo.development}</p>
            <h4 className="font-bold text-slate-800 mb-1">Your body this week</h4>
            <p className="text-sm text-slate-600">{weekInfo.motherChanges}</p>
          </div>
        </div>
      </div>

      {/* All weeks mini view */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <Milestone className="w-4 h-4 text-rose-500" /> Quick Jump to Any Week
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {PREGNANCY_WEEKS.map(w => (
            <button
              key={w.week}
              onClick={() => setSelectedWeek(w.week)}
              className={`p-2 rounded-xl text-xs font-bold border transition ${
                selectedWeek === w.week ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'
              }`}
            >
              {w.week}
            </button>
          ))}
        </div>
      </div>

      {/* Danger signs */}
      <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
        <h3 className="text-sm font-bold text-rose-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Signs — Get Help Fast
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DANGER_SIGNS.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-white border border-rose-100 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800">{d.sign}</div>
                <div className="text-[10px] text-rose-600">{d.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition guide */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Apple className="w-4 h-4 text-emerald-600" /> Pregnancy Nutrition Guide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NUTRITION.map(n => (
            <div key={n.title} className="p-4 rounded-2xl bg-white border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-50 rounded-lg">
                  <n.icon className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
              </div>
              <p className="text-xs text-slate-600 mb-1"><span className="font-semibold">Eat:</span> {n.items}</p>
              <p className="text-[10px] text-emerald-700">{n.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// CHILD GROWTH MONITOR
// ============================================
const ChildGrowthMonitor: React.FC<{
  childrenList: ChildProfile[];
  activeChild: ChildProfile | null;
  activeChildId: string | null;
  setActiveChildId: (id: string) => void;
  showAddChild: boolean;
  setShowAddChild: (v: boolean) => void;
  newChild: { name: string; birthDate: string; gender: 'male' | 'female' };
  setNewChild: React.Dispatch<React.SetStateAction<{ name: string; birthDate: string; gender: 'male' | 'female' }>>;
  addChild: () => void;
  removeChild: (id: string) => void;
  newMeasure: { weight: string; height: string; headCirc: string };
  setNewMeasure: React.Dispatch<React.SetStateAction<{ weight: string; height: string; headCirc: string }>>;
  addMeasurement: () => void;
  toggleImmunization: (childId: string, vaccine: string) => void;
}> = ({
  childrenList, activeChild, activeChildId, setActiveChildId,
  showAddChild, setShowAddChild, newChild, setNewChild, addChild, removeChild,
  newMeasure, setNewMeasure, addMeasurement, toggleImmunization,
}) => {
  return (
    <div className="space-y-6">
      {/* Child roster + add */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Baby className="w-4 h-4 text-pink-500" /> Your Children ({childrenList.length})
        </h3>
        <button
          onClick={() => setShowAddChild(!showAddChild)}
          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-xl transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Child
        </button>
      </div>

      {showAddChild && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <input type="text" placeholder="Child's name" value={newChild.name} onChange={e => setNewChild(s => ({ ...s, name: e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-400" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={newChild.birthDate} onChange={e => setNewChild(s => ({ ...s, birthDate: e.target.value }))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-400" />
            <select value={newChild.gender} onChange={e => setNewChild(s => ({ ...s, gender: e.target.value as 'male' | 'female' }))}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white outline-none focus:border-pink-400">
              <option value="male">Boy</option>
              <option value="female">Girl</option>
            </select>
          </div>
          <button onClick={addChild} className="w-full px-3 py-2 text-sm font-bold text-white bg-pink-500 rounded-xl">Save Child</button>
        </div>
      )}

      {/* Children chips */}
      {childrenList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {childrenList.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveChildId(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-sm font-medium transition ${
                activeChildId === c.id ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300'
              }`}
            >
              <Baby className="w-4 h-4" />
              {c.name}
              <span className="text-[10px] opacity-80">· {calcAge(c.birthDate)}</span>
            </button>
          ))}
        </div>
      )}

      {!activeChild ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Baby className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h4 className="font-bold text-slate-700">Add or select a child</h4>
          <p className="text-sm text-slate-500 mt-1">Track growth, weight, height and immunization schedule.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Child header */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h4 className="font-bold text-slate-800">{activeChild.name}</h4>
              <p className="text-xs text-slate-600">
                {activeChild.gender === 'male' ? 'Boy' : 'Girl'} · Born {new Date(activeChild.birthDate).toLocaleDateString()} · {calcAge(activeChild.birthDate)} old
              </p>
            </div>
            <button onClick={() => removeChild(activeChild.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Add measurement */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-pink-500" /> Add Growth Measurement
            </h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <MeasureInput icon={Weight} label="Weight (kg)"   value={newMeasure.weight}   onChange={v => setNewMeasure(s => ({ ...s, weight: v }))} />
              <MeasureInput icon={Ruler}  label="Height (cm)"   value={newMeasure.height}   onChange={v => setNewMeasure(s => ({ ...s, height: v }))} />
              <MeasureInput icon={Activity} label="Head (cm)"   value={newMeasure.headCirc} onChange={v => setNewMeasure(s => ({ ...s, headCirc: v }))} />
            </div>
            <button onClick={addMeasurement} className="w-full px-3 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition">Save Measurement</button>
          </div>

          {/* WHO comparison */}
          <WHOGrowthCard child={activeChild} />

          {/* Measurement history */}
          {activeChild.measurements.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Growth History
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {activeChild.measurements.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-white border border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-slate-500">{new Date(m.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-3 text-xs">
                      {m.weight > 0 && <span className="font-semibold text-slate-700">{m.weight} kg</span>}
                      {m.height > 0 && <span className="font-semibold text-slate-700">{m.height} cm</span>}
                      {m.headCirc > 0 && <span className="font-semibold text-slate-700">HC {m.headCirc} cm</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immunization schedule */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-emerald-600" /> Immunization Schedule (National)
            </h4>
            <div className="space-y-1.5">
              {IMMUNIZATION_SCHEDULE.map((v, i) => {
                const status = activeChild.immunizations.find(s => s.vaccine === v.vaccine);
                const given = !!status?.givenDate;
                const ageMonths = (new Date().getTime() - new Date(activeChild.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
                const overdue = !given && ageMonths > (v.ageDays / 30);
                return (
                  <button
                    key={i}
                    onClick={() => toggleImmunization(activeChild.id, v.vaccine)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                      given ? 'bg-emerald-50 border-emerald-200' :
                      overdue ? 'bg-rose-50 border-rose-200' :
                      'bg-white border-slate-100 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1.5 rounded-lg ${given ? 'bg-emerald-100' : overdue ? 'bg-rose-100' : 'bg-slate-100'}`}>
                        {given ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Syringe className={`w-3.5 h-3.5 ${overdue ? 'text-rose-600' : 'text-slate-400'}`} />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">{v.vaccine}</div>
                        <div className="text-[10px] text-slate-500">Due: {v.dueAt}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {given ? (
                        <>
                          <div className="text-[10px] font-bold text-emerald-700">GIVEN</div>
                          <div className="text-[9px] text-emerald-600">{status?.givenDate ? new Date(status.givenDate).toLocaleDateString() : ''}</div>
                        </>
                      ) : overdue ? (
                        <div className="text-[10px] font-bold text-rose-600">OVERDUE</div>
                      ) : (
                        <div className="text-[10px] font-medium text-slate-400">Tap when given</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// WHO GROWTH CARD
// ============================================
const WHOGrowthCard: React.FC<{ child: ChildProfile }> = ({ child }) => {
  const ageMonths = Math.floor((new Date().getTime() - new Date(child.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
  // Find nearest WHO median
  const nearest = WHO_MEDIAN.reduce((c, w) => Math.abs(w.months - ageMonths) < Math.abs(c.months - ageMonths) ? w : c, WHO_MEDIAN[0]);

  const latest = child.measurements[0];

  const getStatus = (value: number, median: number, type: 'w' | 'h' | 'hc'): { status: 'low' | 'ok' | 'high'; pct: number; label: string } => {
    if (value <= 0) return { status: 'ok', pct: 0, label: 'No data' };
    const pct = (value / median) * 100;
    if (type === 'w') {
      if (pct < 80) return { status: 'low', pct, label: 'Underweight' };
      if (pct > 120) return { status: 'high', pct, label: 'Above normal' };
      return { status: 'ok', pct, label: 'Normal weight' };
    }
    if (pct < 92) return { status: 'low', pct, label: 'Below average' };
    if (pct > 108) return { status: 'high', pct, label: 'Above average' };
    return { status: 'ok', pct, label: 'Normal' };
  };

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-100">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-600" /> WHO Growth Comparison
        </h4>
        <span className="text-[10px] text-slate-500">Age: {ageMonths} months · WHO median for this age</span>
      </div>

      {!latest ? (
        <div className="p-4 text-center text-sm text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Add a measurement to compare with WHO standards.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <GrowthBar label="Weight"     value={latest.weight}  unit="kg" median={nearest.w}  status={getStatus(latest.weight, nearest.w, 'w')}  icon={Weight} />
          <GrowthBar label="Height"     value={latest.height}  unit="cm" median={nearest.h}  status={getStatus(latest.height, nearest.h, 'h')}  icon={Ruler} />
          <GrowthBar label="Head Circ"  value={latest.headCirc} unit="cm" median={nearest.hc} status={getStatus(latest.headCirc, nearest.hc, 'hc')} icon={Activity} />
        </div>
      )}

      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500">
          WHO standards show the median (middle) value. Being below or above does not always mean a problem —
          your doctor is the best judge. This is just a guide.
        </p>
      </div>
    </div>
  );
};

const GrowthBar: React.FC<{ label: string; value: number; unit: string; median: number; status: { status: 'low' | 'ok' | 'high'; pct: number; label: string }; icon: React.ElementType }> = ({ label, value, unit, median, status, icon: Icon }) => {
  const colors = {
    low: 'bg-rose-400',
    ok: 'bg-emerald-400',
    high: 'bg-amber-400',
  };
  const textColors = {
    low: 'text-rose-700',
    ok: 'text-emerald-700',
    high: 'text-amber-700',
  };
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">{label}</span>
        </div>
        <span className={`text-[10px] font-bold ${textColors[status.status]}`}>{status.label}</span>
      </div>
      <div className="text-lg font-bold text-slate-800">{value}<span className="text-xs text-slate-400 font-normal ml-0.5">{unit}</span></div>
      <div className="text-[10px] text-slate-400 mb-1">WHO median: {median} {unit}</div>
      <div className="h-1.5 bg-white rounded-full overflow-hidden">
        <div className={`h-full ${colors[status.status]}`} style={{ width: `${Math.min(100, status.pct)}%` }} />
      </div>
    </div>
  );
};

// ============================================
// HELPERS
// ============================================
function calcAge(birthDate: string): string {
  const months = Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
  if (months < 1) return `${Math.floor(months * 30)} days`;
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths ? `${years}y ${remMonths}mo` : `${years}y`;
}

const MeasureInput: React.FC<{ icon: React.ElementType; label: string; value: string; onChange: (v: string) => void }> = ({ icon: Icon, label, value, onChange }) => (
  <div>
    <label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
      <Icon className="w-3 h-3" /> {label}
    </label>
    <input
      type="number" step="0.1" value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full mt-0.5 px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-pink-400"
    />
  </div>
);

export default MaternalChildHealth;
