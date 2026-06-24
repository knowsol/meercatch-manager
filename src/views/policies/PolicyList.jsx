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
  const [typeFilter, setTypeFilter] = useState('전체');
  const [search, setSearch]         = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage]             = useState(1);
  const [verdicts, setVerdicts]     = useState({});

  useEffect(() => setPage(1), [typeFilter, search, activeFilter]);

  function setVerdict(policyId, verdict) {
    setVerdicts(prev => ({ ...prev, [policyId]: verdict }));
  }

  const byType = typeFilter === '전체'
    ? DUMMY.policies
    : DUMMY.policies.filter(p => p.type === typeFilter);

  const filtered = byType.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter !== '' && String(p.active) !== activeFilter) return false;
    return true;
  });

  function openDetail(row) {
    openPanel(
      <PolicyDetailPanel
        policyId={row.policyId}
        verdict={verdicts[row.policyId]}
        onSetVerdict={(v) => setVerdict(row.policyId, v)}
      />
    );
  }

  const cols = [
    { key: 'type',        label: '탐지 유형', width: '90px' },
    { key: 'name',        label: '정책 이름', render: (v, r) => (
      <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); openDetail(r); }}>{v}</a>
    )},
    { key: 'desc',        label: '설명' },
    { key: '_detect',     label: '탐지 내용', render: (_, r) => <span style={{ fontSize: 13, color: '#374151' }}>{policyDetectSummary(r)}</span> },
    { key: 'appliedCount',label: '적용 그룹', width: '90px', render: v => v + '개' },
    { key: 'active',      label: '상태',      width: '80px', render: v => v ? '활성' : '비활성' },
    { key: 'updatedAt',   label: '수정일',    render: v => fmtD(v) },
    { key: '_verdict',    label: '판정',      width: '80px', render: (_, r) => {
      const v = verdicts[r.policyId];
      if (!v) return <span style={{ color: 'var(--t3)', fontSize: 12 }}>미판정</span>;
      return <span style={{ color: v === '정탐' ? '#10b981' : '#ef4444', fontSize: 12, fontWeight: 600 }}>{v}</span>;
    }},
  ];

  return (
    <div>
      <div className="fb" style={{ marginBottom: 16 }}>
        <input className="inp search" placeholder="정책 이름 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 110 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="전체">전체</option>
          <option value="선정성">선정성</option>
          <option value="도박">도박</option>
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
          <option value="">전체</option>
          <option value="true">활성</option>
          <option value="false">비활성</option>
        </select>
        <button className="btn btn-p" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
          onClick={() => openPanel(<PolicyNewPanel />)}>+ 정책 생성</button>
      </div>

      <Table cols={cols} rows={filtered.slice((page - 1) * 25, page * 25)} onRowClick={openDetail} />
      <Pagination page={page} total={filtered.length} pageSize={25} onChange={setPage} />
    </div>
  );
}
