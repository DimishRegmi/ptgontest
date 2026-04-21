# DriveNow — Vehicle Rental System
**PRG 400: Advance Python | Team Nothing**
*By Dimish Regmi & Aaditya raj Aryal*

---

## Project Structure

```
vehicle_rental/
│
├── backend/                        # FastAPI backend
│   ├── main.py                     # App entry point, CORS, router registration
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Environment variables (DB URL)
│   │
│   ├── app/
│   │   ├── database.py             # SQLAlchemy engine, session, Base
│   │   │
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   │   ├── vehicle.py
│   │   │   └── booking.py
│   │   │
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   │   ├── vehicle.py
│   │   │   ├── booking.py
│   │   │   └── pricing.py
│   │   │
│   │   ├── repositories/           # Database access layer (SOLID: SRP)
│   │   │   ├── vehicle_repo.py
│   │   │   └── booking_repo.py
│   │   │
│   │   ├── services/               # Business logic layer (SOLID: SRP, OCP)
│   │   │   ├── vehicle_service.py
│   │   │   ├── booking_service.py
│   │   │   ├── pricing_service.py
│   │   │   └── tracking_service.py
│   │   │
│   │   └── routers/                # API route handlers
│   │       ├── vehicles.py
│   │       ├── bookings.py
│   │       ├── pricing.py
│   │       └── tracking.py
│   │
│   └── tests/
│       └── test_api.py             # Pytest test suite
│
└── frontend/                       # Vanilla JS frontend
    ├── index.html                  # Main HTML shell
    │
    ├── css/
    │   ├── reset.css               # CSS reset
    │   ├── variables.css           # CSS custom properties (light + dark)
    │   ├── components.css          # All UI components
    │   └── layout.css              # Nav, page grid, two-col layout
    │
    └── js/
        ├── api.js                  # Centralised fetch helpers (BASE_URL here)
        ├── app.js                  # Entry point: tab routing, modal wiring, init
        ├── vehicles.js             # Vehicles tab logic
        ├── bookings.js             # Bookings tab logic
        ├── pricing.js              # Pricing calculator logic
        ├── tracking.js             # Rental tracking logic
        └── dashboard.js            # Dashboard stats + charts
```

---

## Architecture (SOLID Principles Applied)

| Principle | How it's applied |
|-----------|-----------------|
| **S** — Single Responsibility | Routes, Services, Repositories are separate layers |
| **O** — Open/Closed | Add new pricing strategies in `pricing_service.py` without changing existing code |
| **L** — Liskov Substitution | Swap SQLite → PostgreSQL by changing `DATABASE_URL` only |
| **I** — Interface Segregation | Small focused schemas for Vehicle, Booking, Pricing |
| **D** — Dependency Inversion | FastAPI `Depends(get_db)` injects the DB session |

**Request flow:**
```
Client → Router → Service (business logic) → Repository (DB access) → PostgreSQL/SQLite
```

---

## Backend Setup

### 1. Create a virtual environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure the database
Edit `.env`:
```env
# SQLite (default, no setup needed)
DATABASE_URL=sqlite:///./vehicle_rental.db

# PostgreSQL (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_rental
```

### 4. Run the server
```bash
uvicorn main:app --reload
```

The API will be available at: **http://127.0.0.1:8000**
Interactive docs (Swagger UI): **http://127.0.0.1:8000/docs**

### 5. Run tests
```bash
pytest tests/ -v
```

---

## API Endpoints

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/vehicles/` | List all vehicles |
| GET    | `/api/vehicles/available` | List available vehicles only |
| GET    | `/api/vehicles/summary` | Fleet availability summary |
| GET    | `/api/vehicles/{id}` | Get single vehicle |
| POST   | `/api/vehicles/` | Add new vehicle |
| PATCH  | `/api/vehicles/{id}` | Update vehicle |
| DELETE | `/api/vehicles/{id}` | Remove vehicle |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/bookings/` | List all bookings |
| GET    | `/api/bookings/active` | List active (confirmed) bookings |
| GET    | `/api/bookings/{id}` | Get single booking |
| POST   | `/api/bookings/` | Create booking (auto-calculates price + marks vehicle rented) |
| PATCH  | `/api/bookings/{id}/cancel` | Cancel booking (frees vehicle) |
| PATCH  | `/api/bookings/{id}/complete` | Mark booking completed |

### Pricing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/pricing/calculate` | Calculate price breakdown |
| GET    | `/api/pricing/rates` | Get full rate table |

### Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/tracking/active` | Active rentals with progress % |
| GET    | `/api/tracking/dashboard` | Dashboard summary stats |

---

## Frontend Setup

### Option A — Live server (recommended)
Install the VS Code **Live Server** extension, right-click `frontend/index.html` → **Open with Live Server**.

### Option B — Python simple server
```bash
cd frontend
python -m http.server 5500
```
Then open **http://localhost:5500**

### Connecting to the backend
In `frontend/js/api.js`, change `BASE_URL` if your backend runs on a different port:
```js
export const BASE_URL = 'http://127.0.0.1:8000/api';
```

---

## Tech Stack

### Backend
| Library | Purpose |
|---------|---------|
| FastAPI | Web framework & automatic Swagger docs |
| SQLAlchemy | ORM — models & queries |
| Alembic | Database migrations |
| Pydantic | Request/response validation |
| SQLite / PostgreSQL | Database |
| Pytest + HTTPX | Testing |
| Python-dotenv | `.env` config loading |

### Frontend
| Technology | Purpose |
|------------|---------|
| Vanilla JS (ES Modules) | No build step required |
| CSS Custom Properties | Light + dark mode theming |
| Fetch API | REST calls to FastAPI backend |
| Google Fonts (Syne + DM Sans) | Typography |

---

## Features

- **Vehicle management** — Add, view, filter, remove vehicles; real-time status tracking
- **Booking system** — Create bookings, auto-calculate price with VAT, cancel/complete rentals
- **Pricing engine** — Dynamic pricing: base rate × days × season multiplier × customer discount
- **Rental tracking** — Progress bars showing elapsed days for active rentals
- **Dashboard** — Fleet availability donut chart, revenue chart, activity feed
- **Dark mode** — Automatic via `prefers-color-scheme`
- **Swagger UI** — Full interactive API docs at `/docs`
