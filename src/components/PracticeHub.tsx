import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Zap,
  HelpCircle,
  Award,
  ChevronRight,
  Layers,
  Flame,
  Volume2
} from 'lucide-react';
import { AppState, VoiceSubModuleId, NarrationSubModuleId } from '../types';
import { VOICE_CHANGE_QUESTIONS } from '../data/voiceChangeQuestions';
import { NARRATION_QUESTIONS } from '../data/narrationQuestions';
import { soundManager } from '../utils/sound';

interface PracticeHubProps {
  state: AppState;
  onStartVoiceDrill: (subModule: VoiceSubModuleId) => void;
  onStartNarrationDrill: (subModule: NarrationSubModuleId) => void;
  onOpenRules: () => void;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  state,
  onStartVoiceDrill,
  onStartNarrationDrill,
  onOpenRules,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'narration'>('voice');

  // Voice submodules
  const voiceSubModules: { id: VoiceSubModuleId; name: string; tag: string; description: string }[] = [
    { id: 'simple_present', name: 'Simple Present', tag: 'am/is/are + V3', description: 'Active & Passive transformations of indefinite present' },
    { id: 'present_continuous', name: 'Present Continuous', tag: 'being + V3', description: 'Actions ongoing right now with being auxiliary' },
    { id: 'present_perfect', name: 'Present Perfect', tag: 'has/have been + V3', description: 'Just completed actions with been marker' },
    { id: 'simple_past', name: 'Simple Past', tag: 'was/were + V3', description: 'Historical & completed past event transformations' },
    { id: 'past_continuous', name: 'Past Continuous', tag: 'was/were being + V3', description: 'Actions in progress in the past' },
    { id: 'past_perfect', name: 'Past Perfect', tag: 'had been + V3', description: 'Earlier past actions with had been' },
    { id: 'simple_future', name: 'Simple Future', tag: 'will/shall be + V3', description: 'Future plans and intentions with will be' },
    { id: 'future_perfect', name: 'Future Perfect', tag: 'will have been + V3', description: 'Completed milestones in future' },
    { id: 'modals', name: 'Modal Verbs', tag: 'can/must/should be + V3', description: 'can, could, may, might, must, should, ought to, have to' },
    { id: 'imperatives', name: 'Imperative Sentences', tag: 'Let + Obj + be + V3', description: 'Commands, orders, polite requests, and negative imperatives' },
    { id: 'interrogatives', name: 'Interrogatives', tag: 'Who -> By whom', description: 'Yes/No and Wh- questions transformation' },
    { id: 'negatives', name: 'Negatives & No Passive', tag: 'Intransitive Verbs', description: 'Negative structures and verbs with no passive form' },
  ];

  // Narration submodules
  const narrationSubModules: { id: NarrationSubModuleId; name: string; tag: string; description: string }[] = [
    { id: 'assertive', name: 'Assertive Sentences', tag: 'said to -> told + that', description: 'Tense backshifts, time/place shifts, and 1st/2nd pronoun shifts' },
    { id: 'interrogative', name: 'Interrogative Sentences', tag: 'asked + if / Wh-word', description: 'Yes/No questions with if/whether & Wh- questions in assertive order' },
    { id: 'imperative', name: 'Imperative Sentences', tag: 'ordered/advised/requested to + V1', description: 'Commands, requests, advice, and negative commands (not to + V1)' },
    { id: 'exclamatory', name: 'Exclamatory Sentences', tag: 'exclaimed with joy/sorrow that', description: 'What/How sentences converted to very/great and Hurrah/Alas shifts' },
    { id: 'optative', name: 'Optative Sentences', tag: 'prayed/wished that + might', description: 'Prayers, wishes, Long live the king, and May Allah help you' },
    { id: 'mixed', name: 'Mixed Board Review', tag: 'Board Standard Drills', description: 'Challenging multi-sentence and mixed category exercises' },
  ];

  const changingSentencesProg = state.topicProgress['changing_sentences'];
  const voiceSubStats = changingSentencesProg?.subModules || {};

  return (
    <div id="view-practice-hub" className="space-y-6 pb-24 max-w-6xl mx-auto">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider">
              ⭐ Core 10-Mark Mastery
            </span>
            <span className="text-xs text-slate-400">Official Board Drills</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Grammar Drill Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Specialized deep-drill submodules for Voice Change & Narration Change.
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenRules();
          }}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Rules Cheat Sheet</span>
        </button>
      </div>

      {/* Segmented Controller Tabs */}
      <div className="flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-md">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('voice');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'voice'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Voice Change (12)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('narration');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'narration'
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Narration (6)</span>
        </button>
      </div>

      {/* Voice Change Sub-Modules */}
      {activeTab === 'voice' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-200 font-medium">
                Active ↔ Passive Mastery: Master all 12 tenses, modal auxiliaries, imperatives, and interrogatives.
              </span>
            </div>
            <span className="text-xs font-bold text-cyan-400 hidden sm:inline">120+ Questions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {voiceSubModules.map((sub, index) => {
              const subStat = voiceSubStats[sub.id] || { attempts: 0, correct: 0, mastery: 0 };
              const qCount = VOICE_CHANGE_QUESTIONS.filter((q) => q.subModule === sub.id).length;

              return (
                <div
                  key={sub.id}
                  className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-cyan-400/40 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                        Part {index + 1}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {qCount > 0 ? `${qCount} Questions` : 'Curriculum Pool'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sub.name}
                    </h3>
                    <div className="inline-block text-[11px] font-mono font-bold text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                      {sub.tag}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  {/* Progress Meter & Action */}
                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full transition-all"
                            style={{ width: `${subStat.mastery || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">
                          {subStat.mastery || 0}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {subStat.attempts || 0} attempts
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onStartVoiceDrill(sub.id);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-400 hover:text-black text-cyan-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                    >
                      <span>Drill</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Narration Change Sub-Modules */}
      {activeTab === 'narration' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-violet-950/30 border border-violet-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-violet-200 font-medium">
                Direct ↔ Indirect Narration: Master tense back-shifts, time/place adverbs, reporting verbs, and optatives.
              </span>
            </div>
            <span className="text-xs font-bold text-violet-400 hidden sm:inline">60+ Questions</span>
          </div>

          {/* Quick Tense Backshift Reference Table Card */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-violet-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                <span>📖 HSC Tense Back-Shift & Time Rule Reference</span>
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Official Rule
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">Present Simple</span>
                <span className="text-cyan-300 font-bold">→ Past Simple</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">Present Continuous</span>
                <span className="text-cyan-300 font-bold">→ Past Continuous</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">Present / Past Simple</span>
                <span className="text-cyan-300 font-bold">→ Past Perfect</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">today / yesterday</span>
                <span className="text-amber-300 font-bold">→ that day / prev. day</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {narrationSubModules.map((sub, index) => {
              const subStat = voiceSubStats[sub.id] || { attempts: 0, correct: 0, mastery: 0 };
              const qCount = NARRATION_QUESTIONS.filter((q) => q.subModule === sub.id).length;

              return (
                <div
                  key={sub.id}
                  className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-violet-400/40 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md">
                        Part {index + 1}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {qCount > 0 ? `${qCount} Questions` : 'Curriculum Pool'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                      {sub.name}
                    </h3>
                    <div className="inline-block text-[11px] font-mono font-bold text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                      {sub.tag}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  {/* Progress Meter & Action */}
                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-violet-400 rounded-full transition-all"
                            style={{ width: `${subStat.mastery || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-300">
                          {subStat.mastery || 0}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {subStat.attempts || 0} attempts
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onStartNarrationDrill(sub.id);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-violet-500/20 hover:bg-violet-400 hover:text-black text-violet-300 text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                    >
                      <span>Drill</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
