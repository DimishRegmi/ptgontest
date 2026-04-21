import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from main import app

# Use in-memory SQLite for tests
TEST_DB_URL = "sqlite:///./test.db"
engine      = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestSession  = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


# ── VEHICLE TESTS ─────────────────────────────────────────────────────────────

def test_create_vehicle():
    resp = client.post("/api/vehicles/", json={
        "name": "Toyota Camry", "type": "Car",
        "daily_rate": 3500, "plate": "BA 1 TEST 001",
        "status": "available", "icon": "🚗"
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"]  == "Toyota Camry"
    assert data["plate"] == "BA 1 TEST 001"


def test_get_all_vehicles():
    client.post("/api/vehicles/", json={
        "name": "Honda CR-V", "type": "SUV",
        "daily_rate": 5500, "plate": "BA 2 TEST 002",
        "status": "available", "icon": "🚙"
    })
    resp = client.get("/api/vehicles/")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_duplicate_plate_rejected():
    payload = {"name": "Car A", "type": "Car", "daily_rate": 3000, "plate": "SAME-001", "status": "available"}
    client.post("/api/vehicles/", json=payload)
    resp = client.post("/api/vehicles/", json=payload)
    assert resp.status_code == 400


def test_get_available_vehicles():
    client.post("/api/vehicles/", json={
        "name": "Yamaha FZ", "type": "Motorcycle",
        "daily_rate": 1200, "plate": "BA 3 TEST 003",
        "status": "available"
    })
    resp = client.get("/api/vehicles/available")
    assert resp.status_code == 200
    for v in resp.json():
        assert v["status"] == "available"


def test_delete_vehicle():
    resp = client.post("/api/vehicles/", json={
        "name": "Delete Me", "type": "Car",
        "daily_rate": 2000, "plate": "DEL-001", "status": "available"
    })
    vid  = resp.json()["id"]
    resp = client.delete(f"/api/vehicles/{vid}")
    assert resp.status_code == 200


# ── BOOKING TESTS ─────────────────────────────────────────────────────────────

def _create_test_vehicle(plate="BOOK-001"):
    r = client.post("/api/vehicles/", json={
        "name": "Test Car", "type": "Car",
        "daily_rate": 3000, "plate": plate, "status": "available"
    })
    return r.json()["id"]


def test_create_booking():
    vid  = _create_test_vehicle()
    resp = client.post("/api/bookings/", json={
        "customer":   "Test Customer",
        "vehicle_id": vid,
        "from_date":  "2026-05-01",
        "to_date":    "2026-05-04",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["customer"]  == "Test Customer"
    assert data["status"]    == "confirmed"
    assert data["total_amount"] == round(3000 * 3 * 1.13, 2)


def test_booking_marks_vehicle_rented():
    vid = _create_test_vehicle("RENT-001")
    client.post("/api/bookings/", json={
        "customer": "Renter", "vehicle_id": vid,
        "from_date": "2026-05-01", "to_date": "2026-05-03"
    })
    resp = client.get(f"/api/vehicles/{vid}")
    assert resp.json()["status"] == "rented"


def test_cancel_booking_frees_vehicle():
    vid = _create_test_vehicle("CANCEL-001")
    resp = client.post("/api/bookings/", json={
        "customer": "Canceller", "vehicle_id": vid,
        "from_date": "2026-05-01", "to_date": "2026-05-03"
    })
    bid  = resp.json()["id"]
    client.patch(f"/api/bookings/{bid}/cancel")
    resp = client.get(f"/api/vehicles/{vid}")
    assert resp.json()["status"] == "available"


def test_cannot_book_unavailable_vehicle():
    vid = _create_test_vehicle("BUSY-001")
    client.post("/api/bookings/", json={
        "customer": "First", "vehicle_id": vid,
        "from_date": "2026-05-01", "to_date": "2026-05-03"
    })
    resp = client.post("/api/bookings/", json={
        "customer": "Second", "vehicle_id": vid,
        "from_date": "2026-05-05", "to_date": "2026-05-07"
    })
    assert resp.status_code == 400


# ── PRICING TESTS ─────────────────────────────────────────────────────────────

def test_pricing_calculation():
    resp = client.post("/api/pricing/calculate", json={
        "vehicle_type": "sedan", "days": 3,
        "season": "regular", "customer_type": "regular"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["base_rate_per_day"] == 3500
    assert data["subtotal"]          == 3500 * 3
    assert data["vat"]               == round(3500 * 3 * 0.13, 2)
    assert data["total"]             == round(3500 * 3 * 1.13, 2)


def test_pricing_peak_season():
    resp = client.post("/api/pricing/calculate", json={
        "vehicle_type": "sedan", "days": 1,
        "season": "peak", "customer_type": "regular"
    })
    data = resp.json()
    assert data["season_multiplier"] == 1.3


def test_pricing_corporate_discount():
    resp = client.post("/api/pricing/calculate", json={
        "vehicle_type": "sedan", "days": 1,
        "season": "regular", "customer_type": "corporate"
    })
    data = resp.json()
    assert data["customer_multiplier"] == 0.8


def test_get_rate_table():
    resp = client.get("/api/pricing/rates")
    assert resp.status_code == 200
    assert len(resp.json()) == 5
