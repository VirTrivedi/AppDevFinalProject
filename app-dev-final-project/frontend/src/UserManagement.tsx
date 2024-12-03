import React, { useState } from "react";
import axios from "axios";

const UserManagement = () => {
    const [teamId, setTeamId] = useState("");
    const [name, setName] = useState("");
    const [menteeData, setMenteeData] = useState({
        name: "",
        teamId: "",
        // other mentee info you need
    });

    // Function to remove a user and add a mentee
    const handleRemoveAndAddMentee = async () => {
        try {
            // First, remove the user using the teamId and name
            await axios.delete(`http://localhost:8000/users/${teamId}/${name}`);
            console.log("User removed successfully");

            // Then, add the mentee
            await axios.post("http://localhost:8000/mentees", menteeData);
            console.log("Mentee added successfully");

            // Reset the form or show a success message
        } catch (error) {
            console.error("Error during user removal or mentee addition", error);
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Team ID"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleRemoveAndAddMentee}>Remove User and Add Mentee</button>
            </div>

            <div>
                <h2>Add Mentee Information</h2>
                <input
                    type="text"
                    placeholder="Mentee Name"
                    value={menteeData.name}
                    onChange={(e) =>
                        setMenteeData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                />
                <input
                    type="text"
                    placeholder="Team ID"
                    value={menteeData.teamId}
                    onChange={(e) =>
                        setMenteeData((prev) => ({
                            ...prev,
                            teamId: e.target.value,
                        }))
                    }
                />
                {/* Add other fields as needed */}
            </div>
        </div>
    );
};

export default UserManagement;
