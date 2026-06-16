'use client'
import { useState, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import GroupDetailPanel from './GroupDetailPanel';
import GroupNewPanel from './GroupNewPanel';
import { DUMMY } from '../../data/dummy';

const PAGE_SIZES = [10, 20, 50];

function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
      <div style={{ fontSize: 13, color: 'var(--t2)' }}>
        총 {total}개 항목 중 {from}-{to}개 표시
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <PgBtn label="«" onClick={() => onChange(1)}           disabled={page === 1} />
        <PgBtn label="‹" onClick={() => onChange(page - 1)}    disabled={page === 1} />
        {pages.map(p => (
          <PgBtn key={p} label={p} onClick={() => onChange(p)} active={p === page} />
        ))}
        <PgBtn label="›" onClick={() => onChange(page + 1)}    disabled={page === totalPages} />
        <PgBtn label="»" onClick={() => onChange(totalPages)}  disabled={page === totalPages} />
      </div>
      <div style={{ fontSize: 13, color: 'var(--t2)' }}>
        현재 {page}페이지 / 총 {totalPages}페이지
      </div>
    </div>
  );
}

function PgBtn({ label, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, padding: '0 6px',
        border: '1px solid var(--bd)', borderRadius: 6,
        background: active ? 'var(--ac)' : 'var(--bg)',
        color: active ? '#fff' : disabled ? 'var(--t3)' : 'var(--t1)',
        fontSize: 13, cursor: disabled ? 'default' : 'pointer',
        fontWeight: active ? 600 : 400,
      }}
    >{label}</button>
  );
}

export default function GroupList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => setPage(1), [search, pageSize]);

  const filtered = DUMMY.schools.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q)) return false;
    return true;
  });

  const rows = filtered.map((s, i) => ({ ...s, _no: filtered.length - i }));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">기관 관리</div>
        </div>
      </div>

      {/* 검색 + 버튼 바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap' }}>
          총 <span style={{ color: 'var(--ac)' }}>{filtered.length}</span>개의 기관
        </div>
        <input
          className="inp search"
          placeholder="기관명으로 검색"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 360 }}
        />
        <button className="btn btn-p" style={{ whiteSpace: 'nowrap' }}
          onClick={() => openPanel(<GroupNewPanel />)}>
          + 새로운 기관 추가
        </button>
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
            {paged.map((s, i) => (
              <tr
                key={s.schoolId}
                style={{ borderBottom: '1px solid var(--bd)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
                onClick={() => openPanel(<GroupDetailPanel groupId={DUMMY.groups.find(g => g.schoolId === s.schoolId)?.groupId} />)}
              >
                <td style={{ padding: '10px 14px', color: 'var(--t2)' }}>{s._no}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ color: 'var(--ac)', cursor: 'pointer', fontWeight: 500 }}>{s.name}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>{s.type}</td>
                <td style={{ padding: '10px 14px', color: s.manager === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.manager}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{s.loginId}</td>
                <td style={{ padding: '10px 14px', color: s.email === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.email}</td>
                <td style={{ padding: '10px 14px', color: s.contact === '-' ? 'var(--t3)' : 'var(--t1)' }}>{s.contact}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{s.schoolCode}</td>
                <td style={{ padding: '10px 14px', color: 'var(--t2)', whiteSpace: 'nowrap' }}>{s.createdAt}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--t3)' }}>검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지 크기 + 페이지네이션 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--t2)' }}>총 {filtered.length}개 항목 중 {filtered.length === 0 ? 0 : (page-1)*pageSize+1}-{Math.min(page*pageSize, filtered.length)}개 표시</span>
        <select className="inp" style={{ width: 70 }} value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
          {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12 }}>
        {(() => {
          const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
          const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
          return <>
            <PgBtn label="«" onClick={() => setPage(1)}             disabled={page === 1} />
            <PgBtn label="‹" onClick={() => setPage(p => p - 1)}    disabled={page === 1} />
            {pages.map(p => <PgBtn key={p} label={p} onClick={() => setPage(p)} active={p === page} />)}
            <PgBtn label="›" onClick={() => setPage(p => p + 1)}    disabled={page === totalPages} />
            <PgBtn label="»" onClick={() => setPage(totalPages)}    disabled={page === totalPages} />
          </>;
        })()}
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--t2)', marginTop: 8 }}>
        현재 {page}페이지 / 총 {Math.max(1, Math.ceil(filtered.length / pageSize))}페이지
      </div>
    </div>
  );
}
