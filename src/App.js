import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/movies.json")
      .then(res => res.json())
      .then(data => setMovies(data));
  }, []);

  return (
    <div className="app">
      <h1 className="title">PERCATA</h1>
      <div className="grid">
        {movies.map(movie => (
          <div className="card" key={movie.id}>
            {movie.poster_url && (
              <img src={movie.poster_url} alt={movie.title} className="poster" />
            )}
            <div className="card-info">
              <h2>{movie.title}</h2>
              <span className="genre">{movie.genre}</span>
              <span className="year">{movie.release_year}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;