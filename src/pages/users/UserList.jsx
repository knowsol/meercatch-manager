import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { users } from '../../data/dummy';
import UserNewPanel from './UserNewPanel';
import UserDetailPanel from './UserDetailPanel';

const ROLE_LABEL = { admin: '관리자', staff: '직원', teacher: '교사' };

export default function UserList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const adminCount = users.filter(u => u.role === 'admin').length;
  const staffCount = users.filter(u => u.role === 'staff').length;
  const teacherCount = users.filter(u => u.role === 'teacher').length;

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.includes(search) || u.username.includes(search);
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchStatus = !statusFilter || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const cols = [
    { key: 'name', label: '이름' },
    { key: 'username', label: '아이디' },
    { key: 'role', label: '역할', render: r => ROLE_LABEL[r.role] || r.role },
    { key: 'contact', label: '연락처' },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
    { key: 'lastLogin', label: '최근접속', render: r => fmtDT(r.lastLogin) },
  ];

  return (
    <div>
      <div className="ph">
        <div>
          <h1 className="ph-title">사용자 관리</h1>
          <p className="ph-sub">관리자 및 교사 계정을 관리합니다.</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<UserNewPanel />)}>➕ 사용자 등록</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <KPI label="전체" value={users.length} />
        <KPI label="관리자" value={adminCount} color="ac" />
        <KPI label="직원" value={staffCount} />
        <KPI label="교사" value={teacherCount} color="ok" />
      </div>

      <div className="fb mb-16">
        <input
          className="inp"
          placeholder="이름 / 아이디 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="inp" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">전체 역할</option>
          <option value="admin">admin</option>
          <option value="staff">staff</option>
          <option value="teacher">teacher</option>
        </select>
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
          onRowClick={row => openPanel(<UserDetailPanel userId={row.userId} />)}
        />
      </div>
    </div>
  );
}
