import React from 'react';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import { AppState, Question } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { soundManager } from '../utils/sound';

interface BookmarksViewProps {
  state: AppState;
  onStartBookmarkDrill: (questions: Question[]) => void;
  onToggleBookmark: (questionId: string) => void;
  onNavigateHome: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  state,
  onStartBookmarkDrill,
  onToggleBookmark,
  onNavigateHome,
}) => {
  const bookmarkedQuestions = ALL_QUESTIONS.filter((q) =>
    state.bookmarkedQuestionIds.includes(q.id)
  );

  return (
    <div id="bookmarks-view" className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
            <span>Saved Questions Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Bookmarked Questions ({bookmarkedQuestions.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Questions saved for rapid revision before exams and tests.
          </p>
        </div>

        {bookmarkedQuestions.length > 0 && (
          <button
            id="btn-practice-all-bookmarks"
            onClick={() => {
              soundManager.playClick();
              onStartBookmarkDrill(bookmarkedQuestions);
            }}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Practice All Saved</span>
          </button>
        )}
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12 text-center space-y-4">
          <div className="text-5xl">🔖</div>
          <h3 className="text-xl font-bold text-white">No Bookmarked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Click the bookmark icon on any question during drills to save it here for targeted review.
          </p>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateHome();
            }}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs sm:text-sm"
          >
            Explore Topics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {q.instruction}
                  </span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onToggleBookmark(q.id);
                    }}
                    title="Remove from bookmarks"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{q.prompt}</h3>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-400">
                    Rule:{' '}
                    <span className="text-amber-300 font-medium">{q.explanation.rule}</span>
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
                    onStartBookmarkDrill([q]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Practice Question
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
