'use client'
import { useState, useRef, useEffect } from 'react'
import Table from '../../components/common/Table'
import { StatusBadge } from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'

const TYPES = ['기본', '프로', '엔터프라이즈']

const INIT = [
  { id:1,  no:20, org:'부산광역시교육청',    type:'엔터프라이즈', seats:500, used:423, startAt:'2025-01-01', endAt:'2025-12-31', status:'active'   },
  { id:2,  no:19, org:'해운대중학교',        type:'프로',        seats:100, used:87,  startAt:'2025-03-01', endAt:'2025-12-31', status:'active'   },
  { id:3,  no:18, org:'동래고등학교',        type:'프로',        seats:150, used:148, startAt:'2025-02-01', endAt:'2025-12-31', status:'active'   },
  { id:4,  no:17, org:'사직중학교',          type:'기본',        seats:50,  used:49,  startAt:'2025-01-15', endAt:'2025-06-30', status:'expired'  },
  { id:5,  no:16, org:'경남고등학교',        type:'프로',        seats:120, used:101, startAt:'2025-04-01', endAt:'2026-03-31', status:'active'   },
  { id:6,  no:15, org:'연제초등학교',        type:'기본',        seats:40,  used:35,  startAt:'2025-05-01', endAt:'2025-11-30', status:'active'   },
  { id:7,  no:14, org:'금정중학교',          type:'기본',        seats:60,  used:0,   startAt:'2025-07-01', endAt:'2025-12-31', status:'pending'  },
  { id:8,  no:13, org:'부산진고등학교',      type:'엔터프라이즈', seats:300, used:276, startAt:'2025-01-01', endAt:'2025-12-31', status:'active'   },
  { id:9,  no:12, org:'남구초등학교',        type:'기본',        seats:35,  used:30,  startAt:'2025-03-15', endAt:'2025-09-14', status:'expired'  },
  { id:10, no:11, org:'북구중학교',          type:'프로',        seats:80,  used:72,  startAt:'2025-06-01', endAt:'2026-05-31', status:'active'   },
  { id:11, no:10, org:'강서고등학교',        type:'프로',        seats:110, used:98,  startAt:'2025-02-15', endAt:'2026-02-14', status:'active'   },
  { id:12, no:9,  org:'서구초등학교',        type:'기본',        seats:45,  used:0,   startAt:'2025-08-01', endAt:'2026-01-31', status:'pending'  },
  { id:13, no:8,  org:'동구중학교',          type:'기본',        seats:55,  used:51,  startAt:'2025-01-01', endAt:'2025-06-30', status:'expired'  },
  { id:14, no:7,  org:'영도고등학교',        type:'프로',        seats:90,  used:83,  startAt:'2025-04-01', endAt:'2026-03-31', status:'active'   },
  { id:15, no:6,  org:'사하초등학교',        type:'기본',        seats:30,  used:28,  startAt:'2025-05-15', endAt:'2025-11-14', status:'active'   },
  { id:16, no:5,  org:'기장중학교',          type:'프로',        seats:70,  used:65,  startAt:'2025-03-01', endAt:'2026-02-28', status:'active'   },
  { id:17, no:4,  org:'수영고등학교',        type:'엔터프라이즈', seats:200, used:189, startAt:'2025-01-01', endAt:'2025-12-31', status:'active'   },
  { id:18, no:3,  org:'중구초등학교',        type:'기본',        seats:25,  used:0,   startAt:'2025-09-01', endAt:'2026-02-28', status:'pending'  },
  { id:19, no:2,  org:'연수중학교',          type:'프로',        seats:85,  used:79,  startAt:'2025-02-01', endAt:'2026-01-31', status:'active'   },
  { id:20, no:1,  org:'남동고등학교',        type:'프로',        seats:95,  used:88,  startAt:'2025-04-15', endAt:'2026-04-14', status:'active'   },
]

const PAGE_SIZE = 10

const STATUS_MAP = { active: '활성', expired: '만료', pending: '대기' }

const STATUS_TABS = [
  { value: '전체',  label: '전체',  count: INIT.length },
  { value: 'active',  label: '활성',  count: INIT.filter(r => r.status === 'active').length },
  { value: 'pending', label: '대기',  count: INIT.filter(r => r.status === 'pending').length },
  { value: 'expired', label: '만료',  count: INIT.filter(r => r.status === 'expired').length },
]

function UsageBar({ used, seats }) {
  const pct = seats > 0 ? Math.round((used / seats) * 100) : 0
  const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f97316' : '#22c55e'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap', minWidth: 52, textAlign: 'right' }}>
        {used}/{seats} ({pct}%)
      </span>
    </div>
  )
}

function TypeBadge({ type }) {
  const colors = {
    '기본':        { bg: 'rgba(100,116,139,0.1)', color: '#475569' },
    '프로':        { bg: 'rgba(99,102,241,0.1)',  color: '#4f46e5' },
    '엔터프라이즈': { bg: 'rgba(249,115,22,0.1)',  color: '#ea580c' },
  }
  const c = colors[type] || colors['기본']
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>
      {type}
    </span>
  )
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

export default function Licenses() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('전체')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [hiddenCols, setHiddenCols] = useState([])
  const toggleCol = key => setHiddenCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const doSearch = () => { setQuery(search); setPage(1) }

  const filtered = INIT.filter(r => {
    if (statusFilter !== '전체' && r.status !== statusFilter) return false
    if (query && !r.org.includes(query) && !r.type.includes(query)) return false
    if (dateFrom && r.endAt < dateFrom) return false
    if (dateTo && r.startAt > dateTo) return false
    return true
  })

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), 'ko')
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filtered

  const total = sorted.length
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize)

  const COLS_ALL = [
    { key: 'no',      label: 'No.' },
    { key: 'org',     label: '기관명' },
    { key: 'type',    label: '유형' },
    { key: 'usage',   label: '사용 현황' },
    { key: 'startAt', label: '시작일' },
    { key: 'endAt',   label: '만료일' },
    { key: 'status',  label: '상태' },
  ]

  const COLS = [
    { key: 'no',      label: 'No.',    width: 56,  align: 'center', render: (_, r, i) => <span style={{ color: 'var(--t3)', fontSize: 12 }}>{(page - 1) * pageSize + i + 1}</span> },
    { key: 'org',     label: '기관명', sortable: true },
    { key: 'type',    label: '유형',   width: 120, render: v => <TypeBadge type={v} /> },
    { key: 'usage',   label: '사용 현황', render: (_, row) => <UsageBar used={row.used} seats={row.seats} /> },
    { key: 'startAt', label: '시작일', sortable: true, nowrap: true },
    { key: 'endAt',   label: '만료일', sortable: true, nowrap: true, render: (v, row) => (
      <span style={{ color: row.status === 'expired' ? '#ef4444' : 'var(--t1)' }}>{v}</span>
    )},
    { key: 'status',  label: '상태',   render: v => <StatusBadge status={v === 'active' ? 'active' : v === 'pending' ? 'pending' : 'inactive'} /> },
  ].filter(c => !hiddenCols.includes(c.key))

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>설정</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            라이선스 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          {[
            { icon: <path d="M12 20V8m0 0l-4 4m4-4l4 4M5 4h14"/>, label: '가져오기' },
            { icon: <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/>, label: '내보내기' },
          ].map(({ icon, label }) => (
            <button key={label}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--t1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg1)'; e.currentTarget.style.color = 'var(--t2)' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{icon}</svg>
              {label}
            </button>
          ))}
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            발급
          </button>
        </div>
      </div>

      {/* 필터 바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS.map((tab, i) => {
            const active = statusFilter === tab.value
            return (
              <button key={tab.value} onClick={() => { setStatusFilter(tab.value); setPage(1) }}
                style={{ padding: '7px 14px', fontSize: 13, border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`, marginLeft: i === 0 ? 0 : -1, background: active ? 'var(--t1)' : 'var(--bg2)', color: active ? '#fff' : 'var(--t2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: active ? 600 : 400, position: 'relative', zIndex: active ? 1 : 0 }}>
                {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tab.count}</span>
              </button>
            )
          })}
        </div>
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />
        <DateRangePicker from={dateFrom} to={dateTo} onChange={({ from, to }) => { setDateFrom(from); setDateTo(to); setPage(1) }} />
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input className="inp"
              style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
              placeholder="기관명, 유형 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            {search && (
              <button onClick={() => { setSearch(''); setQuery(''); setPage(1) }}
                style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11 }}>×</button>
            )}
            <button onClick={doSearch}
              style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'var(--bg2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'none' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <Table
        cols={COLS}
        rows={rows}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={key => { if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc') }; setPage(1) }}
        emptyContext={{ query, chips: [], onReset: () => { setSearch(''); setQuery(''); setStatusFilter('전체'); setDateFrom(''); setDateTo(''); setPage(1) } }}
      />

      {/* 페이지네이션 */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  )
}
