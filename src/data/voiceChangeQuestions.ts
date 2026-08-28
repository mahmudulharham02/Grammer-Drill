import { Question } from '../types';

export const VOICE_CHANGE_QUESTIONS: Question[] = [
  // 1. Simple Present
  {
    id: 'vc_sp_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The students read novels.',
    options: [
      'Novels are read by the students.',
      'Novels is read by the students.',
      'Novels are reading by the students.',
      'Novels were read by the students.'
    ],
    correctAnswer: 'Novels are read by the students.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Simple Present Passive: Sub + is/am/are + V3 + by + Obj',
    explanation: {
      rule: 'Simple Present Passive: S + is/am/are + V3 + by + O',
      formula: 'Object (Subjective form) + is/am/are + V3 + by + Subject (Objective form)',
      whyCorrect: "Plural object 'novels' takes auxiliary 'are', followed by past participle (V3) 'read', and agent 'by the students'.",
      tip: "Remember that 'read' has the same spelling in V1, V2, and V3 (pronounced 'red' in V3)."
    }
  },
  {
    id: 'vc_sp_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The gardener waters the plants.',
    options: [
      'The plants are watered by the gardener.',
      'The plants is watered by the gardener.',
      'The plants was watered by the gardener.',
      'The plants are watering by the gardener.'
    ],
    correctAnswer: 'The plants are watered by the gardener.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Rajshahi Board 2022',
    rule: 'Simple Present Passive: Sub + is/am/are + V3 + by + Obj',
    explanation: {
      rule: 'Simple Present Passive: S + is/am/are + V3 + by + O',
      formula: 'Object + are (plural) + V3 (watered) + by + Subject',
      whyCorrect: "'The plants' is plural so it requires 'are' + V3 'watered'.",
      tip: "Water is a verb here meaning to irrigate."
    }
  },
  {
    id: 'vc_sp_03',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'She writes a letter.',
    options: [
      'A letter is written by her.',
      'A letter was written by her.',
      'A letter has been written by her.',
      'A letter is being written by her.'
    ],
    correctAnswer: 'A letter is written by her.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Chattogram Board 2023',
    rule: 'Simple Present: Object + is + V3 + by + Subject',
    explanation: {
      rule: 'Simple Present Passive',
      formula: 'Object + is + V3 (written) + by + her',
      whyCorrect: "'A letter' is singular, so it takes 'is' + V3 'written'. 'She' becomes 'her'.",
    }
  },
  {
    id: 'vc_sp_04',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Do they play cricket?',
    options: [
      'Is cricket played by them?',
      'Was cricket played by them?',
      'Are cricket played by them?',
      'Do cricket played by them?'
    ],
    correctAnswer: 'Is cricket played by them?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Cumilla Board 2022',
    rule: 'Interrogative Simple Present: Is/Am/Are + Obj + V3 + by + Sub?',
    explanation: {
      rule: 'Interrogative Present Simple',
      formula: 'Is + singular object (cricket) + V3 (played) + by + them?',
      whyCorrect: "Since cricket is singular uncountable, it begins with 'Is'.",
    }
  },
  {
    id: 'vc_sp_05',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'He does not tell lies.',
    options: [
      'Lies are not told by him.',
      'Lies is not told by him.',
      'Lies were not told by him.',
      'Lies are not tell by him.'
    ],
    correctAnswer: 'Lies are not told by him.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Sylhet Board 2021',
    rule: 'Negative Simple Present: Obj + is/am/are + not + V3 + by + Sub',
    explanation: {
      rule: 'Negative Present Simple',
      formula: 'Plural Obj (Lies) + are + not + V3 (told) + by + him',
      whyCorrect: "'Lies' is plural, requiring 'are not told'.",
    }
  },
  {
    id: 'vc_sp_06',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'passive_to_active',
    type: 'mcq',
    instruction: 'Change the voice from Passive to Active',
    prompt: 'Change into Active Voice:',
    sentence: 'English is spoken all over the world.',
    options: [
      'People speak English all over the world.',
      'People spoke English all over the world.',
      'People are speaking English all over the world.',
      'Everyone is spoken English all over the world.'
    ],
    correctAnswer: 'People speak English all over the world.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Jashore Board 2022',
    rule: 'Passive to Active with omitted agent (people/everyone)',
    explanation: {
      rule: 'Omitted Agent in Passive',
      formula: 'People + V1 (speak) + English + all over the world',
      whyCorrect: "When the agent is universal, supply 'People' as the active subject in simple present tense.",
    }
  },
  {
    id: 'vc_sp_07',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'We love our country.',
    options: [
      'Our country is loved by us.',
      'Our country was loved by us.',
      'Our country is being loved by us.',
      'Our country has been loved by us.'
    ],
    correctAnswer: 'Our country is loved by us.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Barishal Board 2023',
    rule: 'Simple Present: Obj + is + V3 + by + Sub',
    explanation: {
      rule: 'Simple Present Passive',
      formula: 'Our country (singular) + is + loved (V3) + by us',
      whyCorrect: "'Our country' takes singular 'is'.",
    }
  },
  {
    id: 'vc_sp_08',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Honey tastes sweet.',
    options: [
      'Honey is sweet when it is tasted.',
      'Honey is tasted sweet.',
      'Honey was sweet when tasted.',
      'Honey is being sweet when tasted.'
    ],
    correctAnswer: 'Honey is sweet when it is tasted.',
    correctIndex: 0,
    difficulty: 'hard',
    boardReference: 'Dhaka Board 2022',
    rule: 'Quasi-Passive: Sub + be verb + Adjective + when it/they is/are + V3',
    explanation: {
      rule: 'Quasi-Passive Verbs (taste, smell, feel)',
      formula: 'Sub + is + Adj + when it is + V3',
      whyCorrect: "Quasi-passive sentences with adjectives convert using 'when it is tasted'.",
    }
  },
  {
    id: 'vc_sp_09',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The cow gives us milk.',
    options: [
      'We are given milk by the cow.',
      'Milk is gave to us by the cow.',
      'We were given milk by the cow.',
      'Milk was given us by the cow.'
    ],
    correctAnswer: 'We are given milk by the cow.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Mymensingh Board 2023',
    rule: 'Double Object: Indirect Obj + is/are + V3 + Direct Obj + by + Sub',
    explanation: {
      rule: 'Verbs with Double Objects',
      formula: 'Personal object (We) + are + given + milk + by the cow',
      whyCorrect: "The personal object 'us' becomes subject 'We' followed by 'are given'.",
    }
  },
  {
    id: 'vc_sp_10',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_present',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Does he know me?',
    options: [
      'Am I known to him?',
      'Am I known by him?',
      'Was I known to him?',
      'Is I known by him?'
    ],
    correctAnswer: 'Am I known to him?',
    correctIndex: 0,
    difficulty: 'hard',
    boardReference: 'Dhaka Board 2021',
    rule: 'Preposition after Known takes "to", NOT "by"',
    explanation: {
      rule: 'Verbs taking specific prepositions (Known to, Annoyed at, Pleased with)',
      formula: 'Am + I + known + TO + him?',
      whyCorrect: "The verb 'know' always takes the preposition 'to' in passive voice, never 'by'.",
    }
  },

  // 2. Present Continuous
  {
    id: 'vc_pc_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The mechanic is repairing the car.',
    options: [
      'The car is being repaired by the mechanic.',
      'The car is repaired by the mechanic.',
      'The car was being repaired by the mechanic.',
      'The car has been repaired by the mechanic.'
    ],
    correctAnswer: 'The car is being repaired by the mechanic.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Present Continuous: Sub + is/am/are + being + V3 + by + Obj',
    explanation: {
      rule: 'Present Continuous Passive',
      formula: 'Object + is/am/are + being + V3 + by + Subject',
      whyCorrect: "'The car' is singular so it takes 'is being repaired'.",
    }
  },
  {
    id: 'vc_pc_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Are they building a house?',
    options: [
      'Is a house being built by them?',
      'Is a house built by them?',
      'Are a house being built by them?',
      'Was a house being built by them?'
    ],
    correctAnswer: 'Is a house being built by them?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Cumilla Board 2023',
    rule: 'Interrogative Present Continuous: Is/Am/Are + Obj + being + V3 + by + Sub?',
    explanation: {
      rule: 'Interrogative Continuous',
      formula: 'Is + singular object (a house) + being + built (V3) + by + them?',
      whyCorrect: "'A house' is singular, so the question begins with 'Is'.",
    }
  },
  {
    id: 'vc_pc_03',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'She is singing a melodious song.',
    options: [
      'A melodious song is being sung by her.',
      'A melodious song is sung by her.',
      'A melodious song was being sung by her.',
      'A melodious song is being sang by her.'
    ],
    correctAnswer: 'A melodious song is being sung by her.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Rajshahi Board 2021',
    rule: 'Present Continuous Passive: is being + V3 (sung)',
    explanation: {
      rule: 'Sing-Sang-Sung (V3 is sung)',
      formula: 'A melodious song + is being + sung + by her',
      whyCorrect: "Singular subject takes 'is being', and the V3 of sing is 'sung'.",
    }
  },
  {
    id: 'vc_pc_04',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'They are cutting down trees indiscriminately.',
    options: [
      'Trees are being cut down indiscriminately by them.',
      'Trees is being cut down indiscriminately by them.',
      'Trees were being cut down indiscriminately by them.',
      'Trees are cut down indiscriminately by them.'
    ],
    correctAnswer: 'Trees are being cut down indiscriminately by them.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Chattogram Board 2022',
    rule: 'Present Continuous Passive with Plural Object',
    explanation: {
      rule: 'Plural Continuous Passive',
      formula: 'Plural object (Trees) + are being + cut (V3) + down + by them',
      whyCorrect: "'Trees' is plural so it takes 'are being cut'.",
    }
  },
  {
    id: 'vc_pc_05',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Why are you disturbing me?',
    options: [
      'Why am I being disturbed by you?',
      'Why I am being disturbed by you?',
      'Why was I being disturbed by you?',
      'Why am I disturbed by you?'
    ],
    correctAnswer: 'Why am I being disturbed by you?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Sylhet Board 2023',
    rule: 'Wh- Interrogative Continuous: Wh-word + am/is/are + Obj + being + V3 + by + Sub?',
    explanation: {
      rule: 'Wh- Questions in Continuous Tense',
      formula: 'Why + am + I + being + disturbed + by you?',
      whyCorrect: "Auxiliary 'am' must precede the subject 'I' in question structure.",
    }
  },
  {
    id: 'vc_pc_06',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'passive_to_active',
    type: 'mcq',
    instruction: 'Change the voice from Passive to Active',
    prompt: 'Change into Active Voice:',
    sentence: 'The house is being painted by the workers.',
    options: [
      'The workers are painting the house.',
      'The workers were painting the house.',
      'The workers paint the house.',
      'The workers have painted the house.'
    ],
    correctAnswer: 'The workers are painting the house.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Barishal Board 2022',
    rule: 'Passive is being painted -> Active are painting',
    explanation: {
      rule: 'Passive to Active Continuous',
      formula: 'Subject (The workers) + are + V-ing (painting) + Object (the house)',
      whyCorrect: "'The workers' is plural present continuous, requiring 'are painting'.",
    }
  },
  {
    id: 'vc_pc_07',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The government is constructing a huge bridge over the river.',
    options: [
      'A huge bridge is being constructed over the river by the government.',
      'A huge bridge was being constructed over the river by the government.',
      'A huge bridge is constructed over the river by the government.',
      'A huge bridge has been constructed over the river by the government.'
    ],
    correctAnswer: 'A huge bridge is being constructed over the river by the government.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dhaka Board 2020',
    rule: 'Present Continuous with Extension',
    explanation: {
      rule: 'Present Continuous with Extension phrase',
      formula: 'A huge bridge + is being constructed + extension + by the government',
      whyCorrect: "'A huge bridge' is singular present continuous.",
    }
  },
  {
    id: 'vc_pc_08',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Is she not preparing the lecture?',
    options: [
      'Is the lecture not being prepared by her?',
      'Is the lecture not prepared by her?',
      'Was the lecture not being prepared by her?',
      'Has the lecture not been prepared by her?'
    ],
    correctAnswer: 'Is the lecture not being prepared by her?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dinajpur Board 2023',
    rule: 'Negative-Interrogative Continuous: Is + Obj + not being + V3 + by + Sub?',
    explanation: {
      rule: 'Negative Interrogative Continuous',
      formula: 'Is + the lecture + not being + prepared + by her?',
      whyCorrect: "Retains question form and negative marker before 'being'.",
    }
  },
  {
    id: 'vc_pc_09',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The farmers are ploughing their lands.',
    options: [
      'Their lands are being ploughed by the farmers.',
      'Their lands is being ploughed by the farmers.',
      'Their lands were being ploughed by the farmers.',
      'Their lands are ploughed by the farmers.'
    ],
    correctAnswer: 'Their lands are being ploughed by the farmers.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Jashore Board 2023',
    rule: 'Present Continuous Plural: are being ploughed',
    explanation: {
      rule: 'Plural Continuous Passive',
      formula: 'Their lands + are being + ploughed (V3) + by the farmers',
      whyCorrect: "'Their lands' is plural.",
    }
  },
  {
    id: 'vc_pc_10',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The nurse is taking care of the sick child.',
    options: [
      'The sick child is being taken care of by the nurse.',
      'The sick child is taken care of by the nurse.',
      'The sick child was being taken care of by the nurse.',
      'The sick child is being took care of by the nurse.'
    ],
    correctAnswer: 'The sick child is being taken care of by the nurse.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Cumilla Board 2021',
    rule: 'Group Verb / Phrasal Verb: retain preposition "of"',
    explanation: {
      rule: 'Phrasal Verb Passive',
      formula: 'The sick child + is being + taken (V3) + care of + by the nurse',
      whyCorrect: "The preposition 'of' attached to 'care of' must be retained immediately after V3.",
    }
  },

  // 3. Present Perfect
  {
    id: 'vc_pp_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_perfect',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The chief guest has inaugurated the fair.',
    options: [
      'The fair has been inaugurated by the chief guest.',
      'The fair had been inaugurated by the chief guest.',
      'The fair has inaugurated by the chief guest.',
      'The fair was inaugurated by the chief guest.'
    ],
    correctAnswer: 'The fair has been inaugurated by the chief guest.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Present Perfect Passive: Sub + has/have + been + V3 + by + Obj',
    explanation: {
      rule: 'Present Perfect Passive',
      formula: 'Object (The fair) + has + been + V3 (inaugurated) + by + Subject',
      whyCorrect: "Singular object 'The fair' takes 'has been inaugurated'.",
    }
  },
  {
    id: 'vc_pp_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_perfect',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'I have received your letter.',
    options: [
      'Your letter has been received by me.',
      'Your letter have been received by me.',
      'Your letter had been received by me.',
      'Your letter was received by me.'
    ],
    correctAnswer: 'Your letter has been received by me.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Rajshahi Board 2023',
    rule: 'Present Perfect Passive with Singular Object',
    explanation: {
      rule: 'Present Perfect Passive',
      formula: 'Your letter (singular) + has been + received (V3) + by me',
      whyCorrect: "Singular 'Your letter' takes 'has been', not 'have been'.",
    }
  },
  {
    id: 'vc_pp_03',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_perfect',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The authorities have taken necessary steps.',
    options: [
      'Necessary steps have been taken by the authorities.',
      'Necessary steps has been taken by the authorities.',
      'Necessary steps had been taken by the authorities.',
      'Necessary steps were taken by the authorities.'
    ],
    correctAnswer: 'Necessary steps have been taken by the authorities.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Chattogram Board 2023',
    rule: 'Present Perfect Passive with Plural Object',
    explanation: {
      rule: 'Plural Present Perfect',
      formula: 'Plural object (Necessary steps) + have been + taken (V3) + by the authorities',
      whyCorrect: "'Necessary steps' is plural, requiring 'have been taken'.",
    }
  },
  {
    id: 'vc_pp_04',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_perfect',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Has he completed the assignment?',
    options: [
      'Has the assignment been completed by him?',
      'Have the assignment been completed by him?',
      'Had the assignment been completed by him?',
      'Was the assignment completed by him?'
    ],
    correctAnswer: 'Has the assignment been completed by him?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Sylhet Board 2022',
    rule: 'Interrogative Present Perfect: Has/Have + Obj + been + V3 + by + Sub?',
    explanation: {
      rule: 'Interrogative Present Perfect',
      formula: 'Has + singular object (the assignment) + been + completed + by him?',
      whyCorrect: "Singular object begins with 'Has'.",
    }
  },
  {
    id: 'vc_pp_05',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'present_perfect',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Nobody has ever seen such a wonder.',
    options: [
      'Such a wonder has never been seen by anybody.',
      'Such a wonder has been never seen by anybody.',
      'Such a wonder was never seen by anybody.',
      'Such a wonder had never been seen by anybody.'
    ],
    correctAnswer: 'Such a wonder has never been seen by anybody.',
    correctIndex: 0,
    difficulty: 'hard',
    boardReference: 'Dhaka Board 2021',
    rule: 'Nobody + ever -> has never been seen by anybody',
    explanation: {
      rule: 'Negative Indefinite Pronoun Passive',
      formula: 'Such a wonder + has never been + seen + by anybody',
      whyCorrect: "'Nobody' changes to 'never... by anybody' to preserve accurate grammar.",
    }
  },

  // 4. Simple Past
  {
    id: 'vc_past_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_past',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Columbus discovered America.',
    options: [
      'America was discovered by Columbus.',
      'America is discovered by Columbus.',
      'America had been discovered by Columbus.',
      'America was being discovered by Columbus.'
    ],
    correctAnswer: 'America was discovered by Columbus.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Simple Past Passive: Sub + was/were + V3 + by + Obj',
    explanation: {
      rule: 'Simple Past Passive',
      formula: 'Object (America) + was (singular) + V3 (discovered) + by + Columbus',
      whyCorrect: "'America' is singular past, requiring 'was discovered'.",
    }
  },
  {
    id: 'vc_past_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_past',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Did the teacher punish the boy?',
    options: [
      'Was the boy punished by the teacher?',
      'Is the boy punished by the teacher?',
      'Were the boy punished by the teacher?',
      'Had the boy been punished by the teacher?'
    ],
    correctAnswer: 'Was the boy punished by the teacher?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Cumilla Board 2022',
    rule: 'Interrogative Simple Past: Was/Were + Obj + V3 + by + Sub?',
    explanation: {
      rule: 'Interrogative Past Simple',
      formula: 'Was + singular object (the boy) + punished (V3) + by the teacher?',
      whyCorrect: "Singular past question begins with 'Was'.",
    }
  },
  {
    id: 'vc_past_03',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_past',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Shakespeare wrote Hamlet.',
    options: [
      'Hamlet was written by Shakespeare.',
      'Hamlet is written by Shakespeare.',
      'Hamlet had been written by Shakespeare.',
      'Hamlet was being written by Shakespeare.'
    ],
    correctAnswer: 'Hamlet was written by Shakespeare.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Rajshahi Board 2021',
    rule: 'Simple Past: was written',
    explanation: {
      rule: 'Simple Past Passive',
      formula: 'Hamlet (singular) + was + written (V3) + by Shakespeare',
      whyCorrect: "V3 of write is 'written'.",
    }
  },
  {
    id: 'vc_past_04',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_past',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'We elected him captain.',
    options: [
      'He was elected captain by us.',
      'Captain was elected him by us.',
      'He was elected by us captain.',
      'He is elected captain by us.'
    ],
    correctAnswer: 'He was elected captain by us.',
    correctIndex: 0,
    difficulty: 'hard',
    boardReference: 'Jashore Board 2023',
    rule: 'Factitive Object: Personal Object becomes Subject',
    explanation: {
      rule: 'Factitive Object / Object Complement',
      formula: 'Personal object (him -> He) + was elected + Factitive object (captain) + by us',
      whyCorrect: "In sentences with a factitive object (captain, chairman, king), only the personal object becomes the subject.",
    }
  },
  {
    id: 'vc_past_05',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_past',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The storm destroyed many houses.',
    options: [
      'Many houses were destroyed by the storm.',
      'Many houses was destroyed by the storm.',
      'Many houses had been destroyed by the storm.',
      'Many houses were being destroyed by the storm.'
    ],
    correctAnswer: 'Many houses were destroyed by the storm.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Barishal Board 2023',
    rule: 'Plural Past Simple: were destroyed',
    explanation: {
      rule: 'Plural Past Simple',
      formula: 'Plural object (Many houses) + were + destroyed (V3) + by the storm',
      whyCorrect: "'Many houses' takes plural 'were'.",
    }
  },

  // 5. Past Continuous
  {
    id: 'vc_pcon_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'past_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The boys were playing football.',
    options: [
      'Football was being played by the boys.',
      'Football were being played by the boys.',
      'Football was played by the boys.',
      'Football had been played by the boys.'
    ],
    correctAnswer: 'Football was being played by the boys.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Past Continuous Passive: Sub + was/were + being + V3 + by + Obj',
    explanation: {
      rule: 'Past Continuous Passive',
      formula: 'Object (Football) + was + being + played (V3) + by the boys',
      whyCorrect: "'Football' is singular, so it takes 'was being played'.",
    }
  },
  {
    id: 'vc_pcon_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'past_continuous',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'She was cooking delicious food.',
    options: [
      'Delicious food was being cooked by her.',
      'Delicious food were being cooked by her.',
      'Delicious food was cooked by her.',
      'Delicious food had been cooked by her.'
    ],
    correctAnswer: 'Delicious food was being cooked by her.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Sylhet Board 2021',
    rule: 'Past Continuous: was being cooked',
    explanation: {
      rule: 'Past Continuous Passive',
      formula: 'Delicious food (uncountable) + was being + cooked + by her',
      whyCorrect: "'Food' is uncountable singular.",
    }
  },

  // 6. Past Perfect
  {
    id: 'vc_ppf_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'past_perfect',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'He had finished the work before sunset.',
    options: [
      'The work had been finished by him before sunset.',
      'The work has been finished by him before sunset.',
      'The work was finished by him before sunset.',
      'The work had finished by him before sunset.'
    ],
    correctAnswer: 'The work had been finished by him before sunset.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dhaka Board 2023',
    rule: 'Past Perfect Passive: had been + V3',
    explanation: {
      rule: 'Past Perfect Passive',
      formula: 'Object (The work) + had been + finished (V3) + by him + before sunset',
      whyCorrect: "Past perfect passive always uses 'had been + V3'.",
    }
  },

  // 7. Simple Future
  {
    id: 'vc_sf_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'simple_future',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'The principal will open the function.',
    options: [
      'The function will be opened by the principal.',
      'The function will open by the principal.',
      'The function shall be opened by the principal.',
      'The function would be opened by the principal.'
    ],
    correctAnswer: 'The function will be opened by the principal.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Cumilla Board 2023',
    rule: 'Simple Future Passive: Sub + will/shall + be + V3 + by + Obj',
    explanation: {
      rule: 'Simple Future Passive',
      formula: 'Object (The function) + will be + opened (V3) + by + the principal',
      whyCorrect: "'will' takes 'be' followed by V3 'opened'.",
    }
  },

  // 8. Future Perfect
  {
    id: 'vc_fp_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'future_perfect',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'She will have written the letter.',
    options: [
      'The letter will have been written by her.',
      'The letter will has been written by her.',
      'The letter will be written by her.',
      'The letter would have been written by her.'
    ],
    correctAnswer: 'The letter will have been written by her.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dhaka Board 2022',
    rule: 'Future Perfect Passive: will have been + V3',
    explanation: {
      rule: 'Future Perfect Passive',
      formula: 'The letter + will have been + written (V3) + by her',
      whyCorrect: "Modal 'will' is always followed by base 'have been' (never 'has been').",
    }
  },

  // 9. Modals
  {
    id: 'vc_mod_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'modals',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'You must obey the rules.',
    options: [
      'The rules must be obeyed by you.',
      'The rules must obeyed by you.',
      'The rules should be obeyed by you.',
      'The rules have to be obeyed by you.'
    ],
    correctAnswer: 'The rules must be obeyed by you.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Modal Passive: Modal + be + V3 + by + Sub',
    explanation: {
      rule: 'Modal Verbs (can, could, may, might, must, should, would)',
      formula: 'Object + modal (must) + be + V3 (obeyed) + by + Subject',
      whyCorrect: "The modal 'must' is preserved and followed by 'be obeyed'.",
    }
  },
  {
    id: 'vc_mod_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'modals',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'He can solve the problem.',
    options: [
      'The problem can be solved by him.',
      'The problem could be solved by him.',
      'The problem can solved by him.',
      'The problem can be solve by him.'
    ],
    correctAnswer: 'The problem can be solved by him.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Rajshahi Board 2022',
    rule: 'Modal can: can be solved',
    explanation: {
      rule: 'Modal Auxiliary Passive',
      formula: 'The problem + can + be + solved (V3) + by him',
      whyCorrect: "Preserves 'can' with 'be + V3'.",
    }
  },
  {
    id: 'vc_mod_03',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'modals',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'We ought to help the poor.',
    options: [
      'The poor ought to be helped by us.',
      'The poor ought be helped by us.',
      'The poor should be helped by us.',
      'The poor ought to helped by us.'
    ],
    correctAnswer: 'The poor ought to be helped by us.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Chattogram Board 2021',
    rule: 'Ought to: ought to be helped',
    explanation: {
      rule: 'Semi-modal Ought To',
      formula: 'The poor + ought to + be + helped + by us',
      whyCorrect: "'ought to' remains intact with 'be helped'.",
    }
  },
  {
    id: 'vc_mod_04',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'modals',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'They have to submit the assignment.',
    options: [
      'The assignment has to be submitted by them.',
      'The assignment have to be submitted by them.',
      'The assignment had to be submitted by them.',
      'The assignment must be submitted by them.'
    ],
    correctAnswer: 'The assignment has to be submitted by them.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Jashore Board 2022',
    rule: 'Have to -> Has to be + V3 (for singular subject)',
    explanation: {
      rule: 'Have to / Has to Passive',
      formula: 'Singular Object (The assignment) + has to be + submitted (V3) + by them',
      whyCorrect: "Subject agreement shifts from 'have to' (they) to 'has to' (assignment).",
    }
  },

  // 10. Imperatives
  {
    id: 'vc_imp_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'imperatives',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Open the door.',
    options: [
      'Let the door be opened.',
      'Let the door opened.',
      'You are ordered open the door.',
      'Let the door be open.'
    ],
    correctAnswer: 'Let the door be opened.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Dhaka Board 2023',
    rule: 'Imperative Passive: Let + Obj + be + V3',
    explanation: {
      rule: 'Imperative Sentence Passive',
      formula: 'Let + Object (the door) + be + V3 (opened)',
      whyCorrect: "Standard affirmative imperative uses 'Let + Object + be + V3'.",
    }
  },
  {
    id: 'vc_imp_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'imperatives',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Do not touch the wire.',
    options: [
      'Let not the wire be touched.',
      'Let the wire not touched.',
      'You are told not touch the wire.',
      'Let the wire be not touch.'
    ],
    correctAnswer: 'Let not the wire be touched.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Cumilla Board 2022',
    rule: 'Negative Imperative: Let not + Obj + be + V3',
    explanation: {
      rule: 'Negative Imperative Passive',
      formula: 'Let not + Object (the wire) + be + V3 (touched)',
      whyCorrect: "'Let not' sits at the beginning, followed by Object + be + V3.",
    }
  },
  {
    id: 'vc_imp_03',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'imperatives',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Please help the poor.',
    options: [
      'You are requested to help the poor.',
      'Let the poor be helped by please.',
      'You are told to help the poor.',
      'The poor are requested to be helped.'
    ],
    correctAnswer: 'You are requested to help the poor.',
    correctIndex: 0,
    difficulty: 'easy',
    boardReference: 'Sylhet Board 2023',
    rule: 'Polite Request: You are requested to + V1',
    explanation: {
      rule: 'Polite Request Imperatives',
      formula: 'You are requested to + V1 (help) + the poor',
      whyCorrect: "'Please' converts directly into 'You are requested to'.",
    }
  },

  // 11. Interrogatives
  {
    id: 'vc_int_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'interrogatives',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'Who wrote the book?',
    options: [
      'By whom was the book written?',
      'By who was the book written?',
      'Who was the book written by?',
      'Whom was the book written by?'
    ],
    correctAnswer: 'By whom was the book written?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dhaka Board 2023',
    rule: 'Who -> By whom + was/were + Obj + V3?',
    explanation: {
      rule: 'Interrogative with Who',
      formula: 'By whom + was + singular object (the book) + written (V3)?',
      whyCorrect: "'Who' changes to 'By whom' at the beginning, followed by auxiliary + subject + V3.",
    }
  },
  {
    id: 'vc_int_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'interrogatives',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Change the voice from Active to Passive',
    prompt: 'Change into Passive Voice:',
    sentence: 'What did he buy?',
    options: [
      'What was bought by him?',
      'What is bought by him?',
      'What did bought by him?',
      'What had been bought by him?'
    ],
    correctAnswer: 'What was bought by him?',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Rajshahi Board 2021',
    rule: 'What + was + V3 + by + Sub?',
    explanation: {
      rule: 'Interrogative with What (as object)',
      formula: 'What + was + V3 (bought) + by + him?',
      whyCorrect: "'What' acts as the subject of the passive clause and takes singular 'was'.",
    }
  },

  // 12. Negatives & No-Passive Cases
  {
    id: 'vc_neg_01',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'negatives',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Identify the correct passive voice or passive status',
    prompt: 'Change into Passive Voice (or identify No Passive):',
    sentence: 'He runs very fast every morning.',
    options: [
      'No passive voice (Intransitive verb without cognate object).',
      'Very fast is run by him every morning.',
      'He is run very fast every morning.',
      'Running is done fast by him every morning.'
    ],
    correctAnswer: 'No passive voice (Intransitive verb without cognate object).',
    correctIndex: 0,
    difficulty: 'hard',
    boardReference: 'Board Curriculum Standard',
    rule: 'Intransitive verbs (run, die, sleep, laugh) have NO passive form',
    explanation: {
      rule: 'Intransitive Verbs',
      formula: 'Intransitive verbs carry no direct object and cannot be transformed into passive voice.',
      whyCorrect: "'runs' has no object (fast is an adverb), hence no passive exists.",
    }
  },
  {
    id: 'vc_neg_02',
    topicId: 'changing_sentences',
    subtopicId: 'voice_change',
    subModule: 'negatives',
    direction: 'active_to_passive',
    type: 'mcq',
    instruction: 'Identify the correct passive voice or passive status',
    prompt: 'Change into Passive Voice:',
    sentence: 'They had not warned us in advance.',
    options: [
      'We had not been warned in advance by them.',
      'We have not been warned in advance by them.',
      'We were not warned in advance by them.',
      'We had been not warned in advance by them.'
    ],
    correctAnswer: 'We had not been warned in advance by them.',
    correctIndex: 0,
    difficulty: 'medium',
    boardReference: 'Dinajpur Board 2022',
    rule: 'Negative Past Perfect: had not been + V3',
    explanation: {
      rule: 'Negative Past Perfect Passive',
      formula: 'Object (We) + had + not + been + warned (V3) + in advance + by them',
      whyCorrect: "'not' is placed between auxiliary 'had' and 'been'.",
    }
  }
];
