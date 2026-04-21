#!/usr/bin/env python
"""Initialize the database with test users"""

import sys
import os

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import engine, SessionLocal, Base
from app.models.user import User
from app.routers.auth import hash_password

# Create all tables
Base.metadata.create_all(bind=engine)

# Initialize test users
db = SessionLocal()

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
    # Check if user already exists
    existing = db.query(User).filter(User.username == user_data["username"]).first()
    if not existing:
        user = User(**user_data)
        db.add(user)
        print(f"✓ Created user: {user_data['username']}")
    else:
        print(f"✓ User already exists: {user_data['username']}")

db.commit()
db.close()

print("\n✓ Database initialized successfully!")
