
CREATE TABLE user (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Points INT DEFAULT 0,
    Images JSON DEFAULT '[]', 
    Role ENUM('mentee', 'admin') NOT NULL
);

CREATE TABLE challenge(
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ChallengeName VARCHAR(255) NOT NULL,
    PointsValue INT NOT NULL,
    ChallengeNumber INT NOT NULL,
    UNIQUE (ChallengeNumber)
);

