import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Rating,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Paper
} from '@mui/material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Visibility from '@mui/icons-material/Visibility';

const Screening = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionType, setQuestionType] = useState('technical');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Current screenings:', screenings); // Debug log
  }, [screenings]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, candidatesRes, screeningsRes] = await Promise.all([
        axios.get('http://localhost:8000/jobs'),
        axios.get('http://localhost:8000/candidates'),
        axios.get('http://localhost:8000/matches')
      ]);
      setJobs(jobsRes.data);
      setCandidates(candidatesRes.data);
      setScreenings(screeningsRes.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!selectedJob || !selectedCandidate) {
      setError('Please select both a job and a candidate');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/match_candidate_job', {
        job_id: selectedJob.id,
        candidate_id: selectedCandidate.id
      });
      setScreenings([response.data, ...screenings]);
      setSelectedJob(null);
      setSelectedCandidate(null);
      setError(null);
    } catch (error) {
      console.error('Error creating match:', error);
      setError('Failed to create match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoScreen = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting auto screening...');
      const response = await axios.post('http://localhost:8000/auto_screen');
      console.log('Auto screening response:', response.data);
      
      if (Array.isArray(response.data)) {
        setScreenings(response.data);
        console.log('Updated screenings:', response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Received invalid data format from server');
      }
      
      setSelectedJob(null);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Error in auto screening:', error);
      setError(error.response?.data?.detail || 'Failed to complete automatic screening. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const MatchScoreBreakdown = ({ matchData }) => {
    // Extract scores from the match data
    const skillMatchScore = matchData?.skill_match_details?.score || 0;
    const experienceMatchScore = matchData?.experience_match_score || 0;
    const overallMatchScore = matchData?.overall_match_score || 0;

    const data = [
      { 
        category: 'Skills', 
        score: Math.round(skillMatchScore * 100),
        tooltip: `Skills Match: ${(skillMatchScore * 100).toFixed(1)}%`
      },
      { 
        category: 'Experience', 
        score: Math.round(experienceMatchScore * 100),
        tooltip: `Experience Match: ${(experienceMatchScore * 100).toFixed(1)}%`
      },
      { 
        category: 'Overall', 
        score: Math.round(overallMatchScore * 100),
        tooltip: `Overall Match: ${(overallMatchScore * 100).toFixed(1)}%`
      }
    ];

    return (
      <Paper sx={{ p: 3, height: '100%', minHeight: 500 }}>
        <Typography variant="h6" gutterBottom>
          Match Score Breakdown
        </Typography>
        <Box sx={{ 
          height: 450, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 14 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value, name, props) => [props.payload.tooltip]}
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px'
                }}
              />
              <Bar 
                dataKey="score" 
                fill="#7986cb"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.score >= 70 ? '#4caf50' : '#7986cb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    );
  };

  const renderSkillMatchChart = (screening) => {
    if (!screening?.skill_match_details?.matched_skills) return null;

    const allSkills = [
      ...(screening.skill_match_details.matched_skills || []),
      ...(screening.skill_match_details.missing_skills || [])
    ];

    const data = allSkills.map(skill => ({
      skill,
      match: screening.skill_match_details.matched_skills.includes(skill) ? 1 : 0,
      required: 1
    }));

    return (
      <Paper sx={{ p: 3, height: '100%', minHeight: 500 }}>
        <Typography variant="h6" gutterBottom>
          Skills Match Analysis
        </Typography>
        <Box sx={{ 
          height: 450, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: '#666', fontSize: 14 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Matched Skills"
                dataKey="match"
                stroke="#4caf50"
                fill="#4caf50"
                fillOpacity={0.5}
              />
              <Radar
                name="Required Skills"
                dataKey="required"
                stroke="#7986cb"
                fill="#7986cb"
                fillOpacity={0.5}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px'
                }} 
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    );
  };

  const startInterview = (screening) => {
    if (!screening || !screening.interview_questions) {
      setError('Interview questions not available');
      return;
    }
    
    const technicalQuestions = screening.interview_questions.technical || [];
    if (technicalQuestions.length === 0) {
      setError('No interview questions available');
      return;
    }
    
    setSelectedScreening(screening);
    setQuestionType('technical');
    setQuestionIndex(0);
    setCurrentQuestion(technicalQuestions[0]);
    setOpenDialog(true);
    setAnswer('');
    setFeedback(null);
  };

  const isLastQuestion = () => {
    if (!selectedScreening || !selectedScreening.interview_questions) return false;
    
    if (questionType === 'technical') {
      const technicalQuestions = selectedScreening.interview_questions.technical || [];
      const behavioralQuestions = selectedScreening.interview_questions.behavioral || [];
      return questionIndex === technicalQuestions.length - 1 && behavioralQuestions.length === 0;
    }
    const behavioralQuestions = selectedScreening.interview_questions.behavioral || [];
    return questionIndex === behavioralQuestions.length - 1;
  };

  const handleNextQuestion = async () => {
    if (!selectedScreening || !selectedScreening.interview_questions) {
      setError('Interview session invalid');
      return;
    }
    
    if (!answer.trim()) {
      setError('Please provide an answer before continuing');
      return;
    }
    
    setLoading(true);
    try {
      // Submit current answer
      const response = await axios.post('http://localhost:8000/evaluate_interview', {
        match_id: selectedScreening.id,
        question: currentQuestion,
        answer: answer,
        question_type: questionType,
        is_final_question: isLastQuestion()
      });
      
      setFeedback(response.data);
      
      // Move to next question
      const technicalQuestions = selectedScreening.interview_questions.technical || [];
      const behavioralQuestions = selectedScreening.interview_questions.behavioral || [];
      
      if (questionType === 'technical' && questionIndex < technicalQuestions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setCurrentQuestion(technicalQuestions[questionIndex + 1]);
      } else if (questionType === 'technical' && behavioralQuestions.length > 0) {
        setQuestionType('behavioral');
        setQuestionIndex(0);
        setCurrentQuestion(behavioralQuestions[0]);
      } else if (questionType === 'behavioral' && questionIndex < behavioralQuestions.length - 1) {
        setQuestionIndex(questionIndex + 1);
        setCurrentQuestion(behavioralQuestions[questionIndex + 1]);
      } else {
        // Interview completed
        await fetchData(); // Refresh data
        setOpenDialog(false);
      }
      
      setAnswer('');
      setError(null);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (candidateId) => {
    if (!candidateId) {
      setError('Candidate ID not found');
      return;
    }
    // You can implement the profile view logic here
    console.log('Viewing profile for candidate:', candidateId);
  };

  const renderScreeningResults = () => {
    console.log('Rendering screenings:', screenings);
    
    if (screenings.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No screening results available.
        </Typography>
      );
    }

    return screenings.map((screening) => (
      <Grid item xs={12} md={6} key={`${screening.job_id}-${screening.candidate_id}`}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* Header with Avatar and Basic Info */}
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                    {screening.candidate?.name?.[0] || 'C'}
                  </Avatar>
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="h6" noWrap>
                      {screening.candidate?.name || 'Unknown Candidate'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {screening.candidate?.email || 'No email provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {Math.round((screening.match_score || 0) * 100)}%
                    </Typography>
                    <Rating
                      value={(screening.match_score || 0) * 5}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Skills Section */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Skills
                  <Typography variant="body2" color="textSecondary">
                    {screening.skill_match_details?.matched_skills?.length || 0} of {(screening.skill_match_details?.matched_skills?.length || 0) + (screening.skill_match_details?.missing_skills?.length || 0)} matched
                  </Typography>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {screening.skill_match_details?.matched_skills?.slice(0, 4).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  ))}
                  {screening.skill_match_details?.matched_skills?.length > 4 && (
                    <Chip
                      label={`+${screening.skill_match_details.matched_skills.length - 4}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Grid>

              {/* Charts */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MatchScoreBreakdown matchData={screening} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {renderSkillMatchChart(screening)}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 2, gap: 1, bgcolor: 'grey.50' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => startInterview(screening)}
              startIcon={<PlayArrow />}
              size="small"
              sx={{ flex: 1 }}
            >
              Interview
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Visibility />}
              size="small"
              sx={{ flex: 1 }}
              onClick={() => handleViewProfile(screening.candidate?.id)}
            >
              Profile
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Auto Screening Button */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Automatic Screening
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Click the button below to automatically screen all candidates against all jobs.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAutoScreen}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Start Auto Screening'}
              </Button>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Screening Results */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Screening Results
          </Typography>
          <Grid container spacing={3}>
            {renderScreeningResults()}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Screening;
