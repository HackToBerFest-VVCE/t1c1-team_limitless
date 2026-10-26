import React from 'react';
import { PsychologicalTactic } from '../types';
import { TacticCard } from './TacticCard';
import { Brain, Sparkles } from 'lucide-react';

interface PsychologyBreakdownProps {
  tactics: PsychologicalTactic[];
  title?: string;
  subtitle?: string;
}

export const PsychologyBreakdown: React.FC<PsychologyBreakdownProps> = ({
  tactics,
  title = 'Scam Psychologist — Psychological Breakdown',
  subtitle = 'Analyzing how cyber scammers attempt to hack human psychology and induce impulsive actions.',
}) => {
  if (!tactics || tactics.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
          <Brain className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#172554]">No Manipulative Tactics Detected</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The analyzed text does not exhibit common psychological coercion triggers (such as artificial urgency, fear induction, or unsolicited reward bait).
        </p>
      </div>
    );
  }

  // Build high-level summary line
  const tacticNames = tactics.map((t) => t.name.split('&')[0].trim());
  const primaryTactic = tactics[0];

  return (
    <div className="space-y-6">
      {/* Header section with badge */}
      <div className="bg-gradient-to-r from-[#F1ECFF] via-[#EAF2FF] to-[#F8FAFF] p-6 sm:p-7 rounded-3xl border border-indigo-100/80 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          Signature AI Feature
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>

        {/* Dynamic Executive Psychologist Summary Box */}
        <div className="mt-5 p-4 rounded-2xl bg-white/90 border border-indigo-100 shadow-xs space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <span className="font-bold text-indigo-900 shrink-0">Manipulation detected:</span>
            <span className="font-semibold text-rose-600">
              {tacticNames.join(' + ')}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-indigo-900 shrink-0">Why this can work:</span>
            <span className="text-slate-700">
              {primaryTactic.psychologicalMechanism}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-indigo-900 shrink-0">How to protect yourself:</span>
            <span className="text-emerald-700 font-medium">
              {primaryTactic.saferAction}
            </span>
          </div>
        </div>

        {/* Visual sequence flow */}
        <div className="mt-5 pt-4 border-t border-indigo-100/60">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Cognitive Manipulation Chain
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="font-extrabold text-indigo-700 block">1. Message Clue</span>
              <span className="text-[11px] text-slate-500">Deceptive wording</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F1ECFF] border border-purple-200">
              <span className="font-extrabold text-[#7C3AED] block">2. Mental Trigger</span>
              <span className="text-[11px] text-slate-600">Urgency or Fear</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FFEDD5] border border-orange-200">
              <span className="font-extrabold text-orange-800 block">3. Vulnerability</span>
              <span className="text-[11px] text-slate-600">Short-circuited reasoning</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300">
              <span className="font-extrabold text-emerald-800 block">4. Safer Shield</span>
              <span className="text-[11px] text-emerald-700 font-medium">Pause & Verify</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Tactic Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Detected Manipulation Modules ({tactics.length})
          </h4>
          <span className="text-xs text-slate-400">Click to expand or collapse</span>
        </div>

        {tactics.map((tactic, idx) => (
          <TacticCard key={`${tactic.tactic}-${idx}`} tactic={tactic} initiallyExpanded={idx === 0} />
        ))}
      </div>
    </div>
  );
};
