'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import GroupNewPanel from './GroupNewPanel';
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

const DETAIL_TABS = ['기본 정보', '학급 관리'];

function parseGrade(name) { const m = name?.match(/(\d+)학년/); return m ? m[1] : ''; }
function parseClass(name) { const m = name?.match(/(\d+)반/);  return m ? m[1] : ''; }

function SchoolDetail({ school, onClose }) {
  const [tab, setTab] = useState('기본 정보');
  const [groupPage, setGroupPage] = useState(1);
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const GP = 20;
  const groups       = DUMMY.groups.filter(g => g.schoolId === school.schoolId);
  const studentTotal = groups.reduce((sum, g) => sum + (g.studentCount || 0), 0);
  const deviceTotal  = groups.reduce((sum, g) => sum + (g.deviceCount  || 0), 0);

  const grades  = [...new Set(groups.map(g => parseGrade(g.name)).filter(Boolean))].sort((a, b) => +a - +b);
  const classes = [...new Set(groups.map(g => parseClass(g.name)).filter(Boolean))].sort((a, b) => +a - +b);

  const filteredGroups = groups.filter(g => {
    if (gradeFilter && parseGrade(g.name) !== gradeFilter) return false;
    if (classFilter && parseClass(g.name) !== classFilter) return false;
    return true;
  });

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

        {/* 탭 */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--bd)', gap: 0 }}>
          {DETAIL_TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setGroupPage(1); }} style={{
              padding: '8px 16px', fontSize: 13, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? 'var(--ac)' : 'var(--t2)',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === t ? '2px solid var(--ac)' : '2px solid transparent',
              marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {tab === '기본 정보' && (
          <>
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
          </>
        )}
        {tab === '학급 관리' && (() => {
          if (groups.length === 0) return <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--t3)', fontSize: 13 }}>등록된 학급이 없습니다.</div>;
          const gpTotal = Math.max(1, Math.ceil(filteredGroups.length / GP));
          const gpSlice = filteredGroups.slice((groupPage - 1) * GP, groupPage * GP);
          return (
            <>
              {/* 학년/반 필터 */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                <select
                  className="inp"
                  value={gradeFilter}
                  onChange={e => { setGradeFilter(e.target.value); setGroupPage(1); }}
                  style={{ width: 110, flexShrink: 0 }}
                >
                  <option value="">전체 학년</option>
                  {grades.map(g => <option key={g} value={g}>{g}학년</option>)}
                </select>
                <select
                  className="inp"
                  value={classFilter}
                  onChange={e => { setClassFilter(e.target.value); setGroupPage(1); }}
                  style={{ width: 100, flexShrink: 0 }}
                >
                  <option value="">전체 반</option>
                  {classes.map(c => <option key={c} value={c}>{c}반</option>)}
                </select>
                {(gradeFilter || classFilter) && (
                  <button
                    className="btn"
                    onClick={() => { setGradeFilter(''); setClassFilter(''); setGroupPage(1); }}
                    style={{ color: 'var(--t2)', flexShrink: 0 }}
                  >초기화</button>
                )}
                <span style={{ fontSize: 12, color: 'var(--t3)', marginLeft: 'auto' }}>
                  {filteredGroups.length}개 학급
                </span>
              </div>

              <div style={{ border: '1px solid var(--bd)', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#ffffff', borderBottom: '1px solid var(--bd)' }}>
                      {['학급명', '학생 수', '단말기 수', '상태'].map(h => (
                        <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gpSlice.map(g => (
                      <tr key={g.groupId} style={{ borderBottom: '1px solid var(--bd)' }}>
                        <td style={{ padding: '9px 12px', color: 'var(--ac)', fontWeight: 500 }}>{g.name}</td>
                        <td style={{ padding: '9px 12px' }}>{g.studentCount || 0}명</td>
                        <td style={{ padding: '9px 12px' }}>{g.deviceCount}</td>
                        <td style={{ padding: '9px 12px' }}>{g.status === 'active' ? '활성' : '비활성'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {gpTotal > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, paddingTop: 12 }}>
                  <PgBtn label="‹" onClick={() => setGroupPage(p => Math.max(1, p - 1))} disabled={groupPage === 1} />
                  {Array.from({ length: gpTotal }, (_, i) => i + 1).map(p => (
                    <PgBtn key={p} label={String(p)} onClick={() => setGroupPage(p)} active={p === groupPage} />
                  ))}
                  <PgBtn label="›" onClick={() => setGroupPage(p => Math.min(gpTotal, p + 1))} disabled={groupPage === gpTotal} />
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

export default function GroupList() {
  const { openPanel } = usePanel();
  const { isSchoolAdmin, schoolId } = useSchoolScope();
  const [search, setSearch]         = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selected, setSelected]     = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (isSchoolAdmin && schoolId) {
    const mySchool = DUMMY.schools.find(s => s.schoolId === schoolId);
    if (mySchool) return <SchoolDetail school={mySchool} onClose={() => {}} />;
  }
  const PAGE_SIZE = 25;

  const regions = ['전체', ...Array.from(new Set(DUMMY.schools.map(s => getRegion(s.address))))];

  const filtered = DUMMY.schools.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (regionFilter && regionFilter !== '전체' && getRegion(s.address) !== regionFilter) return false;
    if (typeFilter && typeFilter !== '전체') {
      const isOther = !['초등학교', '중학교', '고등학교'].includes(s.type);
      if (typeFilter === '기타' ? !isOther : s.type !== typeFilter) return false;
    }
    return true;
  });

  const handleSelect = (s) => setSelected(prev => prev?.schoolId === s.schoolId ? null : s);
  const handleClose  = () => setSelected(null);

  return (
    <div>
      {/* 필터 바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <select className="inp" value={regionFilter} onChange={e => { setRegionFilter(e.target.value); setCurrentPage(1); }} style={{ width: 120, flexShrink: 0 }}>
          {regions.map(r => <option key={r} value={r === '전체' ? '' : r}>{r === '전체' ? '전체 지역' : r}</option>)}
        </select>
        <select className="inp" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} style={{ width: 140, flexShrink: 0 }}>
          {SCHOOL_TYPES.map(t => <option key={t} value={t === '전체' ? '' : t}>{t === '전체' ? '전체 학교 구분' : t}</option>)}
        </select>
        <input className="inp search" placeholder="기관명으로 검색" type="text" value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} style={{ flex: 1 }} />
        {(search || regionFilter || typeFilter) && (
          <button className="btn" onClick={() => { setSearch(''); setRegionFilter(''); setTypeFilter(''); setCurrentPage(1); }}
            style={{ whiteSpace: 'nowrap', flexShrink: 0, color: 'var(--t2)' }}>초기화</button>
        )}
        <button className="btn btn-p" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          onClick={() => openPanel(<GroupNewPanel />)}>+ 새로운 기관 추가</button>
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 12 }}>
        총 <span style={{ color: 'var(--ac)', fontWeight: 600 }}>{filtered.length}</span>개의 기관
      </div>

      {/* 메인 영역 */}
      {(() => {
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
        return (
          <>
            <div style={{ display: 'flex', borderTop: '1px solid var(--bd)', overflow: 'hidden' }}>

              {/* 테이블: 선택 전엔 전체 컬럼, 선택 후엔 No.+기관이름만 */}
              <div style={{
                flex: selected ? '0 0 260px' : '1',
                borderRight: selected ? '1px solid var(--bd)' : 'none',
                overflowY: 'auto',
                transition: 'flex 0.2s',
                background: selected ? 'rgba(0,0,0,0.18)' : 'transparent',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--bd)', background: 'var(--bg2)' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap', width: 52 }}>No.</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>기관이름</th>
                      {!selected && <>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>학교구분</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>관리자</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>아이디</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>이메일</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>연락처</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>학교코드</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>생성일</th>
                      </>}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((s, i) => {
                      const no = filtered.length - ((currentPage - 1) * PAGE_SIZE + i);
                      const isActive = selected?.schoolId === s.schoolId;
                      return (
                        <tr key={s.schoolId}
                          style={{
                            cursor: 'pointer',
                            boxShadow: isActive ? 'inset 3px 0 0 var(--ac)' : 'none',
                            background: isActive ? '#ffffff' : 'transparent',
                            transition: 'background 0.1s',
                          }}
                          onClick={() => handleSelect(s)}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = selected ? 'rgba(255,255,255,0.08)' : 'var(--bg2)'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                          <td style={{ padding: '10px 14px', color: 'var(--t3)', fontSize: 12 }}>{no}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--t1)', fontWeight: 600 }}>{s.name}</td>
                          {!selected && <>
                            <td style={{ padding: '10px 14px' }}>{s.type}</td>
                            <td style={{ padding: '10px 14px', color: s.manager === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.manager}</td>
                            <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{s.loginId}</td>
                            <td style={{ padding: '10px 14px', color: s.email === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.email}</td>
                            <td style={{ padding: '10px 14px', color: s.contact === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.contact}</td>
                            <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{s.schoolCode}</td>
                            <td style={{ padding: '10px 14px', color: 'var(--t2)', whiteSpace: 'nowrap' }}>{s.createdAt}</td>
                          </>}
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={selected ? 2 : 9} style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>검색 결과가 없습니다.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 오른쪽: 상세 패널 (선택 시에만) */}
              {selected && (
                <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff', minWidth: 0 }}>
                  <SchoolDetail school={selected} onClose={handleClose} />
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, padding: '14px 0 4px' }}>
                <PgBtn label="‹" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PgBtn key={p} label={String(p)} onClick={() => setCurrentPage(p)} active={p === currentPage} />
                ))}
                <PgBtn label="›" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
              </div>
            )}
          </>
        );
      })()}

    </div>
  );
}
