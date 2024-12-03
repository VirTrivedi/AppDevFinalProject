import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (email.trim() && username.trim() && password.trim()) {
      // Simulate saving user data (in a real app, send data to an API)
      alert('User registered successfully!');
      navigate('/login'); // Redirect to login page after successful sign-up
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>⭐ Sign Up ⭐</h1>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your email"
          />
        </div>
          <div style={styles.formGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Choose a username"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        <button onClick={handleSignUp} style={styles.button}>
          Sign Up
        </button>
        <p style={styles.linkText}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

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
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '90%',
    maxHeight: '6000px',
    alignItems: 'center',
    maxWidth: '800px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(to bottom, #ffe29f, #ffa99f)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '4rem',
    marginBottom: '30px',
    fontWeight: 'bold',
    color: '#3A1258',
  },
  formGroup: {
    marginBottom: '50px',
    marginTop: 'auto',
    width: '100%',
  },
  label: {
    fontSize: '2rem',
    color: '#3A1258',
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
    padding: '0.002px',
  },
  input: {
    width: '90%',
    padding: '22px',
    borderRadius: '20px',
    border: '5px solid #FFA99F',
    backgroundColor: '#FFF4E6',
    fontSize: '1.2rem',
    color: '#3A1258',
    outline: 'none',
    transition: '0.3s',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1.9rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FF6F61',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '-10px',
  },
  linkText: {
    marginTop: '10px',
    fontSize: '0.9rem',
    color: '#333',
  },
  link: {
    color: '#FF6F61',
    textDecoration: 'none',
    fontWeight: 'bold',
  }, 
};
 
