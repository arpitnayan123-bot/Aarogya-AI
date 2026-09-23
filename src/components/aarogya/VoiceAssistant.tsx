'use client';

/**
 * VoiceAssistant — Complete voice control in 11 Indian languages.
 *
 * Uses the Web Speech API (SpeechRecognition + SpeechSynthesis) for:
 * - Voice commands ("Mera report dikhao")
 * - Voice symptom reporting ("Mujhe bukhar hai")
 * - Voice navigation
 * - Voice responses in user's language
 *
 * Floating microphone button is always visible.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic, MicOff, X, Volume2, VolumeX, Globe, Sparkles, Zap
} from 'lucide-react';

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी', name: 'Hindi' },
  { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil' },
  { code: 'te-IN', label: 'తెలుగు', name: 'Telugu' },
  { code: 'bn-IN', label: 'বাংলা', name: 'Bengali' },
  { code: 'mr-IN', label: 'मराठी', name: 'Marathi' },
  { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada' },
  { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ', name: 'Odia' },
  { code: 'as-IN', label: 'অসমীয়া', name: 'Assamese' },
];

// Voice command patterns (multi-language)
const COMMANDS = [
  { patterns: ['report', 'report dikhao', 'रिपोर्ट', 'lab', 'lab report'], action: 'report_analyzer', label: 'Opening Lab Report Analyzer' },
  { patterns: ['symptom', 'laksan', 'bukhar', 'fever', 'दर्द', 'bimari', 'symptom check'], action: 'symptom_checker', label: 'Opening Symptom Checker' },
  { patterns: ['dawai', 'medicine', 'medication', 'reminder', 'दवाई', 'pill'], action: 'medication_reminder', label: 'Opening Medication Reminders' },
  { patterns: ['doctor', 'consult', 'appointment', 'टॉक', 'baat', 'telehealth'], action: 'appointments', label: 'Opening Telehealth Consults' },
  { patterns: ['sugar', 'glucose', 'diabetes', 'diabetes care', 'शुगर', 'madhumeh'], action: 'diabetes', label: 'Opening Diabetes Care' },
  { patterns: ['diet', 'food', 'meal', 'khana', 'khao', 'poshan'], action: 'diet_plan', label: 'Opening Diet Planner' },
  { patterns: ['xray', 'x-ray', 'scan', 'radiology', 'एक्स-रे'], action: 'xray_reader', label: 'Opening X-Ray Reader' },
  { patterns: ['dashboard', 'home', 'vitals', 'ghar', 'mukhya'], action: 'dashboard', label: 'Opening Dashboard' },
  { patterns: ['brain', 'intelligence', 'dimag', 'samajh'], action: 'intelligence_hub', label: 'Opening Health Intelligence Hub' },
  { patterns: ['heart', 'dil', 'cardiac', 'heart rate'], action: 'risk_assessment', label: 'Opening Risk Assessment' },
  { patterns: ['mental', 'calm', 'meditation', 'stress', 'dhyan', 'shanti'], action: 'mental_health', label: 'Opening Calm Mind Sanctuary' },
  { patterns: ['ayurveda', 'dosha', 'prakriti', 'herb', 'आयुर्वेद'], action: 'ayurveda', label: 'Opening Ayurveda Intelligence' },
];

interface VoiceAssistantProps {
  onNavigate?: (tab: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onNavigate }) => {
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [muted, setMuted] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const recognitionRef = useRef<any>(null);

  const speak = useCallback((text: string) => {
    if (muted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [muted, selectedLang]);

  const processCommand = useCallback((text: string) => {
    if (!text) {
      setResponse('माफ़ कीजिए, मैंने नहीं सुना। कृपया दोबारा बोलें।');
      speak('माफ़ कीजिए, मैंने नहीं सुना। कृपया दोबारा बोलें।');
      return;
    }

    const lower = text.toLowerCase();
    let matched = false;

    for (const cmd of COMMANDS) {
      if (cmd.patterns.some(p => lower.includes(p.toLowerCase()))) {
        setResponse(cmd.label);
        speak(cmd.label);
        if (onNavigate) {
          setTimeout(() => onNavigate(cmd.action), 1500);
        }
        matched = true;
        setRecognized(true);
        break;
      }
    }

    if (!matched) {
      // Symptom reporting pattern
      if (lower.includes('bukhar') || lower.includes('fever') || lower.includes('दर्द') || lower.includes('dard') || lower.includes('pain')) {
        setResponse(`आपने बताया: "${text}". लक्षण विश्लेषण के लिए Symptom Checker खोल रहा हूं...`);
        speak(`आपने बताया: ${text}. लक्षण विश्लेषण के लिए Symptom Checker खोल रहा हूं।`);
        if (onNavigate) setTimeout(() => onNavigate('symptom_checker'), 2000);
        setRecognized(true);
      } else {
        setResponse(`आपने कहा: "${text}". मैं इसे समझ नहीं पाया। कोशिश करें: "रिपोर्ट दिखाओ", "दवाई याद दिलाओ", "डॉक्टर से बात करनी है"`);
        speak(`आपने कहा: ${text}. मैं इसे समझ नहीं पाया। कोशिश करें: रिपोर्ट दिखाओ, दवाई याद दिलाओ, डॉक्टर से बात करनी है`);
      }
    }

    setTimeout(() => setRecognized(false), 3000);
  }, [onNavigate, speak]);

  // Use a ref to hold the latest transcript for the recognition onend handler
  const transcriptRef = useRef('');
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onresult = (event: any) => {
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          final += event.results[i][0].transcript;
        }
        setTranscript(final);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Use a timeout to ensure final transcript is set
        setTimeout(() => {
          processCommand(transcriptRef.current || '');
        }, 100);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, [selectedLang, processCommand]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      setResponse('आपके ब्राउज़र में वॉइस रिकग्निशन समर्थित नहीं है। कृपया Chrome का उपयोग करें।');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      setRecognized(false);
      try {
        recognitionRef.current.lang = selectedLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // already started
      }
    }
  }, [isListening, selectedLang]);

  return (
    <>
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[60] w-80 max-w-[calc(100vw-2rem)] animate-fadeInScale">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-violet-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                <span className="font-extrabold text-sm">Aarogya Voice Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMuted(!muted)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setShowLangPicker(!showLangPicker)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <Globe className="w-4 h-4" />
                </button>
                <button onClick={() => setIsExpanded(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Picker */}
            {showLangPicker && (
              <div className="p-3 bg-violet-50 border-b border-violet-100 grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLang(lang.code); setShowLangPicker(false); }}
                    className={`px-2 py-2 rounded-lg text-xs font-bold transition-colors ${
                      selectedLang === lang.code ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-violet-100'
                    }`}
                  >
                    <div>{lang.label}</div>
                    <div className="text-[8px] opacity-70">{lang.name}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Transcript Display */}
            <div className="p-4 min-h-[120px]">
              {isListening ? (
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <div className="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-20" />
                    <div className="absolute inset-2 bg-violet-500 rounded-full animate-pulse" />
                    <Mic className="absolute inset-0 m-auto w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-violet-600">सुन रहा हूं...</p>
                  {transcript && (
                    <p className="text-xs text-slate-600 mt-2 p-2 bg-slate-50 rounded-lg">"{transcript}"</p>
                  )}
                </div>
              ) : response ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-violet-50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700">{response}</p>
                  </div>
                  {recognized && (
                    <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[11px] font-bold text-emerald-700">Command recognized!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <Mic className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">टैप करके बोलें</p>
                  <p className="text-[10px] mt-1">Try: "मेरा रिपोर्ट दिखाओ" or "दवाई याद दिलाओ"</p>
                </div>
              )}
            </div>

            {/* Quick commands */}
            {!isListening && !response && (
              <div className="px-4 pb-3">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Quick Commands:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['रिपोर्ट दिखाओ', 'दवाई याद दिलाओ', 'डॉक्टर', 'शुगर चेक', 'बुखार है'].map(cmd => (
                    <button
                      key={cmd}
                      onClick={() => { setTranscript(cmd); processCommand(cmd); }}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mic button */}
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={toggleListening}
                className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:scale-[1.02]'
                }`}
              >
                {isListening ? <><MicOff className="w-4 h-4" /> सुनना बंद करें</> : <><Mic className="w-4 h-4" /> बोलना शुरू करें</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mic Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed bottom-6 left-4 sm:left-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${
          isExpanded
            ? 'bg-slate-700 text-white'
            : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
        }`}
        aria-label="Voice Assistant"
        style={isListening ? { animation: 'pulseGlow 1s ease-in-out infinite' } : {}}
      >
        <div className="relative">
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          {isListening && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping" />
          )}
        </div>
        {!isExpanded && <span className="text-xs font-extrabold hidden sm:inline">VOICE</span>}
      </button>
    </>
  );
};

export default VoiceAssistant;
