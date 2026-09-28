import React, { useState, useEffect } from 'react';
import { Claim, ClaimStatus, EvidenceItem } from './types/claim';
import { RevenueCatCustomerInfo } from './types/revenuecat';
import { Purchases } from './services/revenuecat';
import {
  getSavedClaims,
  saveClaim,
  deleteClaim,
  isOnboardingCompleted,
  setOnboardingCompleted,
  resetDemoData,
} from './services/storage';

// Components
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { MobileFrame } from './components/MobileFrame';
import { DashboardView } from './components/DashboardView';
import { NewClaimView } from './components/NewClaimView';
import { AnalysisResultView } from './components/AnalysisResultView';
import { AppealPacketView } from './components/AppealPacketView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { PaywallModal } from './components/PaywallModal';
import { OnboardingModal } from './components/OnboardingModal';
import { RevenueCatDebugSheet } from './components/RevenueCatDebugSheet';
import { CallScriptModal } from './components/CallScriptModal';

export default function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeClaim, setActiveClaim] = useState<Claim | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeSubView, setActiveSubView] = useState<'main' | 'analysis' | 'packet'>('main');

  // RevenueCat State
  const [customerInfo, setCustomerInfo] = useState<RevenueCatCustomerInfo>(Purchases.getCustomerInfo());
  const [isPro, setIsPro] = useState<boolean>(Purchases.isProActive());

  // Modals
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showCallScriptModal, setShowCallScriptModal] = useState<boolean>(false);
  const [callScriptClaim, setCallScriptClaim] = useState<Claim | undefined>(undefined);

  // Layout View mode (iPhone mockup vs full browser width)
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    // 1. Initialize persistent claims
    const loadedClaims = getSavedClaims();
    setClaims(loadedClaims);
    if (loadedClaims.length > 0) {
      setActiveClaim(loadedClaims[0]);
    }

    // 2. Check Onboarding
    if (!isOnboardingCompleted()) {
      setShowOnboarding(true);
    }

    // 3. Configure RevenueCat SDK
    Purchases.configure();

    // 4. Listen for RevenueCat customer info / entitlement updates
    const unsubscribe = Purchases.addCustomerInfoUpdateListener((info) => {
      setCustomerInfo(info);
      setIsPro(Purchases.isProActive(info));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handlers
  const handleSelectClaim = (claim: Claim) => {
    setActiveClaim(claim);
    if (claim.status === 'appeal_generated' || claim.status === 'submitted') {
      setActiveSubView('packet');
    } else {
      setActiveSubView('analysis');
    }
  };

  const handleClaimAnalyzed = (newClaim: Claim) => {
    const updated = saveClaim(newClaim);
    setClaims(updated);
    setActiveClaim(newClaim);
    setActiveSubView('analysis');
    showToast('Healthcare claim analysis completed!');
  };

  const handleGenerateAppeal = async (claimToAppeal: Claim) => {
    // If not pro, paywall is presented
    if (!isPro) {
      setShowPaywall(true);
      return;
    }

    showToast('Drafting formal ERISA appeal packet...');

    try {
      const response = await fetch('/api/generate-appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimData: claimToAppeal,
          patientName: claimToAppeal.patientName,
          patientPolicyNumber: claimToAppeal.patientPolicyNumber,
          doctorName: claimToAppeal.doctorName,
          isProUser: true,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const updatedClaim: Claim = {
            ...claimToAppeal,
            status: 'appeal_generated',
            appealLetter: {
              letterSubject: result.data.letterSubject,
              fullLetterText: result.data.fullLetterText,
              legalCitations: result.data.legalCitations,
              doctorAttestationInstructions: result.data.doctorAttestationInstructions,
              submissionInstructions: result.data.submissionInstructions,
              generatedAt: new Date().toISOString(),
            },
          };
          const saved = saveClaim(updatedClaim);
          setClaims(saved);
          setActiveClaim(updatedClaim);
          setActiveSubView('packet');
          showToast('Formal appeal packet ready for submission!');
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Client fallback: Mark as appeal_generated with rich template
    const fallbackUpdated: Claim = {
      ...claimToAppeal,
      status: 'appeal_generated',
    };
    const saved = saveClaim(fallbackUpdated);
    setClaims(saved);
    setActiveClaim(fallbackUpdated);
    setActiveSubView('packet');
  };

  const handleMarkSubmitted = (claimId: string) => {
    const target = claims.find((c) => c.id === claimId);
    if (!target) return;
    const updated: Claim = {
      ...target,
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      deadlineDaysRemaining: 30, // 30-day insurer response clock begins
    };
    const saved = saveClaim(updated);
    setClaims(saved);
    setActiveClaim(updated);
    showToast('Appeal marked as sent! 30-day countdown active.');
  };

  const handleUpdateEvidence = (claimId: string, updatedEvidence: EvidenceItem[]) => {
    const target = claims.find((c) => c.id === claimId);
    if (!target) return;
    const updated: Claim = {
      ...target,
      evidenceChecklist: updatedEvidence,
    };
    const saved = saveClaim(updated);
    setClaims(saved);
    if (activeClaim?.id === claimId) {
      setActiveClaim(updated);
    }
  };

  const handleUpdateStatus = (claimId: string, status: ClaimStatus, savedAmount?: number) => {
    const target = claims.find((c) => c.id === claimId);
    if (!target) return;
    const updated: Claim = {
      ...target,
      status,
      savedAmount: savedAmount || target.disputedAmount,
    };
    const saved = saveClaim(updated);
    setClaims(saved);
    if (activeClaim?.id === claimId) {
      setActiveClaim(updated);
    }
    showToast(status === 'won' ? '🎉 Congratulations! Claim marked as Won & Saved!' : 'Status updated.');
  };

  const handleDeleteClaim = (claimId: string) => {
    const updated = deleteClaim(claimId);
    setClaims(updated);
    if (activeClaim?.id === claimId) {
      setActiveClaim(updated[0] || null);
      setActiveSubView('main');
    }
    showToast('Claim removed from case list.');
  };

  const handleResetData = () => {
    const seeded = resetDemoData();
    setClaims(seeded);
    setActiveClaim(seeded[0] || null);
    setActiveSubView('main');
    setCurrentTab('dashboard');
    showToast('Demo data reloaded successfully.');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(claims, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `claimclarity_appeals_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Claims history exported as JSON.');
  };

  const handleOpenCallScript = (claim?: Claim) => {
    setCallScriptClaim(claim || activeClaim || undefined);
    setShowCallScriptModal(true);
  };

  return (
    <MobileFrame isMobileFrameMode={isMobileFrameMode}>
      {/* App Header */}
      <Header
        customerInfo={customerInfo}
        isPro={isPro}
        onOpenPaywall={() => setShowPaywall(true)}
        onOpenDebug={() => setShowDebug(true)}
        isMobileFrameMode={isMobileFrameMode}
        onToggleMobileFrame={() => setIsMobileFrameMode(!isMobileFrameMode)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-950/40 border border-teal-400 animate-in fade-in slide-in-from-top-2 duration-200 text-center">
          {toastMessage}
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 overflow-y-auto">
        {/* Sub-view: Analysis Result */}
        {activeSubView === 'analysis' && activeClaim && (
          <AnalysisResultView
            claim={activeClaim}
            isPro={isPro}
            onOpenPaywall={() => setShowPaywall(true)}
            onGenerateAppeal={handleGenerateAppeal}
            onOpenCallScript={handleOpenCallScript}
            onBack={() => setActiveSubView('main')}
            onUpdateEvidence={handleUpdateEvidence}
          />
        )}

        {/* Sub-view: Appeal Packet Letter */}
        {activeSubView === 'packet' && activeClaim && (
          <AppealPacketView
            claim={activeClaim}
            isPro={isPro}
            onOpenPaywall={() => setShowPaywall(true)}
            onMarkSubmitted={handleMarkSubmitted}
            onBack={() => setActiveSubView('analysis')}
          />
        )}

        {/* Root Tabs */}
        {activeSubView === 'main' && (
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                claims={claims}
                isPro={isPro}
                onSelectClaim={handleSelectClaim}
                onNewClaim={() => setCurrentTab('new_claim')}
                onOpenPaywall={() => setShowPaywall(true)}
                onOpenCallScript={handleOpenCallScript}
              />
            )}

            {currentTab === 'new_claim' && (
              <NewClaimView
                onClaimAnalyzed={handleClaimAnalyzed}
                onCancel={() => setCurrentTab('dashboard')}
              />
            )}

            {currentTab === 'call_script' && (
              <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-24 text-slate-100">
                <div className="mb-4">
                  <h1 className="text-xl font-bold text-white">Insurer Negotiation</h1>
                  <p className="text-xs text-slate-400">
                    Prepare for calls with insurance representatives using legal rebuttal scripts.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-4">
                  <p className="text-xs text-slate-300">
                    Select a claim from your history to load customized statutory arguments, or launch the interactive general phone script.
                  </p>
                  <button
                    onClick={() => handleOpenCallScript(activeClaim || undefined)}
                    className="py-3 px-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Launch Interactive Phone Script
                  </button>
                </div>
              </div>
            )}

            {currentTab === 'history' && (
              <HistoryView
                claims={claims}
                onSelectClaim={handleSelectClaim}
                onNewClaim={() => setCurrentTab('new_claim')}
                onDeleteClaim={handleDeleteClaim}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                customerInfo={customerInfo}
                isPro={isPro}
                onOpenPaywall={() => setShowPaywall(true)}
                onOpenDebug={() => setShowDebug(true)}
                onResetData={handleResetData}
                onExportData={handleExportData}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={currentTab}
        onChangeTab={(tab) => {
          setActiveSubView('main');
          setCurrentTab(tab);
        }}
        activeClaimsCount={claims.filter((c) => c.status !== 'won' && c.status !== 'settled').length}
      />

      {/* Modals */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        claimAtStake={activeClaim?.disputedAmount}
        onPurchaseSuccess={() => {
          setIsPro(true);
          showToast('🎉 RevenueCat Pro Access Unlocked! Enjoy full appeal features.');
        }}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          setShowOnboarding(false);
          setOnboardingCompleted(true);
        }}
        onStartSample={() => {
          setShowOnboarding(false);
          setOnboardingCompleted(true);
          setCurrentTab('new_claim');
        }}
      />

      <RevenueCatDebugSheet
        isOpen={showDebug}
        onClose={() => setShowDebug(false)}
        customerInfo={customerInfo}
        isPro={isPro}
        onCustomerInfoChange={() => {
          const updated = Purchases.getCustomerInfo();
          setCustomerInfo(updated);
          setIsPro(Purchases.isProActive(updated));
        }}
      />

      <CallScriptModal
        isOpen={showCallScriptModal}
        onClose={() => setShowCallScriptModal(false)}
        claim={callScriptClaim}
      />
    </MobileFrame>
  );
}
