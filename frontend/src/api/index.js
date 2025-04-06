import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = {
    // Jobs
    getJobs: () => axios.get(`${API_BASE_URL}/jobs`),
    createJob: (jobData) => axios.post(`${API_BASE_URL}/jobs`, jobData),
    deleteJob: (jobId) => axios.delete(`${API_BASE_URL}/jobs/${jobId}`),

    // Candidates
    getCandidates: () => axios.get(`${API_BASE_URL}/candidates`),
    createCandidate: (candidateData) => axios.post(`${API_BASE_URL}/candidates`, candidateData),
    deleteCandidate: (candidateId) => axios.delete(`${API_BASE_URL}/candidates/${candidateId}`),

    // Screening
    autoScreen: () => axios.post(`${API_BASE_URL}/auto_screen`),
    getMatches: () => axios.get(`${API_BASE_URL}/matches`),
    matchCandidateJob: (matchData) => axios.post(`${API_BASE_URL}/match_candidate_job`, matchData),

    // Interviews
    processInterviewResponse: (responseData) => axios.post(`${API_BASE_URL}/process_interview_response`, responseData),

    // Dashboard
    getDashboardData: () => axios.get(`${API_BASE_URL}/dashboard`),
};

export default api;
