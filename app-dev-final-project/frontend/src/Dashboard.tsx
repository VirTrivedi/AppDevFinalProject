import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';

const Dashboard: React.FC = () => {
  const { person, mentees, mentors, fetchMentees, fetchMentorsForMentee, getCurrentChallenge, fetchChallenges, setLoginStatus } = useAppContext();
  const navigate = useNavigate();

  const [sortedTeammates, setSortedTeammates] = useState(mentees);
  const [sortedMentors, setSortedMentors] = useState(mentors);

  // Fetch mentees and mentors on mount
  useEffect(() => {
    fetchMentees();
    fetchMentorsForMentee();
    fetchChallenges();
  }, [fetchMentees, fetchMentorsForMentee, fetchChallenges]);

  const currentChallenge = getCurrentChallenge();

  // Sort teammates and mentors whenever they are updated
  useEffect(() => {
    setSortedTeammates([...mentees].sort((a, b) => a.name.localeCompare(b.name)));
  }, [mentees]);

  useEffect(() => {
    setSortedMentors([...mentors].sort((a, b) => a.localeCompare(b)));
  }, [mentors]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      setLoginStatus(false);
      navigate('/login'); // Redirect to login page
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      <div style={styles.section}>
        <h2>Name: {person?.name || 'Unknown'}</h2>
        <p>Score: {person?.points || 0}</p>
      </div>

      <div style={styles.section}>
        <h3>Teammates and Scores:</h3>
        <ul>
          {sortedTeammates.map((teammate) => (
            <li key={teammate.ID}>
              {teammate.name} - {teammate.points} points
            </li>
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

      <div style={styles.challengeBox}>
        <h2 style={styles.challengeTitle}>Weekly Challenge</h2>
        {currentChallenge ? (
          <>
            <p style={styles.challengeText}>{currentChallenge.Description}</p>
            <p style={styles.challengePoints}>
              Earn {currentChallenge.PointsValue} points!
            </p>
            <p style={styles.challengeDates}>
              Valid from {new Date(currentChallenge.StartDate).toLocaleDateString()} to{" "}
              {new Date(currentChallenge.EndDate).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p style={styles.noChallengeText}>
            No active challenges at the moment. Check back soon!
          </p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/leaderboard">Go to Leaderboard</Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/photo-upload">Upload a Photo</Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/photos">View Uploaded Photos</Link>
      </div>

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
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
  challengeBox: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  challengeTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  challengeText: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  challengePoints: {
    fontSize: "16px",
    color: "#007BFF",
  },
  challengeDates: {
    fontSize: "14px",
    color: "#555",
  },
  noChallengeText: {
    fontSize: "16px",
    fontStyle: "italic",
    color: "#777",
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