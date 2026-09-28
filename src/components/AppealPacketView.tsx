import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Lock,
  Sparkles,
  Send,
  AlertCircle,
  FileCheck,
  Download,
  Share2,
} from 'lucide-react';
import { Claim, AppealLetterData } from '../types/claim';

interface AppealPacketViewProps {
  claim: Claim;
  isPro: boolean;
  onOpenPaywall: () => void;
  onMarkSubmitted: (claimId: string) => void;
  onBack: () => void;
}

export const AppealPacketView: React.FC<AppealPacketViewProps> = ({
  claim,
  isPro,
  onOpenPaywall,
  onMarkSubmitted,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(claim.status === 'submitted');

  // Fallback appeal letter content if not yet generated via server-side Gemini
  const letterData: AppealLetterData = claim.appealLetter || {
    letterSubject: `URGENT FORMAL APPEAL: Immediate Reversal Demanded for Adverse Determination - Claim #${claim.id}`,
    fullLetterText: `DATE: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}

SENT VIA CERTIFIED MAIL (RETURN RECEIPT REQUESTED) & EXPEDITED TELEFACSIMILE

TO:
Appeals & Grievances Department
${claim.insurerName}
P.O. Box 9000
Claims Appeals Processing Center

RE:
Patient Name: ${claim.patientName}
Subscriber ID: ${claim.patientPolicyNumber}
Claim Identification Number: ${claim.id}
Date(s) of Service: Recent
Disputed Billed Amount: $${claim.disputedAmount.toLocaleString()}
Stated Denial Reason: ${claim.denialCategory}

STATEMENT OF FORMAL APPEAL & DEMAND FOR REVERSAL:
Please accept this correspondence as a formal Level-1 Internal Appeal and demand for full reversal of the adverse benefit determination issued by ${claim.insurerName} regarding the above-referenced medical services. 

Under both federal statutory authority and prevailing clinical evidence, the denial of coverage was erroneous, arbitrary, and in violation of governing healthcare standards.

CLINICAL BACKGROUND & MEDICAL NECESSITY:
The patient, ${claim.patientName}, presented with acute clinical symptoms requiring immediate diagnostic evaluation and intervention under the direction of attending physician ${claim.doctorName || 'Attending Physician'}.

As established in the enclosed clinical chart notes, delaying or withholding this covered service constitutes an unacceptable risk of patient deterioration, prolonged morbidity, or irreversible physical impairment. The clinical criteria cited in your determination notice fail to accommodate the patient's individual clinical contraindications.

STATUTORY & REGULATORY VIOLATIONS:
1. FEDERAL NO SURPRISES ACT (Public Law 116-260; 45 CFR § 149.110):
Under federal law, out-of-network balance billing for emergency or ancillary care at participating facilities is strictly illegal. The patient cannot be billed beyond the median in-network cost-sharing rate. Any unresolved billing dispute must be adjudicated exclusively through the federal Independent Dispute Resolution (IDR) process without holding the subscriber liable.

2. ERISA SECTION 503 (29 U.S.C. § 1133) & 29 CFR § 2560.503-1:
Under federal regulations governing employee benefit welfare plans, plan participants are entitled to a full and fair review. You are formally requested to provide: (a) the complete internal claims file, (b) the specific clinical rationale, medical review notes, and credentials of the reviewer, and (c) any internal rules or protocols relied upon in making this determination.

3. AFFORDABLE CARE ACT (ACA) 45 CFR § 147.136:
Your plan is legally required to adhere to expedited timeline determinations. Failure to uphold internal claims standards constitutes non-compliance subject to enforcement by the Department of Labor (DOL) and State Insurance Commissioner.

MANDATORY TIMELINE DEMAND:
Pursuant to federal claims regulations, you have a statutory duty to issue a written appeal determination within thirty (30) calendar days of receipt. Failure to provide a timely response will be deemed an exhaustion of administrative remedies, prompting immediate escalation to the State Department of Insurance and external independent review.

Sincerely,

________________________________________
${claim.patientName}
(Authorized Patient Representative / Subscriber)
Enclosures: Attending Physician Statement, Clinical Chart Notes, Itemized CMS-1500/UB-04 Claim, EOB Denial Copy.`,
    legalCitations: [
      {
        statute: 'Federal No Surprises Act (45 CFR § 149)',
        summary: 'Prohibits balance billing for emergency services and non-participating ancillary providers at in-network facilities.',
        impact: 'Nullifies patient financial responsibility for out-of-network provider balance.',
      },
      {
        statute: 'ERISA Section 503 & 29 CFR § 2560.503-1',
        summary: 'Guarantees participants full disclosure of claims file and board-certified peer review.',
        impact: 'Forces insurer to reveal internal reviewer credentials and clinical manuals.',
      },
    ],
    doctorAttestationInstructions:
      'Have Dr. ' +
      (claim.doctorName || 'your physician') +
      ' sign a 1-page Letter of Medical Necessity confirming that alternative conservative therapies were contraindicated and immediate care was clinically mandatory.',
    submissionInstructions: {
      mailOption:
        'Send via USPS Certified Mail with Return Receipt (Form 3811) to obtain legal proof of delivery.',
      faxOption:
        'Fax directly to insurer Urgent Appeals Fax Line (available on back of member insurance card). Keep transmission confirmation receipt.',
      portalOption:
        'Upload PDF to member portal under "Submit a Grievance or Appeal" tab.',
    },
    generatedAt: new Date().toISOString(),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterData.fullLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMarkSubmitted = () => {
    setIsSubmitted(true);
    onMarkSubmitted(claim.id);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-24 text-slate-100 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          ← Back to Analysis
        </button>
        <span className="text-[11px] font-mono text-slate-400">
          Claim: <strong className="text-white">{claim.id}</strong>
        </span>
      </div>

      {/* Packet Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <FileText className="w-3 h-3 text-emerald-400" />
            <span>Formal Legal Appeal Packet</span>
          </div>

          {isSubmitted ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Submitted to Insurer
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Ready for Submission
            </span>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
          {letterData.letterSubject}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Formatted for Certified USPS Mail, Expedited Telefax, or Member Portal Upload.
        </p>

        {/* Quick Action Toolbar */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={handleCopy}
            disabled={!isPro}
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!isPro}
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* The Letter Canvas */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl font-mono text-xs text-slate-300 leading-relaxed overflow-hidden">
        {/* If user is Free tier, blur the statutory legal sections */}
        {!isPro ? (
          <div>
            <div className="text-slate-400 select-none">
              <p className="font-bold text-white mb-2">RE: FORMAL APPEAL - CLAIM #{claim.id}</p>
              <p className="mb-4">Patient: {claim.patientName} | Policy: {claim.patientPolicyNumber}</p>
              <p className="mb-4">
                STATEMENT OF APPEAL: Please accept this formal appeal regarding the adverse benefit determination for ${claim.disputedAmount.toLocaleString()}...
              </p>
            </div>

            {/* Locked Paywall Blur Overlay */}
            <div className="relative mt-4 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-teal-500/40 text-center backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Unlock Complete Legal Citation Framework
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mb-4 leading-relaxed">
                Insurers routinely ignore standard letters without formal statutory backing. ClaimClarity Pro injects ERISA § 503, ACA 45 CFR § 147.136, and Federal No Surprises Act mandates.
              </p>
              <button
                onClick={onOpenPaywall}
                className="py-3 px-6 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-1.5 mx-auto active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Unlock Full Pro Appeal Packet</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap select-text font-mono text-[11px] sm:text-xs">
            {letterData.fullLetterText}
          </div>
        )}
      </div>

      {/* Doctor Attestation Guidance */}
      {isPro && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Physician Attestation Guideline
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {letterData.doctorAttestationInstructions}
          </p>
        </div>
      )}

      {/* Submission Instructions */}
      {isPro && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            How to Submit Your Appeal
          </h3>
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              <strong className="text-white">1. Certified Mail:</strong> {letterData.submissionInstructions.mailOption}
            </p>
            <p>
              <strong className="text-white">2. Expedited Fax:</strong> {letterData.submissionInstructions.faxOption}
            </p>
            <p>
              <strong className="text-white">3. Member Portal:</strong> {letterData.submissionInstructions.portalOption}
            </p>
          </div>
        </div>
      )}

      {/* Status Tracker Button */}
      <div className="pt-2">
        {!isSubmitted ? (
          <button
            onClick={handleMarkSubmitted}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>I Sent This Appeal — Start 30-Day Response Countdown</span>
          </button>
        ) : (
          <div className="p-3.5 bg-blue-950/60 border border-blue-500/40 rounded-xl text-center">
            <span className="text-xs text-blue-300 font-semibold block">
              ✓ Appeal Marked as Submitted
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Insurer response deadline tracked in your Dashboard (30 statutory days).
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
