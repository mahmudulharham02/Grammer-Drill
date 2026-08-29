import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Question, ShopItem, VoiceSubModuleId, NarrationSubModuleId } from './types';
import {
  loadAppState,
  saveAppState,
  recordStudySession,
  addXPAndCoins,
  recordQuestionResult,
  toggleBookmarkQuestion,
  calculateHeartRegen,
  getDefaultState,
  exportStateAsJSON,
  importStateFromJSON,
} from './utils/storage';
import { ALL_QUESTIONS } from './data/questions';
import { VOICE_CHANGE_QUESTIONS } from './data/voiceChangeQuestions';
import { NARRATION_QUESTIONS } from './data/narrationQuestions';
import { TOPICS_DATA } from './data/topics';
import { soundManager } from './utils/sound';

// Components
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { TopicsLibrary } from './components/TopicsLibrary';
import { PracticeHub } from './components/PracticeHub';
import { ChangingSentencesHub } from './components/ChangingSentencesHub';
import { GameScreen } from './components/GameScreen';
import { ReviewWrongPool } from './components/ReviewWrongPool';
import { BookmarksView } from './components/BookmarksView';
import { AchievementsView } from './components/AchievementsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { AppFooter } from './components/AppFooter';

// Modals
import { RulesGuideModal } from './components/RulesGuideModal';
import { ShopModal } from './components/ShopModal';
import { HeartsShopModal } from './components/HeartsShopModal';
import { OutOfHeartsModal } from './components/OutOfHeartsModal';
import { SettingsModal } from './components/SettingsModal';
import { CertificateModal } from './components/CertificateModal';
import { StudentIntroModal } from './components/StudentIntroModal';
import {
  tradeDiamondsForHearts,
  rewardMockAdWatch,
  getNextHeartRegenSeconds,
} from './utils/storage';

export function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active game session config
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [gameTitle, setGameTitle] = useState<string>('Grammar Practice');
  const [gameSubTitle, setGameSubTitle] = useState<string | undefined>();

  // Modals state
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showHeartsShopModal, setShowHeartsShopModal] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState<boolean>(state.firstTimeUser);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Sync sound settings with soundManager
  useEffect(() => {
    soundManager.setEnabled(state.settings.sound);
  }, [state.settings.sound]);

  // Periodic Heart Regeneration check
  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => calculateHeartRegen(prev));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Update & persist state helper
  const updateState = useCallback((updater: AppState | ((prev: AppState) => AppState)) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveAppState(next);
      return next;
    });
  }, []);

  // Navigation handler
  const handleNavigate = (route: string, params?: { topicId?: string; subtopicId?: string }) => {
    if (route === 'game' && params?.topicId) {
      startTopicLesson(params.topicId, params.subtopicId);
      return;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch a standard topic lesson
  const startTopicLesson = (topicId: string, subtopicId?: string) => {
    let matchedQuestions = ALL_QUESTIONS.filter((q) => q.topicId === topicId);
    if (subtopicId) {
      const subMatches = matchedQuestions.filter((q) => q.subtopicId === subtopicId);
      if (subMatches.length > 0) {
        matchedQuestions = subMatches;
      }
    }

    if (matchedQuestions.length === 0) {
      matchedQuestions = ALL_QUESTIONS.slice(0, 10);
    }

    // Shuffle and pick 10 questions max
    const shuffled = [...matchedQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    const topic = TOPICS_DATA.find((t) => t.id === topicId);
    setGameTitle(topic ? topic.title : 'Grammar Drill');
    setGameSubTitle(subtopicId ? `Module: ${subtopicId.replace(/_/g, ' ')}` : undefined);
    setActiveQuestions(shuffled);
    setCurrentRoute('game');
  };

  // Launch Daily Challenge (1 question from each of the 10 topics)
  const startDailyChallenge = () => {
    const selected: Question[] = [];
    TOPICS_DATA.forEach((topic) => {
      const topicQuestions = ALL_QUESTIONS.filter((q) => q.topicId === topic.id);
      if (topicQuestions.length > 0) {
        const randomQ = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
        selected.push(randomQ);
      }
    });

    if (selected.length === 0) {
      selected.push(...ALL_QUESTIONS.slice(0, 10));
    }

    setGameTitle('Daily Board Challenge (10 Topics)');
    setGameSubTitle('Mixed 10-Topic Board Standard Test');
    setActiveQuestions(selected);
    setCurrentRoute('game');
  };

  // Launch custom question set drill (e.g. from mistake pool or bookmarks)
  const startCustomDrill = (questions: Question[], title: string) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setGameTitle(title);
    setGameSubTitle(undefined);
    setActiveQuestions(shuffled);
    setCurrentRoute('game');
  };

  // Launch specialized Voice Change Drill
  const startVoiceDrill = (subModule: VoiceSubModuleId) => {
    const matched = VOICE_CHANGE_QUESTIONS.filter((q) => q.subModule === subModule);
    const questionsToUse = matched.length > 0 ? matched : VOICE_CHANGE_QUESTIONS;
    const shuffled = [...questionsToUse].sort(() => Math.random() - 0.5).slice(0, 10);
    const subModuleNames: Record<string, string> = {
      simple_present: 'Simple Present Voice',
      present_continuous: 'Present Continuous Voice',
      present_perfect: 'Present Perfect Voice',
      simple_past: 'Simple Past Voice',
      past_continuous: 'Past Continuous Voice',
      past_perfect: 'Past Perfect Voice',
      simple_future: 'Simple Future Voice',
      future_perfect: 'Future Perfect Voice',
      modals: 'Modal Verbs Voice',
      imperatives: 'Imperative Voice',
      interrogatives: 'Interrogative Voice',
      negatives: 'Negatives & Intransitive',
    };
    setGameTitle(`Voice Change: ${subModuleNames[subModule] || subModule}`);
    setGameSubTitle('Active ↔ Passive Transformation Drill');
    setActiveQuestions(shuffled);
    setCurrentRoute('game');
  };

  // Launch specialized Narration Change Drill
  const startNarrationDrill = (subModule: NarrationSubModuleId) => {
    const matched = NARRATION_QUESTIONS.filter((q) => q.subModule === subModule);
    const questionsToUse = matched.length > 0 ? matched : NARRATION_QUESTIONS;
    const shuffled = [...questionsToUse].sort(() => Math.random() - 0.5).slice(0, 10);
    const subModuleNames: Record<string, string> = {
      assertive: 'Assertive Sentences',
      interrogative: 'Interrogative Sentences',
      imperative: 'Imperative Sentences',
      exclamatory: 'Exclamatory Sentences',
      optative: 'Optative Sentences',
      mixed: 'Mixed Board Narration',
    };
    setGameTitle(`Narration: ${subModuleNames[subModule] || subModule}`);
    setGameSubTitle('Direct ↔ Indirect Speech Drill');
    setActiveQuestions(shuffled);
    setCurrentRoute('game');
  };

  // Game action handlers
  const handleRecordResult = (
    questionId: string,
    topicId: string,
    isCorrect: boolean,
    subModuleId?: string
  ) => {
    setState((prev) => recordQuestionResult(prev, questionId, topicId, isCorrect, subModuleId));
  };

  const handleAddXP = (xp: number, coins: number) => {
    setState((prev) => {
      const withSession = recordStudySession(prev);
      const { newState } = addXPAndCoins(withSession, xp, coins);
      return newState;
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    setState((prev) => toggleBookmarkQuestion(prev, questionId));
  };

  const handleUseHint = (): boolean => {
    if (state.inventory.hints > 0) {
      setState((prev) => ({
        ...prev,
        inventory: {
          ...prev.inventory,
          hints: prev.inventory.hints - 1,
        },
      }));
      return true;
    } else if (state.coins >= 1) {
      setState((prev) => ({
        ...prev,
        coins: prev.coins - 1,
      }));
      return true;
    }
    return false;
  };

  const handleRefillHearts = () => {
    setState((prev) => ({
      ...prev,
      hearts: prev.maxHearts,
      lastHeartLostAt: null,
    }));
  };

  const handleClaimBadge = (badgeId: string) => {
    setState((prev) => ({
      ...prev,
      coins: prev.coins + 10,
      xp: prev.xp + 50,
      unclaimedBadges: (prev.unclaimedBadges || []).filter((id) => id !== badgeId),
    }));
  };

  const handleBuyShopItem = (item: ShopItem) => {
    setState((prev) => {
      if (prev.coins < item.cost) return prev;
      const newCoins = prev.coins - item.cost;

      if (item.category === 'hearts') {
        return {
          ...prev,
          coins: newCoins,
          hearts: prev.maxHearts,
          lastHeartLostAt: null,
        };
      }

      if (item.category === 'hints' || item.category === 'boost') {
        return {
          ...prev,
          coins: newCoins,
          inventory: {
            ...prev.inventory,
            hints: prev.inventory.hints + 3,
          },
        };
      }

      if (item.category === 'frame') {
        return {
          ...prev,
          coins: newCoins,
          inventory: {
            ...prev.inventory,
            avatarFrames: [...prev.inventory.avatarFrames, item.id],
          },
          user: {
            ...prev.user,
            avatarFrame: item.id,
          },
        };
      }

      if (item.category === 'theme') {
        return {
          ...prev,
          coins: newCoins,
          inventory: {
            ...prev.inventory,
            themes: [...prev.inventory.themes, item.id],
          },
          activeTheme: item.id,
        };
      }

      return prev;
    });
  };

  const handleEquipShopItem = (category: string, itemId: string) => {
    setState((prev) => {
      if (category === 'frame') {
        return {
          ...prev,
          user: {
            ...prev.user,
            avatarFrame: itemId,
          },
        };
      }
      if (category === 'theme') {
        return {
          ...prev,
          activeTheme: itemId,
        };
      }
      return prev;
    });
  };

  const handleResetProgress = () => {
    const initial = getDefaultState();
    initial.firstTimeUser = false;
    updateState(initial);
  };

  const handleExportBackup = () => {
    exportStateAsJSON(state);
    updateState((prev) => ({
      ...prev,
      lastBackupAt: new Date().toISOString(),
      settings: {
        ...prev.settings,
        cacheWarningDismissed: true,
      },
    }));
  };

  const handleImportBackup = (jsonStr: string) => {
    const parsed = importStateFromJSON(jsonStr);
    if (parsed) {
      updateState(parsed);
    }
  };

  const handleDismissCacheWarning = () => {
    updateState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        cacheWarningDismissed: true,
      },
    }));
  };

  const handleTradeDiamonds = (hearts: number) => {
    const res = tradeDiamondsForHearts(state, hearts);
    if (res.success) {
      updateState(res.newState);
    }
    return { success: res.success, message: res.message };
  };

  const handleWatchMockAd = () => {
    const res = rewardMockAdWatch(state);
    if (res.success) {
      updateState(res.newState);
    }
    return { success: res.success, message: res.message };
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="global-app-toast"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-pink-500/50 shadow-2xl text-xs sm:text-sm font-bold text-pink-300 flex items-center gap-2 animate-bounce"
        >
          <span>💖</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Main Navigation Bar */}
      <Navbar
        state={state}
        currentRoute={currentRoute}
        onNavigate={(route) => handleNavigate(route)}
        onOpenShop={() => setShowShopModal(true)}
        onOpenHeartsShop={() => setShowHeartsShopModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenRules={() => setShowRulesModal(true)}
        onToggleSound={() => {
          const nextSound = !state.settings.sound;
          soundManager.setEnabled(nextSound);
          updateState({
            ...state,
            settings: { ...state.settings, sound: nextSound },
          });
        }}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-[15px] pb-16">
        {currentRoute === 'home' && (
          <HomeDashboard
            state={state}
            onNavigate={(route, params) => handleNavigate(route, params)}
            onStartDailyChallenge={startDailyChallenge}
            onOpenRules={() => setShowRulesModal(true)}
            onOpenCertificate={() => setShowCertModal(true)}
            onOpenHeartsShop={() => setShowHeartsShopModal(true)}
            onExportBackup={handleExportBackup}
            onDismissCacheWarning={handleDismissCacheWarning}
          />
        )}

        {currentRoute === 'practice_hub' && (
          <PracticeHub
            state={state}
            onStartVoiceDrill={startVoiceDrill}
            onStartNarrationDrill={startNarrationDrill}
            onOpenRules={() => setShowRulesModal(true)}
          />
        )}

        {currentRoute === 'topics' && (
          <TopicsLibrary
            state={state}
            onSelectTopic={(topicId, subtopicId) => {
              if (topicId === 'changing_sentences') {
                setCurrentRoute('changing_sentences');
              } else {
                startTopicLesson(topicId, subtopicId);
              }
            }}
            onOpenRules={() => setShowRulesModal(true)}
          />
        )}

        {currentRoute === 'changing_sentences' && (
          <ChangingSentencesHub
            state={state}
            onStartDrill={(subtopicId) => startTopicLesson('changing_sentences', subtopicId)}
            onOpenRules={() => setShowRulesModal(true)}
          />
        )}

        {currentRoute === 'game' && (
          <GameScreen
            state={state}
            questions={activeQuestions}
            title={gameTitle}
            subTitle={gameSubTitle}
            onComplete={(stats) => {
              const todayStr = new Date().toISOString().split('T')[0];
              if (gameTitle.includes('Daily Board Challenge')) {
                updateState((prev) => ({
                  ...prev,
                  dailyChallenge: {
                    lastCompletedDate: todayStr,
                    currentStreak: prev.dailyChallenge.currentStreak + 1,
                  },
                }));
              }
            }}
            onRecordResult={handleRecordResult}
            onAddXP={handleAddXP}
            onToggleBookmark={handleToggleBookmark}
            onUseHint={handleUseHint}
            onRefillHearts={handleRefillHearts}
            onExit={() => setCurrentRoute('home')}
          />
        )}

        {currentRoute === 'review_wrong' && (
          <ReviewWrongPool
            state={state}
            onStartReviewDrill={(questions) =>
              startCustomDrill(questions, 'Mistake Review Session')
            }
            onNavigateHome={() => setCurrentRoute('topics')}
          />
        )}

        {currentRoute === 'bookmarks' && (
          <BookmarksView
            state={state}
            onStartBookmarkDrill={(questions) =>
              startCustomDrill(questions, 'Saved Questions Revision')
            }
            onToggleBookmark={handleToggleBookmark}
            onNavigateHome={() => setCurrentRoute('topics')}
          />
        )}

        {currentRoute === 'achievements' && (
          <AchievementsView state={state} onClaimBadge={handleClaimBadge} />
        )}

        {currentRoute === 'analytics' && (
          <AnalyticsView
            state={state}
            onOpenCertificate={() => setShowCertModal(true)}
            onNavigateTopic={(topicId) => startTopicLesson(topicId)}
          />
        )}

        {currentRoute === 'profile' && (
          <ProfileView
            state={state}
            onEditProfile={() => setShowIntroModal(true)}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onOpenCertificate={() => setShowCertModal(true)}
          />
        )}
      </main>

      {/* Site-wide Persistent Footer */}
      <AppFooter hidden={currentRoute === 'game'} onToast={showToast} />

      {/* Global Modals */}
      {showRulesModal && (
        <RulesGuideModal onClose={() => setShowRulesModal(false)} />
      )}

      {showHeartsShopModal && (
        <HeartsShopModal
          hearts={state.hearts}
          maxHearts={state.maxHearts}
          diamonds={state.diamonds}
          onTradeDiamonds={handleTradeDiamonds}
          onClose={() => setShowHeartsShopModal(false)}
        />
      )}

      {showOutOfHeartsModal && (
        <OutOfHeartsModal
          diamonds={state.diamonds}
          regenSecondsLeft={getNextHeartRegenSeconds(state)}
          lastAdWatchedAt={state.lastAdWatchedAt}
          onTradeDiamonds={handleTradeDiamonds}
          onWatchMockAd={handleWatchMockAd}
          onClose={() => setShowOutOfHeartsModal(false)}
        />
      )}

      {showShopModal && (
        <ShopModal
          state={state}
          onBuyItem={handleBuyShopItem}
          onEquipItem={handleEquipShopItem}
          onClose={() => setShowShopModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          state={state}
          onUpdateState={(newState) => updateState(newState)}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showCertModal && (
        <CertificateModal
          state={state}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {showIntroModal && (
        <StudentIntroModal
          initialProfile={state.user}
          isEditing={!state.firstTimeUser}
          onSave={(profile) => {
            setShowIntroModal(false);
            updateState((prev) => ({
              ...prev,
              firstTimeUser: false,
              user: {
                ...prev.user,
                ...profile,
              },
            }));
          }}
          onSaveProfile={(profile) => {
            setShowIntroModal(false);
            updateState((prev) => ({
              ...prev,
              firstTimeUser: false,
              user: {
                ...prev.user,
                ...profile,
              },
            }));
          }}
          onClose={() => setShowIntroModal(false)}
        />
      )}
    </div>
  );
}

export default App;
