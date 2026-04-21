# 🚗 DriveNow Vehicle Rental System

A modern vehicle rental management system with user authentication, booking management, and fleet tracking.

## ✨ Features

- **Authentication System**
  - User login with email/username and password
  - User registration (signup)
  - SQLite database for persistent data storage
  - Session management with token-based authentication
  - Password hashing for security

- **Dashboard**
  - Fleet statistics (total vehicles, active bookings, revenue)
  - Real-time availability visualization
  - Monthly revenue charts
  - Recent activity log

- **Vehicle Management**
  - Add new vehicles to fleet
  - Search and filter vehicles by type
  - Track vehicle status (available, rented, maintenance)
  - Manage vehicle details and pricing

- **Booking System**
  - Create new bookings
  - Calculate rental costs automatically
  - Track booking status
  - View booking history

- **Pricing & Rates**
  - Dynamic pricing calculator
  - Rate configuration by vehicle type
  - Revenue tracking

- **Vehicle Tracking**
  - Real-time tracking of vehicle locations
  - Trip history
  - Distance monitoring

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Initialize the database:**
```bash
python init_db.py
```

4. **Start the server:**
```bash
python run.py
```

The API will be available at `http://127.0.0.1:8000`

### Frontend

Open the frontend in your browser:
- **Login Page**: `frontend/login.html`
- **Signup Page**: `frontend/signup.html`
- **Main Dashboard**: `frontend/index.html`

## 🔑 Test Credentials

Use these credentials to test the application:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| user1 | password123 | Customer |
| user2 | password456 | Customer |

Or create a new account using the **Sign Up** button.

## 📁 Project Structure

```
vehicle_rental/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py          # User model with SQLite
│   │   │   ├── vehicle.py       # Vehicle model
│   │   │   ├── booking.py       # Booking model
│   │   │   └── __init__.py
│   │   ├── routers/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── vehicles.py      # Vehicle management endpoints
│   │   │   ├── bookings.py      # Booking endpoints
│   │   │   ├── pricing.py       # Pricing endpoints
│   │   │   ├── tracking.py      # Tracking endpoints
│   │   │   └── __init__.py
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── repositories/        # Data access layer
│   │   ├── services/            # Business logic
│   │   ├── database.py          # SQLite configuration
│   │   └── __init__.py
│   ├── main.py                  # FastAPI app entry point
│   ├── run.py                   # Server launcher
│   ├── init_db.py               # Database initialization script
│   ├── verify_db.py             # Database verification script
│   └── requirements.txt         # Python dependencies
└── frontend/
    ├── login.html               # Login page
    ├── signup.html              # Registration page
    ├── index.html               # Main dashboard
    ├── css/
    │   ├── reset.css            # CSS reset
    │   ├── variables.css        # CSS variables/theme
    │   ├── components.css       # Component styles
    │   ├── layout.css           # Layout styles
    │   ├── login.css            # Login page styles
    │   └── signup.css           # Signup page styles
    └── js/
        ├── api.js               # API client
        ├── app.js               # Main app logic
        ├── login.js             # Login functionality
        ├── signup.js            # Signup functionality
        ├── vehicles.js          # Vehicle page logic
        ├── bookings.js          # Booking page logic
        ├── pricing.js           # Pricing page logic
        ├── tracking.js          # Tracking page logic
        └── dashboard.js         # Dashboard logic
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token validity
- `GET /api/auth/users` - Get all users (admin only)

### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Add new vehicle
- `GET /api/vehicles/{id}` - Get vehicle details
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle

### Bookings
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking

### Pricing
- `GET /api/pricing/rates` - Get pricing rates
- `POST /api/pricing/calculate` - Calculate rental price

### Tracking
- `GET /api/tracking` - Get tracking data

## 🗄️ Database

The application uses **SQLite** for data persistence.

### Database File
- Location: `backend/vehicle_rental.db`
- Automatically created on first run

### Tables
- **users** - User accounts and authentication
- **vehicles** - Vehicle fleet information
- **bookings** - Rental booking records

## 🔐 Security Features

- Password hashing (SHA-256)
- Token-based session management
- User role-based access control
- Input validation
- CORS protection

⚠️ **Note**: This is a demo application. For production, use:
- JWT tokens instead of simple token strings
- bcrypt for password hashing
- HTTPS/SSL encryption
- Environment variables for sensitive data
- Rate limiting and advanced authentication

## 🎨 UI/UX Features

- Modern gradient design with glassmorphism effects
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Dark mode compatible
- Accessible form inputs
- Real-time validation feedback
- Toast notifications for user actions

## 📊 API Documentation

Interactive API documentation available at:
```
http://127.0.0.1:8000/docs
```

## 🛠️ Development

### Running in Development Mode
```bash
cd backend
python run.py
```

The server supports hot-reload for code changes.

### Testing
```bash
cd backend
pytest tests/
```

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Development Notes

- Frontend is served as static files from the frontend directory
- All API calls use relative URLs (configured for localhost:8000)
- Session tokens are stored in browser localStorage
- User data is stored in SQLite database
- Password validation: minimum 6 characters, hashed before storage

## 🐛 Troubleshooting

### Port Already in Use
If port 8000 is already in use, modify `run.py`:
```python
uvicorn.run(app, host="127.0.0.1", port=8001)  # Change port number
```

### Database Issues
To reset the database:
```bash
cd backend
# Delete vehicle_rental.db
rm vehicle_rental.db
# Reinitialize
python init_db.py
```

### Login Not Working
1. Verify the backend server is running
2. Check that test users are initialized: `python verify_db.py`
3. Check browser console for API errors
4. Ensure CORS is enabled in backend (it is by default)

---

**Created**: April 2026
**Framework**: FastAPI + Vanilla JS
**Database**: SQLite
