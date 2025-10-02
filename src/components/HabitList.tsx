// src/components/HabitList.tsx - Refactored to use optimized store

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
import { useHabitStore, useTodayProgress, useHabitStatsOptimized } from '../store'
import JournalDialog from './JournalDialog'

const HabitList = () => {
  const habits = useHabitStore(state => state.habits)
  const setProgress = useHabitStore(state => state.setProgress)
  const [journalDialog, setJournalDialog] = useState<{ open: boolean; habitId: string; habitTitle: string } | null>(null)
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null)

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
      {habits.map((habit) => (
        <HabitCard 
          key={habit.id}
          habit={habit}
          isExpanded={expandedHabit === habit.id}
          onToggleExpand={() => setExpandedHabit(expandedHabit === habit.id ? null : habit.id)}
          onOpenJournal={() => setJournalDialog({ 
            open: true, 
            habitId: habit.id, 
            habitTitle: habit.title 
          })}
          onUpdateProgress={(percentage) => {
            const today = new Date().toISOString().split('T')[0]
            setProgress(habit.id, today, percentage)
          }}
        />
      ))}
      
      {/* Journal Dialog */}
      {journalDialog && (
        <JournalDialog
          open={journalDialog.open}
          onClose={() => setJournalDialog(null)}
          habitId={journalDialog.habitId}
          date={new Date().toISOString().split('T')[0]}
          habitTitle={journalDialog.habitTitle}
        />
      )}
    </Stack>
  )
}

// Separate component for better performance
interface HabitCardProps {
  habit: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpenJournal: () => void;
  onUpdateProgress: (percentage: number) => void;
}

function HabitCard({ habit, isExpanded, onToggleExpand, onOpenJournal, onUpdateProgress }: HabitCardProps) {
  // Use optimized hooks
  const { percentage, completed, hasJournal } = useTodayProgress(habit.id)
  const { streak, totalPoints } = useHabitStatsOptimized(habit.id)

  return (
    <Paper sx={{ p: 3 }}>
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
            {hasJournal && (
              <Chip 
                label="Has journal" 
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
              onClick={onToggleExpand}
              variant="outlined"
              color="primary"
            >
              {percentage > 0 ? `${percentage}%` : 'Set Progress'}
            </Button>
            
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={onOpenJournal}
              variant="outlined"
              color="secondary"
            >
              {hasJournal ? 'Edit Journal' : 'Add Journal'}
            </Button>
          </Box>
          
          {/* Progress slider (expanded) */}
          {isExpanded && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Progress for today: {percentage}%
              </Typography>
              <Slider
                value={percentage}
                onChange={(_, newValue) => onUpdateProgress(newValue as number)}
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
              color: completed ? 'success.main' : 'text.secondary'
            }}
            disabled
          >
            {completed ? <CheckCircle /> : <CheckCircleOutline />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default HabitList