import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = 'http://127.0.0.1:8000';

type Photo = {
  id: number;
  url: string;
  caption: string;
  status: "published" | "unpublished";
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
    <div className="photo-item">
      <img src={`${API_BASE_URL}/images/${photo.url}`} alt={photo.caption} className="photo" />
      <div className="caption">{photo.caption}</div>
      <div className="controls">
        {status === "pending" && (
          <>
            <button onClick={handleApprove} className="approve-btn">Approve</button>
            <button onClick={handleReject} className="reject-btn">Reject</button>
          </>
        )}
        {status !== "pending" && (
          <button onClick={handleReset} className="reset-btn">Change this</button>
        )}
        <h3>{status === "approved" ? "Approved!" : status === "rejected" ? "Rejected" : null}</h3>
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

        if (Array.isArray(fetchedChallenges)) {
          setChallenges(fetchedChallenges);
        } else {
          console.error("Fetched data is not an array", fetchedChallenges);
        }

        const challengesWithPhotos = fetchedChallenges.map((challenge: Challenge) => ({
          ...challenge,
          photos: challenge.photos || [], // Fallback to empty array if photos is undefined or null
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
    <div className="media-review-page">
      <h1>Review Challenge Photos.</h1>
      {challenges.map((challenge) => (
        <div key={challenge.ID} className="challenge">
          <button
            onClick={() => toggleDropdown(challenge.ID)} 
            className="challenge-dropdown-button"
          >
            {challenge.Description}
          </button>
          <div className={`dropdown-window-overlay ${openChallenge === challenge.ID ? '' : 'hidden'}`}>
            {openChallenge === challenge.ID && (
              <div className="dropdown-window">
                <div className="photo-list">
                  {challenge.photos.length > 0 ? (
                    challenge.photos.map((photo) => (
                      <PhotoItem key={photo.id} photo={photo} />
                    ))
                  ) : (
                    <p>No photos yet!</p>  
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaReviewPage;
