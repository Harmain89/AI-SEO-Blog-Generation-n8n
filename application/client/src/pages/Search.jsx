import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPosts } from '../api/client.js';
import Seo from '../components/Seo.jsx';
import Loader from '../components/Loader.jsx';
import PostCard from '../components/PostCard.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => setPage(1), [q]);

  useEffect(() => {
    if (!q) {
      setPosts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchPosts({ q, page, limit: 9 })
      .then((res) => {
        setPosts(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [q, page]);

  return (
    <>
      <Seo title={`Search: ${q}`} />
      <div className="page-head container">
        <span className="eyebrow">Search</span>
        <h1>“{q}”</h1>
        <p>{loading ? 'Searching…' : `${pagination.total ?? posts.length} results`}</p>
      </div>

      <section className="section container" style={{ paddingTop: 22 }}>
        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <div className="empty">
            <h3>No matches</h3>
            <p>Try a different keyword or browse a section instead.</p>
          </div>
        ) : (
          <>
            <div className="grid">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
