import React, { useState } from 'react';
import { Sparkles, ChevronRight, Check } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface OnboardingModalProps {
  onFinish: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onFinish }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to Gramify! 🚀',
      subtitle: 'Official 60-Mark Bangladesh HSC Syllabus Master',
      body: 'Master all 10 core grammar topics including Voice Change, Narration, 16 Affirmative/Negative Rules, Complex clauses, and Modifiers with instant feedback.',
      icon: '🏛️',
    },
    {
      title: 'Gamified Progress & Streaks 🔥',
      subtitle: 'Earn XP, Diamonds, Badges & Titles',
      body: 'Keep your daily practice streak alive for 1.5x XP multipliers. Maintain 5 hearts, level up your rank, and claim badges as you master topics.',
      icon: '💎',
    },
    {
      title: 'Offline & Local Storage ⚡',
      subtitle: 'Zero Sign-In Required',
      body: 'Everything is stored safely in your browser. Export JSON backups anytime or generate your official printable Certificate of Grammar Mastery!',
      icon: '📜',
    },
  ];

  const currentSlide = slides[slide];

  const handleNext = () => {
    soundManager.playClick();
    if (slide + 1 < slides.length) {
      setSlide(slide + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div
      id="modal-onboarding"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="w-full max-w-md rounded-2xl p-5 sm:p-6 text-center space-y-4 border border-white/[0.08] bg-[#0f172a] shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-3xl flex items-center justify-center mx-auto shadow-sm">
          {currentSlide.icon}
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Step {slide + 1} of {slides.length}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {currentSlide.title}
          </h2>
          <h3 className="text-xs sm:text-sm font-semibold text-cyan-300">
            {currentSlide.subtitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed pt-1 max-w-sm mx-auto">
            {currentSlide.body}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 pt-1">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                slide === i ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>{slide + 1 < slides.length ? 'Continue' : 'Begin My Quest!'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
