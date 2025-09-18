import React, { useState } from 'react'
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { ChevronLeft, ChevronRight, CheckCircle, Edit } from '@mui/icons-material'
import { useHabitStore } from '../store'
import JournalDialog from './JournalDialog'
import DayDetailDialog from './DayDetailDialog'

const HabitCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedHabit, setSelectedHabit] = useState<string>('all')
  const [journalDialog, setJournalDialog] = useState<{ open: boolean; habitId: string; date: string; habitTitle: string } | null>(null)
  const [habitSelector, setHabitSelector] = useState<{ open: boolean; date: string } | null>(null)
  const { habits, goals, getHabitProgress, getJournalEntry, getGoalProgress } = useHabitStore()

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getDateString = (day: number) => {
    const date = new Date(year, month, day)
    // Use local timezone to avoid off-by-one date issues
    const localYear = date.getFullYear()
    const localMonth = String(date.getMonth() + 1).padStart(2, '0')
    const localDay = String(date.getDate()).padStart(2, '0')
    return `${localYear}-${localMonth}-${localDay}`
  }

  const getGoalEvents = (day: number) => {
    const dateStr = getDateString(day)
    const currentDate = new Date(year, month, day)
    
    return goals.filter(goal => {
      if (!goal.deadline) return false
      const deadlineDate = new Date(goal.deadline)
      return deadlineDate.toDateString() === currentDate.toDateString()
    })
  }

  const getGoalMilestones = (day: number) => {
    const dateStr = getDateString(day)
    const currentDate = new Date(year, month, day)
    
    // Check if it's a milestone day (every 7 days from goal creation)
    return goals.filter(goal => {
      const createdDate = new Date(goal.createdAt)
      const daysDiff = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff > 0 && daysDiff % 7 === 0 && daysDiff <= 30 // Only show first month of milestones
    })
  }

  const getCompletionData = (day: number) => {
    const dateStr = getDateString(day)
    
    if (selectedHabit === 'all') {
      const habitData = habits.map(habit => {
        const { getHabitPercentage } = useHabitStore.getState()
        const percentage = getHabitPercentage(habit.id, dateStr)
        return {
          habit,
          percentage,
          color: habit.color
        }
      })
      
      const totalPercentage = habitData.reduce((sum, h) => sum + h.percentage, 0) / habits.length
      
      return {
        percentage: totalPercentage,
        habitData: habitData.filter(h => h.percentage > 0), // Only show habits with progress
        completed: habitData.filter(h => h.percentage >= 100).length,
        total: habits.length
      }
    } else {
      const { getHabitPercentage } = useHabitStore.getState()
      const percentage = getHabitPercentage(selectedHabit, dateStr)
      const habit = habits.find(h => h.id === selectedHabit)
      return {
        percentage: percentage,
        habitData: percentage > 0 && habit ? [{ habit, percentage, color: habit.color }] : [],
        completed: percentage >= 100 ? 1 : 0,
        total: 1
      }
    }
  }

  const getCellColor = (day: number) => {
    const data = getCompletionData(day)
    
    // If viewing individual habit, use single color
    if (selectedHabit !== 'all') {
      const percentage = data.percentage
      if (percentage >= 100) return '#4caf50'
      if (percentage >= 70) return '#8bc34a'
      if (percentage >= 40) return '#ffeb3b'
      if (percentage > 0) return '#ff9800'
      return 'transparent'
    }
    
    // If viewing all habits, use light background
    return data.habitData.length > 0 ? '#f8f9fa' : 'transparent'
  }

  // Create calendar days array
  const calendarDays = []
  
  // Empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Habit Calendar
        </Typography>
        
        {/* Habit Filter */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>View Habits</InputLabel>
          <Select
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            label="View Habits"
          >
            <MenuItem value="all">All Habits</MenuItem>
            {habits.map(habit => (
              <MenuItem key={habit.id} value={habit.id}>
                {habit.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Calendar Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <IconButton onClick={goToPreviousMonth}>
            <ChevronLeft />
          </IconButton>
          
          <Typography variant="h6">
            {monthNames[month]} {year}
          </Typography>
          
          <IconButton onClick={goToNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} label="100%" />
          <Chip size="small" sx={{ bgcolor: '#8bc34a', color: 'white' }} label="70%+" />
          <Chip size="small" sx={{ bgcolor: '#ffeb3b', color: 'black' }} label="40%+" />
          <Chip size="small" sx={{ bgcolor: '#ff9800', color: 'white' }} label="<40%" />
          <Chip size="small" variant="outlined" label="0%" />
          <Chip size="small" sx={{ bgcolor: 'purple', color: 'white' }} label="Goal Deadline" />
          <Chip size="small" sx={{ bgcolor: 'purple', color: 'white', opacity: 0.6 }} label="Goal Milestone" />
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {/* Day headers */}
        {dayNames.map(day => (
          <Box key={day} sx={{ 
            textAlign: 'center', 
            py: 1, 
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            {day}
          </Box>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dateStr = day ? getDateString(day) : ''
          const data = day ? getCompletionData(day) : null
          const hasJournal = day && selectedHabit !== 'all' ? 
            getJournalEntry(selectedHabit, dateStr) : null
          const goalEvents = day ? getGoalEvents(day) : []
          const goalMilestones = day ? getGoalMilestones(day) : []
          
          return (
            <Box 
              key={index} 
              sx={{ 
                minHeight: 60, // Increased height to show goals
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: day ? getCellColor(day) : 'transparent',
                borderRadius: 1,
                position: 'relative',
                border: day && year === today.getFullYear() && 
                        month === today.getMonth() && 
                        day === today.getDate() 
                        ? '2px solid #1976d2' : 'none',
                cursor: day ? 'pointer' : 'default',
                padding: 0.5,
                '&:hover': day ? {
                  backgroundColor: day ? 
                    `${getCellColor(day) === 'transparent' ? '#f5f5f5' : getCellColor(day)}dd` : 
                    'transparent'
                } : {}
              }}
              onClick={() => {
                if (day) {
                  if (selectedHabit !== 'all') {
                    const habit = habits.find(h => h.id === selectedHabit)
                    if (habit) {
                      setJournalDialog({
                        open: true,
                        habitId: selectedHabit,
                        date: dateStr,
                        habitTitle: habit.title
                      })
                    }
                  } else {
                    // If "all habits" is selected, show habit selector
                    setHabitSelector({
                      open: true,
                      date: dateStr
                    })
                  }
                }
              }}
            >
              {day && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {day}
                  </Typography>
                  
                  {/* Goal Deadlines */}
                  {goalEvents.map((goal, idx) => (
                    <Box
                      key={`deadline-${idx}`}
                      sx={{
                        width: '100%',
                        height: 3,
                        backgroundColor: goal.color,
                        borderRadius: 1,
                        mb: 0.25,
                        opacity: 0.9
                      }}
                      title={`Goal deadline: ${goal.title}`}
                    />
                  ))}
                  
                  {/* Goal Milestones */}
                  {goalMilestones.map((goal, idx) => (
                    <Box
                      key={`milestone-${idx}`}
                      sx={{
                        width: 8,
                        height: 2,
                        backgroundColor: goal.color,
                        borderRadius: 0.5,
                        mb: 0.25,
                        opacity: 0.6
                      }}
                      title={`Goal milestone: ${goal.title}`}
                    />
                  ))}
                  
                  {/* Show habit color indicators when viewing all habits */}
                  {selectedHabit === 'all' && data && data.habitData.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 0.25, 
                      justifyContent: 'center',
                      position: 'absolute',
                      bottom: 2,
                      left: 2,
                      right: 2
                    }}>
                      {data.habitData.map((habitInfo, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            width: 6,
                            height: 6,
                            backgroundColor: habitInfo.color,
                            borderRadius: '50%',
                            opacity: habitInfo.percentage >= 100 ? 1 : 
                                   habitInfo.percentage >= 70 ? 0.8 :
                                   habitInfo.percentage >= 40 ? 0.6 : 0.4
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  {/* Show check mark and journal icon for individual habits */}
                  {selectedHabit !== 'all' && (
                    <Box sx={{ position: 'absolute', bottom: 2, right: 2, display: 'flex', gap: 0.5 }}>
                      {data && data.completed > 0 && (
                        <CheckCircle sx={{ 
                          fontSize: 12, 
                          color: 'rgba(255,255,255,0.8)'
                        }} />
                      )}
                      {hasJournal && (
                        <Edit sx={{ 
                          fontSize: 10, 
                          color: 'rgba(255,255,255,0.9)'
                        }} />
                      )}
                    </Box>
                  )}
                </>
              )}
            </Box>
          )
        })}
      </Box>
      
      {/* Day Detail Dialog */}
      {habitSelector && (
        <DayDetailDialog
          open={habitSelector.open}
          onClose={() => setHabitSelector(null)}
          date={habitSelector.date}
          onSelectHabit={(habitId, habitTitle) => {
            setJournalDialog({
              open: true,
              habitId,
              date: habitSelector.date,
              habitTitle
            })
          }}
        />
      )}
      
      {/* Journal Dialog */}
      {journalDialog && (
        <JournalDialog
          open={journalDialog.open}
          onClose={() => setJournalDialog(null)}
          habitId={journalDialog.habitId}
          date={journalDialog.date}
          habitTitle={journalDialog.habitTitle}
        />
      )}
    </Paper>
  )
}

export default HabitCalendar