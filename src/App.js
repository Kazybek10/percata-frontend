import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/movies.json")
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <h1 className="title">PERCATA</h1>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid">
        {filtered.map(movie => (
          <div className="card" key={movie.id}>
            {movie.poster_url && (
              <img src={movie.poster_url} alt={movie.title} className="poster" />
            )}
            <div className="card-info">
              <h2>{movie.title}</h2>
              <span className="genre">{movie.genre}</span>
              <span className="year">{movie.release_year}</span>
              <span className="rating">★ {movie.rating ? movie.rating : "No rating"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
