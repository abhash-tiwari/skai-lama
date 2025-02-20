import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import Project from './components/Projects/Project';
import UploadNav from './components/Upload/UploadNav';
// Protected Route component to handle authentication

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route - Welcome Screen / Auth */}
        <Route path="/" element={<WelcomeScreen />} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Project />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/upload/:projectId"
          element={
            <ProtectedRoute>
              <UploadNav />
            </ProtectedRoute>
          }
        />
        
        {/* Catch-all route - redirect to welcome screen */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;