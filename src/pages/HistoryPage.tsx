import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getLocalHistory, clearLocalHistory, ScanHistoryRecord } from '../lib/supabase';
import {
  Clock,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ScanHistoryRecord[]>([]);

  useEffect(() => {
    setHistory(getLocalHistory());
  }, []);

  const handleClear = () => {
    clearLocalHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-grow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-black text-[#172554] tracking-tight">
              Local Verification History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Records saved privately in your device browser storage.
            </p>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          )}
        </div>

        {/* List */}
        {history.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#172554]">No Previous Scans Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Whenever you scan a message, URL, screenshot, or QR code, your evaluation summary will be preserved here locally.
            </p>
            <div className="pt-2">
              <Link
                to="/safety-assistant"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                <span>Verify Your First Content</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record) => {
              const isScam = record.verdict === 'SCAM';
              const isSuspicious = record.verdict === 'SUSPICIOUS';
              return (
                <div
                  key={record.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-soft transition-all space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {record.scan_type}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isScam
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : isSuspicious
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {record.verdict}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({record.risk_level} Risk)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(record.created_at).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#172554] font-medium leading-relaxed">
                    {record.summary}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
