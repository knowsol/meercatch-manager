'use client'
import { useState, useEffect, useRef } from 'react';
import { DUMMY } from '../../data/dummy';
import Pagination from '../../components/common/Pagination';
import { usePanel } from '../../context/PanelContext';
import UserNewPanel from './UserNewPanel';

const PERMISSIONS = ['교육청 관리자', '교육청 관리 지원'];
const STATUS_OPTS  = ['전체', '활성', '비활성'];

/* ── 사이드 패널 ── */
function UserPanel({ account, onSave, onDelete, onClose }) {
  const [editing, setEditing]     = useState(false);
  const [pwConfirm, setPwConfirm] = useState(false);
  const [pwDone, setPwDone]       = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);

  /* 수정 폼 상태 */
  const [permission, setPermission] = useState(account.permission);
  const [status, setStatus]         = useState(account.status === 'active' ? '활성화' : '비활성화');

  function handleSave() {
    onSave({ ...account, permission, status: status === '활성화' ? 'active' : 'inactive' });
    setEditing(false);
  }

  const row = (label, value, mono) => (
    <div key={label} style={{ display: 'flex', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ width: 90, flexShrink: 0, fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, color: value ? 'var(--t1)' : 'var(--t3)', fontFamily: mono ? 'monospace' : undefined }}>{value || '-'}</div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>

      {/* 비밀번호 초기화 확인 */}
      {pwConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPwConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 28px 24px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>비밀번호 초기화</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 28 }}>
              <span style={{ fontFamily: 'monospace', color: 'var(--ac)' }}>{account.loginId}</span> 계정의 비밀번호를 초기화하시겠습니까?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setPwConfirm(false)} style={{ minWidth: 64 }}>취소</button>
              <button className="btn" style={{ background: '#1f2937', color: '#fff', border: 'none', minWidth: 64 }}
                onClick={() => { setPwConfirm(false); setPwDone(true); }}>초기화</button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 초기화 완료 */}
      {pwDone && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPwDone(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 28px 24px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>비밀번호 초기화</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 28 }}>
              <span style={{ fontFamily: 'monospace', color: 'var(--ac)' }}>{account.loginId}</span> 계정의 비밀번호가 초기화되었습니다.
            </div>
            <div style={{ textAlign: 'right' }}>
              <button className="btn" style={{ background: '#1f2937', color: '#fff', border: 'none', minWidth: 64 }} onClick={() => setPwDone(false)}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 */}
      {delConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setDelConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px 28px 24px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)', marginBottom: 8 }}>계정 삭제</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 28 }}>
              <span style={{ fontFamily: 'monospace', color: 'var(--err)' }}>{account.loginId}</span> 계정을 삭제하시겠습니까?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setDelConfirm(false)} style={{ minWidth: 64 }}>취소</button>
              <button className="btn" style={{ background: 'var(--err)', color: '#fff', border: 'none', minWidth: 64 }}
                onClick={() => { setDelConfirm(false); onDelete(account.id); onClose(); }}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 패널 헤더 */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>{account.name}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{account.org} · {account.role}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="btn" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => setEditing(true)}>수정</button>
            <button className="btn" style={{ padding: '4px 12px', fontSize: 12, background: 'var(--err)', color: '#fff', border: 'none' }} onClick={() => setDelConfirm(true)}>삭제</button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 18, lineHeight: 1, padding: '0 2px', marginLeft: 2 }}>✕</button>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--bd)' }} />
      </div>

      {/* 패널 본문 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {!editing ? (
          <>
            <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 8, padding: '0 14px', marginBottom: 20 }}>
              {row('소속기관', account.org)}
              {row('역할',     account.role)}
              {row('권한',     account.permission)}
              {row('계정명',   account.loginId, true)}
              {row('계정 상태', account.status === 'active' ? '활성' : '비활성')}
            </div>

            {/* 액션 버튼 */}
            <button className="btn" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => setPwConfirm(true)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              비밀번호 초기화
            </button>
          </>
        ) : (
          /* 수정 폼 */
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 16 }}>계정 수정</div>

            {[['계정아이디', account.loginId], ['역할', account.role], ['기관', account.org]].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ width: 80, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>{label}</div>
                <input className="inp" value={value} readOnly style={{ flex: 1, background: 'var(--bg2)', color: 'var(--t3)', cursor: 'default' }} />
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 80, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>권한</div>
              <select className="inp" value={permission} onChange={e => setPermission(e.target.value)} style={{ flex: 1 }}>
                {PERMISSIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>계정 상태</div>
              <select className="inp" value={status} onChange={e => setStatus(e.target.value)} style={{ flex: 1 }}>
                <option>활성화</option>
                <option>비활성화</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEditing(false)}>취소</button>
              <button className="btn" style={{ flex: 1, justifyContent: 'center', background: '#1f2937', color: '#fff', border: 'none' }} onClick={handleSave}>저장</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function UserList() {
  const { openPanel } = usePanel();
  const [accounts, setAccounts]         = useState([...DUMMY.staffAccounts]);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchInput, setSearchInput]   = useState('');
  const [query, setQuery]               = useState({ status: '전체', search: '' });
  const [page, setPage]                 = useState(1);
  const [pageSize, setPageSize]         = useState(10);
  const [selected, setSelected]         = useState(null);
  const [showAddMenu, setShowAddMenu]   = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [excelFile, setExcelFile]       = useState(null);
  const addMenuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function doSearch() {
    setQuery({ status: statusFilter, search: searchInput });
    setPage(1);
  }

  function handleSave(updated) {
    setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelected(updated);
  }

  function handleDelete(id) {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setSelected(null);
  }

  const filtered = accounts.filter(a => {
    if (query.status !== '전체' && (query.status === '활성' ? a.status !== 'active' : a.status !== 'inactive')) return false;
    if (query.search && !a.org.includes(query.search) && !a.loginId.includes(query.search)) return false;
    return true;
  });

  const total = filtered.length;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);
  const rows  = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      {selected && (
        <UserPanel
          account={selected}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setSelected(null)}
        />
      )}

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
          <input className="inp" style={{ width: 240 }} placeholder="소속기관, 계정명으로 검색"
            value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()} />
        </div>
        <button className="btn btn-p" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={doSearch}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          검색
        </button>
        <div ref={addMenuRef} style={{ position: 'relative', marginLeft: 'auto' }}>
          <button className="btn btn-p" style={{ whiteSpace: 'nowrap' }} onClick={() => setShowAddMenu(m => !m)}>
            + 계정 추가
          </button>
          {showAddMenu && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 200, zIndex: 300,
              background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,.2)', overflow: 'hidden',
            }}>
              <div
                style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setShowAddMenu(false); openPanel(<UserNewPanel />); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                새로운 계정 추가
              </div>
              <div style={{ height: 1, background: 'var(--bd)' }} />
              <div
                style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setShowAddMenu(false); setExcelFile(null); setShowExcelImport(true); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                엑셀에서 가져오기
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 엑셀에서 가져오기 모달 */}
      {showExcelImport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowExcelImport(false); }}>
          <div style={{ background: 'var(--bg1)', borderRadius: 12, width: 480, boxShadow: '0 8px 32px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>엑셀에서 가져오기</span>
              <button onClick={() => setShowExcelImport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                엑셀 파일(.xlsx, .xls)을 업로드하면 계정 목록을 일괄 등록할 수 있습니다.
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>템플릿 다운로드</label>
                <button className="btn" style={{ fontSize: 13, color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  계정 등록 양식 다운로드
                </button>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>파일 업로드</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '32px 20px', border: `2px dashed ${excelFile ? 'var(--ac)' : 'var(--bd)'}`,
                  borderRadius: 8, cursor: 'pointer', background: excelFile ? 'rgba(99,102,241,0.05)' : 'var(--bg3)',
                  transition: 'all .15s',
                }}>
                  <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => setExcelFile(e.target.files?.[0] || null)} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={excelFile ? 'var(--ac)' : 'var(--t3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {excelFile
                    ? <span style={{ fontSize: 13, color: 'var(--ac)', fontWeight: 600 }}>{excelFile.name}</span>
                    : <><span style={{ fontSize: 13, color: 'var(--t2)' }}>파일을 끌어다 놓거나 클릭하여 선택</span>
                       <span style={{ fontSize: 12, color: 'var(--t3)' }}>.xlsx, .xls, .csv</span></>
                  }
                </label>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setShowExcelImport(false)} style={{ color: 'var(--t2)' }}>취소</button>
              <button className="btn btn-p" disabled={!excelFile} style={{ opacity: excelFile ? 1 : 0.4 }} onClick={() => setShowExcelImport(false)}>가져오기</button>
            </div>
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div style={{ border: '1px solid var(--bd)', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--bd)' }}>
              {['No.', '소속기관', '역할', '권한명', '계정명', '계정상태'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => {
              const no = total - ((page - 1) * pageSize + i);
              const isSelected = selected?.id === a.id;
              return (
                <tr key={a.id}
                  onClick={() => setSelected(prev => prev?.id === a.id ? null : a)}
                  style={{ borderBottom: '1px solid var(--bd)', cursor: 'pointer',
                    background: isSelected ? 'var(--bg2)' : '' }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg2)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = ''; }}>
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
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>검색 결과가 없습니다.</td></tr>
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
