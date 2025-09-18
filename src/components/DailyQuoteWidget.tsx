// src/components/DailyQuoteWidget.tsx - Mobile Optimized Version

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
    title: string;
    category: string;
    streak: number;
    lastCompleted: string | null;
  }>;
  goals: Array<{
    title: string;
    category: string;
    targetDate: string;
  }>;
  className?: string;
}

// Mobile-optimized widget version for app store apps
export function DailyQuoteWidget({ habits, goals, className = '' }: DailyQuoteWidgetProps) {
  const [currentQuote, setCurrentQuote] = useState<PersonalizedQuote | null>(null);

  useEffect(() => {
    const userContext = {
      habits,
      goals,
      timeOfDay: getCurrentTimeContext(),
      recentStruggle: detectUserStruggle(habits),
      recentSuccess: detectUserSuccess(habits)
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

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'energizing': return '⚡';
      case 'calming': return '🌙';
      case 'motivational': return '💪';
      case 'inspirational': return '✨';
      case 'reflective': return '🤔';
      default: return '💡';
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
      {/* Mobile-Optimized Header */}
      <div className={`bg-gradient-to-br ${getMoodGradient(currentQuote.mood)} p-6 text-white relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-6xl">{getMoodIcon(currentQuote.mood)}</div>
          <div className="absolute bottom-2 left-2 text-4xl opacity-50">💬</div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodIcon(currentQuote.mood)}</span>
              <span className="text-sm font-medium opacity-90">Daily Inspiration</span>
            </div>
            <div className="text-xs opacity-75 capitalize px-2 py-1 bg-white/20 rounded-full">
              {currentQuote.mood}
            </div>
          </div>

          {/* Quote Text - Mobile Optimized */}
          <blockquote className="text-base md:text-lg font-medium leading-relaxed mb-4 line-clamp-3">
            "{currentQuote.text}"
          </blockquote>

          <div className="flex items-center justify-between">
            <cite className="text-sm opacity-90">— {currentQuote.author}</cite>
            <div className="text-xs opacity-75">
              {getCurrentTimeContext() === 'morning' && '🌅 Morning'}
              {getCurrentTimeContext() === 'afternoon' && '☀️ Afternoon'}
              {getCurrentTimeContext() === 'evening' && '🌙 Evening'}
            </div>
          </div>
        </div>
      </div>

      {/* Personalization Footer - Mobile Optimized */}
      {currentQuote.relevanceScore > 10 && (
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-lg">✨</span>
            <div className="flex-1">
              <span className="text-sm text-gray-700 font-medium">
                {currentQuote.relatedHabits.length > 0 
                  ? `Perfect for your "${currentQuote.relatedHabits[0]}" journey`
                  : currentQuote.relatedGoals.length > 0
                  ? `Aligns with your "${currentQuote.relatedGoals[0]}" goal`
                  : `Matches your ${currentQuote.category[0]} focus`}
              </span>
            </div>
            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
              {Math.min(100, currentQuote.relevanceScore * 2)}% match
            </div>
          </div>
        </div>
      )}
    </div>
  );
}