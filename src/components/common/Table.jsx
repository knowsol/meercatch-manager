'use client'

export function EmptyState({ emptyContext, wrapperStyle }) {
  const { query, chips = [], onReset } = emptyContext || {}
  const hasFilter = query || chips.some(c => c.value && (Array.isArray(c.value) ? c.value.length > 0 : true))

  return (
    <div style={{ borderTop: '2px solid var(--t1)', borderBottom: '1px solid var(--bd)', ...wrapperStyle }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '200px 24px', gap: 16, textAlign: 'center',
      }}>
        {/* 로고 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Meercatch" style={{ width: 64, height: 64, objectFit: 'contain', opacity: 0.1, filter: 'invert(1)' }} />

        {/* 메인 텍스트 */}
        <div>
          {hasFilter ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)', marginBottom: 6 }}>
                {query
                  ? <><span style={{ color: 'var(--ac)', fontStyle: 'italic' }}>"{query}"</span>에 대한 검색 결과가 없습니다</>
                  : '적용된 필터에 해당하는 결과가 없습니다'
                }
              </div>
              <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>
                검색어나 필터 조건을 변경해보세요
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)', marginBottom: 6 }}>데이터가 없습니다</div>
              <div style={{ fontSize: 13, color: 'var(--t3)' }}>등록된 항목이 없습니다</div>
            </>
          )}
        </div>

        {/* 초기화 버튼 */}
        {hasFilter && onReset && (
          <button
            onClick={onReset}
            style={{
              marginTop: 4,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', fontSize: 13, borderRadius: 4,
              border: '1px solid var(--bd)', background: 'var(--bg1)',
              color: 'var(--t2)', cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--t1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg1)'; e.currentTarget.style.color = 'var(--t2)' }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            필터 초기화
          </button>
        )}
      </div>
    </div>
  )
}

function SortIcon({ dir }) {
  return (
    <span style={{ marginLeft: 4, fontSize: 11, color: dir ? 'var(--t1)' : 'var(--bd)', verticalAlign: 'middle' }}>
      {dir === 'desc' ? '↓' : '↑'}
    </span>
  )
}

export default function Table({ cols, rows, onRowClick, selectedId, emptyContext, sortKey, sortDir, onSort, actionBar, headerRight, disableInactive }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="dt-wrap">
        <EmptyState emptyContext={emptyContext} />
      </div>
    )
  }
  return (
    <div style={{ position: 'relative' }}>
      {actionBar && (
        <div style={{
          position: 'absolute', top: 0, left: 40, right: 0,
          height: 37,
          background: 'var(--bg1)',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 14px', zIndex: 10,
          borderTop: '2px solid var(--t1)',
        }}>
          {actionBar}
        </div>
      )}
      {headerRight && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          height: 37,
          display: 'flex', alignItems: 'stretch',
          zIndex: 11,
        }}>
          {headerRight}
        </div>
      )}
    <div className="dt-wrap">
      <table className="dt">
        <thead>
          <tr>
            {cols.map(c => {
              const sortable = onSort && c.sortable
              const isActive = sortKey === c.key
              return (
                <th
                  key={c.key}
                  onClick={sortable ? () => onSort(c.key) : undefined}
                  style={{
                    ...(c.width ? { width: c.width } : {}),
                    ...(c.align ? { textAlign: c.align } : {}),
                    ...(sortable ? { cursor: 'pointer', userSelect: 'none' } : {}),
                    ...(c.thStyle || {}),
                  }}
                >
                  {typeof c.label === 'function' ? c.label() : c.label}
                  {sortable && <SortIcon dir={isActive ? sortDir : null} />}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isSelected = selectedId !== undefined && selectedId === (row.id ?? i)
            const isInactive = !disableInactive && (row.status === 'inactive' || row.status === 'offline' || row.active === false) && row.policyStatus !== 'applied'
            return (
              <tr
                key={row.id || i}
                className={onRowClick ? 'clickable' : ''}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{
                  ...(isInactive ? { opacity: 0.45 } : {}),
                  ...(isSelected ? { background: 'rgba(251,146,60,0.08)', opacity: 1 } : {}),
                }}
              >
                {cols.map(c => {
                  const val = c.render ? c.render(row[c.key], row, i) : (row[c.key] != null ? row[c.key] : '—');
                  return <td key={c.key} style={c.align ? { textAlign: c.align } : undefined}>{val}</td>;
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    </div>
  )
}
