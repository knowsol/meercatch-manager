'use client'
import { useState, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useSchoolScope } from '../../hooks/useSchoolScope';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import UserNewPanel from './UserNewPanel';
import UserDetailPanel from './UserDetailPanel';

export default function UserList() {
  const { openPanel } = usePanel();
  const { isSchoolAdmin, schoolGroupIds } = useSchoolScope();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search]);

  const filtered = DUMMY.users.filter(u => {
    const q = search.toLowerCase();
    if (q && !u.name.toLowerCase().includes(q) && !u.username.toLowerCase().includes(q)) return false;
    if (isSchoolAdmin && schoolGroupIds.length) {
      const hasOverlap = (u.assignments || []).some(a => schoolGroupIds.includes(a.groupId));
      if (!hasOverlap) return false;
    }
    return true;
  });

  const cols = [
    {
      key: 'name', label: '이름', width: '80px', render: (v, r) => (
        <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); openPanel(<UserDetailPanel userId={r.userId} />); }}>{v}</a>
      )
    },
    { key: 'username', label: '아이디', width: '110px', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
    { key: 'contact', label: '연락처', width: '130px', render: v => {
      if (!v) return '—';
      return v.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
    }},
    { key: 'email', label: '이메일', width: '190px', render: v => {
      if (!v) return '—';
      const [local, domain] = v.split('@');
      const masked = local.length <= 2 ? local + '****' : local.slice(0, 2) + '****';
      return masked + '@' + domain;
    }},
    { key: 'status', label: '상태', width: '80px', render: v => v === 'active' ? '활성' : '비활성' },
    {
      key: '_grade', label: '학년', width: '100px', render: (_, r) => {
        const grades = [...new Set(
          (r.assignments || []).map(a => {
            const grp = DUMMY.groups.find(g => g.groupId === a.groupId);
            const m = grp?.name?.match(/(\d+)학년/);
            return m ? m[1] + '학년' : null;
          }).filter(Boolean)
        )].sort((a, b) => parseInt(a) - parseInt(b));
        return grades.length > 0 ? grades.join(', ') : '—';
      }
    },
    {
      key: '_class', label: '반', width: '80px', render: (_, r) => {
        const classes = [...new Set(
          (r.assignments || []).map(a => {
            const grp = DUMMY.groups.find(g => g.groupId === a.groupId);
            const m = grp?.name?.match(/(\d+)반/);
            return m ? m[1] + '반' : null;
          }).filter(Boolean)
        )].sort((a, b) => parseInt(a) - parseInt(b));
        return classes.length > 0 ? classes.join(', ') : '—';
      }
    },
    { key: 'lastLogin', label: '최근로그인', width: '150px', render: v => fmtDT(v) },
  ];

  return (
    <div>
      <div className="fb">
        <input className="inp search" placeholder="이름 또는 아이디 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-p" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
          onClick={() => openPanel(<UserNewPanel />)}>+ 직원 등록</button>
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {filtered.length}명</div>
      <Table
        cols={cols}
        rows={filtered.slice((page - 1) * 25, page * 25)}
        onRowClick={row => openPanel(<UserDetailPanel userId={row.userId} />)}
      />
      <Pagination page={page} total={filtered.length} pageSize={25} onChange={setPage} />
    </div>
  );
}
