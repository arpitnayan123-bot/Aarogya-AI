'use client';

// ============================================
// AAROGYA AI — FOOD & NUTRITION SCANNER
// Local Indian-food database (30+ items) with daily nutrition tracker.
// No real barcode scanning — simulated scanner UI.
// Emerald/teal premium design. All state in localStorage.
// ============================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ScanLine, Search, Sparkles, Activity, Flame, Beef, Wheat, Droplet,
  Leaf, Info, AlertCircle, CheckCircle2, RotateCcw, Salad, Milk,
  Cookie, Apple, Zap, Trash2, Plus, Minus, ShoppingBasket, X,
  Soup, Croissant, Egg, Fish, Candy, Coffee,
  TrendingUp, Gauge, Barcode, Utensils,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type FoodCategory =
  | 'grains' | 'lentils' | 'vegetables' | 'fruits'
  | 'dairy' | 'proteins' | 'snacks' | 'beverages' | 'sweets';

interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  serving: string;
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  fiber: number;   // grams
  sugar: number;   // grams
  gi: number;      // glycemic index 0-100
  ayurveda: string;
  dosha: 'vata' | 'pitta' | 'kapha' | 'tridoshic';
  benefits: string[];
}

interface LogEntry {
  id: string;
  foodId: string;
  servings: number;
  loggedAt: number; // epoch ms
}

// ============================================
// INDIAN FOOD DATABASE (30+ items)
// Values per single serving. Macros in grams.
// ============================================
const FOOD_DB: FoodItem[] = [
  // --- Grains ---
  { id: 'roti',        name: 'Roti (Whole Wheat)', emoji: '🫓', category: 'grains', serving: '1 medium (40g)', calories: 120, protein: 3.1, carbs: 18, fat: 3.7, fiber: 2.7, sugar: 0.5, gi: 62, ayurveda: 'Warm, grounding, builds ojas. Best fresh & warm with ghee.', dosha: 'vata', benefits: ['Sustained energy', 'Fiber for digestion', 'Iron source'] },
  { id: 'rice',        name: 'White Rice', emoji: '🍚', category: 'grains', serving: '1 cup cooked (158g)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, fiber: 0.6, sugar: 0.1, gi: 73, ayurveda: 'Easy to digest, balances Pitta. Old rice (purana) is preferred.', dosha: 'pitta', benefits: ['Quick energy', 'Gluten-free', 'Easy on stomach'] },
  { id: 'brown-rice',  name: 'Brown Rice', emoji: '🌾', category: 'grains', serving: '1 cup cooked (195g)', calories: 216, protein: 5.0, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, gi: 50, ayurveda: 'Heavier than white rice — good for Kapha in moderation.', dosha: 'tridoshic', benefits: ['Low glycemic', 'High fiber', 'Vitamin B'] },
  { id: 'dosa',        name: 'Plain Dosa', emoji: '🥞', category: 'grains', serving: '1 dosa (100g)', calories: 168, protein: 3.9, carbs: 29, fat: 3.7, fiber: 1.0, sugar: 0.6, gi: 66, ayurveda: 'Fermented food, kindles agni. Eat fresh & hot. Good for Vata.', dosha: 'vata', benefits: ['Probiotic', 'Fermented nutrition', 'Light meal'] },
  { id: 'idli',        name: 'Idli', emoji: '🧆', category: 'grains', serving: '2 pieces (80g)', calories: 116, protein: 4.0, carbs: 24, fat: 0.4, fiber: 1.8, sugar: 0.5, gi: 60, ayurveda: 'Steamed, light, easily digested. Ideal breakfast — tridoshic.', dosha: 'tridoshic', benefits: ['Steamed (no oil)', 'Probiotic', 'Light on agni'] },
  { id: 'poha',        name: 'Poha (Flattened Rice)', emoji: '🍚', category: 'grains', serving: '1 bowl (150g)', calories: 250, protein: 4.5, carbs: 45, fat: 6.0, fiber: 2.5, sugar: 2.0, gi: 65, ayurveda: 'Light, easy to digest. With peanuts & turmeric — balances Vata.', dosha: 'vata', benefits: ['Light breakfast', 'Iron-rich', 'Quick to digest'] },
  { id: 'upma',        name: 'Upma (Rava)', emoji: '🍲', category: 'grains', serving: '1 bowl (200g)', calories: 280, protein: 6.0, carbs: 42, fat: 9.0, fiber: 2.0, sugar: 3.0, gi: 70, ayurveda: 'Warm and grounding. Add veggies & ghee for balance.', dosha: 'vata', benefits: ['Sustained energy', 'Comforting', 'Customizable veggies'] },
  { id: 'paratha',     name: 'Aloo Paratha', emoji: '🫓', category: 'grains', serving: '1 piece (120g)', calories: 290, protein: 6.0, carbs: 38, fat: 12, fiber: 3.5, sugar: 1.5, gi: 60, ayurveda: 'Heavy but nourishing. Best with curd & pickle. Kapha limit.', dosha: 'pitta', benefits: ['Satiating', 'Energy dense', 'Comfort food'] },
  { id: 'oats',        name: 'Oats Porridge', emoji: '🥣', category: 'grains', serving: '1 bowl (200g)', calories: 154, protein: 5.0, carbs: 27, fat: 2.6, fiber: 4.0, sugar: 1.0, gi: 55, ayurveda: 'Warm oatmeal with ghee & cardamom balances Vata. Add dates.', dosha: 'vata', benefits: ['Lowers cholesterol', 'Beta-glucan fiber', 'Sustained energy'] },
  // --- Lentils & Pulses ---
  { id: 'dal',         name: 'Dal (Yellow Moong)', emoji: '🍲', category: 'lentils', serving: '1 cup (200g)', calories: 187, protein: 14, carbs: 28, fat: 0.8, fiber: 8, sugar: 2, gi: 32, ayurveda: 'Tridoshic, easy to digest. Mung dal is the most balancing.', dosha: 'tridoshic', benefits: ['Plant protein', 'Heart health', 'High fiber'] },
  { id: 'rajma',       name: 'Rajma (Kidney Beans)', emoji: '🫘', category: 'lentils', serving: '1 cup (180g)', calories: 218, protein: 15, carbs: 40, fat: 0.8, fiber: 13, sugar: 2, gi: 29, ayurveda: 'Heavier to digest — soak well. Cook with ginger & asafoetida.', dosha: 'kapha', benefits: ['High protein', 'Iron-rich', 'Sustained energy'] },
  { id: 'chana',       name: 'Chana (Chickpeas)', emoji: '🟤', category: 'lentils', serving: '1 cup cooked (164g)', calories: 269, protein: 14.5, carbs: 45, fat: 4.2, fiber: 12.5, sugar: 7.8, gi: 28, ayurveda: 'Building & strengthening. Cook with cumin & turmeric.', dosha: 'kapha', benefits: ['Plant protein', 'Iron & folate', 'Satiating fiber'] },
  { id: 'sambhar',     name: 'Sambhar', emoji: '🥘', category: 'lentils', serving: '1 cup (240ml)', calories: 105, protein: 5, carbs: 16, fat: 2.5, fiber: 4, sugar: 3, gi: 38, ayurveda: 'Toor dal with veggies — balanced, tridoshic, kindles agni.', dosha: 'tridoshic', benefits: ['Protein + veggies', 'Spices aid digestion', 'Light meal'] },
  // --- Vegetables ---
  { id: 'paneer',      name: 'Paneer (Cottage Cheese)', emoji: '🧀', category: 'dairy', serving: '100g', calories: 265, protein: 18, carbs: 1.2, fat: 20.8, fiber: 0, sugar: 1.2, gi: 10, ayurveda: 'Building, nourishing. Good for Vata & Pitta. Limit for Kapha.', dosha: 'pitta', benefits: ['High protein', 'Calcium', 'Vegetarian friendly'] },
  { id: 'palak',       name: 'Palak (Spinach)', emoji: '🥬', category: 'vegetables', serving: '1 cup cooked (180g)', calories: 41, protein: 5.3, carbs: 6.4, fat: 0.5, fiber: 4.3, sugar: 0.8, gi: 15, ayurveda: 'Cooling — cook with ghee & warming spices for Vata.', dosha: 'pitta', benefits: ['Iron-rich', 'Vitamin K', 'Eye health'] },
  { id: 'aloo',        name: 'Potato', emoji: '🥔', category: 'vegetables', serving: '1 medium (150g)', calories: 110, protein: 3.0, carbs: 26, fat: 0.2, fiber: 2.5, sugar: 1.0, gi: 78, ayurveda: 'Heavy & grounding. Best baked/roasted. Avoid fried for Kapha.', dosha: 'vata', benefits: ['Potassium', 'Vitamin C', 'Satiating'] },
  { id: 'gobi',        name: 'Cabbage (Patta Gobi)', emoji: '🥬', category: 'vegetables', serving: '1 cup raw (90g)', calories: 22, protein: 1.1, carbs: 5.2, fat: 0.2, fiber: 2.5, sugar: 3.0, gi: 10, ayurveda: 'Cooling & light — cook with cumin. Reduces Kapha.', dosha: 'kapha', benefits: ['Vitamin C', 'Vitamin K', 'Low calorie'] },
  { id: 'bhindi',      name: 'Okra (Bhindi)', emoji: '🌶️', category: 'vegetables', serving: '1 cup cooked (160g)', calories: 35, protein: 2.0, carbs: 6.0, fat: 0.2, fiber: 3.2, sugar: 1.5, gi: 20, ayurveda: 'Lubricates joints, builds rasa dhatu. Good for Vata.', dosha: 'vata', benefits: ['Fiber', 'Vitamin K', 'Blood sugar friendly'] },
  { id: 'tamatar',     name: 'Tomato', emoji: '🍅', category: 'vegetables', serving: '1 medium (123g)', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, sugar: 3.2, gi: 30, ayurveda: 'Heating — aggravates Pitta when raw. Cooked is better.', dosha: 'kapha', benefits: ['Lycopene', 'Vitamin C', 'Antioxidants'] },
  { id: 'gajar',       name: 'Carrot (Gajar)', emoji: '🥕', category: 'vegetables', serving: '1 medium (61g)', calories: 25, protein: 0.6, carbs: 6.0, fat: 0.1, fiber: 1.7, sugar: 2.9, gi: 35, ayurveda: 'Sweet, cooling, tridoshic. Cooked with ghee nourishes eyes.', dosha: 'tridoshic', benefits: ['Vitamin A', 'Eye health', 'Skin glow'] },
  // --- Fruits ---
  { id: 'apple',       name: 'Apple (Seb)', emoji: '🍎', category: 'fruits', serving: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, gi: 38, ayurveda: 'Balances Pitta & Kapha. Best in morning. Avoid at night.', dosha: 'pitta', benefits: ['Fiber', 'Vitamin C', 'Heart health'] },
  { id: 'banana',      name: 'Banana (Kela)', emoji: '🍌', category: 'fruits', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, gi: 51, ayurveda: 'Builds strength, calms Vata. Excellent pre/post workout.', dosha: 'vata', benefits: ['Potassium', 'Quick energy', 'Muscle recovery'] },
  { id: 'mango',       name: 'Mango (Aam)', emoji: '🥭', category: 'fruits', serving: '1 cup (165g)', calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23, gi: 51, ayurveda: 'King of fruits. Ripe builds ojas. Eat in moderation.', dosha: 'vata', benefits: ['Vitamin C', 'Vitamin A', 'Digestive enzymes'] },
  { id: 'papaya',      name: 'Papaya (Papita)', emoji: '🍈', category: 'fruits', serving: '1 cup cubed (140g)', calories: 55, protein: 0.9, carbs: 14, fat: 0.2, fiber: 2.5, sugar: 8, gi: 60, ayurveda: 'Improves digestion, kindles agni. Good for Vata & Kapha.', dosha: 'vata', benefits: ['Papain enzyme', 'Vitamin C', 'Digestive aid'] },
  { id: 'amla',        name: 'Amla (Indian Gooseberry)', emoji: '🟢', category: 'fruits', serving: '1 fruit (15g)', calories: 8, protein: 0.1, carbs: 1.8, fat: 0.1, fiber: 0.8, sugar: 0.4, gi: 15, ayurveda: 'Rasayana — premier rejuvenator. Builds ojas & immunity.', dosha: 'tridoshic', benefits: ['Vitamin C powerhouse', 'Antioxidant', 'Liver support'] },
  // --- Dairy ---
  { id: 'milk',        name: 'Milk (Whole)', emoji: '🥛', category: 'dairy', serving: '1 cup (244ml)', calories: 149, protein: 8, carbs: 12, fat: 8, fiber: 0, sugar: 12, gi: 30, ayurveda: 'Warm with turmeric builds ojas. Best consumed warm.', dosha: 'vata', benefits: ['Calcium', 'Protein', 'Sleep aid (warm)'] },
  { id: 'dahi',        name: 'Curd (Dahi)', emoji: '🥣', category: 'dairy', serving: '1 cup (245g)', calories: 100, protein: 10, carbs: 12, fat: 0.7, fiber: 0, sugar: 12, gi: 35, ayurveda: 'Probiotic. Avoid at night. Sweet fresh curd is best.', dosha: 'tridoshic', benefits: ['Probiotic', 'Calcium', 'Gut health'] },
  { id: 'ghee',        name: 'Ghee', emoji: '🧈', category: 'dairy', serving: '1 tbsp (13g)', calories: 112, protein: 0, carbs: 0, fat: 12.7, fiber: 0, sugar: 0, gi: 0, ayurveda: 'Sattvic, builds ojas & medha (intellect). Tridoshic — pacifies Pitta.', dosha: 'tridoshic', benefits: ['Butyric acid', 'Healthy fat', 'Aids absorption'] },
  { id: 'lassi',       name: 'Sweet Lassi', emoji: '🥤', category: 'beverages', serving: '1 glass (240ml)', calories: 130, protein: 4, carbs: 22, fat: 3, fiber: 0, sugar: 20, gi: 50, ayurveda: 'Cooling, aids digestion. Best after lunch — avoid at night.', dosha: 'pitta', benefits: ['Probiotic', 'Cooling', 'Digestive aid'] },
  // --- Proteins ---
  { id: 'egg',         name: 'Boiled Egg', emoji: '🥚', category: 'proteins', serving: '1 large (50g)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, sugar: 0.6, gi: 0, ayurveda: 'Tamasic — boiled is best. Limit if following sattvic diet.', dosha: 'vata', benefits: ['Complete protein', 'Choline', 'Vitamin D'] },
  { id: 'chicken',     name: 'Chicken Breast', emoji: '🍗', category: 'proteins', serving: '100g cooked', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, gi: 0, ayurveda: 'Building. Soup (yusha) prescribed for weakness. Avoid for excess Pitta.', dosha: 'vata', benefits: ['Lean protein', 'B12', 'Low fat'] },
  { id: 'fish',        name: 'Fish (Rohu)', emoji: '🐟', category: 'proteins', serving: '100g cooked', calories: 130, protein: 22, carbs: 0, fat: 4, fiber: 0, sugar: 0, gi: 0, ayurveda: 'Lighter than meat, easier to digest. Good for Pitta.', dosha: 'pitta', benefits: ['Omega-3', 'Lean protein', 'Brain health'] },
  // --- Snacks ---
  { id: 'almonds',     name: 'Almonds (Badam)', emoji: '🌰', category: 'snacks', serving: '10 almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1, gi: 15, ayurveda: 'Soak overnight, peel & eat morning. Builds medha & ojas.', dosha: 'vata', benefits: ['Vitamin E', 'Brain health', 'Healthy fats'] },
  { id: 'walnuts',     name: 'Walnuts (Akhrot)', emoji: '🥜', category: 'snacks', serving: '7 halves (28g)', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, sugar: 1, gi: 15, ayurveda: 'Brain-shaped — builds medha (intellect). Soak before eating.', dosha: 'vata', benefits: ['Omega-3', 'Brain health', 'Heart health'] },
  // --- Sweets ---
  { id: 'jaggery',     name: 'Jaggery (Gur)', emoji: '🟫', category: 'sweets', serving: '1 piece (20g)', calories: 77, protein: 0.2, carbs: 19, fat: 0.1, fiber: 0.2, sugar: 17, gi: 50, ayurveda: 'Healthier than sugar. Builds blood, aids digestion after meals.', dosha: 'vata', benefits: ['Iron', 'Mineral-rich', 'Digestive'] },
  { id: 'halwa',       name: 'Gajar Halwa', emoji: '🍮', category: 'sweets', serving: '1 small bowl (150g)', calories: 280, protein: 5, carbs: 38, fat: 12, fiber: 2.5, sugar: 22, gi: 55, ayurveda: 'Warming winter sweet. Builds strength — eat in moderation.', dosha: 'vata', benefits: ['Vitamin A (carrot)', 'Energy', 'Comfort food'] },
];

// ============================================
// CATEGORY META
// ============================================
const CATEGORIES: { id: FoodCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { id: 'all',         label: 'All',         icon: Salad },
  { id: 'grains',      label: 'Grains',      icon: Wheat },
  { id: 'lentils',     label: 'Lentils',     icon: Soup },
  { id: 'vegetables',  label: 'Vegetables',  icon: Leaf },
  { id: 'fruits',      label: 'Fruits',      icon: Apple },
  { id: 'dairy',       label: 'Dairy',       icon: Milk },
  { id: 'proteins',    label: 'Proteins',    icon: Egg },
  { id: 'snacks',      label: 'Snacks',      icon: Croissant },
  { id: 'beverages',   label: 'Beverages',   icon: Coffee },
  { id: 'sweets',      label: 'Sweets',      icon: Candy },
];

const DOSHA_COLORS: Record<FoodItem['dosha'], string> = {
  vata:       'bg-sky-100 text-sky-700',
  pitta:      'bg-rose-100 text-rose-700',
  kapha:      'bg-emerald-100 text-emerald-700',
  tridoshic:  'bg-amber-100 text-amber-700',
};

// ============================================
// DAILY TARGETS
// ============================================
const DEFAULT_TARGETS = {
  calories: 2000,
  protein: 75,
  carbs: 250,
  fat: 65,
};

const STORAGE_KEY = 'aarogya_food_log_v1';
const TARGETS_KEY = 'aarogya_food_targets_v1';

// ============================================
// COMPONENT
// ============================================
export const FoodScanner: React.FC = () => {
  // ----- Search / scan state -----
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [scanning, setScanning] = useState(false);
  const [barcodeBlink, setBarcodeBlink] = useState(false);

  // ----- Daily log -----
  const [log, setLog] = useState<LogEntry[]>([]);
  const [targets, setTargets] = useState(DEFAULT_TARGETS);
  const [servings, setServings] = useState(1);

  // Hydrate from localStorage (SSR-safe)
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed: LogEntry[] = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter to today only
          const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
          const today = parsed.filter(e => e.loggedAt >= startOfDay.getTime());
          if (today.length > 0) {
            setLog(today);
          }
        }
      }
      const t = localStorage.getItem(TARGETS_KEY);
      if (t) {
        setTargets({ ...DEFAULT_TARGETS, ...JSON.parse(t) });
      }
    } catch { /* ignore */ }
  }, []);

  // Persist log
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)); } catch { /* ignore */ }
  }, [log]);
  useEffect(() => {
    try { localStorage.setItem(TARGETS_KEY, JSON.stringify(targets)); } catch { /* ignore */ }
  }, [targets]);

  // ----- Barcode scanner simulation blink -----
  useEffect(() => {
    if (!scanning) return;
    const id = setInterval(() => setBarcodeBlink(b => !b), 350);
    return () => clearInterval(id);
  }, [scanning]);

  // ----- Filtered food list -----
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FOOD_DB.filter(f => {
      const catOk = activeCategory === 'all' || f.category === activeCategory;
      if (!q) return catOk;
      const haystack = `${f.id} ${f.name} ${f.ayurveda}`.toLowerCase();
      return catOk && haystack.includes(q);
    });
  }, [query, activeCategory]);

  // ----- Daily totals -----
  const totals = useMemo(() => {
    return log.reduce((acc, entry) => {
      const food = FOOD_DB.find(f => f.id === entry.foodId);
      if (!food) return acc;
      acc.calories += food.calories * entry.servings;
      acc.protein  += food.protein  * entry.servings;
      acc.carbs    += food.carbs    * entry.servings;
      acc.fat      += food.fat      * entry.servings;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [log]);

  // ----- Actions -----
  const handleScan = () => {
    if (scanning) return;
    setScanning(true);
    setBarcodeBlink(false);
    // Simulate a barcode scan: pick a "random" but deterministic food (rotate by day)
    setTimeout(() => {
      const idx = (new Date().getDate() + Math.floor(Date.now() / 1000)) % FOOD_DB.length;
      setSelected(FOOD_DB[idx]);
      setScanning(false);
      setServings(1);
    }, 1800);
  };

  const addToLog = (food: FoodItem, n: number) => {
    const entry: LogEntry = {
      id: `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      foodId: food.id,
      servings: n,
      loggedAt: Date.now(),
    };
    setLog(prev => [...prev, entry]);
  };

  const removeEntry = (id: string) => {
    setLog(prev => prev.filter(e => e.id !== id));
  };

  const clearLog = () => {
    if (window.confirm('Clear today\'s food log?')) setLog([]);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6 animate-fadeIn">
      <style jsx>{`
        @keyframes nxScanMove { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        .nx-scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #10b981, #14b8a6, #10b981, transparent);
          box-shadow: 0 0 12px 2px rgba(16,185,129,0.6);
          animation: nxScanMove 1.4s ease-in-out infinite;
        }
        @keyframes nxBarBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .nx-bar-blink { animation: nxBarBlink 0.7s ease-in-out infinite; }
        @keyframes nxCardPop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .nx-card-pop { animation: nxCardPop 0.3s ease-out forwards; opacity: 0; }
        @keyframes nxRingFill { from { stroke-dashoffset: 999; } }
        .nx-ring-fill { animation: nxRingFill 1s ease-out forwards; }
      `}</style>

      {/* ===== HERO ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScanLine className="h-7 w-7 text-emerald-500" />
          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">AI Food &amp; Nutrition Scanner</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-slate-500">Powered by</p>
        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
          🍎 Aarogya AI Nutrition Engine
        </span>
        <span className="rounded-full border border-teal-100 bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">
          🌿 BhashaBench-Ayur · Indian Food DB
        </span>
        <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
          📊 {FOOD_DB.length} foods indexed
        </span>
      </div>

      {/* ===== DAILY TRACKER ===== */}
      <DailyTracker
        totals={totals}
        targets={targets}
        onTargetsChange={setTargets}
        logCount={log.length}
        onClear={clearLog}
      />

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ===== LEFT: Search + scan + browse ===== */}
        <div className="space-y-6 lg:col-span-3">
          {/* Scan card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
            <h2 className="mb-4 flex items-center gap-1.5 text-base font-bold text-slate-800">
              <Barcode className="h-5 w-5 text-emerald-500" /> Scan, Search or Browse
            </h2>

            {/* Scanner viewport */}
            <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 p-4">
              <div className="relative h-32 overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-950/60">
                {/* Faux barcode */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 items-end gap-[3px]">
                    {[2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2].map((w, i) => (
                      <div key={i}
                        className={`nx-bar-blink bg-emerald-300/80`}
                        style={{ width: `${w}px`, height: '100%', animationDelay: `${i * 60}ms` }} />
                    ))}
                  </div>
                </div>
                {scanning && <div className="nx-scan-line" />}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-emerald-300 backdrop-blur">
                    {scanning ? 'SCANNING…' : 'SCAN MODE'}
                  </span>
                  <span className="rounded-full bg-black/60 px-2 py-1 text-[9px] font-bold text-white backdrop-blur">
                    {scanning ? <><Activity className="mr-1 inline h-2.5 w-2.5 animate-spin" />Detecting…</> : 'Ready'}
                  </span>
                </div>
              </div>
              <button onClick={handleScan} disabled={scanning}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60">
                {scanning
                  ? <><Activity className="h-4 w-4 animate-spin" /> Scanning barcode…</>
                  : <><Barcode className="h-4 w-4" /> Simulate Barcode Scan</>}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search: roti, dal, paneer, idli, mango…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {query && (
                <button onClick={() => setQuery('')}
                  className="absolute right-3 top-3 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const active = activeCategory === cat.id;
                return (
                  <button key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] font-bold transition-all ${
                      active ? 'border-emerald-500 bg-emerald-500 text-white'
                             : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}>
                    <Icon className="h-3 w-3" /> {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food grid */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
            <h2 className="mb-3 flex items-center justify-between text-base font-bold text-slate-800">
              <span className="flex items-center gap-1.5"><Salad className="h-5 w-5 text-emerald-500" /> Indian Food Database</span>
              <span className="text-[10px] font-medium text-slate-400">{filtered.length} items</span>
            </h2>
            <div className="grid max-h-[28rem] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {filtered.map((f, i) => (
                <FoodRow key={f.id} food={f} index={i} onSelect={() => { setSelected(f); setServings(1); }} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-slate-400">
                  No foods match "{query}". Try a different spelling.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Selected food + log ===== */}
        <div className="space-y-6 lg:col-span-2">
          {/* Selected food */}
          {selected ? (
            <SelectedFoodCard
              food={selected}
              servings={servings}
              onServings={setServings}
              onAdd={() => { addToLog(selected, servings); setSelected(null); setServings(1); }}
              onClose={() => setSelected(null)}
            />
          ) : (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-premium">
              <div className="mb-3 inline-flex rounded-2xl bg-emerald-50 p-4">
                <Apple className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Select a food to analyze</h3>
              <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
                Tap any food card or scan a barcode to see macros, Ayurvedic properties, and add it to your daily log.
              </p>
            </div>
          )}

          {/* Today's log */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium">
            <h3 className="mb-3 flex items-center justify-between text-base font-bold text-slate-800">
              <span className="flex items-center gap-1.5"><ShoppingBasket className="h-5 w-5 text-emerald-500" /> Today&apos;s Log</span>
              {log.length > 0 && (
                <button onClick={clearLog} className="text-[10px] font-bold text-rose-500 hover:text-rose-700">
                  Clear all
                </button>
              )}
            </h3>
            {log.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No foods logged today. Add some!</p>
            ) : (
              <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {log.slice().reverse().map(entry => {
                  const food = FOOD_DB.find(f => f.id === entry.foodId);
                  if (!food) return null;
                  return (
                    <div key={entry.id}
                      className="nx-card-pop flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{food.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{food.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {entry.servings}× · {Math.round(food.calories * entry.servings)} kcal
                          </p>
                        </div>
                      </div>
                      <button onClick={() => removeEntry(entry.id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Disclaimer ===== */}
      <div className="flex items-start gap-2 rounded-2xl border border-slate-100 bg-white/60 p-4 backdrop-blur">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
        <p className="text-[11px] leading-relaxed text-slate-500">
          Nutritional values are approximations per standard serving, sourced from ICMR-NIN
          food composition tables. Ayurvedic insights are derived from traditional texts and
          the BhashaBench-Ayur benchmark. For personalized dietary advice, consult a
          nutritionist or physician.
        </p>
      </div>
    </div>
  );
};

export default FoodScanner;

// ============================================
// SUB-COMPONENTS
// ============================================
const FoodRow: React.FC<{ food: FoodItem; index: number; onSelect: () => void }> = ({ food, index, onSelect }) => (
  <button
    onClick={onSelect}
    className="nx-card-pop flex items-center gap-3 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-3 text-left transition-all hover:border-emerald-300 hover:shadow-md"
    style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
  >
    <span className="text-2xl">{food.emoji}</span>
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-1">
        <p className="truncate text-xs font-bold text-slate-800">{food.name}</p>
        <span className={`flex-shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold capitalize ${DOSHA_COLORS[food.dosha]}`}>
          {food.dosha}
        </span>
      </div>
      <p className="text-[9px] text-slate-400">{food.serving}</p>
      <div className="mt-1 flex flex-wrap gap-1 text-[8px]">
        <span className="rounded-full bg-orange-100 px-1.5 py-0.5 font-bold text-orange-700">{food.calories} kcal</span>
        <span className="rounded-full bg-rose-100 px-1.5 py-0.5 font-bold text-rose-700">P {food.protein}g</span>
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-bold text-amber-700">C {food.carbs}g</span>
        <span className="rounded-full bg-teal-100 px-1.5 py-0.5 font-bold text-teal-700">F {food.fat}g</span>
      </div>
    </div>
  </button>
);

const SelectedFoodCard: React.FC<{
  food: FoodItem;
  servings: number;
  onServings: (n: number) => void;
  onAdd: () => void;
  onClose: () => void;
}> = ({ food, servings, onServings, onAdd, onClose }) => {
  const cals = Math.round(food.calories * servings);
  const protein = (food.protein * servings).toFixed(1);
  const carbs = (food.carbs * servings).toFixed(1);
  const fat = (food.fat * servings).toFixed(1);
  const fiber = (food.fiber * servings).toFixed(1);

  return (
    <div className="nx-card-pop overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-premium">
      {/* Banner */}
      <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
        <button onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/20 p-1.5 hover:bg-white/30">
          <X className="h-4 w-4" />
        </button>
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Selected Food</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-3xl">{food.emoji}</span>
          <div>
            <h3 className="text-xl font-extrabold">{food.name}</h3>
            <p className="text-[11px] text-emerald-100">Per serving: {food.serving}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold capitalize`}>
            🌿 {food.dosha}
          </span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
            GI: {food.gi}
          </span>
        </div>
      </div>

      {/* Macros */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <MacroTile icon={Flame}  label="Calories" value={`${cals}`} unit="kcal" color="bg-orange-50 text-orange-700" />
          <MacroTile icon={Beef}   label="Protein"  value={protein}   unit="g"   color="bg-rose-50 text-rose-700" />
          <MacroTile icon={Wheat}  label="Carbs"    value={carbs}     unit="g"   color="bg-amber-50 text-amber-700" />
          <MacroTile icon={Droplet} label="Fat"     value={fat}       unit="g"   color="bg-teal-50 text-teal-700" />
          <MacroTile icon={Leaf}   label="Fiber"    value={fiber}     unit="g"   color="bg-emerald-50 text-emerald-700" />
          <MacroTile icon={Zap}    label="GI"       value={`${food.gi}`} unit=""  color="bg-violet-50 text-violet-700" />
        </div>

        {/* Benefits */}
        <div className="mt-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase text-slate-500">Health Benefits</p>
          <div className="flex flex-wrap gap-1.5">
            {food.benefits.map((b, i) => (
              <span key={i} className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        {/* Ayurvedic note */}
        <div className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-700">
            <Leaf className="h-3 w-3" /> Ayurvedic Wisdom
          </p>
          <p className="text-xs leading-relaxed text-amber-900">{food.ayurveda}</p>
        </div>

        {/* Servings + Add */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
          <span className="text-xs font-bold text-slate-700">Servings</span>
          <div className="flex items-center gap-2">
            <button onClick={() => onServings(Math.max(0.5, +(servings - 0.5).toFixed(1)))}
              className="rounded-lg bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-100">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm font-extrabold text-slate-800">{servings}</span>
            <button onClick={() => onServings(+(servings + 0.5).toFixed(1))}
              className="rounded-lg bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-100">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button onClick={onAdd}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700">
          <Plus className="h-4 w-4" /> Add to Today&apos;s Log
        </button>
      </div>
    </div>
  );
};

const MacroTile: React.FC<{
  icon: React.ElementType; label: string; value: string; unit: string; color: string;
}> = ({ icon: Icon, label, value, unit, color }) => (
  <div className={`rounded-xl ${color} p-2.5 text-center`}>
    <Icon className="mx-auto mb-1 h-3.5 w-3.5" />
    <p className="text-[8px] font-bold uppercase opacity-75">{label}</p>
    <p className="text-sm font-extrabold">{value}{unit && <span className="text-[9px]"> {unit}</span>}</p>
  </div>
);

// ============================================
// DAILY TRACKER (top of page)
// ============================================
const DailyTracker: React.FC<{
  totals: { calories: number; protein: number; carbs: number; fat: number };
  targets: typeof DEFAULT_TARGETS;
  onTargetsChange: (t: typeof DEFAULT_TARGETS) => void;
  logCount: number;
  onClear: () => void;
}> = ({ totals, targets, logCount }) => {
  const remaining = Math.max(0, targets.calories - totals.calories);
  const pct = Math.min(100, Math.round((totals.calories / targets.calories) * 100));
  const isOver = totals.calories > targets.calories;

  // SVG ring math
  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 shadow-premium">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Ring */}
        <div className="flex flex-shrink-0 items-center justify-center">
          <div className="relative h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="50" cy="50" r={radius} fill="none"
                stroke={isOver ? '#ef4444' : '#10b981'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.6s ease-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-2xl font-black ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                {Math.round(totals.calories)}
              </p>
              <p className="text-[9px] font-bold uppercase text-slate-400">/ {targets.calories} kcal</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <TrackerStat
            icon={Flame}
            label="Calories"
            value={`${Math.round(totals.calories)}`}
            sub={`${remaining} left`}
            color="text-orange-600"
            bg="bg-orange-50"
            pct={pct}
          />
          <TrackerStat
            icon={Beef}
            label="Protein"
            value={`${Math.round(totals.protein)}g`}
            sub={`of ${targets.protein}g`}
            color="text-rose-600"
            bg="bg-rose-50"
            pct={Math.min(100, Math.round((totals.protein / targets.protein) * 100))}
          />
          <TrackerStat
            icon={Wheat}
            label="Carbs"
            value={`${Math.round(totals.carbs)}g`}
            sub={`of ${targets.carbs}g`}
            color="text-amber-600"
            bg="bg-amber-50"
            pct={Math.min(100, Math.round((totals.carbs / targets.carbs) * 100))}
          />
          <TrackerStat
            icon={Droplet}
            label="Fat"
            value={`${Math.round(totals.fat)}g`}
            sub={`of ${targets.fat}g`}
            color="text-teal-600"
            bg="bg-teal-50"
            pct={Math.min(100, Math.round((totals.fat / targets.fat) * 100))}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-emerald-100 pt-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Gauge className="h-3.5 w-3.5 text-emerald-500" />
          {logCount} food{logCount !== 1 ? 's' : ''} logged today
        </span>
        <span className={`flex items-center gap-1.5 font-bold ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
          {isOver ? (
            <><AlertCircle className="h-3.5 w-3.5" /> {Math.round(totals.calories - targets.calories)} kcal over target</>
          ) : (
            <><TrendingUp className="h-3.5 w-3.5" /> {pct}% of daily target</>
          )}
        </span>
      </div>
    </div>
  );
};

const TrackerStat: React.FC<{
  icon: React.ElementType; label: string; value: string; sub: string;
  color: string; bg: string; pct: number;
}> = ({ icon: Icon, label, value, sub, color, bg, pct }) => (
  <div className={`rounded-xl ${bg} p-3`}>
    <div className="mb-1 flex items-center justify-between">
      <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-slate-500">
        <Icon className={`h-3 w-3 ${color}`} /> {label}
      </span>
      <span className={`text-[9px] font-bold ${color}`}>{pct}%</span>
    </div>
    <p className={`text-lg font-extrabold ${color}`}>{value}</p>
    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/60">
      <div className="h-full rounded-full bg-current opacity-70"
        style={{ width: `${pct}%`, color: 'inherit' }} />
    </div>
    <p className="mt-1 text-[9px] text-slate-500">{sub}</p>
  </div>
);
