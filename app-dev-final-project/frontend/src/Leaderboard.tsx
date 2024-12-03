import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Participant {
    ID: number;
    Name: string;
    Points: number;
}

const Leaderboard: React.FC = () => {
    const [mentees, setMentees] = useState<Participant[]>([]);
    const [person, setPerson] = useState<Participant | null>(null); // Replace with actual logged-in user data
    const API_BASE_URL = 'http://127.0.0.1:8000';


    // Fetch mentees from the backend
    const fetchMentees = async () => {
        try {
            const response = await axios.get<Participant[]>(`${API_BASE_URL}/mentees`);
            setMentees(response.data);
        } catch (error) {
            console.error('Error fetching mentees:', error);
        }
    };

    useEffect(() => {
        fetchMentees();
    }, []);

    // Combine the logged-in user (person) and mentees, sort by score
    const allParticipants = person
        ? [{ ...person }, ...mentees.filter((mentee) => mentee.ID !== person.ID)].sort(
            (a, b) => b.Points - a.Points
        )
    : mentees.sort((a, b) => b.Points - a.Points);

    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const handleMouseEnter = (link: string) => setHoveredLink(link);
    const handleMouseLeave = () => setHoveredLink(null);
    
    return (
      <div style={styles.leaderboardContainer}>
        <div style={styles.background}>
        {/* <img
            // src="/images/leaderboardbg.png"
            // alt="background" 
            style={styles.background}
            /> */}
          </div>
         <div style={styles.header}>
             <nav style={styles.navbar}>
                <img src="/images/computer-icon.png"
                     alt="Computer Icon" style={styles.icon}
                     />
          <Link
            to="/dashboard"
            style={
              hoveredLink === "dashboard"
                ? { ...styles.link, ...styles.linkHover1 }
                : styles.link
            }
            onMouseEnter={() => handleMouseEnter("dashboard")}
            onMouseLeave={handleMouseLeave}
          >
            Go to Dashboard
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
  
        <div style={styles.leaderboardList}>
          {allParticipants.map((participant, index) => (
            <div 
              key={participant.ID || index} 
              style={{
                ...styles.leaderboardItem,
                ...(index === 0 && styles.firstPlace),
                ...(index === 1 && styles.secondPlace),
                ...(index === 2 && styles.thirdPlace),
              }}
            >
              <div style={styles.starContainer}>
                {index < 3 && (
                  <img
                    src={`/images/star-${index + 1}.png`}
                    alt={`${index + 1} place`}
                    style={styles.starIcon}
                  />
                )}
              </div>
              <div style={styles.userInfo}>
                <div
                  style={{
                    ...styles.userName,
                    ...(person && participant.ID === person.ID
                      ? styles.highlight
                      : {}),
                  }}
                >
                  {participant.Name}
                </div>
                <div style={styles.userScore}>{participant.Points} pts</div>
              </div>
            </div>
          ))}
        </div>
  
        <div style={styles.infoBox}>
          <h2 style={styles.infoBoxHeader}>How to Earn Points</h2>
          <p style={styles.infoBoxText}>
            Points are awarded for completing challenges, helping teammates, and
            participating in bootcamp activities.
          </p>
          <p style={styles.infoBoxText}>
            Stay active and engaged to climb the leaderboard!
          </p>
        </div>
      </div>
      
    );
  };
  
export default Leaderboard;

const styles: {
  [key: string]: React.CSSProperties;
} = {
    icon: {
        marginRight: "10px",
        width: "80px",
    },
  background: {
    position: "fixed",
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('/images/leaderboardbg.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    // backgroundPosition: "center",
    zIndex: -1,
    top: 0,
    left: 0,
  },
  leaderboardContainer: {
    width: "100vw",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: '5px 0px 0px 0px',
    backgroundImage: "linear-gradient(180deg, #fbfab8, #fffdec)",
    boxShadow: "0 8px 10px rgba(0, 0, 0, 0.2)",
    width: "51.2%",
    position: "absolute",
    top: 0,
    zIndex: 20,
    borderBottomLeftRadius: "15px",
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
    backgroundColor: "transparent",
    padding: "10px 20px",
    borderRadius: "9px",
    transition: "transform 250ms",
    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
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
  iconContainer: {
    marginRight: "10px",
    width: "85%",
  }, 
  iconImage: {
      alignItems: "center",
      display: "absolute",
      width: "100%",
  },
  leaderboardList: {
    width: "90%",
    maxWidth: "1200px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    position: "relative",
    zIndex: 10,
    marginTop: "200px",
  },
  leaderboardItem: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#c4f2f5",
    width: "100%",
    padding: "15px 20px",
    boxShadow: "8px 10px 15px -6px rgb(99, 61, 99)",
    position: "relative",
    zIndex: 20,
  },
  firstPlace: {
    backgroundColor: "#fffb9a", // Light yellow background
    fontSize: "20px", // Larger font size for the first place
    fontWeight: "bold",
    padding: "20px 25px", // Larger padding
  },
  secondPlace: {
    backgroundColor: "#f4f4f4", // Slightly different background color for second place
    fontSize: "19px", // Slightly larger font size for the second place
    fontWeight: "bold",
    padding: "18px 23px", // Slightly larger padding
  },
  thirdPlace: {
    backgroundColor: "#ffd5cd", // Light pink background for third place
    fontSize: "18px", // Slightly larger font size for the third place
    fontWeight: "bold",
    padding: "18px 22px", // Slightly larger padding
  },
  starContainer: {
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon: {
    width: "80px",
    height: "80px",
  },
  userInfo: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "10px",
    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
  },
  userName: {
    fontWeight: "bold",
    color: "#2f2f2f",
    fontSize: "18px",
  },
  highlight: {
    color: "#ff7755",
  },
  userScore: {
    fontSize: "16px",
    color: "#2f2f2f",
  },
  infoBox: {
    backgroundColor: "#ffffff",
    width: "60%",
    padding: "20px",
    margin: "20px auto",
    textAlign: "left",
    borderRadius: "15px",
    boxShadow: "8px 10px 15px -6px rgb(99, 61, 99)",
    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
    position: "relative",
    zIndex: 5,
    top: "auto",
  },
  infoBoxHeader: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#004d61",
    marginBottom: "10px",
    
  },
  infoBoxText: {
    fontSize: "16px",
    color: "#555555",
    lineHeight: "1.5",
  },
};