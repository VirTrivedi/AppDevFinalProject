import sqlite3
from datetime import datetime

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

# Updated challenge data
challengesData = [
    ("Take a picture of your team getting boba", "2024-09-22", "2024-09-28", 50),
    ("Take a picture of your team meeting in someone's dorm", "2024-09-29", "2024-10-05", 50),
    ("Take a picture of your team standing in front of a local landmark", "2024-10-06", "2024-10-12", 50),
    ("Take a picture of your team mimicking the same animal", "2024-10-13", "2024-10-19", 50),
    ("Take a picture of your team doing a group jump at the same time in an outdoor area", "2024-10-20", "2024-10-26", 50),
    ("Take a picture of your team wearing their Halloween costumes", "2024-10-27", "2024-11-02", 50),
    ("Take a picture of your team lying on the ground in a fun shape", "2024-11-03", "2024-11-09", 50),
    ("Take a picture of your team having a show and tell", "2024-11-10", "2024-11-16", 50),
    ("Take a picture of your team making a human chain with everyone holding hands", "2024-11-17", "2024-11-23", 50),
    ("Take a picture of your team wearing the same color", "2024-12-01", "2024-12-07", 50)
]

# Convert string dates to proper format and prepare for insertion
formattedChallenges = [
    (
        data[0],  # Description
        datetime.strptime(data[1], "%Y-%m-%d"),  # StartDate
        datetime.strptime(data[2], "%Y-%m-%d"),  # EndDate
        data[3]   # PointsValue
    )
    for data in challengesData
]

# Optional: Clear existing challenges for a clean insert
cur.execute("DELETE FROM challenge")

# Insert updated challenge data
cur.executemany(
    "INSERT INTO challenge (Description, StartDate, EndDate, PointsValue) VALUES (?,?,?,?)",
    formattedChallenges
)

# Commit changes and close the connection
con.commit()
con.close()

print("Challenges updated successfully!")