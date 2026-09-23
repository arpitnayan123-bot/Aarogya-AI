# Aarogya Ayurved — Open-Source Ayurvedic Intelligence API

> India's first open-source Ayurvedic intelligence API. Grounded in the
> classical triad of **Charaka Samhita**, **Sushruta Samhita**, and
> **Ashtanga Hridayam**, with CCRAS clinical guidelines and AYUSH Ministry
> protocols layered on top. Free, self-hostable, built for Bharat.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Status: Beta](https://img.shields.io/badge/Status-Beta-emerald.svg)]()
[![Made for Bharat](https://img.shields.io/badge/Built_for-Bharat-teal.svg)]()

---

## Why this exists

Most Ayurvedic "AI" tools on the internet today are either:

1. Generic chatbots with **no classical grounding** — they hallucinate
   formulations that don't exist in any Samhita, or
2. Closed, paid SaaS APIs that lock India's traditional knowledge behind a
   credit-card wall.

**Aarogya Ayurved** fixes both. It is:

- **Open source** (Apache 2.0) — fork it, audit it, host it yourself.
- **Classically grounded** — every answer cites the source Samhita,
  Sthana, and chapter where the recommendation originates.
- **India-tuned** — personalizes answers by the user's **Prakriti**
  (Vata / Pitta / Kapha), uses Indian drug brand examples, and replies in
  the user's language (Hindi, English, Tamil, Telugu, Kannada, Malayalam,
  Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu).
- **Safety-first** — flags known herb-drug interactions, contraindications
  in pregnancy, and routes acute emergencies to **112** before any
  Ayurvedic commentary.

---

## Quick start

### 1. Try the hosted endpoint

```bash
curl -X POST https://aarogya.ai/api/public/ayurveda \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What does Charaka say about managing early-stage Type 2 diabetes (Prameha)?",
    "prakriti": "kapha"
  }'
```

Response (truncated):

```json
{
  "success": true,
  "response": "Charaka Samhita, Chikitsa Sthana 6, classifies Prameha into 20 sub-types ... For a Kapha-predominant Prakriti, the line of treatment (Shamana) emphasises Tikta and Katu Rasa, Ruksha-Ushna qualities ...",
  "disclaimer": "This is educational Ayurvedic information, not medical advice. Consult a BAMS doctor for personal treatment.",
  "powered_by": "Aarogya AI Open Ayurveda API v1.0",
  "rate_limit": "10 requests/hour"
}
```

### 2. Self-host

```bash
git clone https://github.com/aarogyaai/ayurveda-api
cd ayurveda-api
bun install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
bun dev
# API now live at http://localhost:3000/api/public/ayurveda
```

---

## Request format

| Field       | Type   | Required | Notes |
| ----------- | ------ | -------- | ----- |
| `query`     | string | ✅ yes   | ≥ 3 characters, up to 1500 used. |
| `prakriti`  | string | optional | One of: `vata`, `pitta`, `kapha`, `vata-pitta`, `pitta-kapha`, `vata-kapha`, `tridosha`. Personalizes the answer. |

### `prakriti` values

| Value | Constitution |
| ----- | ------------ |
| `vata` | Vata-dominant |
| `pitta` | Pitta-dominant |
| `kapha` | Kapha-dominant |
| `vata-pitta` | Vata-Pitta dual |
| `pitta-kapha` | Pitta-Kapha dual |
| `vata-kapha` | Vata-Kapha dual |
| `tridosha` | Tridoshic / balanced |

---

## Response format

| Field         | Type    | Notes |
| ------------- | ------- | ----- |
| `success`     | boolean | `true` on success. |
| `response`    | string  | Ayurvedic answer in the user's language. |
| `disclaimer`  | string  | Fixed educational disclaimer (always present). |
| `powered_by`  | string  | `Aarogya AI Open Ayurveda API v1.0`. Required attribution in derivative apps. |
| `rate_limit`  | string  | `10 requests/hour`. |

---

## Rate limits

| Quota | Value |
| ----- | ----- |
| Requests | 10 / hour / IP |
| HTTP status when exceeded | `429 Too Many Requests` |
| Sliding window | 1 hour |
| Response headers | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` (seconds) |

Higher quotas are available to authenticated partners — email
**research@aarogyaai.in**.

---

## Knowledge sources

The system prompt that grounds the model is built on the following primary
and secondary sources. Contributions that expand this corpus (with citations)
are warmly welcomed.

### Primary classical texts (Brihat Trayi)

- **Charaka Samhita** — internal medicine (Kayachikitsa).
- **Sushruta Samhita** — surgery (Shalya Tantra).
- **Ashtanga Hridayam** — Vagbhata's synthesis.

### Modern Indian AYUSH guidelines

- **CCRAS** (Central Council for Research in Ayurvedic Sciences) clinical
  guidelines — especially the published monographs on Madhumeha (diabetes),
  Pandu (anaemia), Amlapitta (GERD), and Sandhivata (osteoarthritis).
- **AYUSH Ministry protocols** — including the AYUSH-64 and Ashwagandha
  prophylaxis/adjuvant protocols released during the COVID-19 pandemic, which
  are useful reference points for evidence-grade Ayurvedic recommendations.
- **API (Ayurvedic Pharmacopoeia of India)** — for standardized herb names,
  parts used, and classical dose ranges.

> **Scope note.** The API does NOT consult Laghu Trayi (Sharangadhara
> Samhita, Bhavaprakasha, Madhava Nidana) yet. Adding these is on the
> roadmap — see [Contributing](#contributing).

---

## Safety & scope

- **Educational only.** The API never prescribes doses for serious illness,
  never replaces allopathic treatment, and never claims to cure named
  diseases.
- **Herb-drug interaction flagging** is built into the system prompt:
  - Ashwagandha + thyroid medication / immunosuppressants
  - Guduchi (Giloy) + antidiabetic drugs
  - Turmeric (Curcumin) + anticoagulants
  - Guggulu + statins
  - Brahmi + sedatives / CNS depressants
- **Pregnancy contraindications** are flagged automatically (e.g. avoidance
  of Ashoka, Vishamusthi, Vatsanabha-containing formulations).
- **Emergencies** — acute trauma, suicidal ideation, severe breathlessness,
  chest pain — are routed to **112** before any Ayurvedic commentary is
  generated.
- Every response ships with a fixed disclaimer: *"This is educational
  Ayurvedic information, not medical advice. Consult a BAMS doctor for
  personal treatment."*

---

## Contributing

We welcome contributions in five tracks. PRs that add citations and
classical references are merged faster than those that don't.

### 1. Herb-drug interaction data

We need a structured, citable dataset of Ayurvedic herbs × modern
allopathic drugs × interaction type × severity × reference. CSV or JSON
submissions to `data/herb-drug-interactions/` are welcome. Each row must
cite a peer-reviewed paper or a published pharmacology textbook.

### 2. Prakriti datasets

Annotated Prakriti assessment datasets (with informed-consent provenance)
are essential to validate personalization. We accept:

- De-identified Prakriti questionnaire responses (with the participant's
  consent record).
- Clinical Prakriti assessments cross-validated by qualified BAMS doctors.
- Cross-cultural Prakriti-genotype correlation datasets (e.g.
  CYP2C19/HLA-B*57:01 vs Prakriti) — see the Aarogya AI pharmacogenomics
  module for context.

### 3. Language translations

The API supports 12 Indian languages today. We need native-speaker review
of:

- Classical Ayurvedic term translations (e.g. does "Vata" become "വാതം" in
  Malayalam, or is a transliteration preferred?).
- Hindi/Marathi/Bengali translations of the disclaimer and the
  herb-drug-interaction warning templates.

### 4. Validation studies

We invite Ayurvedic medical colleges to run prospective validation
studies:

- Does the API's Prakriti-personalized recommendation match a senior
  Vaidya's independent recommendation? (Cohen's κ ≥ 0.6 target.)
- Are classical citations accurate when audited by a Samhita scholar?

Co-authorship on the resulting paper (target: **AYU** journal or **Indian
Journal of Traditional Knowledge**) is offered to all contributing teams.

### 5. Code & infrastructure

- TypeScript / Next.js 16 improvements.
- Move the in-memory rate limiter to Redis.
- Add an authenticated higher-quota tier (API keys via Better Auth).
- Add a LangSmith / LangFuse evaluation harness for regression-testing
  the system prompt.

### How to contribute

1. Open an issue describing the contribution before opening a PR.
2. Fork → branch → PR. Sign off on the Developer Certificate of Origin
   (`git commit -s`).
3. For data contributions, attach the consent / provenance record — we
   will NOT merge data without it.
4. Code contributions must pass `bun run lint`, `bunx tsc --noEmit`, and
   any existing tests.

---

## License

**Apache License 2.0** — see [`LICENSE`](./LICENSE).

You are free to:

- ✅ Commercial use
- ✅ Modify
- ✅ Distribute
- ✅ Patent grant
- ✅ Private use

You must:

- ⚠️ Include the copyright notice.
- ⚠️ Include a copy of the Apache 2.0 license.
- ⚠️ Preserve the `powered_by: "Aarogya AI Open Ayurveda API v1.0"`
  attribution string in any derivative API response.
- ⚠️ Preserve the educational disclaimer.

---

## Attribution

**Aarogya AI — Built for Bharat.**

This repository is maintained by the Aarogya AI Research Program. The
classical Ayurvedic knowledge referenced here is the collective heritage
of the Indian subcontinent; we claim no ownership over it. We only
maintain the wrapper code, the system prompt, and the curated interaction
dataset.

For partnerships, co-authorship on validation studies, or higher-rate
access, contact **research@aarogyaai.in**.

> _"Swasthasya swasthya rakshanam, aturasya vikara prashamanam ca."_
> — Charaka Samhita, Sutrasthana 30.26
>
> *"The purpose of Ayurveda is to preserve the health of the healthy and
> to alleviate the disorders of the diseased."*
