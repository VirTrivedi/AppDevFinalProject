import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './AppContext';

const Dashboard: React.FC = () => {
  const { person, teammates, mentors } = useAppContext();
  person.name = "Kimber"; // remove this 
  
  return (
    <div style={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      <div style={styles.section}>
        <h2>Welcome back, {person.name}!</h2>
      </div>

      <div style={styles.section}>
        <Link to="/leaderboard">Go to Leaderboard</Link>
      </div>

      <div style={styles.section}>
        <Link to="/review">You have 12 photos pending review</Link>
      </div>

      <div style={styles.section}>
        <Link to="/attendance">Attendance due in 6 days</Link>
      </div>

  
    </div>
  );
};

export default Dashboard;

const styles = {
  dashboardContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '20px',
  },
};