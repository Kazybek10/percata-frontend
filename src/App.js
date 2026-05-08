import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ItemCard from "./ItemCard";
import ItemDetail from "./ItemDetail";

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("movies");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3001/${activeTab}.json`)
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

const filtered = items
  .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => {
    const yearA = a.release_year || a.publish_year || 0;
    const yearB = b.release_year || b.publish_year || 0;
    return sortBy === "newest" ? yearB - yearA : yearA - yearB;
  });

  return (
    <BrowserRouter>
      <div className="app">
        <h1 className="title">PERCATA</h1>
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
            <>
              {loading && <p className="status">Loading...</p>}
              {error && <p className="status error">{error}</p>}
              {!loading && !error && (
                <div className="grid">
                  {filtered.length === 0 ? (
                    <p className="status">No results found for "{search}"</p>
                  ) : (
                    filtered.map(item => (
                      <ItemCard key={item.id} item={item} tab={activeTab} />
                    ))
                  )}
                </div>
              )}
            </>
          } />
          <Route path="/:tab/:id" element={<ItemDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
