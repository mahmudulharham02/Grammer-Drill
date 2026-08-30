import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  X,
  Bookmark
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import {
  ExamQuestion,
  EXAM_DURATION_SECONDS,
  formatTimeRemaining,
  TOTAL_EXAM_MARKS,
  TOTAL_EXAM_QUESTIONS
} from '../utils/examGenerator';
import { TOPICS_DATA } from '../data/topics';

interface LastHourPrepExamProps {
  questions: ExamQuestion[];
  onFinishExam: (userAnswers: Record<string, string>, flaggedIds: string[], timeTakenSeconds: number) => void;
  onExit: () => void;
}

export const LastHourPrepExam: React.FC<LastHourPrepExamProps> = ({
  questions,
  onFinishExam,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  
  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(EXAM_DURATION_SECONDS);
  const startTimeRef = useRef<number>(Date.now());
  const endTimeRef = useRef<number>(Date.now() + EXAM_DURATION_SECONDS * 1000);
  const isSubmittedRef = useRef<boolean>(false);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  // Auto-scroll question circles into view
  const circleRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll active circle into view when currentIndex changes
  useEffect(() => {
    const el = circleRefs.current[currentIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentIndex]);

  // Main countdown timer (wall-clock timestamp based to persist across tab switches)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSubmittedRef.current) return;

      const now = Date.now();
      const remainingMs = endTimeRef.current - now;
      const remSec = Math.max(0, Math.ceil(remainingMs / 1000));
      setSecondsRemaining(remSec);

      if (remSec <= 0 && !isSubmittedRef.current) {
        clearInterval(interval);
        handleTimeUpAutoSubmit();
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const currentQuestion: ExamQuestion | undefined = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    soundManager.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    soundManager.playClick();
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      soundManager.playClick();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      soundManager.playClick();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    soundManager.playLevelUp();
    const timeTaken = Math.min(
      EXAM_DURATION_SECONDS,
      Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
    );
    onFinishExam(userAnswers, Array.from(flaggedIds), timeTaken);
  }, [userAnswers, flaggedIds, onFinishExam]);

  const handleTimeUpAutoSubmit = () => {
    if (isSubmittedRef.current) return;
    setShowTimeUpModal(true);
    soundManager.playWrong();
    setTimeout(() => {
      handleFinalSubmit();
    }, 2500);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = flaggedIds.size;
  const isCurrentFlagged = currentQuestion ? flaggedIds.has(currentQuestion.id) : false;
  const selectedAnswer = currentQuestion ? userAnswers[currentQuestion.id] : undefined;

  // Topic lookup
  const topicMeta = currentQuestion ? TOPICS_DATA.find((t) => t.id === currentQuestion.topicId) : null;
  const topicTitle = topicMeta ? topicMeta.title : 'Grammar Question';

  const isLowTime = secondsRemaining <= 300; // under 5 minutes
  const isCriticalTime = secondsRemaining <= 60; // under 1 minute

  const markDisplay = currentQuestion?.markValue !== undefined ? currentQuestion.markValue : 1;

  return (
    <div id="last-hour-prep-exam" className="min-h-[85vh] flex flex-col justify-between max-w-4xl mx-auto space-y-4 pb-28">
      {/* Top Fixed Control Bar */}
      <header className="sticky top-16 z-30 p-3 sm:p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-between gap-2">
        {/* Left: Question Counter */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm font-bold text-white font-mono shrink-0">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline truncate">
            {answeredCount} Answered
          </span>
        </div>

        {/* Center: Live Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-mono text-sm sm:text-base font-extrabold border transition-all ${
            isCriticalTime
              ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse shadow-lg shadow-red-500/30'
              : isLowTime
              ? 'bg-red-950/60 text-red-400 border-red-500/60'
              : 'bg-slate-950 text-cyan-400 border-slate-800'
          }`}
        >
          <Clock className={`w-4 h-4 ${isCriticalTime ? 'animate-spin' : ''}`} />
          <span>{formatTimeRemaining(secondsRemaining)}</span>
        </div>

        {/* Right: Flag & Submit Early */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFlag}
            title="Flag question for review"
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isCurrentFlagged
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Flag className={`w-4 h-4 ${isCurrentFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isCurrentFlagged ? 'Flagged' : 'Flag'}</span>
          </button>

          <button
            type="button"
            id="btn-submit-exam-early"
            onClick={() => {
              soundManager.playClick();
              setShowSubmitModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-600/30 active:scale-95 transition-all"
          >
            Submit Early
          </button>
        </div>
      </header>

      {/* Main Question Card Area */}
      {currentQuestion && (
        <main className="flex-1">
          <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-800/90 shadow-2xl space-y-6 animate-fade-in relative">
            {/* Header: Topic Tag, Board reference, and Marks Value Display */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  {topicTitle}
                </span>
                {isCurrentFlagged && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                    <Flag className="w-3 h-3 fill-amber-400" />
                    <span>Review Marked</span>
                  </span>
                )}
                {currentQuestion.boardReference && (
                  <span className="text-[11px] font-mono text-slate-400 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 hidden sm:inline">
                    {currentQuestion.boardReference}
                  </span>
                )}
              </div>

              {/* Marks Display: Top-right corner of the card */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-extrabold shadow-sm">
                <span>⭐</span>
                <span>{markDisplay} {markDisplay === 1 ? 'Mark' : 'Marks'}</span>
              </div>
            </div>

            {/* Instruction if present */}
            {currentQuestion.instruction && (
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {currentQuestion.instruction}
              </p>
            )}

            {/* Question Text / Prompt Display */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-white text-base sm:text-lg md:text-xl font-medium leading-relaxed">
              {currentQuestion.sentence || currentQuestion.prompt}
            </div>

            {/* Options List (4 stacked buttons, min-h 56px) */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                currentQuestion.options.map((option, optIdx) => {
                  const isSelected = selectedAnswer === option;
                  const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={`w-full min-h-[56px] p-4 rounded-2xl text-left font-semibold text-sm sm:text-base transition-all flex items-center justify-between gap-3 border ${
                        isSelected
                          ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700 text-slate-200 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border ${
                            isSelected
                              ? 'bg-cyan-500 text-black border-cyan-400 font-extrabold'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {optionLabel}
                        </span>
                        <span className="break-words">{option}</span>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900 text-center text-slate-400 text-sm">
                  No options provided for this question.
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Fixed Bottom Navigation & 90-Question Grid */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl p-3 sm:p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Horizontally Scrollable 90-Circle Question Navigator */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none touch-pan-x px-1">
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlagged = flaggedIds.has(q.id);
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id}
                  ref={(el) => { circleRefs.current[idx] = el; }}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentIndex(idx);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold transition-all relative ${
                    isCurrent
                      ? 'bg-cyan-500 text-black ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950 scale-110 shadow-lg z-10'
                      : isAnswered
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && !isCurrent && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-slate-950" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Prev / Next Bottom Action Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 border transition-all ${
                currentIndex === 0
                  ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {answeredCount}/{questions.length} Completed
              </span>
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowSubmitModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <span>Review & Finish</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Confirmation Modal for Submit Early */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel max-w-md w-full rounded-3xl p-6 sm:p-7 border-2 border-red-500/40 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto text-2xl">
              📝
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Submit Board Exam?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Are you ready to submit your paper? Your score and predicted grade will be calculated immediately.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions Answered</span>
                <span className="text-base font-extrabold text-cyan-400 font-mono">
                  {answeredCount} / {questions.length}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Flagged for Review</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {flaggedCount} question(s)
                </span>
              </div>
            </div>

            {answeredCount < questions.length && (
              <p className="text-xs text-amber-300 font-medium">
                ⚠️ You have {questions.length - answeredCount} unanswered question(s). Unanswered questions score 0 marks.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit();
                }}
                className="py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-600/30 transition-all"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Submit "Time is Up" Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel max-w-sm w-full rounded-3xl p-6 text-center space-y-4 border-2 border-red-500 shadow-2xl">
            <div className="text-5xl animate-bounce">⏰</div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Time is Up!</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                The 90-minute examination period has ended. Automatically compiling and grading your paper...
              </p>
            </div>
            <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
};
