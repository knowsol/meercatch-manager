'use client'
import { useState } from 'react';
import Table from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

export default function PauseHistory() {
  const [search, setSearch] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = DUMMY.pauses.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.requester.toLowerCase().includes(q)) return false;
    if (schoolType) {
      const grp = DUMMY.groups.find(g => g.groupId === p.groupId);
      const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
      if (!sch || sch.type !== schoolType) return false;
    }
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const cols = [
    {
      key: 'groupId', label: '학교', render: v => {
        const grp = DUMMY.groups.find(g => g.groupId === v);
        const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
        return sch ? sch.name : '—';
      }
    },
    { key: 'pauseType', label: '유형' },
    { key: 'requester', label: '요청자' },
    { key: 'startAt', label: '시작', render: v => fmtDT(v) },
    { key: 'endAt', label: '종료', render: v => fmtDT(v) },
    { key: 'reason', label: '사유' },
    { key: 'cancelReason', label: '취소사유', render: v => v || '—' },
    {
      key: 'status', label: '상태', width: '90px', render: (v: string) => {
        if (v === 'ACTIVE') return <Badge cls="bdg-warn">진행중</Badge>;
        if (v === 'EXPIRED') return <Badge cls="bdg-muted">만료</Badge>;
        return <Badge cls="bdg-muted">취소</Badge>;
      }
    },
  ];

  return (
    <div className="pg">
      <div className="pg-h">
        <h1>탐지 중단 이력</h1>
      </div>

      <div className="fb">
        <input className="inp search" placeholder="요청자 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 140 }} value={schoolType} onChange={e => setSchoolType(e.target.value)}>
          <option value="">전체 학교유형</option>
          <option value="중학교">중학교</option>
          <option value="고등학교">고등학교</option>
          <option value="초등학교">초등학교</option>
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="ACTIVE">진행중</option>
          <option value="EXPIRED">만료</option>
          <option value="CANCELLED">취소</option>
        </select>
      </div>

      <Table cols={cols} rows={filtered} />
    </div>
  );
}
