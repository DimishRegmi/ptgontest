from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class BookingStatus(str, enum.Enum):
    pending   = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"


class Booking(Base):
    __tablename__ = "bookings"

    id          = Column(Integer, primary_key=True, index=True)
    customer    = Column(String, nullable=False)
    vehicle_id  = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    from_date   = Column(Date, nullable=False)
    to_date     = Column(Date, nullable=False)
    total_amount= Column(Float, nullable=False)
    status      = Column(String, default=BookingStatus.confirmed)

    vehicle = relationship("Vehicle")
