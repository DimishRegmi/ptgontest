from app.schemas.pricing import PriceRequest, PriceBreakdown

# Base rates per day (NPR)
BASE_RATES = {
    "economy":    2500,
    "sedan":      3500,
    "suv":        5500,
    "motorcycle": 1500,
    "van":        7000,
}

# Season multipliers
SEASON_MULTIPLIERS = {
    "regular": 1.0,
    "peak":    1.3,
    "offpeak": 0.85,
}

# Customer multipliers (discounts)
CUSTOMER_MULTIPLIERS = {
    "regular":   1.0,
    "returning": 0.9,
    "corporate": 0.8,
}

VAT_RATE = 0.13


class PricingService:

    def calculate(self, req: PriceRequest) -> PriceBreakdown:
        vehicle_type = req.vehicle_type.lower()
        if vehicle_type not in BASE_RATES:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=f"Unknown vehicle type: {req.vehicle_type}")

        base_rate    = BASE_RATES[vehicle_type]
        season_mult  = SEASON_MULTIPLIERS.get(req.season, 1.0)
        cust_mult    = CUSTOMER_MULTIPLIERS.get(req.customer_type, 1.0)

        subtotal = round(base_rate * req.days * season_mult * cust_mult, 2)
        vat      = round(subtotal * VAT_RATE, 2)
        total    = round(subtotal + vat, 2)

        return PriceBreakdown(
            vehicle_type=req.vehicle_type,
            days=req.days,
            base_rate_per_day=base_rate,
            season_multiplier=season_mult,
            customer_multiplier=cust_mult,
            subtotal=subtotal,
            vat=vat,
            total=total,
        )

    def get_rate_table(self) -> list:
        rows = []
        for key, base in BASE_RATES.items():
            rows.append({
                "type":            key,
                "base_rate":       base,
                "peak_rate":       round(base * SEASON_MULTIPLIERS["peak"], 2),
                "offpeak_rate":    round(base * SEASON_MULTIPLIERS["offpeak"], 2),
                "weekly_discount": "10-18% depending on type",
            })
        return rows
