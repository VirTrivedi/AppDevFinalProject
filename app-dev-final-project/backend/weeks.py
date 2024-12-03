import sqlite3
from datetime import datetime

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

# Recreate the week table to ensure the ID is auto-incrementing
cur.execute('DROP TABLE IF EXISTS week;')
cur.execute('''
CREATE TABLE IF NOT EXISTS week (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Published TEXT CHECK(Published IN ('published', 'unpublished')) NOT NULL,
    DateActive DATETIME NOT NULL
)
''')

# Week data to insert
weekData = [
    ('unpublished', datetime(2024, 9, 22).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 9, 29).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 10, 6).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 10, 13).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 10, 20).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 10, 27).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 11, 3).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 11, 10).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 11, 17).strftime('%Y-%m-%d %H:%M:%S')),
    ('unpublished', datetime(2024, 12, 1).strftime('%Y-%m-%d %H:%M:%S'))
]

# Insert the week data into the week table
cur.executemany(
    "INSERT INTO week (Published, DateActive) VALUES (?, ?)",
    weekData
)

# Commit changes and close the connection
con.commit()
con.close()

print("Weeks updated successfully!")
