import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Person {
  name: string;
  score: number;
}

interface AppContextType {
  person: Person;
  teammates: Person[];
  mentors: string[];
  otherParticipants: Person[];
  setPersonScore: (score: number) => void;
}

const defaultPerson: Person = { name: "Vir", score: 86 };
const defaultTeammates: Person[] = [
  { name: "Riya", score: 78 },
  { name: "Sam", score: 92 },
  { name: "James", score: 81 },
  { name: "Madeline", score: 88 },
];
const defaultOtherParticipants: Person[] = [
    { name: "Adam", score: 90 },
    { name: "Ben", score: 82 },
    { name: "Charlie", score: 95 },
    { name: "Danny", score: 88 },
    { name: "Elaine", score: 76 },
  ];
const defaultMentors = ["Samai", "Matt"];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [person, setPerson] = useState<Person>(defaultPerson);
  const [teammates] = useState<Person[]>(defaultTeammates);
  const [mentors] = useState<string[]>(defaultMentors);
  const [otherParticipants] = useState<Person[]>(defaultOtherParticipants);

  const setPersonScore = (score: number) => setPerson((prev) => ({ ...prev, score }));

  return (
    <AppContext.Provider value={{ person, teammates, mentors, otherParticipants, setPersonScore }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
