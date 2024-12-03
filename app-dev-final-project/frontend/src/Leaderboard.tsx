import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./Leaderboard.css";

interface Participant {
    ID: number;
    Name: string;
    Points: number;
  }

const Leaderboard: React.FC = () => {
    const [mentees, setMentees] = useState<Participant[]>([]);
    const [person, setPerson] = useState<Participant | null>(null); // Replace with actual logged-in user data
    const API_BASE_URL = 'http://127.0.0.1:8000';


    // Fetch mentees from the backend
    const fetchMentees = async () => {
        try {
            const response = await axios.get<Participant[]>(`${API_BASE_URL}/mentees`);
            setMentees(response.data);
        } catch (error) {
            console.error('Error fetching mentees:', error);
        }
    };

    useEffect(() => {
        fetchMentees();
    }, []);

    // Combine the logged-in user (person) and mentees, sort by score
    const allParticipants = person
        ? [{ ...person }, ...mentees.filter((mentee) => mentee.ID !== person.ID)].sort(
            (a, b) => b.Points - a.Points
        )
    : mentees.sort((a, b) => b.Points - a.Points);

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
                    <div className="user-info">
                        <div
                            className={`user-name ${
                                person && participant.ID === person.ID ? "highlight" : ""
                            }`}
                        >
                            {participant.Name}
                        </div>
                        <div className="user-score">{participant.Points} pts</div>
                    </div>
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