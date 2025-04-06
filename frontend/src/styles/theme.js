import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 500,
    },
    h5: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 500,
    },
    h6: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
    },
    button: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ff9e9b',
      dark: '#c73e3e',
    },
    background: {
      default: '#f5f5f5',
      paper: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

// Shared animations
export const animations = {
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `,
};

// Shared styled components
export const sharedStyles = {
  glassCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
    },
  },
  gradientButton: {
    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 15px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '12px 35px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
      transform: 'scale(1.05)',
      boxShadow: '0 5px 20px rgba(255, 105, 135, .5)',
    },
  },
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
};
