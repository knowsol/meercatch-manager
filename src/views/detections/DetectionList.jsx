'use client'
import { useState, useEffect, useRef } from 'react';
import { usePanel } from '../../context/PanelContext';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import DetectionDetailPanel from './DetectionDetailPanel';
import DateRangePicker from '../../components/common/DateRangePicker';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { format, parse, isValid } from 'date-fns';

const DET_FILTER_DEFS = {
  'OS':     { key: 'os',    multi: true,  values: ['iOS', 'Android', 'Windows', 'ChromeBook', 'WhaleBook'] },
  '탐지등급': { key: 'grade', multi: false, values: ['상', '중', '하'] },
}
const HIST_FILTER_DEFS = {
  'OS':     { key: 'os',         multi: true,  values: ['Android', 'iOS', 'Windows', 'WhaleOS', 'ChromeOS'] },
  '탐지등급': { key: 'grade',     multi: false, values: ['상', '중', '하'] },
  '조치유형': { key: 'actionType', multi: false, values: ['정탐', '오탐'] },
}
let nextChipId = 1

function SingleDayPicker({ value, onChange, onClose }) {
  const parsed = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const [selected, setSelected] = useState(parsed && isValid(parsed) ? parsed : undefined)
  const handleClear = () => { setSelected(undefined); onChange(''); onClose?.() }
  const handleConfirm = () => { if (selected) onChange(format(selected, 'yyyy-MM-dd')); onClose?.() }
  return (
    <>
      <style>{`
        .sdp .rdp-root { --rdp-accent-color: #f97316; --rdp-accent-background-color: rgba(249,115,22,0.12); --rdp-day-width:34px; --rdp-day-height:34px; font-family:'Pretendard',sans-serif; font-size:13px; }
        .sdp .rdp-root * { box-sizing:border-box; }
        .sdp .rdp-month { position:relative; padding-top:36px; }
        .sdp .rdp-month_caption { display:flex; align-items:center; justify-content:center; padding:0 0 10px; font-size:14px; font-weight:600; color:var(--t1); }
        .sdp .rdp-nav { display:flex; align-items:center; justify-content:space-between; position:absolute; top:12px; left:12px; right:12px; }
        .sdp .rdp-button_previous, .sdp .rdp-button_next { width:28px; height:28px; border-radius:4px; border:1px solid var(--bd); background:var(--bg2); color:var(--t2); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; }
        .sdp .rdp-button_previous:hover, .sdp .rdp-button_next:hover { background:var(--bg3); color:var(--t1); }
        .sdp .rdp-weekdays { display:flex; }
        .sdp .rdp-weekday { width:34px; height:28px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; color:var(--t3); }
        .sdp .rdp-week { display:flex; }
        .sdp .rdp-day { width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:13px; cursor:pointer; border-radius:4px; color:var(--t1); }
        .sdp .rdp-day:hover:not(.rdp-selected) { background:var(--bg3); }
        .sdp .rdp-day_button { width:100%; height:100%; border:1px solid transparent !important; background:none; cursor:pointer; color:inherit; font-size:inherit; font-family:inherit; border-radius:4px; display:flex; align-items:center; justify-content:center; }
        .sdp .rdp-today:not(.rdp-selected) .rdp-day_button { color:#f97316; font-weight:700; }
        .sdp .rdp-selected .rdp-day_button { background:#f97316; color:#fff; font-weight:600; border-radius:4px; }
        .sdp .rdp-outside { opacity:0.3; }
        .sdp .rdp-root *:focus, .sdp .rdp-root *:focus-visible { outline:none !important; box-shadow:none !important; }
        .sdp .rdp-day_button:focus, .sdp .rdp-day_button:focus-visible { border-color:var(--bd) !important; }
      `}</style>
      <div className="sdp"><DayPicker mode="single" locale={ko} selected={selected} onSelect={setSelected} /></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bd)' }}>
        <button onClick={handleClear} style={{ padding: '5px 14px', fontSize: 12, borderRadius: 4, border: '1px solid var(--bd)', background: 'none', color: 'var(--t2)', cursor: 'pointer' }}>초기화</button>
        <button onClick={handleConfirm} style={{ padding: '5px 14px', fontSize: 12, borderRadius: 4, border: 'none', background: '#f97316', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>확인</button>
      </div>
    </>
  )
}

function SearchableFilterChip({ label, value, values, onSelect, onRemove }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)
  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => inputRef.current?.focus(), 0) } }, [open])
  const filtered = values.filter(v => v.toLowerCase().includes(search.toLowerCase()))
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <span onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px', fontSize: 12, borderRadius: 4, height: 31, border: '1px solid var(--bd)', background: '#fff', cursor: 'pointer', userSelect: 'none', boxSizing: 'border-box' }}>
        <span style={{ color: 'var(--t3)' }}>{label}</span>
        {value && <span style={{ color: 'var(--t1)' }}>{value}</span>}
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 2, color: 'var(--t3)' }}><polyline points="6 9 12 15 18 9"/></svg>
        <span onClick={e => { e.stopPropagation(); onRemove() }} style={{ marginLeft: 2, color: 'var(--t3)', fontSize: 14, lineHeight: 1 }}>×</span>
      </span>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.2)', minWidth: 200, overflow: 'hidden' }}>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--bd)' }}>
            <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="검색..." style={{ width: '100%', fontSize: 12, padding: '5px 8px', boxSizing: 'border-box', border: '1px solid var(--bd)', borderRadius: 4, outline: 'none', background: 'var(--bg2)', color: 'var(--t1)' }} />
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--t3)' }}>검색 결과 없음</div>
              : filtered.map(v => (
                <div key={v} onClick={() => { onSelect(v); setOpen(false) }} style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', color: value === v ? '#f97316' : 'var(--t1)', fontWeight: value === v ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {v}
                  {value === v && <svg width="13" height="13" fill="none" stroke="#f97316" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

function DetFilterChip({ chip, onSelect, onRemove, autoOpen, filterDefs = DET_FILTER_DEFS }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { if (autoOpen) setOpen(true) }, [])
  const ref = useRef(null)
  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  const def = filterDefs[chip.label]
  if (!def) return null
  const isMulti = def.multi
  const selected = isMulti ? (chip.value || []) : chip.value
  const displayValue = isMulti ? (selected.length > 0 ? selected.join(', ') : null) : selected || null
  const handleClick = (val) => {
    if (isMulti) { onSelect(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]) }
    else { onSelect(val); setOpen(false) }
  }
  const isChecked = (val) => isMulti ? selected.includes(val) : selected === val
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <span onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px', fontSize: 12, borderRadius: 4, height: 31, border: '1px solid var(--bd)', background: '#fff', cursor: 'pointer', userSelect: 'none', boxSizing: 'border-box' }}>
        <span style={{ color: 'var(--t3)' }}>{chip.label}</span>
        {displayValue && <span style={{ color: 'var(--t1)' }}>{displayValue}</span>}
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 2, color: 'var(--t3)' }}><polyline points="6 9 12 15 18 9"/></svg>
        <span onClick={e => { e.stopPropagation(); onRemove() }} style={{ marginLeft: 2, color: 'var(--t3)', fontSize: 14, lineHeight: 1 }}>×</span>
      </span>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.2)', minWidth: 160, overflow: 'hidden' }}>
          {def.values.map(val => {
            const checked = isChecked(val)
            return (
              <div key={val} onClick={() => handleClick(val)} style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: checked ? '#f97316' : 'var(--t1)', fontWeight: checked ? 600 : 400 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {isMulti && (
                  <span style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${checked ? '#f97316' : 'var(--bd)'}`, background: checked ? '#f97316' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {checked && <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                )}
                {val}
                {!isMulti && checked && <svg width="13" height="13" fill="none" stroke="#f97316" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DetAddFilterButton({ activeLabels, onAdd, onClearAll, filterDefs = DET_FILTER_DEFS }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  const available = Object.keys(filterDefs).filter(l => !activeLabels.includes(l))
  const allUsed = available.length === 0
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => allUsed ? onClearAll?.() : setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', fontSize: 12, borderRadius: 4, border: '1px dashed var(--bd)', background: 'none', color: allUsed ? '#ef4444' : 'var(--t3)', cursor: 'pointer' }}>
        {allUsed ? '전체 제거' : '+ 필터 추가'}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.2)', minWidth: 140, overflow: 'hidden' }}>
          {available.map(label => (
            <div key={label} onClick={() => { onAdd(label); setOpen(false) }} style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

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

function KeywordTags({ keywords = [] }) {
  const shown = keywords.slice(0, 3);
  const more = keywords.length - shown.length;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {shown.map(k => (
        <span key={k} style={{ background: '#eff6ff', color: '#3b82f6', borderRadius: 4, padding: '2px 7px', fontSize: 12, fontWeight: 500 }}>{k}</span>
      ))}
      {more > 0 && (
        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 4, padding: '2px 7px', fontSize: 12 }}>+{more}개</span>
      )}
    </div>
  );
}

function UrlCell({ url }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#3b82f6', fontSize: 12 }}>
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      {url.length > 22 ? url.slice(0, 22) + '...' : url}
    </span>
  );
}

function GradeCell({ v }) {
  const cfg = v === '상'
    ? { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' }
    : v === '중'
    ? { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' }
    : { bg: 'rgba(100,116,139,0.12)', color: '#64748b' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
      {v}
    </span>
  );
}

function ThumbCell({ thumb }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      style={{ position: 'relative', width: 52, height: 38, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, background: '#1e293b' }}
      onClick={e => { e.stopPropagation(); setRevealed(r => !r); }}
      title={revealed ? '클릭하여 블러 처리' : '클릭하여 이미지 확인'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${thumb}/52/38`}
        alt="탐지 이미지"
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          filter: revealed ? 'none' : 'blur(5px)',
          transition: 'filter 0.2s',
          transform: 'scale(1.15)',
        }}
      />
      {!revealed && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          textShadow: '0 0 4px rgba(0,0,0,0.6)',
        }}>
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
          </svg>
        </div>
      )}
    </div>
  );
}


const GRADES = ['하', '중', '상'];
const ACTIONS = ['정탐', '오탐'];
const SCHOOLS = ['관동초등학교', '서초중학교', '강남고등학교', '마포초등학교', '분당중학교', '인천고등학교'];
const OS_LIST = ['Android', 'iOS', 'Windows', 'WhaleOS', 'ChromeOS'];
const KEYWORD_POOL = [
  ['게임', '충전', '한도'],
  ['배당', '베팅', '토토', '스포츠', '라이브'],
  ['라이브카지노', '게임', '토너먼트'],
  ['입출금', '게임', '충전'],
  ['바카라', '포커', '슬롯'],
];
const URL_POOL = [
  'https://xn--oi2b30g.com',
  'https://xn--mk1bu44c.net',
  'http://core-gambling.xyz',
  'https://sepa-bet.com',
  'https://live-casino.kr',
];
const HISTORY = Array.from({ length: 120 }, (_, i) => {
  const det = DUMMY.detections[i % DUMMY.detections.length];
  return {
    _id: i + 1,
    detId: det.detId,
    type:  det.type,
    grade: GRADES[i % 3],
    schoolYear: `${(i % 3) + 1}학년`,
    classNum: `${(i % 6) + 1}반`,
    studentNo: (i % 30) + 1,
    actionType: ACTIONS[i % 7 === 0 ? 1 : 0],
    detectedAt: `2026.${String(Math.floor(i / 10) % 6 + 1).padStart(2, '0')}.${String((i % 28) + 1).padStart(2, '0')}. 오후 ${String((i % 12) + 1).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
    actionAt:   `2026.${String(Math.floor(i / 10) % 6 + 1).padStart(2, '0')}.${String((i % 28) + 2).padStart(2, '0')}. 오후 02:${String(i % 60).padStart(2, '0')}`,
    operator:   'superadmin',
    school:     SCHOOLS[i % SCHOOLS.length],
    keywords:   KEYWORD_POOL[i % KEYWORD_POOL.length],
    url:        URL_POOL[i % URL_POOL.length],
    os:         OS_LIST[i % OS_LIST.length],
  };
});


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

function HistoryView() {
  const { openPanel } = usePanel();
  const [search, setSearch]         = useState('');
  const [query, setQuery]           = useState('');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [hiddenCols, setHiddenCols] = useState([]);
  const toggleCol = key => setHiddenCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  const doSearch = () => { setQuery(search); setPage(1); };
  const [typeFilter, setTypeFilter]     = useState('전체');
  const [yearFilter]                    = useState('2026');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [chips, setChips]               = useState([]);
  const [lastAddedId, setLastAddedId]   = useState(null);
  const addChip = (label) => { const def = HIST_FILTER_DEFS[label]; const id = nextChipId++; setChips(prev => [...prev, { id, label, value: def.multi ? [] : '' }]); setLastAddedId(id); };
  const selectChipValue = (id, value) => { setChips(prev => prev.map(c => c.id === id ? { ...c, value } : c)); setPage(1); };
  const removeChip = (id) => { setChips(prev => prev.filter(c => c.id !== id)); setPage(1); };
  useEffect(() => setPage(1), [query, schoolFilter, typeFilter]);

  const histTypeCounts = HISTORY.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {});

  const filtered = HISTORY.filter(r => {
    if (typeFilter !== '전체' && r.type !== typeFilter) return false;
    if (schoolFilter && r.school !== schoolFilter) return false;
    if (query && !r.school.includes(query) && !r.schoolYear.includes(query) && !r.classNum.includes(query)) return false;
    for (const chip of chips) {
      const def = HIST_FILTER_DEFS[chip.label];
      if (!def) continue;
      if (def.multi) { if (chip.value.length > 0 && !chip.value.includes(r[def.key])) return false; }
      else { if (chip.value && r[def.key] !== chip.value) return false; }
    }
    return true;
  });

  const total = filtered.length;
  const rows  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const COLS_ALL = [
    { key: '_id',        label: 'No.',         width: '55px' },
    { key: 'grade',      label: '탐지등급',    width: '80px',  render: v => <GradeCell v={v} /> },
    { key: 'keywords',   label: '탐지항목',    width: '200px', render: v => <KeywordTags keywords={v || []} /> },
    { key: 'url',        label: '탐지항목 상세', width: '160px', render: v => v ? <UrlCell url={v} /> : <span style={{ color: 'var(--t3)' }}>—</span> },
    { key: 'school',     label: '기관이름',    width: '120px' },
    { key: 'schoolYear', label: '학생정보',    width: '110px', render: (v, row) => `${row.schoolYear} ${row.classNum} ${row.studentNo}번` },
    { key: 'os',         label: 'OS',          width: '90px' },
    { key: 'detectedAt', label: '탐지일시',    width: '160px' },
    { key: 'actionAt',   label: '조치일시',    width: '160px' },
    { key: 'operator',   label: '조치자',      width: '90px' },
    { key: 'actionType', label: '조치유형',    width: '80px',  render: v => {
      const cfg = v === '정탐'
        ? { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' }
        : { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' };
      return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>{v}</span>;
    }},
  ];
  const cols = COLS_ALL.filter(c => !hiddenCols.includes(c.key));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>

        {/* 탐지 유형 탭 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {[
            { label: '전체',   value: '전체',   count: HISTORY.length },
            { label: '선정성', value: '선정성', count: histTypeCounts['선정성'] || 0 },
            { label: '도박',   value: '도박',   count: histTypeCounts['도박'] || 0 },
          ].map((tab, i) => {
            const active = typeFilter === tab.value;
            return (
              <button key={tab.value} onClick={() => setTypeFilter(tab.value)} style={{ padding: '7px 14px', fontSize: 13, border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`, marginLeft: i === 0 ? 0 : -1, background: active ? 'var(--t1)' : 'var(--bg2)', color: active ? '#fff' : 'var(--t2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: active ? 600 : 400, position: 'relative', zIndex: active ? 1 : 0 }}>
                {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tab.count}</span>
              </button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 학년도 칩 (비활성) */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 10px', fontSize: 12, borderRadius: 4, height: 31, border: '1px solid var(--bd)', background: 'var(--bg2)', color: 'var(--t3)', userSelect: 'none', boxSizing: 'border-box', cursor: 'not-allowed', opacity: 0.6 }}>
          <span>학년도</span>
          <span style={{ color: 'var(--t2)' }}>{yearFilter}</span>
        </span>

        {/* 기관이름 칩 */}
        <SearchableFilterChip
          label="기관이름"
          value={schoolFilter}
          values={[...new Set(HISTORY.map(r => r.school))].sort()}
          onSelect={val => { setSchoolFilter(val); setPage(1); }}
          onRemove={() => { setSchoolFilter(''); setPage(1); }}
        />

        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 동적 필터 칩 */}
        {chips.map(chip => (
          <DetFilterChip
            key={chip.id}
            chip={chip}
            onSelect={val => selectChipValue(chip.id, val)}
            onRemove={() => removeChip(chip.id)}
            autoOpen={chip.id === lastAddedId}
            filterDefs={HIST_FILTER_DEFS}
          />
        ))}

        {/* + 필터 추가 */}
        <DetAddFilterButton
          activeLabels={chips.map(c => c.label)}
          onAdd={addChip}
          onClearAll={() => { setSchoolFilter(''); setChips([]); setPage(1); }}
          filterDefs={HIST_FILTER_DEFS}
        />

        {/* 검색 (우측) */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="inp"
              style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
              placeholder="학교명, 학년, 반 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setQuery(''); setPage(1); }}
                style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11, lineHeight: 1, padding: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
              >×</button>
            )}
            <button
              onClick={doSearch}
              style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'var(--bg2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'none'; }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Table cols={cols} rows={rows} onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)} />

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  );
}

function TabPlaceholder() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--t3)' }}>
      <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 16, opacity: 0.4 }}>
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
      <div style={{ fontSize: 13, opacity: 0.6 }}>준비 중인 페이지입니다.</div>
    </div>
  );
}

export default function DetectionList() {
  const { openPanel } = usePanel();
  const [activeTab, setActiveTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState('전체');
  const [fromDate, setFromDate]     = useState('');
  const [toDate, setToDate]         = useState('');
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [sortKey, setSortKey]       = useState(null);
  const [sortDir, setSortDir]       = useState('asc');
  const [hiddenCols, setHiddenCols] = useState([]);
  const toggleCol = key => setHiddenCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const toggleOne = id => setSelectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = (ids, allChecked) => setSelectedIds(prev => { const s = new Set(prev); if (allChecked) ids.forEach(id => s.delete(id)); else ids.forEach(id => s.add(id)); return s; });
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const doSearch = () => { setQuery(search); setPage(1); };
  const [yearFilter, setYearFilter] = useState('2026');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [chips, setChips] = useState([]);
  const [lastAddedId, setLastAddedId] = useState(null);
  const addChip = (label) => { const def = DET_FILTER_DEFS[label]; const id = nextChipId++; setChips(prev => [...prev, { id, label, value: def.multi ? [] : '' }]); setLastAddedId(id); };
  const selectChipValue = (id, value) => { setChips(prev => prev.map(c => c.id === id ? { ...c, value } : c)); setPage(1); };
  const removeChip = (id) => { setChips(prev => prev.filter(c => c.id !== id)); setPage(1); };
  useEffect(() => setPage(1), [activeTab, typeFilter, fromDate, toDate, schoolFilter]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const typeCounts = DUMMY.detections.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  let data = DUMMY.detections;
  if (typeFilter !== '전체') data = data.filter(d => d.type === typeFilter);
  if (yearFilter) data = data.filter(d => d.detectedAt.startsWith(yearFilter));
  if (schoolFilter) data = data.filter(d => d.groupName === schoolFilter);
  if (query) data = data.filter(d =>
    d.userName?.includes(query) ||
    d.groupName?.includes(query) ||
    (d.content || []).some(c => c.includes(query))
  );
  data = data.filter(d => {
    if (fromDate && d.detectedAt < fromDate) return false;
    if (toDate && d.detectedAt > toDate + ' 23:59:59') return false;
    for (const chip of chips) {
      const def = DET_FILTER_DEFS[chip.label];
      if (!def) continue;
      if (def.multi) { if (chip.value.length > 0 && !chip.value.includes(d[def.key])) return false; }
      else { if (chip.value && d[def.key] !== chip.value) return false; }
    }
    return true;
  });

  if (sortKey) {
    data = [...data].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), 'ko');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const rows = data.map((r, i) => ({ ...r, _no: data.length - i }));

  const groupMap = Object.fromEntries(DUMMY.groups.map(g => [g.groupId, g.name]));

  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const pageIds = pageRows.map(r => r.detId);

  const gamblingCols = [
    { key: '_no',       label: 'No.',        width: '52px' },
    { key: 'keywords',  label: '탐지 키워드', width: '240px', render: v => <KeywordTags keywords={v || []} /> },
    { key: 'content',   label: '탐지 URL',   width: '180px', render: v => v?.[0] ? <UrlCell url={v[0]} /> : <span style={{ color: 'var(--t3)' }}>—</span> },
    { key: 'groupName', label: '탐지 기관',  width: '110px', sortable: true },
    { key: 'userName',  label: '탐지사용자', width: '100px', sortable: true },
    { key: 'os',        label: '탐지 OS',    width: '80px',  sortable: true },
    { key: 'grade',     label: '탐지등급',   width: '70px',  sortable: true, render: v => <GradeCell v={v} /> },
    { key: 'detectedAt',label: '탐지일시',   width: '150px', sortable: true, render: v => fmtDT(v) },
  ];

  const defaultCols = [
    {
      key: '_chk',
      label: () => {
        const allChecked = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id))
        const someChecked = pageIds.some(id => selectedIds.has(id))
        return (
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={() => toggleAll(pageIds, allChecked)}
          />
        )
      },
      width: '40px',
      align: 'center',
      render: (_, row) => (
        <Checkbox
          checked={selectedIds.has(row.detId)}
          onChange={() => {}}
          onClick={e => { e.stopPropagation(); toggleOne(row.detId) }}
        />
      ),
    },
    { key: '_no',       label: 'No.',       width: '50px' },
    { key: 'grade',     label: '탐지등급',  width: '70px',  sortable: true, render: v => <GradeCell v={v} /> },
    {
      key: 'thumb', label: '탐지항목', width: '200px',
      render: (v, row) => row.type === '도박'
        ? <KeywordTags keywords={row.keywords || []} />
        : <ThumbCell thumb={v} />
    },
    {
      key: 'content', label: '탐지항목 상세', width: '160px',
      render: v => v && v.length > 0
        ? <span style={{ color: 'var(--t2)', fontSize: 12 }}>{v[0]}</span>
        : <span style={{ color: 'var(--t3)' }}>—</span>
    },
    { key: 'os',        label: 'OS',        width: '80px',  sortable: true },
    { key: 'groupName', label: '기관이름',  width: '110px', sortable: true },
    { key: 'groupId',   label: '그룹명',    width: '90px',  sortable: true, render: v => groupMap[v] || '—' },
    { key: 'userName',  label: '학생명',    width: '90px',  sortable: true },
    { key: 'detectedAt', label: '탐지일시', width: '140px', sortable: true, render: v => fmtDT(v) },
  ];

  const COLS_ALL = typeFilter === '도박' ? gamblingCols : defaultCols;
  const cols = COLS_ALL.filter(c => !hiddenCols.includes(c.key));

  const PAGE_TABS = [
    { label: '탐지현황', count: DUMMY.detections.length },
    { label: '탐지이력', count: null },
  ];

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 페이지 탭 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '2px solid var(--bd)', marginBottom: 40 }}>
        <div style={{ display: 'flex' }}>
          {PAGE_TABS.map((tab, i) => {
            const active = activeTab === i;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '12px 20px',
                  fontSize: 22,
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--t2)' : 'var(--t3)',
                  background: 'none',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--t1)' : '2px solid transparent',
                  marginBottom: -2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--t2)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--t3)'; }}
              >
                {tab.label}
                {tab.count !== null && (
                  <span style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: active ? 'var(--ac)' : 'var(--t3)',
                    background: active ? 'color-mix(in srgb, var(--ac) 12%, transparent)' : 'var(--bg3)',
                    padding: '1px 7px',
                    borderRadius: 4,
                    minWidth: 24,
                    textAlign: 'center',
                  }}>{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

      </div>

{/* 탭 콘텐츠 */}
      {activeTab === 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
              {[
                { label: '전체',  value: '전체',  count: DUMMY.detections.length },
                { label: '선정성', value: '선정성', count: typeCounts['선정성'] || 0 },
                { label: '도박',  value: '도박',  count: typeCounts['도박'] || 0 },
              ].map((tab, i) => {
                const active = typeFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setTypeFilter(tab.value)}
                    style={{
                      padding: '7px 14px', fontSize: 13,
                      border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`,
                      marginLeft: i === 0 ? 0 : -1,
                      background: active ? 'var(--t1)' : 'var(--bg2)',
                      color: active ? '#fff' : 'var(--t2)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                      fontWeight: active ? 600 : 400,
                      position: 'relative', zIndex: active ? 1 : 0,
                    }}
                  >
                    {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tab.count}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

            {/* 학년도 칩 (비활성) */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 10px', fontSize: 12, borderRadius: 4, height: 31, border: '1px solid var(--bd)', background: 'var(--bg2)', color: 'var(--t3)', userSelect: 'none', boxSizing: 'border-box', cursor: 'not-allowed', opacity: 0.6 }}>
              <span>학년도</span>
              <span style={{ color: 'var(--t2)' }}>{yearFilter}</span>
            </span>

            {/* 기관이름 칩 */}
            <SearchableFilterChip
              label="기관이름"
              value={schoolFilter}
              values={[...new Set(DUMMY.detections.map(d => d.groupName))].sort()}
              onSelect={val => { setSchoolFilter(val); setPage(1); }}
              onRemove={() => { setSchoolFilter(''); setPage(1); }}
            />

            <DateRangePicker
              from={fromDate}
              to={toDate}
              onChange={({ from, to }) => { setFromDate(from); setToDate(to); }}
              placeholder="탐지일시 선택"
            />

            <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

            {/* 동적 필터 칩 */}
            {chips.map(chip => (
              <DetFilterChip
                key={chip.id}
                chip={chip}
                onSelect={val => selectChipValue(chip.id, val)}
                onRemove={() => removeChip(chip.id)}
                autoOpen={chip.id === lastAddedId}
              />
            ))}

            {/* + 필터 추가 */}
            <DetAddFilterButton
              activeLabels={chips.map(c => c.label)}
              onAdd={addChip}
              onClearAll={() => { setSchoolFilter(''); setChips([]); setFromDate(''); setToDate(''); setPage(1); }}
            />

            {/* 검색 (우측) */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  className="inp"
                  style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
                  placeholder="학생명, 기관이름, URL 검색"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch()}
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setQuery(''); setPage(1); }}
                    style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11, lineHeight: 1, padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                  >×</button>
                )}
                <button
                  onClick={doSearch}
                  style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'var(--bg2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'none'; }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <Table
            cols={cols}
            rows={pageRows}
            onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            actionBar={selectedIds.size > 0 && (
              <>
                <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600 }}>{selectedIds.size}개 선택됨</span>
                <div style={{ width: 1, height: 12, background: 'var(--bd)' }} />
                {[
                  { label: '정탐처리', color: '#3b82f6', icon: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></> },
                  { label: '오탐처리', color: '#ef4444', icon: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></> },
                ].map(({ label, color, icon }) => (
                  <button key={label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', fontSize: 12, borderRadius: 4,
                    border: '1px solid var(--bd)', background: 'transparent',
                    color,
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{icon}</svg>
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedIds(new Set())}
                  style={{ fontSize: 12, color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
                >취소</button>
              </>
            )}
          />
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
            <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
            <div style={{ flex: 1 }}>
              <Pagination page={page} total={data.length} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && <HistoryView />}
    </div>
  );
}
