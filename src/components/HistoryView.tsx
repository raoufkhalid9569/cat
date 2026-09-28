import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Clock,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Plus,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Claim, ClaimStatus } from '../types/claim';

interface HistoryViewProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
  onNewClaim: () => void;
  onDeleteClaim: (claimId: string) => void;
  onUpdateStatus: (claimId: string, status: ClaimStatus, savedAmount?: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  claims,
  onSelectClaim,
  onNewClaim,
  onDeleteClaim,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.insurerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.denialCategory.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'won') return claim.status === 'won' || claim.status === 'settled';
    if (filterStatus === 'active') return claim.status !== 'won' && claim.status !== 'settled';
    if (filterStatus === 'submitted') return claim.status === 'submitted';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto pb-24 text-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Case Archive & History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track status, appeal timelines, and saved medical expenses.
          </p>
        </div>

        <button
          onClick={onNewClaim}
          className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Claim</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search insurer, patient, or category..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Cases' },
          { id: 'active', label: 'In Progress' },
          { id: 'submitted', label: 'Submitted' },
          { id: 'won', label: 'Overturned / Won' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === tab.id
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl">
          <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">No matching claims found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search filters or start a new medical bill appeal.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClaims.map((claim) => {
            const isWon = claim.status === 'won' || claim.status === 'settled';

            return (
              <div
                key={claim.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all space-y-3"
              >
                <div
                  onClick={() => onSelectClaim(claim)}
                  className="cursor-pointer flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-white">{claim.insurerName}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isWon
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : claim.status === 'submitted'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isWon
                          ? 'Won / Overturned'
                          : claim.status === 'submitted'
                          ? 'Appeal Submitted'
                          : 'Packet Ready'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {claim.patientName} · {claim.denialCategory}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-teal-300 text-sm block">
                      ${claim.disputedAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {claim.deadlineDaysRemaining}d remaining
                    </span>
                  </div>
                </div>

                {/* Action Bar for Status Updating */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {!isWon ? (
                      <button
                        onClick={() => onUpdateStatus(claim.id, 'won', claim.disputedAmount)}
                        className="px-2.5 py-1 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Mark Overturned / Won</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Saved ${claim.disputedAmount.toLocaleString()}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectClaim(claim)}
                      className="text-slate-400 hover:text-white text-[11px] flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteClaim(claim.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete Claim"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
