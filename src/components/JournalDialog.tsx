import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Slider,
  Chip,
  Rating
} from '@mui/material'
import { SentimentVeryDissatisfied, SentimentDissatisfied, SentimentNeutral, SentimentSatisfied, SentimentVerySatisfied } from '@mui/icons-material'
import { useHabitStore } from '../store'

interface JournalDialogProps {
  open: boolean
  onClose: () => void
  habitId: string
  date: string
  habitTitle: string
}

const JournalDialog = ({ open, onClose, habitId, date, habitTitle }: JournalDialogProps) => {
  const [journalEntry, setJournalEntry] = useState('')
  const [points, setPoints] = useState(0)
  const [mood, setMood] = useState(3)
  
  const { updateJournalEntry, getJournalEntry } = useHabitStore()

  useEffect(() => {
    if (open) {
      const existing = getJournalEntry(habitId, date)
      if (existing) {
        setJournalEntry(existing.entry)
        setPoints(existing.points || 0)
        setMood(existing.mood || 3)
      } else {
        setJournalEntry('')
        setPoints(0)
        setMood(3)
      }
    }
  }, [open, habitId, date, getJournalEntry])

  const handleSave = () => {
    updateJournalEntry(habitId, date, journalEntry, points, mood)
    onClose()
  }

  const formatDate = (dateStr: string) => {
    // Parse the date string and create date in local timezone
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month - 1 because JS months are 0-indexed
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getMoodIcon = (value: number) => {
    switch (value) {
      case 1: return <SentimentVeryDissatisfied />
      case 2: return <SentimentDissatisfied />
      case 3: return <SentimentNeutral />
      case 4: return <SentimentSatisfied />
      case 5: return <SentimentVerySatisfied />
      default: return <SentimentNeutral />
    }
  }

  const getMoodLabel = (value: number) => {
    switch (value) {
      case 1: return 'Very Difficult'
      case 2: return 'Difficult'
      case 3: return 'Okay'
      case 4: return 'Good'
      case 5: return 'Excellent'
      default: return 'Okay'
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h6">{habitTitle}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(date)}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* Journal Entry */}
          <TextField
            fullWidth
            label="How did it go today?"
            placeholder="Reflect on your progress, challenges, wins, or thoughts about this habit..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />

          {/* Points Slider */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Progress Points (0-10)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Rate how well you did with this habit today
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={points}
                onChange={(_, newValue) => setPoints(newValue as number)}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={10}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">Didn't do it</Typography>
                <Typography variant="caption">Perfect!</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Chip 
                label={`${points} points`} 
                color={points >= 7 ? 'success' : points >= 4 ? 'warning' : 'default'}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Mood Rating */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              How did you feel about it?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Rating
                value={mood}
                onChange={(_, newValue) => setMood(newValue || 3)}
                max={5}
                IconContainerComponent={({ value, ...other }) => (
                  <span {...other}>
                    {getMoodIcon(value)}
                  </span>
                )}
              />
              <Typography variant="body2" color="text.secondary">
                {getMoodLabel(mood)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Entry
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default JournalDialog