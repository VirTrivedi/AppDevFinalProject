// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE_URL = 'http://127.0.0.1:8000';

// type Photo = {
//   id: number;
//   url: string;
//   caption: string;
//   status: "pending" | "approved" | "rejected";
// };

// type PhotoItemProps = {
//   photo: Photo;
// };

// interface Challenge {
//   ID: number;
//   Description: string;
//   StartDate: string;
//   EndDate: string;
//   PointsValue: number;
//   photos: Photo[];
// }

// const PhotoItem: React.FC<PhotoItemProps> = ({ photo }) => {
//   const [status, setStatus] = useState(photo.status);

//   const handleApprove = async () => {
//     setStatus("approved");
//     try {
//       await axios.patch(`${API_BASE_URL}/photos/${photo.id}/approve`, { status: "approved" });
//     } catch (error) {
//       console.error("Error updating photo status:", error);
//     }
//   };

//   const handleReject = async () => {
//     setStatus("rejected");
//     try {
//       await axios.patch(`${API_BASE_URL}/photos/${photo.id}/deny`, { status: "rejected" });
//     } catch (error) {
//       console.error("Error updating photo status:", error);
//     }
//   };

//   const handleReset = async () => {
//     setStatus("pending");
//     try {
//       await axios.patch(`${API_BASE_URL}/photos/${photo.id}/pending`, { status: "pending" });
//     } catch (error) {
//       console.error("Error resetting photo status:", error);
//     }
//   };

//   return (
//     <div className="photo-item">
//       <img src={`${API_BASE_URL}/images/${photo.url}`} alt={photo.caption} className="photo" />
//       <div className="caption">{photo.caption}</div>
//       <div className="controls">
//         {status === "pending" && (
//           <>
//             <button onClick={handleApprove} className="approve-btn">Approve</button>
//             <button onClick={handleReject} className="reject-btn">Reject</button>
//           </>
//         )}
//         {status !== "pending" && (
//           <button onClick={handleReset} className="reset-btn">Change this</button>
//         )}
//         <h3>{status === "approved" ? "Approved!" : status === "rejected" ? "Rejected" : null}</h3>
//       </div>
//     </div>
//   );
// };

// const MediaReviewPage: React.FC = () => {
//   const [challenges, setChallenges] = useState<Challenge[]>([]);
//   const [openChallenge, setOpenChallenge] = useState<number | null>(null);

//   useEffect(() => {
//     const loadChallenges = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/challenges`);
//         const fetchedChallenges = response.data;

//         if (Array.isArray(fetchedChallenges)) {
//           setChallenges(fetchedChallenges);
//         } else {
//           console.error("Fetched data is not an array", fetchedChallenges);
//         }

//         const challengesWithPhotos = fetchedChallenges.map((challenge: Challenge) => ({
//           ...challenge,
//           photos: challenge.photos || [], // Fallback to empty array if photos is undefined or null
//         }));

//         setChallenges(challengesWithPhotos);

//       } catch (error) {
//         console.error("Error fetching challenges:", error);
//       }
//     };
//     loadChallenges();
//   }, []);

//   const toggleDropdown = (challengeID: number) => {
//     setOpenChallenge(openChallenge === challengeID ? null : challengeID);
//   };

//   return (
//     <div className="media-review-page">
//       <h1>Review Challenge Photos.</h1>
//       {challenges.map((challenge) => (
//         <div key={challenge.ID} className="challenge">
//           <button
//             onClick={() => toggleDropdown(challenge.ID)} 
//             className="challenge-dropdown-button"
//           >
//             {challenge.Description}
//           </button>
//           <div className={`dropdown-window-overlay ${openChallenge === challenge.ID ? '' : 'hidden'}`}>
//             {openChallenge === challenge.ID && (
//               <div className="dropdown-window">
//                 <div className="photo-list">
//                   {challenge.photos.length > 0 ? (
//                     challenge.photos.map((photo) => (
//                       <PhotoItem key={photo.id} photo={photo} />
//                     ))
//                   ) : (
//                     <p>No photos yet!</p>  
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MediaReviewPage;

import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

type Photo = {
  id: number;
  url: string;
  caption: string;
  status: "pending" | "approved" | "rejected";
};

type PhotoItemProps = {
  photo: Photo;
};

interface Challenge {
  ID: number;
  Description: string;
  StartDate: string;
  EndDate: string;
  PointsValue: number;
  photos: Photo[];
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo }) => {
  const [status, setStatus] = useState(photo.status);

  const handleApprove = async () => {
    setStatus("approved");
    try {
      await axios.patch(`${API_BASE_URL}/photos/${photo.id}/approve`, { status: "approved" });
    } catch (error) {
      console.error("Error updating photo status:", error);
    }
  };

  const handleReject = async () => {
    setStatus("rejected");
    try {
      await axios.patch(`${API_BASE_URL}/photos/${photo.id}/deny`, { status: "rejected" });
    } catch (error) {
      console.error("Error updating photo status:", error);
    }
  };

  const handleReset = async () => {
    setStatus("pending");
    try {
      await axios.patch(`${API_BASE_URL}/photos/${photo.id}/pending`, { status: "pending" });
    } catch (error) {
      console.error("Error resetting photo status:", error);
    }
  };

  return (
    <div style={styles.photoItem}>
      <img src={`${API_BASE_URL}/images/${photo.url}`} alt={photo.caption} style={styles.photo} />
      <div style={styles.caption}>{photo.caption}</div>
      <div style={styles.controls}>
        {status === "pending" && (
          <>
            <button onClick={handleApprove} style={styles.approveButton}>
              Approve
            </button>
            <button onClick={handleReject} style={styles.rejectButton}>
              Reject
            </button>
          </>
        )}
        {status !== "pending" && (
          <button onClick={handleReset} style={styles.resetButton}>
            Change this
          </button>
        )}
        <h3 style={styles.status}>
          {status === "approved" ? "Approved!" : status === "rejected" ? "Rejected" : null}
        </h3>
      </div>
    </div>
  );
};

const MediaReviewPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [openChallenge, setOpenChallenge] = useState<number | null>(null);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/challenges`);
        const fetchedChallenges = response.data;

        const challengesWithPhotos = fetchedChallenges.map((challenge: Challenge) => ({
          ...challenge,
          photos: challenge.photos || [],
        }));

        setChallenges(challengesWithPhotos);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };
    loadChallenges();
  }, []);

  const toggleDropdown = (challengeID: number) => {
    setOpenChallenge(openChallenge === challengeID ? null : challengeID);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📸 Review Challenge Photos 📸</h1>
        {challenges.map((challenge) => (
          <div key={challenge.ID} style={styles.challenge}>
            <button
              onClick={() => toggleDropdown(challenge.ID)}
              style={styles.dropdownButton}
            >
              {challenge.Description}
            </button>
            {openChallenge === challenge.ID && (
              <div style={styles.dropdownContent}>
                <div style={styles.photoList}>
                  {challenge.photos.length > 0 ? (
                    challenge.photos.map((photo) => (
                      <PhotoItem key={photo.id} photo={photo} />
                    ))
                  ) : (
                    <p style={styles.noPhotosMessage}>No photos yet!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaReviewPage;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: "0",
    fontFamily: "'Gill Sans', sans-serif",
    width: "100vw",
    background: "radial-gradient( #002066, #3A1258)",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    maxWidth: "800px",
    padding: "40px",
    borderRadius: "20px",
    background: "linear-gradient(to bottom, #ffe29f, #ffa99f)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "30px",
    fontWeight: "bold",
    color: "#3A1258",
    textAlign: "center",
  },
  challenge: {
    marginBottom: "20px",
    width: "100%",
  },
  dropdownButton: {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#FF6F61",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#fff",
    cursor: "pointer",
  },
  dropdownContent: {
    marginTop: "10px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#FFF4E6",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  photoList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
  noPhotosMessage: {
    fontSize: "1.2rem",
    color: "#3A1258",
  },
  photoItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#FFE4D9",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  photo: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  caption: {
    marginTop: "10px",
    fontSize: "1.2rem",
    color: "#3A1258",
  },
  controls: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  approveButton: {
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#F44336",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },
  resetButton: {
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#FFC107",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },
  status: {
    marginTop: "10px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#3A1258",
  },
};