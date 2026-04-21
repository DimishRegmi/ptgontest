from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException
from datetime import date
from app.repositories.booking_repo import BookingRepository
from app.repositories.vehicle_repo import VehicleRepository
from app.schemas.booking import BookingCreate, BookingOut
from app.services.pricing_service import PricingService


class BookingService:
    def __init__(self, db: Session):
        self.booking_repo = BookingRepository(db)
        self.vehicle_repo = VehicleRepository(db)
        self.pricing      = PricingService()

    def get_all_bookings(self) -> List[BookingOut]:
        bookings = self.booking_repo.get_all()
        return [self._enrich(b) for b in bookings]

    def get_booking(self, booking_id: int) -> BookingOut:
        booking = self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        return self._enrich(booking)

    def get_active_bookings(self) -> List[BookingOut]:
        bookings = self.booking_repo.get_active()
        return [self._enrich(b) for b in bookings]

    def create_booking(self, data: BookingCreate) -> BookingOut:
        # Validate dates
        if data.to_date <= data.from_date:
            raise HTTPException(status_code=400, detail="to_date must be after from_date")

        # Check vehicle exists and is available
        vehicle = self.vehicle_repo.get_by_id(data.vehicle_id)
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        if vehicle.status != "available":
            raise HTTPException(status_code=400, detail=f"Vehicle is not available (status: {vehicle.status})")

        # Calculate price
        days         = (data.to_date - data.from_date).days
        total_amount = round(vehicle.daily_rate * days * 1.13, 2)  # includes 13% VAT

        # Create booking and mark vehicle as rented
        booking = self.booking_repo.create(data, total_amount)
        self.vehicle_repo.update_status(data.vehicle_id, "rented")
        return self._enrich(booking)

    def cancel_booking(self, booking_id: int) -> BookingOut:
        booking = self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if booking.status == "cancelled":
            raise HTTPException(status_code=400, detail="Booking is already cancelled")

        self.booking_repo.update_status(booking_id, "cancelled")
        self.vehicle_repo.update_status(booking.vehicle_id, "available")
        booking.status = "cancelled"
        return self._enrich(booking)

    def complete_booking(self, booking_id: int) -> BookingOut:
        booking = self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        self.booking_repo.update_status(booking_id, "completed")
        self.vehicle_repo.update_status(booking.vehicle_id, "available")
        booking.status = "completed"
        return self._enrich(booking)

    def _enrich(self, booking) -> BookingOut:
        vehicle = self.vehicle_repo.get_by_id(booking.vehicle_id)
        return BookingOut(
            id=booking.id,
            customer=booking.customer,
            vehicle_id=booking.vehicle_id,
            from_date=booking.from_date,
            to_date=booking.to_date,
            total_amount=booking.total_amount,
            status=booking.status,
            vehicle_name=vehicle.name if vehicle else None,
        )
