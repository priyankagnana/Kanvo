import { Box, Button, TextField, IconButton, InputAdornment, Typography, Divider, Alert } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', general: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: '', password: '', general: '' })

    const formData = new FormData(e.target)
    const email = formData.get('email').trim()
    const password = formData.get('password').trim()

    const newErrors = {}
    if (!email) newErrors.email = 'Please fill this field'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address'

    if (!password) newErrors.password = 'Please fill this field'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const res = await authApi.login({ email, password })
      localStorage.setItem('token', res.token)
      navigate('/boards')
    } catch (err) {
      const serverErrors = err?.errors || []
      const apiErrors = { email: '', password: '', general: '' }

      serverErrors.forEach((error) => {
        const field = error.param || error.path
        const message = error.msg || error.message

        if (field && apiErrors.hasOwnProperty(field)) {
          apiErrors[field] = message
        } else if (message) {
          if (message.toLowerCase().includes('email')) {
            apiErrors.email = message
          } else if (message.toLowerCase().includes('password')) {
            apiErrors.password = message
          } else {
            apiErrors.general = message
          }
        }
      })

      // Default error for login failures
      if (!Object.values(apiErrors).some(v => v)) {
        apiErrors.general = 'Invalid email or password'
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
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
        Sign in to continue to your boards
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
          id="password"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
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
          Sign in
        </LoadingButton>
      </Box>

      <Divider sx={{ my: 2 }}>
        <Typography variant="caption" color="text.secondary">
          or
        </Typography>
      </Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Button
            component={Link}
            to="/signup"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              p: 0,
              minWidth: 'auto',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            Create one
          </Button>
        </Typography>
      </Box>
    </motion.div>
  )
}

export default Login
