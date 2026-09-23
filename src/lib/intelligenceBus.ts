// ============================================
// AAROGYA AI — CROSS-MODULE INTELLIGENCE BUS
//
// The connective tissue that lets independent modules share insights
// WITHOUT duplicating processing. Loose coupling, pub/sub pattern.
//
// Rules:
//   - Modules PUBLISH insights when they detect something important
//   - Modules SUBSCRIBE to insight types they care about
//   - The bus routes insights to relevant subscribers
//   - NO module directly imports another module's logic
//   - All communication goes through this bus
//
// Example flow:
//   Timeline detects anomaly → publishes 'anomaly_detected'
//   → Risk Radar subscribes → updates risk score
//   → Digital Twin subscribes → adjusts trajectory
//   → Disease Predictor subscribes → refreshes prediction
// ============================================

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export type InsightType =
  | 'anomaly_detected'        // Timeline/Continuous found a deviation
  | 'prediction_updated'      // Disease Predictor / Digital Twin changed forecast
  | 'risk_escalated'          // Risk Radar raised risk level
  | 'lab_trend_found'         // Lab enhancement detected a trend
  | 'imaging_correlation'     // Imaging enhancement found cross-analysis link
  | 'fusion_result'           // Multi-modal fusion produced a diagnosis
  | 'knowledge_update'        // Medical Knowledge Engine has new research
  | 'causal_link_discovered'  // Causal engine found a new root cause
  | 'trust_review_needed'     // Trust layer flagged low confidence
  | 'learning_episode';       // ALEE committed a learning update

export type SourceModule =
  | 'digital_twin'
  | 'causal_engine'
  | 'timeline'
  | 'diagnostic_fusion'
  | 'risk_radar'
  | 'trust_layer'
  | 'medical_knowledge'
  | 'diagnostic_enhancements'
  | 'disease_predictor'
  | 'learning_engine';

export type TargetModule = SourceModule | 'all';

export interface Insight {
  id: string;
  timestamp: string;
  type: InsightType;
  source: SourceModule;
  targets: TargetModule[];
  headline: string;               // short summary
  payload: Record<string, unknown>; // structured data
  priority: 'low' | 'medium' | 'high' | 'critical';
  acknowledgedBy: SourceModule[];
}

type InsightHandler = (insight: Insight) => void;

// ---------------------------------------------------------------------------
// BUS STATE (in-memory + localStorage persistence)
// ---------------------------------------------------------------------------

const BUS_LOG_KEY = 'aarogya_intelligence_bus_v1';
const MAX_LOG = 50;

let insights: Insight[] = [];
let handlers: Map<TargetModule, InsightHandler[]> = new Map();
let initialized = false;

function loadLog(): Insight[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(BUS_LOG_KEY);
    if (!raw) return seedLog();
    const parsed = JSON.parse(raw) as Insight[];
    return Array.isArray(parsed) ? parsed : seedLog();
  } catch {
    return seedLog();
  }
}

function saveLog(log: Insight[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BUS_LOG_KEY, JSON.stringify(log.slice(-MAX_LOG)));
  } catch { /* quota */ }
}

function seedLog(): Insight[] {
  const now = Date.now();
  const seed: Insight[] = [
    {
      id: 'bus-001',
      timestamp: new Date(now - 3600000 * 5).toISOString(),
      type: 'lab_trend_found',
      source: 'diagnostic_enhancements',
      targets: ['disease_predictor', 'risk_radar'],
      headline: 'HbA1c rising trend detected over 3 readings (6.2 → 6.5 → 6.8)',
      payload: { feature: 'hba1c', trend: 'rising', readings: [6.2, 6.5, 6.8], rate_per_month: 0.1 },
      priority: 'high',
      acknowledgedBy: ['disease_predictor'],
    },
    {
      id: 'bus-002',
      timestamp: new Date(now - 3600000 * 4).toISOString(),
      type: 'anomaly_detected',
      source: 'timeline',
      targets: ['risk_radar', 'digital_twin'],
      headline: 'Sleep duration deviation: 6.4h baseline → 4.8h last 3 nights',
      payload: { feature: 'sleep_hours', baseline: 6.4, recent: 4.8, deviation_pct: 25 },
      priority: 'medium',
      acknowledgedBy: ['risk_radar'],
    },
    {
      id: 'bus-003',
      timestamp: new Date(now - 3600000 * 3).toISOString(),
      type: 'risk_escalated',
      source: 'risk_radar',
      targets: ['disease_predictor', 'causal_engine', 'trust_layer'],
      headline: 'Cardiovascular risk elevated from moderate → high',
      payload: { risk_type: 'cardiovascular', old_level: 'moderate', new_level: 'high', score_delta: 12 },
      priority: 'high',
      acknowledgedBy: ['causal_engine', 'trust_layer'],
    },
    {
      id: 'bus-004',
      timestamp: new Date(now - 3600000 * 2).toISOString(),
      type: 'causal_link_discovered',
      source: 'causal_engine',
      targets: ['digital_twin', 'disease_predictor'],
      headline: 'New causal path: stress → cortisol → BP elevation (confidence 71%)',
      payload: { cause: 'stress', mediator: 'cortisol', effect: 'bp_elevation', confidence: 71 },
      priority: 'medium',
      acknowledgedBy: [],
    },
    {
      id: 'bus-005',
      timestamp: new Date(now - 3600000).toISOString(),
      type: 'fusion_result',
      source: 'diagnostic_fusion',
      targets: ['trust_layer', 'disease_predictor', 'learning_engine'],
      headline: 'Multi-modal fusion: Metabolic syndrome (labs + imaging + symptoms) — 84% confidence',
      payload: { diagnosis: 'metabolic_syndrome', confidence: 84, modalities: ['lab', 'imaging', 'symptom'] },
      priority: 'high',
      acknowledgedBy: ['trust_layer'],
    },
    {
      id: 'bus-006',
      timestamp: new Date(now - 1800000).toISOString(),
      type: 'knowledge_update',
      source: 'medical_knowledge',
      targets: ['all'],
      headline: 'New ICMR guideline: SGLT2i first-line for T2DM with eGFR 20-90',
      payload: { source: 'ICMR', topic: 't2dm_sglt2i', applies_to: ['decision_engine', 'disease_predictor'] },
      priority: 'medium',
      acknowledgedBy: [],
    },
  ];
  saveLog(seed);
  return seed;
}

function ensureInit() {
  if (!initialized) {
    insights = loadLog();
    initialized = true;
  }
}

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

/**
 * Publish an insight to the bus. It will be routed to all subscribers
 * whose target module matches (or who subscribe to 'all').
 */
export function publish(insight: Omit<Insight, 'id' | 'timestamp' | 'acknowledgedBy'>): Insight {
  ensureInit();
  const full: Insight = {
    ...insight,
    id: `bus-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    acknowledgedBy: [],
  };
  insights.push(full);
  if (insights.length > MAX_LOG) insights = insights.slice(-MAX_LOG);
  saveLog(insights);

  // Route to subscribers — notify each target module's handlers
  full.targets.forEach(target => {
    const hs = handlers.get(target) || [];
    hs.forEach(h => {
      try { h(full); } catch { /* swallow handler errors */ }
    });
  });
  // Also notify 'all' subscribers
  (handlers.get('all') || []).forEach(h => {
    try { h(full); } catch { /* swallow */ }
  });

  return full;
}

/**
 * Subscribe to insights targeted at a specific module (or 'all').
 * Returns an unsubscribe function.
 */
export function subscribe(target: TargetModule, handler: InsightHandler): () => void {
  ensureInit();
  if (!handlers.has(target)) handlers.set(target, []);
  handlers.get(target)!.push(handler);
  return () => {
    const arr = handlers.get(target);
    if (arr) {
      const idx = arr.indexOf(handler);
      if (idx >= 0) arr.splice(idx, 1);
    }
  };
}

/**
 * Acknowledge that a module has processed an insight.
 */
export function acknowledge(insightId: string, module: SourceModule): void {
  ensureInit();
  const idx = insights.findIndex(i => i.id === insightId);
  if (idx >= 0 && !insights[idx].acknowledgedBy.includes(module)) {
    insights[idx].acknowledgedBy.push(module);
    saveLog(insights);
  }
}

/**
 * Get the full insight log (most recent first).
 */
export function getInsightLog(): Insight[] {
  ensureInit();
  return [...insights].reverse();
}

/**
 * Get insights filtered by source module.
 */
export function getInsightsBySource(source: SourceModule): Insight[] {
  ensureInit();
  return insights.filter(i => i.source === source).reverse();
}

/**
 * Get insights filtered by target module (insights that were routed TO it).
 */
export function getInsightsForTarget(target: TargetModule): Insight[] {
  ensureInit();
  return insights.filter(i => i.targets.includes(target) || i.targets.includes('all')).reverse();
}

/**
 * Get unacknowledged insights for a module.
 */
export function getUnacknowledgedFor(module: SourceModule): Insight[] {
  ensureInit();
  return insights
    .filter(i => (i.targets.includes(module) || i.targets.includes('all')) && !i.acknowledgedBy.includes(module))
    .reverse();
}

/**
 * Get bus statistics for the dashboard.
 */
export function getBusStats() {
  ensureInit();
  const byType: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  insights.forEach(i => {
    byType[i.type] = (byType[i.type] || 0) + 1;
    bySource[i.source] = (bySource[i.source] || 0) + 1;
  });
  const unack = insights.filter(i => i.targets.some(t => t !== 'all') &&
    !i.targets.every(t => t === 'all' || i.acknowledgedBy.includes(t as SourceModule))).length;
  return {
    total: insights.length,
    byType,
    bySource,
    unacknowledged: unack,
    critical: insights.filter(i => i.priority === 'critical').length,
    high: insights.filter(i => i.priority === 'high').length,
  };
}

/**
 * Get the module connection map — which modules talk to which.
 */
export function getConnectionMap(): { source: SourceModule; targets: TargetModule[]; count: number }[] {
  ensureInit();
  const map = new Map<string, { source: SourceModule; targets: Set<TargetModule>; count: number }>();
  insights.forEach(i => {
    const key = i.source;
    if (!map.has(key)) map.set(key, { source: i.source, targets: new Set(), count: 0 });
    const entry = map.get(key)!;
    entry.count++;
    i.targets.forEach(t => entry.targets.add(t));
  });
  return Array.from(map.values()).map(m => ({ source: m.source, targets: Array.from(m.targets), count: m.count }));
}

/**
 * Clear the bus log (for testing/reset). Does NOT affect subscribers.
 */
export function clearBusLog(): void {
  insights = [];
  if (typeof window !== 'undefined') {
    try { window.localStorage.removeItem(BUS_LOG_KEY); } catch { /* ignore */ }
  }
}
