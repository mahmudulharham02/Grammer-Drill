import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Upload,
  Trophy,
  Award,
  Flame,
  Diamond,
  Zap,
  Target,
  Clock,
  ChevronRight,
  Sparkles,
  Lock,
  Star,
  Crown,
  CheckCircle2,
  Edit2,
  Info,
  X
} from 'lucide-react';
import { AppState, TopicProgressItem, Badge } from '../types';
import { ALL_BADGES } from '../data/badges';
import { TOPICS_DATA } from '../data/topics';
import { soundManager } from '../utils/sound';
import { getMasteryTier } from '../utils/storage';
import { getExamHistory, LastHourPrepAttempt } from '../utils/examGenerator';
import { getDashboardTopicIcon } from './HomeDashboard';

interface ProfileViewProps {
  state: AppState;
  onEditProfile: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
  onOpenCertificate: () => void;
  onNavigateTopic?: (topicId: string) => void;
  onStartExam?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  state,
  onEditProfile,
  onExportBackup,
  onImportBackup,
  onOpenCertificate,
  onNavigateTopic,
  onStartExam,
}) => {
  const [copiedRoll, setCopiedRoll] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const examHistory: LastHourPrepAttempt[] = getExamHistory();
  const latestExam = examHistory.length > 0 ? examHistory[0] : null;

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
    <div id="view-student-profile" className="space-y-6 max-w-5xl mx-auto pb-24 animate-fade-in">
      {/* Profile Header Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-content flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Frame */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-cyan-500/20">
              <span>{state.user.avatar || '🧑‍🎓'}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-[10px] font-extrabold shadow">
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
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono border border-cyan-500/30">
                    {state.user.title || 'Apprentice 🐣'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {state.user.group || 'Science'} • {state.user.board || 'Dhaka'} Board
                  </span>
                </div>
              </div>

              <button
                id="btn-edit-student-profile"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onEditProfile();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors self-center sm:self-auto shadow-sm active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Roll Number & Gender */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Roll / ID:</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700">
                  {state.user.roll || 'N/A'}
                </span>
                {state.user.roll && (
                  <button
                    id="btn-copy-roll"
                    type="button"
                    onClick={handleCopyRoll}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy Roll ID"
                  >
                    {copiedRoll ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700">
                <span className="text-base">
                  {state.user.gender === 'male' ? '🚹' : state.user.gender === 'female' ? '🚺' : '👤'}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {state.user.gender === 'male' ? 'Male' : state.user.gender === 'female' ? 'Female' : 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Enhanced Top Stats Row (5 stats in responsive grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Drills</span>
            <span className="text-base sm:text-lg font-extrabold text-cyan-400">{totalAttempts} Qs</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
            <span className="text-base sm:text-lg font-extrabold text-lime-400">{overallAccuracy}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total XP</span>
            <span className="text-base sm:text-lg font-extrabold text-cyan-400">{state.xp}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Streak</span>
            <span className="text-base sm:text-lg font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{state.streak} d</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diamonds</span>
            <span className="text-base sm:text-lg font-extrabold text-cyan-300 flex items-center justify-center gap-1">
              <Diamond className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>{state.diamonds}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Topic Mastery Grid (10 small cards with Tiered Mastery Visuals) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>10-Topic Mastery Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400">Track your learning progress across all board grammar items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPICS_DATA.map((topic) => {
            const prog = state.topicProgress[topic.id] || {
              unlocked: true,
              attempts: 0,
              correct: 0,
              wrong: 0,
              mastery: 0,
            };

            const mastery = getMasteryTier(prog);
            const topicAccuracy = prog.attempts > 0 ? Math.round((prog.correct / prog.attempts) * 100) : 0;

            return (
              <div
                key={topic.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  mastery.isMastered
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                        {getDashboardTopicIcon(topic.id)}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-white truncate max-w-[140px]">
                        {topic.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {topic.marks}M
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="flex items-center gap-1 font-semibold">
                      {mastery.hasLock && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                      {mastery.hasStar && <Star className="w-2.5 h-2.5 text-violet-400 fill-violet-400/30" />}
                      {mastery.hasCrown && <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400/30" />}
                      {mastery.hasCheck && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
                      <span className={mastery.textColor}>{mastery.label}</span>
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {prog.attempts > 0 ? `${topicAccuracy}% (${prog.attempts} Qs)` : '0 attempts'}
                    </span>
                  </div>

                  {mastery.tier > 0 && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
                      <div
                        className={`h-full ${mastery.barColor} rounded-full`}
                        style={{ width: `${mastery.percent}%` }}
                      />
                    </div>
                  )}
                </div>

                {onNavigateTopic && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onNavigateTopic(topic.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Practice</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Last Hour Prep Exam History Card */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Board Exam Simulator History</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">60 Marks · 90 Mins</span>
        </div>

        {latestExam ? (
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono border border-amber-500/40">
                    Latest Mock Score: {latestExam.score} / {latestExam.totalMarks} Marks
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 text-xs font-extrabold border border-lime-500/40">
                    Grade: {latestExam.grade} ({latestExam.percentage}%)
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Last Exam Taken: {new Date(latestExam.date).toLocaleDateString()} at {new Date(latestExam.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h3>
                <p className="text-xs text-slate-300">
                  {latestExam.rawCorrectCount} of {latestExam.totalQuestions} questions correct • Time taken: {Math.floor(latestExam.timeTakenSeconds / 60)}m {latestExam.timeTakenSeconds % 60}s
                </p>
              </div>

              {onStartExam && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    onStartExam();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Take Another Mock</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-200">
                {state.level >= 2
                  ? 'Ready to take your first Board Mock Exam!'
                  : 'Board Exam Simulator Unlocks at Level 2'}
              </h3>
              <p className="text-xs text-slate-400">
                {state.level >= 2
                  ? 'Test your full 60-mark grammar mastery under real 90-minute board conditions.'
                  : 'Keep completing topic drills and daily challenges to reach Level 2.'}
              </p>
            </div>

            {state.level >= 2 && onStartExam && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onStartExam();
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shrink-0"
              >
                <span>Start Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </section>

      {/* 4. Badges Wall (With lock icons & tap-to-see requirements) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" />
              <span>Badges & Trophies Wall</span>
            </h2>
            <p className="text-xs text-slate-400">
              Unlocked: {state.badges.length} of {ALL_BADGES.length} Badges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = state.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedBadge(badge);
                }}
                className={`p-3 rounded-2xl border text-center cursor-pointer transition-all relative group ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-violet-500/40 shadow-md shadow-violet-500/10 hover:scale-105'
                    : 'bg-slate-900/30 border-slate-800 opacity-50 hover:opacity-80'
                }`}
              >
                <div className="text-3xl mb-1.5 flex items-center justify-center relative">
                  <span>{badge.icon}</span>
                  {!isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-700">
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                    </div>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white truncate">
                  {badge.title}
                </h4>
                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {isUnlocked ? 'Unlocked' : 'Tap for info'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="text-5xl mx-auto">{selectedBadge.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-white">{selectedBadge.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{selectedBadge.description}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="font-bold text-slate-200 capitalize">{selectedBadge.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reward:</span>
                <span className="font-bold text-cyan-300">+{selectedBadge.xpReward} XP, +{selectedBadge.coinReward} 💎</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status:</span>
                <span className={`font-bold ${state.badges.includes(selectedBadge.id) ? 'text-lime-400' : 'text-amber-400'}`}>
                  {state.badges.includes(selectedBadge.id) ? '✅ Unlocked' : '🔒 Locked'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Official Certificate Card */}
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
          type="button"
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

        {importStatus && (
          <div className="p-3 rounded-xl bg-lime-950/60 border border-lime-500/40 text-lime-200 text-xs font-bold">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export JSON */}
          <button
            id="btn-export-backup-json"
            type="button"
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

      {/* About This App & ARHAM Credit Section (No Heart Emoji as Requested) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-pink-500/30 space-y-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>About This App</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gramify is crafted with care to help students master HSC English grammar through gamified learning and syllabus-accurate drills.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-violet-500/15 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-sm sm:text-base font-extrabold text-pink-400 block drop-shadow-[0_0_12px_rgba(244,114,182,0.35)]">
              Made by ARHAM
            </span>
            <span className="text-[11px] text-slate-400">
              Created for Bangladesh HSC Students
            </span>
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
                style={{ width: '155px', height: 'auto' }}
                className="w-[145px] sm:w-[155px] h-auto"
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
