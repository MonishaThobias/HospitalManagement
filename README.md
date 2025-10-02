<img width="1294" height="580" alt="Screenshot (03)" src="https://github.com/user-attachments/assets/338b07e8-ab67-411d-ad98-96fcb8d1f800" />

🏥 **Hospital Management System**

A full-stack Hospital Management System built with:

Backend: FastAPI
 + Python

Frontend: React

Database: (e.g., PostgreSQL – update as per your setup)

This system helps manage hospital operations like patient records, appointments, doctors, staff, and billing.

🚀** Features**
👩‍⚕️** For Patients**

Register and update personal details

Book, view, and cancel appointments

View prescriptions & medical history

🧑‍⚕️** For Doctors**

Manage appointments

View and update patient records

Add prescriptions

🏥** For Admin/Staff**

Manage doctors, patients, staff

Handle billing and reports

Dashboard with hospital statistics

🛠️** Tech Stack**

Frontend: React, Axios, TailwindCSS/Bootstrap

Backend: FastAPI, Pydantic, SQLAlchemy

Database: PostgreSQL/MySQL/SQLite

Authentication: JWT (JSON Web Tokens)

📂 **Project Structure**
hospital-management-system/
│
├── backend/                # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Entry point
│   │   ├── models/         # Database models
│   │   ├── routers/        # API routes (patients, doctors, auth, etc.)
│   │   ├── schemas/        # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── database.py     # DB connection
│   └── requirements.txt    # Backend dependencies
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # App pages (Dashboard, Login, etc.)
│   │   ├── services/       # API calls via Axios
│   │   └── App.js          # Root React file
│   └── package.json        # Frontend dependencies
│
└── README.md               # Project documentation

⚙️ Installation
🔹 Backend (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload


API will run at 👉 http://127.0.0.1:8000

**Docs available at:**

Swagger UI: http://127.0.0.1:8000/docs

ReDoc: http://127.0.0.1:8000/redoc

🔹 Frontend (React)
cd frontend
npm install
npm start


App will run at 👉 http://localhost:3000
