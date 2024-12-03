import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Interface for User
interface User {
  ID: number;
  Name: string;
  Email: string;
  Points: number;
  Mentors: string[];
  Images: string[];
  Role: string;
  TeamID: number;
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
  const { person, mentees, mentors, fetchMentees, fetchMentorsForMentee, getCurrentChallenge, fetchChallenges, setLoginStatus } = useAppContext();
  const navigate = useNavigate();

  const [teammates, setTeammates] = useState<User[]>([]);
  const [mentors, setMentors] = useState<string[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [person, setPerson] = useState<User | null>(null);
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch teammates based on TeamID
  const fetchTeammates = async () => {
    if (!person?.TeamID) return;
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/users/team/${person.TeamID}`);
      setTeammates(response.data);
    } catch (error) {
      console.error('Error fetching teammates:', error);
    }
  };

  // Fetch mentors for the logged-in user
  const fetchMentorsForMentee = async () => {
    if (!person?.ID) return;
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/mentees/${person.ID}`);
      setMentors(response.data.Mentors || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  // Fetch current challenges
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
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (person?.TeamID) {
      fetchTeammates();
    }
    if (person?.ID) {
      fetchMentorsForMentee();
    }
  }, [person]);

  // Sort teammates
  const sortedTeammates = [...teammates].sort((a, b) => a.Name.localeCompare(b.Name));
  const sortedMentors = [...mentors].sort((a, b) => a.localeCompare(b));

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      navigate('/login'); // Redirect to login page
    }
  };

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleMouseEnter = (link: string) => setHoveredLink(link);
  const handleMouseLeave = () => setHoveredLink(null);

  

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <nav style={styles.navbar}>
          <img src="/images/computer-icon.png"
          alt="Computer Icon" style={styles.icon}
          />
          <Link
            to="/leaderboard"
            style={
              hoveredLink === "leaderboard"
                ? { ...styles.link, ...styles.linkHover1 }
                : styles.link
            }
            onMouseEnter={() => handleMouseEnter("leaderboard")}
            onMouseLeave={handleMouseLeave}
          >
            Go to Leaderboard
          </Link>
          <Link
            to="/photo-upload"
            style={
              hoveredLink === "photo-upload"
                ? { ...styles.link, ...styles.linkHover2 }
                : styles.link
            }
            onMouseEnter={() => handleMouseEnter("photo-upload")}
            onMouseLeave={handleMouseLeave}
          >
            Upload a Photo
          </Link>
          <Link
            to="/photos"
            style={
              hoveredLink === "photos"
                ? { ...styles.link, ...styles.linkHover3 }
                : styles.link
            }
            onMouseEnter={() => handleMouseEnter("photos")}
            onMouseLeave={handleMouseLeave}
          >
            View Uploaded Photos
          </Link>
        </nav>
      </div>
      <div style={styles.iconContainer}>
          <img src="/images/bootcamp.png" alt="Group Icon" style={styles.iconImage} />
        </div>

      <div style={styles.dots}>
        <img src="/images/Group 4.png" alt="Dots" style={styles.dotsIcons} />
      </div>

      <div style={styles.dashboardContainer}>
        <div style={styles.sidedots}>
          <img src="/images/Group6.png" alt="Dots" style={styles.sidedotsIcons} />
        </div>
        {/* Leaderboard Section */}
        <div style={styles.card1}>
          <h2 style={styles.cardTitle}>★ TEAM LEADERBOARD ★</h2>
          <ul style={styles.list}>
            {sortedTeammates.map((teammate) => (
              <li key={teammate.ID} style={styles.listItem}>
                ⭐ {teammate.name} - {teammate.points} points
              </li>
            ))}
          </ul>
        </div>
        {/* Mentor Meetings Section */}
        <div style={styles.card2}>
          <h2 style={styles.cardTitle}>⏱︎ MENTOR MEETINGS ⏱︎</h2>
          <ul style={styles.list}>
            {sortedMentors.map((mentor, index) => (
              <li key={index} style={styles.listItem}>
                {mentor}
              </li>
            ))}
          </ul>
          <iframe
            style={styles.calendar}
            src="https://calendar.google.com/calendar/embed?src=c_8f79c6ad4b6b9d5db668d1a05c5a7c9ab265111d96180d3457cb5002272096e9%40group.calendar.google.com&ctz=America%2FNew_York"
            width="600"
            height="600"
            scrolling="no"
            title="Google Calendar"
          ></iframe>
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

        {/* Weekly Challenge Section */}
        <div style={styles.card3}>
          <h2 style={styles.cardTitle}>⇢ WEEKLY CHALLENGE ⇠</h2>
          {currentChallenge ? (
            <>
              <p style={styles.challengeText}>{currentChallenge.Description}</p>
              <p style={styles.challengePoints}>
                Earn {currentChallenge.PointsValue} points!
              </p>
              <p style={styles.challengeDates}>
                Valid from{" "}
                {new Date(currentChallenge.StartDate).toLocaleDateString()} to{" "}
                {new Date(currentChallenge.EndDate).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p style={styles.noChallengeText}>
              No active challenges at the moment. Check back soon!
            </p>
          )}
        </div>
        <div style={styles.sidedots}>
          <img src="/images/Group6.png" alt="Dots" style={styles.sidedotsIcons} />
        </div>
      </div>

      <button onClick={handleLogout} 
        style={hoveredLink === "handleLogout"
          ? { ...styles.logoutButton, ...styles.logoutButtonHover }
          : styles.logoutButton
        }
        onMouseEnter={() => handleMouseEnter("handleLogout")}
        onMouseLeave={() => handleMouseLeave()}
      >
        Logout
      </button>
    </div>
  );

};

export default Dashboard;

const styles: {
  [key: string]: React.CSSProperties;
} = {
  page: {
    fontFamily: "'Gill Sans', sans-serif",
    backgroundImage: "linear-gradient(180deg, #FEA85F, #E26159, #E21C61",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '5px 0px 0px 0px',
    backgroundImage: "linear-gradient(180deg, #fbfab8, #fffdec",
    boxShadow: "0 8px 10px rgba(0, 0, 0, 0.2)",
    width: "51.2%",
    position: "absolute",
    top: 0,
    zIndex: 20,
    borderBottomLeftRadius: "15px",
  },
  header: {
    marginBottom: "1px",
    marginTop: "0px",
  },
  // title: {
  //   fontSize: "2.5rem",
  //   color: "#381631",
  //   textAlign: "center",
  // },
  dots: {
    width: "50%",
    alignItems: "center",
    display: "flex",
    marginRight: "290px",
  },
  dotsIcon: {
    width: "40%",
    height: "auto",
    display: "flex",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: "10px",
    width: "85%",
  },
  icon: {
    marginRight: "10px",
    width: "80px",
  },
  iconImage: {
    alignItems: "center",
    display: "absolute",
    width: "100%",
  },
  dashboardContainer: {
    width: "85%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C0D59",
    borderRadius: "30px",
    boxShadow: "0 8px 10px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    gap: "20px",
  },
  card1: {
    backgroundColor: "#5EB6AD",
    color: "#FFF",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "100%",
    border: "solid 2px #381631",
  },
  card2: {
    backgroundColor: "#FEA85F",
    color: "#FFF",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "100%",
    border: "solid 2px #381631",
  },
  card3: {
    backgroundColor: "#FC7E80",
    color: "#FFF",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "100%",
    border: "solid 2px #381631",
  },
  cardTitle: {
    fontSize: "1.7rem",
    marginBottom: "15px",
    fontWeight: "bold",
    textAlign: "center",
    textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
  },
  list: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    fontSize: "1.2rem",
    margin: "10px 0",
  },
  challengeText: {
    fontSize: "1rem",
    margin: "10px 0",
  },
  challengePoints: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#FFD700",
  },
  challengeDates: {
    fontSize: "0.9rem",
    color: "#EEE",
  },
  noChallengeText: {
    fontSize: "1rem",
    fontStyle: "italic",
  },
  linkContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
  },
  link: {
    color: "black",
    fontSize: "1.2rem",
    textDecoration: "none",
    // backgroundColor: "#FF6F61",
    backgroundColor: "transparent",
    padding: "10px 20px",
    borderRadius: "9px",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    // border: "solid 2px white",
    transition: "transform 250ms",
  },
  linkHover1: {
    backgroundColor: "transparent",
    transform: "scale(1.05)",
    color: "#5EB6AD", 
  },
  linkHover2: {
    backgroundColor: "transparent",
    transform: "scale(1.05)",
    color: "#FEA85F", 
  },
  linkHover3: {
    backgroundColor: "transparent",
    transform: "scale(1.05)",
    color: "#FC7E80", 
  },
  logoutButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#FF0000",
    color: "#FFF",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "solid 2px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },

  logoutButtonHover: {
    backgroundColor: "#FF2222",
    transform: "scale(1.05)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  },
  calendar: {
    borderRadius: "15px",
    maxWidth: "400px",
    maxHeight: "400px",
    border: "solid 2px #381631",
  },
};