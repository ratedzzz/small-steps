// src/utils/dailyQuotes.ts - Simplified version (850 lines → 170 lines)

export interface PersonalizedQuote {
  id: string;
  text: string;
  author: string;
  mood: 'motivational' | 'inspirational' | 'calming' | 'energizing' | 'reflective';
  relevanceScore: number;
  personalizedReason: string;
  relatedHabits: string[];
  relatedGoals: string[];
}

interface Quote {
  text: string;
  author: string;
  keywords: string[];
  mood: 'motivational' | 'inspirational' | 'calming' | 'energizing' | 'reflective';
  context: 'morning' | 'evening' | 'struggle' | 'success' | 'anytime';
}

// Curated collection of 25 high-quality quotes
const QUOTES: Quote[] = [
  // Morning (5)
  { text: 'Every morning we are born again. What we do today is what matters most.', author: 'Buddha', keywords: ['morning', 'new', 'today'], mood: 'energizing', context: 'morning' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney', keywords: ['start', 'action', 'begin'], mood: 'motivational', context: 'morning' },
  { text: 'Today is the first day of the rest of your life.', author: 'Abbie Hoffman', keywords: ['today', 'new', 'opportunity'], mood: 'energizing', context: 'morning' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain', keywords: ['start', 'begin', 'progress'], mood: 'motivational', context: 'morning' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson', keywords: ['keep going', 'persistence', 'action'], mood: 'energizing', context: 'morning' },

  // Evening (5)
  { text: 'Reflect upon your present blessings, of which every man has many.', author: 'Charles Dickens', keywords: ['reflect', 'gratitude', 'blessings'], mood: 'reflective', context: 'evening' },
  { text: 'Before you go to bed, write down three things you did right today. You did.', author: 'Unknown', keywords: ['reflect', 'success', 'gratitude'], mood: 'calming', context: 'evening' },
  { text: 'The best preparation for tomorrow is doing your best today.', author: 'H. Jackson Brown Jr.', keywords: ['preparation', 'today', 'tomorrow'], mood: 'reflective', context: 'evening' },
  { text: 'End your day with gratitude. There is someone, somewhere that has less than you.', author: 'Zig Ziglar', keywords: ['gratitude', 'thankful', 'reflect'], mood: 'calming', context: 'evening' },
  { text: 'Peace comes from within. Do not seek it without.', author: 'Buddha', keywords: ['peace', 'calm', 'inner'], mood: 'calming', context: 'evening' },

  // Struggle (5)
  { text: 'Fall seven times, stand up eight.', author: 'Japanese Proverb', keywords: ['resilience', 'failure', 'perseverance'], mood: 'motivational', context: 'struggle' },
  { text: 'The comeback is always stronger than the setback.', author: 'Unknown', keywords: ['comeback', 'setback', 'resilience'], mood: 'motivational', context: 'struggle' },
  { text: 'It\'s not whether you get knocked down, it\'s whether you get up.', author: 'Vince Lombardi', keywords: ['resilience', 'persistence', 'overcome'], mood: 'motivational', context: 'struggle' },
  { text: 'Difficult roads often lead to beautiful destinations.', author: 'Unknown', keywords: ['difficult', 'challenge', 'journey'], mood: 'inspirational', context: 'struggle' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes', keywords: ['beginner', 'learning', 'growth'], mood: 'inspirational', context: 'struggle' },

  // Success (5)
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier', keywords: ['success', 'small', 'daily', 'consistency'], mood: 'motivational', context: 'success' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle', keywords: ['habit', 'excellence', 'consistency'], mood: 'inspirational', context: 'success' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill', keywords: ['success', 'courage', 'continue'], mood: 'inspirational', context: 'success' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', keywords: ['work', 'love', 'passion'], mood: 'inspirational', context: 'success' },
  { text: 'It\'s not what we do once in a while that shapes our lives, but what we do consistently.', author: 'Tony Robbins', keywords: ['consistency', 'habit', 'life'], mood: 'motivational', context: 'success' },

  // General (5)
  { text: 'Take care of your body. It\'s the only place you have to live.', author: 'Jim Rohn', keywords: ['health', 'fitness', 'body', 'exercise'], mood: 'motivational', context: 'anytime' },
  { text: 'Reading is to the mind what exercise is to the body.', author: 'Joseph Addison', keywords: ['reading', 'learn', 'mind', 'exercise'], mood: 'motivational', context: 'anytime' },
  { text: 'You can do anything, but not everything.', author: 'David Allen', keywords: ['focus', 'priority', 'productivity'], mood: 'motivational', context: 'anytime' },
  { text: 'A goal is a dream with a deadline.', author: 'Napoleon Hill', keywords: ['goal', 'dream', 'deadline', 'plan'], mood: 'inspirational', context: 'anytime' },
  { text: 'The quality of your life is the quality of your relationships.', author: 'Tony Robbins', keywords: ['relationships', 'life', 'quality', 'social'], mood: 'inspirational', context: 'anytime' }
];

interface UserContext {
  habits: Array<{ title: string; category: string; streak: number }>;
  goals: Array<{ title: string; category: string }>;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  recentStruggle?: boolean;
  recentSuccess?: boolean;
}

export function generateDailyQuote(userContext: UserContext): PersonalizedQuote {
  const { habits, goals, timeOfDay, recentStruggle, recentSuccess } = userContext;
  
  // Extract user keywords
  const userKeywords = [
    ...habits.flatMap(h => h.title.toLowerCase().split(' ')),
    ...goals.flatMap(g => g.title.toLowerCase().split(' '))
  ].filter(word => word.length > 3);

  // Determine context
  let context: Quote['context'] = timeOfDay === 'evening' ? 'evening' : 'morning';
  if (recentStruggle) context = 'struggle';
  if (recentSuccess) context = 'success';

  // Score quotes
  const scoredQuotes = QUOTES.map((quote, index) => {
    let score = 0;
    const relatedHabits: string[] = [];
    const relatedGoals: string[] = [];

    // Context match (high priority)
    if (quote.context === context || quote.context === 'anytime') score += 10;

    // Keyword matching
    const matches = quote.keywords.filter(keyword =>
      userKeywords.some(userWord => 
        userWord.includes(keyword) || keyword.includes(userWord)
      )
    );
    score += matches.length * 5;

    // Find related habits/goals
    habits.forEach(habit => {
      if (quote.keywords.some(k => habit.title.toLowerCase().includes(k))) {
        relatedHabits.push(habit.title);
        score += 3;
      }
    });

    goals.forEach(goal => {
      if (quote.keywords.some(k => goal.title.toLowerCase().includes(k))) {
        relatedGoals.push(goal.title);
        score += 3;
      }
    });

    return {
      id: `quote_${index}`,
      text: quote.text,
      author: quote.author,
      mood: quote.mood,
      relevanceScore: score,
      relatedHabits: relatedHabits.slice(0, 2),
      relatedGoals: relatedGoals.slice(0, 2),
      personalizedReason: generateReason(quote, relatedHabits, relatedGoals, context)
    };
  });

  // Get top quotes and use date-based selection
  const topQuotes = scoredQuotes.filter(q => q.relevanceScore > 0).sort((a, b) => b.relevanceScore - a.relevanceScore);
  const finalQuotes = topQuotes.length > 0 ? topQuotes.slice(0, 10) : scoredQuotes;
  
  const dateIndex = (new Date().getDate() + new Date().getMonth()) % finalQuotes.length;
  return finalQuotes[dateIndex];
}

function generateReason(quote: Quote, habits: string[], goals: string[], context: string): string {
  const reasons: string[] = [];
  
  if (habits.length > 0) reasons.push(`relates to your "${habits[0]}" habit`);
  if (goals.length > 0) reasons.push(`connects to your "${goals[0]}" goal`);
  if (quote.context === context) reasons.push(`perfect for ${context === 'morning' ? 'starting your day' : context === 'evening' ? 'reflection' : 'this moment'}`);
  
  return reasons.length > 0 
    ? `This quote ${reasons.slice(0, 2).join(' and ')}.`
    : 'This quote offers timeless wisdom for your journey.';
}

export function getCurrentTimeContext(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function detectUserStruggle(habits: Array<{ lastCompleted: string | null; streak: number }>): boolean {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const missedHabits = habits.filter(h => {
    if (!h.lastCompleted) return true;
    return new Date(h.lastCompleted) < yesterday;
  });
  return missedHabits.length > habits.length * 0.5;
}

export function detectUserSuccess(habits: Array<{ streak: number }>): boolean {
  const activeStreaks = habits.filter(h => h.streak >= 3);
  return activeStreaks.length >= Math.min(3, habits.length);
}