import React, { useState } from 'react';
import { User, Sparkles, BookOpen, Trophy, ShieldAlert, ChevronRight, Check } from 'lucide-react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/sound';

interface StudentIntroModalProps {
  initialProfile?: StudentProfile;
  isEditing?: boolean;
  onSave?: (profile: Partial<StudentProfile>) => void;
  onSaveProfile?: (profile: Partial<StudentProfile>) => void;
  onClose?: () => void;
}

export const StudentIntroModal: React.FC<StudentIntroModalProps> = ({
  initialProfile,
  isEditing = false,
  onSave,
  onSaveProfile,
  onClose,
}) => {
  const [step, setStep] = useState<'form' | 'carousel'>(isEditing ? 'form' : 'form');
  const [carouselSlide, setCarouselSlide] = useState(0);

  const [name, setName] = useState(initialProfile?.name || '');
  const [roll, setRoll] = useState(initialProfile?.roll || '');
  const [group, setGroup] = useState(initialProfile?.group || 'Science');
  const [board, setBoard] = useState(initialProfile?.board || 'Dhaka');
  const [avatar, setAvatar] = useState(initialProfile?.avatar || '🧑‍🎓');

  const avatarOptions = ['🧑‍🎓', '👩‍🎓', '🧠', '🦉', '⭐', '🚀', '👑', '🔥'];

  const isFormValid = name.trim().length > 0 && roll.trim().length > 0;

  const triggerSave = (profile: Partial<StudentProfile>) => {
    if (typeof onSave === 'function') {
      onSave(profile);
    } else if (typeof onSaveProfile === 'function') {
      onSaveProfile(profile);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    soundManager.playClick();

    if (isEditing) {
      triggerSave({
        name: name.trim().slice(0, 30),
        roll: roll.trim().slice(0, 20),
        group,
        board,
        avatar,
      });
      if (onClose) onClose();
    } else {
      setStep('carousel');
    }
  };

  const handleFinishOnboarding = () => {
    soundManager.playLevelUp();
    triggerSave({
      name: name.trim().slice(0, 30),
      roll: roll.trim().slice(0, 20),
      group,
      board,
      avatar,
      joinedAt: new Date().toISOString(),
    });
    if (onClose) onClose();
  };

  const slides = [
    {
      title: 'Master All HSC Grammar Topics 📚',
      subtitle: '60 Marks Board Standard Preparation',
      description:
        'Drill deep into Voice Change, Direct/Indirect Narration, Right Form of Verbs, Completing Sentences, Modifiers, and more with instant rule explanations.',
      icon: '🏛️',
    },
    {
      title: 'Gamified Progress & Streaks 🎮',
      subtitle: 'Earn XP, Diamonds & 15+ Badges',
      description:
        'Keep your daily streak burning for 1.5x XP multipliers. Maintain 5 hearts, level up your rank, and customize your profile in the Grammar Shop.',
      icon: '💎',
    },
    {
      title: 'Track Mastery & Get Certified 🏆',
      subtitle: 'Offline-First with Full Backup & PNG Certificate',
      description:
        'Everything is stored in your browser without requiring a server. Back up your progress anytime as JSON or export your verified Certificate of Grammar Mastery!',
      icon: '📜',
    },
  ];

  return (
    <div
      id="modal-student-intro"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="glass-panel w-full max-w-lg rounded-3xl p-5 sm:p-7 border border-cyan-500/30 shadow-2xl relative my-auto animate-fade-in">
        {step === 'form' ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-5xl animate-bounce">🦉✨</div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {isEditing ? 'Edit Student Profile' : 'Welcome, Future Grammar Legend!'}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-300">
                {isEditing
                  ? 'Update your details for personalized certificate & analytics'
                  : 'Enter your details to initialize your personalized HSC Quest'}
              </p>
            </div>

            {/* Avatar picker */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-300 block">Choose Avatar</label>
              <div className="flex flex-wrap gap-2 justify-center py-1">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setAvatar(emoji);
                    }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all ${
                      avatar === emoji
                        ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800/80 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Student Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="input-student-name"
                type="text"
                maxLength={30}
                required
                placeholder="e.g. Mahir Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Roll / Student ID */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Roll / Student ID <span className="text-rose-400">*</span>
              </label>
              <input
                id="input-student-roll"
                type="text"
                maxLength={20}
                required
                placeholder="e.g. 108425"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>

            {/* Group & Board Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Academic Group</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Science">Science 🔬</option>
                  <option value="Humanities">Humanities / Arts 🎨</option>
                  <option value="Business Studies">Business Studies / Commerce 💼</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Education Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Dhaka">Dhaka Board</option>
                  <option value="Rajshahi">Rajshahi Board</option>
                  <option value="Chattogram">Chattogram Board</option>
                  <option value="Sylhet">Sylhet Board</option>
                  <option value="Barishal">Barishal Board</option>
                  <option value="Cumilla">Cumilla Board</option>
                  <option value="Jashore">Jashore Board</option>
                  <option value="Mymensingh">Mymensingh Board</option>
                  <option value="Dinajpur">Dinajpur Board</option>
                  <option value="Madrasah">Madrasah / Technical</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex gap-2">
              {isEditing && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
              )}
              <button
                id="btn-submit-intro"
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{isEditing ? 'Save Profile' : 'Start Learning 🚀'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* 3-Slide Carousel */
          <div className="space-y-6 text-center">
            <div className="text-6xl animate-bounce">{slides[carouselSlide].icon}</div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Step {carouselSlide + 1} of {slides.length}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {slides[carouselSlide].title}
              </h2>
              <h3 className="text-xs sm:text-sm font-semibold text-violet-300">
                {slides[carouselSlide].subtitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {slides[carouselSlide].description}
              </p>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-1.5">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    carouselSlide === i ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="w-1/3 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 text-xs font-semibold"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  if (carouselSlide + 1 < slides.length) {
                    setCarouselSlide((prev) => prev + 1);
                  } else {
                    handleFinishOnboarding();
                  }
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <span>{carouselSlide + 1 < slides.length ? 'Continue' : 'Begin My Quest!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
