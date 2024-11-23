import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import AdminDashboard from './AdminDashboard';
import Leaderboard from './Leaderboard';
import Attendance from './Attendance';
import MediaReview from './MediaReview';
import { AppProvider } from './AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <nav>
        <Link to="/">Admin Dashboard</Link>    | 
        <Link to="/leaderboard">Leaderboard</Link>    |
        <Link to="/management">User Management</Link>    | 
        <Link to="/review">Review Media</Link>    | 
        <Link to="/attendance">Team Attendance</Link> 
        </nav>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/management" element={<UserManagement />} />
          <Route path="/review" element={<MediaReview challenges={props.challenges} />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </Router>
    </AppProvider>
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

