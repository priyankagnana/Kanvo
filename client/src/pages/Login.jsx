import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ email: '', password: '' })

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
      navigate('/')
    } catch (err) {
    console.log('Error response:', err);
      const serverErrors = err?.errors || []
      const apiErrors = {}

      serverErrors.forEach(({ param, msg }) => {
        apiErrors[param] = msg
      })
       
      console.log(serverErrors)
      setErrors(apiErrors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          disabled={loading}
          error={!!errors.email}
          helperText={errors.email}
          aria-describedby="email-helper"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          disabled={loading}
          error={!!errors.password}
          helperText={errors.password}
          aria-describedby="password-helper"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Login
        </LoadingButton>
      </Box>
      <Button component={Link} to="/signup" sx={{ textTransform: 'none' }}>
        Don't have an account? Signup
      </Button>
    </>
  )
}

export default Login
