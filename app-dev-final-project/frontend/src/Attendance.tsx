import React, { useState, useEffect } from "react";
const Attendance = () => {
  const { fetchAttendanceData, weeks, publishWeek, fetchWeeks } = useAppContext();
  const [attendanceData, setAttendanceData] = useState<boolean[]>([]);
  const currentTime = Math.floor(Date.now() / 1000);

  useEffect(() => {
    const loadAttendanceData = async () => {
      if (weeks.length > 0) {
        // Fetch attendance data for all weeks
        const attendancePromises = weeks.map((week) =>
          fetchAttendanceData(week.ID)
        );
        const results = await Promise.all(attendancePromises);
        setAttendanceData(results.map((attendance) => attendance.includes(true)));
      }
    };

    loadAttendanceData();
  }, [weeks, fetchAttendanceData]);

  const handleClick = async (weekId: number, index: number) => {
    if (!attendanceData[index]) {
      try {
        await publishWeek(weekId);
        setAttendanceData((prevData) => {
          const newData = [...prevData];
          newData[index] = true; // Mark as published
          return newData;
        });
        await fetchWeeks(); // Refresh week data
      } catch (error) {
        console.error("Error publishing attendance:", error);
      }
    }
  };

  const renderButton = (isPublished: boolean, week: { ID: number; DateActive: string }, index: number) => {
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
        {isPublished ? "Published" : isUpcoming ? "Upcoming" : "Assign attendance points"}
      </button>
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Attendance Status</h2>
      {weeks.map((week, index) => (
        <div key={week.ID} style={{ margin: "10px" }}>
          <span>Week {index + 1} ({week.DateActive})</span>
          {renderButton(attendanceData[index], week, index)}
        </div>
      ))}
    </div>
  );
};

export default Attendance;
