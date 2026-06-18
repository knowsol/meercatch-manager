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


export default function DetectionList() {
  const { openPanel } = usePanel();
  const [activeTab, setActiveTab] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [activeTab, fromDate, toDate]);

  const typeCounts = DUMMY.detections.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  const TABS = [
    { id: 'all',    label: '전체' },
    { id: '선정성', label: '선정성' },
    { id: '도박',   label: '도박' },
  ];

  let data = DUMMY.detections;
  if (activeTab !== 'all') data = data.filter(d => d.type === activeTab);
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

  const cols = activeTab === '도박' ? gamblingCols : defaultCols;

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">탐지 현황</div>
        </div>
      </div>

      <div className="grid-3 section-gap">
        <KPI label="전체 탐지" value={DUMMY.detections.length} />
        <KPI label="선정성"    value={typeCounts['선정성'] || 0} color="err" />
        <KPI label="도박"      value={typeCounts['도박'] || 0}   color="warn" />
      </div>

      <div className="tabs" style={{ margin: '0 0 16px' }}>
        {TABS.map(t => (
          <div key={t.id} className={`tab${activeTab === t.id ? ' a' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      <div className="fb">
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
    </div>
  );
}
