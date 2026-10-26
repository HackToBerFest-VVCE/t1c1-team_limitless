import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  Camera,
  Brain,
  QrCode,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isDemoUser, signOut } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { to: '/safety-assistant', label: t.navSafetyAssistant, icon: ShieldAlert },
    { to: '/screenshot-scanner', label: t.navScreenshot, icon: Camera },
    { to: '/scam-psychologist', label: t.navPsychologist, icon: Brain, isSignature: true },
    { to: '/qr-scanner', label: t.navQrScanner, icon: QrCode },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#EAF2FF] text-[#4F46F5] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-[#4F46F5]'
                        : link.isSignature
                        ? 'text-[#7C3AED]'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{link.label}</span>
                  {link.isSignature && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isDemoUser && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {t.navDemoBadge}
              </span>
            )}

            <LanguageSelector />

            <Link
              to="/settings"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={t.navSettings}
            >
              <Settings className="w-4 h-4" />
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-[#172554] truncate max-w-[120px]">
                    {user?.displayName || 'User'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user?.isDemoUser ? 'Guest Demo' : 'Verified'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title={t.navLogout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#4F46F5] text-white hover:bg-[#4338CA] transition-colors shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                {t.navLogin}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector compact />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-[#EAF2FF] text-[#4F46F5]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F46F5]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.isSignature && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                    Signature
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              <Settings className="w-4 h-4" />
              {t.navSettings}
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                {t.navLogout}
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-indigo-600 px-3 py-2"
              >
                {t.navLogin}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
