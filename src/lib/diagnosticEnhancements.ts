// ============================================
// AAROGYA AI — DIAGNOSTIC ENHANCEMENT OVERLAY (Modules 9 + 10)
//
// A LIGHTWEIGHT enhancement layer that sits ON TOP of existing:
//   - Lab Report Analyzer (Module 9)
//   - X-ray / Imaging Reader (Module 9)
//   - Disease Predictor (Module 10)
//
// STRICT NON-DESTRUCTIVE RULE:
//   - Does NOT import or modify ReportAnalyzer / XrayReader / DiseasePredictor
//   - Does NOT duplicate their logic
//   - It READS their findings (passed in as input) and ADDS:
//     • Trend detection (Module 9)
//     • Cross-analysis (Module 9 — lab↔imaging correlations)
//     • Multi-disease prediction (Module 10)
//     • Early-stage detection (Module 10)
//
// Architecture:
//   Existing module output → Enhancement overlay → Enhanced insights
//   (one-directional, read-only on existing modules)
// ============================================

// ---------------------------------------------------------------------------
// MODULE 9: LAB + IMAGING ENHANCEMENT
// ---------------------------------------------------------------------------

export interface LabReading {
  date: string;
  testName: string;
  value: number;
  unit: string;
  referenceLow: number;
  referenceHigh: number;
}

export interface TrendDetection {
  testName: string;
  direction: 'rising' | 'falling' | 'stable' | 'volatile';
  ratePerMonth: number;
  readings: { date: string; value: number }[];
  significance: 'benign' | 'monitor' | 'concerning' | 'critical';
  projectedValue90d: number;
  crossesThreshold: boolean;         // will it cross clinical threshold soon?
  daysToThreshold?: number;
  insight: string;
}

export interface CrossAnalysisLink {
  labFinding: string;
  imagingFinding: string;
  correlation: string;
  strength: number;                  // 0-100
  clinicalSignificance: string;
}

export interface ImagingFinding {
  modality: string;                  // 'X-ray', 'MRI', 'CT', 'Ultrasound'
  finding: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  location?: string;
}

export interface LabImagingEnhancement {
  trends: TrendDetection[];
  crossAnalysisLinks: CrossAnalysisLink[];
  summary: string;
  alerts: string[];
}

// --- Trend detection across serial lab readings ---
export function detectLabTrends(readings: LabReading[]): TrendDetection[] {
  // Group by testName
  const grouped: Record<string, LabReading[]> = {};
  readings.forEach(r => {
    if (!grouped[r.testName]) grouped[r.testName] = [];
    grouped[r.testName].push(r);
  });

  const trends: TrendDetection[] = [];
  Object.entries(grouped).forEach(([testName, testReadings]) => {
    // Need at least 2 readings to detect a trend
    if (testReadings.length < 2) return;

    // Sort by date
    const sorted = [...testReadings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const values = sorted.map(r => r.value);
    const dates = sorted.map(r => new Date(r.date).getTime());

    // Linear regression for rate
    const n = values.length;
    const sumX = dates.reduce((s, d) => s + d, 0);
    const sumY = values.reduce((s, v) => s + v, 0);
    const sumXY = dates.reduce((s, d, i) => s + d * values[i], 0);
    const sumXX = dates.reduce((s, d) => s + d * d, 0);
    const slope = n * sumXY - sumX * sumY !== 0 && (n * sumXX - sumX * sumX) !== 0
      ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
      : 0;

    const msPerMonth = 30 * 24 * 60 * 60 * 1000;
    const ratePerMonth = slope * msPerMonth;

    // Determine direction
    const firstVal = values[0];
    const lastVal = values[values.length - 1];
    const change = lastVal - firstVal;
    const ref = sorted[sorted.length - 1];

    let direction: TrendDetection['direction'] = 'stable';
    if (Math.abs(ratePerMonth) < Math.abs(firstVal) * 0.005) direction = 'stable';
    else if (ratePerMonth > 0) direction = 'rising';
    else direction = 'falling';

    // Check volatility (variance in direction)
    if (values.length >= 3) {
      const diffs = values.slice(1).map((v, i) => v - values[i]);
      const signChanges = diffs.slice(1).filter((d, i) => Math.sign(d) !== Math.sign(diffs[i])).length;
      if (signChanges >= diffs.length / 2) direction = 'volatile';
    }

    // Project 90 days ahead
    const projectedValue90d = lastVal + ratePerMonth * 3;

    // Will it cross a threshold?
    const highThreshold = ref.referenceHigh;
    const lowThreshold = ref.referenceLow;
    let crossesThreshold = false;
    let daysToThreshold: number | undefined;
    if (direction === 'rising' && lastVal < highThreshold && projectedValue90d >= highThreshold) {
      crossesThreshold = true;
      const remaining = highThreshold - lastVal;
      daysToThreshold = Math.round(remaining / ratePerMonth * 30);
    } else if (direction === 'falling' && lastVal > lowThreshold && projectedValue90d <= lowThreshold) {
      crossesThreshold = true;
      const remaining = lastVal - lowThreshold;
      daysToThreshold = Math.round(remaining / Math.abs(ratePerMonth) * 30);
    }

    // Significance
    let significance: TrendDetection['significance'] = 'benign';
    const pctChange = firstVal !== 0 ? Math.abs(change / firstVal) * 100 : 0;
    if (crossesThreshold || (lastVal > highThreshold && direction === 'rising') || (lastVal < lowThreshold && direction === 'falling')) {
      significance = 'critical';
    } else if (pctChange > 20 || crossesThreshold) {
      significance = 'concerning';
    } else if (pctChange > 10 || direction !== 'stable') {
      significance = 'monitor';
    }

    const insight = generateTrendInsight(testName, direction, ratePerMonth, significance, crossesThreshold, daysToThreshold);

    trends.push({
      testName,
      direction,
      ratePerMonth: Math.round(ratePerMonth * 100) / 100,
      readings: sorted.map(r => ({ date: r.date, value: r.value })),
      significance,
      projectedValue90d: Math.round(projectedValue90d * 100) / 100,
      crossesThreshold,
      daysToThreshold,
      insight,
    });
  });

  return trends.sort((a, b) => {
    const order = { critical: 3, concerning: 2, monitor: 1, benign: 0 };
    return order[b.significance] - order[a.significance];
  });
}

function generateTrendInsight(
  testName: string,
  direction: string,
  rate: number,
  significance: string,
  crosses: boolean,
  days?: number,
): string {
  const dirText = direction === 'rising' ? 'rising' : direction === 'falling' ? 'falling' : direction === 'volatile' ? 'volatile' : 'stable';
  if (significance === 'critical' && crosses && days) {
    return `${testName} is ${dirText} at ${Math.abs(rate).toFixed(2)}/month — will cross clinical threshold in ~${days} days. Immediate review recommended.`;
  }
  if (significance === 'concerning') {
    return `${testName} shows a ${dirText} trend (${Math.abs(rate).toFixed(2)}/month). Monitor closely — approaching concerning range.`;
  }
  if (significance === 'monitor') {
    return `${testName} is ${dirText} slowly (${Math.abs(rate).toFixed(2)}/month). Routine monitoring advised.`;
  }
  return `${testName} is ${dirText}. Within expected variance.`;
}

// --- Cross-analysis between lab findings and imaging findings ---
export function detectCrossAnalysisLinks(
  labFindings: { testName: string; value: number; abnormal: boolean }[],
  imagingFindings: ImagingFinding[],
): CrossAnalysisLink[] {
  const links: CrossAnalysisLink[] = [];

  // Curated correlation rules (lab finding ↔ imaging finding)
  const correlationRules: { lab: string; imaging: string; correlation: string; significance: string }[] = [
    {
      lab: 'HbA1c',
      imaging: 'Cardiomegaly',
      correlation: 'Chronic hyperglycemia + cardiac enlargement → diabetic cardiomyopathy risk',
      significance: 'High — diabetic cardiomyopathy should be evaluated',
    },
    {
      lab: 'LDL',
      imaging: 'Cardiomegaly',
      correlation: 'Elevated LDL + cardiomegaly → atherosclerotic cardiovascular disease',
      significance: 'High — aggressive lipid management indicated',
    },
    {
      lab: 'Hemoglobin',
      imaging: 'Cardiomegaly',
      correlation: 'Anemia + cardiomegaly → high-output cardiac state; consider chronic anemia effect on heart',
      significance: 'Moderate — anemia correction may improve cardiac dimensions',
    },
    {
      lab: 'Creatinine',
      imaging: 'Pleural effusion',
      correlation: 'Renal impairment + pleural effusion → volume overload; consider CKD-related fluid retention',
      significance: 'High — nephrology evaluation indicated',
    },
    {
      lab: 'WBC',
      imaging: 'Consolidation',
      correlation: 'Leukocytosis + pulmonary consolidation → bacterial infection confirmed',
      significance: 'High — supports antibiotic therapy decision',
    },
    {
      lab: 'CRP',
      imaging: 'Consolidation',
      correlation: 'Elevated inflammatory marker + consolidation → active infection/inflammation',
      significance: 'Moderate — severity stratification',
    },
    {
      lab: 'ALT',
      imaging: 'Hepatomegaly',
      correlation: 'Hepatic enzyme elevation + hepatomegaly → hepatic steatosis or hepatocellular injury',
      significance: 'Moderate — further liver workup indicated',
    },
    {
      lab: 'TSH',
      imaging: 'Pericardial effusion',
      correlation: 'Hypothyroidism + pericardial effusion → myxedema-related effusion',
      significance: 'High — thyroid replacement may resolve effusion',
    },
  ];

  labFindings.forEach(lab => {
    imagingFindings.forEach(img => {
      const rule = correlationRules.find(r =>
        lab.testName.toLowerCase().includes(r.lab.toLowerCase()) &&
        img.finding.toLowerCase().includes(r.imaging.toLowerCase())
      );
      if (rule && (lab.abnormal || img.severity !== 'normal')) {
        // Strength based on abnormality of both
        const labStrength = lab.abnormal ? 60 : 30;
        const imgStrength = img.severity === 'severe' ? 40 : img.severity === 'moderate' ? 30 : img.severity === 'mild' ? 20 : 10;
        links.push({
          labFinding: `${lab.testName} (${lab.value})`,
          imagingFinding: `${img.modality}: ${img.finding}${img.location ? ` (${img.location})` : ''}`,
          correlation: rule.correlation,
          strength: labStrength + imgStrength,
          clinicalSignificance: rule.significance,
        });
      }
    });
  });

  return links.sort((a, b) => b.strength - a.strength);
}

export function enhanceLabImaging(
  readings: LabReading[],
  labFindings: { testName: string; value: number; abnormal: boolean }[],
  imagingFindings: ImagingFinding[],
): LabImagingEnhancement {
  const trends = detectLabTrends(readings);
  const crossAnalysisLinks = detectCrossAnalysisLinks(labFindings, imagingFindings);

  const alerts: string[] = [];
  trends.forEach(t => {
    if (t.significance === 'critical') alerts.push(`CRITICAL: ${t.insight}`);
    else if (t.significance === 'concerning') alerts.push(`WARNING: ${t.insight}`);
  });
  crossAnalysisLinks.forEach(l => {
    if (l.strength >= 80) alerts.push(`CROSS-ANALYSIS: ${l.correlation}`);
  });

  const summary = trends.length > 0
    ? `${trends.length} trend(s) detected across lab readings. ${trends.filter(t => t.significance === 'critical' || t.significance === 'concerning').length} require attention. ${crossAnalysisLinks.length} lab-imaging correlation(s) found.`
    : 'Insufficient serial data for trend analysis. Single-timepoint findings only.';

  return { trends, crossAnalysisLinks, summary, alerts };
}

// ---------------------------------------------------------------------------
// MODULE 10: DISEASE PREDICTOR ENHANCEMENT
// ---------------------------------------------------------------------------

export interface DiseaseRisk {
  disease: string;
  probability: number;               // 0-100
  stage: 'early' | 'established' | 'advanced';
  confidence: number;                // 0-100
  modifiableRiskFactors: string[];
  earlyWarningSignals: string[];
  recommendedScreening: string[];
}

export interface MultiDiseasePrediction {
  primaryRisk: DiseaseRisk;
  comorbidRisks: DiseaseRisk[];
  earlyStageDetections: DiseaseRisk[];
  riskInteractions: { diseases: string[]; interaction: string; combinedRisk: number }[];
  summary: string;
  recommendation: string;
}

// --- Multi-disease prediction with early-stage detection ---
export function enhanceDiseasePrediction(
  findings: { name: string; value?: string; abnormal: boolean; category?: string }[],
  age: number,
  gender: string,
): MultiDiseasePrediction {
  const risks: DiseaseRisk[] = [];

  // Curated multi-disease detection rules
  // Each rule evaluates multiple findings to produce a risk assessment

  // Type 2 Diabetes
  const fpg = findings.find(f => f.name.toLowerCase().includes('fasting glucose') || f.name.toLowerCase().includes('fpg'));
  const hba1c = findings.find(f => f.name.toLowerCase().includes('hba1c'));
  const bmi = findings.find(f => f.name.toLowerCase().includes('bmi'));
  if (fpg || hba1c) {
    const fpgVal = fpg?.value ? parseFloat(fpg.value) : NaN;
    const hba1cVal = hba1c?.value ? parseFloat(hba1c.value) : NaN;
    let prob = 20; // baseline for age
    let stage: DiseaseRisk['stage'] = 'early';
    if (!isNaN(hba1cVal) && hba1cVal >= 6.5) { prob = 85; stage = 'established'; }
    else if (!isNaN(hba1cVal) && hba1cVal >= 5.7) { prob = 55; stage = 'early'; }
    if (!isNaN(fpgVal) && fpgVal >= 126) { prob = Math.max(prob, 80); stage = 'established'; }
    else if (!isNaN(fpgVal) && fpgVal >= 100) { prob = Math.max(prob, 45); stage = 'early'; }
    if (bmi?.value && parseFloat(bmi.value) > 25) prob += 8;
    risks.push({
      disease: 'Type 2 Diabetes Mellitus',
      probability: Math.min(95, prob),
      stage,
      confidence: Math.min(90, 50 + (hba1c ? 20 : 0) + (fpg ? 15 : 0)),
      modifiableRiskFactors: ['BMI reduction', 'Dietary modification', 'Physical activity', 'Sleep optimization'],
      earlyWarningSignals: ['HbA1c 5.7-6.4%', 'Fasting glucose 100-125', 'Elevated triglycerides', 'Low HDL'],
      recommendedScreening: ['Annual HbA1c', 'Fasting glucose quarterly', 'OGTT if borderline'],
    });
  }

  // Cardiovascular Disease (ASCVD)
  const ldl = findings.find(f => f.name.toLowerCase().includes('ldl'));
  const hdl = findings.find(f => f.name.toLowerCase().includes('hdl'));
  const bp = findings.find(f => f.name.toLowerCase().includes('blood pressure') || f.name.toLowerCase().includes('bp'));
  if (ldl || bp) {
    let prob = 15 + (age > 50 ? 15 : 0);
    let stage: DiseaseRisk['stage'] = 'early';
    const ldlVal = ldl?.value ? parseInt(ldl.value) : NaN;
    if (!isNaN(ldlVal) && ldlVal >= 160) { prob += 30; stage = 'established'; }
    else if (!isNaN(ldlVal) && ldlVal >= 130) { prob += 18; }
    if (bp?.value) {
      const sys = parseInt(bp.value.split('/')[0]);
      if (!isNaN(sys) && sys >= 140) { prob += 20; }
      else if (!isNaN(sys) && sys >= 130) { prob += 12; }
    }
    if (gender === 'Male') prob += 8;
    risks.push({
      disease: 'Atherosclerotic Cardiovascular Disease',
      probability: Math.min(92, prob),
      stage,
      confidence: Math.min(85, 55 + (ldl ? 15 : 0) + (bp ? 15 : 0)),
      modifiableRiskFactors: ['LDL reduction', 'Blood pressure control', 'Smoking cessation', 'Exercise'],
      earlyWarningSignals: ['LDL 130-159', 'BP 130-139/85-89', 'hs-CRP > 2', 'CAC score > 100'],
      recommendedScreening: ['Lipid panel annually', 'ASCVD risk calculator', 'CAC score if intermediate'],
    });
  }

  // Hypertension
  if (bp?.value) {
    const sys = parseInt(bp.value.split('/')[0]);
    const dia = parseInt(bp.value.split('/')[1]);
    if (!isNaN(sys)) {
      let prob = 25;
      let stage: DiseaseRisk['stage'] = 'early';
      if (sys >= 140 || (dia >= 90 && !isNaN(dia))) { prob = 82; stage = 'established'; }
      else if (sys >= 130 || (dia >= 80 && !isNaN(dia))) { prob = 58; stage = 'early'; }
      risks.push({
        disease: 'Hypertension',
        probability: Math.min(90, prob + (age > 55 ? 10 : 0)),
        stage,
        confidence: 78,
        modifiableRiskFactors: ['Sodium reduction', 'Weight management', 'Alcohol moderation', 'Stress management'],
        earlyWarningSignals: ['BP 120-129/<80 elevated', 'BP variability increasing', 'Morning BP surge'],
        recommendedScreening: ['Home BP monitoring', 'Ambulatory BP if borderline', 'Annual ECG'],
      });
    }
  }

  // Chronic Kidney Disease
  const creatinine = findings.find(f => f.name.toLowerCase().includes('creatinine'));
  const egfr = findings.find(f => f.name.toLowerCase().includes('egfr'));
  if (creatinine || egfr) {
    const egfrVal = egfr?.value ? parseFloat(egfr.value) : NaN;
    let prob = 12;
    let stage: DiseaseRisk['stage'] = 'early';
    if (!isNaN(egfrVal) && egfrVal < 60) { prob = 75; stage = 'established'; }
    else if (!isNaN(egfrVal) && egfrVal < 90) { prob = 38; stage = 'early'; }
    risks.push({
      disease: 'Chronic Kidney Disease',
      probability: Math.min(85, prob + (age > 60 ? 12 : 0)),
      stage,
      confidence: 72,
      modifiableRiskFactors: ['Blood pressure control', 'Glycemic control', 'NSAID avoidance', 'Hydration'],
      earlyWarningSignals: ['eGFR 60-89 (stage 2)', 'Microalbuminuria', 'Rising creatinine trend'],
      recommendedScreening: ['eGFR annually', 'Urine albumin/creatinine ratio', 'Renal ultrasound if indicated'],
    });
  }

  // Iron-Deficiency Anemia
  const hb = findings.find(f => f.name.toLowerCase().includes('hemoglobin') || f.name.toLowerCase().includes('hb '));
  const ferritin = findings.find(f => f.name.toLowerCase().includes('ferritin'));
  if (hb || ferritin) {
    const hbVal = hb?.value ? parseFloat(hb.value) : NaN;
    let prob = 18;
    let stage: DiseaseRisk['stage'] = 'early';
    if (!isNaN(hbVal) && hbVal < 10) { prob = 88; stage = 'established'; }
    else if (!isNaN(hbVal) && hbVal < 12) { prob = 62; stage = 'early'; }
    if (gender === 'Female') prob += 15;
    if (ferritin?.value && parseFloat(ferritin.value) < 30) prob += 15;
    risks.push({
      disease: 'Iron-Deficiency Anemia',
      probability: Math.min(92, prob),
      stage,
      confidence: 80,
      modifiableRiskFactors: ['Iron supplementation', 'Dietary iron', 'Treating underlying blood loss'],
      earlyWarningSignals: ['Hb 11-12 (women)', 'Ferritin < 30', 'MCV 80-90 (early)', 'Transferrin saturation < 20%'],
      recommendedScreening: ['CBC every 6 months', 'Iron studies annually', 'Endoscopy if refractory'],
    });
  }

  // Hypothyroidism
  const tsh = findings.find(f => f.name.toLowerCase().includes('tsh'));
  if (tsh?.value) {
    const tshVal = parseFloat(tsh.value);
    if (!isNaN(tshVal)) {
      let prob = 15;
      let stage: DiseaseRisk['stage'] = 'early';
      if (tshVal > 10) { prob = 85; stage = 'established'; }
      else if (tshVal > 4) { prob = 55; stage = 'early'; }
      if (gender === 'Female') prob += 10;
      risks.push({
        disease: 'Hypothyroidism',
        probability: Math.min(88, prob),
        stage,
        confidence: 82,
        modifiableRiskFactors: ['Iodine adequacy', 'Selenium intake', 'Avoiding excess goitrogens'],
        earlyWarningSignals: ['TSH 4-10 (subclinical)', 'Rising TSH trend', 'Fatigue + cold intolerance'],
        recommendedScreening: ['TSH every 6-12 months', 'Free T4 if abnormal', 'Anti-TPO antibodies'],
      });
    }
  }

  // Sort by probability
  risks.sort((a, b) => b.probability - a.probability);

  // Identify early-stage detections (stage = early AND probability > 30)
  const earlyStage = risks.filter(r => r.stage === 'early' && r.probability > 30);

  // Primary = highest risk; comorbid = rest
  const primary = risks[0] || {
    disease: 'No significant risk detected',
    probability: 15, stage: 'early' as const, confidence: 70,
    modifiableRiskFactors: ['Maintain healthy lifestyle'],
    earlyWarningSignals: [],
    recommendedScreening: ['Annual wellness check'],
  };
  const comorbid = risks.slice(1);

  // Risk interactions (diseases that compound each other)
  const interactions: MultiDiseasePrediction['riskInteractions'] = [];
  const diseaseNames = risks.map(r => r.disease);
  if (diseaseNames.includes('Type 2 Diabetes Mellitus') && diseaseNames.includes('Atherosclerotic Cardiovascular Disease')) {
    interactions.push({
      diseases: ['T2DM', 'ASCVD'],
      interaction: 'Diabetes accelerates atherosclerosis — combined risk is multiplicative, not additive',
      combinedRisk: Math.min(95, (primary.probability + (risks.find(r => r.disease === 'Atherosclerotic Cardiovascular Disease')?.probability || 0)) * 0.7),
    });
  }
  if (diseaseNames.includes('Type 2 Diabetes Mellitus') && diseaseNames.includes('Chronic Kidney Disease')) {
    interactions.push({
      diseases: ['T2DM', 'CKD'],
      interaction: 'Diabetic nephropathy — T2DM is leading cause of CKD; SGLT2i indicated',
      combinedRisk: Math.min(92, (risks.find(r => r.disease === 'Type 2 Diabetes Mellitus')?.probability || 0) * 0.6),
    });
  }
  if (diseaseNames.includes('Hypertension') && diseaseNames.includes('Chronic Kidney Disease')) {
    interactions.push({
      diseases: ['HTN', 'CKD'],
      interaction: 'Hypertension accelerates CKD progression — BP target < 130/80',
      combinedRisk: Math.min(90, (risks.find(r => r.disease === 'Hypertension')?.probability || 0) * 0.55),
    });
  }

  const summary = `${risks.length} disease risk(s) assessed. Primary: ${primary.disease} (${primary.probability}% probability, ${primary.stage} stage). ${earlyStage.length} early-stage detection(s). ${interactions.length} risk interaction(s) identified.`;

  const recommendation = earlyStage.length > 0
    ? `${earlyStage.length} early-stage risk(s) detected — preventive intervention window is open. Focus on modifiable risk factors.`
    : primary.probability > 60
    ? 'High-risk assessment — clinical evaluation recommended within 2 weeks.'
    : 'Moderate risk — lifestyle optimization and routine monitoring advised.';

  return {
    primaryRisk: primary,
    comorbidRisks: comorbid,
    earlyStageDetections: earlyStage,
    riskInteractions: interactions,
    summary,
    recommendation,
  };
}
