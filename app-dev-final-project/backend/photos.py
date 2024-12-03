import sqlite3
from datetime import datetime

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

# Sample photo data
photosData = [
    ("sample_image_1.jpg", "A fun team photo with boba", 1, 1),
    ("sample_image_2.jpg", "Team meeting at dorm", 2, 2),
    ("sample_image_3.jpg", "Team in front of the local landmark", 3, 1),
    ("sample_image_4.jpg", "Team mimicking an animal", 4, 2),
    ("sample_image_5.jpg", "Team jump shot at outdoor park", 5, 3),
    ("sample_image_6.jpg", "Team in Halloween costumes", 6, 1),
    ("sample_image_7.jpg", "Team lying in a fun shape", 7, 2),
    ("sample_image_8.jpg", "Team show and tell", 8, 3),
    ("sample_image_9.jpg", "Team human chain with hands held", 9, 1),
    ("sample_image_10.jpg", "Team wearing the same color", 10, 2),
]

# Optional: Clear existing photos for a clean insert
cur.execute("DELETE FROM photo")

# Insert sample photo data
for photo in photosData:
    # Assuming `FileData` is the image's binary data, we need to set this as a placeholder
    # In practice, read the file as binary data if you have actual files.
    with open(f'static/{photo[0]}', 'rb') as file:
        file_data = file.read()
        cur.execute(
            "INSERT INTO photo (FileData, Caption, Status, ChallengeID, TeamID) VALUES (?,?,?,?,?)",
            (file_data, photo[1], 'pending', photo[2], photo[3])
        )

# Commit changes and close the connection
con.commit()
con.close()

print("Sample photos inserted successfully!")
