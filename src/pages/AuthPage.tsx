import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { LanguageSelector } from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithDemo, isBackendConnected } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validation
    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!displayName.trim()) {
        setErrorMessage('Please provide a display name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    if (mode === 'signin') {
      const res = await signInWithEmail(email, password);
      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        navigate('/dashboard');
      }
    } else {
      const res = await signUpWithEmail(email, password, displayName);
      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    }
  };

  const handleDemoSignIn = () => {
    signInWithDemo('Demo Guest');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFF] via-[#F1ECFF]/20 to-[#EAF2FF]/30 flex flex-col justify-between selection:bg-[#4F46F5]/10">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Welcome</span>
        </Link>
        <LanguageSelector />
      </header>

      {/* Auth Card Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8 my-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-elevated p-6 sm:p-8 space-y-6">
          {/* Logo Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <BrandLogo size="md" showText={false} />
            </div>
            <h2 className="text-2xl font-black text-[#172554] tracking-tight">
              {mode === 'signin' ? t.signInTitle : t.signUpTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === 'signin'
                ? 'Sign in to access your scam scans and security logs'
                : 'Create an account to track your verification history'}
            </p>
          </div>

          {/* Honest Backend Status Pill */}
          {!isBackendConnected ? (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Supabase Auth Not Connected</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-normal">
                No active Supabase keys detected in environment. You can click <strong>"Explore in Demo Mode"</strong> below to evaluate all features without fake registration.
              </p>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Connected to live Supabase Auth</span>
            </div>
          )}

          {/* Error / Success alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.displayNameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="E.g., Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {t.passwordLabel}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#4F46F5] hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? t.signInBtn : t.signUpBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or Instant Access
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>{t.continueAsGuest}</span>
          </button>

          {/* Toggle mode link */}
          <div className="text-center text-xs text-slate-600 pt-1">
            {mode === 'signin' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800"
              >
                {t.dontHaveAccount}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className="font-bold text-indigo-600 hover:text-indigo-800"
              >
                {t.alreadyHaveAccount}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-elevated">
            <h3 className="font-black text-lg text-[#172554]">Password Recovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When Supabase Auth is connected to your SMTP provider, a password recovery email will be delivered. Alternatively, you can use <strong>Demo Mode</strong> to evaluate all application features instantly.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer minimal */}
      <footer className="max-w-6xl w-full mx-auto px-4 py-4 text-center text-xs text-slate-400">
        &copy; 2026 ScamLens AI. Privacy First.
      </footer>
    </div>
  );
};
