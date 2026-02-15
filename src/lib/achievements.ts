export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'vocabulary' | 'social' | 'mastery';
  requirement: number;
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Learning achievements
  {
    id: 'first_lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎓',
    category: 'learning',
    requirement: 1,
    xpReward: 50,
  },
  {
    id: 'ten_lessons',
    name: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '📚',
    category: 'learning',
    requirement: 10,
    xpReward: 200,
  },
  {
    id: 'fifty_lessons',
    name: 'Knowledge Seeker',
    description: 'Complete 50 lessons',
    icon: '🎖️',
    category: 'learning',
    requirement: 50,
    xpReward: 500,
  },

  // Streak achievements
  {
    id: 'three_day_streak',
    name: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    xpReward: 100,
  },
  {
    id: 'seven_day_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '💪',
    category: 'streak',
    requirement: 7,
    xpReward: 250,
  },
  {
    id: 'thirty_day_streak',
    name: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    icon: '⚡',
    category: 'streak',
    requirement: 30,
    xpReward: 1000,
  },
  {
    id: 'hundred_day_streak',
    name: 'Legend',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    category: 'streak',
    requirement: 100,
    xpReward: 5000,
  },

  // Vocabulary achievements
  {
    id: 'first_word',
    name: 'Word Collector',
    description: 'Learn your first word',
    icon: '📝',
    category: 'vocabulary',
    requirement: 1,
    xpReward: 25,
  },
  {
    id: 'fifty_words',
    name: 'Vocabulary Builder',
    description: 'Learn 50 words',
    icon: '📖',
    category: 'vocabulary',
    requirement: 50,
    xpReward: 150,
  },
  {
    id: 'two_hundred_words',
    name: 'Word Master',
    description: 'Learn 200 words',
    icon: '🏆',
    category: 'vocabulary',
    requirement: 200,
    xpReward: 500,
  },
  {
    id: 'five_hundred_words',
    name: 'Darija Expert',
    description: 'Learn 500 words',
    icon: '🌟',
    category: 'vocabulary',
    requirement: 500,
    xpReward: 1500,
  },

  // Quiz achievements
  {
    id: 'first_quiz',
    name: 'Quiz Taker',
    description: 'Complete your first quiz',
    icon: '✅',
    category: 'learning',
    requirement: 1,
    xpReward: 50,
  },
  {
    id: 'perfect_quiz',
    name: 'Perfectionist',
    description: 'Get 100% on a quiz',
    icon: '💯',
    category: 'mastery',
    requirement: 1,
    xpReward: 200,
  },
  {
    id: 'ten_quizzes',
    name: 'Quiz Champion',
    description: 'Complete 10 quizzes',
    icon: '🏅',
    category: 'learning',
    requirement: 10,
    xpReward: 300,
  },

  // Level achievements
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'mastery',
    requirement: 5,
    xpReward: 200,
  },
  {
    id: 'level_10',
    name: 'Seasoned Learner',
    description: 'Reach level 10',
    icon: '🌙',
    category: 'mastery',
    requirement: 10,
    xpReward: 500,
  },
  {
    id: 'level_25',
    name: 'Darija Master',
    description: 'Reach level 25',
    icon: '💎',
    category: 'mastery',
    requirement: 25,
    xpReward: 2000,
  },
];

export function getAchievementsForUser(userStats: {
  lessonsCompleted: number;
  quizzesCompleted: number;
  vocabularyLearned: number;
  streak: number;
  level: number;
  perfectQuizzes?: number;
}): { earned: Achievement[]; available: Achievement[] } {
  const earned: Achievement[] = [];
  const available: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    let progress = 0;

    switch (achievement.category) {
      case 'learning':
        if (achievement.id.includes('lesson')) {
          progress = userStats.lessonsCompleted;
        } else if (achievement.id.includes('quiz')) {
          progress = userStats.quizzesCompleted;
          if (achievement.id === 'perfect_quiz') {
            progress = userStats.perfectQuizzes || 0;
          }
        }
        break;
      case 'streak':
        progress = userStats.streak;
        break;
      case 'vocabulary':
        progress = userStats.vocabularyLearned;
        break;
      case 'mastery':
        if (achievement.id.includes('level')) {
          progress = userStats.level;
        } else if (achievement.id === 'perfect_quiz') {
          progress = userStats.perfectQuizzes || 0;
        }
        break;
    }

    if (progress >= achievement.requirement) {
      earned.push(achievement);
    } else {
      available.push(achievement);
    }
  }

  return { earned, available };
}

export function getNextAchievement(userStats: {
  lessonsCompleted: number;
  quizzesCompleted: number;
  vocabularyLearned: number;
  streak: number;
  level: number;
}): Achievement | null {
  const { available } = getAchievementsForUser(userStats);
  
  if (available.length === 0) return null;

  // Return the first available achievement (they're ordered by requirement)
  return available[0];
}
