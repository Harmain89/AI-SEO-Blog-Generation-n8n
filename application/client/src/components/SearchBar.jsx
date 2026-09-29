import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form className="search-box" onSubmit={submit} role="search">
      <input
        type="search"
        placeholder="Search stories…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search stories"
      />
      <button type="submit" aria-label="Search">→</button>
    </form>
  );
}
