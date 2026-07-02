'use client'
import React, { useState, useEffect } from 'react'
import { DUMMY } from '../../data/dummy'
import Pagination from '../../components/common/Pagination'
import { useSchool } from '../../context/SchoolContext'

const DEVICE_PAGE_SIZE = 20
const ALL_SENTINEL     = '__all__'
const GRADE_PREFIX     = 'grade_'

function ChevronBtn({ open, onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)',
        borderRadius: 3, flexShrink: 0, transition: 'transform 0.15s',
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  )
}


export default function Page() {
  const [search, setSearch]               = useState('')
  const [query, setQuery]                 = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState(ALL_SENTINEL)
  const [devicePage, setDevicePage]           = useState(1)
  const [deviceStatusFilter, setDeviceStatusFilter] = useState('all')
  const [deviceUserSearch, setDeviceUserSearch] = useState('')
  const [deviceUserQuery, setDeviceUserQuery]   = useState('')

  /* 트리 펼침 상태 */
  const [allOpen, setAllOpen]       = useState(true)
  const [openGrades, setOpenGrades] = useState(new Set(['1학년','2학년','3학년','4학년','5학년','6학년']))

  const { selectedSchoolId } = useSchool()

  useEffect(() => {
    setSelectedGroupId(ALL_SENTINEL)
    setDevicePage(1)
    setDeviceStatusFilter('all')
    setDeviceUserSearch('')
    setDeviceUserQuery('')
    setAllOpen(true)
    setOpenGrades(new Set(['1학년','2학년','3학년','4학년','5학년','6학년']))
  }, [selectedSchoolId])

  const allGroups = (DUMMY.groups ?? []).filter(g =>
    !selectedSchoolId || g.schoolId === selectedSchoolId
  )
  const filtered  = allGroups.filter(g => {
    return !query || g.name.toLowerCase().includes(query.toLowerCase())
  })

  /* 학년별 그루핑 */
  const gradeMap = {}
  filtered.forEach(g => {
    const m = g.name.match(/^(\d+학년)/)
    const grade = m ? m[1] : '기타'
    if (!gradeMap[grade]) gradeMap[grade] = []
    gradeMap[grade].push(g)
  })
  const grades = Object.keys(gradeMap).sort((a, b) => {
    const na = parseInt(a) || 99, nb = parseInt(b) || 99
    return na - nb
  })

  /* 학년별 단말기 수 */
  const gradeDevCount = grade =>
    (gradeMap[grade] ?? []).reduce((s, g) => s + (g.deviceCount || 0), 0)

  /* 단말기 목록 */
  const schoolGroupIds = new Set(allGroups.map(g => g.groupId))
  const devices = (() => {
    if (selectedGroupId === ALL_SENTINEL)
      return DUMMY.devices.filter(d => schoolGroupIds.has(d.groupId))
    if (selectedGroupId.startsWith(GRADE_PREFIX)) {
      const grade = selectedGroupId.slice(GRADE_PREFIX.length)
      const ids   = new Set((gradeMap[grade] ?? []).map(g => g.groupId))
      return DUMMY.devices.filter(d => ids.has(d.groupId))
    }
    return DUMMY.devices.filter(d => d.groupId === selectedGroupId)
  })()

  const registered = devices.filter(d => d.status === 'online')
  const unknown    = devices.filter(d => d.status === 'offline')
  const filteredDevices = (() => {
    let list = deviceStatusFilter === 'registered' ? registered
      : deviceStatusFilter === 'unknown' ? unknown
      : devices
    if (deviceUserQuery) {
      const q = deviceUserQuery.toLowerCase()
      list = list.filter(d => d.members?.some(m => m.nickname.toLowerCase().includes(q)))
    }
    return list
  })()
  const pagedDevices = filteredDevices.slice((devicePage - 1) * DEVICE_PAGE_SIZE, devicePage * DEVICE_PAGE_SIZE)

  /* 헤더 레이블 */
  const panelLabel = (() => {
    if (selectedGroupId === ALL_SENTINEL) return '전체 단말기'
    if (selectedGroupId.startsWith(GRADE_PREFIX)) return selectedGroupId.slice(GRADE_PREFIX.length)
    return allGroups.find(g => g.groupId === selectedGroupId)?.name ?? ''
  })()

  function doSearch(val) { setQuery(val) }

  function selectGroup(id) {
    setSelectedGroupId(id)
    setDevicePage(1)
    setDeviceStatusFilter('all')
    setDeviceUserSearch('')
    setDeviceUserQuery('')
  }

  function toggleGrade(grade) {
    setOpenGrades(prev => {
      const next = new Set(prev)
      next.has(grade) ? next.delete(grade) : next.add(grade)
      return next
    })
  }

  const isAll = selectedGroupId === ALL_SENTINEL

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            그룹 관리
            <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 8 }}>{filtered.length}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/></svg>
            내보내기
          </button>
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            그룹 추가
          </button>
        </div>
      </div>

      {/* 검색 바 */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <select
          value={selectedSchoolId ?? ''}
          onChange={e => setSelectedSchoolId(e.target.value)}
          style={{
            height: 34, padding: '0 10px', fontSize: 13, borderRadius: 4,
            border: '1px solid var(--bd)', background: 'var(--bg1)', color: 'var(--t1)',
            cursor: 'pointer', outline: 'none',
          }}
        >
          {DUMMY.schools.map(s => (
            <option key={s.schoolId} value={s.schoolId}>{s.name}</option>
          ))}
        </select>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <input
            className="inp"
            style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
            placeholder="그룹명 검색"
            value={search}
            onChange={e => { setSearch(e.target.value); doSearch(e.target.value) }}
            onKeyDown={e => e.key === 'Escape' && (setSearch(''), doSearch(''))}
          />
          {search && (
            <button onClick={() => { setSearch(''); doSearch('') }}
              style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11 }}>×</button>
          )}
          <button onClick={() => doSearch(search)}
            style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </div>

      {/* 콘텐츠 레이아웃 */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', height: 'calc(100vh - 240px)', minHeight: 400 }}>

        {/* 그룹 트리 */}
        <div style={{ flex: '0 0 280px', minWidth: 0, border: '1px solid var(--bd)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="dt-wrap" style={{ flex: 1, overflowY: 'auto' }}>
            <table className="dt" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '100%' }} />
                <col style={{ width: 60 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>그룹</th>
                  <th style={{ textAlign: 'center' }}>단말기</th>
                </tr>
              </thead>
              <tbody>

                {/* 전체 행 */}
                <tr
                  onClick={() => selectGroup(ALL_SENTINEL)}
                  style={{
                    cursor: 'pointer',
                    background: selectedGroupId === ALL_SENTINEL ? 'var(--bg3)' : undefined,
                  }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ChevronBtn open={allOpen} onClick={() => setAllOpen(v => !v)} />
                      <span style={{ fontWeight: selectedGroupId === ALL_SENTINEL ? 700 : 600, fontSize: 13 }}>전체</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600, fontSize: 13 }}>{DUMMY.devices.length}</td>
                </tr>

                {/* 학년 행 + 반 행 */}
                {allOpen && grades.map(grade => (
                  <React.Fragment key={grade}>
                    <tr
                      onClick={() => selectGroup(`${GRADE_PREFIX}${grade}`)}
                      style={{
                        cursor: 'pointer',
                        background: selectedGroupId === `${GRADE_PREFIX}${grade}`
                          ? 'var(--bg3)'
                          : undefined,
                      }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 24 }}>
                          <ChevronBtn open={openGrades.has(grade)} onClick={() => toggleGrade(grade)} />
                          <span style={{
                            fontWeight: selectedGroupId === `${GRADE_PREFIX}${grade}` ? 700 : 500,
                            fontSize: 13, color: 'var(--t2)',
                          }}>{grade}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontSize: 13, color: 'var(--t2)' }}>{gradeDevCount(grade)}</td>
                    </tr>

                    {openGrades.has(grade) && gradeMap[grade].map(g => (
                      <tr
                        key={g.groupId}
                        onClick={() => selectGroup(g.groupId)}
                        style={{
                          cursor: 'pointer',
                          background: selectedGroupId === g.groupId ? 'var(--bg3)' : undefined,
                        }}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 48 }}>
                            <span style={{
                              fontWeight: selectedGroupId === g.groupId ? 600 : 400,
                              fontSize: 13,
                              color: selectedGroupId === g.groupId ? 'var(--t1)' : 'var(--t2)',
                            }}>{g.name}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontSize: 13, color: 'var(--t3)' }}>{g.deviceCount ?? 0}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* 단말기 목록 */}
        <div style={{ flex: '1', minWidth: 0, border: '1px solid var(--bd)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          <div style={{ borderBottom: '1px solid var(--bd)', background: 'var(--bg1)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px 8px' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginRight: 4 }}>
                {panelLabel} 관리
              </span>
              {[
                ['all',        `전체 ${devices.length}`],
                ['registered', `등록완료 ${registered.length}`],
                ['unknown',    `알수없음 ${unknown.length}`],
              ].map(([val, label]) => (
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
            <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <svg style={{ position: 'absolute', left: 8, pointerEvents: 'none', color: 'var(--t3)' }} width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  className="inp"
                  style={{ width: 180, paddingLeft: 28, paddingTop: 6, paddingBottom: 6, paddingRight: deviceUserSearch ? 28 : 10, fontSize: 12 }}
                  placeholder="사용자 이름 검색"
                  value={deviceUserSearch}
                  onChange={e => {
                    setDeviceUserSearch(e.target.value)
                    setDeviceUserQuery(e.target.value)
                    setDevicePage(1)
                  }}
                  onKeyDown={e => e.key === 'Escape' && (setDeviceUserSearch(''), setDeviceUserQuery(''), setDevicePage(1))}
                />
                {deviceUserSearch && (
                  <button
                    onClick={() => { setDeviceUserSearch(''); setDeviceUserQuery(''); setDevicePage(1) }}
                    style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 10 }}>×</button>
                )}
              </div>
              {deviceUserQuery && (
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>"{deviceUserQuery}" 검색 결과 {filteredDevices.length}개</span>
              )}
            </div>
          </div>

          <div className="dt-wrap" style={{ flex: 1, overflowY: 'auto' }}>
            <table className="dt">
              <thead>
                <tr>
                  <th style={{ width: 40, color: 'var(--t3)' }}>No.</th>
                  <th>단말기 ID</th>
                  <th>UUID</th>
                  <th style={{ width: 80 }}>OS</th>
                  <th style={{ width: 90 }}>상태</th>
                  <th>닉네임</th>
                  <th>최근 접속</th>
                  <th style={{ width: 68 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--t3)', padding: '48px 14px', fontSize: 13 }}>등록된 단말기가 없습니다</td></tr>
                ) : pagedDevices.map((d, i) => {
                  const absIdx    = (devicePage - 1) * DEVICE_PAGE_SIZE + i
                  const rowNo     = filteredDevices.length - absIdx
                  const isUnknown = d.status === 'offline'
                  const nicknameText = d.members?.length
                    ? d.members.length === 1 ? d.members[0].nickname : `${d.members[0].nickname} 외 ${d.members.length - 1}명`
                    : '—'
                  return (
                    <tr
                      key={d.deviceId}
                      style={{ opacity: isUnknown ? 0.55 : 1 }}
                    >
                      <td style={{ color: 'var(--t3)', fontSize: 12 }}>{rowNo}</td>
                      <td><span style={{ fontWeight: 600 }}>{d.name}</span></td>
                      <td style={{ fontSize: 11, color: '#6366f1', fontFamily: 'monospace' }}>{d.identifier}</td>
                      <td style={{ fontSize: 12 }}>{d.os}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isUnknown ? '#9ca3af' : '#22c55e', flexShrink: 0 }} />
                          {isUnknown ? '알수없음' : '등록완료'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--t2)' }}>{nicknameText}</td>
                      <td style={{ fontSize: 12, color: 'var(--t3)' }}>{d.lastContact}</td>
                      <td>
                        <button
                          onClick={e => e.stopPropagation()}
                          style={{
                            padding: '4px 8px', fontSize: 11, fontWeight: 500, borderRadius: 4,
                            border: 'none', cursor: isUnknown ? 'default' : 'pointer',
                            background: isUnknown ? 'var(--bg3)' : '#fef2f2',
                            color: isUnknown ? 'var(--t3)' : '#ef4444',
                          }}
                        >등록해제</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid var(--bd)', flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>≡ {pagedDevices.length}개 표시 · 전체 {filteredDevices.length}개</span>
            <Pagination page={devicePage} total={filteredDevices.length} pageSize={DEVICE_PAGE_SIZE} onChange={setDevicePage} />
          </div>
        </div>

      </div>
    </div>
  )
}
