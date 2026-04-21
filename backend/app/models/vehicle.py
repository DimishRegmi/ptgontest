from sqlalchemy import Column, Integer, String, Float, Enum
from app.database import Base
import enum


class VehicleStatus(str, enum.Enum):
    available   = "available"
    rented      = "rented"
    maintenance = "maintenance"


class VehicleType(str, enum.Enum):
    car        = "Car"
    motorcycle = "Motorcycle"
    suv        = "SUV"
    van        = "Van"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    type       = Column(String, nullable=False)
    daily_rate = Column(Float, nullable=False)
    plate      = Column(String, unique=True, nullable=False)
    status     = Column(String, default=VehicleStatus.available)
    icon       = Column(String, default="🚗")
