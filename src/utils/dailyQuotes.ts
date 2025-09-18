// src/utils/dailyQuotes.ts

export interface DailyQuote {
  id: string;
  text: string;
  author: string;
  category: string[];
  keywords: string[];
  mood: 'motivational' | 'inspirational' | 'calming' | 'energizing' | 'reflective';
  context: 'morning' | 'evening' | 'struggle' | 'success' | 'anytime';
}

export interface PersonalizedQuote extends DailyQuote {
  relevanceScore: number;
  personalizedReason: string;
  relatedHabits: string[];
  relatedGoals: string[];
}

// Comprehensive quotes database organized by themes
const QUOTES_DATABASE: DailyQuote[] = [
  // Health & Fitness Quotes
  {
    id: 'health_1',
    text: 'Take care of your body. It\'s the only place you have to live.',
    author: 'Jim Rohn',
    category: ['health', 'fitness', 'self-care'],
    keywords: ['body', 'health', 'exercise', 'fitness', 'wellness'],
    mood: 'motivational',
    context: 'anytime'
  },
  {
    id: 'health_2',
    text: 'Self-care is not selfish. You cannot serve from an empty vessel.',
    author: 'Eleanor Brown',
    category: ['health', 'nutrition', 'wellness'],
    keywords: ['healthy', 'nutrition', 'diet', 'wellness', 'mind-body'],
    mood: 'inspirational',
    context: 'anytime'
  },
  {
    id: 'fitness_1',
    text: 'No matter how old you are, no matter how much you weigh, you can still control the health of your body.',
    author: 'Dr. Harvey Cushing',
    category: ['fitness', 'happiness', 'wellness'],
    keywords: ['exercise', 'workout', 'fitness', 'happiness', 'health'],
    mood: 'energizing',
    context: 'morning'
  },
  {
    id: 'fitness_2',
    text: 'Every workout is progress, no matter how small.',
    author: 'Unknown',
    category: ['fitness', 'progress'],
    keywords: ['workout', 'exercise', 'progress', 'small steps', 'consistency'],
    mood: 'motivational',
    context: 'struggle'
  },
  
  // Personal Development & Learning
  {
    id: 'growth_1',
    text: 'The expert in anything was once a beginner.',
    author: 'Helen Hayes',
    category: ['learning', 'growth', 'skill building'],
    keywords: ['learn', 'skill', 'practice', 'beginner', 'expert', 'growth'],
    mood: 'inspirational',
    context: 'struggle'
  },
  {
    id: 'growth_2',
    text: 'Be not afraid of growing slowly; be afraid only of standing still.',
    author: 'Chinese Proverb',
    category: ['reflection', 'action', 'planning'],
    keywords: ['plan', 'think', 'action', 'contemplation', 'reflection'],
    mood: 'reflective',
    context: 'evening'
  },
  {
    id: 'learning_1',
    text: 'One hour per day of study in your chosen field is all it takes. One hour per day of study will put you at the top of your field within three years. Within five years you’ll be a national authority. In seven years, you can be one of the best people in the world at what you do.',
    author: 'Earl Nightingale',
    category: ['learning', 'knowledge', 'growth'],
    keywords: ['learn', 'read', 'study', 'knowledge', 'mind', 'education'],
    mood: 'inspirational',
    context: 'anytime'
  },
  {
    id: 'reading_1',
    text: 'Reading is to the mind what exercise is to the body.',
    author: 'Joseph Addison',
    category: ['reading', 'learning', 'mind'],
    keywords: ['read', 'reading', 'mind', 'exercise', 'learning'],
    mood: 'motivational',
    context: 'anytime'
  },

  // Habit Formation & Consistency
  {
    id: 'habits_1',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
    category: ['habits', 'excellence', 'consistency'],
    keywords: ['habit', 'consistency', 'routine', 'excellence', 'repeated'],
    mood: 'inspirational',
    context: 'anytime'
  },
  {
    id: 'habits_2',
    text: 'Success is the sum of small efforts repeated day in and day out.',
    author: 'Robert Collier',
    category: ['success', 'consistency', 'effort'],
    keywords: ['success', 'small', 'effort', 'daily', 'repeated', 'consistency'],
    mood: 'motivational',
    context: 'morning'
  },
  {
    id: 'habits_3',
    text: 'I just never, ever want to give up. Most battles are won in the 11th hour, and most people give up. If you give up once, it\’s quite hard. If you give up a second time, it\’s a little bit easier. Give up a third time, it\’s starting to become a habit.',
    author: 'Lewis Gordon Pugh',
    category: ['starting', 'action', 'progress'],
    keywords: ['start', 'begin', 'action', 'progress', 'getting started'],
    mood: 'energizing',
    context: 'morning'
  },
  {
    id: 'consistency_1',
    text: 'It\'s not what we do once in a while that shapes our lives, but what we do consistently.',
    author: 'Tony Robbins',
    category: ['consistency', 'habits', 'life'],
    keywords: ['consistent', 'habits', 'routine', 'daily', 'shapes'],
    mood: 'motivational',
    context: 'anytime'
  },

  // Productivity & Focus
  {
    id: 'productivity_1',
    text: 'You can do anything, but not everything.',
    author: 'David Allen',
    category: ['productivity', 'focus', 'efficiency'],
    keywords: ['productive', 'focus', 'busy', 'efficiency', 'work'],
    mood: 'motivational',
    context: 'morning'
  },
  {
    id: 'productivity_2',
    text: 'Simplicity boils down to two steps: Identify the essential. Eliminate the rest.',
    author: 'Leo Babauta',
    category: ['action', 'productivity', 'starting'],
    keywords: ['action', 'doing', 'productive', 'start', 'begin'],
    mood: 'energizing',
    context: 'morning'
  },
  {
    id: 'focus_1',
    text: 'Where focus goes, energy flows.',
    author: 'Tony Robbins',
    category: ['focus', 'energy', 'attention'],
    keywords: ['focus', 'energy', 'attention', 'concentration'],
    mood: 'motivational',
    context: 'anytime'
  },

  // Mindfulness & Mental Health
  {
    id: 'mindfulness_1',
    text: 'Wherever you are, be there totally.',
    author: 'Eckhart Tolle',
    category: ['mindfulness', 'presence', 'meditation'],
    keywords: ['mindful', 'present', 'meditation', 'awareness', 'being'],
    mood: 'calming',
    context: 'anytime'
  },
  {
    id: 'mindfulness_2',
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    category: ['peace', 'mindfulness', 'inner work'],
    keywords: ['peace', 'calm', 'meditation', 'inner', 'mindfulness'],
    mood: 'calming',
    context: 'evening'
  },
  {
    id: 'stress_1',
    text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    category: ['mental strength', 'control', 'mindfulness'],
    keywords: ['stress', 'mind', 'control', 'strength', 'power'],
    mood: 'calming',
    context: 'struggle'
  },

  // Financial & Goals
  {
    id: 'financial_1',
    text: 'Do not save what is left after spending, but spend what is left after saving.',
    author: 'Warren Buffett',
    category: ['financial', 'saving', 'money'],
    keywords: ['save', 'money', 'financial', 'budget', 'earn'],
    mood: 'motivational',
    context: 'anytime'
  },
  {
    id: 'financial_2',
    text: 'It\'s not how much money you make, but how much money you keep.',
    author: 'Robert Kiyosaki',
    category: ['financial', 'saving', 'wealth'],
    keywords: ['money', 'save', 'keep', 'financial', 'wealth'],
    mood: 'reflective',
    context: 'anytime'
  },
  {
    id: 'goals_1',
    text: 'A goal is a dream with a deadline.',
    author: 'Napoleon Hill',
    category: ['goals', 'dreams', 'planning'],
    keywords: ['goal', 'dream', 'deadline', 'plan', 'target'],
    mood: 'inspirational',
    context: 'anytime'
  },
  {
    id: 'goals_2',
    text: 'The trouble with not having a goal is that you can spend your life running up and down the field and never score.',
    author: 'Bill Copeland',
    category: ['goals', 'purpose', 'direction'],
    keywords: ['goal', 'purpose', 'direction', 'score', 'achieve'],
    mood: 'motivational',
    context: 'anytime'
  },

  // Social & Relationships
  {
    id: 'social_1',
    text: 'The quality of your life is the quality of your relationships.',
    author: 'Tony Robbins',
    category: ['relationships', 'social', 'quality of life'],
    keywords: ['relationships', 'social', 'family', 'friends', 'quality'],
    mood: 'inspirational',
    context: 'anytime'
  },
  {
    id: 'kindness_1',
    text: 'No act of kindness, no matter how small, is ever wasted.',
    author: 'Aesop',
    category: ['kindness', 'compassion', 'social'],
    keywords: ['kind', 'kindness', 'compassion', 'help', 'small acts'],
    mood: 'inspirational',
    context: 'anytime'
  },

  // Morning & Evening Specific
  {
    id: 'morning_1',
    text: 'Every morning we are born again. What we do today is what matters most.',
    author: 'Buddha',
    category: ['morning', 'new beginnings', 'present'],
    keywords: ['morning', 'new day', 'today', 'fresh start'],
    mood: 'energizing',
    context: 'morning'
  },
  {
    id: 'morning_2',
    text: 'Today is the first day of the rest of your life.',
    author: 'Abbie Hoffman',
    category: ['new beginnings', 'opportunity', 'present'],
    keywords: ['today', 'first day', 'new', 'life', 'opportunity'],
    mood: 'energizing',
    context: 'morning'
  },
  {
    id: 'evening_1',
    text: 'Reflect upon your present blessings, of which every man has many.',
    author: 'Charles Dickens',
    category: ['gratitude', 'reflection', 'blessings'],
    keywords: ['reflect', 'gratitude', 'blessings', 'grateful'],
    mood: 'reflective',
    context: 'evening'
  },

  // Struggle & Resilience
  {
    id: 'struggle_1',
    text: 'Fall seven times, stand up eight.',
    author: 'Japanese Proverb',
    category: ['resilience', 'perseverance', 'failure'],
    keywords: ['fall', 'failure', 'resilience', 'perseverance', 'stand up'],
    mood: 'motivational',
    context: 'struggle'
  },
  {
    id: 'struggle_2',
    text: 'The comeback is always stronger than the setback.',
    author: 'Unknown',
    category: ['resilience', 'comeback', 'setback'],
    keywords: ['comeback', 'setback', 'stronger', 'resilience', 'recovery'],
    mood: 'motivational',
    context: 'struggle'
  },

  // Success & Achievement
  {
    id: 'success_1',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: ['success', 'failure', 'courage'],
    keywords: ['success', 'failure', 'courage', 'continue', 'counts'],
    mood: 'inspirational',
    context: 'success'
  }
];

// User context interface
interface UserContext {
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
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  recentStruggle?: boolean; // If user missed habits recently
  recentSuccess?: boolean; // If user completed many habits recently
}

export function generateDailyQuote(userContext: UserContext): PersonalizedQuote {
  const { habits, goals, timeOfDay, recentStruggle, recentSuccess } = userContext;
  
  // Get user's main categories and keywords
  const userCategories = [...new Set([
    ...habits.map(h => h.category.toLowerCase()),
    ...goals.map(g => g.category.toLowerCase())
  ])];
  
  const userKeywords = [...new Set([
    ...habits.flatMap(h => h.title.toLowerCase().split(' ')),
    ...goals.flatMap(g => g.title.toLowerCase().split(' '))
  ])].filter(word => word.length > 3); // Filter out small words

  // Determine context based on user situation
  let contextPreference: string[] = [timeOfDay];
  if (recentStruggle) contextPreference.push('struggle');
  if (recentSuccess) contextPreference.push('success');
  contextPreference.push('anytime');

  // Score quotes based on relevance
  const scoredQuotes = QUOTES_DATABASE.map(quote => {
    let score = 0;
    const relatedHabits: string[] = [];
    const relatedGoals: string[] = [];
    
    // Category match (high weight)
    const categoryMatches = quote.category.filter(cat => 
      userCategories.some(userCat => userCat.includes(cat.toLowerCase()) || cat.toLowerCase().includes(userCat))
    );
    score += categoryMatches.length * 10;
    
    // Keyword match (medium weight)
    const keywordMatches = quote.keywords.filter(keyword =>
      userKeywords.some(userKeyword => 
        userKeyword.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(userKeyword)
      )
    );
    score += keywordMatches.length * 5;
    
    // Context match (medium weight)
    if (contextPreference.includes(quote.context)) {
      score += 7;
    }
    
    // Find related habits and goals
    habits.forEach(habit => {
      const habitWords = habit.title.toLowerCase().split(' ');
      if (quote.keywords.some(keyword => 
        habitWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))
      )) {
        relatedHabits.push(habit.title);
        score += 3;
      }
    });
    
    goals.forEach(goal => {
      const goalWords = goal.title.toLowerCase().split(' ');
      if (quote.keywords.some(keyword => 
        goalWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))
      )) {
        relatedGoals.push(goal.title);
        score += 3;
      }
    });
    
    // Boost for current streaks
    const activeHabits = habits.filter(h => h.streak > 0);
    if (activeHabits.length > 0 && (categoryMatches.length > 0 || keywordMatches.length > 0)) {
      score += 5;
    }
    
    return {
      ...quote,
      relevanceScore: score,
      relatedHabits,
      relatedGoals,
      personalizedReason: generatePersonalizedReason(quote, categoryMatches, keywordMatches, relatedHabits, relatedGoals, userContext)
    };
  });
  
  // Sort by relevance and add some randomness to prevent repetition
  const topQuotes = scoredQuotes
    .filter(q => q.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10); // Get top 10
  
  // If no relevant quotes, fall back to context-appropriate quotes
  const finalQuotes = topQuotes.length > 0 ? topQuotes : 
    scoredQuotes.filter(q => contextPreference.includes(q.context));
  
  // Add date-based randomness to prevent showing same quote every day
  const dateSeeded = new Date().getDate() + new Date().getMonth();
  const selectedQuote = finalQuotes[dateSeeded % finalQuotes.length] || scoredQuotes[dateSeeded % scoredQuotes.length];
  
  return selectedQuote;
}

function generatePersonalizedReason(
  quote: DailyQuote, 
  categoryMatches: string[], 
  keywordMatches: string[], 
  relatedHabits: string[], 
  relatedGoals: string[],
  userContext: UserContext
): string {
  const reasons: string[] = [];
  
  if (relatedHabits.length > 0) {
    reasons.push(`relates to your "${relatedHabits[0]}" habit`);
  }
  
  if (relatedGoals.length > 0) {
    reasons.push(`connects to your "${relatedGoals[0]}" goal`);
  }
  
  if (categoryMatches.length > 0) {
    reasons.push(`matches your focus on ${categoryMatches[0]}`);
  }
  
  if (userContext.recentStruggle && quote.context === 'struggle') {
    reasons.push('provides encouragement during challenging times');
  }
  
  if (userContext.recentSuccess && quote.context === 'success') {
    reasons.push('celebrates your recent achievements');
  }
  
  if (quote.context === userContext.timeOfDay) {
    reasons.push(`perfect for your ${userContext.timeOfDay} reflection`);
  }
  
  return reasons.length > 0 
    ? `This quote ${reasons.slice(0, 2).join(' and ')}.`
    : 'This quote offers timeless wisdom for your journey.';
}

// Helper function to determine if user is struggling
export function detectUserStruggle(habits: Array<{ lastCompleted: string | null; streak: number }>): boolean {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const missedHabits = habits.filter(habit => {
    if (!habit.lastCompleted) return true;
    const lastCompleted = new Date(habit.lastCompleted);
    return lastCompleted < yesterday;
  });
  
  return missedHabits.length > habits.length * 0.5; // If missed more than 50% of habits
}

// Helper function to detect recent success
export function detectUserSuccess(habits: Array<{ streak: number }>): boolean {
  const activeStreaks = habits.filter(h => h.streak >= 3);
  return activeStreaks.length >= Math.min(3, habits.length); // At least 3 habits with 3+ day streaks
}

// Get current time context
export function getCurrentTimeContext(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}