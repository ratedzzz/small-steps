// Optimized store.ts - Streamlined version

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Ensure all optional fields have defaults
interface Habit {
  id: string
  title: string
  description: string
  color: string
  createdAt: string
  isActive: boolean
  goalId?: string
  // Required fields with defaults:
  category: string  // Default: 'General'
  streak: number    // Default: 0
}

interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetValue?: number
  currentValue?: number
  unit?: string
  deadline?: string
  createdAt: string
  isActive: boolean
  color: string
}

interface DayProgress {
  completed: boolean
  completionPercentage: number
  notes?: string
  timestamp: number
  journalEntry?: string
  points?: number
  mood?: number
}

interface Progress {
  [habitId: string]: {
    [date: string]: DayProgress
  }
}

interface HabitStore {
  habits: Habit[]
  goals: Goal[]
  progress: Progress
  
  // Simplified actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'category' | 'streak'> & { category?: string }) => void
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  linkHabitToGoal: (habitId: string, goalId: string) => void
  unlinkHabitFromGoal: (habitId: string) => void
  
  // Consolidated progress methods
  setProgress: (habitId: string, date: string, percentage: number, notes?: string) => void
  setJournal: (habitId: string, date: string, entry: string, points?: number, mood?: number) => void
  
  // Optimized getters (with caching hints)
  getProgress: (habitId: string, date: string) => DayProgress | null
  getStreak: (habitId: string) => number
  getHabitStats: (habitId: string) => { streak: number; totalPoints: number; totalCompletions: number }
  getGoalProgress: (goalId: string) => number
  getHabitsForGoal: (goalId: string) => Habit[]
}

// Helper to generate today's date
const getToday = () => new Date().toISOString().split('T')[0]

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      goals: [],
      progress: {},
      
      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isActive: true,
          category: habitData.category || 'General',
          streak: 0
        }
        set((state) => ({
          habits: [...state.habits, newHabit]
        }))
      },
      
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isActive: true
        }
        set((state) => ({
          goals: [...state.goals, newGoal]
        }))
      },
      
      updateGoal: (goalId, updates) => {
        set((state) => ({
          goals: state.goals.map(goal => 
            goal.id === goalId ? { ...goal, ...updates } : goal
          )
        }))
      },
      
      linkHabitToGoal: (habitId, goalId) => {
        set((state) => ({
          habits: state.habits.map(habit =>
            habit.id === habitId ? { ...habit, goalId } : habit
          )
        }))
      },
      
      unlinkHabitFromGoal: (habitId) => {
        set((state) => ({
          habits: state.habits.map(habit =>
            habit.id === habitId ? { ...habit, goalId: undefined } : habit
          )
        }))
      },
      
      // Consolidated progress setter
      setProgress: (habitId, date, percentage, notes = '') => {
        set((state) => {
          const existing = state.progress[habitId]?.[date] || {}
          return {
            progress: {
              ...state.progress,
              [habitId]: {
                ...state.progress[habitId],
                [date]: {
                  ...existing,
                  completed: percentage >= 100,
                  completionPercentage: percentage,
                  notes,
                  timestamp: Date.now()
                }
              }
            }
          }
        })
      },
      
      // Consolidated journal setter
      setJournal: (habitId, date, entry, points = 0, mood = 3) => {
        set((state) => {
          const existing = state.progress[habitId]?.[date] || {
            completed: false,
            completionPercentage: 0,
            timestamp: Date.now()
          }
          return {
            progress: {
              ...state.progress,
              [habitId]: {
                ...state.progress[habitId],
                [date]: {
                  ...existing,
                  journalEntry: entry,
                  points,
                  mood,
                  timestamp: Date.now()
                }
              }
            }
          }
        })
      },
      
      // Single getter for all progress data
      getProgress: (habitId, date) => {
        return get().progress[habitId]?.[date] || null
      },
      
      // Optimized streak calculation
      getStreak: (habitId) => {
        const progress = get().progress[habitId] || {}
        const today = new Date()
        let streak = 0
        
        // Check backwards from today
        for (let i = 0; i < 365; i++) {  // Max 1 year
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() - i)
          const dateStr = checkDate.toISOString().split('T')[0]
          
          const dayProgress = progress[dateStr]
          if (dayProgress && dayProgress.completionPercentage >= 70) {
            streak++
          } else if (i > 0) {  // Allow today to be incomplete
            break
          }
        }
        
        return streak
      },
      
      // Get all stats at once (reduces multiple store accesses)
      getHabitStats: (habitId) => {
        const progress = get().progress[habitId] || {}
        const entries = Object.values(progress)
        
        return {
          streak: get().getStreak(habitId),
          totalPoints: entries.reduce((sum, day) => sum + (day.points || 0), 0),
          totalCompletions: entries.filter(day => day.completed).length
        }
      },
      
      getGoalProgress: (goalId) => {
        const state = get()
        const linkedHabits = state.habits.filter(h => h.goalId === goalId)
        
        if (linkedHabits.length === 0) return 0
        
        // Last 30 days progress
        const today = new Date()
        let totalScore = 0
        let maxPossibleScore = 0
        
        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() - i)
          const dateStr = checkDate.toISOString().split('T')[0]
          
          linkedHabits.forEach(habit => {
            const percentage = state.progress[habit.id]?.[dateStr]?.completionPercentage || 0
            totalScore += percentage
            maxPossibleScore += 100
          })
        }
        
        return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
      },
      
      getHabitsForGoal: (goalId) => {
        return get().habits.filter(habit => habit.goalId === goalId)
      }
    }),
    { name: 'habit-storage' }
  )
)

// Custom hooks for common patterns
export const useHabitProgress = (habitId: string, date: string = getToday()) => {
  return useHabitStore(state => state.getProgress(habitId, date))
}

export const useHabitStatsOptimized = (habitId: string) => {
  return useHabitStore(state => state.getHabitStats(habitId))
}

export const useTodayProgress = (habitId: string) => {
  const today = getToday()
  return useHabitStore(state => {
    const progress = state.getProgress(habitId, today)
    return {
      percentage: progress?.completionPercentage || 0,
      completed: progress?.completed || false,
      hasJournal: !!progress?.journalEntry
    }
  })
}