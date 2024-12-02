from typing import Annotated, List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, ForeignKey, Enum as SQLEnum
from sqlmodel import Session, SQLModel, create_engine, JSON, Field, Relationship, Column
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import joinedload
from enum import Enum
import os
from fastapi.responses import StreamingResponse
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Enum for photo status
class PhotoStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    denied = "denied"

class AttendanceStatus(str, Enum):
    unpublished = "unpublished"
    published = "published"

# Mentee table model
class Mentee(SQLModel, table=True):
    ID: Optional[int] = Field(default=None, primary_key=True)  
    Name: str = Field(index=True, nullable=False)  
    Email: str = Field(index=True, nullable=False, unique=True)  
    Password: str = Field(nullable=False)  
    Points: int = Field(default=0)  
    Mentors: List[str] = Field(sa_column=Column(JSON))
    Images: List[str] = Field(sa_column=Column(JSON))


# Challenge table model
class Challenge(SQLModel, table=True):
    ID: Optional[int] = Field(default=None, primary_key=True, index=True)  
    Description: str = Field(nullable=False)  
    StartDate: datetime = Field(nullable=False)  
    EndDate: datetime = Field(nullable=False)
    PointsValue: int = Field(nullable=False)

# Photo table model
class Photo(SQLModel, table=True):
    ID: Optional[int] = Field(default=None, primary_key=True)
    FileData: bytes = Field(nullable=False)
    Status: PhotoStatus = Field(sa_column=SQLEnum(PhotoStatus), default=PhotoStatus.pending)
    ChallengeID: int = Field(ForeignKey("challenge.ID"), nullable=False)
    TeamID: int = Field(ForeignKey("mentee.ID"), nullable=False)

    # Relationships
    # Challenge: Relationship = Relationship()
    # Team: Relationship = Relationship()

class Week(SQLModel, table=True):
    Published: AttendanceStatus = Field(nullable=False, primary_key=True)
    ID: int = Field(nullable=False)
    DateActive: datetime = Field(nullable=False)

sqlite_database_name = "mentee_chal_data.db" 
sqlite_url = f"sqlite:///{sqlite_database_name}"

# Allowing connections from multiple threads
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args, echo=True)
SQLModel.metadata.create_all(engine)



def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def on_startup():
    create_db_and_tables()

# Example route: Get all mentees
@app.get("/mentees") # successfully blank
async def get_mentees(session: SessionDep):
    return session.exec(select(Mentee)).all()

@app.post("/photos/new")
def create_photo(
    file: Annotated[UploadFile, Form(...)],
    caption: Annotated[str, Form(...)],
    challenge_id: Annotated[int, Form(...)],
    team_id: Annotated[int, Form(...)],
    session: SessionDep,
):
    # Validate challenge existence
    challenge = session.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Validate team existence
    team = session.get(Mentee, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Read the file's binary data
    file_data = file.file.read()

    # Create a new photo record
    new_photo = Photo(
        FileData=file_data,
        Status=PhotoStatus.pending,
        ChallengeID=challenge_id,
        TeamID=team_id,
    )
    session.add(new_photo)

    try:
        session.commit()
        session.refresh(new_photo)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error saving photo: {e}")

    return {"message": "Photo uploaded successfully", "photo_id": new_photo.ID}

@app.get("/photos")
def get_photos_with_relationships(session: SessionDep):
    photos = session.exec(
        select(Photo).options(
            joinedload(Photo.Challenge),
            joinedload(Photo.Team)
        )
    ).all()
    return photos

@app.get("/photos/{photo_id}")
def get_photo(photo_id: int, session: SessionDep):
    photo = session.get(Photo, photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Return photo metadata and binary data
    return {
        "ID": photo.ID,
        "Status": photo.Status,
        "ChallengeID": photo.ChallengeID,
        "TeamID": photo.TeamID,
        "FileData": photo.FileData,  # Return binary data as base64 if needed
    }

@app.get("/photos/{photo_id}/download")
def download_photo(photo_id: int, session: SessionDep):
    photo = session.get(Photo, photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    # Stream the binary data as a file
    return StreamingResponse(
        io.BytesIO(photo.FileData),
        media_type="image/jpeg",  # Or "image/png" based on file type
        headers={"Content-Disposition": f"attachment; filename=photo_{photo_id}.jpg"},
    )

class MenteeCreate(BaseModel):
    name: str
    email: str
    password: str

@app.post("/mentees/new")
def create_mentee(mentee: Mentee, session: SessionDep): # works ehhhh
    new_mentee = Mentee(
        Name=mentee.Name,  # Changed from 'name' to 'Name'
        Email=mentee.Email,  # Changed from 'email' to 'Email'
        Password=mentee.Password,  # Changed from 'password' to 'Password'
        Mentors=mentee.Mentors or [],  # If mentors is not provided, default to an empty list
        Images=mentee.Images or [],  # Same for images
    )
    session.add(new_mentee)
    try:
        session.commit()
        session.refresh(new_mentee)  # Refresh to get the latest data from the DB
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error creating mentee. Email may already exist.")
    
    return new_mentee  


# Example route: Get all challenges
@app.get("/challenges")
def get_challenges(session: SessionDep):
    return session.exec(select(Challenge)).all()

@app.get("/challenges/ordered")
def get_challenges_ordered(session: SessionDep):
    challenges = session.exec(select(Challenge).order_by(Challenge.ID)).all()
    return challenges

# Example route: Create a new challenge
@app.post("/challenges/new")
def create_challenge(description: str, points_value: int, start_date: datetime, end_date: datetime, session: SessionDep):
    new_challenge = Challenge(
        Description=description,
        PointsValue=points_value,
        StartDate=start_date,
        EndDate=end_date
    )
    session.add(new_challenge)
    try:
        session.commit()
        session.refresh(new_challenge)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error creating challenge. Duplicate data or invalid inputs.")
    return new_challenge

@app.delete("/mentees/{mentee_id}")
def delete_mentee(mentee_id: int, session: SessionDep):
    mentee = session.get(Mentee, mentee_id)
    if not mentee:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(mentee)
    session.commit()
    return {"ok": True}

@app.get("/mentors/{mentee_id}")
def get_mentors_by_mentee(mentee_id: int, session: SessionDep):
    mentee = session.get(Mentee, mentee_id)
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")
    
    # Assuming mentors are stored as a JSON array of names in the Mentors field
    return mentee.Mentors

# Get a specific mentee (user) by ID
@app.get("/users/{user_id}")
def get_user_by_id(user_id: int, session: SessionDep):
    user = session.get(Mentee, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
    
# Dependency for HTTP Basic Authentication
security = HTTPBasic()

@app.post("/users/authenticate")
def authenticate_user(credentials: HTTPBasicCredentials, session: SessionDep):
    # Extract the username and password from the credentials
    username = credentials.username
    password = credentials.password

    # Query the database for a user with the given username (email)
    user = session.exec(select(Mentee).where(Mentee.Email == username)).first()

    # Check if the user exists and the password matches
    if not user or user.Password != password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return user

@app.put("/mentees/{mentee_id}/increase_points")
def increase_points_by_mentee(mentee_id: int, points_to_add: int, session: SessionDep):
 
   mentee = session.get(Mentee, mentee_id)
   if not mentee:
       raise HTTPException(status_code=404, detail="Mentee not found")
  
   mentee.Points += points_to_add
  
   session.add(mentee)
   session.commit()
   session.refresh(mentee)
  
   return {"id": mentee.ID, "name": mentee.Name, "updated_points": mentee.Points}


@app.put("/mentors/{mentor_name}/increase_points")
def increase_points_by_group(mentor_name: str, points_to_add: int, session: SessionDep):
    
    # Retrieve all mentees who have the specified mentor
    mentees = list(session.exec(select(Mentee).where(Mentee.Mentors.contains(mentor_name))))

    if not mentees:
        raise HTTPException(status_code=404, detail="No mentees found with the specified mentor")

    # Update the points for each mentee
    for mentee in mentees:
        mentee.Points += points_to_add
        session.add(mentee)

    # Commit the changes
    session.commit()
    
    return {"updated_mentees": [{"id": m.ID, "name": m.Name, "updated_points": m.Points} for m in mentees]}


# below: google sheet stuff
async def get_google_sheet_data(week_num: int):
    if not SERVICE_ACCOUNT_FILE:
        raise HTTPException(status_code=500, detail="GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
    
    spreadsheet_id = '1XMVHhCLZ0Ipx18_ZnRXDB05DdRUr2KPMXwo6nJXxXY4'  
    start_column = chr(ord('A') + week_num)  # column letter
    end_column = start_column
    start_row = 2  # Starting from row 2 
    end_row = 10  # number of users
    
    range_name =  f'Sheet1!{start_column}{start_row}:{end_column}{end_row}'
   
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    service = build('sheets', 'v4', credentials=credentials)
    sheet = service.spreadsheets()
    
    result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
    values = result.get('values', [])
    return values

@app.get("/api/attendance/{week}")
async def get_attendance_data(week: int):
    data = await get_google_sheet_data(week)
    if not data:
        raise HTTPException(status_code=404, detail=f"No attendance data found for week {week}.")
    return {"week": week, "attendance_data": data}


@app.get("/weeks")
def get_all_weeks(session: SessionDep):
    weeks = session.exec(select(Week)).all()
    return weeks

@app.get("/weeks/{week_id}")
def get_week_by_id(week_id: int, session: SessionDep):
    week = session.query(Week).filter(Week.ID == week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    return week

@app.post("/weeks")
def create_week(id: int, date_active: datetime, session: SessionDep):
    new_week = Week(ID=id, DateActive=date_active, Published="unpublished")
    session.add(new_week)
    try:
        session.commit()
        session.refresh(new_week)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error creating week. Duplicate ID or invalid data.")
    return new_week

@app.put("/weeks/{week_id}/publish")
def update_week_status(week_id: int, published_status: AttendanceStatus, session: SessionDep):
    week = session.get(Week, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    
    week.Published = published_status
    session.add(week)
    session.commit()
    session.refresh(week)
    return week
