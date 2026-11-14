import { Link } from "react-router-dom";

function ItemCard({ item, tab }) {
  const image = item.cover_url || item.poster_url;
  const year = item.release_year || item.publish_year;

  return (
    <Link to={`/${tab}/${item.id}`} className="card-link">
      <div className="card">
        {image ? <img src={image} alt={item.title} className="poster" /> : null}
        <div className="card-info">
          <h2>{item.title}</h2>
          {item.genre ? <span className="genre">{item.genre}</span> : null}
          {year ? <span className="year">{year}</span> : null}
          <span className="rating">★ {item.rating ? item.rating : "No rating"}</span>
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
