# app/routes/patients.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post("/", response_model=schemas.PatientOut)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db), user: models.User = Depends(auth.get_current_user)):
    new_patient = models.Patient(**patient.dict())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.get("/", response_model=list[schemas.PatientOut])
def get_patients(db: Session = Depends(database.get_db), user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Patient).all()

@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: int, db: Session = Depends(database.get_db), user: models.User = Depends(auth.get_current_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return

@router.put("/{patient_id}", response_model=schemas.PatientOut)
def update_patient(patient_id: int, patient: schemas.PatientCreate, db: Session = Depends(database.get_db), user: models.User = Depends(auth.get_current_user)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for key, value in patient.dict().items():
        setattr(db_patient, key, value)
    db.commit()
    db.refresh(db_patient)
    return db_patient
