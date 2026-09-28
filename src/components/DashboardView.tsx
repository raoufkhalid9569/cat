import React from 'react';
import {
  ShieldAlert,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Claim } from '../types/claim';

interface DashboardViewProps {
  claims: Claim[];
  isPro: boolean;
  onSelectClaim: (claim: Claim) => void;
  onNewClaim: () => void;
  onOpenPaywall: () => void;
  onOpenCallScript: (claim?: Claim) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  claims,
  isPro,
  onSelectClaim,
  onNewClaim,
  onOpenPaywall,
  onOpenCallScript,
}) => {
  // Aggregate stats
  const totalDisputed = claims.reduce((acc, c) => acc + (c.disputedAmount || 0), 0);
  const totalSaved = claims
    .filter((c) => c.status === 'won' || c.status === 'settled')
    .reduce((acc, c) => acc + (c.savedAmount || c.disputedAmount || 0), 0);

  const activeClaims = claims.filter((c) => c.status !== 'won' && c.status !== 'settled');

  // Find nearest urgent deadline
  const urgentClaim = activeClaims
    .slice()
    .sort((a, b) => a.deadlineDaysRemaining - b.deadlineDaysRemaining)[0];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto pb-24">
      {/* Top Welcome / Hero Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Patient Appeal Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hold health insurers accountable with federal statutory appeals.
          </p>
        </div>

        {/* 1-Tap Quick Action */}
        <button
          onClick={onNewClaim}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Appeal</span>
        </button>
      </div>

      {/* Urgent Deadline Notification */}
      {urgentClaim && (
        <div
          onClick={() => onSelectClaim(urgentClaim)}
          className="relative overflow-hidden bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 cursor-pointer hover:border-amber-400/70 transition-all shadow-lg shadow-amber-950/20 group"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  {urgentClaim.deadlineDaysRemaining} Days Left
                </span>
                <span className="text-xs font-semibold text-white truncate">
                  {urgentClaim.insurerName}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                {urgentClaim.denialCategory}: Disputing{' '}
                <strong className="text-amber-300 font-mono">
                  ${urgentClaim.disputedAmount.toLocaleString()}
                </strong>
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all self-center" />
          </div>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Challenged */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Disputed Claims</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            ${totalDisputed.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {activeClaims.length} active {activeClaims.length === 1 ? 'case' : 'cases'}
          </div>
        </div>

        {/* Successfully Won */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Amount Saved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
            ${totalSaved.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            52% overturn average
          </div>
        </div>
      </div>

      {/* Pro Membership Teaser (if on Free tier) */}
      {!isPro && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-900 border border-teal-500/30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>CLAIMCLARITY PRO ADVOCACY</span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Unlock Formal ERISA § 503 Legal Appeal Packets
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Insurers rarely reverse appeals without statutory citations. Pro adds full legal
                frameworks, doctor attestation forms, and fax-ready PDF packets.
              </p>
            </div>

            <button
              onClick={onOpenPaywall}
              className="px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      {/* Active Appeals List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Your Medical Claims & Appeals
          </h2>
          <span className="text-xs text-slate-400">{claims.length} total</span>
        </div>

        <div className="space-y-2.5">
          {claims.map((claim) => {
            const isUrgent = claim.deadlineDaysRemaining <= 30;
            const isWon = claim.status === 'won';

            return (
              <div
                key={claim.id}
                onClick={() => onSelectClaim(claim)}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isWon
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : isUrgent
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-teal-500/20 border-teal-500/40 text-teal-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">
                        {claim.insurerName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isWon
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : claim.status === 'submitted'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {claim.status === 'won'
                          ? 'Won / Settled'
                          : claim.status === 'submitted'
                          ? 'Appeal Submitted'
                          : claim.status === 'appeal_generated'
                          ? 'Packet Ready'
                          : 'Analyzed'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {claim.denialCategory} · {claim.patientName}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="font-mono font-bold text-teal-300">
                        ${claim.disputedAmount.toLocaleString()}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{claim.deadlineDaysRemaining}d deadline</span>
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Patient Rights Educational Kicker */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
          <span>Patient Protection Rights Quick Sheet</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
          <p>
            <strong className="text-white">Federal No Surprises Act:</strong> Emergency services at
            any hospital cannot be billed above in-network deductible/copay rates.
          </p>
          <p>
            <strong className="text-white">ERISA § 503 Right to Records:</strong> You are legally
            entitled to copies of the clinical guidelines and names of all medical reviewers used to
            deny your claim.
          </p>
        </div>
      </div>
    </div>
  );
};
