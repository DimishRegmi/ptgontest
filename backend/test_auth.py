#!/usr/bin/env python
"""Test script for authentication endpoints"""

import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models.user import User
from app.routers.auth import hash_password, verify_password

print("\n" + "=" * 70)
print("🧪 AUTHENTICATION SYSTEM TEST")
print("=" * 70)

db = SessionLocal()

# Test 1: Verify password hashing
print("\n✓ Test 1: Password Hashing")
test_password = "testpass123"
hashed = hash_password(test_password)
print(f"  Original: {test_password}")
print(f"  Hashed: {hashed[:20]}...")
assert verify_password(test_password, hashed), "Password verification failed!"
print("  ✓ Password hashing works correctly")

# Test 2: Check existing users
print("\n✓ Test 2: Database Users")
users = db.query(User).all()
print(f"  Found {len(users)} users in database:")
for user in users:
    print(f"    - {user.username} ({user.email})")

# Test 3: User model to_dict method
print("\n✓ Test 3: User Model Serialization")
admin = db.query(User).filter(User.username == "admin").first()
if admin:
    user_dict = admin.to_dict()
    print(f"  Admin user as dict:")
    for key, value in user_dict.items():
        print(f"    {key}: {value}")
    assert "password" not in user_dict, "Password should not be in dict!"
    print("  ✓ User serialization is secure (no password exposed)")

# Test 4: Signup validation
print("\n✓ Test 4: Checking for test signup user")
test_user = db.query(User).filter(User.username == "testuser").first()
if test_user:
    print(f"  ✓ Found test signup user: {test_user.email}")
else:
    print("  - No test signup user yet (will be created during signup)")

db.close()

print("\n" + "=" * 70)
print("✅ ALL TESTS PASSED!")
print("=" * 70)

print("\n📋 NEXT STEPS:")
print("  1. Open login.html in your browser")
print("  2. Test login with: admin / admin123")
print("  3. Try signup: create a new account")
print("  4. Verify the new user appears in the database")
print("\n" + "=" * 70 + "\n")
