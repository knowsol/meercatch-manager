'use client'
import { useState, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';
import { fmtD } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import PolicyNewPanel from './PolicyNewPanel';
import PolicyDetailPanel from './PolicyDetailPanel';

function policyDetectSummary(policy) {
  if (policy.type === '선정성') {
    const items = policy.detectionItems || [];
    if (!items.length) return '—';
    return items.slice(0, 2).join(', ') + (items.length > 2 ? ' 외 ' + (items.length - 2) + '개' : '');
  }
  if (policy.type === '도박') return policy.grade ? '탐지등급 ' + policy.grade : '—';
  return '—';
}

export default function PolicyList() {
  const { openPanel } = usePanel();
  const [tab, setTab] = useState('전체');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [tab, search, activeFilter]);

  const tabPolicies = tab === '전체' ? DUMMY.policies : DUMMY.policies.filter(p => p.type === tab);
  const filtered = tabPolicies.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter !== '' && String(p.active) !== activeFilter) return false;
    return true;
  });

  const cols = [
    { key: 'type',        label: '탐지 유형',  width: '90px' },
    { key: 'name',        label: '정책 이름',  render: (v, r) => (
      <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); openPanel(<PolicyDetailPanel policyId={r.policyId} />); }}>{v}</a>
    )},
    { key: 'desc',        label: '설명' },
    { key: '_detect',     label: '탐지 내용',  render: (_, r) => <span style={{ fontSize: 13, color: '#374151' }}>{policyDetectSummary(r)}</span> },
    { key: 'appliedCount',label: '적용 그룹',  width: '90px',  render: v => v + '개' },
    { key: 'active',      label: '상태',       width: '80px',  render: v => v ? '활성' : '비활성' },
    { key: 'updatedAt',   label: '수정일',     render: v => fmtD(v) },
  ];

  return (
    <div>
      <div className="tabs" style={{ marginBottom: 16, marginTop: -10 }}>
        {['전체', '선정성', '도박'].map(t => (
          <div key={t} className={`tab${tab === t ? ' a' : ''}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      <div className="fb" style={{ marginBottom: 16 }}>
        <input className="inp search" placeholder="정책 이름 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 120 }} value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
          <option value="">전체</option>
          <option value="true">활성</option>
          <option value="false">비활성</option>
        </select>
        <button className="btn btn-p" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
          onClick={() => openPanel(<PolicyNewPanel />)}>+ 정책 생성</button>
      </div>

      <Table cols={cols} rows={filtered.slice((page - 1) * 25, page * 25)} onRowClick={row => openPanel(<PolicyDetailPanel policyId={row.policyId} />)} />
      <Pagination page={page} total={filtered.length} pageSize={25} onChange={setPage} />
    </div>
  );
}
