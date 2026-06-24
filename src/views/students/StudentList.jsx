'use client'
import { useState, useEffect, useRef } from 'react';
import Pagination from '../../components/common/Pagination';
import { usePanel } from '../../context/PanelContext';
import { DUMMY } from '../../data/dummy';
import { useSchoolScope } from '../../hooks/useSchoolScope';
import SearchableSelect from '../../components/common/SearchableSelect';
import StudentDetailPanel from './StudentDetailPanel';
import StudentNewPanel from './StudentNewPanel';

const PAGE_SIZE = 25;

export default function StudentList() {
  const { openPanel } = usePanel();
  const { isSchoolAdmin, schoolId } = useSchoolScope();
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const addMenuRef = useRef(null);

  useEffect(() => setPage(1), [search, schoolFilter, gradeFilter, classFilter, statusFilter]);
  useEffect(() => {
    const handler = (e) => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allStudents = isSchoolAdmin && schoolId
    ? DUMMY.students.filter(s => s.schoolId === schoolId)
    : DUMMY.students;

  const schools = [...new Set(allStudents.map(s => s.schoolId).filter(Boolean))]
    .map(id => DUMMY.schools?.find(sc => sc.schoolId === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
  const grades  = [...new Set(allStudents.map(s => s.grade).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));
  const classes = [...new Set(allStudents.map(s => s.classNum).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));

  const filtered = allStudents.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (!isSchoolAdmin && schoolFilter && String(s.schoolId) !== String(schoolFilter)) return false;
    if (gradeFilter && s.grade !== gradeFilter) return false;
    if (classFilter && s.classNum !== classFilter) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    return true;
  });

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">학생 관리</div>
        </div>
      </div>

      {/* 필터 + 등록 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <input className="inp search" placeholder="이름 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        {!isSchoolAdmin && (
          <SearchableSelect
            value={schoolFilter}
            onChange={setSchoolFilter}
            options={schools.map(s => ({ value: s.schoolId, label: s.name }))}
            placeholder="전체 학교"
            style={{ width: 130 }}
          />
        )}
        <select className="inp" style={{ width: 110 }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
          <option value="">전체 학년</option>
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="inp" style={{ width: 90 }} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="">전체 반</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="inp" style={{ width: 110 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>

        <div ref={addMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button className="btn btn-p" style={{ whiteSpace: 'nowrap' }} onClick={() => setShowAddMenu(m => !m)}>
            + 학생 등록
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
                onClick={() => { setShowAddMenu(false); openPanel(<StudentNewPanel />); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                학생 추가
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

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>
        총 <span style={{ color: 'var(--ac)', fontWeight: 600 }}>{filtered.length}</span>명
      </div>

      {/* 테이블 */}
      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr>
              <th>No.</th>
              <th>이름</th>
              {!isSchoolAdmin && <th>학교</th>}
              <th>학년</th>
              <th>반</th>
              <th>번호</th>
              <th>단말기</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s, i) => {
              const school = DUMMY.schools?.find(sc => sc.schoolId === s.schoolId);
              const device = DUMMY.devices?.find(d => d.deviceId === s.deviceId);
              const no = filtered.length - ((page - 1) * PAGE_SIZE + i);
              return (
                <tr key={s.studentId} className="clickable" onClick={() => openPanel(<StudentDetailPanel studentId={s.studentId} />)}>
                  <td style={{ color: 'var(--t2)' }}>{no}</td>
                  <td><span style={{ fontWeight: 600 }}>{s.name}</span></td>
                  {!isSchoolAdmin && <td>{school?.name || '—'}</td>}
                  <td>{s.grade}</td>
                  <td>{s.classNum}</td>
                  <td>{s.num}번</td>
                  <td>{device?.name || '미배정'}</td>
                  <td>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 12,
                      background: s.status === 'active' ? 'rgba(34,197,94,.15)' : 'rgba(148,163,184,.15)',
                      color: s.status === 'active' ? '#22c55e' : '#94a3b8',
                    }}>
                      {s.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--t3)', padding: '40px 14px' }}>검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />

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
                엑셀 파일(.xlsx, .xls)을 업로드하면 학생 목록을 일괄 등록할 수 있습니다.
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>템플릿 다운로드</label>
                <button className="btn" style={{ fontSize: 13, color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  학생 등록 양식 다운로드
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
    </div>
  );
}
