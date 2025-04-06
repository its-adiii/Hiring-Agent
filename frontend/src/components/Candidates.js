import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Autocomplete,
  Divider,
  Paper,
  Avatar,
  Rating,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: [],
    linkedin_url: '',
    github_url: '',
    resume_url: '',
  });

  useEffect(() => {
    fetchCandidates();
  }, [sortBy]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/candidates');
      let sortedCandidates = [...response.data];
      
      if (sortBy === 'newest') {
        sortedCandidates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortBy === 'experience') {
        sortedCandidates.sort((a, b) => (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0));
      }
      
      setCandidates(sortedCandidates);
      setError(null);
    } catch (err) {
      setError('Failed to fetch candidates. Please try again later.');
      console.error('Error fetching candidates:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCandidate) {
        await axios.put(`http://localhost:8000/candidates/${selectedCandidate.id}`, formData);
      } else {
        await axios.post('http://localhost:8000/candidates', formData);
      }
      fetchCandidates();
      handleCloseDialog();
      setError(null);
    } catch (err) {
      setError('Failed to save candidate. Please try again.');
      console.error('Error saving candidate:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/candidates/${candidateId}`);
      fetchCandidates();
      setError(null);
    } catch (err) {
      setError('Failed to delete candidate. Please try again.');
      console.error('Error deleting candidate:', err);
    }
    setLoading(false);
  };

  const handleOpenDialog = (candidate = null) => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        experience: candidate.experience || '',
        education: candidate.education || '',
        skills: candidate.skills || [],
        linkedin_url: candidate.linkedin_url || '',
        github_url: candidate.github_url || '',
        resume_url: candidate.resume_url || '',
      });
      setSelectedCandidate(candidate);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        skills: [],
        linkedin_url: '',
        github_url: '',
        resume_url: '',
      });
      setSelectedCandidate(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCandidate(null);
  };

  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getRandomColor = (name) => {
    const colors = ['#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#1565c0', '#c62828'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Candidates
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Candidate
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search candidates by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<FilterIcon />}
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              variant="outlined"
            >
              Sort By
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
            >
              <MenuItem 
                onClick={() => { setSortBy('newest'); setFilterAnchorEl(null); }}
                selected={sortBy === 'newest'}
              >
                Newest First
              </MenuItem>
              <MenuItem 
                onClick={() => { setSortBy('experience'); setFilterAnchorEl(null); }}
                selected={sortBy === 'experience'}
              >
                Most Experienced
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Candidates Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Grid>
        ) : filteredCandidates.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No candidates found
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredCandidates.map((candidate) => (
            <Grid item xs={12} md={6} lg={4} key={candidate.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: getRandomColor(candidate.name),
                        fontSize: '1.5rem',
                        mr: 2
                      }}
                    >
                      {getInitials(candidate.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {candidate.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {candidate.email}
                        </Typography>
                      </Box>
                      {candidate.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {candidate.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {candidate.experience && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {candidate.experience} years of experience
                        </Typography>
                      </Box>
                    )}
                    {candidate.education && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {candidate.education}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                      {candidate.skills.length > 4 && (
                        <Chip
                          label={`+${candidate.skills.length - 4}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {candidate.linkedin_url && (
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => window.open(candidate.linkedin_url, '_blank')}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    )}
                    {candidate.github_url && (
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => window.open(candidate.github_url, '_blank')}
                      >
                        <GitHubIcon />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, bgcolor: 'grey.50' }}>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(candidate.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(candidate)}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Candidate Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        sx={{
          zIndex: 9999,
          '& .MuiDialog-paper': {
            backgroundColor: '#ffffff',
            opacity: 1,
            minWidth: '60vw',
          },
          '& .MuiDialogContent-root': {
            backgroundColor: '#ffffff',
            opacity: 1,
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          mb: 2
        }}>
          {selectedCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.skills}
                onChange={(e, newValue) => setFormData({ ...formData, skills: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    placeholder="Type and press enter to add skills"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume URL"
                value={formData.resume_url}
                onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : selectedCandidate ? 'Save Changes' : 'Add Candidate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Candidates;
