// ============================================
// AAROGYA AI — CORE TYPE SYSTEM
// Shared across all 21 health modules
// ============================================

// --- User & Metrics ---
export interface UserMetrics {
  weight: number;
  height: number;
  age: number;
  gender: string;
  steps: number;
  waterIntake: number;
  waterTarget: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  systolicBP: number;
  diastolicBP: number;
  sleepHours: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  knownConditions: string[];
  allergies: string[];
  medications: string[];
  language: string;
  bloodGroup?: string;
}

// --- Chat ---
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
  category?: 'general' | 'mental_health';
  confidence?: number;
  sources?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  category: 'general' | 'mental_health';
  updatedAt: string;
}

// --- Symptom Analysis ---
export interface SymptomAnalysis {
  primary_symptoms: string[];
  possible_conditions: {
    name: string;
    probability: 'low' | 'moderate' | 'high';
    reasoning: string;
  }[];
  urgency: 'routine' | 'within_week' | 'urgent' | 'emergency';
  red_flags: string[];
  recommended_specialty: string;
  suggested_tests: string[];
  home_care: string[];
  when_to_see_doctor: string[];
  summary_en: string;
  summary_hi: string;
  confidence: number;
}

// --- Lab Report ---
export interface Biomarker {
  name_en: string;
  name_hi: string;
  value: number;
  unit: string;
  normal_range: string;
  status: 'normal' | 'borderline' | 'abnormal' | 'critical';
  category: string;
  explanation_en: string;
  explanation_hi: string;
  causes_en: string;
  causes_hi: string;
  action_en: string;
  action_hi: string;
}

export interface LabReportAnalysis {
  critical_alerts: {
    test_name_en: string;
    test_name_hi: string;
    value: number;
    unit: string;
    normal_range: string;
    danger_level: 'high' | 'critical';
    emergency_action_en: string;
    emergency_action_hi: string;
  }[];
  categories: Record<string, Biomarker[]>;
  recommended_specialist: {
    type: string;
    urgency: string;
    reason_en: string;
    reason_hi: string;
  };
  summary_en: string;
  summary_hi: string;
  disclaimer: string;
  overall_status: 'normal' | 'needs_attention' | 'abnormal' | 'critical';
  confidence: number;
}

// --- X-Ray / Radiology ---
export interface XrayFinding {
  region: string;
  observation: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  confidence: number;
}

export interface XrayAnalysis {
  image_quality: 'adequate' | 'limited' | 'non-diagnostic';
  findings: XrayFinding[];
  impression_en: string;
  impression_hi: string;
  recommendations: string[];
  urgency: 'routine' | 'within_week' | 'urgent' | 'emergency';
  disclaimer: string;
  confidence: number;
}

// --- Diet Planning ---
export interface Meal {
  name: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  description: string;
}

export interface DayDietPlan {
  breakfast: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
}

export interface DietPlan {
  title: string;
  description: string;
  dailyCalories: number;
  proteinTarget: string;
  carbsTarget: string;
  fatTarget: string;
  days: Record<string, DayDietPlan>;
  shoppingList: string[];
  generalAdvice: string[];
}

export interface MedicalGoal {
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'diabetes_mgmt' | 'hypertension_mgmt';
  dietPreference: 'vegetarian' | 'vegan' | 'keto' | 'balanced' | 'gluten_free' | 'mediterranean';
  allergies: string[];
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'highly_active';
}

// --- Predictive Analytics ---
export interface HealthPrediction {
  timeline: string;
  risk_assessment: {
    condition: string;
    current_risk: number;
    projected_risk: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  }[];
  preventive_actions: {
    action: string;
    impact: 'low' | 'moderate' | 'high';
    timeframe: string;
  }[];
  summary: string;
  confidence: number;
}

// --- Mood & Mental Health ---
export interface MoodLog {
  id: string;
  date: string;
  mood: 'happy' | 'stressed' | 'anxious' | 'calm' | 'tired' | 'energetic';
  note: string;
}

// --- Doctors & Appointments ---
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  imageUrl: string;
  availability: string[];
  bio: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  roomUrl?: string;
}

// --- AI Orchestration ---
export interface AIRequest {
  type: 'symptom' | 'lab_report' | 'chat' | 'xray' | 'diet' | 'prediction' | 'skin';
  input: string | { text?: string; imageBase64?: string };
  context?: {
    userId?: string;
    age?: number;
    gender?: string;
    knownConditions?: string[];
    conversationHistory?: { role: string; content: string }[];
    language?: string;
    metrics?: UserMetrics;
  };
  options?: {
    skipCache?: boolean;
    priority?: 'low' | 'normal' | 'high';
    maxRetries?: number;
  };
}

export interface AIResult {
  success: boolean;
  data: any;
  model: string;
  tokens: { prompt: number; completion: number; total: number };
  latency_ms: number;
  cached: boolean;
  traceId: string;
  confidence: number;
  safetyFlags: string[];
}

// --- Safety ---
export type SafetyFlag =
  | 'emergency_symptom'
  | 'critical_lab_value'
  | 'high_risk_prediction'
  | 'low_confidence'
  | 'requires_doctor'
  | 'medication_query'
  | 'pediatric_case'
  | 'pregnancy_case';

export interface SafetyAssessment {
  flags: SafetyFlag[];
  riskLevel: 'safe' | 'caution' | 'high_risk' | 'emergency';
  escalationRequired: boolean;
  disclaimer: string;
}
