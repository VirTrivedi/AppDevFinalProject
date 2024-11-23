import React, { useState } from 'react';


type MentorMentee = {
  ID: number;
  name: string;
  email: string | null; 
};

type Team = {
  teamID: number;
  teamName: string;
  mentors: MentorMentee[];
  mentees: MentorMentee[];
};

const initialTeams: Team[] = [
  {
    teamID: 1,
    teamName: "Blue Team",
    mentors: [
      { ID: 1, name: "Mentor A1", email: "mentorA1@example.com" },
      { ID: 2, name: "Mentor A2", email: "mentorA2@example.com" }
    ],
    mentees: [
      { ID: 1, name: "Mentee A1", email: "menteeA1@example.com" },
      { ID: 2, name: "Mentee A2", email: "menteeA2@example.com" }
    ]
  },
  {
    teamID: 2,
    teamName: "Samai's Legacy",
    mentors: [
      { ID: 1, name: "Mentor B1", email: "mentorB1@example.com" }
    ],
    mentees: [
      { ID: 1, name: "Mentee B1", email: "menteeB1@example.com" }
    ]
  }
];

const UserManagement = () => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  const handleDeleteMentor = (teamID: number, mentorID: number) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.teamID === teamID
          ? {
              ...team,
              mentors: team.mentors.filter(mentor => mentor.ID !== mentorID)
            }
          : team
      )
    );
  };


  const handleDeleteMentee = (teamID: number, menteeID: number) => {
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.teamID === teamID
          ? {
              ...team,
              mentees: team.mentees.filter(mentee => mentee.ID !== menteeID)
            }
          : team
      )
    );
  };


  const handleAddMentor = (teamID: number, mentorName: string) => {
    const newMentor = {
      ID: Math.random(), 
      name: mentorName,
      email: prompt("Enter mentor's email:") || null 
    };
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.teamID === teamID
          ? { ...team, mentors: [...team.mentors, newMentor] }
          : team
      )
    );
  };


  const handleAddMentee = (teamID: number, menteeName: string) => {
    const newMentee = {
      ID: Math.random(), 
      name: menteeName,
      email: prompt("Enter mentee's email:") || null 
    };
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.teamID === teamID
          ? { ...team, mentees: [...team.mentees, newMentee] }
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
