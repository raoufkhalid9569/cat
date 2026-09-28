import React, { useState } from 'react';
import { ShieldCheck, FileText, ArrowRight, Award, CheckCircle2, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSample: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartSample,
}) => {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-teal-400" />,
      tag: 'THE BILLING CRISIS',
      title: 'Over 52% of Medical Denials Win on Appeal',
      description:
        'In the US, health insurers deny over 200 million claims each year. Shockingly, 86% of patients never appeal because the letters are confusing and intimidating.',
      stat: '52% Won',
      statLabel: 'of formal patient appeals overturn insurer rejections',
    },
    {
      icon: <FileText className="w-12 h-12 text-emerald-400" />,
      tag: 'AI PATIENT ADVOCACY',
      title: 'Turn Opaque CPT Codes Into Legal Leverage',
      description:
        'Upload your denial notice or EOB. ClaimClarity translates complex billing jargon and detects statutory violations under the Federal No Surprises Act, ERISA § 503, and the ACA.',
      stat: '$3,200',
      statLabel: 'average unfair balance bill overturned per member',
    },
    {
      icon: <Award className="w-12 h-12 text-amber-400" />,
      tag: 'FAST RESOLUTION',
      title: 'Certified Appeal Packets Ready in Minutes',
      description:
        'Get a formal legal appeal letter, doctor attestation checklist, certified mail instructions, and a word-for-word phone negotiation guide to hold your insurer accountable.',
      stat: '3 Mins',
      statLabel: 'to prepare a comprehensive, regulation-backed appeal',
    },
  ];

  const current = slides[slide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col justify-between overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Tag */}
        <div className="mb-4">
          <span className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
            {current.tag}
          </span>
        </div>

        {/* Visual Icon & Content */}
        <div className="flex flex-col items-center text-center my-2">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-5 shadow-inner">
            {current.icon}
          </div>
          <h2 className="text-xl font-bold text-white mb-2 leading-snug">
            {current.title}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mb-6">
            {current.description}
          </p>

          {/* Metric Highlight Box */}
          <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-center gap-3">
            <div className="text-xl font-extrabold text-teal-400 font-mono">
              {current.stat}
            </div>
            <div className="text-[11px] text-slate-400 text-left leading-tight">
              {current.statLabel}
            </div>
          </div>
        </div>

        {/* Step Indicator & Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
          {/* Dots */}
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  slide === idx ? 'w-6 bg-teal-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Action button */}
          {slide < slides.length - 1 ? (
            <button
              onClick={() => setSlide((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onStartSample();
                }}
                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-md shadow-teal-500/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Test Live Demo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
