import React from 'react';
import { RotateCcw, CheckCircle2, AlertCircle, Play, Sparkles, BookOpen } from 'lucide-react';
import { AppState, Question } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { soundManager } from '../utils/sound';

interface ReviewWrongPoolProps {
  state: AppState;
  onStartReviewDrill: (questions: Question[]) => void;
  onNavigateHome: () => void;
}

export const ReviewWrongPool: React.FC<ReviewWrongPoolProps> = ({
  state,
  onStartReviewDrill,
  onNavigateHome,
}) => {
  const missedQuestions = ALL_QUESTIONS.filter((q) =>
    state.wrongQuestionReviewPool.includes(q.id)
  );

  return (
    <div id="review-wrong-pool-view" className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-2">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Targeted Weakness Rectification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Mistake Review Pool ({missedQuestions.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Questions you missed during practice. Answering them correctly removes them from this pool!
          </p>
        </div>

        {missedQuestions.length > 0 && (
          <button
            id="btn-start-mistake-drill"
            onClick={() => {
              soundManager.playClick();
              onStartReviewDrill(missedQuestions);
            }}
            className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Practice All Mistakes</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {missedQuestions.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center space-y-4">
          <div className="text-5xl">✨</div>
          <h3 className="text-xl font-bold text-white">All Mistakes Cleared!</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            You currently have 0 unresolved mistakes in your review pool. Continue with new topics to build further mastery!
          </p>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateHome();
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs sm:text-sm"
          >
            Back to Topics
          </button>
        </div>
      ) : (
        /* Mistake Cards List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missedQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-rose-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {q.instruction}
                  </span>
                  {q.boardReference && (
                    <span className="text-[10px] font-mono text-slate-500">{q.boardReference}</span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{q.prompt}</h3>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-400">
                    Rule:{' '}
                    <span className="text-rose-300 font-medium">{q.explanation.rule}</span>
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {q.explanation.whyCorrect}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onStartReviewDrill([q]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Retry This Question
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
