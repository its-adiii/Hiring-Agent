import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const Candidates = () => {
  const [name, setName] = useState('');
  const [resume, setResume] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:8000/candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/jobs');
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/screen_candidate', {
        name,
        resume,
      });
      setCandidates([response.data, ...candidates]);
      setName('');
      setResume('');
    } catch (error) {
      console.error('Error screening candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDetails(true);
  };

  const handleScheduleInterview = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenSchedule(true);
  };

  const handleScheduleSubmit = async () => {
    try {
      await axios.post('http://localhost:8000/interviews/schedule', {
        candidate_id: selectedCandidate.id,
        job_id: selectedJob,
        interview_date: interviewDate,
      });
      setOpenSchedule(false);
      setSelectedJob('');
      setInterviewDate('');
    } catch (err) {
      console.error('Failed to schedule interview:', err);
    }
  };

  const renderSkillChips = (skills) => {
    return skills.map((skill, index) => (
      <Chip
        key={index}
        label={skill}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ m: 0.5 }}
      />
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Candidates
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Candidate Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Resume/Profile"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="Paste candidate's resume or profile information here..."
          />
          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Screening...' : 'Screen Candidate'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Screened Candidates
      </Typography>
      <Grid container spacing={3}>
        {candidates.map((candidate) => (
          <Grid item xs={12} md={6} key={candidate.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {candidate.name}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {renderSkillChips(candidate.extracted_skills)}
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Experience Level: {candidate.experience_level}
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Typography component="legend">Technical Score</Typography>
                  <Rating value={candidate.technical_score / 20} readOnly precision={0.5} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend">Behavioral Score</Typography>
                  <Rating value={candidate.behavioral_score / 20} readOnly precision={0.5} />
                </Box>
                <Typography variant="body2">
                  {candidate.analysis}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleViewDetails(candidate)}>
                  View Details
                </Button>
                <Button size="small" color="primary" onClick={() => handleScheduleInterview(candidate)}>
                  Schedule Interview
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Candidate Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Candidate Details</DialogTitle>
        <DialogContent>
          {selectedCandidate && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">{selectedCandidate.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {selectedCandidate.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Experience:</strong> {selectedCandidate.experience} years
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Skills:</strong> {selectedCandidate.extracted_skills.join(', ')}
              </Typography>
              <Typography variant="body1">
                <strong>Summary:</strong>
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedCandidate.analysis}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              select
              fullWidth
              label="Select Job"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              margin="normal"
            >
              {jobs.map((job) => (
                <MenuItem key={job.id} value={job.id}>
                  {job.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Interview Date"
              type="datetime-local"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSchedule(false)}>Cancel</Button>
          <Button
            onClick={handleScheduleSubmit}
            variant="contained"
            color="primary"
            disabled={!selectedJob || !interviewDate}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Candidates;
