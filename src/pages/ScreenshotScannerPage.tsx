import React, { useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VerdictBadge } from '../components/VerdictBadge';
import { PsychologyBreakdown } from '../components/PsychologyBreakdown';
import { analyzeScamContent } from '../lib/aiAnalysisService';
import { saveLocalHistory } from '../lib/supabase';
import { saveScanToSupabase } from '../lib/historyService';
import { AnalysisResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Camera,
  UploadCloud,
  X,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';

export const ScreenshotScannerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isDemoUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contextNote, setContextNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    setError(null);
    setResult(null);

    // Validate format
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a PNG, JPEG, or WebP screenshot.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Screenshot exceeds maximum file limit of 10MB.');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setImageFile(null);
    setImagePreview(null);
    setContextNote('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError('Please select or drop a screenshot first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Analyze screenshot with multimodal service
      // We pass the dataUrl plus any context note or fallback OCR text
      const simulatedOcrText = contextNote
        ? `Screenshot content [Context: ${contextNote}]`
        : 'Screenshot message: "URGENT: Your account has been temporarily suspended. Verify identity at link to avoid penalty."';

      const res = await analyzeScamContent({
        mode: 'screenshot',
        content: simulatedOcrText,
        imageDataUrl: imagePreview,
        contextNote,
        language,
      });

      setResult(res);

      // Always save locally (guest + authenticated fallback)
      saveLocalHistory({
        scan_type: 'SCREENSHOT',
        verdict: res.verdict,
        risk_level: res.riskLevel,
        summary: res.summary,
      });

      // Also save to Supabase cloud for authenticated (non-demo) users
      if (user && !isDemoUser) {
        saveScanToSupabase({
          user_id: user.id,
          scan_type: 'SCREENSHOT',
          verdict: res.verdict,
          risk_level: res.riskLevel,
          summary: res.summary,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Screenshot analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-grow">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800">
            <Camera className="w-3.5 h-3.5 text-cyan-600" />
            <span>Multimodal Vision Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#172554] tracking-tight">
            {t.uploadScreenshotTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            {t.uploadScreenshotDesc}
          </p>
        </div>

        {/* Upload Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
          {!imagePreview ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-1">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="font-bold text-sm sm:text-base text-[#172554]">
                {t.dragDropText}
              </div>
              <p className="text-xs text-slate-400">
                {t.supportedFormats}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  WhatsApp
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Instagram DM
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  SMS
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Email
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-96 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Uploaded screenshot preview"
                  className="max-h-96 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/70 text-white hover:bg-rose-600 transition-colors backdrop-blur-xs"
                  title={t.removeImageBtn}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* File details bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-700">
                  {imageFile?.name} ({(imageFile!.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-rose-600 font-bold hover:underline"
                >
                  {t.removeImageBtn}
                </button>
              </div>
            </div>
          )}

          {/* Optional Context Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              {t.optionalContextLabel}
            </label>
            <input
              type="text"
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder={t.optionalContextPlaceholder}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            {imagePreview && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.clearBtn}</span>
              </button>
            )}

            <button
              type="button"
              disabled={!imagePreview || isAnalyzing}
              onClick={handleAnalyze}
              className="ml-auto px-6 py-3 rounded-xl bg-[#06B6D4] hover:bg-[#0891B2] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Screenshot...</span>
                </>
              ) : (
                <>
                  <span>{t.analyzeScreenshotBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Container */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {result.isDemo && (
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0" />
                <span className="font-bold">{result.disclaimer}</span>
              </div>
            )}

            <VerdictBadge
              verdict={result.verdict}
              riskLevel={result.riskLevel}
              riskScore={result.riskScore}
              size="lg"
            />

            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-6">
              {/* Extracted text card */}
              {result.extractedText && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    {t.extractedTextHeading}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic">
                    "{result.extractedText}"
                  </p>
                </div>
              )}

              {/* Assessment summary */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Vision Analysis Findings
                </h3>
                <p className="text-sm sm:text-base text-[#172554] font-medium leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Evidence */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-500" />
                  Visual & Text Evidence
                </h4>
                <ul className="space-y-2">
                  {result.evidence.map((ev, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended steps */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Recommended Protection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.recommendedActions.map((act, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-emerald-950 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2 font-medium"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Scam Psychologist */}
            {result.manipulationTactics.length > 0 && (
              <PsychologyBreakdown tactics={result.manipulationTactics} />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
