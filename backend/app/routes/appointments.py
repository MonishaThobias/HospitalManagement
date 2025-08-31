from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Appointment, Patient, Doctor
from ..schemas import AppointmentOut, AppointmentCreate, AppointmentUpdate
from ..database import get_db
from sqlalchemy.orm import joinedload

router = APIRouter()

@router.get("/appointments", response_model=list[AppointmentOut])
def get_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).options(
        joinedload(Appointment.patient),
        joinedload(Appointment.doctor)
    ).all()
    result = []
    for app in appointments:
        result.append({
            "id": app.id,
            "patient_name": app.patient.name if app.patient else None,
            "doctor_name": app.doctor.name if app.doctor else None,
            "date": app.date_time.strftime("%Y-%m-%d %H:%M") if app.date_time else None,
            "status": app.status
        })
    return result

# ✅ POST (Create) appointment
@router.post("/appointments", response_model=AppointmentOut)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    # Check if patient and doctor exist
    patient = db.query(Patient).get(appointment.patient_id)
    doctor = db.query(Doctor).get(appointment.doctor_id)

    if not patient or not doctor:
        raise HTTPException(status_code=404, detail="Patient or Doctor not found")

    new_app = Appointment(
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        date_time=appointment.date_time,
        status=appointment.status
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app


# ✅ PUT (Update) appointment
@router.put("/appointments/{appointment_id}", response_model=AppointmentOut)
def update_appointment(appointment_id: int, updates: AppointmentUpdate, db: Session = Depends(get_db)):
    app = db.query(Appointment).get(appointment_id)
    if not app:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if updates.date_time:
        app.date_time = updates.date_time
    if updates.status:
        app.status = updates.status

    db.commit()
    db.refresh(app)
    return app


# ✅ DELETE appointment
@router.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    app = db.query(Appointment).get(appointment_id)
    if not app:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(app)
    db.commit()
    return {"detail": "Appointment deleted"}
