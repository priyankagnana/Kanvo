import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import SortIcon from '@mui/icons-material/Sort'
import CloseIcon from '@mui/icons-material/Close'
import FlagIcon from '@mui/icons-material/Flag'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { Box, IconButton, TextField, Typography, Chip, InputAdornment, CircularProgress, LinearProgress } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import boardApi from '../api/boardApi'
import taskApi from '../api/taskApi'
import EmojiPicker from '../components/common/EmojiPicker'
import Kanban from '../components/common/Kanban'
import { setBoards } from '../redux/features/boardSlice'
import { setFavouriteList } from '../redux/features/favouriteSlice'

let timer
const timeout = 500

const Board = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [icon, setIcon] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filteredSections, setFilteredSections] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const boards = useSelector((state) => state.board.value)
  const favouriteList = useSelector((state) => state.favourites.value)

  // Calculate board stats
  const boardStats = useMemo(() => {
    const allTasks = sections.flatMap(s => s.tasks || [])
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(t => t.status === 'completed').length
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length
    const highPriorityTasks = allTasks.filter(t => t.priority === 'high').length
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    return { totalTasks, completedTasks, inProgressTasks, highPriorityTasks, progress }
  }, [sections])

  // Check if any filters are active
  const hasActiveFilters = searchQuery || sortBy || filterPriority || filterStatus

  useEffect(() => {
    const getBoard = async () => {
      setIsLoading(true)
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
        setIsFavourite(res.favourite)
        setIcon(res.icon)
      } catch (err) {
        console.error('Error loading board:', err)
      } finally {
        setIsLoading(false)
      }
    }
    getBoard()
  }, [boardId])

  useEffect(() => {
    const applyFilters = async () => {
      if (!searchQuery && !sortBy && !filterPriority && !filterStatus) {
        setFilteredSections([])
        return
      }

      setIsFiltering(true)
      try {
        const params = { limit: 1000 }
        if (searchQuery) params.search = searchQuery
        if (sortBy) params.sort = sortBy
        if (filterPriority) params.priority = filterPriority
        if (filterStatus) params.status = filterStatus

        const res = await taskApi.search(boardId, params)
        if (res.tasks) {
          const sectionMap = {}
          sections.forEach(section => {
            sectionMap[section.id] = { ...section, tasks: [] }
          })

          res.tasks.forEach(task => {
            if (task.section) {
              const sectionId = task.section.id || task.section._id || task.section
              if (sectionMap[sectionId]) {
                if (!sectionMap[sectionId].tasks) {
                  sectionMap[sectionId].tasks = []
                }
                sectionMap[sectionId].tasks.push(task)
              }
            }
          })

          setFilteredSections(Object.values(sectionMap).filter(s => s.tasks && s.tasks.length > 0))
        } else {
          setFilteredSections([])
        }
      } catch (err) {
        console.error('Error filtering tasks:', err)
        setFilteredSections([])
      } finally {
        setIsFiltering(false)
      }
    }

    if (sections.length > 0) {
      applyFilters()
    } else {
      setFilteredSections([])
    }
  }, [boardId, sections, searchQuery, sortBy, filterPriority, filterStatus])

  const clearAllFilters = () => {
    setSearchQuery('')
    setSortBy('')
    setFilterPriority('')
    setFilterStatus('')
  }

  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon }
      dispatch(setFavouriteList(tempFavourite))
    }

    setIcon(newIcon)
    dispatch(setBoards(temp))
    try {
      await boardApi.update(boardId, { icon: newIcon })
    } catch (err) {
      console.error('Error updating icon:', err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle }

    if (isFavourite) {
      let tempFavourite = [...favouriteList]
      const favouriteIndex = tempFavourite.findIndex(e => e.id === boardId)
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle }
      dispatch(setFavouriteList(tempFavourite))
    }

    dispatch(setBoards(temp))

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle })
      } catch (err) {
        console.error('Error updating title:', err)
      }
    }, timeout)
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription })
      } catch (err) {
        console.error('Error updating description:', err)
      }
    }, timeout)
  }

  const addFavourite = async () => {
    try {
      const board = await boardApi.update(boardId, { favourite: !isFavourite })
      let newFavouriteList = [...favouriteList]
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter(e => e.id !== boardId)
      } else {
        newFavouriteList.unshift(board)
      }
      dispatch(setFavouriteList(newFavouriteList))
      setIsFavourite(!isFavourite)
    } catch (err) {
      console.error('Error updating favourite:', err)
    }
  }

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId)
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter(e => e.id !== boardId)
        dispatch(setFavouriteList(newFavouriteList))
      }

      const newList = boards.filter(e => e.id !== boardId)
      if (newList.length === 0) {
        navigate('/boards')
      } else {
        navigate(`/boards/${newList[0].id}`)
      }
      dispatch(setBoards(newList))
    } catch (err) {
      console.error('Error deleting board:', err)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 2
      }}>
        <Typography
          variant='h5'
          fontWeight='700'
          letterSpacing={0.5}
          sx={{
            userSelect: 'none',
            background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Kanvo
        </Typography>

        <IconButton color='error' onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>

      <Box sx={{ padding: '10px 50px' }}>
        {/* Board Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmojiPicker icon={icon} onEmojiSelect={onIconChange} />
              <Box>
                <TextField
                  value={title}
                  onChange={updateTitle}
                  placeholder='Untitled'
                  variant='standard'
                  sx={{
                    '& .MuiInput-input': {
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      p: 0
                    },
                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                    '& .MuiInput-underline:after': { borderBottom: '2px solid', borderColor: 'primary.main' },
                    '& .MuiInput-underline:hover:before': { borderBottom: 'none' }
                  }}
                />
                <TextField
                  value={description}
                  onChange={updateDescription}
                  placeholder='Add a description'
                  variant='standard'
                  multiline
                  fullWidth
                  sx={{
                    mt: 0.5,
                    '& .MuiInput-input': {
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      p: 0
                    },
                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                    '& .MuiInput-underline:hover:before': { borderBottom: 'none' }
                  }}
                />
              </Box>
            </Box>
            <IconButton onClick={addFavourite}>
              {isFavourite ? (
                <StarOutlinedIcon color='warning' />
              ) : (
                <StarBorderOutlinedIcon />
              )}
            </IconButton>
          </Box>

          {/* Board Stats */}
          {boardStats.totalTasks > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={`${boardStats.totalTasks} Tasks`}
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
                <Chip
                  label={`${boardStats.completedTasks} Done`}
                  size="small"
                  color="success"
                  sx={{ fontWeight: 500 }}
                />
                {boardStats.inProgressTasks > 0 && (
                  <Chip
                    label={`${boardStats.inProgressTasks} In Progress`}
                    size="small"
                    color="info"
                    sx={{ fontWeight: 500 }}
                  />
                )}
                {boardStats.highPriorityTasks > 0 && (
                  <Chip
                    icon={<FlagIcon sx={{ fontSize: 14 }} />}
                    label={`${boardStats.highPriorityTasks} High Priority`}
                    size="small"
                    color="error"
                    sx={{ fontWeight: 500 }}
                  />
                )}
                <Box sx={{ flex: 1, maxWidth: 200 }}>
                  <LinearProgress
                    variant="determinate"
                    value={boardStats.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        bgcolor: boardStats.progress === 100 ? 'success.main' : 'primary.main'
                      }
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {Math.round(boardStats.progress)}%
                </Typography>
              </Box>
            </motion.div>
          )}
        </Box>

        {/* Quick Filters Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {/* Search Input */}
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Filter Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
            >
              {/* Priority Filters */}
              <Chip
                icon={<FlagIcon sx={{ fontSize: 16 }} />}
                label="High Priority"
                onClick={() => setFilterPriority(filterPriority === 'high' ? '' : 'high')}
                color={filterPriority === 'high' ? 'error' : 'default'}
                variant={filterPriority === 'high' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
              />
              <Chip
                icon={<FlagIcon sx={{ fontSize: 16 }} />}
                label="Medium"
                onClick={() => setFilterPriority(filterPriority === 'medium' ? '' : 'medium')}
                color={filterPriority === 'medium' ? 'warning' : 'default'}
                variant={filterPriority === 'medium' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
              />

              {/* Status Filters */}
              <Chip
                label="In Progress"
                onClick={() => setFilterStatus(filterStatus === 'in-progress' ? '' : 'in-progress')}
                color={filterStatus === 'in-progress' ? 'info' : 'default'}
                variant={filterStatus === 'in-progress' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
              />
              <Chip
                label="Completed"
                onClick={() => setFilterStatus(filterStatus === 'completed' ? '' : 'completed')}
                color={filterStatus === 'completed' ? 'success' : 'default'}
                variant={filterStatus === 'completed' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
              />

              {/* Sort Chips */}
              <Chip
                icon={<SortIcon sx={{ fontSize: 16 }} />}
                label="Due Date"
                onClick={() => setSortBy(sortBy === 'dueDate' ? '' : 'dueDate')}
                variant={sortBy === 'dueDate' ? 'filled' : 'outlined'}
                color={sortBy === 'dueDate' ? 'primary' : 'default'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
              />
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                label="Recent"
                onClick={() => setSortBy(sortBy === 'createdAt' ? '' : 'createdAt')}
                variant={sortBy === 'createdAt' ? 'filled' : 'outlined'}
                color={sortBy === 'createdAt' ? 'primary' : 'default'}
                sx={{ fontWeight: 500, cursor: 'pointer' }}
              />

              {/* Clear Filters */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Chip
                      label="Clear All"
                      onDelete={clearAllFilters}
                      onClick={clearAllFilters}
                      color="secondary"
                      sx={{ fontWeight: 500, cursor: 'pointer' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Loading Indicator */}
            {isFiltering && (
              <CircularProgress size={20} sx={{ ml: 1 }} />
            )}
          </Box>

          {/* Active Filters Summary */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {filteredSections.length > 0
                    ? `Showing ${filteredSections.reduce((acc, s) => acc + (s.tasks?.length || 0), 0)} matching tasks`
                    : hasActiveFilters && !isFiltering
                      ? 'No matching tasks found'
                      : ''
                  }
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Kanban Board */}
        <Box>
          <Kanban
            data={filteredSections.length > 0 ? filteredSections : sections}
            boardId={boardId}
            onDataChange={(newSections) => setSections(newSections)}
          />
        </Box>
      </Box>
    </motion.div>
  )
}

export default Board
