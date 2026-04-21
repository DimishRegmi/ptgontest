from pydantic import BaseModel, Field
from enum import Enum


class SeasonType(str, Enum):
    regular  = "regular"
    peak     = "peak"
    offpeak  = "offpeak"


class CustomerType(str, Enum):
    regular   = "regular"
    returning = "returning"
    corporate = "corporate"


class PriceRequest(BaseModel):
    vehicle_type:  str         = Field(..., example="sedan")
    days:          int         = Field(..., gt=0, example=3)
    season:        SeasonType  = SeasonType.regular
    customer_type: CustomerType = CustomerType.regular


class PriceBreakdown(BaseModel):
    vehicle_type:        str
    days:                int
    base_rate_per_day:   float
    season_multiplier:   float
    customer_multiplier: float
    subtotal:            float
    vat:                 float
    total:               float
