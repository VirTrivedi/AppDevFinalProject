import sqlite3
import json

# Function to create and populate the database with user data
def create_and_populate_db():
    # Connect to the SQLite database
    con = sqlite3.connect('mentee_chal_data.db')
    cur = con.cursor()

    # Create the user table if it doesn't already exist
    cur.execute('DROP TABLE IF EXISTS user;')
    cur.execute('''
    CREATE TABLE IF NOT EXISTS user (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT NOT NULL,
        Email TEXT NOT NULL,
        Password TEXT NOT NULL,
        Points INTEGER NOT NULL,
        Role TEXT NOT NULL,
        Mentors TEXT,
        TeamID INTEGER,
        Images TEXT
    )
    ''')

    # User data with images as a JSON array
    userData = [
        ("Samai", "Samai@terpmail.edu", "Samai", 2000, 'mentee', 1, json.dumps(["image1.jpg", "image2.jpg"])),
        ("Vir Tiredi", "Vir@terpmail.edu", "Vir", 103, 'mentee', 1, json.dumps(["image3.jpg", "image4.jpg"])),
        ("Madeline Moldrem", "Madeline@terpmail.edu", "Madeline", 98, 'mentee', 1, json.dumps(["image5.jpg"])),
        ("Sam Tyles", "Sam@terpmail.edu", "Sam", 65, 'mentee', 1, json.dumps(["image6.jpg", "image7.jpg"])),
        ("Riya Lakhani", "Riya@terpmail.edu", "Riya", 55, 'mentee', 1, json.dumps(["image8.jpg"])),
        ("James Miller", "James@terpmail.edu", "James", 63, 'mentee', 2, json.dumps(["image9.jpg"])),
        ("Kimber Gonzalez Lopez", "Kimber@terpmail.edu", "Kimber", -1, 'admin', None, json.dumps([])),
        ("Evelyn Jiang", "Evelyn@terpmail.edu", "Evelyn", -1, 'admin', None, json.dumps([])),
        ("Jack Hughes", "Jack@terpmail.edu", "Jack", 135, 'mentee', 2, json.dumps(["image10.jpg"])),
        ("Justin Bieber", "Justin@terpmail.edu", "Justin", 43, 'mentee', 2, json.dumps(["image11.jpg", "image12.jpg"])),
        ("Chuck Norris", "Chuck@terpmail.edu", "Chuck", 100, 'mentee', 2, json.dumps(["image13.jpg"])),
        ("Matt Gashaw", "Matt@terpmail.edu", "Matt", 843, 'mentee', 2, json.dumps(["image14.jpg", "image15.jpg"])),
        ("Bruce Wayne", "Bruce@terpmail.edu", "Bruce", 21, 'mentee', 3, json.dumps(["image16.jpg"])),
        ("Monkey D. Luffy", "Luffy@terpmail.edu", "Luffy", 84, 'mentee', 3, json.dumps(["image17.jpg"])),
        ("John Cena", "John@terpmail.edu", "Samai", 0, 'mentee', 3, json.dumps(["image18.jpg"])),
        ("Lebron James", "Lebron@terpmail.edu", "Lebron", 100, 'mentee', 3, json.dumps(["image19.jpg"])),
        ("Clark Kent", "Clark@terpmail.edu", "Clark", 134, 'mentee', 3, json.dumps(["image20.jpg"])),
        ("Sabrina Carpenter", "Sabrina@terpmail.edu", "Sabrina", 24, 'mentee', 4, json.dumps(["image21.jpg"])),
        ("Santa Claus", "Santa@terpmail.edu", "Santa", 215, 'mentee', 4, json.dumps(["image22.jpg"])),
        ("Buddy The Elf", "Buddy@terpmail.edu", "Buddy", 3, 'mentee', 4, json.dumps(["image23.jpg"])),
        ("Luke Skywalker", "Luke@terpmail.edu", "Luke", 12, 'mentee', 4, json.dumps(["image24.jpg"])),
        ("Bilbo Baggins", "Bilbo@terpmail.edu", "Bilbo", 34, 'mentee', 4, json.dumps(["image25.jpg"])),
    ]

    # Insert user data into the table with images as JSON arrays
    cur.executemany(
        "INSERT INTO user (Name, Email, Password, Points, Role, TeamID, Images) VALUES (?,?,?,?,?,?,?)",
        userData
    )

    # Commit changes and close the connection
    con.commit()
    con.close()
    print("Database created and populated with user data successfully!")

# Function to retrieve and display user data, including images
def retrieve_user_data():
    # Connect to the SQLite database
    con = sqlite3.connect('mentee_chal_data.db')
    cur = con.cursor()

    # Retrieve user data with images stored as JSON
    cur.execute("SELECT ID, Name, Images FROM user WHERE Role = 'mentee'")
    rows = cur.fetchall()

    # Process the retrieved data
    for row in rows:
        user_id, name, images_json = row
        images_list = json.loads(images_json)  # Deserialize JSON string into a list
        print(f"User: {name}, Images: {images_list}")

    # Close the connection
    con.close()

# Main function to run the script
if __name__ == "__main__":
    # Create and populate the database
    create_and_populate_db()

    # Retrieve and display the data
    retrieve_user_data()
