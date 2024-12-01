import sqlite3

con = sqlite3.connect('mentee_chal_data.db')

cur = con.cursor()
challengesData = [
    (ID, "Description", "Start Date", "End Date"),
    (1, "Take a picture of your team getting boba", "9/22/24", "9/28/24"),
    (2, "Take a picture of your team meeting in someone's dorm", "9/29/24", "10/5/24"),
    (3, "Take a picture of your team standing in front of a local landmark", "10/6/24", "10/12/24"),
    (4, "Take a picture of your team mimicking the same animal", "10/13/24", "10/19/24"),
    (5, "Take a picture of your team doing a group jump at the same time in an outdoor area", "10/20/24", "10/26/24"),
    (6, "Take a picture of your team wearing their Halloween costumes", "10/27/24", "11/2/24"),
    (7, "Take a picture of your team lying on the ground in a fun shape", "11/3/24", "11/9/24"),
    (8, "Take a picture of your team having a show and tell", "11/10/24", "11/16/24"),
    (9, "Take a picture of your team making a human chain with everyone holding hands", "11/17/24", "11/23/24"),
    (10, "Take a picture of your team wearing the same color", "12/1/24", "12/7/24")
]

cur.executemany("INSERT INTO challenge VALUES (?,?,?,?)", challengesData)

con.commit()