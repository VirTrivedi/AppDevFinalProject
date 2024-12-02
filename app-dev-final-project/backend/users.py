import sqlite3

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

userData = [
    ("Samai Goat", "Samai@terpmail.edu", "Samai", 2000, 'mentee')
    ("Vir Tiredi", "Vir@terpmail.edu", "Vir", 103, 'mentee')
    ("Madeline Moldrem", "Madeline@terpmail.edu", "Madeline", 98, 'mentee')
    ("Sam Tyles", "Sam@terpmail.edu", "Sam", 65, 'mentee')
    ("Riya Lakhani", "Riya@terpmail.edu", "Riya", 55, 'mentee')
    ("James Miller", "James@terpmail.edu", "James", 63, 'mentee')
    ("Kimber Gonzalez Lopez", "Kimber@terpmail.edu", "Kimber", -1, 'admin')
    ("Evelyn Jiang", "Evelyn@terpmail.edu", "Evelyn", -1, 'admin')
    ("Jack Hughes", "Jack@terpmail.edu", "Jack", 135, 'mentee')
    ("Justin Bieber", "Justin@terpmail.edu", "Justin", 43, 'mentee')
    ("Chuck Norris", "Chuck@terpmail.edu", "Chuck", 100, 'mentee')
    ("Matt Gashaw", "Matt@terpmail.edu", "Matt", 843, 'mentee')
    ("Bruce Wayne", "Bruce@terpmail.edu", "Bruce", 21, 'mentee')
    ("Monkey D. Luffy", "Luffy@terpmail.edu", "Luffy", 84, 'mentee')
    ("John Cena", "John@terpmail.edu", "Samai", 0, 'mentee')
    ("Lebron James", "Lebron@terpmail.edu", "Lebron", 100, 'mentee')
    ("Clark Kent", "Clark@terpmail.edu", "Clark", 134, 'mentee')
    ("Sabrina Carpenter", "Sabrina@terpmail.edu", "Sabrina", 24, 'mentee')
    ("Santa Claus", "Santa@terpmail.edu", "Santa", 215, 'mentee')
    ("Buddy The Elf", "Buddy@terpmail.edu", "Buddy", 3, 'mentee')
    ("Luke Skywalker", "Luke@terpmail.edu", "Luke", 12, 'mentee')
    ("Bilbo Baggins", "Bilbo@terpmail.edu", "Bilbo", 34, 'mentee')
]


# Insert updated user data
cur.executemany(
    "INSERT INTO user (Name, Email, Password, Points, Role) VALUES (?,?,?,?,?)",
    userData
)

# Commit changes and close the connection
con.commit()
con.close()

print("Users updated successfully!")