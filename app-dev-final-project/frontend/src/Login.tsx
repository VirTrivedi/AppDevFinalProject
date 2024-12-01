import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authenticateUser, setLoginStatus } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email == 'admin' && password == '1234') {
      alert('Admin login successful!');
      navigate('/admin'); // Redirect to admin dashboard
    } else if (email.trim() && password.trim()) {
      try {
        const success = await authenticateUser(email, password);
        if (success) {
          alert('Login successful!');
          setLoginStatus(true);
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          alert('Invalid email or password.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      }
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>⭐ Login ⭐</h1>
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
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
        <p style={styles.linkText}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

const styles = {
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
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    maxHeight: '580px',
    alignItems: 'center',
    maxWidth: '800px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(to bottom, #FFFBCC, #FFF3A0)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '4rem',
    marginBottom: '60px',
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
};