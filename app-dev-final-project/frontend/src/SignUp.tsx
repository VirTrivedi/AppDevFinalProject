import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://127.0.0.1:8000";

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      // Send user data to the backend
      const response = await axios.post(`${API_BASE_URL}/mentees/new`, {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        setSuccess(true);
        setError("");
        alert("Signup successful! Redirecting to login page...");
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError("Signup failed. Please try again or use a different email.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>⭐ Sign Up ⭐</h1>
        {error && <p style={styles.errorText}>{error}</p>}
        {success && <p style={styles.successText}>Signup successful!</p>}
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            placeholder="Enter your name"
          />
        </div>
          <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your email"
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
  page: React.CSSProperties;
  container: React.CSSProperties;
  title: React.CSSProperties;
  formGroup: React.CSSProperties;
  label: React.CSSProperties;
  input: React.CSSProperties;
  button: React.CSSProperties;
  linkText: React.CSSProperties;
  link: React.CSSProperties;
} = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: '0',
    fontFamily: "'Arial', sans-serif",
    width: '100vw',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    maxHeight: '6000px',
    alignItems: 'center',
    maxWidth: '800px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(to bottom, #FFFBCC, #FFF3A0)',
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
  },
  input: {
    width: '90%',
    padding: '30px',
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
  errorText: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  successText: {
    color: "green",
    fontSize: "14px",
    marginBottom: "10px",
  },
};
 
