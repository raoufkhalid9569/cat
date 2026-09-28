import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Sparkles,
  Shield,
  FileCheck2,
  PhoneCall,
  Scale,
  RefreshCw,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Purchases } from '../services/revenuecat';
import { RevenueCatOffering, RevenueCatPackage } from '../types/revenuecat';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess?: () => void;
  claimAtStake?: number;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onPurchaseSuccess,
  claimAtStake,
}) => {
  const [offering, setOffering] = useState<RevenueCatOffering | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<RevenueCatPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadOfferings();
    }
  }, [isOpen]);

  const loadOfferings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const off = await Purchases.getOfferings();
      setOffering(off);
      // Default to Annual package (Best Value)
      const annual = off.packages.find((p) => p.packageType === 'ANNUAL') || off.packages[0];
      setSelectedPackage(annual || null);
    } catch {
      setErrorMessage('Could not load subscription offerings. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setIsPurchasing(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const result = await Purchases.purchasePackage(selectedPackage);
      if (Purchases.isProActive(result.customerInfo)) {
        setSuccessNotice('Subscription activated! Your Pro appeal features are now unlocked.');
        setTimeout(() => {
          onPurchaseSuccess?.();
          onClose();
        }, 1200);
      } else {
        setErrorMessage('Purchase completed, but entitlement was not activated.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Transaction could not be processed. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const result = await Purchases.restorePurchases();
      if (result.restored) {
        setSuccessNotice('Prior purchases restored! Pro access enabled.');
        setTimeout(() => {
          onPurchaseSuccess?.();
          onClose();
        }, 1200);
      } else {
        setErrorMessage('No previous active subscriptions found for this Apple / Google ID.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to restore purchases at this time.');
    } finally {
      setIsRestoring(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>REVENUECAT POWERED ADVOCACY</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            Overturn Your Denial with <span className="text-teal-400">ClaimClarity Pro</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            {claimAtStake ? (
              <span>
                Don't pay the <strong className="text-amber-300 font-mono">${claimAtStake.toLocaleString()}</strong> bill. Use statutory citations under ERISA and the No Surprises Act to force an overturn.
              </span>
            ) : (
              'The average patient overturns $3,200 in improper medical bills using our attorney-grade appeal packets.'
            )}
          </p>
        </div>

        {/* Value Comparison / Features */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 sm:p-4 mb-5 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            What Pro Unlocks
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-3 h-3" />
            </div>
            <div>
              <span className="font-semibold text-white">ERISA § 503 & ACA Citation Engine:</span>{' '}
              <span className="text-slate-300">
                Deep statutory code references with explicit legal liability warnings to the insurer.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck2 className="w-3 h-3" />
            </div>
            <div>
              <span className="font-semibold text-white">Full Formal Appeal Packet & PDF Export:</span>{' '}
              <span className="text-slate-300">
                Ready to print, certified-mail, or fax with doctor attestation templates.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <PhoneCall className="w-3 h-3" />
            </div>
            <div>
              <span className="font-semibold text-white">Phone Negotiation Objection Rebuttals:</span>{' '}
              <span className="text-slate-300">
                Word-for-word scripts to counter every excuse customer service agents give.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-3 h-3" />
            </div>
            <div>
              <span className="font-semibold text-white">Unlimited Active Case Tracking:</span>{' '}
              <span className="text-slate-300">
                Protect yourself and your whole family against surprise bills year-round.
              </span>
            </div>
          </div>
        </div>

        {/* Offerings Selector */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-teal-400 mb-2" />
            <span className="text-xs">Fetching plans from RevenueCat...</span>
          </div>
        ) : (
          <div className="space-y-2.5 mb-5">
            {offering?.packages.map((pkg) => {
              const isSelected = selectedPackage?.identifier === pkg.identifier;
              const isAnnual = pkg.packageType === 'ANNUAL';
              const isMonthly = pkg.packageType === 'MONTHLY';

              return (
                <div
                  key={pkg.identifier}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500 shadow-md shadow-teal-500/10'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                  }`}
                >
                  {/* Badge */}
                  {isAnnual && (
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      Best Value · Save 50%
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Check radio */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-teal-400 bg-teal-500 text-slate-950'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                          <span>{pkg.product.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {isAnnual
                            ? '14-day free trial · Billed $59.99/year ($4.99/mo)'
                            : isMonthly
                            ? '7-day free trial · Billed monthly'
                            : 'One-time payment for 1 high-value appeal'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-base text-teal-300 font-mono">
                        {pkg.product.priceString}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {isAnnual ? '/year' : isMonthly ? '/month' : ' one-time'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* CTA Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={isPurchasing || isLoading || !selectedPackage}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isPurchasing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Contacting RevenueCat...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>
                {selectedPackage?.product.trialPeriodDays
                  ? `Start ${selectedPackage.product.trialPeriodDays}-Day Free Trial`
                  : 'Unlock Pro Appeal Access'}
              </span>
            </>
          )}
        </button>

        {/* Restore Purchases & Terms */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <button
            onClick={handleRestore}
            disabled={isRestoring}
            className="hover:text-slate-200 underline decoration-slate-600 transition-colors flex items-center gap-1"
          >
            {isRestoring && <RefreshCw className="w-3 h-3 animate-spin" />}
            <span>Restore Purchases</span>
          </button>

          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Cancel anytime in Store Settings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
