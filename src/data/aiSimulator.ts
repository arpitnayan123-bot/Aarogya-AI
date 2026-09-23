import { UserMetrics, MedicalGoal, DietPlan, Doctor, Meal, DayDietPlan } from '@/types/aarogya';
import { findSymptomEntry } from '@/data/symptomDatabase';

// August-inspired AI health chat simulator
export const simulateHealthChatReply = (message: string, metrics: UserMetrics): { text: string; suggestions: string[] } => {
  const msg = message.toLowerCase();
  const bmi = +(metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1);

  // Analyze simple keywords to provide high-quality responses
  if (msg.includes('headache') || msg.includes('migraine')) {
    const dbMatch = findSymptomEntry('Headache');
    const diseases = dbMatch ? dbMatch.possibleDiseases : 'Migraine, Sinusitis, Hypertension';
    const duration = dbMatch ? dbMatch.avgDurationDays : 3;
    return {
      text: `**🩺 Symptom Intelligence: Headache**
*Matched via Indian Healthcare Symptom Database (300+ entries)*

Based on clinical data, headache is commonly associated with: **${diseases.toLowerCase()}**. Average duration: **~${duration} days**.

Looking at your metrics:
• Your water intake is currently ${metrics.waterIntake}ml out of ${metrics.waterTarget}ml. Dehydration is the #1 trigger. Try drinking 2 glasses of lukewarm water immediately.
• You slept ${metrics.sleepHours} hours last night. Rest is crucial.

**AI Care Recommendations:**
1. **Hydration First:** Sip water or an electrolyte-rich drink.
2. **Rest:** Dim the lights, close your eyes, and avoid screens for 20-30 minutes.
3. **Gentle Massage:** Massage your temples and neck with lavender or peppermint oil.
4. **Cold Compress:** Place a cool damp cloth on your forehead or the back of your neck.

💬 *Describe symptoms in any of 11 Indian languages — powered by Bhashini-IndicNER.*

📊 *For a full symptom analysis with severity, duration & regional insights, visit the Symptom Checker.*

*Disclaimer: This is wellness guidance, not a medical diagnosis. If you experience sudden severe "thunderclap" headache, vision changes, or fever with stiff neck, seek emergency care immediately.*`,
      suggestions: ['Open full Symptom Checker', 'Should I take pain relievers?', 'Schedule a Doctor appointment', 'Show breathing exercises']
    };
  }

  if (msg.includes('fever') || msg.includes('temperature') || msg.includes('cold') || msg.includes('cough')) {
    return {
      text: `**🩺 Symptoms Detected: Fever/Respiratory**
*Entities extracted via Bhashini-IndicNER: [fever (symptom, 92%), cough (symptom, 89%)]*

It sounds like you're feeling under the weather. A fever or cold is usually the body's natural response to fighting off viral or bacterial infections.

**August-Style Aarogya Protocol:**
1. **Monitor Temperature:** Keep a temperature log every 4 hours.
2. **Hydration Alert:** Ensure you surpass your daily water goal of ${metrics.waterTarget}ml today (aim for herbal teas, warm broths).
3. **Rest & Recovery:** Your immune system needs active rest. Limit physical activities.
4. **Soothing Remedies:** Gargle with warm salt water for a sore throat, or use steam inhalation for congestion.

🌐 *Type in your preferred Indian language — IndicNER understands Hindi, Bengali, Tamil, Telugu, Gujarati, Punjabi, Marathi, Assamese, Kannada, Malayalam, and Odia.*

*Important Note:* If your temperature goes above 102°F (38.9°C), persists for more than 3 days, or is accompanied by difficulty breathing, please consult a healthcare professional. You can easily schedule an appointment with a General Physician on Aarogya AI's Booking panel!`,
      suggestions: ['How to naturally boost immunity?', 'Book General Physician', 'Open full Symptom Checker', 'Check symptom checklists']
    };
  }

  if (msg.includes('diet') || msg.includes('nutrition') || msg.includes('weight') || msg.includes('bmi')) {
    return {
      text: `Let's analyze your body composition metrics and nutritional goals:
• **Current Weight:** ${metrics.weight} kg
• **Height:** ${metrics.height} cm
• **Calculated BMI:** ${bmi} (${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese'})
• **Daily Calories Target:** ${metrics.caloriesTarget} kcal

For custom detailed 7-day schedules, head to our **AI Diet Planner** tab. It will synthesize a meal grid tailored directly to your preferences (Vegan, Keto, Balanced, etc.) and health objectives! In the meantime, try to focus on nutrient-dense whole foods, lean proteins, and complex carbohydrates.`,
      suggestions: ['Go to AI Diet Planner', 'What is a healthy BMI?', 'Healthy snack ideas']
    };
  }

  if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('tired')) {
    return {
      text: `Restful sleep is the foundation of cognitive function and cellular recovery. Your registered sleep duration is ${metrics.sleepHours} hours.

**Tips to Optimize Your Sleep Hygiene:**
1. **Consistency:** Go to bed and wake up at the exact same times daily to sync your circadian rhythm.
2. **Digital Detox:** Shut down all screens (phones, TVs, laptops) 1 hour before bed. Blue light suppresses melatonin synthesis.
3. **Optimized Environment:** Keep your bedroom cool, pitch black, and quiet.
4. **Wind Down:** Try our **Mind Breathing Exercise** in the Mental Health Support tab to calm your central nervous system.`,
      suggestions: ['Try breathing exercise', 'How does stress affect sleep?', 'What foods improve sleep?']
    };
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
    return {
      text: `Hello! I am **Aarogya AI**, your advanced conversational health companion, modeled to provide instant, medical-grade, compassionate health coaching.

**How I can support you today:**
• **Symptom Assessment:** Tell me how you're feeling (e.g., headache, indigestion, fatigue).
• **Nutritional Insights:** Ask about meal pacing, hydration, and exercise recovery.
• **Dashboard Sync:** I can analyze your biometric logs (weight, blood pressure, etc.) and provide active advice.
• **Mental Wellness & Doctor Access:** Easily transition to mental support chats or book virtual teleconsultations with top specialists.

*What health topic or symptom is on your mind today?*`,
      suggestions: ['Analyze my headache', 'Recommend healthy habits', 'Book an appointment']
    };
  }

  // Default response synthesizing metrics
  return {
    text: `Thank you for sharing that with me. As your Aarogya AI assistant, I've analyzed your current biometrics:
• **BMI:** ${bmi}
• **Sleep:** ${metrics.sleepHours}h
• **Hydration:** ${metrics.waterIntake}/${metrics.waterTarget} ml
• **Blood Pressure:** ${metrics.systolicBP}/${metrics.diastolicBP} mmHg

To give you the most accurate advice, could you describe your symptoms or questions in more detail? Alternatively, you can book an interactive teleconsultation with a specialized physician in our "Doctor Booking" section, or use our customized "AI Diet Planner" to get structured nourishment regimens.`,
    suggestions: ['Book Doctor Consultation', 'Start Breathing Session', 'Generate Custom Diet Plan']
  };
};

// Empathetic mental health support chat simulator
export const simulateMentalChatReply = (message: string, currentMood: string): { text: string; suggestions: string[] } => {
  const msg = message.toLowerCase();

  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('panic') || msg.includes('scared')) {
    return {
      text: `I hear you, and it's completely okay to feel anxious right now. Let's take a slow, gentle step back together. 

Anxiety is an activation of your sympathetic nervous system (fight-or-flight). We can bring you back to safety using physical and breathing anchors:

1. **The 5-4-3-2-1 Grounding Method:** Look around you and name:
   • 5 things you can see
   • 4 things you can physically touch
   • 3 things you can hear
   • 2 things you can smell
   • 1 thing you can taste
2. **Calm Mind Breathing:** Try our interactive breathing bubble right below! It paces your inhales and exhales to stimulate the vagus nerve and slow your heart rate.
3. **Drop Your Shoulders:** Unclench your jaw, drop your shoulders away from your ears, and release the tension in your stomach.

You are safe, you are here, and this feeling will pass.`,
      suggestions: ['Start breathing bubble', 'I want to write a journal entry', 'Talk to a therapist']
    };
  }

  if (msg.includes('sad') || msg.includes('depressed') || msg.includes('lonely') || msg.includes('cry')) {
    return {
      text: `I'm so sorry you're carrying such a heavy heart today. Please know that even though I'm an AI, I am here to listen without any judgment. It takes a lot of strength to admit when you're feeling down or lonely.

When sadness feels overwhelming, try to extend extreme kindness to yourself:
• **Smallest Step:** You don't have to fix everything today. Can you do one tiny thing? Drink a warm glass of tea, step outside for fresh air, or wrap yourself in a warm blanket.
• **No Judgment:** Let yourself feel whatever is present. Crying is a healthy somatic release.
• **Connect:** Consider reaching out to a loved one, or book an appointment with our compassionate Psychiatrists/Therapists under the Appointments tab. You don't have to walk through this dark tunnel alone.`,
      suggestions: ['Daily Affirmations', 'Book Therapist session', 'Help me set a tiny goal']
    };
  }

  if (msg.includes('stress') || msg.includes('overwhelm') || msg.includes('burnout') || msg.includes('work')) {
    return {
      text: `It sounds like you are carrying a massive amount of weight on your shoulders. Burnout and stress occur when demands exceed our internal resources for too long.

**Micro-Recovery Checklist:**
• **Boundary Check:** What is one task or expectation you can say "not right now" to today?
• **The 2-Minute Reset:** Close your eyes, sit comfortably, and let go of the need to solve anything for the next 120 seconds.
• **Movement Therapy:** Take a short, slow 5-minute walk. No phone, just observing your steps.
• **Self-Compassion:** Remind yourself: *"I am doing the best I can with the energy I have today."*`,
      suggestions: ['Show daily affirmations', 'Do a breathing cycle', 'Book stress counselor']
    };
  }

  // Default response
  return {
    text: `Thank you for opening up to me. Our mental health is just as important as our physical health. 

You indicated your mood is currently **${currentMood.toUpperCase()}**. It's completely valid to feel this way. Let's focus on nurturing your mind:
• Would you like to do a **guided breathing session** (use the breathing bubble below)?
• Would you like to read a **positive daily affirmation** to shift your focus?
• Or do you want to explore talk therapy with a licensed expert in our booking center?

I am here to support you at your own pace.`,
    suggestions: ['Start Breathing Exercise', 'Show Daily Affirmation', 'Book a Psychiatrist']
  };
};

// Generates a fully detailed personalized 7-day meal plan
export const generateDietPlan = (goal: MedicalGoal, metrics: UserMetrics): DietPlan => {
  const bmi = +(metrics.weight / ((metrics.height / 100) ** 2)).toFixed(1);
  const bmiStatus = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';
  
  // Calculate recommended daily calorie intake based on goals
  let calculatedCalories = 2000;
  let proteinPct = 25;
  let carbsPct = 50;
  let fatPct = 25;
  let desc = '';

  if (goal.goal === 'weight_loss') {
    calculatedCalories = Math.max(1400, Math.round(metrics.weight * 22 - 300));
    proteinPct = 30;
    carbsPct = 40;
    fatPct = 30;
    desc = `Designed for a healthy, sustainable caloric deficit while maintaining lean muscle tissue. Personalized based on your BMI of ${bmi} (${bmiStatus}).`;
  } else if (goal.goal === 'muscle_gain') {
    calculatedCalories = Math.round(metrics.weight * 26 + 400);
    proteinPct = 35;
    carbsPct = 45;
    fatPct = 20;
    desc = `Designed with high protein density and caloric surplus to facilitate hypertrophic muscle repair. Custom tailored for your BMI of ${bmi} (${bmiStatus}).`;
  } else if (goal.goal === 'diabetes_mgmt') {
    calculatedCalories = 1700;
    proteinPct = 30;
    carbsPct = 35;
    fatPct = 35;
    desc = `Low glycemic load index meals centered around fiber, healthy fats, and high-quality proteins. Formulated for your BMI of ${bmi} (${bmiStatus}).`;
  } else if (goal.goal === 'hypertension_mgmt') {
    calculatedCalories = 1800;
    proteinPct = 25;
    carbsPct = 50;
    fatPct = 25;
    desc = `Strict sodium-controlled regimen focusing on DASH diet concepts. Formulated for your current BMI of ${bmi} (${bmiStatus}).`;
  } else {
    calculatedCalories = Math.round(metrics.weight * 24);
    desc = `Balanced macronutrient schedule engineered to sustain metabolic homeostasis and energy. Tailored for your BMI of ${bmi} (${bmiStatus}).`;
  }

  // Adjust calories slightly based on activity level
  if (goal.activityLevel === 'sedentary') calculatedCalories -= 100;
  else if (goal.activityLevel === 'active') calculatedCalories += 200;
  else if (goal.activityLevel === 'highly_active') calculatedCalories += 450;

  const totalGrams = (calculatedCalories: number, pct: number, calPerGram: number) => 
    Math.round((calculatedCalories * (pct / 100)) / calPerGram);

  const pGrams = totalGrams(calculatedCalories, proteinPct, 4);
  const cGrams = totalGrams(calculatedCalories, carbsPct, 4);
  const fGrams = totalGrams(calculatedCalories, fatPct, 9);

  // Generate day menus depending on dietary preference
  const isVeg = goal.dietPreference === 'vegetarian' || goal.dietPreference === 'vegan';
  const isKeto = goal.dietPreference === 'keto';

  const breakfastOptions: Meal[] = isKeto
    ? [
        { name: 'Keto Avocado & Eggs', calories: 450, protein: '25g', carbs: '5g', fat: '35g', description: 'Scrambled eggs in grass-fed butter with half an avocado and fresh spinach.' },
        { name: 'Flaxseed & Almond Flour Pancakes', calories: 420, protein: '18g', carbs: '8g', fat: '32g', description: 'Pancakes made with almond flour, eggs, and topped with sugar-free syrup.' }
      ]
    : isVeg
    ? [
        { name: 'Oatmeal with Berries & Chia', calories: 380, protein: '12g', carbs: '55g', fat: '8g', description: 'Steel-cut oats cooked in almond milk, topped with blueberries, chia seeds, and a drizzle of honey.' },
        { name: 'Spiced Tofu Scramble & Whole Wheat Toast', calories: 400, protein: '22g', carbs: '40g', fat: '14g', description: 'Crumbled firm tofu sauteed with turmeric, bell peppers, spinach, served on sprouted grain bread.' }
      ]
    : [
        { name: 'Greek Yogurt with Eggs & Berry Parfait', calories: 420, protein: '28g', carbs: '45g', fat: '10g', description: 'Non-fat Greek yogurt, mixed berries, walnuts, paired with 2 soft-boiled eggs.' },
        { name: 'Smoked Salmon & Avocado Toast', calories: 440, protein: '24g', carbs: '38g', fat: '18g', description: 'Smoked salmon, smashed avocado, poached egg, and microgreens on toasted rye.' }
      ];

  const lunchOptions: Meal[] = isKeto
    ? [
        { name: 'Grilled Salmon with Asparagus', calories: 550, protein: '38g', carbs: '4g', fat: '42g', description: 'Wild salmon fillet pan-seared with garlic butter, served with roasted asparagus.' },
        { name: 'Keto Chicken Caesar Salad', calories: 520, protein: '35g', carbs: '6g', fat: '40g', description: 'Grilled chicken breast on romaine, shaved parmesan, bacon bits, olive oil Caesar dressing.' }
      ]
    : isVeg
    ? [
        { name: 'Quinoa & Black Bean Buddha Bowl', calories: 510, protein: '18g', carbs: '70g', fat: '12g', description: 'Quinoa base, seasoned black beans, roasted sweet potato, kale, and a creamy tahini drizzle.' },
        { name: 'Lentil Soup & Side Salad', calories: 450, protein: '20g', carbs: '62g', fat: '8g', description: 'Rich brown lentil soup simmered with carrots, celery, and tomatoes, served with a mixed greens vinaigrette.' }
      ]
    : [
        { name: 'Lemon Herb Grilled Chicken Bowl', calories: 490, protein: '35g', carbs: '52g', fat: '11g', description: 'Grilled breast of chicken, brown rice, roasted broccoli, drizzled with olive oil and lemon.' },
        { name: 'Turkey & Hummus Wrap', calories: 460, protein: '30g', carbs: '45g', fat: '12g', description: 'Lean sliced turkey breast, hummus, cucumber, red onion, wrapped in a whole wheat tortilla.' }
      ];

  const snackOptions: Meal[] = isKeto
    ? [
        { name: 'Mixed Roasted Nuts & Celery', calories: 200, protein: '6g', carbs: '4g', fat: '18g', description: 'A handful of almonds, walnuts, and pecans with celery sticks.' },
        { name: 'Pesto & Mozzarella Caprese Skewers', calories: 220, protein: '10g', carbs: '3g', fat: '19g', description: 'Cherry tomatoes, baby mozzarella, basil, drizzled with extra virgin olive oil.' }
      ]
    : [
        { name: 'Apple Slices & Peanut Butter', calories: 210, protein: '7g', carbs: '25g', fat: '11g', description: 'One medium crisp apple served with 1 tablespoon of all-natural peanut butter.' },
        { name: 'Roasted Chickpeas', calories: 180, protein: '9g', carbs: '28g', fat: '4g', description: 'Crunchy oven-roasted chickpeas seasoned with sea salt, paprika, and cumin.' }
      ];

  const dinnerOptions: Meal[] = isKeto
    ? [
        { name: 'Garlic Butter Ribeye & Broccoli Mash', calories: 650, protein: '45g', carbs: '7g', fat: '52g', description: 'Seared grass-fed ribeye steak served with heavy-cream steamed broccoli puree.' },
        { name: 'Zucchini Noodles with Pesto Chicken', calories: 580, protein: '40g', carbs: '9g', fat: '45g', description: 'Freshly spiralized zucchini tossed in homemade basil pesto, topped with grilled chicken thigh.' }
      ]
    : isVeg
    ? [
        { name: 'Chickpea & Sweet Potato Curry', calories: 530, protein: '16g', carbs: '78g', fat: '14g', description: 'A comforting stew of chickpeas, sweet potatoes, and spinach in a coconut-curry broth over basmati rice.' },
        { name: 'Stuffed Bell Peppers', calories: 480, protein: '18g', carbs: '65g', fat: '12g', description: 'Bell peppers stuffed with brown rice, black beans, corn, diced zucchini, baked with light mozzarella.' }
      ]
    : [
        { name: 'Pan-Seared Sea Bass & Wild Rice', calories: 520, protein: '38g', carbs: '50g', fat: '13g', description: 'White sea bass fillet with wild rice, roasted Brussels sprouts, and light butter herb sauce.' },
        { name: 'Lean Beef & Broccoli Stir-Fry', calories: 540, protein: '42g', carbs: '44g', fat: '15g', description: 'Tender beef sirloin strips flash-sauteed with broccoli florets, ginger, garlic, and low-sodium tamari.' }
      ];

  // Map 7 days with alternating items
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const days: { [key: string]: DayDietPlan } = {};

  daysOfWeek.forEach((day, index) => {
    days[day] = {
      breakfast: breakfastOptions[index % breakfastOptions.length],
      lunch: lunchOptions[index % lunchOptions.length],
      snack: snackOptions[index % snackOptions.length],
      dinner: dinnerOptions[index % dinnerOptions.length]
    };
  });

  const shoppingList = isKeto
    ? ['Avocados', 'Grass-fed Butter', 'Eggs', 'Spinach', 'Almond Flour', 'Salmon Fillets', 'Asparagus', 'Chicken Breasts', 'Romaine Lettuce', 'Parmesan Cheese', 'Mixed Nuts', 'Mozzarella Balls', 'Zucchini', 'Ribeye Steak', 'Pesto']
    : isVeg
    ? ['Oats', 'Almond Milk', 'Blueberries', 'Chia Seeds', 'Honey', 'Tofu', 'Bell Peppers', 'Quinoa', 'Black Beans', 'Sweet Potatoes', 'Kale', 'Tahini', 'Lentils', 'Apples', 'Peanut Butter', 'Chickpeas', 'Coconut Milk', 'Basmati Rice']
    : ['Greek Yogurt', 'Eggs', 'Mixed Berries', 'Walnuts', 'Smoked Salmon', 'Avocados', 'Rye Bread', 'Chicken Breasts', 'Brown Rice', 'Broccoli', 'Turkey Breast', 'Hummus', 'Whole Wheat Wraps', 'Apples', 'Peanut Butter', 'Chickpeas', 'Sea Bass', 'Wild Rice', 'Brussels Sprouts', 'Beef Sirloin', 'Ginger', 'Garlic'];

  const generalAdvice = [
    `Drink at least ${metrics.waterTarget / 1000}L of water daily to maintain electrolyte balance and proper cellular hydration.`,
    'Avoid consuming calories 2-3 hours before bedtime to optimize deep sleep quality.',
    'Focus on chewing slowly; satiety cues take approximately 20 minutes to travel from your stomach to your brain.',
    'Always prioritize whole, minimally-processed ingredients over boxed alternatives.'
  ];

  return {
    title: `Aarogya Personalized ${goal.goal.replace('_', ' ').toUpperCase()} Plan`,
    description: desc,
    dailyCalories: calculatedCalories,
    proteinTarget: `${pGrams}g (${proteinPct}%)`,
    carbsTarget: `${cGrams}g (${carbsPct}%)`,
    fatTarget: `${fGrams}g (${fatPct}%)`,
    days,
    shoppingList,
    generalAdvice
  };
};

// Mock doctor database with comprehensive clinical credentials
export const getMockDoctors = (): Doctor[] => {
  return [
    {
      id: 'doc-1',
      name: 'Dr. Aarav Mehta',
      specialty: 'General Physician',
      experience: 12,
      rating: 4.9,
      reviews: 320,
      fee: 45,
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
      availability: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'],
      bio: 'Expert in preventive medicine, metabolic disease management, and acute infection recoveries. Graduated from AIIMS, passionate about AI-guided patient coaching.'
    },
    {
      id: 'doc-2',
      name: 'Dr. Priya Sharma',
      specialty: 'Psychiatrist & Therapist',
      experience: 15,
      rating: 4.95,
      reviews: 410,
      fee: 60,
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
      availability: ['11:00 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
      bio: 'Specialist in CBT, anxiety therapy, ADHD coaching, and clinical stress management. Compassionate counseling style for deep emotional regulation.'
    },
    {
      id: 'doc-3',
      name: 'Dr. Vikram Seth',
      specialty: 'Cardiologist',
      experience: 18,
      rating: 4.85,
      reviews: 280,
      fee: 80,
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
      availability: ['09:30 AM', '11:30 AM', '03:00 PM', '04:00 PM'],
      bio: 'Board-certified cardiologist specializing in hypertension control, arterial health, and custom cardiopulmonary rehabilitation programs.'
    },
    {
      id: 'doc-4',
      name: 'Dr. Ananya Goel',
      specialty: 'Pediatrician',
      experience: 10,
      rating: 4.9,
      reviews: 190,
      fee: 40,
      imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=200',
      availability: ['10:00 AM', '12:00 PM', '02:30 PM', '06:00 PM'],
      bio: 'Dedicated child specialist focusing on neonatal nutrition, childhood developmental milestones, immunization regimes, and pediatric immunity.'
    },
    {
      id: 'doc-5',
      name: 'Dr. Rohan Deshmukh',
      specialty: 'Neurologist',
      experience: 16,
      rating: 4.88,
      reviews: 220,
      fee: 90,
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
      availability: ['11:00 AM', '01:30 PM', '03:45 PM', '05:15 PM'],
      bio: 'Neurology lead specializing in sleep cycle disruptions, chronic migraine therapeutics, tension-headache analysis, and neural wellness.'
    }
  ];
};
