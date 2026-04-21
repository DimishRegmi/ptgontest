from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.booking_service import BookingService
from app.schemas.booking import BookingCreate, BookingOut

router = APIRouter()


@router.get("/", response_model=List[BookingOut])
def get_all_bookings(db: Session = Depends(get_db)):
    return BookingService(db).get_all_bookings()


@router.get("/active", response_model=List[BookingOut])
def get_active_bookings(db: Session = Depends(get_db)):
    return BookingService(db).get_active_bookings()


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    return BookingService(db).get_booking(booking_id)


@router.post("/", response_model=BookingOut, status_code=201)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    return BookingService(db).create_booking(data)


@router.patch("/{booking_id}/cancel", response_model=BookingOut)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    return BookingService(db).cancel_booking(booking_id)


@router.patch("/{booking_id}/complete", response_model=BookingOut)
def complete_booking(booking_id: int, db: Session = Depends(get_db)):
    return BookingService(db).complete_booking(booking_id)
