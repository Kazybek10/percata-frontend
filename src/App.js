import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./LoginPage";
import ItemCard from "./ItemCard";
import ItemDetail from "./ItemDetail";
import PrivateRoute from "./PrivateRoute";

function AppInner() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("movies");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") !== "false";
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.REACT_APP_API_URL}/${activeTab}.json`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load data. Is the server running?");
        setLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#0f0f0f" : "#f5f5f5";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
  setPage(1);
  }, [activeTab, search]);

  const filtered = items
    .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const yearA = a.release_year || a.publish_year || 0;
      const yearB = b.release_year || b.publish_year || 0;
      return sortBy === "newest" ? yearB - yearA : yearA - yearB;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <BrowserRouter>
      <div className={darkMode ? "app dark" : "app light"}>
        <div className="header">
          <h1 className="title">PERCATA</h1>
          <button className="mode-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌙" : "☀️"}
          </button>
          {user && <button className="mode-btn" onClick={logout}>Logout</button>}
        </div>
        <nav className="nav">
          <button
            className={activeTab === "movies" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("movies")}
          >
            Movies
          </button>
          <button
            className={activeTab === "books" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("books")}
          >
            Books
          </button>
          <button
            className={activeTab === "recipes" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("recipes")}
          >
            Recipes
          </button>
        </nav>
        <input
          className="search"
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <>
                {loading && <p className="status">Loading...</p>}
                {error && <p className="status error">{error}</p>}
                {!loading && !error && (
                  <>
                  <div className="grid">
                    {filtered.length === 0 ? (
                      <p className="status">No results found for "{search}"</p>
                    ) : (
                      paginated.map(item => (
                        <ItemCard key={item.id} item={item} tab={activeTab} />
                      ))
                    )}
                  </div>
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
                        <span>{page} / {totalPages}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
                      </div>
                    )}
                  </>
                )}
              </>
            </PrivateRoute>
          } />
          <Route path="/:tab/:id" element={<PrivateRoute><ItemDetail /></PrivateRoute>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
