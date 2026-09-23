'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb, Droplets, Heart, Brain, Moon, Apple, Activity,
  Zap, Leaf, Shield, ChevronRight, Sparkles, Calendar, TrendingUp
} from 'lucide-react';

interface Tip {
  id: number;
  category: string;
  title: string;
  content: string;
  icon: any;
  color: string;
  bgColor: string;
}

const CATEGORIES = [
  { name: 'All', icon: Sparkles, color: 'text-emerald-600' },
  { name: 'Diet', icon: Apple, color: 'text-rose-500' },
  { name: 'Exercise', icon: Activity, color: 'text-orange-500' },
  { name: 'Mental Health', icon: Brain, color: 'text-violet-500' },
  { name: 'Sleep', icon: Moon, color: 'text-indigo-500' },
  { name: 'Hydration', icon: Droplets, color: 'text-cyan-500' },
  { name: 'Heart', icon: Heart, color: 'text-red-500' },
];

const TIPS: Tip[] = [
  { id: 1, category: 'Diet', title: 'Eat the Rainbow', content: 'Include 5 colors of fruits and vegetables daily — each color provides different antioxidants. Try palak (green), gajar (orange), beetroot (red), baingan (purple), and cauliflower (white).', icon: Apple, color: 'text-rose-500', bgColor: 'bg-rose-50' },
  { id: 2, category: 'Diet', title: 'Turmeric Power', content: 'Haldi (turmeric) contains curcumin, a powerful anti-inflammatory. Add a pinch with black pepper to enhance absorption by 2000%.', icon: Leaf, color: 'text-amber-500', bgColor: 'bg-amber-50' },
  { id: 3, category: 'Exercise', title: '30-Minute Daily Walk', content: 'A brisk 30-minute walk reduces heart disease risk by 35%. Morning walks also provide vitamin D from sunlight.', icon: Activity, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { id: 4, category: 'Exercise', title: 'Yoga for Flexibility', content: 'Surya Namaskar (12 poses) stretches all major muscle groups. 12 rounds = complete workout in 15 minutes.', icon: Activity, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { id: 5, category: 'Mental Health', title: '4-7-8 Breathing', content: 'Inhale 4 sec, hold 7 sec, exhale 8 sec. This activates parasympathetic nervous system, reducing anxiety in minutes.', icon: Brain, color: 'text-violet-500', bgColor: 'bg-violet-50' },
  { id: 6, category: 'Mental Health', title: 'Digital Detox', content: '1 hour screen-free before bed improves sleep quality by 23%. Read a book or meditate instead.', icon: Brain, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  { id: 7, category: 'Sleep', title: '7-9 Hours Sleep', content: 'Adults need 7-9 hours. Consistent sleep/wake times regulate circadian rhythm. Avoid caffeine after 2 PM.', icon: Moon, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
  { id: 8, category: 'Sleep', title: 'Cool & Dark Bedroom', content: 'Optimal sleep temperature: 18-22°C. Use blackout curtains. Even dim light during sleep can disrupt melatonin.', icon: Moon, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { id: 9, category: 'Hydration', title: '3 Liters Daily', content: 'Men: 3L, Women: 2.2L daily. Include water-rich foods: watermelon, cucumber, coconut water. Check urine color — pale yellow is ideal.', icon: Droplets, color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
  { id: 10, category: 'Hydration', title: 'Morning Warm Water', content: 'Start your day with warm water + lemon. Aids digestion, boosts metabolism, and flushes toxins accumulated overnight.', icon: Droplets, color: 'text-teal-500', bgColor: 'bg-teal-50' },
  { id: 11, category: 'Heart', title: 'Reduce Salt Intake', content: 'WHO recommends <5g salt/day (1 tsp). Excess salt raises BP. Limit pickles, papads, and processed foods.', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
  { id: 12, category: 'Heart', title: 'Know Your Numbers', content: 'Monitor BP (<120/80), cholesterol (<200 mg/dL), and blood sugar (<100 fasting). Get checked annually after 40.', icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-50' },
];

export const HealthTips: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_tip_favs');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('aarogya_tip_favs', JSON.stringify(favorites));
  }, [favorites]);

  const filtered = activeCategory === 'All' ? TIPS : TIPS.filter(t => t.category === activeCategory);
  const favTips = TIPS.filter(t => favorites.includes(t.id));

  const toggleFav = (id: number) => {
    setFavorites(favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]);
  };

  const tipOfDay = TIPS[new Date().getDate() % TIPS.length];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Daily Health Tips</h1>
            <p className="text-amber-50/90 text-sm mt-1">Evidence-based wellness guidance · Updated daily</p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><Calendar className="w-3 h-3" /> {TIPS.length} Tips</span>
              <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" /> ICMR Backed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tip of the Day */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 opacity-20 rounded-full blur-3xl -mr-12 -mt-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Tip of the Day</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl flex-shrink-0">
              <tipOfDay.icon className="w-8 h-8 text-emerald-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-extrabold mb-2">{tipOfDay.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{tipOfDay.content}</p>
              <button
                onClick={() => toggleFav(tipOfDay.id)}
                className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${favorites.includes(tipOfDay.id) ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
              >
                {favorites.includes(tipOfDay.id) ? '★ Saved' : '☆ Save Tip'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-colors ${activeCategory === cat.name ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <cat.icon className={`w-3.5 h-3.5 ${activeCategory === cat.name ? 'text-white' : cat.color}`} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tip => (
          <div key={tip.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all card-hover group">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-2xl ${tip.bgColor}`}>
                <tip.icon className={`w-6 h-6 ${tip.color}`} />
              </div>
              <button
                onClick={() => toggleFav(tip.id)}
                className={`p-1.5 rounded-lg transition-colors ${favorites.includes(tip.id) ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}
              >
                <span className="text-lg">{favorites.includes(tip.id) ? '★' : '☆'}</span>
              </button>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{tip.category}</span>
            <h3 className="font-extrabold text-slate-900 mt-1 mb-2">{tip.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>

      {/* Favorites */}
      {favTips.length > 0 && (
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" /> Your Saved Tips ({favTips.length})
          </h2>
          <div className="space-y-2">
            {favTips.map(tip => (
              <div key={tip.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-center gap-3">
                <tip.icon className={`w-5 h-5 ${tip.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm text-slate-800">{tip.title}</span>
                  <p className="text-xs text-slate-500 truncate">{tip.content}</p>
                </div>
                <button onClick={() => toggleFav(tip.id)} className="text-amber-400 text-lg">★</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTips;
