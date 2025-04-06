import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Important for CORS
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [stats, setStats] = useState({
    total_candidates: 0,
    active_jobs: 0,
    successful_matches: 0,
    screening_rate: 0,
    monthly_hires: [],
    system_uptime: '0%',
    success_rate: '0%',
    technical_skills: 0,
    soft_skills: 0,
    leadership_skills: 0,
    domain_skills: 0,
    screened_candidates: 0,
    interviewed_candidates: 0,
    hired_candidates: 0
  });
  const [recent_activity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard');
      console.log('Dashboard response:', response.data); // Debug log
      
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
        setRecentActivity(response.data.recent_activity || []);
        setError(null);
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider
      value={{
        stats,
        recent_activity,
        loading,
        error,
        refreshData: fetchDashboardData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
