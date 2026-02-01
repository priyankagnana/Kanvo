import { Box, Typography, TextField, IconButton, Checkbox, LinearProgress, Tooltip } from '@mui/material'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const SubtaskList = ({ subtasks = [], onUpdate }) => {
  const [newSubtask, setNewSubtask] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const completedCount = subtasks.filter(s => s.completed).length
  const totalCount = subtasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return

    const newItem = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false
    }

    onUpdate([...subtasks, newItem])
    setNewSubtask('')
    setIsAdding(false)
  }

  const handleToggle = (id) => {
    const updated = subtasks.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    )
    onUpdate(updated)
  }

  const handleDelete = (id) => {
    const updated = subtasks.filter(s => s.id !== id)
    onUpdate(updated)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSubtask()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewSubtask('')
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            SUBTASKS
          </Typography>
          {totalCount > 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {completedCount}/{totalCount}
            </Typography>
          )}
        </Box>
        {!isAdding && (
          <Tooltip title="Add subtask" arrow>
            <IconButton size="small" onClick={() => setIsAdding(true)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 2,
            height: 6,
            borderRadius: 3,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              bgcolor: progress === 100 ? 'success.main' : 'primary.main'
            }
          }}
        />
      )}

      {/* Subtask List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <AnimatePresence>
          {subtasks.map((subtask) => (
            <motion.div
              key={subtask.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 0.75,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    '& .delete-btn': { opacity: 1 }
                  }
                }}
              >
                <Checkbox
                  checked={subtask.completed}
                  onChange={() => handleToggle(subtask.id)}
                  icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 20 }} />}
                  checkedIcon={<CheckBoxIcon sx={{ fontSize: 20, color: 'success.main' }} />}
                  sx={{ p: 0 }}
                />
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: '0.875rem',
                    textDecoration: subtask.completed ? 'line-through' : 'none',
                    color: subtask.completed ? 'text.secondary' : 'text.primary',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {subtask.title}
                </Typography>
                <IconButton
                  size="small"
                  className="delete-btn"
                  onClick={() => handleDelete(subtask.id)}
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    '&:hover': { color: 'error.main' }
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Add Subtask Input */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Checkbox disabled sx={{ p: 0 }} />
              <TextField
                autoFocus
                fullWidth
                size="small"
                placeholder="Add a subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => {
                  if (!newSubtask.trim()) setIsAdding(false)
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem'
                  }
                }}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {totalCount === 0 && !isAdding && (
        <Box
          onClick={() => setIsAdding(true)}
          sx={{
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover'
            }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Click to add subtasks
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default SubtaskList
