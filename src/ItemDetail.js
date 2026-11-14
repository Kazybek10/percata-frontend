import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function ItemDetail() {
  const { tab, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/${tab}/${id}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load this item.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab, id]);

  const image = item && (item.cover_url || item.poster_url);
  const year = item && (item.release_year || item.publish_year);

  return (
    <div className="app">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && item && (
        <div className="detail">
          {image ? (
            <img src={image} alt={item.title} className="detail-poster" />
          ) : null}
          <div className="detail-info">
            <h1>{item.title}</h1>
            {item.genre ? <p className="genre">{item.genre}</p> : null}
            {year ? <p className="year">{year}</p> : null}
            <p className="rating">★ {item.rating ? item.rating : "No rating"}</p>
            {item.description ? (
              <p className="description">{item.description}</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;
