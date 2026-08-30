import { Question } from '../types';
import { QUESTIONS_DATA } from '../data/questions';
import { TOPICS_DATA } from '../data/topics';

export interface ExamTopicScore {
  topicId: string;
  topicTitle: string;
  marks: number;
  scored: number;
  totalQuestions: number;
}

export interface LastHourPrepAttempt {
  id: string;
  date: string;
  score: number;
  totalMarks: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentage: number;
  timeTakenSeconds: number;
  questionsAttemptedCount: number;
  topicBreakdown: Record<string, ExamTopicScore>;
  userAnswers: Record<string, string>; // questionId -> selectedOption
  flaggedQuestionIds: string[];
  questions: Question[];
}

export const EXAM_TOPIC_CONFIG = [
  { topicId: 'right_form_of_verbs', marks: 7, count: 7, title: 'Right Form of Verbs' },
  { topicId: 'articles', marks: 5, count: 5, title: 'Articles' },
  { topicId: 'preposition', marks: 7, count: 7, title: 'Prepositions' },
  { topicId: 'completing_sentences', marks: 7, count: 7, title: 'Completing Sentences' },
  { topicId: 'connectors', marks: 7, count: 7, title: 'Sentence Connectors' },
  { topicId: 'synonyms_antonyms', marks: 7, count: 7, title: 'Synonyms & Antonyms' },
  { topicId: 'punctuation', marks: 7, count: 7, title: 'Punctuation' },
  { topicId: 'modifiers', marks: 5, count: 5, title: 'Modifiers' },
  { topicId: 'changing_sentences', marks: 10, count: 10, title: 'Changing Sentences' },
  { topicId: 'tag_questions_and_special', marks: 5, count: 5, title: 'Tag Questions' },
];

export const TOTAL_EXAM_MARKS = 60;
export const EXAM_DURATION_SECONDS = 90 * 60; // 90 minutes = 5400 seconds

/**
 * Calculates letter grade according to HSC specifications
 */
export function calculateExamGrade(score: number, total: number = TOTAL_EXAM_MARKS): {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  percentage: number;
  description: string;
  color: string;
  diamondReward: number;
} {
  const percentage = Math.round((score / total) * 100);
  if (percentage >= 80) {
    return { grade: 'A+', percentage, description: 'Outstanding! GPA 5.0 Equivalent', color: '#22c55e', diamondReward: 20 };
  } else if (percentage >= 70) {
    return { grade: 'A', percentage, description: 'Excellent! High Board Standard', color: '#06b6d4', diamondReward: 10 };
  } else if (percentage >= 60) {
    return { grade: 'B', percentage, description: 'Good! Solid Understanding', color: '#3b82f6', diamondReward: 5 };
  } else if (percentage >= 50) {
    return { grade: 'C', percentage, description: 'Average. Needs Topic Revision', color: '#eab308', diamondReward: 0 };
  } else if (percentage >= 40) {
    return { grade: 'D', percentage, description: 'Passing Mark. Focus on Weak Areas', color: '#f97316', diamondReward: 0 };
  } else {
    return { grade: 'F', percentage, description: 'Below Passing. Immediate Practice Required', color: '#ef4444', diamondReward: 0 };
  }
}

/**
 * Generates a full 60-question Board Exam paper following topic distribution & difficulty mix
 */
export function generateExamPaper(): Question[] {
  const selectedQuestions: Question[] = [];
  const usedIds = new Set<string>();

  for (const config of EXAM_TOPIC_CONFIG) {
    // Find all questions matching this topic that have MCQ options
    let topicPool = QUESTIONS_DATA.filter((q) => {
      const match = q.topicId === config.topicId;
      return match && q.options && q.options.length >= 2;
    });

    // If pool empty (safety check for alternative topicId name), fallback
    if (topicPool.length === 0) {
      topicPool = QUESTIONS_DATA.filter((q) => q.topicId.includes(config.topicId) || config.topicId.includes(q.topicId));
    }

    // Filter out already used IDs
    let available = topicPool.filter((q) => !usedIds.has(q.id));
    if (available.length < config.count) {
      // Re-allow pool if not enough unique
      available = topicPool;
    }

    // Try difficulty mix: ~40% easy, ~40% medium, ~20% hard
    const easyPool = available.filter((q) => q.difficulty === 'easy');
    const medPool = available.filter((q) => q.difficulty === 'medium');
    const hardPool = available.filter((q) => q.difficulty === 'hard');

    const targetEasy = Math.max(1, Math.round(config.count * 0.4));
    const targetHard = Math.max(1, Math.round(config.count * 0.2));
    const targetMed = config.count - targetEasy - targetHard;

    const pickRandom = (arr: Question[], count: number): Question[] => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    };

    const pickedEasy = pickRandom(easyPool.length > 0 ? easyPool : available, targetEasy);
    const remainingAfterEasy = available.filter((q) => !pickedEasy.some((p) => p.id === q.id));
    
    const pickedMed = pickRandom(medPool.length > 0 ? medPool.filter((q) => !pickedEasy.some((p) => p.id === q.id)) : remainingAfterEasy, targetMed);
    const remainingAfterMed = remainingAfterEasy.filter((q) => !pickedMed.some((p) => p.id === q.id));

    const pickedHard = pickRandom(hardPool.length > 0 ? hardPool.filter((q) => !pickedEasy.some((p) => p.id === q.id) && !pickedMed.some((p) => p.id === q.id)) : remainingAfterMed, targetHard);

    let topicSelected = [...pickedEasy, ...pickedMed, ...pickedHard];

    // If still short of config.count, fill from remaining available
    if (topicSelected.length < config.count) {
      const rest = available.filter((q) => !topicSelected.some((ts) => ts.id === q.id));
      const extraNeeded = config.count - topicSelected.length;
      topicSelected.push(...pickRandom(rest.length > 0 ? rest : QUESTIONS_DATA, extraNeeded));
    }

    // Trim to exact count
    topicSelected = topicSelected.slice(0, config.count);

    topicSelected.forEach((q) => {
      usedIds.add(q.id);
      selectedQuestions.push(q);
    });
  }

  // If total is less than 60, fill with random questions from overall bank
  if (selectedQuestions.length < TOTAL_EXAM_MARKS) {
    const extraPool = QUESTIONS_DATA.filter((q) => !usedIds.has(q.id) && q.options && q.options.length >= 2);
    const shuffledExtra = [...extraPool].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffledExtra.slice(0, TOTAL_EXAM_MARKS - selectedQuestions.length));
  }

  // Finally, shuffle the entire 60-question set so questions are interspersed realistically
  return [...selectedQuestions].sort(() => Math.random() - 0.5);
}

/**
 * LocalStorage history management for Last Hour Prep Test
 */
const EXAM_HISTORY_KEY = 'hsc_last_hour_prep_history';

export function getExamHistory(): LastHourPrepAttempt[] {
  try {
    const raw = localStorage.getItem(EXAM_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LastHourPrepAttempt[];
  } catch (e) {
    console.error('Failed to load exam history:', e);
    return [];
  }
}

export function saveExamAttempt(attempt: LastHourPrepAttempt): void {
  try {
    const history = getExamHistory();
    const updated = [attempt, ...history].slice(0, 30); // keep last 30 attempts
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save exam attempt:', e);
  }
}

export function formatTimeRemaining(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
