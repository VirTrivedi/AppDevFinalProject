import React, { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";

type Photo = {
  id: number;
  url: string;
  caption: string;
  status: "pending" | "approved" | "rejected";
};

type PhotoItemProps = {
  photo: Photo;
};

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
  const [openChallenge, setOpenChallenge] = useState<string | null>(null);

  useEffect(() => {
    const loadChallenges = async () => {
      const fetchedChallenges = await fetchChallenges();
      setChallenges(fetchedChallenges);
    };
    loadChallenges();
  }, [fetchChallenges]);

  const toggleDropdown = (challengeName: string) => {
    setOpenChallenge(openChallenge === challengeName ? null : challengeName);
  };

  return (
    <div className="media-review-page">
      <h1>Review Challenge Photos</h1>
      {challenges.map((challenge) => (
        <div key={challenge.name} className="challenge">
          <button
            onClick={() => toggleDropdown(challenge.name)}
            className="challenge-dropdown-button"
          >
            {challenge.name}
          </button>
          {openChallenge === challenge.name && (
            <div className="dropdown-window-overlay">
              <div className="dropdown-window">
                <h2>{challenge.name} Photos</h2>
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
