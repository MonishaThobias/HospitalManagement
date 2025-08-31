# app/schemas.py
from pydantic import BaseModel
from datetime import datetime,date
from typing import Optional


class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    contact_info: str
    phone: int 
   

class PatientCreate(PatientBase):
    pass

class PatientOut(PatientBase):
    id: int
    name: str
    class Config:
        from_attributes = True

class DoctorBase(BaseModel):
    name: Optional[str]
    specialization: Optional[str]
    contact_info: Optional[str]
    email: Optional[str]
    address: Optional[str]
    qualification: Optional[str]
    experience_years: Optional[int]
    gender: Optional[str]
    date_of_birth: Optional[date]
    availability: Optional[str]
    is_active: Optional[bool]

class DoctorCreate(DoctorBase):
    pass
class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    contact_info: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    availability: Optional[str] = None
    is_active: Optional[bool] = None

class DoctorOut(DoctorBase):
    id: int
    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    date_time: datetime
    status: str

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    date_time: datetime
    status: str

class AppointmentUpdate(BaseModel):
    date_time: datetime | None = None
    status: str | None = None


class AppointmentPatientOut(BaseModel):
    name: str
    class Config:
        from_attributes = True

class AppointmentDoctorOut(BaseModel):
    name: str
    class Config:
        from_attributes = True

class AppointmentOut(BaseModel):
    id: int
    date_time: datetime
    status: str
    patient: AppointmentPatientOut
    doctor: AppointmentDoctorOut

    class Config:
        from_attributes = True
class BillingBase(BaseModel):
    service: str
    amount: float
    status: str

class BillingCreate(BillingBase):
    patient_id: int

class BillingUpdate(BaseModel):
    service: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    
class BillingOut(BillingBase):
    id: int
    date: datetime
    patient: PatientOut 

    class Config:
        from_attributes = True