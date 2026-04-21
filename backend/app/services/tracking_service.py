from sqlalchemy.orm import Session
from datetime import date
from typing import List
from app.repositories.booking_repo import BookingRepository
from app.repositories.vehicle_repo import VehicleRepository


class TrackingService:
    def __init__(self, db: Session):
        self.booking_repo = BookingRepository(db)
        self.vehicle_repo = VehicleRepository(db)

    def get_active_rentals(self) -> List[dict]:
        today    = date.today()
        bookings = self.booking_repo.get_active()
        result   = []

        for b in bookings:
            vehicle  = self.vehicle_repo.get_by_id(b.vehicle_id)
            total_d  = max(1, (b.to_date - b.from_date).days)
            elapsed  = max(0, (today - b.from_date).days)
            progress = min(100, round(elapsed / total_d * 100))

            result.append({
                "booking_id":    b.id,
                "customer":      b.customer,
                "vehicle_name":  vehicle.name if vehicle else "Unknown",
                "vehicle_plate": vehicle.plate if vehicle else "—",
                "from_date":     str(b.from_date),
                "to_date":       str(b.to_date),
                "total_days":    total_d,
                "elapsed_days":  elapsed,
                "progress_pct":  progress,
                "total_amount":  b.total_amount,
                "status":        b.status,
            })

        return result

    def get_dashboard_summary(self) -> dict:
        all_v    = self.vehicle_repo.get_all()
        active_b = self.booking_repo.get_active()
        all_b    = self.booking_repo.get_all()

        total_revenue = sum(
            b.total_amount for b in all_b
            if b.status in ("confirmed", "completed")
        )

        return {
            "total_vehicles":   len(all_v),
            "available":        sum(1 for v in all_v if v.status == "available"),
            "rented":           sum(1 for v in all_v if v.status == "rented"),
            "maintenance":      sum(1 for v in all_v if v.status == "maintenance"),
            "active_bookings":  len(active_b),
            "total_bookings":   len(all_b),
            "total_revenue":    round(total_revenue, 2),
        }
