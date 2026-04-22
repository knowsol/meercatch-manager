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
    { id: 'all',   label: '전체' },
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

  const cols = [
    { key: 'detectedAt', label: '탐지 시각', render: v => fmtDT(v) },
    { key: 'type',       label: '유형',    width: '80px', render: v => <DetTypeBadge type={v} /> },
    { key: 'deviceName', label: '단말' },
    {
      key: 'content', label: 'URL/도메인', render: (v, r) =>
        r.type === '도박' && v && v.length > 0
          ? <span style={{ color: 'var(--t2)', fontSize: 12 }}>{v[0]}</span>
          : <span style={{ color: 'var(--t3)' }}>—</span>
    },
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">탐지 현황</div>
        </div>
      </div>

      {/* KPI 먼저 */}
      <div className="grid-3 section-gap">
        <KPI label="전체 탐지" value={DUMMY.detections.length} />
        <KPI label="선정성"    value={typeCounts['선정성'] || 0} color="err" />
        <KPI label="도박"      value={typeCounts['도박'] || 0}   color="warn" />
      </div>

      {/* 구분선 */}
      <div style={{ height: 1, background: 'var(--bd)', margin: '20px 0 16px' }} />

      {/* 탭 */}
      <div className="tabs" style={{ margin: '0 0 16px' }}>
        {TABS.map(t => (
          <div key={t.id} className={`tab${activeTab === t.id ? ' a' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* 필터 */}
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
        rows={data.slice((page - 1) * 15, page * 15)}
        onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
      />
      <Pagination page={page} total={data.length} pageSize={15} onChange={setPage} />
    </div>
  );
}
