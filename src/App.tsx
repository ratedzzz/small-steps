import { Container, Typography, Box, Button, Paper, Tabs, Tab } from '@mui/material'
import { Add, List, CalendarToday, Flag } from '@mui/icons-material'
import { useHabitStore } from './store'
import { useState } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import HabitCalendar from './components/HabitCalendar'
import GoalForm from './components/GoalForm'
import GoalList from './components/GoalList'

function App() {
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const { habits, goals } = useHabitStore()

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Small Steps - Habit Tracker
        </Typography>
        
        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab icon={<List />} label="Habits" />
            <Tab icon={<Flag />} label="Goals" />
            <Tab icon={<CalendarToday />} label="Calendar" />
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        {currentTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                Your Habits ({habits.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowHabitForm(true)}
              >
                Add Habit
              </Button>
            </Box>
            <HabitList />
          </>
        )}
        
        {currentTab === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                Your Goals ({goals.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowGoalForm(true)}
              >
                Add Goal
              </Button>
            </Box>
            <GoalList />
          </>
        )}
        
        {currentTab === 2 && (
          <HabitCalendar />
        )}
        
        {showHabitForm && (
          <HabitForm onClose={() => setShowHabitForm(false)} />
        )}
        
        {showGoalForm && (
          <GoalForm onClose={() => setShowGoalForm(false)} />
        )}
      </Box>
    </Container>
  )
}

export default App