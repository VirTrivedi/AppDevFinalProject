CREATE TABLE user (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    Points INTEGER DEFAULT NULL,
    Role TEXT CHECK(Role IN ('mentee', 'admin')) NOT NULL,
    Mentors TEXT DEFAULT NULL,  -- Use TEXT to store JSON data
    TeamID INTEGER DEFAULT NULL

);

CREATE TABLE challenge (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Description TEXT NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    PointsValue INTEGER NOT NULL
);

CREATE TABLE photo (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    FileData BLOB NOT NULL,
    Caption TEXT NOT NULL,
    Status TEXT CHECK(Status IN ('pending', 'approved', 'denied')) DEFAULT 'pending',
    ChallengeID INTEGER NOT NULL,
    TeamID INTEGER NOT NULL,
    FOREIGN KEY (ChallengeID) REFERENCES challenge(ID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES user(ID) ON DELETE CASCADE  -- Assuming reference is to the 'user' table, not 'mentee'
);

CREATE TABLE week (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Published TEXT CHECK(Published IN ('published', 'unpublished')) NOT NULL,
    DateActive DATETIME NOT NULL
);
