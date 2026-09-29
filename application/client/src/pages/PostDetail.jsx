import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchPost, fetchRelated, resolveImage } from '../api/client.js';
import Seo from '../components/Seo.jsx';
import Loader from '../components/Loader.jsx';
import PostCard from '../components/PostCard.jsx';

const FALLBACK =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetchPost(slug)
      .then((p) => { setPost(p); return fetchRelated(slug); })
      .then((r) => setRelated(r || []))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) return <Loader />;

  if (notFound || !post) {
    return (
      <div className="container empty">
        <h3>Story not found</h3>
        <p>The article you&apos;re looking for may have moved.</p>
        <p style={{ marginTop: 16 }}>
          <Link to="/" className="btn btn-ghost">← Back home</Link>
        </p>
      </div>
    );
  }

  const cover    = resolveImage(post.featuredImage) || FALLBACK;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const tags     = Array.isArray(post.tags) ? post.tags : [];
  const initial  = (post.author || 'S')[0].toUpperCase();

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <article>
      <Seo
        title={post.title}
        description={post.metaDescription || post.excerpt}
        image={cover}
        keywords={post.metaKeywords}
        type="article"
      />

      {/* Scroll progress indicator */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      {/* Breadcrumb */}
      <div className="container" style={{ paddingTop: 22 }}>
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="bc-sep">›</span>
          <Link to={`/category/${encodeURIComponent(post.category)}`}>{post.category}</Link>
        </nav>
      </div>

      {/* Article header — contained */}
      <div className="container">
        <header className="article-head">
          <span className="chip">{post.category}</span>
          <h1>{post.title}</h1>
          {post.excerpt && (
            <p className="article-excerpt">{post.excerpt}</p>
          )}
          <div className="article-meta">
            <span>By <strong>{post.author}</strong></span>
            <span className="dot-sep">
              {post.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : ''}
            </span>
            <span className="dot-sep">{post.readingTime} min read</span>
            <span className="dot-sep">{post.views} views</span>
          </div>
        </header>
      </div>

      {/* Full-bleed featured image */}
      <div className="article-cover-fullbleed">
        <img src={cover} alt={post.imageAlt || post.title} />
      </div>

      {/* Article body */}
      <div
        className="prose container"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="container">
          <div className="tag-list">
            {tags.map((t) => (
              <Link key={t} to={`/search?q=${encodeURIComponent(t)}`} className="tag">
                #{t}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Source link */}
      {post.sourceUrl && (
        <div className="container">
          <p className="source-note">
            Inspired by trending coverage.{' '}
            <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
              View original source ↗
            </a>
          </p>
        </div>
      )}

      {/* Share bar */}
      <div className="container">
        <div className="share-bar">
          <span className="share-label">Share this story:</span>
          <a
            className="share-btn"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer" aria-label="Share on X / Twitter"
          >
            𝕏 Twitter
          </a>
          <a
            className="share-btn"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"
          >
            in LinkedIn
          </a>
          <a
            className="share-btn"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
          >
            f Facebook
          </a>
          <button
            className={`share-btn${copied ? ' copied' : ''}`}
            onClick={handleCopy}
            aria-label="Copy link"
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
      </div>

      {/* Author card */}
      <div className="container">
        <div className="author-card">
          <div className="author-avatar" aria-hidden="true">{initial}</div>
          <div className="author-info">
            <h4>{post.author || 'SEO Desk'}</h4>
            <p>Published by Trendwire · Automated editorial covering tech, culture &amp; the world.</p>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="section container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Keep reading</span>
              <h2>More in {post.category}</h2>
            </div>
          </div>
          <hr className="rule" />
          <div className="grid">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
