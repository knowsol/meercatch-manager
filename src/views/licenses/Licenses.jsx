'use client'
import { useState } from 'react'
import KPI from '../../components/common/KPI'
import { StatusBadge } from '../../components/common/Badge'

const TODAY = new Date('2026-06-25')
TODAY.setHours(0, 0, 0, 0)

function daysLeft(endAt) {
  const d = new Date(endAt)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d - TODAY) / 86400000)
}

const LICENSES = [
  {
    id: 'L2024',
    name: '2025-부산광역시교육청-KT',
    startAt: '2024-09-01',
    endAt: '2025-08-31',
    status: 'expired',
    items: [
      { os: 'Android',   seats: 180, used: 180, services: ['선정성', '도박'] },
      { os: 'iOS',       seats: 120, used: 119, services: ['선정성'] },
      { os: 'WhaleBook', seats:  60, used:  55, services: ['선정성', '도박'] },
      { os: 'ChromeOS',  seats:  40, used:  38, services: ['선정성'] },
    ],
  },
  {
    id: 'L2025',
    name: '2026-부산광역시교육청-KT',
    startAt: '2025-09-01',
    endAt: '2026-12-31',
    status: 'active',
    items: [
      { os: 'Android',   seats: 200, used: 180, services: ['선정성', '도박'] },
      { os: 'iOS',       seats: 150, used: 148, services: ['선정성'] },
      { os: 'WhaleBook', seats:  80, used:  65, services: ['선정성', '도박'] },
      { os: 'ChromeOS',  seats:  50, used:  12, services: ['선정성'] },
      { os: 'Windows',   seats: 100, used:  88, services: ['선정성', '도박'] },
    ],
  },
  {
    id: 'L2025B',
    name: '2026-경기도교육청-SKT',
    startAt: '2026-03-01',
    endAt: '2026-11-30',
    status: 'active',
    items: [
      { os: 'Android',  seats: 300, used: 210, services: ['선정성', '도박'] },
      { os: 'iOS',      seats: 120, used:  95, services: ['선정성', '도박'] },
      { os: 'Windows',  seats:  80, used:  40, services: ['선정성'] },
    ],
  },
]

// ── KPI 집계 (활성/만료임박 기준 고정값) ────────────────────────────────────
const activeLicenses = LICENSES.filter(l => l.status !== 'expired')
const KPI_TOTAL    = activeLicenses.flatMap(l => l.items).reduce((s, i) => s + i.seats, 0)
const KPI_USED     = activeLicenses.flatMap(l => l.items).reduce((s, i) => s + i.used, 0)
const KPI_REMAIN   = KPI_TOTAL - KPI_USED
const KPI_EXPIRING = LICENSES.filter(l => l.status === 'expiring').length

// ── 서브 컴포넌트 ─────────────────────────────────────────────────────────

function ServiceChip({ label }) {
  const isAdult = label === '선정성'
  return (
    <span style={{
      display: 'inline-block', padding: '1px 6px', borderRadius: 3,
      fontSize: 10, fontWeight: 600,
      background: isAdult ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
      color:      isAdult ? '#ef4444'              : '#6366f1',
    }}>
      {label}
    </span>
  )
}

function UsageBar({ used, seats, compact }) {
  const pct   = seats > 0 ? Math.round((used / seats) * 100) : 0
  const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f97316' : '#22c55e'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: compact ? 4 : 5, borderRadius: 2, background: 'var(--bg3)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap', minWidth: 52, textAlign: 'right' }}>
        {used}/{seats}
      </span>
    </div>
  )
}

function LicenseStatusBadge({ status }) {
  if (status === 'active')   return <StatusBadge status="active" />
  if (status === 'expiring') return <span style={{ fontSize: 11, fontWeight: 600, color: '#f97316' }}>만료 임박</span>
  return <StatusBadge status="inactive" />
}

// ── 우측 고정 패널 ────────────────────────────────────────────────────────
function KpiPanel() {
  return (
    <div style={{ width: 288, flexShrink: 0, position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* KPI 2×2 */}
      <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t3)', marginBottom: 14 }}>현재 현황</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, '--radius': '4px' }}>
          <KPI label="총 이용권"   value={KPI_TOTAL}    sub="발급 수량" />
          <KPI label="잔여 이용권" value={KPI_REMAIN}   sub="사용 가능" color="ok" />
          <KPI label="사용 이용권" value={KPI_USED}     sub={`${Math.round(KPI_USED / KPI_TOTAL * 100)}%`} />
          <KPI label="만료 임박"   value={KPI_EXPIRING} sub="갱신 필요" color={KPI_EXPIRING > 0 ? 'warn' : null} />
        </div>
      </div>

      {/* 활성 라이선스 상세 */}
      {activeLicenses.map(lic => {
        const days = daysLeft(lic.endAt)
        return (
          <div key={lic.id} style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {/* 라이선스 헤더 */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bd)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>{lic.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>{lic.startAt} ~ {lic.endAt}</span>
                <LicenseStatusBadge status={lic.status} />
              </div>
              {lic.status === 'expiring' && (
                <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: '#f97316' }}>D-{days} 만료 임박</div>
              )}
            </div>

            {/* OS 항목 */}
            <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {lic.items.map(item => (
                <div key={item.os}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', minWidth: 76 }}>{item.os}</span>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {item.services.map(s => <ServiceChip key={s} label={s} />)}
                    </div>
                  </div>
                  <UsageBar used={item.used} seats={item.seats} compact />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── 이력 아코디언 ─────────────────────────────────────────────────────────
function LicenseRow({ license }) {
  const [open, setOpen] = useState(false)
  const totalSeats  = license.items.reduce((s, i) => s + i.seats, 0)
  const totalUsed   = license.items.reduce((s, i) => s + i.used, 0)
  const totalRemain = totalSeats - totalUsed

  return (
    <div style={{ borderBottom: '1px solid var(--bd)' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ marginRight: 12, color: 'var(--t3)', fontSize: 10, flexShrink: 0, display: 'inline-block', transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        <span style={{ flex: '0 0 240px', fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{license.name}</span>
        <span style={{ flex: '0 0 72px',  fontSize: 12, color: 'var(--t3)' }}>OS {license.items.length}종</span>
        <span style={{ flex: '0 0 110px', fontSize: 12, color: 'var(--t2)' }}>
          총 <strong style={{ color: 'var(--t1)' }}>{totalSeats}</strong>이용권
        </span>
        <span style={{ flex: '0 0 130px', fontSize: 12, color: 'var(--t3)' }}>사용 {totalUsed} / 잔여 {totalRemain}</span>
        <span style={{ flex: '0 0 110px', fontSize: 12, color: 'var(--t3)' }}>{license.startAt}</span>
        <span style={{ flex: '0 0 110px', fontSize: 12, color: license.status === 'expired' ? '#ef4444' : license.status === 'expiring' ? '#f97316' : 'var(--t3)' }}>{license.endAt}</span>
        <span style={{ flex: '0 0 80px', textAlign: 'right' }}>
          <LicenseStatusBadge status={license.status} />
        </span>
      </div>

      {open && (
        <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bd)' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 20px 8px 48px', borderBottom: '1px solid var(--bd)' }}>
            <span style={{ flex: '0 0 120px', fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OS</span>
            <span style={{ flex: '0 0 140px', fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>서비스</span>
            <span style={{ flex: 1,           fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>이용 현황</span>
            <span style={{ flex: '0 0 72px',  fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>잔여</span>
          </div>
          {license.items.map(item => {
            const remaining = item.seats - item.used
            const low = remaining < item.seats * 0.15
            return (
              <div key={item.os} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 10px 48px', borderBottom: '1px solid var(--bd)' }}>
                <span style={{ flex: '0 0 120px', fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{item.os}</span>
                <div style={{ flex: '0 0 140px', display: 'flex', gap: 4 }}>
                  {item.services.map(s => (
                    <span key={s} style={{
                      display: 'inline-block', padding: '1px 7px', borderRadius: 3, fontSize: 11, fontWeight: 600,
                      background: s === '선정성' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                      color:      s === '선정성' ? '#ef4444'              : '#6366f1',
                    }}>{s}</span>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <UsageBar used={item.used} seats={item.seats} />
                </div>
                <span style={{ flex: '0 0 72px', fontSize: 12, fontWeight: low ? 700 : 400, color: low ? '#ef4444' : 'var(--t2)', textAlign: 'right' }}>
                  {remaining}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── 탭 ───────────────────────────────────────────────────────────────────
const TABS = [
  { value: '전체',    filter: () => true },
  { value: '활성',    filter: l => l.status === 'active' },
  { value: '만료 임박', filter: l => l.status === 'expiring' },
  { value: '만료',    filter: l => l.status === 'expired' },
]

// ── 메인 ─────────────────────────────────────────────────────────────────
export default function Licenses() {
  const [tab, setTab] = useState('전체')

  const tabFilter   = TABS.find(t => t.value === tab)?.filter ?? (() => true)
  const visibleList = [...LICENSES].filter(tabFilter).sort((a, b) => new Date(b.startAt) - new Date(a.startAt))
  const tabCounts   = TABS.map(t => ({ ...t, count: LICENSES.filter(t.filter).length }))

  return (
    <div style={{ padding: '28px 0' }}>

      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>설정</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>라이선스</h2>
        </div>
        <button
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
          onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
          onMouseLeave={e => e.currentTarget.style.background = '#111827'}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          발급
        </button>
      </div>

      {/* 바디: 좌(테이블) + 우(KPI 패널) */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* 좌: 이력 테이블 */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>라이선스 이력</span>
            <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
              {tabCounts.map((t, i) => {
                const active = tab === t.value
                return (
                  <button key={t.value} onClick={() => setTab(t.value)}
                    style={{ padding: '6px 14px', fontSize: 12, border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`, marginLeft: i === 0 ? 0 : -1, background: active ? 'var(--t1)' : 'var(--bg2)', color: active ? '#fff' : 'var(--t2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: active ? 600 : 400, position: 'relative', zIndex: active ? 1 : 0 }}>
                    {t.value} <span style={{ fontSize: 11, opacity: 0.75 }}>{t.count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 테이블 컬럼 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '9px 20px 9px 44px', borderBottom: '2px solid var(--t1)' }}>
            <span style={{ flex: '0 0 240px', fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>라이선스명</span>
            <span style={{ flex: '0 0 72px',  fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OS</span>
            <span style={{ flex: '0 0 110px', fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>이용권</span>
            <span style={{ flex: '0 0 130px', fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>사용 / 잔여</span>
            <span style={{ flex: '0 0 110px', fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>시작일</span>
            <span style={{ flex: '0 0 110px', fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>만료일</span>
            <span style={{ flex: '0 0 80px',  fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>상태</span>
          </div>

          {visibleList.length === 0
            ? <div style={{ padding: '60px', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>해당하는 라이선스가 없습니다</div>
            : visibleList.map(l => <LicenseRow key={l.id} license={l} />)
          }
        </div>

        {/* 우: 고정 KPI 패널 */}
        <KpiPanel />
      </div>
    </div>
  )
}
