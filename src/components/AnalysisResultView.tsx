import React, { useState } from 'react';
import {
  ShieldAlert,
  Scale,
  FileCheck2,
  PhoneCall,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Claim, EvidenceItem } from '../types/claim';

interface AnalysisResultViewProps {
  claim: Claim;
  isPro: boolean;
  onOpenPaywall: () => void;
  onGenerateAppeal: (claim: Claim) => void;
  onOpenCallScript: (claim: Claim) => void;
  onBack: () => void;
  onUpdateEvidence: (claimId: string, updatedEvidence: EvidenceItem[]) => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  claim,
  isPro,
  onOpenPaywall,
  onGenerateAppeal,
  onOpenCallScript,
  onBack,
  onUpdateEvidence,
}) => {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(claim.evidenceChecklist || []);
  const [showCodesDetail, setShowCodesDetail] = useState(true);

  const toggleEvidence = (id: string) => {
    const updated = evidenceList.map((item) =>
      item.id === id ? { ...item, isCollected: !item.isCollected } : item
    );
    setEvidenceList(updated);
    onUpdateEvidence(claim.id, updated);
  };

  const handleAppealClick = () => {
    if (isPro) {
      onGenerateAppeal(claim);
    } else {
      // Prompt user with RevenueCat Paywall explaining value
      onOpenPaywall();
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-24 text-slate-100 space-y-5">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          ← Back to Claims
        </button>
        <span className="text-[11px] font-mono text-slate-500">ID: {claim.id}</span>
      </div>

      {/* Header Verdict Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3 h-3 text-teal-400" />
              <span>{claim.denialCategory}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-snug">
              {claim.insurerName} Denial Diagnosis
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Member: {claim.patientName} · Ref: {claim.patientPolicyNumber}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">
              Disputed Amount
            </span>
            <span className="text-xl font-extrabold text-teal-300 font-mono">
              ${claim.disputedAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Plain English Translation */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mt-3">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Plain-English Diagnosis
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {claim.primaryReasonPlainEnglish}
          </p>
        </div>

        {/* Win Probability & Deadline Meter */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              85%
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Appeal Precedent</div>
              <div className="text-xs font-bold text-emerald-400">High Success Chance</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Statutory Window</div>
              <div className="text-xs font-bold text-amber-400">
                {claim.deadlineDaysRemaining} Days Remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Identified Billing Codes Accordion */}
      {claim.identifiedCodes && claim.identifiedCodes.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowCodesDetail(!showCodesDetail)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/90 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Identified CPT & Diagnostic Codes ({claim.identifiedCodes.length})
              </span>
            </div>
            {showCodesDetail ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showCodesDetail && (
            <div className="px-4 pb-4 space-y-2 border-t border-slate-800/60 pt-3">
              {claim.identifiedCodes.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-teal-300">{item.code}</span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-medium">
                      Flagged Issue
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{item.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">"{item.flaggedIssue}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statutory Violations & Legal Precedent */}
      {claim.legalViolationsOrBypasses && claim.legalViolationsOrBypasses.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Statutory Basis For Overturn
            </h3>
          </div>

          <div className="space-y-2">
            {claim.legalViolationsOrBypasses.map((statute, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5 text-xs"
              >
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">{statute}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Evidence Checklist */}
      {evidenceList.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Required Appeal Evidence Checklist
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              {evidenceList.filter((e) => e.isCollected).length} of {evidenceList.length} ready
            </span>
          </div>

          <div className="space-y-2">
            {evidenceList.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleEvidence(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  item.isCollected
                    ? 'bg-teal-950/20 border-teal-500/40 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!item.isCollected}
                  onChange={() => {}} // handled by parent onClick
                  className="mt-1 w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {item.isCrucial && (
                      <span className="text-[9px] font-bold text-amber-400 uppercase bg-amber-500/10 px-1.5 py-0.2 rounded">
                        Crucial
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-2">
        {/* Appeal Packet Button */}
        <button
          onClick={handleAppealClick}
          className="w-full py-4 px-4 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-teal-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          {isPro ? (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Formal Legal Appeal Packet</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-slate-950" />
              <span>Unlock Formal Legal Appeal Packet (Pro)</span>
              <Sparkles className="w-4 h-4 text-slate-950" />
            </>
          )}
        </button>

        {/* Phone Negotiation Script Button */}
        <button
          onClick={() => onOpenCallScript(claim)}
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
          <span>Launch Insurer Call Script & Objections</span>
        </button>
      </div>
    </div>
  );
};
