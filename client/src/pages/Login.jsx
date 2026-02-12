import { Box, TextField, IconButton, InputAdornment, Typography, Alert } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', general: '' })
  const [showPassword, setShowPassword] = useState(false)

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      bgcolor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      '& fieldset': { borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)' },
      '&:hover fieldset': { borderColor: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)' },
      '&.Mui-focused fieldset': { borderColor: dark ? '#fafafa' : '#111113', borderWidth: 1 }
    },
    '& .MuiInputLabel-root': { color: dark ? '#52525b' : '#a1a1aa', fontSize: '0.875rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: dark ? '#a1a1aa' : '#52525b' },
    '& .MuiOutlinedInput-input': { color: dark ? '#fafafa' : '#111113', fontSize: '0.9rem' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: '', password: '', general: '' })

    const formData = new FormData(e.target)
    const email = formData.get('email').trim()
    const password = formData.get('password').trim()

    const newErrors = {}
    if (!email) newErrors.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email'
    if (!password) newErrors.password = 'Required'

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const res = await authApi.login({ email, password })
      localStorage.setItem('token', res.token)
      navigate('/boards')
    } catch (err) {
      const apiErrors = { email: '', password: '', general: '' }

      // Handle direct message (e.g. rate limiter, server errors)
      if (err?.message && !err?.errors) {
        apiErrors.general = err.message
      } else {
        const serverErrors = err?.errors || []
        serverErrors.forEach((error) => {
          const field = error.param || error.path
          const message = error.msg || error.message
          if (field && apiErrors.hasOwnProperty(field)) apiErrors[field] = message
          else if (message) {
            if (message.toLowerCase().includes('email')) apiErrors.email = message
            else if (message.toLowerCase().includes('password')) apiErrors.password = message
            else apiErrors.general = message
          }
        })
        if (!Object.values(apiErrors).some(v => v)) apiErrors.general = 'Invalid email or password'
      }

      setErrors(apiErrors)
    } finally { setLoading(false) }
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: dark ? '#fafafa' : '#111113', mb: 0.5 }}>
        Welcome back
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: dark ? '#52525b' : '#a1a1aa', mb: 4 }}>
        Sign in to continue to your boards
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px', fontSize: '0.825rem' }}>
            {errors.general}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth label="Email" name="email" autoComplete="email" autoFocus
            disabled={loading} error={!!errors.email} helperText={errors.email} sx={inputSx}
          />
          <TextField
            fullWidth label="Password" name="password"
            type={showPassword ? 'text' : 'password'} autoComplete="current-password"
            disabled={loading} error={!!errors.password} helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(p => !p)} edge="end" size="small" sx={{ color: dark ? '#52525b' : '#a1a1aa' }}>
                    {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={inputSx}
          />
        </Box>

        <LoadingButton
          variant="contained" fullWidth type="submit" loading={loading}
          endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
          sx={{
            mt: 3.5, py: 1.25, borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none',
            bgcolor: dark ? '#fafafa' : '#111113',
            color: dark ? '#111113' : '#fafafa',
            boxShadow: 'none',
            '&:hover': { bgcolor: dark ? '#e4e4e7' : '#27272a', boxShadow: 'none' }
          }}
        >
          Sign in
        </LoadingButton>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.8rem', color: dark ? '#3f3f46' : '#a1a1aa' }}>
          Don't have an account?{' '}
          <Typography
            component={Link} to="/signup"
            sx={{ color: dark ? '#a1a1aa' : '#52525b', fontWeight: 600, textDecoration: 'none', '&:hover': { color: dark ? '#fafafa' : '#111113' }, transition: 'color 0.2s' }}
          >
            Create one
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

export default Login
