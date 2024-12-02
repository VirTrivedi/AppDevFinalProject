
CREATE TABLE user (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Points INT DEFAULT 0,
    Images JSON DEFAULT '[]', 
    Role ENUM('mentee', 'admin') NOT NULL
);

CREATE TABLE challenge (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Description TEXT NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    PointsValue INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS photo (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    FileData BLOB NOT NULL,
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
);