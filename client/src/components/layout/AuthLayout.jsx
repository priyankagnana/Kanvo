import { Container, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  if (loading) return <Loading fullHeight />

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <Box
          component="span"
          sx={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '1px',
            userSelect: 'none'
          }}
        >
          Productio
        </Box>
        <Outlet />
      </Box>
    </Container>
  )
}

export default AuthLayout
