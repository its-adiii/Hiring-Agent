import React from 'react';
import { Grid, Paper, Typography, Box, IconButton, CircularProgress, Divider, Button } from '@mui/material';
import { 
  People as PeopleIcon, 
  Work as WorkIcon, 
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  PersonSearch as PersonSearchIcon,
  BusinessCenter as BusinessCenterIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  AutoGraph as AutoGraphIcon,
  Psychology as PsychologyIcon,
  Diversity3 as Diversity3Icon,
  RocketLaunch as RocketLaunchIcon
} from '@mui/icons-material';
import { useData } from '../context/DataContext';
import { styled } from '@mui/material/styles';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const GradientPaper = styled(Paper)(({ gradient }) => ({
  background: gradient,
  color: '#fff',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  }
}));

const IconWrapper = styled(Box)({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
});

const Dashboard = () => {
  const { stats, loading, error, refreshData } = useData();

  // Debug log
  console.log('Dashboard stats:', stats);

  const gradientCards = [
    { 
      title: 'Total Candidates', 
      value: stats?.candidates ?? 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#fff' }}/>,
      gradient: 'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)'
    },
    { 
      title: ['Active', 'Jobs'], 
      value: stats?.activeJobs ?? 0,
      icon: <WorkIcon sx={{ fontSize: 40, color: '#fff' }}/>,
      gradient: 'linear-gradient(135deg, #26a69a 0%, #009688 100%)'
    },
    { 
      title: ['Total', 'Matches'], 
      value: stats?.total_matches ?? 0,
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#fff' }}/>,
      gradient: 'linear-gradient(135deg, #7cb342 0%, #689f38 100%)'
    },
    { 
      title: ['Successful', 'Matches'], 
      value: stats?.successful_matches ?? 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#fff' }}/>,
      gradient: 'linear-gradient(135deg, #fb8c00 0%, #f57c00 100%)'
    },
    { 
      title: 'Screening Rate', 
      value: `${stats?.screening_rate ?? 0}%`,
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#fff' }}/>,
      gradient: 'linear-gradient(135deg, #e53935 0%, #d32f2f 100%)'
    }
  ];

  // Constants
  const RADIAN = Math.PI / 180;
  const SKILLS_COLORS = ['#5c6bc0', '#26a69a', '#7cb342', '#fb8c00'];
  const PROGRESS_COLORS = ['#5c6bc0', '#26a69a', '#7cb342', '#fb8c00'];
  const TREND_COLORS = ['#5c6bc0'];

  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Add refresh button
  const handleRefresh = () => {
    refreshData();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={handleRefresh} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  const features = [
    {
      icon: <AutoGraphIcon sx={{ fontSize: 40 }}/>,
      title: "AI-Driven Matching",
      description: "Advanced algorithms for precise candidate-job fit"
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40 }}/>,
      title: "Smart Screening",
      description: "Automated skill assessment and personality matching"
    },
    {
      icon: <Diversity3Icon sx={{ fontSize: 40 }}/>,
      title: "Talent Pipeline",
      description: "Streamlined recruitment workflow management"
    },
    {
      icon: <RocketLaunchIcon sx={{ fontSize: 40 }}/>,
      title: "Quick Deployment",
      description: "Rapid candidate placement and onboarding"
    }
  ];

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3,
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      minHeight: '100vh'
    }}>
      {/* Brand Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h1" sx={{ 
            color: '#fff',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 4,
            mb: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -20,
              top: '50%',
              width: 40,
              height: 4,
              background: 'linear-gradient(90deg, transparent, #fff)',
              transform: 'translateY(-50%)'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -20,
              top: '50%',
              width: 40,
              height: 4,
              background: 'linear-gradient(90deg, #fff, transparent)',
              transform: 'translateY(-50%)'
            }
          }}>
            Select<Box component="span" sx={{ 
              color: '#4fc3f7',
              position: 'relative',
              '&::before': {
                content: '"-"',
                position: 'absolute',
                left: 0,
                color: '#fff'
              }
            }}>IQ</Box>
          </Typography>

          <Box sx={{ 
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
            }
          }}>
            <Typography variant="h4" sx={{ 
              color: '#fff',
              opacity: 0.9,
              fontWeight: 500,
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              textTransform: 'uppercase',
              letterSpacing: 2
            }}>
              Next-Gen Hiring
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ 
            color: '#4fc3f7',
            fontWeight: 600,
            letterSpacing: 3,
            mt: 2,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            textTransform: 'uppercase',
            position: 'relative',
            display: 'inline-block',
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              width: { xs: 20, sm: 30, md: 40 },
              height: 2,
              background: '#4fc3f7',
              transform: 'translateY(-50%)'
            },
            '&::before': {
              left: { xs: -30, sm: -40, md: -60 }
            },
            '&::after': {
              right: { xs: -30, sm: -40, md: -60 }
            }
          }}>
            Engineered by AI
          </Typography>
        </Box>

        <Box sx={{ 
          mt: 6,
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'wrap'
        }}>
          {['Innovation', 'Intelligence', 'Precision', 'Speed'].map((value, index) => (
            <Box key={index} sx={{ 
              px: 3,
              py: 1,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#4fc3f7'
              }} />
              <Typography sx={{ 
                color: '#fff',
                fontWeight: 500,
                letterSpacing: 1
              }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Product Overview */}
      <Box sx={{ 
        mb: 6,
        p: 4,
        borderRadius: 4,
        maxWidth: 1400,
        mx: 'auto'
      }}>
        {/* Introduction Text */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ 
            color: '#fff',
            mb: 3,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #4fc3f7, #00b0ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Revolutionizing Talent Acquisition with AI
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            maxWidth: '800px',
            mx: 'auto',
            mb: 2
          }}>
            Select-IQ is an advanced AI-powered recruitment platform that transforms how organizations discover and secure top talent. Our intelligent system combines cutting-edge machine learning algorithms with proven HR methodologies.
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            maxWidth: '800px',
            mx: 'auto'
          }}>
            Experience a seamless end-to-end recruitment process with our comprehensive suite of tools designed for modern HR professionals.
          </Typography>
        </Box>

        <Grid 
          container 
          spacing={4} 
          sx={{ 
            display: 'grid',
            gridTemplateRows: 'auto auto',
            gridTemplateColumns: '1fr 1fr',
            gap: 3,
            '& > .MuiGrid-item': {
              width: '100%',
              margin: 0,
              padding: 0
            }
          }}
        >
          {features.map((feature, index) => (
            <Grid item key={index}>
              <Box sx={{ 
                textAlign: 'center',
                p: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: index === 0 
                  ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
                  : index === 1
                  ? 'linear-gradient(135deg, #004d40 0%, #00796b 100%)'
                  : index === 2
                  ? 'linear-gradient(135deg, #bf360c 0%, #e64a19 100%)'
                  : 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)',
                borderRadius: '16px',
                minHeight: 220,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                }
              }}>
                <Box 
                  className="feature-icon"
                  sx={{ 
                    color: '#fff',
                    mb: 3,
                    '& svg': {
                      fontSize: '2.5rem'
                    }
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ 
                  color: '#fff',
                  mb: 2,
                  fontWeight: 500,
                  fontSize: '1.5rem'
                }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  maxWidth: '85%'
                }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ 
        my: 6, 
        borderColor: 'rgba(255,255,255,0.1)',
        width: '100%'
      }}/>

      {/* Existing Dashboard Content */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: '#fff' }}>
        Dashboard Overview
      </Typography>

      <Grid 
        container 
        spacing={3} 
        sx={{ 
          mb: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 3,
          '& > .MuiGrid-item': {
            width: '100%',
            margin: 0,
            padding: 0
          }
        }}
      >
        {gradientCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={index === 4 ? 12 : 6} lg={index === 4 ? 12 : 3} key={index}>
            <GradientPaper gradient={card.gradient} sx={{ 
              minHeight: '200px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              textAlign: 'center' 
            }}>
              <IconWrapper>
                {card.icon}
              </IconWrapper>
              <Typography variant="h3" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                {card.value}
              </Typography>
              {Array.isArray(card.title) ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {card.title.map((part, i) => (
                    <Typography key={i} variant="h6" sx={{ 
                      opacity: 0.8, 
                      lineHeight: 1.2,
                      mb: i === 0 ? 0.5 : 0
                    }}>
                      {part}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="h6" sx={{ opacity: 0.8 }}>
                  {card.title}
                </Typography>
              )}
            </GradientPaper>
          </Grid>
        ))}
      </Grid>

      {/* Stats Section */}
      <Grid 
        container 
        sx={{ 
          mb: 6, 
          mt: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 3,
          '& > .MuiGrid-item': {
            width: '100%',
            margin: 0,
            padding: 0
          }
        }}
      >
        <Grid item>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            height: '100%',
            minHeight: 450
          }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Candidate Pipeline
            </Typography>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={[
                  { stage: 'Applied', count: stats?.candidates ?? 0 },
                  { stage: 'Screened', count: stats?.screened_candidates ?? 0 },
                  { stage: 'Interviewed', count: stats?.interviewed_candidates ?? 0 },
                  { stage: 'Hired', count: stats?.hired_candidates ?? 0 }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="stage" 
                  tick={{ fill: '#fff', fontSize: 14 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  tick={{ fill: '#fff', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.8)', 
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="count" fill="#8884d8">
                  {PROGRESS_COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            height: '100%',
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Skill Distribution
            </Typography>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Technical', value: stats?.technical_skills ?? 35 },
                      { name: 'Soft Skills', value: stats?.soft_skills ?? 25 },
                      { name: 'Leadership', value: stats?.leadership_skills ?? 20 },
                      { name: 'Domain', value: stats?.domain_skills ?? 20 }
                    ]}
                    cx="50%"
                    cy="45%"
                    labelLine={true}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {SKILLS_COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#333'
                    }} 
                  />
                  <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item>
          <Paper sx={{
            p: 3,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            height: '100%',
            minHeight: 450
          }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
              Hiring Trends
            </Typography>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart
                data={[
                  { month: 'Jan', hires: stats?.monthly_hires?.[0] ?? 12 },
                  { month: 'Feb', hires: stats?.monthly_hires?.[1] ?? 19 },
                  { month: 'Mar', hires: stats?.monthly_hires?.[2] ?? 15 },
                  { month: 'Apr', hires: stats?.monthly_hires?.[3] ?? 22 },
                  { month: 'May', hires: stats?.monthly_hires?.[4] ?? 25 },
                  { month: 'Jun', hires: stats?.monthly_hires?.[5] ?? 17 }
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.8)', 
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff'
                  }} 
                />
                <Line type="monotone" dataKey="hires" stroke={TREND_COLORS[0]} strokeWidth={2} dot={{ fill: TREND_COLORS[0] }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Feature Cards */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <GradientPaper gradient="linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonSearchIcon sx={{ fontSize: 30, color: '#fff', mr: 2 }} />
              <Typography variant="h6">AI-Powered Screening</Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Our advanced AI algorithms analyze candidate profiles and job requirements to find the perfect match.
              The system considers skills, experience, and cultural fit to provide accurate recommendations.
            </Typography>
          </GradientPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <GradientPaper gradient="linear-gradient(135deg, #004d40 0%, #00796b 100%)">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessCenterIcon sx={{ fontSize: 30, color: '#fff', mr: 2 }} />
              <Typography variant="h6">Smart Job Matching</Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Efficiently match candidates with suitable job positions using our intelligent matching system.
              Get detailed insights and analytics to make informed hiring decisions.
            </Typography>
          </GradientPaper>
        </Grid>
      </Grid>

      {/* Stats Footer */}
      <GradientPaper 
        gradient="linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)"
        sx={{ mt: 3, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          <Typography>
            System Uptime: <strong>{stats?.system_uptime ?? '0%'}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
          <AssessmentIcon sx={{ mr: 1 }} />
          <Typography>
            Success Rate: <strong>{stats?.success_rate ?? '0%'}</strong>
          </Typography>
        </Box>
      </GradientPaper>
    </Box>
  );
};

export default Dashboard;
