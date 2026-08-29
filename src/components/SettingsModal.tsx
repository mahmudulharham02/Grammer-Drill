import React, { useState } from 'react';
import { X, Volume2, VolumeX, Download, Upload, Trash2, AlertTriangle, User, ShieldCheck } from 'lucide-react';
import { AppState } from '../types';
import { soundManager } from '../utils/sound';
import { exportStateAsJSON, importStateFromJSON } from '../utils/storage';

interface SettingsModalProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  state,
  onUpdateState,
  onResetProgress,
  onClose,
}) => {
  const [name, setName] = useState(state.user.name);
  const [avatar, setAvatar] = useState(state.user.avatar);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showAuthCardTips, setShowAuthCardTips] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hscGrammarQuest_v1.authCardDismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const avatarsList = ['🧑‍🎓', '👩‍🎓', '🦉', '🚀', '⚡', '🏆', '🦁', '👑'];

  const handleSaveProfile = () => {
    soundManager.playClick();
    onUpdateState({
      ...state,
      user: {
        ...state.user,
        name: name.trim() || 'HSC Candidate',
        avatar,
      },
    });
  };

  const handleToggleSound = () => {
    const nextSound = !state.settings.sound;
    soundManager.setEnabled(nextSound);
    onUpdateState({
      ...state,
      settings: {
        ...state.settings,
        sound: nextSound,
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = importStateFromJSON(content);
      if (parsed) {
        soundManager.playLevelUp();
        onUpdateState(parsed);
        onClose();
      } else {
        setImportError('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="modal-settings"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-200 flex items-center justify-center text-xl">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Settings & Data Management</h2>
              <p className="text-xs text-slate-400">Manage profile, audio, backups, and progress</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Profile Customization */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Student Profile
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Student Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-200 px-3 py-2 rounded-xl text-sm focus:outline-none"
                />
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-slate-300 font-semibold block">Choose Avatar</label>
              <div className="flex flex-wrap gap-2">
                {avatarsList.map((em) => (
                  <button
                    key={em}
                    onClick={() => {
                      setAvatar(em);
                      onUpdateState({
                        ...state,
                        user: { ...state.user, avatar: em },
                      });
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      avatar === em
                        ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-110'
                        : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sound Audio Settings */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Audio & Feedback
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {state.settings.sound ? (
                  <Volume2 className="w-5 h-5 text-cyan-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">Sound Effects & Synth Audio</h4>
                  <p className="text-[11px] text-slate-400">
                    Web Audio API synthesized sound cues for answers and level-ups
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  state.settings.sound
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {state.settings.sound ? 'Enabled' : 'Muted'}
              </button>
            </div>
          </div>

          {/* Notifications & Tips */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Notifications & Hints
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Show "Coming Soon" tips on dashboard</h4>
                <p className="text-[11px] text-slate-400">
                  Displays announcements regarding upcoming authentication and features
                </p>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  const nextVal = !showAuthCardTips;
                  setShowAuthCardTips(nextVal);
                  if (nextVal) {
                    localStorage.removeItem('hscGrammarQuest_v1.authCardDismissed');
                  } else {
                    localStorage.setItem('hscGrammarQuest_v1.authCardDismissed', 'true');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  showAuthCardTips
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {showAuthCardTips ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Backup Data Export & Import */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Data Backup & Sync (No Backend Required)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export your full progress (XP, streak, wrong question pool, badges) to a JSON file to transfer between devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => exportStateAsJSON(state)}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-lime-400" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {importError && <p className="text-xs text-rose-400">{importError}</p>}
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="space-y-3 bg-rose-950/20 p-4 rounded-2xl border border-rose-500/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Danger Zone
            </h3>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset All Progress</span>
              </button>
            ) : (
              <div className="space-y-3 bg-rose-950/80 p-3.5 rounded-xl border border-rose-500">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Are you sure? This will wipe all XP, badges, and scores.</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-lg shadow"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-1.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
