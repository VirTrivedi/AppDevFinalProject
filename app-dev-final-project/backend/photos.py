import sqlite3
import os


# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

# Sample photo data: (filename, caption, challenge ID, team ID)
photosData = [
    ("image1.jpg", "A fun team photo with boba", 1, 1),
    ("image2.jpg", "Team meeting at dorm", 2, 2),
    ("image3.jpg", "Team in front of the local landmark", 1, 3),
    ("image4.jpg", "Team mimicking an animal", 2, 4),
    ("image5.jpg", "Team jump shot at outdoor park", 3, 5)
]

# Optional: Clear existing photos for a clean insert
cur.execute("DELETE FROM photo")

# Path to the assets folder where the image files are stored
assets_folder = os.path.join(os.getcwd(), 'assets')  # Absolute path to assets folder

# Check if the assets folder exists
if not os.path.exists(assets_folder):
    raise FileNotFoundError(f"The folder '{assets_folder}' does not exist. Please create it and add the necessary files.")

# Insert sample photo data
for photo in photosData:
    file_path = os.path.join(assets_folder, photo[0])  # Full path to the photo file
    print(f"Checking file: {file_path}")

    # Check if the file exists
    if not os.path.isfile(file_path):
        print(f"Warning: The file '{photo[0]}' does not exist in the '{assets_folder}' folder.")
        continue  # Skip to the next photo if the file does not exist

    # Read the image file as binary data
    with open(file_path, 'rb') as file:
        file_data = file.read()

    # Insert data into the database
    cur.execute(
        "INSERT INTO photo (FileData, Caption, Status, ChallengeID, TeamID) VALUES (?,?,?,?,?)",
        (file_data, photo[1], 'pending', photo[2], photo[3])
    )

# Commit changes and close the connection
con.commit()
con.close()

print("Sample photos inserted successfully!")
