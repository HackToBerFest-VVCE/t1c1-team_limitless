import React from 'react';
import { Verdict, RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  riskLevel: RiskLevel;
  riskScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  riskLevel,
  riskScore,
  size = 'md',
  showDetails = true,
}) => {
  const configs = {
    SAFE: {
      label: 'SAFE',
      sublabel: 'No clear malicious indicators found in analyzed data',
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-300',
      text: 'text-emerald-800',
      pillBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      glow: 'shadow-sm shadow-emerald-500/10',
    },
    SUSPICIOUS: {
      label: 'SUSPICIOUS',
      sublabel: 'Anomalies detected. Inconclusive evidence — proceed with extreme caution',
      bg: 'bg-amber-50/90',
      border: 'border-amber-300',
      text: 'text-amber-800',
      pillBg: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      glow: 'shadow-sm shadow-amber-500/10',
    },
    SCAM: {
      label: 'SCAM',
      sublabel: 'High confidence deceptive intent or known manipulation patterns detected',
      bg: 'bg-rose-50/90',
      border: 'border-rose-300',
      text: 'text-rose-800',
      pillBg: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: AlertOctagon,
      iconColor: 'text-rose-600',
      glow: 'shadow-sm shadow-rose-500/10',
    },
  };

  const config = configs[verdict];
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: 'px-3 py-1.5 gap-2 text-sm',
      icon: 'w-4 h-4',
      badge: 'text-xs font-bold px-2 py-0.5',
    },
    md: {
      container: 'p-4 gap-3 text-base',
      icon: 'w-6 h-6',
      badge: 'text-sm font-bold px-3 py-1',
    },
    lg: {
      container: 'p-6 gap-4 text-lg',
      icon: 'w-10 h-10',
      badge: 'text-lg font-black px-4 py-1.5',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`rounded-2xl border ${config.bg} ${config.border} ${config.glow} flex flex-col sm:flex-row sm:items-center justify-between transition-all ${currentSize.container}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl bg-white shadow-sm shrink-0 border ${config.border}`}>
          <Icon className={`${currentSize.icon} ${config.iconColor}`} />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`font-black tracking-wide ${config.text} text-xl sm:text-2xl`}>
              {config.label}
            </span>
            <span
              className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full border ${config.pillBg}`}
            >
              {riskLevel} RISK
            </span>
            {riskScore !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                Score: <strong className={config.text}>{riskScore}</strong>/100
              </span>
            )}
          </div>
          {showDetails && (
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              {config.sublabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
