import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

interface Photo {
  photo: string;
  caption: string;
}

interface Mentee {
  ID: number;
  name: string;
  email: string;
  points: number;
}

interface Challenge {
  ID: number;
  Description: string;
  StartDate: string;
  EndDate: string;
  PointsValue: number;
}

interface AppContextType {
  person: Mentee | null;
  mentees: Mentee[];
  mentors: string[];
  fetchMentorsForMentee: () => Promise<void>;
  challenges: Challenge[];
  fetchChallenges: () => Promise<void>;
  getCurrentChallenge: () => Challenge | null;
  photos: Photo[];
  addPhoto: (photo: string, caption: string) => void;
  authenticateUser: (email: string, password: string) => Promise<boolean>;
  fetchMentees: () => Promise<void>;
  increasePoints: (menteeId: number, pointsToAdd: number) => Promise<void>;
  isLoggedIn: boolean;
  setLoginStatus: (status: boolean) => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your FastAPI backend URL

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [person, setPerson] = useState<Mentee | null>(null);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [mentors, setMentors] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Add a photo with a caption
  const addPhoto = (photo: string, caption: string) => {
    setPhotos((prevPhotos) => [...prevPhotos, { photo, caption }]);
  };

  // Authenticate a user
  const authenticateUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/authenticate`, {}, {
        auth: { username: email, password },
      });
      setPerson(response.data); // Set the authenticated user as the current person
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  };

  // Fetch mentees from the backend
  const fetchMentees = async () => {
    try {
      const response = await axios.get<Mentee[]>(`${API_BASE_URL}/mentees`);
      setMentees(response.data);
    } catch (error) {
      console.error("Error fetching mentees:", error);
    }
  };

  // Fetch challenges from the backend
  const fetchChallenges = async () => {
    try {
      const response = await axios.get<Challenge[]>(`${API_BASE_URL}/challenges/ordered`);
      setChallenges(response.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  // Get the current challenge based on the date
  const getCurrentChallenge = (): Challenge | null => {
    const today = new Date();
    return (
      challenges.find(
        (challenge) =>
          new Date(challenge.StartDate) <= today && new Date(challenge.EndDate) >= today
      ) || null
    );
  };

  // Increase points for a mentee
  const increasePoints = async (menteeId: number, pointsToAdd: number) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/mentees/${menteeId}/increase_points`, {
        points_to_add: pointsToAdd,
      });
      console.log("Points updated:", response.data);

      // Optionally, refresh the mentees data after updating points
      fetchMentees();
    } catch (error) {
      console.error("Error increasing points:", error);
    }
  };

  // Fetch mentors for the logged-in mentee
  const fetchMentorsForMentee = async () => {
    if (!person) return; // Ensure a logged-in user exists
    try {
      const response = await axios.get<string[]>(`${API_BASE_URL}/mentors/${person.ID}`);
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  // Fetch mentees and challenges on mount
  useEffect(() => {
    fetchMentees();
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (person) {
      fetchMentorsForMentee(); // Fetch mentors whenever the logged-in user changes
    }
  }, [person]);

  return (
    <AppContext.Provider
      value={{
        person,
        mentees,
        mentors,
        challenges,
        photos,
        addPhoto,
        authenticateUser,
        fetchMentees,
        fetchMentorsForMentee,
        fetchChallenges,
        getCurrentChallenge,
        increasePoints,
        isLoggedIn,
        setLoginStatus: setIsLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
