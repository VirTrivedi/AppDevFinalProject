import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Leaderboard from './Leaderboard';
import PhotoUpload from './PhotoUpload';
import Login from './Login';
import SignUp from './SignUp';
import AdminDashboard from './AdminDashboard';
import { useAppContext } from './AppContext';

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
          path="/admin"
          element={<AdminDashboard />}
        />
      </Routes>
    </Router>
  );
};

export default App;