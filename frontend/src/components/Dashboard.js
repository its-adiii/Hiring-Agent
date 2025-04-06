import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Work as WorkIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';
import circuitPattern from '../assets/circuit-pattern.svg';
import { useData } from '../context/DataContext';

// Animations with smoother timing
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
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
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Styled Components with enhanced effects
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${circuitPattern})`,
    backgroundSize: '600px 600px',
    backgroundRepeat: 'repeat',
    opacity: 0.1,
    zIndex: 0,
    animation: `${pulse} 15s ease-in-out infinite`,
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  animation: `${fadeIn} 0.5s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      animation: `${shimmer} 2s infinite`,
    }
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  borderRadius: '50%',
  padding: theme.spacing(2),
  color: 'white',
  boxShadow: '0 3px 15px rgba(33, 203, 243, .3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(45deg, #21cbf3 30%, #2196f3 90%)',
    transform: 'rotate(360deg) scale(1.1)',
    boxShadow: '0 5px 20px rgba(33, 203, 243, .5)',
  }
}));

const StatsNumber = styled(Typography)(({ theme }) => ({
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '2.5rem',
  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  animation: `${pulse} 2s infinite`,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 25,
  boxShadow: '0 3px 15px rgba(255, 105, 135, .3)',
  color: 'white',
  padding: '12px 35px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
    transform: 'scale(1.05)',
    boxShadow: '0 5px 20px rgba(255, 105, 135, .5)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      animation: `${shimmer} 1s infinite`,
    }
  }
}));

const Dashboard = () => {
  const { stats, recentActivity, metrics, loading, error } = useData();
  const theme = useTheme();

  if (loading) {
    return (
      <StyledContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Box sx={{ textAlign: 'center', color: '#fff', pt: 4 }}>
          <Typography variant="h5">{error}</Typography>
          <GradientButton onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Retry
          </GradientButton>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          sx={{
            color: '#fff',
            mb: 4,
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            animation: `${fadeIn} 0.5s ease-out`,
          }}
        >
          Welcome to SelectIQ
        </Typography>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard>
              <CardContent>
                <StyledIconButton>
                  <WorkIcon />
                </StyledIconButton>
                <StatsNumber>{stats.activeJobs}</StatsNumber>
                <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                  Active Jobs
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard>
              <CardContent>
                <StyledIconButton>
                  <PersonIcon />
                </StyledIconButton>
                <StatsNumber>{stats.candidates}</StatsNumber>
                <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                  Candidates
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard>
              <CardContent>
                <StyledIconButton>
                  <AssessmentIcon />
                </StyledIconButton>
                <StatsNumber>{stats.interviews}</StatsNumber>
                <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                  Interviews
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard>
              <CardContent>
                <StyledIconButton>
                  <CheckCircleIcon />
                </StyledIconButton>
                <StatsNumber>{stats.placements}</StatsNumber>
                <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                  Placements
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>

          {/* Metrics */}
          <Grid item xs={12} md={6}>
            <GlassCard>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Key Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon sx={{ color: '#4caf50', mr: 1 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                          Interview Success Rate
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={metrics.interviewSuccessRate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#fff', ml: 2 }}>
                        {metrics.interviewSuccessRate}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SearchIcon sx={{ color: '#2196f3', mr: 1 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                          Response Rate
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={metrics.responseRate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#fff', ml: 2 }}>
                        {metrics.responseRate}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </GlassCard>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <GlassCard>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
                  Recent Activity
                </Typography>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.1)',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: activity.type === 'job'
                          ? 'linear-gradient(45deg, #ff6b6b 30%, #ff8e53 90%)'
                          : activity.type === 'candidate'
                          ? 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)'
                          : 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                        mr: 2,
                      }}
                    >
                      {activity.type === 'job' ? (
                        <WorkIcon sx={{ color: '#fff' }} />
                      ) : activity.type === 'candidate' ? (
                        <PersonIcon sx={{ color: '#fff' }} />
                      ) : (
                        <AssessmentIcon sx={{ color: '#fff' }} />
                      )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};

export default Dashboard;
