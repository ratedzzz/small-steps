// src/components/DailyQuoteWidget.tsx - Clean Version

import React, { useState, useEffect } from 'react';
import { 
  generateDailyQuote, 
  detectUserStruggle, 
  detectUserSuccess, 
  getCurrentTimeContext,
  PersonalizedQuote 
} from '../utils/dailyQuotes';

interface DailyQuoteWidgetProps {
  habits: Array<{
    id?: string;
    title?: string;
    category?: string;
    streak?: number;
    lastCompleted?: string | null;
  }>;
  goals: Array<{
    id?: string;
    title?: string;
    category?: string;
    targetDate?: string;
    isCompleted?: boolean;
  }>;
  className?: string;
}

export function DailyQuoteWidget({ habits, goals, className = '' }: DailyQuoteWidgetProps) {
  const [currentQuote, setCurrentQuote] = useState<PersonalizedQuote | null>(null);

  useEffect(() => {
    // Provide default values for optional properties
    const safeHabits = habits.map(habit => ({
      title: habit.title || 'Untitled Habit',
      category: habit.category || 'General',
      streak: habit.streak || 0,
      lastCompleted: habit.lastCompleted || null
    }));

    const safeGoals = goals.map(goal => ({
      title: goal.title || 'Untitled Goal',
      category: goal.category || 'General',
      targetDate: goal.targetDate || '2025-12-31',
      isCompleted: goal.isCompleted || false
    }));

    const userContext = {
      habits: safeHabits,
      goals: safeGoals,
      timeOfDay: getCurrentTimeContext(),
      recentStruggle: detectUserStruggle(safeHabits),
      recentSuccess: detectUserSuccess(safeHabits)
    };

    const quote = generateDailyQuote(userContext);
    setCurrentQuote(quote);
  }, [habits, goals]);

  const getMoodGradient = (mood: string) => {
    switch (mood) {
      case 'energizing': return 'from-orange-400 to-pink-500';
      case 'calming': return 'from-blue-400 to-purple-500';
      case 'motivational': return 'from-red-500 to-orange-500';
      case 'inspirational': return 'from-purple-500 to-indigo-600';
      case 'reflective': return 'from-green-400 to-blue-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (!currentQuote) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-32 flex items-center justify-center">
            <div className="text-white text-lg">Loading inspiration...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className={`bg-gradient-to-br ${getMoodGradient(currentQuote.mood)} p-4 text-white relative overflow-hidden`}>
        
        {/* Centered Title */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-medium">Daily Inspiration Quote</h2>
        </div>

        {/* Left-aligned Quote */}
        <div className="text-left">
          <p className="text-base md:text-lg font-medium leading-relaxed mb-3">
            {currentQuote.text}
          </p>
          <p className="text-sm opacity-90">— {currentQuote.author}</p>
        </div>
      </div>


    </div>
  );
}