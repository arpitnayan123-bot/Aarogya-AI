// ============================================
// AAROGYA AI — CENTRALIZED DATASET CREDITS
// Every section references relevant datasets.
// ============================================

export const DATASETS = [
  {
    name: 'ICMR-INDIAB Study',
    org: 'Indian Council of Medical Research',
    desc: 'Epidemiology of diabetes and cardiovascular risk in India (75,000+ participants).',
    url: 'https://www.icmr.nic.in'
  },
  {
    name: 'NFHS-5',
    org: 'MoHFW, India',
    desc: 'National Family Health Survey — women\'s health, nutrition, family planning data.',
    url: 'https://rchiips.org/nfhs'
  },
  {
    name: 'ICMR-NIN Food Tables',
    org: 'National Institute of Nutrition',
    desc: 'Nutritional values of 528 common Indian foods.',
    url: 'https://www.nin.res.in'
  },
  {
    name: 'UCI Heart Disease Dataset',
    org: 'UCI Machine Learning Repository',
    desc: 'Clinical features for cardiovascular risk prediction (Cleveland cohort).',
    url: 'https://archive.ics.uci.edu/ml/datasets/heart+disease'
  },
  {
    name: 'Pima Indians Diabetes Dataset',
    org: 'NIDDK / UCI',
    desc: 'Predictive features (glucose, BMI, age, pregnancies) for diabetes onset.',
    url: 'https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database'
  },
  {
    name: 'WHO Mental Health Atlas',
    org: 'World Health Organization',
    desc: 'Global mental health prevalence and resource mapping.',
    url: 'https://www.who.int/teams/mental-health-and-substance-use/data'
  },
  {
    name: 'BhashaBench-Ayur',
    org: 'BharatGen / AI4Bharat',
    desc: '14,963 Ayurvedic Q&A for traditional Indian medicine insights.',
    url: 'https://bhashini.gov.in'
  },
  {
    name: 'LASI (Longitudinal Ageing Study in India)',
    org: 'IIPS / MoHFW',
    desc: 'Health and well-being of older adults (70,000+ seniors across India).',
    url: 'https://www.iipsindia.ac.in/lasi'
  },
  {
    name: 'Indian Healthcare Symptom DB',
    org: 'Community Curation',
    desc: '300+ symptom-disease mappings with Indian regional prevalence.',
    url: '#'
  },
  {
    name: 'LabQAR Dataset',
    org: 'University of Florida / NIH',
    desc: '550 manually curated lab test reference ranges.',
    url: 'https://www.medrxiv.org/content/10.1101/2025.06.03.25328882v1.full'
  },
  {
    name: 'PHC Manpower Census 2011',
    org: 'MoHFW · IndiaAI',
    desc: 'Manpower at Primary Health Centres across India.',
    url: '#'
  },
  {
    name: 'Older Persons Grant Data',
    org: 'IndiaAI',
    desc: 'Integrated Programme for Older Persons — GOI grant data.',
    url: '#'
  },
  {
    name: 'Bhashini-IndicNER',
    org: 'AI4Bharat',
    desc: 'Multilingual NER model for 11 Indian languages.',
    url: '#'
  },
  {
    name: 'BiomedVLP-CXR-BERT',
    org: 'Microsoft',
    desc: 'Domain-specific vision-language model for radiology.',
    url: '#'
  },
  {
    name: 'BiomedCLIP-PubMedBERT',
    org: 'Microsoft',
    desc: 'Biomedical vision-language foundation model (PMC-15M).',
    url: '#'
  },
  {
    name: 'Groq AI (Llama 3.3 70B)',
    org: 'Groq / Meta',
    desc: 'Fast AI inference engine powering Aarogya AI analysis.',
    url: 'https://console.groq.com'
  },
  {
    name: 'Google Gemini 2.0 Flash',
    org: 'Google DeepMind',
    desc: 'Multimodal AI for vision + text health analysis.',
    url: 'https://deepmind.google/technologies/gemini'
  }
];

// Helper: filter datasets by keywords for a specific section
export const getDatasetsFor = (keywords: string[]) =>
  DATASETS.filter(d => keywords.some(k => d.name.toLowerCase().includes(k.toLowerCase()) || d.org.toLowerCase().includes(k.toLowerCase())));
