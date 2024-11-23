import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { Link } from 'react-router-dom';

const PhotoUpload: React.FC = () => {
  const [error, setError] = useState('');
  const { addPhoto } = useAppContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        addPhoto(file); // Add the valid photo to the array
        setError(''); // Clear any previous errors
        alert('Photo uploaded successfully!');
      } else {
        setError('Only JPEG and PNG files are allowed.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Photo Upload</h1>
      <div style={styles.uploadSection}>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        {error && <p style={styles.errorText}>{error}</p>}
      </div>
      <Link to="/" style={styles.link}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default PhotoUpload;

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
  },
  uploadSection: {
    marginBottom: '20px',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
  },
  link: {
    display: 'block',
    marginTop: '20px',
    textDecoration: 'none',
    color: '#007BFF',
  },
};
