import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: 'rgba(26, 35, 126, 0.95)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 2),
  borderRadius: theme.spacing(1),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateX(5px)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.secondary.main : 'rgba(255, 255, 255, 0.7)',
    transition: 'color 0.3s ease',
  },
  '& .MuiListItemText-primary': {
    color: active ? '#fff' : 'rgba(255, 255, 255, 0.7)',
    fontFamily: theme.typography.button.fontFamily,
    fontWeight: 500,
    transition: 'color 0.3s ease',
  },
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Jobs', icon: <WorkIcon />, path: '/jobs' },
  { text: 'Candidates', icon: <PersonIcon />, path: '/candidates' },
  { text: 'Screening', icon: <AssessmentIcon />, path: '/screening' },
];

const Navigation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Logo>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            color: '#fff',
            fontWeight: 700,
            textAlign: 'center',
            fontFamily: theme.typography.h1.fontFamily,
          }}
        >
          SelectIQ
          <Typography
            component="span"
            sx={{
              display: 'block',
              fontSize: '0.8rem',
              color: theme.palette.secondary.main,
              fontWeight: 500,
            }}
          >
            AI-Powered Recruitment
          </Typography>
        </Typography>
      </Logo>
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <StyledListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            active={location.pathname === item.path ? 1 : 0}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          left: 16,
          top: 16,
          zIndex: 1200,
          display: { sm: 'none' },
          background: theme.palette.primary.main,
          '&:hover': {
            background: theme.palette.primary.dark,
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        {/* Mobile drawer */}
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {drawer}
        </StyledDrawer>
        {/* Desktop drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>
    </>
  );
};

export default Navigation;
