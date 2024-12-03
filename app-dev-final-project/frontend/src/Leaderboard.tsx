import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./Leaderboard.css";

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

    return (
      <div style={styles.leaderboardContainer}>
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
        <h1 style={styles.leaderboardTitle}>BOOTCAMP LEADERBOARD</h1>
  
        <div style={styles.leaderboardList}>
          {allParticipants.map((participant, index) => (
            <div key={participant.ID || index} style={styles.leaderboardItem}>
              <div style={styles.starContainer}>
                {index < 3 && (
                  <img
                    src={`/assets/star-${index + 1}.png`}
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
                  {participant.name}
                </div>
                <div style={styles.userScore}>{participant.points} pts</div>
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

//     return (
//         <div className="leaderboard-container">
//             <div id='navbar'>
//           <img src="/images/computer-icon.png"
//           alt="Computer Icon" id='icon'
//           />
//           <Link className="leaderboard" id='link1'
//             to="/leaderboard"
//           >
//             Go to Leaderboard
//           </Link>
//           <Link className="photoupload"
//             to="/photo-upload"
//           >
//             Upload a Photo
//           </Link>
//           <Link className="photos"
//             to="/photos"
//           >
//             View Uploaded Photos
//           </Link>
//         </div>
//         <h1 className="leaderboard-title">BOOTCAMP LEADERBOARD</h1>  
        
//         <div className="leaderboard-list">
//             {allParticipants.map((participant, index) => (
//                 <div key={participant.ID || index} className="leaderboard-item">
//                     <div className="star-container">
//                         {index < 3 && (
//                             <img
//                                 src={`/assets/star-${index + 1}.png`}
//                                 alt={`${index + 1} place`}
//                                 className="star-icon"
//                             />
//                         )}
//                     </div>
//                     <div className="user-info">
//                         <div
//                             className={`user-name ${
//                                 person && participant.ID === person.ID ? "highlight" : ""
//                             }`}
//                         >
//                             {participant.name}
//                         </div>
//                         <div className="user-score">{participant.points} pts</div>
//                     </div>
//                 </div>
//             ))}
//         </div>
        
//         <div className="info-box">
//             <h2>How to Earn Points</h2>
//             <p>
//                 Points are awarded for completing challenges, helping teammates, and
//                 participating in bootcamp activities.
//             </p>
//             <p>
//                 Stay active and engaged to climb the leaderboard!
//             </p>
//         </div>
        
//         <div className="back-link">
//             <Link to="/dashboard" className="dashboard-link">
//                 Back to Dashboard
//             </Link>
//         </div>
//         </div>
//     );
// };

// export default Leaderboard;

const styles: {
    [key: string]: React.CSSProperties;
  } = {
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
        leaderboardContainer: {
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "linear-gradient(to bottom, rgba(121,112,235,1) 0%, rgba(175,130,204,1) 55%, rgba(214,112,207,1) 94%, rgba(214,112,207,1) 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
     },
    leaderboardTitle: {
      width: "40%",
      background: "linear-gradient(180deg, #dfd695, #FEA85F, #fc7e80)",
      color: "#2f2f2f",
      padding: "20px 0",
      height: "13vh",
      margin: "0",
      fontWeight: "bold",
      letterSpacing: "4px",
      borderRadius: "20px",
      boxShadow: "8px 10px 15px -6px rgb(99, 61, 99)",
      fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
      marginTop: "88px",
    },
    leaderboardList: {
      width: "90%",
      maxWidth: "1200px",
      margin: "20px auto",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    leaderboardItem: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#c4f2f5",
      width: "100%",
      padding: "15px 20px",
      boxShadow: "8px 10px 15px -6px rgb(99, 61, 99)",
    },
    starContainer: {
      width: "50px",
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    starIcon: {
      width: "50px",
      height: "50px",
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

function setHoveredLink(link: string) {
    throw new Error('Function not implemented.');
}
