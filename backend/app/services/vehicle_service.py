from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException, status
from app.repositories.vehicle_repo import VehicleRepository
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut


class VehicleService:
    def __init__(self, db: Session):
        self.repo = VehicleRepository(db)

    def get_all_vehicles(self) -> List[VehicleOut]:
        return self.repo.get_all()

    def get_vehicle(self, vehicle_id: int) -> VehicleOut:
        vehicle = self.repo.get_by_id(vehicle_id)
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return vehicle

    def get_available_vehicles(self) -> List[VehicleOut]:
        return self.repo.get_available()

    def create_vehicle(self, data: VehicleCreate) -> VehicleOut:
        existing = self.repo.get_by_plate(data.plate)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Vehicle with plate '{data.plate}' already exists",
            )
        return self.repo.create(data)

    def update_vehicle(self, vehicle_id: int, data: VehicleUpdate) -> VehicleOut:
        vehicle = self.repo.update(vehicle_id, data)
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return vehicle

    def delete_vehicle(self, vehicle_id: int) -> dict:
        success = self.repo.delete(vehicle_id)
        if not success:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        return {"message": "Vehicle deleted successfully"}

    def get_fleet_summary(self) -> dict:
        all_v = self.repo.get_all()
        return {
            "total":       len(all_v),
            "available":   sum(1 for v in all_v if v.status == "available"),
            "rented":      sum(1 for v in all_v if v.status == "rented"),
            "maintenance": sum(1 for v in all_v if v.status == "maintenance"),
        }
