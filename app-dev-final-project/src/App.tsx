import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import AdminDashboard from './AdminDashboard';
import Leaderboard from './Leaderboard';
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
        <Link to="/analytics">Team Analytics</Link> 
        </nav>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/management" element={<UserManagement />} />
          <Route path="/review" element={<MediaReview photos={photos1}/>} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

const photos1: Photo[] = [
  { id: 1, url: 'download.jpeg' },
  { id: 2, url: 'https://example.com/photo2.jpg' },
  { id: 3, url: 'https://example.com/photo3.jpg' },
];

type Photo = {
  id: number;
  url: string;
}


export default App;

