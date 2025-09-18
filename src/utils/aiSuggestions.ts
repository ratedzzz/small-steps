// AI-powered suggestions based on goal patterns and habit science

interface HabitSuggestion {
  title: string
  description: string
  category: 'physical' | 'mental' | 'social' | 'skill' | 'productivity'
  difficulty: 'easy' | 'medium' | 'hard'
  frequency: 'daily' | 'weekly' | 'multiple'
}

interface ImplementationTip {
  strategy: string
  description: string
  scienceBased: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// Goal-to-habit mapping based on common patterns
const goalHabitMappings = {
  // Health & Fitness
  'weight': [
    { title: 'Track daily calories', description: 'Log food intake to maintain awareness', category: 'physical' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Walk 10,000 steps', description: 'Increase daily movement and activity', category: 'physical' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Drink 8 glasses of water', description: 'Stay hydrated and reduce hunger cues', category: 'physical' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Meal prep on Sundays', description: 'Prepare healthy meals for the week', category: 'physical' as const, difficulty: 'medium' as const, frequency: 'weekly' as const },
  ],
  'fitness': [
    { title: 'Exercise 30 minutes', description: 'Consistent physical activity', category: 'physical' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Do 50 push-ups', description: 'Build upper body strength', category: 'physical' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Stretch for 10 minutes', description: 'Improve flexibility and recovery', category: 'physical' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Track workout progress', description: 'Monitor improvements and stay motivated', category: 'physical' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
  ],
  'health': [
    { title: 'Take vitamins', description: 'Support overall health with supplements', category: 'physical' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Get 8 hours of sleep', description: 'Prioritize quality sleep for recovery', category: 'physical' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Meditate 10 minutes', description: 'Reduce stress and improve mental clarity', category: 'mental' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
  ],
  
  // Learning & Education
  'learn': [
    { title: 'Read for 30 minutes', description: 'Consistent learning through reading', category: 'skill' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Practice new language', description: 'Daily language learning sessions', category: 'skill' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Take online course', description: 'Structured learning with courses', category: 'skill' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Write in learning journal', description: 'Reflect on daily insights and progress', category: 'skill' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
  ],
  'read': [
    { title: 'Read 20 pages daily', description: 'Consistent daily reading habit', category: 'skill' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Join book club', description: 'Social accountability for reading', category: 'social' as const, difficulty: 'medium' as const, frequency: 'weekly' as const },
    { title: 'Take reading notes', description: 'Improve comprehension and retention', category: 'skill' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
  ],
  
  // Career & Work
  'career': [
    { title: 'Network with 1 person', description: 'Build professional relationships', category: 'social' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Update skills daily', description: 'Learn something relevant to your field', category: 'skill' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Review and plan tomorrow', description: 'End each day with planning', category: 'productivity' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
  ],
  'productivity': [
    { title: 'Time-block calendar', description: 'Plan focused work sessions', category: 'productivity' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Complete most important task first', description: 'Tackle high-priority items when fresh', category: 'productivity' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Review weekly goals', description: 'Stay aligned with bigger objectives', category: 'productivity' as const, difficulty: 'easy' as const, frequency: 'weekly' as const },
  ],
  
  // Finance
  'money': [
    { title: 'Track daily expenses', description: 'Monitor spending patterns', category: 'productivity' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Save $10 daily', description: 'Build consistent savings habit', category: 'productivity' as const, difficulty: 'medium' as const, frequency: 'daily' as const },
    { title: 'Review investments', description: 'Stay informed about financial health', category: 'productivity' as const, difficulty: 'medium' as const, frequency: 'weekly' as const },
  ],
  
  // Personal Development
  'mindfulness': [
    { title: 'Practice gratitude', description: 'Write down 3 things you\'re grateful for', category: 'mental' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Meditate 10 minutes', description: 'Daily mindfulness practice', category: 'mental' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
    { title: 'Journal thoughts', description: 'Reflect on daily experiences', category: 'mental' as const, difficulty: 'easy' as const, frequency: 'daily' as const },
  ]
}

// Implementation strategies based on behavioral science
const implementationStrategies = {
  'habit_stacking': {
    strategy: 'Habit Stacking',
    description: 'Link your new habit to an existing routine. After [existing habit], I will [new habit].',
    scienceBased: true,
    difficulty: 'beginner' as const
  },
  'environment_design': {
    strategy: 'Environment Design',
    description: 'Make good habits easier by changing your environment. Place visual cues where you\'ll see them.',
    scienceBased: true,
    difficulty: 'beginner' as const
  },
  'start_small': {
    strategy: 'Start Ridiculously Small',
    description: 'Begin with a 2-minute version of your habit. Focus on consistency over intensity.',
    scienceBased: true,
    difficulty: 'beginner' as const
  },
  'implementation_intention': {
    strategy: 'Implementation Intentions',
    description: 'Plan exactly when and where you\'ll do your habit: "At [time] in [location], I will [habit]."',
    scienceBased: true,
    difficulty: 'intermediate' as const
  },
  'temptation_bundling': {
    strategy: 'Temptation Bundling',
    description: 'Pair your habit with something you enjoy. Only do [fun activity] while doing [habit].',
    scienceBased: true,
    difficulty: 'intermediate' as const
  },
  'social_accountability': {
    strategy: 'Social Accountability',
    description: 'Share your habit goal with others and ask them to check on your progress.',
    scienceBased: true,
    difficulty: 'intermediate' as const
  },
  'habit_tracking': {
    strategy: 'Visual Habit Tracking',
    description: 'Use a visible method to track your progress. Seeing your streak builds motivation.',
    scienceBased: true,
    difficulty: 'beginner' as const
  },
  'reward_system': {
    strategy: 'Reward System',
    description: 'Give yourself a small reward immediately after completing your habit.',
    scienceBased: true,
    difficulty: 'intermediate' as const
  }
}

export const generateHabitSuggestions = (goalTitle: string, goalDescription: string): HabitSuggestion[] => {
  const searchText = (goalTitle + ' ' + goalDescription).toLowerCase()
  let suggestions: HabitSuggestion[] = []
  
  // Find matching patterns
  Object.entries(goalHabitMappings).forEach(([key, habits]) => {
    if (searchText.includes(key)) {
      suggestions.push(...habits)
    }
  })
  
  // If no specific matches, provide general productivity habits
  if (suggestions.length === 0) {
    suggestions = [
      { title: 'Daily planning session', description: 'Spend 10 minutes planning your day', category: 'productivity', difficulty: 'easy', frequency: 'daily' },
      { title: 'Weekly goal review', description: 'Review progress toward your goals', category: 'productivity', difficulty: 'easy', frequency: 'weekly' },
      { title: 'Track progress daily', description: 'Log one action toward your goal', category: 'productivity', difficulty: 'easy', frequency: 'daily' },
    ]
  }
  
  // Remove duplicates and limit to 5 suggestions
  const uniqueSuggestions = suggestions.filter((item, index, arr) => 
    arr.findIndex(t => t.title === item.title) === index
  )
  
  return uniqueSuggestions.slice(0, 5)
}

export const generateImplementationTips = (habitTitle: string): ImplementationTip[] => {
  const tips: ImplementationTip[] = []
  const habitText = habitTitle.toLowerCase()
  
  // Always include these foundational strategies
  tips.push(
    implementationStrategies.start_small,
    implementationStrategies.habit_stacking,
    implementationStrategies.environment_design
  )
  
  // Add specific strategies based on habit type
  if (habitText.includes('exercise') || habitText.includes('workout') || habitText.includes('fitness')) {
    tips.push(implementationStrategies.temptation_bundling)
  }
  
  if (habitText.includes('read') || habitText.includes('study') || habitText.includes('learn')) {
    tips.push(implementationStrategies.implementation_intention)
  }
  
  if (habitText.includes('social') || habitText.includes('network') || habitText.includes('call')) {
    tips.push(implementationStrategies.social_accountability)
  }
  
  // Always end with tracking and rewards
  tips.push(
    implementationStrategies.habit_tracking,
    implementationStrategies.reward_system
  )
  
  // Remove duplicates and limit
  return tips.filter((item, index, arr) => 
    arr.findIndex(t => t.strategy === item.strategy) === index
  ).slice(0, 4)
}