import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <h2>404 — Page not found</h2>
      <button className="nav-btn" onClick={() => navigate("/")}>Go home</button>
    </div>
  );
}
