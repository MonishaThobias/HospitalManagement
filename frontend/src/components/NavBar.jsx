import { NavLink, useNavigate } from "react-router";
import '../assets/css/navbar.css';
import logo from '../assets/images/h-logo.jpg';
import { FaUser } from 'react-icons/fa';
import { useEffect, useState } from "react";

export default function Navbar({ username, onLogout }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Role fetched from localStorage:", storedRole);

    setRole(storedRole || "");
    setLoading(false);
  }, []);

  const handleLogout = () => {
    onLogout?.();
    localStorage.clear();
    navigate("/");
  };

  const getNavLinkclassName = ({ isActive }) =>
    isActive ? "navLink active" : "navLink";

  // Menu items by role
  const roleMenus = {
    doctor: [
      { to: "/patients", label: "Patients" },
      { to: "/doctors", label: "Doctors" },
      { to: "/appointments", label: "Appointments" },
    ],
    patient: [
      { to: "/appointments", label: "Appointments" },
    
    ],
    user: [
      { to: "/patients", label: "Patients" },
      { to: "/appointments", label: "Appointments" },
        {to:"/billing", label:"Billing"},
    ],
    default: [], // Fallback if role not found
  };

  if (loading) {
    return (
      <nav className="navbar">
        <img src={logo} alt="Hospital Logo" width={80} height={80} style={{ borderRadius: "100%" }} />
        <div>Loading...</div>
      </nav>
    );
  }

  return (
    <>
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="/dashboard">    
        <img src={logo} alt="Hospital Logo" width={80} height={80} style={{ borderRadius: "100%" }} />
</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mx-auto mb-2 mb-lg-0 leftLinks">
        <NavLink to="/dashboard" className={getNavLinkclassName}>Dashboard</NavLink>

        {/* Render role-based menus */}
        {(roleMenus[role] || roleMenus.default).map((item) => (
          <NavLink key={item.to} to={item.to} className={getNavLinkclassName}>
            {item.label}
          </NavLink>
        ))}
      </ul>
      <form className="d-flex rightLinks">
        <span className="username">
          <FaUser color="white" /> {username}
        </span>
        <button onClick={handleLogout} className="logoutbtn btn">Logout</button>
      </form>
    </div>
  </div>
</nav>

    </>
  );
}
