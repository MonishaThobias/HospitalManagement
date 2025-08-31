# app/routes/doctors.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth

router = APIRouter(prefix="/doctors", tags=["doctors"])

# Get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.DoctorOut)
def create_doctor(doc: schemas.DoctorCreate, db: Session = Depends(database.get_db), user: models.User = Depends(auth.get_current_user)):
    new_doc = models.Doctor(**doc.dict())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.get("/", response_model=list[schemas.DoctorOut])
def get_doctors(db: Session = Depends(database.get_db), user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Doctor).all()

# Update doctor
@router.put("/{doctor_id}", response_model=schemas.DoctorOut)
def update_doctor(doctor_id: int, doctor: schemas.DoctorUpdate, db: Session = Depends(get_db)):
    db_doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Only update provided fields
    update_data = doctor.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_doctor, key, value)

    db.commit()
    db.refresh(db_doctor)
    return db_doctor


# Delete doctor
@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    db_doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(db_doctor)
    db.commit()
    return {"msg": "Doctor deleted successfully"}