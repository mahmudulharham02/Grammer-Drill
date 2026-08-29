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
import { getNextHeartRegenSeconds, formatHMS } from '../utils/storage';
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
  onTradeDiamonds?: (hearts: number, cost?: number) => { success: boolean; message: string };
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
  onTradeDiamonds,
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
  const [countdownSecs, setCountdownSecs] = useState<number>(0);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    if (!showGameOverModal) return;
    setCountdownSecs(getNextHeartRegenSeconds(state));
    const interval = setInterval(() => {
      setCountdownSecs(getNextHeartRegenSeconds(state));
    }, 1000);
    return () => clearInterval(interval);
  }, [showGameOverModal, state]);

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
    const currentHints = state.inventory?.hints ?? 0;
    if (currentHints <= 0) {
      soundManager.playIncorrect();
      setMascotMood('surprised');
      setMascotSpeech("You're out of 50/50 hints! Recharge in the Grammar Shop.");
      return;
    }

    const granted = onUseHint();
    if (!granted) return;

    soundManager.playReward();
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
      });
    } catch (_) {}

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
    setMascotSpeech('✨ I removed two incorrect choices for you!');
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
    <div id="screen-game" className="relative z-content min-h-screen">
      {/* Scrollable Content Area */}
      <div className="pb-40">
        <div className="game-screen pt-4 px-3 md:px-6 max-w-3xl mx-auto space-y-4">
          {/* FIX #2: META HEADER CARD (2-TIER RESPONSIVE LAYOUT) */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            {/* TOP ROW: Exit + Title + Question Counter & Board */}
            <div className="flex items-center gap-3 mb-3">
              <button
                id="btn-exit-game"
                onClick={() => {
                  soundManager.playClick();
                  onExit();
                }}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700/80 hover:bg-slate-600 text-white font-bold transition-colors text-lg"
                aria-label="Exit"
                title="Exit to Dashboard"
              >
                ✕
              </button>

              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-white truncate">
                  {title} {subTitle ? `• ${subTitle}` : ''}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span>
                    Q {currentIndex + 1} / {questions.length}
                  </span>
                  {currentQ?.boardReference && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                      {currentQ.boardReference}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* BOTTOM ROW: Action buttons (Hearts display, Bookmark, Hint) */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 transition-colors"
                title="Current Hearts"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                <span className="text-xs font-extrabold">{state.hearts}</span>
              </div>

              <button
                id="btn-bookmark-question"
                onClick={() => {
                  soundManager.playClick();
                  onToggleBookmark(currentQ.id);
                }}
                className={`flex-1 h-10 flex items-center justify-center gap-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-slate-700/50 border-white/10 text-slate-300 hover:border-white/30'
                }`}
                title={isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Question'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                <span className="text-xs font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                id="btn-hint-5050"
                onClick={handleUse5050Hint}
                disabled={isAnswered || state.inventory.hints <= 0 || disabledOptionIndices.length > 0}
                className="flex-1 h-10 flex items-center justify-center gap-2 rounded-xl border bg-slate-700/50 border-white/10 text-slate-300 hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="50/50 Hint (removes 2 wrong options)"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium">Hint ({state.inventory.hints})</span>
              </button>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-3 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-lime-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* FIX #5: QUESTION CARD CONTENT LAYOUT */}
          {currentQ && (
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-6 space-y-4">
              {/* Direction & Instruction Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {currentQ.instruction && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>{currentQ.instruction}</span>
                  </span>
                )}

                {currentQ.direction && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-medium">
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

              {/* Given Sentence */}
              {currentQ.sentence && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                    Given Sentence
                  </p>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <p className="text-white text-base md:text-lg font-medium leading-relaxed">
                      "{currentQ.sentence}"
                    </p>
                  </div>
                </div>
              )}

              {/* Original Sentence (if distinct) */}
              {currentQ.originalSentence && currentQ.originalSentence !== currentQ.sentence && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
                    Original Sentence
                  </p>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                    <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed">
                      "{currentQ.originalSentence}"
                    </p>
                  </div>
                </div>
              )}

              {/* Task Label / Prompt */}
              {currentQ.prompt && (
                <p className="text-sm md:text-base font-semibold text-cyan-300">
                  {currentQ.prompt}
                </p>
              )}

              {/* MCQ Options */}
              {(currentQ.type === 'mcq' || currentQ.type === 'transformation_mcq') && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isDisabled = disabledOptionIndices.includes(idx);

                    let optionStyle = 'border-white/10 bg-slate-700/30 hover:border-white/30 active:scale-[0.99] text-slate-200';

                    if (!isAnswered) {
                      if (isSelected) {
                        optionStyle = 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20 text-white';
                      }
                    } else {
                      const isThisCorrect = option.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();
                      if (isThisCorrect) {
                        optionStyle = 'border-lime-400 bg-lime-500/10 text-lime-200';
                      } else if (isSelected && !isThisCorrect) {
                        optionStyle = 'border-rose-400 bg-rose-500/10 text-rose-200';
                      } else {
                        optionStyle = 'border-white/5 bg-slate-850/30 opacity-40 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        id={`option-btn-${idx}`}
                        disabled={isAnswered || isDisabled}
                        onClick={() => {
                          if (!isAnswered) {
                            soundManager.playClick();
                            setSelectedOption(option);
                          }
                        }}
                        className={`
                          w-full p-3.5 md:p-4 rounded-xl border-2 text-left
                          flex items-start justify-between gap-3
                          transition-all
                          ${optionStyle}
                          ${isDisabled ? 'opacity-25 line-through cursor-not-allowed' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700/80 text-slate-200 text-sm font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="flex-1 text-sm md:text-base leading-relaxed pt-0.5">
                            {option}
                          </span>
                        </div>

                        {isAnswered && option.trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase() && (
                          <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isSelected && option.trim().toLowerCase() !== String(currentQ.correctAnswer).trim().toLowerCase() && (
                          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
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
                    className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-slate-100 px-4 py-3.5 rounded-xl text-sm sm:text-base font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              )}

              {/* Rearrange Sentence */}
              {currentQ.type === 'rearrange' && (
                <div className="space-y-4">
                  <div className="min-h-[56px] p-3 rounded-xl bg-slate-950/80 border-2 border-dashed border-slate-700 flex flex-wrap gap-2 items-center">
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
                          className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-200 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-rose-950 hover:text-rose-300 transition-all"
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
                        className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation Panel (Shown After Submit) */}
              {isAnswered && (
                <div
                  id="feedback-card"
                  className={`mt-4 p-4 md:p-5 rounded-xl border space-y-3 animate-fade-in ${
                    isCorrect
                      ? 'bg-lime-950/30 border-lime-500/40 text-lime-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <span className="text-sm md:text-base font-extrabold text-white">
                        {isCorrect ? 'Correct! +10 XP' : 'Incorrect (-1 Heart ❤️)'}
                      </span>
                    </div>

                    {currentQ.explanation?.rule && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 truncate max-w-[200px]">
                        {currentQ.explanation.rule}
                      </span>
                    )}
                  </div>

                  {/* Grammar Formula */}
                  {currentQ.explanation?.formula && (
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Rule Formula:</span>
                      {currentQ.explanation.formula}
                    </div>
                  )}

                  {/* Tense & Shift Badges if present */}
                  {(currentQ.explanation?.tenseShift || currentQ.explanation?.timeShift || currentQ.explanation?.pronounShift) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      {currentQ.explanation.tenseShift && (
                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Tense Shift:</span>
                          <span className="text-cyan-300 font-bold">{currentQ.explanation.tenseShift}</span>
                        </div>
                      )}
                      {currentQ.explanation.timeShift && (
                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Time Shift:</span>
                          <span className="text-amber-300 font-bold">{currentQ.explanation.timeShift}</span>
                        </div>
                      )}
                      {currentQ.explanation.pronounShift && (
                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">Pronoun Shift:</span>
                          <span className="text-violet-300 font-bold">{currentQ.explanation.pronounShift}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Detailed Explanation Reason */}
                  {currentQ.explanation?.whyCorrect && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-semibold mb-1">
                        Explanation
                      </p>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {currentQ.explanation.whyCorrect}
                      </p>
                    </div>
                  )}

                  {currentQ.explanation?.tip && (
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-amber-300 font-medium">
                      💡 {currentQ.explanation.tip}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FIX #4: STICKY SUBMIT BAR AT BOTTOM (OUTSIDE SCROLLABLE CONTENT) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-3 md:px-6 md:bottom-4">
        <div className="max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-3 md:rounded-2xl md:border shadow-2xl">
          {!canSubmit && !isAnswered && (
            <button
              id="btn-disabled-check"
              disabled
              className="w-full h-14 rounded-xl bg-slate-700/50 text-slate-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              Select an option first
            </button>
          )}

          {canSubmit && !isAnswered && (
            <button
              id="btn-check-answer"
              onClick={handleSubmitAnswer}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white text-base font-bold shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Check Answer
            </button>
          )}

          {isAnswered && (
            <button
              id="btn-next-question"
              onClick={handleNextQuestion}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-white text-base font-bold shadow-lg shadow-lime-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {currentIndex + 1 < questions.length ? 'Next Question →' : 'Finish Session 🏆'}
            </button>
          )}
        </div>
      </div>

      {/* FIX #3: FLOATING OWL MASCOT IN SAFE CORNER (NON-BLOCKING) */}
      <div className="fixed bottom-28 right-4 z-20 pointer-events-none opacity-60">
        <div className="w-16 h-16 md:w-20 md:h-20">
          <Mascot mood={mascotMood} size="sm" showSpeech={mascotSpeech} />
        </div>
      </div>

      {/* Game Over Modal (0 Hearts) */}
      {showGameOverModal && (
        <div
          id="modal-game-over"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="glass-panel max-w-md w-full rounded-3xl p-5 sm:p-6 text-center space-y-4 border-rose-500/40 shadow-2xl my-auto animate-fade-in">
            <div className="text-4xl animate-bounce">💔</div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">Out of Hearts!</h3>
              <p className="text-xs text-slate-300 mt-1">
                You need at least 1 ❤️ to continue your drill session.
              </p>
            </div>

            {/* 1. PRIMARY: Trade Diamonds (1 💎 = 3 ❤️) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500/50 text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">💎</span>
                  <span className="text-xs font-bold text-white">Instant Refill (1 💎 = 3 ❤️)</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {state.diamonds} 💎
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={state.diamonds < 1}
                  onClick={() => {
                    if (onTradeDiamonds) {
                      const res = onTradeDiamonds(3, 1);
                      if (res.success) {
                        setShowGameOverModal(false);
                      }
                    }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    state.diamonds >= 1
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-bold text-rose-300">+3 ❤️</span>
                  <span className="text-[10px] font-mono text-cyan-300">1 💎</span>
                </button>

                <button
                  type="button"
                  disabled={state.diamonds < 3}
                  onClick={() => {
                    if (onTradeDiamonds) {
                      const res = onTradeDiamonds(9, 3);
                      if (res.success) {
                        setShowGameOverModal(false);
                      }
                    }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    state.diamonds >= 3
                      ? 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-bold text-rose-300">+9 ❤️</span>
                  <span className="text-[10px] font-mono text-cyan-300">3 💎</span>
                </button>

                <button
                  type="button"
                  disabled={state.diamonds < 7}
                  onClick={() => {
                    if (onTradeDiamonds) {
                      const res = onTradeDiamonds(20, 7);
                      if (res.success) {
                        setShowGameOverModal(false);
                      }
                    }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    state.diamonds >= 7
                      ? 'bg-gradient-to-br from-amber-500/20 to-rose-500/20 hover:scale-105 border-amber-400 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-bold text-amber-300">Full (20)</span>
                  <span className="text-[10px] font-mono text-amber-400">7 💎</span>
                </button>
              </div>
            </div>

            {/* 2. SECONDARY: Watch Mock Ad */}
            <button
              id="btn-watch-ad-refill"
              disabled={isWatchingAd}
              onClick={handleWatchMockAd}
              className="w-full py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isWatchingAd ? 'Refilling Hearts...' : '📺 Watch Sponsor Clip (+5 ❤️)'}</span>
            </button>

            {/* 3. TERTIARY: Wait 3 Hours */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-left">
              <div>
                <span className="text-xs font-semibold text-slate-400 block">Wait for Auto-Refill</span>
                <span className="text-[10px] text-slate-500">Each heart takes 3 hours to refill</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {formatHMS(countdownSecs)}
              </span>
            </div>

            <button
              id="btn-exit-to-home"
              onClick={() => {
                setShowGameOverModal(false);
                onExit();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              Return to Dashboard
            </button>
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
