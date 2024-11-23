import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { Link } from 'react-router-dom';

const PhotoUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const { addPhoto } = useAppContext();

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

  const handleUpload = () => {
    if (!selectedFile) {
      setError('Please select a photo to upload.');
      return;
    }
    if (!caption.trim()) {
      setError('Please add a caption for your photo.');
      return;
    }

    addPhoto(selectedFile, caption);
    setSelectedFile(null);
    setCaption('');
    alert('Photo and caption uploaded successfully!');
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
        {error && <p style={styles.errorText}>{error}</p>}
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
};
