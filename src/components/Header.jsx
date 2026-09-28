import React from 'react';
import { Crown, Sparkles, ShoppingCart, User, LogOut } from 'lucide-react';

export default function Header({
  onOpenLicense,
  onOpenActivate,
  onOpenPricing,
  onOpenSignIn,
  user,
  onSignOut,
  isPro
}) {
  return (
    <header className="w-full bg-[#070b16] border-b border-[#142038] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30 shadow-md">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3.5 self-start md:self-auto cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center">
            {/* Custom Logo matching screenshot pin */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0284c7] via-[#0284c7] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-sky-500/20">
              <svg className="w-6 h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
            {/* Pulsing small secondary dot at bottom left */}
            <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-[#38bdf8] border-2 border-[#070b16] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                GeoTagging <span className="text-[#38bdf8]">Images Tool</span>
              </h1>
              {isPro && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#8899b5] font-normal">
              Add location data to your photos
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 self-end md:self-auto">
          {/* Enter Pro License */}
          <button
            onClick={onOpenLicense}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111c33] hover:bg-[#162544] border border-[#22355c] hover:border-amber-400/50 text-slate-200 text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Enter Pro License</span>
          </button>

          {/* Activate */}
          <button
            onClick={onOpenActivate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#10b981] hover:bg-[#059669] text-white text-xs sm:text-sm font-medium transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Activate</span>
          </button>

          {/* Buy Pro */}
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-medium transition-all duration-200 shadow-md shadow-sky-500/15 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buy Pro</span>
          </button>

          {/* Google Sign In / Account state */}
          {user ? (
            <div className="flex items-center gap-2 bg-[#111c33] border border-[#22355c] px-2.5 py-1 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.name ? user.name[0] : 'U'}
              </div>
              <span className="text-xs text-slate-200 font-medium max-w-[100px] truncate hidden sm:inline">
                {user.name || user.email}
              </span>
              <button
                onClick={onSignOut}
                title="Sign out"
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm active:scale-95"
            >
              {/* Google colored G */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google Sign In</span>
            </button>
          )}

          {/* User Avatar icon */}
          <div
            onClick={onOpenSignIn}
            className="w-8 h-8 rounded-full bg-[#142038] border border-[#22355c] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#38bdf8] cursor-pointer transition-all duration-200"
            title={user ? user.email : "Profile"}
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
