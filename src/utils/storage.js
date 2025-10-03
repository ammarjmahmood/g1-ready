import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  QUIZ_STATS: 'quizStats',
  USER_PREFERENCES: 'userPreferences',
};

export const saveQuizResult = async (result) => {
  try {
    const existingStats = await getQuizStats();
    const newStats = {
      ...existingStats,
      totalQuizzes: existingStats.totalQuizzes + 1,
      recentQuizzes: [
        {
          score: result.score,
          correct: result.correct,
          total: result.total,
          type: result.type,
          date: new Date().toLocaleDateString(),
        },
        ...existingStats.recentQuizzes.slice(0, 9)
      ],
    };

    const allScores = newStats.recentQuizzes.map(quiz => quiz.score);
    newStats.averageScore = Math.round(
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    );
    newStats.bestScore = Math.max(...allScores, existingStats.bestScore);

    if (result.type === 'signs') {
      newStats.signsPracticed += result.total;
    } else if (result.type === 'theory') {
      newStats.theoryPracticed += result.total;
    } else {
      newStats.signsPracticed += Math.floor(result.total / 2);
      newStats.theoryPracticed += Math.floor(result.total / 2);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_STATS, JSON.stringify(newStats));
    return newStats;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return null;
  }
};

export const getQuizStats = async () => {
  try {
    const stats = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_STATS);
    if (stats) {
      return JSON.parse(stats);
    }
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      recentQuizzes: [],
      signsPracticed: 0,
      theoryPracticed: 0,
    };
  } catch (error) {
    console.error('Error getting quiz stats:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      recentQuizzes: [],
      signsPracticed: 0,
      theoryPracticed: 0,
    };
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.QUIZ_STATS,
      STORAGE_KEYS.USER_PREFERENCES,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export const saveUserPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    );
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
};

export const getUserPreferences = async () => {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (preferences) {
      return JSON.parse(preferences);
    }
    return {
      soundEnabled: true,
      vibrationEnabled: true,
      darkMode: false,
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return {
      soundEnabled: true,
      vibrationEnabled: true,
      darkMode: false,
    };
  }
};