import React, { useState } from 'react';
import confetti from 'canvas-confetti';
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
  const [step, setStep] = useState<'form' | 'carousel'>('form');
  const [carouselSlide, setCarouselSlide] = useState(0);

  const [name, setName] = useState(initialProfile?.name || '');
  const [roll, setRoll] = useState(initialProfile?.roll || '');
  const [group, setGroup] = useState(initialProfile?.group || 'Science');
  const [board, setBoard] = useState(initialProfile?.board || 'Dhaka');
  const [avatar, setAvatar] = useState(initialProfile?.avatar || '🧑‍🎓');
  const [gender, setGender] = useState<'male' | 'female' | null>(
    initialProfile?.gender === 'male' || initialProfile?.gender === 'female'
      ? initialProfile.gender
      : null
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const avatarOptions = ['🧑‍🎓', '👩‍🎓', '🧠', '🦉', '⭐', '🚀', '👑', '🔥'];

  const isFormValid = name.trim().length > 0 && roll.trim().length > 0 && gender !== null;

  const triggerSave = (profile: Partial<StudentProfile>) => {
    if (typeof onSave === 'function') {
      onSave(profile);
    } else if (typeof onSaveProfile === 'function') {
      onSaveProfile(profile);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isFormValid || gender === null) return;
    soundManager.playClick();

    if (isEditing) {
      triggerSave({
        name: name.trim().slice(0, 30),
        roll: roll.trim().slice(0, 20),
        group,
        board,
        avatar,
        gender,
      });
      if (onClose) onClose();
    } else {
      setStep('carousel');
    }
  };

  const handleFinishOnboarding = () => {
    soundManager.playLevelUp();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    triggerSave({
      name: name.trim().slice(0, 30),
      roll: roll.trim().slice(0, 20),
      group,
      board,
      avatar,
      gender,
      joinedAt: new Date().toISOString(),
    });
    if (onClose) onClose();
  };

  const slides = [
    {
      title: 'Master All HSC Grammar Topics 📚',
      subtitle: '60 Marks Board Standard Preparation',
      description:
        'Drill deep into Voice Change, Direct/Indirect Narration, Right Form of Verbs, Completing Sentences, Modifiers, and more with instant formula breakdowns.',
      icon: '🏛️',
      isCredit: false,
    },
    {
      title: '20 Diamonds Welcome Bonus! 💎',
      subtitle: 'Earn XP, Diamonds & 15+ Badges',
      description:
        'You start with 20 💎 to exchange for 20 ❤️ hearts or 💡 50/50 hints in the shop. Keep your daily streak burning for 1.5x XP multipliers and level up your rank!',
      icon: '🎁',
      isCredit: false,
    },
    {
      title: 'Track Mastery & Get Certified 🏆',
      subtitle: 'Offline-First with Full Backup & PNG Certificate',
      description:
        'Everything is stored in your browser without requiring a server. Back up your progress anytime as JSON or export your verified Certificate of Grammar Mastery!',
      icon: '📜',
      isCredit: false,
    },
    {
      title: 'Made with ❤️ by ARHAM',
      subtitle: 'Crafted to help HSC students conquer grammar.',
      description:
        'Engineered for Bangladesh Higher Secondary Certificate students across all boards with official NCTB curriculum precision.',
      icon: '❤️',
      isCredit: true,
    },
  ];

  return (
    <div
      id="modal-student-intro"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg rounded-2xl p-5 sm:p-6 border border-white/[0.08] bg-[#0f172a] shadow-2xl relative my-auto animate-fade-in">
        {step === 'form' ? (
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-2xl flex items-center justify-center mx-auto mb-1">
                🦉
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isEditing ? 'Edit Student Profile' : 'Welcome to Gramify!'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update your details for personalized certificate & analytics'
                  : 'Enter your details to initialize your Grammar Quest'}
              </p>
            </div>

            {/* Avatar picker */}
            <div className="space-y-1 pt-0.5">
              <label className="text-xs font-semibold text-slate-300 block">Choose Avatar</label>
              <div className="flex flex-wrap gap-1.5 justify-center py-0.5">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setAvatar(emoji);
                    }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                      avatar === emoji
                        ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-105'
                        : 'bg-slate-800/80 border border-white/[0.06] hover:bg-slate-700'
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
                Student Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="input-student-name"
                type="text"
                maxLength={30}
                required
                placeholder="e.g. Albert Arham"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/[0.08] text-white text-xs sm:text-sm font-normal focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Roll / Student ID */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Roll / Student ID <span className="text-red-400">*</span>
              </label>
              <input
                id="input-student-roll"
                type="text"
                maxLength={20}
                required
                placeholder="e.g. 108425"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
            </div>

            {/* Gender Selector (2 Options Only: Male & Female) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Gender <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'male', label: 'Male', emoji: '🚹' },
                  { value: 'female', label: 'Female', emoji: '🚺' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setGender(opt.value as 'male' | 'female');
                    }}
                    className={`
                      flex flex-col items-center justify-center gap-1
                      p-3 rounded-xl border transition-all
                      text-xs sm:text-sm font-semibold
                      ${
                        gender === opt.value
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-sm'
                          : 'border-white/[0.08] bg-slate-800/60 text-slate-300 hover:border-slate-600 active:scale-95'
                      }
                    `}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              {gender === null && submitAttempted && (
                <p className="text-xs text-red-400 mt-1">Please select your gender to continue.</p>
              )}
            </div>

            {/* Group & Board Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Academic Group</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Science">Science</option>
                  <option value="Humanities">Humanities / Arts</option>
                  <option value="Business Studies">Business Studies / Commerce</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Education Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-white/[0.08] text-white text-xs focus:outline-none focus:border-cyan-400"
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
            <div className="pt-2 flex gap-2">
              {isEditing && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                id="btn-submit-intro"
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isFormValid
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{isEditing ? 'Save Profile' : 'Start Learning 🚀'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* 4-Slide Carousel */
          <div className="space-y-4 text-center">
            {slides[carouselSlide].isCredit ? (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-cyan-500/30 text-center space-y-2 animate-fade-in">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-2xl flex items-center justify-center mx-auto">
                  ❤️
                </div>
                <h2 className="text-lg font-bold text-white">
                  Made with ❤️ by ARHAM
                </h2>
                <h3 className="text-xs font-semibold text-cyan-400">
                  {slides[carouselSlide].subtitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  {slides[carouselSlide].description}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-3xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                  {slides[carouselSlide].icon}
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                    Step {carouselSlide + 1} of {slides.length}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    {slides[carouselSlide].title}
                  </h2>
                  <h3 className="text-xs font-semibold text-cyan-300">
                    {slides[carouselSlide].subtitle}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pt-0.5 max-w-sm mx-auto">
                    {slides[carouselSlide].description}
                  </p>
                </div>
              </div>
            )}

            {/* Carousel Dots */}
            <div className="flex justify-center gap-1.5 pt-1">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    carouselSlide === i ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              {carouselSlide < slides.length - 1 && (
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-1/3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 text-xs font-semibold transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                type="button"
                id="btn-onboarding-continue"
                onClick={() => {
                  soundManager.playClick();
                  if (carouselSlide + 1 < slides.length) {
                    setCarouselSlide((prev) => prev + 1);
                  } else {
                    handleFinishOnboarding();
                  }
                }}
                className="flex-1 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <span>{carouselSlide === slides.length - 1 ? "Let's Go 🚀" : 'Continue'}</span>
                {carouselSlide < slides.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
