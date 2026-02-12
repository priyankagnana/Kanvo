import { Box, ListItem, ListItemButton, Typography } from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import boardApi from '../../api/boardApi'
import { setFavouriteList } from '../../redux/features/favouriteSlice'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useToast } from './ToastProvider'

const FavouriteList = React.memo(() => {
  const dispatch = useDispatch()
  const list = useSelector((state) => state.favourites.value)
  const [activeIndex, setActiveIndex] = useState(0)
  const { boardId } = useParams()
  const toast = useToast()

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getFavourites()
        dispatch(setFavouriteList(res))
      } catch (err) {
        toast.error('Something went wrong')
      }
    }
    getBoards()
  }, [dispatch, toast])

  useEffect(() => {
    const index = list.findIndex(e => e.id === boardId)
    setActiveIndex(index)
  }, [list, boardId])

  const onDragEnd = useCallback(async ({ source, destination }) => {
    if (!destination) return
    if (source.index === destination.index) return

    const newList = [...list]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex(e => e.id === boardId)
    setActiveIndex(activeItem)

    dispatch(setFavouriteList(newList))

    try {
      await boardApi.updateFavouritePosition({ boards: newList })
    } catch (err) {
      toast.error('Failed to reorder favourites')
    }
  }, [list, boardId, dispatch, toast])

  return (
    <>
      <ListItem>
        <Box sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant='body2' fontWeight='700'>
            Favourites
          </Typography>
        </Box>
      </ListItem>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable key={'fav-board-droppable-key'} droppableId={'fav-board-droppable'}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {
                list.map((item, index) => (
                  <Draggable key={`fav-${item.id}`} draggableId={`fav-${item.id}`} index={index}>
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
                          cursor: snapshot.isDragging ? 'grab' : 'pointer',
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <Typography
                          variant='body2'
                          fontWeight='700'
                          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {item.icon} {item.title}
                        </Typography>
                      </ListItemButton>
                    )}
                  </Draggable>
                ))
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
})

export default FavouriteList