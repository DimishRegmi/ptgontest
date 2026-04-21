from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from enum import Enum


class BookingStatus(str, Enum):
    pending   = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"


class BookingCreate(BaseModel):
    customer:   str  = Field(..., example="Anil Sharma")
    vehicle_id: int  = Field(..., example=1)
    from_date:  date = Field(..., example="2026-04-20")
    to_date:    date = Field(..., example="2026-04-25")


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None


class BookingOut(BaseModel):
    id:           int
    customer:     str
    vehicle_id:   int
    from_date:    date
    to_date:      date
    total_amount: float
    status:       BookingStatus
    vehicle_name: Optional[str] = None

    class Config:
        from_attributes = True
