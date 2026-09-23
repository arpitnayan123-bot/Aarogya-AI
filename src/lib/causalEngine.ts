// ============================================
// AAROGYA AI — CAUSAL INTELLIGENCE ENGINE (CIE)
// Core reasoning system for cause-effect analysis.
// Answers: "WHY is this happening?"
// ============================================

export type VariableType = 'observed' | 'latent';
export type TimeScale = 'immediate' | 'medium' | 'long_term';
export type EdgeDirection = 'positive' | 'negative';

export interface CausalNode {
  id: string;
  label: string;
  type: VariableType;
  category: 'vital' | 'lab' | 'lifestyle' | 'psychological' | 'environmental' | 'latent';
  currentValue?: number;
  unit?: string;
  normalRange?: [number, number];
  isAbnormal?: boolean;
}

export interface CausalEdge {
  from: string;
  to: string;
  direction: EdgeDirection;
  weight: number;
  confidence: number;
  timeDelay: TimeScale;
  description: string;
}

export interface CausalPath {
  nodes: string[];
  edges: CausalEdge[];
  totalWeight: number;
  totalConfidence: number;
  description: string;
}

export interface RootCause {
  nodeId: string;
  nodeLabel: string;
  contribution: number;
  confidence: number;
  causalPath: CausalPath;
  modifiable: boolean;
  timeToEffect: TimeScale;
  recommendation: string;
}

export interface InterventionResult {
  targetVariable: string;
  changeAmount: number;
  affectedVariables: {
    nodeId: string; nodeLabel: string; oldValue: number; predictedValue: number;
    changePercent: number; timeToEffect: TimeScale;
  }[];
  confidence: number;
  summary: string;
}

export interface CausalAnalysis {
  targetNode: string;
  targetLabel: string;
  rootCauses: RootCause[];
  latentInferences: { node: string; label: string; inferredValue: number; evidence: string[]; confidence: number }[];
  confidence: number;
  alternativeHypotheses: string[];
  primaryInsight: string;
}

// ============================================
// CAUSAL GRAPH
// ============================================

const NODES: CausalNode[] = [
  { id: 'bp_systolic', label: 'Blood Pressure (Systolic)', type: 'observed', category: 'vital', unit: 'mmHg', normalRange: [90, 120], currentValue: 145, isAbnormal: true },
  { id: 'bp_diastolic', label: 'Blood Pressure (Diastolic)', type: 'observed', category: 'vital', unit: 'mmHg', normalRange: [60, 80], currentValue: 92, isAbnormal: true },
  { id: 'heart_rate', label: 'Heart Rate', type: 'observed', category: 'vital', unit: 'BPM', normalRange: [60, 100], currentValue: 82, isAbnormal: false },
  { id: 'glucose', label: 'Fasting Glucose', type: 'observed', category: 'lab', unit: 'mg/dL', normalRange: [70, 100], currentValue: 108, isAbnormal: true },
  { id: 'hba1c', label: 'HbA1c', type: 'observed', category: 'lab', unit: '%', normalRange: [4, 5.7], currentValue: 5.9, isAbnormal: true },
  { id: 'cholesterol_ldl', label: 'LDL Cholesterol', type: 'observed', category: 'lab', unit: 'mg/dL', normalRange: [0, 100], currentValue: 142, isAbnormal: true },
  { id: 'sleep_hours', label: 'Sleep Duration', type: 'observed', category: 'lifestyle', unit: 'hrs', normalRange: [7, 9], currentValue: 5.5, isAbnormal: true },
  { id: 'sleep_quality', label: 'Sleep Quality', type: 'observed', category: 'lifestyle', unit: '/100', normalRange: [70, 100], currentValue: 55, isAbnormal: true },
  { id: 'salt_intake', label: 'Salt Intake', type: 'observed', category: 'lifestyle', unit: 'g/day', normalRange: [0, 5], currentValue: 8, isAbnormal: true },
  { id: 'steps', label: 'Daily Steps', type: 'observed', category: 'lifestyle', unit: 'steps', normalRange: [8000, 15000], currentValue: 4200, isAbnormal: true },
  { id: 'sugar_intake', label: 'Sugar Intake', type: 'observed', category: 'lifestyle', unit: 'g/day', normalRange: [0, 25], currentValue: 45, isAbnormal: true },
  { id: 'bmi', label: 'BMI', type: 'observed', category: 'vital', unit: 'kg/m²', normalRange: [18.5, 25], currentValue: 27.5, isAbnormal: true },
  { id: 'crp', label: 'CRP (Inflammation)', type: 'observed', category: 'lab', unit: 'mg/L', normalRange: [0, 3], currentValue: 4.2, isAbnormal: true },
  { id: 'stress_level', label: 'Stress Level', type: 'latent', category: 'psychological', unit: '/100', normalRange: [0, 40], currentValue: 68, isAbnormal: true },
  { id: 'insulin_resistance', label: 'Insulin Resistance', type: 'latent', category: 'latent', unit: 'index', normalRange: [0, 2], currentValue: 2.8, isAbnormal: true },
  { id: 'autonomic_dysfunction', label: 'Autonomic Dysfunction', type: 'latent', category: 'latent', unit: 'index', normalRange: [0, 1.5], currentValue: 1.8, isAbnormal: true },
  { id: 'metabolic_syndrome', label: 'Metabolic Syndrome', type: 'latent', category: 'latent', unit: 'score', normalRange: [0, 2], currentValue: 3, isAbnormal: true },
];

const EDGES: CausalEdge[] = [
  { from: 'sleep_hours', to: 'sleep_quality', direction: 'positive', weight: 0.85, confidence: 0.9, timeDelay: 'immediate', description: 'Less sleep directly reduces sleep quality' },
  { from: 'sleep_quality', to: 'stress_level', direction: 'negative', weight: 0.75, confidence: 0.85, timeDelay: 'medium', description: 'Poor sleep increases cortisol levels' },
  { from: 'stress_level', to: 'bp_systolic', direction: 'positive', weight: 0.65, confidence: 0.8, timeDelay: 'immediate', description: 'Stress activates sympathetic nervous system, raising BP' },
  { from: 'stress_level', to: 'bp_diastolic', direction: 'positive', weight: 0.6, confidence: 0.75, timeDelay: 'immediate', description: 'Stress constricts blood vessels, raising diastolic BP' },
  { from: 'stress_level', to: 'heart_rate', direction: 'positive', weight: 0.55, confidence: 0.8, timeDelay: 'immediate', description: 'Stress increases heart rate via adrenaline' },
  { from: 'salt_intake', to: 'bp_systolic', direction: 'positive', weight: 0.7, confidence: 0.9, timeDelay: 'medium', description: 'Excess salt retains water, increasing blood volume and BP' },
  { from: 'salt_intake', to: 'bp_diastolic', direction: 'positive', weight: 0.65, confidence: 0.85, timeDelay: 'medium', description: 'Salt-driven fluid retention raises diastolic pressure' },
  { from: 'sleep_quality', to: 'autonomic_dysfunction', direction: 'negative', weight: 0.7, confidence: 0.8, timeDelay: 'medium', description: 'Poor sleep disrupts autonomic nervous system balance' },
  { from: 'autonomic_dysfunction', to: 'bp_systolic', direction: 'positive', weight: 0.6, confidence: 0.75, timeDelay: 'medium', description: 'Autonomic dysfunction impairs BP regulation' },
  { from: 'sugar_intake', to: 'insulin_resistance', direction: 'positive', weight: 0.75, confidence: 0.85, timeDelay: 'long_term', description: 'Chronic high sugar intake causes cells to resist insulin' },
  { from: 'bmi', to: 'insulin_resistance', direction: 'positive', weight: 0.7, confidence: 0.85, timeDelay: 'long_term', description: 'Excess body fat increases insulin resistance' },
  { from: 'insulin_resistance', to: 'glucose', direction: 'positive', weight: 0.85, confidence: 0.9, timeDelay: 'medium', description: 'When cells resist insulin, glucose stays in the blood' },
  { from: 'insulin_resistance', to: 'hba1c', direction: 'positive', weight: 0.8, confidence: 0.9, timeDelay: 'long_term', description: 'Sustained high glucose raises HbA1c' },
  { from: 'steps', to: 'bmi', direction: 'negative', weight: 0.65, confidence: 0.85, timeDelay: 'long_term', description: 'More physical activity burns calories, reducing BMI' },
  { from: 'steps', to: 'insulin_resistance', direction: 'negative', weight: 0.55, confidence: 0.8, timeDelay: 'medium', description: 'Exercise improves insulin sensitivity directly' },
  { from: 'stress_level', to: 'glucose', direction: 'positive', weight: 0.5, confidence: 0.75, timeDelay: 'immediate', description: 'Cortisol triggers glucose release from liver' },
  { from: 'sleep_hours', to: 'glucose', direction: 'negative', weight: 0.45, confidence: 0.7, timeDelay: 'immediate', description: 'Poor sleep impairs glucose tolerance next morning' },
  { from: 'bmi', to: 'crp', direction: 'positive', weight: 0.6, confidence: 0.8, timeDelay: 'long_term', description: 'Excess visceral fat produces inflammatory markers' },
  { from: 'sugar_intake', to: 'crp', direction: 'positive', weight: 0.45, confidence: 0.7, timeDelay: 'medium', description: 'High sugar intake promotes systemic inflammation' },
  { from: 'crp', to: 'insulin_resistance', direction: 'positive', weight: 0.5, confidence: 0.7, timeDelay: 'long_term', description: 'Inflammation worsens insulin resistance' },
  { from: 'sugar_intake', to: 'cholesterol_ldl', direction: 'positive', weight: 0.4, confidence: 0.65, timeDelay: 'medium', description: 'Excess sugar converts to triglycerides and LDL' },
  { from: 'bmi', to: 'cholesterol_ldl', direction: 'positive', weight: 0.5, confidence: 0.7, timeDelay: 'long_term', description: 'Higher BMI correlates with higher LDL' },
  { from: 'steps', to: 'cholesterol_ldl', direction: 'negative', weight: 0.4, confidence: 0.65, timeDelay: 'medium', description: 'Exercise helps lower LDL cholesterol' },
];

// ============================================
// GRAPH OPERATIONS
// ============================================

function getDirectCauses(nodeId: string): CausalEdge[] {
  return EDGES.filter(e => e.to === nodeId);
}

function findCausalPaths(targetId: string, maxDepth: number = 4): CausalPath[] {
  const paths: CausalPath[] = [];
  function traverse(currentId: string, pathNodes: string[], pathEdges: CausalEdge[], depth: number) {
    if (depth >= maxDepth) return;
    const causes = getDirectCauses(currentId);
    if (causes.length === 0 && pathEdges.length > 0) {
      const totalWeight = pathEdges.reduce((p, e) => p * e.weight, 1);
      const totalConfidence = Math.min(...pathEdges.map(e => e.confidence));
      paths.push({
        nodes: [...pathNodes].reverse(),
        edges: [...pathEdges].reverse(),
        totalWeight, totalConfidence,
        description: pathNodes.map(id => NODES.find(n => n.id === id)?.label || id).reverse().join(' → '),
      });
      return;
    }
    for (const edge of causes) {
      if (pathNodes.includes(edge.from)) continue;
      traverse(edge.from, [...pathNodes, edge.from], [...pathEdges, edge], depth + 1);
    }
  }
  traverse(targetId, [targetId], [], 0);
  return paths.sort((a, b) => b.totalWeight - a.totalWeight);
}

// ============================================
// LATENT INFERENCE
// ============================================

function inferLatentStates() {
  const inferences: { node: string; label: string; inferredValue: number; evidence: string[]; confidence: number }[] = [];
  const sleepQ = NODES.find(n => n.id === 'sleep_quality')!;
  const sleepH = NODES.find(n => n.id === 'sleep_hours')!;
  const hr = NODES.find(n => n.id === 'heart_rate')!;

  let stressScore = 30;
  const stressEvidence: string[] = [];
  if (sleepQ.isAbnormal) { stressScore += 20; stressEvidence.push(`Sleep quality ${sleepQ.currentValue}/100 (low)`); }
  if (sleepH.isAbnormal) { stressScore += 15; stressEvidence.push(`Sleep ${sleepH.currentValue}h (below 7h)`); }
  if (hr.currentValue! > 80) { stressScore += 15; stressEvidence.push(`Heart rate ${hr.currentValue} BPM (elevated)`); }
  inferences.push({ node: 'stress_level', label: 'Stress Level', inferredValue: Math.min(100, stressScore), evidence: stressEvidence, confidence: 82 });

  const glucose = NODES.find(n => n.id === 'glucose')!;
  const hba1c = NODES.find(n => n.id === 'hba1c')!;
  const bmi = NODES.find(n => n.id === 'bmi')!;
  const sugar = NODES.find(n => n.id === 'sugar_intake')!;
  let irScore = 1.0;
  const irEvidence: string[] = [];
  if (glucose.isAbnormal) { irScore += 0.6; irEvidence.push(`Fasting glucose ${glucose.currentValue} mg/dL`); }
  if (hba1c.isAbnormal) { irScore += 0.5; irEvidence.push(`HbA1c ${hba1c.currentValue}%`); }
  if (bmi.isAbnormal) { irScore += 0.4; irEvidence.push(`BMI ${bmi.currentValue}`); }
  if (sugar.isAbnormal) { irScore += 0.3; irEvidence.push(`Sugar intake ${sugar.currentValue}g/day`); }
  inferences.push({ node: 'insulin_resistance', label: 'Insulin Resistance', inferredValue: irScore, evidence: irEvidence, confidence: 88 });

  return inferences;
}

// ============================================
// ROOT CAUSE ANALYSIS
// ============================================

const MODIFIABLE = new Set(['sleep_hours', 'sleep_quality', 'salt_intake', 'steps', 'sugar_intake', 'bmi', 'stress_level']);
const RECS: Record<string, string> = {
  sleep_hours: 'Aim for 7-9 hours. Set a 10 PM bedtime, avoid screens 1 hour before bed.',
  sleep_quality: 'Cool dark room. Try 4-7-8 breathing before bed.',
  salt_intake: 'Reduce to under 5g/day. Avoid pickles, papads, processed foods.',
  steps: 'Aim for 8,000-10,000 steps. Start with 15-min walks after meals.',
  sugar_intake: 'Limit added sugar to under 25g/day. Replace with fruits.',
  bmi: 'Portion control + 150 min/week moderate exercise.',
  stress_level: 'Daily 10-min meditation. Yoga or deep breathing.',
};

export function analyzeRootCauses(targetNodeId: string): CausalAnalysis {
  const target = NODES.find(n => n.id === targetNodeId)!;
  const paths = findCausalPaths(targetNodeId, 4);
  const causeMap = new Map<string, { paths: CausalPath[]; maxWeight: number; maxConfidence: number }>();

  for (const path of paths) {
    const rootId = path.nodes[0];
    if (!causeMap.has(rootId)) causeMap.set(rootId, { paths: [], maxWeight: 0, maxConfidence: 0 });
    const e = causeMap.get(rootId)!;
    e.paths.push(path);
    if (path.totalWeight > e.maxWeight) { e.maxWeight = path.totalWeight; e.maxConfidence = path.totalConfidence; }
  }

  const totalWeight = Array.from(causeMap.values()).reduce((s, e) => s + e.maxWeight, 0);
  const rootCauses: RootCause[] = Array.from(causeMap.entries()).map(([nodeId, data]) => {
    const node = NODES.find(n => n.id === nodeId)!;
    const bestPath = data.paths.sort((a, b) => b.totalWeight - a.totalWeight)[0];
    return {
      nodeId, nodeLabel: node.label,
      contribution: Math.round((data.maxWeight / totalWeight) * 100),
      confidence: Math.round(data.maxConfidence * 100),
      causalPath: bestPath,
      modifiable: MODIFIABLE.has(nodeId),
      timeToEffect: bestPath.edges[0]?.timeDelay || 'medium',
      recommendation: RECS[nodeId] || `Consult a doctor about managing ${node.label.toLowerCase()}.`,
    };
  }).sort((a, b) => b.contribution - a.contribution);

  const latentInferences = inferLatentStates();
  const alternativeHypotheses: string[] = [];
  rootCauses.slice(1, 3).forEach(c => alternativeHypotheses.push(`${c.nodeLabel} may also contribute (${c.contribution}%, ${c.confidence}% confidence)`));
  if (targetNodeId === 'bp_systolic' || targetNodeId === 'bp_diastolic') {
    alternativeHypotheses.push('Genetic predisposition to hypertension (family history)');
    alternativeHypotheses.push('Underlying kidney or thyroid condition (requires evaluation)');
  }

  const top = rootCauses[0];
  const primaryInsight = top
    ? `Your ${target.label.toLowerCase()} is primarily caused by ${top.nodeLabel.toLowerCase()} (${top.contribution}% contribution). ${top.modifiable ? 'This is modifiable — ' + top.recommendation : 'May require medical evaluation.'}`
    : `Insufficient data for ${target.label}.`;

  const avgConfidence = rootCauses.length > 0 ? Math.round(rootCauses.reduce((s, c) => s + c.confidence, 0) / rootCauses.length) : 0;

  return { targetNode: targetNodeId, targetLabel: target.label, rootCauses, latentInferences, confidence: avgConfidence, alternativeHypotheses, primaryInsight };
}

// ============================================
// INTERVENTION SIMULATOR — do(X) operator
// ============================================

export function simulateIntervention(nodeId: string, changeAmount: number, currentValues: Record<string, number>): InterventionResult {
  const node = NODES.find(n => n.id === nodeId)!;
  const oldValue = currentValues[nodeId] || node.currentValue || 0;
  const visited = new Set<string>([nodeId]);
  const affected: InterventionResult['affectedVariables'] = [];

  function propagate(currentId: string, currentChange: number, depth: number) {
    if (depth > 4) return;
    const effects = EDGES.filter(e => e.from === currentId);
    for (const edge of effects) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      const tNode = NODES.find(n => n.id === edge.to)!;
      const oldVal = currentValues[edge.to] || tNode.currentValue || 0;
      const dir = edge.direction === 'positive' ? 1 : -1;
      const propagated = currentChange * edge.weight * dir;
      const predicted = oldVal + propagated;
      const changePct = oldVal !== 0 ? Math.round((propagated / oldVal) * 100) : 0;
      affected.push({ nodeId: edge.to, nodeLabel: tNode.label, oldValue: Math.round(oldVal * 10) / 10, predictedValue: Math.round(predicted * 10) / 10, changePercent: changePct, timeToEffect: edge.timeDelay });
      propagate(edge.to, propagated, depth + 1);
    }
  }
  propagate(nodeId, changeAmount, 0);

  const confidence = Math.min(90, 60 + affected.length * 5);
  const sig = affected.filter(v => Math.abs(v.changePercent) >= 2);
  const summary = sig.length > 0
    ? `Changing ${node.label} by ${changeAmount > 0 ? '+' : ''}${changeAmount} ${node.unit || ''} predicts ${sig.length} variable(s) affected: ${sig.slice(0, 3).map(v => `${v.nodeLabel} (${v.changePercent > 0 ? '+' : ''}${v.changePercent}%)`).join(', ')}.`
    : `Changing ${node.label} by ${changeAmount > 0 ? '+' : ''}${changeAmount} ${node.unit || ''} has minimal predicted impact.`;

  return { targetVariable: nodeId, changeAmount, affectedVariables: affected.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)), confidence, summary };
}

export function getAbnormalNodes(): CausalNode[] { return NODES.filter(n => n.isAbnormal && n.type === 'observed'); }
export function getNodeById(id: string): CausalNode | undefined { return NODES.find(n => n.id === id); }
