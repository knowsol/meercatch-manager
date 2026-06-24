'use client'
export default function Table({ cols, rows, onRowClick }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="dt-wrap">
        <div className="empty">
          <div className="empty-icon"><svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--t3)' }}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
          <div className="empty-title">데이터가 없습니다</div>
        </div>
      </div>
    );
  }
  return (
    <div className="dt-wrap">
      <table className="dt">
        <thead>
          <tr>
            {cols.map(c => <th key={c.key} style={c.width ? { width: c.width } : {}}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className={onRowClick ? 'clickable' : ''} onClick={onRowClick ? () => onRowClick(row) : undefined}>
              {cols.map(c => {
                const val = c.render ? c.render(row[c.key], row) : (row[c.key] != null ? row[c.key] : '—');
                return <td key={c.key}>{val}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
