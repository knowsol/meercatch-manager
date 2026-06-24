'use client'
import { useState, useEffect } from 'react';
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
  useEffect(() => setPage(1), [search, schoolFilter, gradeFilter, classFilter]);

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
        <button className="btn btn-p" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          + 새로운 그룹 추가
        </button>
      </div>

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
