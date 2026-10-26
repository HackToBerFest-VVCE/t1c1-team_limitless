import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PsychologyBreakdown } from '../components/PsychologyBreakdown';
import { analyzePsychologicalTactics } from '../lib/psychologistEngine';
import { PsychologicalTactic, TacticCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Brain,
  Sparkles,
  Flame,
  Clock,
  ShieldAlert,
  Briefcase,
  Gift,
  EyeOff,
  HeartCrack,
  Wallet,
  Key,
  BookOpen,
} from 'lucide-react';

export const ScamPsychologistPage: React.FC = () => {
  const { t } = useLanguage();

  const [customText, setCustomText] = useState(
    'URGENT: Your bank account will be closed within 24 hours. Verify your login credentials and card details immediately to prevent legal penalties.'
  );
  const [analyzedTactics, setAnalyzedTactics] = useState<PsychologicalTactic[]>(() =>
    analyzePsychologicalTactics(
      'URGENT: Your bank account will be closed within 24 hours. Verify your login credentials and card details immediately to prevent legal penalties.'
    )
  );

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const tactics = analyzePsychologicalTactics(customText);
    setAnalyzedTactics(tactics);
  };

  const tacticGuide: {
    category: TacticCategory;
    name: string;
    icon: any;
    color: string;
    bg: string;
    border: string;
    summary: string;
    defense: string;
  }[] = [
    {
      category: 'FEAR',
      name: 'Fear & Threats',
      icon: Flame,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      summary: 'Triggers the fight-or-flight panic response, paralyzing logical scrutiny.',
      defense: 'Recognize panic as an artificial signal. Legitimate banks do not threaten arrest via SMS.',
    },
    {
      category: 'URGENCY',
      name: 'Artificial Urgency',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      summary: 'Imposes short countdowns ("within 24 hours") to starve your brain of reflection time.',
      defense: 'Adopt the 24-Hour Golden Rule: Delay any urgent financial decision by at least 15 minutes.',
    },
    {
      category: 'TRUST_IMPERSONATION',
      name: 'Trust Impersonation',
      icon: ShieldAlert,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      summary: 'Hijacks brand logos and familiar courier names to bypass natural skepticism.',
      defense: 'Verify the domain name. Never trust sender names displayed in SMS headers.',
    },
    {
      category: 'AUTHORITY_PRESSURE',
      name: 'Authority Pressure',
      icon: Briefcase,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      summary: 'Leverages social deference to executive rank, police, or tax authorities.',
      defense: 'Question authority politely through established secondary company extensions.',
    },
    {
      category: 'REWARD_BAIT',
      name: 'Reward Bait & Greed',
      icon: Gift,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      summary: 'Stimulates dopamine with unearned windfalls, crypto prizes, or lottery grants.',
      defense: 'Golden rule: You cannot win a contest or lottery you never entered.',
    },
    {
      category: 'SECRECY',
      name: 'Secrecy & Isolation',
      icon: EyeOff,
      color: 'text-slate-700',
      bg: 'bg-slate-100',
      border: 'border-slate-300',
      summary: 'Demands that you hide the interaction from family, peers, or bank tellers.',
      defense: 'Any request for secrecy in finance is an immediate confirmation of fraud.',
    },
    {
      category: 'EMOTIONAL_MANIPULATION',
      name: 'Emotional Manipulation',
      icon: HeartCrack,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      summary: 'Exploits sympathy, family emergencies, or romance to trigger guilt.',
      defense: 'Always confirm the emergency by calling the loved one directly on their known phone.',
    },
    {
      category: 'FINANCIAL_PRESSURE',
      name: 'Financial Coercion',
      icon: Wallet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      summary: 'Directs victim toward non-refundable gift cards, crypto, or urgent wire transfers.',
      defense: 'Real institutions never accept payments via Apple gift cards or crypto.',
    },
    {
      category: 'CREDENTIAL_HARVESTING',
      name: 'Credential Harvesting',
      icon: Key,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      summary: 'Disguises password and OTP requests as routine identity confirmation steps.',
      defense: 'Never type OTPs, passwords, or seed phrases into links received via chat.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 flex-grow">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#F1ECFF] via-[#EAF2FF] to-[#F8FAFF] border border-purple-200/80 p-6 sm:p-10 shadow-elevated">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-bold border border-purple-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Differentiator</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#172554] tracking-tight">
              {t.psychologistTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {t.signatureDifferentiator}
            </p>
          </div>
        </div>

        {/* Live Psychological Profiler Interactive Sandbox */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#172554] tracking-tight">
                Live Psychological Profiler
              </h2>
              <p className="text-xs text-slate-500">
                Type or paste any suspicious text to see the psychological chain extracted in real time.
              </p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste a message to analyze its psychological tactics..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all leading-relaxed resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                <span>Profile Psychological Tactics</span>
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="pt-4 border-t border-slate-100">
            <PsychologyBreakdown tactics={analyzedTactics} />
          </div>
        </div>

        {/* Complete Catalog of 9 Psychological Tactics */}
        <div className="space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Psychological Reference Matrix</span>
            </div>
            <h2 className="text-2xl font-black text-[#172554] tracking-tight">
              The 9 Core Scam Manipulation Tactics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Every digital scam relies on one or more of these 9 emotional and cognitive exploitation mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tacticGuide.map((tactic) => {
              const Icon = tactic.icon;
              return (
                <div
                  key={tactic.category}
                  className={`p-5 rounded-2xl border ${tactic.border} bg-white shadow-xs hover:shadow-soft transition-all space-y-3 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-xl ${tactic.bg} ${tactic.color} border ${tactic.border}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-[#172554]">{tactic.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tactic.summary}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-900 leading-normal">
                    <strong className="block text-emerald-800 font-bold mb-0.5">
                      Defense Shield:
                    </strong>
                    {tactic.defense}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
