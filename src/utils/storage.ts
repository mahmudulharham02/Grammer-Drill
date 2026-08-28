import { AppState, TopicProgressItem, SubModuleProgressItem } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { getLevelTitle, getXpRequiredForLevel, ALL_BADGES } from '../data/badges';

const STORAGE_KEY = 'hscGrammarQuest_v1';
const HEART_REGEN_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes per heart

function createInitialTopicProgress(): Record<string, TopicProgressItem> {
  const progress: Record<string, TopicProgressItem> = {};
  TOPICS_DATA.forEach((topic) => {
    progress[topic.id] = {
      unlocked: true,
      completedLessons: [],
      bestScores: {},
      attempts: 0,
      correct: 0,
      wrong: 0,
      mastery: 0,
      subModules: {},
    };
  });
  return progress;
}

export function getDefaultState(): AppState {
  return {
    version: 2,
    user: {
      name: null,
      roll: null,
      group: null,
      board: null,
      avatar: '🧑‍🎓',
      avatarFrame: 'none',
      joinedAt: null,
      title: 'Apprentice 🐣',
    },
    xp: 0,
    level: 1,
    coins: 10,
    hearts: 5,
    maxHearts: 5,
    lastHeartLostAt: null,
    streak: 1,
    lastStudyDate: new Date().toISOString().split('T')[0],
    lastBackupAt: null,
    settings: {
      sound: true,
      theme: 'dark',
      timerEnabled: false,
      timerSeconds: 30,
      cacheWarningDismissed: false,
    },
    inventory: {
      themes: ['default'],
      avatarFrames: ['none'],
      hints: 3,
    },
    activeTheme: 'default',
    badges: [],
    unclaimedBadges: [],
    topicProgress: createInitialTopicProgress(),
    dailyChallenge: {
      lastCompletedDate: null,
      currentStreak: 0,
    },
    bookmarkedQuestionIds: [],
    wrongQuestionReviewPool: [],
    recentScores: [],
    firstTimeUser: true,
  };
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultState();
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppState;

    // Ensure all topics exist in topicProgress
    TOPICS_DATA.forEach((topic) => {
      if (!parsed.topicProgress[topic.id]) {
        parsed.topicProgress[topic.id] = {
          unlocked: true,
          completedLessons: [],
          bestScores: {},
          attempts: 0,
          correct: 0,
          wrong: 0,
          mastery: 0,
          subModules: {},
        };
      }
    });

    if (!parsed.user) {
      parsed.user = getDefaultState().user;
    }

    if (!parsed.settings) {
      parsed.settings = getDefaultState().settings;
    }

    // Check & calculate heart regeneration
    const updated = calculateHeartRegen(parsed);
    // Check streak
    const updatedWithStreak = checkStreakIntegrity(updated);
    return updatedWithStreak;
  } catch (e) {
    console.error('Failed to load localStorage state:', e);
    return getDefaultState();
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function calculateHeartRegen(state: AppState): AppState {
  if (state.hearts >= state.maxHearts || !state.lastHeartLostAt) {
    return state;
  }

  const now = Date.now();
  const lastLost = new Date(state.lastHeartLostAt).getTime();
  const elapsed = now - lastLost;

  if (elapsed >= HEART_REGEN_INTERVAL_MS) {
    const heartsToAdd = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);
    const newHearts = Math.min(state.maxHearts, state.hearts + heartsToAdd);

    let newLastLost: string | null = null;
    if (newHearts < state.maxHearts) {
      const remainder = elapsed % HEART_REGEN_INTERVAL_MS;
      newLastLost = new Date(now - remainder).toISOString();
    }

    const newState = {
      ...state,
      hearts: newHearts,
      lastHeartLostAt: newLastLost,
    };
    saveAppState(newState);
    return newState;
  }

  return state;
}

export function getNextHeartRegenSeconds(state: AppState): number {
  if (state.hearts >= state.maxHearts || !state.lastHeartLostAt) {
    return 0;
  }
  const now = Date.now();
  const lastLost = new Date(state.lastHeartLostAt).getTime();
  const elapsed = now - lastLost;
  const remainingMs = HEART_REGEN_INTERVAL_MS - (elapsed % HEART_REGEN_INTERVAL_MS);
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

export function checkStreakIntegrity(state: AppState): AppState {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!state.lastStudyDate) {
    return { ...state, lastStudyDate: todayStr, streak: 1 };
  }

  if (state.lastStudyDate === todayStr) {
    return state;
  }

  const lastDate = new Date(state.lastStudyDate);
  const today = new Date(todayStr);
  const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    return state;
  } else if (diffDays > 1) {
    const newState = {
      ...state,
      streak: 0,
    };
    saveAppState(newState);
    return newState;
  }

  return state;
}

export function recordStudySession(state: AppState): AppState {
  const todayStr = new Date().toISOString().split('T')[0];
  let newStreak = state.streak;

  if (state.lastStudyDate !== todayStr) {
    const lastDate = state.lastStudyDate ? new Date(state.lastStudyDate) : null;
    if (lastDate) {
      const today = new Date(todayStr);
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newStreak = state.streak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
  }

  const newState = {
    ...state,
    streak: newStreak,
    lastStudyDate: todayStr,
  };
  saveAppState(newState);
  return newState;
}

export function addXPAndCoins(
  state: AppState,
  earnedXP: number,
  earnedCoins: number
): { newState: AppState; leveledUp: boolean; newLevel: number; newlyUnlockedBadges: string[] } {
  let xp = state.xp + earnedXP;
  let coins = state.coins + earnedCoins;
  let level = state.level;
  let leveledUp = false;

  let requiredXP = getXpRequiredForLevel(level);
  while (xp >= requiredXP) {
    xp -= requiredXP;
    level += 1;
    leveledUp = true;
    requiredXP = getXpRequiredForLevel(level);
  }

  const userTitle = getLevelTitle(level);

  let updatedState: AppState = {
    ...state,
    xp,
    coins,
    level,
    user: {
      ...state.user,
      title: userTitle,
    },
  };

  const newlyUnlockedBadges = checkBadges(updatedState);
  if (newlyUnlockedBadges.length > 0) {
    updatedState = {
      ...updatedState,
      badges: [...updatedState.badges, ...newlyUnlockedBadges],
      unclaimedBadges: [...(updatedState.unclaimedBadges || []), ...newlyUnlockedBadges],
    };
  }

  saveAppState(updatedState);
  return { newState: updatedState, leveledUp, newLevel: level, newlyUnlockedBadges };
}

export function checkBadges(state: AppState): string[] {
  const unlocked: string[] = [];
  const currentBadges = new Set(state.badges);
  const totalCorrect = Object.values(state.topicProgress).reduce((acc, curr) => acc + curr.correct, 0);

  if (!currentBadges.has('first_steps') && totalCorrect >= 1) {
    unlocked.push('first_steps');
  }

  if (!currentBadges.has('on_fire_7') && state.streak >= 7) {
    unlocked.push('on_fire_7');
  }

  if (!currentBadges.has('coin_collector') && state.coins >= 100) {
    unlocked.push('coin_collector');
  }

  if (!currentBadges.has('level_10') && state.level >= 10) {
    unlocked.push('level_10');
  }

  const voiceProgress = state.topicProgress['changing_sentences'];
  if (!currentBadges.has('voice_master') && voiceProgress && voiceProgress.mastery >= 90) {
    unlocked.push('voice_master');
  }

  const totalAttempts = Object.values(state.topicProgress).reduce((acc, curr) => acc + curr.attempts, 0);
  if (!currentBadges.has('bookworm') && totalAttempts >= 50) {
    unlocked.push('bookworm');
  }

  const hour = new Date().getHours();
  if (!currentBadges.has('early_bird') && hour >= 5 && hour < 8 && totalCorrect > 0) {
    unlocked.push('early_bird');
  }
  if (!currentBadges.has('night_owl') && (hour >= 23 || hour < 4) && totalCorrect > 0) {
    unlocked.push('night_owl');
  }

  return unlocked;
}

export function recordQuestionResult(
  state: AppState,
  questionId: string,
  topicId: string,
  isCorrect: boolean,
  subModuleId?: string
): AppState {
  const topicProg = state.topicProgress[topicId] || {
    unlocked: true,
    completedLessons: [],
    bestScores: {},
    attempts: 0,
    correct: 0,
    wrong: 0,
    mastery: 0,
    subModules: {},
  };

  const attempts = topicProg.attempts + 1;
  const correct = topicProg.correct + (isCorrect ? 1 : 0);
  const wrong = topicProg.wrong + (isCorrect ? 0 : 1);
  const mastery = Math.min(100, Math.round((correct / Math.max(1, attempts)) * 100));

  const updatedSubModules = { ...(topicProg.subModules || {}) };
  if (subModuleId) {
    const prevSub = updatedSubModules[subModuleId] || {
      attempts: 0,
      correct: 0,
      wrong: 0,
      mastery: 0,
    };
    const subAttempts = prevSub.attempts + 1;
    const subCorrect = prevSub.correct + (isCorrect ? 1 : 0);
    const subWrong = prevSub.wrong + (isCorrect ? 0 : 1);
    const subMastery = Math.min(100, Math.round((subCorrect / Math.max(1, subAttempts)) * 100));

    updatedSubModules[subModuleId] = {
      attempts: subAttempts,
      correct: subCorrect,
      wrong: subWrong,
      mastery: subMastery,
    };
  }

  let wrongPool = [...state.wrongQuestionReviewPool];
  if (!isCorrect) {
    if (!wrongPool.includes(questionId)) {
      wrongPool.push(questionId);
    }
  } else {
    wrongPool = wrongPool.filter((id) => id !== questionId);
  }

  let hearts = state.hearts;
  let lastHeartLostAt = state.lastHeartLostAt;

  if (!isCorrect) {
    hearts = Math.max(0, state.hearts - 1);
    if (lastHeartLostAt === null || hearts === state.maxHearts - 1) {
      lastHeartLostAt = new Date().toISOString();
    }
  }

  const newState: AppState = {
    ...state,
    hearts,
    lastHeartLostAt,
    wrongQuestionReviewPool: wrongPool,
    topicProgress: {
      ...state.topicProgress,
      [topicId]: {
        ...topicProg,
        attempts,
        correct,
        wrong,
        mastery,
        subModules: updatedSubModules,
      },
    },
  };

  saveAppState(newState);
  return newState;
}

export function toggleBookmarkQuestion(state: AppState, questionId: string): AppState {
  const exists = state.bookmarkedQuestionIds.includes(questionId);
  const updated = exists
    ? state.bookmarkedQuestionIds.filter((id) => id !== questionId)
    : [...state.bookmarkedQuestionIds, questionId];

  const newState = {
    ...state,
    bookmarkedQuestionIds: updated,
  };
  saveAppState(newState);
  return newState;
}

export function exportStateAsJSON(state: AppState): AppState {
  const nowStr = new Date().toISOString();
  const dateTag = nowStr.split('T')[0];
  const updatedState: AppState = {
    ...state,
    lastBackupAt: nowStr,
  };
  saveAppState(updatedState);

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(updatedState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `hsc-grammar-quest-backup-${dateTag}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  return updatedState;
}

export function importStateFromJSON(jsonString: string): AppState | null {
  try {
    const parsed = JSON.parse(jsonString) as AppState;
    if (parsed && typeof parsed.xp === 'number' && parsed.topicProgress) {
      saveAppState(parsed);
      return parsed;
    }
    return null;
  } catch (e) {
    console.error('Invalid JSON import:', e);
    return null;
  }
}
