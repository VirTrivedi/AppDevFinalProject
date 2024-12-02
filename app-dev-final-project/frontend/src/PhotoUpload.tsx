import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PhotoUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Only JPEG and PNG files are allowed.');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a photo to upload.');
      return;
    }
    if (!caption.trim()) {
      setError('Please add a caption for your photo.');
      return;
    }
    if (!challengeId.trim() || !teamId.trim()) {
      setError('Please provide a valid Challenge ID and Team ID.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('caption', caption);
    formData.append('challenge_id', challengeId);
    formData.append('team_id', teamId);

    try {
      const response = await fetch('/photos/new', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload photo');
      }

      const data = await response.json();
      setSuccessMessage(data.message || 'Photo uploaded successfully!');
      setSelectedFile(null);
      setCaption('');
      setChallengeId('');
      setTeamId('');
    } catch (error: any) {
      setError(error.message);
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
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter a caption for your photo"
          style={styles.captionInput}
        />
        <input
          type="number"
          value={challengeId}
          onChange={(e) => setChallengeId(e.target.value)}
          placeholder="Challenge ID"
          style={styles.input}
        />
        <input
          type="number"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="Team ID"
          style={styles.input}
        />
        {error && <p style={styles.errorText}>{error}</p>}
        {successMessage && <p style={styles.successText}>{successMessage}</p>}
        <button onClick={handleUpload} style={styles.uploadButton}>
          Upload Photo
        </button>
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
    marginBottom: '10px',
  },
  captionInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  input: {
    padding: '10px',
    fontSize: '16px',
  },
  successText: {
    color: 'green',
  },
};
