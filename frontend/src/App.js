import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import { DataProvider } from './context/DataContext';
import AppRoutes from './routes';
import Navigation from './components/Navigation';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <Router>
          <div style={{ display: 'flex' }}>
            <Navigation />
            <main style={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
              <AppRoutes />
            </main>
          </div>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
