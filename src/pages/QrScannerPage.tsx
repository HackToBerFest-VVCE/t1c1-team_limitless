import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { inspectUrl } from '../lib/urlAnalyzer';
import { UrlInspectionResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  QrCode,
  Camera,
  Upload,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Wifi,
  User,
  Globe,
  FileText,
} from 'lucide-react';

export const QrScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [decodedType, setDecodedType] = useState<'url' | 'wifi' | 'vcard' | 'text'>('text');
  const [urlInspection, setUrlInspection] = useState<UrlInspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Payload classifier
  const classifyPayload = (payload: string) => {
    const trimmed = payload.trim();
    if (/^https?:\/\//i.test(trimmed) || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i.test(trimmed)) {
      setDecodedType('url');
      setUrlInspection(inspectUrl(trimmed));
    } else if (trimmed.startsWith('WIFI:')) {
      setDecodedType('wifi');
      setUrlInspection(null);
    } else if (trimmed.startsWith('BEGIN:VCARD')) {
      setDecodedType('vcard');
      setUrlInspection(null);
    } else {
      setDecodedType('text');
      setUrlInspection(null);
    }
  };

  // Start Camera
  const startCamera = async (cameraId?: string) => {
    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }

      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);

      const targetCameraId = cameraId || (devices.length > 0 ? devices[0].id : { facingMode: 'environment' });

      await scannerRef.current.start(
        targetCameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (qrCodeMessage) => {
          // Success callback
          setDecodedText(qrCodeMessage);
          classifyPayload(qrCodeMessage);
          stopCamera();
        },
        () => {
          // Frame error (normal frame scanning noise, ignore)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setError(
        'Camera permission was denied or no camera device was found. You can upload a QR image or paste the content below.'
      );
      setIsScanning(false);
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  // Cleanup on page leave
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.warn);
      }
    };
  }, [isScanning]);

  // Image Upload Decoding
  const handleImageUpload = async (file: File) => {
    setError(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }
      const message = await scannerRef.current.scanFile(file, true);
      setDecodedText(message);
      classifyPayload(message);
    } catch (err) {
      setError('Could not locate or decode a valid QR code in the uploaded image. Please try a clearer picture.');
    }
  };

  const handleCopy = () => {
    if (decodedText) {
      navigator.clipboard.writeText(decodedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendToSafetyAssistant = () => {
    if (!decodedText) return;
    navigate('/safety-assistant', {
      state: {
        prefilledContent: decodedText,
        prefilledType: decodedType === 'url' ? 'url' : 'message',
      },
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setDecodedText(manualInput.trim());
    classifyPayload(manualInput.trim());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col selection:bg-[#4F46F5]/10">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 flex-grow">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hardware Camera & Image Inspection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#172554] tracking-tight">
            {t.qrTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            {t.qrSubtitle}
          </p>
        </div>

        {/* Scanner Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isScanning ? (
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.startCameraBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>{t.stopCameraBtn}</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>{t.uploadQrImageBtn}</span>
              </button>
            </div>

            {/* Camera switch if multiple */}
            {cameras.length > 1 && isScanning && (
              <select
                value={selectedCameraId}
                onChange={(e) => {
                  setSelectedCameraId(e.target.value);
                  stopCamera().then(() => startCamera(e.target.value));
                }}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label || `Camera ${c.id.slice(0, 5)}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Camera Viewport Target */}
          <div
            id="qr-reader"
            className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 min-h-[220px] flex items-center justify-center text-slate-400 text-xs"
          >
            {!isScanning && !decodedText && (
              <div className="p-8 text-center space-y-2">
                <QrCode className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
                <p>Click "Start Camera Scanner" or upload a saved QR code screenshot.</p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Manual Fallback Input */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t.manualInputFallback}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={t.manualQrPlaceholder}
                className="flex-grow px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Inspect
              </button>
            </div>
          </form>
        </div>

        {/* Decoded Payload Results */}
        {decodedText && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  {decodedType === 'url' ? (
                    <Globe className="w-5 h-5" />
                  ) : decodedType === 'wifi' ? (
                    <Wifi className="w-5 h-5" />
                  ) : decodedType === 'vcard' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#172554]">
                    {t.decodedPayloadHeading}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Type: {decodedType.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : t.copyPayload}</span>
                </button>
              </div>
            </div>

            {/* Decoded content box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 break-all select-all">
              {decodedText}
            </div>

            {/* URL Inspection Summary if URL */}
            {urlInspection && (
              <div className="p-4 rounded-2xl bg-[#F8FAFF] border border-indigo-100 space-y-3">
                <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  Automated URL Hygiene Inspection
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Host Destination</span>
                    <strong className="text-slate-800 break-all font-mono">{urlInspection.hostname || 'N/A'}</strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase">Transport Encryption</span>
                    <strong className={urlInspection.usesHttps ? 'text-emerald-700' : 'text-rose-700'}>
                      {urlInspection.usesHttps ? 'HTTPS (Encrypted)' : 'HTTP (Plaintext Insecure)'}
                    </strong>
                  </div>
                </div>

                {urlInspection.suspiciousFlags.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                      Flagged Concerns ({urlInspection.suspiciousFlags.length})
                    </div>
                    {urlInspection.suspiciousFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>No obvious domain typosquatting or shorteners detected.</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Never automatically navigate to scanned links. Verify before visiting.
              </div>

              <button
                type="button"
                onClick={handleSendToSafetyAssistant}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#4F46F5] hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>{t.sendToSafetyAssistant}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
