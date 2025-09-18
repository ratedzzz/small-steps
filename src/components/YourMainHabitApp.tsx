// src/components/YourMainHabitApp.tsx

import React, { useState } from 'react';

// Import the badge system
import { useBadgeSystem } from '../hooks/useBadgeSystem';
import { BadgeGallery, BadgeSummaryWidget, NewBadgeNotification } from '../components/BadgeDisplay';

// Import the quote system
import { DailyQuote } from '../components/DailyQuote';
import { DailyQuoteWidget } from '../components/DailyQuoteWidget';
import { Badge } from '../utils/rewardBadges';

// Define proper types
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
  targetDate: string;
  completedAt?: string;
}

function YourMainHabitApp() {
  // Fixed habits state with proper typing
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      title: 'Exercise 30 minutes',
      category: 'Health & Fitness',
      streak: 0,
      lastCompleted: null,
      completions: []
    },
    {
      id: '2', 
      title: 'Read for 20 minutes',
      category: 'Personal Development',
      streak: 0,
      lastCompleted: null,
      completions: []
    },
    {
      id: '3',
      title: 'Meditate 10 minutes',
      category: 'Self-Care', 
      streak: 0,
      lastCompleted: null,
      completions: []
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Build consistent habits',
      category: 'Personal Development',
      isCompleted: false,
      targetDate: '2025-12-31'
    }
  ]);

  // Badge system with proper types
  const {
    earnedBadges,
    newBadges, 
    userStats,
    totalPoints,
    userLevel,
    recentBadges,
    dismissNewBadge,
    checkForNewBadges
  } = useBadgeSystem({ habits, goals });

  // State for modals
  const [showBadgeGallery, setShowBadgeGallery] = useState(false);
  const [showFullQuote, setShowFullQuote] = useState(false);

  // Fixed completeHabit function
  const completeHabit = (habitId: string) => {
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          // Check if already completed today
          const alreadyCompletedToday = habit.completions.some(
            completion => completion.date === today
          );
          
          if (alreadyCompletedToday) {
            alert('Already completed today!');
            return habit;
          }
          
          const newCompletion = {
            date: today,
            completedAt: now
          };
          
          return {
            ...habit,
            streak: habit.streak + 1,
            lastCompleted: now,
            completions: [...habit.completions, newCompletion]
          };
        }
        return habit;
      })
    );
    
    // Trigger badge check after state update
    setTimeout(() => {
      checkForNewBadges();
    }, 200);
  };

  // Check if habit was completed today
  const isCompletedToday = (habit: Habit): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completions.some(completion => completion.date === today);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Badge Notifications - Fixed positioning */}
      <div className="fixed right-4 top-4 z-50 space-y-4">
        {newBadges.map((badge: Badge, index: number) => (
          <div key={badge.id}>
            <NewBadgeNotification
              badge={badge}
              onClose={() => dismissNewBadge(badge.id)}
              onViewCollection={() => {
                setShowBadgeGallery(true);
                dismissNewBadge(badge.id);
              }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Habit Tracker</h1>
          <p className="text-gray-600">Build better habits, earn badges, get daily inspiration!</p>
          
          {/* Show level and points */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Level {userLevel.level} - {userLevel.title}
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              {totalPoints} Points
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {earnedBadges.length} Badges
            </span>
          </div>
        </div>

        {/* Daily Quote Section */}
        <div className="mb-8">
          <DailyQuoteWidget 
            habits={habits}
            goals={goals}
           />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Stats Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span>
              Your Progress
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {habits.reduce((total, habit) => total + habit.completions.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Completions</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.max(...habits.map(h => h.streak), 0)}
                </div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{earnedBadges.length}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{userLevel.level}</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
            </div>
          </div>

          {/* Badge Summary Widget */}
          <BadgeSummaryWidget
            earnedBadgeIds={earnedBadges}
            recentBadges={recentBadges}
            totalPoints={totalPoints}
            userLevel={userLevel}
            onViewAll={() => setShowBadgeGallery(true)}
          />
        </div>

        {/* Today's Habits */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>✅</span>
            Today's Habits
          </h3>
          
          <div className="space-y-3">
            {habits.map(habit => {
              const completedToday = isCompletedToday(habit);
              
              return (
                <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{habit.title}</span>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>🔥 {habit.streak} day streak</span>
                      <span>•</span>
                      <span>{habit.completions.length} total completions</span>
                      {completedToday && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">✓ Completed today!</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => completeHabit(habit.id)}
                    disabled={completedToday}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors ${
                      completedToday 
                        ? 'bg-green-500 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                    }`}
                  >
                    ✓
                  </button>
                </div>
              );
            })}
          </div>

          {/* Progress toward next badge */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Milestone</h4>
            <p className="text-sm text-blue-800">
              Complete {3 - Math.max(...habits.map(h => h.streak), 0)} more days in a row to earn the "Getting Started" badge! 🔥
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowBadgeGallery(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>🏆</span>
            Badge Collection ({earnedBadges.length})
          </button>
          
          <button
            onClick={() => setShowFullQuote(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <span>💬</span>
            Today's Quote
          </button>

          {newBadges.length > 0 && (
            <button
              onClick={() => newBadges.forEach((badge: Badge) => dismissNewBadge(badge.id))}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Notifications ({newBadges.length})
            </button>
          )}
        </div>
      </div>

      {/* Badge Gallery Modal */}
      {showBadgeGallery && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div className="h-full overflow-y-auto">
            <div className="min-h-full flex items-start justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl my-8">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Badge Collection</h2>
                  <button
                    onClick={() => setShowBadgeGallery(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                  <BadgeGallery
                    earnedBadgeIds={earnedBadges}
                    userStats={userStats}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Quote Modal */}
      {showFullQuote && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Today's Inspiration</h2>
              <button
                onClick={() => setShowFullQuote(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <DailyQuote 
                habits={habits}
                goals={goals}
                className="shadow-none border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YourMainHabitApp;