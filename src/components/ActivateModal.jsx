import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function ActivateModal({ isOpen, onClose, onActivateFreeTrial }) {
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    setActivated(true);
    onActivateFreeTrial();
    setTimeout(() => {
      onClose();
      setActivated(false);
    }, 1600);
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
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Activate Instant Access</h3>
            <p className="text-xs text-slate-400">Enable advanced metadata batch features and unlimited tags</p>
          </div>
        </div>

        <div className="space-y-3.5 my-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111d36] border border-[#1b2e52]">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Unlimited batch image processing</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111d36] border border-[#1b2e52]">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Direct Windows XP & EXIF GPS embedding</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#111d36] border border-[#1b2e52]">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>One-click ZIP batch export</span>
          </div>
        </div>

        {activated ? (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Activated successfully! Enjoy unrestricted geotagging.</span>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleActivate}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-[#10b981] hover:bg-[#059669] text-white transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <span>Activate Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
