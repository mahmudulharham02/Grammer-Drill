import { Question } from '../types';
import { VOICE_CHANGE_QUESTIONS } from './voiceChangeQuestions';
import { NARRATION_QUESTIONS } from './narrationQuestions';
import { VOICE_CHANGE_BANK } from './voiceChangeBank';
import { NARRATION_BANK } from './narrationBank';

// Import all 10 Topic Question Banks
import { RIGHT_FORM_OF_VERBS_QUESTIONS } from './rightFormOfVerbsBank';
import { ARTICLES_QUESTIONS } from './articlesBank';
import { PREPOSITIONS_QUESTIONS } from './prepositionsBank';
import { COMPLETING_SENTENCES_QUESTIONS } from './completingSentencesBank';
import { CONNECTORS_QUESTIONS } from './connectorsBank';
import { SYNONYMS_ANTONYMS_QUESTIONS } from './synonymsAntonymsBank';
import { PUNCTUATION_QUESTIONS } from './punctuationBank';
import { MODIFIERS_QUESTIONS } from './modifiersBank';
import { CHANGING_SENTENCES_QUESTIONS } from './changingSentencesBank';
import { TAG_QUESTIONS_QUESTIONS } from './tagQuestionsBank';

export {
  VOICE_CHANGE_BANK,
  NARRATION_BANK,
  VOICE_CHANGE_QUESTIONS,
  NARRATION_QUESTIONS,
  RIGHT_FORM_OF_VERBS_QUESTIONS,
  ARTICLES_QUESTIONS,
  PREPOSITIONS_QUESTIONS,
  COMPLETING_SENTENCES_QUESTIONS,
  CONNECTORS_QUESTIONS,
  SYNONYMS_ANTONYMS_QUESTIONS,
  PUNCTUATION_QUESTIONS,
  MODIFIERS_QUESTIONS,
  CHANGING_SENTENCES_QUESTIONS,
  TAG_QUESTIONS_QUESTIONS
};

export const QUESTIONS_DATA: Question[] = [
  ...RIGHT_FORM_OF_VERBS_QUESTIONS,
  ...ARTICLES_QUESTIONS,
  ...PREPOSITIONS_QUESTIONS,
  ...COMPLETING_SENTENCES_QUESTIONS,
  ...CONNECTORS_QUESTIONS,
  ...SYNONYMS_ANTONYMS_QUESTIONS,
  ...PUNCTUATION_QUESTIONS,
  ...MODIFIERS_QUESTIONS,
  ...CHANGING_SENTENCES_QUESTIONS,
  ...TAG_QUESTIONS_QUESTIONS,
  ...VOICE_CHANGE_QUESTIONS,
  ...NARRATION_QUESTIONS
];

export function getQuestionsByTopic(topicId: string, subtopicId?: string): Question[] {
  return QUESTIONS_DATA.filter((q) => {
    if (subtopicId) {
      return q.topicId === topicId && q.subtopicId === subtopicId;
    }
    return q.topicId === topicId;
  });
}

export function getRandomQuestions(count: number, topicId?: string): Question[] {
  const pool = topicId
    ? QUESTIONS_DATA.filter((q) => q.topicId === topicId)
    : QUESTIONS_DATA;
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export function getDailyChallengeQuestions(): Question[] {
  // 1 question from each available topic group
  const distinctTopics = Array.from(new Set(QUESTIONS_DATA.map((q) => q.topicId)));
  const dailySet: Question[] = [];

  for (const topic of distinctTopics) {
    const topicPool = QUESTIONS_DATA.filter((q) => q.topicId === topic);
    if (topicPool.length > 0) {
      const randomIdx = Math.floor(Math.random() * topicPool.length);
      dailySet.push(topicPool[randomIdx]);
    }
  }

  // If less than 10, fill with random questions up to 10
  if (dailySet.length < 10) {
    const remaining = QUESTIONS_DATA.filter((q) => !dailySet.some((d) => d.id === q.id));
    const extra = remaining.sort(() => Math.random() - 0.5).slice(0, 10 - dailySet.length);
    dailySet.push(...extra);
  }

  return dailySet;
}

export const ALL_QUESTIONS = QUESTIONS_DATA;
export default QUESTIONS_DATA;
