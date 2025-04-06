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
    activeJobs: 0,
    candidates: 0,
    interviews: 0,
    placements: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [metrics, setMetrics] = useState({
    interviewSuccessRate: 0,
    responseRate: 0,
    timeToHire: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard');
      console.log('Dashboard response:', response.data); // Debug log
      
      if (response.data) {
        setStats(response.data.stats || {});
        setMetrics(response.data.metrics || {});
        setRecentActivity(response.data.recentActivity || []);
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
        recentActivity,
        metrics,
        loading,
        error,
        refreshData: fetchDashboardData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
