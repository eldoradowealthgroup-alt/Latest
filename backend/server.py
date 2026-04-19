from fastapi import FastAPI, APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
from dotenv import load_dotenv
import os
import uuid
import bcrypt
import csv
import io

# Load environment variables
load_dotenv()

# Database Configuration
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./citation_lookup.db")

# Handle Railway's postgres:// vs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs special handling
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Admin credentials
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Money2026$")

# SQLAlchemy Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    ssn = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True, nullable=False)
    email = Column(String, nullable=False)
    name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    ssn = Column(String, nullable=True)
    citation_searched = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    action_taken = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    user_email = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: str
    is_admin: bool = False

class UserProfileUpdate(BaseModel):
    name: str
    address: str
    dob: str
    phone: str
    email: EmailStr
    ssn: Optional[str] = None

class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: str
    name: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    ssn: Optional[str] = None

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
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    email: str
    name: Optional[str] = None
    address: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    ssn: Optional[str] = None
    citation_searched: Optional[str] = None
    zip_code: Optional[str] = None
    action_taken: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class AuditLogEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    user_email: str
    action: str
    details: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: datetime

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper functions
def log_audit_event(db: Session, user_id: str, user_email: str, action: str, details: str = None):
    audit_entry = AuditLog(
        user_id=user_id,
        user_email=user_email,
        action=action,
        details=details
    )
    db.add(audit_entry)
    db.commit()

# FastAPI App
app = FastAPI(
    title="Citation Lookup API",
    description="U.S. District Court Citation Lookup System",
    version="1.0.0"
)

# CORS Configuration
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001",
]

# Add any additional origins from environment
if os.environ.get("ADDITIONAL_ORIGINS"):
    ALLOWED_ORIGINS.extend(os.environ.get("ADDITIONAL_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"message": "Citation Lookup API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1" if not DATABASE_URL.startswith("sqlite") else "SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}

# Auth Routes
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), salt)
    
    user_id = str(uuid.uuid4())
    db_user = User(
        id=user_id,
        email=user.email,
        password=hashed.decode('utf-8')
    )
    db.add(db_user)
    
    submission = Submission(
        user_id=user_id,
        email=user.email
    )
    db.add(submission)
    
    db.commit()
    
    log_audit_event(db, user_id, user.email, "USER_REGISTERED")
    
    return UserResponse(id=user_id, email=user.email, is_admin=False)

@api_router.post("/auth/login", response_model=UserResponse)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    if user.email == ADMIN_EMAIL and user.password == ADMIN_PASSWORD:
        log_audit_event(db, "admin", "admin", "ADMIN_LOGIN")
        return UserResponse(id="admin", email="admin", is_admin=True)
    
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password.encode('utf-8')):
        log_audit_event(db, db_user.id, user.email, "LOGIN_FAILED", "invalid_password")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    log_audit_event(db, db_user.id, db_user.email, "USER_LOGIN")
    
    return UserResponse(id=db_user.id, email=db_user.email, is_admin=False)

# Profile Routes
@api_router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/profile/{user_id}", response_model=UserProfile)
async def update_profile(user_id: str, profile: UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.name = profile.name
    user.address = profile.address
    user.dob = profile.dob
    user.phone = profile.phone
    user.email = profile.email
    user.ssn = profile.ssn
    
    submission = db.query(Submission).filter(Submission.user_id == user_id).first()
    if submission:
        submission.name = profile.name
        submission.address = profile.address
        submission.dob = profile.dob
        submission.phone = profile.phone
        submission.email = profile.email
        submission.ssn = profile.ssn
        submission.updated_at = datetime.now(timezone.utc)
    
    db.commit()
    
    log_audit_event(db, user_id, profile.email, "PROFILE_UPDATED")
    
    return user

# Citation Search
@api_router.post("/citations/search", response_model=CitationResult)
async def search_citations(search: CitationSearch, db: Session = Depends(get_db)):
    current_date = datetime.now().strftime("%m/%d/%Y")
    
    submission = db.query(Submission).filter(Submission.name == search.name).first()
    if submission:
        submission.citation_searched = search.citation_number
        submission.zip_code = search.zip_code
        submission.updated_at = datetime.now(timezone.utc)
        db.commit()
    
    valid_citations = ["87911938c", "5998563f", "6339179c"]
    citation_found = search.citation_number.lower() in valid_citations
    
    log_audit_event(db, "unknown", search.name, "CITATION_SEARCH", 
                   f"citation={search.citation_number}, found={citation_found}")
    
    if search.citation_number.lower() == "87911938c":
        return CitationResult(
            found=True, name=search.name, dob="",
            citations=[
                Citation(citation_id="18 U.S.C. § 3146", offense="FAILURE TO APPEAR ON SUMMONS", date=current_date, fine="$2,133.75", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 401", offense="FAILURE TO COMPLY", date=current_date, fine="$2,202.75", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 1503", offense="CONTEMPT OF COURT", date=current_date, fine="$1,607.00", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 2599", offense="INTERFERING WITH JUDICIAL PROCEEDINGS", date=current_date, fine="$6,407.00", status="Outstanding", location="")
            ]
        )
    elif search.citation_number.lower() == "5998563f":
        return CitationResult(
            found=True, name=search.name, dob="",
            citations=[
                Citation(citation_id="18 U.S.C. § 3146", offense="FAILURE TO APPEAR ON SUMMONS", date=current_date, fine="$586.72", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 401", offense="FAILURE TO COMPLY", date=current_date, fine="$1,943.09", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 1503", offense="CONTEMPT OF COURT", date=current_date, fine="$1,413.80", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 2599", offense="INTERFERING WITH JUDICIAL PROCEEDINGS", date=current_date, fine="$5,293.39", status="Outstanding", location="")
            ]
        )
    elif search.citation_number.lower() == "6339179c":
        return CitationResult(
            found=True, name=search.name, dob="",
            citations=[
                Citation(citation_id="18 U.S.C. § 3146", offense="FAILURE TO APPEAR ON SUMMONS", date=current_date, fine="$1,165.42", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 401", offense="FAILURE TO COMPLY", date=current_date, fine="$436.21", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 1503", offense="CONTEMPT OF COURT", date=current_date, fine="$1,121.53", status="Outstanding", location=""),
                Citation(citation_id="18 U.S.C. § 2599", offense="INTERFERING WITH JUDICIAL PROCEEDINGS", date=current_date, fine="$852.84", status="Outstanding", location="")
            ]
        )
    else:
        return CitationResult(found=False, message="Citations not found")

# Admin Routes
@api_router.get("/admin/submissions", response_model=List[SubmissionRecord])
async def get_all_submissions(db: Session = Depends(get_db)):
    submissions = db.query(Submission).all()
    return submissions

@api_router.get("/admin/submissions/export")
async def export_submissions_csv(db: Session = Depends(get_db)):
    submissions = db.query(Submission).all()
    
    output = io.StringIO()
    fieldnames = ['id', 'user_id', 'email', 'name', 'address', 'dob', 'phone', 'ssn',
                  'citation_searched', 'zip_code', 'action_taken', 'created_at', 'updated_at']
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    for sub in submissions:
        writer.writerow({
            'id': sub.id,
            'user_id': sub.user_id,
            'email': sub.email,
            'name': sub.name,
            'address': sub.address,
            'dob': sub.dob,
            'phone': sub.phone,
            'ssn': sub.ssn,
            'citation_searched': sub.citation_searched,
            'zip_code': sub.zip_code,
            'action_taken': sub.action_taken,
            'created_at': sub.created_at.isoformat() if sub.created_at else '',
            'updated_at': sub.updated_at.isoformat() if sub.updated_at else ''
        })
    
    output.seek(0)
    log_audit_event(db, "admin", "admin", "EXPORT_SUBMISSIONS_CSV", f"count={len(submissions)}")
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=submissions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"}
    )

@api_router.get("/admin/audit-logs", response_model=List[AuditLogEntry])
async def get_audit_logs(limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@api_router.post("/admin/record-action")
async def record_action(user_id: str, action: str, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.user_id == user_id).first()
    if submission:
        submission.action_taken = action
        submission.updated_at = datetime.now(timezone.utc)
        db.commit()
        log_audit_event(db, user_id, submission.email or "unknown", "ACTION_RECORDED", f"action={action}")
    
    return {"status": "recorded"}

# Include router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
