import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge, DetTypeBadge } from '../../components/common/Badge';
import { fmtD } from '../../components/common/helpers';
import { policies } from '../../data/dummy';
import PolicyNewPanel from './PolicyNewPanel';
import PolicyDetailPanel from './PolicyDetailPanel';

export default function PolicyList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const activeCount = policies.filter(p => p.active).length;
  const inactiveCount = policies.filter(p => !p.active).length;
  const totalApplied = policies.reduce((s, p) => s + p.appliedCount, 0);

  const filtered = policies.filter(p => {
    const matchSearch = !search || p.name.includes(search) || p.desc.includes(search);
    const matchStatus = !statusFilter || (statusFilter === 'active' ? p.active : !p.active);
    return matchSearch && matchStatus;
  });

  const cols = [
    { key: 'name', label: '정책 이름' },
    { key: 'desc', label: '설명' },
    {
      key: 'types', label: '탐지 유형',
      render: r => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {r.types.map(t => <DetTypeBadge key={t} type={t} />)}
        </div>
      )
    },
    { key: 'appliedCount', label: '적용 그룹' },
    { key: 'active', label: '상태', render: r => <StatusBadge status={r.active ? 'active' : 'inactive'} /> },
    { key: 'updatedAt', label: '수정일', render: r => fmtD(r.updatedAt) },
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="ph-title">정책 관리</h1>
          <p className="ph-sub">탐지 정책을 생성하고 그룹에 적용합니다.</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<PolicyNewPanel />)}>➕ 정책 생성</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <KPI label="전체" value={policies.length} />
        <KPI label="활성" value={activeCount} color="ok" />
        <KPI label="비활성" value={inactiveCount} color="err" />
        <KPI label="적용 그룹" value={totalApplied} color="ac" />
      </div>

      <div className="fb mb-16">
        <input
          className="inp"
          placeholder="정책명 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="inp" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      <div className="card">
        <Table
          cols={cols}
          rows={filtered}
          onRowClick={row => openPanel(<PolicyDetailPanel policyId={row.policyId} />)}
        />
      </div>
    </div>
  );
}
