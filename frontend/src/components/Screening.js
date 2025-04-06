import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import axios from 'axios';

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Candidate Screening
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create New Match
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" gutterBottom>
                Select Job:
              </Typography>
              <List>
                {jobs.map((job) => (
                  <ListItem
                    key={job.id}
                    button
                    selected={selectedJob?.id === job.id}
                    onClick={() => setSelectedJob(job)}
                  >
                    <ListItemText
                      primary={job.title}
                      secondary={`${job.standardized_role} - ${job.experience_level}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" gutterBottom>
                Select Candidate:
              </Typography>
              <List>
                {candidates.map((candidate) => (
                  <ListItem
                    key={candidate.id}
                    button
                    selected={selectedCandidate?.id === candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <ListItemText
                      primary={candidate.name}
                      secondary={`${candidate.experience_level} - Score: ${Math.round(candidate.technical_score * 100)}%`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleMatch}
                disabled={loading || !selectedJob || !selectedCandidate}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Match'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Screening Results
      </Typography>

      <Grid container spacing={3}>
        {screenings.map((screening) => (
          <Grid item xs={12} md={6} key={screening.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Match #{screening.id}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography color="textSecondary">
                    Candidate: {candidates.find(c => c.id === screening.candidate_id)?.name}
                  </Typography>
                  <Typography color="textSecondary">
                    Position: {jobs.find(j => j.id === screening.job_id)?.title}
                  </Typography>
                </Box>
                <Box sx={{ my: 2 }}>
                  <Typography component="legend">Match Score</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating
                      value={screening.match_score * 5}
                      readOnly
                      precision={0.5}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {Math.round(screening.match_score * 100)}%
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={screening.status || 'Pending Interview'}
                  color={screening.status === 'Interview Completed' ? 'success' : 'warning'}
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => startInterview(screening)}
                  disabled={screening.status === 'Interview Completed'}
                >
                  {screening.status === 'Interview Completed' ? 'Interview Complete' : 'Start Interview'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Interview Session - {questionType === 'technical' ? 'Technical' : 'Behavioral'} Question {questionIndex + 1}
        </DialogTitle>
        <DialogContent>
          {currentQuestion && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
                {currentQuestion}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                margin="normal"
              />
              {feedback && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Feedback:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Score: {Math.round(feedback.score * 100)}%
                  </Typography>
                  <Typography variant="body2">
                    {feedback.feedback}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel Interview</Button>
          <Button
            onClick={handleNextQuestion}
            disabled={loading || !answer.trim()}
            color="primary"
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : isLastQuestion() ? 'Complete Interview' : 'Next Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Screening;
