from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Vehicle]:
        return self.db.query(Vehicle).offset(skip).limit(limit).all()

    def get_by_id(self, vehicle_id: int) -> Optional[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    def get_by_plate(self, plate: str) -> Optional[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.plate == plate).first()

    def get_available(self) -> List[Vehicle]:
        return self.db.query(Vehicle).filter(Vehicle.status == "available").all()

    def create(self, data: VehicleCreate) -> Vehicle:
        vehicle = Vehicle(**data.model_dump())
        self.db.add(vehicle)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def update(self, vehicle_id: int, data: VehicleUpdate) -> Optional[Vehicle]:
        vehicle = self.get_by_id(vehicle_id)
        if not vehicle:
            return None
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(vehicle, field, value)
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle

    def delete(self, vehicle_id: int) -> bool:
        vehicle = self.get_by_id(vehicle_id)
        if not vehicle:
            return False
        self.db.delete(vehicle)
        self.db.commit()
        return True

    def update_status(self, vehicle_id: int, status: str) -> Optional[Vehicle]:
        vehicle = self.get_by_id(vehicle_id)
        if not vehicle:
            return None
        vehicle.status = status
        self.db.commit()
        self.db.refresh(vehicle)
        return vehicle
