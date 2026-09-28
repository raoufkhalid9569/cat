import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  isMobileFrameMode: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isMobileFrameMode,
}) => {
  if (!isMobileFrameMode) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 sm:p-6 lg:p-10 select-none">
      {/* Mobile Device Enclosure */}
      <div className="relative w-full max-w-[420px] h-[100dvh] sm:h-[860px] bg-slate-950 sm:rounded-[52px] sm:border-[10px] sm:border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col">
        {/* Dynamic Island (Desktop Mockup) */}
        <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 items-center justify-between px-2.5 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-teal-500/80 animate-pulse" />
        </div>

        {/* Inner Screen Content */}
        <div className="flex-1 overflow-y-auto flex flex-col relative select-text">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="hidden sm:flex justify-center pb-2 pt-1 bg-slate-900/90 backdrop-blur-md">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
