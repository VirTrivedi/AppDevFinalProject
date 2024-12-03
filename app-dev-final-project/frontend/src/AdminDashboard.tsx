import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      navigate("/login"); // Redirect to login page
    }
  };

  const handleMouseEnter = (link: string) => setHoveredLink(link);
  const handleMouseLeave = () => setHoveredLink(null);

  return (
    <div style={styles.page}>
      <div style={styles.dashboardContainer}>
      <div style={styles.dashboardContainer0}>
        <h1 style={styles.dashTitle}>ADMIN DASHBOARD</h1>
        <h2 style={styles.welcomeText}>Welcome back!</h2>
        <div style={styles.buttonContainer}>
          <Link to="/leaderboard" style={styles.button}>LEADERBOARD</Link>
          <Link to="/media" style={styles.button}>MEDIA REVIEW</Link>
          <Link to="/attendance" style={styles.button}>ATTENDANCE</Link>
          <Link to="/management" style={styles.button}>USER MANAGEMENT</Link>
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
    </div>
   
    </div>
  );
};
    
export default AdminDashboard;


const styles: {
  [key: string]: React.CSSProperties; 
 } = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: '0',
    fontFamily: "'Gill Sans', sans-serif",
    width: '100vw',
    background: 'radial-gradient( #002066, #3A1258)',
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '60%',
    height: '60%',
    maxHeight: '600px',
    alignItems: 'center',
    maxWidth: '820px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(to bottom, #ffe29f, #ffa99f)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    textAlign: "center",
    
  },
  dashboardContainer0: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '90%',
    height: '95%',
    maxHeight: '600px',
    alignItems: 'center',
    maxWidth: '820px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(to bottom, #ffe29f, #ffa99f)',
    textAlign: "center",
    border: "solid 6px",
  },
dashTitle: {
  margin: 0,
  fontSize: "3rem",
  color: "#002066",
  
},
  section: {
    marginBottom: '20px',
    width: "100%",
    height: '100%',
    display: "inline",
    padding: "35px",
    justifyContent: "center",
    textAlign: "center",
  }, 
  button: {
   backgroundColor: "#F9FFA1",
    borderRadius: "10px",
    border: "3px solid #005f7f",
    padding: "30px 40px",
    color: "#250F49",
    fontWeight: "bold",
    textAlign: "center",
    display: "inline-block",
    width: "30%",
    margin: "10px 0",
    transition: "all 0.3s ease",
    boxShadow: '6px 8px 2px rgba(0, 0, 0, 0.2)',
    justifyContent: "center",
  },
  logoutButtonHover: {
    backgroundColor: "#FF2222",
    transform: "scale(1.05)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    display: "flex",


  },
};