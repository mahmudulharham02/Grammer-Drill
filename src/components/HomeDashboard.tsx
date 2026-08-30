import React from 'react';
import {
  Sparkles,
  Zap,
  Flame,
  Award,
  ChevronRight,
  BookOpen,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Download,
  Lightbulb,
  Lock,
  Crown,
  Heart,
  RotateCcw,
  TrendingDown,
  Play,
  Star,
  Compass,
  Shuffle,
  Sliders,
  HelpCircle,
  Hash
} from 'lucide-react';
import { AppState, TopicProgressItem, CurrentDrillSession } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { getXpRequiredForLevel } from '../data/badges';
import { soundManager } from '../utils/sound';
import { Mascot } from './Mascot';
import { CacheWarningBanner } from './CacheWarningBanner';
import { LowHeartsBanner } from './LowHeartsBanner';
import { AuthTeaserCard } from './AuthTeaserCard';
import { RuleOfTheDayCard } from './RuleOfTheDayCard';
import {
  getMasteryTier,
  getWeakestSubModule,
  getCurrentDrillSession,
  WeakSpotInfo
} from '../utils/storage';

interface HomeDashboardProps {
  state: AppState;
  onNavigate: (route: string, params?: { topicId?: string; subtopicId?: string }) => void;
  onStartDailyChallenge: () => void;
  onStartSmartPractice?: (weakSpot: WeakSpotInfo) => void;
  onResumeDrillSession?: (session: CurrentDrillSession) => void;
  onOpenRules: () => void;
  onOpenCertificate: () => void;
  onOpenHeartsShop: () => void;
  onExportBackup: () => void;
  onDismissCacheWarning: () => void;
}

export function getDashboardTopicIcon(topicId: string) {
  switch (topicId) {
    case 'changing_sentences':
      return <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />;
    case 'articles':
      return <BookOpen className="w-4 h-4 text-cyan-400" />;
    case 'preposition':
      return <Compass className="w-4 h-4 text-cyan-400" />;
    case 'completing_sentences':
      return <Sparkles className="w-4 h-4 text-cyan-400" />;
    case 'right_form_of_verbs':
      return <Zap className="w-4 h-4 text-cyan-400" />;
    case 'connectors':
      return <Layers className="w-4 h-4 text-violet-400" />;
    case 'synonyms_antonyms':
      return <Shuffle className="w-4 h-4 text-violet-400" />;
    case 'punctuation':
      return <Hash className="w-4 h-4 text-cyan-400" />;
    case 'modifiers':
      return <Sliders className="w-4 h-4 text-violet-400" />;
    case 'tag_questions_and_special':
      return <HelpCircle className="w-4 h-4 text-violet-400" />;
    default:
      return <BookOpen className="w-4 h-4 text-cyan-400" />;
  }
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  state,
  onNavigate,
  onStartDailyChallenge,
  onStartSmartPractice,
  onResumeDrillSession,
  onOpenRules,
  onOpenCertificate,
  onOpenHeartsShop,
  onExportBackup,
  onDismissCacheWarning,
}) => {
  const requiredXP = getXpRequiredForLevel(state.level);
  const xpProgressPercent = Math.min(100, Math.round((state.xp / requiredXP) * 100));

  const todayStr = new Date().toISOString().split('T')[0];
  const isDailyCompletedToday = state.dailyChallenge.lastCompletedDate === todayStr;

  const currentSavedSession = state.currentDrillSession || getCurrentDrillSession();
  const weakestSubModule = getWeakestSubModule(state);
  const isZeroHearts = state.hearts <= 0;

  const greeting =
    state.user.gender === 'female'
      ? `Welcome, ${state.user.name || 'Grammar Hero'}!`
      : `Welcome, ${state.user.name || 'Grammar Hero'}!`;

  const scrollToRules = () => {
    soundManager.playClick();
    const el = document.getElementById('card-rule-of-the-day');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home-dashboard-container" className="space-y-5 sm:space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Auth Teaser Notification (first visit only) */}
      <AuthTeaserCard />

      {/* Low Hearts Banner */}
      <LowHeartsBanner
        hearts={state.hearts}
        maxHearts={state.maxHearts}
        diamonds={state.diamonds}
        onOpenShop={onOpenHeartsShop}
      />

      {/* Cache Warning Banner (Collapsible) */}
      {!state.settings.cacheWarningDismissed && (
        <CacheWarningBanner
          onExport={onExportBackup}
          onDismiss={onDismissCacheWarning}
        />
      )}

      {/* ========================================================================= */}
      {/* FIX 1 — TOP PRIORITY CARD (DASHBOARD HIERARCHY: ONE CLEAR NEXT ACTION)     */}
      {/* ========================================================================= */}

      {/* PRIORITY 1: ZERO HEARTS */}
      {isZeroHearts ? (
        <div
          id="priority-card-zero-hearts"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border-2 border-rose-500 animate-pulse p-5 sm:p-6 shadow-2xl shadow-rose-500/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30 inline-block mb-1">
                  Action Required
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Out of Hearts! Refill to Continue
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  You need hearts to answer practice questions. Trade diamonds, watch a clip, or wait for auto-refill.
                </p>
              </div>
            </div>

            <button
              id="btn-priority-refill-hearts"
              type="button"
              onClick={() => {
                soundManager.playClick();
                onOpenHeartsShop();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
            >
              <span>Refill Hearts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : currentSavedSession && currentSavedSession.currentQuestionIndex < currentSavedSession.totalQuestions ? (
        /* PRIORITY 2: CONTINUE DRILL SESSION */
        <div
          id="priority-card-continue-drill"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border-2 border-cyan-400 p-5 sm:p-6 shadow-2xl shadow-cyan-500/15"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0">
                <RotateCcw className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 inline-block mb-1">
                  Continue Where You Left Off
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {currentSavedSession.title}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  You were drilling this module — {currentSavedSession.currentQuestionIndex} of {currentSavedSession.totalQuestions} questions completed.
                </p>
              </div>
            </div>

            <button
              id="btn-priority-resume-drill"
              type="button"
              onClick={() => {
                soundManager.playClick();
                if (onResumeDrillSession) {
                  onResumeDrillSession(currentSavedSession);
                } else {
                  onNavigate('game', {
                    topicId: currentSavedSession.topicId,
                    subtopicId: currentSavedSession.subtopicId || currentSavedSession.subModuleId,
                  });
                }
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 shrink-0 hover:scale-105 active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Resume Drill</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : weakestSubModule && weakestSubModule.accuracy < 60 ? (
        /* PRIORITY 3: SMART PRACTICE (WEAK SPOT DETECTED < 60%) */
        <div
          id="priority-card-smart-practice"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950/50 via-slate-900 to-slate-950 border-2 border-violet-500/80 p-5 sm:p-6 shadow-2xl shadow-violet-500/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/40 shrink-0">
                <TrendingDown className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-300 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-500/30">
                    Smart Practice · Weak Spot Detected
                  </span>
                  <span className="text-[11px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                    {weakestSubModule.accuracy}% Accuracy
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Drill {weakestSubModule.subModuleName}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your accuracy on this module is {weakestSubModule.accuracy}%. Tap to take a quick 10-question weak spot drill and boost your mastery.
                </p>
              </div>
            </div>

            <button
              id="btn-priority-start-smart-practice"
              type="button"
              onClick={() => {
                soundManager.playClick();
                if (onStartSmartPractice) {
                  onStartSmartPractice(weakestSubModule);
                } else {
                  onNavigate('game', { topicId: weakestSubModule.topicId, subtopicId: weakestSubModule.subModuleId });
                }
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 shrink-0 hover:scale-105 active:scale-95 transition-transform"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Drill 10 Questions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : !isDailyCompletedToday ? (
        /* PRIORITY 4: DAILY CHALLENGE */
        <div
          id="priority-card-daily-challenge"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/70 p-5 sm:p-6 shadow-2xl shadow-amber-500/15"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                <Calendar className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 inline-block mb-1">
                  Daily Habit · Streak: {state.streak} Days 🔥
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Today's 10-Topic Board Challenge
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  1 question from each syllabus topic. Earn +50 XP bonus, 5 💎 coins, and keep your daily streak alive!
                </p>
              </div>
            </div>

            <button
              id="btn-priority-start-daily"
              type="button"
              onClick={() => {
                soundManager.playClick();
                onStartDailyChallenge();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 shrink-0 hover:scale-105 active:scale-95 transition-transform"
            >
              <Flame className="w-4 h-4 fill-black" />
              <span>Start Challenge</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* PRIORITY 5: WELCOME BACK & LEVEL STATUS */
        <section
          id="hero-profile-banner"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-900/95 border border-cyan-500/20 p-5 sm:p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('profile');
                }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-slate-800 border-2 border-cyan-400/50 shadow-xl cursor-pointer hover:scale-105 transition-transform shrink-0"
              >
                <span>{state.user.avatar || '🧑‍🎓'}</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {greeting}
                </h1>
                <p className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Level {state.level} • {state.user.title || 'Apprentice'}</span>
                  <span className="text-slate-400 text-xs hidden sm:inline">
                    • Streak: {state.streak} Days 🔥
                  </span>
                </p>

                {/* Level XP Progress Bar */}
                <div className="pt-1 w-48 sm:w-60">
                  <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                    <span>Level Progress</span>
                    <span className="font-mono text-cyan-300">
                      {state.xp} / {requiredXP} XP
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${xpProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t border-slate-800/80 md:border-t-0">
              <button
                id="hero-btn-rule-tips"
                type="button"
                onClick={scrollToRules}
                className="px-3.5 py-2.5 rounded-xl bg-violet-950/70 border border-violet-500/30 hover:border-violet-400 text-violet-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Lightbulb className="w-3.5 h-3.5 text-violet-400" />
                <span>Today's Rule</span>
              </button>

              <button
                id="hero-btn-continue-drill"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('practice_hub');
                }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Drill Center</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SMART PRACTICE CARD (ADAPTIVE WEAK-SPOT DRILLING)                         */}
      {/* ========================================================================= */}
      <section id="smart-practice-section">
        {weakestSubModule ? (
          <div
            id="card-smart-practice-active"
            onClick={() => {
              soundManager.playClick();
              if (onStartSmartPractice) {
                onStartSmartPractice(weakestSubModule);
              } else {
                onNavigate('game', { topicId: weakestSubModule.topicId, subtopicId: weakestSubModule.subModuleId });
              }
            }}
            className="rounded-3xl bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-900 border border-violet-500/40 p-5 sm:p-6 shadow-xl cursor-pointer hover:border-violet-400 hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-extrabold uppercase tracking-wider">
                    ⚡ Smart Practice
                  </span>
                  <span className="text-xs font-mono text-rose-400 font-bold">
                    {weakestSubModule.accuracy}% Accuracy
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  Weakest Area: {weakestSubModule.subModuleName}
                </h3>
                <p className="text-xs text-slate-300">
                  Based on your {weakestSubModule.totalAttempts} past attempts, this is currently your lowest-scoring module. Tap to drill 10 targeted questions.
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-violet-600/30 flex items-center gap-1.5 shrink-0 group-hover:scale-105 transition-transform"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Start Smart Drill</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            id="card-smart-practice-disabled"
            className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-5 sm:p-6 text-left"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    Smart Practice
                  </span>
                  <span className="text-xs text-slate-400">Needs 5+ Attempts</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-300">
                  Adaptive Weak-Spot Drilling
                </h3>
                <p className="text-xs text-slate-400">
                  Complete a few drills across grammar topics and Gramify will automatically identify and target your weak spots here.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('practice_hub');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
              >
                <span>Browse Drills</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Feature Spotlight: Last Hour Prep Test (Board Exam Simulator) */}
      <section id="last-hour-prep-card-section">
        {state.level >= 2 ? (
          <div
            id="card-last-hour-prep-unlocked"
            onClick={() => {
              soundManager.playClick();
              onNavigate('last_hour_prep');
            }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/70 p-5 sm:p-6 shadow-2xl shadow-amber-500/10 cursor-pointer hover:border-amber-400 hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 -mb-12 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold tracking-wider uppercase">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Level 2 Unlocked · Board Exam Simulator</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-bold">
                    60 Marks · 90 Min
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>Last Hour Prep Test</span>
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Full mock HSC English 2nd Paper Grammar exam. 90 questions (60 marks) from all 10 topics, 90-minute live timer, no hints, predicted grade, and deep section breakdown.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t border-slate-800/80 md:border-t-0 shrink-0">
                <div className="text-left md:text-right hidden sm:block">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Board Coverage</span>
                  <span className="text-xs font-extrabold text-amber-400 font-mono">10 Topics (100%)</span>
                </div>

                <button
                  type="button"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 group-hover:scale-105 transition-transform"
                >
                  <Flame className="w-4 h-4 fill-black" />
                  <span>Start Simulator</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="card-last-hour-prep-locked"
            className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 shadow-xl"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 opacity-75">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>Level 2 Exclusive</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">60 Marks · 90 Min</span>
                </div>

                <h2 className="text-lg sm:text-xl font-extrabold text-slate-300">
                  Last Hour Prep Test (Board Exam Simulator)
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Full 60-mark mock exam mimicking the real HSC English 2nd Paper Grammar experience with live 90-minute countdown and predicted grade.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                <div className="px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-amber-300 text-xs font-bold flex items-center gap-2 shadow-inner">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Unlocks at Level 2</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Access: Voice Change & Narration Change Drill Hubs */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voice Change Drill Card */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigate('practice_hub');
          }}
          className="glass-card rounded-3xl p-5 sm:p-6 border border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                ⚡ 12 Sub-Modules
              </span>
              <span className="text-xs text-slate-400 font-mono">120+ Questions</span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              Voice Change Master Class
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Drill active & passive voice transformations across Simple Present, Continuous, Modals, Imperatives, and Interrogatives.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <span>Open Voice Drills</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-xs text-slate-400 font-medium">Board Standard</span>
          </div>
        </div>

        {/* Narration Change Drill Card */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigate('practice_hub');
          }}
          className="glass-card rounded-3xl p-5 sm:p-6 border border-violet-500/30 cursor-pointer hover:border-violet-400 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                ⚡ 6 Sub-Modules
              </span>
              <span className="text-xs text-slate-400 font-mono">60+ Questions</span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-violet-300 transition-colors">
              Direct & Indirect Narration
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Practice tense back-shifts, time/place adverb shifts, Assertive, Interrogative, Imperative, Exclamatory, and Optative sentences.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-violet-400 flex items-center gap-1">
              <span>Open Narration Drills</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-xs text-slate-400 font-medium">Board Standard</span>
          </div>
        </div>
      </section>

      {/* All 10 Grammar Topics Grid with Tiered Mastery Visuals (Fix 3) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              All 10 HSC Grammar Topics (60 Marks)
            </h2>
            <p className="text-xs text-slate-400">Official Bangladesh National Curriculum Syllabus</p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onNavigate('topics');
            }}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TOPICS_DATA.map((topic) => {
            const prog = state.topicProgress[topic.id] || {
              unlocked: true,
              attempts: 0,
              correct: 0,
              wrong: 0,
              mastery: 0,
            };

            const mastery = getMasteryTier(prog);
            const isChanging = topic.id === 'changing_sentences';

            return (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                onClick={() => {
                  soundManager.playClick();
                  if (topic.id === 'changing_sentences') {
                    onNavigate('changing_sentences');
                  } else {
                    onNavigate('game', { topicId: topic.id });
                  }
                }}
                className={`glass-card rounded-2xl p-4 cursor-pointer flex flex-col justify-between relative group transition-all ${
                  mastery.isMastered
                    ? 'border-amber-500/40 bg-slate-900/90 shadow-md shadow-amber-500/10'
                    : isChanging
                    ? 'border-amber-500/30 hover:border-amber-400'
                    : 'hover:border-cyan-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                      {getDashboardTopicIcon(topic.id)}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isChanging
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {topic.marks} Marks
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {topic.number}. {topic.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="space-y-1 w-32">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400 flex items-center gap-1">
                        {mastery.hasLock && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                        {mastery.hasStar && <Star className="w-2.5 h-2.5 text-violet-400 fill-violet-400/30" />}
                        {mastery.hasCrown && <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400/30" />}
                        {mastery.hasCheck && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
                        <span className={mastery.textColor}>{mastery.label}</span>
                      </span>
                      {mastery.tier > 0 && (
                        <span className={`font-mono ${mastery.textColor}`}>
                          {mastery.percent}%
                        </span>
                      )}
                    </div>
                    {mastery.tier > 0 ? (
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
                        <div
                          className={`h-full ${mastery.barColor} rounded-full transition-all`}
                          style={{ width: `${mastery.percent}%` }}
                        />
                      </div>
                    ) : (
                      <div className="text-[9px] text-slate-400 italic">Not started</div>
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300 flex items-center gap-0.5">
                    <span>Practice</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FIX 5 — RULE OF THE DAY CARD (Below topic cards) */}
      <section id="rule-of-the-day-section">
        <RuleOfTheDayCard onDrillTopic={(topicId) => onNavigate('game', { topicId })} />
      </section>
    </div>
  );
};
