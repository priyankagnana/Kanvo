import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './css/custom-scrollbar.css';
import { CssBaseline, IconButton, Tooltip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AppLayout from './components/layout/Applayout';
import AuthLayout from './components/layout/AuthLayout';
import Home from './pages/Home';
import Board from './pages/Board';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Profile from './pages/Profile';


// Theme toggle component that hides on landing page
const ThemeToggle = ({ darkMode, onToggle }) => {
  const location = useLocation();

  // Hide on landing page
  if (location.pathname === '/') return null;

  return (
    <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow>
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1100,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
            transform: 'scale(1.1)'
          }
        }}
      >
        {darkMode ? <LightModeIcon sx={{ color: '#FFAB00' }} /> : <DarkModeIcon sx={{ color: '#6554C0' }} />}
      </IconButton>
    </Tooltip>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#0052CC',
        light: '#4C9AFF',
        dark: '#0747A6',
      },
      secondary: {
        main: '#6554C0',
        light: '#8777D9',
        dark: '#403294',
      },
      success: {
        main: '#36B37E',
        light: '#57D9A3',
        dark: '#006644',
      },
      warning: {
        main: '#FFAB00',
        light: '#FFE380',
        dark: '#FF8B00',
      },
      error: {
        main: '#FF5630',
        light: '#FF8F73',
        dark: '#DE350B',
      },
      background: {
        default: darkMode ? '#1a1a2e' : '#f4f5f7',
        paper: darkMode ? '#16213e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#172B4D',
        secondary: darkMode ? '#B3BAC5' : '#5E6C84',
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle2: {
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        color: darkMode ? '#B3BAC5' : '#5E6C84',
      },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: darkMode
              ? '0 1px 3px rgba(0,0,0,0.3)'
              : '0 1px 3px rgba(9,30,66,0.13)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            '&:hover': {
              boxShadow: darkMode
                ? '0 8px 16px rgba(0,0,0,0.4)'
                : '0 8px 16px rgba(9,30,66,0.25)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            fontWeight: 500,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<Landing />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          {/* Protected app routes */}
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={<Home />} />
            <Route path="boards" element={<Home />} />
            <Route path="boards/:boardId" element={<Board />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
