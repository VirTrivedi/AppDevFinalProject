import React from 'react';
import { useState } from 'react';

const Attendance = () => {
    // Initialize attendance data
    const [attendanceData, setAttendanceData] = useState([
        true, false, true, false, true, true, false, false, true, true, false, true
    ]);

    // Predefined timestamps for each week (example: Unix timestamps for simplicity)
    const weekTimestamps = [
        1701302400, 
        1701907200, 
        1702512000, 
        1703116800,
        1703721600,
        1704326400, 
        1704931200, 
        1705536000, 
        1706140800, 
        1706745600, 
        1707350400, 
        1707955200, 
    ];

    const weekRows = [
        'B2:B6',
        'C2:C6',
        'D2:D6'
    ]

    const currentTime = Math.floor(Date.now() / 1000); 
    console.log(currentTime)

    const handleClick = (index: number) => {
        // Only allow toggling if attendance is not published and the week is past or ongoing
        if (!attendanceData[index] && currentTime >= weekTimestamps[index]) {
            setAttendanceData((prevData) => {
                const newData = [...prevData];
                newData[index] = true; // Mark as published
                return newData;
            });
        }
    };

    const renderButton = (isPublished: boolean, index: number) => {
        const isUpcoming = currentTime < weekTimestamps[index]; // Check if the week is upcoming
        let buttonStyle = {
            backgroundColor: isPublished ? 'green' : isUpcoming ? 'grey' : 'blue',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            cursor: isPublished || isUpcoming ? 'not-allowed' : 'pointer',
        };

        return (
            <button
                style={buttonStyle}
                onClick={() => handleClick(index)}
                disabled={isPublished || isUpcoming} // Disable the button if published or the week is upcoming
            >
                {isPublished ? 'Published' : isUpcoming ? 'Upcoming' : 'Assign attendance points'}
            </button>
        );
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Attendance Status</h2>
            {attendanceData.map((isPublished, index) => (
                <div key={index} style={{ margin: '10px' }}>
                    <span>Week {index + 1}</span>
                    {renderButton(isPublished, index)}
                </div>
            ))}
        </div>
    );
};

export default Attendance;
