import { Box, Button, Typography, Divider, TextField, IconButton, Card, Chip, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FlagIcon from '@mui/icons-material/Flag'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import sectionApi from '../../api/sectionApi'
import taskApi from '../../api/taskApi'
import ConfirmDialog from './ConfirmDialog'
import { useToast } from './ToastProvider'
import Moment from 'moment'

const timeout = 500

// Lazy load TaskModal since it pulls in ReactQuill
const TaskModal = React.lazy(() => import('./TaskModal'))

// Priority colors
const priorityColors = {
  high: '#FF5630',
  medium: '#FFAB00',
  low: '#36B37E'
}

// Status icons and colors
const statusConfig = {
  'todo': { icon: RadioButtonUncheckedIcon, color: '#5E6C84', label: 'To Do' },
  'in-progress': { icon: PlayCircleOutlineIcon, color: '#0052CC', label: 'In Progress' },
  'completed': { icon: CheckCircleOutlineIcon, color: '#36B37E', label: 'Done' }
}

// Get due date color based on urgency
const getDueDateColor = (dueDate) => {
  if (!dueDate) return null
  const now = Moment()
  const due = Moment(dueDate)
  const daysUntilDue = due.diff(now, 'days')

  if (daysUntilDue < 0) return '#FF5630'
  if (daysUntilDue <= 2) return '#FFAB00'
  return '#36B37E'
}

// Task Card Component - memoized to prevent re-renders when sibling tasks change
const TaskCard = React.memo(({ task, index, onTaskClick, onQuickDelete }) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const StatusIcon = statusConfig[task.status]?.icon || RadioButtonUncheckedIcon
  const dueDateColor = getDueDateColor(task.dueDate)

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            padding: '12px',
            marginBottom: '8px',
            cursor: snapshot.isDragging ? 'grabbing' : 'pointer',
            position: 'relative',
            borderLeft: `3px solid ${priorityColors[task.priority] || priorityColors.medium}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}
          onClick={() => onTaskClick(task)}
        >
          {/* Task Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '0.5px'
              }}
            >
              KAN-{task.id.slice(-4).toUpperCase()}
            </Typography>

            {/* Kebab menu — works on touch and desktop */}
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setMenuAnchor(e.currentTarget) }}
              sx={{ padding: '2px', mt: -0.5, mr: -0.5 }}
            >
              <MoreVertIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={!!menuAnchor}
              onClose={(e) => { if (e.stopPropagation) e.stopPropagation(); setMenuAnchor(null) }}
              onClick={(e) => e.stopPropagation()}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{ paper: { sx: { minWidth: 140, borderRadius: 2 } } }}
            >
              <MenuItem onClick={(e) => { e.stopPropagation(); setMenuAnchor(null); onTaskClick(task) }}>
                <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={(e) => { e.stopPropagation(); setMenuAnchor(null); onQuickDelete(task) }} sx={{ color: 'error.main' }}>
                <ListItemIcon><DeleteOutlinedIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: '0.85rem' }}>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          {/* Task Title */}
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              lineHeight: 1.4,
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {task.title || 'Untitled'}
          </Typography>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
              {task.tags.slice(0, 2).map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              ))}
              {task.tags.length > 2 && (
                <Chip
                  label={`+${task.tags.length - 2}`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              )}
            </Box>
          )}

          {/* Task Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side - Status & Priority */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={statusConfig[task.status]?.label || 'To Do'} arrow>
                <StatusIcon sx={{ fontSize: 16, color: statusConfig[task.status]?.color }} />
              </Tooltip>
              <Tooltip title={`${task.priority || 'medium'} priority`} arrow>
                <FlagIcon sx={{ fontSize: 14, color: priorityColors[task.priority] || priorityColors.medium }} />
              </Tooltip>
            </Box>

            {/* Right side - Due Date & Subtasks */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {task.subtasks && task.subtasks.length > 0 && (
                <Tooltip title={`${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} subtasks`} arrow>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                      {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
              {task.dueDate && (
                <Tooltip title={`Due: ${Moment(task.dueDate).format('MMM D, YYYY')}`} arrow>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: `${dueDateColor}20`,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1
                    }}
                  >
                    <CalendarTodayIcon sx={{ fontSize: 12, color: dueDateColor }} />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '0.65rem', color: dueDateColor, fontWeight: 500 }}
                    >
                      {Moment(task.dueDate).format('MMM D')}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Card>
      )}
    </Draggable>
  )
})

const Kanban = (props) => {
  const boardId = props.boardId
  const onDataChange = props.onDataChange
  const [data, setData] = useState([])
  const [selectedTask, setSelectedTask] = useState(undefined)
  const [sectionToDelete, setSectionToDelete] = useState(null)
  const timerRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    setData(props.data)
  }, [props.data])

  // Helper to update data and notify parent
  const updateData = useCallback((newData) => {
    setData(newData)
    if (onDataChange) {
      onDataChange(newData)
    }
  }, [onDataChange])

  const onDragEnd = useCallback(async ({ source, destination }) => {
    if (!destination) return
    const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
    const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)
    const sourceCol = data[sourceColIndex]
    const destinationCol = data[destinationColIndex]

    const sourceSectionId = sourceCol.id
    const destinationSectionId = destinationCol.id

    const sourceTasks = [...sourceCol.tasks]
    const destinationTasks = [...destinationCol.tasks]

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[sourceColIndex].tasks = sourceTasks
      data[destinationColIndex].tasks = destinationTasks
    } else {
      const [removed] = destinationTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[destinationColIndex].tasks = destinationTasks
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId
      })
      updateData([...data])
    } catch (err) {
      console.error('Error updating task position:', err)
    }
  }, [data, boardId, updateData])

  const createSection = useCallback(async () => {
    try {
      const section = await sectionApi.create(boardId)
      updateData([...data, section])
    } catch (err) {
      console.error('Error creating section:', err)
    }
  }, [boardId, data, updateData])

  const requestDeleteSection = useCallback((sectionId) => {
    const section = data.find(s => s.id === sectionId)
    setSectionToDelete({ id: sectionId, title: section?.title || 'Untitled', taskCount: section?.tasks?.length || 0 })
  }, [data])

  const confirmDeleteSection = useCallback(async () => {
    if (!sectionToDelete) return
    const sectionId = sectionToDelete.id
    setSectionToDelete(null)
    try {
      await sectionApi.delete(boardId, sectionId)
      const newData = [...data].filter(e => e.id !== sectionId)
      updateData(newData)
      toast.success('Section deleted')
    } catch (err) {
      toast.error('Failed to delete section')
    }
  }, [boardId, data, updateData, sectionToDelete, toast])

  const updateSectionTitle = useCallback(async (e, sectionId) => {
    clearTimeout(timerRef.current)
    const newTitle = e.target.value
    const newData = [...data]
    const index = newData.findIndex(e => e.id === sectionId)
    newData[index].title = newTitle
    updateData(newData)
    timerRef.current = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle })
      } catch (err) {
        console.error('Error updating section:', err)
      }
    }, timeout)
  }, [boardId, data, updateData])

  const createTask = useCallback(async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId })
      const newData = [...data]
      const index = newData.findIndex(e => e.id === sectionId)
      newData[index].tasks.unshift(task)
      updateData(newData)
    } catch (err) {
      console.error('Error creating task:', err)
    }
  }, [boardId, data, updateData])

  const onUpdateTask = useCallback((task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex(e => e.id === task.section.id)
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e.id === task.id)
    newData[sectionIndex].tasks[taskIndex] = task
    updateData(newData)
  }, [data, updateData])

  const onDeleteTask = useCallback(async (task) => {
    try {
      await taskApi.delete(boardId, task.id)
      const newData = [...data]
      const sectionIndex = newData.findIndex(e => e.id === task.section.id)
      const taskIndex = newData[sectionIndex].tasks.findIndex(e => e.id === task.id)
      newData[sectionIndex].tasks.splice(taskIndex, 1)
      updateData(newData)
      setSelectedTask(undefined)
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }, [boardId, data, updateData])

  const onQuickDelete = useCallback(async (task) => {
    try {
      await taskApi.delete(boardId, task.id)
      const newData = [...data]
      const sectionIndex = newData.findIndex(e => e.id === task.section.id)
      const taskIndex = newData[sectionIndex].tasks.findIndex(e => e.id === task.id)
      newData[sectionIndex].tasks.splice(taskIndex, 1)
      updateData(newData)
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }, [boardId, data, updateData])

  const handleTaskClick = useCallback((task) => {
    setSelectedTask(task)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedTask(undefined)
  }, [])

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2
      }}>
        <Button
          onClick={createSection}
          startIcon={<AddOutlinedIcon />}
          variant="contained"
          size="small"
          sx={{ textTransform: 'none' }}
        >
          Add Section
        </Button>
        <Typography variant='body2' fontWeight='600' color="text.secondary">
          {data.length} {data.length === 1 ? 'Section' : 'Sections'}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
          display: 'flex',
          alignItems: 'flex-start',
          overflowX: 'auto',
          pb: 2
        }}>
          {data.map((section) => (
            <Box
              key={section.id}
              sx={{ minWidth: '300px', mr: '12px' }}
            >
              <Droppable key={section.id} droppableId={section.id}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      width: '300px',
                      bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'background.default',
                      borderRadius: 2,
                      p: 1.5,
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {/* Section Header */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                      pb: 1,
                      borderBottom: '2px solid',
                      borderColor: 'primary.main'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <TextField
                          value={section.title}
                          onChange={(e) => updateSectionTitle(e, section.id)}
                          placeholder='Untitled'
                          variant='standard'
                          sx={{
                            flex: 1,
                            '& .MuiInput-input': {
                              fontSize: '0.9rem',
                              fontWeight: 600,
                              p: 0
                            },
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:before': { borderBottom: 'none' }
                          }}
                        />
                        <Chip
                          label={section.tasks?.length || 0}
                          size="small"
                          sx={{
                            height: 22,
                            minWidth: 22,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: 'primary.main',
                            color: 'white'
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Add Task" arrow>
                          <IconButton
                            size='small'
                            onClick={() => createTask(section.id)}
                            sx={{ '&:hover': { color: 'primary.main' } }}
                          >
                            <AddOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Section" arrow>
                          <IconButton
                            size='small'
                            onClick={() => requestDeleteSection(section.id)}
                            sx={{ '&:hover': { color: 'error.main' } }}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Tasks */}
                    <Box sx={{ minHeight: 100 }}>
                      {section.tasks?.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          onTaskClick={handleTaskClick}
                          onQuickDelete={onQuickDelete}
                        />
                      ))}
                      {provided.placeholder}
                    </Box>

                    {/* Add Task Button at bottom */}
                    {section.tasks?.length === 0 && (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddOutlinedIcon />}
                        onClick={() => createTask(section.id)}
                        sx={{
                          mt: 1,
                          borderStyle: 'dashed',
                          color: 'text.secondary',
                          borderColor: 'divider',
                          '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            bgcolor: 'transparent'
                          }
                        }}
                      >
                        Add a task
                      </Button>
                    )}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>
      <React.Suspense fallback={null}>
        <TaskModal
          task={selectedTask}
          boardId={boardId}
          onClose={handleCloseModal}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      </React.Suspense>

      <ConfirmDialog
        open={!!sectionToDelete}
        title="Delete section"
        message={sectionToDelete ? `Delete "${sectionToDelete.title || 'Untitled'}"${sectionToDelete.taskCount > 0 ? ` and its ${sectionToDelete.taskCount} task${sectionToDelete.taskCount > 1 ? 's' : ''}` : ''}? This cannot be undone.` : ''}
        confirmLabel="Delete section"
        onConfirm={confirmDeleteSection}
        onCancel={() => setSectionToDelete(null)}
      />
    </>
  )
}

export default Kanban
