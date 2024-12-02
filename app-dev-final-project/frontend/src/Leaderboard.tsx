import React, { useEffect } from 'react';
import { useAppContext } from './AppContext';
import { Link } from 'react-router-dom';
import "./Leaderboard.css";

const Leaderboard: React.FC = () => {
    const { person, mentees, fetchMentees } = useAppContext();

    // Combine person and mentees, and sort by score
    const allParticipants = person
        ? [{ ...person }, ...mentees.filter((mentee) => mentee.ID !== person.ID)].sort(
              (a, b) => b.points - a.points
          )
        : mentees.sort((a, b) => b.points - a.points);

    useEffect(() => {
        // Fetch mentees on component mount
        fetchMentees();
    }, [fetchMentees]);

    return (
        <div className="leaderboard-container">
        <h1 className="leaderboard-title">BOOTCAMP LEADERBOARD</h1>  
        
        <div className="leaderboard-list">
            {allParticipants.map((participant, index) => (
                <div key={participant.ID || index} className="leaderboard-item">
                    <div className="star-container">
                        {index < 3 && (
                            <img
                                src={`/assets/star-${index + 1}.png`}
                                alt={`${index + 1} place`}
                                className="star-icon"
                            />
                        )}
                    </div>
                    {participant.points >= 0 && (
                        <div className="user-info">
                            <div
                                className={`user-name ${
                                    person && participant.ID === person.ID ? "highlight" : ""
                                }`}
                            >
                                {participant.name}
                            </div>
                            <div className="user-score">{participant.points} pts</div>
                        </div>
                    )}
                </div>
            ))}
        </div>
        
        <div className="info-box">
            <h2>How to Earn Points</h2>
            <p>
                Points are awarded for completing challenges, helping teammates, and
                participating in bootcamp activities.
            </p>
            <p>
                Stay active and engaged to climb the leaderboard!
            </p>
        </div>
        
        <div className="back-link">
            <Link to="/dashboard" className="dashboard-link">
                Back to Dashboard
            </Link>
        </div>
    </div>
    );
};

export default Leaderboard;