import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import JobDescriptions from './components/JobDescriptions';
import Candidates from './components/Candidates';
import Screening from './components/Screening';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/jobs" element={<JobDescriptions />} />
      <Route path="/candidates" element={<Candidates />} />
      <Route path="/screening" element={<Screening />} />
    </Routes>
  );
};

export default AppRoutes;
