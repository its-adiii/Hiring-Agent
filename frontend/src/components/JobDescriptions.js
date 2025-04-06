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
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import axios from 'axios';

const JobDescriptions = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [parsedJobData, setParsedJobData] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [sortBy]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/jobs');
      let sortedJobs = [...response.data];
      
      if (sortBy === 'newest') {
        sortedJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortBy === 'oldest') {
        sortedJobs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
      
      setJobs(sortedJobs);
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedJob) {
        await axios.put(`http://localhost:8000/jobs/${selectedJob.id}`, formData);
      } else {
        const response = await axios.post('http://localhost:8000/jobs', formData);
        setParsedJobData(response.data);
      }
      fetchJobs();
      if (selectedJob) {
        handleCloseDialog();
      }
      setError(null);
    } catch (err) {
      setError('Failed to save job. Please try again.');
      console.error('Error saving job:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/jobs/${jobId}`);
      fetchJobs();
      setError(null);
    } catch (err) {
      setError('Failed to delete job. Please try again.');
      console.error('Error deleting job:', err);
    }
    setLoading(false);
  };

  const handleOpenDialog = (job = null) => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
      });
      setSelectedJob(job);
    } else {
      setFormData({
        title: '',
        description: '',
      });
      setSelectedJob(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
    setParsedJobData(null);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Listings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Job
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search jobs by title, description, or skills..."
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
                onClick={() => { setSortBy('oldest'); setFilterAnchorEl(null); }}
                selected={sortBy === 'oldest'}
              >
                Oldest First
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

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Grid>
        ) : filteredJobs.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No jobs found
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredJobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {job.title}
                    </Typography>
                    <IconButton size="small" onClick={() => handleOpenDialog(job)}>
                      <EditIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.standardized_role || 'Role not specified'}
                      </Typography>
                    </Box>
                    {job.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                    )}
                    {job.employment_type && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WorkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.employment_type}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {job.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {job.required_skills.slice(0, 4).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {job.required_skills.length > 4 && (
                      <Chip
                        label={`+${job.required_skills.length - 4}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, bgcolor: 'grey.50' }}>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(job)}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Job Dialog */}
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
          {selectedJob ? 'Edit Job' : 'Add New Job'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Job Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                helperText="Enter a detailed job description. Our AI will analyze it to extract required skills, experience level, and other details."
              />
            </Grid>

            {parsedJobData && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    AI Analysis Results
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Required Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {parsedJobData.required_skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Experience Level:
                  </Typography>
                  <Typography>
                    {parsedJobData.experience_level}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Expected Salary Range:
                  </Typography>
                  <Typography>
                    {parsedJobData.salary_range || 'Not specified'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Standardized Role:
                  </Typography>
                  <Typography>
                    {parsedJobData.standardized_role}
                  </Typography>
                </Grid>
              </>
            )}
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
            {loading ? <CircularProgress size={24} /> : selectedJob ? 'Save Changes' : 'Add Job'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDescriptions;
