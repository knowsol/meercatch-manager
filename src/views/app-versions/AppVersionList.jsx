'use client'
import { useState } from 'react';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';

const RAW = [
  { no:28, name:'Meercat.ch',       version:'1.0.0.5', os:'Android', deployedAt:'2026.04.28. 오후 01:40', devices:1 },
  { no:27, name:'Meercat.ch',       version:'1.0.0.4', os:'Android', deployedAt:'2026.04.01. 오후 04:44', devices:1 },
  { no:26, name:'Meercat.ch',       version:'1.0.0.3', os:'Android', deployedAt:'2026.03.25. 오후 01:18', devices:1 },
  { no:25, name:'MeerCat.ch',       version:'1.0.0.1', os:'Windows', deployedAt:'2026.03.11. 오전 10:59', devices:0 },
  { no:24, name:'MeerCat.ch',       version:'7.7.0.7', os:'Windows', deployedAt:'2025.10.14. 오후 03:15', devices:1 },
  { no:23, name:'MeerCat.ch 선정성', version:'1.0.0.2', os:'Android', deployedAt:'2025.09.29. 오후 04:27', devices:2 },
  { no:22, name:'MeerCat.ch',       version:'1.0.0.6', os:'Windows', deployedAt:'2025.09.16. 오후 01:19', devices:4 },
  { no:21, name:'MeerCat.ch',       version:'1.0.0.5', os:'Windows', deployedAt:'2025.08.21. 오후 06:14', devices:11 },
  { no:20, name:'MeerCat.ch',       version:'1.0.0.4', os:'Windows', deployedAt:'2025.08.04. 오전 09:52', devices:2 },
  { no:19, name:'MeerCat.ch',       version:'1.0.0.1', os:'WhaleOS', deployedAt:'2025.08.01. 오후 02:47', devices:6 },
  { no:18, name:'MeerCat.ch',       version:'1.0.0.3', os:'WhaleOS', deployedAt:'2025.07.20. 오후 03:11', devices:3 },
  { no:17, name:'MeerCat.ch',       version:'1.0.0.2', os:'WhaleOS', deployedAt:'2025.07.10. 오전 11:05', devices:8 },
  { no:16, name:'Meercat.ch',       version:'1.0.0.2', os:'Android', deployedAt:'2025.06.28. 오후 02:33', devices:5 },
  { no:15, name:'Meercat.ch',       version:'1.0.0.1', os:'Android', deployedAt:'2025.06.15. 오전 10:20', devices:12 },
  { no:14, name:'MeerCat.ch',       version:'7.7.0.6', os:'Windows', deployedAt:'2025.06.01. 오후 04:00', devices:2 },
  { no:13, name:'MeerCat.ch',       version:'7.7.0.5', os:'Windows', deployedAt:'2025.05.18. 오후 01:45', devices:0 },
  { no:12, name:'MeerCat.ch',       version:'7.7.0.4', os:'Windows', deployedAt:'2025.05.05. 오전 09:30', devices:1 },
  { no:11, name:'MeerCat.ch',       version:'7.7.0.3', os:'Windows', deployedAt:'2025.04.22. 오후 03:15', devices:3 },
  { no:10, name:'MeerCat.ch',       version:'7.7.0.2', os:'Windows', deployedAt:'2025.04.08. 오전 11:00', devices:7 },
  { no:9,  name:'MeerCat.ch',       version:'7.7.0.1', os:'Windows', deployedAt:'2025.03.25. 오후 02:20', devices:4 },
  { no:8,  name:'MeerCat.ch 선정성', version:'1.0.0.1', os:'Android', deployedAt:'2025.03.10. 오후 05:00', devices:0 },
  { no:7,  name:'MeerCat.ch',       version:'7.7.0.0', os:'Windows', deployedAt:'2025.03.01. 오전 10:00', devices:9 },
  { no:6,  name:'MeerCat.ch',       version:'1.0.0.9', os:'WhaleOS', deployedAt:'2025.02.15. 오후 01:30', devices:2 },
  { no:5,  name:'MeerCat.ch',       version:'1.0.0.8', os:'WhaleOS', deployedAt:'2025.02.01. 오전 09:00', devices:5 },
  { no:4,  name:'MeerCat.ch',       version:'1.0.0.7', os:'WhaleOS', deployedAt:'2025.01.18. 오후 03:45', devices:1 },
  { no:3,  name:'Meercat.ch',       version:'1.0.0.0', os:'Android', deployedAt:'2025.01.05. 오전 10:30', devices:0 },
  { no:2,  name:'MeerCat.ch',       version:'7.6.0.1', os:'Windows', deployedAt:'2024.12.20. 오후 02:00', devices:3 },
  { no:1,  name:'MeerCat.ch',       version:'7.6.0.0', os:'Windows', deployedAt:'2024.12.01. 오전 09:00', devices:0 },
];


export default function AppVersionList() {
  const [search, setSearch]       = useState('');
  const [query, setQuery]         = useState('');
  const [pageSize, setPageSize]   = useState(10);
  const [page, setPage]           = useState(1);

  const filtered = RAW.filter(r =>
    !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.version.includes(query)
  );

  const cols = [
    { key: 'no',         label: 'No.',    width: '100px', render: v => <span style={{ color: 'var(--t2)' }}>{v}</span> },
    { key: 'name',       label: '앱 이름' },
    { key: 'version',    label: '버전',   width: '120px' },
    { key: 'os',         label: 'OS 타입',width: '120px', render: v => <span style={{ fontSize: 13 }}>{v}</span> },
    { key: 'deployedAt', label: '배포일' },
    { key: 'devices',    label: '단말기 수', width: '100px', render: v => `${v}대` },
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left"><div className="ph-title">앱 버전 관리</div></div>
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>검색어</div>
        <div className="fb" style={{ gap: 8 }}>
          <input className="inp" style={{ maxWidth: 280 }} placeholder="앱 이름, 버전 등을 검색"
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }} />
          <button className="btn btn-p" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => { setQuery(search); setPage(1); }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            검색
          </button>
          <button className="btn btn-outline" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => { setSearch(''); setQuery(''); setPage(1); }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            초기화
          </button>
        </div>
      </div>

      <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 12 }}>앱 버전 목록</div>
      <Table cols={cols} rows={filtered.slice((page - 1) * pageSize, page * pageSize)} />
      <div className="fb" style={{ marginTop: 8, fontSize: 13, color: 'var(--t2)', alignItems: 'center', gap: 8 }}>
        <span>총 {filtered.length}개 항목 중 {Math.min((page-1)*pageSize+1, filtered.length)}-{Math.min(page*pageSize, filtered.length)}개 표시</span>
        <select className="inp" style={{ maxWidth: 70 }} value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}
