'use client'
import { useState, useRef, useEffect } from 'react'
import { useToastCtx } from '../../components/layout/Layout'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'

const CATS = ['교육', '포털', '언론', '공공', '기타']

const INIT = [
  { no:34682, url:'https://whitelist.com',         cat:'교육', name:'whitelist',         registeredAt:'2025.07.22. 오후 03:30:26' },
  { no:34681, url:'https://www.edit.com',           cat:'교육', name:'수정용',            registeredAt:'2025.07.22. 오후 03:16:02' },
  { no:34680, url:'https://www.keris.or.kr',        cat:'교육', name:'한국교육학술정보원', registeredAt:'2025.07.11. 오후 03:59:32' },
  { no:34679, url:'https://www.naver.com',          cat:'포털', name:'네이버',            registeredAt:'2025.07.11. 오후 03:59:32' },
  { no:34678, url:'www.test1000011.com',            cat:'언론', name:'test888',           registeredAt:'2025.06.27. 오후 02:00:00' },
  { no:34677, url:'www.yeonam.es.kr',               cat:'공공', name:'울산연암초등학교',   registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34676, url:'www.yurimyouth.or.kr',           cat:'공공', name:'경기도용인시청소년육성재단유림?', registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34675, url:'younghyeon-p.gne.go.kr',         cat:'공공', name:'영현초등학교',      registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34674, url:'www.yeonbuk.ms.kr',              cat:'공공', name:'서울연북중학교',     registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34673, url:'www.yuseong.go.kr',              cat:'공공', name:'대전광역시유성구',   registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34672, url:'www.youngdo.go.kr',              cat:'공공', name:'부산영도구청',       registeredAt:'2025.06.25. 오후 05:34:04' },
  { no:34671, url:'www.youtube.com',                cat:'교육', name:'유튜브',            registeredAt:'2025.06.24. 오전 10:00:00' },
  { no:34670, url:'www.ebs.co.kr',                  cat:'교육', name:'EBS',              registeredAt:'2025.06.24. 오전 09:00:00' },
  { no:34669, url:'www.khan.co.kr',                 cat:'언론', name:'경향신문',          registeredAt:'2025.06.23. 오후 02:30:00' },
  { no:34668, url:'www.hani.co.kr',                 cat:'언론', name:'한겨레',            registeredAt:'2025.06.23. 오후 02:00:00' },
  { no:34667, url:'www.moe.go.kr',                  cat:'공공', name:'교육부',            registeredAt:'2025.06.22. 오전 09:00:00' },
  { no:34666, url:'www.neis.go.kr',                 cat:'공공', name:'나이스',            registeredAt:'2025.06.22. 오전 08:30:00' },
  { no:34665, url:'www.daum.net',                   cat:'포털', name:'다음',              registeredAt:'2025.06.21. 오후 03:00:00' },
  { no:34664, url:'www.google.com',                 cat:'포털', name:'구글',              registeredAt:'2025.06.21. 오후 02:00:00' },
  { no:34663, url:'www.wikipedia.org',              cat:'교육', name:'위키피디아',         registeredAt:'2025.06.20. 오전 11:00:00' },
]

const STATUS_TABS_DATA = [
  { value: '전체', label: '전체' },
  ...CATS.map(c => ({ value: c, label: c })),
]

const FILTER_DEFS = [
  { key: 'cat', label: '서비스 분류', options: CATS },
]

const COLS_ALL = [
  { key: 'no',           label: 'No.',       width: '80px' },
  { key: 'url',          label: 'URL',        render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'cat',          label: '서비스 분류', width: '100px' },
  { key: 'name',         label: '서비스명',   width: '200px', render: v => <span style={{ fontSize: 13 }}>{v.length > 18 ? v.slice(0,18)+'...' : v}</span> },
  { key: 'registeredAt', label: '등록일',     width: '180px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
]

// ── helper components ──────────────────────────────────────────────

function Checkbox({ checked, indeterminate, onChange, onClick, disabled }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate }, [indeterminate])
  return (
    <div style={{ position: 'relative', width: 18, height: 18, flexShrink: 0, cursor: disabled ? 'not-allowed' : 'pointer' }} onClick={onClick}>
      <input ref={ref} type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: disabled ? 'not-allowed' : 'pointer', margin: 0 }}
      />
      <div style={{
        width: 18, height: 18, borderRadius: 4,
        border: `1.5px solid ${disabled ? 'var(--bd)' : checked ? '#111827' : 'var(--bd)'}`,
        background: disabled ? 'var(--bg3)' : checked ? '#111827' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', transition: 'all 0.1s',
      }}>
        {indeterminate && !checked
          ? <div style={{ width: 8, height: 1.5, background: '#fff', borderRadius: 1 }} />
          : checked && <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginTop: -1 }}><polyline points="20 6 9 17 4 12"/></svg>
        }
      </div>
    </div>
  )
}

function FilterChip({ label, value, options, onChange, onRemove }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:'inline-flex', alignItems:'center', gap:4, height:32, padding:'0 10px', border:'1px solid var(--border)', borderRadius:6, background: value ? 'var(--primary-subtle, #eef2ff)' : 'var(--bg)', fontSize:12, cursor:'pointer', color: value ? 'var(--primary)' : 'var(--t2)', whiteSpace:'nowrap' }}>
        {label}{value ? `: ${value}` : ''}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {value && (
        <button onClick={onRemove}
          style={{ position:'absolute', right:-6, top:-6, width:16, height:16, borderRadius:'50%', border:'none', background:'var(--t3)', color:'#fff', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>
          x
        </button>
      )}
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,.12)', zIndex:200, minWidth:140, padding:'4px 0' }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt === value ? '' : opt); setOpen(false) }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'7px 14px', border:'none', background: opt === value ? 'var(--primary-subtle, #eef2ff)' : 'transparent', color: opt === value ? 'var(--primary)' : 'var(--t1)', fontSize:13, cursor:'pointer' }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AddFilterButton({ defs, activeKeys, onAdd }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  const available = defs.filter(d => !activeKeys.includes(d.key))
  if (!available.length) return null
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:'inline-flex', alignItems:'center', gap:4, height:32, padding:'0 10px', border:'1px dashed var(--border)', borderRadius:6, background:'transparent', fontSize:12, cursor:'pointer', color:'var(--t3)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        필터 추가
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,.12)', zIndex:200, minWidth:140, padding:'4px 0' }}>
          {available.map(d => (
            <button key={d.key} onClick={() => { onAdd(d.key); setOpen(false) }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'7px 14px', border:'none', background:'transparent', color:'var(--t1)', fontSize:13, cursor:'pointer' }}>
              {d.label}
            </button>
          ))}
        </div>
      )}
    </div>
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

function KebabMenu({ onDelete, onEdit, toast }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)
  const btnRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  function handleOpen(e) {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.right - 120 })
    }
    setOpen(o => !o)
  }
  return (
    <div ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <button ref={btnRef} onClick={handleOpen}
        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', fontSize:18, padding:0, lineHeight:1 }}>
        ...
      </button>
      {open && (
        <div style={{ position:'fixed', top: pos.top, left: pos.left, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, boxShadow:'0 4px 16px rgba(0,0,0,.12)', zIndex:9999, minWidth:120, padding:'4px 0' }}>
          <button onClick={() => { setOpen(false); if (onEdit) onEdit(); else toast('수정 기능 준비 중입니다.') }}
            style={{ display:'block', width:'100%', textAlign:'left', padding:'7px 14px', border:'none', background:'transparent', color:'var(--t1)', fontSize:13, cursor:'pointer' }}>
            수정
          </button>
          <button onClick={() => { setOpen(false); if (onDelete) onDelete(); else toast('삭제 기능 준비 중입니다.') }}
            style={{ display:'block', width:'100%', textAlign:'left', padding:'7px 14px', border:'none', background:'transparent', color:'var(--danger, #e53e3e)', fontSize:13, cursor:'pointer' }}>
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────

export default function WhitelistPage() {
  const toast = useToastCtx()
  const [statusFilter, setStatusFilter] = useState('전체')
  const [search, setSearch]             = useState('')
  const [query, setQuery]               = useState('')
  const [dateFrom, setDateFrom]         = useState(null)
  const [dateTo, setDateTo]             = useState(null)
  const [filterValues, setFilterValues] = useState({})
  const [activeFilters, setActiveFilters] = useState([])
  const [page, setPage]                 = useState(1)
  const [pageSize, setPageSize]         = useState(10)
  const [checked, setChecked]           = useState(new Set())
  const [hiddenCols, setHiddenCols]     = useState([])
  const [sortKey, setSortKey]           = useState(null)
  const [sortDir, setSortDir]           = useState('asc')

  const toggleCol = key => {
    setHiddenCols(h => h.includes(key) ? h.filter(k => k !== key) : [...h, key])
  }

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const doSearch = () => { setQuery(search); setPage(1) }

  const filtered = INIT.filter(r => {
    if (statusFilter !== '전체' && r.cat !== statusFilter) return false
    if (query && !r.url.includes(query) && !r.name.includes(query) && !r.cat.includes(query)) return false
    for (const key of activeFilters) {
      const val = filterValues[key]
      if (val && r[key] !== val) return false
    }
    return true
  })

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? ''
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
      })
    : filtered

  const total = filtered.length
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize)

  const allOnPage = pageRows.map(r => r.no)
  const allChecked = allOnPage.length > 0 && allOnPage.every(id => checked.has(id))
  const someChecked = allOnPage.some(id => checked.has(id)) && !allChecked

  const toggleAll = () => {
    setChecked(prev => {
      const next = new Set(prev)
      if (allChecked) allOnPage.forEach(id => next.delete(id))
      else allOnPage.forEach(id => next.add(id))
      return next
    })
  }
  const toggleOne = (id, e) => {
    e?.stopPropagation()
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const visibleCols = COLS_ALL.filter(c => !hiddenCols.includes(c.key))

  const cols = [
    {
      key: '_chk', label: <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />,
      width: '44px', render: (_, row) => <Checkbox checked={checked.has(row.no)} onChange={() => {}} onClick={e => toggleOne(row.no, e)} />
    },
    ...visibleCols,
    {
      key: '_act', label: '', width: '50px',
      render: (_, row) => <KebabMenu toast={toast} onEdit={() => toast(`${row.name} 수정`)} onDelete={() => toast(`${row.name} 삭제`)} />
    },
  ]

  const actionBar = checked.size > 0 && (
    <>
      <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600 }}>{checked.size}개 선택됨</span>
      <div style={{ width: 1, height: 12, background: 'var(--bd)' }} />
      <button
        onClick={() => { toast('선택 항목을 삭제합니다.'); setChecked(new Set()) }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, borderRadius: 4, border: '1px solid var(--bd)', background: 'transparent', color: '#ef4444', cursor: 'pointer', transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        삭제
      </button>
      <button
        onClick={() => setChecked(new Set())}
        style={{ fontSize: 12, color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
      >취소</button>
    </>
  )

  const addFilter = key => {
    if (!activeFilters.includes(key)) setActiveFilters(f => [...f, key])
  }
  const removeFilter = key => {
    setActiveFilters(f => f.filter(k => k !== key))
    setFilterValues(v => { const n = { ...v }; delete n[key]; return n })
    setPage(1)
  }

  const tabCounts = STATUS_TABS_DATA.map(tab => {
    if (tab.value === '전체') return total
    return INIT.filter(r => r.cat === tab.value).length
  })

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 설정</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            화이트리스트 관리 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onClick={() => toast('항목 추가 기능은 준비 중입니다.')}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            항목 추가
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS_DATA.map((tab, i) => {
            const active = statusFilter === tab.value
            return (
              <button key={tab.value} onClick={() => { setStatusFilter(tab.value); setPage(1) }}
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
                {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tabCounts[i]}</span>
              </button>
            )
          })}
        </div>

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 날짜 범위 피커 */}
        <DateRangePicker from={dateFrom} to={dateTo} onChange={({ from, to }) => { setDateFrom(from); setDateTo(to); setPage(1) }} />

        {/* Active filter chips */}
        {activeFilters.map(key => {
          const def = FILTER_DEFS.find(d => d.key === key)
          if (!def) return null
          return (
            <FilterChip key={key} label={def.label} value={filterValues[key] || ''} options={def.options}
              onChange={v => { setFilterValues(fv => ({ ...fv, [key]: v })); setPage(1) }}
              onRemove={() => removeFilter(key)} />
          )
        })}

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
                style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11 }}>x</button>
            )}
            <button onClick={doSearch}
              style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Table cols={cols} rows={pageRows}
        sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
        actionBar={actionBar} />

      {/* PAGINATION FOOTER */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  )
}
