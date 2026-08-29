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
      <div className="glass-panel max-w-lg w-full rounded-3xl p-6 sm:p-8 text-center space-y-6 border-cyan-500/30 shadow-2xl">
        <div className="text-6xl animate-bounce">{currentSlide.icon}</div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Step {slide + 1} of {slides.length}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {currentSlide.title}
          </h2>
          <h3 className="text-xs sm:text-sm font-semibold text-violet-300">
            {currentSlide.subtitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            {currentSlide.body}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-1.5 pt-2">
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
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{slide + 1 < slides.length ? 'Continue' : 'Begin My Quest!'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
