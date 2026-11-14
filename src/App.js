import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ItemCard from "./ItemCard";
import ItemDetail from "./ItemDetail";
import NotFoundPage from "./NotFoundPage";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function AppInner() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("movies");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [genre, setGenre] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [globalResults, setGlobalResults] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") !== "false";
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/${activeTab}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load data. Is the API running?");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#0f0f0f" : "#f5f5f5";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setPage(1);
    setGenre("");
  }, [activeTab]);

  useEffect(() => {
    setPage(1);
  }, [search, genre]);

  useEffect(() => {
    const query = globalQuery.trim();

    if (!query) {
      setGlobalResults([]);
      setGlobalLoading(false);
      return;
    }

    let cancelled = false;
    setGlobalLoading(true);

    const timer = setTimeout(() => {
      Promise.all(
        ["movies", "books", "recipes"].map(tab =>
          fetch(`${API_URL}/${tab}.json`)
            .then(res => (res.ok ? res.json() : []))
            .then(data =>
              Array.isArray(data) ? data.map(item => ({ ...item, tab })) : []
            )
        )
      )
        .then(results => {
          if (cancelled) return;
          const all = results
            .flat()
            .filter(item =>
              (item.title || "").toLowerCase().includes(query.toLowerCase())
            );
          setGlobalResults(all);
          setGlobalLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setGlobalResults([]);
          setGlobalLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [globalQuery]);

  const filtered = items
    .filter(item => (item.title || "").toLowerCase().includes(search.toLowerCase()))
    .filter(item => !genre || item.genre === genre)
    .sort((a, b) => {
      const yearA = a.release_year || a.publish_year || 0;
      const yearB = b.release_year || b.publish_year || 0;
      return sortBy === "newest" ? yearB - yearA : yearA - yearB;
    });

  const genres = [...new Set(items.map(item => item.genre).filter(Boolean))].sort();
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="header">
        <h1 className="title">PERCATA</h1>
        <button className="mode-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </button>
        <input
          className="search"
          style={{ maxWidth: 220 }}
          placeholder="Search everything..."
          value={globalQuery}
          onChange={e => setGlobalQuery(e.target.value)}
        />
      </div>

      {!globalQuery && (
        <>
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
          <select
            className="sort-select"
            value={genre}
            onChange={e => setGenre(e.target.value)}
          >
            <option value="">All genres</option>
            {genres.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </>
      )}

      <Routes>
        <Route
          path="/"
          element={
            globalQuery ? (
              <div className="grid" style={{ marginTop: 24 }}>
                {globalLoading && <p className="status">Searching...</p>}
                {!globalLoading && globalResults.length === 0 && (
                  <p className="status">No results for "{globalQuery}"</p>
                )}
                {globalResults.map(item => (
                  <ItemCard key={`${item.tab}-${item.id}`} item={item} tab={item.tab} />
                ))}
              </div>
            ) : (
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
                        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                          Prev
                        </button>
                        <span>
                          {page} / {totalPages}
                        </span>
                        <button
                          onClick={() => setPage(p => p + 1)}
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )
          }
        />
        <Route path="/:tab/:id" element={<ItemDetail />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <footer className="footer">
        <span>© 2026 Percata</span>
        <span>Movies · Books · Recipes</span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
