import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { pauses } from '../../data/dummy';
import PauseNewPanel from './PauseNewPanel';

export default function PauseList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const activeCount = pauses.filter(p => p.status === 'ACTIVE').length;
  const expiredCount = pauses.filter(p => p.status === 'EXPIRED').length;

  const filtered = pauses.filter(p => {
    const matchSearch = !search || p.groupName.includes(search) || p.requester.includes(search);
    const matchGrade = !grade || String(p.grade) === grade;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchGrade && matchStatus;
  });

  const cols = [
    { key: 'groupName', label: '학년/반' },
    { key: 'pauseType', label: '중단 유형' },
    { key: 'requester', label: '요청자' },
    { key: 'startAt', label: '시작', render: r => fmtDT(r.startAt) },
    { key: 'endAt', label: '종료', render: r => fmtDT(r.endAt) },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="ph-title">탐지중단</h1>
          <p className="ph-sub">탐지 중단 설정을 관리합니다.</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<PauseNewPanel />)}>➕ 중단 설정</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <KPI label="전체" value={pauses.length} />
        <KPI label="활성" value={activeCount} color="warn" />
        <KPI label="예약" value={0} color="ac" />
        <KPI label="만료" value={expiredCount} color="err" />
      </div>

      <div className="fb mb-16">
        <input
          className="inp"
          placeholder="그룹 / 요청자 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="inp" value={grade} onChange={e => setGrade(e.target.value)}>
          <option value="">전체 학년</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
        <select className="inp" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="ACTIVE">활성</option>
          <option value="EXPIRED">만료</option>
        </select>
      </div>

      <div className="card">
        <Table cols={cols} rows={filtered} onRowClick={() => {}} />
      </div>
    </div>
  );
}
