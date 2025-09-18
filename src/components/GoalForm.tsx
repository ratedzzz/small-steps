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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Alert
} from '@mui/material'
import { AutoAwesome, Add } from '@mui/icons-material'
import { useHabitStore } from '../store'
import { generateHabitSuggestions } from '../utils/aiSuggestions'

interface GoalFormProps {
  onClose: () => void
}

const colorOptions = [
  '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', 
  '#00bcd4', '#009688', '#4caf50', '#ff9800'
]

const categoryOptions = [
  'Health & Fitness',
  'Learning & Education', 
  'Career & Work',
  'Personal Development',
  'Relationships',
  'Finance',
  'Hobbies',
  'Other'
]

const GoalForm = ({ onClose }: GoalFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [unit, setUnit] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [habitSuggestions, setHabitSuggestions] = useState<any[]>([])
  const addGoal = useHabitStore(state => state.addGoal)
  const addHabit = useHabitStore(state => state.addHabit)

  const generateSuggestions = () => {
    if (title.trim() || description.trim()) {
      const suggestions = generateHabitSuggestions(title, description)
      setHabitSuggestions(suggestions)
      setShowSuggestions(true)
    }
  }

  const addSuggestedHabit = (suggestion: any) => {
    // Add habit with a color that complements the goal
    const habitColors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2']
    const randomColor = habitColors[Math.floor(Math.random() * habitColors.length)]
    
    addHabit({
      title: suggestion.title,
      description: suggestion.description,
      color: randomColor,
      isActive: true
    })
  }

  const handleSubmit = () => {
    if (title.trim()) {
      addGoal({
        title: title.trim(),
        description: description.trim(),
        category: category || 'Other',
        targetValue: targetValue ? parseFloat(targetValue) : undefined,
        currentValue: 0,
        unit: unit.trim() || undefined,
        deadline: deadline || undefined,
        color: selectedColor,
        isActive: true
      })
      onClose()
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Goal</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            label="Goal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="e.g., Lose 20 pounds, Read 12 books"
          />
          
          <TextField
            fullWidth
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
            multiline
            rows={2}
            placeholder="Why is this goal important to you?"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Target (optional)"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              type="number"
              sx={{ flex: 1 }}
              placeholder="20"
            />
            <TextField
              label="Unit (optional)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              sx={{ flex: 1 }}
              placeholder="pounds, books, days"
            />
          </Box>

          <TextField
            fullWidth
            label="Deadline (optional)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            type="date"
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Choose a color:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
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

          {/* AI Suggestions Section */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Button
              onClick={generateSuggestions}
              disabled={!title.trim() && !description.trim()}
              startIcon={<AutoAwesome />}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            >
              Get AI Habit Suggestions
            </Button>
            
            {showSuggestions && (
              <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Suggested Habits for Your Goal:
                </Typography>
                <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  These habits are scientifically proven to help achieve goals like yours. Click to add them directly!
                </Alert>
                <List dense>
                  {habitSuggestions.map((suggestion, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton 
                        onClick={() => addSuggestedHabit(suggestion)}
                        sx={{ borderRadius: 1, mb: 0.5 }}
                      >
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Add sx={{ fontSize: 16 }} />
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {suggestion.title}
                              </Typography>
                              <Chip 
                                label={suggestion.difficulty} 
                                size="small" 
                                color={suggestion.difficulty === 'easy' ? 'success' : suggestion.difficulty === 'medium' ? 'warning' : 'error'}
                                sx={{ ml: 'auto' }}
                              />
                            </Box>
                          }
                          secondary={suggestion.description}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
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
          Create Goal
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default GoalForm