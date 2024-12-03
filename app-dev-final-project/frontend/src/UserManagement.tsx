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

const UserManagement: React.FC = () => {
  const [menteeData, setMenteeData] = useState({
    Name: "",
    Mentors: [] as string[],
  });
  const [message, setMessage] = useState("");
  const [menteeToDelete, setMenteeToDelete] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenteeData({ ...menteeData, [name]: value });
  };

  const handleMentorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMentors = Array.from(e.target.selectedOptions, option => option.value);
    setMenteeData({ ...menteeData, Mentors: selectedMentors });
  };

  const handleAssignMentors = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/mentees/assign_mentors", {
        Name: menteeData.Name,
        Mentors: menteeData.Mentors,
      });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDeleteAllMentees = async () => {
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/mentees/delete-all", menteeData);
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDeleteMenteeByName = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.delete(
        `http://localhost:8000/mentees/by-name/${menteeToDelete}`
      );
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🌟 User Management 🌟</h1>
        <div style={styles.formGroup}>
          <h2 style={styles.subtitle}>Assign Mentors to Mentee</h2>
          <form onSubmit={handleAssignMentors} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mentee Name:</label>
              <input
                type="text"
                name="Name"
                value={menteeData.Name}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter mentee's name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mentors:</label>
              <select
                name="Mentors"
                value={menteeData.Mentors}
                onChange={handleMentorsChange}
                multiple
                style={styles.select}
                required
              >
                <option value="Mentor1">Mentor1</option>
                <option value="Mentor2">Mentor2</option>
                <option value="Mentor3">Mentor3</option>
                <option value="Mentor4">Mentor4</option>
              </select>
            </div>
            <button type="submit" style={styles.button}>Assign Mentors</button>
          </form>
        </div>

        <div style={styles.formGroup}>
          <button onClick={handleDeleteAllMentees} style={styles.button}>Remove All Mentees</button>
        </div>

        <h2 style={styles.subtitle}>Delete Mentee by Name</h2>
        <form onSubmit={handleDeleteMenteeByName} style={styles.form}>
          <div style={styles.formGroup}>

            <input
              type="text"
              value={menteeToDelete}
              onChange={(e) => setMenteeToDelete(e.target.value)}
              style={styles.input}
              placeholder="Enter mentee's name"
              required
            />
          </div>
          <button type="submit" style={styles.button}>Delete Mentee</button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default UserManagement;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: '0',
    fontFamily: "'Gill Sans', sans-serif",
    width: '100vw',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    maxHeight: '1000px',
    alignItems: 'center',
    maxWidth: '900px',
    padding: '40px',
    borderRadius: '20px',
    background: 'linear-gradient(to bottom, #ffe29f, #ffa99f)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '30px',
    fontWeight: 'bold',
    color: '#3A1258',
  },
  subtitle: {
    fontSize: '2rem',
    color: '#3A1258',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '30px',
    width: '100%',
  },
  label: {
    fontSize: '1.5rem',
    color: '#3A1258',
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '90%',
    padding: '15px',
    borderRadius: '10px',
    border: '3px solid #FFA99F',
    backgroundColor: '#FFF4E6',
    fontSize: '1.2rem',
    color: '#3A1258',
    outline: 'none',
    transition: '0.3s',
  },
  select: {
    width: '90%',
    padding: '15px',
    borderRadius: '10px',
    border: '3px solid #FFA99F',
    backgroundColor: '#FFF4E6',
    fontSize: '1.2rem',
    color: '#3A1258',
    outline: 'none',
    transition: '0.3s',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FF6F61',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  message: {
    fontSize: '1.2rem',
    color: '#3A1258',
    marginTop: '20px',
  },
};
