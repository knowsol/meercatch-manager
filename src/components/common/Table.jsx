export default function Table({ cols, rows, onRowClick }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="dt-wrap">
        <div className="empty">
          <div className="empty-icon">📭</div>
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
