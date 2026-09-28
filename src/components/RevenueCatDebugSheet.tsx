import React, { useState } from 'react';
import { X, CheckCircle, ShieldAlert, Key, RotateCcw, AlertTriangle, ExternalLink } from 'lucide-react';
import { Purchases } from '../services/revenuecat';
import { RevenueCatCustomerInfo } from '../types/revenuecat';

interface RevenueCatDebugSheetProps {
  isOpen: boolean;
  onClose: () => void;
  customerInfo: RevenueCatCustomerInfo;
  isPro: boolean;
  onCustomerInfoChange: () => void;
}

export const RevenueCatDebugSheet: React.FC<RevenueCatDebugSheetProps> = ({
  isOpen,
  onClose,
  customerInfo,
  isPro,
  onCustomerInfoChange,
}) => {
  const [customKey, setCustomKey] = useState(Purchases.getApiKey());
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTogglePro = () => {
    Purchases.simulateTogglePro();
    onCustomerInfoChange();
    setStatusMsg(`Entitlement toggled. User is now: ${Purchases.isProActive() ? 'PRO' : 'FREE'}`);
  };

  const handleReset = () => {
    Purchases.resetCustomerInfo();
    onCustomerInfoChange();
    setStatusMsg('RevenueCat customer state reset to default Free tier.');
  };

  const handleSaveApiKey = () => {
    Purchases.setCustomApiKey(customKey);
    setStatusMsg('API key stored for RevenueCat live transactions.');
  };

  const proEntitlement = customerInfo.entitlements.active['pro_access'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
            RC
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">RevenueCat SDK Inspector</h3>
            <p className="text-[11px] text-slate-400">Shipaton 2026 Hackathon Test Console</p>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-4 p-2.5 bg-teal-950/60 border border-teal-500/40 rounded-lg text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Entitlement State Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Entitlement "pro_access":</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                isPro
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isPro ? 'ACTIVE (PRO)' : 'INACTIVE (FREE)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Customer App User ID:</span>
            <span className="font-mono text-slate-300 text-[11px] truncate max-w-[200px]">
              {customerInfo.originalAppUserId}
            </span>
          </div>

          {proEntitlement && (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Product Identifier:</span>
                <span className="font-mono text-teal-300 text-[11px]">
                  {proEntitlement.productIdentifier}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Will Renew:</span>
                <span className="font-mono text-slate-300 text-[11px]">
                  {proEntitlement.willRenew ? 'true' : 'false'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Expires At:</span>
                <span className="font-mono text-slate-300 text-[11px]">
                  {proEntitlement.expirationDate
                    ? new Date(proEntitlement.expirationDate).toLocaleDateString()
                    : 'Lifetime'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 1-Tap Sandbox Actions */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Sandbox Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTogglePro}
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                isPro
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isPro ? 'Switch to Free' : 'Grant Pro Access'}</span>
            </button>

            <button
              onClick={handleReset}
              className="py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Clean Free</span>
            </button>
          </div>
        </div>

        {/* Live RevenueCat API Key Option */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-teal-400" />
              <span>Live RevenueCat Public API Key (Optional)</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Default uses pre-configured hackathon sandbox offerings. Enter your project's Public API key (<code className="text-teal-400">appl_...</code> or <code className="text-teal-400">goog_...</code>) to connect live.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="e.g. appl_xXXxxXxXxxxx..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Documentation / Verification Link */}
        <div className="pt-2 text-center">
          <a
            href="https://www.revenuecat.com/docs/getting-started/quickstart"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:underline"
          >
            <span>RevenueCat Shipaton 2026 Guidelines</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
