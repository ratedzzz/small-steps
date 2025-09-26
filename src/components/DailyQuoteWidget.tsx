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

  const getMoodStyle = (mood: string) => {
  switch (mood) {
    case 'energizing': 
      return { background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' }; // Orange gradient
    case 'calming': 
      return { background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)' }; // Blue gradient  
    case 'motivational': 
      return { background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)' }; // Pink gradient
    case 'inspirational': 
      return { background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' }; // Purple gradient
    case 'reflective': 
      return { background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)' }; // Teal gradient
    default: 
      return { background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }; // Default lighter purple
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
    <div 
      className="p-4 text-white relative overflow-hidden"
      style={getMoodStyle(currentQuote.mood)}
    >
      
      {/* Centered Title with left padding */}
      <div className="text-center mb-4" style={{ marginLeft: '20px' }}>
        <h2 className="text-lg font-medium">Daily Inspiration Quote</h2>
      </div>

      {/* Left-aligned Quote with left padding */}
      <div 
        className="text-left"
        style={{ marginLeft: '20px' }}
      >
        <p className="text-base md:text-lg font-medium leading-relaxed mb-3">
          {currentQuote.text}
        </p>
        <p className="text-sm opacity-90">— {currentQuote.author}</p>
      </div>
    </div>
  </div>
);
}