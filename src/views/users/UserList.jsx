'use client'
import { useState, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import UserNewPanel from './UserNewPanel';
import UserDetailPanel from './UserDetailPanel';

export default function UserList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search]);

  const filtered = DUMMY.users.filter(u => {
    const q = search.toLowerCase();
    if (q && !u.name.toLowerCase().includes(q) && !u.username.toLowerCase().includes(q)) return false;
    return true;
  });

  const cols = [
    {
      key: 'name', label: '이름', render: (v, r) => (
        <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); openPanel(<UserDetailPanel userId={r.userId} />); }}>{v}</a>
      )
    },
    { key: 'username', label: '아이디', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
    { key: 'contact', label: '연락처', width: 130, render: v => {
      if (!v) return '—';
      return v.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
    }},
    { key: 'email', label: '이메일', render: v => {
      if (!v) return '—';
      const [local, domain] = v.split('@');
      const masked = local.length <= 2 ? local + '****' : local.slice(0, 2) + '****';
      return masked + '@' + domain;
    }},
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

      <div className="fb">
        <input className="inp search" placeholder="이름 또는 아이디 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {filtered.length}명</div>
      <Table
        cols={cols}
        rows={filtered.slice((page - 1) * 15, page * 15)}
        onRowClick={row => openPanel(<UserDetailPanel userId={row.userId} />)}
      />
      <Pagination page={page} total={filtered.length} pageSize={15} onChange={setPage} />
    </div>
  );
}
