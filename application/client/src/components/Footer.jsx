import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">Trend<span className="dot" style={{ color: 'var(--accent)' }}>wire</span></div>
            <p>
              Fresh, SEO-optimized stories on technology, IT, entertainment, sports and business —
              curated and written automatically, every day.
            </p>
          </div>
          <div>
            <h4>Sections</h4>
            <div className="footer-links">
              <Link to="/category/Technology">Technology</Link>
              <Link to="/category/IT">IT</Link>
              <Link to="/category/Entertainment">Entertainment</Link>
              <Link to="/category/Sports">Sports</Link>
              <Link to="/category/Business">Business</Link>
            </div>
          </div>
          <div>
            <h4>More</h4>
            <div className="footer-links">
              <Link to="/">Latest</Link>
              <Link to="/about">About</Link>
              <a href="/sitemap.xml">Sitemap</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Trendwire. All rights reserved.</span>
          <span>Powered by an automated n8n + AI editorial pipeline.</span>
        </div>
      </div>
    </footer>
  );
}
