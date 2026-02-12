import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import SearchOffIcon from '@mui/icons-material/SearchOff'

const NotFound = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', p: 4 }}>
      <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>404</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
        This page doesn't exist. It may have been moved or deleted.
      </Typography>
      <Button component={Link} to="/boards" variant="contained" sx={{ textTransform: 'none' }}>
        Back to boards
      </Button>
    </Box>
  )
}

export default NotFound
