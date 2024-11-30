import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './AppContext';

const Dashboard: React.FC = () => {
  const { person } = useAppContext();
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
    
export default AdminDashboard;


const styles = {
  dashboardContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '20px',
  }, 
  challengeBox: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  challengeTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#',
  },
  challengeText: {
    fontSize: '16px',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#FF0000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }, 
};