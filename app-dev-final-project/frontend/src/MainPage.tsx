import React from 'react';
import { Link } from 'react-router-dom';


const Home: React.FC = () => {
 return (
   <div style={styles.outerContainer}>
     <div style={styles.imageContainer}>
       <img
         src="/computer-icon.png"
         alt="Computer Icon"
         style={styles.icon}
       />
       <div style={styles.screenOverlay}>
         <div style={styles.buttonContainer}>
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
 );
};


export default Home;


const styles = {
 outerContainer: {
   height: '100vh',
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
   background: 'radial-gradient(circle, #1C0D59, #121212)',
 },
 imageContainer: {
   width: '400px', // Adjust width based on your image size
   height: 'auto',
 },
 icon: {
   width: '800px',
   height: 'auto',
 },
 screenOverlay: {
   top: '60%',
   left: '83%',
   transform: 'translate(-50%, -50%)',
   width: '50%', // Adjust to fit the "screen" area
   color: '#ffffff',
   fontFamily: 'Arial, sans-serif',
 },
 title: {
   fontSize: '36px',
   fontWeight: 'bold',
   marginBottom: '20px',
 },
 buttonContainer: {
   display: 'flex',
   gap: '10px',
 },
 button: {
   width: '60%',
   padding: '0.1px',
   borderRadius: '5px',
   border: 'none',
   backgroundColor: 'transparent',
   color: '#ffffff',
   fontSize: '30px',
   fontWeight: 'bold',
   cursor: 'pointer',
   transition: 'all 0.3s ease',
 },
};
