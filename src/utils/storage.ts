import { AppState, TopicProgressItem, SubModuleProgressItem } from '../types';
import { TOPICS_DATA } from '../data/topics';
import { getLevelTitle, getXpRequiredForLevel, ALL_BADGES } from '../data/badges';

const STORAGE_KEY = 'hscGrammarQuest_v1';
const HEART_REGEN_INTERVAL_MS = 60 * 1000; // 1 minute per heart in v3

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
    version: 3,
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
    diamonds: 10,
    hearts: 20,
    maxHearts: 20,
    lastHeartLostAt: null,
    lastAdWatchedAt: null,
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

    // Migrate v2 / missing fields to v3
    if (parsed.version === undefined || parsed.version < 3) {
      parsed.version = 3;
      parsed.maxHearts = 20;
      if (parsed.hearts === undefined || parsed.hearts < 20) {
        parsed.hearts = Math.max(parsed.hearts || 0, 20);
      }
      if (parsed.diamonds === undefined) {
        parsed.diamonds = parsed.coins || 10;
      }
      if (parsed.lastAdWatchedAt === undefined) {
        parsed.lastAdWatchedAt = null;
      }
    }

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

    if (parsed.diamonds === undefined) {
      parsed.diamonds = 10;
    }
    if (parsed.maxHearts === undefined) {
      parsed.maxHearts = 20;
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
  const maxHearts = state.maxHearts || 20;
  if (state.hearts >= maxHearts || !state.lastHeartLostAt) {
    return state;
  }

  const now = Date.now();
  const lastLost = new Date(state.lastHeartLostAt).getTime();
  const elapsed = now - lastLost;

  if (elapsed >= HEART_REGEN_INTERVAL_MS) {
    const heartsToAdd = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);
    const newHearts = Math.min(maxHearts, state.hearts + heartsToAdd);

    let newLastLost: string | null = null;
    if (newHearts < maxHearts) {
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
  const maxHearts = state.maxHearts || 20;
  if (state.hearts >= maxHearts || !state.lastHeartLostAt) {
    return 0;
  }
  const now = Date.now();
  const lastLost = new Date(state.lastHeartLostAt).getTime();
  const elapsed = now - lastLost;
  const remainingMs = HEART_REGEN_INTERVAL_MS - (elapsed % HEART_REGEN_INTERVAL_MS);
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

export function tradeDiamondsForHearts(
  state: AppState,
  heartsToBuy: number
): { success: boolean; newState: AppState; message: string } {
  const costInDiamonds = Math.ceil(heartsToBuy / 5);
  if (state.diamonds < costInDiamonds) {
    return {
      success: false,
      newState: state,
      message: `Not enough diamonds! You need ${costInDiamonds} 💎 for ${heartsToBuy} ❤️.`,
    };
  }

  const newDiamonds = state.diamonds - costInDiamonds;
  const maxHearts = state.maxHearts || 20;
  const newHearts = Math.min(maxHearts, state.hearts + heartsToBuy);
  const newLastLost = newHearts >= maxHearts ? null : state.lastHeartLostAt;

  const updated: AppState = {
    ...state,
    diamonds: newDiamonds,
    hearts: newHearts,
    lastHeartLostAt: newLastLost,
  };
  saveAppState(updated);
  return {
    success: true,
    newState: updated,
    message: `Successfully refilled +${heartsToBuy} hearts for ${costInDiamonds} 💎!`,
  };
}

export function rewardMockAdWatch(state: AppState): { success: boolean; newState: AppState; message: string } {
  const now = Date.now();
  if (state.lastAdWatchedAt) {
    const elapsed = now - new Date(state.lastAdWatchedAt).getTime();
    const cooldownMs = 10 * 60 * 1000; // 10 min cooldown
    if (elapsed < cooldownMs) {
      const remainingMins = Math.ceil((cooldownMs - elapsed) / 60000);
      return {
        success: false,
        newState: state,
        message: `Ad reward cooldown active. Please wait ${remainingMins} minute(s).`,
      };
    }
  }

  const maxHearts = state.maxHearts || 20;
  const newHearts = Math.min(maxHearts, state.hearts + 5);
  const updated: AppState = {
    ...state,
    hearts: newHearts,
    lastHeartLostAt: newHearts >= maxHearts ? null : state.lastHeartLostAt,
    lastAdWatchedAt: new Date().toISOString(),
  };
  saveAppState(updated);
  return {
    success: true,
    newState: updated,
    message: `+5 Hearts unlocked from sponsor reward! ❤️`,
  };
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
  earnedCoins: number,
  earnedDiamonds: number = 0
): { newState: AppState; leveledUp: boolean; newLevel: number; newlyUnlockedBadges: string[] } {
  let xp = state.xp + earnedXP;
  let coins = state.coins + earnedCoins;
  let diamonds = (state.diamonds || 0) + earnedDiamonds;
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
    diamonds,
    level,
    user: {
      ...state.user,
      title: userTitle,
    },
  };

  const newlyUnlockedBadges = checkBadges(updatedState);
  if (newlyUnlockedBadges.length > 0) {
    // Award 10 bonus diamonds for each unlocked badge
    updatedState = {
      ...updatedState,
      diamonds: updatedState.diamonds + newlyUnlockedBadges.length * 10,
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
  const maxHearts = state.maxHearts || 20;

  if (!isCorrect) {
    hearts = Math.max(0, state.hearts - 1);
    if (lastHeartLostAt === null || hearts === maxHearts - 1) {
      lastHeartLostAt = new Date().toISOString();
    }
  }

  // Award 1 Diamond on correct answer
  const diamonds = (state.diamonds || 0) + (isCorrect ? 1 : 0);

  const newState: AppState = {
    ...state,
    hearts,
    diamonds,
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
