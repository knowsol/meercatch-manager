'use client'
import { useState, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import Pagination from '../../components/common/Pagination';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { DUMMY } from '../../data/dummy';

export default function StudentList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search, schoolFilter, statusFilter]);

  const active   = DUMMY.students.filter(s => s.status === 'active').length;
  const inactive = DUMMY.students.filter(s => s.status === 'inactive').length;

  const filtered = DUMMY.students.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q)) return false;
    if (schoolFilter && s.schoolId !== schoolFilter) return false;
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
    { key: '_no',     label: 'No.',    width: '50px' },
    { key: 'name',    label: '이름',    width: '100px' },
    { key: '_school', label: '학교' },
    { key: 'grade',   label: '학년',   width: '80px' },
    { key: 'classNum',label: '반',     width: '70px' },
    { key: '_device', label: '단말기',  width: '110px' },
    { key: 'status',  label: '상태',   width: '80px', render: v => v === 'active' ? '활성' : '비활성' },
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">학생 관리</div>
          <div className="ph-sub">총 {DUMMY.students.length}명</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p">+ 학생 등록</button>
        </div>
      </div>

      <div className="grid-3 section-gap">
        <KPI label="전체 학생" value={DUMMY.students.length} />
        <KPI label="활성"      value={active}   color="ok" />
        <KPI label="비활성"    value={inactive} color="err" />
      </div>

      <div className="fb">
        <input className="inp search" placeholder="이름 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 150 }} value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}>
          <option value="">전체 학교</option>
          {DUMMY.schools.map(s => <option key={s.schoolId} value={s.schoolId}>{s.name}</option>)}
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
        </select>
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {filtered.length}명</div>
      <Table
        cols={cols}
        rows={rows.slice((page - 1) * 15, page * 15)}
      />
      <Pagination page={page} total={filtered.length} pageSize={15} onChange={setPage} />
    </div>
  );
}
