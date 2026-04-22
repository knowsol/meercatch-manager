'use client'

const PAGE_SIZE = 15;

function btnStyle(active) {
  return {
    minWidth: 30, padding: '4px 8px', borderRadius: 6,
    border: '1px solid ' + (active ? 'var(--ac)' : 'var(--bd)'),
    background: active ? 'var(--ac)' : 'var(--bg)',
    color: active ? '#fff' : 'var(--t1)',
    cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
    lineHeight: 1.4,
  };
}

function navStyle(disabled) {
  return {
    padding: '4px 10px', borderRadius: 6,
    border: '1px solid var(--bd)', background: 'var(--bg)',
    color: disabled ? 'var(--t3)' : 'var(--t1)',
    cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 14,
  };
}

export default function Pagination({ page, total, pageSize = PAGE_SIZE, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const getPages = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, 5);
      else start = Math.max(1, end - 4);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPages();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 16, paddingBottom: 4 }}>
      <button onClick={() => onChange(page - 1)} disabled={page === 1} style={navStyle(page === 1)}>‹</button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onChange(1)} style={btnStyle(page === 1)}>1</button>
          {pages[0] > 2 && <span style={{ color: 'var(--t3)', fontSize: 13, padding: '0 2px' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)} style={btnStyle(p === page)}>{p}</button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span style={{ color: 'var(--t3)', fontSize: 13, padding: '0 2px' }}>…</span>}
          <button onClick={() => onChange(totalPages)} style={btnStyle(page === totalPages)}>{totalPages}</button>
        </>
      )}

      <button onClick={() => onChange(page + 1)} disabled={page === totalPages} style={navStyle(page === totalPages)}>›</button>
    </div>
  );
}
