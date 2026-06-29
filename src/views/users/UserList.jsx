'use client'
import { useState, useRef, useEffect } from 'react'
import { DUMMY } from '../../data/dummy'
import Table, { EmptyState } from '../../components/common/Table'
import { StatusBadge } from '../../components/common/Badge'
import { usePanel } from '../../context/PanelContext'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'
import UserNewPanel from './UserNewPanel'

/* ── 상수 ── */
const PERMISSIONS = ['교육청 관리자', '교육청 관리 지원']
const STATUS_TABS = ['전체', '활성', '비활성']

const FILTER_DEFS = [
  { key: 'permission', label: '권한', options: PERMISSIONS },
  { key: 'org',        label: '소속기관', options: [] },
]

/* ── 헬퍼 컴포넌트 ── */
function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate }, [indeterminate])
  return (
    <input
      ref={ref} type="checkbox" checked={!!checked} onChange={onChange}
      style={{ width: 15, height: 15, cursor: 'pointer', accentColor: 'var(--ac)' }}
      onClick={e => e.stopPropagation()}
    />
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
  const selected = Array.isArray(value) ? value : []
  const toggle = opt => {
    const next = selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]
    onChange(next)
  }
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', fontSize: 12, borderRadius: 4,
          border: `1px solid ${selected.length ? 'var(--ac)' : 'var(--bd)'}`,
          background: selected.length ? 'rgba(99,102,241,.07)' : 'var(--bg1)',
          color: selected.length ? 'var(--ac)' : 'var(--t2)', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {label}{selected.length > 0 && <span style={{ fontWeight: 700 }}>: {selected.join(', ')}</span>}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {onRemove && (
        <button onClick={onRemove} style={{ position: 'absolute', top: -5, right: -5, width: 14, height: 14, borderRadius: '50%', background: 'var(--t3)', border: 'none', color: '#fff', fontSize: 9, lineHeight: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>✕</button>
      )}
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.15)', minWidth: 160, overflow: 'hidden' }}>
          {options.map(opt => (
            <div key={opt}
              onClick={() => toggle(opt)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: selected.includes(opt) ? 'var(--ac)' : 'var(--t1)', background: selected.includes(opt) ? 'rgba(99,102,241,.06)' : 'transparent' }}
              onMouseEnter={e => { if (!selected.includes(opt)) e.currentTarget.style.background = 'var(--bg2)' }}
              onMouseLeave={e => { if (!selected.includes(opt)) e.currentTarget.style.background = 'transparent' }}
            >
              <Checkbox checked={selected.includes(opt)} onChange={() => toggle(opt)} />
              {opt}
            </div>
          ))}
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
  if (available.length === 0) return null
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 12, borderRadius: 4, border: '1px dashed var(--bd)', background: 'transparent', color: 'var(--t3)', cursor: 'pointer' }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        필터 추가
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.15)', minWidth: 140, overflow: 'hidden' }}>
          {available.map(d => (
            <div key={d.key}
              onClick={() => { onAdd(d.key); setOpen(false) }}
              style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
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

function KebabMenu({ items }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)
  const btnRef = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  function handleOpen(e) {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.right - 140 })
    }
    setOpen(o => !o)
  }
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button ref={btnRef} onClick={handleOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', padding: '2px 6px', borderRadius: 4, fontSize: 16, lineHeight: 1 }}>⋯</button>
      {open && (
        <div onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.15)', minWidth: 140, overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={i}
              onClick={() => { it.onClick(); setOpen(false) }}
              style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', color: it.danger ? 'var(--err)' : 'var(--t1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {it.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── 사이드 패널 ── */
function UserPanel({ account, onSave, onDelete, onClose }) {
  const [editing, setEditing]       = useState(false)
  const [pwConfirm, setPwConfirm]   = useState(false)
  const [pwDone, setPwDone]         = useState(false)
  const [delConfirm, setDelConfirm] = useState(false)
  const [permission, setPermission] = useState(account.permission)
  const [status, setStatus]         = useState(account.status === 'active' ? '활성화' : '비활성화')

  function handleSave() {
    onSave({ ...account, permission, status: status === '활성화' ? 'active' : 'inactive' })
    setEditing(false)
  }

  const row = (label, value, mono) => (
    <div key={label} style={{ display: 'flex', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ width: 90, flexShrink: 0, fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, color: value ? 'var(--t1)' : 'var(--t3)', fontFamily: mono ? 'inherit' : undefined }}>{value || '-'}</div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>

      {pwConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPwConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 4, padding: '28px 28px 24px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>비밀번호 초기화</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 28 }}>
              <span style={{ color: 'var(--ac)' }}>{account.loginId}</span> 계정의 비밀번호를 초기화하시겠습니까?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setPwConfirm(false)} style={{ minWidth: 64 }}>취소</button>
              <button className="btn" style={{ background: '#1f2937', color: '#fff', border: 'none', minWidth: 64 }} onClick={() => { setPwConfirm(false); setPwDone(true) }}>초기화</button>
            </div>
          </div>
        </div>
      )}

      {pwDone && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setPwDone(false)}>
          <div style={{ background: '#fff', borderRadius: 4, padding: '28px 28px 24px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>비밀번호 초기화</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 28 }}>
              <span style={{ color: 'var(--ac)' }}>{account.loginId}</span> 계정의 비밀번호가 초기화되었습니다.
            </div>
            <div style={{ textAlign: 'right' }}>
              <button className="btn" style={{ background: '#1f2937', color: '#fff', border: 'none', minWidth: 64 }} onClick={() => setPwDone(false)}>확인</button>
            </div>
          </div>
        </div>
      )}

      {delConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDelConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 4, padding: '28px 28px 24px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>계정 삭제</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 28 }}>
              <span style={{ color: 'var(--err)' }}>{account.loginId}</span> 계정을 삭제하시겠습니까?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setDelConfirm(false)} style={{ minWidth: 64 }}>취소</button>
              <button className="btn" style={{ background: 'var(--err)', color: '#fff', border: 'none', minWidth: 64 }} onClick={() => { setDelConfirm(false); onDelete(account.id); onClose() }}>삭제</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>{account.name}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{account.org} · {account.role}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="btn" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => setEditing(true)}>수정</button>
            <button className="btn" style={{ padding: '4px 12px', fontSize: 12, background: 'var(--err)', color: '#fff', border: 'none' }} onClick={() => setDelConfirm(true)}>삭제</button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 18, lineHeight: 1, padding: '0 2px', marginLeft: 2 }}>✕</button>
          </div>
        </div>
        <div style={{ borderBottom: '1px solid var(--bd)' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {!editing ? (
          <>
            <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, padding: '0 14px', marginBottom: 20 }}>
              {row('소속기관', account.org)}
              {row('역할',     account.role)}
              {row('권한',     account.permission)}
              {row('계정명',   account.loginId, true)}
              {row('계정 상태', account.status === 'active' ? '활성' : '비활성')}
            </div>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setPwConfirm(true)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              비밀번호 초기화
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 16 }}>계정 수정</div>
            {[['계정아이디', account.loginId], ['역할', account.role], ['기관', account.org]].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ width: 80, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>{label}</div>
                <input className="inp" value={value} readOnly style={{ flex: 1, background: 'var(--bg2)', color: 'var(--t3)', cursor: 'default' }} />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 80, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>권한</div>
              <select className="inp" value={permission} onChange={e => setPermission(e.target.value)} style={{ flex: 1 }}>
                {PERMISSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>계정 상태</div>
              <select className="inp" value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1 }}>
                <option>활성화</option>
                <option>비활성화</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditing(false)}>취소</button>
              <button className="btn" style={{ flex: 1, justifyContent: 'center', background: '#1f2937', color: '#fff', border: 'none' }} onClick={handleSave}>저장</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── 메인 컴포넌트 ── */
export default function UserList() {
  const { openPanel } = usePanel()

  /* 데이터 */
  const [accounts, setAccounts] = useState([...DUMMY.staffAccounts])

  /* 필터 상태 */
  const [statusFilter, setStatusFilter] = useState('전체')
  const [dateFrom, setDateFrom]         = useState(null)
  const [dateTo, setDateTo]             = useState(null)
  const [search, setSearch]             = useState('')
  const [query, setQuery]               = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [chipValues, setChipValues]       = useState({})

  /* 페이지 */
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)

  /* 선택 */
  const [selected, setSelected]     = useState(null)
  const [checkedIds, setCheckedIds] = useState(new Set())

  /* 열 토글 */
  const COLS_ALL = [
    { key: 'org',        label: '소속기관' },
    { key: 'role',       label: '역할' },
    { key: 'permission', label: '권한명' },
    { key: 'loginId',    label: '계정명' },
    { key: 'status',     label: '계정상태' },
  ]
  const [hiddenCols, setHiddenCols] = useState([])
  const toggleCol = key => setHiddenCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  /* 엑셀 가져오기 */
  const [showExcelImport, setShowExcelImport] = useState(false)
  const [excelFile, setExcelFile]             = useState(null)

  /* 소속기관 옵션 동적 생성 */
  const orgOptions = [...new Set(accounts.map(a => a.org))]
  const filterDefsWithOptions = FILTER_DEFS.map(d => d.key === 'org' ? { ...d, options: orgOptions } : d)

  /* 상태 탭 카운트 */
  const tabCounts = {
    '전체': accounts.length,
    '활성': accounts.filter(a => a.status === 'active').length,
    '비활성': accounts.filter(a => a.status === 'inactive').length,
  }
  const STATUS_TAB_DEFS = STATUS_TABS.map(t => ({ value: t, label: t, count: tabCounts[t] }))

  /* 필터 적용 */
  const filtered = accounts.filter(a => {
    if (statusFilter === '활성'   && a.status !== 'active')   return false
    if (statusFilter === '비활성' && a.status !== 'inactive') return false
    if (query && !a.org.includes(query) && !a.loginId.includes(query)) return false
    if (chipValues.permission?.length && !chipValues.permission.includes(a.permission)) return false
    if (chipValues.org?.length && !chipValues.org.includes(a.org)) return false
    return true
  })

  const total = filtered.length
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end   = Math.min(page * pageSize, total)
  const rows  = filtered.slice((page - 1) * pageSize, page * pageSize)

  /* 체크박스 */
  const allChecked  = rows.length > 0 && rows.every(r => checkedIds.has(r.id))
  const someChecked = rows.some(r => checkedIds.has(r.id))
  const toggleAll   = () => {
    if (allChecked) setCheckedIds(prev => { const n = new Set(prev); rows.forEach(r => n.delete(r.id)); return n })
    else            setCheckedIds(prev => { const n = new Set(prev); rows.forEach(r => n.add(r.id)); return n })
  }
  const toggleOne = id => setCheckedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  function handleSave(updated) {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a))
    setSelected(updated)
  }
  function handleDelete(id) {
    setAccounts(prev => prev.filter(a => a.id !== id))
    setSelected(null)
  }
  function doSearch() { setQuery(search); setPage(1) }
  function resetFilters() {
    setStatusFilter('전체'); setSearch(''); setQuery('')
    setDateFrom(null); setDateTo(null); setChipValues({}); setActiveFilters([]); setPage(1)
  }

  /* 테이블 컬럼 정의 */
  const COLS = [
    {
      key: 'chk',
      label: () => <Checkbox checked={allChecked} indeterminate={!allChecked && someChecked} onChange={toggleAll} />,
      width: 40,
      render: (_, row) => <Checkbox checked={checkedIds.has(row.id)} onChange={() => toggleOne(row.id)} />,
    },
    {
      key: 'no', label: 'No.', width: 56,
      render: (_, row, i) => <span style={{ color: 'var(--t3)', fontSize: 12 }}>{total - ((page - 1) * pageSize + i)}</span>,
    },
    ...[
      { key: 'org',        label: '소속기관' },
      { key: 'role',       label: '역할' },
      { key: 'permission', label: '권한명' },
      { key: 'loginId',    label: '계정명', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
      {
        key: 'status', label: '계정상태',
        render: v => <StatusBadge status={v} />,
      },
    ].filter(c => !hiddenCols.includes(c.key)),
    {
      key: 'actions', label: '', width: 40, align: 'center',
      render: (_, row) => (
        <KebabMenu items={[
          { label: '수정', onClick: () => setSelected(row) },
          { label: '비밀번호 초기화', onClick: () => setSelected(row) },
          { label: '삭제', danger: true, onClick: () => handleDelete(row.id) },
        ]} />
      ),
    },
  ]

  const checkedCount = [...checkedIds].filter(id => rows.some(r => r.id === id)).length

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* 사이드 패널 */}
      {selected && (
        <UserPanel
          account={selected}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setSelected(null)}
        />
      )}

      {/* 엑셀 가져오기 모달 */}
      {showExcelImport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowExcelImport(false) }}>
          <div style={{ background: 'var(--bg1)', borderRadius: 4, width: 480, boxShadow: '0 8px 32px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>엑셀에서 가져오기</span>
              <button onClick={() => setShowExcelImport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>엑셀 파일(.xlsx, .xls)을 업로드하면 계정 목록을 일괄 등록할 수 있습니다.</div>
              <div style={{ padding: '28px 32px' }}>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>템플릿 다운로드</label>
                <button className="btn" style={{ fontSize: 13, color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  계정 등록 양식 다운로드
                </button>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>파일 업로드</label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 20px', border: `2px dashed ${excelFile ? 'var(--ac)' : 'var(--bd)'}`, borderRadius: 4, cursor: 'pointer', background: excelFile ? 'rgba(99,102,241,0.05)' : 'var(--bg3)', transition: 'all .15s' }}>
                  <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => setExcelFile(e.target.files?.[0] || null)} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={excelFile ? 'var(--ac)' : 'var(--t3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  {excelFile
                    ? <span style={{ fontSize: 13, color: 'var(--ac)', fontWeight: 600 }}>{excelFile.name}</span>
                    : <><span style={{ fontSize: 13, color: 'var(--t2)' }}>파일을 끌어다 놓거나 클릭하여 선택</span><span style={{ fontSize: 12, color: 'var(--t3)' }}>.xlsx, .xls, .csv</span></>
                  }
                </label>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setShowExcelImport(false)} style={{ color: 'var(--t2)' }}>취소</button>
              <button className="btn btn-p" disabled={!excelFile} style={{ opacity: excelFile ? 1 : 0.4 }} onClick={() => setShowExcelImport(false)}>가져오기</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 페이지 헤더 ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>직원 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            계정 현황 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onClick={() => { setExcelFile(null); setShowExcelImport(true) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            가져오기
          </button>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            내보내기
          </button>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onClick={() => openPanel(<UserNewPanel />)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            직원 추가
          </button>
        </div>
      </div>

      {/* ── 필터 바 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TAB_DEFS.map((tab, i) => {
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

        {/* 필터 칩 */}
        {activeFilters.map(key => {
          const def = filterDefsWithOptions.find(d => d.key === key)
          if (!def) return null
          return (
            <FilterChip
              key={key}
              label={def.label}
              value={chipValues[key] || []}
              options={def.options}
              onChange={v => { setChipValues(prev => ({ ...prev, [key]: v })); setPage(1) }}
              onRemove={() => {
                setActiveFilters(prev => prev.filter(k => k !== key))
                setChipValues(prev => { const n = { ...prev }; delete n[key]; return n })
              }}
            />
          )
        })}

        <AddFilterButton
          defs={filterDefsWithOptions}
          active={activeFilters}
          onAdd={key => setActiveFilters(prev => [...prev, key])}
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

      {/* ── 테이블 ── */}
      <Table
        cols={COLS}
        rows={rows}
        selectedId={selected?.id}
        onRowClick={row => setSelected(prev => prev?.id === row.id ? null : row)}
        emptyContext={{
          query: query,
          chips: Object.entries(chipValues).map(([k, v]) => ({ key: k, value: v })),
          onReset: resetFilters,
        }}
        actionBar={checkedCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>{checkedCount}개 선택됨</span>
            <button className="btn" style={{ fontSize: 12, padding: '3px 10px' }} onClick={() => setCheckedIds(new Set())}>선택 해제</button>
            <button className="btn" style={{ fontSize: 12, padding: '3px 10px', color: 'var(--err)' }}>삭제</button>
          </div>
        ) : null}
      />

      {/* ── 페이지네이션 푸터 ── */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  )
}
