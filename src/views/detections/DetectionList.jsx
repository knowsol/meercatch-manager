'use client'
import { useState, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import Pagination from '../../components/common/Pagination';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import DetectionDetailPanel from './DetectionDetailPanel';

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

const GRADE_STYLE = {
  '상': { bg: '#fee2e2', color: '#ef4444' },
  '중': { bg: '#fef3c7', color: '#f59e0b' },
  '하': { bg: '#dbeafe', color: '#3b82f6' },
};

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

  const cols = [
    { key: '_no',       label: 'NO.',         width: '50px' },
    { key: 'thumb',     label: '탐지항목 이미지', width: '74px', render: v => <ThumbCell thumb={v} /> },
    { key: 'groupName', label: '탐지학교',     width: '120px' },
    { key: 'userName',  label: '탐지 사용자',   width: '100px' },
    { key: 'deviceName',label: '단말',          width: '100px' },
    { key: 'os',        label: '탐지 OS',       width: '80px' },
    { key: 'type',      label: '탐지 유형',     width: '80px',  render: v => <DetTypeBadge type={v} /> },
    {
      key: 'grade', label: '탐지 등급', width: '80px',
      render: v => {
        const s = GRADE_STYLE[v] || { bg: '#f1f5f9', color: '#64748b' };
        return (
          <span style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 4,
            fontSize: 12, fontWeight: 600, background: s.bg, color: s.color,
          }}>{v}</span>
        );
      }
    },
    {
      key: 'content', label: 'URL/도메인',
      render: v => v && v.length > 0
        ? <span style={{ color: 'var(--t2)', fontSize: 12 }}>{v[0]}</span>
        : <span style={{ color: 'var(--t3)' }}>—</span>
    },
    { key: 'detectedAt', label: '탐지 일시', width: '140px', render: v => fmtDT(v) },
  ];

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

      <div style={{ height: 1, background: 'var(--bd)', margin: '20px 0 16px' }} />

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
        rows={rows.slice((page - 1) * 15, page * 15)}
        onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
      />
      <Pagination page={page} total={data.length} pageSize={15} onChange={setPage} />
    </div>
  );
}
