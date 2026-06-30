'use client'
import { useState, useRef, useEffect } from 'react'
import { DUMMY } from '../../data/dummy'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/Pagination'
import { StatusBadge } from '../../components/common/Badge'

const PAGE_SIZE = 20

/* ── 그룹 목록 열 ─────────────────────────────────────────── */
const GROUP_COLS = [
  {
    key: 'no', label: 'No.', width: 48, align: 'center',
    render: (_, r, i) => <span style={{ color: 'var(--t3)', fontSize: 12 }}>{i + 1}</span>,
  },
  { key: 'name', label: '그룹명' },
  {
    key: 'studentCount', label: '학생', width: 64, align: 'center',
    render: v => <span style={{ fontWeight: 600 }}>{v ?? 0}</span>,
  },
  {
    key: 'deviceCount', label: '단말기', width: 72, align: 'center',
    render: v => <span style={{ fontWeight: 600 }}>{v ?? 0}</span>,
  },
]

/* ── 메인 페이지 ─────────────────────────────────────────── */
export default function Page() {
  const [search, setSearch]           = useState('')
  const [query, setQuery]             = useState('')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [page, setPage]               = useState(1)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [activeTab, setActiveTab]     = useState('students')
  const [studentPage, setStudentPage]             = useState(1)
  const [studentStatusFilter, setStudentStatusFilter] = useState('all')
  const [devicePage, setDevicePage]               = useState(1)
  const [deviceStatusFilter, setDeviceStatusFilter] = useState('all')
  const [showStudentAddMenu, setShowStudentAddMenu]   = useState(false)
  const [showStudentAddModal, setShowStudentAddModal] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', num: 1, status: 'active' })
  const [localStudents, setLocalStudents] = useState([])
  const addStudentMenuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (addStudentMenuRef.current && !addStudentMenuRef.current.contains(e.target)) setShowStudentAddMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const STUDENT_PAGE_SIZE = 20
  const DEVICE_PAGE_SIZE  = 20

  const allGroups = DUMMY.groups ?? []
  const filtered  = allGroups.filter(g => {
    const matchQuery = !query || g.name.toLowerCase().includes(query.toLowerCase())
    const matchGrade = gradeFilter === 'all' || g.name.includes(gradeFilter)
    return matchQuery && matchGrade
  })
  const rows = filtered
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map(g => ({ ...g, id: g.groupId }))

  const students = selectedGroup
    ? [
        ...DUMMY.students.filter(s => s.groupId === selectedGroup.groupId),
        ...localStudents.filter(s => s.groupId === selectedGroup.groupId),
      ]
    : []
  const devices = selectedGroup
    ? DUMMY.devices.filter(d => d.groupId === selectedGroup.groupId)
    : []

  function doSearch() { setQuery(search); setPage(1) }

  function handleStudentSubmit(e) {
    e.preventDefault()
    if (!newStudent.name.trim() || !selectedGroup) return
    const m = selectedGroup.name.match(/(\d+)학년\s+(\d+)반/)
    const grade    = m ? `${m[1]}학년` : '1학년'
    const classNum = m ? `${m[2]}반`   : '1반'
    setLocalStudents(prev => [...prev, {
      studentId: `local_${Date.now()}`,
      name: newStudent.name.trim(),
      schoolId: selectedGroup.schoolId,
      groupId: selectedGroup.groupId,
      grade, classNum,
      num: newStudent.num,
      status: newStudent.status,
    }])
    setShowStudentAddModal(false)
    setNewStudent({ name: '', num: 1, status: 'active' })
  }

  function handleRowClick(group) {
    if (selectedGroup?.groupId === group.groupId) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup(group)
      setActiveTab('students')
      setStudentPage(1)
      setStudentStatusFilter('all')
      setDevicePage(1)
      setDeviceStatusFilter('all')
    }
  }

  const hasSelection = !!selectedGroup

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 학생 추가 모달 */}
      {showStudentAddModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => e.target === e.currentTarget && setShowStudentAddModal(false)}
        >
          <div style={{ background: '#fff', borderRadius: 4, width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>신규 학생 추가</div>
              <button onClick={() => setShowStudentAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>✕</button>
            </div>
            <form onSubmit={handleStudentSubmit}>
              <div style={{ padding: '20px 24px' }}>
                {/* 이름 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>이름 <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    className="inp" autoFocus
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder="학생 이름을 입력하세요"
                    value={newStudent.name}
                    onChange={e => setNewStudent(s => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>
                {/* 학년 / 반 / 번호 */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>학년</label>
                    <input className="inp" style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg2)', color: 'var(--t3)' }}
                      value={(() => { const m = selectedGroup?.name.match(/(\d+)학년/); return m ? `${m[1]}학년` : '' })()} disabled />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>반</label>
                    <input className="inp" style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg2)', color: 'var(--t3)' }}
                      value={(() => { const m = selectedGroup?.name.match(/(\d+)반/); return m ? `${m[1]}반` : '' })()} disabled />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>번호</label>
                    <input type="number" className="inp" style={{ width: '100%', boxSizing: 'border-box' }} min={1}
                      value={newStudent.num}
                      onChange={e => setNewStudent(s => ({ ...s, num: Number(e.target.value) }))} />
                  </div>
                </div>
                {/* 상태 */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>상태</label>
                  <select className="inp" style={{ width: '100%', boxSizing: 'border-box', background: '#fff', cursor: 'pointer' }}
                    value={newStudent.status}
                    onChange={e => setNewStudent(s => ({ ...s, status: e.target.value }))}>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
              </div>
              <div style={{ padding: '0 24px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-s" style={{ minWidth: 68 }} onClick={() => setShowStudentAddModal(false)}>취소</button>
                <button type="submit" style={{ minWidth: 68, padding: '7px 16px', fontSize: 13, fontWeight: 600, borderRadius: 4, border: 'none', background: '#111827', color: '#fff', cursor: 'pointer' }}>등록</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            그룹 관리
            <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 8 }}>
              {filtered.length}
            </span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', fontSize: 13, fontWeight: 500 }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/>
            </svg>
            내보내기
          </button>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            그룹 추가
          </button>
        </div>
      </div>

      {/* 필터 바 + 탭 (같은 줄) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>

        {/* 왼쪽: 필터 */}
        <div style={{ flex: hasSelection ? '0 0 420px' : '1', display: 'flex', alignItems: 'center', gap: 8, transition: 'flex 0.2s ease', minWidth: 0 }}>
          <select
            className="inp"
            style={{ width: 110, paddingTop: 7, paddingBottom: 7, background: '#fff', cursor: 'pointer' }}
            value={gradeFilter}
            onChange={e => { setGradeFilter(e.target.value); setPage(1); setSelectedGroup(null) }}
          >
            <option value="all">전체 학년</option>
            {['1학년','2학년','3학년','4학년','5학년','6학년'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <div style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="inp"
              style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
              placeholder="그룹명 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setQuery(''); setPage(1) }}
                style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11 }}
              >×</button>
            )}
            <button
              onClick={doSearch}
              style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 오른쪽: 탭 (그룹 선택 시) */}
        {hasSelection && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <div className={`tab${activeTab === 'students' ? ' a' : ''}`} onClick={() => { setActiveTab('students'); setStudentPage(1) }}>
                학생 관리 ({students.length})
              </div>
              <div className={`tab${activeTab === 'devices' ? ' a' : ''}`} onClick={() => setActiveTab('devices')}>
                단말기 관리 ({devices.length})
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 콘텐츠: 그룹 테이블 + 선택 시 디테일 */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* 왼쪽: 그룹 테이블 */}
        <div style={{ flex: hasSelection ? '0 0 420px' : '1', minWidth: 0, transition: 'flex 0.2s ease' }}>
          <Table
            cols={GROUP_COLS}
            rows={rows}
            selectedId={selectedGroup?.groupId}
            onRowClick={handleRowClick}
            emptyContext={{ query, onReset: () => { setSearch(''); setQuery(''); setPage(1) } }}
          />
          <div style={{ marginTop: 16 }}>
            <Pagination
              page={page}
              total={filtered.length}
              pageSize={PAGE_SIZE}
              onChange={p => { setPage(p); setSelectedGroup(null) }}
            />
          </div>
        </div>

        {/* 오른쪽: 디테일 패널 (선택 시만 표시) */}
        {hasSelection && (
          <div style={{ flex: 1, minWidth: 0, border: '1px solid var(--bd)', borderRadius: 4, overflow: 'hidden' }}>

            {/* 테이블 */}
            {activeTab === 'students' ? (() => {
              const filteredStudents = studentStatusFilter === 'all'
                ? students
                : students.filter(s => s.status === studentStatusFilter)
              const pagedStudents = filteredStudents.slice((studentPage - 1) * STUDENT_PAGE_SIZE, studentPage * STUDENT_PAGE_SIZE)
              return (
                <>
                  {/* 상태 필터 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 16px', borderBottom: '1px solid var(--bd)', background: 'var(--bg1)' }}>
                    {[['all','전체'], ['active','활성'], ['inactive','비활성']].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => { setStudentStatusFilter(val); setStudentPage(1) }}
                        style={{
                          padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 4, cursor: 'pointer', border: 'none',
                          background: studentStatusFilter === val ? '#111827' : 'var(--bg3)',
                          color: studentStatusFilter === val ? '#fff' : 'var(--t2)',
                        }}
                      >{label}</button>
                    ))}
                    <div ref={addStudentMenuRef} style={{ marginLeft: 'auto', position: 'relative' }}>
                      <button
                        onClick={() => setShowStudentAddMenu(m => !m)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', fontSize: 12, fontWeight: 500, borderRadius: 4, cursor: 'pointer', border: 'none', background: '#111827', color: '#fff' }}
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                        학생 추가
                      </button>
                      {showStudentAddMenu && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.12)', minWidth: 160, zIndex: 200, overflow: 'hidden' }}>
                          <div
                            style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            onClick={() => { setShowStudentAddMenu(false); setNewStudent({ name: '', num: students.length + 1, status: 'active' }); setShowStudentAddModal(true) }}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                            신규 학생 추가
                          </div>
                          <div style={{ height: 1, background: 'var(--bd)' }} />
                          <div
                            style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            onClick={() => setShowStudentAddMenu(false)}
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                            엑셀 일괄 등록
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="dt-wrap">
                    <table className="dt">
                      <thead>
                        <tr>
                          <th style={{ width: 40, color: 'var(--t3)' }}>No.</th>
                          <th>이름</th>
                          <th>학년</th>
                          <th>반</th>
                          <th>번호</th>
                          <th>상태</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--t3)', padding: '48px 14px', fontSize: 13 }}>등록된 학생이 없습니다</td></tr>
                        ) : pagedStudents.map((s, i) => (
                          <tr key={s.studentId}>
                            <td style={{ color: 'var(--t3)', fontSize: 12 }}>{(studentPage - 1) * STUDENT_PAGE_SIZE + i + 1}</td>
                            <td><span style={{ fontWeight: 600 }}>{s.name}</span></td>
                            <td>{s.grade?.endsWith('학년') ? s.grade : `${s.grade}학년`}</td>
                            <td>{s.classNum?.endsWith('반') ? s.classNum : `${s.classNum}반`}</td>
                            <td>{s.num}번</td>
                            <td><StatusBadge status={s.status === 'active' ? 'active' : 'inactive'} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding: '12px 16px', borderTop: '1px solid var(--bd)' }}>
                    <Pagination
                      page={studentPage}
                      total={filteredStudents.length}
                      pageSize={STUDENT_PAGE_SIZE}
                      onChange={setStudentPage}
                    />
                  </div>
                </>
              )
            })() : (() => {
              const registered = devices.filter(d => d.status === 'online')
              const unknown    = devices.filter(d => d.status === 'offline')
              const filteredDevices = deviceStatusFilter === 'registered' ? registered
                : deviceStatusFilter === 'unknown' ? unknown
                : devices
              const pagedDevices = filteredDevices.slice((devicePage - 1) * DEVICE_PAGE_SIZE, devicePage * DEVICE_PAGE_SIZE)
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderBottom: '1px solid var(--bd)', background: 'var(--bg1)' }}>
                    {[['all', `전체 ${devices.length}`], ['registered', `등록완료 ${registered.length}`], ['unknown', `알수없음 ${unknown.length}`]].map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => { setDeviceStatusFilter(val); setDevicePage(1) }}
                        style={{
                          padding: '4px 10px', fontSize: 12, fontWeight: deviceStatusFilter === val ? 600 : 500,
                          borderRadius: 4, cursor: 'pointer',
                          border: deviceStatusFilter === val ? '1px solid #111827' : '1px solid var(--bd)',
                          background: deviceStatusFilter === val ? '#111827' : 'transparent',
                          color: deviceStatusFilter === val ? '#fff' : 'var(--t2)',
                        }}
                      >{label}</button>
                    ))}
                  </div>
                  <div className="dt-wrap">
                    <table className="dt">
                      <thead>
                        <tr>
                          <th style={{ width: 40, color: 'var(--t3)' }}>No.</th>
                          <th>단말기 ID</th>
                          <th>UUID</th>
                          <th style={{ width: 100 }}>OS</th>
                          <th style={{ width: 90 }}>상태</th>
                          <th>학생정보</th>
                          <th>최근 접속</th>
                          <th style={{ width: 68 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDevices.length === 0 ? (
                          <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--t3)', padding: '48px 14px', fontSize: 13 }}>등록된 단말기가 없습니다</td></tr>
                        ) : pagedDevices.map((d, i) => {
                          const absIdx = (devicePage - 1) * DEVICE_PAGE_SIZE + i
                          const rowNo = filteredDevices.length - absIdx
                          const origIdx = devices.indexOf(d)
                          const student = students[origIdx]
                          const isUnknown = d.status === 'offline'
                          return (
                            <tr key={d.deviceId} style={{ opacity: isUnknown ? 0.55 : 1 }}>
                              <td style={{ color: 'var(--t3)', fontSize: 12 }}>{rowNo}</td>
                              <td><span style={{ fontWeight: 600 }}>{d.name}</span></td>
                              <td style={{ fontSize: 12, color: '#6366f1', fontFamily: 'monospace' }}>{d.identifier}</td>
                              <td style={{ fontSize: 12 }}>{d.os}</td>
                              <td>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isUnknown ? '#9ca3af' : '#22c55e', flexShrink: 0 }} />
                                  {isUnknown ? '알수없음' : '등록완료'}
                                </span>
                              </td>
                              <td style={{ fontSize: 12, color: 'var(--t2)' }}>{student ? `${student.num}번 ${student.name}` : '—'}</td>
                              <td style={{ fontSize: 12, color: 'var(--t3)' }}>{d.lastContact}</td>
                              <td>
                                <button style={{
                                  padding: '4px 8px', fontSize: 11, fontWeight: 500, borderRadius: 4,
                                  border: 'none', cursor: isUnknown ? 'default' : 'pointer',
                                  background: isUnknown ? 'var(--bg3)' : '#fef2f2',
                                  color: isUnknown ? 'var(--t3)' : '#ef4444',
                                }}>등록해제</button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--bd)' }}>
                    <span style={{ fontSize: 12, color: 'var(--t3)' }}>≡ {pagedDevices.length}개 표시 · 전체 {filteredDevices.length}개</span>
                    <Pagination page={devicePage} total={filteredDevices.length} pageSize={DEVICE_PAGE_SIZE} onChange={setDevicePage} />
                  </div>
                </>
              )
            })()}
          </div>
        )}

      </div>
    </div>
  )
}
