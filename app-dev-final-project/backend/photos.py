import sqlite3
from datetime import datetime
import os
print("Current working directory:", os.getcwd())
# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

# Sample photo data with file names that match the actual files in the 'assets' folder
photosData = [
    ("sample_image_1.jpg", "A fun team photo with boba", 1),
    ("sample_image_2.jpg", "Team meeting at dorm", 2),
    ("sample_image_3.jpg", "Team in front of the local landmark", 1),
    ("sample_image_4.jpg", "Team mimicking an animal", 2),
    ("sample_image_5.jpg", "Team jump shot at outdoor park", 3)

]

# Optional: Clear existing photos for a clean insert
cur.execute("DELETE FROM photo")

# Path to the assets folder where the image files are stored
assets_folder = 'assets'



# Check if the assets folder exists
if not os.path.exists(assets_folder):
    raise FileNotFoundError(f"The folder '{assets_folder}' does not exist. Please create it and add the necessary files.")

# Insert sample photo data
for photo in photosData:

    file_path = os.path.join(assets_folder, photo[0])
    print(file_path)
    if not os.path.isfile(file_path):
        print(f"Warning: The file '{photo[0]}' does not exist in the '{assets_folder}' folder.")
        continue  # Skip to the next photo if the file does not exist

    with open(file_path, 'rb') as file:
        file_data = file.read()
        cur.execute(
            "INSERT INTO photo (FileData, Caption, Status, ChallengeID, TeamID) VALUES (?,?,?,?,?)",
            (file_data, photo[1], 'pending', photo[2], photo[3])
        )

# Commit changes and close the connection
con.commit()
con.close()

print("Sample photos inserted successfully!")
