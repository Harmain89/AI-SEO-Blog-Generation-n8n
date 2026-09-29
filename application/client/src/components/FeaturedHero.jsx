import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { resolveImage } from '../api/client.js';

const FALLBACK =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80';

export default function FeaturedHero({ post }) {
  if (!post) return null;
  const img = resolveImage(post.featuredImage) || FALLBACK;
  return (
    <section className="hero container">
      <div className="hero-grid">
        <Link to={`/blog/${post.slug}`} className="hero-media" aria-label={post.title}>
          <img src={img} alt={post.imageAlt || post.title} />
        </Link>
        <div className="hero-body">
          <span className="eyebrow">Featured · {post.category}</span>
          <h1>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h1>
          <p>{post.excerpt}</p>
          <div className="hero-meta">
            <span>{post.author}</span>
            <span className="dot-sep">
              {post.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : ''}
            </span>
            <span className="dot-sep">{post.readingTime} min read</span>
          </div>
          <div style={{ marginTop: 22 }}>
            <Link to={`/blog/${post.slug}`} className="btn btn-primary">
              Read the story →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
