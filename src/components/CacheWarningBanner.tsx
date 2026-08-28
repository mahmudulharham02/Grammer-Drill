import React, { useState } from 'react';
import { AlertTriangle, Download, X, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface CacheWarningBannerProps {
  onExport: () => void;
  onDismiss: () => void;
}

export const CacheWarningBanner: React.FC<CacheWarningBannerProps> = ({ onExport, onDismiss }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      id="banner-cache-warning"
      className="relative z-content w-full rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 sm:p-4 text-amber-200 transition-all shadow-lg shadow-amber-500/5 mb-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                Important: Local Storage & Data Safety Notice
              </h4>
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="text-amber-400 hover:text-amber-200 text-xs flex items-center gap-0.5 sm:hidden"
              >
                {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!collapsed && (
              <p className="text-[11px] sm:text-xs text-amber-200/90 leading-relaxed max-w-3xl">
                All your XP, hearts, streaks, and unlocked badges are stored locally in your
                browser. <strong className="text-amber-300 font-semibold">Do NOT clear your browser cache or site data</strong> or you will lose your progress! Use the backup button below to save your JSON backup regularly.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-banner-export-json"
            onClick={() => {
              soundManager.playCoin();
              onExport();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow transition-all active:scale-95"
            title="Download JSON progress backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Progress</span>
            <span className="sm:hidden">Backup</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onDismiss();
            }}
            className="p-1.5 rounded-lg text-amber-400 hover:text-amber-100 hover:bg-amber-500/20 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
