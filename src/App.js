import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("movies");

  useEffect(() => {
    fetch(`http://localhost:3001/${activeTab}.json`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [activeTab]);

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
      <div className="grid">
        {filtered.map(item => (
          <div className="card" key={item.id}>
            {item.cover_url || item.poster_url ? (
              <img
                src={item.cover_url || item.poster_url}
                alt={item.title}
                className="poster"
              />
            ) : null}
            <div className="card-info">
              <h2>{item.title}</h2>
              <span className="genre">{item.genre}</span>
              <span className="year">{item.release_year || item.publish_year}</span>
              <span className="rating">★ {item.rating ? item.rating : "No rating"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
