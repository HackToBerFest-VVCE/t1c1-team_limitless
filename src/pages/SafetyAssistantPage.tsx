import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VerdictBadge } from '../components/VerdictBadge';
import { PsychologyBreakdown } from '../components/PsychologyBreakdown';
import { analyzeScamContent } from '../lib/aiAnalysisService';
import { saveLocalHistory } from '../lib/supabase';
import { saveScanToSupabase } from '../lib/historyService';
import { AnalysisMode, AnalysisResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  MessageSquare,
  Mail,
  Link2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  Brain,
  Info,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export const SafetyAssistantPage: React.FC = () => {
  const location = useLocation();
  const { t, language } = useLanguage();
  const { user, isDemoUser } = useAuth();

  const [mode, setMode] = useState<AnalysisMode>('message');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPsychologyDirectly, setShowPsychologyDirectly] = useState(false);

  // Check if routed with prefilled content or result from dashboard/scenario
  useEffect(() => {
    if (location.state?.prefilledContent) {
      setContent(location.state.prefilledContent);
    }
    if (location.state?.prefilledType) {
      setMode(location.state.prefilledType as AnalysisMode);
    }
    if (location.state?.prefilledResult) {
      setResult(location.state.prefilledResult);
    }
  }, [location.state]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) {
      setError('Please enter message text, email content, or a URL to verify.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await analyzeScamContent({
        mode,
        content: content.trim(),
        language,
      });

      setResult(res);

      // Always save to local storage (guest + authenticated fallback)
      saveLocalHistory({
        scan_type: mode.toUpperCase(),
        verdict: res.verdict,
        risk_level: res.riskLevel,
        summary: res.summary,
      });

      // Also save to Supabase cloud for authenticated (non-demo) users
      if (user && !isDemoUser) {
        saveScanToSupabase({
          user_id: user.id,
          scan_type: mode.toUpperCase(),
          verdict: res.verdict,
          risk_level: res.riskLevel,
          summary: res.summary,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Analysis could not be completed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setResult(null);
    setError(null);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summaryText = `[ScamLens AI Assessment]\nVerdict: ${result.verdict} (${result.riskLevel} Risk)\nSummary: ${result.summary}\nEvidence: ${result.evidence.join('; ')}\nSafer Action: ${result.recommendedActions.join('; ')}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const placeholders = {
    message:
      'Paste suspicious SMS or chat message here...\nExample: "URGENT: Your bank account is locked. Update KYC at http://sbi-kyc-verify24.com before today midnight."',
    email:
      'Paste the email subject and body content here...\nExample: "Subject: Urgent: Security breach detected in your corporate account. Reset password immediately at https://login-verify-it.com"',
    url:
      'Enter or paste a web address (URL) here...\nExample: "https://paypa1-account-security-update.click/login"',
    screenshot: '',
    qr: '',
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-grow">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
            <span>One-Click Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#172554] tracking-tight">
            {t.assistantTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            {t.assistantSubtitle}
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-5 sm:p-7 space-y-5">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('message');
                setResult(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                mode === 'message'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.tabMessage}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('email');
                setResult(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                mode === 'email'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{t.tabEmail}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('url');
                setResult(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                mode === 'url'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>{t.tabUrl}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              {mode === 'url' ? (
                <div className="relative">
                  <Link2 className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="https://example-suspicious-bank-login.xyz"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                  />
                </div>
              ) : (
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={placeholders[mode]}
                  className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed resize-none"
                />
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.clearBtn}</span>
              </button>

              <button
                type="submit"
                disabled={isAnalyzing || !content.trim()}
                className="px-6 py-3 rounded-xl bg-[#4F46F5] hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Heuristics...</span>
                  </>
                ) : (
                  <>
                    <span>{t.analyzeBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Container */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Demo Notice Banner if demo */}
            {result.isDemo && (
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <span className="font-bold">{result.disclaimer}</span>
                </div>
                <span className="text-[11px] text-purple-700 hidden sm:inline">
                  Client-side rule evaluation
                </span>
              </div>
            )}

            {/* Verdict Badge */}
            <VerdictBadge
              verdict={result.verdict}
              riskLevel={result.riskLevel}
              riskScore={result.riskScore}
              size="lg"
            />

            {/* Summary & Actions Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Executive Assessment
                </h3>
                <p className="text-sm sm:text-base text-[#172554] font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Action buttons row */}
              <div className="flex items-center gap-2.5 flex-wrap pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t.copiedNotice : t.copySummaryBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPsychologyDirectly(!showPsychologyDirectly)}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7C3AED] text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Brain className="w-4 h-4" />
                  <span>
                    {showPsychologyDirectly ? 'Hide Psychologist Details' : t.viewInPsychologist}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors ml-auto"
                >
                  {t.analyzeAnotherBtn}
                </button>
              </div>

              {/* Evidence & Clues List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-500" />
                  {t.evidenceHeading}
                </h4>
                <ul className="space-y-2">
                  {result.evidence.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Next Steps */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {t.saferActionsHeading}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-emerald-950 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Checks Performed */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t.checksPerformedHeading}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.checksPerformed.map((chk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600"
                    >
                      ✓ {chk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Scam Psychologist Section */}
            {(showPsychologyDirectly || result.manipulationTactics.length > 0) && (
              <div className="pt-4">
                <PsychologyBreakdown tactics={result.manipulationTactics} />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
