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
    // State to hold mentee data
    const [menteeData, setMenteeData] = useState({
        Name: "", // Match backend key
        Email: "",
        Password: "",
    });

    // State to manage success and error messages
    const [message, setMessage] = useState("");

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMenteeData({ ...menteeData, [name]: value }); // Update state dynamically based on name attribute
    };

    // Handle form submission
    const handleAddMentee = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        try {
            const response = await axios.post("http://localhost:8000/mentees/new", menteeData);
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
            <h1>User Management</h1>
            <form onSubmit={handleAddMentee}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="Name" // Match backend key
                        value={menteeData.Name} // Ensure this matches the state key
                        onChange={handleInputChange}
                        placeholder="Enter mentee's name"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="Email" // Match backend key
                        value={menteeData.Email}
                        onChange={handleInputChange}
                        placeholder="Enter mentee's email"
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="Password" // Match backend key
                        value={menteeData.Password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button type="submit">Add Mentee</button>
            </form>

            {/* Display messages */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserManagement;
