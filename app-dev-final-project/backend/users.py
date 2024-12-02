import sqlite3

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

cur.execute('''
CREATE TABLE IF NOT EXISTS user (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    Password TEXT NOT NULL,
    Points INTEGER NOT NULL,
    Role TEXT NOT NULL,
    Mentors TEXT,
    TeamID INTEGER
)
''')

userData = [
    ("Samai", "Samai@terpmail.edu", "Samai", 2000, 'mentee', 1),
    ("Vir Tiredi", "Vir@terpmail.edu", "Vir", 103, 'mentee', 1),
    ("Madeline Moldrem", "Madeline@terpmail.edu", "Madeline", 98, 'mentee', 1),
    ("Sam Tyles", "Sam@terpmail.edu", "Sam", 65, 'mentee', 1),
    ("Riya Lakhani", "Riya@terpmail.edu", "Riya", 55, 'mentee', 1),
    ("James Miller", "James@terpmail.edu", "James", 63, 'mentee', 2),
    ("Kimber Gonzalez Lopez", "Kimber@terpmail.edu", "Kimber", -1, 'admin', None),
    ("Evelyn Jiang", "Evelyn@terpmail.edu", "Evelyn", -1, 'admin', None),
    ("Jack Hughes", "Jack@terpmail.edu", "Jack", 135, 'mentee', 2),
    ("Justin Bieber", "Justin@terpmail.edu", "Justin", 43, 'mentee', 2),
    ("Chuck Norris", "Chuck@terpmail.edu", "Chuck", 100, 'mentee', 2),
    ("Matt Gashaw", "Matt@terpmail.edu", "Matt", 843, 'mentee', 2),
    ("Bruce Wayne", "Bruce@terpmail.edu", "Bruce", 21, 'mentee', 3),
    ("Monkey D. Luffy", "Luffy@terpmail.edu", "Luffy", 84, 'mentee', 3),
    ("John Cena", "John@terpmail.edu", "Samai", 0, 'mentee', 3),
    ("Lebron James", "Lebron@terpmail.edu", "Lebron", 100, 'mentee', 3),
    ("Clark Kent", "Clark@terpmail.edu", "Clark", 134, 'mentee', 3),
    ("Sabrina Carpenter", "Sabrina@terpmail.edu", "Sabrina", 24, 'mentee', 4),
    ("Santa Claus", "Santa@terpmail.edu", "Santa", 215, 'mentee', 4),
    ("Buddy The Elf", "Buddy@terpmail.edu", "Buddy", 3, 'mentee', 4),
    ("Luke Skywalker", "Luke@terpmail.edu", "Luke", 12, 'mentee', 4),
    ("Bilbo Baggins", "Bilbo@terpmail.edu", "Bilbo", 34, 'mentee', 4),
]

# Insert updated user data
cur.executemany(
    "INSERT INTO user (Name, Email, Password, Points, Role, TeamID) VALUES (?,?,?,?,?,?)",
    userData
)

# Commit changes and close the connection
con.commit()
con.close()

print("Users updated successfully!")
