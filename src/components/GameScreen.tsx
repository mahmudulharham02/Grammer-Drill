import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  HelpCircle,
  Bookmark,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  BookOpen,
  ArrowLeftRight,
  Info
} from 'lucide-react';
import { Question, AppState } from '../types';
import { soundManager } from '../utils/sound';
import { Mascot, MascotMood } from './Mascot';

interface GameScreenProps {
  state: AppState;
  questions: Question[];
  title: string;
  subTitle?: string;
  onComplete: (sessionStats: { correct: number; total: number; xpEarned: number; coinsEarned: number }) => void;
  onRecordResult: (questionId: string, topicId: string, isCorrect: boolean, subModuleId?: string) => void;
  onAddXP: (xp: number, coins: number) => void;
  onToggleBookmark: (questionId: string) => void;
  onUseHint: () => boolean;
  onRefillHearts: () => void;
  onExit: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  state,
  questions,
  title,
  subTitle,
  onComplete,
  onRecordResult,
  onAddXP,
  onToggleBookmark,
  onUseHint,
  onRefillHearts,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [selectedRearrangeWords, setSelectedRearrangeWords] = useState<string[]>([]);
  const [availableRearrangeWords, setAvailableRearrangeWords] = useState<string[]>([]);
  const [disabledOptionIndices, setDisabledOptionIndices] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionTotalXp, setSessionTotalXp] = useState(0);
  const [sessionTotalCoins, setSessionTotalCoins] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [mascotSpeech, setMascotSpeech] = useState<string | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    if (!currentQ) return;
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setDisabledOptionIndices([]);
    setMascotMood('neutral');
    setMascotSpeech(null);

    if (currentQ.type === 'rearrange' && currentQ.rearrangeWords) {
      setAvailableRearrangeWords([...currentQ.rearrangeWords].sort(() => Math.random() - 0.5));
      setSelectedRearrangeWords([]);
    }
  }, [currentIndex, currentQ]);

  useEffect(() => {
    if (state.hearts <= 0 && !isAnswered && !showSessionSummary) {
      setShowGameOverModal(true);
    }
  }, [state.hearts, isAnswered, showSessionSummary]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showGameOverModal || showSessionSummary) return;

      if (!isAnswered) {
        if (currentQ?.options && (currentQ.type === 'mcq' || currentQ.type === 'transformation_mcq')) {
          if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            if (idx < currentQ.options.length && !disabledOptionIndices.includes(idx)) {
              setSelectedOption(currentQ.options[idx]);
            }
          }
        }
        if (e.key === 'Enter') {
          handleSubmitAnswer();
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, selectedOption, typedAnswer, selectedRearrangeWords, currentQ, disabledOptionIndices, showGameOverModal, showSessionSummary]);

  const fireVictoryConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22d3ee', '#a78bfa', '#a3e635', '#fbbf24'],
      });
    } catch {
      // ignore
    }
  };

  const handleSubmitAnswer = () => {
    if (isAnswered || !currentQ) return;

    let correct = false;

    if (currentQ.type === 'mcq' || currentQ.type === 'transformation_mcq' || currentQ.type === 'true_false') {
      if (!selectedOption) return;
      correct = selectedOption.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
    } else if (currentQ.type === 'fill_blank') {
      if (!typedAnswer.trim()) return;
      const userClean = typedAnswer.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      const targetClean = String(currentQ.correctAnswer).trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      correct = userClean === targetClean;
    } else if (currentQ.type === 'rearrange') {
      if (selectedRearrangeWords.length === 0) return;
      const builtSentence = selectedRearrangeWords.join(' ').trim().toLowerCase();
      const targetClean = String(currentQ.correctAnswer).trim().toLowerCase();
      correct = builtSentence === targetClean;
    }

    setIsAnswered(true);
    setIsCorrect(correct);

    onRecordResult(currentQ.id, currentQ.topicId, correct, currentQ.subModule);

    if (correct) {
      soundManager.playCorrect();
      fireVictoryConfetti();
      const xpEarned = 10;
      const coinEarned = 1;
      setSessionCorrectCount((prev) => prev + 1);
      setSessionTotalXp((prev) => prev + xpEarned);
      setSessionTotalCoins((prev) => prev + coinEarned);
      onAddXP(xpEarned, coinEarned);

      setMascotMood('happy');
      setMascotSpeech('Shabash! Excellent grammar mastery!');
    } else {
      soundManager.playWrong();
      setMascotMood('sad');
      setMascotSpeech('Check the rule card carefully below!');
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      soundManager.playLevelUp();
      setShowSessionSummary(true);
      onComplete({
        correct: sessionCorrectCount,
        total: questions.length,
        xpEarned: sessionTotalXp,
        coinsEarned: sessionTotalCoins,
      });
    }
  };

  const handleUse5050Hint = () => {
    if (isAnswered || !currentQ?.options || disabledOptionIndices.length > 0) return;
    const granted = onUseHint();
    if (!granted) return;

    soundManager.playClick();
    const wrongIndices: number[] = [];
    currentQ.options.forEach((opt, idx) => {
      if (opt.trim().toLowerCase() !== String(currentQ.correctAnswer).trim().toLowerCase()) {
        wrongIndices.push(idx);
      }
    });

    const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
    const toDisable = shuffled.slice(0, 2);
    setDisabledOptionIndices(toDisable);
    setMascotMood('thinking');
    setMascotSpeech('I removed two incorrect choices for you!');
  };

  const handleWatchMockAd = () => {
    setIsWatchingAd(true);
    soundManager.playClick();
    setTimeout(() => {
      setIsWatchingAd(false);
      onRefillHearts();
      setShowGameOverModal(false);
      soundManager.playCorrect();
    }, 1500);
  };

  const isBookmarked = state.bookmarkedQuestionIds.includes(currentQ?.id);

  const canSubmit =
    !isAnswered &&
    ((currentQ?.type === 'mcq' || currentQ?.type === 'transformation_mcq') && !!selectedOption ||
      currentQ?.type === 'fill_blank' && !!typedAnswer.trim() ||
      currentQ?.type === 'rearrange' && selectedRearrangeWords.length > 0 ||
      currentQ?.type === 'true_false' && selectedOption !== null);

  return (
    <div id="screen-game" className="relative z-content max-w-3xl mx-auto space-y-4">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onExit();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            ✕ Exit
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[160px] sm:max-w-xs">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>
                Q {currentIndex + 1} / {questions.length}
              </span>
              {currentQ?.boardReference && (
                <span className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded font-mono">
                  {currentQ.boardReference}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hearts & Hints */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-xl text-rose-400 text-xs font-extrabold">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>{state.hearts}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onToggleBookmark(currentQ.id);
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Bookmark this question"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleUse5050Hint}
            disabled={isAnswered || state.inventory.hints <= 0 || disabledOptionIndices.length > 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-violet-500/20 border border-violet-500/30 hover:bg-violet-500/30 text-violet-300 text-xs font-bold disabled:opacity-40 transition-colors"
            title="50/50 hint: removes 2 wrong options"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{state.inventory.hints}</span>
          </button>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-lime-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card Area (Natural Height, Flex Col) */}
      {currentQ && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-slate-800 flex flex-col gap-4">
          {/* Question Direction & Submodule Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{currentQ.instruction || 'Select the correct answer'}</span>
            </span>

            {currentQ.direction && (
              <span className="text-[11px] font-bold text-violet-300 bg-violet-500/10 px-2.5 py-1 rounded-lg border border-violet-500/20 flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" />
                <span>
                  {currentQ.direction === 'active_to_passive'
                    ? 'Active ➔ Passive'
                    : currentQ.direction === 'passive_to_active'
                    ? 'Passive ➔ Active'
                    : currentQ.direction === 'direct_to_indirect'
                    ? 'Direct ➔ Indirect'
                    : 'Indirect ➔ Direct'}
                </span>
              </span>
            )}
          </div>

          {/* Sentence / Prompt Display */}
          <div className="space-y-2">
            {currentQ.sentence && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider mb-1">
                  Given Sentence:
                </span>
                <span className="text-base sm:text-lg font-bold text-white">
                  "{currentQ.sentence}"
                </span>
              </div>
            )}

            {currentQ.originalSentence && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider mb-1">
                  Original Sentence:
                </span>
                <span className="text-base font-bold text-white">
                  "{currentQ.originalSentence}"
                </span>
              </div>
            )}

            <h2 className="text-sm sm:text-base font-bold text-slate-200 leading-relaxed">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Options: MCQ */}
          {(currentQ.type === 'mcq' || currentQ.type === 'transformation_mcq') && currentQ.options && (
            <div className="grid grid-cols-1 gap-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isDisabled = disabledOptionIndices.includes(idx);

                let optionStyle = 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-cyan-500/50';

                if (isAnswered) {
                  const isThisCorrect = option.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
                  if (isThisCorrect) {
                    optionStyle = 'bg-lime-950/60 border-lime-400 text-lime-200 ring-2 ring-lime-400/20';
                  } else if (isSelected && !isThisCorrect) {
                    optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/20';
                  } else {
                    optionStyle = 'opacity-40 bg-slate-900 border-slate-800';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-cyan-950/50 border-cyan-400 text-white ring-2 ring-cyan-400/20';
                }

                return (
                  <button
                    key={idx}
                    id={`option-btn-${idx}`}
                    disabled={isAnswered || isDisabled}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedOption(option);
                    }}
                    className={`w-full p-3 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${optionStyle} ${
                      isDisabled ? 'opacity-25 line-through cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">{option}</span>
                    </div>

                    {isAnswered && option.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase() && (
                      <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
                    )}
                    {isAnswered && isSelected && option.trim().toLowerCase() !== String(currentQ.correctAnswer).trim().toLowerCase() && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the Blank */}
          {currentQ.type === 'fill_blank' && (
            <div className="space-y-3">
              <input
                id="input-fill-blank"
                type="text"
                value={typedAnswer}
                disabled={isAnswered}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-slate-100 px-4 py-3.5 rounded-2xl text-sm sm:text-base font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          )}

          {/* Rearrange Sentence */}
          {currentQ.type === 'rearrange' && (
            <div className="space-y-4">
              <div className="min-h-[56px] p-3 rounded-2xl bg-slate-950/80 border-2 border-dashed border-slate-700 flex flex-wrap gap-2 items-center">
                {selectedRearrangeWords.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">Click words below in correct order...</span>
                ) : (
                  selectedRearrangeWords.map((word, i) => (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => {
                        if (isAnswered) return;
                        soundManager.playClick();
                        setSelectedRearrangeWords(selectedRearrangeWords.filter((_, idx) => idx !== i));
                        setAvailableRearrangeWords([...availableRearrangeWords, word]);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-200 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-rose-950 hover:text-rose-300 transition-all"
                    >
                      {word} ✕
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {availableRearrangeWords.map((word, i) => (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => {
                      if (isAnswered) return;
                      soundManager.playClick();
                      setSelectedRearrangeWords([...selectedRearrangeWords, word]);
                      setAvailableRearrangeWords(availableRearrangeWords.filter((_, idx) => idx !== i));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FIX #1: INLINE CHECK / NEXT BUTTON DIRECTLY UNDER OPTIONS */}
          <div className="pt-1">
            {!canSubmit && !isAnswered && (
              <button
                id="btn-disabled-check"
                disabled
                className="w-full min-h-[56px] rounded-2xl bg-slate-800/80 text-slate-400 font-bold text-sm sm:text-base border border-slate-700/60 opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>👆 Select an option first</span>
              </button>
            )}

            {canSubmit && !isAnswered && (
              <button
                id="btn-check-answer"
                onClick={handleSubmitAnswer}
                className="w-full min-h-[56px] rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-bold text-base shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>✅ Check Answer</span>
              </button>
            )}

            {isAnswered && (
              <button
                id="btn-next-question"
                onClick={handleNextQuestion}
                className="w-full min-h-[56px] rounded-2xl bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-extrabold text-base shadow-lg shadow-lime-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Session 🏆'}</span>
              </button>
            )}
          </div>

          {/* Instant Board-Standard Rule Card (After Answered) */}
          {isAnswered && (
            <div
              id="feedback-card"
              className={`rounded-2xl p-4 sm:p-5 border space-y-3.5 animate-fade-in ${
                isCorrect
                  ? 'bg-lime-950/30 border-lime-500/40 text-lime-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {isCorrect ? 'Correct! +10 XP' : 'Incorrect (-1 Heart ❤️)'}
                  </span>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 truncate max-w-[180px]">
                  {currentQ.explanation.rule}
                </span>
              </div>

              {/* Grammar Formula */}
              {currentQ.explanation.formula && (
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Rule Formula:</span>
                  {currentQ.explanation.formula}
                </div>
              )}

              {/* Tense & Shift Badges if present */}
              {(currentQ.explanation.tenseShift || currentQ.explanation.timeShift || currentQ.explanation.pronounShift) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  {currentQ.explanation.tenseShift && (
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Tense Back-Shift:</span>
                      <span className="text-cyan-300 font-bold">{currentQ.explanation.tenseShift}</span>
                    </div>
                  )}
                  {currentQ.explanation.timeShift && (
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Time/Place Shift:</span>
                      <span className="text-amber-300 font-bold">{currentQ.explanation.timeShift}</span>
                    </div>
                  )}
                  {currentQ.explanation.pronounShift && (
                    <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Pronoun Shift:</span>
                      <span className="text-violet-300 font-bold">{currentQ.explanation.pronounShift}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Reason */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentQ.explanation.whyCorrect}
              </p>

              {currentQ.explanation.tip && (
                <div className="p-2 rounded-xl bg-slate-900/60 text-xs text-amber-300 font-medium">
                  {currentQ.explanation.tip}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Mascot in Corner (Does not push content down) */}
      <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-10 pointer-events-none drop-shadow-xl">
        <Mascot mood={mascotMood} size="sm" showSpeech={mascotSpeech} />
      </div>

      {/* Game Over Modal (0 Hearts) */}
      {showGameOverModal && (
        <div
          id="modal-game-over"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="glass-panel max-w-md w-full rounded-3xl p-6 sm:p-8 text-center space-y-5 border-rose-500/40 shadow-2xl">
            <div className="text-5xl animate-bounce">💔</div>
            <h3 className="text-2xl font-extrabold text-white">Out of Hearts!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              You lost all hearts. Hearts automatically regenerate 1 every minute (up to 20), or you can refill immediately.
            </p>

            <div className="space-y-3 pt-2">
              <button
                id="btn-watch-ad-refill"
                disabled={isWatchingAd}
                onClick={handleWatchMockAd}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>{isWatchingAd ? 'Refilling Hearts...' : 'Watch Quick Sponsor Message (Refill 5 ❤️)'}</span>
              </button>

              <button
                id="btn-exit-to-home"
                onClick={() => {
                  setShowGameOverModal(false);
                  onExit();
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Summary Modal */}
      {showSessionSummary && (
        <div
          id="modal-session-summary"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="glass-panel max-w-md w-full rounded-3xl p-6 sm:p-8 text-center space-y-6 border-cyan-500/40 shadow-2xl">
            <div className="text-5xl">🎉</div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Drill Completed!</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{title}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                <span className="text-lg font-extrabold text-lime-400 block">
                  {sessionCorrectCount}/{questions.length}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">XP Earned</span>
                <span className="text-lg font-extrabold text-cyan-400 block">
                  +{sessionTotalXp}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Coins</span>
                <span className="text-lg font-extrabold text-amber-400 block">
                  +{sessionTotalCoins}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSessionSummary(false);
                onExit();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
