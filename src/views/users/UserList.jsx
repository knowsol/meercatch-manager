'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import UserNewPanel from './UserNewPanel';
import UserDetailPanel from './UserDetailPanel';

const roleLabel = { admin: '관리자', staff: '운영자', teacher: '교사' };
const roleCls = { admin: 'bdg-ac', staff: 'bdg-ok', teacher: 'bdg-muted' };

export default function UserList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const roleCount = DUMMY.users.reduce((a, u) => { a[u.role] = (a[u.role] || 0) + 1; return a; }, {});

  const filtered = DUMMY.users.filter(u => {
    const q = search.toLowerCase();
    if (q && !u.name.toLowerCase().includes(q) && !u.username.toLowerCase().includes(q)) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    return true;
  });

  const cols = [
    {
      key: 'name', label: '이름', render: (v, r) => (
        <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); openPanel(<UserDetailPanel userId={r.userId} />); }}>{v}</a>
      )
    },
    { key: 'username', label: '아이디', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
    {
      key: 'role', label: '역할', width: 80, render: v => (
        <Badge cls={roleCls[v] || 'bdg-muted'}>{roleLabel[v] || v}</Badge>
      )
    },
    { key: 'contact', label: '연락처', width: 130 },
    { key: 'status', label: '상태', width: 80, render: v => <StatusBadge status={v} /> },
    {
      key: 'assignments', label: '담당학교', render: (v) => {
        if (!v || v.length === 0) return '—';
        const schoolNames = [...new Set(
          v.map(a => {
            const grp = DUMMY.groups.find(g => g.groupId === a.groupId);
            const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
            return sch ? sch.name : null;
          }).filter(Boolean)
        )];
        return schoolNames.length > 0 ? schoolNames.join(', ') : '—';
      }
    },
    { key: 'lastLogin', label: '최근로그인', render: v => fmtDT(v) },
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">직원 목록</div>
          <div className="ph-sub">총 {DUMMY.users.length}명</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<UserNewPanel />)}>+ 직원 등록</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <KPI label="전체사용자" value={DUMMY.users.length} />
        <KPI label="관리자" value={roleCount['admin'] || 0} color="ac" />
        <KPI label="운영자" value={roleCount['staff'] || 0} />
        <KPI label="교사" value={roleCount['teacher'] || 0} color="ok" />
      </div>

      <div className="fb">
        <input className="inp search" placeholder="이름 또는 아이디 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 120 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">전체 역할</option>
          <option value="admin">관리자</option>
          <option value="staff">운영자</option>
          <option value="teacher">교사</option>
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      <Table
        cols={cols}
        rows={filtered}
        onRowClick={row => openPanel(<UserDetailPanel userId={row.userId} />)}
      />
    </div>
  );
}
