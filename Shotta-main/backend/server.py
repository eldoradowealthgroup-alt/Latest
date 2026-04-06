from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Admin credentials
ADMIN_EMAIL = "admin"
ADMIN_PASSWORD = "Money2026$"

# Define Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    is_admin: bool = False

class UserProfileUpdate(BaseModel):
    name: str
    address: str
    dob: str
    phone: str
    email: EmailStr

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None

class CitationSearch(BaseModel):
    name: str
    citation_number: str
    zip_code: str

class Citation(BaseModel):
    citation_id: str
    offense: str
    date: str
    fine: str
    status: str
    location: str

class CitationResult(BaseModel):
    found: bool
    name: Optional[str] = None
    dob: Optional[str] = None
    citations: Optional[List[Citation]] = None
    message: Optional[str] = None

class SubmissionRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    email: str
    name: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    citation_searched: Optional[str] = None
    zip_code: Optional[str] = None
    action_taken: Optional[str] = None
    created_at: str
    updated_at: str

# Auth routes
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), salt)
    
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "id": user_id,
        "email": user.email,
        "password": hashed.decode('utf-8'),
        "created_at": now
    }
    
    await db.users.insert_one(user_doc)
    
    # Create submission record for admin tracking
    submission = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "email": user.email,
        "created_at": now,
        "updated_at": now
    }
    await db.submissions.insert_one(submission)
    
    return UserResponse(id=user_id, email=user.email, is_admin=False)

@api_router.post("/auth/login", response_model=UserResponse)
async def login(user: UserLogin):
    # Check for admin login
    if user.email == ADMIN_EMAIL and user.password == ADMIN_PASSWORD:
        return UserResponse(id="admin", email="admin", is_admin=True)
    
    # Find user
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check password
    if not bcrypt.checkpw(user.password.encode('utf-8'), existing['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return UserResponse(id=existing['id'], email=existing['email'], is_admin=False)

# Profile routes
@api_router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(**user)

@api_router.put("/profile/{user_id}", response_model=UserProfile)
async def update_profile(user_id: str, profile: UserProfileUpdate):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    now = datetime.now(timezone.utc).isoformat()
    
    await db.users.update_one(
        {"id": user_id},
        {"$set": {
            "name": profile.name,
            "address": profile.address,
            "dob": profile.dob,
            "phone": profile.phone,
            "email": profile.email
        }}
    )
    
    # Update submission record for admin tracking
    await db.submissions.update_one(
        {"user_id": user_id},
        {"$set": {
            "name": profile.name,
            "address": profile.address,
            "dob": profile.dob,
            "phone": profile.phone,
            "email": profile.email,
            "updated_at": now
        }}
    )
    
    updated = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return UserProfile(**updated)

# Citation search - hardcoded for 87911938c
@api_router.post("/citations/search", response_model=CitationResult)
async def search_citations(search: CitationSearch):
    from datetime import datetime
    current_date = datetime.now().strftime("%m/%d/%Y")
    
    # Update submission record with search data
    await db.submissions.update_one(
        {"name": search.name},
        {"$set": {
            "citation_searched": search.citation_number,
            "zip_code": search.zip_code,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    # Only return results for citation number 87911938c
    if search.citation_number.lower() == "87911938c":
        return CitationResult(
            found=True,
            name=search.name,
            dob="",
            citations=[
                Citation(
                    citation_id="18 U.S.C. § 3146",
                    offense="FAILURE TO APPEAR ON SUMMONS",
                    date=current_date,
                    fine="$2,133.75",
                    status="Outstanding",
                    location=""
                ),
                Citation(
                    citation_id="18 U.S.C. § 401",
                    offense="FAILURE TO COMPLY",
                    date=current_date,
                    fine="$2,202.75",
                    status="Outstanding",
                    location=""
                ),
                Citation(
                    citation_id="18 U.S.C. § 1503",
                    offense="CONTEMPT OF COURT",
                    date=current_date,
                    fine="$1,607.00",
                    status="Outstanding",
                    location=""
                ),
                Citation(
                    citation_id="18 U.S.C. § 2599",
                    offense="INTERFERING WITH JUDICIAL PROCEEDINGS",
                    date=current_date,
                    fine="$6,407.00",
                    status="Outstanding",
                    location=""
                )
            ]
        )
    else:
        return CitationResult(
            found=False,
            message="Citations not found"
        )

# Admin routes
@api_router.get("/admin/submissions", response_model=List[SubmissionRecord])
async def get_all_submissions():
    submissions = await db.submissions.find({}, {"_id": 0}).to_list(1000)
    return submissions

@api_router.post("/admin/record-action")
async def record_action(user_id: str, action: str):
    now = datetime.now(timezone.utc).isoformat()
    await db.submissions.update_one(
        {"user_id": user_id},
        {"$set": {
            "action_taken": action,
            "updated_at": now
        }}
    )
    return {"status": "recorded"}

@api_router.get("/")
async def root():
    return {"message": "Citation Lookup API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
