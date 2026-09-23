# 🩺 Aarogya AI — Healthcare Intelligence Platform

> **AI-powered health intelligence for every Indian.**
> From lab analysis to Ayurveda, ABDM to pharmacogenomics — all in one place.

<p align="center">
  <a href="http://47.57.232.232:81">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-Aarogya_AI-10b981?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo" />
  </a>
  <br><br>
  <strong>👉 Click here to try the live app: <a href="http://47.57.232.232:81">http://47.57.232.232:81</a></strong>
</p>

<p align="center">
  <strong>🇮🇳 Made in India · for Bharat · Powered by AI</strong>
</p>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Quick Start](#-quick-start)
5. [Project Structure](#-project-structure)
6. [API Routes](#-api-routes)
7. [AI & Data Sources](#-ai--data-sources)
8. [Compliance & Security](#-compliance--security)
9. [Deployment](#-deployment)
10. [Contributing](#-contributing)
11. [License](#-license)

---

## 🌟 Overview

**Aarogya AI** is a production-grade, AI-powered healthcare intelligence platform built for the Indian population. It combines **23+ health modules**, **multi-modal AI orchestration** (Claude Sonnet + Gemini + XGBoost), **RAG-based medical knowledge retrieval**, **ABDM integration**, **FHIR R4 compliance**, and **field-level encryption** — all wrapped in a premium, glassmorphism UI.

### Why Aarogya AI?

| Problem | Solution |
|---------|----------|
| 700M Indians lack reliable health data access | PWA + WhatsApp bot + 11-language voice |
| 77M diabetics, 101M prediabetics | CGM integration + clinical health score (Indian BMI cutoffs) |
| 150M need mental healthcare, 75% untreated | PHQ-9 + GAD-7 clinical screening with crisis helplines |
| Health data privacy concerns | DPDP Act consent framework + AES-256 field encryption |
| No India-specific AI health platform | ICMR-INDIAB data + ABDM + Ayurveda + PMJAY navigator |

---

## 🚀 Key Features

### Intelligence Core
- 🧠 **Health Brain** — Central AGI core connecting all modules
- 🔗 **Causal Reasoning Engine** — Root-cause analysis with 17-node causal graph
- 🧬 **Digital Twin Lab** — Virtual patient simulation & 90-day trajectory prediction
- ⚡ **Decision Intelligence Engine** — Utility-scored action recommendations
- 🛡️ **Clinical Trust Layer** — Explainability, confidence scoring, audit trail
- 🧬 **AI Evolution Insights** — Autonomous learning & self-improvement
- 🔗 **Diagnostic Fusion** — Multi-modal (labs + imaging + notes + wearables) unified diagnosis
- 📚 **Medical Knowledge Engine** — ICMR/WHO/ADA/AHA guideline tracking
- 🔬 **Diagnostic Overlay** — Lab trend detection + cross-analysis + multi-disease prediction
- 🤖 **AI Orchestration** — GLM router → Gemini (multimodal) + XGBoost (structured ML)
- 🔍 **RAG Engine** — Kaggle/HuggingFace/AI4Bharat dataset retrieval-augmented generation

### AI Diagnostics
- 🩺 **Symptom Checker** — AI-powered symptom analysis
- 🎯 **Disease Risk Predictor** — Multi-disease simultaneous assessment
- 🧪 **Lab Report Analyzer** — Automated PDF parsing with ICMR reference ranges
- 🩻 **X-Ray AI Reader** — Radiology image analysis (Claude Vision)
- 🔬 **DermAI Scan** — Skin condition analysis
- 👁️ **Medical Visual Q&A** — Image-based medical questioning

### Nutrition & Wellness
- 🍎 **Food Scanner** — Nutrition detection
- 🥗 **AI Diet Planner** — Indian diet plans with ICMR-NIN food tables
- 🌿 **Ayurveda Intelligence** — Charaka Samhita-based recommendations
- 🧘 **Calm Mind Sanctuary** — PHQ-9/GAD-7 clinical screening + meditation

### Care Network
- 📅 **Telehealth Consults** — Doctor appointment booking
- 💊 **Medication Reminders** + **Drug Interaction Checker** (RxNorm API)
- 🏥 **Regional Doctors & PHCs** — India-wide doctor directory
- 🤝 **Senior Citizens Care** — Elderly health monitoring

### Health Library
- 🩸 **Diabetes Care** + **CGM Integration** (FreeStyle Libre)
- 🌸 **Women's Health**
- ⚖️ **BMI & Nutrition** (Indian BMI cutoffs)
- 🛡️ **Risk Assessment**
- 💡 **Health Tips**

### New Modules (20-Step Implementation)
- 🏥 **ABDM Integration** — ABHA number login, medical history import
- ⌚ **Wearables** — Google Fit, Apple Health, Samsung, FreeStyle Libre, Omron
- 🧬 **Pharmacogenomics** — Drug-gene interactions (CYP2C19, G6PD, SLCO1B1)
- 📋 **PMJAY Insurance Navigator** — Eligibility checker + AI insurance assistant
- 💬 **WhatsApp Bot** — Vernacular health access in any Indian language
- 🏥 **Clinic B2B Dashboard** — Doctor-facing patient management
- 📜 **Regulatory Compliance** — CDSCO SaMD classification page
- 🔬 **Clinical Research** — AAROGYA-DM1/CV1/MH1 study roadmap
- 🌿 **Open-Source Ayurveda API** — Public API at `/api/public/ayurveda`

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4 + shadcn/ui (New York) + Radix UI |
| **Database** | Prisma ORM + SQLite |
| **State** | Zustand + TanStack Query |
| **AI Models** | Claude Sonnet (Anthropic) + Gemini (Google) + XGBoost (local) |
| **Animations** | Framer Motion + CSS keyframes (90 FPS GPU-accelerated) |
| **Icons** | Lucide React |
| **Runtime** | Bun |
| **Auth** | NextAuth.js v4 |
| **Charts** | Recharts |
| **PWA** | next-pwa (manifest + service worker) |

---

## ⚡ Quick Start

### 🌐 Try the Live Demo
**👉 [http://47.57.232.232:81](http://47.57.232.232:81)** — No installation needed!

### Run Locally

### Prerequisites
- [Bun](https://bun.sh) v1.0+
- Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/arpitnayan123-bot/Aarogya-AI.git
cd Aarogya-AI

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Push database schema
bun run db:push

# Start development server
bun run dev
```

### Environment Variables

```env
# Required
DATABASE_URL=file:./db/custom.db
ANTHROPIC_API_KEY=sk-ant-...     # Claude API (replaces GLM-4)
HEALTH_DATA_ENCRYPTION_KEY=...   # 32-byte hex (node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Optional (feature-specific)
ABDM_CLIENT_ID=...               # ABDM sandbox: sandbox.abdm.gov.in
ABDM_CLIENT_SECRET=...
WHATSAPP_TOKEN=...               # WhatsApp Business API
GEMINI_API_KEY=...               # Non-medical orchestration
```

### Available Scripts

```bash
bun run dev        # Start dev server (port 3000)
bun run lint       # Run ESLint
bun run db:push    # Push Prisma schema to database
bun run db:generate # Generate Prisma client
bun run build      # Production build
```

---

## 📁 Project Structure

```
Aarogya-AI/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Main dashboard (single / route)
│   │   ├── api/                      # 25+ API routes
│   │   │   ├── ai/                   # chat, symptom, lab-report, xray, skin, diet, prediction
│   │   │   ├── orchestrate/          # AI orchestration engine
│   │   │   ├── rag/                  # RAG retrieval endpoint
│   │   │   ├── abdm/                 # ABDM connect
│   │   │   ├── fhir/                 # FHIR R4 Patient + Observation
│   │   │   ├── cgm/                  # CGM readings
│   │   │   ├── clinic/               # Clinic B2B
│   │   │   ├── whatsapp/             # WhatsApp webhook
│   │   │   ├── consent/              # Consent recording
│   │   │   └── public/ayurveda/      # Open-source Ayurveda API
│   │   ├── compliance/               # Regulatory compliance page
│   │   ├── clinic/                   # B2B clinic dashboard
│   │   ├── research/                 # Clinical research landing
│   │   ├── developers/               # Developer documentation
│   │   ├── pharmacogenomics/         # Pharmacogenomics module
│   │   └── insurance/                 # PMJAY insurance navigator
│   │
│   ├── components/
│   │   ├── aarogya/                  # 40+ healthcare components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AarogyaHealthBrain.tsx
│   │   │   ├── ClinicalTrustEngine.tsx
│   │   │   ├── AutonomousLearningEngine.tsx
│   │   │   ├── AIOrchestrationEngine.tsx
│   │   │   └── ...
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── abdm/                     # ABHA Connect
│   │   ├── devices/                  # Wearable connections
│   │   ├── medications/              # Drug interaction checker
│   │   ├── mental-health/            # PHQ-9/GAD-7 assessments
│   │   ├── diabetes/                 # CGM dashboard
│   │   ├── consent/                  # Consent gate
│   │   └── pwa/                      # PWA install prompt
│   │
│   └── lib/
│       ├── ai-client.ts              # Claude (Anthropic) API client
│       ├── ai/                       # AI orchestrator, provider, prompts, safety
│       │   ├── orchestrationEngine.ts
│       │   ├── geminiAdapter.ts
│       │   ├── xgboostAdapter.ts
│       │   └── ragEngine.ts
│       ├── abdm/                     # ABDM service
│       ├── wearables/                # Google Fit + Apple Health
│       ├── lab-parser/               # PDF lab report parser
│       ├── medications/              # RxNorm drug database
│       ├── mental-health/            # PHQ-9/GAD-7 assessments
│       ├── health-score/             # Clinical health score (Indian BMI)
│       ├── fhir/                     # FHIR R4 utilities
│       ├── consent/                  # Consent types
│       ├── cgm/                      # FreeStyle Libre API
│       ├── whatsapp/                 # WhatsApp service
│       ├── audit/                    # Audit logger
│       ├── encryption/               # AES-256 field encryption
│       ├── ctee.ts                   # Clinical Trust & Explainability Engine
│       ├── alee.ts                   # Autonomous Learning & Evolution Engine
│       ├── intelligenceBus.ts        # Cross-module pub/sub bus
│       ├── diagnosticFusion.ts        # Multi-modal diagnostic fusion
│       ├── medicalKnowledge.ts       # Research/guideline tracker
│       ├── diagnosticEnhancements.ts # Lab trend + cross-analysis
│       └── ...
│
├── prisma/                           # Database schema
├── public/                           # PWA manifest, icons
├── .env.example                      # Environment template
└── package.json
```

---

## 🔌 API Routes

### AI & Orchestration
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | AI companion chat (Claude) |
| POST | `/api/ai/symptom` | Symptom analysis |
| POST | `/api/ai/lab-report` | Lab report analysis |
| POST | `/api/ai/xray` | X-ray image analysis |
| POST | `/api/ai/skin` | Skin condition analysis |
| POST | `/api/ai/diet` | Diet plan generation |
| POST | `/api/orchestrate` | Multi-engine orchestration (Gemini + XGBoost) |
| GET/POST | `/api/rag` | RAG retrieval (Kaggle/HF/AI4Bharat) |

### Healthcare Integration
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/abdm/connect` | ABHA verification |
| GET | `/api/fhir/Patient/[id]` | FHIR R4 Patient resource |
| GET | `/api/fhir/Observation` | FHIR R4 Observation bundle |
| POST | `/api/cgm/readings` | CGM glucose data |
| POST | `/api/labs/parse` | PDF lab report parser |
| POST | `/api/medications/check-interactions` | Drug interaction checker |
| GET | `/api/wearables/google-fit` | Google Fit data |
| POST | `/api/consent/record` | Consent recording |

### B2B & Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clinic/patients` | Clinic patient list |
| GET/POST | `/api/whatsapp/webhook` | WhatsApp bot |
| GET/POST | `/api/public/ayurveda` | Open-source Ayurveda API |
| GET | `/api/insurance/check-eligibility` | PMJAY eligibility |
| POST | `/api/insurance/ask` | AI insurance assistant |
| POST | `/api/pharmacogenomics/analyze` | Genetic report analysis |

---

## 🧠 AI & Data Sources

### AI Models
| Model | Role | Provider |
|-------|------|---------|
| **Claude Sonnet** | Primary reasoning & vision | Anthropic |
| **Gemini** | Non-medical orchestration | Google |
| **XGBoost** | Structured-data risk prediction | Local (3-tree GBDT) |
| **JEPA** | Latent state prediction | Concept: Y. LeCun |

### RAG Datasets (1.1M+ records)
| Dataset | Source | Records |
|---------|--------|---------|
| Diabetes Health Indicators | Kaggle | 253,680 |
| UCI Heart Disease | Kaggle | 920 |
| MIMIC-IV Clinical Database | Kaggle | 180,733 |
| Medical QA Dataset | Hugging Face | 200,000 |
| PubMed Abstracts | Hugging Face | 211,269 |
| CheXpert Chest X-ray | Hugging Face | 224,316 |
| AI4Bharat Health & Language | AI Kosh | 48,000 |

### Clinical Guidelines
ADA 2024 · ICMR 2023 · AHA 2017 · WHO 2011 · NICE NG181 · KDIGO 2024

### India-Specific Data
ICMR-INDIAB · NFHS-5 · ICMR-NIN Food Tables · LASI · AI4Bharat (Bhashini) · BharatGen

---

## 🔒 Compliance & Security

### DPDP Act 2023 Compliance
- ✅ **Consent Framework** — Granular, informed consent before any data processing
- ✅ **Field-Level Encryption** — AES-256-CBC for all health data at rest
- ✅ **Audit Logging** — Immutable trail of every data access
- ✅ **Claude API** — Replaced GLM-4 (Chinese) with Anthropic (US) for data sovereignty

### Regulatory
- ✅ **CDSCO SaMD Classification** — Class A/B medical device software
- ✅ **FHIR R4** — Global health data interoperability standard
- ✅ **IEC 62304** — Medical device software lifecycle
- ✅ **Adverse Event Reporting** — safety@aarogyaai.in, 48-hour review SLA

### Data Standards
FHIR R4 · ICD-10 · SNOMED CT · LOINC · RxNorm

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Self-Hosted
```bash
bun run build
bun run start
```

### Environment Setup
1. Set all required env vars in your hosting platform
2. Run database migration: `bun run db:push`
3. Generate encryption key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 🤝 Contributing

We welcome contributions! Please see our [Developers Page](/developers) for API documentation.

### Areas for Contribution
- 🌿 Ayurveda herb-drug interaction data
- 🧬 Pharmacogenomics variant frequencies for Indian populations
- 🗣 Indian language translations for health assessments
- 📊 Validation studies with BAMS practitioners
- 🏥 Hospital partnership for clinical validation

---

## 📄 License

- **Code**: Proprietary (© 2026 Aarogya AI)
- **Open-Source Ayurveda API**: Apache 2.0
- **Dependencies**: Retain their original licenses (MIT, Apache-2.0, BSD, ISC)

---

## ⚠️ Disclaimer

Aarogya AI is a wellness and educational platform. It is **not a substitute for professional medical diagnosis or treatment**. Always consult a qualified healthcare provider before making medical decisions.

For emergencies, call **112** (India).

---

## 📞 Contact

- **🚀 Live Demo**: [http://47.57.232.232:81](http://47.57.232.232:81)
- **GitHub**: [github.com/arpitnayan123-bot/Aarogya-AI](https://github.com/arpitnayan123-bot/Aarogya-AI)
- **Research Partnerships**: research@aarogyaai.in
- **Safety Reports**: safety@aarogyaai.in
- **Developer Docs**: [/developers](http://47.57.232.232:81/developers)

---

<p align="center">
  <strong>भारत के लिए, भारत के लोगों द्वारा 🇮🇳</strong><br>
  <em>Built with gratitude for every Indian who deserves better healthcare.</em><br><br>
  © 2026 Aarogya AI · Healthcare Intelligence Platform
</p>
