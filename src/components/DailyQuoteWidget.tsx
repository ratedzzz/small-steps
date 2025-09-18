// src/components/DailyQuoteWidget.tsx

import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, ExternalLink } from 'lucide-react';
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
  onViewFull?: () => void;
  className?: string;
}

// Compact widget version for dashboard
export function DailyQuoteWidget({ habits, goals, onViewFull, className = '' }: DailyQuoteWidgetProps) {
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
      case 'energizing': return 'from-yellow-400 to-orange-500';
      case 'calming': return 'from-blue-400 to-cyan-500';
      case 'motivational': return 'from-red-400 to-pink-500';
      case 'inspirational': return 'from-purple-400 to-indigo-500';
      case 'reflective': return 'from-green-400 to-teal-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (!currentQuote) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {/* Compact Header */}
      <div className={`bg-gradient-to-r ${getMoodGradient(currentQuote.mood)} p-4 text-white`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4" />
            <span className="text-sm font-medium">Daily Quote</span>
            {currentQuote.relevanceScore > 15 && (
              <Sparkles className="w-4 h-4 animate-pulse" />
            )}
          </div>
          <span className="text-xs opacity-75 capitalize">{currentQuote.mood}</span>
        </div>

        {/* Shortened Quote */}
        <blockquote className="text-sm leading-relaxed mb-2">
          "{currentQuote.text.length > 120 
            ? currentQuote.text.substring(0, 120) + '...' 
            : currentQuote.text}"
        </blockquote>

        <div className="flex items-center justify-between">
          <cite className="text-xs opacity-90">— {currentQuote.author}</cite>
          {onViewFull && (
            <button
              onClick={onViewFull}
              className="text-xs opacity-75 hover:opacity-100 flex items-center gap-1"
            >
              View Full <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Personalization Footer */}
      {currentQuote.relevanceScore > 10 && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-gray-600">
              {currentQuote.relatedHabits.length > 0 
                ? `Relates to your "${currentQuote.relatedHabits[0]}" habit`
                : currentQuote.relatedGoals.length > 0
                ? `Connects to your "${currentQuote.relatedGoals[0]}" goal`
                : `Matches your ${currentQuote.category[0]} focus`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Example Dashboard Integration
export function DashboardWithQuote() {
  // Mock data - replace with real data in your app
  const mockHabits = [
    { title: 'Exercise 30 minutes', category: 'Health & Fitness', streak: 5, lastCompleted: new Date().toISOString() },
    { title: 'Read for 20 minutes', category: 'Personal Development', streak: 3, lastCompleted: new Date().toISOString() },
    { title: 'Meditate daily', category: 'Health & Fitness', streak: 0, lastCompleted: null }
  ];

  const mockGoals = [
    { title: 'Lose 20 pounds', category: 'Health & Fitness', targetDate: '2025-12-31' },
    { title: 'Read 24 books this year', category: 'Personal Development', targetDate: '2025-12-31' }
  ];

  const [showFullQuote, setShowFullQuote] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Habit Dashboard</h1>
        <p className="text-gray-600">Track your progress and stay motivated</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Habit Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Habits</span>
                <span className="font-medium">{mockHabits.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Streaks</span>
                <span className="font-medium">{mockHabits.filter(h => h.streak > 0).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Goals</span>
                <span className="font-medium">{mockGoals.length}</span>
              </div>
            </div>
          </div>

          {/* Daily Quote Widget */}
          <DailyQuoteWidget 
            habits={mockHabits}
            goals={mockGoals}
            onViewFull={() => setShowFullQuote(true)}
          />
        </div>

        {/* Middle Column - Habits List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Habits</h3>
          <div className="space-y-3">
            {mockHabits.map((habit, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{habit.title}</span>
                  <div className="text-sm text-gray-500">
                    {habit.streak > 0 ? `${habit.streak} day streak` : 'Not started'}
                  </div>
                </div>
                <button className={`w-6 h-6 rounded-full border-2 ${
                  habit.lastCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}>
                  {habit.lastCompleted && <span className="text-white text-xs">✓</span>}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Goals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Active Goals</h3>
          <div className="space-y-3">
            {mockGoals.map((goal, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900 block">{goal.title}</span>
                <span className="text-sm text-gray-500">{goal.category}</span>
                <div className="mt-2 text-xs text-gray-400">
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Quote Modal */}
      {showFullQuote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Today's Inspiration</h2>
                <button
                  onClick={() => setShowFullQuote(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              {/* Full DailyQuote component would go here */}
              <div className="text-center py-8">
                <p className="text-gray-600">Full DailyQuote component would be rendered here</p>
                <button
                  onClick={() => setShowFullQuote(false)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Usage Instructions Component
export function QuoteSystemUsage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Daily Quote System - Usage Guide</h2>
      
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🎯 How the AI Personalization Works</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Smart Matching:</strong> Analyzes your habits and goals to find relevant quotes</p>
            <p><strong>Context Awareness:</strong> Considers time of day, recent struggles, and successes</p>
            <p><strong>Relevance Scoring:</strong> Shows how well each quote matches your journey</p>
            <p><strong>Mood-Based:</strong> Delivers energizing quotes in morning, calming ones in evening</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">🚀 Integration Examples</h3>
          <div className="text-sm text-green-800 space-y-1">
            <p>• <strong>Dashboard Widget:</strong> Compact version for main dashboard</p>
            <p>• <strong>Full Component:</strong> Detailed view with personalization insights</p>
            <p>• <strong>Morning Notification:</strong> Send daily quote as push notification</p>
            <p>• <strong>Habit Completion:</strong> Show motivational quote after completing habits</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 Customization Options</h3>
          <div className="text-sm text-yellow-800 space-y-1">
            <p>• Add more quotes to the database for specific niches</p>
            <p>• Adjust relevance scoring weights based on user feedback</p>
            <p>• Create themed quote collections (motivation, wisdom, humor)</p>
            <p>• Implement user quote submissions and favorites</p>
          </div>
        </div>
      </div>
    </div>
  );
}