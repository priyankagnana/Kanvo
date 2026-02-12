import React, { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert } from '@mui/material'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity })
  }, [])

  const success = useCallback((msg) => showToast(msg, 'success'), [showToast])
  const error = useCallback((msg) => showToast(msg, 'error'), [showToast])
  const warning = useCallback((msg) => showToast(msg, 'warning'), [showToast])
  const info = useCallback((msg) => showToast(msg, 'info'), [showToast])

  const handleClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return
    setToast(prev => ({ ...prev, open: false }))
  }, [])

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', fontWeight: 500 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export default ToastProvider
