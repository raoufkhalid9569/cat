import React from 'react';
import { Home, PlusCircle, PhoneCall, Archive, UserCheck } from 'lucide-react';

export type NavTab = 'dashboard' | 'new_claim' | 'call_script' | 'history' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  activeClaimsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  activeClaimsCount,
}) => {
  return (
    <nav className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'dashboard'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onChangeTab('new_claim')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'new_claim'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <PlusCircle className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full animate-ping" />
          </div>
          <span className="text-[10px]">Appeal</span>
        </button>

        <button
          onClick={() => onChangeTab('call_script')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'call_script'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Negotiate</span>
        </button>

        <button
          onClick={() => onChangeTab('history')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors relative ${
            activeTab === 'history'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Archive className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Cases</span>
          {activeClaimsCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-teal-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeClaimsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onChangeTab('settings')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'settings'
              ? 'text-teal-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Plan</span>
        </button>
      </div>
    </nav>
  );
};
