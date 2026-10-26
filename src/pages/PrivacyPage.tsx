import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Shield, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-grow">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Credential Storage Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#172554] tracking-tight">
            Privacy Policy & Responsible AI Commitments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Learn how ScamLens AI safeguards your data and preserves personal privacy during security evaluations.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                <EyeOff className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#172554]">
                1. No Storage of Confidential Information
              </h2>
            </div>
            <p>
              ScamLens AI does not collect, record, or retain your passwords, bank account numbers, PINs, OTPs, or government identity tokens. When you submit text or screenshots for verification, analysis occurs ephemerally.
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-slate-500">
              <li>Screenshots are processed in memory and never written to permanent disk storage without consent.</li>
              <li>Scan history is kept locally on your private device browser storage (localStorage) unless you explicitly connect Supabase.</li>
              <li>You have a one-click button in Settings to purge all local history at any time.</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#172554]">
                2. Server-Side Security & AI Boundaries
              </h2>
            </div>
            <p>
              When connecting to our backend Edge Function, requests are validated against strict payload constraints. The frontend never makes direct client calls using secret AI keys.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">SSRF Protections:</strong>
                ScamLens URL inspection does not blindly fetch or download foreign server payloads, mitigating Server-Side Request Forgery risks.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-800 font-bold mb-1">Untrusted Content Handling:</strong>
                User messages are framed as untrusted data inputs, preventing prompt injection attacks from overriding analysis directives.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#172554]">
                3. Responsible AI Limitations
              </h2>
            </div>
            <p>
              ScamLens AI employs heuristic pattern detection, psychological manipulation profiling, and URL structure checks. It is an educational and threat-awareness assistant, not a legal certifier or guarantee of safety.
            </p>
            <p className="font-semibold text-slate-700">
              When in doubt regarding banking, tax, or legal notifications, always reach out to the organization directly through verified telephone numbers listed on your physical cards or official statements.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
