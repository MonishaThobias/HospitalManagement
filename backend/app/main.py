# app/main.py
from fastapi import FastAPI
from . import models, database
from sqlalchemy.orm import Session
from .routes import users, patients, doctors, appointments,billing
from fastapi.middleware.cors import CORSMiddleware
import logging

# Create tables
models.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="Hospital Management System")
logging.basicConfig(level=logging.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(billing.router)
 
@app.get("/")
def read_root():
    return {"msg": "Hospital Management Backend Running!"}
