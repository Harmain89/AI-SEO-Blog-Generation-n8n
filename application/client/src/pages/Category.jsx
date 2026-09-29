import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPosts, fetchCategories } from '../api/client.js';
import Seo from '../components/Seo.jsx';
import Loader from '../components/Loader.jsx';
import CategoryNav from '../components/CategoryNav.jsx';
import PostCard from '../components/PostCard.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Category() {
  const { name } = useParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => setPage(1), [name]);

  useEffect(() => {
    setLoading(true);
    fetchPosts({ category: name, page, limit: 9 })
      .then((res) => {
        setPosts(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [name, page]);

  return (
    <>
      <Seo title={`${name} stories`} description={`The latest ${name} articles on Trendwire.`} />
      <div className="page-head container">
        <span className="eyebrow">Section</span>
        <h1>{name}</h1>
        <p>{pagination.total ?? posts.length} stories in this section</p>
      </div>

      <section className="section container" style={{ paddingTop: 22 }}>
        <CategoryNav categories={categories} active={name} />
        <hr className="rule" style={{ marginTop: 26 }} />

        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <div className="empty">
            <h3>Nothing here yet</h3>
            <p>No published stories in “{name}” so far.</p>
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
