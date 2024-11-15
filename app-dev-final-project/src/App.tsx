import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Leaderboard from './Leaderboard';
import { AppProvider } from './AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <nav>
          <Link to="/">Dashboard</Link> | <Link to="/leaderboard">Leaderboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;