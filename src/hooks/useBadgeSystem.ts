// src/hooks/useBadgeSystem.ts

import { useState, useEffect, useCallback } from 'react';
import { 
  Badge, 
  UserStats, 
  checkBadgeEligibility, 
  calculateTotalPoints, 
  getUserLevel,
  getAllBadges 
} from '../utils/rewardBadges';

interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  lastCompleted: string | null;
  completions: Array<{ date: string; completedAt: string }>;
}

interface Goal {
  id: string;
  title: string;
  category: string;
  isCompleted: boolean;
  completedAt?: string;
}

interface UseBadgeSystemProps {
  habits: Habit[];
  goals: Goal[];
}

export function useBadgeSystem({ habits, goals }: UseBadgeSystemProps) {
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // Calculate user statistics
  const calculateUserStats = useCallback((): UserStats => {
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completions.length, 0);
    
    const currentStreaks: Record<string, number> = {};
    const maxStreaks: Record<string, number> = {};
    habits.forEach(habit => {
      currentStreaks[habit.id] = habit.streak;
      maxStreaks[habit.id] = Math.max(habit.streak, maxStreaks[habit.id] || 0);
    });

    const habitsPerCategory: Record<string, number> = {};
    const categoriesWithHabits: string[] = [];
    habits.forEach(habit => {
      habitsPerCategory[habit.category] = (habitsPerCategory[habit.category] || 0) + habit.completions.length;
      if (!categoriesWithHabits.includes(habit.category)) {
        categoriesWithHabits.push(habit.category);
      }
    });

    const completedGoals = goals.filter(goal => goal.isCompleted).length;

    // Calculate time-based completions
    let earlyMorningCompletions = 0;
    let lateEveningCompletions = 0;
    let weekendCompletions = 0;

    habits.forEach(habit => {
      habit.completions.forEach(completion => {
        const completedAt = new Date(completion.completedAt);
        const hour = completedAt.getHours();
        const dayOfWeek = completedAt.getDay();

        if (hour < 8) earlyMorningCompletions++;
        if (hour >= 22) lateEveningCompletions++;
        if (dayOfWeek === 0 || dayOfWeek === 6) weekendCompletions++;
      });
    });

    // Calculate perfect weeks (simplified)
    const perfectWeeks = Math.floor(totalCompletions / (habits.length * 7));

    // Calculate comebacks (simplified)
    const comebacks = habits.reduce((total, habit) => {
      return total + (habit.streak > 0 ? 1 : 0);
    }, 0);

    return {
      totalCompletions,
      currentStreaks,
      maxStreaks,
      habitsPerCategory,
      completedGoals,
      earlyMorningCompletions,
      lateEveningCompletions,
      weekendCompletions,
      perfectWeeks,
      comebacks,
      totalHabits: habits.length,
      categoriesWithHabits,
      lastMissedDays: 0
    };
  }, [habits, goals]);

  // Check for new badges
  const checkForNewBadges = useCallback(() => {
    if (!userStats) return;

    const newlyEarnedBadges = checkBadgeEligibility(userStats, earnedBadges);
    
    if (newlyEarnedBadges.length > 0) {
      console.log('New badges earned:', newlyEarnedBadges);
      setNewBadges(prev => [...prev, ...newlyEarnedBadges]);
      setEarnedBadges(prev => [...prev, ...newlyEarnedBadges.map(b => b.id)]);
      
      // Store in localStorage
      const updatedEarnedBadges = [...earnedBadges, ...newlyEarnedBadges.map(b => b.id)];
      localStorage.setItem('earnedBadges', JSON.stringify(updatedEarnedBadges));
    }
  }, [userStats, earnedBadges]);

  // Initialize badge system
  useEffect(() => {
    // Load earned badges from localStorage
    const savedBadges = localStorage.getItem('earnedBadges');
    if (savedBadges) {
      try {
        setEarnedBadges(JSON.parse(savedBadges));
      } catch (e) {
        console.error('Error loading saved badges:', e);
      }
    }
  }, []);

  // Update user stats when habits/goals change
  useEffect(() => {
    const stats = calculateUserStats();
    setUserStats(stats);
  }, [calculateUserStats]);

  // Check for new badges when stats change
  useEffect(() => {
    if (userStats && earnedBadges.length >= 0) {
      checkForNewBadges();
    }
  }, [userStats, checkForNewBadges]);

  const totalPoints = calculateTotalPoints(earnedBadges);
  const userLevel = getUserLevel(totalPoints);
  const allBadges = getAllBadges();
  const recentBadges = newBadges.slice(-3);

  const dismissNewBadge = (badgeId: string) => {
    setNewBadges(prev => prev.filter(badge => badge.id !== badgeId));
  };

  const dismissAllNewBadges = () => {
    setNewBadges([]);
  };

  return {
    earnedBadges,
    newBadges,
    userStats: userStats || calculateUserStats(),
    totalPoints,
    userLevel,
    recentBadges,
    allBadges,
    dismissNewBadge,
    dismissAllNewBadges,
    checkForNewBadges
  };
}