from typing import Annotated, List, Optional
from fastapi import FastAPI, Depends, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, ForeignKey, Enum, Column
from sqlmodel import Session, SQLModel, create_engine, JSON, Field, Relationship, Column
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import joinedload
from enum import Enum as PyEnum
import os
from fastapi.responses import StreamingResponse
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()


SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Enums
class PhotoStatus(PyEnum):
    pending = "pending"
    approved = "approved"
    denied = "denied"

class AttendanceStatus(PyEnum):
    unpublished = "unpublished"
    published = "published"

class RoleEnum(PyEnum):
    mentee = "mentee"
    mentor = "mentor"

# User (Mentee or Mentor) Model
class User(SQLModel, table=True):

    __tablename__ = "user"
    ID: Optional[int] = Field(default=None, primary_key=True)
    Name: str = Field(index=True, nullable=False)
    Email: str = Field(index=True, nullable=False, unique=True)
    Password: str = Field(nullable=False)
    Points: int = Field(default=0)
    Mentors: List[str] = Field(sa_column=Column(JSON))  # Optional JSON for mentor mapping
    Images: List[str] = Field(sa_column=Column(JSON))  # Optional JSON for uploaded images
    Role: RoleEnum = Field(default=RoleEnum.mentee)  # Stored as strings in SQLite
    TeamID: int = Field(default=None)

    # Relationships
    Photos: List["Photo"] = Relationship(back_populates="Users")

# Pydantic models for response validation
class UserOut(BaseModel):
    ID: int
    Name: str
    Email: str
    Points: int
    Mentors: Optional[List[str]] = None
    Images: Optional[List[str]] = None
    Role: RoleEnum

    class Config:
        orm_mode = True  # This tells Pydantic to treat ORM models as dictionaries

# Challenge Model
class Challenge(SQLModel, table=True):
    ID: Optional[int] = Field(default=None, primary_key=True, index=True)
    Description: str = Field(nullable=False)
    StartDate: datetime = Field(nullable=False)
    EndDate: datetime = Field(nullable=False)
    PointsValue: int = Field(nullable=False)

    # Relationships
    Photos: List["Photo"] = Relationship(back_populates="Challenges")

# Photo Model
class Photo(SQLModel, table=True):
    ID: Optional[int] = Field(default=None, primary_key=True)
    FileData: bytes = Field(nullable=False)
    Caption: str = Field(nullable=False, max_length=500)
    Status: PhotoStatus = Field(default=PhotoStatus.pending)  # Stored as strings in SQLite
    ChallengeID: int = Field(foreign_key="challenge.ID", nullable=False)
    TeamID: int = Field(foreign_key="user.ID", nullable=False)

#date/week field could be added -- 

    # Relationships
    Challenges: Optional[Challenge] = Relationship(back_populates="Photos")
    Users: Optional[User] = Relationship(back_populates="Photos")

# Week Model
class Week(SQLModel, table=True):
    __tablename__ = 'week'
    ID: Optional[int] = Field(default=None, primary_key=True)
    Published: AttendanceStatus = Field(nullable=False)  # Stored as strings in SQLite
    DateActive: datetime = Field(nullable=False)

class WeekOut(BaseModel):
    ID: int
    Published: AttendanceStatus  # To represent the status of the week (pending/approved/denied)
    DateActive: datetime  # The date the week is active

    class Config:
        orm_mode = True  # Allow ORM models to be treated as dictionaries





sqlite_database_name = "mentee_chal_data.db" 
sqlite_url = f"sqlite:///{sqlite_database_name}"

# Allowing connections from multiple threads
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args, echo=True)

#creating the session, the session communicates with the database
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


# Initialize FastAPI app
app = FastAPI()

app.add_event_handler("startup", create_db_and_tables)

@app.get("/")
def read_root():
    return {"testing": "testing2"}

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



@app.get("/mentees", response_model=List[UserOut])
def get_all_mentees(session: Session = Depends(get_session)):
    mentees_query = select(User).where(User.Role == RoleEnum.mentee)
    mentees = session.exec(mentees_query).scalars().all()  # Use scalars() to get ORM objects

    if not mentees:
        raise HTTPException(status_code=404, detail="No mentees found")

    # Transform ORM objects into Pydantic models
    mentees_out = [
        UserOut(
            ID=mentee.ID,
            Name=mentee.Name,
            Email=mentee.Email,
            Points=mentee.Points,
            Mentors=mentee.Mentors or [],
            Images=mentee.Images or [],
            Role=mentee.Role,
        )
        for mentee in mentees
    ]
    return mentees_out


@app.get("/mentees/{mentee_id}", response_model=UserOut)
def get_mentee_by_id(mentee_id: int, session: Session = Depends(get_session)):
    # Query the database for the mentee with the specified ID
    mentee = session.get(User, mentee_id)  # Use session.get() to fetch by primary key
    
    if not mentee or mentee.Role != RoleEnum.mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")

    # Return the mentee as a Pydantic model
    mentee_out = UserOut(

        ID=mentee.ID,
        Name=mentee.Name,
        Email=mentee.Email,
        Points=mentee.Points,
        Mentors=mentee.Mentors or [],
        Images=mentee.Images or [],
        Role=mentee.Role,

    )
    return mentee_out


@app.post("/mentees/new", response_model=dict)
def create_mentee(mentee_data: dict, session: Session = Depends(get_session)):
    # Extract data directly from the dict
    name = mentee_data.get("Name")
    email = mentee_data.get("Email")
    password = mentee_data.get("Password")

    if not all([name, email, password]):
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Check if the email already exists
    existing_user = session.exec(select(User).where(User.Email == email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create the new mentee user
    new_user = User(
        Name=name,
        Email=email,
        Password=password,  # Hash the password before storing (e.g., use bcrypt)
        Points=0,  # Default points for a new mentee
        Role=RoleEnum.mentee  # Default role set to 'mentee'
    )
    session.add(new_user)
    try:
        # Commit the transaction and refresh the new user instance
        session.commit()
        session.refresh(new_user)
    except Exception as e:
        # Rollback the transaction in case of an error
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating user: {e}")

    return {
        "message": "User created successfully",
        "user_id": new_user.ID
    }



@app.get("/users/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: int, session: Session = Depends(get_session)):
    # Query the database for the mentee with the specified ID
    mentee = session.get(User, user_id)  # Use session.get() to fetch by primary key
    
    if not mentee:
        raise HTTPException(status_code=404, detail="User not found")

    # Return the mentee as a Pydantic model
    mentee_out = UserOut(
        ID=mentee.ID,
        Name=mentee.Name,
        Email=mentee.Email,
        Points=mentee.Points,
        Mentors=mentee.Mentors or [],
        Images=mentee.Images or [],
        Role=mentee.Role,
        TeamID=mentee.TeamID
    )
    return mentee_out

@app.get("/users/team/{team_id}", response_model=List[UserOut])
def get_users_by_team(team_id: int, session: Session = Depends(get_session)):
    mentees_query = select(User).where(User.Role == RoleEnum.mentee, User.TeamID == team_id)
    mentees = session.exec(mentees_query).scalars().all()  # Use scalars() to retrieve ORM objects

    if not mentees:
        raise HTTPException(status_code=404, detail=f"No mentees found for team {team_id}")

    return [
        UserOut(
            ID=mentee.ID,
            Name=mentee.Name,
            Email=mentee.Email,
            Points=mentee.Points,
            Mentors=mentee.Mentors or [],
            Images=mentee.Images or [],
            Role=mentee.Role,
        )
        for mentee in mentees
    ]

@app.delete("/mentees/{mentee_id}", response_model=dict)
def delete_mentee(mentee_id: int, session: Session = Depends(get_session)):
    # Fetch the mentee by ID
    mentee = session.get(User, mentee_id)

    # Check if the mentee exists and has the correct role
    if not mentee or mentee.Role != RoleEnum.mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")

    try:
        # Delete the mentee and commit the transaction
        session.delete(mentee)
        session.commit()
    except Exception as e:
        # Rollback in case of any error
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error deleting mentee: {e}")

    return {"message": "Mentee deleted successfully"}



@app.get("/weeks", response_model=List[WeekOut])
def get_all_weeks(session: Session = Depends(get_session)):  # Adjust if needed for your dependency
    weeks = session.exec(select(Week)).scalars().all()  # Correct for fetching all weeks

    if not weeks:
        raise HTTPException(status_code=404, detail="No weeks found")
    for week in weeks:
        print(week)

    week_out = [
        WeekOut(
            ID=week.ID,
            Published=week.Published,  # Ensure this is an enum value
            DateActive=week.DateActive,
        )
        for week in weeks
    ]
    
    return week_out


@app.get("/weeks/{week_id}")
def get_week_by_id(week_id: int, session: SessionDep):
    week = session.get(Week, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    week_out = [
        WeekOut(
            ID=week.ID,
            Published=week.Published,  # Ensure this is an enum value
            DateActive=week.DateActive,
        )
    ]
    
    return week_out


@app.post("/weeks") # enter timestamp as query parameter!
def create_week(date_active: datetime, session: SessionDep):
    new_week = Week(DateActive=date_active, Published="unpublished")
    session.add(new_week)
    try:
        session.commit()
        session.refresh(new_week)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error creating week. Duplicate ID or invalid data.")
    return new_week

@app.put("/weeks/{week_id}/publish")
def update_week_status(week_id: int, published_status: AttendanceStatus, session: Session = Depends(get_session)):
    week = session.get(Week, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    
    week.Published = published_status
    session.add(week)
    session.commit()
    session.refresh(week)
    return week

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







############ ENDPOINTS ABOVE THIS CONFIRMED WORK

@app.post("/photos/new")
def create_photo(

    file: Annotated[UploadFile, Form(...)],
    caption: Annotated[str, Form(...)],
    challenge_id: Annotated[int, Form(...)],
    team_id: Annotated[int, Form(...)],
    session: SessionDep

):
    # Validate ChallengeID
    challenge = session.get(Challenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Validate TeamID
    team = session.get(User, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Read the file's binary data
    file_data = file.file.read()

    # Create a new Photo record
    new_photo = Photo(
        FileData=file_data,
        Caption=caption,  # Include caption
        Status=PhotoStatus.pending,  # Default to 'pending'
        ChallengeID=challenge_id,
        TeamID=team_id
    )
    session.add(new_photo)

    try:
        session.commit()
        session.refresh(new_photo)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error saving photo: {e}")

    return {
        "message": "Photo uploaded successfully",
        "photo_id": new_photo.ID,
        "caption": new_photo.Caption
    }

@app.get("/photos/pending")
def get_pending_photos(session: SessionDep):
    photos = session.exec(select(Photo).where(Photo.Status == PhotoStatus.pending)).all()
    if not photos:
        raise HTTPException(status_code=404, detail="No pending photos found")
    return photos

@app.get("/photos/approved")
def get_approved_photos(session: SessionDep):
    photos = session.exec(select(Photo).where(Photo.Status == PhotoStatus.approved)).all()
    if not photos:
        raise HTTPException(status_code=404, detail="No approved photos found")
    return photos

@app.delete("/photos/denied")
def remove_denied_photos(session: SessionDep):
    denied_photos = session.exec(select(Photo).where(Photo.Status == PhotoStatus.denied)).all()
    if not denied_photos:
        raise HTTPException(status_code=404, detail="No denied photos found")
    
    for photo in denied_photos:
        session.delete(photo)
    
    session.commit()
    return {"message": f"{len(denied_photos)} denied photos removed successfully"}

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

@app.put("/photos/{photo_id}/approve")
def approve_photo(photo_id: int, session: SessionDep):
    # Retrieve the photo by ID
    photo = session.get(Photo, photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Check if the photo status is 'pending'
    if photo.Status != PhotoStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending photos can be approved")
    
    # Update the status to 'approved'
    photo.Status = PhotoStatus.approved
    session.add(photo)
    session.commit()
    session.refresh(photo)

    return {"message": f"Photo ID {photo_id} has been approved", "photo": photo}

@app.put("/photos/{photo_id}/deny")
def deny_photo(photo_id: int, session: SessionDep):
    # Retrieve the photo by ID
    photo = session.get(Photo, photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # Check if the photo status is 'pending'
    if photo.Status != PhotoStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending photos can be denied")
    
    # Update the status to 'denied'
    photo.Status = PhotoStatus.denied
    session.add(photo)
    session.commit()
    session.refresh(photo)

    return {"message": f"Photo ID {photo_id} has been denied", "photo": photo}





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
def create_challenge(description: str, start_date: datetime, end_date: datetime, points_value: int, session: SessionDep):
    new_challenge = Challenge(
        Description=description,
        StartDate=start_date,
        EndDate=end_date,
        PointsValue=points_value
    )
    session.add(new_challenge)
    try:
        session.commit()
        session.refresh(new_challenge)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error creating challenge. Duplicate data or invalid inputs.")
    return new_challenge



@app.put("/users/team/{team_id}/increase_points")
def increase_team_points(team_id: int, points_to_add: int, session: SessionDep):
    # Fetch all users with the specified TeamID
    users = session.exec(select(User).where(User.TeamID == team_id)).all()
    if not users:
        raise HTTPException(status_code=404, detail="No users found with the specified TeamID")
    print(users)

    # Update points for each user
    for user in users:
        if user.Points is None:
            user.Points = 0
        user.Points += points_to_add
        session.add(user)

    session.commit()

    return {
        "message": f"Points updated successfully for {len(users)} users in team {team_id}.",
        "updated_users": [{"ID": user.ID, "Name": user.Name, "UpdatedPoints": user.P} for user in users]
    }


@app.put("/users/{user_id}/points", status_code=200)
def increase_user_points(user_id: int, points_to_add: int, session: Session = Depends(get_session)):

    # Fetch the user by ID
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's points
    user.Points += points_to_add
    session.add(user)

    try:
        session.commit()
        session.refresh(user)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail=f"Error updating points: {e}")

    return {"message": "User points updated successfully", "user_id": user.ID, "new_points": user.Points}

















class AuthRequest(BaseModel):
    email: str
    password: str


@app.post("/users/authenticate", response_model=UserOut)
def authenticate_user(auth_request: AuthRequest, session: Session = Depends(get_session)):
    # Extract email and password from the request body
    email = auth_request.email
    password = auth_request.password

    if not all([email, password]):
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Query the database for a user with the given email
    user = session.exec(select(User).where(User.Email == email)).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    


    # Simple password check (no hashing for now)
    if user.Password != password:
        raise HTTPException(status_code=400, detail="Incorrect password")

    # Convert the User model to UserOut to return only the required fields
    return UserOut(
        ID=user.ID,
        Name=user.Name,
        Email=user.Email,
        Points=user.Points,
        Mentors=user.Mentors or [],
        Images=user.Images or [],
        Role=user.Role
    )

@app.get("/mentees/team/{team_id}", response_model=List[UserOut])
def get_mentees_by_team_id(team_id: int, session: Session = Depends(get_session)):
    # Query for mentees with the specified TeamID
    mentees_query = select(User).where(User.Role == RoleEnum.mentee, User.TeamID == team_id)
    mentees = session.exec(mentees_query).scalars().all()

    # Check if no mentees are found
    if not mentees:
        raise HTTPException(status_code=404, detail=f"No mentees found for TeamID {team_id}")

    # Convert ORM objects to Pydantic models for the response
    mentees_out = [
        UserOut(
            ID=mentee.ID,
            Name=mentee.Name,
            Email=mentee.Email,
            Points=mentee.Points,
            Mentors=mentee.Mentors or [],
            Images=mentee.Images or [],
            Role=mentee.Role
        )
        for mentee in mentees
    ]
    return mentees_out
