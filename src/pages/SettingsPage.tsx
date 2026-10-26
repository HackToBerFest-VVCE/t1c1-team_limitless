import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LanguageSelector } from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { clearLocalHistory, getLocalHistory } from '../lib/supabase';
import {
  Settings,
  Globe,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  HelpCircle,
  LogOut,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, isBackendConnected, signOut } = useAuth();
  const { t } = useLanguage();
  const [historyCount, setHistoryCount] = useState(0);
  const [clearedNotice, setClearedNotice] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  useEffect(() => {
    setHistoryCount(getLocalHistory().length);
    // Check if running in PWA standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setPwaInstalled(true);
    }
  }, []);

  const handleClearHistory = () => {
    clearLocalHistory();
    setHistoryCount(0);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-grow">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & System Status</span>
          </div>
          <h1 className="text-3xl font-black text-[#172554] tracking-tight">
            Settings & Application Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure language preferences, manage locally stored scan data, and review PWA installation.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1: Language */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#172554]">Interface Language</h3>
                  <p className="text-xs text-slate-500">
                    Supports 9 languages (English, Hindi, Kannada, Tamil, Telugu, Bengali, Marathi, Spanish, French).
                  </p>
                </div>
              </div>
              <LanguageSelector />
            </div>
          </div>

          {/* Section 2: Account & Backend Status */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#172554]">Authentication & Backend Status</h3>
                <p className="text-xs text-slate-500">
                  Current authentication state and Supabase connectivity.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">User Profile</span>
                <strong className="text-slate-800 text-sm">{user?.displayName || 'Guest User'}</strong>
                <div className="text-slate-500 text-[11px]">{user?.email || 'No email attached (Demo)'}</div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Supabase Backend</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isBackendConnected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <strong className="text-emerald-700">Connected & Verified</strong>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <strong className="text-amber-700">Demo Mode Active (Unconfigured)</strong>
                    </>
                  )}
                </div>
              </div>
            </div>

            {user && (
              <button
                type="button"
                onClick={() => signOut()}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.navLogout}</span>
              </button>
            )}
          </div>

          {/* Section 3: Local Storage & Privacy */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#172554]">Local History Storage</h3>
                  <p className="text-xs text-slate-500">
                    Currently storing {historyCount} scan records in your private browser localStorage.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={historyCount === 0}
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition-colors disabled:opacity-40"
              >
                Clear History
              </button>
            </div>

            {clearedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Local scan history cleared.</span>
              </div>
            )}
          </div>

          {/* Section 4: Progressive Web App (PWA) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#172554]">Progressive Web App (PWA)</h3>
                <p className="text-xs text-slate-500">
                  Install ScamLens AI on your desktop or mobile device for full-screen scam inspection.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">
                  {pwaInstalled ? 'Application running as installed PWA' : 'Web App Manifest & Service Worker Registered'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                To install on Chrome or Edge: Click the "Install" icon in your browser address bar. On Safari iOS: Tap "Share" and choose "Add to Home Screen".
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
