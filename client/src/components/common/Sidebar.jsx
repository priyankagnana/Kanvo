import { useSelector, useDispatch } from 'react-redux';
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Pagination, Collapse } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link, useNavigate, useParams } from 'react-router-dom';
import assets from '../../assests/index';
import { useEffect, useState } from 'react';
import boardApi from '../../api/boardApi';
import { setBoards } from '../../redux/features/boardSlice';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import FavouriteList from './FavouriteList';
import { useTheme } from '@mui/material/styles';

const Sidebar = () => {
  const user = useSelector((state) => state.user.value);
  const boards = useSelector((state) => state.board.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const sidebarWidth = 250;

  // Use the theme hook to access the current theme
  const theme = useTheme();

  useEffect(() => {
    const getBoards = async () => {
      try {
        // Only send params if we have filters/search/pagination
        const hasFilters = searchQuery || sortBy || filterBy;
        const params = {};
        
        if (hasFilters || page > 1) {
          params.page = page;
          params.limit = 10;
        }
        if (searchQuery) params.search = searchQuery;
        if (sortBy) params.sort = sortBy;
        if (filterBy) params.filter = filterBy;
        
        const res = await boardApi.getAll(params);
        if (res.boards) {
          // New format with pagination
          dispatch(setBoards(res.boards));
          setPagination(res.pagination);
        } else if (Array.isArray(res)) {
          // Old format (array)
          dispatch(setBoards(res));
          setPagination(null);
        } else {
          dispatch(setBoards([]));
        }
      } catch (err) {
        alert(err);
      }
    };
    getBoards();
  }, [dispatch, searchQuery, sortBy, filterBy, page]);

  useEffect(() => {
    const activeItem = boards.findIndex((e) => e.id === boardId);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) {
      return;
    }

    if (source.index === destination.index) {
      return;
    }

    const newList = [...boards];
    const [removed] = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed);

    const activeItem = newList.findIndex((e) => e.id === boardId);
    setActiveIndex(activeItem);
    dispatch(setBoards(newList));

    try {
      await boardApi.updatePosition({ boards: newList });
    } catch (err) {
      alert(err);
    }
  };

  const addBoard = async () => {
    try {
      const res = await boardApi.create();
      const newList = [res, ...boards];
      dispatch(setBoards(newList));
      navigate(`/boards/${res.id}`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        width: sidebarWidth,
        height: '100vh',
        '& > div': { borderRight: 'none' },
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: theme.palette.mode === 'dark' ? assets.colors.secondaryDark : assets.colors.secondaryLight, // Use the theme's mode to adjust the background color
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" fontWeight="700">
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: '10px' }} />
        <FavouriteList />
        <Box sx={{ paddingTop: '10px' }} />
        <ListItem>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" fontWeight="700">
              Private
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        <ListItem>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search boards..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, fontSize: 18 }} />,
                }}
              />
              <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Box>
            <Collapse in={showFilters}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    label="Sort By"
                  >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="createdAt">Date Created</MenuItem>
                    <MenuItem value="updatedAt">Last Updated</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filterBy}
                    onChange={(e) => {
                      setFilterBy(e.target.value);
                      setPage(1);
                    }}
                    label="Filter"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="favourite">Favourites Only</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Collapse>
            {pagination && pagination.pages > 1 && (
              <Pagination
                count={pagination.pages}
                page={page}
                onChange={(e, value) => setPage(value)}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </ListItem>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={'list-board-droppable-key'} droppableId={'list-board-droppable'}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {boards.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItemButton
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        selected={index === activeIndex}
                        component={Link}
                        to={`/boards/${item.id}`}
                        sx={{
                          pl: '20px',
                          cursor: snapshot.isDragging ? 'grab' : 'pointer!important',
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'transparent', // Adjust the background color based on theme
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="700"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.icon} {item.title}
                        </Typography>
                      </ListItemButton>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </List>
    </Drawer>
  );
};

export default Sidebar;
