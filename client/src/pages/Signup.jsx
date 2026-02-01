import { Box, Button, TextField, IconButton, InputAdornment, Typography, Divider, Alert } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    general: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: '', username: '', password: '', confirmPassword: '', general: '' })

    const formData = new FormData(e.target)
    const email = formData.get('email').trim()
    const username = formData.get('username').trim()
    const password = formData.get('password').trim()
    const confirmPassword = formData.get('confirmPassword').trim()

    const newErrors = {}
    if (!email) newErrors.email = 'Please fill this field'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'

    if (!username) newErrors.username = 'Please fill this field'
    else if (username.length > 10) newErrors.username = 'Username must be at most 10 characters'

    if (!password) newErrors.password = 'Please fill this field'
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    else if (!/\d/.test(password)) newErrors.password = 'Password must contain at least one number'
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = 'Password must contain at least one special character'

    if (!confirmPassword) newErrors.confirmPassword = 'Please fill this field'
    else if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Confirm password does not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const res = await authApi.signup({ email, username, password, confirmPassword })
      localStorage.setItem('token', res.token)
      navigate('/boards')
    } catch (err) {
      const serverErrors = err?.errors || []
      const apiErrors = { email: '', username: '', password: '', confirmPassword: '', general: '' }

      serverErrors.forEach((error) => {
        const field = error.param || error.path
        const message = error.msg || error.message

        if (field && apiErrors.hasOwnProperty(field)) {
          apiErrors[field] = message
        } else if (message) {
          // Check if message mentions a specific field
          if (message.toLowerCase().includes('email')) {
            apiErrors.email = message
          } else if (message.toLowerCase().includes('username')) {
            apiErrors.username = message
          } else if (message.toLowerCase().includes('password')) {
            apiErrors.password = message
          } else {
            apiErrors.general = message
          }
        }
      })

      // If no specific errors were set, show a general error
      if (serverErrors.length > 0 && !Object.values(apiErrors).some(v => v)) {
        apiErrors.general = 'Something went wrong. Please try again.'
      }

      setErrors(apiErrors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Typography variant="h5" fontWeight={600} textAlign="center" sx={{ mb: 1 }}>
        Create your account
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        Start organizing your projects today
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errors.general}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email address"
          name="email"
          autoComplete="email"
          autoFocus
          disabled={loading}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          disabled={loading}
          error={!!errors.username}
          helperText={errors.username}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          disabled={loading}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  disabled={loading}
                  size="small"
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          disabled={loading}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                  disabled={loading}
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        <LoadingButton
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0747A6 0%, #403294 100%)'
            }
          }}
          variant="contained"
          fullWidth
          type="submit"
          loading={loading}
        >
          Create account
        </LoadingButton>
      </Box>

      <Divider sx={{ my: 2 }}>
        <Typography variant="caption" color="text.secondary">
          or
        </Typography>
      </Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Button
            component={Link}
            to="/login"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              p: 0,
              minWidth: 'auto',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            Sign in
          </Button>
        </Typography>
      </Box>
    </motion.div>
  )
}

export default Signup
