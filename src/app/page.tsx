'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Sparkles, Heart, Apple, Video,
  Droplets, Flower2, Search,
  Scale, ShieldAlert, Lightbulb, Menu, X, FileSearch, ScanLine,
  Stethoscope, Image as ImageIcon, Building2, Leaf, HandHeart, Scan,
  Home, ChevronRight, Command, Bell, ShieldCheck, TrendingUp, Zap, Pill, Clock, Brain, Trophy, Layers, BookOpen, Cpu,
  Network, GitBranch, Microscope, FlaskConical, Database, Radar, LineChart, MessageSquare, Calendar, HeartPulse, Target, Dna, Workflow, Boxes
} from 'lucide-react';
import type { UserMetrics, Appointment } from '@/types/aarogya';
import Landing from '@/components/aarogya/Landing';
import Dashboard from '@/components/aarogya/Dashboard';
import { AIChat } from '@/components/aarogya/AIChat';
import { SymptomChecker } from '@/components/aarogya/SymptomChecker';
import { ReportAnalyzer } from '@/components/aarogya/ReportAnalyzer';
import { XrayReader } from '@/components/aarogya/XrayReader';
import { MedicalImageQA } from '@/components/aarogya/MedicalImageQA';
import { SkinAnalyzer } from '@/components/aarogya/SkinAnalyzer';
import { DietPlanner } from '@/components/aarogya/DietPlanner';
import { FoodScanner } from '@/components/aarogya/FoodScanner';
import { MentalHealth } from '@/components/aarogya/MentalHealth';
import { Ayurveda } from '@/components/aarogya/Ayurveda';
import { AppointmentBooking } from '@/components/aarogya/AppointmentBooking';
import { RegionalDoctors } from '@/components/aarogya/RegionalDoctors';
import { SeniorCare } from '@/components/aarogya/SeniorCare';
import { HealthTips } from '@/components/aarogya/HealthTips';
import { Diabetes } from '@/components/aarogya/Diabetes';
import { WomensHealth } from '@/components/aarogya/WomensHealth';
import { BMINutrition } from '@/components/aarogya/BMINutrition';
import { RiskAssessment } from '@/components/aarogya/RiskAssessment';
import { DiseasePredictor } from '@/components/aarogya/DiseasePredictor';
import { PredictiveAnalytics } from '@/components/aarogya/PredictiveAnalytics';
import { CommandPalette } from '@/components/aarogya/CommandPalette';
import { AarogyaLogo } from '@/components/aarogya/AarogyaLogo';
import { HealthScoreWidget } from '@/components/aarogya/HealthScoreWidget';
import { MedicationReminder } from '@/components/aarogya/MedicationReminder';
import { HealthTimeline } from '@/components/aarogya/HealthTimeline';
import { EmergencyButton } from '@/components/aarogya/EmergencyButton';
import { ThemeToggle } from '@/components/aarogya/ThemeToggle';
import { HealthIntelligenceDashboard } from '@/components/aarogya/HealthIntelligenceDashboard';
import { AarogyaHealthBrain } from '@/components/aarogya/AarogyaHealthBrain';
import { GamificationEngine } from '@/components/aarogya/GamificationEngine';
import { VoiceAssistant } from '@/components/aarogya/VoiceAssistant';
import { CausalInferenceEngine } from '@/components/aarogya/CausalInferenceEngine';
import { DigitalTwinLab } from '@/components/aarogya/DigitalTwinLab';
import { DecisionIntelligenceEngine } from '@/components/aarogya/DecisionIntelligenceEngine';
import ClinicalTrustEngine from '@/components/aarogya/ClinicalTrustEngine';
import AutonomousLearningEngine from '@/components/aarogya/AutonomousLearningEngine';
import MultiModalDiagnosticFusion from '@/components/aarogya/MultiModalDiagnosticFusion';
import MedicalKnowledgeEngine from '@/components/aarogya/MedicalKnowledgeEngine';
import DiagnosticEnhancements from '@/components/aarogya/DiagnosticEnhancements';
import AIOrchestrationEngine from '@/components/aarogya/AIOrchestrationEngine';

// Navigation structure — premium, emoji-free, distinct icons per item
const NAV_SECTIONS = [
  {
    group: 'Intelligence Core',
    items: [
      { id: 'dashboard', label: 'Vitals Dashboard', icon: Activity },
      { id: 'health_brain', label: 'Health Brain', icon: Brain },
      { id: 'causal_inference', label: 'Causal Reasoning', icon: GitBranch },
      { id: 'digital_twin', label: 'Digital Twin Lab', icon: Dna },
      { id: 'smart_actions', label: 'Decision Engine', icon: Workflow },
      { id: 'intelligence_hub', label: 'Intelligence Hub', icon: Boxes },
      { id: 'clinical_trust', label: 'Clinical Trust', icon: ShieldCheck },
      { id: 'ai_evolution', label: 'AI Evolution', icon: Sparkles },
      { id: 'diagnostic_fusion', label: 'Diagnostic Fusion', icon: Layers },
      { id: 'medical_knowledge', label: 'Knowledge Engine', icon: BookOpen },
      { id: 'diagnostic_enhancements', label: 'Diagnostic Overlay', icon: Microscope },
      { id: 'ai_orchestration', label: 'AI Orchestration', icon: Cpu },
    ],
  },
  {
    group: 'Engagement',
    items: [
      { id: 'gamification', label: 'Health Rewards', icon: Trophy },
      { id: 'ai_chat', label: 'AI Companion', icon: MessageSquare },
      { id: 'predictive_analytics', label: 'Predictive Analytics', icon: TrendingUp },
      { id: 'health_timeline', label: 'Health Timeline', icon: Calendar },
    ],
  },
  {
    group: 'AI Diagnostics',
    items: [
      { id: 'symptom_checker', label: 'Symptom Checker', icon: Stethoscope },
      { id: 'disease_predictor', label: 'Disease Predictor', icon: Target },
      { id: 'report_analyzer', label: 'Lab Report Analyzer', icon: FlaskConical },
      { id: 'xray_reader', label: 'X-Ray Reader', icon: ScanLine },
      { id: 'skin_analyzer', label: 'DermAI Scan', icon: Scan },
      { id: 'medical_qa', label: 'Medical Visual Q&A', icon: ImageIcon },
    ],
  },
  {
    group: 'Nutrition & Wellness',
    items: [
      { id: 'food_scanner', label: 'Food Scanner', icon: Scan },
      { id: 'diet_plan', label: 'Diet Planner', icon: Apple },
      { id: 'ayurveda', label: 'Ayurveda Intelligence', icon: Leaf },
      { id: 'mental_health', label: 'Calm Mind Sanctuary', icon: Heart },
    ],
  },
  {
    group: 'Care Network',
    items: [
      { id: 'appointments', label: 'Telehealth Consults', icon: Video },
      { id: 'medication_reminder', label: 'Medication Reminders', icon: Pill },
      { id: 'regional_doctors', label: 'Regional Doctors', icon: Building2 },
      { id: 'senior_care', label: 'Senior Care', icon: HandHeart },
    ],
  },
  {
    group: 'Health Library',
    items: [
      { id: 'diabetes', label: 'Diabetes Care', icon: Droplets },
      { id: 'womens_health', label: "Women's Health", icon: Flower2 },
      { id: 'bmi_nutrition', label: 'BMI & Nutrition', icon: Scale },
      { id: 'risk_assessment', label: 'Risk Assessment', icon: ShieldAlert },
      { id: 'health_tips', label: 'Health Tips', icon: Lightbulb },
    ],
  },
];

const ALL_ITEMS = NAV_SECTIONS.flatMap(s => s.items.map(i => ({ ...i, group: s.group })));
const COMMAND_ITEMS = ALL_ITEMS.map(i => ({ id: i.id, label: i.label, group: i.group, icon: i.icon }));

const DEFAULT_METRICS: UserMetrics = {
  weight: 72, height: 178, age: 28, gender: 'Male', steps: 4200,
  waterIntake: 750, waterTarget: 2500, caloriesConsumed: 1120, caloriesTarget: 2200,
  systolicBP: 120, diastolicBP: 80, sleepHours: 6.8,
};

interface SidebarContentProps {
  activeTab: string;
  onNavClick: (id: string) => void;
  inDrawer?: boolean;
}

function SidebarContent({ activeTab, onNavClick, inDrawer = false }: SidebarContentProps) {
  return (
    <nav className="flex flex-col gap-0.5 px-3 py-3">
      {NAV_SECTIONS.map((section, sIdx) => (
        <div key={section.group} className="mb-1.5">
          <div className="px-3 pt-3 pb-1.5 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700" />
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.22em] whitespace-nowrap">{section.group}</span>
            <div className="h-px flex-1 bg-gradient-to-l from-slate-200 to-transparent dark:from-slate-700" />
          </div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 w-full ${
                  active
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30" />
                )}
                {!active && (
                  <div className="absolute inset-0 rounded-xl bg-transparent group-hover:bg-slate-100/40 dark:group-hover:bg-slate-800/30 transition-colors" />
                )}
                <Icon className={`relative z-10 w-4 h-4 shrink-0 transition-all duration-200 ${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600 group-hover:scale-110'}`} />
                <span className="relative z-10 flex-1 text-left truncate">{item.label}</span>
                {active && <ChevronRight className="relative z-10 w-3.5 h-3.5 ml-auto" />}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export default function AarogyaApp() {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<UserMetrics>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_user_metrics');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return DEFAULT_METRICS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aarogya_appointments');
      if (saved) { try { return JSON.parse(saved); } catch {} }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('aarogya_user_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('aarogya_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleNavClick = useCallback((id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  }, []);

  const enterApp = useCallback((target?: string) => {
    if (target) setActiveTab(target);
    setShowLanding(false);
  }, []);

  // Cmd+K command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'health_brain': return <AarogyaHealthBrain onNavigate={setActiveTab} />;
      case 'causal_inference': return <CausalInferenceEngine />;
      case 'digital_twin': return <DigitalTwinLab />;
      case 'smart_actions': return <DecisionIntelligenceEngine />;
      case 'clinical_trust': return <ClinicalTrustEngine />;
      case 'ai_evolution': return <AutonomousLearningEngine />;
      case 'diagnostic_fusion': return <MultiModalDiagnosticFusion />;
      case 'medical_knowledge': return <MedicalKnowledgeEngine />;
      case 'diagnostic_enhancements': return <DiagnosticEnhancements />;
      case 'ai_orchestration': return <AIOrchestrationEngine />;
      case 'intelligence_hub': return <HealthIntelligenceDashboard />;
      case 'gamification': return <GamificationEngine />;
      case 'ai_chat': return <AIChat metrics={metrics} setTab={setActiveTab} />;
      case 'predictive_analytics': return <PredictiveAnalytics />;
      case 'health_timeline': return <HealthTimeline />;
      case 'symptom_checker': return <SymptomChecker onBookDoctor={() => setActiveTab('appointments')} age={metrics.age} gender={metrics.gender} />;
      case 'disease_predictor': return <DiseasePredictor />;
      case 'report_analyzer': return <ReportAnalyzer />;
      case 'xray_reader': return <XrayReader />;
      case 'skin_analyzer': return <SkinAnalyzer />;
      case 'medical_qa': return <MedicalImageQA />;
      case 'food_scanner': return <FoodScanner />;
      case 'diet_plan': return <DietPlanner metrics={metrics} />;
      case 'ayurveda': return <Ayurveda />;
      case 'mental_health': return <MentalHealth />;
      case 'appointments': return <AppointmentBooking appointments={appointments} setAppointments={setAppointments} />;
      case 'medication_reminder': return <MedicationReminder />;
      case 'regional_doctors': return <RegionalDoctors />;
      case 'senior_care': return <SeniorCare />;
      case 'diabetes': return <Diabetes />;
      case 'womens_health': return <WomensHealth />;
      case 'bmi_nutrition': return <BMINutrition metrics={metrics} />;
      case 'risk_assessment': return <RiskAssessment metrics={metrics} />;
      case 'health_tips': return <HealthTips />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  if (showLanding) {
    return <Landing onStart={() => enterApp()} />;
  }

  const activeItem = ALL_ITEMS.find(i => i.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 flex flex-col">
      {/* Command Palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={COMMAND_ITEMS} onSelect={handleNavClick} />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 h-screen">
          <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-100 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative group">
              <AarogyaLogo size={42} />
              <div className="absolute -inset-1 bg-emerald-400 rounded-2xl blur-lg opacity-25 animate-pulseGlow -z-10" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Aarogya<span className="gradient-text-emerald"> AI</span></h1>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em]">Healthcare Intelligence</p>
            </div>
          </div>

          {/* Search trigger */}
          <div className="px-3 pt-3">
            <button onClick={() => setPaletteOpen(true)} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-100/70 hover:bg-slate-100 text-slate-400 transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium flex-1 text-left">Search anything...</span>
              <kbd className="text-[9px] font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5"><Command className="w-2.5 h-2.5" />K</kbd>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-slim mt-1">
            <SidebarContent activeTab={activeTab} onNavClick={handleNavClick} />
          </div>

          {/* Health Score Widget */}
          <HealthScoreWidget metrics={metrics} onNavigate={setActiveTab} />

          {/* User card */}
          <div className="p-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/50 border border-slate-100">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold">A</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">Aarogya Guest</p>
                <p className="text-[10px] text-slate-400 font-semibold">{metrics.age} y/o · {metrics.gender}</p>
              </div>
            </div>
            <button onClick={() => setShowLanding(true)} className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-emerald-600 py-2 transition-colors">
              <Home className="w-3.5 h-3.5" /> View Landing Page
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden flex">
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-fadeIn" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col animate-slideIn">
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <AarogyaLogo size={38} />
                  <h1 className="text-base font-extrabold text-slate-900">Aarogya<span className="gradient-text-emerald"> AI</span></h1>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-slim py-2">
                <SidebarContent activeTab={activeTab} onNavClick={handleNavClick} inDrawer />
              </div>
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-100 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <Home className="w-3 h-3" />
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-500">{activeItem?.group || 'Overview'}</span>
                </div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                  {activeItem?.label || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setPaletteOpen(true)} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-colors">
                <Search className="w-4 h-4" />
                <kbd className="text-[9px] font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5"><Command className="w-2.5 h-2.5" />K</kbd>
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-100">
                <ShieldCheck className="w-3.5 h-3.5" /> Encrypted
              </div>
              <ThemeToggle />
              <button className="relative p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold cursor-pointer" onClick={() => setActiveTab('dashboard')}>A</div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
            <div key={activeTab} className="animate-fadeInUp">
              {renderContent()}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50 px-4 sm:px-6 lg:px-8 py-10 mt-12">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇮🇳</span>
                <span className="text-base font-extrabold gradient-text-emerald">Made in India</span>
                <span className="text-sm text-slate-400 font-medium">for Bharat</span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full font-medium">
                <ShieldCheck className="w-3 h-3" /> For wellness only · Not a substitute for professional medical diagnosis or treatment
              </div>

              <p className="text-[10px] text-slate-400 mt-2">© 2026 Aarogya AI · Healthcare Intelligence Platform</p>
            </div>
          </footer>
        </div>
      </div>

      {/* Emergency Quick Access Button */}
      <EmergencyButton onNavigate={setActiveTab} />

      {/* Voice Assistant — always visible floating mic */}
      <VoiceAssistant onNavigate={setActiveTab} />
    </div>
  );
}
