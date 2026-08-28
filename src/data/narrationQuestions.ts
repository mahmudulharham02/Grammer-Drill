import { Question } from '../types';

export const NARRATION_QUESTIONS: Question[] = [
  // 1. Assertive Sentences
  {
    id: 'nar_ass_01',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'assertive',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'He said to me, "I am very happy today."',
    options: [
      'He told me that he was very happy that day.',
      'He said to me that he is very happy today.',
      'He told me that he had been very happy today.',
      'He says that he was very happy that day.'
    ],
    correctAnswer: 'He told me that he was very happy that day.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'said to -> told; am -> was; today -> that day; I -> he',
    explanation: {
      rule: 'Assertive Direct to Indirect Speech',
      formula: 'Subject + told + Object + that + Subject (shifted) + Past Verb + shifted time words',
      whyCorrect: "Reporting verb 'said to' -> 'told'. Present 'am' -> Past 'was'. 'today' -> 'that day'. Pronoun 'I' (1st person) -> 'he'.",
      tenseShift: 'Present Simple (am) → Past Simple (was)',
      timeShift: 'today → that day',
      pronounShift: 'I (1st person) → he (matches subject He)',
      tip: "💡 Tip: 'said to' becomes 'told' when there is an object."
    }
  },
  {
    id: 'nar_ass_02',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'assertive',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'She said to me, "I have finished the work."',
    options: [
      'She told me that she had finished the work.',
      'She told me that she has finished the work.',
      'She said to me that I had finished the work.',
      'She told me that she finished the work.'
    ],
    correctAnswer: 'She told me that she had finished the work.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Rajshahi Board 2023',
    rule: 'Present Perfect -> Past Perfect (have finished -> had finished)',
    explanation: {
      rule: 'Tense Back-Shift: Present Perfect to Past Perfect',
      formula: 'She told me + that + she + had finished + the work',
      whyCorrect: "'have finished' shifts to 'had finished'. 'I' shifts to 'she'.",
      tenseShift: 'Present Perfect (have finished) → Past Perfect (had finished)',
      pronounShift: 'I → she',
      tip: "💡 Present perfect always changes to past perfect in indirect speech."
    }
  },
  {
    id: 'nar_ass_03',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'assertive',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'Rahim said, "I saw a bird yesterday."',
    options: [
      'Rahim said that he had seen a bird the previous day.',
      'Rahim said that he saw a bird yesterday.',
      'Rahim said that he has seen a bird the day before.',
      'Rahim told that he had seen a bird yesterday.'
    ],
    correctAnswer: 'Rahim said that he had seen a bird the previous day.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Cumilla Board 2022',
    rule: 'Past Simple -> Past Perfect; yesterday -> the previous day / the day before',
    explanation: {
      rule: 'Past Simple to Past Perfect',
      formula: 'Rahim said that + he + had seen (V3) + a bird + the previous day',
      whyCorrect: "'saw' (Past Simple) back-shifts to 'had seen' (Past Perfect). 'yesterday' becomes 'the previous day'.",
      tenseShift: 'Past Simple (saw) → Past Perfect (had seen)',
      timeShift: 'yesterday → the previous day',
      pronounShift: 'I → he',
      tip: "💡 Past Indefinite changes to Past Perfect."
    }
  },
  {
    id: 'nar_ass_04',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'assertive',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'They said, "We are playing now."',
    options: [
      'They said that they were playing then.',
      'They said that they are playing now.',
      'They said that we were playing then.',
      'They said that they were playing now.'
    ],
    correctAnswer: 'They said that they were playing then.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Chattogram Board 2022',
    rule: 'are playing -> were playing; now -> then; We -> they',
    explanation: {
      rule: 'Present Continuous to Past Continuous',
      formula: 'They said that + they + were playing + then',
      whyCorrect: "'are playing' becomes 'were playing', and 'now' shifts to 'then'.",
      tenseShift: 'Present Continuous (are playing) → Past Continuous (were playing)',
      timeShift: 'now → then',
      pronounShift: 'We → they',
    }
  },
  {
    id: 'nar_ass_05',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'assertive',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'The teacher said, "The earth moves round the sun."',
    options: [
      'The teacher said that the earth moves round the sun.',
      'The teacher said that the earth moved round the sun.',
      'The teacher said that the earth had moved round the sun.',
      'The teacher told that the earth was moving round the sun.'
    ],
    correctAnswer: 'The teacher said that the earth moves round the sun.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dhaka Board 2022',
    rule: 'Universal Truth: Tense does NOT change!',
    explanation: {
      rule: 'Universal Truth / Habitual Fact Exception',
      formula: 'The teacher said that + The earth moves round the sun (tense intact)',
      whyCorrect: "When the reported speech contains a universal truth, scientific fact, or habitual fact, the verb tense remains unchanged.",
      tenseShift: 'No Tense Shift (Universal Scientific Truth)',
      tip: "💡 Never back-shift universal truths!"
    }
  },

  // 2. Interrogative Sentences
  {
    id: 'nar_int_01',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'interrogative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'He said to me, "Are you going to school?"',
    options: [
      'He asked me if I was going to school.',
      'He asked me that I was going to school.',
      'He told me if was I going to school.',
      'He asked me whether was I going to school.'
    ],
    correctAnswer: 'He asked me if I was going to school.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Yes/No Question: said to -> asked + if/whether + assertive order (Subject + Verb)',
    explanation: {
      rule: 'Yes/No Interrogative Direct to Indirect',
      formula: 'Subject + asked + Object + if/whether + Subject (I) + Verb (was going)...',
      whyCorrect: "Question shifts to assertive word order. 'Are you going' becomes 'if I was going'.",
      tenseShift: 'Present Continuous → Past Continuous',
      pronounShift: 'you (2nd person) → I (matches object me)',
      tip: "💡 Question mark is removed and sentence becomes assertive."
    }
  },
  {
    id: 'nar_int_02',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'interrogative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'He said to me, "What is your name?"',
    options: [
      'He asked me what my name was.',
      'He asked me what was my name.',
      'He asked me that what my name was.',
      'He told me what is my name.'
    ],
    correctAnswer: 'He asked me what my name was.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Cumilla Board 2023',
    rule: 'Wh- Question: Wh-word + Subject + Verb (assertive order!)',
    explanation: {
      rule: 'Wh- Interrogative Direct to Indirect',
      formula: 'He asked me + what + Subject (my name) + Verb (was)',
      whyCorrect: "Never use 'that' with Wh- words. The word order MUST be subject before verb: 'what my name was', NOT 'what was my name'.",
      tenseShift: 'is → was',
      pronounShift: 'your name → my name',
      tip: "💡 Common mistake: Don't put the auxiliary before subject in indirect questions!"
    }
  },
  {
    id: 'nar_int_03',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'interrogative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'The teacher said to the student, "Why are you late today?"',
    options: [
      'The teacher asked the student why he was late that day.',
      'The teacher asked the student why was he late that day.',
      'The teacher asked the student why he is late today.',
      'The teacher told the student that why he was late.'
    ],
    correctAnswer: 'The teacher asked the student why he was late that day.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Sylhet Board 2022',
    rule: 'Why + Subject + was + late + that day',
    explanation: {
      rule: 'Wh- Interrogative with Time word',
      formula: 'The teacher asked the student + why + he + was + late + that day',
      whyCorrect: "'why' is followed by 'he was', and 'today' shifts to 'that day'.",
      timeShift: 'today → that day',
      tenseShift: 'are → was',
      pronounShift: 'you → he',
    }
  },

  // 3. Imperative Sentences
  {
    id: 'nar_imp_01',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'imperative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'The teacher said to the students, "Work hard."',
    options: [
      'The teacher advised the students to work hard.',
      'The teacher said the students to work hard.',
      'The teacher advised to the students to work hard.',
      'The teacher told the students that work hard.'
    ],
    correctAnswer: 'The teacher advised the students to work hard.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Imperative: advised/ordered/requested + Obj + to + V1',
    explanation: {
      rule: 'Imperative Advice',
      formula: 'Subject + advised + Object + to + V1 (work) + hard',
      whyCorrect: "Reporting verb changes to 'advised' and the imperative clause joins with 'to + V1'.",
      tip: "💡 Conjunction 'that' is replaced by 'to + base verb' in imperatives."
    }
  },
  {
    id: 'nar_imp_02',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'imperative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'The doctor said to the patient, "Do not smoke."',
    options: [
      'The doctor advised the patient not to smoke.',
      'The doctor forbade the patient not to smoke.',
      'The doctor advised the patient to not smoke.',
      'The doctor ordered the patient don\'t smoke.'
    ],
    correctAnswer: 'The doctor advised the patient not to smoke.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Rajshahi Board 2022',
    rule: 'Negative Imperative: advised + Obj + not to + V1 (OR forbade + to + V1)',
    explanation: {
      rule: 'Negative Imperative Speech',
      formula: 'The doctor advised the patient + not to + smoke',
      whyCorrect: "'not to + V1' is the standard negative infinitive. Note: If 'forbade' is used, do not use 'not' (forbade means prohibit).",
      tip: "💡 'forbade' already contains a negative meaning, so 'forbade to smoke' would be correct, but never 'forbade not to smoke'."
    }
  },
  {
    id: 'nar_imp_03',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'imperative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'She said, "Please help me."',
    options: [
      'She requested me to help her.',
      'She told me please to help her.',
      'She ordered me to help her.',
      'She asked that I help her.'
    ],
    correctAnswer: 'She requested me to help her.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Chattogram Board 2023',
    rule: 'Please -> requested + Obj + to + V1',
    explanation: {
      rule: 'Polite Request in Imperatives',
      formula: 'Subject + requested + (Object) + to + help + her',
      whyCorrect: "'Please' converts to the reporting verb 'requested', and 'me' shifts to 'her'.",
      pronounShift: 'me → her',
    }
  },

  // 4. Exclamatory Sentences
  {
    id: 'nar_exc_01',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'exclamatory',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'He said, "What a beautiful flower!"',
    options: [
      'He exclaimed with admiration that it was a very beautiful flower.',
      'He exclaimed that what a beautiful flower it was.',
      'He told that it is a very beautiful flower.',
      'He exclaimed with sorrow that it was a beautiful flower.'
    ],
    correctAnswer: 'He exclaimed with admiration that it was a very beautiful flower.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dhaka Board 2023',
    rule: 'What a + noun phrase -> exclaimed with admiration/joy that it was a very + adjective + noun',
    explanation: {
      rule: 'Exclamatory with What/How',
      formula: 'Subject + exclaimed with admiration + that + it + was + a very beautiful flower',
      whyCorrect: "Exclamations with 'What a' convert to 'very + adjective' in an assertive clause with past tense 'was'.",
      tip: "💡 'What a/How' turns into 'very/great' in indirect speech."
    }
  },
  {
    id: 'nar_exc_02',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'exclamatory',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'They said, "Hurrah! We have won the match."',
    options: [
      'They exclaimed with joy that they had won the match.',
      'They exclaimed with sorrow that they had won the match.',
      'They said that they have won the match.',
      'They exclaimed joyfully that we had won the match.'
    ],
    correctAnswer: 'They exclaimed with joy that they had won the match.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Cumilla Board 2021',
    rule: 'Hurrah! -> exclaimed with joy that + had won',
    explanation: {
      rule: 'Exclamation with Hurrah',
      formula: 'They + exclaimed with joy + that + they + had won + the match',
      whyCorrect: "'Hurrah!' indicates joy -> 'exclaimed with joy'. 'have won' shifts to 'had won'.",
      tenseShift: 'have won → had won',
      pronounShift: 'We → they',
    }
  },
  {
    id: 'nar_exc_03',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'exclamatory',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'He said, "Alas! I am undone."',
    options: [
      'He exclaimed with sorrow that he was undone.',
      'He exclaimed with joy that he was undone.',
      'He said alas that he was undone.',
      'He exclaimed sadly that I was undone.'
    ],
    correctAnswer: 'He exclaimed with sorrow that he was undone.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Sylhet Board 2023',
    rule: 'Alas! -> exclaimed with sorrow/grief that + he was undone',
    explanation: {
      rule: 'Exclamation with Alas',
      formula: 'He + exclaimed with sorrow + that + he + was + undone',
      whyCorrect: "'Alas!' denotes sorrow -> 'exclaimed with sorrow'. 'am' shifts to 'was'.",
    }
  },

  // 5. Optative Sentences
  {
    id: 'nar_opt_01',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'optative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'He said to me, "May Allah help you."',
    options: [
      'He prayed that Allah might help me.',
      'He wished that Allah may help me.',
      'He prayed to me that Allah might help you.',
      'He told me that Allah might help me.'
    ],
    correctAnswer: 'He prayed that Allah might help me.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dhaka Board 2022',
    rule: 'May Allah -> prayed that Allah might + V1 + me',
    explanation: {
      rule: 'Optative Prayer Sentence',
      formula: 'Subject + prayed + that + Allah + might + help + me',
      whyCorrect: "Prayers to Almighty use 'prayed'. 'May' shifts to 'might', and 'you' shifts to 'me'.",
      tenseShift: 'May → might',
      pronounShift: 'you → me',
    }
  },
  {
    id: 'nar_opt_02',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'optative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'The crowd shouted, "Long live the king."',
    options: [
      'The crowd prayed that the king might live long.',
      'The crowd wished that long live the king.',
      'The crowd prayed the king to live long.',
      'The crowd said that the king will live long.'
    ],
    correctAnswer: 'The crowd prayed that the king might live long.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Barishal Board 2021',
    rule: 'Long live -> prayed/wished that the king might live long',
    explanation: {
      rule: 'Optative Wish/Prayer',
      formula: 'The crowd + prayed that + the king + might + live long',
      whyCorrect: "Sentences starting with 'Long live...' supply modal 'might' after the subject in the indirect clause.",
    }
  },
  {
    id: 'nar_opt_03',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'optative',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'He said, "If I were a bird!"',
    options: [
      'He wished that he had been a bird.',
      'He wished that if he were a bird.',
      'He said that he was a bird.',
      'He exclaimed that he were a bird.'
    ],
    correctAnswer: 'He wished that he had been a bird.',
    correctIndex: 0,
    difficulty: 'hard',
    boardReference: 'Dinajpur Board 2023',
    rule: 'If I were -> wished that he had been',
    explanation: {
      rule: 'Unreal Wish in Optative',
      formula: 'He + wished that + he + had been + a bird',
      whyCorrect: "Unreal subjunctive 'were' shifts to past perfect subjunctive 'had been'.",
    }
  },

  // 6. Mixed Review
  {
    id: 'nar_mix_01',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    subModule: 'mixed',
    direction: 'direct_to_indirect',
    type: 'mcq',
    instruction: 'Change the speech from Direct to Indirect',
    prompt: 'Change into Indirect Speech:',
    sentence: 'Father said to me, "Do not waste your time and study attentively."',
    options: [
      'Father advised me not to waste my time and to study attentively.',
      'Father told me that not waste your time and study attentively.',
      'Father ordered me not to waste your time and to study attentively.',
      'Father forbade me to not waste my time and study attentively.'
    ],
    correctAnswer: 'Father advised me not to waste my time and to study attentively.',
    correctIndex: 0,
    difficulty: 'hard',
    boardReference: 'Dhaka Board 2023',
    rule: 'Compound Imperative: not to waste my time and to study attentively',
    explanation: {
      rule: 'Compound Imperative sentences',
      formula: 'Father advised me + not to waste my time + and + to study attentively',
      whyCorrect: "Both coordinate verbs are connected with infinitive markers ('not to waste' and 'to study'). Pronoun 'your' -> 'my'.",
    }
  }
];
