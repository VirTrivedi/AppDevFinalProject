import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from './AppContext';

const Photos: React.FC = () => {
  const { photos } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
        <h1>Uploaded Photos</h1>
        <p>No photos uploaded yet.</p>
        <Link to="/" style={styles.link}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { photo, caption } = photos[currentIndex];

  return (
    <div style={styles.container}>
      <h1>Uploaded Photos</h1>
      <div style={styles.carousel}>
        <button onClick={handlePrevious} style={styles.navButton}>
          &lt; Prev
        </button>
        <div style={styles.photoContainer}>
          <img
            src={URL.createObjectURL(photo)}
            alt="Uploaded"
            style={{
              ...styles.photo,
              transform: isAnimating ? 'scale(0.9)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />
          <p style={styles.caption}>{caption}</p>
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
              backgroundColor: currentIndex === index ? '#007BFF' : '#ccc',
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

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '50px auto',
    fontFamily: 'Arial, sans-serif',
  },
  carousel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '20px 0',
  },
  photoContainer: {
    width: '100%',
  },
  photo: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
  },
  caption: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#FFF',
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  },
  link: {
    display: 'block',
    marginTop: '20px',
    textDecoration: 'none',
    color: '#007BFF',
  },
};