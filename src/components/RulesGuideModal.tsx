import React, { useState } from 'react';
import { X, Search, BookOpen, Sparkles, Check, ChevronRight, Layers } from 'lucide-react';
import { RULES_GUIDE_DATA } from '../data/rulesGuide';
import { soundManager } from '../utils/sound';

interface RulesGuideModalProps {
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ onClose }) => {
  const [selectedSectionId, setSelectedSectionId] = useState(RULES_GUIDE_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSection =
    RULES_GUIDE_DATA.find((s) => s.id === selectedSectionId) || RULES_GUIDE_DATA[0];

  const filteredRulesList = activeSection.rulesList?.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.formula.toLowerCase().includes(q) ||
      r.example.original.toLowerCase().includes(q) ||
      r.example.transformed.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="modal-rules-guide"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="glass-panel w-full max-w-5xl h-[90vh] rounded-3xl border border-violet-500/30 flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center text-lg">
              📖
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                HSC Grammar Rules & Formula Handbook
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Bangladesh Education Boards standard transformation matrices
              </p>
            </div>
          </div>

          <button
            id="btn-close-rules"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs & Search */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {RULES_GUIDE_DATA.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedSectionId(sec.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSectionId === sec.id
                    ? 'bg-violet-500 text-black shadow-md shadow-violet-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sec.title.split('(')[0]}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in rules..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-violet-400"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section Banner */}
          <div className="bg-gradient-to-r from-violet-950/40 via-slate-900 to-indigo-950/40 p-4 sm:p-5 rounded-2xl border border-violet-500/30">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-500/30">
                {activeSection.badge}
              </span>
              <span className="text-xs text-violet-300 font-semibold">{activeSection.bengaliTitle}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">{activeSection.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {activeSection.description}
            </p>
          </div>

          {/* Formula Table (If available) */}
          {activeSection.formulaTable && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transformation Formula Table</span>
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold">
                      {activeSection.formulaTable.header.map((h, i) => (
                        <th key={i} className="p-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {activeSection.formulaTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 font-semibold text-white">{row[0]}</td>
                        <td className="p-3 font-mono text-cyan-300">{row[1]}</td>
                        <td className="p-3 font-mono text-lime-300">{row[2]}</td>
                        <td className="p-3 text-slate-400">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rules List (If available e.g. 16 Affirmative/Negative Rules) */}
          {activeSection.rulesList && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-lime-400">
                Specific Rule Breakdown ({filteredRulesList?.length || 0} Rules)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRulesList?.map((rule) => (
                  <div
                    key={rule.ruleNo}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-violet-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-violet-300 bg-violet-950 px-2 py-0.5 rounded border border-violet-500/30">
                        Rule {rule.ruleNo}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{rule.title}</span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-mono text-xs text-lime-300">
                      {rule.formula}
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800/60">
                      <p>
                        <span className="text-slate-400 font-semibold">Affirmative:</span>{' '}
                        {rule.example.original}
                      </p>
                      <p>
                        <span className="text-slate-400 font-semibold">Negative:</span>{' '}
                        <span className="text-white font-medium">{rule.example.transformed}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Takeaways & Board Tips */}
          {activeSection.keyTakeaways && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Key Exam Takeaways & Warnings
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeSection.keyTakeaways.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
