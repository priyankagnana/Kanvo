import { Box, Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'
import AddIcon from '@mui/icons-material/Add'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'

const emptyStateConfigs = {
  noTasks: {
    icon: InboxOutlinedIcon,
    title: 'No tasks yet',
    description: 'Create your first task to get started with your project',
    actionLabel: 'Add Task',
    iconColor: 'primary.main'
  },
  noSections: {
    icon: ViewColumnOutlinedIcon,
    title: 'No columns',
    description: 'Add a section to organize your tasks into columns',
    actionLabel: 'Add Section',
    iconColor: 'primary.main'
  },
  noResults: {
    icon: SearchOffIcon,
    title: 'No matching tasks',
    description: 'Try adjusting your search or filter criteria',
    actionLabel: 'Clear Filters',
    iconColor: 'warning.main'
  },
  noBoards: {
    icon: AssignmentOutlinedIcon,
    title: 'No boards yet',
    description: 'Create your first board to start organizing your work',
    actionLabel: 'Create Board',
    iconColor: 'primary.main'
  }
}

const EmptyState = ({ type = 'noTasks', onAction, customTitle, customDescription }) => {
  const config = emptyStateConfigs[type] || emptyStateConfigs.noTasks
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 4
        }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <IconComponent sx={{ fontSize: 40, color: config.iconColor }} />
          </Box>
        </motion.div>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            textAlign: 'center'
          }}
        >
          {customTitle || config.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            textAlign: 'center',
            maxWidth: 300
          }}
        >
          {customDescription || config.description}
        </Typography>

        {onAction && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAction}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                px: 3
              }}
            >
              {config.actionLabel}
            </Button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  )
}

export default EmptyState
