from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.booking import Booking
from app.schemas.booking import BookingCreate


class BookingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Booking]:
        return self.db.query(Booking).offset(skip).limit(limit).all()

    def get_by_id(self, booking_id: int) -> Optional[Booking]:
        return self.db.query(Booking).filter(Booking.id == booking_id).first()

    def get_by_vehicle(self, vehicle_id: int) -> List[Booking]:
        return self.db.query(Booking).filter(Booking.vehicle_id == vehicle_id).all()

    def get_active(self) -> List[Booking]:
        return self.db.query(Booking).filter(Booking.status == "confirmed").all()

    def create(self, data: BookingCreate, total_amount: float) -> Booking:
        booking = Booking(
            customer=data.customer,
            vehicle_id=data.vehicle_id,
            from_date=data.from_date,
            to_date=data.to_date,
            total_amount=total_amount,
            status="confirmed",
        )
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def update_status(self, booking_id: int, status: str) -> Optional[Booking]:
        booking = self.get_by_id(booking_id)
        if not booking:
            return None
        booking.status = status
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def delete(self, booking_id: int) -> bool:
        booking = self.get_by_id(booking_id)
        if not booking:
            return False
        self.db.delete(booking)
        self.db.commit()
        return True
