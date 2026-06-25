'use client'
import { useState, useEffect, useRef } from 'react';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { usePanel } from '../../context/PanelContext';
import { DUMMY } from '../../data/dummy';
import { useSchoolScope } from '../../hooks/useSchoolScope';
import SearchableSelect from '../../components/common/SearchableSelect';
import StudentDetailPanel from './StudentDetailPanel';
import StudentNewPanel from './StudentNewPanel';
import DateRangePicker from '../../components/common/DateRangePicker';

const PAGE_SIZE = 25;

const STATUS_TABS = [
  { key: '', label: '전체' },
  { key: 'active', label: '활성' },
  { key: 'inactive', label: '비활성' },
];

// ── helper components ──────────────────────────────────────────────────────────

function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <input ref={ref} type="checkbox" checked={!!checked} onChange={onChange}
      style={{ width: 15, height: 15, accentColor: 'var(--ac)', cursor: 'pointer' }} />
  );
}

function FilterChip({ label, value, options, onRemove, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 10px',
        background: value ? 'var(--ac)' : 'var(--bg2)', border: '1px solid',
        borderColor: value ? 'var(--ac)' : 'var(--bd)', borderRadius: 4,
        fontSize: 12, color: value ? '#fff' : 'var(--t2)', cursor: 'pointer', whiteSpace: 'nowrap',
      }}>
        {label}{selected ? `: ${selected.label}` : ''}
        {value && (
          <span onClick={e => { e.stopPropagation(); onChange(''); }} style={{ marginLeft: 2, opacity: .7, fontSize: 14, lineHeight: 1 }}>×</span>
        )}
        {!value && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 140, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,.18)', overflow: 'hidden',
        }}>
          {options.map(o => (
            <div key={o.value} onClick={() => { onChange(o.value); setOpen(false); }} style={{
              padding: '9px 14px', fontSize: 13, cursor: 'pointer',
              color: value === o.value ? 'var(--ac)' : 'var(--t1)',
              background: value === o.value ? 'rgba(99,102,241,.07)' : 'transparent',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = value === o.value ? 'rgba(99,102,241,.07)' : 'transparent'}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddFilterButton({ filters, active, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const inactive = filters.filter(f => !active.includes(f.key));
  if (inactive.length === 0) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 5, height: 32, padding: '0 10px',
        background: 'var(--bg2)', border: '1px dashed var(--bd)', borderRadius: 4,
        fontSize: 12, color: 'var(--t3)', cursor: 'pointer',
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        필터 추가
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 140, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,.18)', overflow: 'hidden',
        }}>
          {inactive.map(f => (
            <div key={f.key} onClick={() => { onAdd(f.key); setOpen(false); }} style={{
              padding: '9px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {f.label}
            </div>
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
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o); }} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
        color: 'var(--t3)', borderRadius: 4,
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, minWidth: 130, zIndex: 500,
          background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,.2)', overflow: 'hidden',
        }}>
          {items.map((item, i) => (
            <div key={i} onClick={e => { e.stopPropagation(); item.onClick(); setOpen(false); }} style={{
              padding: '9px 14px', fontSize: 13, cursor: 'pointer',
              color: item.danger ? '#ef4444' : 'var(--t1)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FILTER_DEFS ────────────────────────────────────────────────────────────────

const ALL_FILTER_KEYS = ['school', 'grade', 'class'];

// ── main component ─────────────────────────────────────────────────────────────

export default function StudentList() {
  const { openPanel } = usePanel();
  const { isSchoolAdmin, schoolId } = useSchoolScope();

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [hiddenCols, setHiddenCols] = useState([]);
  const [activeFilters, setActiveFilters] = useState(['grade', 'class']);

  const [showExcelImport, setShowExcelImport] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => setPage(1), [query, statusFilter, yearFilter, schoolFilter, gradeFilter, classFilter]);

  const allStudents = isSchoolAdmin && schoolId
    ? DUMMY.students.filter(s => s.schoolId === schoolId)
    : DUMMY.students;

  const schools = [...new Set(allStudents.map(s => s.schoolId).filter(Boolean))]
    .map(id => DUMMY.schools?.find(sc => sc.schoolId === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
  const grades = [...new Set(allStudents.map(s => s.grade).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));
  const classes = [...new Set(allStudents.map(s => s.classNum).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));

  const FILTER_DEFS = [
    {
      key: 'grade', label: '학년',
      options: [{ value: '', label: '전체 학년' }, ...grades.map(g => ({ value: g, label: `${g}학년` }))],
      value: gradeFilter, onChange: setGradeFilter,
    },
    {
      key: 'class', label: '반',
      options: [{ value: '', label: '전체 반' }, ...classes.map(c => ({ value: c, label: `${c}반` }))],
      value: classFilter, onChange: setClassFilter,
    },
  ];

  const YEARS = ['2026', '2025', '2024', '2023'];

  const filtered = allStudents.filter(s => {
    const q = query.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    if (!isSchoolAdmin && schoolFilter && String(s.schoolId) !== String(schoolFilter)) return false;
    if (gradeFilter && s.grade !== gradeFilter) return false;
    if (classFilter && s.classNum !== classFilter) return false;
    return true;
  });

  const total = filtered.length;

  let sorted = [...filtered];
  if (sortKey) {
    sorted.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const COLS_ALL = [
    { key: 'school', label: '학교' },
    { key: 'grade', label: '학년' },
    { key: 'classNum', label: '반' },
    { key: 'num', label: '번호' },
    { key: 'deviceId', label: '단말기' },
    { key: 'status', label: '상태' },
  ];

  const allPageIds = paged.map(s => s.studentId);
  const allChecked = allPageIds.length > 0 && allPageIds.every(id => selectedIds.includes(id));
  const someChecked = allPageIds.some(id => selectedIds.includes(id)) && !allChecked;

  function toggleAll() {
    if (allChecked) setSelectedIds(ids => ids.filter(id => !allPageIds.includes(id)));
    else setSelectedIds(ids => [...new Set([...ids, ...allPageIds])]);
  }

  function toggleOne(id) {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  }

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  function toggleCol(key) {
    setHiddenCols(h => h.includes(key) ? h.filter(k => k !== key) : [...h, key]);
  }

  function doSearch() {
    setQuery(search);
    setPage(1);
  }

  const showSchoolCol = !isSchoolAdmin && !hiddenCols.includes('school');

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            학생 관리 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onClick={() => { setExcelFile(null); setShowExcelImport(true); }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--t1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg1)'; e.currentTarget.style.color = 'var(--t2)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            엑셀에서 가져오기
          </button>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onClick={() => openPanel(<StudentNewPanel />)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            학생 추가
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS.map((tab, i) => {
            const active = statusFilter === tab.key
            return (
              <button key={tab.key} onClick={() => { setStatusFilter(tab.key); setPage(1) }}
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
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 학교 셀렉트 (교육청 관리자에게만 표시) */}
        {!isSchoolAdmin && (
          <select className="inp" value={schoolFilter} onChange={e => { setSchoolFilter(e.target.value); setPage(1) }}
            style={{ padding: '7px 10px', fontSize: 13, minWidth: 140 }}>
            <option value="">전체 학교</option>
            {schools.map(s => <option key={s.schoolId} value={String(s.schoolId)}>{s.name}</option>)}
          </select>
        )}

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* Filter chips */}
        {FILTER_DEFS.filter(f => activeFilters.includes(f.key)).map(f => (
          <FilterChip
            key={f.key}
            label={f.label}
            value={f.value}
            options={f.options}
            onChange={f.onChange}
            onRemove={() => {
              f.onChange('');
              setActiveFilters(a => a.filter(k => k !== f.key));
            }}
          />
        ))}

        <AddFilterButton
          filters={FILTER_DEFS}
          active={activeFilters}
          onAdd={key => setActiveFilters(a => [...a, key])}
          onRemove={key => setActiveFilters(a => a.filter(k => k !== key))}
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
      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr>
              <th style={{ width: 36, textAlign: 'center' }}>
                <Checkbox checked={allChecked} indeterminate={someChecked} onChange={toggleAll} />
              </th>
              <th style={{ width: 48, color: 'var(--t3)' }}>No.</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                이름 {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              {showSchoolCol && <th>학교</th>}
              {!hiddenCols.includes('grade') && (
                <th onClick={() => handleSort('grade')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  학년 {sortKey === 'grade' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              )}
              {!hiddenCols.includes('classNum') && (
                <th onClick={() => handleSort('classNum')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  반 {sortKey === 'classNum' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              )}
              {!hiddenCols.includes('num') && <th>번호</th>}
              {!hiddenCols.includes('deviceId') && <th>단말기</th>}
              {!hiddenCols.includes('status') && <th>상태</th>}
              <th style={{ width: 36 }} />
            </tr>
          </thead>
          <tbody>
            {paged.map((s, i) => {
              const school = DUMMY.schools?.find(sc => sc.schoolId === s.schoolId);
              const device = DUMMY.devices?.find(d => d.deviceId === s.deviceId);
              const no = filtered.length - ((page - 1) * pageSize + i);
              const isSelected = selectedIds.includes(s.studentId);
              return (
                <tr
                  key={s.studentId}
                  className="clickable"
                  onClick={() => openPanel(<StudentDetailPanel studentId={s.studentId} />)}
                  style={{ background: isSelected ? 'rgba(99,102,241,.05)' : undefined }}
                >
                  <td style={{ textAlign: 'center' }} onClick={e => { e.stopPropagation(); toggleOne(s.studentId); }}>
                    <Checkbox checked={isSelected} onChange={() => toggleOne(s.studentId)} />
                  </td>
                  <td style={{ color: 'var(--t3)', fontSize: 12 }}>{no}</td>
                  <td><span style={{ fontWeight: 600 }}>{s.name}</span></td>
                  {showSchoolCol && <td>{school?.name || '—'}</td>}
                  {!hiddenCols.includes('grade') && <td>{s.grade}학년</td>}
                  {!hiddenCols.includes('classNum') && <td>{s.classNum}반</td>}
                  {!hiddenCols.includes('num') && <td>{s.num}번</td>}
                  {!hiddenCols.includes('deviceId') && <td>{device?.name || '미배정'}</td>}
                  {!hiddenCols.includes('status') && (
                    <td>
                      <StatusBadge status={s.status === 'active' ? 'active' : 'inactive'} />
                    </td>
                  )}
                  <td onClick={e => e.stopPropagation()}>
                    <KebabMenu items={[
                      { label: '상세 보기', onClick: () => openPanel(<StudentDetailPanel studentId={s.studentId} />) },
                      { label: '수정', onClick: () => openPanel(<StudentNewPanel studentId={s.studentId} />) },
                      { label: '삭제', danger: true, onClick: () => {} },
                    ]} />
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', color: 'var(--t3)', padding: '60px 14px', fontSize: 13 }}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ACTION BAR (bulk) */}
      {selectedIds.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--t1)', color: 'var(--bg1)', borderRadius: 4,
          padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)', zIndex: 300, fontSize: 13, fontWeight: 500,
        }}>
          <span>{selectedIds.length}명 선택됨</span>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,.3)' }} />
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 13, fontWeight: 500, opacity: .8 }}
            onClick={() => {}}>상태 변경</button>
          <button style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onClick={() => {}}>삭제</button>
          <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 13, opacity: .6 }}
            onClick={() => setSelectedIds([])}>✕</button>
        </div>
      )}

      {/* PAGINATION FOOTER */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>

      {/* 엑셀에서 가져오기 모달 */}
      {showExcelImport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowExcelImport(false); }}>
          <div style={{ background: 'var(--bg1)', borderRadius: 4, width: 480, boxShadow: '0 8px 32px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>엑셀에서 가져오기</span>
              <button onClick={() => setShowExcelImport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                엑셀 파일(.xlsx, .xls)을 업로드하면 학생 목록을 일괄 등록할 수 있습니다.
              </div>
              <div style={{ padding: '28px 32px' }}>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>템플릿 다운로드</label>
                <button className="btn" style={{ fontSize: 13, color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  학생 등록 양식 다운로드
                </button>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>파일 업로드</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '32px 20px', border: `2px dashed ${excelFile ? 'var(--ac)' : 'var(--bd)'}`,
                  borderRadius: 4, cursor: 'pointer', background: excelFile ? 'rgba(99,102,241,0.05)' : 'var(--bg3)',
                  transition: 'all .15s',
                }}>
                  <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => setExcelFile(e.target.files?.[0] || null)} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={excelFile ? 'var(--ac)' : 'var(--t3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {excelFile
                    ? <span style={{ fontSize: 13, color: 'var(--ac)', fontWeight: 600 }}>{excelFile.name}</span>
                    : <><span style={{ fontSize: 13, color: 'var(--t2)' }}>파일을 끌어다 놓거나 클릭하여 선택</span>
                       <span style={{ fontSize: 12, color: 'var(--t3)' }}>.xlsx, .xls, .csv</span></>
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
    </div>
  );
}
