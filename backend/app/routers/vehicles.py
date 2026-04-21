from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.vehicle_service import VehicleService
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut

router = APIRouter()


@router.get("/", response_model=List[VehicleOut])
def get_all_vehicles(db: Session = Depends(get_db)):
    return VehicleService(db).get_all_vehicles()


@router.get("/available", response_model=List[VehicleOut])
def get_available_vehicles(db: Session = Depends(get_db)):
    return VehicleService(db).get_available_vehicles()


@router.get("/summary")
def get_fleet_summary(db: Session = Depends(get_db)):
    return VehicleService(db).get_fleet_summary()


@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    return VehicleService(db).get_vehicle(vehicle_id)


@router.post("/", response_model=VehicleOut, status_code=201)
def create_vehicle(data: VehicleCreate, db: Session = Depends(get_db)):
    return VehicleService(db).create_vehicle(data)


@router.patch("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: int, data: VehicleUpdate, db: Session = Depends(get_db)):
    return VehicleService(db).update_vehicle(vehicle_id, data)


@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    return VehicleService(db).delete_vehicle(vehicle_id)
