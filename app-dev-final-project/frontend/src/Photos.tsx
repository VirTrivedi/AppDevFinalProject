import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch approved photos when the component mounts
  useEffect(() => {
    const fetchApprovedPhotos = async () => {
      try {
        const response = await fetch('/photos/approved');
        if (!response.ok) {
          throw new Error('Failed to fetch approved photos');
        }
        const data = await response.json();
        setPhotos(data); // Assuming the response is an array of photos
      } catch (error) {
        console.error('Error fetching approved photos:', error);
      }
    };

    fetchApprovedPhotos();
  }, []);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? photos.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (photos.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Uploaded Photos</h1>
        <p>No photos uploaded yet.</p>
        <Link to="/dashboard" style={styles.link}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { FileData, Caption } = photos[currentIndex];

  return (
    <div style={styles.container}>
      <h1>Approved Photos</h1>
      <div style={styles.carousel}>
        <button onClick={handlePrevious} style={styles.navButton}>
          &lt; Prev
        </button>
        <div style={styles.photoContainer}>
          <img
            src={`data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(FileData)))}`}
            alt="Uploaded"
            style={{
              ...styles.photo,
              transform: isAnimating ? 'scale(0.9)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />
          <p style={styles.caption}>{Caption}</p>
        </div>
        <button onClick={handleNext} style={styles.navButton}>
          Next &gt;
        </button>
      </div>

      {/* Dots Indicators */}
      <div style={styles.indicators}>
        {photos.map((_, index) => (
          <span
            key={index}
            style={{
              ...styles.dot,
              backgroundColor: currentIndex === index ? '#ffcc00' : '#ccc',
            }}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>

      <Link to="/" style={styles.link}>
        Back to Dashboard
      </Link>
    </div>
  );
};

export default Photos;

const styles: {
  [key: string]: React.CSSProperties;
} = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "'Gill Sans', sans-serif",
    background: "linear-gradient(135deg, #FF6F61, #FFCC00)",
    borderRadius: "25px",
    color: "#FFF",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
  },
  // header: {
  //   fontSize: "24px",
  //   color: "white",
  //   marginBottom: "20px",
  //   alignItems: 'center',
  // },
  carousel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoContainer: {
    padding: "10px",
    backgroundColor: "#1A1A2E",
    borderRadius: "20px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
  },
  photo: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
  },
  caption: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#FFF',
    textShadow: "1px 1px 4px #000",
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: '#ffcc00',
    color: '#000',
    border: '2px solid #FFD700',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: "14px",
    textShadow: "1px 1px 4px #000",
  },
  indicators: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.5)",
  },
  // link: {
  //   display: "block",
  //   marginTop: "20px",
  //   fontSize: "16px",
  //   color: "#FFF",
  //   textDecoration: "none",
  //   background: "#FFD700",
  //   padding: "10px 20px",
  //   borderRadius: "10px",
  //   boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.5)",
  // },
};