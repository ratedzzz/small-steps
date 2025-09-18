import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography
} from '@mui/material'
import { useHabitStore } from '../store'

interface HabitSelectorDialogProps {
  open: boolean
  onClose: () => void
  onSelectHabit: (habitId: string, habitTitle: string) => void
  date: string
}

const HabitSelectorDialog = ({ open, onClose, onSelectHabit, date }: HabitSelectorDialogProps) => {
  const habits = useHabitStore(state => state.habits)

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Choose a habit to journal about</Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(date)}
        </Typography>
      </DialogTitle>
      <DialogContent>
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
                    width: 12,
                    height: 12,
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
      </DialogContent>
    </Dialog>
  )
}

export default HabitSelectorDialog