import React, { useState } from 'react';
import {
  PhoneCall,
  X,
  MessageSquare,
  Shield,
  HelpCircle,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Claim } from '../types/claim';

interface CallScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim?: Claim;
}

export const CallScriptModal: React.FC<CallScriptModalProps> = ({
  isOpen,
  onClose,
  claim,
}) => {
  const [selectedRebuttal, setSelectedRebuttal] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const defaultRebuttals = [
    {
      agentPushback: 'We cannot pay this because the physician is out-of-network.',
      patientRebuttal:
        'Under the Federal No Surprises Act (45 CFR § 149.110), out-of-network balance billing is illegal for emergency services performed at in-network facilities. You are required to calculate my cost-sharing at the median in-network rate. I demand that you re-process this claim immediately.',
    },
    {
      agentPushback: 'This procedure was denied for lack of prior authorization.',
      patientRebuttal:
        'Under federal EMTALA regulations (42 U.S.C. § 1395dd) and ACA 42 U.S.C. § 300gg-19a, health plans are prohibited from requiring prior authorization for emergency medical conditions until the patient is medically stabilized.',
    },
    {
      agentPushback: 'The treatment did not meet our plan’s medical necessity guidelines.',
      patientRebuttal:
        'Under ERISA § 503 (29 CFR § 2560.503-1), I have the legal right to a copy of the specific clinical guidelines relied upon, as well as the name and board certification of the physician reviewer. Please provide those details for my formal file now.',
    },
    {
      agentPushback: 'You must first try and fail step therapy medications.',
      patientRebuttal:
        'My attending physician has documented that the prerequisite step-therapy medication is clinically contraindicated and poses severe adverse health risks. Under state step therapy override statutes, you are required to approve the clinical exception.',
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Insurer Negotiation Call Script</h2>
            <p className="text-[11px] text-slate-400">
              Word-for-word counter-arguments for talking to insurance representatives.
            </p>
          </div>
        </div>

        {/* Phase 1: Call Opening */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4">
          <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-1.5">
            Step 1: The Opening & Call Record
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "Hello, my name is {claim?.patientName || 'Jane Doe'}. I am calling regarding claim number{' '}
            <strong className="text-white font-mono">{claim?.id || 'CLM-84920'}</strong>. Before we
            begin, please provide your direct employee name and a reference number for this call."
          </p>
        </div>

        {/* Phase 2: Direct Audit Questions */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 space-y-2">
          <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider mb-1">
            Step 2: Force Insurer Disclosures
          </div>
          <div className="text-xs text-slate-300 space-y-1.5">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="text-teal-400 font-bold shrink-0">Q1:</span>
              <span>"What is the exact medical reason code and clinical guideline number used to deny this claim?"</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="text-teal-400 font-bold shrink-0">Q2:</span>
              <span>"Under ERISA 29 CFR § 2560.503-1, what is the medical specialty of the clinical reviewer who signed off?"</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start gap-2">
              <span className="text-teal-400 font-bold shrink-0">Q3:</span>
              <span>"Has this claim been sent to an Independent Dispute Resolution (IDR) entity under the No Surprises Act?"</span>
            </div>
          </div>
        </div>

        {/* Phase 3: Interactive Rebuttal Cards */}
        <div className="space-y-2 mb-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Step 3: Instant Objection Rebuttals (Tap to expand)
          </div>

          {defaultRebuttals.map((item, idx) => {
            const isExpanded = selectedRebuttal === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setSelectedRebuttal(isExpanded ? null : idx)}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-white hover:bg-slate-900/60"
                >
                  <span className="text-amber-300">If Agent says: "{item.agentPushback}"</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-3 border-t border-slate-800/80 bg-teal-950/20 text-xs text-slate-200 leading-relaxed">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-teal-400 uppercase">
                        Read this verbatim:
                      </span>
                      <button
                        onClick={() => handleCopy(item.patientRebuttal, idx)}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedIndex === idx ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-teal-100">{item.patientRebuttal}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
        >
          Close Call Script
        </button>
      </div>
    </div>
  );
};
