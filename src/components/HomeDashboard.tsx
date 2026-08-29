import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Target,
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
  FileSpreadsheet,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { AppState, TopicInfo, TopicProgressItem } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { GRAMMAR_TIPS } from '../data/grammarTips';
import { getXpRequiredForLevel } from '../data/badges';
import { soundManager } from '../utils/sound';
import { Mascot } from './Mascot';
import { CacheWarningBanner } from './CacheWarningBanner';
import { LowHeartsBanner } from './LowHeartsBanner';

interface HomeDashboardProps {
  state: AppState;
  onNavigate: (route: string, params?: { topicId?: string; subtopicId?: string }) => void;
  onStartDailyChallenge: () => void;
  onOpenRules: () => void;
  onOpenCertificate: () => void;
  onOpenHeartsShop: () => void;
  onExportBackup: () => void;
  onDismissCacheWarning: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  state,
  onNavigate,
  onStartDailyChallenge,
  onOpenRules,
  onOpenCertificate,
  onOpenHeartsShop,
  onExportBackup,
  onDismissCacheWarning,
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    setCurrentTipIndex(dayOfYear % GRAMMAR_TIPS.length);
  }, []);

  const requiredXP = getXpRequiredForLevel(state.level);
  const xpProgressPercent = Math.min(100, Math.round((state.xp / requiredXP) * 100));

  const totalCorrect = (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
    (a, b) => a + (b.correct || 0),
    0
  );
  const totalAttempts = (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
    (a, b) => a + (b.attempts || 0),
    0
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const isDailyCompletedToday = state.dailyChallenge.lastCompletedDate === todayStr;
  const activeTip = GRAMMAR_TIPS[currentTipIndex] || GRAMMAR_TIPS[0];

  const greeting = state.user.gender === 'female'
    ? `Learn Something, ${state.user.name || 'Grammar Hero'}! 🌸`
    : state.user.gender === 'male'
    ? `Learn Something, ${state.user.name || 'Grammar Hero'}! 🤌`
    : `Hello, ${state.user.name || 'Grammar Hero'}! 🤌`;

  return (
    <div id="home-dashboard-container" className="space-y-5 sm:space-y-6 pb-[7px] max-w-7xl mx-auto">
      {/* Low Hearts Banner */}
      <LowHeartsBanner
        hearts={state.hearts}
        maxHearts={state.maxHearts}
        diamonds={state.diamonds}
        onOpenShop={onOpenHeartsShop}
      />

      {/* Cache Warning Banner if not dismissed */}
      {!state.settings.cacheWarningDismissed && (
        <CacheWarningBanner
          onExport={onExportBackup}
          onDismiss={onDismissCacheWarning}
        />
      )}

      {/* Hero Welcome & Profile Status Banner */}
      <section
        id="hero-profile-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-900/95 border border-cyan-500/20 p-5 sm:p-7 shadow-2xl backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-content flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Left: Avatar, Title, Level, XP Bar */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('profile');
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl bg-slate-800 border-2 border-cyan-400/50 shadow-xl cursor-pointer hover:scale-105 transition-transform"
              >
                <span>{state.user.avatar || '🧑‍🎓'}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full shadow">
                Lv {state.level}
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                {greeting}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{state.user.title || 'Apprentice 🐣'}</span>
                <span className="text-slate-400 text-xs hidden sm:inline">
                  • {state.user.board || 'Dhaka'} Board ({state.user.group || 'Science'})
                </span>
              </p>

              {/* Level XP Progress Bar */}
              <div className="pt-1.5 w-48 sm:w-64">
                <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                  <span>Level Progress</span>
                  <span className="font-mono text-cyan-300">
                    {state.xp} / {requiredXP} XP
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Mascot & CTA Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3.5 w-full md:w-auto pt-3 md:pt-0 border-t border-slate-800/80 md:border-t-0">
            <Mascot
              mood="happy"
              size="md"
              showSpeech="Gramify AI Comming Soon!"
            />

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="hero-btn-continue-drill"
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('practice_hub');
                }}
                className="px-4 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Drill Center</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access: Voice Change (12) & Narration Change (6) Submodule Cards */}
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

      {/* Daily Challenge & 10-Mark Transformations Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Challenge */}
        <div
          id="daily-challenge-card"
          className="rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Daily Board Challenge</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                10-Question Mixed Board Test
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Complete daily for +50 XP bonus, 5 💎 coins, and keep your streak burning!
              </p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              {isDailyCompletedToday ? '✅ Done for today' : '⚡ Available Now'}
            </span>

            <button
              onClick={() => {
                soundManager.playClick();
                onStartDailyChallenge();
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                isDailyCompletedToday
                  ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold shadow-lg shadow-amber-500/20'
              }`}
            >
              <span>{isDailyCompletedToday ? 'Practice Again' : 'Start Challenge'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10-Mark Transformation Spotlight */}
        <div
          id="changing-sentences-spotlight"
          onClick={() => {
            soundManager.playClick();
            onNavigate('changing_sentences');
          }}
          className="rounded-3xl bg-gradient-to-br from-lime-950/30 via-slate-900 to-slate-900 border border-lime-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-500/15 border border-lime-500/30 text-lime-300 text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Question #6 Spotlight (10 Marks)</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-lime-300 transition-colors">
                Changing Sentences Special Hub
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Simple/Complex/Compound, Voice Change, Degrees of Comparison, Affirmative/Negative.
              </p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-lime-400 flex items-center gap-1">
              <span>Open 10M Transformation Hub</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>

      {/* Grammar Tip of the Day */}
      <section className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Grammar Rule Tip of the Day
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">HSC Syllabus</span>
        </div>
        <h4 className="text-sm font-bold text-white">{activeTip.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{activeTip.tip}</p>
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-300">
          Example: {activeTip.example}
        </div>
      </section>

      {/* All 10 Grammar Topics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              All 10 HSC Grammar Topics (60 Marks)
            </h2>
            <p className="text-xs text-slate-400">Official National Curriculum Syllabus</p>
          </div>
          <button
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
                className="glass-card glass-card-hover rounded-2xl p-4 cursor-pointer flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl p-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      {topic.icon}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
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
                  <div className="space-y-1 w-28">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Mastery</span>
                      <span className="text-cyan-400">{prog.mastery}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${prog.mastery}%` }}
                      />
                    </div>
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
    </div>
  );
};
