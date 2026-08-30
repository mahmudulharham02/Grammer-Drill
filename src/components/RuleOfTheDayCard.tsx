import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, Lightbulb, ExternalLink } from 'lucide-react';
import { getRuleOfTheDay } from '../data/grammarRules';
import { soundManager } from '../utils/sound';

interface RuleOfTheDayCardProps {
  onDrillTopic?: (topicId: string) => void;
}

export const RuleOfTheDayCard: React.FC<RuleOfTheDayCardProps> = ({ onDrillTopic }) => {
  const [expanded, setExpanded] = useState(false);
  const rule = getRuleOfTheDay();
  const dayNumber = new Date().getDate();

  const handleToggle = () => {
    soundManager.playClick();
    setExpanded((prev) => !prev);
  };

  return (
    <div
      id="card-rule-of-the-day"
      className="w-full rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-violet-950/30 border border-violet-500/30 p-4 sm:p-5 shadow-xl transition-all hover:border-violet-500/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-950/70 px-2 py-0.5 rounded-md border border-violet-500/30">
                Rule of the Day • Day {dayNumber}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {rule.topicName}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
              {rule.title}
            </h3>
          </div>
        </div>

        <button
          id="btn-expand-daily-rule"
          type="button"
          onClick={handleToggle}
          className="px-2.5 py-1.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all shrink-0 active:scale-95"
        >
          <span>{expanded ? 'Collapse' : 'Expand'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary example always visible */}
      <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs sm:text-sm text-cyan-200">
        <span className="text-slate-400 font-sans text-xs mr-2 font-bold">Example:</span>
        <span>{rule.example1}</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-slate-800/80 animate-fade-in">
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs sm:text-sm text-cyan-200">
              <span className="text-slate-400 font-sans text-xs mr-2 font-bold">Example 2:</span>
              <span>{rule.example2}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs sm:text-sm text-cyan-200">
              <span className="text-slate-400 font-sans text-xs mr-2 font-bold">Example 3:</span>
              <span>{rule.example3}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-2.5 leading-relaxed">
            <Lightbulb className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-violet-300 font-bold block mb-0.5">Why This Matters:</strong>
              <span>{rule.tip}</span>
              {rule.boardReference && (
                <span className="block mt-1 text-[11px] text-violet-400/80 font-medium">
                  📌 Tested in: {rule.boardReference}
                </span>
              )}
            </div>
          </div>

          {onDrillTopic && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onDrillTopic(rule.topicId);
                }}
                className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Practice {rule.topicName}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
