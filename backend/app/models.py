# app/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Date, Boolean, Float
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime 

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)  # doctor,patient,user

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    contact_info = Column(String)
    phone = Column(String(20))
    appointments = relationship("Appointment", back_populates="patient")
    billings = relationship("Billing", back_populates="patient")

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialization = Column(String)
    contact_info = Column(String)
    email = Column(String, unique=True, nullable=False)
    address = Column(Text, nullable=True)
    qualification = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)  # "Male", "Female", "Other"
    date_of_birth = Column(Date, nullable=True)
    availability = Column(String, nullable=True)  # e.g. "Mon-Fri 10am-5pm"
    is_active = Column(Boolean, default=True)
    appointments = relationship("Appointment", back_populates="doctor")
    

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    date_time = Column(DateTime)
    status = Column(String)

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")

class Billing(Base):
    __tablename__ = 'billings'

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    date = Column(DateTime, default=datetime.utcnow) 
    service = Column(String)
    amount = Column(Float)
    status = Column(String)  # e.g., "Paid", "Pending", "Cancelled"

    patient = relationship("Patient", back_populates="billings")