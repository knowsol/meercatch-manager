import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import { groups, pauses } from '../../data/dummy';
import GroupNewPanel from './GroupNewPanel';
import GroupDetailPanel from './GroupDetailPanel';

export default function GroupList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('');
  const [status, setStatus] = useState('');

  const activeCount = groups.filter(g => g.status === 'active').length;
  const pausedCount = groups.filter(g => g.pauseStatus === 'paused').length;
  const totalDevices = groups.reduce((s, g) => s + g.deviceCount, 0);

  const filtered = groups.filter(g => {
    const matchSearch = !search || g.name.includes(search);
    const matchGrade = !grade || String(g.grade) === grade;
    const matchStatus = !status || g.status === status;
    return matchSearch && matchGrade && matchStatus;
  });

  const cols = [
    { key: 'name', label: '그룹명' },
    { key: 'grade', label: '학년', render: r => `${r.grade}학년` },
    { key: 'cls', label: '반', render: r => `${r.cls}반` },
    { key: 'deviceCount', label: '단말 수' },
    { key: 'policyCount', label: '적용 정책' },
    { key: 'pauseStatus', label: '탐지 중단', render: r => <StatusBadge status={r.pauseStatus} /> },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="ph-title">그룹 관리</h1>
          <p className="ph-sub">그룹을 생성하고 단말과 정책을 관리합니다.</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<GroupNewPanel />)}>➕ 그룹 생성</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <KPI label="전체" value={groups.length} />
        <KPI label="활성" value={activeCount} color="ok" />
        <KPI label="탐지중단" value={pausedCount} color="warn" />
        <KPI label="총 단말" value={totalDevices} color="ac" />
      </div>

      <div className="fb mb-16">
        <input
          className="inp"
          placeholder="그룹/학년 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="inp" value={grade} onChange={e => setGrade(e.target.value)}>
          <option value="">전체</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
        <select className="inp" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
      </div>

      <div className="card">
        <Table
          cols={cols}
          rows={filtered}
          onRowClick={row => openPanel(<GroupDetailPanel groupId={row.groupId} />)}
        />
      </div>
    </div>
  );
}
