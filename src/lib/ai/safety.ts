// ============================================
// AAROGYA AI — SAFETY LAYER
// Medical guardrails, risk detection, escalation
// ============================================

import type { SafetyFlag, SafetyAssessment } from '@/types/aarogya';

// Red-flag symptoms that require emergency escalation
const EMERGENCY_SYMPTOMS = [
  'chest pain', 'crushing chest', 'chest pressure',
  'difficulty breathing', 'shortness of breath', 'can\'t breathe',
  'severe bleeding', 'uncontrolled bleeding', 'hemorrhage',
  'loss of consciousness', 'fainting', 'unconscious',
  'seizure', 'convulsion',
  'stroke', 'face drooping', 'arm weakness', 'speech difficulty',
  'suicidal', 'kill myself', 'end my life', 'self-harm',
  'overdose', 'poisoning',
  'anaphylaxis', 'severe allergic reaction',
  'severe head injury', 'head trauma',
  'sudden severe headache', 'thunderclap headache',
  'paralysis', 'can\'t move',
  'severe burns',
  'choking',
];

const URGENT_SYMPTOMS = [
  'high fever', 'persistent fever',
  'severe pain', 'unbearable pain',
  'vomiting blood', 'blood in stool', 'blood in urine',
  'severe dehydration',
  'rapid heartbeat', 'palpitations',
  'severe abdominal pain',
  'vision loss', 'sudden vision changes',
  'confusion', 'disorientation',
  'pregnancy bleeding', 'severe pregnancy pain',
];

const MEDICATION_KEYWORDS = [
  'dosage', 'dose', 'how much', 'how many mg',
  'prescribe', 'prescription',
  'can i take', 'should i take',
  'overdose', 'mixing medications',
];

// ============================================
// ASSESS INPUT SAFETY
// ============================================

export function assessInputSafety(
  input: string,
  context?: { age?: number; gender?: string; knownConditions?: string[] }
): SafetyAssessment {
  const flags: SafetyFlag[] = [];
  const lowerInput = input.toLowerCase();

  // Check emergency symptoms
  const hasEmergency = EMERGENCY_SYMPTOMS.some(s => lowerInput.includes(s));
  if (hasEmergency) {
    flags.push('emergency_symptom');
  }

  // Check urgent symptoms
  const hasUrgent = URGENT_SYMPTOMS.some(s => lowerInput.includes(s));
  if (hasUrgent && !hasEmergency) {
    flags.push('requires_doctor');
  }

  // Check medication queries
  const hasMedQuery = MEDICATION_KEYWORDS.some(k => lowerInput.includes(k));
  if (hasMedQuery) {
    flags.push('medication_query');
  }

  // Check pediatric case
  if (context?.age && context.age < 12) {
    flags.push('pediatric_case');
  }

  // Check pregnancy
  if (lowerInput.includes('pregnan') && context?.gender?.toLowerCase() === 'female') {
    flags.push('pregnancy_case');
  }

  // Determine risk level
  let riskLevel: SafetyAssessment['riskLevel'] = 'safe';
  let escalationRequired = false;

  if (flags.includes('emergency_symptom')) {
    riskLevel = 'emergency';
    escalationRequired = true;
  } else if (flags.includes('critical_lab_value') || flags.includes('high_risk_prediction')) {
    riskLevel = 'high_risk';
    escalationRequired = true;
  } else if (flags.length > 0) {
    riskLevel = 'caution';
  }

  const disclaimer = generateDisclaimer(riskLevel, flags);

  return { flags, riskLevel, escalationRequired, disclaimer };
}

// ============================================
// ASSESS OUTPUT SAFETY (for AI results)
// ============================================

export function assessOutputSafety(data: any, type: string): SafetyAssessment {
  const flags: SafetyFlag[] = [];

  // Check urgency field
  if (data?.urgency === 'emergency') {
    flags.push('emergency_symptom');
  }

  // Check critical lab values
  if (data?.critical_alerts?.length > 0 || data?.overall_status === 'critical') {
    flags.push('critical_lab_value');
  }

  // Check confidence
  if (data?.confidence !== undefined && data.confidence < 50) {
    flags.push('low_confidence');
  }

  // Check high risk predictions
  if (data?.risk_assessment?.some((r: any) => r.projected_risk > 60)) {
    flags.push('high_risk_prediction');
  }

  // Non-routine always requires doctor
  if (data?.urgency && data.urgency !== 'routine') {
    flags.push('requires_doctor');
  }

  let riskLevel: SafetyAssessment['riskLevel'] = 'safe';
  let escalationRequired = false;

  if (flags.includes('emergency_symptom') || flags.includes('critical_lab_value')) {
    riskLevel = 'emergency';
    escalationRequired = true;
  } else if (flags.includes('high_risk_prediction')) {
    riskLevel = 'high_risk';
    escalationRequired = true;
  } else if (flags.length > 0) {
    riskLevel = 'caution';
  }

  const disclaimer = generateDisclaimer(riskLevel, flags);

  return { flags, riskLevel, escalationRequired, disclaimer };
}

// ============================================
// GENERATE CONTEXTUAL DISCLAIMER
// ============================================

function generateDisclaimer(
  riskLevel: SafetyAssessment['riskLevel'],
  flags: SafetyFlag[]
): string {
  if (riskLevel === 'emergency') {
    return '⚠️ EMERGENCY: This may be a medical emergency. Call 108 (ambulance) or go to the nearest emergency room immediately. Do not wait.';
  }

  if (flags.includes('medication_query')) {
    return '⚠️ Medication advice: Only a qualified doctor can prescribe or adjust medication dosages. Please consult your physician.';
  }

  if (flags.includes('pediatric_case')) {
    return '⚠️ Pediatric case: For children under 12, always consult a pediatrician before taking any action.';
  }

  if (flags.includes('pregnancy_case')) {
    return '⚠️ Pregnancy: Any health concern during pregnancy should be evaluated by an obstetrician promptly.';
  }

  if (riskLevel === 'high_risk') {
    return '⚠️ High risk detected: Please consult a doctor at the earliest. This AI analysis is not a substitute for professional medical advice.';
  }

  if (riskLevel === 'caution') {
    return 'ℹ️ This AI analysis is for informational purposes only. Please consult a healthcare professional for proper diagnosis and treatment.';
  }

  return 'ℹ️ This AI analysis is for wellness purposes only and is not a substitute for professional medical diagnosis or treatment.';
}

// ============================================
// ESCALATION MESSAGE
// ============================================

export function getEscalationMessage(riskLevel: SafetyAssessment['riskLevel']): string | null {
  switch (riskLevel) {
    case 'emergency':
      return '🚨 Based on your symptoms, this may be a medical emergency. Please call 108 (Indian Emergency Number) or visit the nearest emergency room immediately. Do not delay.';
    case 'high_risk':
      return '⚠️ Your health data indicates a high-risk pattern. We strongly recommend booking a doctor consultation at the earliest.';
    default:
      return null;
  }
}

// ============================================
// SANITIZE INPUT
// ============================================

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 5000); // Limit length
}
