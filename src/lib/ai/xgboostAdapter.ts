// ============================================
// AAROGYA AI — XGBOOST ENGINE ADAPTER
//
// Local ML engine for structured/tabular data prediction.
// No API key required — runs entirely server-side.
//
// Implements a gradient-boosting-style ensemble scorer that:
//   • Takes structured features (from Gemini extraction or direct input)
//   • Runs through weighted decision-tree-like rules
//   • Returns prediction + probability + feature importance
//
// This is a deterministic, lightweight simulation of XGBoost behavior
// suitable for the orchestration demo. In production, this could be
// replaced with a real XGBoost runtime (node-xgboost or a Python service).
// ============================================

import type { ExtractedFeature } from '@/lib/ai/orchestrationEngine';
import type { XGBoostPredictionResult } from '@/lib/ai/orchestrationEngine';

interface TreeNode {
  feature?: string;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: number;        // 0-1 probability
  weight?: number;
}

// Build a small ensemble of decision trees (3 trees, like a mini GBDT)
// Each tree evaluates a subset of features
const TREES: TreeNode[] = [
  // Tree 1: Metabolic risk
  {
    feature: 'hba1c',
    threshold: 6.5,
    left: {
      feature: 'fpg',
      threshold: 100,
      left: { prediction: 0.15, weight: 0.3 },
      right: { prediction: 0.35, weight: 0.3 },
    },
    right: {
      feature: 'bmi',
      threshold: 30,
      left: { prediction: 0.65, weight: 0.3 },
      right: { prediction: 0.85, weight: 0.3 },
    },
  },
  // Tree 2: Cardiovascular risk
  {
    feature: 'ldl',
    threshold: 130,
    left: {
      feature: 'systolic',
      threshold: 130,
      left: { prediction: 0.12, weight: 0.35 },
      right: { prediction: 0.30, weight: 0.35 },
    },
    right: {
      feature: 'age',
      threshold: 55,
      left: { prediction: 0.55, weight: 0.35 },
      right: { prediction: 0.78, weight: 0.35 },
    },
  },
  // Tree 3: General risk
  {
    feature: 'age',
    threshold: 50,
    left: {
      feature: 'bmi',
      threshold: 25,
      left: { prediction: 0.10, weight: 0.35 },
      right: { prediction: 0.25, weight: 0.35 },
    },
    right: {
      feature: 'hba1c',
      threshold: 5.7,
      left: { prediction: 0.30, weight: 0.35 },
      right: { prediction: 0.60, weight: 0.35 },
    },
  },
];

/**
 * Run a single decision tree on the feature map.
 */
function runTree(node: TreeNode, features: Record<string, number>): { probability: number; weight: number; path: string[] } {
  const path: string[] = [];
  let current = node;

  while (current.feature && current.threshold !== undefined) {
    const val = features[current.feature];
    path.push(`${current.feature}=${val ?? 'N/A'} vs ${current.threshold}`);
    if (val === undefined) {
      // Missing feature — go left (conservative)
      current = current.left!;
    } else if (val < current.threshold) {
      current = current.left!;
    } else {
      current = current.right!;
    }
  }

  return {
    probability: current.prediction ?? 0.5,
    weight: current.weight ?? 0.3,
    path,
  };
}

/**
 * Convert extracted features + structured data into a flat numeric map.
 */
function flattenFeatures(
  features: ExtractedFeature[],
  structured: Record<string, number | string | boolean> | undefined,
): Record<string, number> {
  const map: Record<string, number> = {};

  // From ExtractedFeature list
  features.forEach(f => {
    const key = f.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (typeof f.value === 'number') {
      map[key] = f.value;
    } else if (typeof f.value === 'string') {
      const parsed = parseFloat(f.value);
      if (!isNaN(parsed)) map[key] = parsed;
    }
  });

  // From structured data (takes precedence)
  if (structured) {
    Object.entries(structured).forEach(([k, v]) => {
      const key = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (typeof v === 'number') map[key] = v;
      else if (typeof v === 'string') {
        const parsed = parseFloat(v);
        if (!isNaN(parsed)) map[key] = parsed;
      } else if (typeof v === 'boolean') {
        map[key] = v ? 1 : 0;
      }
    });
  }

  return map;
}

/**
 * Run the XGBoost-style ensemble prediction.
 */
export async function predictWithXGBoost(
  features: ExtractedFeature[],
  structured: Record<string, number | string | boolean> | undefined,
): Promise<XGBoostPredictionResult> {
  // Simulate async ML inference time
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  const featureMap = flattenFeatures(features, structured);

  // Run all trees in the ensemble
  const treeResults = TREES.map((tree, i) => ({
    ...runTree(tree, featureMap),
    treeIndex: i,
  }));

  // Weighted average (ensemble aggregation — like GBDT)
  const totalWeight = treeResults.reduce((s, r) => s + r.weight, 0);
  const weightedProb = treeResults.reduce((s, r) => s + r.probability * r.weight, 0) / totalWeight;

  // Calculate feature importance (how often each feature was used as a splitter)
  const importanceMap: Record<string, number> = {};
  treeResults.forEach(r => {
    r.path.forEach(p => {
      const featName = p.split('=')[0];
      importanceMap[featName] = (importanceMap[featName] || 0) + r.weight;
    });
  });

  const contributingFeatures = Object.entries(importanceMap)
    .map(([name, importance]) => ({ name, importance: Math.round(importance / totalWeight * 100) / 100 }))
    .sort((a, b) => b.importance - a.importance);

  const riskScore = Math.round(weightedProb * 100);
  const probability = Math.round(weightedProb * 100) / 100;

  let prediction: string;
  if (riskScore >= 75) {
    prediction = 'High risk — clinical evaluation recommended within 1 week';
  } else if (riskScore >= 50) {
    prediction = 'Moderate risk — preventive intervention and monitoring advised';
  } else if (riskScore >= 30) {
    prediction = 'Low-moderate risk — lifestyle optimization recommended';
  } else {
    prediction = 'Low risk — maintain healthy lifestyle and routine screening';
  }

  return {
    prediction,
    probability,
    riskScore,
    contributingFeatures: contributingFeatures.length > 0 ? contributingFeatures : [{ name: 'baseline', importance: 1.0 }],
    model: 'xgboost-ensemble-v1 (3 trees)',
  };
}

/**
 * Get the tree structure for visualization.
 */
export function getTreeStructure(): { trees: number; description: string } {
  return {
    trees: TREES.length,
    description: '3-tree gradient-boosted ensemble (metabolic + cardiovascular + general risk)',
  };
}
