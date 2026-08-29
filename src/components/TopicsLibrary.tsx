import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Layers, Zap, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import { AppState, TopicInfo } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { QUESTIONS_DATA } from '../data/questions';
import { soundManager } from '../utils/sound';

interface TopicsLibraryProps {
  state: AppState;
  onSelectTopic: (topicId: string, subtopicId?: string) => void;
  onOpenRules: () => void;
}

export const TopicsLibrary: React.FC<TopicsLibraryProps> = ({
  state,
  onSelectTopic,
  onOpenRules,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'changing' | 'core' | 'vocab'>('all');

  const filteredTopics = useMemo(() => {
    return TOPICS_DATA.filter((topic) => {
      // Filter tab
      if (activeFilter === 'changing' && topic.id !== 'changing_sentences') return false;
      if (
        activeFilter === 'core' &&
        !['right_form_of_verbs', 'articles', 'preposition', 'completing_sentences', 'connectors'].includes(
          topic.id
        )
      ) {
        return false;
      }
      if (
        activeFilter === 'vocab' &&
        !['synonyms_antonyms', 'modifiers', 'punctuation', 'tag_questions_and_special'].includes(topic.id)
      ) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = topic.title.toLowerCase().includes(q);
      const matchDesc = topic.description.toLowerCase().includes(q);
      const matchSub = topic.subtopics.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.rulesSummary.some((r) => r.toLowerCase().includes(q))
      );
      return matchTitle || matchDesc || matchSub;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div id="topics-library-view" className="space-y-6 pb-16">
      {/* Header & Global Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-cyan-400" />
            <span>HSC Grammar Topics Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Complete 60-mark syllabus breakdown for Bangladesh Higher Secondary Certificate English 2nd Paper.
          </p>
        </div>

        <button
          id="btn-rules-guide-link"
          onClick={() => {
            soundManager.playClick();
            onOpenRules();
          }}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-violet-950/60 border border-violet-500/30 hover:border-violet-400 text-violet-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
        >
          <FileText className="w-4 h-4 text-violet-400" />
          <span>Rules & Formula Handbook</span>
        </button>
      </div>

      {/* Search Input & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-search-topics"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, verbs, voice, narration, complex, lest..."
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'changing', label: '⭐ Changing Sentences (10M)' },
            { id: 'core', label: 'Verbs & Clauses' },
            { id: 'vocab', label: 'Modifiers & Vocab' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveFilter(tab.id as any);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTopics.map((topic) => {
          const prog = state.topicProgress[topic.id] || {
            unlocked: true,
            attempts: 0,
            correct: 0,
            wrong: 0,
            mastery: 0,
          };

          const isChanging = topic.id === 'changing_sentences';

          return (
            <div
              key={topic.id}
              id={`topic-item-${topic.id}`}
              className={`rounded-3xl border p-5 sm:p-6 transition-all flex flex-col justify-between ${
                isChanging
                  ? 'bg-gradient-to-br from-lime-950/30 via-slate-900 to-slate-900 border-lime-500/40 shadow-xl'
                  : 'glass-panel border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                      {topic.icon}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                        Topic {topic.number} of 10
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        {topic.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/20">
                      {QUESTIONS_DATA.filter((q) => q.topicId === topic.id).length || '120+'} MCQs
                    </span>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {topic.marks} Marks
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {topic.description}
                </p>

                {/* Subtopic Chips */}
                <div className="space-y-2 mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Included Subtopics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.subtopics.map((sub) => (
                      <button
                        key={sub.id}
                        id={`subtopic-btn-${sub.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playClick();
                          onSelectTopic(topic.id, sub.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-cyan-950 hover:border-cyan-500/40 border border-slate-700 text-[11px] font-semibold text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1"
                      >
                        <span>{sub.title}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress & Launch Button */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div className="flex-1 max-w-[180px]">
                  <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                    <span>Mastery</span>
                    <span className="text-cyan-400">{prog.mastery}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all"
                      style={{ width: `${prog.mastery}%` }}
                    />
                  </div>
                </div>

                <button
                  id={`btn-launch-topic-${topic.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectTopic(topic.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all shadow-md ${
                    isChanging
                      ? 'bg-lime-400 hover:bg-lime-300 text-black shadow-lime-500/20'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>{isChanging ? 'Launch 10M Hub' : 'Start Lesson'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
