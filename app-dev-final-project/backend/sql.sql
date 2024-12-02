
CREATE TABLE mentee (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    Points INTEGER DEFAULT 0,
    Images JSON DEFAULT '[]',
    Role TEXT NOT NULL CHECK(Role IN ('mentee', 'admin'))
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
    URL TEXT NOT NULL,
    Status TEXT CHECK(Status IN ('pending', 'approved', 'denied')) DEFAULT 'pending',
    ChallengeID INTEGER NOT NULL,
    TeamID INTEGER NOT NULL,
    FOREIGN KEY (ChallengeID) REFERENCES challenge(ID) ON DELETE CASCADE,
    FOREIGN KEY (TeamID) REFERENCES mentee(ID) ON DELETE CASCADE
);

CREATE TABLE week (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    StartDate DATETIME NOT NULL,
    PublishedAttendence ENUM('published', 'unpublished') NOT NULL
);
