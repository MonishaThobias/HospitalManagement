import React, { useEffect, useState} from 'react';
import { NavLink } from 'react-router';
import '../assets/css/dashboard.css';
import API from '../services/api.js';
import AppointmentForm from '../components/AppointmentForm.jsx';

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [doctors, setDoctors] = useState([]);


  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedId = localStorage.getItem('userId');

    if (storedRole && storedId) {
      setRole(storedRole);
      setUserId(storedId);
    } else {
      const fetchUser = async () => {
        try {
          const res = await API.get('/auth/user_detail');
          setRole(res.data?.role || '');
          setUserId(res.data?.id || null);
          localStorage.setItem('role', res.data?.role || '');
          localStorage.setItem('userId', res.data?.id || '');
        } catch (err) {
          console.error("Failed to fetch user details:", err);
        }
      };
      fetchUser();
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get('/doctors');
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    if (role === 'patient') {
      fetchDoctors();
    }
  }, [role]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const resAppointments = await API.get(`/appointments/stats`);
        setAppointmentsData(resAppointments.data);

        const resPatients = await API.get(`/patients/stats`);
        setPatientData(resPatients.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    if (role === 'doctor') {
      fetchChartData();
    }
  }, [role]);


// Render role-based title dynamically
  const renderDashboardTitle = () => {
    if (role === 'user') {
      return 'Welcome to the Hospital Management System - Staff Dashboard';
    } else if (role === 'doctor') {
      return 'Welcome to the Hospital Management System - Doctor Dashboard';
    } else if (role === 'patient') {
      return 'Welcome to the Hospital Management System - Patient Dashboard';
    }
    return 'Welcome to the Hospital Management Dashboard';  // Default title
  };
  return (
    <div className="dashboard-page glass-container p-4" style={{ minHeight: '50vh', color: '#fff' }}>
      <h2>{renderDashboardTitle()}</h2>

      {/* Links for user role */}
      {role === 'user' &&  (
        <ul className="dashboard-links">
          <NavLink to="/patients">Manage Patients</NavLink>
          <NavLink to="/appointments">View Appointments</NavLink>
          <NavLink to="/profile">My Profile</NavLink>
        </ul>
      )}

      {/* Links for doctor role (4 charts) */}
      {role === 'doctor' && (
       <ul className="dashboard-links">
          <NavLink to="/patients">Manage Patients</NavLink>
          <NavLink to="/Doctors">Manage Doctors</NavLink>
          <NavLink to="/appointments">View Appointments</NavLink>
          <NavLink to="/profile">My Profile</NavLink>
        </ul>
      )}

      {/* Patient view: appointment form + doctor list */}
      {role === 'patient' && (
        <div>
          <h3>Book an Appointment</h3>
          <AppointmentForm user={userId} doctors={doctors} />

          <h3 className="mt-4">Available Doctors</h3>
          <div className="doctors-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: "auto", padding: "10px auto", justifyContent: "center" }}>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', width: '200px' }}>
                  <p><strong>Id:</strong> {doctor.id}</p>
                  <p><strong>Name:</strong> {doctor.name}</p>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>
                </div>
              ))
            ) : (
              <p>No doctors available at the moment.</p>
            )}
          </div>
        </div>
      )}

      {/* Default loading state */}
      {!role && <div>Loading dashboard...</div>}
    </div>
  );
};

export default Dashboard;
