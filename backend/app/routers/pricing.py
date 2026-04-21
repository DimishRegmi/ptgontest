from fastapi import APIRouter
from app.services.pricing_service import PricingService
from app.schemas.pricing import PriceRequest, PriceBreakdown

router = APIRouter()
_svc   = PricingService()


@router.post("/calculate", response_model=PriceBreakdown)
def calculate_price(req: PriceRequest):
    return _svc.calculate(req)


@router.get("/rates")
def get_rate_table():
    return _svc.get_rate_table()
