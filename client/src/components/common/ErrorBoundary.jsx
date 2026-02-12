import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', p: 4 }}>
          <ErrorOutlineIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Something went wrong</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
            An unexpected error occurred. Try reloading the page.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ textTransform: 'none' }}>
            Reload page
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
