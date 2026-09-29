import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { resolveImage } from '../api/client.js';

const FALLBACK =
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

export default function PostCard({ post }) {
  const img = resolveImage(post.featuredImage) || FALLBACK;
  return (
    <article className="card">
      <Link to={`/blog/${post.slug}`} className="card-media" aria-label={post.title}>
        <img src={img} alt={post.imageAlt || post.title} loading="lazy" />
      </Link>
      <div className="card-body">
        <span className="chip">{post.category}</span>
        <h3>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-foot">
          <span>{post.author}</span>
          <span className="dot-sep">
            {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : ''}
          </span>
          <span className="dot-sep">{post.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}
