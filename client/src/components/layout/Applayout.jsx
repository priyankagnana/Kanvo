import { Box, IconButton } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { setUser } from '../../redux/features/userSlice'
import MenuIcon from '@mui/icons-material/Menu'

const AppLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authUtils.isAuthenticated()
      if (!user) {
        navigate('/login')
      } else {
        dispatch(setUser(user))
        setLoading(false)
      }
    }
    checkAuth()
  }, [navigate, dispatch])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Box sx={{ display: 'flex' }}>
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        {/* Mobile menu button */}
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 1099,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.paper' }
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{
          flexGrow: 1,
          p: 1,
          width: { xs: '100%', md: 'calc(100% - 250px)' }
        }}>
          <Outlet />
        </Box>
      </Box>
    )
  )
}

export default AppLayout
