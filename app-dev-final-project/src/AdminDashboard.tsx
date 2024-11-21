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
        <h3>You have 12 photos pending review</h3>
        <p>Images</p>
      </div>

      <div style={styles.section}>
        <h3>Attendance input</h3>
        <p>Due by </p>
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