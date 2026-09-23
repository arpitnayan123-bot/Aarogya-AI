// ============================================
// AAROGYA AI — CLINICAL MENTAL HEALTH ASSESSMENTS
//
// Standardized, validated screening instruments:
//   • PHQ-9  — Patient Health Questionnaire-9 (depression)
//   • GAD-7  — Generalized Anxiety Disorder-7 (anxiety)
//
// Both instruments use the same 4-point Likert answer scale
// measuring symptom frequency over the past 2 weeks.
//
// Scoring ranges and recommendations are aligned with the
// validated clinical cut-offs published by Pfizer (PHQ-9)
// and Spitzer et al. (2006) for GAD-7.
//
// Crisis resources (India-specific):
//   • iCall            — 9152987821  (Tata Institute of Social Sciences)
//   • Vandrevala Foundation — 1860-2662-345
//   • KIRAN Helpline (Govt. of India) — 1800-599-0019
//
// IMPORTANT: These tools are screening instruments, not
// diagnostic instruments. Results must be interpreted by
// a qualified mental-health professional.
// ============================================

export interface AnswerOption {
  value: 0 | 1 | 2 | 3;
  label: string;
}

/**
 * PHQ-9 — 9-item depression severity scale.
 * Over the last 2 weeks, how often have you been bothered
 * by each of the following problems?
 */
export const PHQ9_QUESTIONS: string[] = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling/staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

/**
 * GAD-7 — 7-item generalized anxiety severity scale.
 * Over the last 2 weeks, how often have you been bothered
 * by each of the following problems?
 */
export const GAD7_QUESTIONS: string[] = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

/**
 * Shared answer options for both PHQ-9 and GAD-7.
 * Values: 0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day.
 */
export const ANSWER_OPTIONS: AnswerOption[] = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

export interface AssessmentInterpretation {
  severity: string;
  color: string;
  recommendation: string;
  showCrisisResources?: boolean;
  crisisResources?: CrisisResource[];
}

export interface CrisisResource {
  name: string;
  phone: string;
  hours: string;
}

/** India-relevant mental-health crisis helplines. */
export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: 'iCall (TISS)',
    phone: '9152987821',
    hours: 'Mon–Sat, 8 AM – 10 PM',
  },
  {
    name: 'Vandrevala Foundation',
    phone: '1860-2662-345',
    hours: '24×7',
  },
  {
    name: 'KIRAN Helpline (Govt. of India)',
    phone: '1800-599-0019',
    hours: '24×7',
  },
];

/**
 * Interpret a PHQ-9 total score (0–27).
 *
 *   0–4   Minimal      → self-care / monitoring
 *   5–9   Mild         → talk to someone you trust; consider counseling
 *   10–14 Moderate     → see a doctor / clinician
 *   15–19 Mod. severe  → medical recommendation, prompt treatment
 *   20–27 Severe       → immediate medical review + crisis resources
 *
 * NOTE: PHQ-9 Question 9 (suicidal ideation) is a critical flag.
 * Any non-zero answer on Q9 should trigger crisis resources
 * regardless of total score (the caller should check this
 * separately — see `hasSuicidalIdeationFlag`).
 */
export function interpretPHQ9(score: number): AssessmentInterpretation {
  if (score <= 4) {
    return {
      severity: 'Minimal depression',
      color: 'emerald',
      recommendation:
        'Your score suggests minimal symptoms. Continue self-care, regular sleep, exercise, and social connection. Re-take this assessment in 2–4 weeks or sooner if symptoms change.',
    };
  }
  if (score <= 9) {
    return {
      severity: 'Mild depression',
      color: 'teal',
      recommendation:
        'Your symptoms are mild. Consider talking to someone you trust — a friend, family member, or counselor. Self-help (mindfulness, journaling, regular routine) and re-assessment in 1–2 weeks is recommended.',
    };
  }
  if (score <= 14) {
    return {
      severity: 'Moderate depression',
      color: 'amber',
      recommendation:
        'Your score indicates moderate depressive symptoms. Please schedule an appointment with a doctor or licensed mental-health professional for a clinical evaluation and treatment plan.',
    };
  }
  if (score <= 19) {
    return {
      severity: 'Moderately severe depression',
      color: 'orange',
      recommendation:
        'Medical recommendation: please see a clinician (psychiatrist or psychologist) promptly — ideally within 1 week. A combination of counseling and/or medication is often effective.',
    };
  }
  return {
    severity: 'Severe depression',
    color: 'red',
    recommendation:
      'Your score indicates severe depression. Please seek immediate professional help. Crisis helplines are listed below — you do not have to handle this alone.',
    showCrisisResources: true,
    crisisResources: CRISIS_RESOURCES,
  };
}

/**
 * Interpret a GAD-7 total score (0–21).
 *
 *   0–4   Minimal      → self-care
 *   5–9   Mild         → active monitoring; relaxation techniques
 *   10–14 Moderate     → clinical evaluation recommended
 *   15–21 Severe       → prompt treatment + crisis resources
 */
export function interpretGAD7(score: number): AssessmentInterpretation {
  if (score <= 4) {
    return {
      severity: 'Minimal anxiety',
      color: 'emerald',
      recommendation:
        'Your anxiety symptoms are minimal. Continue your current self-care routine — breathing exercises, regular movement, and limiting caffeine can help maintain balance.',
    };
  }
  if (score <= 9) {
    return {
      severity: 'Mild anxiety',
      color: 'teal',
      recommendation:
        'Your anxiety is mild. Try structured relaxation (4-7-8 breathing, box breathing), reduce stimulants, and monitor. If symptoms persist beyond 2–4 weeks, consider a counselor.',
    };
  }
  if (score <= 14) {
    return {
      severity: 'Moderate anxiety',
      color: 'amber',
      recommendation:
        'Your score indicates moderate anxiety. A clinical evaluation by a doctor or mental-health professional is recommended. CBT and/or medication are evidence-based options.',
    };
  }
  return {
    severity: 'Severe anxiety',
    color: 'red',
    recommendation:
      'Your score indicates severe anxiety. Please seek professional help promptly. Crisis helplines are listed below if you need to talk to someone right now.',
    showCrisisResources: true,
    crisisResources: CRISIS_RESOURCES,
  };
}

/**
 * Returns true if the PHQ-9 Q9 answer (suicidal ideation) is non-zero.
 * Callers should ALWAYS display crisis resources if this is true,
 * regardless of total score.
 */
export function hasSuicidalIdeationFlag(phq9Answers: number[]): boolean {
  // Q9 is the 9th element (index 8) of the PHQ-9 answer array.
  return (phq9Answers[8] ?? 0) > 0;
}

/**
 * Compute the total score for an array of answers (PHQ-9 or GAD-7).
 * Gracefully handles missing answers by treating them as 0.
 */
export function computeScore(answers: number[]): number {
  return answers.reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
}
