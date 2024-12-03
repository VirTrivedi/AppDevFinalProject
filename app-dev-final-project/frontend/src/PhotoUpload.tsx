// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const PhotoUpload: React.FC = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [caption, setCaption] = useState('');
//   const [challengeId, setChallengeId] = useState('');
//   const [teamId, setTeamId] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       if (file.type === 'image/jpeg' || file.type === 'image/png') {
//         setSelectedFile(file);
//         setError('');
//       } else {
//         setError('Only JPEG and PNG files are allowed.');
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setError('Please select a photo to upload.');
//       return;
//     }
//     if (!caption.trim()) {
//       setError('Please add a caption for your photo.');
//       return;
//     }
//     if (!challengeId.trim() || !teamId.trim()) {
//       setError('Please provide a valid Challenge ID and Team ID.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('caption', caption);
//     formData.append('challenge_id', challengeId);
//     formData.append('team_id', teamId);

//     try {
//       const response = await fetch('/photos/new', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to upload photo');
//       }

//       const data = await response.json();
//       setSuccessMessage(data.message || 'Photo uploaded successfully!');
//       setSelectedFile(null);
//       setCaption('');
//       setChallengeId('');
//       setTeamId('');
//     } catch (error: any) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.header}>Photo Upload</h1>
//       <div style={styles.uploadSection}>
//         <input
//           type="file"
//           accept="image/jpeg,image/png"
//           onChange={handleFileChange}
//           style={styles.fileInput}
//         />
//         <input
//           type="text"
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           placeholder="Enter a caption for your photo"
//           style={styles.captionInput}
//         />
//         <input
//           type="number"
//           value={challengeId}
//           onChange={(e) => setChallengeId(e.target.value)}
//           placeholder="Challenge ID"
//           style={styles.input}
//         />
//         <input
//           type="number"
//           value={teamId}
//           onChange={(e) => setTeamId(e.target.value)}
//           placeholder="Team ID"
//           style={styles.input}
//         />
//         {error && <p style={styles.errorText}>{error}</p>}
//         {successMessage && <p style={styles.successText}>{successMessage}</p>}
//         <button onClick={handleUpload} style={styles.uploadButton}>
//           Upload Photo
//         </button>
//       </div>
//       <Link to="/dashboard" style={styles.link}>
//         Back to Dashboard
//       </Link>
//     </div>
//   );
// };

// export default PhotoUpload;

// const styles: {
//   [key: string]: React.CSSProperties;
// } = {
//   container: {
//     padding: '20px',
//     maxWidth: '400px',
//     margin: '50px auto',
//     fontFamily: 'Arial, sans-serif',
//     display: "flex",
//     position: "absolute",
//     alignItems: "center",
   
//   },
//   header: {
//     fontSize: "2rem",
//     color: "#333",
//     marginBottom: "20px",
//   },
//   uploadSection: {
//     marginBottom: '20px',
//   },
//   fileInput: {
//     width: '100%',
//     padding: '10px',
//     marginBottom: '10px',
//   },
//   captionInput: {
//     width: '100%',
//     padding: '10px',
//     marginBottom: '10px',
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//   },
//   uploadButton: {
//     padding: '10px 20px',
//     backgroundColor: '#007BFF',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   errorText: {
//     color: 'red',
//     marginTop: '10px',
//   },
//   link: {
//     display: 'block',
//     marginTop: '20px',
//     textDecoration: 'none',
//     color: '#007BFF',
//   },
//   input: {
//     padding: '10px',
//     fontSize: '16px',
//   },
//   successText: {
//     color: 'green',
//   },
// };


import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PhotoUpload: React.FC = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleMouseEnter = (link: string) => setHoveredLink(link);
  const handleMouseLeave = () => setHoveredLink(null);

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
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <img
          src="/images/computer-icon.png"
          alt="Computer Icon"
          style={styles.icon}
        />
        <Link
          to="/leaderboard"
          style={
            hoveredLink === 'leaderboard'
              ? { ...styles.link, ...styles.linkHover1 }
              : styles.link
          }
          onMouseEnter={() => handleMouseEnter('leaderboard')}
          onMouseLeave={handleMouseLeave}
        >
          Go to Leaderboard
        </Link>
        <Link
          to="/photo-upload"
          style={
            hoveredLink === 'photo-upload'
              ? { ...styles.link, ...styles.linkHover2 }
              : styles.link
          }
          onMouseEnter={() => handleMouseEnter('photo-upload')}
          onMouseLeave={handleMouseLeave}
        >
          Upload a Photo
        </Link>
        <Link
          to="/photos"
          style={
            hoveredLink === 'photos'
              ? { ...styles.link, ...styles.linkHover3 }
              : styles.link
          }
          onMouseEnter={() => handleMouseEnter('photos')}
          onMouseLeave={handleMouseLeave}
        >
          View Uploaded Photos
        </Link>
      </nav>

      {/* Existing Photo Upload Section */}
      <div style={styles.container}>
        <h1 style={styles.header}>📸 Photo Upload</h1>
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
      </div>
    </div>
  );
};

export default PhotoUpload;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100vh',
    margin: '0',
    fontFamily: "'Gill Sans', sans-serif",
    width: '100vw',
    background: 'radial-gradient( #002066, #3A1258)',
    
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: "center",
    padding: '5px 5px 5px 5px',
    backgroundImage: "linear-gradient(180deg, #fbfab8, #fffdec",
    boxShadow: "0 8px 10px rgba(0, 0, 0, 0.2)",
    width: "50%",
    position: "relative",
    top: 0,
    zIndex: 20,
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
    color: "#002066",
  },
  icon: {
    height: '40px',
  },
  link: {
    textDecoration: 'none',
    color: '#002066',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    transition: 'color 0.3s',
  },
  linkHover1: {
    color: '#ffa99f',
  },
  linkHover2: {
    color: '#FF6F61',
  },
  linkHover3: {
    color: '#FFE29F',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '580px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(to bottom, #ffe29f, #ffa99f)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    marginTop: "30px",
  },
  header: {
    fontSize: '3rem',
    marginBottom: '30px',
    fontWeight: 'bold',
    color: '#3A1258',
  },
  uploadSection: {
    marginBottom: '20px',
    width: '100%',
  },
  fileInput: {
    width: '90%',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '10px',
    border: '3px solid #FFA99F',
    backgroundColor: '#FFF4E6',
    fontSize: '1.2rem',
    color: '#3A1258',
    outline: 'none',
    transition: '0.3s',
  },
  captionInput: {
    width: '90%',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '10px',
    border: '3px solid #FFA99F',
    backgroundColor: '#FFF4E6',
    fontSize: '1.2rem',
    color: '#3A1258',
    outline: 'none',
    transition: '0.3s',
  },
  input: {
    width: '90%',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '10px',
    border: '3px solid #FFA99F',
    backgroundColor: '#FFF4E6',
    fontSize: '1.2rem',
    color: '#3A1258',
    outline: 'none',
    transition: '0.3s',
  },
  uploadButton: {
    padding: '10px 20px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FF6F61',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
  },
  successText: {
    color: 'green',
    marginTop: '10px',
  },
};
