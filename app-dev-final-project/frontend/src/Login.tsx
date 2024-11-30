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
    <div style={styles.container}>
      <h1>Login</h1>
      <div style={styles.formGroup}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Enter your email"
        />
      </div>
      <div style={styles.formGroup}>
        <label>Password:</label>
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
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  linkText: {
    marginTop: '10px',
    fontSize: '14px',
  },
};