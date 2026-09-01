import React, { useState } from 'react';
import {
  Layers,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Table,
  HelpCircle
} from 'lucide-react';
import { AppState, ChangingSentenceSubtopic } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { soundManager } from '../utils/sound';

interface ChangingSentencesHubProps {
  state: AppState;
  onStartDrill: (subtopicId: string) => void;
  onOpenRules: () => void;
}

export const ChangingSentencesHub: React.FC<ChangingSentencesHubProps> = ({
  state,
  onStartDrill,
  onOpenRules,
}) => {
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('voice_change');

  const changingTopic = TOPICS_DATA.find((t) => t.id === 'changing_sentences')!;

  const subtopicDetails: Record<
    string,
    {
      title: string;
      bengali: string;
      icon: string;
      rulesCount: string;
      description: string;
      coreFormulas: { direction: string; formula: string; example: string }[];
    }
  > = {
    voice_change: {
      title: 'Voice Change (Active ↔ Passive)',
      bengali: 'বাচ্য পরিবর্তন',
      icon: '🎓',
      rulesCount: '12 Tenses + Modals + Imperatives',
      description: 'Master Simple/Continuous/Perfect across all tenses, modal auxiliaries, imperatives with let/let not, and Wh- question inversions.',
      coreFormulas: [
        {
          direction: 'Simple Present',
          formula: 'S + V1(s/es) + O ➔ O + am/is/are + V3 + by + S',
          example: 'He writes a letter. ➔ A letter is written by him.'
        },
        {
          direction: 'Present Continuous',
          formula: 'S + is/am/are + V-ing + O ➔ O + is/am/are + being + V3 + by + S',
          example: 'They are playing cricket. ➔ Cricket is being played by them.'
        },
        {
          direction: 'Modals (can/must/etc.)',
          formula: 'S + modal + V1 + O ➔ O + modal + be + V3 + by + S',
          example: 'We must respect elders. ➔ Elders must be respected by us.'
        },
        {
          direction: 'Imperative (Do not)',
          formula: 'Do not + V1 + O ➔ Let + O + not + be + V3',
          example: 'Do not open the door. ➔ Let not the door be opened.'
        }
      ]
    },
    narration: {
      title: 'Narration (Direct ↔ Indirect)',
      bengali: 'উক্তি পরিবর্তন',
      icon: '🗣️',
      rulesCount: '5 Sentence Types + Tense Shifts',
      description: 'Assertive, Interrogative, Imperative, Exclamatory, and Optative speech transformations with pronoun tracking and time/place shifts.',
      coreFormulas: [
        {
          direction: 'Interrogative (Wh-)',
          formula: 'said to ➔ asked | conjunction: Wh-word | Assertive order (S + V)',
          example: '"Where do you live?" he said. ➔ He asked me where I lived.'
        },
        {
          direction: 'Imperative',
          formula: 'said to ➔ told / ordered / advised | conjunction: to + V1',
          example: '"Work hard," father said. ➔ Father advised me to work hard.'
        },
        {
          direction: 'Exclamatory',
          formula: 'said ➔ exclaimed with joy/sorrow/wonder that + S + V + very + Adj',
          example: '"What a nice bird!" he said. ➔ He exclaimed with joy that it was a very nice bird.'
        }
      ]
    },
    affirmative_negative: {
      title: 'Affirmative ↔ Negative',
      bengali: 'হ্যাঁ-বোধক ও না-বোধক রূপান্তর',
      icon: '⚡',
      rulesCount: 'All 16 Board Rules',
      description: 'None but, nothing but, not more than, cannot but, not only...but also, there is no...but, no sooner had...than, too...to, as...as.',
      coreFormulas: [
        {
          direction: 'Rule 1: Only (Person)',
          formula: 'Only/Alone ➔ None but (at the beginning)',
          example: 'Only the brave deserve the fair. ➔ None but the brave deserve the fair.'
        },
        {
          direction: 'Rule 2: Must',
          formula: 'Must ➔ Cannot but + V1 (or Cannot help + V-ing)',
          example: 'We must submit to destiny. ➔ We cannot but submit to destiny.'
        },
        {
          direction: 'Rule 4: Every + Noun',
          formula: 'Every + noun ➔ There is no + noun + but + V1',
          example: 'Every mother loves her child. ➔ There is no mother but loves her child.'
        },
        {
          direction: 'Rule 7: As soon as',
          formula: 'As soon as ➔ No sooner had + S + V3 ... than + S + V2',
          example: 'As soon as he saw the police, he ran away. ➔ No sooner had he seen the police than he ran away.'
        }
      ]
    },
    simple_compound_complex: {
      title: 'Simple ↔ Complex ↔ Compound',
      bengali: 'সরল, জটিল ও যৌগিক বাক্য রূপান্তর',
      icon: '🧩',
      rulesCount: 'Star Weightage Section',
      description: 'Transforming clauses using non-finite verbs (Participle, Gerund, Infinitive) vs subordinating conjunctions (though, since, when, so that) vs coordinators (and, but, or, so).',
      coreFormulas: [
        {
          direction: 'Concession / Contrast',
          formula: 'Simple: In spite of + V-ing ↔ Complex: Though/Although ↔ Compound: but/yet',
          example: 'In spite of being poor, he is honest. ➔ Though he is poor, he is honest. ➔ He is poor, but he is honest.'
        },
        {
          direction: 'Positive Condition',
          formula: 'Simple: By + V-ing ↔ Complex: If + Affirmative ↔ Compound: Imperative + and',
          example: 'By reading books, you can gain knowledge. ➔ If you read books, you can gain knowledge. ➔ Read books and you can gain knowledge.'
        },
        {
          direction: 'Purpose',
          formula: 'Simple: To + V1 ↔ Complex: So that + S + can/could + V1 ↔ Compound: and',
          example: 'He worked hard to succeed. ➔ He worked hard so that he could succeed.'
        }
      ]
    },
    degree: {
      title: 'Degrees of Comparison (Degree Change)',
      bengali: 'তুলনামূলক মাত্রা পরিবর্তন',
      icon: '📏',
      rulesCount: 'Positive ↔ Comparative ↔ Superlative',
      description: 'Transforming positive, comparative, and superlative adjectives with "No other", "Very few", "Than any other", and "Than most other".',
      coreFormulas: [
        {
          direction: 'Superlative with "the"',
          formula: 'the + superlative ↔ comparative + than any other ↔ No other...as...as',
          example: 'Iron is the most useful metal. ➔ Iron is more useful than any other metal. ➔ No other metal is as useful as iron.'
        },
        {
          direction: 'Superlative with "one of the"',
          formula: 'one of the + superlative ↔ comparative + than most other ↔ Very few...as...as',
          example: 'Dhaka is one of the largest cities. ➔ Dhaka is larger than most other cities. ➔ Very few cities are as large as Dhaka.'
        }
      ]
    },
    assertive_interrogative: {
      title: 'Assertive ↔ Interrogative',
      bengali: 'বিবৃতিমূলক ও প্রশ্নবোধক রূপান্তর',
      icon: '❓',
      rulesCount: 'Aux Inversion & "Who doesn\'t"',
      description: 'Invert auxiliary verb and add negative if original is affirmative; convert "Everybody/All" to "Who doesn\'t...?"',
      coreFormulas: [
        {
          direction: 'Affirmative to Interrogative',
          formula: 'S + is/was + Adj ➔ Isn\'t / Wasn\'t + S + Adj?',
          example: 'He is an honest man. ➔ Isn\'t he an honest man?'
        },
        {
          direction: 'Everybody / All',
          formula: 'Everybody / All + V1s/es ➔ Who doesn\'t + V1...?',
          example: 'Everybody loves flowers. ➔ Who doesn\'t love flowers?'
        }
      ]
    },
    assertive_exclamatory: {
      title: 'Assertive ↔ Exclamatory',
      bengali: 'বিস্ময়সূচক বাক্য রূপান্তর',
      icon: '✨',
      rulesCount: 'What a/an vs How',
      description: 'What a/an + Adj + Noun + S + V! vs How + Adj + S + V! and "Had I the wings of a bird!" transformations.',
      coreFormulas: [
        {
          direction: 'With "a/an + very + Adj + Noun"',
          formula: 'S + V + a very + Adj + Noun ➔ What a/an + Adj + Noun + S + V!',
          example: 'It is a very beautiful bird. ➔ What a beautiful bird it is!'
        },
        {
          direction: 'With "very + Adj" (No Noun)',
          formula: 'S + V + very + Adj ➔ How + Adj + S + V!',
          example: 'The scenery is very charming. ➔ How charming the scenery is!'
        }
      ]
    },
    assertive_imperative: {
      title: 'Assertive ↔ Imperative',
      bengali: 'অনুজ্ঞাসূচক বাক্য রূপান্তর',
      icon: '🎯',
      rulesCount: 'Order, Request, Let us',
      description: 'You should do -> Do, You are requested to, Let us go out.',
      coreFormulas: [
        {
          direction: 'Direct Advice/Order',
          formula: 'You should + V1 ➔ V1 (Base Form)',
          example: 'You should speak the truth. ➔ Speak the truth.'
        },
        {
          direction: 'Proposal with We',
          formula: 'We should + V1 ➔ Let us + V1',
          example: 'We should help the poor. ➔ Let us help the poor.'
        }
      ]
    }
  };

  const activeSubDetails = subtopicDetails[selectedSubtopic] || subtopicDetails['voice_change'];

  return (
    <div id="changing-sentences-hub-view" className="space-y-6 pb-16">
      {/* Star Module Hero Header */}
      <section className="relative overflow-hidden rounded-xl bg-slate-800/80 border border-white/[0.08] p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold">
              <span>⭐ STAR MODULE • 10 MARKS WEIGHTAGE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Changing Sentences (Transformation)
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Master all 8 sentence transformation sub-categories with board formula tables and interactive drills.
            </p>
          </div>

          <button
            id="btn-open-full-matrix"
            onClick={() => {
              soundManager.playClick();
              onOpenRules();
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Full Rule Matrices</span>
          </button>
        </div>
      </section>

      {/* Subtopic Selector Tabs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {changingTopic.subtopics.map((sub) => {
          const isSelected = selectedSubtopic === sub.id;
          const details = subtopicDetails[sub.id];

          return (
            <button
              key={sub.id}
              id={`tab-changing-${sub.id}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedSubtopic(sub.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/20'
                  : 'bg-slate-800/60 border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{details?.icon || '📝'}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </div>
              <h2 className="font-semibold text-xs text-white truncate">
                {sub.title}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sub.bengaliTitle}</p>
            </button>
          );
        })}
      </section>

      {/* Active Subtopic Interactive Breakdown & Formula Deck */}
      <section className="rounded-xl bg-slate-800/80 border border-white/[0.08] p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeSubDetails.icon}</span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {activeSubDetails.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {activeSubDetails.description}
            </p>
          </div>

          <button
            id="btn-launch-active-drill"
            onClick={() => {
              soundManager.playClick();
              onStartDrill(selectedSubtopic);
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Launch Drills</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Formula Cards Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Board Formulas & Patterns</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {activeSubDetails.coreFormulas.map((f, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-white/[0.06] rounded-lg p-3 space-y-1.5 hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/20">
                  {f.direction}
                </span>
                <div className="text-xs font-mono font-medium text-cyan-200 bg-slate-950/80 p-2 rounded-md border border-white/[0.05]">
                  {f.formula}
                </div>
                <p className="text-xs text-slate-400">
                  <span className="text-slate-500 mr-1">Example:</span>
                  <span className="text-slate-200">{f.example}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
