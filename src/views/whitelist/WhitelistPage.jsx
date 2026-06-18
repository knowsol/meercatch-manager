'use client'
import { useState } from 'react';
import { useToastCtx } from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';

const CATS = ['교육', '포털', '언론', '공공', '기타'];

const INIT = [
  { no:34682, url:'https://whitelist.com',         cat:'교육', name:'whitelist',         registeredAt:'2025.07.22. 오후 03:30:26' },
  { no:34681, url:'https://www.edit.com',           cat:'교육', name:'수정용',            registeredAt:'2025.07.22. 오후 03:16:02' },
  { no:34680, url:'https://www.keris.or.kr',        cat:'교육', name:'한국교육학술정보원', registeredAt:'2025.07.11. 오후 03:59:32' },
  { no:34679, url:'https://www.naver.com',          cat:'포털', name:'네이버',            registeredAt:'2025.07.11. 오후 03:59:32' },
  { no:34678, url:'www.test1000011.com',            cat:'언론', name:'test888',           registeredAt:'2025.06.27. 오후 02:00:00' },
  { no:34677, url:'www.yeonam.es.kr',               cat:'공공', name:'울산연암초등학교',   registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34676, url:'www.yurimyouth.or.kr',           cat:'공공', name:'경기도용인시청소년육성재단유림?', registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34675, url:'younghyeon-p.gne.go.kr',         cat:'공공', name:'영현초등학교',      registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34674, url:'www.yeonbuk.ms.kr',              cat:'공공', name:'서울연북중학교',     registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34673, url:'www.yuseong.go.kr',              cat:'공공', name:'대전광역시유성구',   registeredAt:'2025.06.25. 오후 05:34:05' },
  { no:34672, url:'www.youngdo.go.kr',              cat:'공공', name:'부산영도구청',       registeredAt:'2025.06.25. 오후 05:34:04' },
  { no:34671, url:'www.youtube.com',                cat:'교육', name:'유튜브',            registeredAt:'2025.06.24. 오전 10:00:00' },
  { no:34670, url:'www.ebs.co.kr',                  cat:'교육', name:'EBS',              registeredAt:'2025.06.24. 오전 09:00:00' },
  { no:34669, url:'www.khan.co.kr',                 cat:'언론', name:'경향신문',          registeredAt:'2025.06.23. 오후 02:30:00' },
  { no:34668, url:'www.hani.co.kr',                 cat:'언론', name:'한겨레',            registeredAt:'2025.06.23. 오후 02:00:00' },
  { no:34667, url:'www.moe.go.kr',                  cat:'공공', name:'교육부',            registeredAt:'2025.06.22. 오전 09:00:00' },
  { no:34666, url:'www.neis.go.kr',                 cat:'공공', name:'나이스',            registeredAt:'2025.06.22. 오전 08:30:00' },
  { no:34665, url:'www.daum.net',                   cat:'포털', name:'다음',              registeredAt:'2025.06.21. 오후 03:00:00' },
  { no:34664, url:'www.google.com',                 cat:'포털', name:'구글',              registeredAt:'2025.06.21. 오후 02:00:00' },
  { no:34663, url:'www.wikipedia.org',              cat:'교육', name:'위키피디아',         registeredAt:'2025.06.20. 오전 11:00:00' },
];

export default function WhitelistPage() {
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
  const displayTotal = cat === '전체' && !query ? 34682 : filtered.length;

  const cols = [
    { key: 'no',           label: 'No.',       width: '80px' },
    { key: 'url',          label: 'URL',        render: v => <span style={{ fontSize: 13 }}>{v}</span> },
    { key: 'cat',          label: '서비스 분류', width: '100px' },
    { key: 'name',         label: '서비스명',   width: '200px', render: v => <span style={{ fontSize: 13 }}>{v.length > 18 ? v.slice(0,18)+'...' : v}</span> },
    { key: 'registeredAt', label: '등록일',     width: '180px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
    { key: '_act',         label: '관리',       width: '50px',  render: () => (
      <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', fontSize:18, padding:0 }}
        onClick={() => toast('메뉴를 열었습니다.')}>···</button>
    )},
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left"><div className="ph-title">화이트리스트 관리</div></div>
      </div>

      <div className="fb" style={{ marginBottom: 12, gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--t2)' }}>총 <strong style={{ color: 'var(--t1)' }}>{displayTotal.toLocaleString()}</strong>개 항목</span>
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
