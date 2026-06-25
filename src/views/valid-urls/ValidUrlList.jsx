'use client'
import { useState, useRef, useEffect } from 'react'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'

// ── Data ────────────────────────────────────────────────────────────────────
const DOMAINS_ADULT = ['xen9qorvi.life','smtb-0041.com','pdr-888.com','rv-0303.com','abc-3602.com','cms-8901.com','nd-0013.com','ag-3636.com','dtr-8225.com','888-pi.com','rb-003.com','miu1.casino','nrt-99.com','fox-4949.com','hot-vod99.com','adult-xyz.net','sxxx-1234.com','nude-leak.org','red-tube99.com','xvideos-kr.com','av18plus.net','sexfilm-hd.com','mature-lady.net','erotik-movie.com','18adult.kr'];
const DOMAINS_GAMBLE = ['casino77.kr','jackpot-bet.com','sportslive-bet.net','toto-king99.com','powerball-win.com','holdem-poker.net','baccarat-live.kr','slot-galaxy.com','bet365-mirror.net','1xbet-kr.com','casinoguru-kr.com','poker-star99.net','lotto-plus.kr','sports-king.net','wonbet.com','doubleu-casino.com','ace-casino99.kr','royal-casino.net','grand-slot.com','lucky-poker.kr','spin-win.com','mega-jackpot.net','diamond-bet.kr','crown-casino99.net','vip-holdem.com'];
const PATHS = ['/','/?code=8942','/?code=7784','/?ref=9596','/?code=8522','/?code=6500','/?code=0117','/?ref=9596','/login.asp','/?b=mtcatch','/?ref=4521','/main.php','/index.html','/home','/?from=kr'];
const ADULT_LONG_PATH = '/?gad_source=1&gad_campaignid=236187932888&gbraid=0AAAABDCABc-1LnqXjwvQxYbCxHMMTjXxG&gclid=CjwKCAjw857RBhAgEiwAI-1yKOu4IReKlNFvK3LL8I3fUcKOV80i6sEV6kelInIGC9BwuefdEYm3mBoCeSEQAvD_BwE';

function genUrls() {
  const items = [];
  let no = 250;
  for (let i = 0; i < 125; i++) {
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(9 + (i % 8)).padStart(2, '0');
    const min = String(i % 60).padStart(2, '0');
    items.push({ no: no--, domain: DOMAINS_ADULT[i % DOMAINS_ADULT.length], protocol: 'HTTP', port: 80, path: i === 0 ? ADULT_LONG_PATH : PATHS[i % PATHS.length], dbType: '선정성', accuracy: 99, registeredAt: `2026-06-${day} ${hour}:${min}`, id: `u-a-${i}` });
  }
  for (let i = 0; i < 125; i++) {
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(9 + (i % 8)).padStart(2, '0');
    const min = String(i % 60).padStart(2, '0');
    items.push({ no: no--, domain: DOMAINS_GAMBLE[i % DOMAINS_GAMBLE.length], protocol: 'HTTP', port: 80, path: PATHS[i % PATHS.length], dbType: '도박성', accuracy: 99, registeredAt: `2026-06-${day} ${hour}:${min}`, id: `u-g-${i}` });
  }
  return items;
}

function genSha256() {
  const hex = '0123456789abcdef';
  return Array.from({ length: 249 }, (_, i) => {
    let hash = '';
    for (let j = 0; j < 64; j++) hash += hex[(i * 31 + j * 17) % 16];
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(9 + (i % 8)).padStart(2, '0');
    const min = String(i % 60).padStart(2, '0');
    return { no: 249 - i, hash, dbType: i % 3 === 0 ? '선정성' : '도박성', accuracy: 95 + (i % 5), registeredAt: `2026-06-${day} ${hour}:${min}`, id: `sha-${i}` };
  });
}

const WHITELIST = [
  { no: 11, domain: 'youtube.com',    protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-01 09:00', id: 'wl-1' },
  { no: 10, domain: 'google.com',     protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-01 09:01', id: 'wl-2' },
  { no: 9,  domain: 'naver.com',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-01 09:02', id: 'wl-3' },
  { no: 8,  domain: 'kakao.com',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-02 09:00', id: 'wl-4' },
  { no: 7,  domain: 'daum.net',       protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-02 09:01', id: 'wl-5' },
  { no: 6,  domain: 'namu.wiki',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-03 10:00', id: 'wl-6' },
  { no: 5,  domain: 'bing.com',       protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-04 11:00', id: 'wl-7' },
  { no: 4,  domain: 'wikipedia.org',  protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-05 09:30', id: 'wl-8' },
  { no: 3,  domain: 'ebs.co.kr',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-10 08:00', id: 'wl-9' },
  { no: 2,  domain: 'khan.co.kr',     protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-15 14:00', id: 'wl-10' },
  { no: 1,  domain: 'moe.go.kr',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-06-01 09:00', id: 'wl-11' },
];

const URL_DATA = genUrls();
const SHA_DATA = genSha256();

// ── Filter definitions per tab ───────────────────────────────────────────────
const URL_FILTER_DEFS = [
  { key: 'protocol', label: 'Protocol', options: ['HTTP', 'HTTPS'] },
  { key: 'dbType',   label: 'DB Type',  options: ['선정성', '도박성'] },
];
const SHA_FILTER_DEFS = [
  { key: 'dbType', label: 'DB Type', options: ['선정성', '도박성'] },
];
const WHITE_FILTER_DEFS = [
  { key: 'protocol', label: 'Protocol', options: ['HTTP', 'HTTPS'] },
];

// ── Helper components ────────────────────────────────────────────────────────
function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={!!checked}
      onChange={e => onChange(e.target.checked)}
      style={{ cursor: 'pointer', width: 15, height: 15, accentColor: 'var(--accent)' }}
    />
  );
}

function FilterChip({ label, value, options, onChange, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn btn-outline btn-sm"
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '3px 8px' }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ color: 'var(--t3)' }}>{label}:</span>
        <span style={{ fontWeight: 600 }}>{value || '전체'}</span>
        <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
        <span
          style={{ marginLeft: 2, opacity: 0.4, cursor: 'pointer', fontWeight: 700 }}
          onClick={e => { e.stopPropagation(); onRemove(); }}
        >×</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--bg2)',
          border: '1px solid var(--border)', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)',
          zIndex: 100, minWidth: 120, padding: '4px 0',
        }}>
          {['전체', ...options].map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt === '전체' ? '' : opt); setOpen(false); }}
              style={{
                padding: '6px 12px', fontSize: 13, cursor: 'pointer',
                background: (value || '전체') === opt ? 'var(--accent)' : 'transparent',
                color: (value || '전체') === opt ? '#fff' : 'var(--t1)',
              }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddFilterButton({ defs, activeKeys, onAdd }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const available = defs.filter(d => !activeKeys.includes(d.key));
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  if (available.length === 0) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn btn-outline btn-sm"
        style={{ fontSize: 12, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> 필터 추가
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--bg2)',
          border: '1px solid var(--border)', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)',
          zIndex: 100, minWidth: 140, padding: '4px 0',
        }}>
          {available.map(d => (
            <div
              key={d.key}
              onClick={() => { onAdd(d.key); setOpen(false); }}
              style={{ padding: '6px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{d.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function ColToggle({ cols, hiddenCols, onToggle }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ bottom: 0, left: 0 })
  const ref = useRef(null)
  const btnRef = useRef(null)
  const toggleable = cols.filter(c => c.label && typeof c.label === 'string')
  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  function handleToggleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ bottom: window.innerHeight - rect.top + 4, left: rect.left })
    }
    setOpen(o => !o)
  }
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button ref={btnRef} onClick={handleToggleOpen} title="열 표시 설정"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: 'none', background: 'none', color: hiddenCols.length > 0 ? 'var(--t1)' : 'var(--t3)', cursor: 'pointer', position: 'relative', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
        onMouseLeave={e => e.currentTarget.style.color = hiddenCols.length > 0 ? 'var(--t1)' : 'var(--t3)'}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ marginTop: 4 }}>
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        {hiddenCols.length > 0 && <span style={{ position: 'absolute', top: 4, right: -2, width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />}
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: dropPos.bottom, left: dropPos.left, zIndex: 9999, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.12)', minWidth: 160, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px 6px', fontSize: 11, color: 'var(--t3)', fontWeight: 600, borderBottom: '1px solid var(--bd)' }}>열 표시 설정</div>
          {toggleable.map(c => {
            const hidden = hiddenCols.includes(c.key)
            return (
              <div key={c.key} onClick={() => onToggle(c.key)}
                style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${!hidden ? '#111827' : 'var(--bd)'}`, background: !hidden ? '#111827' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!hidden && <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </span>
                <span style={{ color: hidden ? 'var(--t3)' : 'var(--t1)' }}>{c.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function KebabMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', fontSize: 16, color: 'var(--t2)', borderRadius: 4 }}
      >⋮</button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--bg2)',
          border: '1px solid var(--border)', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,.15)',
          zIndex: 200, minWidth: 120, padding: '4px 0',
        }}>
          {items.map((item, i) => (
            <div
              key={i}
              onClick={e => { e.stopPropagation(); item.onClick(); setOpen(false); }}
              style={{
                padding: '7px 14px', fontSize: 13, cursor: 'pointer', color: item.danger ? '#ef4444' : 'var(--t1)',
                borderTop: item.divider ? '1px solid var(--border)' : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{item.label}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function DelBtn() {
  return <button className="btn btn-d btn-xs">삭제</button>;
}

// ── Column definitions ───────────────────────────────────────────────────────
const urlCols = [
  { key: 'no',           label: '#',        width: '52px' },
  { key: 'domain',       label: 'Domain',   width: '165px', render: v => <a href="#" style={{ color: '#3b82f6', fontSize: 13 }} onClick={e => e.preventDefault()}>{v}</a> },
  { key: 'protocol',     label: 'Protocol', width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'port',         label: 'Port',     width: '55px',  render: v => <span style={{ fontFamily: 'inherit', fontSize: 13 }}>{v}</span> },
  { key: 'path',         label: 'Path',                     render: v => <span style={{ fontSize: 12, color: 'var(--t2)', wordBreak: 'break-all' }}>{v}</span> },
  { key: 'dbType',       label: 'DB Type',  width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'accuracy',     label: '정확도',   width: '70px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'registeredAt', label: '등록일',   width: '140px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
  { key: '_del',         label: '삭제',     width: '60px',  render: () => <DelBtn /> },
];

const shaCols = [
  { key: 'no',           label: '#',       width: '52px' },
  { key: 'hash',         label: 'SHA256',             render: v => <span style={{ fontFamily: 'inherit', fontSize: 11, color: 'var(--t2)', wordBreak: 'break-all' }}>{v}</span> },
  { key: 'dbType',       label: 'DB Type', width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'accuracy',     label: '정확도',  width: '70px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'registeredAt', label: '등록일',  width: '140px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
  { key: '_del',         label: '삭제',    width: '60px',  render: () => <DelBtn /> },
];

const whiteCols = [
  { key: 'no',           label: '#',        width: '52px' },
  { key: 'domain',       label: 'Domain',   width: '165px', render: v => <a href="#" style={{ color: '#3b82f6', fontSize: 13 }} onClick={e => e.preventDefault()}>{v}</a> },
  { key: 'protocol',     label: 'Protocol', width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'port',         label: 'Port',     width: '55px',  render: v => <span style={{ fontFamily: 'inherit', fontSize: 13 }}>{v}</span> },
  { key: 'path',         label: 'Path',     width: '100px', render: v => <span style={{ fontSize: 12, color: 'var(--t2)' }}>{v}</span> },
  { key: 'dbType',       label: 'DB Type',  width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'registeredAt', label: '등록일',   width: '140px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
  { key: '_del',         label: '삭제',     width: '60px',  render: () => <DelBtn /> },
];

// ── Main component ───────────────────────────────────────────────────────────
export default function ValidUrlList() {
  const [tab, setTab]           = useState('url');
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch]     = useState('');
  const [query, setQuery]       = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo]     = useState(null);
  const [filters, setFilters]   = useState({});
  const [activeFilterKeys, setActiveFilterKeys] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hiddenCols, setHiddenCols]   = useState([]);
  const [sortKey, setSortKey]   = useState('');
  const [sortDir, setSortDir]   = useState('asc');

  const TABS = [
    { id: 'url',       label: 'URL 목록 (Text)', count: URL_DATA.length },
    { id: 'sha256',    label: 'SHA256 목록',      count: SHA_DATA.length },
    { id: 'whitelist', label: '화이트리스트',      count: WHITELIST.length },
  ];

  const filterDefs =
    tab === 'url'       ? URL_FILTER_DEFS :
    tab === 'sha256'    ? SHA_FILTER_DEFS :
    WHITE_FILTER_DEFS;

  const baseCols =
    tab === 'url'       ? urlCols :
    tab === 'sha256'    ? shaCols :
    whiteCols;

  const visibleCols = baseCols.filter(c => !hiddenCols.includes(c.key));

  function toggleCol(key) {
    setHiddenCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  function switchTab(id) {
    setTab(id);
    setPage(1);
    setFilters({});
    setActiveFilterKeys([]);
    setSearch('');
    setQuery('');
    setSelectedIds([]);
    setSortKey('');
    setSortDir('asc');
  }

  function doSearch() {
    setQuery(search);
    setPage(1);
  }

  const baseData =
    tab === 'url'       ? URL_DATA :
    tab === 'sha256'    ? SHA_DATA :
    WHITELIST;

  let filtered = baseData;

  // Apply active filter chips
  for (const key of activeFilterKeys) {
    const val = filters[key];
    if (val) filtered = filtered.filter(r => r[key] === val);
  }

  // Apply search
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    filtered = filtered.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }

  // Apply date range (registeredAt field, prefix match YYYY-MM-DD)
  if (dateFrom || dateTo) {
    filtered = filtered.filter(r => {
      const d = r.registeredAt ? r.registeredAt.slice(0, 10) : '';
      if (dateFrom && d < dateFrom) return false;
      if (dateTo   && d > dateTo)   return false;
      return true;
    });
  }

  // Sort
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Checkbox helpers
  const pagedIds = paged.map(r => r.id);
  const allChecked = pagedIds.length > 0 && pagedIds.every(id => selectedIds.includes(id));
  const someChecked = pagedIds.some(id => selectedIds.includes(id));

  function toggleAll(checked) {
    if (checked) setSelectedIds(prev => [...new Set([...prev, ...pagedIds])]);
    else setSelectedIds(prev => prev.filter(id => !pagedIds.includes(id)));
  }

  function toggleRow(id, checked) {
    if (checked) setSelectedIds(prev => [...prev, id]);
    else setSelectedIds(prev => prev.filter(i => i !== id));
  }

  // Prepend checkbox column
  const checkboxCol = {
    key: '_chk',
    label: <Checkbox checked={allChecked} indeterminate={!allChecked && someChecked} onChange={toggleAll} />,
    width: '40px',
    render: (_, row) => (
      <Checkbox
        checked={selectedIds.includes(row.id)}
        onChange={checked => toggleRow(row.id, checked)}
      />
    ),
  };

  const finalCols = [checkboxCol, ...visibleCols];

  // ActionBar for bulk actions
  const actionBar = selectedIds.length > 0 ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--t2)' }}>{selectedIds.length}개 선택됨</span>
      <button className="btn btn-d btn-sm" onClick={() => setSelectedIds([])}>선택 삭제</button>
      <button className="btn btn-outline btn-sm" onClick={() => setSelectedIds([])}>선택 해제</button>
    </div>
  ) : null;

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  // STATUS_TABS for filter bar (tab switcher acts as status tabs here)
  const STATUS_TABS = TABS.map(t => ({ value: t.id, label: t.label, count: t.count }));

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 설정</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            검증 URL 현황 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            가져오기
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            내보내기
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            추가
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS.map((t, i) => {
            const active = tab === t.value
            return (
              <button key={t.value} onClick={() => switchTab(t.value)}
                style={{
                  padding: '7px 14px', fontSize: 13,
                  border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`,
                  marginLeft: i === 0 ? 0 : -1,
                  background: active ? 'var(--t1)' : 'var(--bg2)',
                  color: active ? '#fff' : 'var(--t2)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  fontWeight: active ? 600 : 400,
                  position: 'relative', zIndex: active ? 1 : 0,
                }}>
                {t.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{t.count}</span>
              </button>
            )
          })}
        </div>

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 날짜 범위 피커 */}
        <DateRangePicker from={dateFrom} to={dateTo} onChange={({ from, to }) => { setDateFrom(from); setDateTo(to); setPage(1) }} />

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* Active filter chips */}
        {activeFilterKeys.map(key => {
          const def = filterDefs.find(d => d.key === key);
          if (!def) return null;
          return (
            <FilterChip
              key={key}
              label={def.label}
              value={filters[key] || ''}
              options={def.options}
              onChange={val => { setFilters(f => ({ ...f, [key]: val })); setPage(1); }}
              onRemove={() => {
                setActiveFilterKeys(ks => ks.filter(k => k !== key));
                setFilters(f => { const n = { ...f }; delete n[key]; return n; });
                setPage(1);
              }}
            />
          );
        })}

        <AddFilterButton
          defs={filterDefs}
          activeKeys={activeFilterKeys}
          onAdd={key => setActiveFilterKeys(ks => [...ks, key])}
        />

        {/* 검색 입력 (우측 정렬) */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input className="inp"
              style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
              placeholder="검색어 입력"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            {search && (
              <button onClick={() => { setSearch(''); setQuery(''); setPage(1) }}
                style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11 }}>×</button>
            )}
            <button onClick={doSearch}
              style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      {actionBar}

      {/* TABLE */}
      <Table
        cols={finalCols}
        rows={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />

      {/* PAGINATION FOOTER */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={baseCols} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  );
}
