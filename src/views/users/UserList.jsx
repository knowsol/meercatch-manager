'use client'
import { useState, useRef, useEffect } from 'react';
import { DUMMY } from '../../data/dummy';
import Pagination from '../../components/common/Pagination';

const PERMISSIONS = ['교육청 관리자', '교육청 관리 지원'];
const STATUS_OPTS  = ['전체', '활성', '비활성'];

function EditModal({ account, onClose }) {
  const [permission, setPermission] = useState(account.permission);
  const [status, setStatus]         = useState(account.status === 'active' ? '활성화' : '비활성화');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '28px 28px 24px', width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>계정 수정</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--t3)', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 24 }}>계정 정보를 수정합니다.</div>

        {[['계정아이디', account.loginId], ['역할', account.role], ['기관', account.org]].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 88, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>{label}</div>
            <input className="inp" value={value} readOnly style={{ flex: 1, background: 'var(--bg2)', color: 'var(--t3)', cursor: 'default' }} />
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ width: 88, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>권한</div>
          <select className="inp" value={permission} onChange={e => setPermission(e.target.value)} style={{ flex: 1 }}>
            {PERMISSIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ width: 88, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>계정 상태</div>
          <select className="inp" value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1 }}>
            <option>활성화</option>
            <option>비활성화</option>
          </select>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button className="btn" style={{ background: '#1f2937', color: '#fff', border: 'none', minWidth: 64 }} onClick={onClose}>수정</button>
        </div>
      </div>
    </div>
  );
}

function ActionDropdown({ account, onEdit, onClose }) {
  return (
    <div style={{ position: 'absolute', right: 8, top: 32, background: '#fff', border: '1px solid var(--bd)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 148, padding: '4px 0' }}>
      <button onClick={() => { onEdit(); onClose(); }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 16px', background: 'none', border: 'none', fontSize: 13, color: 'var(--t1)', cursor: 'pointer', textAlign: 'left' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        수정
      </button>
      <button onClick={onClose}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 16px', background: 'none', border: 'none', fontSize: 13, color: 'var(--err)', cursor: 'pointer', textAlign: 'left' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        삭제
      </button>
      <button onClick={onClose}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 16px', background: 'none', border: 'none', fontSize: 13, color: 'var(--t1)', cursor: 'pointer', textAlign: 'left' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        비밀번호 초기화
      </button>
    </div>
  );
}

export default function UserList() {
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchInput, setSearchInput]   = useState('');
  const [query, setQuery]               = useState({ status: '전체', search: '' });
  const [page, setPage]                 = useState(1);
  const [pageSize, setPageSize]         = useState(10);
  const [openMenu, setOpenMenu]         = useState(null);
  const [editAccount, setEditAccount]   = useState(null);

  useEffect(() => {
    function handleClick() { setOpenMenu(null); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function doSearch() {
    setQuery({ status: statusFilter, search: searchInput });
    setPage(1);
  }

  const filtered = DUMMY.staffAccounts.filter(a => {
    if (query.status !== '전체' && (query.status === '활성' ? a.status !== 'active' : a.status !== 'inactive')) return false;
    if (query.search && !a.org.includes(query.search) && !a.loginId.includes(query.search)) return false;
    return true;
  });

  const total    = filtered.length;
  const start    = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end      = Math.min(page * pageSize, total);
  const rows     = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      {editAccount && <EditModal account={editAccount} onClose={() => setEditAccount(null)} />}

      {/* 필터 바 */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--t2)' }}>계정 상태</span>
          <select className="inp" style={{ width: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--t2)' }}>검색어</span>
          <input className="inp" style={{ width: 240 }} placeholder="소속기관,계정명으로 검색"
            value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()} />
        </div>
        <button className="btn btn-p" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={doSearch}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          검색
        </button>
        <button className="btn btn-outline" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>+ 계정 추가</button>
      </div>

      {/* 테이블 */}
      <div style={{ border: '1px solid var(--bd)', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--bd)' }}>
              {['No.', '소속기관', '역할', '권한명', '계정명', '계정상태', '관리'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => {
              const no = total - ((page - 1) * pageSize + i);
              return (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--bd)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '10px 16px', color: 'var(--t3)', fontSize: 12 }}>{no}</td>
                  <td style={{ padding: '10px 16px' }}>{a.org}</td>
                  <td style={{ padding: '10px 16px' }}>{a.role}</td>
                  <td style={{ padding: '10px 16px' }}>{a.permission}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12 }}>{a.loginId}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                      background: a.status === 'active' ? '#f0fdf4' : 'var(--bg2)',
                      color: a.status === 'active' ? '#16a34a' : 'var(--t3)',
                      border: `1px solid ${a.status === 'active' ? '#bbf7d0' : 'var(--bd)'}` }}>
                      {a.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', position: 'relative' }}>
                    <button
                      onMouseDown={e => { e.stopPropagation(); setOpenMenu(openMenu === a.id ? null : a.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--t3)', padding: '2px 6px', borderRadius: 4 }}>
                      •••
                    </button>
                    {openMenu === a.id && (
                      <ActionDropdown
                        account={a}
                        onEdit={() => setEditAccount(a)}
                        onClose={() => setOpenMenu(null)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13, color: 'var(--t2)' }}>
        <span>총 {total}개 항목 중 {start}-{end}개 표시</span>
        <select className="inp" style={{ maxWidth: 70 }} value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}
