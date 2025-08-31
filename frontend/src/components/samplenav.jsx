import React, { useEffect, useState } from "react";

const NavBar = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">🏥 Dashboard</div>

      <ul className="menu">
        {/* Common Menus */}
        <li><a href="/dashboard">Home</a></li>
        <li><a href="/profile">My Profile</a></li>

        {/* Role-specific Menus */}
        {role === "user" && (
          <>
            <li><a href="/manage-doctors">Manage Doctors</a></li>
            <li><a href="/manage-patients">Manage Patients</a></li>
            <li><a href="/appointments">View All Appointments</a></li>
          </>
        )}

        {role === "doctor" && (
          <>
            <li><a href="/appointments">My Appointments</a></li>
            <li><a href="/patients">My Patients</a></li>
          </>
        )}

        {role === "patient" && (
          <>
            <li><a href="/book-appointment">Book Appointment</a></li>
            <li><a href="/my-reports">My Reports</a></li>
          </>
        )}
      </ul>

      <button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}>
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
