import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { devices, groups } from '../../data/dummy';
import DeviceDetailPanel from './DeviceDetailPanel';

export default function DeviceList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  const noPolicyCount = devices.filter(d => d.policyStatus === 'pending').length;

  const filtered = devices.filter(d => {
    const matchSearch = !search || d.name.includes(search) || d.identifier.includes(search);
    const matchGroup = !groupFilter || d.groupId === groupFilter;
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchGroup && matchStatus;
  });

  const cols = [
    { key: 'name', label: '단말 이름' },
    { key: 'identifier', label: '식별자' },
    { key: 'groupName', label: '소속그룹' },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
    { key: 'policyStatus', label: '정책 상태', render: r => <StatusBadge status={r.policyStatus} /> },
    { key: 'lastContact', label: '최근 접속', render: r => fmtDT(r.lastContact) },
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="ph-title">단말기 관리</h1>
          <p className="ph-sub">등록된 단말기를 조회하고 관리합니다.</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p">➕ 단말기 등록</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <KPI label="전체" value={devices.length} />
        <KPI label="온라인" value={onlineCount} color="ok" />
        <KPI label="오프라인" value={offlineCount} color="err" />
        <KPI label="정책 미적용" value={noPolicyCount} color="warn" />
      </div>

      <div className="fb mb-16">
        <input
          className="inp"
          placeholder="단말명 / 식별자 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="inp" value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
          <option value="">전체 그룹</option>
          {groups.map(g => <option key={g.groupId} value={g.groupId}>{g.name}</option>)}
        </select>
        <select className="inp" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="online">온라인</option>
          <option value="offline">오프라인</option>
        </select>
      </div>

      <div className="card">
        <Table
          cols={cols}
          rows={filtered}
          onRowClick={row => openPanel(<DeviceDetailPanel deviceId={row.deviceId} />)}
        />
      </div>
    </div>
  );
}
