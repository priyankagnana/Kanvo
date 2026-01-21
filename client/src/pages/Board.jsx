import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Box, IconButton, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Collapse, Chip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
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
  const [showFilters, setShowFilters] = useState(false)
  const [filteredSections, setFilteredSections] = useState([])


  const boards = useSelector((state) => state.board.value)
  const favouriteList = useSelector((state) => state.favourites.value)

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
        setIsFavourite(res.favourite)
        setIcon(res.icon)
      } catch (err) {
        alert(err)
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

      try {
        const params = {}
        if (searchQuery) params.search = searchQuery
        if (sortBy) params.sort = sortBy
        if (filterPriority) params.priority = filterPriority
        if (filterStatus) params.status = filterStatus

        const res = await taskApi.search(boardId, params)
        if (res.tasks) {
          // Group tasks by section
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
      }
    }

    if (sections.length > 0) {
      applyFilters()
    } else {
      setFilteredSections([])
    }
  }, [boardId, sections, searchQuery, sortBy, filterPriority, filterStatus])

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
      alert(err)
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
        alert(err)
      }
    }, timeout);
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription })
      } catch (err) {
        alert(err)
      }
    }, timeout);
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
      alert(err)
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
      alert(err)
    }
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
          <Typography
            variant='h5'
            fontWeight='800'
            letterSpacing={1}
            sx={{ userSelect: 'none' }}
          >
            Kanvo
          </Typography>

        <IconButton variant='outlined' color='error' onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px',marginTop: '20px' }}>
        <Box>
        <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
          {/* emoji picker */}
          <EmojiPicker icon={icon} onEmojiSelect={onIconChange}  />
          <IconButton variant='outlined' onClick={addFavourite}>
          {
            isFavourite ? (
              <StarOutlinedIcon color='warning' />
            ) : (
              <StarBorderOutlinedIcon />
            )
          }
        </IconButton>

          </Box>

          <TextField
            value={title}
            onChange={updateTitle}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField
            value={description}
            onChange={updateDescription}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, fontSize: 18 }} />,
              }}
            />
            <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon />
            </IconButton>
          </Box>
          <Collapse in={showFilters}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="createdAt">Date Created</MenuItem>
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
              {(filterPriority || filterStatus || searchQuery || sortBy) && (
                <Chip
                  label="Clear Filters"
                  onClick={() => {
                    setSearchQuery('')
                    setSortBy('')
                    setFilterPriority('')
                    setFilterStatus('')
                  }}
                  onDelete={() => {
                    setSearchQuery('')
                    setSortBy('')
                    setFilterPriority('')
                    setFilterStatus('')
                  }}
                  size="small"
                />
              )}
            </Box>
          </Collapse>
        </Box>
        <Box>
          <Kanban data={filteredSections.length > 0 ? filteredSections : sections} boardId={boardId} />
        </Box>
      </Box>
    </>
  )
}

export default Board