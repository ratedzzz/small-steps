// src/components/DailyQuote.tsx

import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, RefreshCw, Heart, Share, Copy, Check } from 'lucide-react';
import { 
  generateDailyQuote, 
  detectUserStruggle, 
  detectUserSuccess, 
  getCurrentTimeContext,
  PersonalizedQuote 
} from '../utils/dailyQuotes';

interface DailyQuoteProps {
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

export function DailyQuote({ habits, goals, className = '' }: DailyQuoteProps) {
  const [currentQuote, setCurrentQuote] = useState<PersonalizedQuote | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);

  // Generate initial quote
  useEffect(() => {
    generateNewQuote();
  }, [habits, goals]);

  const generateNewQuote = () => {
    const userContext = {
      habits,
      goals,
      timeOfDay: getCurrentTimeContext(),
      recentStruggle: detectUserStruggle(habits),
      recentSuccess: detectUserSuccess(habits)
    };

    const quote = generateDailyQuote(userContext);
    setCurrentQuote(quote);
    
    // Check if user liked this quote before (in real app, store in localStorage)
    const likedQuotes = JSON.parse(localStorage.getItem('likedQuotes') || '[]');
    setIsLiked(likedQuotes.includes(quote.id));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Add a small delay for better UX
    setTimeout(() => {
      generateNewQuote();
      setIsRefreshing(false);
    }, 800);
  };

  const handleLike = () => {
    if (!currentQuote) return;
    
    const likedQuotes = JSON.parse(localStorage.getItem('likedQuotes') || '[]');
    if (isLiked) {
      // Remove from liked quotes
      const updated = likedQuotes.filter((id: string) => id !== currentQuote.id);
      localStorage.setItem('likedQuotes', JSON.stringify(updated));
    } else {
      // Add to liked quotes
      likedQuotes.push(currentQuote.id);
      localStorage.setItem('likedQuotes', JSON.stringify(likedQuotes));
    }
    setIsLiked(!isLiked);
  };

  const handleCopy = async () => {
    if (!currentQuote) return;
    
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!currentQuote) return;
    
    const text = `"${currentQuote.text}" - ${currentQuote.author}`;
    
    if (navigator.share) {
      await navigator.share({
        title: 'Daily Inspiration',
        text: text,
      });
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'energizing': return '⚡';
      case 'calming': return '🧘';
      case 'motivational': return '💪';
      case 'inspirational': return '✨';
      case 'reflective': return '🤔';
      default: return '💡';
    }
  };

  const getMoodColor = (mood: string) => {
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
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-r ${getMoodColor(currentQuote.mood)} p-6 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-6 h-6" />
            <h3 className="font-semibold text-lg">Daily Inspiration</h3>
            <span className="text-2xl">{getMoodIcon(currentQuote.mood)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
              title="Get new quote"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowPersonalization(!showPersonalization)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Why this quote?"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quote Text */}
        <blockquote className="text-lg md:text-xl font-medium leading-relaxed mb-4">
          "{currentQuote.text}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-between">
          <cite className="text-sm opacity-90">— {currentQuote.author}</cite>
          <div className="flex items-center gap-1">
            <span className="text-xs opacity-75 capitalize">{currentQuote.mood}</span>
            <span className="text-xs opacity-75">•</span>
            <span className="text-xs opacity-75">Relevance: {Math.min(100, currentQuote.relevanceScore * 2)}%</span>
          </div>
        </div>
      </div>

      {/* Personalization Details */}
      {showPersonalization && (
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Why this quote for you?</h4>
              <p className="text-sm text-gray-700 mb-3">{currentQuote.personalizedReason}</p>
              
              {(currentQuote.relatedHabits.length > 0 || currentQuote.relatedGoals.length > 0) && (
                <div className="space-y-2">
                  {currentQuote.relatedHabits.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-600">Related Habits: </span>
                      <span className="text-xs text-gray-500">
                        {currentQuote.relatedHabits.slice(0, 2).join(', ')}
                        {currentQuote.relatedHabits.length > 2 && ` +${currentQuote.relatedHabits.length - 2} more`}
                      </span>
                    </div>
                  )}
                  {currentQuote.relatedGoals.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-600">Related Goals: </span>
                      <span className="text-xs text-gray-500">
                        {currentQuote.relatedGoals.slice(0, 2).join(', ')}
                        {currentQuote.relatedGoals.length > 2 && ` +${currentQuote.relatedGoals.length - 2} more`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {getCurrentTimeContext() === 'morning' && '🌅 Morning motivation'}
            {getCurrentTimeContext() === 'afternoon' && '☀️ Afternoon inspiration'}
            {getCurrentTimeContext() === 'evening' && '🌙 Evening reflection'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors ${
              isLiked 
                ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleCopy}
            className={`p-2 rounded-full transition-colors ${
              isCopied
                ? 'text-green-500 bg-green-50'
                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
            }`}
            title="Copy quote"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-colors"
            title="Share quote"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}