import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { Psychology, ExpandMore, Science } from '@mui/icons-material'
import { generateImplementationTips } from '../utils/aiSuggestions'

interface HabitImplementationTipsProps {
  open: boolean
  onClose: () => void
  habitTitle: string
}

const HabitImplementationTips = ({ open, onClose, habitTitle }: HabitImplementationTipsProps) => {
  const [tips] = useState(() => generateImplementationTips(habitTitle))

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'  
      case 'advanced': return 'error'
      default: return 'default'
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology />
          <Typography variant="h6">
            AI Implementation Tips for "{habitTitle}"
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          These strategies are based on behavioral psychology research and have been proven effective for building lasting habits.
        </Alert>

        <Typography variant="h6" gutterBottom>
          Recommended Implementation Strategies:
        </Typography>

        {tips.map((tip, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', flex: 1 }}>
                  {tip.strategy}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {tip.scienceBased && (
                    <Chip 
                      icon={<Science />}
                      label="Science-Based" 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  <Chip 
                    label={tip.difficulty} 
                    size="small" 
                    color={getDifficultyColor(tip.difficulty)}
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {tip.description}
              </Typography>
              
              {/* Specific examples based on strategy */}
              {tip.strategy === 'Habit Stacking' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Example for your habit:</Typography>
                  <Typography variant="body2">
                    "After I pour my morning coffee, I will {habitTitle.toLowerCase()}"
                  </Typography>
                </Box>
              )}
              
              {tip.strategy === 'Implementation Intentions' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Example for your habit:</Typography>
                  <Typography variant="body2">
                    "At 7:00 AM in my living room, I will {habitTitle.toLowerCase()}"
                  </Typography>
                </Box>
              )}
              
              {tip.strategy === 'Start Ridiculously Small' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>Tiny version of your habit:</Typography>
                  <Typography variant="body2">
                    Start with just 2 minutes of "{habitTitle.toLowerCase()}" - focus on showing up consistently rather than doing it perfectly.
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        <Paper sx={{ mt: 3, p: 2, bgcolor: 'warning.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Pro Tip: The 1% Rule
          </Typography>
          <Typography variant="body2">
            Focus on getting 1% better each day rather than dramatic changes. Small improvements compound over time to create remarkable results.
          </Typography>
        </Paper>

        <Paper sx={{ mt: 2, p: 2, bgcolor: 'info.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Implementation Priority:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Week 1-2: Start ridiculously small" 
                secondary="Build the routine before worrying about results"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Week 3-4: Add habit stacking" 
                secondary="Link to existing routines for consistency"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Month 2+: Optimize environment" 
                secondary="Remove friction and add supportive cues"
              />
            </ListItem>
          </List>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Got It!
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default HabitImplementationTips