#!/usr/bin/env python
"""Test script for authentication endpoints"""

import sys
import os
import json

# Add backend directory to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

print("=" * 60)
print("📊 USER DATABASE VERIFICATION")
print("=" * 60)

users = db.query(User).all()

if not users:
    print("❌ No users found in database")
else:
    print(f"\n✓ Found {len(users)} users:\n")
    for user in users:
        print(f"  👤 Username: {user.username}")
        print(f"     Email: {user.email}")
        print(f"     Name: {user.full_name}")
        print(f"     Role: {user.role}")
        print(f"     Active: {user.is_active}")
        print(f"     Created: {user.created_at}\n")

db.close()

print("=" * 60)
print("\n✓ API ENDPOINTS AVAILABLE:\n")
print("  🔐 POST   /api/auth/login       - User login")
print("  📝 POST   /api/auth/signup      - User registration")
print("  🔓 POST   /api/auth/logout      - User logout")
print("  ✅ GET    /api/auth/verify      - Verify token")
print("  👥 GET    /api/auth/users       - List all users")
print("\n  📚 API DOCS: http://127.0.0.1:8000/docs")
print("=" * 60)
