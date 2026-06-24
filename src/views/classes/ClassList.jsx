'use client'
import { useState, useEffect, useRef } from 'react';
import { DUMMY } from '../../data/dummy';
import Pagination from '../../components/common/Pagination';
import { useSchoolScope } from '../../hooks/useSchoolScope';
import SearchableSelect from '../../components/common/SearchableSelect';

const PAGE_SIZE = 25;

function parseGrade(name) { const m = name?.match(/(\d+)학년/); return m ? m[1] : ''; }
function parseClass(name) { const m = name?.match(/(\d+)반/);  return m ? m[1] : ''; }

export default function ClassList() {
  const { isSchoolAdmin, schoolId } = useSchoolScope();
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [form, setForm] = useState({ name: '', schoolId: '', grade: '', classNum: '' });
  const [excelFile, setExcelFile] = useState(null);
  const addMenuRef = useRef(null);
  useEffect(() => setPage(1), [search, schoolFilter, gradeFilter, classFilter]);
  useEffect(() => {
    const handler = (e) => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allGroups = DUMMY.groups || [];
  const groups = isSchoolAdmin && schoolId
    ? allGroups.filter(g => g.schoolId === schoolId)
    : allGroups;

  const schools = [...new Set(groups.map(g => g.schoolId).filter(Boolean))]
    .map(id => DUMMY.schools?.find(s => s.schoolId === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
  const grades  = [...new Set(groups.map(g => parseGrade(g.name)).filter(Boolean))].sort((a, b) => +a - +b);
  const classes = [...new Set(groups.map(g => parseClass(g.name)).filter(Boolean))].sort((a, b) => +a - +b);

  const filtered = groups.filter(g => {
    const q = search.toLowerCase();
    if (q && !g.name.toLowerCase().includes(q)) return false;
    if (schoolFilter && String(g.schoolId) !== String(schoolFilter)) return false;
    if (gradeFilter && parseGrade(g.name) !== gradeFilter) return false;
    if (classFilter && parseClass(g.name) !== classFilter) return false;
    return true;
  });

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const studentCountByGroup = (groupId) =>
    (DUMMY.students || []).filter(s => s.groupId === groupId).length;

  const activeCount = groups.filter(g => g.status === 'active').length;
  const inactiveCount = groups.filter(g => g.status === 'inactive').length;

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">그룹 관리</div>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        {[
          { label: '전체 그룹', value: groups.length },
          { label: '활성', value: activeCount, color: 'var(--ac)' },
          { label: '비활성', value: inactiveCount, color: '#94a3b8' },
        ].map(k => (
          <div key={k.label} style={{
            flex: 1, background: 'var(--bg1)', border: '1px solid var(--bd)',
            borderRadius: 10, padding: '16px 20px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: k.color || 'var(--t1)' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* 검색 + 필터 + 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {!isSchoolAdmin && (
          <SearchableSelect
            value={schoolFilter}
            onChange={setSchoolFilter}
            options={schools.map(s => ({ value: s.schoolId, label: s.name }))}
            placeholder="전체 학교"
            style={{ width: 130 }}
          />
        )}
        <select
          className="inp"
          value={gradeFilter}
          onChange={e => setGradeFilter(e.target.value)}
          style={{ width: 110, flexShrink: 0 }}
        >
          <option value="">전체 학년</option>
          {grades.map(g => <option key={g} value={g}>{g}학년</option>)}
        </select>
        <select
          className="inp"
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          style={{ width: 100, flexShrink: 0 }}
        >
          <option value="">전체 반</option>
          {classes.map(c => <option key={c} value={c}>{c}반</option>)}
        </select>
        <input
          className="inp search"
          placeholder="그룹명으로 검색"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
        {(schoolFilter || gradeFilter || classFilter || search) && (
          <button className="btn" onClick={() => { setSchoolFilter(''); setGradeFilter(''); setClassFilter(''); setSearch(''); }}
            style={{ color: 'var(--t2)', flexShrink: 0 }}>초기화</button>
        )}
        <div style={{ fontSize: 13, color: 'var(--t2)', whiteSpace: 'nowrap' }}>
          총 <span style={{ color: 'var(--ac)', fontWeight: 600 }}>{filtered.length}</span>개
        </div>
        <div ref={addMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button className="btn btn-p" style={{ whiteSpace: 'nowrap' }} onClick={() => setShowAddMenu(m => !m)}>
            + 새로운 그룹 추가
          </button>
          {showAddMenu && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 180, zIndex: 300,
              background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,.2)', overflow: 'hidden',
            }}>
              <div
                style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setShowAddMenu(false); setForm({ name: '', schoolId: '', grade: '', classNum: '' }); setShowAddForm(true); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                새로운 그룹 추가
              </div>
              <div style={{ height: 1, background: 'var(--bd)' }} />
              <div
                style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setShowAddMenu(false); setExcelFile(null); setShowExcelImport(true); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                엑셀에서 가져오기
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 새로운 그룹 추가 모달 */}
      {showAddForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddForm(false); }}>
          <div style={{ background: 'var(--bg1)', borderRadius: 12, width: 440, boxShadow: '0 8px 32px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>새로운 그룹 추가</span>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {!isSchoolAdmin && (
                <div>
                  <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>학교</label>
                  <SearchableSelect
                    value={form.schoolId}
                    onChange={v => setForm(f => ({ ...f, schoolId: v }))}
                    options={(DUMMY.schools || []).sort((a, b) => a.name.localeCompare(b.name)).map(s => ({ value: s.schoolId, label: s.name }))}
                    placeholder="학교 선택"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>학년</label>
                <select className="inp" style={{ width: '100%' }} value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                  <option value="">학년 선택</option>
                  {[1,2,3,4,5,6].map(g => <option key={g} value={g}>{g}학년</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>반</label>
                <select className="inp" style={{ width: '100%' }} value={form.classNum} onChange={e => setForm(f => ({ ...f, classNum: e.target.value }))}>
                  <option value="">반 선택</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(c => <option key={c} value={c}>{c}반</option>)}
                </select>
              </div>
              {form.grade && form.classNum && (
                <div style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: 13, color: 'var(--t2)' }}>
                  그룹명: <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{form.grade}학년 {form.classNum}반</span>
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setShowAddForm(false)} style={{ color: 'var(--t2)' }}>취소</button>
              <button className="btn btn-p" onClick={() => setShowAddForm(false)}>추가</button>
            </div>
          </div>
        </div>
      )}

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
                엑셀 파일(.xlsx, .xls)을 업로드하면 그룹 목록을 일괄 등록할 수 있습니다.
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>템플릿 다운로드</label>
                <button className="btn" style={{ fontSize: 13, color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  그룹 등록 양식 다운로드
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
      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr>
              {(isSchoolAdmin ? ['No.', '그룹명', '학생 수', '단말기 수', '정책 수', '상태'] : ['No.', '그룹명', '학교', '학생 수', '단말기 수', '정책 수', '상태']).map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((g, i) => {
              const school = DUMMY.schools?.find(s => s.schoolId === g.schoolId);
              const studentCount = studentCountByGroup(g.groupId);
              const no = filtered.length - ((page - 1) * PAGE_SIZE + i);
              return (
                <tr key={g.groupId} className="clickable">
                  <td style={{ color: 'var(--t2)' }}>{no}</td>
                  <td><span style={{ fontWeight: 600 }}>{g.name}</span></td>
                  {!isSchoolAdmin && <td>{school?.name || '-'}</td>}
                  <td>{studentCount}명</td>
                  <td>{g.deviceCount}</td>
                  <td>{g.policyCount}</td>
                  <td>{g.status === 'active' ? '활성' : '비활성'}</td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--t3)', padding: '40px 14px' }}>검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
