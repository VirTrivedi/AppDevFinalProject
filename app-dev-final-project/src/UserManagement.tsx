import React, { useState } from 'react';
import { useAppContext } from './AppContext';

type Team = typeof useAppContext;

const UserManagement = () => {



  const handleDeleteMentor = (teamID: number, mentorID: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.teamID === teamID
          ? {
              ...team,
              mentors: team.mentors.filter((mentor) => mentor.ID !== mentorID),
            }
          : team
      )
    );
  };

  const handleDeleteMentee = (teamID: number, menteeID: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.teamID === teamID
          ? {
              ...team,
              mentees: team.mentees.filter((mentee) => mentee.ID !== menteeID),
            }
          : team
      )
    );
  };

  return (
    <div>
      <h1>User Management</h1>
      {teams.map((team) => (
        <div key={team.teamID}>
          <h2>{team.teamName}</h2>

          {/* Mentors Section */}
          <h3>Mentors</h3>
          <ul>
            {team.mentors.map((mentor) => (
              <li key={mentor.ID}>
                {mentor.name} - {mentor.email || "No email provided"}{" "}
                <button onClick={() => handleDeleteMentor(team.teamID, mentor.ID)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const mentorName = prompt("Enter mentor's name:");
              if (mentorName) handleAddMentor(team.teamID, mentorName);
            }}
          >
            Add Mentor
          </button>

          {/* Mentees Section */}
          <h3>Mentees</h3>
          <ul>
            {team.mentees.map((mentee) => (
              <li key={mentee.ID}>
                {mentee.name} - {mentee.email || "No email provided"}{" "}
                <button onClick={() => handleDeleteMentee(team.teamID, mentee.ID)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              const menteeName = prompt("Enter mentee's name:");
              if (menteeName) handleAddMentee(team.teamID, menteeName);
            }}
          >
            Add Mentee
          </button>
        </div>
      ))}
    </div>
  );
};
export default UserManagement;
