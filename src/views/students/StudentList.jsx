'use client'
import { useState, useEffect } from 'react';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';
import { usePanel } from '../../context/PanelContext';
import { DUMMY } from '../../data/dummy';
import { useSchoolScope } from '../../hooks/useSchoolScope';

export default function StudentList() {
  const { openPanel } = usePanel();
  const { isSchoolAdmin, schoolId } = useSchoolScope();
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search, schoolFilter, gradeFilter, classFilter, statusFilter]);

  const schoolStudents = isSchoolAdmin && schoolId
    ? DUMMY.students.filter(s => s.schoolId === schoolId)
    : DUMMY.students;

  const grades  = [...new Set(schoolStudents.map(s => s.grade).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));
  const classes = [...new Set(schoolStudents.map(s => s.classNum).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));

  const filtered = schoolStudents.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (!isSchoolAdmin && schoolFilter && s.schoolId !== schoolFilter) return false;
    if (gradeFilter && s.grade !== gradeFilter) return false;
    if (classFilter && s.classNum !== classFilter) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    return true;
  });

  const rows = filtered.map((s, i) => {
    const school = DUMMY.schools.find(sc => sc.schoolId === s.schoolId);
    const device = DUMMY.devices.find(d => d.deviceId === s.deviceId);
    return {
      ...s,
      _no: i + 1,
      _school: school ? school.name : '—',
      _device: device ? device.name : '—',
    };
  });

  const cols = [
    { key: '_no',     label: 'No.',    width: '54px' },
    { key: 'name',    label: '이름',   width: '100px' },
    ...(!isSchoolAdmin ? [{ key: '_school', label: '학교', width: '140px' }] : []),
    { key: 'grade',   label: '학년',   width: '80px' },
    { key: 'classNum',label: '반',     width: '70px' },
    { key: 'num',     label: '번호',   width: '60px' },
    { key: '_device', label: '단말기', width: '110px' },
    { key: 'status',  label: '상태',   width: '80px', render: v => v === 'active' ? '활성' : '비활성' },
  ];

  return (
    <div>
      <div className="fb">
        <input className="inp search" placeholder="이름 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        {!isSchoolAdmin && (
          <select className="inp" style={{ maxWidth: 150 }} value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}>
            <option value="">전체 학교</option>
            {DUMMY.schools.map(s => <option key={s.schoolId} value={s.schoolId}>{s.name}</option>)}
          </select>
        )}
        <select className="inp" style={{ maxWidth: 110 }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
          <option value="">전체 학년</option>
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="inp" style={{ maxWidth: 90 }} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="">전체 반</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
        <button className="btn btn-p" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>+ 학생 등록</button>
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {filtered.length}명</div>
      <Table
        cols={cols}
        rows={rows.slice((page - 1) * 25, page * 25)}
      />
      <Pagination page={page} total={filtered.length} pageSize={25} onChange={setPage} />
    </div>
  );
}
