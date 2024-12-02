import sqlite3
from datetime import datetime

# Connect to the SQLite database
con = sqlite3.connect('mentee_chal_data.db')
cur = con.cursor()

weekData = [
    (datetime(2024,9,22), 'unpublished'),
    (datetime(2024,9,29), 'unpublished'),
    (datetime(2024,10,6), 'unpublished'),
    (datetime(2024,10,13), 'unpublished'),
    (datetime(2024,10,20), 'unpublished'),
    (datetime(2024,10,27), 'unpublished'),
    (datetime(2024,11,3), 'unpublished'),
    (datetime(2024,11,10), 'unpublished'),
    (datetime(2024,11,17), 'unpublished'),
    (datetime(2024,12,1), 'unpublished')
]


# Insert updated week data
cur.executemany(
    "INSERT INTO user (Name, Email, Password, Points, Role) VALUES (?,?)",
    weekData
)

# Commit changes and close the connection
con.commit()
con.close()

print("Weeks updated successfully!")