import { useSelector, useDispatch } from 'react-redux';
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Pagination, Collapse, Divider, Avatar, Tooltip } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const sidebarWidth = 250;

  const theme = useTheme();

  useEffect(() => {
    const getBoards = async () => {
      try {
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
          dispatch(setBoards(res.boards));
          setPagination(res.pagination);
        } else if (Array.isArray(res)) {
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
    // Only redirect to first board if we're on the /boards route (not /profile or other routes)
    const isOnBoardsRoute = location.pathname === '/boards' || location.pathname.startsWith('/boards/');
    if (boards.length > 0 && boardId === undefined && isOnBoardsRoute) {
      navigate(`/boards/${boards[0].id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate, location.pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    if (source.index === destination.index) return;

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

  const deleteBoard = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await boardApi.delete(id);
      const newList = boards.filter((board) => board.id !== id);
      dispatch(setBoards(newList));

      if (boardId === id) {
        if (newList.length > 0) {
          navigate(`/boards/${newList[0].id}`);
        } else {
          navigate('/boards');
        }
      }
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
      <Box
        sx={{
          width: sidebarWidth,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.mode === 'dark' ? assets.colors.secondaryDark : assets.colors.secondaryLight,
        }}
      >
        {/* User Profile Section */}
        <ListItem
          component={Link}
          to="/profile"
          sx={{
            cursor: 'pointer',
            py: 2,
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              {user.username?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight="700" noWrap>
                {user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                View Profile
              </Typography>
            </Box>
          </Box>
        </ListItem>

        <Divider sx={{ opacity: 0.1 }} />

        {/* Favourites Section */}
        <Box sx={{ pt: 1 }}>
          <FavouriteList />
        </Box>

        {/* Private Boards Header */}
        <ListItem sx={{ py: 1 }}>
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
            <Tooltip title="Add Board" arrow>
              <IconButton onClick={addBoard} size="small">
                <AddBoxOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </ListItem>

        {/* Search and Filters */}
        <ListItem sx={{ py: 0.5 }}>
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

        {/* Scrollable Board List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
          }}
        >
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
                            pr: 1,
                            cursor: snapshot.isDragging ? 'grab' : 'pointer!important',
                            backgroundColor: 'transparent',
                            '&.Mui-selected': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                            },
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                            },
                            '&:hover .delete-btn': {
                              opacity: 1,
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            sx={{
                              flex: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.icon} {item.title}
                          </Typography>
                          <Tooltip title="Delete Board" arrow>
                            <IconButton
                              className="delete-btn"
                              size="small"
                              onClick={(e) => deleteBoard(e, item.id)}
                              sx={{
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                ml: 0.5,
                                '&:hover': {
                                  color: 'error.main',
                                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,0,0,0.1)' : 'rgba(255,0,0,0.08)',
                                },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </ListItemButton>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        {/* Bottom Section - Logout */}
        <Divider sx={{ opacity: 0.1 }} />
        <ListItem sx={{ py: 1 }}>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 1,
              py: 1,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} />
            <Typography variant="body2" fontWeight="500">
              Logout
            </Typography>
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
