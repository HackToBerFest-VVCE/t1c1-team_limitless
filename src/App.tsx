import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SplashWelcomePage } from './pages/SplashWelcomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { SafetyAssistantPage } from './pages/SafetyAssistantPage';
import { ScreenshotScannerPage } from './pages/ScreenshotScannerPage';
import { ScamPsychologistPage } from './pages/ScamPsychologistPage';
import { QrScannerPage } from './pages/QrScannerPage';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Page One: Splash & Welcome */}
            <Route path="/" element={<SplashWelcomePage />} />

            {/* Page Two: Authentication */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Page Three: Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Feature 1: Screenshot Scanner */}
            <Route
              path="/screenshot-scanner"
              element={
                <ProtectedRoute>
                  <ScreenshotScannerPage />
                </ProtectedRoute>
              }
            />

            {/* Feature 2: Safety Assistant */}
            <Route
              path="/safety-assistant"
              element={
                <ProtectedRoute>
                  <SafetyAssistantPage />
                </ProtectedRoute>
              }
            />

            {/* Feature 3: Scam Psychologist */}
            <Route
              path="/scam-psychologist"
              element={
                <ProtectedRoute>
                  <ScamPsychologistPage />
                </ProtectedRoute>
              }
            />

            {/* Feature 4: Real QR Scanner */}
            <Route
              path="/qr-scanner"
              element={
                <ProtectedRoute>
                  <QrScannerPage />
                </ProtectedRoute>
              }
            />

            {/* URL Checker convenience alias */}
            <Route
              path="/url-checker"
              element={
                <Navigate to="/safety-assistant" state={{ prefilledType: 'url' }} replace />
              }
            />

            {/* History */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            {/* Settings & PWA */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* Privacy */}
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* How It Works */}
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
