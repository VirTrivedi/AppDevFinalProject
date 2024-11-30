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
import Login from './Login';
import SignUp from './SignUp';
import { AppProvider, useAppContext } from './AppContext';

const App: React.FC = () => {

  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/leaderboard"
          element={isLoggedIn ? <Leaderboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/photo-upload"
          element={isLoggedIn ? <PhotoUpload /> : <Navigate to="/login" />}
        />
        <Route
          path="/photos"
          element={isLoggedIn ? <Photos /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
      </Routes>
    </Router>
  );
};

type Photo = {
  id: number;
  url: string;
  caption: string;
  status: 'pending' | 'approved' | 'rejected'; // Added status
};

type Challenge = {
  name: string;
  photos: Photo[];
};

type MediaReviewPageProps = {
  challenges: Challenge[];
};

const props: MediaReviewPageProps = {
  challenges: [
    {
      name: "Week 01: Halloween",
      photos: [
        {
          id: 1,
          url: 'download.jpeg',
          caption: "look at this tree",
          status: "pending"
        }
      ]
    },
    {
      name: "Week 02: Dorm",
      photos: [
        {
          id: 2,
          url: 'download.jpeg',
          caption: "look at this dorm",
          status: "pending"
        }
      ]
    }
  ]
};

  


export default App;

