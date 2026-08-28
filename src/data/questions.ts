import { Question } from '../types';
import { VOICE_CHANGE_QUESTIONS } from './voiceChangeQuestions';
import { NARRATION_QUESTIONS } from './narrationQuestions';
import { VOICE_CHANGE_BANK } from './voiceChangeBank';
import { NARRATION_BANK } from './narrationBank';

export { VOICE_CHANGE_BANK, NARRATION_BANK };

export const QUESTIONS_DATA: Question[] = [
  ...VOICE_CHANGE_QUESTIONS,
  ...NARRATION_QUESTIONS,
  // -------------------------------------------------------------
  // TOPIC 1: RIGHT FORM OF VERBS
  // -------------------------------------------------------------
  {
    id: 'rfv_1',
    topicId: 'right_form_of_verbs',
    subtopicId: 'tenses_and_agreement',
    type: 'mcq',
    instruction: 'Choose the correct form of the verb in brackets:',
    prompt: 'Neither Rahim nor his brothers _____ (present) in the meeting yesterday.',
    options: ['was', 'were', 'has been', 'are'],
    correctAnswer: 'were',
    explanation: {
      rule: 'Subject-Verb Agreement with "Neither...nor"',
      whyCorrect: 'When subjects are joined by "either...or" or "neither...nor", the verb agrees with the NEAREST subject ("his brothers" is plural) and the sentence indicates past time ("yesterday"), so "were" is correct.',
      whyWrong: {
        0: '"was" is singular, but the nearest subject "his brothers" is plural.',
        2: '"has been" indicates present perfect, which contradicts "yesterday".',
        3: '"are" is present tense, which contradicts the past adverb "yesterday".'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'rfv_2',
    topicId: 'right_form_of_verbs',
    subtopicId: 'modals_and_bare_infinitives',
    type: 'mcq',
    instruction: 'Select the correct form of the verb:',
    prompt: 'You had better _____ (consult) an experienced doctor immediately.',
    options: ['consult', 'to consult', 'consulted', 'consulting'],
    correctAnswer: 'consult',
    explanation: {
      rule: 'Bare Infinitive after "Had Better"',
      whyCorrect: 'After expressions like "had better", "would rather", "let", "make", and modal auxiliaries, the bare infinitive (Base Form V1 without "to") is strictly used.',
      whyWrong: {
        1: '"to consult" incorrectly includes "to" (had better requires bare infinitive).',
        2: '"consulted" is past form; "had better" expresses present/future advice followed by V1.',
        3: '"consulting" is a participle/gerund, which is grammatically incorrect here.'
      }
    },
    boardReference: 'Rajshahi Board 2022',
    difficulty: 'easy'
  },
  {
    id: 'rfv_3',
    topicId: 'right_form_of_verbs',
    subtopicId: 'modals_and_bare_infinitives',
    type: 'fill_blank',
    instruction: 'Type the correct form of the verb in the blank:',
    prompt: 'The student went to the library with a view to _____ (collect) research materials for his HSC project.',
    correctAnswer: 'collecting',
    explanation: {
      rule: 'Prepositional Phrases taking Verb + ing',
      whyCorrect: 'After phrases ending with a preposition like "with a view to", "look forward to", "get used to", "be accustomed to", and "cannot help", the verb must take "-ing" form (Gerund).',
    },
    boardReference: 'Cumilla Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'rfv_4',
    topicId: 'right_form_of_verbs',
    subtopicId: 'tenses_and_agreement',
    type: 'mcq',
    instruction: 'Choose the correct verb form:',
    prompt: 'It is high time we _____ (change) our corrupted habits and mindset.',
    options: ['changed', 'change', 'should change', 'had changed'],
    correctAnswer: 'changed',
    explanation: {
      rule: 'Subjunctive Past after "It is high time + Subject"',
      whyCorrect: 'When "It is high time" or "It is time" is followed by a subject, the verb MUST be in the Past Indefinite (V2) form to express urgency for an action that is already delayed.',
      whyWrong: {
        1: '"change" is present tense, violating the rule.',
        2: '"should change" is redundant; simple past is the standard HSC curriculum structure.',
        3: '"had changed" is past perfect, which is unnecessary.'
      }
    },
    boardReference: 'Chattogram Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'rfv_5',
    topicId: 'right_form_of_verbs',
    subtopicId: 'tenses_and_agreement',
    type: 'mcq',
    instruction: 'Select the right form of verb:',
    prompt: 'The chairman, along with his committee members, _____ (arrive) at the auditorium just now.',
    options: ['has arrived', 'have arrived', 'arrived', 'were arriving'],
    correctAnswer: 'has arrived',
    explanation: {
      rule: 'Subject agreement with "along with / as well as"',
      whyCorrect: 'When subjects are connected by "along with", "as well as", "with", or "together with", the verb strictly agrees with the FIRST subject ("The chairman" is singular). "Just now" indicates Present Perfect tense ("has arrived").',
      whyWrong: {
        1: '"have arrived" is plural, incorrectly agreeing with "committee members".',
        2: '"arrived" is simple past, whereas "just now" triggers Present Perfect in HSC grammar.',
        3: '"were arriving" is past continuous and plural.'
      }
    },
    boardReference: 'Jashore Board 2022',
    difficulty: 'hard'
  },

  // -------------------------------------------------------------
  // TOPIC 2: ARTICLES
  // -------------------------------------------------------------
  {
    id: 'art_1',
    topicId: 'articles',
    subtopicId: 'indefinite_articles',
    type: 'mcq',
    instruction: 'Choose the correct article for the blank:',
    prompt: 'Mr. Chowdhury is _____ honorable judge respected across the district.',
    options: ['an', 'a', 'the', 'no article (x)'],
    correctAnswer: 'an',
    explanation: {
      rule: 'Indefinite Article before Silent "H"',
      whyCorrect: 'The word "honorable" starts with a silent "h" and produces a vowel sound (/ˈɒn.ər.ə.bəl/), hence the indefinite article "an" is used.',
      whyWrong: {
        1: '"a" is used before consonant sounds, but "honorable" begins with a vowel sound.',
        2: '"the" would imply a specific known judge in a context where an indefinite profession is introduced.',
        3: 'An article is grammatically required before singular countable noun with adjective.'
      }
    },
    boardReference: 'Dhaka Board 2022',
    difficulty: 'easy'
  },
  {
    id: 'art_2',
    topicId: 'articles',
    subtopicId: 'indefinite_articles',
    type: 'mcq',
    instruction: 'Select the appropriate article:',
    prompt: 'He holds _____ European passport and studies at a renowned international university.',
    options: ['a', 'an', 'the', 'no article (x)'],
    correctAnswer: 'a',
    explanation: {
      rule: 'Article before Vowel letters sounding like "You" (/juː/)',
      whyCorrect: 'Although "European" starts with vowel letters "Eu", its initial phonetic sound is a consonant glide /j/ ("you-ro-pean"), so "a" is used.',
      whyWrong: {
        1: '"an" is only used before true vowel sounds, not the /j/ glide.',
        2: '"the" would indicate a specific unique passport already known.',
        3: 'A countable singular noun phrase requires an article.'
      }
    },
    boardReference: 'Barishal Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'art_3',
    topicId: 'articles',
    subtopicId: 'definite_and_zero',
    type: 'mcq',
    instruction: 'Choose the correct option for both blanks:',
    prompt: '_____ Padma is the longest river in Bangladesh, while _____ gold of South Africa is world famous.',
    options: ['The, The', 'A, The', 'The, (x)', '(x), The'],
    correctAnswer: 'The, The',
    explanation: {
      rule: 'Definite article before Rivers and Specific Material Nouns',
      whyCorrect: 'Names of rivers take "The" (The Padma). Material nouns normally take zero article, but when specified with a prepositional phrase ("gold of South Africa"), they take the definite article "The".',
      whyWrong: {
        2: 'Material nouns made definite by "of South Africa" require "The", not zero article.'
      }
    },
    boardReference: 'Dinajpur Board 2022',
    difficulty: 'hard'
  },

  // -------------------------------------------------------------
  // TOPIC 3: PREPOSITIONS
  // -------------------------------------------------------------
  {
    id: 'prep_1',
    topicId: 'preposition',
    subtopicId: 'appropriate_prep',
    type: 'mcq',
    instruction: 'Fill in the blank with the appropriate preposition:',
    prompt: 'Mr. Ahmed is senior _____ me by five years in the civil service.',
    options: ['to', 'than', 'from', 'with'],
    correctAnswer: 'to',
    explanation: {
      rule: 'Latin Comparative Adjectives take "TO"',
      whyCorrect: 'Comparative adjectives derived from Latin (senior, junior, superior, inferior, prior, anterior, posterior) and the verb "prefer" are followed by the preposition "to", NEVER "than".',
      whyWrong: {
        1: '"than" is used for standard English comparatives, but is strictly incorrect for Latin comparatives.',
        2: '"from" is incorrect usage.',
        3: '"with" is incorrect usage.'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'prep_2',
    topicId: 'preposition',
    subtopicId: 'appropriate_prep',
    type: 'fill_blank',
    instruction: 'Type the appropriate preposition in the blank:',
    prompt: 'The freedom fighters did not hesitate to die _____ their beloved motherland.',
    correctAnswer: 'for',
    explanation: {
      rule: 'Appropriate Preposition with "Die"',
      whyCorrect: 'Die OF a disease (die of cholera) | Die FROM an effect (die from overwork/wounds) | Die FOR a noble cause/country (die for the country) | Die BY violence/poison.',
    },
    boardReference: 'Mymensingh Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'prep_3',
    topicId: 'preposition',
    subtopicId: 'appropriate_prep',
    type: 'mcq',
    instruction: 'Choose the correct preposition:',
    prompt: 'A conscientious citizen must abide _____ the established laws of the state.',
    options: ['by', 'with', 'to', 'in'],
    correctAnswer: 'by',
    explanation: {
      rule: 'Appropriate Preposition with "Abide"',
      whyCorrect: '"Abide by" is an idiomatic phrasal verb meaning to obey, conform to, or accept a rule or decision.',
      whyWrong: {
        1: '"abide with" is archaic for dwelling with someone.',
        2: '"abide to" is grammatically incorrect.',
        3: '"abide in" means to reside in a place.'
      }
    },
    boardReference: 'Sylhet Board 2022',
    difficulty: 'easy'
  },

  // -------------------------------------------------------------
  // TOPIC 4: COMPLETING SENTENCES
  // -------------------------------------------------------------
  {
    id: 'cs_1',
    topicId: 'completing_sentences',
    subtopicId: 'connective_structures',
    type: 'mcq',
    instruction: 'Select the clause that correctly completes the sentence according to HSC board rules:',
    prompt: 'Walk fast lest _____ .',
    options: [
      'you should miss the train',
      'you will miss the train',
      'you should not miss the train',
      'you miss the train'
    ],
    correctAnswer: 'you should miss the train',
    explanation: {
      rule: 'Structure with "Lest"',
      whyCorrect: '"Lest" means "for fear that / in case". It is always followed by: Subject + should / might + V1. Because "lest" already conveys negative apprehension, negative words like "not" must NEVER be used.',
      whyWrong: {
        1: '"will" violates the subjunctive rule for lest.',
        2: '"should not" introduces an invalid double negative.',
        3: 'Lacks the modal auxiliary "should/might".'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'cs_2',
    topicId: 'completing_sentences',
    subtopicId: 'conditionals_and_inversions',
    type: 'mcq',
    instruction: 'Complete the sentence with the correct third conditional clause:',
    prompt: 'If you had informed me earlier, _____ .',
    options: [
      'I would have helped you solve the problem',
      'I will help you solve the problem',
      'I would help you solve the problem',
      'I had helped you solve the problem'
    ],
    correctAnswer: 'I would have helped you solve the problem',
    explanation: {
      rule: 'Third Conditional Structure',
      whyCorrect: 'Formula: If + Past Perfect (had + V3), Subject + would have / could have / might have + V3. Here "had informed" is Past Perfect, so the main clause requires "would have helped".',
      whyWrong: {
        1: '"will help" is for First Conditional (If + Present).',
        2: '"would help" is for Second Conditional (If + Past Indefinite).',
        3: '"had helped" lacks the conditional auxiliary.'
      }
    },
    boardReference: 'Rajshahi Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'cs_3',
    topicId: 'completing_sentences',
    subtopicId: 'connective_structures',
    type: 'mcq',
    instruction: 'Choose the correct completion for the sentence:',
    prompt: 'He speaks as if he _____ everything in the world.',
    options: ['knew', 'knows', 'has known', 'is knowing'],
    correctAnswer: 'knew',
    explanation: {
      rule: 'Unreal Comparison with "As if / As though"',
      whyCorrect: 'When the first clause is in Present Indefinite ("He speaks"), the clause after "as if / as though" takes Past Indefinite (V2) or "were" to denote hypothetical condition.',
      whyWrong: {
        1: '"knows" is factual present, but "as if" expresses an unreal hypothesis requiring past subjunctive.',
        2: '"has known" is present perfect.',
        3: '"is knowing" is present continuous.'
      }
    },
    boardReference: 'Chattogram Board 2022',
    difficulty: 'medium'
  },

  // -------------------------------------------------------------
  // TOPIC 5: SENTENCE CONNECTORS
  // -------------------------------------------------------------
  {
    id: 'conn_1',
    topicId: 'connectors',
    subtopicId: 'contrast_and_addition',
    type: 'mcq',
    instruction: 'Choose the most suitable sentence connector for the context:',
    prompt: 'Trees supply us with oxygen and prevent soil erosion. _____, they provide timber, shade, and fruits.',
    options: ['Moreover', 'On the contrary', 'Otherwise', 'However'],
    correctAnswer: 'Moreover',
    explanation: {
      rule: 'Additive Sentence Connectors',
      whyCorrect: '"Moreover / Furthermore / In addition" is used to add additional supportive points to an existing positive statement.',
      whyWrong: {
        1: '"On the contrary" shows strong opposition or refutation.',
        2: '"Otherwise" expresses condition/alternative.',
        3: '"However" introduces a contrast or concession.'
      }
    },
    boardReference: 'Cumilla Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'conn_2',
    topicId: 'connectors',
    subtopicId: 'contrast_and_addition',
    type: 'mcq',
    instruction: 'Select the correct linker of contrast:',
    prompt: 'He studied day and night for the examination. _____, he could not secure GPA 5.0 due to sudden illness.',
    options: ['Nevertheless', 'Therefore', 'Consequently', 'Besides'],
    correctAnswer: 'Nevertheless',
    explanation: {
      rule: 'Contrast & Concession Linkers',
      whyCorrect: '"Nevertheless / However / Nonetheless" expresses contrast or an unexpected outcome despite previous diligent efforts.',
      whyWrong: {
        1: '"Therefore" indicates direct cause and effect, not contrast.',
        2: '"Consequently" denotes logical consequence.',
        3: '"Besides" denotes addition.'
      }
    },
    boardReference: 'Dhaka Board 2022',
    difficulty: 'medium'
  },

  // -------------------------------------------------------------
  // TOPIC 6: SYNONYMS & ANTONYMS
  // -------------------------------------------------------------
  {
    id: 'syn_1',
    topicId: 'synonyms_antonyms',
    subtopicId: 'hsc_vocab_bank',
    type: 'mcq',
    instruction: 'Find the correct SYNONYM of the highlighted word in context:',
    prompt: 'The government took **pragmatic** steps to alleviate youth unemployment across the country.',
    options: ['practical', 'theoretical', 'careless', 'temporary'],
    correctAnswer: 'practical',
    explanation: {
      rule: 'HSC Core Vocabulary Definition',
      whyCorrect: '"Pragmatic" means dealing with things sensibly and realistically based on practical rather than theoretical considerations. Synonym: practical, sensible, utilitarian.',
      whyWrong: {
        1: '"theoretical" is the exact antonym of pragmatic.',
        2: '"careless" means negligent.',
        3: '"temporary" means short-lived.'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'syn_2',
    topicId: 'synonyms_antonyms',
    subtopicId: 'hsc_vocab_bank',
    type: 'mcq',
    instruction: 'Find the correct ANTONYM of the highlighted word:',
    prompt: 'Smoking is **detrimental** to human health.',
    options: ['beneficial', 'harmful', 'injurious', 'destructive'],
    correctAnswer: 'beneficial',
    explanation: {
      rule: 'Antonyms of Negative Health Terms',
      whyCorrect: '"Detrimental" means tending to cause harm or damage. The opposite (antonym) is "beneficial" or "advantageous".',
      whyWrong: {
        1: '"harmful" is a synonym of detrimental.',
        2: '"injurious" is a synonym.',
        3: '"destructive" is a synonym.'
      }
    },
    boardReference: 'Rajshahi Board 2023',
    difficulty: 'easy'
  },

  // -------------------------------------------------------------
  // TOPIC 7: PUNCTUATION & CAPITALIZATION
  // -------------------------------------------------------------
  {
    id: 'punc_1',
    topicId: 'punctuation',
    subtopicId: 'dialogue_and_quotes',
    type: 'mcq',
    instruction: 'Choose the sentence with 100% correct punctuation and capitalization:',
    prompt: 'Direct Speech dialogue sentence:',
    options: [
      '"Why are you weeping, my child?" asked the kind woman.',
      '"Why are you weeping my child"? asked the kind woman.',
      '"Why are you weeping, my child" Asked the kind woman.',
      '"Why are you weeping my child," asked the kind woman?'
    ],
    correctAnswer: '"Why are you weeping, my child?" asked the kind woman.',
    explanation: {
      rule: 'Direct Speech Punctuation in HSC English',
      whyCorrect: '1. Comma sets off vocative noun of address ("my child"). 2. The question mark sits INSIDE the closing quotation mark. 3. The reporting clause begins with a lowercase letter ("asked") unless it is a proper noun.',
      whyWrong: {
        1: 'The question mark is wrongly placed outside the quotation mark and comma is missing.',
        2: '"Asked" is wrongly capitalized mid-sentence.',
        3: 'Missing question mark inside the quote and placed at the end of statement.'
      }
    },
    boardReference: 'Dhaka Board 2022',
    difficulty: 'hard'
  },

  // -------------------------------------------------------------
  // TOPIC 8: MODIFIERS
  // -------------------------------------------------------------
  {
    id: 'mod_1',
    topicId: 'modifiers',
    subtopicId: 'pre_modifiers',
    type: 'mcq',
    instruction: 'Identify the grammatically required pre-modifier:',
    prompt: 'Kazi Nazrul Islam is a _____ (pre-modify the noun with an adjective) poet of Bengali literature.',
    options: ['rebel', 'rebellious', 'rebellion', 'rebelling'],
    correctAnswer: 'rebellious',
    explanation: {
      rule: 'Adjective as Pre-modifier of a Noun',
      whyCorrect: 'To pre-modify the noun "poet", we need the qualitative adjective form "rebellious" (or famously known as "the rebel poet" where "rebel" acts as a noun-adjective; in standard single-word adjective questions, "rebellious" modifies poet).',
      whyWrong: {
        2: '"rebellion" is an abstract noun, not an adjective.',
        3: '"rebelling" is a participle denoting continuous action.'
      }
    },
    boardReference: 'Cumilla Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'mod_2',
    topicId: 'modifiers',
    subtopicId: 'post_modifiers',
    type: 'mcq',
    instruction: 'Choose the appropriate appositive to post-modify the noun:',
    prompt: 'Sher-e-Bangla A.K. Fazlul Huq, _____ , fought tirelessly for the rights of Bengali peasants.',
    options: [
      'a great leader of the masses',
      'who was a great leader',
      'being a great leader',
      'to be a leader'
    ],
    correctAnswer: 'a great leader of the masses',
    explanation: {
      rule: 'Appositive as Post-modifier',
      whyCorrect: 'An appositive is a noun phrase placed immediately after another noun to explain or rename it, separated by commas, WITHOUT a relative pronoun or finite verb.',
      whyWrong: {
        1: '"who was a great leader" is a relative clause, not an appositive noun phrase.',
        2: '"being a great leader" is a participial phrase.',
        3: '"to be a leader" is an infinitive phrase.'
      }
    },
    boardReference: 'Barishal Board 2023',
    difficulty: 'medium'
  },

  // -------------------------------------------------------------
  // TOPIC 9: CHANGING SENTENCES ⭐ (STAR MODULE - 10 MARKS)
  // -------------------------------------------------------------
  // A. Voice Change (Active ↔ Passive)
  {
    id: 'cs_vc_1',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    type: 'transformation_mcq',
    instruction: 'Change the voice of the sentence as directed:',
    originalSentence: 'The students are playing a friendly cricket match.',
    targetTransformation: '(Transform into Passive Voice)',
    prompt: 'Original: "The students are playing a friendly cricket match." (Passive)',
    options: [
      'A friendly cricket match is being played by the students.',
      'A friendly cricket match was being played by the students.',
      'A friendly cricket match has been played by the students.',
      'A friendly cricket match is played by the students.'
    ],
    correctAnswer: 'A friendly cricket match is being played by the students.',
    explanation: {
      rule: 'Present Continuous Passive Formula',
      formula: 'Subject + is/am/are + being + V3 (Past Participle) + by + Object',
      whyCorrect: 'Original tense is Present Continuous ("are playing"). In passive, the singular subject "A friendly cricket match" takes "is being played by the students".',
      whyWrong: {
        1: '"was being played" wrongly alters the tense to Past Continuous.',
        2: '"has been played" wrongly alters the tense to Present Perfect.',
        3: '"is played" is Simple Present, missing the continuous auxiliary "being".'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'cs_vc_2',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    type: 'transformation_mcq',
    instruction: 'Transform into Passive Voice:',
    originalSentence: 'Who broke the precious antique vase?',
    targetTransformation: '(Passive Voice)',
    prompt: 'Original: "Who broke the precious antique vase?" (Passive)',
    options: [
      'By whom was the precious antique vase broken?',
      'By whom the precious antique vase was broken?',
      'Who was the precious antique vase broken by?',
      'By whom did the precious antique vase break?'
    ],
    correctAnswer: 'By whom was the precious antique vase broken?',
    explanation: {
      rule: 'Interrogative Voice Change with "Who"',
      formula: 'By whom + Auxiliary Verb (was/were) + Subject + V3 + ?',
      whyCorrect: '"Who" transforms to "By whom". Since the original tense is Simple Past ("broke"), auxiliary "was" must precede the subject "the precious antique vase" to maintain interrogative inversion.',
      whyWrong: {
        1: '"By whom the precious...was broken" lacks subject-auxiliary inversion (it is in assertive order).',
        3: '"did...break" is active voice structure.'
      }
    },
    boardReference: 'Rajshahi Board 2022',
    difficulty: 'medium'
  },
  {
    id: 'cs_vc_3',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    type: 'transformation_mcq',
    instruction: 'Change the Imperative Sentence into Passive Voice:',
    originalSentence: 'Do not disclose this confidential information to anyone.',
    targetTransformation: '(Passive Voice)',
    prompt: 'Original: "Do not disclose this confidential information to anyone." (Passive)',
    options: [
      'Let not this confidential information be disclosed to anyone.',
      'Let this confidential information not disclosed to anyone.',
      'This confidential information should not disclose.',
      'Let not be disclosed this confidential information.'
    ],
    correctAnswer: 'Let not this confidential information be disclosed to anyone.',
    explanation: {
      rule: 'Negative Imperative Passive Formula',
      formula: 'Let + Object + not + be + V3 (or: Let not + Object + be + V3)',
      whyCorrect: 'Negative imperatives starting with "Do not" take: Let not + Object ("this confidential information") + be + V3 ("disclosed") + rest.',
      whyWrong: {
        1: 'Missing the auxiliary "be".',
        2: '"should not disclose" is active voice.',
        3: 'Malformed syntactic order.'
      }
    },
    boardReference: 'Chattogram Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'cs_vc_4',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    type: 'transformation_mcq',
    instruction: 'Change the Passive Voice into Active Voice:',
    originalSentence: 'Promises should be kept at all costs.',
    targetTransformation: '(Transform into Active Voice)',
    prompt: 'Original: "Promises should be kept at all costs." (Active)',
    options: [
      'One should keep one\'s promises at all costs.',
      'We must keep promises at all costs.',
      'You should keep promises at all costs.',
      'They will keep promises at all costs.'
    ],
    correctAnswer: 'One should keep one\'s promises at all costs.',
    explanation: {
      rule: 'Active Voice with Indefinite Subject',
      whyCorrect: 'When the agent in a moral passive statement is omitted, the universal indefinite pronoun "One" with its possessive "one\'s" is the standard HSC transformation (One should keep one\'s promises).',
      whyWrong: {
        1: 'Changes the modal from "should" to "must".',
        3: 'Changes modal to "will".'
      }
    },
    boardReference: 'Jashore Board 2023',
    difficulty: 'hard'
  },

  // B. Narration (Direct ↔ Indirect)
  {
    id: 'cs_nar_1',
    topicId: 'changing_sentences',
    subtopicId: 'narration',
    type: 'transformation_mcq',
    instruction: 'Transform Direct Speech to Indirect Speech:',
    originalSentence: 'The teacher said to the student, "Why are you making a noise in the class today?"',
    targetTransformation: '(Indirect Speech)',
    prompt: 'Original: The teacher said to the student, "Why are you making a noise in the class today?"',
    options: [
      'The teacher asked the student why he was making a noise in the class that day.',
      'The teacher asked the student that why was he making a noise in the class today.',
      'The teacher asked the student why was he making a noise in the class that day.',
      'The teacher told the student why he is making a noise in the class that day.'
    ],
    correctAnswer: 'The teacher asked the student why he was making a noise in the class that day.',
    explanation: {
      rule: 'Interrogative Narration Formula',
      whyCorrect: '1. "said to" ➔ "asked". 2. Wh-word "why" is retained as conjunction (NO "that"). 3. Interrogative order converts to Assertive order (subject "he" + verb "was making"). 4. Time adverb "today" shifts to "that day".',
      whyWrong: {
        1: '"that why" is a double conjunction error; "was he" maintains question order which is invalid in indirect speech.',
        2: '"why was he" maintains inverted question order.',
        3: '"told" is for assertive, and "is making" fails to backshift tense.'
      }
    },
    boardReference: 'Dhaka Board 2022',
    difficulty: 'medium'
  },

  // C. Affirmative ↔ Negative (16 Rules)
  {
    id: 'cs_an_1',
    topicId: 'changing_sentences',
    subtopicId: 'affirmative_negative',
    type: 'transformation_mcq',
    instruction: 'Transform Affirmative to Negative without changing the meaning:',
    originalSentence: 'Only the brave deserve the fair.',
    targetTransformation: '(Make it Negative)',
    prompt: 'Original: "Only the brave deserve the fair." (Negative)',
    options: [
      'None but the brave deserve the fair.',
      'Nothing but the brave deserve the fair.',
      'Not more than the brave deserve the fair.',
      'The brave cannot but deserve the fair.'
    ],
    correctAnswer: 'None but the brave deserve the fair.',
    explanation: {
      rule: 'Rule 1 of Affirmative to Negative',
      formula: 'Only/Alone (referring to persons) ➔ None but (at the beginning)',
      whyCorrect: '"The brave" refers to courageous people (persons), so "Only" is substituted with "None but" at the sentence start.',
      whyWrong: {
        1: '"Nothing but" is strictly used for inanimate objects/things.',
        2: '"Not more than" is strictly used for numerical quantity or age.'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'cs_an_2',
    topicId: 'changing_sentences',
    subtopicId: 'affirmative_negative',
    type: 'transformation_mcq',
    instruction: 'Transform Affirmative to Negative:',
    originalSentence: 'Every mother loves her child dearly.',
    targetTransformation: '(Make it Negative)',
    prompt: 'Original: "Every mother loves her child dearly." (Negative)',
    options: [
      'There is no mother but loves her child dearly.',
      'No mother loves her child dearly.',
      'Every mother does not love her child dearly.',
      'There is no mother and loves her child dearly.'
    ],
    correctAnswer: 'There is no mother but loves her child dearly.',
    explanation: {
      rule: 'Rule 4 of Affirmative to Negative',
      formula: 'Every + noun ➔ There is no + noun + but + V1 (or: There is no + noun + who does not + V1)',
      whyCorrect: '"Every mother" transforms to "There is no mother but loves her child dearly" preserving exact affirmative meaning.',
      whyWrong: {
        1: '"No mother loves her child" completely reverses the factual meaning.',
        2: 'Simple negative changes meaning.'
      }
    },
    boardReference: 'Rajshahi Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'cs_an_3',
    topicId: 'changing_sentences',
    subtopicId: 'affirmative_negative',
    type: 'transformation_mcq',
    instruction: 'Transform Affirmative to Negative:',
    originalSentence: 'We must submit to the unalterable decree of fate.',
    targetTransformation: '(Make it Negative)',
    prompt: 'Original: "We must submit to the unalterable decree of fate." (Negative)',
    options: [
      'We cannot but submit to the unalterable decree of fate.',
      'We must not submit to the unalterable decree of fate.',
      'We cannot help submit to the unalterable decree of fate.',
      'We have to submit to the unalterable decree of fate.'
    ],
    correctAnswer: 'We cannot but submit to the unalterable decree of fate.',
    explanation: {
      rule: 'Rule 2: Must ➔ Cannot but + V1',
      formula: 'Must ➔ Cannot but + Base Verb (or: Cannot help + Verb-ing)',
      whyCorrect: '"Must" is replaced with "cannot but" followed by bare infinitive "submit".',
      whyWrong: {
        1: '"must not" reverses the meaning.',
        2: '"cannot help" requires verb+ing ("submitting"), so "cannot help submit" is ungrammatical.'
      }
    },
    boardReference: 'Dinajpur Board 2022',
    difficulty: 'medium'
  },

  // D. Simple ↔ Complex ↔ Compound
  {
    id: 'cs_scc_1',
    topicId: 'changing_sentences',
    subtopicId: 'simple_compound_complex',
    type: 'transformation_mcq',
    instruction: 'Transform the Simple sentence into a Complex sentence:',
    originalSentence: 'In spite of having vast wealth, the man is notoriously miserly.',
    targetTransformation: '(Make it Complex)',
    prompt: 'Original: "In spite of having vast wealth, the man is notoriously miserly." (Complex)',
    options: [
      'Though the man has vast wealth, he is notoriously miserly.',
      'The man has vast wealth, but he is notoriously miserly.',
      'Since the man has vast wealth, he is notoriously miserly.',
      'Because of his vast wealth, the man is notoriously miserly.'
    ],
    correctAnswer: 'Though the man has vast wealth, he is notoriously miserly.',
    explanation: {
      rule: 'Concession Transformation Formula',
      formula: 'Simple: In spite of / Despite + V-ing ➔ Complex: Though / Although + S + V ➔ Compound: Clause 1 + but + Clause 2',
      whyCorrect: '"In spite of having vast wealth" expresses concession. In a Complex sentence, this requires the subordinating conjunction "Though / Although" with a subject and finite verb ("Though the man has vast wealth").',
      whyWrong: {
        1: 'This is a COMPOUND sentence (using coordinating conjunction "but").',
        2: '"Since" indicates reason, which contradicts the concessive meaning.',
        3: 'This is another Simple sentence variation.'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'medium'
  },
  {
    id: 'cs_scc_2',
    topicId: 'changing_sentences',
    subtopicId: 'simple_compound_complex',
    type: 'transformation_mcq',
    instruction: 'Transform Simple Sentence to Compound Sentence:',
    originalSentence: 'Closing the door, he went out for a walk.',
    targetTransformation: '(Make it Compound)',
    prompt: 'Original: "Closing the door, he went out for a walk." (Compound)',
    options: [
      'He closed the door and went out for a walk.',
      'When he closed the door, he went out for a walk.',
      'After closing the door, he went out for a walk.',
      'He closed the door so that he could go out for a walk.'
    ],
    correctAnswer: 'He closed the door and went out for a walk.',
    explanation: {
      rule: 'Participle phrase to Compound sentence with "and"',
      formula: 'Clause 1 (finite verb) + and + Clause 2',
      whyCorrect: 'The participial phrase "Closing the door" converts to an independent principal clause "He closed the door" joined by coordinator "and".',
      whyWrong: {
        1: 'This is a Complex sentence (using subordinator "When").',
        2: 'This remains a Simple sentence (preposition + gerund).',
        3: 'This is a Complex sentence of purpose.'
      }
    },
    boardReference: 'Chattogram Board 2022',
    difficulty: 'easy'
  },
  {
    id: 'cs_scc_3',
    topicId: 'changing_sentences',
    subtopicId: 'simple_compound_complex',
    type: 'transformation_mcq',
    instruction: 'Transform into a Simple Sentence:',
    originalSentence: 'He worked hard so that he could pass the HSC examination with GPA 5.0.',
    targetTransformation: '(Make it Simple)',
    prompt: 'Original: "He worked hard so that he could pass the HSC examination with GPA 5.0." (Simple)',
    options: [
      'He worked hard to pass the HSC examination with GPA 5.0.',
      'He worked hard and passed the HSC examination with GPA 5.0.',
      'Working hard, he passed the HSC examination with GPA 5.0.',
      'He worked hard in order that he could pass the HSC examination.'
    ],
    correctAnswer: 'He worked hard to pass the HSC examination with GPA 5.0.',
    explanation: {
      rule: 'Purpose Clause (So that) to Infinitive of Purpose',
      formula: 'Complex: So that + S + could + V1 ➔ Simple: Infinitive (to + V1)',
      whyCorrect: 'The subordinate clause of purpose "so that he could pass" condenses into the non-finite infinitive phrase "to pass the HSC examination".',
      whyWrong: {
        1: 'This is a Compound sentence.',
        3: '"in order that" is another Complex conjunction.'
      }
    },
    boardReference: 'Barishal Board 2023',
    difficulty: 'medium'
  },

  // E. Degrees of Comparison
  {
    id: 'cs_deg_1',
    topicId: 'changing_sentences',
    subtopicId: 'degree',
    type: 'transformation_mcq',
    instruction: 'Transform the Superlative degree to Positive degree:',
    originalSentence: 'The Padma is the biggest river in Bangladesh.',
    targetTransformation: '(Make it Positive Degree)',
    prompt: 'Original: "The Padma is the biggest river in Bangladesh." (Positive)',
    options: [
      'No other river in Bangladesh is as big as the Padma.',
      'Very few rivers in Bangladesh are as big as the Padma.',
      'The Padma is bigger than any other river in Bangladesh.',
      'No river in Bangladesh is bigger than the Padma.'
    ],
    correctAnswer: 'No other river in Bangladesh is as big as the Padma.',
    explanation: {
      rule: 'Superlative with "the" ➔ Positive with "No other"',
      formula: 'No other + singular noun + verb + as/so + Positive Adj + as + Subject',
      whyCorrect: 'Because the original is simple superlative ("the biggest", NOT "one of the biggest"), it converts to Positive using "No other river...is as big as".',
      whyWrong: {
        1: '"Very few" is strictly used when converting "one of the + superlative".',
        2: 'This is Comparative degree ("bigger than any other").'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'cs_deg_2',
    topicId: 'changing_sentences',
    subtopicId: 'degree',
    type: 'transformation_mcq',
    instruction: 'Transform to Comparative Degree:',
    originalSentence: 'Kazi Nazrul Islam is one of the greatest poets in Bengali literature.',
    targetTransformation: '(Make it Comparative Degree)',
    prompt: 'Original: "Kazi Nazrul Islam is one of the greatest poets in Bengali literature." (Comparative)',
    options: [
      'Kazi Nazrul Islam is greater than most other poets in Bengali literature.',
      'Kazi Nazrul Islam is greater than any other poet in Bengali literature.',
      'Very few poets in Bengali literature are as great as Kazi Nazrul Islam.',
      'No other poet in Bengali literature is as great as Kazi Nazrul Islam.'
    ],
    correctAnswer: 'Kazi Nazrul Islam is greater than most other poets in Bengali literature.',
    explanation: {
      rule: 'One of the + Superlative ➔ Comparative with "than most other"',
      formula: 'Subject + Verb + Comparative Adj + than most other + plural noun',
      whyCorrect: '"One of the greatest" requires "than most other" followed by plural noun "poets". ("Than any other" is used for simple superlative "the greatest").',
      whyWrong: {
        1: '"than any other" is used for unique single superlatives, not "one of the".',
        2: 'This is the Positive degree transformation.'
      }
    },
    boardReference: 'Sylhet Board 2023',
    difficulty: 'medium'
  },

  // F. Assertive ↔ Interrogative / Exclamatory / Imperative
  {
    id: 'cs_ai_1',
    topicId: 'changing_sentences',
    subtopicId: 'assertive_interrogative',
    type: 'transformation_mcq',
    instruction: 'Transform Assertive sentence to Interrogative:',
    originalSentence: 'Everybody wishes to be happy and prosperous in life.',
    targetTransformation: '(Make it Interrogative)',
    prompt: 'Original: "Everybody wishes to be happy and prosperous in life." (Interrogative)',
    options: [
      'Who does not wish to be happy and prosperous in life?',
      'Does everybody wish to be happy and prosperous in life?',
      'Who wishes to be happy and prosperous in life?',
      'Does anyone not wish to be happy and prosperous in life?'
    ],
    correctAnswer: 'Who does not wish to be happy and prosperous in life?',
    explanation: {
      rule: 'Everybody / Everyone / All ➔ Who doesn\'t + V1...?',
      whyCorrect: '"Everybody / Everyone / All" in an affirmative statement converts to "Who does not + V1...?" in interrogative form.',
      whyWrong: {
        1: 'Omits the rhetorical "Who doesn\'t" structure required in HSC board syllabus.'
      }
    },
    boardReference: 'Dinajpur Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'cs_ae_1',
    topicId: 'changing_sentences',
    subtopicId: 'assertive_exclamatory',
    type: 'transformation_mcq',
    instruction: 'Transform Assertive sentence to Exclamatory:',
    originalSentence: 'It is a very charming sunset.',
    targetTransformation: '(Make it Exclamatory)',
    prompt: 'Original: "It is a very charming sunset." (Exclamatory)',
    options: [
      'What a charming sunset it is!',
      'How charming sunset it is!',
      'What charming sunset is it!',
      'How a charming sunset it is!'
    ],
    correctAnswer: 'What a charming sunset it is!',
    explanation: {
      rule: 'Assertive with "a/an + very + Adj + Noun" ➔ What a/an...',
      formula: 'What a/an + Adjective + Noun + Subject + Verb + !',
      whyCorrect: 'When the assertive sentence contains "a very + adjective + noun", start with "What a/an". If it only has "very + adjective" (without a noun), start with "How".',
      whyWrong: {
        1: '"How" is used when there is no article "a/an" and following noun.',
        3: '"How a" is grammatically incorrect in English.'
      }
    },
    boardReference: 'Jashore Board 2022',
    difficulty: 'easy'
  },

  // -------------------------------------------------------------
  // TOPIC 10: TAG QUESTIONS & SPECIAL GRAMMAR
  // -------------------------------------------------------------
  {
    id: 'tag_1',
    topicId: 'tag_questions_and_special',
    subtopicId: 'tag_questions',
    type: 'mcq',
    instruction: 'Select the correct tag question for the statement:',
    prompt: 'He seldom visits his native village nowadays, _____?',
    options: ['does he', 'doesn\'t he', 'is he', 'did he'],
    correctAnswer: 'does he',
    explanation: {
      rule: 'Semi-Negative Adverbs take Positive Tag',
      whyCorrect: 'Words like "seldom", "hardly", "scarcely", "rarely", "barely", "few", and "little" give the sentence a negative meaning. Therefore, the tag question MUST be positive ("does he?").',
      whyWrong: {
        1: '"doesn\'t he" incorrectly makes the tag negative when the sentence is already made negative by "seldom".',
        2: '"is he" does not match the Present Indefinite action verb "visits".',
        3: '"did he" is past tense.'
      }
    },
    boardReference: 'Dhaka Board 2023',
    difficulty: 'easy'
  },
  {
    id: 'tag_2',
    topicId: 'tag_questions_and_special',
    subtopicId: 'tag_questions',
    type: 'mcq',
    instruction: 'Select the correct tag question for the imperative proposal:',
    prompt: 'Let us plant more trees to preserve ecological balance, _____?',
    options: ['shall we', 'will you', 'won\'t you', 'can we'],
    correctAnswer: 'shall we',
    explanation: {
      rule: 'Tag for "Let us / Let\'s" proposals',
      whyCorrect: 'An imperative sentence beginning with "Let us" or "Let\'s" expresses a proposal or suggestion and takes "shall we?" as its standard tag question.',
      whyWrong: {
        1: '"will you" is used for other imperative requests/orders (e.g. "Open the window, will you?" or "Let him do it, will you?").'
      }
    },
    boardReference: 'Rajshahi Board 2023',
    difficulty: 'easy'
  }
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
