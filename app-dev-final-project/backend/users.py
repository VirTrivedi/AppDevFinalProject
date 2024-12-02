import sqlite3

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

userData = [
    ("Samai", "Samai@terpmail.edu", "Samai", 2000, 'mentee',['Jack Sparrow', 'Dwayne "The Rock" Johnson'], 1),
    ("Vir Tiredi", "Vir@terpmail.edu", "Vir", 103, 'mentee', ['Jack Sparrow', 'Dwayne "The Rock" Johnson'], 1),
    ("Madeline Moldrem", "Madeline@terpmail.edu", "Madeline", 98, 'mentee',['Jack Sparrow', 'Dwayne "The Rock" Johnson'], 1 ),
    ("Sam Tyles", "Sam@terpmail.edu", "Sam", 65, 'mentee',['Jack Sparrow', 'Dwayne "The Rock" Johnson'], 1),
    ("Riya Lakhani", "Riya@terpmail.edu", "Riya", 55, 'mentee',['Jack Sparrow', 'Dwayne "The Rock" Johnson'], 1),
    ("James Miller", "James@terpmail.edu", "James", 63, 'mentee',['Homer Simpsoon', 'Peter Griffin'], 2),
    ("Kimber Gonzalez Lopez", "Kimber@terpmail.edu", "Kimber", -1, 'admin'),
    ("Evelyn Jiang", "Evelyn@terpmail.edu", "Evelyn", -1, 'admin'),
    ("Jack Hughes", "Jack@terpmail.edu", "Jack", 135, 'mentee',['Homer Simpsoon', 'Peter Griffin'], 2),
    ("Justin Bieber", "Justin@terpmail.edu", "Justin", 43, 'mentee',['Homer Simpsoon', 'Peter Griffin'], 2),
    ("Chuck Norris", "Chuck@terpmail.edu", "Chuck", 100, 'mentee',['Homer Simpsoon', 'Peter Griffin'], 2),
    ("Matt Gashaw", "Matt@terpmail.edu", "Matt", 843, 'mentee',['Homer Simpsoon', 'Peter Griffin'], 2),
    ("Bruce Wayne", "Bruce@terpmail.edu", "Bruce", 21, 'mentee',['Olivia Rodrigo', 'Taylor Swift'], 3),
    ("Monkey D. Luffy", "Luffy@terpmail.edu", "Luffy", 84, 'mentee',['Olivia Rodrigo', 'Taylor Swift'], 3),
    ("John Cena", "John@terpmail.edu", "Samai", 0, 'mentee',['Olivia Rodrigo', 'Taylor Swift'], 3),
    ("Lebron James", "Lebron@terpmail.edu", "Lebron", 100, 'mentee',['Olivia Rodrigo', 'Taylor Swift'], 3),
    ("Clark Kent", "Clark@terpmail.edu", "Clark", 134, 'mentee',['Olivia Rodrigo', 'Taylor Swift'], 3),
    ("Sabrina Carpenter", "Sabrina@terpmail.edu", "Sabrina", 24, 'mentee',['Barry Allen', 'Yoda'], 4),
    ("Santa Claus", "Santa@terpmail.edu", "Santa", 215, 'mentee',['Barry Allen', 'Yoda'], 4),
    ("Buddy The Elf", "Buddy@terpmail.edu", "Buddy", 3, 'mentee',['Barry Allen', 'Yoda'], 4),
    ("Luke Skywalker", "Luke@terpmail.edu", "Luke", 12, 'mentee',['Barry Allen', 'Yoda'], 4),
    ("Bilbo Baggins", "Bilbo@terpmail.edu", "Bilbo", 34, 'mentee',['Barry Allen', 'Yoda'], 4),
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