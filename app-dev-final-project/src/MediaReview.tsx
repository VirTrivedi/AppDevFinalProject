import { useState } from 'react';

  type Photo = {
    id: number;
    url: string;
  }
  
  type PhotoItemProps = {
    photo: Photo;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
  }

const PhotoItem = ({ photo, onApprove, onReject }:PhotoItemProps) => {
    return (
      <div className="photo-item">
        <img src={photo.url} alt="Review" className="photo" />
        <div className="controls">
          <button onClick={() => onApprove(photo.id)} className="approve-btn">
            Approve
          </button>
          <button onClick={() => onReject(photo.id)} className="reject-btn">
            Reject
          </button>
        </div>
      </div>
    );
  };
  
  type MediaReviewPageProps = {
    photos: Photo[];
  };

  const MediaReviewPage = ({ photos }: MediaReviewPageProps) => {
    const [approvedPhotos, setApprovedPhotos] = useState<number[]>([]); // have to type declare. oops
    const [rejectedPhotos, setRejectedPhotos] = useState<number[]>([]);
  
    const handleApprove = (id: number) => {
      setApprovedPhotos((prev) => [...prev, id]);
      setRejectedPhotos((prev) => prev.filter((photoId) => photoId !== id)); 
    };
  
    const handleReject = (id: number) => {
      setRejectedPhotos((prev) => [...prev, id]);
      setApprovedPhotos((prev) => prev.filter((photoId) => photoId !== id));
    };
  
    return (
      <div className="media-review-page">
        <h1>Review Photos</h1>
        <div className="photo-list">
          {photos.map((photo) => (
            <PhotoItem
              photo={photo}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
        <div className="review-summary">
          <h3>Approved Photos</h3>
          <ul>
            {approvedPhotos.map((id) => (
              <li key={id}>Photo {id}</li>
            ))}
          </ul>
          <h3>Rejected Photos</h3>
          <ul>
            {rejectedPhotos.map((id) => (
              <li key={id}>Photo {id}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };


export default MediaReviewPage;