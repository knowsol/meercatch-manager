'use client'
import { useState, useRef, useEffect } from 'react'
import Table from '../../components/common/Table'
import { StatusBadge } from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'

const INIT = [
  { id:1, no:10, type:'탐지 알림',   channel:'이메일',  target:'admin@meercatch.kr',        active:true,  createdAt:'2025-06-01' },
  { id:2, no:9,  type:'탐지 알림',   channel:'SMS',    target:'010-1234-5678',              active:true,  createdAt:'2025-06-01' },
  { id:3, no:8,  type:'시스템 알림', channel:'이메일',  target:'ops@meercatch.kr',           active:true,  createdAt:'2025-06-01' },
  { id:4, no:7,  type:'보고서 알림', channel:'이메일',  target:'report@meercatch.kr',        active:false, createdAt:'2025-05-20' },
  { id:5, no:6,  type:'탐지 알림',   channel:'웹훅',   target:'https://hooks.example.com/1', active:true,  createdAt:'2025-05-15' },
  { id:6, no:5,  type:'시스템 알림', channel:'SMS',    target:'010-9876-5432',              active:false, createdAt:'2025-05-10' },
  { id:7, no:4,  type:'보고서 알림', channel:'웹훅',   target:'https://hooks.example.com/2', active:true,  createdAt:'2025-05-01' },
  { id:8, no:3,  type:'탐지 알림',   channel:'이메일',  target:'sec@meercatch.kr',           active:true,  createdAt:'2025-04-20' },
  { id:9, no:2,  type:'시스템 알림', channel:'이메일',  target:'admin2@meercatch.kr',        active:true,  createdAt:'2025-04-10' },
  { id:10,no:1,  type:'보고서 알림', channel:'SMS',    target:'010-5555-1234',              active:true,  createdAt:'2025-04-01' },
]

const PAGE_SIZE = 10

const TYPES = ['탐지 알림', '시스템 알림', '보고서 알림']
const CHANNELS = ['이메일', 'SMS', '웹훅']

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

export default function Notifications() {
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
    if (statusFilter === '활성' && !r.active) return false
    if (statusFilter === '비활성' && r.active) return false
    if (query && !r.type.includes(query) && !r.target.includes(query) && !r.channel.includes(query)) return false
    if (dateFrom && r.createdAt < dateFrom) return false
    if (dateTo && r.createdAt > dateTo) return false
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

  const STATUS_TABS = [
    { label: '전체',  value: '전체',  count: INIT.length },
    { label: '활성',  value: '활성',  count: INIT.filter(r => r.active).length },
    { label: '비활성', value: '비활성', count: INIT.filter(r => !r.active).length },
  ]

  const COLS_ALL = [
    { key: 'no',        label: 'No.' },
    { key: 'type',      label: '알림 유형' },
    { key: 'channel',   label: '채널' },
    { key: 'target',    label: '수신 대상' },
    { key: 'active',    label: '상태' },
    { key: 'createdAt', label: '등록일' },
  ]

  const COLS = [
    { key: 'no',        label: 'No.',      width: 56, align: 'center', render: (_, r, i) => <span style={{ color: 'var(--t3)', fontSize: 12 }}>{(page - 1) * pageSize + i + 1}</span> },
    { key: 'type',      label: '알림 유형', sortable: true },
    { key: 'channel',   label: '채널',     sortable: true },
    { key: 'target',    label: '수신 대상', render: v => <span style={{ color: 'var(--t2)', fontSize: 12 }}>{v}</span> },
    { key: 'active',    label: '상태',     render: v => <StatusBadge status={v ? 'active' : 'inactive'} /> },
    { key: 'createdAt', label: '등록일',   sortable: true, nowrap: true },
  ].filter(c => !hiddenCols.includes(c.key))

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>설정</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            알림 설정 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
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
            추가
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
              placeholder="알림 유형, 수신 대상 검색"
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
