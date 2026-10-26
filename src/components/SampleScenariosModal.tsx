import React from 'react';
import { SAMPLE_SCENARIOS, SampleScenario } from '../lib/sampleScenarios';
import { X, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

interface SampleScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: SampleScenario) => void;
}

export const SampleScenariosModal: React.FC<SampleScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-elevated max-w-2xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#172554]">
                Demonstration Sample Scenarios
              </h3>
              <p className="text-xs text-slate-500">
                Choose a realistic scenario to observe live heuristic detection & Scam Psychologist.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {SAMPLE_SCENARIOS.map((item) => {
            const isScam = item.expectedVerdict === 'SCAM';
            return (
              <div
                key={item.id}
                onClick={() => {
                  onSelectScenario(item);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-soft bg-slate-50/60 hover:bg-white cursor-pointer transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isScam
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.expectedVerdict}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#172554] group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.snippet}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Load & Test</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            These samples use fictional data designed for hackathon judges to verify accuracy and examine all 9 manipulation tactics.
          </span>
        </div>
      </div>
    </div>
  );
};
