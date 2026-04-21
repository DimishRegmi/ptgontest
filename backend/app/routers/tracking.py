from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.tracking_service import TrackingService

router = APIRouter()


@router.get("/active")
def get_active_rentals(db: Session = Depends(get_db)):
    return TrackingService(db).get_active_rentals()


@router.get("/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    return TrackingService(db).get_dashboard_summary()
