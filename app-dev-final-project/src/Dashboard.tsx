import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './AppContext';

const Dashboard: React.FC = () => {
  const { person, teammates, mentors } = useAppContext();
  const sortedTeammates = [...teammates].sort((a, b) => a.name.localeCompare(b.name));
  const sortedMentors = [...mentors].sort((a, b) => a.localeCompare(b));
  
  return (
    <div style={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      <div style={styles.section}>
        <h2>Name: {person.name}</h2>
        <p>Score: {person.score}</p>
      </div>

      <div style={styles.section}>
        <h3>Teammates and Scores:</h3>
        <ul>
          {sortedTeammates.map((teammate, index) => (
            <li key={index}>{teammate.name} - {teammate.score} points</li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h3>Mentors:</h3>
        <ul>
          {sortedMentors.map((mentor, index) => (
            <li key={index}>{mentor}</li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <Link to="/leaderboard">Go to Leaderboard</Link>
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