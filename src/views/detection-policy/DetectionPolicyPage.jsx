'use client'
import { useState } from 'react';
import { useToastCtx } from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';
import { Badge, StatusBadge } from '../../components/common/Badge';

const ITEMS = ['배', '여성가슴', '남성가슴', '엉덩이', '여성성기', '남성성기'];
const SCOPES = ['교육청', '학교', '전체'];
const OS_TYPES = ['Android', 'iOS', 'Windows', 'WhaleOS', 'ChromeOS'];

const INIT_SERVICES = [
  { id:'sv1', no:21, name:'ChatGPT',            os:'Android', pkg:'com.openai.chatgpt',          registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv2', no:20, name:'claude',              os:'Android', pkg:'com.claude',                  registeredAt:'2025.07.22. 오후 02:48', active:true },
  { id:'sv3', no:19, name:'dodododo',            os:'Android', pkg:'agdads332',                   registeredAt:'2025.06.09. 오후 12:00', active:true },
  { id:'sv4', no:18, name:'EBS English1',        os:'Android', pkg:'kr.co.ebse.player',           registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv5', no:17, name:'EBS 중학·중학 프리미엄', os:'Android', pkg:'kr.ebs.middle.player',     registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv6', no:16, name:'EBS 초등',             os:'Android', pkg:'kr.ebs.primary.player',      registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv7', no:15, name:'EBSi 고교강의',        os:'Android', pkg:'com.coden.android.ebs',      registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv8', no:14, name:'test22',              os:'Android', pkg:'com.google.android.youtube',  registeredAt:'2025.06.17. 오전 11:44', active:true },
  { id:'sv9', no:13, name:'네이버',               os:'Android', pkg:'com.nhn.android.search',     registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv10',no:12, name:'네이버 사전',           os:'Android', pkg:'com.nhn.android.naverdic',   registeredAt:'2025.06.05. 오후 03:52', active:false },
  { id:'sv11',no:11, name:'네이버 지도',           os:'Android', pkg:'com.nhn.android.nmap',       registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv12',no:10, name:'카카오톡',             os:'Android', pkg:'com.kakao.talk',              registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv13',no:9,  name:'유튜브',               os:'Android', pkg:'com.google.android.youtube',  registeredAt:'2025.06.10. 오후 01:00', active:true },
  { id:'sv14',no:8,  name:'구글 크롬',            os:'Android', pkg:'com.android.chrome',          registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv15',no:7,  name:'Play 스토어',          os:'Android', pkg:'com.android.vending',         registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv16',no:6,  name:'설정',                os:'Android', pkg:'com.android.settings',         registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv17',no:5,  name:'카메라',               os:'Android', pkg:'com.android.camera2',         registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv18',no:4,  name:'갤러리',               os:'Android', pkg:'com.sec.android.gallery3d',   registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv19',no:3,  name:'전화',                os:'Android', pkg:'com.android.phone',             registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv20',no:2,  name:'메시지',               os:'Android', pkg:'com.android.mms',             registeredAt:'2025.06.05. 오후 03:52', active:true },
  { id:'sv21',no:1,  name:'시계',                os:'Android', pkg:'com.android.deskclock',         registeredAt:'2025.06.05. 오후 03:52', active:true },
];

export default function DetectionPolicyPage() {
  const toast = useToastCtx();
  const [scope, setScope]     = useState('교육청');
  const [checked, setChecked] = useState(new Set(['여성가슴', '엉덩이', '여성성기', '남성성기']));
  const [osFilter, setOsFilter] = useState('Android');
  const [svcSearch, setSvcSearch] = useState('');
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggle = item => setChecked(prev => {
    const next = new Set(prev);
    next.has(item) ? next.delete(item) : next.add(item);
    return next;
  });

  const filtered = INIT_SERVICES.filter(s => {
    if (osFilter && s.os !== osFilter) return false;
    if (svcSearch && !s.name.includes(svcSearch) && !s.pkg.includes(svcSearch)) return false;
    return true;
  });

  const cols = [
    { key: 'no',            label: 'No.',      width: '60px' },
    { key: 'name',          label: '서비스명',  width: '180px' },
    { key: 'os',            label: 'OS',        width: '90px' },
    { key: 'pkg',           label: '패키지/주소', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
    { key: 'registeredAt',  label: '등록일',    width: '160px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
    { key: 'active',        label: '상태',      width: '70px',  render: v => <span style={{ color: v ? '#10b981' : '#ef4444', fontWeight: 500, fontSize: 13 }}>{v ? '활성' : '비활성'}</span> },
    { key: '_act',          label: '관리',      width: '70px',  render: () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', padding:0 }} onClick={() => toast('수정 기능은 준비 중입니다.')}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:0 }} onClick={() => toast('삭제되었습니다.', 'warn')}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left"><div className="ph-title">예외서비스 관리</div></div>
      </div>

      <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
        <div className="fb" style={{ gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <input className="inp" style={{ maxWidth: 240 }} placeholder="서비스명, OS, 패키지/주소로 검색"
            value={svcSearch} onChange={e => setSvcSearch(e.target.value)} />
          <div style={{ display: 'flex', gap: 6 }}>
            {['Android','iOS','Windows','WhaleOS'].map(os => (
              <button key={os}
                className={`btn${osFilter === os ? ' btn-p' : ' btn-outline'}`}
                style={{ padding: '5px 12px', fontSize: 12 }}
                onClick={() => setOsFilter(osFilter === os ? '' : os)}>{os}</button>
            ))}
          </div>
          <button className="btn btn-outline" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
            onClick={() => toast('서비스 추가 기능은 준비 중입니다.')}>
            + 예외서비스 추가하기
          </button>
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
    </div>
  );
}
