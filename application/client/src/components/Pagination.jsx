export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const items = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) items.push('…');
    items.push(p);
    prev = p;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous">‹</button>
      {items.map((it, i) =>
        it === '…' ? (
          <span key={`e${i}`} style={{ padding: '0 4px', color: 'var(--muted)' }}>…</span>
        ) : (
          <button
            key={it}
            className={it === page ? 'active' : ''}
            onClick={() => onChange(it)}
          >
            {it}
          </button>
        )
      )}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Next">›</button>
    </nav>
  );
}
