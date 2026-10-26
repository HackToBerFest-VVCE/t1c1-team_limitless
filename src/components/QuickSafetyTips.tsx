import React from 'react';
import { ShieldCheck, Clock, Key, CreditCard } from 'lucide-react';

export const QuickSafetyTips: React.FC = () => {
  const tips = [
    {
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      title: 'The Pause & Breathe Rule',
      desc: 'Artificial urgency ("within 24 hours" or "act now") is engineered to block critical thinking. Always pause 10 minutes before responding.',
    },
    {
      icon: Key,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      title: 'The Zero-OTP Policy',
      desc: 'Your bank, PayPal, or Google will NEVER ask you for your one-time password (OTP) or PIN. Anyone asking is attempting an account takeover.',
    },
    {
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      title: 'Independent Verification',
      desc: 'Never click the link inside an unverified SMS or email. Open your browser and type the known official domain manually.',
    },
    {
      icon: CreditCard,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      title: 'The Gift Card / Crypto Red Line',
      desc: 'No legitimate police, courier, tax authority, or employer will ever request payment via Apple gift cards, Google Play cards, or Bitcoin.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tips.map((tip, idx) => {
        const Icon = tip.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-soft transition-all"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border mb-3 ${tip.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#172554] mb-1.5">{tip.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
          </div>
        );
      })}
    </div>
  );
};
