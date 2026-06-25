'use client'
import { useState, useRef, useEffect } from 'react'
import { DUMMY } from '../../data/dummy'
import { useSchoolScope } from '../../hooks/useSchoolScope'
import Table, { EmptyState } from '../../components/common/Table'
import { PanelLayout } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/Badge'
import { usePanel } from '../../context/PanelContext'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format, parse, isValid } from 'date-fns'

/* ── SVG Line Chart ── */
function LineChart({ data }) {
  const W = 820, H = 160
  const pad = { t: 20, r: 20, b: 30, l: 36 }
  const iW = W - pad.l - pad.r
  const iH = H - pad.t - pad.b
  const max = Math.max(...data.map(d => d.v), 1)
  const x = i => pad.l + (i / (data.length - 1)) * iW
  const y = v => pad.t + iH - (v / max) * iH
  const pts = data.map((d, i) => `${x(i)},${y(d.v)}`).join(' ')
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + iH} stroke="#e2e8f0" strokeWidth={1} />
      <line x1={pad.l} y1={pad.t + iH} x2={pad.l + iW} y2={pad.t + iH} stroke="#e2e8f0" strokeWidth={1} />
      <text x={pad.l - 4} y={pad.t + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{max}</text>
      <text x={pad.l - 4} y={pad.t + iH} textAnchor="end" fontSize={10} fill="#94a3b8">0</text>
      {data.map((d, i) => i % 2 === 0 && (
        <text key={i} x={x(i)} y={pad.t + iH + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">{d.label}</text>
      ))}
      <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth={2} />
      {data.map((d, i) => d.v > 0 && (
        <circle key={i} cx={x(i)} cy={y(d.v)} r={3} fill="#3b82f6" />
      ))}
    </svg>
  )
}

/* ── Stat boxes ── */
function Stats({ items }) {
  return (
    <div style={{ display: 'flex', background: '#f8fafc', borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', marginTop: 12 }}>
      {items.map((it, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center', padding: '18px 8px', borderRight: i < items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{it.label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>
            {it.value} <span style={{ fontSize: 15, fontWeight: 400 }}>건</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Two-month group table ── */
function GroupTable({ title, prev, curr, rows, cols }) {
  return (
    <div style={{ marginTop: 16 }}>
      {title && <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{title}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[{ label: prev, side: 'prev' }, { label: curr, side: 'curr' }].map(({ label, side }) => (
          <div key={side}>
            <div style={{ fontSize: 12, color: '#3b82f6', marginBottom: 6 }}>{label}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '6px 8px', color: '#94a3b8', fontWeight: 500, width: 28 }}></th>
                  <th style={{ padding: '6px 8px', color: '#94a3b8', fontWeight: 500, textAlign: 'left' }}>그룹</th>
                  {cols.map(c => (
                    <th key={c.key} style={{ padding: '6px 8px', color: '#94a3b8', fontWeight: 500, textAlign: 'center' }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px', color: '#94a3b8' }}>{i + 1}</td>
                    <td style={{ padding: '6px 8px' }}>{r.group || '-'}</td>
                    {cols.map(c => {
                      const val = r[side + '_' + c.key]
                      return (
                        <td key={c.key} style={{ padding: '6px 8px', textAlign: 'center', color: val > 0 ? '#ef4444' : '#94a3b8' }}>
                          {c.key === 'time' ? val + '분' : val}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Section card ── */
function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '20px 24px', marginBottom: 16 }}>
      {title && <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  )
}

/* ── Data helpers ── */
function computeMonthData(detections, yearMonth) {
  const filtered = detections.filter(d => d.detectedAt.startsWith(yearMonth))
  const byDay = {}
  filtered.forEach(d => {
    const day = parseInt(d.detectedAt.split('-')[2])
    byDay[day] = (byDay[day] || 0) + 1
  })
  return { filtered, byDay }
}

function topGroups(detections, n = 5) {
  const byGroup = {}
  detections.forEach(d => {
    if (!byGroup[d.groupName]) byGroup[d.groupName] = { det: 0, action: 0 }
    byGroup[d.groupName].det++
    if (d.status === 'confirmed') byGroup[d.groupName].action++
  })
  const sorted = Object.entries(byGroup).sort((a, b) => b[1].det - a[1].det).slice(0, n)
  while (sorted.length < n) sorted.push([null, { det: 0, action: 0 }])
  return sorted
}

/* ── Helper components (TableGuide pattern) ── */

function SingleDayPicker({ value, onChange, placeholder = '날짜 선택' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const parsed = value ? parse(value, 'yyyy-MM-dd', new Date()) : null
  const valid = parsed && isValid(parsed)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          height: 32, padding: '0 10px', border: '1px solid var(--bd)', borderRadius: 4,
          background: '#fff', fontSize: 13, color: valid ? 'var(--t1)' : 'var(--t3)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {valid ? format(parsed, 'yyyy.MM.dd') : placeholder}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 36, left: 0, zIndex: 200, background: '#fff', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.1)' }}>
          <DayPicker
            locale={ko}
            mode="single"
            selected={valid ? parsed : undefined}
            onSelect={d => { onChange(d ? format(d, 'yyyy-MM-dd') : ''); setOpen(false) }}
          />
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, value, options, onChange, onRemove }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const display = Array.isArray(value) && value.length > 0 ? value.join(', ') : (value || '전체')
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          height: 32, padding: '0 10px', border: '1px solid var(--bd)', borderRadius: 4,
          background: '#fff', fontSize: 13, color: 'var(--t1)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ color: 'var(--t3)' }}>{label}:</span> {display}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 36, left: 0, zIndex: 200, background: '#fff', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.1)', minWidth: 160, padding: 4 }}>
          {options.map(opt => {
            const selected = Array.isArray(value) ? value.includes(opt) : value === opt
            return (
              <div
                key={opt}
                onClick={() => {
                  if (Array.isArray(value)) {
                    onChange(selected ? value.filter(v => v !== opt) : [...value, opt])
                  } else {
                    onChange(selected ? '' : opt)
                    setOpen(false)
                  }
                }}
                style={{
                  padding: '7px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 4,
                  background: selected ? 'var(--ac-light, #eff6ff)' : 'transparent',
                  color: selected ? 'var(--ac)' : 'var(--t1)',
                }}
              >
                {opt}
              </div>
            )
          })}
          <div style={{ borderTop: '1px solid var(--bd)', marginTop: 4, paddingTop: 4 }}>
            <div onClick={() => { onChange(Array.isArray(value) ? [] : ''); setOpen(false) }} style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--t3)', borderRadius: 4 }}>초기화</div>
            {onRemove && <div onClick={() => { onRemove(); setOpen(false) }} style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', color: '#ef4444', borderRadius: 4 }}>필터 제거</div>}
          </div>
        </div>
      )}
    </div>
  )
}

function AddFilterButton({ defs, active, onAdd }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const available = defs.filter(d => !active.includes(d.key))
  if (!available.length) return null
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          height: 32, padding: '0 10px', border: '1px dashed var(--bd)', borderRadius: 4,
          background: 'transparent', fontSize: 13, color: 'var(--t3)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        필터 추가
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 36, left: 0, zIndex: 200, background: '#fff', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.1)', minWidth: 160, padding: 4 }}>
          {available.map(d => (
            <div key={d.key} onClick={() => { onAdd(d.key); setOpen(false) }} style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 4, color: 'var(--t1)' }}>
              {d.label}
            </div>
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

function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate }, [indeterminate])
  return (
    <input ref={ref} type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)}
      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--ac)' }} />
  )
}

function KebabMenu({ items }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
        style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 30, right: 0, zIndex: 300, background: '#fff', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.12)', minWidth: 140, padding: 4 }}>
          {items.map((it, i) => (
            <div key={i} onClick={() => { it.onClick(); setOpen(false) }}
              style={{ padding: '7px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 4, color: it.danger ? '#ef4444' : 'var(--t1)' }}>
              {it.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Filter / Column defs ── */
const FILTER_DEFS = [
  { key: 'type', label: '유형', options: ['선정성', '도박'], multi: true },
  { key: 'grade', label: '유해등급', options: ['상', '중', '하'], multi: true },
  { key: 'status', label: '조치상태', options: ['confirmed', 'pending', 'dismissed'], multi: true },
]

const COLS_ALL = [
  { key: 'detectedAt', label: '탐지일시' },
  { key: 'groupName', label: '그룹' },
  { key: 'type', label: '유형' },
  { key: 'grade', label: '유해등급' },
  { key: 'status', label: '조치상태' },
  { key: 'url', label: 'URL' },
]

const STATUS_TABS = [
  { label: '전체', value: '' },
  { label: '선정성', value: '선정성' },
  { label: '도박', value: '도박' },
]

/* ── Main ── */
export default function ReportView() {
  const { isSchoolAdmin, schoolId, schoolGroupIds } = useSchoolScope()
  const mySchool = isSchoolAdmin ? DUMMY.schools.find(s => s.schoolId === schoolId) : null

  const [school, setSchool] = useState('전체')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [filterValues, setFilterValues] = useState({})
  const [selectedIds, setSelectedIds] = useState([])
  const [sortKey, setSortKey] = useState('detectedAt')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [hiddenCols, setHiddenCols] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const allDets = DUMMY.detections
  const dets = isSchoolAdmin && mySchool
    ? allDets.filter(d => d.groupName === mySchool.name)
    : school !== '전체'
      ? allDets.filter(d => {
          const s = DUMMY.schools.find(sc => sc.name === school)
          return s ? DUMMY.groups.filter(g => g.schoolId === s.schoolId).some(g => g.name === d.groupName) : true
        })
      : allDets

  const PREV = '2026-02'
  const CURR = '2026-03'
  const prevLabel = '2026년 2월'
  const currLabel = '2026년 3월'

  const { filtered: prevAll } = computeMonthData(dets, PREV)
  const { filtered: currAll, byDay: currByDay } = computeMonthData(dets, CURR)

  const chartData = Array.from({ length: 17 }, (_, i) => ({
    label: `${i + 1}일`, v: currByDay[i + 1] || 0,
  }))

  const currSexual = currAll.filter(d => d.type === '선정성').length
  const currGamble = currAll.filter(d => d.type === '도박').length

  const gradeCount = (arr, g) => arr.filter(d => d.grade === g).length

  function buildGroupRows(arr, prevArr) {
    const currGroups = topGroups(arr)
    const prevGroups = topGroups(prevArr)
    return currGroups.map(([grp, cData], i) => {
      const [pGrp, pData] = prevGroups[i] || [null, { det: 0, action: 0 }]
      return {
        group: grp || pGrp,
        prev_det: pData.det,
        prev_action: pData.action,
        curr_det: cData.det,
        curr_action: cData.action,
      }
    })
  }

  const allRows    = buildGroupRows(currAll, prevAll)
  const sexualRows = buildGroupRows(currAll.filter(d => d.type === '선정성'), prevAll.filter(d => d.type === '선정성'))
  const gambleRows = buildGroupRows(currAll.filter(d => d.type === '도박'), prevAll.filter(d => d.type === '도박'))

  const pauseSourceGroups = isSchoolAdmin && schoolGroupIds.length
    ? DUMMY.groups.filter(g => schoolGroupIds.includes(g.groupId)).slice(0, 5)
    : DUMMY.groups.slice(0, 5)
  const pauseGroups = pauseSourceGroups.map(g => {
    const sch = DUMMY.schools.find(s => s.schoolId === g.schoolId)
    return {
      group: isSchoolAdmin ? g.name : (sch ? sch.name : g.name),
      prev_cnt: 0, prev_time: 0,
      curr_cnt: DUMMY.pauses.filter(p => p.groupId === g.groupId && p.startAt.startsWith(CURR)).length,
      curr_time: 0,
    }
  })

  const detCols = [{ key: 'det', label: '탐지' }, { key: 'action', label: '조치' }]
  const pauseCols = [{ key: 'cnt', label: '횟수' }, { key: 'time', label: '시간' }]

  /* Table rows from full detections list */
  let tableRows = [...allDets]
  if (statusFilter) tableRows = tableRows.filter(r => r.type === statusFilter)
  if (query) tableRows = tableRows.filter(r =>
    (r.groupName || '').includes(query) || (r.type || '').includes(query) || (r.url || '').includes(query)
  )
  if (dateFrom) tableRows = tableRows.filter(r => r.detectedAt >= dateFrom)
  if (dateTo) tableRows = tableRows.filter(r => r.detectedAt <= dateTo + 'T99')
  activeFilters.forEach(fk => {
    const def = FILTER_DEFS.find(d => d.key === fk)
    const val = filterValues[fk]
    if (!val || (Array.isArray(val) && !val.length)) return
    if (def?.multi) tableRows = tableRows.filter(r => val.includes(r[fk]))
    else tableRows = tableRows.filter(r => r[fk] === val)
  })
  tableRows.sort((a, b) => {
    const av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
    return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
  })

  const total = tableRows.length
  const pageRows = tableRows.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const toggleCol = key => setHiddenCols(h => h.includes(key) ? h.filter(k => k !== key) : [...h, key])

  function doSearch() { setQuery(search); setPage(1) }

  const someSelected = selectedIds.length > 0

  const TABLE_COLS = COLS_ALL.filter(c => !hiddenCols.includes(c.key)).map(c => ({
    ...c,
    render: c.key === 'status'
      ? r => <StatusBadge status={r.status} />
      : c.key === 'grade'
        ? r => <span style={{ color: r.grade === '상' ? '#ef4444' : r.grade === '중' ? '#f59e0b' : '#22c55e' }}>{r.grade}</span>
        : undefined,
  }))

  /* Count per status tab */
  const tabCounts = STATUS_TABS.map(t => ({
    ...t,
    count: t.value === '' ? allDets.length : allDets.filter(r => r.type === t.value).length,
  }))

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>모니터링</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            보고서 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            가져오기
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            내보내기
          </button>
        </div>
      </div>

      {/* Report sections */}
      <Section title="전체">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>탐지 현황 그래프</div>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 4, padding: '12px 8px' }}>
          <LineChart data={chartData} />
        </div>
        <Stats items={[
          { label: '전체탐지', value: currAll.length },
          { label: '선정성탐지', value: currSexual },
          { label: '도박탐지', value: currGamble },
        ]} />
        <GroupTable title="탐지현황 - 그룹별" prev={prevLabel} curr={currLabel} rows={allRows} cols={detCols} />
      </Section>

      <Section title="선정성">
        <Stats items={[
          { label: '선정성탐지', value: currSexual },
          { label: '유해등급 상', value: gradeCount(currAll.filter(d => d.type === '선정성'), '상') },
          { label: '유해등급 중', value: gradeCount(currAll.filter(d => d.type === '선정성'), '중') },
          { label: '유해등급 하', value: gradeCount(currAll.filter(d => d.type === '선정성'), '하') },
        ]} />
        <GroupTable title="탐지현황 - 그룹별" prev={prevLabel} curr={currLabel} rows={sexualRows} cols={detCols} />
      </Section>

      <Section title="도박">
        <Stats items={[
          { label: '도박탐지', value: currGamble },
          { label: '유해등급 상', value: gradeCount(currAll.filter(d => d.type === '도박'), '상') },
          { label: '유해등급 중', value: gradeCount(currAll.filter(d => d.type === '도박'), '중') },
          { label: '유해등급 하', value: gradeCount(currAll.filter(d => d.type === '도박'), '하') },
        ]} />
        <GroupTable title="탐지현황 - 그룹별" prev={prevLabel} curr={currLabel} rows={gambleRows} cols={detCols} />
      </Section>

      <Section title="기타">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>탐지제어</div>
        <GroupTable prev={prevLabel} curr={currLabel} rows={pauseGroups} cols={pauseCols} />
      </Section>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {tabCounts.map((tab, i) => {
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
                {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tab.count}</span>
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
        cols={TABLE_COLS}
        rows={pageRows}
        selectedId={selectedId}
        onRowClick={r => setSelectedId(r.id === selectedId ? null : r.id)}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        actionBar={someSelected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>{selectedIds.length}건 선택됨</span>
            <button className="btn btn-outline" style={{ fontSize: 12, height: 28 }} onClick={() => setSelectedIds([])}>선택 해제</button>
          </div>
        )}
        emptyContext={{ query, chips: activeFilters.map(k => ({ value: filterValues[k] })) }}
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
