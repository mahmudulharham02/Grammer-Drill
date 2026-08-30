import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Flame,
  Clock,
  Award,
  AlertTriangle,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  History,
  Crown
} from 'lucide-react';
import { AppState } from '../types';
import { soundManager } from '../utils/sound';
import {
  EXAM_TOPIC_CONFIG,
  TOTAL_EXAM_MARKS,
  TOTAL_EXAM_QUESTIONS,
  EXAM_DURATION_SECONDS,
  getExamHistory,
  LastHourPrepAttempt
} from '../utils/examGenerator';
import { TOPICS_DATA } from '../data/topics';

interface LastHourPrepSetupProps {
  state: AppState;
  onStartExam: () => void;
  onBackToDashboard: () => void;
  onViewPastAttempt?: (attempt: LastHourPrepAttempt) => void;
}

export const LastHourPrepSetup: React.FC<LastHourPrepSetupProps> = ({
  state,
  onStartExam,
  onBackToDashboard,
  onViewPastAttempt,
}) => {
  const [history, setHistory] = useState<LastHourPrepAttempt[]>([]);

  useEffect(() => {
    setHistory(getExamHistory());
  }, []);

  // Map topic metadata
  const topicsWithMeta = EXAM_TOPIC_CONFIG.map((conf, index) => {
    const matched = TOPICS_DATA.find((t) => t.id === conf.topicId);
    return {
      ...conf,
      number: index + 1,
      icon: matched?.icon || '📝',
      accentColor: matched?.accentColor || '#38bdf8',
      bengaliTitle: matched?.bengaliTitle || conf.title,
    };
  });

  return (
    <div id="last-hour-prep-setup-container" className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onBackToDashboard();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs sm:text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Crown className="w-3.5 h-3.5" />
          <span>HSC Board Exam Simulator</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-extrabold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>Full Board Exam Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Last Hour Prep Test
            </h1>
            <p className="text-sm sm:text-base font-semibold text-amber-300 flex items-center flex-wrap gap-2">
              <span className="bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">60 Marks</span>
              <span className="text-slate-500">•</span>
              <span className="bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30 text-cyan-300">90 Questions</span>
              <span className="text-slate-500">•</span>
              <span className="bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/30 text-purple-300">90 Minutes</span>
              <span className="text-slate-500">•</span>
              <span>Full Syllabus</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              Authentic NCTB / Board syllabus exam experience. Complete 90 randomized questions across all 10 grammar items with weighted scoring, real-time countdown, and comprehensive diagnostics.
            </p>
          </div>

          {/* Quick Stat Pill Highlights */}
          <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto shrink-0">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Marks</span>
              <span className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">60</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
              <span className="text-lg sm:text-xl font-extrabold text-purple-400 font-mono">90 Qs</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
              <span className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono">90 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-500/40 p-4 sm:p-5 flex items-start gap-3.5 shadow-lg">
        <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-red-200">Strict Board Rules</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Once started, the timer cannot be paused. Minimizing the browser or switching tabs will <strong className="text-red-300">not</strong> stop the timer. No hints, no bookmarks, and no heart cost.
          </p>
        </div>
      </div>

      {/* Syllabus & Weightage Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Full Syllabus Structure (10 Topics · 90 Qs · 60 Marks)</span>
            </h2>
            <p className="text-xs text-slate-400">Official NCTB / BOU HSC English 2nd Paper mark distribution</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold hidden sm:inline">60 Marks Total</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topicsWithMeta.map((item) => (
            <div
              key={item.topicId}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-base shrink-0 border border-slate-700">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {item.number}. {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {item.count} Questions · {item.perQuestionMark} mark each
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold font-mono">
                  {item.marks} Marks
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam History List */}
      {history.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Your Previous Exam Attempts</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{history.length} Attempt(s)</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {history.map((att, idx) => {
              const attemptDate = new Date(att.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={att.id || idx}
                  onClick={() => {
                    soundManager.playClick();
                    if (onViewPastAttempt) {
                      onViewPastAttempt(att);
                    }
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-extrabold text-sm text-amber-400 font-mono">
                      #{history.length - idx}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          Scored {att.score % 1 === 0 ? att.score : att.score.toFixed(1)} / {att.totalMarks} ({att.percentage}%)
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            att.grade === 'A+'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : att.grade === 'A'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : att.grade === 'B'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          Grade {att.grade}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {attemptDate} • {Math.floor(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s taken
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-amber-400 transition-colors font-semibold">
                    <span>Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prominent Red Start Exam Button */}
      <div className="pt-4 sticky bottom-4 z-20">
        <button
          type="button"
          id="btn-start-last-hour-prep"
          onClick={() => {
            soundManager.playClick();
            onStartExam();
          }}
          className="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-red-400/40"
        >
          <Flame className="w-6 h-6 fill-white animate-pulse" />
          <span>START BOARD EXAM (90 MIN)</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
