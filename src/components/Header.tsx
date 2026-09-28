import React from 'react';
import { ShieldAlert, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { RevenueCatCustomerInfo } from '../types/revenuecat';

interface HeaderProps {
  customerInfo: RevenueCatCustomerInfo;
  isPro: boolean;
  onOpenPaywall: () => void;
  onOpenDebug: () => void;
  isMobileFrameMode: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isPro,
  onOpenPaywall,
  onOpenDebug,
  isMobileFrameMode,
  onToggleMobileFrame,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-sm shadow-teal-500/10">
            <ShieldAlert className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">ClaimClarity</span>
              {isPro ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PRO
                </span>
              ) : (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  FREE
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">Patient Appeal Copilot</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* RevenueCat Pro / Upgrade Trigger */}
          {isPro ? (
            <button
              onClick={onOpenPaywall}
              className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              title="Manage Pro Subscription"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Pro Active</span>
            </button>
          ) : (
            <button
              onClick={onOpenPaywall}
              className="text-[11px] font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 px-2.5 py-1.5 rounded-lg shadow-sm shadow-teal-500/20 flex items-center gap-1 transition-all active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>Upgrade</span>
            </button>
          )}

          {/* Device Frame Toggle (Desktop) */}
          <button
            onClick={onToggleMobileFrame}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center"
            title={isMobileFrameMode ? 'Switch to Full Screen View' : 'Switch to iPhone Frame View'}
          >
            {isMobileFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* RevenueCat Judge/Dev Sheet Trigger */}
          <button
            onClick={onOpenDebug}
            className="text-[10px] font-mono px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/80 transition-colors"
            title="Inspect RevenueCat Entitlements & Sandbox Simulator"
          >
            RC Dev
          </button>
        </div>
      </div>
    </header>
  );
};
