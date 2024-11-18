import React from 'react';
import { useAppContext } from './AppContext';
import { Link } from 'react-router-dom';

const Leaderboard: React.FC = () => {
    const { person, teammates, otherParticipants } = useAppContext();

    // Combine person, teammates, and other participants, and sort by score
    const allParticipants = [{ ...person }, ...teammates, ...otherParticipants].sort(
    (a, b) => b.score - a.score
    );

    return (
    <div style={styles.container}>
        <h1>Leaderboard</h1>
        <ul style={styles.list}>
        {allParticipants.map((participant, index) => {
            const isPerson = participant.name === person.name;
            const isTeammate = teammates.some(teammate => teammate.name === participant.name);
            return (
                <li
                    key={index}
                    style={{
                        ...styles.listItem,
                        fontWeight: isTeammate || isPerson ? 'bold' : 'normal',
                    }}
                    >
                    {index + 1}. {participant.name} - {participant.score} points
                </li>
                );
        })}
        </ul>
        <div style={styles.infoBox}>
            <h3>How Points are Earned</h3>
            <p>Points are awarded based on various activities such as task completion, teamwork, and mentorship contributions. Higher scores indicate greater engagement and success in the program.</p>
        </div>
        <div style={{ marginTop: '20px' }}>
            <Link to="/">Go to Dashboard</Link>
        </div>
    </div>
    );
};

export default Leaderboard;

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        margin: '5px 0',
    },
    infoBox: {
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
};
