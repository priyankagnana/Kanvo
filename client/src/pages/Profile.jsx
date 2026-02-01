import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import { motion } from 'framer-motion'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import userApi from '../api/userApi'
import { setUser } from '../redux/features/userSlice'

const StatCard = ({ icon, title, value, color, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card
      sx={{
        height: '100%',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`
            : `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
        border: `1px solid ${color}33`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: `${color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="700" sx={{ color }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

const Profile = () => {
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, analyticsRes] = await Promise.all([
          userApi.getProfile(),
          userApi.getAnalytics()
        ])
        setUsername(profileRes.username)
        setAnalytics(analyticsRes)
      } catch (err) {
        console.error('Error fetching profile data:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty')
      return
    }

    if (username.length > 10) {
      setError('Username must be at most 10 characters')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await userApi.updateProfile({ username: username.trim() })
      dispatch(setUser({ ...user, username: res.username }))
      setSuccess('Username updated successfully!')
      setEditing(false)
    } catch (err) {
      const errorMsg = err?.errors?.[0]?.msg || err?.message || 'Failed to update username'
      setError(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setUsername(user.username)
    setEditing(false)
    setError('')
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Tooltip title="Back to Boards" arrow>
            <IconButton onClick={() => navigate('/boards')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4" fontWeight="700">
            Profile
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
                      mb: 2,
                    }}
                  >
                    {username?.[0]?.toUpperCase() || 'U'}
                  </Avatar>

                  {editing ? (
                    <Box sx={{ width: '100%' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        inputProps={{ maxLength: 10 }}
                        sx={{ mb: 2 }}
                        autoFocus
                      />
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" fontWeight="700">
                          {username}
                        </Typography>
                        <Tooltip title="Edit username" arrow>
                          <IconButton size="small" onClick={() => setEditing(true)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    {success}
                  </Alert>
                )}

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {user.email}
                  </Typography>
                </Box>

                {analytics && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Completion Rate
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={analytics.overview.completionRate}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(54, 179, 126, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#36B37E',
                              borderRadius: 4,
                            },
                          }}
                        />
                        <Typography variant="body1" fontWeight="700" color="success.main">
                          {analytics.overview.completionRate}%
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Analytics Section */}
          <Grid item xs={12} md={8}>
            {analytics && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Overview
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<DashboardIcon sx={{ color: '#0052CC' }} />}
                      title="Boards"
                      value={analytics.overview.totalBoards}
                      color="#0052CC"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<AssignmentIcon sx={{ color: '#6554C0' }} />}
                      title="Total Tasks"
                      value={analytics.overview.totalTasks}
                      color="#6554C0"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<CheckCircleIcon sx={{ color: '#36B37E' }} />}
                      title="Completed"
                      value={analytics.tasks.byStatus.completed}
                      color="#36B37E"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard
                      icon={<StarIcon sx={{ color: '#FFAB00' }} />}
                      title="Favourites"
                      value={analytics.overview.favouriteBoards}
                      color="#FFAB00"
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Task Status
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            To Do
                          </Typography>
                          <Typography variant="h5" fontWeight="700">
                            {analytics.tasks.byStatus.todo}
                          </Typography>
                        </Box>
                        <Chip
                          label="Pending"
                          size="small"
                          sx={{ backgroundColor: 'rgba(101, 84, 192, 0.15)', color: '#6554C0' }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            In Progress
                          </Typography>
                          <Typography variant="h5" fontWeight="700">
                            {analytics.tasks.byStatus.inProgress}
                          </Typography>
                        </Box>
                        <Chip
                          label="Active"
                          size="small"
                          sx={{ backgroundColor: 'rgba(0, 82, 204, 0.15)', color: '#0052CC' }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Completed
                          </Typography>
                          <Typography variant="h5" fontWeight="700">
                            {analytics.tasks.byStatus.completed}
                          </Typography>
                        </Box>
                        <Chip
                          label="Done"
                          size="small"
                          sx={{ backgroundColor: 'rgba(54, 179, 126, 0.15)', color: '#36B37E' }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Priority Breakdown
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#FF5630',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            High Priority
                          </Typography>
                          <Typography variant="h6" fontWeight="700">
                            {analytics.tasks.byPriority.high}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#FFAB00',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Medium Priority
                          </Typography>
                          <Typography variant="h6" fontWeight="700">
                            {analytics.tasks.byPriority.medium}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#36B37E',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Low Priority
                          </Typography>
                          <Typography variant="h6" fontWeight="700">
                            {analytics.tasks.byPriority.low}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                  Alerts & Activity
                </Typography>

                <Grid container spacing={2}>
                  {analytics.tasks.overdue > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid rgba(255, 86, 48, 0.3)',
                          backgroundColor: 'rgba(255, 86, 48, 0.08)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <WarningIcon sx={{ color: '#FF5630' }} />
                          <Box>
                            <Typography variant="body1" fontWeight="600" color="error.main">
                              {analytics.tasks.overdue} Overdue Tasks
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tasks past their due date
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  )}

                  {analytics.tasks.dueSoon > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Card
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid rgba(255, 171, 0, 0.3)',
                          backgroundColor: 'rgba(255, 171, 0, 0.08)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <AccessTimeIcon sx={{ color: '#FFAB00' }} />
                          <Box>
                            <Typography variant="body1" fontWeight="600" color="warning.main">
                              {analytics.tasks.dueSoon} Due Soon
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tasks due within 7 days
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <Card sx={{ p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TrendingUpIcon sx={{ color: '#0052CC' }} />
                        <Box>
                          <Typography variant="body1" fontWeight="600">
                            {analytics.tasks.recentlyActive} Recently Active
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Tasks updated in last 7 days
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  {analytics.mostActiveBoard && (
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h5">{analytics.mostActiveBoard.icon}</Typography>
                          <Box>
                            <Typography variant="body1" fontWeight="600">
                              {analytics.mostActiveBoard.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Most active board ({analytics.mostActiveBoard.taskCount} tasks)
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  )}

                  {analytics.subtasks.total > 0 && (
                    <Grid item xs={12}>
                      <Card sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Subtask Progress
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(analytics.subtasks.completed / analytics.subtasks.total) * 100}
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                            }}
                          />
                          <Typography variant="body2" fontWeight="600">
                            {analytics.subtasks.completed} / {analytics.subtasks.total}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </motion.div>
            )}
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  )
}

export default Profile
