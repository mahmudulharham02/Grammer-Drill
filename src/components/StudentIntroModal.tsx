import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Sparkles,
  ChevronRight,
  User,
  Star,
  Rocket,
  Crown,
  Flame,
  Lightbulb,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/sound';
import { AVATAR_OPTIONS, AvatarId } from './AvatarIcon';

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
  const [avatar, setAvatar] = useState<string>(initialProfile?.avatar || 'cap');
  const [gender, setGender] = useState<'male' | 'female' | null>(
    initialProfile?.gender === 'male' || initialProfile?.gender === 'female'
      ? initialProfile.gender
      : null
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);

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
      title: 'Master All HSC Grammar Topics',
      subtitle: '60 Marks Board Standard Preparation',
      description:
        'Drill deep into Voice Change, Direct/Indirect Narration, Right Form of Verbs, Completing Sentences, Modifiers, and more with instant formula breakdowns.',
      icon: BookOpen,
      isCredit: false,
    },
    {
      title: '20 Diamonds Welcome Bonus',
      subtitle: 'Earn XP, Diamonds & 15+ Badges',
      description:
        'You start with 20 Diamonds to exchange for Hearts or 50/50 hints in the shop. Keep your daily streak burning for 1.5x XP multipliers and level up your rank!',
      icon: Sparkles,
      isCredit: false,
    },
    {
      title: 'Track Mastery & Get Certified',
      subtitle: 'Offline-First with Full Backup & PNG Certificate',
      description:
        'Everything is stored in your browser without requiring a server. Back up your progress anytime as JSON or export your verified Certificate of Grammar Mastery!',
      icon: Trophy,
      isCredit: false,
    },
    {
      title: 'Crafted by ARHAM',
      subtitle: 'Engineered for Bangladesh HSC Students',
      description:
        'Built for Higher Secondary Certificate students across all education boards with official NCTB curriculum precision.',
      icon: GraduationCap,
      isCredit: true,
    },
  ];

  return (
    <div
      id="modal-student-intro"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-[420px] sm:max-w-[480px] rounded-[16px] p-6 border border-white/[0.08] bg-[#1e293b] shadow-2xl relative my-auto animate-fade-in select-none">
        {step === 'form' ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto mb-2 text-[#0ea5e9]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-[20px] font-bold text-[#f8fafc] leading-tight">
                {isEditing ? 'Edit Student Profile' : 'Welcome to Gramify'}
              </h2>
              <p className="text-[12px] text-[#94a3b8] leading-tight truncate">
                {isEditing
                  ? 'Update your details for personalized certificate & analytics'
                  : 'Enter your details to initialize your Grammar Quest'}
              </p>
            </div>

            {/* Avatar picker (8 flat icon circular buttons) */}
            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-[#f8fafc] uppercase tracking-wider block">
                Choose Avatar
              </label>
              <div className="flex items-center justify-center gap-2 flex-wrap py-0.5">
                {AVATAR_OPTIONS.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected =
                    avatar === opt.id ||
                    (opt.id === 'cap' && (avatar === '🧑‍🎓' || avatar === '👩‍🎓')) ||
                    (opt.id === 'lightbulb' && avatar === '🧠') ||
                    (opt.id === 'owl' && avatar === '🦉') ||
                    (opt.id === 'star' && avatar === '⭐') ||
                    (opt.id === 'rocket' && avatar === '🚀') ||
                    (opt.id === 'crown' && avatar === '👑') ||
                    (opt.id === 'flame' && avatar === '🔥');

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      title={opt.label}
                      onClick={() => {
                        soundManager.playClick();
                        setAvatar(opt.id);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0ea5e9] text-white border-2 border-[#0ea5e9] shadow-sm scale-105'
                          : 'bg-transparent text-[#0ea5e9] border border-white/15 hover:border-[#0ea5e9]/50 hover:bg-[#0ea5e9]/10'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#f8fafc] block">
                Student Full Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                id="input-student-name"
                type="text"
                maxLength={30}
                required
                placeholder="e.g. Albert Arham"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
              />
            </div>

            {/* Roll / Student ID */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#f8fafc] block">
                Roll / Student ID <span className="text-[#ef4444]">*</span>
              </label>
              <input
                id="input-student-roll"
                type="text"
                maxLength={20}
                required
                placeholder="e.g. 108425"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] font-mono placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
              />
            </div>

            {/* Gender Selector (2 Options Only: Male & Female) */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#f8fafc] block">
                Gender <span className="text-[#ef4444]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-gender-male"
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGender('male');
                  }}
                  className={`h-[56px] rounded-xl border flex items-center justify-center gap-2.5 px-3 transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#f8fafc]'
                      : 'border-white/10 bg-transparent text-[#94a3b8] hover:border-white/20 hover:text-[#f8fafc]'
                  }`}
                >
                  <User className="w-5 h-5 text-[#0ea5e9]" />
                  <span className="text-[14px] font-medium text-[#f8fafc]">Male</span>
                </button>

                <button
                  id="btn-gender-female"
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGender('female');
                  }}
                  className={`h-[56px] rounded-xl border flex items-center justify-center gap-2.5 px-3 transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'border-[#0ea5e9] bg-[#0ea5e9]/10 text-[#f8fafc]'
                      : 'border-white/10 bg-transparent text-[#94a3b8] hover:border-white/20 hover:text-[#f8fafc]'
                  }`}
                >
                  <User className="w-5 h-5 text-[#0ea5e9]" />
                  <span className="text-[14px] font-medium text-[#f8fafc]">Female</span>
                </button>
              </div>
              {gender === null && submitAttempted && (
                <p className="text-[12px] text-[#ef4444] mt-1">Please select your gender to continue.</p>
              )}
            </div>

            {/* Group & Board Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#f8fafc] block">Academic Group</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all cursor-pointer"
                >
                  <option value="Science">Science</option>
                  <option value="Humanities">Humanities / Arts</option>
                  <option value="Business Studies">Business Studies / Commerce</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#f8fafc] block">Education Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]/50 focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all cursor-pointer"
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
            <div className="pt-2 flex gap-3">
              {isEditing && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 h-[48px] rounded-xl bg-slate-800 hover:bg-slate-700 text-[#94a3b8] hover:text-[#f8fafc] font-semibold text-[14px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                id="btn-submit-intro"
                type="submit"
                disabled={!isFormValid}
                className="flex-1 h-[48px] rounded-xl font-semibold text-[14px] bg-[#0ea5e9] hover:bg-[#0284c7] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0ea5e9] shadow-md cursor-pointer"
              >
                <span>{isEditing ? 'Save Profile' : 'Start Learning'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* 4-Slide Carousel */
          <div className="space-y-4 text-center">
            {slides[carouselSlide].isCredit ? (
              <div className="p-4 rounded-xl bg-[#0f172a] border border-white/[0.08] text-center space-y-2 animate-fade-in">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto text-[#0ea5e9]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-[20px] font-bold text-[#f8fafc]">
                  {slides[carouselSlide].title}
                </h2>
                <h3 className="text-[12px] font-semibold text-[#0ea5e9]">
                  {slides[carouselSlide].subtitle}
                </h3>
                <p className="text-[12px] text-[#94a3b8] leading-relaxed max-w-sm mx-auto">
                  {slides[carouselSlide].description}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto mb-2 text-[#0ea5e9]">
                  {React.createElement(slides[carouselSlide].icon, { className: 'w-6 h-6' })}
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0ea5e9] font-mono">
                    Step {carouselSlide + 1} of {slides.length}
                  </span>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-[#f8fafc]">
                    {slides[carouselSlide].title}
                  </h2>
                  <h3 className="text-[12px] font-semibold text-[#0ea5e9]">
                    {slides[carouselSlide].subtitle}
                  </h3>
                  <p className="text-[12px] text-[#94a3b8] leading-relaxed pt-0.5 max-w-sm mx-auto">
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
                    carouselSlide === i ? 'w-6 bg-[#0ea5e9]' : 'w-2 bg-[#334155]'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              {carouselSlide < slides.length - 1 && (
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-1/3 h-[44px] rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[#94a3b8] text-xs font-semibold transition-colors cursor-pointer"
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
                className="flex-1 h-[44px] rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{carouselSlide === slides.length - 1 ? 'Start Learning' : 'Continue'}</span>
                {carouselSlide < slides.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
