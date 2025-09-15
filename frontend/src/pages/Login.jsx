import { useState } from "react";
import API from "../services/api";
import { NavLink, useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const res = await API.post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", res.data.user?.username || username);
      localStorage.setItem("role", res.data.user?.role || "");
      localStorage.setItem("userId", res.data.user?.id || "");
console.log("Full login response:", res.data);

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} autoComplete="on">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mt-5"
          autoComplete="on"
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          autoComplete="on"
        /><br />
        <button type="submit" className="btn sample-btn">Login</button>
        </form>
        <p className="text-center">Don't have an account? <NavLink to="/signup" className="sign-link">Sign Up</NavLink> </p>
        

    </div>
  );
}
