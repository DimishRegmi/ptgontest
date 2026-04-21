from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import vehicles, bookings, pricing, tracking, auth
from app.database import engine, Base
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DriveNow Vehicle Rental API",
    description="Smart Booking & Rental Platform — PRG 400: Advance Python",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/api/auth",      tags=["Authentication"])
app.include_router(vehicles.router,  prefix="/api/vehicles",  tags=["Vehicles"])
app.include_router(bookings.router,  prefix="/api/bookings",  tags=["Bookings"])
app.include_router(pricing.router,   prefix="/api/pricing",   tags=["Pricing"])
app.include_router(tracking.router,  prefix="/api/tracking",  tags=["Tracking"])

# Serve frontend static files
frontend_path = os.path.join(os.path.dirname(__file__), '..', 'frontend')
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="frontend")

@app.get("/")
def root():
    return {"message": "DriveNow Vehicle Rental API is running", "docs": "/docs"}
