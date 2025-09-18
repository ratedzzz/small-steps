import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  Typography
} from '@mui/material'
import { Psychology } from '@mui/icons-material'
import { useHabitStore } from '../store'
import HabitImplementationTips from './HabitImplementationTips'

interface HabitFormProps {
  onClose: () => void
}

const colorOptions = [
  '#1976d2', '#388e3c', '#f57c00', '#d32f2f', 
  '#7b1fa2', '#00796b', '#455a64', '#c62828'
]

const HabitForm = ({ onClose }: HabitFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [showTips, setShowTips] = useState(false)
  const addHabit = useHabitStore(state => state.addHabit)

  const handleSubmit = () => {
    if (title.trim()) {
      addHabit({
        title: title.trim(),
        description: description.trim(),
        color: selectedColor,
        isActive: true
      })
      
      // Show implementation tips for the newly created habit
      setShowTips(true)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Habit</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Habit Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="e.g., Drink 8 glasses of water"
          />
          
          <TextField
            fullWidth
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
            multiline
            rows={2}
            placeholder="Why is this habit important to you?"
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Choose a color:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {colorOptions.map((color) => (
              <Chip
                key={color}
                onClick={() => setSelectedColor(color)}
                sx={{
                  backgroundColor: color,
                  color: 'white',
                  border: selectedColor === color ? '3px solid #000' : 'none',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  '& .MuiChip-label': { display: 'none' }
                }}
                label=""
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!title.trim()}
        >
          Create Habit
        </Button>
      </DialogActions>
      
      {/* Implementation Tips Dialog */}
      {showTips && (
        <HabitImplementationTips
          open={showTips}
          onClose={() => {
            setShowTips(false)
            onClose()
          }}
          habitTitle={title}
        />
      )}
    </Dialog>
  )
}

export default HabitForm