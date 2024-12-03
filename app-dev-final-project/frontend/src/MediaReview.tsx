import React, { useEffect, useState } from "react";

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
  photos: Photo[]; // Added photos array to match your data
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo }) => {
  const [status, setStatus] = useState(photo.status);

  const handleApprove = () => setStatus("approved");
  const handleReject = () => setStatus("rejected");
  const handleReset = () => setStatus("pending");

  return (
    <div className="photo-item">
      <img src={`/images/${photo.url}`} alt={photo.caption} className="photo" />
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
  const { fetchChallenges } = useAppContext();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [openChallenge, setOpenChallenge] = useState<number | null>(null); // Changed to number for ID comparison

  useEffect(() => {
    const loadChallenges = async () => {
      const fetchedChallenges = await fetchChallenges();
      if (Array.isArray(fetchedChallenges)) {
        setChallenges(fetchedChallenges);
      } else {
        console.error("Fetched data is not an array", fetchedChallenges);
      }
    };
    loadChallenges();
  }, [fetchChallenges]);

  const toggleDropdown = (challengeID: number) => {
    setOpenChallenge(openChallenge === challengeID ? null : challengeID);
  };

  return (
    <div className="media-review-page">
      <h1>Review Challenge Photos</h1>
      {challenges.map((challenge) => (
        <div key={challenge.ID} className="challenge">
          <button
            onClick={() => toggleDropdown(challenge.ID)} // Use ID for toggling
            className="challenge-dropdown-button"
          >
            {challenge.Description} {/* Updated to match your data */}
          </button>
          {openChallenge === challenge.ID && (
            <div className="dropdown-window-overlay">
              <div className="dropdown-window">
                <h2>{challenge.Description} Photos</h2>
                <div className="photo-list">
                  {challenge.photos.map((photo) => (
                    <PhotoItem key={photo.id} photo={photo} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MediaReviewPage;
