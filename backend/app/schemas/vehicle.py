from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class VehicleStatus(str, Enum):
    available   = "available"
    rented      = "rented"
    maintenance = "maintenance"


class VehicleBase(BaseModel):
    name:       str   = Field(..., example="Toyota Camry")
    type:       str   = Field(..., example="Car")
    daily_rate: float = Field(..., gt=0, example=3500.0)
    plate:      str   = Field(..., example="BA 1 PA 4512")
    icon:       Optional[str] = "🚗"


class VehicleCreate(VehicleBase):
    status: VehicleStatus = VehicleStatus.available


class VehicleUpdate(BaseModel):
    name:       Optional[str]           = None
    type:       Optional[str]           = None
    daily_rate: Optional[float]         = None
    plate:      Optional[str]           = None
    status:     Optional[VehicleStatus] = None
    icon:       Optional[str]           = None


class VehicleOut(VehicleBase):
    id:     int
    status: VehicleStatus

    class Config:
        from_attributes = True
