import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <div className="container empty" style={{ padding: '110px 0' }}>
        <span className="eyebrow">Error 404</span>
        <h3 style={{ fontSize: '2.4rem', marginTop: 10 }}>This page wandered off.</h3>
        <p>The link may be broken or the story may have moved.</p>
        <p style={{ marginTop: 20 }}>
          <Link to="/" className="btn btn-primary">← Back to home</Link>
        </p>
      </div>
    </>
  );
}
