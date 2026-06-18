'use client'
import { useState } from 'react';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';

const ACTIONS = ['조회', '로그인', '등록', '수정', '삭제'];
const MSGS = [
  '로그인 성공',
  '단말기 API → 학교 단말기 목록 조회 및 검색',
  '선정성 예외 서비스 → 예외 서비스 검색',
  '학교 목록 조회',
  '정책 설정 저장',
  '사용자 계정 수정',
  '탐지 이력 조회',
  '보고서 다운로드',
  '단말기 상태 변경',
  '그룹 정보 등록',
];
const ACCOUNTS = ['superadmin','qwer','admin','manager01','school_admin'];
const ORGS = ['대구광역시교육청','서울특별시교육청','경기도교육청','부산광역시교육청'];
const ROLES = ['최고관리자','교육청 관리자','학교 관리자','일반직원'];
const IPS = ['192.168.0.1','114.203.110.86','10.0.0.5','172.16.0.10'];

function genLogs(total) {
  return Array.from({ length: total }, (_, i) => {
    const no = total - i;
    const isLogin = i % 8 === 0 || i % 8 === 6;
    const action = isLogin ? '로그인' : ACTIONS[(i * 3 + 1) % ACTIONS.length];
    const msg = isLogin ? '로그인 성공' : MSGS[(i * 7 + 2) % MSGS.length];
    const acc = ACCOUNTS[i % ACCOUNTS.length];
    const org = ORGS[i % ORGS.length];
    const role = acc === 'superadmin' ? '최고관리자' : ROLES[(i + 1) % ROLES.length];
    const ip = IPS[i % IPS.length];
    const day = String(Math.max(1, 18 - Math.floor(i / 50))).padStart(2, '0');
    const hour = String(Math.max(0, 23 - (i % 24))).padStart(2, '0');
    const min = String(i % 60).padStart(2, '0');
    return { no, account: acc, action, msg, ip, org, role, occurredAt: `2026.06.${day} ${hour > 11 ? '오후' : '오전'} ${String(Number(hour) > 12 ? Number(hour)-12 : hour).padStart(2,'0')}:${min}`, id: `log-${i}` };
  });
}

const ALL_LOGS = genLogs(282151);
const VISIBLE = ALL_LOGS.slice(0, 5000);


export default function AuditLogList() {
  const [search, setSearch]   = useState('');
  const [action, setAction]   = useState('전체');
  const [fromDate, setFrom]   = useState('');
  const [toDate, setTo]       = useState('');
  const [query, setQuery]     = useState({ search: '', action: '전체', from: '', to: '' });
  const [page, setPage]       = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = VISIBLE.filter(r => {
    if (query.action !== '전체' && r.action !== query.action) return false;
    if (query.search && !r.account.includes(query.search) && !r.msg.includes(query.search)) return false;
    return true;
  });
  const total = query.search || query.action !== '전체' ? filtered.length : 282151;

  const cols = [
    { key: 'no',         label: 'No.',       width: '80px' },
    { key: 'account',    label: '계정명',    width: '100px' },
    { key: 'action',     label: '작업',      width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
    { key: 'msg',        label: '로그 메시지' },
    { key: 'ip',         label: 'IP 주소',   width: '120px', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
    { key: 'org',        label: '조직',      width: '140px' },
    { key: 'role',       label: '권한',      width: '110px' },
    { key: 'occurredAt', label: '발생일시',  width: '160px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
  ];

  function doSearch() {
    setQuery({ search, action, from: fromDate, to: toDate });
    setPage(1);
  }

  return (
    <div>
      <div className="ph">
        <div className="ph-left"><div className="ph-title">감사 로그</div></div>
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px solid var(--bd)', borderRadius: 8, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>검색어</span>
            <input className="inp" style={{ width: 220 }} placeholder="계정명, 로그메시지로 검색"
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>작업</span>
            <select className="inp" style={{ width: 120 }} value={action} onChange={e => setAction(e.target.value)}>
              {['전체', ...ACTIONS].map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--t2)' }}>기간 선택</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input className="inp" type="date" style={{ width: 150 }} value={fromDate} onChange={e => setFrom(e.target.value)} />
              <span style={{ color: 'var(--t3)', lineHeight: 1 }}>~</span>
              <input className="inp" type="date" style={{ width: 150 }} value={toDate} onChange={e => setTo(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-p" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={doSearch}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            검색
          </button>
        </div>
      </div>

      <Table cols={cols} rows={filtered.slice((page - 1) * pageSize, page * pageSize)} />
      <div className="fb" style={{ marginTop: 8, fontSize: 13, color: 'var(--t2)', alignItems: 'center', gap: 8 }}>
        <span>총 {total.toLocaleString()}개 항목 중 {Math.min((page-1)*pageSize+1, filtered.length)}-{Math.min(page*pageSize, filtered.length)}개 표시</span>
        <select className="inp" style={{ maxWidth: 70 }} value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {[10,20,50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}
