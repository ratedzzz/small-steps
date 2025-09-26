import { Container, Typography, Box, Button, Paper, Tabs, Tab } from '@mui/material'
import { Add, List, CalendarToday, Flag, EmojiEvents } from '@mui/icons-material'
import { useHabitStore } from './store'
import { useState, useEffect, useRef, useMemo } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import HabitCalendar from './components/HabitCalendar'
import GoalForm from './components/GoalForm'
import GoalList from './components/GoalList'


// Import the new badge and quote components
import { useBadgeSystem } from './hooks/useBadgeSystem'
import { BadgeGallery, BadgeSummaryWidget, NewBadgeNotification } from './components/BadgeDisplay'
import { DailyQuote } from './components/DailyQuote'
import { DailyQuoteWidget } from './components/DailyQuoteWidget'

// Import subscription system
import { SubscriptionProvider, useSubscription } from './hooks/useSubscription'
import { LimitReachedBanner } from './components/SubscriptionComponents'
import { SubscriptionDropdown } from './components/SubscriptionDropdown'



function AppContent() {
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [showBadgeGallery, setShowBadgeGallery] = useState(false)
  const [showFullQuote, setShowFullQuote] = useState(false)
  const [showSubscriptionDropdown, setShowSubscriptionDropdown] = useState(false)
  const upgradeButtonRef = useRef<HTMLButtonElement>(null)
  console.log('Current showSubscriptionDropdown state:', showSubscriptionDropdown);

  const { habits, goals } = useHabitStore()
  const { subscription, hasReachedLimit } = useSubscription()

  // Use useMemo to prevent recreating these arrays on every render
const convertedHabits = useMemo(() => habits.map(habit => ({
  id: habit.id || Math.random().toString(),
  title: habit.title || 'Untitled Habit',
  category: (habit as any).category || 'General',
  streak: (habit as any).streak || 0,
  lastCompleted: (habit as any).lastCompleted || null,
  completions: (habit as any).completions || []
})), [habits]);

const convertedGoals = useMemo(() => goals.map(goal => ({
  id: goal.id || Math.random().toString(),
  title: goal.title || 'Untitled Goal',
  category: (goal as any).category || 'General',
  isCompleted: (goal as any).isCompleted || (goal as any).completed || false,
  targetDate: (goal as any).targetDate || '2025-12-31',
  completedAt: (goal as any).completedAt
})), [goals]);
  // Initialize badge system
  const {
    earnedBadges,
    newBadges,
    userStats,
    totalPoints,
    userLevel,
    recentBadges,
    dismissNewBadge,
    checkForNewBadges
  } = useBadgeSystem({ habits: convertedHabits, goals: convertedGoals })

  // Trigger badge check when habits change
  useEffect(() => {
    if (habits.length > 0) {
      setTimeout(() => {
        checkForNewBadges()
      }, 500)
    }
  }, [habits, checkForNewBadges])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

 const handleUpgrade = () => {
  console.log('handleUpgrade called');
  console.log('showSubscriptionDropdown before:', showSubscriptionDropdown);
  setShowSubscriptionDropdown(true);
  console.log('setShowSubscriptionDropdown(true) called');
 }

  const canAddHabit = !hasReachedLimit('habits', habits.length)
  const canAddGoal = !hasReachedLimit('goals', goals.length)

  return (
    <>
      {/* Badge Notifications */}
      <div className="fixed right-4 top-4 z-50 space-y-4">
        {newBadges.map((badge) => (
          <div key={badge.id}>
            <NewBadgeNotification
              badge={badge}
              onClose={() => dismissNewBadge(badge.id)}
              onViewCollection={() => {
                setShowBadgeGallery(true)
                dismissNewBadge(badge.id)
              }}
            />
          </div>
        ))}
      </div>

      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Small Steps - Habit Tracker
          </Typography>

          {/* Subscription Info */}
<Box sx={{ mb: 2, p: 2, bgcolor: subscription.currentTier === 'free' ? 'grey.100' : 'primary.main', color: subscription.currentTier === 'free' ? 'text.primary' : 'white', borderRadius: 1 }}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography variant="body2">
      {subscription.plan.name} Plan - Current: {subscription.currentTier}
    </Typography>
    <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
      {subscription.currentTier !== 'pro' && (
        <Button
          ref={upgradeButtonRef}
          variant="contained"
          size="small"
          onClick={handleUpgrade}
        >
          Upgrade
        </Button>
      )}
      {/* Reset button */}
      <Button
        variant="outlined"
        size="small"
        sx={{ 
          color: subscription.currentTier === 'free' ? 'primary.main' : 'white',
          borderColor: subscription.currentTier === 'free' ? 'primary.main' : 'white'
        }}
        onClick={() => {
          localStorage.removeItem('subscription');
          window.location.reload();
        }}
      >
        Reset to Free
      </Button>
      
      {/* Subscription Dropdown - moved here to be relative to the button container */}
      <SubscriptionDropdown
        isOpen={showSubscriptionDropdown}
        onClose={() => setShowSubscriptionDropdown(false)}
        anchorRef={upgradeButtonRef}
      />
    </div>
  </Box>
</Box>

          {/* Daily Quote Widget */}
          <Box sx={{ mb: 3 }}>
            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
              <DailyQuoteWidget 
                habits={convertedHabits}
                goals={convertedGoals}
               />
            </Paper>
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab icon={<List />} label="Habits" />
              <Tab icon={<Flag />} label="Goals" />
              <Tab icon={<CalendarToday />} label="Calendar" />
              <Tab icon={<EmojiEvents />} label="Badges" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {currentTab === 0 && (
            <>
              {/* Habit Limit Banner */}
              <LimitReachedBanner
                limitType="habits"
                currentCount={habits.length}
                onUpgrade={handleUpgrade}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  Your Habits ({habits.length}/{subscription.plan.limits.maxHabits === 'unlimited' ? '∞' : subscription.plan.limits.maxHabits})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowHabitForm(true)}
                  disabled={!canAddHabit}
                >
                  Add Habit
                </Button>
              </Box>
              <HabitList />
            </>
          )}

          {currentTab === 1 && (
            <>
              {/* Goal Limit Banner */}
              <LimitReachedBanner
                limitType="goals"
                currentCount={goals.length}
                onUpgrade={handleUpgrade}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                  Your Goals ({goals.length}/{subscription.plan.limits.maxGoals === 'unlimited' ? '∞' : subscription.plan.limits.maxGoals})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowGoalForm(true)}
                  disabled={!canAddGoal}
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

          {/* New Badges Tab */}
          {currentTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Your Badge Collection
              </Typography>
              
              {/* Badge Summary Widget */}
              <Box sx={{ mb: 3 }}>
                <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
                  <BadgeSummaryWidget
                    earnedBadgeIds={earnedBadges}
                    recentBadges={recentBadges}
                    totalPoints={totalPoints}
                    userLevel={userLevel}
                  />
                </Paper>
              </Box>

              {/* Quick Actions */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setShowBadgeGallery(true)}
                >
                  View All Badges
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowFullQuote(true)}
                >
                  Today's Quote
                </Button>
              </Box>
            </Box>
          )}

          {/* Forms */}
          {showHabitForm && (
            <HabitForm onClose={() => setShowHabitForm(false)} />
          )}

          {showGoalForm && (
            <GoalForm onClose={() => setShowGoalForm(false)} />
          )}
        </Box>
      </Container>

      {/* Subscription Dropdown */}
      <SubscriptionDropdown
        isOpen={showSubscriptionDropdown}
        onClose={() => setShowSubscriptionDropdown(false)}
        anchorRef={upgradeButtonRef}
      />

      {/* Badge Gallery Modal */}
      {showBadgeGallery && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div className="h-full overflow-y-auto">
            <div className="min-h-full flex items-start justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl my-8">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">Badge Collection</h2>
                  <button
                    onClick={() => setShowBadgeGallery(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                  <BadgeGallery
                    earnedBadgeIds={earnedBadges}
                    userStats={userStats}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Quote Modal */}
      {showFullQuote && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Today's Inspiration</h2>
              <button
                onClick={() => setShowFullQuote(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <DailyQuote 
                habits={convertedHabits}
                goals={convertedGoals}
                className="shadow-none border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  )
}

export default App