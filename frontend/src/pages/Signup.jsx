import React, { useState } from "react";
import API from "../services/api"; // Make sure this is the same as in Login.jsx
import { useNavigate,NavLink } from "react-router";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form); // Adjust endpoint as per your backend
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <select
  name="role"
  value={form.role}
  onChange={handleChange}
  required
  className="form-select mt-5 mb-5"
>
  <option value="user">User</option>
  <option value="patient">Patient</option>
  <option value="doctor">Doctor</option>
</select>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="form-control"
        /><br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-control"
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="form-control"
        /><br />
        <button type="submit" className="btn">Sign Up</button>
      </form>
        <p className="text-center">Already have an account? Please <NavLink to="/" className="sign-link">Login</NavLink> here.</p>

    </div>
  );
};

export default Signup;