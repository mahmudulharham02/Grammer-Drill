import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  RotateCcw,
  Share2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Flame,
  FileCheck
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { hasFeedbackBeenSentRecently } from '../utils/storage';
import {
  LastHourPrepAttempt,
  calculateExamGrade,
  TOTAL_EXAM_MARKS,
  TOTAL_EXAM_QUESTIONS,
  EXAM_DURATION_SECONDS,
  ExamTopicScore,
  ExamQuestion
} from '../utils/examGenerator';
import { TOPICS_DATA } from '../data/topics';

interface LastHourPrepResultsProps {
  attempt: LastHourPrepAttempt;
  lastFeedbackDate?: string | null;
  onRetakeExam: () => void;
  onBackToDashboard: () => void;
  onToast?: (msg: string) => void;
  onOpenFeedback?: () => void;
}

export const LastHourPrepResults: React.FC<LastHourPrepResultsProps> = ({
  attempt,
  lastFeedbackDate,
  onRetakeExam,
  onBackToDashboard,
  onToast,
  onOpenFeedback,
}) => {
  const [showQuestionReview, setShowQuestionReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterReview, setFilterReview] = useState<'all' | 'wrong' | 'correct'>('all');

  const gradeInfo = calculateExamGrade(attempt.score, attempt.totalMarks || TOTAL_EXAM_MARKS);

  // Trigger celebratory confetti for A+ and A grades
  useEffect(() => {
    if (attempt.grade === 'A+' || attempt.grade === 'A') {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#06b6d4', '#eab308', '#f43f5e', '#a855f7'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [attempt.grade]);

  const minutesTaken = Math.floor(attempt.timeTakenSeconds / 60);
  const secondsTaken = attempt.timeTakenSeconds % 60;
  const timeFormatted = `${String(minutesTaken).padStart(2, '0')}:${String(secondsTaken).padStart(2, '0')}`;

  const bonusXP = Math.round(attempt.score * 2);
  const bonusDiamonds = gradeInfo.diamondReward;

  const displayScore = attempt.score % 1 === 0 ? attempt.score : attempt.score.toFixed(1);

  const handleShare = async () => {
    soundManager.playClick();
    const shareText = `I scored ${displayScore} out of 60 on Gramify Last Hour Prep Test. Grade: ${attempt.grade}. Try it at gramify-english.vercel.app`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        if (onToast) onToast('Exam summary copied to clipboard! 📋');
        setTimeout(() => setCopied(false), 3000);
      } else {
        if (onToast) onToast(shareText);
      }
    } catch (e) {
      if (onToast) onToast('Exam summary copied to clipboard! 📋');
    }
  };

  // Filter questions for review
  const reviewQuestions = attempt.questions.filter((q) => {
    const userSelected = attempt.userAnswers[q.id];
    const isCorrect = userSelected === q.correctAnswer;
    if (filterReview === 'wrong') return !isCorrect;
    if (filterReview === 'correct') return isCorrect;
    return true;
  });

  const wrongCount = attempt.questions.filter((q) => attempt.userAnswers[q.id] !== q.correctAnswer).length;
  const correctCount = attempt.questions.length - wrongCount;

  // Calculate circular SVG progress values
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (attempt.percentage / 100) * circumference;

  return (
    <div id="last-hour-prep-results" className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      {/* Top Bar Navigation */}
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

        <span className="text-xs font-mono text-slate-400">
          Completed {new Date(attempt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Main Score & Grade Display Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div className="absolute top-0 right-1/4 -mt-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <span>🎉 HSC Board Exam Result</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Last Hour Prep Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            60 Marks · 90 Questions · 90 Minutes · Comprehensive Grammar Simulator
          </p>
        </div>

        {/* Circular Ring & Big Weighted Score */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-2">
          {/* Circular Progress Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={gradeInfo.color}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {attempt.percentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</span>
            </div>
          </div>

          {/* Grade & Score Badge */}
          <div className="text-left space-y-2 max-w-xs">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Weighted Score
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                <span className="text-cyan-400">{displayScore}</span>
                <span className="text-slate-500 text-2xl sm:text-3xl"> / {attempt.totalMarks || TOTAL_EXAM_MARKS}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <div
                className="px-3.5 py-1.5 rounded-xl font-extrabold text-lg sm:text-xl border font-mono shadow-md"
                style={{
                  backgroundColor: `${gradeInfo.color}20`,
                  borderColor: `${gradeInfo.color}60`,
                  color: gradeInfo.color,
                }}
              >
                Grade {attempt.grade}
              </div>
              <div className="text-xs font-semibold text-slate-300 leading-tight">
                {gradeInfo.description}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid: Time, Questions, Rewards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Taken</span>
            <span className="text-sm sm:text-base font-extrabold text-white font-mono flex items-center justify-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeFormatted} / 90:00</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Attempted</span>
            <span className="text-sm sm:text-base font-extrabold text-cyan-400 font-mono mt-0.5 block">
              {attempt.questionsAttemptedCount} / {attempt.questions.length} Qs
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">XP Awarded</span>
            <span className="text-sm sm:text-base font-extrabold text-lime-400 font-mono mt-0.5 block">
              +{bonusXP} XP
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diamond Bonus</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono mt-0.5 block">
              {bonusDiamonds > 0 ? `+${bonusDiamonds} 💎` : '0 💎'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Retake, Share, Dashboard */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            id="btn-retake-exam"
            onClick={() => {
              soundManager.playClick();
              onRetakeExam();
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam (New Paper)</span>
          </button>

          <button
            type="button"
            id="btn-share-exam-result"
            onClick={handleShare}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary' : 'Share Result'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              onBackToDashboard();
            }}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-800 transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Feedback Nudge (Only if not sent in last 7 days) */}
        {!hasFeedbackBeenSentRecently(lastFeedbackDate, 7) && (
          <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400 flex-wrap">
            <span>How was your exam experience?</span>
            <button
              id="btn-exam-share-feedback"
              type="button"
              onClick={() => {
                soundManager.playClick();
                if (onOpenFeedback) {
                  onOpenFeedback();
                }
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Share feedback
            </button>
          </div>
        )}
      </div>

      {/* Grade Scale Reference Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2">
        <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>HSC Board Grading Scale Reference (60 Marks Scale)</span>
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs pt-1">
          <div className={`p-2 rounded-xl border ${attempt.grade === 'A+' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className="block font-bold">A+</span>
            <span className="text-[10px]">≥ 80% (48-60)</span>
          </div>
          <div className={`p-2 rounded-xl border ${attempt.grade === 'A' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className="block font-bold">A</span>
            <span className="text-[10px]">70-79% (42-47.5)</span>
          </div>
          <div className={`p-2 rounded-xl border ${attempt.grade === 'B' ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className="block font-bold">B</span>
            <span className="text-[10px]">60-69% (36-41.5)</span>
          </div>
          <div className={`p-2 rounded-xl border ${attempt.grade === 'C' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className="block font-bold">C</span>
            <span className="text-[10px]">50-59% (30-35.5)</span>
          </div>
          <div className={`p-2 rounded-xl border ${attempt.grade === 'D' ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className="block font-bold">D</span>
            <span className="text-[10px]">40-49% (24-29.5)</span>
          </div>
          <div className={`p-2 rounded-xl border ${attempt.grade === 'F' ? 'bg-red-500/20 border-red-500 text-red-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <span className="block font-bold">F</span>
            <span className="text-[10px]">&lt; 40% (0-23.5)</span>
          </div>
        </div>
      </div>

      {/* Topic-Wise Accuracy Breakdown */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Topic-Wise Performance Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400">Correct count and weighted marks scored across all 10 topics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {(Object.values(attempt.topicBreakdown) as ExamTopicScore[]).map((topicScore) => {
            const topicMeta = TOPICS_DATA.find((t) => t.id === topicScore.topicId);
            const topicIcon = topicMeta?.icon || '📝';
            const topicScoredMarks = topicScore.scoredMarks !== undefined ? topicScore.scoredMarks : topicScore.correctCount * (topicScore.perQuestionMark || 1);
            const topicAccPercent = topicScore.marks > 0
              ? Math.round((topicScoredMarks / topicScore.marks) * 100)
              : 0;

            const scoredDisplay = topicScoredMarks % 1 === 0 ? topicScoredMarks : topicScoredMarks.toFixed(1);

            return (
              <div
                key={topicScore.topicId}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm shrink-0">
                      {topicIcon}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-white truncate block">
                        {topicScore.topicTitle}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {topicScore.correctCount} / {topicScore.totalQuestions} correct
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-extrabold text-cyan-300 block">
                      {scoredDisplay} / {topicScore.marks} Marks
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({topicScore.perQuestionMark || 1} mark/Q)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        topicAccPercent >= 80
                          ? 'bg-emerald-400'
                          : topicAccPercent >= 60
                          ? 'bg-cyan-400'
                          : topicAccPercent >= 40
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${topicAccPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Accuracy</span>
                    <span className={topicAccPercent >= 70 ? 'text-emerald-400 font-bold' : ''}>
                      {topicAccPercent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Question Review Toggle */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-800 space-y-4">
        <div
          onClick={() => {
            soundManager.playClick();
            setShowQuestionReview(!showQuestionReview);
          }}
          className="flex items-center justify-between cursor-pointer group"
        >
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>Full Question-by-Question Review (90 Questions)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inspect all 90 items with your answers, correct answers, mark values, and board rule explanations
            </p>
          </div>

          <button
            type="button"
            className="p-2 rounded-xl bg-slate-850 border border-slate-700 text-slate-300 group-hover:text-white"
          >
            {showQuestionReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showQuestionReview && (
          <div className="space-y-4 pt-3 border-t border-slate-800 animate-fade-in">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterReview('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterReview === 'all'
                    ? 'bg-cyan-500 text-black font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                All ({attempt.questions.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterReview('wrong')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterReview === 'wrong'
                    ? 'bg-rose-500 text-white font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Wrong ({wrongCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterReview('correct')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterReview === 'correct'
                    ? 'bg-emerald-500 text-black font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Correct ({correctCount})
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {reviewQuestions.map((q, idx) => {
                const userAns = attempt.userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const wasAnswered = !!userAns;
                const markVal = q.markValue !== undefined ? q.markValue : 1;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-left space-y-2.5 transition-all ${
                      isCorrect
                        ? 'bg-slate-950/60 border-emerald-500/30'
                        : 'bg-slate-950/80 border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          {q.instruction || 'Question'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {markVal} {markVal === 1 ? 'Mark' : 'Marks'}
                        </span>
                        {q.boardReference && (
                          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                            {q.boardReference}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm font-medium text-white">
                      {q.sentence || q.prompt}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : wasAnswered
                            ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold block opacity-70">
                          Your Answer {isCorrect ? `(+${markVal} m)` : '(0 m)'}
                        </span>
                        <span className="font-semibold">
                          {wasAnswered ? userAns : 'Unanswered (0 marks)'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                        <span className="text-[10px] uppercase font-bold block opacity-70">
                          Correct Answer
                        </span>
                        <span className="font-semibold">{q.correctAnswer}</span>
                      </div>
                    </div>

                    {/* Rule & Explanation */}
                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                        {q.explanation.rule && (
                          <div className="font-bold text-cyan-300">
                            Rule: {q.explanation.rule}
                          </div>
                        )}
                        {q.explanation.whyCorrect && (
                          <div className="text-slate-400">
                            {q.explanation.whyCorrect}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
