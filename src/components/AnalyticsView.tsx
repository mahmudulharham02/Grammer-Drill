import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, XCircle, Award, Download, BookOpen } from 'lucide-react';
import { AppState, TopicProgressItem } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { soundManager } from '../utils/sound';

interface AnalyticsViewProps {
  state: AppState;
  onOpenCertificate: () => void;
  onNavigateTopic: (topicId: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  state,
  onOpenCertificate,
  onNavigateTopic,
}) => {
  const totalCorrect = (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
    (a, b) => a + b.correct,
    0
  );
  const totalWrong = (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
    (a, b) => a + b.wrong,
    0
  );
  const totalAttempts = totalCorrect + totalWrong;
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const avgMastery = Math.round(
    (Object.values(state.topicProgress) as TopicProgressItem[]).reduce(
      (a, b) => a + b.mastery,
      0
    ) / Math.max(1, Object.keys(state.topicProgress).length)
  );

  return (
    <div id="analytics-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            <span>Learning Analytics & Progress</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time syllabus coverage, accuracy rates, and topic mastery breakdown.
          </p>
        </div>

        <button
          id="btn-analytics-cert"
          onClick={() => {
            soundManager.playClick();
            onOpenCertificate();
          }}
          className="px-4 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20 self-start sm:self-auto transition-all"
        >
          <Award className="w-4 h-4" />
          <span>View Mastery Certificate</span>
        </button>
      </div>

      {/* Top Stat Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400">Total Practice XP</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {state.xp}
          </div>
          <span className="text-[11px] text-slate-500">Level {state.level} Scholar</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400">Accuracy Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-lime-400 font-mono">
            {overallAccuracy}%
          </div>
          <span className="text-[11px] text-slate-500">{totalCorrect} correct of {totalAttempts}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400">Syllabus Mastery</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 font-mono">
            {avgMastery}%
          </div>
          <span className="text-[11px] text-slate-500">Across 10 Board Topics</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1">
          <span className="text-xs font-bold text-slate-400">Study Streak</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {state.streak} Days 🔥
          </div>
          <span className="text-[11px] text-slate-500">Active streak</span>
        </div>
      </div>

      {/* 10-Topic Mastery Breakdown Bars */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-800 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white">Curriculum Topic Mastery Matrix</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Color coded: Green (&ge;80% Strong), Amber (50-79% Progressing), Rose (&lt;50% Needs Practice)
          </p>
        </div>

        <div className="space-y-4">
          {TOPICS_DATA.map((topic) => {
            const prog = state.topicProgress[topic.id] || {
              unlocked: true,
              attempts: 0,
              correct: 0,
              wrong: 0,
              mastery: 0,
            };

            const masteryColor =
              prog.mastery >= 80
                ? 'bg-lime-400 text-lime-400'
                : prog.mastery >= 50
                ? 'bg-amber-400 text-amber-400'
                : 'bg-rose-400 text-rose-400';

            return (
              <div
                key={topic.id}
                onClick={() => {
                  soundManager.playClick();
                  onNavigateTopic(topic.id);
                }}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span>{topic.icon}</span>
                    <span className="font-bold text-white">
                      {topic.number}. {topic.title}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">
                      ({topic.marks} Marks)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">
                      {prog.correct}/{prog.attempts} Correct
                    </span>
                    <span className={`font-mono font-bold ${masteryColor.split(' ')[1]}`}>
                      {prog.mastery}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${masteryColor.split(' ')[0]} rounded-full transition-all`}
                    style={{ width: `${prog.mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
