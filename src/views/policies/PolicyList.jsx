'use client'
import { useState, useRef, useEffect } from 'react'
import Table, { EmptyState } from '../../components/common/Table'
import { StatusBadge } from '../../components/common/Badge'
import { usePanel } from '../../context/PanelContext'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'
import { fmtD } from '../../components/common/helpers'
import { DUMMY } from '../../data/dummy'
import PolicyNewPanel from './PolicyNewPanel'
import PolicyDetailPanel from './PolicyDetailPanel'

// ── helpers ──────────────────────────────────────────────────────────────────

function policyDetectSummary(policy) {
  if (policy.type === '선정성') {
    const items = policy.detectionItems || []
    if (!items.length) return '—'
    return items.slice(0, 2).join(', ') + (items.length > 2 ? ' 외 ' + (items.length - 2) + '개' : '')
  }
  if (policy.type === '도박') return policy.grade ? '탐지등급 ' + policy.grade : '—'
  return '—'
}

function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={!!checked}
      onChange={e => onChange(e.target.checked)}
      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--primary)' }}
    />
  )
}

function FilterChip({ label, value, options, onChange, onRemove }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border)',
          background: value ? 'var(--primary)' : 'var(--bg2)', color: value ? '#fff' : 'var(--t2)',
          fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap'
        }}
      >
        {label}{value ? `: ${value}` : ''}
        <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100,
          background: 'var(--bg1)', border: '1px solid var(--border)',
          borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.1)', minWidth: 140, marginTop: 4
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt === value ? '' : opt); setOpen(false) }}
              style={{
                padding: '8px 14px', cursor: 'pointer', fontSize: 13,
                color: opt === value ? 'var(--primary)' : 'var(--t1)',
                background: opt === value ? 'var(--bg2)' : 'transparent'
              }}
            >{opt}</div>
          ))}
          {value && (
            <div
              onClick={() => { onChange(''); setOpen(false) }}
              style={{ padding: '8px 14px', cursor: 'pointer', fontSize: 12, color: 'var(--t3)', borderTop: '1px solid var(--border)' }}
            >초기화</div>
          )}
        </div>
      )}
    </div>
  )
}

function AddFilterButton({ filters, active, onAdd, onRemove }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const inactive = filters.filter(f => !active.includes(f.key))
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 4, border: '1px dashed var(--border)',
          background: 'transparent', color: 'var(--t3)', fontSize: 13, cursor: 'pointer'
        }}
      >+ 필터 추가</button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100,
          background: 'var(--bg1)', border: '1px solid var(--border)',
          borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.1)', minWidth: 160, marginTop: 4
        }}>
          {inactive.map(f => (
            <div
              key={f.key}
              onClick={() => { onAdd(f.key); setOpen(false) }}
              style={{ padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: 'var(--t1)' }}
            >{f.label}</div>
          ))}
          {active.map(k => {
            const f = filters.find(x => x.key === k)
            return (
              <div
                key={k}
                onClick={() => { onRemove(k); setOpen(false) }}
                style={{ padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: '#ef4444' }}
              >✕ {f?.label} 제거</div>
            )
          })}
          {inactive.length === 0 && active.length === 0 && (
            <div style={{ padding: '8px 14px', fontSize: 13, color: 'var(--t3)' }}>추가 가능한 필터 없음</div>
          )}
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

// ── constants ─────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: '전체',  label: '전체' },
  { value: '활성',  label: '활성' },
  { value: '비활성', label: '비활성' },
]

const FILTER_DEFS = [
  { key: 'type',  label: '탐지 유형', options: ['선정성', '도박'] },
]

const COLS_ALL = [
  { key: 'type',         label: '탐지 유형', width: '90px' },
  { key: 'name',         label: '정책 이름' },
  { key: 'desc',         label: '설명' },
  { key: '_detect',      label: '탐지 내용' },
  { key: 'appliedCount', label: '적용 그룹', width: '90px' },
  { key: 'active',       label: '상태',      width: '80px' },
  { key: 'updatedAt',    label: '수정일' },
  { key: '_verdict',     label: '판정',      width: '80px' },
]

// ── main component ────────────────────────────────────────────────────────────

export default function PolicyList() {
  const { openPanel } = usePanel()

  // filters
  const [statusFilter, setStatusFilter] = useState('전체')
  const [dateFrom,     setDateFrom]     = useState(null)
  const [dateTo,       setDateTo]       = useState(null)
  const [search,       setSearch]       = useState('')
  const [query,        setQuery]        = useState('')
  const [activeChips,  setActiveChips]  = useState([])
  const [chipValues,   setChipValues]   = useState({})

  // table
  const [selected,     setSelected]     = useState(new Set())
  const [sortKey,      setSortKey]      = useState('')
  const [sortDir,      setSortDir]      = useState('asc')
  const [page,         setPage]         = useState(1)
  const [pageSize,     setPageSize]     = useState(25)
  const [verdicts,     setVerdicts]     = useState({})

  // col toggle — hiddenCols pattern
  const [hiddenCols, setHiddenCols] = useState([])

  function toggleCol(key) {
    setHiddenCols(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key])
  }

  function doSearch() { setQuery(search); setPage(1) }

  // reset page on filter change
  useEffect(() => setPage(1), [statusFilter, dateFrom, dateTo, query, chipValues])

  function setVerdict(policyId, verdict) {
    setVerdicts(prev => ({ ...prev, [policyId]: verdict }))
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function addChip(key)    { setActiveChips(p => [...p, key]) }
  function removeChip(key) { setActiveChips(p => p.filter(k => k !== key)); setChipValues(p => { const n = { ...p }; delete n[key]; return n }) }
  function setChip(key, v) { setChipValues(p => ({ ...p, [key]: v })) }

  // ── filtering ──────────────────────────────────────────────────────────────
  let rows = [...(DUMMY.policies || [])]

  // count per status tab
  const allRows = [...(DUMMY.policies || [])]
  const tabCounts = {
    '전체':  allRows.length,
    '활성':  allRows.filter(r => r.active === true).length,
    '비활성': allRows.filter(r => r.active === false).length,
  }

  if (statusFilter === '활성')   rows = rows.filter(r => r.active === true)
  if (statusFilter === '비활성') rows = rows.filter(r => r.active === false)

  if (dateFrom && dateTo) {
    rows = rows.filter(r => {
      const d = r.updatedAt ? new Date(r.updatedAt) : null
      return d && d >= dateFrom && d <= dateTo
    })
  }

  if (chipValues.type) rows = rows.filter(r => r.type === chipValues.type)

  if (query) rows = rows.filter(r => r.name?.toLowerCase().includes(query.toLowerCase()))

  // ── sorting ────────────────────────────────────────────────────────────────
  if (sortKey) {
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }

  const total    = rows.length
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize)
  const pageIds  = pageRows.map(r => r.policyId)
  const allSel   = pageIds.length > 0 && pageIds.every(id => selected.has(id))
  const someSel  = pageIds.some(id => selected.has(id))

  function toggleAll(v) {
    setSelected(prev => {
      const next = new Set(prev)
      pageIds.forEach(id => v ? next.add(id) : next.delete(id))
      return next
    })
  }

  function toggleRow(id) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function openDetail(row) {
    openPanel(
      <PolicyDetailPanel
        policyId={row.policyId}
        verdict={verdicts[row.policyId]}
        onSetVerdict={v => setVerdict(row.policyId, v)}
      />
    )
  }

  // ── column definitions ─────────────────────────────────────────────────────
  const COLS = [
    {
      key: '_check', label: () => (
        <Checkbox checked={allSel} indeterminate={!allSel && someSel} onChange={toggleAll} />
      ), width: '40px', noSort: true,
      render: (_, r) => (
        <Checkbox checked={selected.has(r.policyId)} onChange={() => toggleRow(r.policyId)} />
      )
    },
    { key: 'type',         label: '탐지 유형', width: '90px' },
    { key: 'name',         label: '정책 이름', render: (v, r) => (
      <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); openDetail(r) }}>{v}</a>
    )},
    { key: 'desc',         label: '설명' },
    { key: '_detect',      label: '탐지 내용', noSort: true, render: (_, r) => (
      <span style={{ fontSize: 13, color: '#374151' }}>{policyDetectSummary(r)}</span>
    )},
    { key: 'appliedCount', label: '적용 그룹', width: '90px', render: v => v + '개' },
    { key: 'active',       label: '상태',      width: '80px', render: v => <StatusBadge status={v ? 'active' : 'inactive'} /> },
    { key: 'updatedAt',    label: '수정일',    render: v => fmtD(v) },
    { key: '_verdict',     label: '판정',      width: '80px', noSort: true, render: (_, r) => {
      const v = verdicts[r.policyId]
      if (!v) return <span style={{ color: 'var(--t3)', fontSize: 12 }}>미판정</span>
      return <span style={{ color: v === '정탐' ? '#10b981' : '#ef4444', fontSize: 12, fontWeight: 600 }}>{v}</span>
    }},
  ]

  const hiddenSet = new Set(hiddenCols)
  const activeCols = COLS.filter(c => c.key === '_check' || !hiddenSet.has(c.key))

  const selCount = selected.size

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px' }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            정책 관리 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
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
          <button
            onClick={() => openPanel(<PolicyNewPanel />)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            정책 추가
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS.map((tab, i) => {
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
                {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tabCounts[tab.value]}</span>
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

        {/* Dynamic filter chips */}
        {activeChips.map(key => {
          const def = FILTER_DEFS.find(f => f.key === key)
          if (!def) return null
          return (
            <FilterChip
              key={key}
              label={def.label}
              value={chipValues[key] || ''}
              options={def.options}
              onChange={v => setChip(key, v)}
              onRemove={() => removeChip(key)}
            />
          )
        })}

        <AddFilterButton
          filters={FILTER_DEFS}
          active={activeChips}
          onAdd={addChip}
          onRemove={removeChip}
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

      {/* TABLE */}
      <Table
        cols={activeCols}
        rows={pageRows}
        selectedId={null}
        onRowClick={openDetail}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        actionBar={selCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--bg2)', borderRadius: 4, fontSize: 13 }}>
            <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{selCount}개 선택됨</span>
            <button
              onClick={() => setSelected(new Set())}
              style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', fontSize: 12, cursor: 'pointer' }}
            >선택 해제</button>
          </div>
        )}
        emptyContext={<EmptyState message="정책이 없습니다." />}
      />

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
