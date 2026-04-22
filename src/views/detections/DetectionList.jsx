'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import DetectionDetailPanel from './DetectionDetailPanel';

export default function DetectionList() {
  const { openPanel } = usePanel();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const typeCounts = DUMMY.detections.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});

  const TABS = [
    { id: 'all',   label: `전체 (${DUMMY.detections.length})` },
    { id: '선정성', label: `선정성 (${typeCounts['선정성'] || 0})` },
    { id: '도박',   label: `도박 (${typeCounts['도박'] || 0})` },
  ];

  let data = DUMMY.detections;
  if (activeTab !== 'all') data = data.filter(d => d.type === activeTab);
  data = data.filter(d => {
    const q = search.toLowerCase();
    if (q && !d.deviceName.toLowerCase().includes(q)) return false;
    if (dateFilter && !d.detectedAt.startsWith(dateFilter)) return false;
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
          <div className="ph-sub">총 {DUMMY.detections.length}건</div>
        </div>
      </div>

      {/* KPI 먼저 */}
      <div className="grid-3 section-gap">
        <KPI label="전체 탐지" value={DUMMY.detections.length} />
        <KPI label="선정성"    value={typeCounts['선정성'] || 0} color="err" />
        <KPI label="도박"      value={typeCounts['도박'] || 0}   color="warn" />
      </div>

      {/* 탭 */}
      <div className="tabs" style={{ margin: '16px 0' }}>
        {TABS.map(t => (
          <div key={t.id} className={`tab${activeTab === t.id ? ' a' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="fb">
        <input className="inp search" placeholder="단말 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <input className="inp" type="date" style={{ maxWidth: 160 }}
          value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
      </div>

      <Table
        cols={cols}
        rows={data}
        onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
      />
    </div>
  );
}
