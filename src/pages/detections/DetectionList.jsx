import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge, DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { detections } from '../../data/dummy';
import DetectionDetailPanel from './DetectionDetailPanel';

const TABS = ['전체', '선정성', '도박', '폭력'];

export default function DetectionList() {
  const { openPanel } = usePanel();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const sexCount = detections.filter(d => d.type === '선정성').length;
  const gamblingCount = detections.filter(d => d.type === '도박').length;
  const otherCount = detections.filter(d => ['폭력','혐오','마약'].includes(d.type)).length;

  const tabFilter = TABS[tab];
  const filtered = detections.filter(d => {
    const matchTab = tab === 0 || d.type === tabFilter;
    const matchSearch = !search || d.groupName.includes(search) || d.deviceName.includes(search) || d.policy.includes(search);
    const matchStatus = !statusFilter || d.status === statusFilter;
    const matchDate = !dateFilter || d.detectedAt.startsWith(dateFilter);
    return matchTab && matchSearch && matchStatus && matchDate;
  });

  const cols = [
    {
      key: 'thumb', label: '',
      render: r => (
        <img
          src={`https://picsum.photos/seed/${r.thumb}/56/56`}
          alt="thumb"
          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, display: 'block' }}
        />
      )
    },
    { key: 'detectedAt', label: '탐지시각', render: r => fmtDT(r.detectedAt) },
    { key: 'type', label: '유형', render: r => <DetTypeBadge type={r.type} /> },
    { key: 'groupName', label: '그룹' },
    { key: 'deviceName', label: '단말' },
    { key: 'policy', label: '탐지정책' },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <div className="ph">
        <h1 className="ph-title">탐지 현황</h1>
      </div>

      <div className="grid-4 mb-24">
        <KPI label="전체" value={detections.length} />
        <KPI label="선정성" value={sexCount} color="err" />
        <KPI label="도박" value={gamblingCount} color="warn" />
        <KPI label="기타유해" value={otherCount} color="ac" />
      </div>

      <div className="tabs mb-16">
        {TABS.map((t, i) => (
          <button key={t} className={`tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className="fb mb-16">
        <input
          className="inp"
          placeholder="그룹 / 단말 / 정책 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="inp" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="confirmed">확인됨</option>
          <option value="reviewing">검토중</option>
          <option value="dismissed">무시됨</option>
        </select>
        <input
          className="inp"
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
      </div>

      <div className="card">
        <Table
          cols={cols}
          rows={filtered}
          onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
        />
      </div>
    </div>
  );
}
