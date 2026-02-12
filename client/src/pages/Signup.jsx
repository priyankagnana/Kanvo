import { Box, TextField, IconButton, InputAdornment, Typography, Alert, LinearProgress } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const passwordRules = [
  { label: '8+ characters', test: (p) => p.length >= 8 },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
]

const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' }
  const passed = passwordRules.filter(r => r.test(password)).length
  if (passed <= 1) return { score: 33, label: 'Weak', color: '#FF5630' }
  if (passed === 2) return { score: 66, label: 'Medium', color: '#FFAB00' }
  return { score: 100, label: 'Strong', color: '#22c55e' }
}

const Signup = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', username: '', password: '', confirmPassword: '', general: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const strength = getStrength(password)

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
    setErrors({ email: '', username: '', password: '', confirmPassword: '', general: '' })

    const formData = new FormData(e.target)
    const email = formData.get('email').trim()
    const usernameVal = formData.get('username').trim()
    const passwordVal = formData.get('password').trim()
    const confirmPassword = formData.get('confirmPassword').trim()

    const newErrors = {}
    if (!email) newErrors.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email'
    if (!usernameVal) newErrors.username = 'Required'
    else if (usernameVal.length > 10) newErrors.username = 'Max 10 characters'
    if (!passwordVal) newErrors.password = 'Required'
    else if (passwordVal.length < 8) newErrors.password = 'Min 8 characters'
    else if (!/\d/.test(passwordVal)) newErrors.password = 'Needs a number'
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordVal)) newErrors.password = 'Needs a special character'
    if (!confirmPassword) newErrors.confirmPassword = 'Required'
    else if (passwordVal && confirmPassword !== passwordVal) newErrors.confirmPassword = 'Passwords don\'t match'

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      const res = await authApi.signup({ email, username: usernameVal, password: passwordVal, confirmPassword })
      localStorage.setItem('token', res.token)
      navigate('/boards')
    } catch (err) {
      const apiErrors = { email: '', username: '', password: '', confirmPassword: '', general: '' }

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
            else if (message.toLowerCase().includes('username')) apiErrors.username = message
            else if (message.toLowerCase().includes('password')) apiErrors.password = message
            else apiErrors.general = message
          }
        })
        if (serverErrors.length > 0 && !Object.values(apiErrors).some(v => v)) apiErrors.general = 'Something went wrong. Please try again.'
      }
      setErrors(apiErrors)
    } finally { setLoading(false) }
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: dark ? '#fafafa' : '#111113', mb: 0.5 }}>
        Create your account
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: dark ? '#52525b' : '#a1a1aa', mb: 4 }}>
        Start organizing your projects today
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
            fullWidth label="Username" name="username" autoComplete="username"
            disabled={loading} error={!!errors.username}
            helperText={errors.username || `${username.length}/10`}
            value={username}
            onChange={(e) => { if (e.target.value.length <= 10) setUsername(e.target.value) }}
            inputProps={{ maxLength: 10 }}
            FormHelperTextProps={{ sx: { color: dark ? '#3f3f46' : '#a1a1aa', fontSize: '0.7rem' } }}
            sx={inputSx}
          />
          <Box>
            <TextField
              fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              disabled={loading} error={!!errors.password} helperText={errors.password}
              value={password} onChange={(e) => setPassword(e.target.value)}
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
            {password && (
              <Box sx={{ mt: 1.5, mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LinearProgress
                    variant="determinate" value={strength.score}
                    sx={{
                      flex: 1, height: 3, borderRadius: 2,
                      bgcolor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                      '& .MuiLinearProgress-bar': { bgcolor: strength.color, borderRadius: 2 }
                    }}
                  />
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: strength.color, minWidth: 40 }}>
                    {strength.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password)
                    return (
                      <Box key={rule.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {passed
                          ? <CheckCircleIcon sx={{ fontSize: 12, color: '#22c55e' }} />
                          : <RadioButtonUncheckedIcon sx={{ fontSize: 12, color: dark ? '#3f3f46' : '#d4d4d8' }} />
                        }
                        <Typography sx={{ fontSize: '0.65rem', color: passed ? '#22c55e' : (dark ? '#52525b' : '#a1a1aa') }}>
                          {rule.label}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            )}
          </Box>
          <TextField
            fullWidth label="Confirm password" name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password"
            disabled={loading} error={!!errors.confirmPassword} helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle confirm password visibility" onClick={() => setShowConfirmPassword(p => !p)} edge="end" size="small" sx={{ color: dark ? '#52525b' : '#a1a1aa' }}>
                    {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
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
          Create account
        </LoadingButton>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.8rem', color: dark ? '#3f3f46' : '#a1a1aa' }}>
          Already have an account?{' '}
          <Typography
            component={Link} to="/login"
            sx={{ color: dark ? '#a1a1aa' : '#52525b', fontWeight: 600, textDecoration: 'none', '&:hover': { color: dark ? '#fafafa' : '#111113' }, transition: 'color 0.2s' }}
          >
            Sign in
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

export default Signup
