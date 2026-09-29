import { useEffect, useState } from 'react';
import { fetchPosts, fetchCategories } from '../api/client.js';
import Seo from '../components/Seo.jsx';
import Loader from '../components/Loader.jsx';
import FeaturedHero from '../components/FeaturedHero.jsx';
import CategoryNav from '../components/CategoryNav.jsx';
import PostCard from '../components/PostCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts({ page, limit: 9 })
      .then((res) => {
        setPosts(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading && posts.length === 0) return <Loader />;

  const featured = page === 1 ? posts[0] : null;
  const rest = page === 1 ? posts.slice(1) : posts;

  return (
    <>
      <Seo
        title="Automated Insights on Tech, Business & Culture"
        description="Fresh, SEO-optimized stories on technology, IT, entertainment, sports and business — updated automatically, every day."
      />

      {posts.length === 0 ? (
        <div className="container empty">
          <h3>No stories yet</h3>
          <p>The editorial pipeline hasn’t published anything here. Check back soon.</p>
        </div>
      ) : (
        <>
          {featured && <FeaturedHero post={featured} />}

          <section className="section container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Explore</span>
                <h2>Browse by section</h2>
              </div>
            </div>
            <CategoryNav categories={categories} />
          </section>

          <section className="section container" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <div>
                <span className="eyebrow">Latest</span>
                <h2>Fresh off the wire</h2>
              </div>
            </div>
            <hr className="rule" />
            <div className="grid">
              {rest.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={setPage}
            />
          </section>

          <Newsletter />
        </>
      )}
    </>
  );
}
