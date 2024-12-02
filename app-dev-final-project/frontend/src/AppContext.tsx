import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios, { AxiosResponse } from "axios";
import './App.css'

// Types for your data
export interface Photo {
  url: string;  // URL of the photo
  caption: string; // Optional caption for the photo
  status: 'pending' | 'approved' | 'rejected';  // Current status of the photo
  challengeId: number;  // ID of the associated challenge
  teamId: number;  // ID of the associated team
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

interface Week {
  ID: number;
  DateActive: string;
  Published: string; // "unpublished" or "published"
}

// Define AttendanceData type properly
type AttendanceData = boolean;

// Define context type
interface AppContextType {
  person: Mentee | null;
  mentees: Mentee[];
  mentors: string[];
  fetchMentorsForMentee: () => Promise<void>;
  challenges: Challenge[];
  fetchChallenges: () => Promise<void>;
  getCurrentChallenge: () => Challenge | null;
  authenticateUser: (email: string, password: string) => Promise<boolean>;
  fetchMentees: () => Promise<void>;
  increasePoints: (menteeId: number, pointsToAdd: number) => Promise<void>;
  isLoggedIn: boolean;
  setLoginStatus: (status: boolean) => void;
  fetchAttendanceData: (week: number) => Promise<AttendanceData[]>;

  // Week-specific functionality
  weeks: Week[];
  fetchWeeks: () => Promise<void>;
  createWeek: (id: number, dateActive: string) => Promise<void>;
  publishWeek: (id: number) => Promise<void>;
}

const API_BASE_URL = "http://127.0.0.1:8000"; // Update to your API URL

// Context creation
const AppContext = createContext<AppContextType | undefined>(undefined);

// AppProvider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [person, setPerson] = useState<Mentee | null>(null);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [mentors, setMentors] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [weeks, setWeeks] = useState<Week[]>([]);

  // Authenticate user
  const authenticateUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/authenticate`)
      if(!response.ok){
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: Mentee[] = await response.json()
      setMentees(data); // Store authenticated person

      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  };

  // Fetch mentees
  const fetchMentees = async () => {
    try {
      const response = await axios.get<Mentee[]>(`${API_BASE_URL}/mentees`);
      setMentees(response.data);
    } catch (error) {
      console.error("Error fetching mentees:", error);
    }
  };

  // Fetch challenges
  const fetchChallenges = async () => {
    try {
      const response = await axios.get<Challenge[]>(`${API_BASE_URL}/challenges/ordered`);
      setChallenges(response.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  // Get current challenge based on date
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
      fetchMentees(); // Refresh mentees list
    } catch (error) {
      console.error("Error increasing points:", error);
    }
  };

  // Fetch mentors for logged-in mentee
  const fetchMentorsForMentee = async () => {
    if (!person) return;
    try {
      const response = await axios.get<string[]>(`${API_BASE_URL}/mentors/${person.ID}`);
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  // Fetch attendance data
  const fetchAttendanceData = async (week: number): Promise<AttendanceData[]> => {
    try {
      const response: AxiosResponse<{ attendance_data: AttendanceData[] }> = await axios.get(
        `${API_BASE_URL}/api/attendance/${week}`
      );
      return response.data.attendance_data;
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      return []; // Return an empty array on error
    }
  };

  // Fetch weeks
  const fetchWeeks = async () => {
    try {
      const response = await axios.get<Week[]>(`${API_BASE_URL}/weeks`);
      setWeeks(response.data);
    } catch (error) {
      console.error("Error fetching weeks:", error);
    }
  };

  // Create a new week
  const createWeek = async (id: number, dateActive: string) => {
    try {
      const response = await axios.post<Week>(`${API_BASE_URL}/weeks`, {
        id,
        date_active: dateActive,
      });
      setWeeks((prevWeeks) => [...prevWeeks, response.data]); // Add to state
    } catch (error) {
      console.error("Error creating week:", error);
    }
  };

  // Publish a week
  const publishWeek = async (id: number) => {
    try {
      const response = await axios.put<Week>(`${API_BASE_URL}/weeks/${id}/publish`);
      setWeeks((prevWeeks) =>
        prevWeeks.map((week) =>
          week.ID === id ? { ...week, Published: "published" } : week
        )
      ); // Update state
    } catch (error) {
      console.error("Error publishing week:", error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchMentees();
    fetchChallenges();
    fetchWeeks();
  }, []);

  useEffect(() => {
    if (person) fetchMentorsForMentee();
  }, [person]);

  return (
    <AppContext.Provider
      value={{
        person,
        mentees,
        mentors,
        challenges,
        authenticateUser,
        fetchMentees,
        fetchMentorsForMentee,
        fetchChallenges,
        getCurrentChallenge,
        increasePoints,
        isLoggedIn,
        setLoginStatus: setIsLoggedIn,
        fetchAttendanceData,
        weeks,
        fetchWeeks,
        createWeek,
        publishWeek,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for consuming context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
