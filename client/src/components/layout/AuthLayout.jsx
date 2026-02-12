import { Box, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import assets from '../../assests/index'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const dark = theme.palette.mode === 'dark'

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
        bgcolor: dark ? '#111113' : '#fafafa',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
          <Box
            component="img"
            src={assets.images.logo}
            alt="Kanvo"
            sx={{ width: 28, height: 28, objectFit: 'contain' }}
          />
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', color: dark ? '#fafafa' : '#111113' }}>
            Kanvo
          </Typography>
        </Box>
      </Box>

      {/* Form area */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, pb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          <Outlet />
        </motion.div>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', pb: 3 }}>
        <Typography sx={{ fontSize: '0.72rem', color: dark ? '#3f3f46' : '#a1a1aa' }}>
          2025 Kanvo. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default AuthLayout
