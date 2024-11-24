import React, { useState } from 'react';


type Photo = {
  id: number;
  url: string;
  caption: string;
  status: 'pending' | 'approved' | 'rejected'; 
};

type PhotoItemProps = {
  key: number;
  photo: Photo;

};

const PhotoItem = ({ photo }: PhotoItemProps) => {

  let [rejectStatus, setRejectStatus] = useState(false);
  let [approveStatus, setApproveStatus] = useState(false);


  function handleApprove() {
        setRejectStatus(false);
        setApproveStatus(true);
        photo.status = 'approved';
    };

  function handleReject() {
    setRejectStatus(true);
    setApproveStatus(false);
    photo.status = 'rejected';
    };
  
  function handleReset() {
    setRejectStatus(false);
    setApproveStatus(false);
    photo.status = 'pending';
  };



    return (
      <div className="photo-item">
        <img src={`../public/images/${photo.url}`} alt={photo.caption} className="photo" />
        <div className="caption">{photo.caption}</div>
        <div className="controls">

          {(!rejectStatus && !approveStatus) && (<button onClick={handleApprove} className="approve-btn">Approve</button>)}
          {(!rejectStatus && !approveStatus) && (<button onClick={handleReject} className="reject-btn">Reject</button>)}
          {(!rejectStatus && approveStatus) && (<h3>Approved!</h3>)}
          {(rejectStatus && !approveStatus) && (<h3>Rejected</h3>)}
          {(!rejectStatus && approveStatus || rejectStatus && !approveStatus) && (<button onClick={handleReset} className="reset-btn">Change this</button>)}

        </div>
      </div>
    );};

type Challenge = {
  name: string;
  photos: Photo[];
};

type MediaReviewPageProps = {
  challenges: Challenge[];
};


const MediaReviewPage = ({ challenges }: MediaReviewPageProps) => {

  const [openChallenge, setOpenChallenge] = useState<string | null>(null);

  challenges = [{name: "Week 01: Halloween", photos: [{id: 1, url: 'download.jpeg', caption: "look at this tree", status: "pending"}, {id: 2, url: 'download.jpeg', caption: "look at this tree", status: "pending"}]},
  {name: "Week 02: Dorm", photos: [{id: 2, url: 'download.jpeg', caption: "look at this dorm", status: "pending"}]}
  ];
  
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