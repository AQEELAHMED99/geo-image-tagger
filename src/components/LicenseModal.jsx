import React, { useState } from 'react';
import { X, Crown, Check, AlertCircle } from 'lucide-react';

export default function LicenseModal({ isOpen, onClose, onApplyLicense }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      setStatus('error');
      setErrorMessage('Please enter a valid license key.');
      return;
    }

    // Mock validation: accept any key or PRO-xxxx
    if (licenseKey.trim().length >= 8) {
      setStatus('success');
      onApplyLicense(licenseKey.trim());
      setTimeout(() => {
        onClose();
        setStatus(null);
        setLicenseKey('');
      }, 1500);
    } else {
      setStatus('error');
      setErrorMessage('Invalid license key format. Keys are at least 8 characters.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0c1527] border border-[#1e325c] rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Enter Pro License</h3>
            <p className="text-xs text-slate-400">Unlock unlimited batch geotagging and high-speed processing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              License Key
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                setStatus(null);
              }}
              placeholder="e.g. GEO-PRO-8892-XYZ9"
              className="w-full bg-[#111d36] border border-[#1e3561] focus:border-amber-400 text-white rounded-lg px-3.5 py-2.5 text-sm outline-none font-mono"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>License verified successfully! Pro features unlocked.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20"
            >
              Verify License
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
