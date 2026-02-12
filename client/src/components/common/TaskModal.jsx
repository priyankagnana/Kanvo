import { IconButton, Modal, Box, TextField, Typography, Divider, Select, MenuItem, FormControl, Chip, Fade } from '@mui/material'
import CloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined'
import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close'
import FlagIcon from '@mui/icons-material/Flag'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Moment from 'moment'
import 'react-quill/dist/quill.snow.css'
import { useTheme } from '@mui/material/styles'
import taskApi from '../../api/taskApi'
import SubtaskList from './SubtaskList'
import ConfirmDialog from './ConfirmDialog'
import { useToast } from './ToastProvider'

import '../../css/custom-editor.css'

// Lazy load ReactQuill — it's a heavy dependency
const ReactQuill = React.lazy(() => import('react-quill'))

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

const timeout = 500

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saveStatus, setSaveStatus] = useState('') // '' | 'saving' | 'saved'
  const editorWrapperRef = useRef()
  const timerRef = useRef(null)
  const saveIndicatorRef = useRef(null)
  const isModalClosedRef = useRef(false)
  const toast = useToast()

  const showSaved = useCallback(() => {
    setSaveStatus('saved')
    clearTimeout(saveIndicatorRef.current)
    saveIndicatorRef.current = setTimeout(() => setSaveStatus(''), 2000)
  }, [])

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
      isModalClosedRef.current = false
    }
  }, [props.task])

  const onClose = useCallback(() => {
    isModalClosedRef.current = true
    props.onUpdate(task)
    props.onClose()
  }, [task, props])

  const deleteTask = useCallback(async () => {
    setShowDeleteConfirm(false)
    try {
      await taskApi.delete(boardId, task.id)
      props.onDelete(task)
      setTask(undefined)
      toast.success('Task deleted')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }, [boardId, task, props, toast])

  const updateTitle = useCallback(async (e) => {
    clearTimeout(timerRef.current)
    const newTitle = e.target.value
    setSaveStatus('saving')
    timerRef.current = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle })
        showSaved()
      } catch (err) {
        setSaveStatus('')
        toast.error('Failed to save')
      }
    }, timeout)

    const updatedTask = { ...task, title: newTitle }
    setTask(updatedTask)
    setTitle(newTitle)
    props.onUpdate(updatedTask)
  }, [boardId, task, props, showSaved, toast])

  const updateContent = useCallback(async (newContent) => {
    clearTimeout(timerRef.current)

    if (!isModalClosedRef.current) {
      setSaveStatus('saving')
      timerRef.current = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: newContent })
          showSaved()
        } catch (err) {
          setSaveStatus('')
          toast.error('Failed to save')
        }
      }, timeout)

      const updatedTask = { ...task, content: newContent }
      setTask(updatedTask)
      setContent(newContent)
      props.onUpdate(updatedTask)
    }
  }, [boardId, task, props, showSaved, toast])

  const updatePriority = useCallback(async (newPriority) => {
    setPriority(newPriority)
    try {
      await taskApi.update(boardId, task.id, { priority: newPriority })
      const updatedTask = { ...task, priority: newPriority }
      setTask(updatedTask)
      props.onUpdate(updatedTask)
    } catch (err) {
      console.error('Error updating priority:', err)
    }
  }, [boardId, task, props])

  const updateStatus = useCallback(async (newStatus) => {
    setStatus(newStatus)
    try {
      await taskApi.update(boardId, task.id, { status: newStatus })
      const updatedTask = { ...task, status: newStatus }
      setTask(updatedTask)
      props.onUpdate(updatedTask)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }, [boardId, task, props])

  const updateDueDate = useCallback(async (newDueDate) => {
    setDueDate(newDueDate)
    try {
      const dateValue = newDueDate ? new Date(newDueDate) : null
      await taskApi.update(boardId, task.id, { dueDate: dateValue })
      const updatedTask = { ...task, dueDate: dateValue }
      setTask(updatedTask)
      props.onUpdate(updatedTask)
    } catch (err) {
      console.error('Error updating due date:', err)
    }
  }, [boardId, task, props])

  const updateSubtasks = useCallback(async (newSubtasks) => {
    setSubtasks(newSubtasks)
    try {
      await taskApi.update(boardId, task.id, { subtasks: newSubtasks })
      const updatedTask = { ...task, subtasks: newSubtasks }
      setTask(updatedTask)
      props.onUpdate(updatedTask)
    } catch (err) {
      console.error('Error updating subtasks:', err)
    }
  }, [boardId, task, props])

  const addTag = useCallback(async (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTags = [...tags, tagInput.trim()]
      setTags(newTags)
      setTagInput('')
      try {
        await taskApi.update(boardId, task.id, { tags: newTags })
        const updatedTask = { ...task, tags: newTags }
        setTask(updatedTask)
        props.onUpdate(updatedTask)
      } catch (err) {
        console.error('Error adding tag:', err)
      }
    }
  }, [boardId, task, tags, tagInput, props])

  const removeTag = useCallback(async (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    try {
      await taskApi.update(boardId, task.id, { tags: newTags })
      const updatedTask = { ...task, tags: newTags }
      setTask(updatedTask)
      props.onUpdate(updatedTask)
    } catch (err) {
      console.error('Error removing tag:', err)
    }
  }, [boardId, task, tags, props])

  return (
    <>
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
            style={{ outline: 'none', width: '90%', maxWidth: '1100px' }}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    KAN-{task?.id?.slice(-4).toUpperCase()}
                  </Typography>
                  <Fade in={saveStatus === 'saved'}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CloudDoneOutlinedIcon sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography sx={{ fontSize: '0.7rem', color: 'success.main', fontWeight: 500 }}>Saved</Typography>
                    </Box>
                  </Fade>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" color="error" onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlinedIcon />
                  </IconButton>
                  <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Content - Two Column Layout (stacks on mobile) */}
              <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Left Column - Main Content */}
                <Box
                  sx={{
                    flex: 2,
                    p: { xs: 2, md: 3 },
                    overflowY: 'auto',
                    borderRight: { xs: 'none', md: 1 },
                    borderBottom: { xs: 1, md: 'none' },
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
                    <Suspense fallback={<Box sx={{ minHeight: '150px', bgcolor: 'action.hover', borderRadius: 1 }} />}>
                      <ReactQuill
                        value={content}
                        onChange={updateContent}
                        theme="snow"
                        placeholder="Add a description..."
                        className={theme.palette.mode === 'light' ? 'ql-editor-light' : 'ql-editor-dark'}
                      />
                    </Suspense>
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
                    minWidth: { xs: 'auto', md: 280 }
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
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
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
                      ))}
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

    <ConfirmDialog
      open={showDeleteConfirm}
      title="Delete task"
      message={`Delete "${title || 'Untitled'}"? This cannot be undone.`}
      confirmLabel="Delete task"
      onConfirm={deleteTask}
      onCancel={() => setShowDeleteConfirm(false)}
    />
    </>
  )
}

export default TaskModal
