import React, { useState } from 'react';
import {
  User,
  Copy,
  Check,
  Download,
  Upload,
  Trophy,
  Award,
  Flame,
  Heart,
  Coins,
  Calendar,
  ShieldAlert,
  Edit2,
  Share2,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { AppState, TopicProgressItem } from '../types';
import { ALL_BADGES } from '../data/badges';
import { soundManager } from '../utils/sound';

interface ProfileViewProps {
  state: AppState;
  onEditProfile: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
  onOpenCertificate: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  state,
  onEditProfile,
  onExportBackup,
  onImportBackup,
  onOpenCertificate,
}) => {
  const [copiedRoll, setCopiedRoll] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCopyRoll = () => {
    if (!state.user.roll) return;
    soundManager.playClick();
    navigator.clipboard.writeText(state.user.roll);
    setCopiedRoll(true);
    setTimeout(() => setCopiedRoll(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
        setImportStatus('Backup loaded successfully!');
        soundManager.playLevelUp();
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const topicProgressArray = Object.values(state.topicProgress) as TopicProgressItem[];
  const totalCorrect = topicProgressArray.reduce((acc, curr) => acc + (curr.correct || 0), 0);
  const totalAttempts = topicProgressArray.reduce((acc, curr) => acc + (curr.attempts || 0), 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const lastBackupFormatted = state.lastBackupAt
    ? new Date(state.lastBackupAt).toLocaleString()
    : 'Never (Export backup recommended!)';

  return (
    <div id="view-student-profile" className="space-y-6 max-w-4xl mx-auto pb-24 animate-fade-in">
      {/* Profile Header Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-content flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Frame */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-cyan-500/20">
              {state.user.avatar || '🧑‍🎓'}
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-400 text-black text-[10px] font-extrabold shadow">
              Lvl {state.level}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {state.user.name || 'HSC Aspirant'}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
                    {state.user.title || 'Apprentice 🐣'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {state.user.group || 'Science'} • {state.user.board || 'Dhaka'} Board
                  </span>
                </div>
              </div>

              <button
                id="btn-edit-student-profile"
                onClick={() => {
                  soundManager.playClick();
                  onEditProfile();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors self-center sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Roll Number with Copy */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs text-slate-400 font-mono">Roll / ID:</span>
              <span className="text-xs font-mono font-bold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700">
                {state.user.roll || 'N/A'}
              </span>
              {state.user.roll && (
                <button
                  id="btn-copy-roll"
                  onClick={handleCopyRoll}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy Roll ID"
                >
                  {copiedRoll ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stat Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total XP</span>
            <span className="text-lg font-extrabold text-cyan-400">{state.xp}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
            <span className="text-lg font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{state.streak} d</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mastery</span>
            <span className="text-lg font-extrabold text-lime-400">{overallAccuracy}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Badges</span>
            <span className="text-lg font-extrabold text-violet-400">
              {state.badges.length}/{ALL_BADGES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate of Grammar Mastery Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Award className="w-5 h-5 text-violet-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Official HSC Grammar Certificate
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Generate and export your verified Certificate of Grammar Mastery with your Board details and total XP.
          </p>
        </div>

        <button
          id="btn-view-certificate"
          onClick={() => {
            soundManager.playClick();
            onOpenCertificate();
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-violet-500/25 flex items-center gap-2 active:scale-95 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>View Certificate</span>
        </button>
      </div>

      {/* Backup & Restore Section */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Data Backup & Progress Protection</span>
            </h3>
            <p className="text-xs text-slate-400">
              Last Backup:{' '}
              <strong className={state.lastBackupAt ? 'text-cyan-300' : 'text-amber-400'}>
                {lastBackupFormatted}
              </strong>
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-lime-950/60 border border-lime-500/40 text-lime-200 text-xs font-bold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            id="btn-export-backup-json"
            onClick={() => {
              soundManager.playCoin();
              onExportBackup();
            }}
            className="p-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Progress (.JSON)</span>
          </button>

          {/* Import JSON */}
          <label className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95">
            <Upload className="w-4 h-4" />
            <span>Restore Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* About This App & ARHAM Credit Section */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-pink-500/30 space-y-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>About This App</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            HSC Grammar Quest is crafted with care to help students like you master HSC English grammar through gamified learning and syllabus-accurate drills.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-violet-500/15 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="text-3xl heart-pulse">❤️</span>
            <div>
              <span className="text-sm sm:text-base font-extrabold text-pink-400 block drop-shadow-[0_0_12px_rgba(244,114,182,0.35)]">
                Made with ❤️ by ARHAM
              </span>
              <span className="text-[11px] text-slate-400">
                Created with passion for Bangladesh HSC Students
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <a
              href="https://www.launchvault.dev"
              target="_blank"
              rel="noopener noreferrer"
              title="Featured on LaunchVault"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src="https://www.launchvault.dev/images/badges/launch-valut-badge.svg"
                alt="Featured on LaunchVault"
                style={{ width: '165px', height: 'auto' }}
                className="w-[150px] sm:w-[165px] h-auto"
              />
            </a>
            <span className="text-[11px] font-mono font-bold text-slate-400 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
              v3.0.0 (HSC Board Standard)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
