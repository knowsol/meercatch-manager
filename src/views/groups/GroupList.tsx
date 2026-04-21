'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { fmtD } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import GroupNewPanel from './GroupNewPanel';
import GroupDetailPanel from './GroupDetailPanel';

export default function GroupList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [status, setStatus] = useState('');

  const active = DUMMY.groups.filter(g => g.status === 'active').length;
  const paused = DUMMY.groups.filter(g => g.pauseStatus === 'paused').length;
  const totalDevices = DUMMY.groups.reduce((a, g) => a + g.deviceCount, 0);
  const schoolTypes = [...new Set(DUMMY.schools.map(s => s.type))];

  const filtered = DUMMY.groups.filter(g => {
    const q = search.toLowerCase();
    if (q && !g.name.toLowerCase().includes(q)) return false;
    if (status && g.status !== status) return false;
    if (schoolType) {
      const sch = DUMMY.schools.find(sc => sc.schoolId === g.schoolId);
      if (!sch || sch.type !== schoolType) return false;
    }
    return true;
  });

  const cols = [
    { key: '_no',        label: 'No.',      width: '50px' },
    { key: '_schoolName', label: '학교',      render: (_, r) => { const s = DUMMY.schools.find(sc => sc.schoolId === r.schoolId); return s ? s.name : '—'; } },
    { key: '_schoolType', label: '학교유형',  width: '90px', render: (_, r) => { const s = DUMMY.schools.find(sc => sc.schoolId === r.schoolId); return s ? <Badge cls="bdg-ac">{s.type}</Badge> : '—'; } },
    { key: 'deviceCount',label: '단말 수',   width: '80px',  render: v => v + '대' },
    { key: 'policyCount',label: '적용 정책', width: '80px',  render: v => v + '개' },
    { key: 'pauseStatus',label: '탐지 중단', width: '100px', render: v => v === 'paused' ? <Badge cls="bdg-warn">중단중</Badge> : <Badge cls="bdg-ok">정상</Badge> },
    { key: 'status',     label: '상태',      width: '80px',  render: v => <StatusBadge status={v} /> },
    { key: 'updatedAt',  label: '최근 수정', render: v => fmtD(v) },
  ];

  const rows = filtered.map((r, i) => ({ ...r, _no: i + 1 }));

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">그룹 목록</div>
          <div className="ph-sub">총 {DUMMY.groups.length}개 그룹</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<GroupNewPanel />)}>+ 그룹 생성</button>
        </div>
      </div>

      <div className="grid-4 section-gap">
        <KPI label="전체 그룹" value={DUMMY.groups.length} />
        <KPI label="활성 그룹" value={active} color="ok" />
        <KPI label="탐지 중단" value={paused} sub="현재 중단 중인 그룹" color="warn" />
        <KPI label="총 단말"   value={totalDevices} sub="등록된 총 단말 수" color="ac" />
      </div>

      <div className="fb">
        <input className="inp search" placeholder="그룹 이름 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 130 }} value={schoolType} onChange={e => setSchoolType(e.target.value)}>
          <option value="">전체 학교유형</option>
          {schoolTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      <Table cols={cols} rows={rows} onRowClick={row => openPanel(<GroupDetailPanel groupId={row.groupId} />)} />
    </div>
  );
}
