// src/utils/rewardBadges.ts

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'consistency' | 'milestone' | 'variety' | 'special' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: {
    type: 'streak' | 'total_completions' | 'consecutive_days' | 'habit_count' | 'goal_completion' | 'perfect_week' | 'comeback' | 'early_bird' | 'night_owl' | 'weekend_warrior' | 'variety' | 'custom';
    value: number;
    habitCategory?: string;
    timeFrame?: 'day' | 'week' | 'month' | 'year' | 'all_time';
  };
  points: number;
  unlockedAt?: string;
  progress?: number; // 0-100 percentage
}

export interface UserAchievement {
  badgeId: string;
  unlockedAt: string;
  progress: number;
  isNew: boolean;
}

// Comprehensive badge definitions
const BADGES_DATABASE: Badge[] = [
  // Streak Badges
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first habit!',
    icon: '👶',
    category: 'milestone',
    rarity: 'common',
    criteria: { type: 'total_completions', value: 1 },
    points: 10
  },
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    criteria: { type: 'streak', value: 3 },
    points: 25
  },
  {
    id: 'streak_7',
    name: 'One Week Wonder',
    description: 'Maintain a 7-day streak',
    icon: '🌟',
    category: 'streak',
    rarity: 'common',
    criteria: { type: 'streak', value: 7 },
    points: 50
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    category: 'streak',
    rarity: 'rare',
    criteria: { type: 'streak', value: 30 },
    points: 200
  },
  {
    id: 'streak_100',
    name: 'Centurion',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    category: 'streak',
    rarity: 'epic',
    criteria: { type: 'streak', value: 100 },
    points: 500
  },
  {
    id: 'streak_365',
    name: 'Year-Long Legend',
    description: 'Maintain a 365-day streak',
    icon: '🌈',
    category: 'streak',
    rarity: 'legendary',
    criteria: { type: 'streak', value: 365 },
    points: 1000
  },

  // Consistency Badges
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 consecutive days',
    icon: '✨',
    category: 'consistency',
    rarity: 'rare',
    criteria: { type: 'perfect_week', value: 7 },
    points: 100
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Get back on track after missing 3+ days',
    icon: '💪',
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'comeback', value: 3 },
    points: 75
  },

  // Milestone Badges
  {
    id: 'completions_50',
    name: 'Half Century',
    description: 'Complete 50 total habits',
    icon: '🎯',
    category: 'milestone',
    rarity: 'common',
    criteria: { type: 'total_completions', value: 50 },
    points: 100
  },
  {
    id: 'completions_250',
    name: 'Quarter Master',
    description: 'Complete 250 total habits',
    icon: '🏅',
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'total_completions', value: 250 },
    points: 300
  },
  {
    id: 'completions_1000',
    name: 'Thousand Club',
    description: 'Complete 1000 total habits',
    icon: '💎',
    category: 'milestone',
    rarity: 'epic',
    criteria: { type: 'total_completions', value: 1000 },
    points: 750
  },

  // Time-based Badges
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete habits before 8 AM for 7 days',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'early_bird', value: 7 },
    points: 100
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete habits after 10 PM for 7 days',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'night_owl', value: 7 },
    points: 100
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complete habits on weekends for 4 consecutive weeks',
    icon: '⚔️',
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'weekend_warrior', value: 4 },
    points: 150
  },

  // Variety Badges
  {
    id: 'habit_collector',
    name: 'Habit Collector',
    description: 'Create 5 different habits',
    icon: '📚',
    category: 'variety',
    rarity: 'common',
    criteria: { type: 'habit_count', value: 5 },
    points: 75
  },
  {
    id: 'well_rounded',
    name: 'Well Rounded',
    description: 'Have habits in 3 different categories',
    icon: '🌍',
    category: 'variety',
    rarity: 'rare',
    criteria: { type: 'variety', value: 3 },
    points: 125
  },

  // Category-specific Badges
  {
    id: 'fitness_fanatic',
    name: 'Fitness Fanatic',
    description: 'Complete 30 fitness habits',
    icon: '💪',
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'total_completions', value: 30, habitCategory: 'Health & Fitness' },
    points: 150
  },
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Complete 50 learning habits',
    icon: '📖',
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'total_completions', value: 50, habitCategory: 'Personal Development' },
    points: 150
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Complete 30 mindfulness habits',
    icon: '🧘',
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'total_completions', value: 30, habitCategory: 'Self-Care' },
    points: 150
  },

  // Goal-related Badges
  {
    id: 'goal_achiever',
    name: 'Goal Achiever',
    description: 'Complete your first goal',
    icon: '🎉',
    category: 'milestone',
    rarity: 'rare',
    criteria: { type: 'goal_completion', value: 1 },
    points: 200
  },
  {
    id: 'serial_achiever',
    name: 'Serial Achiever',
    description: 'Complete 5 goals',
    icon: '🏆',
    category: 'milestone',
    rarity: 'epic',
    criteria: { type: 'goal_completion', value: 5 },
    points: 500
  },

  // Special Achievement Badges
  {
    id: 'new_year_new_me',
    name: 'New Year, New Me',
    description: 'Start a habit in January',
    icon: '🎊',
    category: 'special',
    rarity: 'common',
    criteria: { type: 'custom', value: 1 },
    points: 50
  },
  {
    id: 'summer_consistency',
    name: 'Summer Consistency',
    description: 'Maintain habits through summer months',
    icon: '☀️',
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'custom', value: 1 },
    points: 150
  }
];

// User statistics interface
export interface UserStats {
  totalCompletions: number;
  currentStreaks: Record<string, number>; // habitId -> streak count
  maxStreaks: Record<string, number>; // habitId -> max streak achieved
  habitsPerCategory: Record<string, number>;
  completedGoals: number;
  earlyMorningCompletions: number; // before 8 AM
  lateEveningCompletions: number; // after 10 PM
  weekendCompletions: number;
  perfectWeeks: number;
  comebacks: number;
  totalHabits: number;
  categoriesWithHabits: string[];
  lastMissedDays: number; // consecutive days missed recently
}

export function checkBadgeEligibility(stats: UserStats, existingBadges: string[]): Badge[] {
  const newBadges: Badge[] = [];

  BADGES_DATABASE.forEach(badge => {
    // Skip if already earned
    if (existingBadges.includes(badge.id)) return;

    let isEligible = false;

    switch (badge.criteria.type) {
      case 'total_completions':
        if (badge.criteria.habitCategory) {
          // Category-specific completions
          const categoryCount = stats.habitsPerCategory[badge.criteria.habitCategory] || 0;
          isEligible = categoryCount >= badge.criteria.value;
        } else {
          // Total completions across all habits
          isEligible = stats.totalCompletions >= badge.criteria.value;
        }
        break;

      case 'streak':
        // Check if any habit has achieved the required streak
        const maxCurrentStreak = Math.max(...Object.values(stats.currentStreaks), 0);
        isEligible = maxCurrentStreak >= badge.criteria.value;
        break;

      case 'habit_count':
        isEligible = stats.totalHabits >= badge.criteria.value;
        break;

      case 'goal_completion':
        isEligible = stats.completedGoals >= badge.criteria.value;
        break;

      case 'perfect_week':
        isEligible = stats.perfectWeeks >= badge.criteria.value;
        break;

      case 'comeback':
        isEligible = stats.comebacks >= badge.criteria.value;
        break;

      case 'early_bird':
        isEligible = stats.earlyMorningCompletions >= badge.criteria.value;
        break;

      case 'night_owl':
        isEligible = stats.lateEveningCompletions >= badge.criteria.value;
        break;

      case 'weekend_warrior':
        isEligible = stats.weekendCompletions >= badge.criteria.value;
        break;

      case 'variety':
        isEligible = stats.categoriesWithHabits.length >= badge.criteria.value;
        break;

      case 'custom':
        // Handle special badges with custom logic
        isEligible = checkCustomBadgeCriteria(badge.id, stats);
        break;
    }

    if (isEligible) {
      newBadges.push({
        ...badge,
        unlockedAt: new Date().toISOString()
      });
    }
  });

  return newBadges;
}

function checkCustomBadgeCriteria(badgeId: string, stats: UserStats): boolean {
  const now = new Date();
  
  switch (badgeId) {
    case 'new_year_new_me':
      // Check if user started any habit in January
      return now.getMonth() === 0 && stats.totalHabits > 0;
    
    case 'summer_consistency':
      // Check if user maintained habits during summer (June-August)
      const month = now.getMonth();
      return month >= 5 && month <= 7 && stats.totalCompletions > 30;
    
    default:
      return false;
  }
}

export function calculateBadgeProgress(badge: Badge, stats: UserStats): number {
  let current = 0;
  const target = badge.criteria.value;

  switch (badge.criteria.type) {
    case 'total_completions':
      if (badge.criteria.habitCategory) {
        current = stats.habitsPerCategory[badge.criteria.habitCategory] || 0;
      } else {
        current = stats.totalCompletions;
      }
      break;

    case 'streak':
      current = Math.max(...Object.values(stats.currentStreaks), 0);
      break;

    case 'habit_count':
      current = stats.totalHabits;
      break;

    case 'goal_completion':
      current = stats.completedGoals;
      break;

    case 'perfect_week':
      current = stats.perfectWeeks;
      break;

    case 'comeback':
      current = stats.comebacks;
      break;

    case 'early_bird':
      current = stats.earlyMorningCompletions;
      break;

    case 'night_owl':
      current = stats.lateEveningCompletions;
      break;

    case 'weekend_warrior':
      current = stats.weekendCompletions;
      break;

    case 'variety':
      current = stats.categoriesWithHabits.length;
      break;
  }

  return Math.min(100, (current / target) * 100);
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getRarityGradient(rarity: string): string {
  switch (rarity) {
    case 'common': return 'from-gray-400 to-gray-600';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-yellow-600';
    default: return 'from-gray-400 to-gray-600';
  }
}

// Get all available badges for display
export function getAllBadges(): Badge[] {
  return BADGES_DATABASE;
}

// Get badges by category
export function getBadgesByCategory(category: string): Badge[] {
  return BADGES_DATABASE.filter(badge => badge.category === category);
}

// Get user's total points from earned badges
export function calculateTotalPoints(earnedBadgeIds: string[]): number {
  return BADGES_DATABASE
    .filter(badge => earnedBadgeIds.includes(badge.id))
    .reduce((total, badge) => total + badge.points, 0);
}

// Determine user level based on points
export function getUserLevel(totalPoints: number): { level: number; title: string; nextLevelPoints: number } {
  const levels = [
    { min: 0, title: 'Beginner' },
    { min: 100, title: 'Novice' },
    { min: 300, title: 'Apprentice' },
    { min: 600, title: 'Practitioner' },
    { min: 1000, title: 'Expert' },
    { min: 1500, title: 'Master' },
    { min: 2500, title: 'Grand Master' },
    { min: 4000, title: 'Legend' }
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (totalPoints >= levels[i].min) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || { min: Infinity, title: 'Max Level' };
    } else {
      break;
    }
  }

  return {
    level: levels.indexOf(currentLevel) + 1,
    title: currentLevel.title,
    nextLevelPoints: nextLevel.min
  };
}