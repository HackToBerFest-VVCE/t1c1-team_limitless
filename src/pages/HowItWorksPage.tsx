import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  HelpCircle,
  Brain,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Submit Content',
      desc: 'Paste a suspicious SMS message, upload a WhatsApp screenshot, inspect a URL, or scan a physical QR code.',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      num: '02',
      title: 'Syntactic & Heuristic Checks',
      desc: 'Our engine inspects URL lookalike patterns, IP hostnames, typosquatting variants, and credential harvesting keywords.',
      icon: ShieldCheck,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    },
    {
      num: '03',
      title: 'Scam Psychologist Profiling',
      desc: 'The system maps extracted language against 9 cognitive coercion tactics (Fear, Urgency, Reward Bait, Impersonation, etc.).',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      num: '04',
      title: 'Verdict & Defense Shield',
      desc: 'You receive a plain-language verdict (SAFE, SUSPICIOUS, or SCAM) with evidence and practical next steps to protect yourself.',
      icon: Sparkles,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 flex-grow">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Architecture & Principles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#172554] tracking-tight">
            How ScamLens AI Works
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Combining multimodal analysis, URL intelligence, and cognitive psychology to expose modern digital manipulation.
          </p>
        </div>

        {/* 4 Steps Journey */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl border ${st.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-300">{st.num}</span>
                </div>
                <h3 className="text-base font-bold text-[#172554]">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* What sets ScamLens apart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#F1ECFF] to-[#EAF2FF] border border-indigo-100 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Brain className="w-4 h-4 text-purple-600" />
            <span>Why Scam Psychologist is the Differentiator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#172554]">
            Explaining the "Why", Not Just the "What"
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Conventional security software outputs binary flags like "Spam" or "Clean". However, human beings fall for scams because of emotional manipulation — panic, fear of authority, excitement over prizes, or sympathy for stranded relatives.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ScamLens AI breaks down the cognitive leverage used by the attacker, transforming every suspicious message into an educational learning moment that strengthens digital immunity.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
