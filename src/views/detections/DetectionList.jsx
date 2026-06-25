'use client'
import { useState, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import Pagination from '../../components/common/Pagination';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import DetectionDetailPanel from './DetectionDetailPanel';

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
  const color = v === '상' ? 'var(--err)' : v === '중' ? '#f59e0b' : 'var(--t2)';
  return <span style={{ color, fontWeight: 600 }}>{v}</span>;
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


function HistoryView() {
  const { openPanel } = usePanel();
  const [search, setSearch]       = useState('');
  const [inputVal, setInputVal]   = useState('');
  const [fromDate, setFromDate]   = useState('');
  const [toDate, setToDate]       = useState('');
  const [appliedFrom, setAppliedFrom] = useState('');
  const [appliedTo, setAppliedTo]     = useState('');
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(10);
  useEffect(() => setPage(1), [search, appliedFrom, appliedTo]);

  const filtered = HISTORY.filter(r => {
    if (search && !r.school.includes(search) && !r.schoolYear.includes(search) && !r.classNum.includes(search)) return false;
    return true;
  });

  const total = filtered.length;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);
  const rows  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const cols = [
    { key: '_id',       label: 'No.',      width: '55px' },
    { key: 'keywords',  label: '탐지 키워드', width: '200px', render: v => <KeywordTags keywords={v || []} /> },
    { key: 'url',       label: 'URL',      width: '160px', render: v => v ? <UrlCell url={v} /> : <span style={{ color: 'var(--t3)' }}>—</span> },
    { key: 'school',    label: '학교',     width: '120px' },
    { key: 'schoolYear', label: '학생정보', width: '110px', render: (v, row) => `${row.schoolYear} ${row.classNum} ${row.studentNo}번` },
    { key: 'os',        label: 'OS유형',   width: '90px' },
    { key: 'grade',     label: '탐지등급', width: '70px' },
    { key: 'actionType',label: '조치유형', width: '70px' },
    { key: 'detectedAt',label: '탐지일시', width: '160px' },
    { key: 'actionAt',  label: '조치일시', width: '160px' },
    { key: 'operator',  label: '조치자',   width: '90px' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 0, border: '1px solid var(--bd)', borderRadius: 4, overflow: 'hidden', flex: '0 0 auto' }}>
          <input className="inp" placeholder="학교명, 학년, 반으로 검색" style={{ border: 'none', borderRadius: 0, width: 240, outline: 'none', boxShadow: 'none' }}
            value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setSearch(inputVal)} />
          <button className="btn btn-p" style={{ borderRadius: 0, border: 'none', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setSearch(inputVal)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            검색
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--t2)', whiteSpace: 'nowrap' }}>기간 선택</span>
          <input className="inp" type="date" style={{ maxWidth: 150 }} value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <span style={{ color: '#94a3b8', fontSize: 13 }}>~</span>
          <input className="inp" type="date" style={{ maxWidth: 150 }} value={toDate} onChange={e => setToDate(e.target.value)} />
          <button className="btn btn-p" onClick={() => { setAppliedFrom(fromDate); setAppliedTo(toDate); }}>적용</button>
        </div>

        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
          상세 검색
        </button>
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>
        탐지목록 총 <span style={{ color: 'var(--ac)', fontWeight: 600 }}>{total}개</span>
      </div>

      <Table cols={cols} rows={rows} onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13, color: 'var(--t2)' }}>
        <span>총 {total}개 항목 중 {start}-{end}개 표시</span>
        <select className="inp" style={{ maxWidth: 70 }} value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
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
  useEffect(() => setPage(1), [activeTab, typeFilter, fromDate, toDate]);

  const typeCounts = DUMMY.detections.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  let data = DUMMY.detections;
  if (typeFilter !== '전체') data = data.filter(d => d.type === typeFilter);
  data = data.filter(d => {
    if (fromDate && d.detectedAt < fromDate) return false;
    if (toDate && d.detectedAt > toDate + ' 23:59:59') return false;
    return true;
  });

  const rows = data.map((r, i) => ({ ...r, _no: i + 1 }));

  const gamblingCols = [
    { key: '_no',       label: 'No.',        width: '52px' },
    { key: 'keywords',  label: '탐지 키워드', width: '240px', render: v => <KeywordTags keywords={v || []} /> },
    { key: 'content',   label: '탐지 URL',   width: '180px', render: v => v?.[0] ? <UrlCell url={v[0]} /> : <span style={{ color: 'var(--t3)' }}>—</span> },
    { key: 'groupName', label: '탐지학교',   width: '110px' },
    { key: 'userName',  label: '탐지사용자', width: '100px' },
    { key: 'os',        label: '탐지 OS',    width: '80px' },
    { key: 'grade',     label: '탐지등급',   width: '70px',  render: v => <GradeCell v={v} /> },
    { key: 'detectedAt',label: '탐지일시',   width: '150px', render: v => fmtDT(v) },
  ];

  const defaultCols = [
    { key: '_no',       label: 'NO.',         width: '50px' },
    {
      key: 'thumb', label: '탐지항목', width: '200px',
      render: (v, row) => row.type === '도박'
        ? <KeywordTags keywords={row.keywords || []} />
        : <ThumbCell thumb={v} />
    },
    { key: 'groupName', label: '탐지학교',   width: '110px' },
    { key: 'userName',  label: '탐지 사용자', width: '90px' },
    { key: 'deviceName',label: '단말',         width: '90px' },
    { key: 'os',        label: '탐지 OS',      width: '80px' },
    { key: 'type',      label: '탐지 유형',   width: '80px' },
    { key: 'grade',     label: '탐지 등급',   width: '70px' },
    {
      key: 'content', label: 'URL/도메인', width: '160px',
      render: v => v && v.length > 0
        ? <span style={{ color: 'var(--t2)', fontSize: 12 }}>{v[0]}</span>
        : <span style={{ color: 'var(--t3)' }}>—</span>
    },
    { key: 'detectedAt', label: '탐지 일시', width: '140px', render: v => fmtDT(v) },
  ];

  const cols = typeFilter === '도박' ? gamblingCols : defaultCols;

  const PAGE_TABS = [
    { label: '전체 탐지', count: DUMMY.detections.length },
    { label: '키워드 탐지', count: typeCounts['도박'] || 0 },
    { label: '도메인 탐지', count: typeCounts['선정성'] || 0 },
    { label: '탐지 이력', count: null },
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

        {activeTab === 0 && (
          <div style={{ display: 'flex', gap: 8, paddingBottom: 10 }}>
            <button
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--t1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg1)'; e.currentTarget.style.color = 'var(--t2)'; }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/>
              </svg>
              내보내기
            </button>
          </div>
        )}
      </div>

      {/* KPI - 전체 탐지 탭에서만 표시 */}
      {activeTab === 0 && (
        <div className="grid-3 section-gap">
          <KPI label="전체 탐지" value={DUMMY.detections.length} />
          <KPI label="선정성"    value={typeCounts['선정성'] || 0} color="err" />
          <KPI label="도박"      value={typeCounts['도박'] || 0}   color="warn" />
        </div>
      )}

      {/* 탭 콘텐츠 */}
      {activeTab === 0 && (
        <>
          <div className="fb" style={{ marginBottom: 16 }}>
            <select className="inp" style={{ maxWidth: 120 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="전체">전체</option>
              <option value="선정성">선정성</option>
              <option value="도박">도박</option>
            </select>
            <input className="inp" type="date" style={{ maxWidth: 160 }}
              value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <span style={{ color: '#94a3b8', fontSize: 13 }}>~</span>
            <input className="inp" type="date" style={{ maxWidth: 160 }}
              value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>

          <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {data.length}건</div>
          <Table
            cols={cols}
            rows={rows.slice((page - 1) * 25, page * 25)}
            onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
          />
          <Pagination page={page} total={data.length} pageSize={25} onChange={setPage} />
        </>
      )}

      {activeTab === 1 && <TabPlaceholder />}

      {activeTab === 2 && <TabPlaceholder />}

      {activeTab === 3 && <HistoryView />}
    </div>
  );
}
