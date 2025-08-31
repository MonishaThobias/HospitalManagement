# app/main.py
from fastapi import FastAPI
from . import models, database
from .routes import users, patients, doctors, appointments, billing
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

# Create tables
models.Base.metadata.create_all(bind=database.engine)

# App setup
app = FastAPI(title="Hospital Management System")
logging.basicConfig(level=logging.DEBUG)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(billing.router)

# Test root
@app.get("/")
def read_root():
    return {"msg": "Hospital Management Backend Running!"}

# Run only locally
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
