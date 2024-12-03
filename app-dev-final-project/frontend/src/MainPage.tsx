
import React from 'react';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
return (
  <div style={styles.background}>
  <img
      src="/images/background.png"
      alt="background" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
      }} /> 
  <div style={styles.outerContainer}>
    <div style={styles.imageContainer}>
      <img
        src="/images/computer-icon.png"
        alt="Computer Icon"
        style={styles.icon}
      />
      <div style={styles.screenOverlay}>
       <div style={styles.textContainer}>
          <Link to="/login">
            <button style={styles.button}>Login</button>
          </Link>
          <Link to="/signup">
            <button style={styles.button}>Sign Up</button>
          </Link>
          </div>
        </div>
    </div>
  </div>
  </div>
);
};


export default Home;


const styles: {
  [key: string]: React.CSSProperties; 
 } = {
outerContainer: {
   height: '100vh',
   display: 'flex',
   flexDirection: 'column',
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: 'transparent',
 },
 background: {
 },
 imageContainer: {
   width: '100%', // Ensures the container spans the screen width
   maxWidth: '600px', // Restricts the maximum width of the container
   height: 'auto',
 },
 icon: {
   width: '70vw',
   maxWidth: '1800px', // Matches the width of the container
   height: 'auto',
   display: 'block',
   margin: '0 auto',
   marginLeft: '280px',
   marginTop: '75px',
 },
 screenOverlay: {
   position: 'absolute',
   top: 0,
   left: 0,
   width: '100%',
   height: '100%',
   display: 'flex',
   flexDirection: 'column',
   justifyContent: 'center',
   alignItems: 'center',
   fontFamily: 'Arial, sans-serif',
   textAlign: 'center',
 },
 textContainer: {
   marginTop: '230px', // Adjust to position text directly beneath the ADC logo
   width: '100%', // Matches the width of the container
   display: 'flex',
   flexDirection: 'column',
   justifyContent: 'center',
   gap: '0.1px',
   marginRight: '50px',
 },
 button: {
   width: '234px', // Sets a consistent button width
   height: '55px',
   padding: '10px 10px',
   margin: '2px 0', // Spacing between buttons
   borderRadius: '8px',
   border: 'transparent', // Optional: for better visibility
   fontSize: '2.9rem',
   fontWeight: 'bold',
   cursor: 'pointer',
   transition: 'all 0.3s ease',
   backgroundColor: 'transparent',
   color: '#ffffff',
   textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)', // Add text shadow
 },
};


