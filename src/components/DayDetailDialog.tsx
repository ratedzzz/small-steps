import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
  Paper
} from '@mui/material'
import { Flag, Edit, CheckCircle } from '@mui/icons-material'
import { useHabitStore } from '../store'

interface DayDetailDialogProps {
  open: boolean
  onClose: () => void
  onSelectHabit: (habitId: string, habitTitle: string) => void
  date: string
}

const DayDetailDialog = ({ open, onClose, onSelectHabit, date }: DayDetailDialogProps) => {
  const { habits, goals, getGoalProgress } = useHabitStore()

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Get goal events for this date
  const getGoalEvents = () => {
    const [year, month, day] = date.split('-').map(Number)
    const currentDate = new Date(year, month - 1, day)
    
    return goals.filter(goal => {
      if (!goal.deadline) return false
      const deadlineDate = new Date(goal.deadline)
      return deadlineDate.toDateString() === currentDate.toDateString()
    })
  }

  // Get goal milestones for this date
  const getGoalMilestones = () => {
    const [year, month, day] = date.split('-').map(Number)
    const currentDate = new Date(year, month - 1, day)
    
    return goals.filter(goal => {
      const createdDate = new Date(goal.createdAt)
      const daysDiff = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff > 0 && daysDiff % 7 === 0 && daysDiff <= 30
    })
  }

  const goalEvents = getGoalEvents()
  const goalMilestones = getGoalMilestones()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Daily Overview</Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(date)}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Goal Deadlines Section */}
        {goalEvents.length > 0 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Flag color="error" />
                Goal Deadlines
              </Typography>
              {goalEvents.map((goal) => {
                const progress = getGoalProgress(goal.id)
                return (
                  <Paper key={goal.id} sx={{ p: 2, mb: 1, bgcolor: 'error.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: goal.color,
                          borderRadius: '50%'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {goal.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {goal.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={`${progress}% Complete`} size="small" color="primary" />
                          <Chip label={goal.category} size="small" variant="outlined" />
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )
              })}
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Goal Milestones Section */}
        {goalMilestones.length > 0 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle color="primary" />
                Goal Milestones
              </Typography>
              {goalMilestones.map((goal) => {
                const progress = getGoalProgress(goal.id)
                const createdDate = new Date(goal.createdAt)
                const [year, month, day] = date.split('-').map(Number)
                const currentDate = new Date(year, month - 1, day)
                const daysDiff = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
                const weekNumber = Math.floor(daysDiff / 7)
                
                return (
                  <Paper key={goal.id} sx={{ p: 2, mb: 1, bgcolor: 'primary.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: goal.color,
                          borderRadius: '50%'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {goal.title} - Week {weekNumber} Check-in
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time to review your progress and adjust if needed
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={`${progress}% Complete`} size="small" color="primary" />
                          <Chip label="Milestone" size="small" variant="outlined" />
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )
              })}
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Habits Section */}
        <Box>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Edit color="action" />
            Journal About Your Habits
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose a habit to add progress notes and reflections for this day:
          </Typography>
          <List>
            {habits.map((habit) => (
              <ListItem key={habit.id} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    onSelectHabit(habit.id, habit.title)
                    onClose()
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: habit.color,
                      borderRadius: '50%',
                      mr: 2
                    }}
                  />
                  <ListItemText 
                    primary={habit.title}
                    secondary={habit.description}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Empty State */}
        {goalEvents.length === 0 && goalMilestones.length === 0 && habits.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nothing scheduled for this day
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No goal deadlines, milestones, or habits to track
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DayDetailDialog