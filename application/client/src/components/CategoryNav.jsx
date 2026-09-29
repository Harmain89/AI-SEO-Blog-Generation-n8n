import { Link } from 'react-router-dom';

export default function CategoryNav({ categories, active }) {
  if (!categories?.length) return null;
  return (
    <div className="cat-row">
      <Link to="/" className={`cat-pill ${!active ? 'active' : ''}`}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.category}
          to={`/category/${encodeURIComponent(c.category)}`}
          className={`cat-pill ${active === c.category ? 'active' : ''}`}
        >
          {c.category}
          <span className="count">{c.count}</span>
        </Link>
      ))}
    </div>
  );
}
