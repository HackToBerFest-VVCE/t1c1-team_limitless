import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { LanguageSelector } from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Brain,
  Camera,
  QrCode,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';

export const SplashWelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithDemo, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleExploreDemo = () => {
    signInWithDemo('Hackathon Evaluator');
    navigate('/dashboard');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFF] via-[#F1ECFF]/30 to-[#EAF2FF]/40 flex flex-col justify-between selection:bg-[#4F46F5]/10">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <BrandLogo size="md" />
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <button
            type="button"
            onClick={handleExploreDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            {t.exploreDemo}
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center space-y-8 my-auto">
        {/* Animated Brand Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-soft animate-in fade-in slide-in-from-bottom-3 duration-500">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-xs font-bold text-slate-700 tracking-wide">
            Next-Gen AI Scam Defense & Psychological Profiling
          </span>
        </div>

        {/* Big Central Logo with Glow */}
        <div className="flex justify-center my-4 animate-in zoom-in-95 duration-700">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#4F46F5]/20 via-[#7C3AED]/20 to-[#06B6D4]/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-80" />
            <BrandLogo size="xl" showText={false} className="relative z-10" />
          </div>
        </div>

        {/* Tagline & Subtitle */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-[#172554] tracking-tight leading-tight">
            {t.tagline}
          </h1>
          <p className="text-lg sm:text-xl text-[#64748B] font-medium leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46F5] via-[#7C3AED] to-[#4F46F5] text-white font-bold text-sm sm:text-base shadow-elevated hover:opacity-95 transition-all flex items-center justify-center gap-2.5 active:scale-98"
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExploreDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white border border-slate-200 text-[#172554] font-bold text-sm sm:text-base hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>{t.exploreDemo}</span>
          </button>
        </div>

        {/* Privacy Reassurance Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 text-slate-500 text-xs">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t.privacyReassurance}</span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-8 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors">
            <ShieldCheck className="w-5 h-5 text-indigo-600 mb-2" />
            <div className="font-bold text-xs text-[#172554]">One-Click Safety</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Instant verdict on SMS, emails & links</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-purple-200/80 shadow-xs hover:border-purple-300 transition-colors">
            <Brain className="w-5 h-5 text-[#7C3AED] mb-2" />
            <div className="font-bold text-xs text-[#172554]">Scam Psychologist</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Unmasks 9 cognitive manipulation tactics</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-cyan-200/80 shadow-xs hover:border-cyan-300 transition-colors">
            <Camera className="w-5 h-5 text-cyan-600 mb-2" />
            <div className="font-bold text-xs text-[#172554]">Screenshot Scanner</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Multimodal analysis for WhatsApp & DMs</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <QrCode className="w-5 h-5 text-emerald-600 mb-2" />
            <div className="font-bold text-xs text-[#172554]">Real QR Inspector</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Live camera feed & URL lookalike checks</div>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="max-w-7xl w-full mx-auto px-4 py-4 text-center text-xs text-slate-400">
        &copy; 2026 ScamLens AI. Think Before You Trust.
      </footer>
    </div>
  );
};
