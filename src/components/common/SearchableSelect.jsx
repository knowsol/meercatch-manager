'use client'
import { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ value, onChange, options, placeholder = '선택', style }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const filtered = options.filter(o => o.label.includes(search));
  const selected = options.find(o => String(o.value) === String(value));

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0, ...style }}>
      <button
        type="button"
        className="inp"
        style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}
        onClick={() => { setOpen(o => !o); setSearch(''); }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: selected ? 'var(--t1)' : 'var(--t3)', fontSize: 13 }}>
          {selected ? selected.label : placeholder}
        </span>
        <span style={{ fontSize: 9, color: 'var(--t3)', flexShrink: 0 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: '100%', zIndex: 300,
          background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,.2)', overflow: 'hidden',
        }}>
          <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--bd)' }}>
            <input
              ref={inputRef}
              className="inp"
              style={{ width: '100%', fontSize: 12, padding: '5px 8px' }}
              placeholder="학교명 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            <div
              style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', color: !value ? 'var(--ac)' : 'var(--t2)', fontWeight: !value ? 600 : 400 }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => { onChange(''); setOpen(false); }}
            >{placeholder}</div>
            {filtered.map(o => (
              <div
                key={o.value}
                style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', color: String(o.value) === String(value) ? 'var(--ac)' : 'var(--t1)', fontWeight: String(o.value) === String(value) ? 600 : 400 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => { onChange(o.value); setOpen(false); }}
              >{o.label}</div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '10px 12px', fontSize: 13, color: 'var(--t3)' }}>검색 결과 없음</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
