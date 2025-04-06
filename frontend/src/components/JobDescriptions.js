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
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const JobDescriptions = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [processedJDs, setProcessedJDs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/jobs');
      setProcessedJDs(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch job descriptions. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/process_job_description', {
        title,
        description,
      });
      setProcessedJDs([response.data, ...processedJDs]);
      setTitle('');
      setDescription('');
      setError(null);
    } catch (error) {
      console.error('Error processing job description:', error);
      setError('Failed to process job description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSkillChips = (skills) => {
    return skills?.map((skill, index) => (
      <Chip
        key={index}
        label={skill}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ m: 0.5 }}
      />
    )) || [];
  };

  const formatAnalysis = (text) => {
    return text.split('\n').map((line, index) => (
      <Typography key={index} variant="body2" paragraph>
        {line}
      </Typography>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Descriptions
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="Enter the full job description here..."
          />
          <Box sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Processing with AI...' : 'Process Job Description'}
            </Button>
          </Box>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom>
        Processed Job Descriptions
      </Typography>
      <Grid container spacing={3}>
        {processedJDs.map((jd) => (
          <Grid item xs={12} key={jd.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {jd.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Standardized Role: {jd.standardized_role}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Required Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {renderSkillChips(jd.required_skills)}
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Nice to Have Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {renderSkillChips(jd.nice_to_have_skills)}
                  </Box>
                </Box>
                
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Experience Level: {jd.experience_level}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  AI Analysis:
                </Typography>
                <Box sx={{ mt: 1, backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                  {formatAnalysis(jd.processed_description)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default JobDescriptions;
