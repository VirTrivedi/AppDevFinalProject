import React from 'react';

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import AdminDashboard from './AdminDashboard';
import Leaderboard from './Leaderboard';
import Attendance from './Attendance';
import MediaReview from './MediaReview';
import PhotoUpload from './PhotoUpload';
import Photos from './Photos';
import MainPage from './MainPage';
import Login from './Login';
import SignUp from './SignUp';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          // element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
          element={<Dashboard />}
        />
        <Route
          path="/leaderboard"
          // element={isLoggedIn ? <Leaderboard /> : <Navigate to="/" />}
          element={<Leaderboard />}
        />
        <Route
          path="/photo-upload"
          // element={isLoggedIn ? <PhotoUpload /> : <Navigate to="/" />}
          element={<PhotoUpload />}
        />
        <Route
          path="/photos"
          // element={isLoggedIn ? <Photos /> : <Navigate to="/" />}
          element={<Photos />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
         <Route
          path="/media"
          element={<MediaReview />}
        />
        <Route 
          path="/attendance"
          element={<Attendance />}
        />
         <Route
          path="/management"
          element={<UserManagement />}
        />
      </Routes>
    </Router>
  );
};

export default App;

