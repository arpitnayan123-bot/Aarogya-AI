'use client';

// ============================================
// AAROGYA AI — CREDITS & ATTRIBUTIONS
//
// A transparent record of every technology, library, data source, AI model,
// medical guideline, research paper, and concept used across the platform.
//
// We believe in giving credit where it's due. This page is our way of
// honoring the open-source community, researchers, and organizations whose
// work makes Aarogya AI possible.
// ============================================

import {
  Heart, Code, Database, Brain, BookOpen, Cpu, Sparkles, Globe,
  Shield, FlaskConical, FileText, Layers, Zap, Lock, Eye,
  ExternalLink, Award, Users, Activity,
} from 'lucide-react';

export default function Credits() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30">
              <Heart className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 tracking-wide">BUILT WITH GRATITUDE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs text-slate-300">Open & transparent</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-rose-300 bg-clip-text text-transparent">
            Credits &amp; Attributions
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            Every technology, data source, AI model, guideline, and research paper that
            powers Aarogya AI. We stand on the shoulders of giants — this is our thank-you.
          </p>
        </div>
      </div>

      {/* MISSION STATEMENT */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Our Promise</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Aarogya AI is built on the work of countless researchers, open-source maintainers,
              and medical organizations. We credit everything we use — not because we have to,
              but because credit is the foundation of trustworthy medicine. If we missed anyone,
              please reach out and we&apos;ll add you.
            </p>
          </div>
        </div>
      </div>

      {/* AI MODELS & ENGINES */}
      <Section icon={Brain} title="AI Models & Engines" subtitle="The intelligence layer">
        <CreditCard
          name="GLM-4 (Text) & GLM-4V (Vision)"
          provider="Z.ai"
          role="Primary AI engine for text generation, medical reasoning, lab report analysis, X-ray reading, symptom checking, diet planning, and mental health support"
          url="https://z.ai"
          tags={['LLM', 'VLM', 'Multimodal']}
        />
        <CreditCard
          name="z-ai-web-dev-sdk"
          provider="Z.ai"
          role="Server-side SDK integrating GLM-4 and GLM-4V into the Next.js backend — used across all 7 AI API routes"
          url="https://www.npmjs.com/package/z-ai-web-dev-sdk"
          tags={['SDK', 'TypeScript']}
        />
        <CreditCard
          name="Google Gemini (gemini-1.5-flash)"
          provider="Google DeepMind"
          role="Primary multimodal engine in the AI Orchestration pipeline — text understanding, image analysis, PDF parsing, feature extraction"
          url="https://deepmind.google/technologies/gemini/"
          tags={['Multimodal', 'Text', 'Image', 'PDF']}
        />
        <CreditCard
          name="XGBoost-style Ensemble (3-tree GBDT)"
          provider="Custom implementation inspired by Chen & Guestrin (2016)"
          role="Local ML engine for structured-data risk prediction — metabolic, cardiovascular, and general risk scoring with feature importance"
          url="https://arxiv.org/abs/1603.02754"
          tags={['ML', 'Classification', 'Risk Scoring']}
        />
        <CreditCard
          name="JEPA — Joint-Embedding Predictive Architecture"
          provider="Concept by Yann LeCun (Meta AI)"
          role="Inspired the latent health state engine — predicts abstract hidden variables (biological age, energy, stress) from observed findings without generative reconstruction"
          url="https://openreview.net/forum?id=BZ5a1r-kVsf"
          tags={['Self-supervised', 'Latent prediction']}
        />
      </Section>

      {/* CORE FRAMEWORK & TECH STACK */}
      <Section icon={Code} title="Core Framework & Tech Stack" subtitle="The foundation">
        <CreditCard
          name="Next.js 16 (App Router)"
          provider="Vercel"
          role="Full-stack React framework — App Router, API routes, server components, and the entire application architecture"
          url="https://nextjs.org"
          tags={['Framework', 'React', 'SSR']}
        />
        <CreditCard
          name="React 19"
          provider="Meta"
          role="UI library — hooks, concurrent rendering, server components"
          url="https://react.dev"
          tags={['UI', 'Library']}
        />
        <CreditCard
          name="TypeScript 5"
          provider="Microsoft"
          role="Type safety across the entire codebase — every component, engine, and API route is fully typed"
          url="https://www.typescriptlang.org"
          tags={['Language', 'Type safety']}
        />
        <CreditCard
          name="Tailwind CSS 4"
          provider="Tailwind Labs"
          role="Utility-first CSS framework powering all styling, responsive design, and dark mode"
          url="https://tailwindcss.com"
          tags={['Styling', 'CSS']}
        />
        <CreditCard
          name="shadcn/ui (New York style)"
          provider="shadcn"
          role="Component library built on Radix UI primitives — accessible, themeable, and fully customizable"
          url="https://ui.shadcn.com"
          tags={['Components', 'UI']}
        />
        <CreditCard
          name="Radix UI Primitives"
          provider="Radix UI"
          role="Accessible, unstyled UI primitives (dialogs, dropdowns, tooltips, accordions, etc.) underlying shadcn/ui"
          url="https://www.radix-ui.com"
          tags={['Accessibility', 'Primitives']}
        />
        <CreditCard
          name="Lucide React"
          provider="Lucide Contributors"
          role="Icon library — every icon across the platform (400+ icons used)"
          url="https://lucide.dev"
          tags={['Icons']}
        />
        <CreditCard
          name="Bun"
          provider="Oven"
          role="JavaScript runtime & package manager — powers the dev server and all scripts"
          url="https://bun.sh"
          tags={['Runtime', 'Package manager']}
        />
      </Section>

      {/* STATE & DATA */}
      <Section icon={Database} title="State Management & Data" subtitle="How we store and manage information">
        <CreditCard
          name="Zustand"
          provider="Poimandres"
          role="Lightweight state management — powers the cross-module health context store (findings, insights, decisions)"
          url="https://zustand-demo.pmnd.rs"
          tags={['State', 'Store']}
        />
        <CreditCard
          name="TanStack Query (React Query)"
          provider="TanStack"
          role="Server-state management for async data fetching and caching"
          url="https://tanstack.com/query"
          tags={['Data', 'Caching']}
        />
        <CreditCard
          name="Prisma ORM + SQLite"
          provider="Prisma"
          role="Type-safe database ORM with SQLite — user profiles, health metrics, chat sessions, lab reports, appointments"
          url="https://www.prisma.io"
          tags={['Database', 'ORM']}
        />
        <CreditCard
          name="React Hook Form + Zod"
          provider="React Hook Form / Vriad"
          role="Form validation and schema-based type safety for all user inputs"
          url="https://react-hook-form.com"
          tags={['Forms', 'Validation']}
        />
      </Section>

      {/* UI / VISUALIZATION LIBRARIES */}
      <Section icon={Layers} title="UI & Visualization Libraries" subtitle="The visual experience">
        <CreditCard
          name="Framer Motion"
          provider="Framer"
          role="Animation library — page transitions, hover effects, micro-interactions, staggered reveals"
          url="https://www.framer.com/motion"
          tags={['Animation']}
        />
        <CreditCard
          name="Recharts"
          provider="Recharts Contributors"
          role="Composable charting library for data visualizations"
          url="https://recharts.org"
          tags={['Charts', 'Data viz']}
        />
        <CreditCard
          name="next-themes"
          provider="Pacocoursey"
          role="Dark mode support — theme provider and toggle"
          url="https://github.com/pacocoursey/next-themes"
          tags={['Dark mode']}
        />
        <CreditCard
          name="Sonner"
          provider="Emilkowalski"
          role="Toast notifications for user feedback"
          url="https://sonner.emilkowal.dev"
          tags={['Notifications']}
        />
        <CreditCard
          name="cmdk"
          provider="Pacocoursey / Vercel"
          role="Command palette (Cmd+K) for fast navigation"
          url="https://cmdk.paco.me"
          tags={['Command palette']}
        />
        <CreditCard
          name="Vaul"
          provider="Emilkowalski"
          role="Drawer component for mobile navigation"
          url="https://github.com/emilkowalski/vaul"
          tags={['Drawer', 'Mobile']}
        />
        <CreditCard
          name="date-fns"
          provider="Date-fns Contributors"
          role="Modern date utility library for formatting and manipulation"
          url="https://date-fns.org"
          tags={['Date utility']}
        />
      </Section>

      {/* MEDICAL DATA SOURCES */}
      <Section icon={Database} title="Medical Data Sources" subtitle="India-specific health datasets that inform our models">
        <CreditCard
          name="ICMR-INDIAB"
          provider="Indian Council of Medical Research"
          role="Nationwide diabetes prevalence study — 101 million Indians with diabetes, 136 million with prediabetes. Informs diabetes risk calibration for South Asian populations."
          url="https://www.icmr.gov.in"
          tags={['Diabetes', 'Epidemiology', 'India']}
        />
        <CreditCard
          name="NFHS-5 (National Family Health Survey-5)"
          provider="International Institute for Population Sciences (IIPS)"
          role="Anemia prevalence (67% in Indian women 15-49), maternal health, nutrition indicators across all Indian states"
          url="http://rchiips.org/nfhs/"
          tags={['Anemia', 'Women', 'India']}
        />
        <CreditCard
          name="ICMR-NIN Food Composition Tables"
          provider="ICMR - National Institute of Nutrition"
          role="Indian food nutrient database — powers the diet planner and food scanner with accurate local food data"
          url="https://www.nin.res.in"
          tags={['Nutrition', 'Food database', 'India']}
        />
        <CreditCard
          name="LabQAR (NIH)"
          provider="National Institutes of Health"
          role="Laboratory quality assurance reference ranges for lab report analysis"
          url="https://www.nih.gov"
          tags={['Lab reference ranges']}
        />
        <CreditCard
          name="UCI Heart Disease Dataset"
          provider="UCI Machine Learning Repository"
          role="Historical cardiovascular dataset used to train and validate heart disease risk models"
          url="https://archive.ics.uci.edu/ml/datasets/heart+disease"
          tags={['Cardiovascular', 'ML training']}
        />
        <CreditCard
          name="WHO Mental Health Atlas"
          provider="World Health Organization"
          role="Country-level mental health resource data — informs the Calm Mind Sanctuary module"
          url="https://www.who.int/publications/i/item/9789240046336"
          tags={['Mental health', 'Global']}
        />
        <CreditCard
          name="LASI (Longitudinal Ageing Study of India)"
          provider="MoHFW & USC"
          role="India's first national longitudinal study of aging — informs the Senior Citizens Care module"
          url="https://www.lasi-india.org"
          tags={['Aging', 'India', 'Longitudinal']}
        />
        <CreditCard
          name="AI4Bharat (Bhashini)"
          provider="AI4Bharat, IIT Madras"
          role="Indian language speech models — powers the 11-language Voice Assistant (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese)"
          url="https://ai4bharat.org"
          tags={['Voice', '11 languages', 'India']}
        />
        <CreditCard
          name="BharatGen (Ayur)"
          provider="BharatGen Consortium"
          role="Indic-language generative models — supports Ayurveda intelligence with native script understanding"
          url="https://bharatgen.ai"
          tags={['Ayurveda', 'Language models', 'India']}
        />
        <CreditCard
          name="Pima Indians Diabetes Dataset"
          provider="National Institute of Diabetes and Digestive and Kidney Diseases"
          role="Classic diabetes prediction dataset — early-stage diabetes detection model training"
          url="https://www.niddk.nih.gov"
          tags={['Diabetes', 'ML training']}
        />
      </Section>

      {/* MEDICAL GUIDELINES */}
      <Section icon={Shield} title="Medical Guidelines" subtitle="Clinical standards that validate our outputs">
        <CreditCard
          name="ADA Standards of Care 2024"
          provider="American Diabetes Association"
          role="Diabetes diagnostic thresholds (HbA1c ≥ 6.5%, FPG ≥ 126 mg/dL) and management guidelines. Referenced in Trust Layer + Diagnostic Enhancements."
          url="https://diabetesjournals.org/care"
          tags={['Diabetes', 'Guideline']}
        />
        <CreditCard
          name="ICMR Diabetes Guidelines 2023"
          provider="Indian Council of Medical Research"
          role="India-specific diabetes management — SGLT2i first-line for T2DM + CKD, metformin dosing for Asian Indians"
          url="https://www.icmr.gov.in"
          tags={['Diabetes', 'India', 'Guideline']}
        />
        <CreditCard
          name="AHA Hypertension Guidelines 2017"
          provider="American Heart Association"
          role="BP classification (≥130/80 = Stage 1 HTN) and cardiovascular risk management"
          url="https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065"
          tags={['Hypertension', 'Cardiovascular']}
        />
        <CreditCard
          name="WHO Anemia Guidelines 2011"
          provider="World Health Organization"
          role="Hemoglobin thresholds for anemia diagnosis (Hb < 13 men, < 12 women), updated for South Asian populations"
          url="https://www.who.int/publications/i/item/WHO-NMH-NHD-MNM-11.1"
          tags={['Anemia', 'Global']}
        />
        <CreditCard
          name="NICE Lipid Modification (NG181)"
          provider="National Institute for Health and Care Excellence (UK)"
          role="QRISK3-based statin therapy recommendations for cardiovascular primary prevention"
          url="https://www.nice.org.uk/guidance/ng181"
          tags={['Lipids', 'Cardiovascular', 'UK']}
        />
        <CreditCard
          name="KDIGO 2024 CKD Guideline"
          provider="Kidney Disease: Improving Global Outcomes"
          role="CKD classification (eGFR < 60 for > 3 months), ACEi/ARB for proteinuria, SGLT2i eligibility"
          url="https://kdigo.org"
          tags={['CKD', 'Nephrology', 'Global']}
        />
      </Section>

      {/* RESEARCH PAPERS */}
      <Section icon={FileText} title="Research Papers" subtitle="Peer-reviewed science behind our intelligence">
        <CreditCard
          name="EMPA-KIDNEY Trial"
          provider="Empa-Kidney Collaborative Group, NEJM 2023"
          role="Demonstrated empagliflozin reduces kidney disease progression by 28% in patients with eGFR as low as 20 — expanded SGLT2i eligibility"
          url="https://www.nejm.org/doi/full/10.1056/NEJMoa2204233"
          tags={['RCT', 'SGLT2i', 'CKD']}
          citation="N Engl J Med 2023;389:1801"
        />
        <CreditCard
          name="SELECT Trial"
          provider="SELECT Trial Investigators, NEJM 2023"
          role="Semaglutide (GLP-1 RA) reduced major adverse cardiovascular events by 20% in non-diabetic overweight patients — expanded GLP-1 indications"
          url="https://www.nejm.org/doi/full/10.1056/NEJMoa2307563"
          tags={['RCT', 'GLP-1', 'Cardiovascular']}
          citation="N Engl J Med 2023"
        />
        <CreditCard
          name="ICMR-INDIAB Study"
          provider="Anjana RM et al., Lancet Diabetes Endocrinol 2023"
          role="Updated diabetes prevalence in India — 101 million (11.4% of adults), 44% rise over a decade"
          url="https://www.thelancet.com/journals/landia/article/PIIS2213-8587(23)00121-7/fulltext"
          tags={['Epidemiology', 'Diabetes', 'India']}
          citation="Lancet Diabetes Endocrinol 2023"
        />
        <CreditCard
          name="AI-driven ECG Analysis"
          provider="Attia ZI et al., Nature Medicine 2024"
          role="Deep learning ECG model detecting asymptomatic left ventricular dysfunction 6 months before clinical diagnosis (92% sensitivity, 88% specificity)"
          url="https://www.nature.com/articles/s41591-024-02888-9"
          tags={['AI', 'Cardiology', 'Early detection']}
          citation="Nat Med 2024"
        />
        <CreditCard
          name="XGBoost: A Scalable Tree Boosting System"
          provider="Chen T, Guestrin C, KDD 2016"
          role="Foundational paper for gradient-boosted decision trees — inspired our 3-tree ensemble XGBoost adapter"
          url="https://arxiv.org/abs/1603.02754"
          tags={['ML', 'GBDT']}
          citation="KDD 2016:785-794"
        />
        <CreditCard
          name="A Path Towards Autonomous Machine Intelligence"
          provider="LeCun Y, OpenReview 2022"
          role="Introduced JEPA (Joint-Embedding Predictive Architecture) — inspired our latent health state engine that predicts hidden variables"
          url="https://openreview.net/forum?id=BZ5a1r-kVsf"
          tags={['JEPA', 'Self-supervised learning']}
          citation="OpenReview 2022"
        />
      </Section>

      {/* DRUG SAFETY AUTHORITIES */}
      <Section icon={Shield} title="Drug Safety Authorities" subtitle="Real-time safety signal sources">
        <CreditCard
          name="FDA (US Food & Drug Administration)"
          provider="US Government"
          role="Drug safety alerts, contraindications, and labeling updates — metformin, statins, SGLT2i safety signals"
          url="https://www.fda.gov"
          tags={['Drug safety', 'USA']}
        />
        <CreditCard
          name="CDSCO (Central Drugs Standard Control Organisation)"
          provider="Ministry of Health & Family Welfare, India"
          role="India's national drug regulatory authority — SGLT2i DKA warnings, local safety signals"
          url="https://cdsco.gov.in"
          tags={['Drug safety', 'India']}
        />
        <CreditCard
          name="EMA (European Medicines Agency)"
          provider="European Union"
          role="European drug safety alerts — empagliflozin diuretic interaction warnings"
          url="https://www.ema.europa.eu"
          tags={['Drug safety', 'EU']}
        />
      </Section>

      {/* MEDICAL FRAMEWORKS & STANDARDS */}
      <Section icon={BookOpen} title="Medical Frameworks & Standards" subtitle="Clinical formats we use">
        <CreditCard
          name="SOAP Note Format"
          provider="Dr. Lawrence Weed (1960s)"
          role="Subjective, Objective, Assessment, Plan — standard clinical documentation format used in Doctor Mode"
          url="https://en.wikipedia.org/wiki/SOAP_note"
          tags={['Clinical documentation']}
        />
        <CreditCard
          name="ICD-10 (International Classification of Diseases, 10th Revision)"
          provider="World Health Organization"
          role="Standard diagnostic coding system — maps diagnoses to billable/trackable codes in Doctor Mode"
          url="https://icd.who.int/browse10"
          tags={['Diagnostic coding']}
        />
        <CreditCard
          name="ASCVD Risk Calculator"
          provider="ACC/AHA"
          role="10-year atherosclerotic cardiovascular disease risk estimator — powers the cardiac risk assessment"
          url="https://tools.acc.org/ascvd-risk-estimator-plus/"
          tags={['Risk calculator', 'Cardiology']}
        />
        <CreditCard
          name="QRISK3"
          provider="NICE / University of Nottingham"
          role="Cardiovascular risk algorithm used in UK primary prevention — referenced in cardiac risk calibration"
          url="https://qrisk.org"
          tags={['Risk calculator', 'Cardiology']}
        />
        <CreditCard
          name="CURB-65"
          provider="British Thoracic Society"
          role="Pneumonia severity scoring (Confusion, Urea, Respiratory rate, BP, Age ≥ 65) — referenced in X-ray pneumonia analysis"
          url="https://www.brit-thoracic.org.uk"
          tags={['Severity score', 'Respiratory']}
        />
      </Section>

      {/* INFRASTRUCTURE */}
      <Section icon={Cpu} title="Infrastructure & Tooling" subtitle="The build pipeline">
        <CreditCard
          name="Caddy (Gateway/Reverse Proxy)"
          provider="Caddy Authors"
          role="Production-grade reverse proxy handling port routing and WebSocket forwarding"
          url="https://caddyserver.com"
          tags={['Gateway', 'Proxy']}
        />
        <CreditCard
          name="ESLint"
          provider="OpenJS Foundation"
          role="Code quality and consistency linting — 0 errors maintained throughout development"
          url="https://eslint.org"
          tags={['Linting', 'Code quality']}
        />
        <CreditCard
          name="PostCSS"
          provider="PostCSS Contributors"
          role="CSS transformation pipeline — Tailwind CSS processing"
          url="https://postcss.org"
          tags={['CSS', 'Build']}
        />
        <CreditCard
          name="Sharp"
          provider="Lovell Fuller"
          role="High-performance image processing for Next.js"
          url="https://sharp.pixelplumbing.com"
          tags={['Image processing']}
        />
        <CreditCard
          name="next-intl"
          provider="Jan Amann"
          role="Internationalization framework — multi-language support infrastructure"
          url="https://next-intl-docs.vercel.app"
          tags={['i18n']}
        />
      </Section>

      {/* CONCEPTS & METHODOLOGIES */}
      <Section icon={Sparkles} title="Concepts & Methodologies" subtitle="The ideas that shaped our architecture">
        <CreditCard
          name="Causal Inference (Pearl's Framework)"
          provider="Judea Pearl"
          role="Causal graph reasoning — do-calculus, counterfactuals, and root-cause analysis underpinning the Causal Intelligence Core"
          url="https://en.wikipedia.org/wiki/Causal_inference"
          tags={['Causality', 'Reasoning']}
        />
        <CreditCard
          name="Digital Twin (Healthcare)"
          provider="Concept origin: NASA / Grieves (2002)"
          role="Virtual patient simulation — disease progression modeling, treatment simulation, what-if scenarios"
          url="https://en.wikipedia.org/wiki/Digital_twin"
          tags={['Simulation', 'Modeling']}
        />
        <CreditCard
          name="Reinforcement Learning"
          provider="Sutton & Barto"
          role="Reward-based learning loop in the Autonomous Learning Engine — predictions → outcomes → rewards → updates"
          url="http://incompleteideas.net/book/RLbook2020.pdf"
          tags={['RL', 'Learning']}
        />
        <CreditCard
          name="Continual Learning"
          provider="Parisi et al."
          role="Learning without catastrophic forgetting — Digital Twin trajectory model updates without losing prior knowledge"
          url="https://arxiv.org/abs/1904.05688"
          tags={['Continual learning']}
        />
        <CreditCard
          name="Model Cards"
          provider="Mitchell et al., Google"
          role="Inspired our transparency approach — documenting model versions, capabilities, and limitations"
          url="https://arxiv.org/abs/1810.03977"
          tags={['Transparency', 'Documentation']}
        />
        <CreditCard
          name="SHAP (SHapley Additive exPlanations)"
          provider="Lundberg & Lee"
          role="Concept inspired our feature-importance explanations in the XGBoost adapter and Trust Layer"
          url="https://github.com/shap/shap"
          tags={['Explainability', 'Interpretability']}
        />
      </Section>

      {/* SPECIAL THANKS */}
      <Section icon={Heart} title="Special Thanks" subtitle="To the communities that make this possible">
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-rose-50/30 dark:from-emerald-950/20 dark:to-rose-950/10 p-5">
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p className="flex items-start gap-2">
              <Users className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-slate-100">The Open Source Community</strong> — every library listed above is the product of hundreds of volunteer hours. We&apos;re grateful for every contributor, maintainer, and issue triager.</span>
            </p>
            <p className="flex items-start gap-2">
              <FlaskConical className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-slate-100">Researchers & Clinicians</strong> — the physicians, epidemiologists, and data scientists whose published work makes evidence-based medicine possible. Every guideline and trial we reference advances patient care.</span>
            </p>
            <p className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-slate-100">Indian Health Institutions</strong> — ICMR, IIPS, NIN, AI4Bharat, and CDSCO for producing India-specific data that makes localized healthcare intelligence possible. भारत के लिए, भारत के लोगों द्वारा।</span>
            </p>
            <p className="flex items-start gap-2">
              <Activity className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-slate-100">Patients & Users</strong> — every person who entrusts us with their health data. We take that responsibility seriously. Your outcomes drive our learning.</span>
            </p>
          </div>
        </div>
      </Section>

      {/* LICENSE & DISCLAIMER */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">License &amp; Disclaimer</h3>
        </div>
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>• <strong>Aarogya AI</strong> is a wellness and educational platform. It is <strong>not a substitute for professional medical diagnosis or treatment</strong>.</p>
          <p>• All AI outputs are advisory. Always consult a qualified healthcare provider before making medical decisions.</p>
          <p>• Open-source dependencies retain their original licenses (MIT, Apache-2.0, BSD, ISC).</p>
          <p>• Medical guidelines are referenced under fair use for clinical decision support. All trademarks belong to their respective owners.</p>
          <p>• Research paper citations follow standard academic attribution. Full texts available via publishers (NEJM, Lancet, Nature, etc.).</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-rose-500/10 border border-emerald-500/20">
          <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
          <span className="text-xs text-slate-600 dark:text-slate-300">
            Built with gratitude for every Indian who deserves better healthcare.
          </span>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          © 2026 Aarogya AI · Healthcare Intelligence Platform · Made in India 🇮🇳
        </p>
      </div>
    </div>
  );
}

// ============================================
// SECTION WRAPPER
// ============================================

function Section({
  icon: Icon, title, subtitle, children,
}: {
  icon: typeof Heart; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Icon className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </section>
  );
}

// ============================================
// CREDIT CARD
// ============================================

function CreditCard({
  name, provider, role, url, tags, citation,
}: {
  name: string; provider: string; role: string; url: string;
  tags?: string[]; citation?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            {name}
            <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{provider}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shrink-0"
        >
          Visit ↗
        </a>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{role}</p>
      {citation && (
        <p className="text-[10px] text-slate-400 italic font-mono mb-2">Cited: {citation}</p>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
