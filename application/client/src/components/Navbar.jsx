import { NavLink } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/category/Technology', label: 'Technology' },
  { to: '/category/IT', label: 'IT' },
  { to: '/category/Entertainment', label: 'Entertainment' },
  { to: '/category/Sports', label: 'Sports' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="brand" aria-label="Trendwire home">
          Trend<span className="dot">wire</span>
        </NavLink>
        <nav className="nav-links">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-search">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
