import React, { useState } from 'react';
import {
  ArrowLeftRight,
  MessageSquare,
  PlusCircle,
  Layers,
  BarChart3,
  HelpCircle,
  AlertCircle,
  Terminal,
  BookOpen,
  Zap,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AppState } from '../types';
import { soundManager } from '../utils/sound';

interface ChangingSentencesHubProps {
  state: AppState;
  onStartDrill: (subtopicId: string) => void;
  onOpenRules: () => void;
}

interface SubtopicItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  rulesCount: string;
  description: string;
  coreFormulas: { direction: string; formula: string; example: string }[];
}

export const ChangingSentencesHub: React.FC<ChangingSentencesHubProps> = ({
  state,
  onStartDrill,
  onOpenRules,
}) => {
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('voice_change');

  const subtopics: SubtopicItem[] = [
    {
      id: 'voice_change',
      title: 'Voice Change (Active to Passive)',
      icon: <ArrowLeftRight className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: '12 Tenses + Modals + Imperatives',
      description: 'Master Simple/Continuous/Perfect across all tenses, modal auxiliaries, imperatives with let/let not, and Wh- question inversions.',
      coreFormulas: [
        {
          direction: 'Simple Present',
          formula: 'S + V1(s/es) + O ➔ O + am/is/are + V3 + by + S',
          example: 'He writes a letter. ➔ A letter is written by him.',
        },
        {
          direction: 'Present Continuous',
          formula: 'S + is/am/are + V-ing + O ➔ O + is/am/are + being + V3 + by + S',
          example: 'They are playing cricket. ➔ Cricket is being played by them.',
        },
        {
          direction: 'Modals (can/must/etc.)',
          formula: 'S + modal + V1 + O ➔ O + modal + be + V3 + by + S',
          example: 'We must respect elders. ➔ Elders must be respected by us.',
        },
        {
          direction: 'Imperative (Do not)',
          formula: 'Do not + V1 + O ➔ Let + O + not + be + V3',
          example: 'Do not open the door. ➔ Let not the door be opened.',
        },
      ],
    },
    {
      id: 'narration',
      title: 'Narration (Direct to Indirect)',
      icon: <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: '5 Sentence Types + Tense Shifts',
      description: 'Assertive, Interrogative, Imperative, Exclamatory, and Optative speech transformations with pronoun tracking and time/place shifts.',
      coreFormulas: [
        {
          direction: 'Interrogative (Wh-)',
          formula: 'said to ➔ asked | conjunction: Wh-word | Assertive order (S + V)',
          example: '"Where do you live?" he said. ➔ He asked me where I lived.',
        },
        {
          direction: 'Imperative',
          formula: 'said to ➔ told / ordered / advised | conjunction: to + V1',
          example: '"Work hard," father said. ➔ Father advised me to work hard.',
        },
        {
          direction: 'Exclamatory',
          formula: 'said ➔ exclaimed with joy/sorrow/wonder that + S + V + very + Adj',
          example: '"What a nice bird!" he said. ➔ He exclaimed with joy that it was a very nice bird.',
        },
      ],
    },
    {
      id: 'affirmative_negative',
      title: 'Affirmative to Negative',
      icon: <PlusCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: 'All 16 Board Rules',
      description: 'None but, nothing but, not more than, cannot but, not only...but also, there is no...but, no sooner had...than, too...to, as...as.',
      coreFormulas: [
        {
          direction: 'Rule 1: Only (Person)',
          formula: 'Only/Alone ➔ None but (at the beginning)',
          example: 'Only the brave deserve the fair. ➔ None but the brave deserve the fair.',
        },
        {
          direction: 'Rule 2: Must',
          formula: 'Must ➔ Cannot but + V1 (or Cannot help + V-ing)',
          example: 'We must submit to destiny. ➔ We cannot but submit to destiny.',
        },
        {
          direction: 'Rule 4: Every + Noun',
          formula: 'Every + noun ➔ There is no + noun + but + V1',
          example: 'Every mother loves her child. ➔ There is no mother but loves her child.',
        },
        {
          direction: 'Rule 7: As soon as',
          formula: 'As soon as ➔ No sooner had + S + V3 ... than + S + V2',
          example: 'As soon as he saw the police, he ran away. ➔ No sooner had he seen the police than he ran away.',
        },
      ],
    },
    {
      id: 'simple_compound_complex',
      title: 'Simple Complex Compound',
      icon: <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: 'Star Weightage Section',
      description: 'Transforming clauses using non-finite verbs (Participle, Gerund, Infinitive) vs subordinating conjunctions vs coordinators.',
      coreFormulas: [
        {
          direction: 'Concession / Contrast',
          formula: 'Simple: In spite of + V-ing ↔ Complex: Though/Although ↔ Compound: but/yet',
          example: 'In spite of being poor, he is honest. ➔ Though he is poor, he is honest. ➔ He is poor, but he is honest.',
        },
        {
          direction: 'Positive Condition',
          formula: 'Simple: By + V-ing ↔ Complex: If + Affirmative ↔ Compound: Imperative + and',
          example: 'By reading books, you can gain knowledge. ➔ If you read books, you can gain knowledge. ➔ Read books and you can gain knowledge.',
        },
        {
          direction: 'Purpose',
          formula: 'Simple: To + V1 ↔ Complex: So that + S + can/could + V1 ↔ Compound: and',
          example: 'He worked hard to succeed. ➔ He worked hard so that he could succeed.',
        },
      ],
    },
    {
      id: 'degree',
      title: 'Degrees of Comparison',
      icon: <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: 'Positive ↔ Comparative ↔ Superlative',
      description: 'Transforming positive, comparative, and superlative adjectives with "No other", "Very few", "Than any other", and "Than most other".',
      coreFormulas: [
        {
          direction: 'Superlative with "the"',
          formula: 'the + superlative ↔ comparative + than any other ↔ No other...as...as',
          example: 'Iron is the most useful metal. ➔ Iron is more useful than any other metal. ➔ No other metal is as useful as iron.',
        },
        {
          direction: 'Superlative with "one of the"',
          formula: 'one of the + superlative ↔ comparative + than most other ↔ Very few...as...as',
          example: 'Dhaka is one of the largest cities. ➔ Dhaka is larger than most other cities. ➔ Very few cities are as large as Dhaka.',
        },
      ],
    },
    {
      id: 'assertive_interrogative',
      title: 'Assertive to Interrogative',
      icon: <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: 'Aux Inversion & "Who doesn\'t"',
      description: 'Invert auxiliary verb and add negative if original is affirmative; convert "Everybody/All" to "Who doesn\'t...?"',
      coreFormulas: [
        {
          direction: 'Affirmative to Interrogative',
          formula: 'S + is/was + Adj ➔ Isn\'t / Wasn\'t + S + Adj?',
          example: 'He is an honest man. ➔ Isn\'t he an honest man?',
        },
        {
          direction: 'Everybody / All',
          formula: 'Everybody / All + V1s/es ➔ Who doesn\'t + V1...?',
          example: 'Everybody loves flowers. ➔ Who doesn\'t love flowers?',
        },
      ],
    },
    {
      id: 'assertive_exclamatory',
      title: 'Assertive to Exclamatory',
      icon: <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: 'What a/an vs How',
      description: 'What a/an + Adj + Noun + S + V! vs How + Adj + S + V! and "Had I the wings of a bird!" transformations.',
      coreFormulas: [
        {
          direction: 'With "a/an + very + Adj + Noun"',
          formula: 'S + V + a very + Adj + Noun ➔ What a/an + Adj + Noun + S + V!',
          example: 'It is a very beautiful bird. ➔ What a beautiful bird it is!',
        },
        {
          direction: 'With "very + Adj" (No Noun)',
          formula: 'S + V + very + Adj ➔ How + Adj + S + V!',
          example: 'The scenery is very charming. ➔ How charming the scenery is!',
        },
      ],
    },
    {
      id: 'assertive_imperative',
      title: 'Assertive to Imperative',
      icon: <Terminal className="w-7 h-7 sm:w-8 sm:h-8 text-[#0ea5e9]" />,
      rulesCount: 'Order, Request, Let us',
      description: 'You should do -> Do, You are requested to, Let us go out.',
      coreFormulas: [
        {
          direction: 'Direct Advice/Order',
          formula: 'You should + V1 ➔ V1 (Base Form)',
          example: 'You should speak the truth. ➔ Speak the truth.',
        },
        {
          direction: 'Proposal with We',
          formula: 'We should + V1 ➔ Let us + V1',
          example: 'We should help the poor. ➔ Let us help the poor.',
        },
      ],
    },
  ];

  const activeSubDetails = subtopics.find((s) => s.id === selectedSubtopic) || subtopics[0];

  return (
    <div id="changing-sentences-hub-view" className="px-3 sm:px-4 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-[20px] font-bold text-[#f8fafc] leading-tight truncate">
          Changing Sentences
        </h1>
        <p className="text-[12px] text-[#94a3b8] leading-tight mt-0.5 truncate">
          10-mark board transformation module
        </p>
      </div>

      {/* Full Rule Matrices Button */}
      <div className="mt-3">
        <button
          id="btn-open-full-matrix"
          type="button"
          onClick={() => {
            soundManager.playClick();
            onOpenRules();
          }}
          className="h-[40px] px-4 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer select-none"
        >
          <BookOpen className="w-4 h-4 text-white" />
          <span>Full Rule Matrices</span>
        </button>
      </div>

      {/* 8 Sub-Category Cards Grid: 2 cols on mobile, 4 cols on desktop, gap 8px (gap-2) */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {subtopics.map((sub) => {
          const isSelected = selectedSubtopic === sub.id;

          return (
            <button
              key={sub.id}
              id={`tab-changing-${sub.id}`}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedSubtopic(sub.id);
              }}
              className={`h-[88px] p-3 rounded-[12px] bg-[#1e293b] border text-left transition-all flex flex-col justify-between cursor-pointer select-none group ${
                isSelected
                  ? 'border-[#0ea5e9] ring-1 ring-[#0ea5e9]/30'
                  : 'border-white/[0.08] hover:border-[#0ea5e9]/30'
              }`}
            >
              {/* 1. Icon (Top-left, flat cyan color) */}
              <div className="flex items-center justify-between">
                <div className="text-[#0ea5e9]">{sub.icon}</div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />
                )}
              </div>

              {/* 2. Title (14px semibold white, single line only, truncate) */}
              <h2 className="text-[14px] font-semibold text-[#f8fafc] truncate leading-tight w-full">
                {sub.title}
              </h2>
            </button>
          );
        })}
      </div>

      {/* Selected Subtopic Interactive Breakdown & Formula Deck */}
      <div className="mt-4 rounded-[12px] bg-[#1e293b] border border-white/[0.08] p-3 sm:p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-[#0ea5e9] shrink-0">{activeSubDetails.icon}</div>
              <h2 className="text-base font-bold text-[#f8fafc] truncate">
                {activeSubDetails.title}
              </h2>
            </div>
            <p className="text-xs text-[#94a3b8] mt-0.5 truncate">
              {activeSubDetails.description}
            </p>
          </div>

          <button
            id="btn-launch-active-drill"
            type="button"
            onClick={() => {
              soundManager.playClick();
              onStartDrill(selectedSubtopic);
            }}
            className="h-[38px] px-4 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Launch Drills</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Formula Cards Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0ea5e9] mb-2 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Board Formulas & Patterns</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {activeSubDetails.coreFormulas.map((f, i) => (
              <div
                key={i}
                className="bg-[#0f172a] border border-white/[0.06] rounded-lg p-2.5 space-y-1.5 hover:border-[#0ea5e9]/30 transition-colors"
              >
                <span className="text-[10px] font-bold text-[#0ea5e9] px-2 py-0.5 rounded bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 font-mono inline-block">
                  {f.direction}
                </span>
                <div className="text-xs font-mono font-medium text-cyan-200 bg-[#070a13] p-2 rounded-md border border-white/[0.05]">
                  {f.formula}
                </div>
                <p className="text-xs text-[#94a3b8] truncate">
                  <span className="text-slate-500 mr-1">Example:</span>
                  <span className="text-slate-200">{f.example}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
