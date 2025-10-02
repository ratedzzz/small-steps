// src/components/GoalList.tsx - Refactored to use optimized store

import { 
  Paper, 
  Box, 
  Typography, 
  Chip,
  Stack,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material'
import { Link, LinkOff, Flag, CheckCircle } from '@mui/icons-material'
import { useState } from 'react'
import { useHabitStore } from '../store'

const GoalList = () => {
  const goals = useHabitStore(state => state.goals)
  const habits = useHabitStore(state => state.habits)
  const getGoalProgress = useHabitStore(state => state.getGoalProgress)
  const getHabitsForGoal = useHabitStore(state => state.getHabitsForGoal)
  const linkHabitToGoal = useHabitStore(state => state.linkHabitToGoal)
  const unlinkHabitFromGoal = useHabitStore(state => state.unlinkHabitFromGoal)
  
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [linkingMode, setLinkingMode] = useState<string | null>(null)

  if (goals.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No goals yet!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Add Goal" to set your first objective.
        </Typography>
      </Paper>
    )
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null
    const date = new Date(deadline)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `${diffDays} days left`
  }

  const unlinkedHabits = habits.filter(habit => !habit.goalId)

  return (
    <Stack spacing={2}>
      {goals.map((goal) => {
        const progress = getGoalProgress(goal.id)
        const linkedHabits = getHabitsForGoal(goal.id)
        const isExpanded = expandedGoal === goal.id
        const isLinking = linkingMode === goal.id
        const deadlineInfo = formatDeadline(goal.deadline)
        
        return (
          <Paper key={goal.id} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Color indicator */}
              <Box
                sx={{
                  width: 12,
                  height: 40,
                  backgroundColor: goal.color,
                  borderRadius: 1
                }}
              />
              
              {/* Goal content */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6" component="h3">
                    {goal.title}
                  </Typography>
                  <Chip
                    icon={<Flag />}
                    label={goal.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                {goal.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {goal.description}
                  </Typography>
                )}

                {/* Progress bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                  {/* Target and deadline info */}
                  {goal.targetValue && (
                    <Chip 
                      label={`Target: ${goal.targetValue}${goal.unit ? ` ${goal.unit}` : ''}`}
                      size="small" 
                      variant="outlined"
                    />
                  )}
                  
                  {deadlineInfo && (
                    <Chip 
                      label={deadlineInfo}
                      size="small" 
                      color={deadlineInfo.includes('overdue') ? 'error' : deadlineInfo.includes('today') || deadlineInfo.includes('tomorrow') ? 'warning' : 'default'}
                      variant="outlined"
                    />
                  )}

                  <Chip 
                    label={`${linkedHabits.length} habit${linkedHabits.length !== 1 ? 's' : ''}`}
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                
                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    startIcon={<Link />}
                    onClick={() => setLinkingMode(isLinking ? null : goal.id)}
                    variant="outlined"
                    color={isLinking ? 'error' : 'primary'}
                  >
                    {isLinking ? 'Cancel' : 'Link Habits'}
                  </Button>
                  
                  <Button
                    size="small"
                    onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                    variant="outlined"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </Button>
                </Box>

                {/* Expanded details */}
                {isExpanded && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Linked Habits:
                    </Typography>
                    {linkedHabits.length > 0 ? (
                      <List dense>
                        {linkedHabits.map((habit) => (
                          <ListItem 
                            key={habit.id}
                            secondaryAction={
                              <Button 
                                size="small"
                                startIcon={<LinkOff />}
                                onClick={() => unlinkHabitFromGoal(habit.id)}
                              >
                                Unlink
                              </Button>
                            }
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: habit.color,
                                borderRadius: '50%',
                                mr: 1
                              }}
                            />
                            <ListItemText primary={habit.title} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No habits linked yet. Click "Link Habits" to connect habits to this goal.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Habit linking interface */}
                {isLinking && unlinkedHabits.length > 0 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Select habits to link to this goal:
                    </Typography>
                    <List dense>
                      {unlinkedHabits.map((habit) => (
                        <ListItem key={habit.id} disablePadding>
                          <ListItemButton 
                            onClick={() => {
                              linkHabitToGoal(habit.id, goal.id)
                              setLinkingMode(null)
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: habit.color,
                                borderRadius: '50%',
                                mr: 1
                              }}
                            />
                            <ListItemText primary={habit.title} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {isLinking && unlinkedHabits.length === 0 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      All habits are already linked to goals. Create new habits to link them here.
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Progress indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={progress >= 80 ? <CheckCircle /> : <Flag />}
                  label={`${progress}%`}
                  color={progress >= 80 ? 'success' : 'default'}
                  variant="filled"
                />
              </Box>
            </Box>
          </Paper>
        )
      })}
    </Stack>
  )
}

export default GoalList