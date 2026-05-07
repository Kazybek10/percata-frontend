import { Link } from "react-router-dom";

function ItemCard({ item, tab }) {
  return (
    <Link to={`/${tab}/${item.id}`} className="card-link">
      <div className="card">
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
    </Link>
  );
}

export default ItemCard;
