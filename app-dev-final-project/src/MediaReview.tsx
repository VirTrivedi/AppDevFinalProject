import React, { useState } from 'react';


type Photo = {
  id: number;
  url: string;
  caption: string;
  status: 'pending' | 'approved' | 'rejected'; // Added status
};

type PhotoItemProps = {
  photo: Photo;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onChangeStatus: (id: number) => void; // New prop to handle status reset
};

const PhotoItem = ({ photo, onApprove, onReject, onChangeStatus }: PhotoItemProps) => {
  const renderStatus = () => {
    switch (photo.status) {
      case 'approved':
        return <span>Approved</span>;
      case 'rejected':
        return <span>Rejected</span>;
      default:
        return (
          <>
            <button onClick={() => onApprove(photo.id)} className="approve-btn">
              Approve
            </button>
            <button onClick={() => onReject(photo.id)} className="reject-btn">
              Reject
            </button>
          </>
        );
    }
  };

  return (
    <div className="photo-item">
      <img src={`../public/images/${photo.url}`} alt={photo.caption} className="photo" />
      <div className="caption">{photo.caption}</div>
      <div className="controls">
        {renderStatus()}
        {(photo.status === 'approved' || photo.status === 'rejected') && (
          <button onClick={() => onChangeStatus(photo.id)} className="change-status-btn">
            Change this
          </button>
        )}
      </div>
    </div>
  );
};

type Challenge = {
  name: string;
  photos: Photo[];
};

type MediaReviewPageProps = {
  challenges: Challenge[];
};


const MediaReviewPage = ({ challenges }: MediaReviewPageProps) => {
//   const [approvedPhotos, setApprovedPhotos] = useState<number[]>([]);
//   const [rejectedPhotos, setRejectedPhotos] = useState<number[]>([]);
  const [openChallenge, setOpenChallenge] = useState<string | null>(null);

  challenges = [{name: "Week 01: Halloween", photos: [{id: 1, url: 'download.jpeg', caption: "look at this tree", status: "pending"}]},
  {name: "Week 02: Dorm", photos: [{id: 2, url: 'download.jpeg', caption: "look at this dorm", status: "pending"}]}
  ];
  
const [photos, setPhotos] = useState<Photo[]>([
  { id: 1, url: 'download.jpeg', caption: 'look at this tree', status: 'pending' },
  { id: 2, url: 'download.jpeg', caption: 'look at this dorm', status: 'pending' },
]);
const handleApprove = (id: number) => {
  setPhotos((prevPhotos) =>
    prevPhotos.map((photo) =>
      photo.id === id ? { ...photo, status: 'approved' } : photo
    )
  );
};


const handleReject = (id: number) => {
  setPhotos((prevPhotos) =>
    prevPhotos.map((photo) =>
      photo.id === id ? { ...photo, status: 'rejected' } : photo
    )
  );
};

const handleChangeStatus = (id: number) => {
  setPhotos((prevPhotos) =>
    prevPhotos.map((photo) =>
      photo.id === id ? { ...photo, status: 'pending' } : photo
    )
  );
};


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
                  <PhotoItem
                    key={photo.id}
                    photo={photo}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onChangeStatus={handleChangeStatus}
                  />
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