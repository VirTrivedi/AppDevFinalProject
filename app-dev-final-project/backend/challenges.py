import sqlite3
from datetime import datetime

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

# Updated challenge data
challengesData = [
    ("Take a picture of your team getting boba", datetime(2024,9,22), datetime(2024,9,28), 50),
    ("Take a picture of your team meeting in someone's dorm", datetime(2024,9,29), datetime(2024,10,5), 50),
    ("Take a picture of your team standing in front of a local landmark", datetime(2024,10,6), datetime(2024,10,12), 50),
    ("Take a picture of your team mimicking the same animal", datetime(2024,10,13), datetime(2024,10,19), 50),
    ("Take a picture of your team doing a group jump at the same time in an outdoor area", datetime(2024,10,20), datetime(2024,10,26), 50),
    ("Take a picture of your team wearing their Halloween costumes", datetime(2024,10,27), datetime(2024,11,2), 50),
    ("Take a picture of your team lying on the ground in a fun shape", datetime(2024,11,3), datetime(2024,11,9), 50),
    ("Take a picture of your team having a show and tell", datetime(2024,11,10), datetime(2024,11,16), 50),
    ("Take a picture of your team making a human chain with everyone holding hands", datetime(2024,11,17), datetime(2024,11,23), 50),
    ("Take a picture of your team wearing the same color", datetime(2024,12,1), datetime(2024,12,7), 50)
]


# Optional: Clear existing challenges for a clean insert
cur.execute("DELETE FROM challenge")

# Insert updated challenge data
cur.executemany(
    "INSERT INTO challenge (Description, StartDate, EndDate, PointsValue) VALUES (?,?,?,?)",
    challengesData
)

# Commit changes and close the connection
con.commit()
con.close()

print("Challenges updated successfully!")