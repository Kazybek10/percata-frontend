import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ItemDetail() {
  const { tab, id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/${tab}/${id}.json`)
      .then(res => res.json())
      .then(data => setItem(data));
  }, [tab, id]);

  if (!item) return <div className="app"><p>Loading...</p></div>;

  return (
    <div className="app">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail">
        {item.cover_url || item.poster_url ? (
          <img
            src={item.cover_url || item.poster_url}
            alt={item.title}
            className="detail-poster"
          />
        ) : null}
        <div className="detail-info">
          <h1>{item.title}</h1>
          <p className="genre">{item.genre}</p>
          <p className="year">{item.release_year || item.publish_year}</p>
          <p className="rating">★ {item.rating ? item.rating : "No rating"}</p>
          <p className="description">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
