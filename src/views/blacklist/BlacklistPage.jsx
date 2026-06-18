'use client'
import { useState } from 'react';
import { useToastCtx } from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';

const CATS = ['교육', '포털', '언론', '공공', '도박', '기타'];

const INIT = [
  { no:7, url:'https://blacklist1.com',              cat:'교육', name:'blacklist',   registeredAt:'2025.07.22. 오후 03:30:46' },
  { no:6, url:'https://blacklist.com',               cat:'교육', name:'블랙리스트',  registeredAt:'2025.07.22. 오후 03:16:20' },
  { no:5, url:'https://eadfepe-gambling.c...',       cat:'도박', name:'도박사이트',  registeredAt:'2025.07.14. 오후 04:18:26' },
  { no:4, url:'utltr.com',                           cat:'언론', name:'fd',          registeredAt:'2025.07.14. 오전 11:56:07' },
  { no:3, url:'http://www.tooooomanycha...',          cat:'언론', name:'길이테스트',  registeredAt:'2025.06.30. 오후 03:33:49' },
  { no:2, url:'https://example-example-g...',        cat:'언론', name:'박도박01',    registeredAt:'2025.06.26. 오후 08:08:03' },
  { no:1, url:'www.test29.or.kr',                    cat:'기타', name:'테스트29',    registeredAt:'2025.06.26. 오후 01:53:59' },
];

export default function BlacklistPage() {
  const toast = useToastCtx();
  const [cat, setCat]         = useState('전체');
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [page, setPage]       = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = INIT.filter(r => {
    if (cat !== '전체' && r.cat !== cat) return false;
    if (query && !r.url.includes(query) && !r.name.includes(query) && !r.cat.includes(query)) return false;
    return true;
  });

  const cols = [
    { key: 'no',           label: 'No.',       width: '80px' },
    { key: 'url',          label: 'URL',        render: v => <span style={{ fontSize: 13 }}>{v}</span> },
    { key: 'cat',          label: '서비스 분류', width: '100px' },
    { key: 'name',         label: '서비스명',   width: '180px' },
    { key: 'registeredAt', label: '등록일',     width: '180px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
    { key: '_act',         label: '관리',       width: '50px',  render: () => (
      <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', fontSize:18, padding:0 }}
        onClick={() => toast('메뉴를 열었습니다.')}>···</button>
    )},
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left"><div className="ph-title">블랙리스트 관리</div></div>
      </div>

      <div className="fb" style={{ marginBottom: 12, gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--t2)' }}>총 <strong style={{ color: 'var(--t1)' }}>{filtered.length}</strong>개 항목</span>
        <select className="inp" style={{ maxWidth: 100 }} value={cat} onChange={e => { setCat(e.target.value); setPage(1); }}>
          {['전체', ...CATS].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="inp" style={{ maxWidth: 260 }} placeholder="URL, 서비스분류, 서비스명으로 검색"
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (setQuery(search), setPage(1))} />
        <button className="btn btn-p" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => { setQuery(search); setPage(1); }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          검색
        </button>
        <button className="btn btn-outline" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
          onClick={() => toast('추가 기능은 준비 중입니다.')}>+ 추가하기</button>
      </div>

      <Table cols={cols} rows={filtered.slice((page-1)*pageSize, page*pageSize)} />
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
