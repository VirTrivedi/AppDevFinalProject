import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Interface for Mentee or User
interface Mentee {
  ID: number;
  Name: string;
  Email: string;
  Points: number;
  Mentors: string[];
  Images: string[];
  Role: string; // "mentee" or "mentor"
}

// Interface for Challenge
interface Challenge {
  ID: number;
  Description: string;
  StartDate: string;
  EndDate: string;
  PointsValue: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [mentors, setMentors] = useState<string[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [person, setPerson] = useState<Mentee | null>(null);
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch all mentees
  const fetchMentees = async () => {
    try {
      const response = await axios.get<Mentee[]>(`${API_BASE_URL}/mentees`);
      setMentees(response.data);
    } catch (error) {
      console.error('Error fetching mentees:', error);
    }
  };  

  // Fetch mentors for the logged-in user
  const fetchMentorsForMentee = async () => {
    if (!person?.ID) return;
    try {
      const response = await axios.get<Mentee>(`${API_BASE_URL}/mentees/${person.ID}`);
      setMentors(response.data.Mentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  // Fetch current challenges (replace with backend challenge endpoint)
  const fetchChallenges = async () => {
    try {
      const response = await axios.get<Challenge[]>(`${API_BASE_URL}/challenges`);
      const today = new Date();
      const activeChallenge = response.data.find(
        (challenge) =>
          new Date(challenge.StartDate) <= today && new Date(challenge.EndDate) >= today
      );
      setCurrentChallenge(activeChallenge || null);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };  

  // On component mount, fetch data
  useEffect(() => {
    fetchMentees();
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (person?.ID) {
      fetchMentorsForMentee();
    }
  }, [person]);

  // Sort teammates and mentors
  const sortedTeammates = [...mentees].sort((a, b) => 
    a.Name.localeCompare(b.Name)
  );

  const sortedMentors = [...mentors].sort((a, b) => a.localeCompare(b));

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      navigate('/login'); // Redirect to login page
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1>Dashboard</h1>
      <div style={styles.section}>
        <h2>Name: {person?.Name || 'Unknown'}</h2>
        <p>Score: {person?.Points || 0}</p>
      </div>

      <div style={styles.section}>
        <h3>Teammates and Scores:</h3>
        <ul>
        {sortedTeammates.map((teammate) => (
            <li key={teammate.ID}>
              {teammate.Name} - {teammate.Points} points
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
              Valid from{' '}
              {new Date(currentChallenge.StartDate).toLocaleDateString()} to{' '}
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