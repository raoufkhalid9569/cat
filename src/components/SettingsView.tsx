import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  RotateCcw,
  Download,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  Code,
  FileText,
} from 'lucide-react';
import { RevenueCatCustomerInfo } from '../types/revenuecat';
import { Purchases } from '../services/revenuecat';

interface SettingsViewProps {
  customerInfo: RevenueCatCustomerInfo;
  isPro: boolean;
  onOpenPaywall: () => void;
  onOpenDebug: () => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  customerInfo,
  isPro,
  onOpenPaywall,
  onOpenDebug,
  onResetData,
  onExportData,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const proEntitlement = customerInfo.entitlements.active['pro_access'];

  const handleCopyId = () => {
    navigator.clipboard.writeText(customerInfo.originalAppUserId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setStatusMsg(null);
    try {
      const result = await Purchases.restorePurchases();
      if (result.restored) {
        setStatusMsg('Prior purchases restored successfully!');
      } else {
        setStatusMsg('No prior active subscription found.');
      }
    } catch {
      setStatusMsg('Failed to restore purchases. Please check connection.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-24 text-slate-100 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Subscription & Account
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          RevenueCat entitlement management and patient data preferences.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-xl text-teal-300 text-xs">
          {statusMsg}
        </div>
      )}

      {/* Subscription Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Active Tier
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">
                {isPro ? 'ClaimClarity Pro' : 'Free Patient Plan'}
              </span>
              {isPro ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  STANDARD
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onOpenPaywall}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              isPro
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
            }`}
          >
            {isPro ? 'Change Plan' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Pro Details */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>ERISA Statutory Citations:</span>
            <span className="font-semibold text-white">{isPro ? 'Unlocked' : 'Locked (Pro)'}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Appeal Packets & PDF Exports:</span>
            <span className="font-semibold text-white">{isPro ? 'Unlimited' : '1 Free Preview'}</span>
          </div>
          {proEntitlement?.expirationDate && (
            <div className="flex items-center justify-between text-slate-400">
              <span>Next Renewal / Expiration:</span>
              <span className="font-mono text-teal-300">
                {new Date(proEntitlement.expirationDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Restore Purchases */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={handleRestore}
            disabled={isRestoring}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isRestoring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
            <span>Restore In-App Purchases</span>
          </button>

          <span className="text-[10px] text-slate-500">RevenueCat SDK v8.x</span>
        </div>
      </div>

      {/* Customer Identifiers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          RevenueCat Customer ID
        </h3>
        <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="font-mono text-xs text-slate-300 truncate max-w-[240px]">
            {customerInfo.originalAppUserId}
          </span>
          <button
            onClick={handleCopyId}
            className="text-slate-400 hover:text-teal-400 p-1 transition-colors"
            title="Copy ID"
          >
            {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Data Management & Hackathon Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Developer & Judge Tools
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenDebug}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-teal-400" />
            <span>RC Inspector</span>
          </button>

          <button
            onClick={onExportData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export JSON</span>
          </button>
        </div>

        <button
          onClick={onResetData}
          className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-950 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/30 rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Demo Data</span>
        </button>
      </div>

      {/* Hackathon Attribution Footer */}
      <div className="text-center pt-2 text-[11px] text-slate-500 space-y-1">
        <p>Built for the RevenueCat Shipaton 2026 Hackathon</p>
        <p>Empowering patients to challenge improper healthcare billing.</p>
      </div>
    </div>
  );
};
