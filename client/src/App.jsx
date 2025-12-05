import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './css/custom-scrollbar.css';
import { CssBaseline, Switch, FormControlLabel } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import AppLayout from './components/layout/Applayout';
import AuthLayout from './components/layout/AuthLayout';
import Home from './pages/Home';
import Board from './pages/Board';
import Signup from './pages/Signup';
import Login from './pages/Login';


function App() {
  const [darkMode, setDarkMode] = useState(true); 
  const theme = createTheme({
    palette: { mode: darkMode ? 'dark' : 'light' },
  });

  const handleToggle = () => {
    setDarkMode(!darkMode); 
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div style={{ position: 'fixed', top: 10, right: 40, zIndex: 1000 }}>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleToggle} />}
            label={darkMode ? 'Dark Mode' : 'Light Mode'}
          />
        </div>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="boards" element={<Home />} />
            <Route path="boards/:boardId" element={<Board />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
