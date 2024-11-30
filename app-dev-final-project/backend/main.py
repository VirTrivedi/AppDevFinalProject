from typing import Annotated, List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlmodel import Session, SQLModel, create_engine, JSON, Field
from fastapi.security import HTTPBasic, HTTPBasicCredentials
#committed

# Mentee table model
class Mentee(SQLModel, table=True):
    ID: Optional[int] = Field(default=None, primary_key=True)  
    Name: str = Field(index=True, nullable=False)  
    Email: str = Field(index=True, nullable=False, unique=True)  
    Password: str = Field(nullable=False)  
    Points: int = Field(default=0)  
    Mentors: List[str] = Field(default_factory=list)  
    Images: List[str] = Field(default_factory=list) 

# Challenge table model
class Challenge(SQLModel, table=True):
    ID: Optional[int] = Field(default=None, primary_key=True, index=True)  
    ChallengeName: str = Field(index=True, nullable=False)  
    PointsValue: int = Field(nullable=False)  
    ChallengeNumber: int = Field(nullable=False, unique=True) 


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
@app.get("/mentees")
async def get_mentees(session: SessionDep):
    return session.exec(select(Mentee)).all()


# Example route: Create a new mentee
@app.post("/mentees/new")
def create_mentee(name: str, email: str, password: str, session: SessionDep):
    new_mentee = Mentee(Name=name, Email=email, Password=password)
    session.add(new_mentee)
    try:
        session.commit()
        session.refresh(new_mentee)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error creating mentee. Email may already exist.")
    return new_mentee

# Example route: Get all challenges
@app.get("/challenges")
def get_challenges(session: SessionDep):
    return session.exec(select(Challenge)).all()


# Example route: Create a new challenge
@app.post("/challenges/new")
def create_challenge(challenge_name: str, points_value: int, challenge_number: int, session: SessionDep):
    new_challenge = Challenge(ChallengeName=challenge_name, PointsValue=points_value, ChallengeNumber=challenge_number)
    session.add(new_challenge)
    try:
        session.commit()
        session.refresh(new_challenge)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail="Error creating challenge. Challenge number may already exist.")
    return new_challenge

@app.delete("/mentees/{mentee_id}")
def delete_mentee(mentee: Mentee, session: SessionDep):
    mentee = session.get(Mentee)
    if not mentee:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(mentee)
    session.commit()
    return {"ok": True}

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
    
    return mentee
