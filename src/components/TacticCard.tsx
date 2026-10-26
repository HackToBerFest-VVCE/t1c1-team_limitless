import React, { useState } from 'react';
import { PsychologicalTactic, TacticCategory } from '../types';
import {
  Clock,
  ShieldAlert,
  Gift,
  EyeOff,
  HeartCrack,
  Key,
  Flame,
  Briefcase,
  Wallet,
  ChevronDown,
  ChevronUp,
  Brain,
  Target,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface TacticCardProps {
  tactic: PsychologicalTactic;
  initiallyExpanded?: boolean;
}

export const TacticCard: React.FC<TacticCardProps> = ({
  tactic,
  initiallyExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initiallyExpanded);

  const getTacticIcon = (cat: TacticCategory) => {
    switch (cat) {
      case 'FEAR':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'URGENCY':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'TRUST_IMPERSONATION':
        return <ShieldAlert className="w-5 h-5 text-indigo-500" />;
      case 'AUTHORITY_PRESSURE':
        return <Briefcase className="w-5 h-5 text-purple-500" />;
      case 'REWARD_BAIT':
        return <Gift className="w-5 h-5 text-cyan-500" />;
      case 'SECRECY':
        return <EyeOff className="w-5 h-5 text-slate-600" />;
      case 'EMOTIONAL_MANIPULATION':
        return <HeartCrack className="w-5 h-5 text-pink-500" />;
      case 'FINANCIAL_PRESSURE':
        return <Wallet className="w-5 h-5 text-emerald-500" />;
      case 'CREDENTIAL_HARVESTING':
        return <Key className="w-5 h-5 text-red-500" />;
      default:
        return <Brain className="w-5 h-5 text-indigo-500" />;
    }
  };

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'High':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-xs">
            {getTacticIcon(tactic.tactic)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[#172554] text-base sm:text-lg">
                {tactic.name}
              </h4>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStrengthBadge(
                  tactic.strength
                )}`}
              >
                {tactic.strength} Intensity
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {tactic.strengthReason}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label={isExpanded ? 'Collapse tactic details' : 'Expand tactic details'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-sm bg-gradient-to-b from-slate-50/40 to-transparent">
          {/* Quote Evidence */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-indigo-100 text-[#172554]">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-indigo-700 mb-1">
              <Info className="w-3.5 h-3.5" />
              Observed Text Evidence
            </div>
            <div className="italic text-slate-700 text-xs sm:text-sm pl-2 border-l-2 border-indigo-400">
              {tactic.evidence}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Why this can influence people */}
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-purple-800 mb-1">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                Cognitive Mechanism
              </div>
              <p className="text-xs text-purple-900/90 leading-relaxed">
                {tactic.psychologicalMechanism}
              </p>
            </div>

            {/* What sender wants you to do */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-800 mb-1">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                Target Behavior
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                {tactic.desiredRecipientAction}
              </p>
            </div>
          </div>

          {/* Safer action */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Recommended Shield & Safer Action
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 font-medium leading-relaxed">
              {tactic.saferAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
