import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo size="sm" />

          <div className="flex items-center gap-6 flex-wrap justify-center text-xs font-semibold text-slate-600">
            <Link to="/how-it-works" className="hover:text-indigo-600 transition-colors">
              How ScamLens Works
            </Link>
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/scam-psychologist" className="hover:text-purple-600 transition-colors">
              Scam Psychologist
            </Link>
            <Link to="/settings" className="hover:text-indigo-600 transition-colors">
              Settings & PWA
            </Link>
          </div>
        </div>

        {/* Responsible AI and Safety Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 leading-relaxed text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            Responsible AI & Privacy Protection
          </div>
          <p>
            ScamLens AI is an educational cyber-safety tool built to assist users in detecting cognitive manipulation and phishing heuristics. It does not provide absolute guarantees of safety or verify sender telecommunications identity. We never store confidential credentials, passwords, or banking OTPs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
          <div>
            &copy; 2026 ScamLens AI. Think Before You Trust. Hackathon Edition.
          </div>
          <div className="flex items-center gap-1">
            Built with React, TypeScript, Tailwind & Responsible AI
          </div>
        </div>
      </div>
    </footer>
  );
};
