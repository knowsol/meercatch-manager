'use client'
import { useState } from 'react';
import { DUMMY } from '../../data/dummy';
import { useSchoolScope } from '../../hooks/useSchoolScope';

const SCHOOL_TYPES = ['전체', '초등학교', '중학교', '고등학교', '기타'];

function getRegion(address) {
  if (!address) return '기타';
  const m = address.match(/^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/);
  return m ? m[1] : '기타';
}

function PgBtn({ label, onClick, disabled, active }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      minWidth: 28, height: 28, padding: '0 5px',
      border: '1px solid var(--bd)', borderRadius: 5,
      background: active ? 'var(--ac)' : 'var(--bg)',
      color: active ? '#fff' : disabled ? 'var(--t3)' : 'var(--t1)',
      fontSize: 12, cursor: disabled ? 'default' : 'pointer',
      fontWeight: active ? 600 : 400,
    }}>{label}</button>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ width: 110, flexShrink: 0, fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, color: value === '-' || !value ? 'var(--t3)' : 'var(--t1)', fontFamily: mono ? 'monospace' : undefined }}>{value || '-'}</div>
    </div>
  );
}

const DETAIL_TABS = ['기본 정보'];

function parseGrade(name) { const m = name?.match(/(\d+)학년/); return m ? m[1] : ''; }
function parseClass(name) { const m = name?.match(/(\d+)반/);  return m ? m[1] : ''; }

function SchoolDetail({ school, onClose }) {
  const groups       = DUMMY.groups.filter(g => g.schoolId === school.schoolId);
  const studentTotal = groups.reduce((sum, g) => sum + (g.studentCount || 0), 0);
  const deviceTotal  = groups.reduce((sum, g) => sum + (g.deviceCount  || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 헤더 */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>{school.name}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{school.type} · {getRegion(school.address)}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="btn">수정</button>
            <button className="btn" style={{ color: 'var(--err)' }}>삭제</button>
            <button onClick={onClose} style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>✕</button>
          </div>
        </div>

        {/* 통계 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[{ label: '학급 수', value: groups.length }, { label: '학생 수', value: studentTotal }, { label: '단말기 수', value: deviceTotal }].map(k => (
            <div key={k.label} style={{ flex: 1, background: '#ffffff', border: '1px solid var(--bd)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 3 }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ac)' }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ borderBottom: '1px solid var(--bd)' }} />
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 8, padding: '0 14px', marginBottom: 16 }}>
          <DetailRow label="학교 구분" value={school.type} />
          <DetailRow label="주소"      value={school.address} />
          <DetailRow label="학교 코드" value={school.schoolCode} mono />
          <DetailRow label="생성일"    value={school.createdAt} />
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>관리자 정보</div>
        <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 8, padding: '0 14px' }}>
          <DetailRow label="관리자" value={school.manager} />
          <DetailRow label="아이디" value={school.loginId} mono />
          <DetailRow label="이메일" value={school.email} />
          <DetailRow label="연락처" value={school.contact} />
        </div>
      </div>
    </div>
  );
}

function AddSchoolModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '32px 28px 24px', width: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ fontSize: 17, fontWeight: 700, textAlign: 'center', marginBottom: 24, color: 'var(--t1)' }}>새로운 학교 추가하기</div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
          <div style={{ flex: 1, border: '1.5px solid var(--bd)', borderRadius: 10, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ac)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bd)'}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--t3)' }}>+</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--t1)', textAlign: 'center' }}>새로운 학교 추가하기</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center', lineHeight: 1.5 }}>관리할 수 있는 새로운 학교를 단건으로 추가해 보세요.</div>
          </div>
          <div style={{ flex: 1, border: '1.5px solid #16a34a', borderRadius: 10, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', background: '#f0fdf4' }}>
            <div style={{ width: 48, height: 48, borderRadius: 8, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#16a34a', textAlign: 'center' }}>엑셀에서 가져오기</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center', lineHeight: 1.5 }}>엑셀에 학교 정보를 등록해 다수의 학교를 등록해 보세요.</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-s" style={{ minWidth: 80 }} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default function GroupList() {
  const { isSchoolAdmin, schoolId } = useSchoolScope();
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]   = useState(10);
  const [showModal, setShowModal] = useState(false);

  if (isSchoolAdmin && schoolId) {
    const mySchool = DUMMY.schools.find(s => s.schoolId === schoolId);
    if (mySchool) return <SchoolDetail school={mySchool} onClose={() => {}} />;
  }

  const filtered = DUMMY.schools.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const start      = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end        = Math.min(currentPage * pageSize, filtered.length);

  const handleClose = () => setSelected(null);

  return (
    <div>
      {showModal && <AddSchoolModal onClose={() => setShowModal(false)} />}

      {/* 헤더 바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap' }}>
          총 <span style={{ color: '#3b82f6' }}>{filtered.length}</span>개의 기관
        </span>
        <input className="inp" placeholder="기관명으로 검색" type="text" value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          style={{ flex: 1, maxWidth: 360 }} />
        <button style={{ marginLeft: 'auto', padding: '7px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
          onClick={() => setShowModal(true)}>+ 새로운 기관 추가</button>
      </div>

      {/* 테이블 */}
      <div style={{ border: '1px solid var(--bd)', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--bd)' }}>
              {['No.', '기관이름', '학교구분', '관리자', '아이디', '이메일', '연락처', '학교코드', '생성일'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((s, i) => {
              const no = filtered.length - ((currentPage - 1) * pageSize + i);
              return (
                <tr key={s.schoolId} style={{ borderBottom: '1px solid var(--bd)', cursor: 'pointer' }}
                  onClick={() => setSelected(prev => prev?.schoolId === s.schoolId ? null : s)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '10px 14px', color: 'var(--t3)', fontSize: 12 }}>{no}</td>
                  <td style={{ padding: '10px 14px', color: '#3b82f6', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '10px 14px' }}>{s.type}</td>
                  <td style={{ padding: '10px 14px', color: s.manager === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.manager || '-'}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{s.loginId}</td>
                  <td style={{ padding: '10px 14px', color: s.email === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.email || '-'}</td>
                  <td style={{ padding: '10px 14px', color: s.contact === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.contact || '-'}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{s.schoolCode}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--t2)', whiteSpace: 'nowrap', fontSize: 12 }}>{s.createdAt}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 하단 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13, color: 'var(--t2)' }}>
        <span>총 {filtered.length}개 항목 중 {start}-{end}개 표시</span>
        <select className="inp" style={{ maxWidth: 70 }} value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
          {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* 페이지네이션 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <PgBtn label="«" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <PgBtn label="‹" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <PgBtn key={p} label={String(p)} onClick={() => setCurrentPage(p)} active={p === currentPage} />
          ))}
          <PgBtn label="›" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
          <PgBtn label="»" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--t3)' }}>현재 {currentPage}페이지 / 총 {totalPages}페이지</div>
      </div>

      {/* 상세 패널 (선택 시) */}
      {selected && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', zIndex: 200, overflowY: 'auto' }}>
          <SchoolDetail school={selected} onClose={handleClose} />
        </div>
      )}
    </div>
  );
}
