from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime
import hashlib
from app.database import get_db
from app.models.user import User

router = APIRouter()

# Session storage (in-memory for demo)
SESSIONS = {}

# Schemas
class SignupRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    username: str
    password: str
    remember_me: bool = False

class LoginResponse(BaseModel):
    token: str
    user: dict
    message: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool

# Helper functions
def hash_password(password: str) -> str:
    """Simple password hashing (for demo; use bcrypt in production)"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

def init_test_users(db: Session):
    """Initialize test users if they don't exist"""
    test_users = [
        {
            "username": "admin",
            "email": "admin@drivenow.com",
            "full_name": "Admin User",
            "password": hash_password("admin123"),
            "role": "admin"
        },
        {
            "username": "user1",
            "email": "user1@example.com",
            "full_name": "John Doe",
            "password": hash_password("password123"),
            "role": "customer"
        },
        {
            "username": "user2",
            "email": "user2@example.com",
            "full_name": "Jane Smith",
            "password": hash_password("password456"),
            "role": "customer"
        }
    ]
    
    for user_data in test_users:
        existing = db.query(User).filter(User.username == user_data["username"]).first()
        if not existing:
            user = User(**user_data)
            db.add(user)
    
    db.commit()

@router.post("/signup", response_model=dict)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """
    User registration endpoint
    """
    # Validation
    if len(request.username) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be at least 3 characters long"
        )
    
    if len(request.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long"
        )
    
    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == request.username) | (User.email == request.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    
    # Create new user
    new_user = User(
        username=request.username,
        email=request.email,
        full_name=request.full_name,
        password=hash_password(request.password),
        role="customer",
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Sign up successful! Please log in.",
        "user": new_user.to_dict()
    }

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    User login endpoint
    
    Test credentials:
    - username: admin, password: admin123
    - username: user1, password: password123
    - username: user2, password: password456
    """
    # Check if it's username or email
    user = db.query(User).filter(
        (User.username == request.username) | (User.email == request.username)
    ).first()
    
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Generate a simple token (in production, use JWT)
    token = f"token_{user.username}_{datetime.now().timestamp()}"
    
    # Store session
    SESSIONS[token] = {
        "user_id": user.id,
        "username": user.username,
        "login_time": datetime.now().isoformat(),
        "remember_me": request.remember_me
    }
    
    return LoginResponse(
        token=token,
        user=user.to_dict(),
        message="Login successful"
    )

@router.post("/logout")
def logout(token: str = None):
    """Logout user"""
    if token and token in SESSIONS:
        del SESSIONS[token]
    
    return {"message": "Logout successful"}

@router.get("/verify")
def verify_token(token: str = None, db: Session = Depends(get_db)):
    """Verify if token is valid"""
    if not token or token not in SESSIONS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    session = SESSIONS[token]
    user = db.query(User).filter(User.id == session["user_id"]).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return {
        "valid": True,
        "user": user.to_dict()
    }

@router.get("/users", response_model=dict)
def get_all_users(db: Session = Depends(get_db)):
    """Get all users (for demo purposes)"""
    users = db.query(User).all()
    return {
        "users": [user.to_dict() for user in users]
    }

@router.get("/init-test-users")
def init_users(db: Session = Depends(get_db)):
    """Initialize test users in database"""
    init_test_users(db)
    return {"message": "Test users initialized"}

