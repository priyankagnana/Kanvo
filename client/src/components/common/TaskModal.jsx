import { IconButton, Modal, Box, TextField, Typography, Divider, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close'
import FlagIcon from '@mui/icons-material/Flag'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Moment from 'moment'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useTheme } from '@mui/material/styles'
import taskApi from '../../api/taskApi'
import SubtaskList from './SubtaskList'

import '../../css/custom-editor.css'

// Priority configuration
const priorityConfig = {
  high: { color: '#FF5630', label: 'High' },
  medium: { color: '#FFAB00', label: 'Medium' },
  low: { color: '#36B37E', label: 'Low' }
}

// Status configuration
const statusConfig = {
  'todo': { color: '#5E6C84', label: 'To Do', bg: '#DFE1E6' },
  'in-progress': { color: '#0052CC', label: 'In Progress', bg: '#DEEBFF' },
  'completed': { color: '#36B37E', label: 'Done', bg: '#E3FCEF' }
}

let timer
const timeout = 500
let isModalClosed = false

const TaskModal = (props) => {
  const boardId = props.boardId
  const [task, setTask] = useState(props.task)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('todo')
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState([])
  const [subtasks, setSubtasks] = useState([])
  const [tagInput, setTagInput] = useState('')
  const editorWrapperRef = useRef()

  const theme = useTheme()

  useEffect(() => {
    setTask(props.task)
    setTitle(props.task !== undefined ? props.task.title : '')
    setContent(props.task !== undefined ? props.task.content : '')
    setPriority(props.task !== undefined ? (props.task.priority || 'medium') : 'medium')
    setStatus(props.task !== undefined ? (props.task.status || 'todo') : 'todo')
    setDueDate(props.task !== undefined && props.task.dueDate ? Moment(props.task.dueDate).format('YYYY-MM-DD') : '')
    setTags(props.task !== undefined ? (props.task.tags || []) : [])
    setSubtasks(props.task !== undefined ? (props.task.subtasks || []) : [])
    if (props.task !== undefined) {
      isModalClosed = false
    }
  }, [props.task])

  const onClose = () => {
    isModalClosed = true
    props.onUpdate(task)
    props.onClose()
  }

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id)
      props.onDelete(task)
      setTask(undefined)
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle })
      } catch (err) {
        console.error('Error updating title:', err)
      }
    }, timeout)

    task.title = newTitle
    setTitle(newTitle)
    props.onUpdate(task)
  }

  const updateContent = async (content) => {
    clearTimeout(timer)

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content })
        } catch (err) {
          console.error('Error updating content:', err)
        }
      }, timeout)

      task.content = content
      setContent(content)
      props.onUpdate(task)
    }
  }

  const updatePriority = async (newPriority) => {
    setPriority(newPriority)
    try {
      await taskApi.update(boardId, task.id, { priority: newPriority })
      task.priority = newPriority
      props.onUpdate(task)
    } catch (err) {
      console.error('Error updating priority:', err)
    }
  }

  const updateStatus = async (newStatus) => {
    setStatus(newStatus)
    try {
      await taskApi.update(boardId, task.id, { status: newStatus })
      task.status = newStatus
      props.onUpdate(task)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const updateDueDate = async (newDueDate) => {
    setDueDate(newDueDate)
    try {
      await taskApi.update(boardId, task.id, { dueDate: newDueDate ? new Date(newDueDate) : null })
      task.dueDate = newDueDate ? new Date(newDueDate) : null
      props.onUpdate(task)
    } catch (err) {
      console.error('Error updating due date:', err)
    }
  }

  const updateSubtasks = async (newSubtasks) => {
    setSubtasks(newSubtasks)
    try {
      await taskApi.update(boardId, task.id, { subtasks: newSubtasks })
      task.subtasks = newSubtasks
      props.onUpdate(task)
    } catch (err) {
      console.error('Error updating subtasks:', err)
    }
  }

  const addTag = async (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTags = [...tags, tagInput.trim()]
      setTags(newTags)
      setTagInput('')
      try {
        await taskApi.update(boardId, task.id, { tags: newTags })
        task.tags = newTags
        props.onUpdate(task)
      } catch (err) {
        console.error('Error adding tag:', err)
      }
    }
  }

  const removeTag = async (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    try {
      await taskApi.update(boardId, task.id, { tags: newTags })
      task.tags = newTags
      props.onUpdate(task)
    } catch (err) {
      console.error('Error removing tag:', err)
    }
  }

  return (
    <AnimatePresence>
      {task !== undefined && (
        <Modal
          open={task !== undefined}
          onClose={onClose}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ outline: 'none', width: '80%', maxWidth: '1100px' }}
          >
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 1.5,
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  KAN-{task?.id?.slice(-4).toUpperCase()}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" color="error" onClick={deleteTask}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                  <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Content - Two Column Layout */}
              <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Column - Main Content */}
                <Box
                  sx={{
                    flex: 2,
                    p: 3,
                    overflowY: 'auto',
                    borderRight: 1,
                    borderColor: 'divider'
                  }}
                >
                  {/* Title */}
                  <TextField
                    value={title}
                    onChange={updateTitle}
                    placeholder="Task title"
                    variant="standard"
                    fullWidth
                    sx={{
                      mb: 3,
                      '& .MuiInput-input': {
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        p: 0
                      },
                      '& .MuiInput-underline:before': { borderBottom: 'none' },
                      '& .MuiInput-underline:after': { borderBottom: '2px solid', borderColor: 'primary.main' },
                      '& .MuiInput-underline:hover:before': { borderBottom: 'none' }
                    }}
                  />

                  {/* Description */}
                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    DESCRIPTION
                  </Typography>
                  <Box
                    ref={editorWrapperRef}
                    sx={{
                      mb: 3,
                      '& .ql-container': {
                        minHeight: '150px',
                        fontSize: '0.95rem'
                      },
                      '& .ql-editor': {
                        minHeight: '150px'
                      }
                    }}
                  >
                    <ReactQuill
                      value={content}
                      onChange={updateContent}
                      theme="snow"
                      placeholder="Add a description..."
                      className={theme.palette.mode === 'light' ? 'ql-editor-light' : 'ql-editor-dark'}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Subtasks */}
                  <SubtaskList
                    subtasks={subtasks}
                    onUpdate={updateSubtasks}
                  />

                  <Divider sx={{ my: 3 }} />

                  {/* Activity */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                      ACTIVITY
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        Created {task ? Moment(task.createdAt).format('MMM D, YYYY [at] h:mm A') : ''}
                      </Typography>
                    </Box>
                    {task?.updatedAt && task.updatedAt !== task.createdAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mt: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          Updated {Moment(task.updatedAt).format('MMM D, YYYY [at] h:mm A')}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Right Column - Details */}
                <Box
                  sx={{
                    flex: 1,
                    p: 3,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    overflowY: 'auto',
                    minWidth: 280
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    DETAILS
                  </Typography>

                  {/* Status */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                      Status
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={status}
                        onChange={(e) => updateStatus(e.target.value)}
                        sx={{
                          bgcolor: statusConfig[status]?.bg,
                          color: statusConfig[status]?.color,
                          fontWeight: 600,
                          '& .MuiSelect-select': { py: 1 }
                        }}
                      >
                        <MenuItem value="todo">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusConfig['todo'].color }} />
                            To Do
                          </Box>
                        </MenuItem>
                        <MenuItem value="in-progress">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusConfig['in-progress'].color }} />
                            In Progress
                          </Box>
                        </MenuItem>
                        <MenuItem value="completed">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusConfig['completed'].color }} />
                            Done
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Priority */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                      Priority
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={priority}
                        onChange={(e) => updatePriority(e.target.value)}
                      >
                        <MenuItem value="high">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlagIcon sx={{ fontSize: 18, color: priorityConfig.high.color }} />
                            High
                          </Box>
                        </MenuItem>
                        <MenuItem value="medium">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlagIcon sx={{ fontSize: 18, color: priorityConfig.medium.color }} />
                            Medium
                          </Box>
                        </MenuItem>
                        <MenuItem value="low">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlagIcon sx={{ fontSize: 18, color: priorityConfig.low.color }} />
                            Low
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Due Date */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                      Due Date
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      value={dueDate}
                      onChange={(e) => updateDueDate(e.target.value)}
                      InputProps={{
                        startAdornment: <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Tags */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalOfferIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Tags
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add tag (press Enter)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={addTag}
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <AnimatePresence>
                        {tags.map((tag, index) => (
                          <motion.div
                            key={tag}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Chip
                              label={tag}
                              onDelete={() => removeTag(tag)}
                              size="small"
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '& .MuiChip-deleteIcon': {
                                  color: 'rgba(255,255,255,0.7)',
                                  '&:hover': { color: 'white' }
                                }
                              }}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Created Date */}
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {task ? Moment(task.createdAt).format('MMMM D, YYYY') : ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  )
}

export default TaskModal
