// import React, { useState } from "react";
// import axios from "axios";

// const UserManagement = () => {
//     const [teamId, setTeamId] = useState("");
//     const [name, setName] = useState("");
//     const [menteeData, setMenteeData] = useState({
//         name: "",
//         teamId: "",
//         // other mentee info you need
//     });

//     // Function to remove a user
//     const handleRemoveUser = async () => {
//         try {
//             await axios.delete(`http://localhost:8000/mentees/${menteeID}`);
//             console.log("User removed successfully");
//             // Optionally, reset the form or show a success message
//         } catch (error) {
//             console.error("Error during user removal", error);
//         }
//     };

//     // Function to add a mentee
//     const handleAddMentee = async () => {
//         try {

//             await axios.post(`http://localhost:8000/mentees/new/${queryParams}`, menteeData);
//             console.log("Mentee added successfully");
//             // Optionally, reset the form or show a success message
//         } catch (error) {
//             console.error("Error during mentee addition", error);
//         }
//     };

//     return (
//         <div>
//             <h1>User Management</h1>
//             <div>
//                 <h2>Remove User</h2>
//                 <input
//                     type="text"
//                     placeholder="Team ID"
//                     value={teamId}
//                     onChange={(e) => setTeamId(e.target.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                 />
//                 <button onClick={handleRemoveUser}>Remove User</button>
//             </div>

//             <div>
//                 <h2>Add Mentee</h2>
//                 <input
//                     type="text"
//                     placeholder="Mentee Name"
//                     value={menteeData.name}
//                     onChange={(e) =>
//                         setMenteeData((prev) => ({
//                             ...prev,
//                             name: e.target.value,
//                         }))
//                     }
//                 />
//                 <input
//                     type="text"
//                     placeholder="Team ID"
//                     value={menteeData.teamId}
//                     onChange={(e) =>
//                         setMenteeData((prev) => ({
//                             ...prev,
//                             teamId: e.target.value,
//                         }))
//                     }
//                 />
//                 <button onClick={handleAddMentee}>Add Mentee</button>
//             </div>
//         </div>
//     );
// };

// export default UserManagement;
import React, { useState } from "react";
import axios from "axios";

const UserManagement = () => {
    // State to hold mentee data (Name and Mentors)
    const [menteeData, setMenteeData] = useState({
        Name: "",
        Mentors: [] as string[],  // Array to hold mentor names
    });

    // State to manage success and error messages
    const [message, setMessage] = useState("");

    // Handle input changes for mentee name (input fields)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMenteeData({ ...menteeData, [name]: value });
    };

    // Handle multi-select changes for mentors (select box)
    const handleMentorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMentors = Array.from(e.target.selectedOptions, option => option.value);
        setMenteeData({ ...menteeData, Mentors: selectedMentors });
    };

    // Handle form submission for assigning mentors
    const handleAssignMentors = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        try {
            const response = await axios.post("http://localhost:8000/mentees/assign_mentors", {
                Name: "Samai", // Assuming menteeName is defined in your state
                Mentors: "eek", // Assuming selectedMentors is an array of mentor names
              },);
            setMessage(response.data.message); // Display success message from the server
        } catch (error: any) {
            if (error.response) {
                // Backend error response
                setMessage(`Error: ${error.response.data.detail || error.message}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div>
            <h1>Assign Mentors to Mentee</h1>
            <form onSubmit={handleAssignMentors}>
                <div>
                    <label>Name of Mentee:</label>
                    <input
                        type="text"
                        name="Name"
                        value={menteeData.Name}
                        onChange={handleInputChange}
                        placeholder="Enter mentee's name"
                        required
                    />
                </div>
                <div>
                    <label>Mentors:</label>
                    <select
                        name="Mentors"
                        value={menteeData.Mentors}
                        onChange={handleMentorsChange}
                        multiple
                        required
                    >
                        <option value="Mentor1">Mentor1</option>
                        <option value="Mentor2">Mentor2</option>
                        <option value="Mentor3">Mentor3</option>
                        <option value="Mentor4">Mentor4</option>
                    </select>
                </div>
                <button type="submit">Assign Mentors</button>
            </form>

            {/* Display messages */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserManagement;
