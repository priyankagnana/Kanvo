import { Box, Typography, Grid, Card, CardActionArea } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { setBoards } from "../redux/features/boardSlice"
import { useNavigate } from "react-router-dom"
import boardApi from "../api/boardApi"
import { useState } from "react"
import EmptyState from "../components/common/EmptyState"
import { useToast } from "../components/common/ToastProvider"

const templates = [
  { name: 'Personal Kanban', icon: '📋', sections: ['To Do', 'Doing', 'Done'] },
  { name: 'Sprint Board', icon: '🏃', sections: ['Backlog', 'In Progress', 'Review', 'Done'] },
  { name: 'Product Roadmap', icon: '🚀', sections: ['Ideas', 'Planned', 'In Development', 'Shipped'] },
  { name: 'Bug Tracker', icon: '🐛', sections: ['Reported', 'Triaging', 'Fixing', 'Resolved'] }
]

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const boards = useSelector((state) => state.board.value)
  const [, setLoading] = useState(false)
  const toast = useToast()

  const createBoard = async () => {
    setLoading(true)
    try {
      const res = await boardApi.create()
      dispatch(setBoards([res, ...boards]))
      navigate(`/boards/${res._id || res.id}`)
      toast.success('Board created')
    } catch (err) {
      toast.error('Failed to create board')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: { xs: 4, md: 8 }, px: 2 }}>
      <EmptyState
        type="noBoards"
        onAction={createBoard}
        customTitle="Create your first board"
        customDescription="Organize your work with Kanban boards. Pick a template below or start from scratch."
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
          Or start with a template
        </Typography>
        <Grid container spacing={2}>
          {templates.map((tpl) => (
            <Grid item xs={6} sm={3} key={tpl.name}>
              <Card
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' }
                }}
              >
                <CardActionArea onClick={createBoard} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.75rem', mb: 1 }}>{tpl.icon}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                    {tpl.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {tpl.sections.length} columns
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Home
