import { 
  Paper, 
  Box, 
  Typography, 
  IconButton, 
  Chip,
  Stack,
  Button,
  Slider
} from '@mui/material'
import { CheckCircle, CheckCircleOutline, Edit, Star, TrendingUp } from '@mui/icons-material'
import { useState } from 'react'
import { useHabitStore } from '../store'
import JournalDialog from './JournalDialog'

const HabitList = () => {
  const { habits, getHabitProgress, getHabitPercentage, getStreak, getTotalPoints, getJournalEntry, updateHabitProgress } = useHabitStore()
  const [journalDialog, setJournalDialog] = useState<{ open: boolean; habitId: string; habitTitle: string } | null>(null)
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null)
  const today = new Date().toISOString().split('T')[0]

  if (habits.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No habits yet!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Add Habit" to get started on your journey.
        </Typography>
      </Paper>
    )
  }

  return (
    <Stack spacing={2}>
      {habits.map((habit) => {
        const isCompleted = getHabitProgress(habit.id, today)
        const percentage = getHabitPercentage(habit.id, today)
        const streak = getStreak(habit.id)
        const totalPoints = getTotalPoints(habit.id)
        const todayJournal = getJournalEntry(habit.id, today)
        
        return (
          <Paper key={habit.id} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Color indicator */}
              <Box
                sx={{
                  width: 12,
                  height: 40,
                  backgroundColor: habit.color,
                  borderRadius: 1
                }}
              />
              
              {/* Habit content */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" component="h3">
                    {habit.title}
                  </Typography>
                  {totalPoints > 0 && (
                    <Chip
                      icon={<Star />}
                      label={`${totalPoints} pts`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {habit.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {habit.description}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 1 }}>
                  {/* Progress percentage */}
                  {percentage > 0 && (
                    <Chip 
                      label={`${percentage}% today`} 
                      size="small" 
                      color={percentage === 100 ? 'success' : percentage >= 70 ? 'info' : percentage >= 40 ? 'warning' : 'error'}
                      variant="filled"
                    />
                  )}
                  
                  {/* Streak indicator */}
                  {streak > 0 && (
                    <Typography variant="caption" color="orange" sx={{ fontWeight: 'bold' }}>
                      🔥 {streak} day streak
                    </Typography>
                  )}
                  
                  {/* Today's journal indicator */}
                  {todayJournal && (
                    <Chip 
                      label={`${todayJournal.points} pts journal`} 
                      size="small" 
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>
                
                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    startIcon={<TrendingUp />}
                    onClick={() => setExpandedHabit(expandedHabit === habit.id ? null : habit.id)}
                    variant="outlined"
                    color="primary"
                  >
                    {percentage > 0 ? `${percentage}%` : 'Set Progress'}
                  </Button>
                  
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => setJournalDialog({ 
                      open: true, 
                      habitId: habit.id, 
                      habitTitle: habit.title 
                    })}
                    variant="outlined"
                    color="secondary"
                  >
                    {todayJournal ? 'Edit Journal' : 'Add Journal'}
                  </Button>
                </Box>
                
                {/* Progress slider (expanded) */}
                {expandedHabit === habit.id && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Progress for today: {percentage}%
                    </Typography>
                    <Slider
                      value={percentage}
                      onChange={(_, newValue) => updateHabitProgress(habit.id, today, newValue as number)}
                      valueLabelDisplay="auto"
                      step={10}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' }
                      ]}
                      min={0}
                      max={100}
                    />
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <Chip 
                        label={percentage === 100 ? 'Perfect!' : percentage >= 70 ? 'Great!' : percentage >= 40 ? 'Good!' : percentage > 0 ? 'Some progress' : 'Not started'}
                        color={percentage === 100 ? 'success' : percentage >= 70 ? 'info' : percentage >= 40 ? 'warning' : percentage > 0 ? 'error' : 'default'}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
              
              {/* Completion status indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  sx={{ 
                    color: isCompleted ? 'success.main' : 'text.secondary'
                  }}
                  disabled
                >
                  {isCompleted ? <CheckCircle /> : <CheckCircleOutline />}
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )
      })}
      
      {/* Journal Dialog */}
      {journalDialog && (
        <JournalDialog
          open={journalDialog.open}
          onClose={() => setJournalDialog(null)}
          habitId={journalDialog.habitId}
          date={today}
          habitTitle={journalDialog.habitTitle}
        />
      )}
    </Stack>
  )
}

export default HabitList