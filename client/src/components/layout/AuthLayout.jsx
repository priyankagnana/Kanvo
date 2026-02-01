import { Container, Box, Typography, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import assets from '../../assests/index'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/boards')
      }
    }
    checkAuth()
  }, [navigate])

  if (loading) return <Loading fullHeight />

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 50%, #d5dce4 100%)',
        p: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0,0,0,0.4)'
                  : '0 8px 32px rgba(9,30,66,0.15)',
              bgcolor: 'background.paper'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src={assets.images.logo}
                  alt="Kanvo Logo"
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: 'contain',
                    mb: 2
                  }}
                />
              </motion.div>

              {/* Brand Name */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '1px',
                  userSelect: 'none',
                  background: 'linear-gradient(135deg, #0052CC 0%, #6554C0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Kanvo
              </Typography>

              {/* Tagline */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Project management made simple
              </Typography>

              {/* Form Content */}
              <Box sx={{ width: '100%' }}>
                <Outlet />
              </Box>
            </Box>
          </Paper>

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3
            }}
          >
            Organize your work, achieve your goals
          </Typography>
        </motion.div>
      </Container>
    </Box>
  )
}

export default AuthLayout
