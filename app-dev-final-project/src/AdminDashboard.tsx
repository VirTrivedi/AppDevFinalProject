import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';

const AdminDashboard: React.FC = () => {
  const { person, teammates, mentors, setLoginStatus} = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      setLoginStatus(false);
      navigate('/login'); // Redirect to login page
    }
  }
  
  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Administrator! Here you can manage users and view system statistics.</p>
      {/* Add admin-specific functionality here */}

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;

const styles = {
  container: {
  padding: '20px',
  maxWidth: '600px',
  margin: '50px auto',
  fontFamily: 'Arial, sans-serif',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#FF0000',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};