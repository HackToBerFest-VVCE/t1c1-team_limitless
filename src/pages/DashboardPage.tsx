import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { QuickSafetyTips } from '../components/QuickSafetyTips';
import { SampleScenariosModal } from '../components/SampleScenariosModal';
import { SampleScenario } from '../lib/sampleScenarios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getLocalHistory, ScanHistoryRecord } from '../lib/supabase';
import {
  ShieldAlert,
  Camera,
  Brain,
  QrCode,
  ArrowRight,
  Sparkles,
  Search,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoUser } = useAuth();
  const { t } = useLanguage();

  const [quickInput, setQuickInput] = useState('');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [history, setHistory] = useState<ScanHistoryRecord[]>([]);

  useEffect(() => {
    setHistory(getLocalHistory());
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    // Route to safety assistant with query pre-filled
    navigate('/safety-assistant', { state: { prefilledContent: quickInput } });
  };

  const handleSelectScenario = (scenario: SampleScenario) => {
    navigate('/safety-assistant', {
      state: {
        prefilledContent: scenario.fullContent,
        prefilledResult: scenario.analysis,
        prefilledType: scenario.type,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 flex-grow">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4F46F5] via-[#7C3AED] to-[#06B6D4] p-6 sm:p-10 text-white shadow-elevated">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isDemoUser ? 'Evaluating as Guest / Demo Mode' : `Welcome, ${user?.displayName || 'User'}`}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {t.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Prominent "Can I Trust This?" Quick Verification Form */}
            <form onSubmit={handleQuickSubmit} className="pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-white p-2 sm:p-2.5 rounded-2xl shadow-elevated max-w-2xl">
                <div className="relative flex-grow w-full flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder={t.quickCheckPlaceholder}
                    className="w-full pl-11 pr-4 py-2 text-xs sm:text-sm text-[#172554] placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#4F46F5] hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2"
                >
                  <span>{t.canITrustThisPrompt}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Demo Scenarios Quick Trigger Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <Sparkles className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#172554]">
                Evaluating ScamLens AI for a Hackathon?
              </div>
              <div className="text-[11px] text-slate-500">
                Explore pre-configured real-world scenarios (Banking Phishing, Delivery Smishing, Seed Phrase Drainer, Legitimate Control).
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-100/70 hover:bg-purple-200/80 text-purple-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Explore Demo Scenarios</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main 4 Feature Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-[#172554] tracking-tight">
              {t.featuresHeading}
            </h2>
            <span className="text-xs text-slate-400 font-medium">All features fully functional</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Screenshot Scanner */}
            <Link
              to="/screenshot-scanner"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated hover:border-cyan-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#172554] group-hover:text-cyan-600 transition-colors">
                  {t.cardScreenshotTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.cardScreenshotDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
                <span>Upload Screenshot</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Safety Assistant */}
            <Link
              to="/safety-assistant"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#172554] group-hover:text-indigo-600 transition-colors">
                  {t.cardSafetyTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.cardSafetyDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Verify Content</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Scam Psychologist (Signature) */}
            <Link
              to="/scam-psychologist"
              className="p-6 rounded-3xl bg-gradient-to-b from-white to-[#F1ECFF]/30 border-2 border-[#7C3AED]/40 shadow-soft hover:shadow-elevated hover:border-[#7C3AED] transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Signature
                </span>
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-[#7C3AED] mb-4 group-hover:scale-105 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#172554] group-hover:text-[#7C3AED] transition-colors">
                  {t.cardPsychologistTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.cardPsychologistDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-[#7C3AED]">
                <span>Explore Tactics</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: QR Scanner */}
            <Link
              to="/qr-scanner"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#172554] group-hover:text-emerald-600 transition-colors">
                  {t.cardQrTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {t.cardQrDesc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Start Scanner</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Verifications / Local History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-[#172554] tracking-tight">
              {t.recentScansHeading}
            </h2>
            {history.length > 0 && (
              <Link to="/history" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                View all ({history.length})
              </Link>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-[#172554]">{t.noHistoryYet}</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Any verification you perform on messages, screenshots, or QR codes will be stored locally on your device.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {history.slice(0, 3).map((item) => {
                const isScam = item.verdict === 'SCAM';
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.scan_type}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isScam
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-[#172554] font-medium line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Essential Scam Defense Tips */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-[#172554] tracking-tight">
              {t.quickTipsHeading}
            </h2>
          </div>
          <QuickSafetyTips />
        </div>
      </main>

      <Footer />

      {/* Demonstration Scenarios Modal */}
      <SampleScenariosModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSelectScenario={handleSelectScenario}
      />
    </div>
  );
};
