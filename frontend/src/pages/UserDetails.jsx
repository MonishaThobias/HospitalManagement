import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function UserDetails() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/user_detail");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

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

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  if (!user) return <div>Loading user details...</div>;

  return (
    <div className="user-details">
      <h2>User Details</h2>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{user.id}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Role</th>
            <td>{user.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}