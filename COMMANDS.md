# 🚀 Quick Command Reference

## 🎯 Essential Commands

### Start Backend
```bash
cd backend
python run.py
# or
python -m uvicorn main:app --host 127.0.0.1 --port 8001
```
**Result**: Server running on `http://127.0.0.1:8001` ✓

---

### Initialize Database
```bash
cd backend
python init_db.py
```
**Result**: SQLite database created with 3 test users ✓

---

### Verify Database
```bash
cd backend
python verify_db.py
```
**Result**: Shows all users in database ✓

---

### Run Authentication Tests
```bash
cd backend
python test_auth.py
```
**Result**: Verifies password hashing, database, models ✓

---

## 🌐 Open Frontend

### Login Page
```
File: frontend/login.html
Quick: Ctrl+O → Select file
URL: file:///c:/Users/lenovo/OneDrive/Desktop/vehicle_rental/frontend/login.html
```

### Signup Page
```
File: frontend/signup.html
Quick: Ctrl+O → Select file
URL: file:///c:/Users/lenovo/OneDrive/Desktop/vehicle_rental/frontend/signup.html
```

### Dashboard
```
File: frontend/index.html
(Only accessible after login)
```

---

## 📚 API Access

### Interactive Documentation
```
Browser: http://127.0.0.1:8001/docs
```

### Test Login Endpoint
```bash
curl -X POST "http://127.0.0.1:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### List All Users
```bash
curl "http://127.0.0.1:8001/api/auth/users"
```

---

## 🔐 Test Credentials

```
Username: admin       | Password: admin123
Username: user1       | Password: password123
Username: user2       | Password: password456
```

---

## 🗄️ Database Commands

### Reset Database
```bash
cd backend
rm vehicle_rental.db
python init_db.py
```

### Export Users as JSON
```bash
cd backend
python -c "
from app.database import SessionLocal
from app.models.user import User
import json

db = SessionLocal()
users = db.query(User).all()
data = [u.to_dict() for u in users]
print(json.dumps(data, indent=2, default=str))
"
```

### Check Database File
```bash
cd backend
dir vehicle_rental.db
ls -la vehicle_rental.db  # Linux/Mac
```

---

## 📝 Logs & Debugging

### View Server Logs
- Server logs appear in terminal where `python run.py` is running
- Check browser console (F12) for frontend errors

### Enable Debug Mode
```bash
cd backend
python -c "from main import app; print(app.debug)"
```

### Test Database Connection
```bash
cd backend
python -c "from app.database import SessionLocal; db = SessionLocal(); print('✓ DB Connected')"
```

---

## 🛠️ Development Workflow

### 1. Start Backend
```bash
cd backend
python run.py
```
→ Keep terminal open

### 2. Open Login Page
```
frontend/login.html
```
→ In browser

### 3. Test Features
- Try login with admin/admin123
- Click signup link
- Create new account
- Verify in database

### 4. Check Database
```bash
cd backend
python verify_db.py
```
→ Should show new user

---

## 🔍 Common Issues & Fixes

### Port Already in Use
```bash
# Use different port
python -m uvicorn main:app --port 8002
```

### Database Locked
```bash
# Delete and recreate
cd backend
rm vehicle_rental.db
python init_db.py
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend API Errors
```javascript
// Check console (F12) for error messages
// Ensure backend is running on port 8001
// Clear localStorage: localStorage.clear()
```

---

## 📊 Project Structure

```
vehicle_rental/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py          ← User model (NEW)
│   │   │   ├── vehicle.py
│   │   │   ├── booking.py
│   │   │   └── __init__.py
│   │   ├── routers/
│   │   │   ├── auth.py          ← Updated with signup
│   │   │   ├── vehicles.py
│   │   │   ├── bookings.py
│   │   │   ├── pricing.py
│   │   │   ├── tracking.py
│   │   │   └── __init__.py
│   │   ├── database.py
│   │   └── __init__.py
│   ├── main.py
│   ├── run.py
│   ├── init_db.py               ← NEW
│   ├── verify_db.py             ← NEW
│   ├── test_auth.py             ← NEW
│   ├── vehicle_rental.db        ← NEW (SQLite)
│   └── requirements.txt
└── frontend/
    ├── login.html
    ├── signup.html              ← NEW
    ├── index.html
    ├── css/
    │   ├── login.css
    │   ├── signup.css           ← NEW
    │   └── ...
    └── js/
        ├── login.js             ← Updated
        ├── signup.js            ← NEW
        └── ...
```

---

## ✅ Checklist

- [ ] Backend running on port 8001
- [ ] Database initialized (vehicle_rental.db created)
- [ ] Test users visible (python verify_db.py)
- [ ] Login page opens (frontend/login.html)
- [ ] Signup page opens (frontend/signup.html)
- [ ] Can login with admin/admin123
- [ ] Can create new account via signup
- [ ] New user appears in database

---

## 🎯 Next Steps

1. **Test Login**: Use admin/admin123
2. **Test Signup**: Create new account
3. **Access Dashboard**: After login
4. **Manage Vehicles**: Add/edit vehicles
5. **Create Bookings**: Make reservations
6. **View Reports**: Check analytics

---

## 📞 Support Commands

```bash
# Check Python version
python --version

# Check installed packages
pip list

# Check port availability
netstat -ano | find "8001"  # Windows
lsof -i :8001               # Linux/Mac

# Kill process on port
taskkill /PID <pid> /F      # Windows
kill -9 <pid>               # Linux/Mac
```

---

**Everything is set up and ready to go!** 🚀
