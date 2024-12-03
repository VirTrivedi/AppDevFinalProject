import React, { useState, useEffect } from "react";
import axios from 'axios';

// Define PublishedStatus enum based on the backend model
type PublishedStatus = "published" | "unpublished"

// Define the WeekOut model
interface WeekOut {
  ID: number;
  Published: PublishedStatus;
  DateActive: string; // ISO date string
}

const Attendance = () => {
  const [weeks, setWeeks] = useState<WeekOut[]>([]); // Holds weeks data
  const [attendanceData, setAttendanceData] = useState<boolean[]>([]); // Holds publication status
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch all weeks from the backend
  const fetchWeeks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weeks`);
      setWeeks(response.data);
      setAttendanceData(response.data.map((week: WeekOut) => week.Published === "published"));
    } catch (error) {
      console.error("Error fetching weeks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const publishWeek = async (weekId: number) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/weeks/${weekId}/publish`,
        null, // No body required
        {
          params: { published_status: "published" }, // Query parameter
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Failed to publish the week");
      }
  
      const updatedWeek = response.data;
      console.log("Week published:", updatedWeek);
    } catch (error) {
      console.error("Error publishing the week:", error);
    }
  };
  
  // Handle the click event to publish a week
  const handleClick = async (weekId: number, index: number) => {
    if (!attendanceData[index]) {
      try {
        await publishWeek(weekId);
        setAttendanceData((prevData) => {
          const newData = [...prevData];
          newData[index] = true; // Mark as published
          return newData;
        });
        await fetchWeeks(); // Refresh weeks data
      } catch (error) {
        console.error("Error publishing attendance:", error);
      }
    }
  };

  // Render the publish/attendance button
  const renderButton = (
    week: WeekOut, // Directly pass the week object
    index: number
  ) => {
    const isPublished = week.Published === "published"; // Check if Published status is "published"
    const weekDate = new Date(week.DateActive).getTime() / 1000;
    const isUpcoming = currentTime < weekDate;

    let buttonStyle = {
      backgroundColor: isPublished ? "green" : isUpcoming ? "grey" : "blue",
      color: "white",
      padding: "5px 10px",
      border: "none",
      cursor: isPublished || isUpcoming ? "not-allowed" : "pointer",
    };

    return (
      <button
        style={buttonStyle}
        onClick={() => handleClick(week.ID, index)}
        disabled={isPublished || isUpcoming}
      >
        {isPublished
          ? "Published"
          : isUpcoming
          ? "Upcoming"
          : "Assign attendance points"}
      </button>
    );
  };

  // Fetch weeks data on component mount
  useEffect(() => {
    fetchWeeks();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Attendance Status</h2>
      {isLoading ? (
        <p>Loading attendance data...</p>
      ) : weeks.length === 0 ? (
        <p>No weeks available to display.</p>
      ) : (
        weeks.map((week, index) => (
          <div key={week.ID} style={{ margin: "10px" }}>
            <span>
              Week {index + 1} ({new Date(week.DateActive).toLocaleDateString()})
            </span>
            {renderButton(week, index)} {/* Pass the correct parameters */}
          </div>
        ))
      )}
    </div>
  );
};

export default Attendance;
