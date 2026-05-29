import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 24 }}>
      <h2>Profile</h2>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>ID:</strong> {user?.id || user?.sub}</p>
      <button className="nav-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}
