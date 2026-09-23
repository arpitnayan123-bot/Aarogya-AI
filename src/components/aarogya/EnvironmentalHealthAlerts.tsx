'use client';

// ============================================
// AAROGYA AI — ENVIRONMENTAL HEALTH ALERTS
// Live AQI display, weather, water quality,
// daily personalized alerts, 7-day AQI forecast.
// Recommendations tied to user health conditions.
// Emerald + amber/orange accents for AQI tones.
// ============================================

import React, { useState } from 'react';
import {
  Wind, Droplets, Thermometer, Waves, Sun, CloudRain,
  AlertTriangle, ShieldCheck, Sparkles, Activity,
  HeartPulse, Baby, Leaf, TrendingUp, MapPin,
  Calendar, Eye, Shield, Home, FlaskConical,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface AQIDay {
  day: string;
  aqi: number;
}

interface AlertItem {
  id: string;
  level: 'safe' | 'moderate' | 'poor' | 'very_poor' | 'severe';
  title: string;
  message: string;
  forGroups: string[];
  icon: React.ElementType;
}

// ============================================
// AQI LEVELS
// ============================================
const AQI_LEVELS = [
  { max: 50,  label: 'Good',          color: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50' },
  { max: 100, label: 'Moderate',      color: 'amber',   bg: 'bg-amber-500',   text: 'text-amber-700',   light: 'bg-amber-50' },
  { max: 200, label: 'Poor',          color: 'orange',  bg: 'bg-orange-500',  text: 'text-orange-700',  light: 'bg-orange-50' },
  { max: 300, label: 'Very Poor',     color: 'rose',    bg: 'bg-rose-500',    text: 'text-rose-700',    light: 'bg-rose-50' },
  { max: 500, label: 'Severe',        color: 'red',     bg: 'bg-red-600',     text: 'text-red-700',     light: 'bg-red-50' },
];

const getAQILevel = (aqi: number) => AQI_LEVELS.find(l => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];

// ============================================
// MOCK DATA
// ============================================
const CURRENT_AQI = 287;
const CURRENT_LOCATION = 'East Delhi, Delhi';

const WEATHER = {
  temperature: 34,
  feelsLike: 38,
  humidity: 62,
  wind: 12,
  uv: 8,
  condition: 'Hazy',
};

const WATER_QUALITY = {
  source: 'Delhi Jal Board — Yamuna supply',
  turbidity: 'High',
  chlorine: 'Normal',
  bacteria: 'Possible contamination',
  safeToDrink: 'Boil before drinking',
  lastTested: '2 days ago',
};

const FORECAST: AQIDay[] = [
  { day: 'Today', aqi: 287 },
  { day: 'Tue',   aqi: 245 },
  { day: 'Wed',   aqi: 198 },
  { day: 'Thu',   aqi: 156 },
  { day: 'Fri',   aqi: 178 },
  { day: 'Sat',   aqi: 210 },
  { day: 'Sun',   aqi: 168 },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const EnvironmentalHealthAlerts: React.FC = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['asthma', 'child']);
  const conditions = [
    { id: 'asthma',   label: 'Asthma / Lung issue', icon: Wind },
    { id: 'heart',    label: 'Heart disease',       icon: HeartPulse },
    { id: 'diabetes', label: 'Diabetes',            icon: Activity },
    { id: 'child',    label: 'Young child at home', icon: Baby },
    { id: 'elderly',  label: 'Elderly at home',     icon: ShieldCheck },
    { id: 'pregnancy', label: 'Pregnant',           icon: Baby },
  ];

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const currentLevel = getAQILevel(CURRENT_AQI);
  const forecastMax = Math.max(...FORECAST.map(d => d.aqi));
  const todayAlerts: AlertItem[] = buildAlerts(CURRENT_AQI, selectedConditions);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================ */}
      {/* PREMIUM HEADER */}
      {/* ============================================ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-emerald-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <Wind className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">Environmental Health Alerts</h1>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-amber-50/90 text-sm mt-1">Air, water, weather · Daily personal guidance</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><MapPin className="w-3 h-3" /> {CURRENT_LOCATION}</span>
                <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Sparkles className="w-3 h-3" /> Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* AQI HERO CARD */}
      {/* ============================================ */}
      <div className={`relative overflow-hidden bg-white border-2 ${currentLevel.color === 'emerald' ? 'border-emerald-200' : currentLevel.color === 'amber' ? 'border-amber-200' : currentLevel.color === 'orange' ? 'border-orange-200' : 'border-rose-200'} rounded-3xl shadow-sm p-6`}>
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <MapPin className="w-3 h-3" /> Current Air Quality · Updated 5 min ago
            </div>
            <div className="flex items-end gap-3">
              <span className={`text-6xl font-black ${currentLevel.text}`}>{CURRENT_AQI}</span>
              <div className="pb-2">
                <div className={`text-lg font-bold ${currentLevel.text}`}>{currentLevel.label}</div>
                <div className="text-xs text-slate-500">AQI · PM2.5 dominant</div>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-2xl ${currentLevel.light} border ${currentLevel.color === 'emerald' ? 'border-emerald-200' : currentLevel.color === 'amber' ? 'border-amber-200' : currentLevel.color === 'orange' ? 'border-orange-200' : 'border-rose-200'}`}>
            <div className={`text-2xl font-bold ${currentLevel.text} flex items-center gap-1`}>
              {currentLevel.color === 'emerald' && <Leaf className="w-5 h-5" />}
              {currentLevel.color === 'amber' && <Sun className="w-5 h-5" />}
              {(currentLevel.color === 'orange' || currentLevel.color === 'rose' || currentLevel.color === 'red') && <AlertTriangle className="w-5 h-5" />}
              {currentLevel.label}
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
              {CURRENT_AQI <= 100 ? 'Safe for outdoor activity.' :
               CURRENT_AQI <= 200 ? 'Sensitive groups should limit outdoor effort.' :
               'Avoid outdoor activity. Wear a mask outside.'}
            </p>
          </div>
        </div>

        {/* AQI scale */}
        <div className="mt-4">
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="flex-1 bg-emerald-500" />
            <div className="flex-1 bg-amber-500" />
            <div className="flex-1 bg-orange-500" />
            <div className="flex-1 bg-rose-500" />
            <div className="flex-1 bg-red-600" />
          </div>
          <div className="relative mt-1">
            <div className="absolute" style={{ left: `${Math.min(100, (CURRENT_AQI / 500) * 100)}%`, transform: 'translateX(-50%)' }}>
              <div className={`w-1 h-3 ${currentLevel.bg} rounded-full`} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-3">
              <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* WEATHER + WATER */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weather */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-sky-100 rounded-lg"><CloudRain className="w-4 h-4 text-sky-600" /></div>
            <h2 className="font-bold text-slate-800">Weather Today</h2>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl font-black text-slate-800">{WEATHER.temperature}°</div>
            <div>
              <div className="text-sm font-semibold text-slate-700">{WEATHER.condition}</div>
              <div className="text-xs text-slate-500">Feels like {WEATHER.feelsLike}°C</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <WeatherTile icon={Droplets} label="Humidity" value={`${WEATHER.humidity}%`} />
            <WeatherTile icon={Wind}     label="Wind"     value={`${WEATHER.wind} km/h`} />
            <WeatherTile icon={Sun}      label="UV Index" value={`${WEATHER.uv} High`} />
            <WeatherTile icon={Eye}      label="Visibility" value="Low" />
          </div>
        </div>

        {/* Water */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-teal-100 rounded-lg"><FlaskConical className="w-4 h-4 text-teal-600" /></div>
            <h2 className="font-bold text-slate-800">Water Quality</h2>
          </div>
          <p className="text-xs text-slate-500 mb-3">Source: {WATER_QUALITY.source}</p>
          <div className="space-y-2">
            <WaterRow label="Turbidity"     value={WATER_QUALITY.turbidity}      status="warn" />
            <WaterRow label="Chlorine"      value={WATER_QUALITY.chlorine}       status="ok" />
            <WaterRow label="Bacteria risk" value={WATER_QUALITY.bacteria}        status="warn" />
            <WaterRow label="Last tested"   value={WATER_QUALITY.lastTested}      status="info" />
          </div>
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 font-medium">{WATER_QUALITY.safeToDrink}. Use an RO filter or boil for 10 minutes.</p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 7-DAY AQI FORECAST CHART */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" /> 7-Day AQI Forecast
          </h2>
          <span className="text-xs text-slate-400">Higher bar = worse air</span>
        </div>
        <div className="flex items-end justify-between gap-2 sm:gap-3 h-48">
          {FORECAST.map((d, i) => {
            const lvl = getAQILevel(d.aqi);
            const heightPct = (d.aqi / forecastMax) * 100;
            const isToday = i === 0;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-slate-700">{d.aqi}</div>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full ${lvl.bg} rounded-t-lg transition-all relative group`}
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10">
                      {lvl.label}
                    </div>
                  </div>
                </div>
                <div className={`text-xs font-medium ${isToday ? 'text-emerald-600' : 'text-slate-500'}`}>{d.day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* PERSONAL HEALTH CONDITIONS SELECTOR */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-emerald-600" /> Personal Health Profile
        </h2>
        <p className="text-sm text-slate-500 mb-3">Tap all that apply. We tailor alerts to your risk.</p>
        <div className="flex flex-wrap gap-2">
          {conditions.map(c => {
            const active = selectedConditions.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCondition(c.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border transition ${
                  active ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <c.icon className="w-4 h-4" />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* DAILY ALERTS / RECOMMENDATIONS */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" /> Today&apos;s Personal Alerts
        </h2>
        <div className="space-y-3">
          {todayAlerts.map(a => {
            const alertBg =
              a.level === 'safe' ? 'bg-emerald-50 border-emerald-200' :
              a.level === 'moderate' ? 'bg-amber-50 border-amber-200' :
              a.level === 'poor' ? 'bg-orange-50 border-orange-200' :
              'bg-rose-50 border-rose-200';
            const alertText =
              a.level === 'safe' ? 'text-emerald-700' :
              a.level === 'moderate' ? 'text-amber-700' :
              a.level === 'poor' ? 'text-orange-700' :
              'text-rose-700';
            return (
              <div key={a.id} className={`p-4 rounded-2xl border ${alertBg} flex items-start gap-3`}>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <a.icon className={`w-5 h-5 ${alertText}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className={`font-bold text-sm ${alertText}`}>{a.title}</h3>
                    {a.forGroups.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {a.forGroups.map(g => (
                          <span key={g} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">{g}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 mt-1">{a.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// BUILD ALERTS BASED ON AQI + CONDITIONS
// ============================================
function buildAlerts(aqi: number, conditions: string[]): AlertItem[] {
  const alerts: AlertItem[] = [];

  // Always-on outdoor mask alert
  if (aqi > 150) {
    alerts.push({
      id: 'mask',
      level: aqi > 300 ? 'very_poor' : 'poor',
      title: 'Wear N95 mask outside',
      message: 'Air is unsafe today. Wear a mask whenever you go out, especially in traffic or construction areas.',
      forGroups: conditions.length > 0 ? ['You'] : [],
      icon: Shield,
    });
  }

  // Stay indoor alert
  if (aqi > 200) {
    alerts.push({
      id: 'indoor',
      level: 'very_poor',
      title: 'Stay indoors, keep windows closed',
      message: 'Run an air purifier if you have one. Avoid morning walks and outdoor exercise today.',
      forGroups: ['Everyone'],
      icon: Home,
    });
  }

  // Asthma / lung
  if (conditions.includes('asthma')) {
    alerts.push({
      id: 'asthma',
      level: aqi > 100 ? 'poor' : 'moderate',
      title: 'Keep inhaler handy',
      message: 'Air pollution can trigger wheezing and breathlessness. Carry your rescue inhaler. If breathing feels tight, use it and rest indoors.',
      forGroups: ['Asthma'],
      icon: Wind,
    });
  }

  // Heart disease
  if (conditions.includes('heart')) {
    alerts.push({
      id: 'heart',
      level: aqi > 150 ? 'poor' : 'moderate',
      title: 'Limit physical effort today',
      message: 'Bad air raises the chance of heart problems. Skip heavy exercise. Rest when tired. Take BP medicine on time.',
      forGroups: ['Heart disease'],
      icon: HeartPulse,
    });
  }

  // Children
  if (conditions.includes('child')) {
    alerts.push({
      id: 'child',
      level: aqi > 150 ? 'poor' : 'moderate',
      title: 'Keep children indoors',
      message: 'Children breathe faster and take in more pollution. Skip outdoor play today. Indoor games only.',
      forGroups: ['Young child'],
      icon: Baby,
    });
  }

  // Elderly
  if (conditions.includes('elderly')) {
    alerts.push({
      id: 'elderly',
      level: aqi > 150 ? 'poor' : 'moderate',
      title: 'Elderly family — extra care',
      message: 'Older adults are more sensitive to bad air. Keep them indoors, well hydrated, and watch for cough or breathlessness.',
      forGroups: ['Elderly'],
      icon: ShieldCheck,
    });
  }

  // Pregnancy
  if (conditions.includes('pregnancy')) {
    alerts.push({
      id: 'pregnancy',
      level: aqi > 150 ? 'poor' : 'moderate',
      title: 'Pregnant — avoid pollution exposure',
      message: 'Bad air can affect baby growth. Stay indoors during peak hours, wear a mask outside, and drink plenty of water.',
      forGroups: ['Pregnant'],
      icon: Baby,
    });
  }

  // Diabetes
  if (conditions.includes('diabetes')) {
    alerts.push({
      id: 'diabetes',
      level: aqi > 200 ? 'poor' : 'moderate',
      title: 'Diabetes + pollution raises risk',
      message: 'High pollution can worsen diabetes control. Take medicine on time, eat on schedule, and avoid outdoor activity.',
      forGroups: ['Diabetes'],
      icon: Activity,
    });
  }

  // Hydration alert for high temp
  if (WEATHER.temperature > 32) {
    alerts.push({
      id: 'hydration',
      level: 'moderate',
      title: 'Drink more water — heat alert',
      message: `It feels like ${WEATHER.feelsLike}°C today. Drink 10-12 glasses of water. Carry a bottle when outside.`,
      forGroups: ['Everyone'],
      icon: Droplets,
    });
  }

  // If everything is fine
  if (alerts.length === 0) {
    alerts.push({
      id: 'safe',
      level: 'safe',
      title: 'Air is safe today',
      message: 'You can go outside and be active. Still good to carry water and avoid very crowded traffic hours.',
      forGroups: [],
      icon: Leaf,
    });
  }

  return alerts;
}

// ============================================
// SUB-COMPONENTS
// ============================================
const WeatherTile: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
    <Icon className="w-4 h-4 text-slate-500 mx-auto mb-1" />
    <div className="text-xs font-bold text-slate-700">{value}</div>
    <div className="text-[10px] text-slate-400">{label}</div>
  </div>
);

const WaterRow: React.FC<{ label: string; value: string; status: 'ok' | 'warn' | 'info' }> = ({ label, value, status }) => {
  const colors = {
    ok: 'text-emerald-600',
    warn: 'text-amber-600',
    info: 'text-slate-500',
  };
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
      <span className="text-xs text-slate-600">{label}</span>
      <span className={`text-xs font-bold ${colors[status]}`}>{value}</span>
    </div>
  );
};

export default EnvironmentalHealthAlerts;
