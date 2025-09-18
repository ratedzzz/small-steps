import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Habit {
  id: string
  title: string
  description: string
  color: string
  createdAt: string
  isActive: boolean
  goalId?: string
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

interface Progress {
  [habitId: string]: {
    [date: string]: {
      completed: boolean
      completionPercentage: number
      notes?: string
      timestamp: number
      journalEntry?: string
      points?: number
      mood?: number
    }
  }
}

interface HabitStore {
  habits: Habit[]
  goals: Goal[]
  progress: Progress
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  linkHabitToGoal: (habitId: string, goalId: string) => void
  unlinkHabitFromGoal: (habitId: string) => void
  toggleProgress: (habitId: string, date: string, notes?: string) => void
  updateHabitProgress: (habitId: string, date: string, percentage: number) => void
  updateJournalEntry: (habitId: string, date: string, entry: string, points?: number, mood?: number) => void
  getHabitProgress: (habitId: string, date: string) => boolean
  getHabitPercentage: (habitId: string, date: string) => number
  getJournalEntry: (habitId: string, date: string) => { entry: string; points?: number; mood?: number } | null
  getStreak: (habitId: string) => number
  getTotalPoints: (habitId: string) => number
  getGoalProgress: (goalId: string) => number
  getHabitsForGoal: (goalId: string) => Habit[]
}

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
          isActive: true
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
      
      toggleProgress: (habitId, date, notes = '') => {
        set((state) => {
          const current = state.progress[habitId]?.[date]?.completed || false
          const existing = state.progress[habitId]?.[date] || {}
          return {
            progress: {
              ...state.progress,
              [habitId]: {
                ...state.progress[habitId],
                [date]: {
                  ...existing,
                  completed: !current,
                  completionPercentage: !current ? 100 : 0,
                  notes,
                  timestamp: Date.now()
                }
              }
            }
          }
        })
      },
      
      updateHabitProgress: (habitId, date, percentage) => {
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
                  timestamp: Date.now()
                }
              }
            }
          }
        })
      },
      
      updateJournalEntry: (habitId, date, entry, points = 0, mood = 3) => {
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
                  points: points,
                  mood: mood,
                  timestamp: Date.now()
                }
              }
            }
          }
        })
      },
      
      getHabitProgress: (habitId, date) => {
        return get().progress[habitId]?.[date]?.completed || false
      },
      
      getHabitPercentage: (habitId, date) => {
        return get().progress[habitId]?.[date]?.completionPercentage || 0
      },
      
      getJournalEntry: (habitId, date) => {
        const entry = get().progress[habitId]?.[date]
        if (entry?.journalEntry) {
          return {
            entry: entry.journalEntry,
            points: entry.points || 0,
            mood: entry.mood || 3
          }
        }
        return null
      },
      
      getStreak: (habitId) => {
        const progress = get().progress[habitId] || {}
        const today = new Date()
        let streak = 0
        
        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(today.getDate() - i)
          const dateStr = checkDate.toISOString().split('T')[0]
          
          if ((progress[dateStr]?.completionPercentage || 0) >= 70) {
            streak++
          } else {
            break
          }
        }
        
        return streak
      },
      
      getTotalPoints: (habitId) => {
        const progress = get().progress[habitId] || {}
        return Object.values(progress).reduce((total, day) => {
          return total + (day.points || 0)
        }, 0)
      },
      
      getGoalProgress: (goalId) => {
        const state = get()
        const linkedHabits = state.habits.filter(habit => habit.goalId === goalId)
        
        if (linkedHabits.length === 0) return 0
        
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