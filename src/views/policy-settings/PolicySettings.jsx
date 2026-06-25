'use client'
import { useState } from 'react'

/* ── 상수 ── */
const PAGE_TABS = ['운영모드', '학생정보 표시', '학생 단말 알림']

const MODES = [
  {
    id: 'direct',
    label: '직접관리 모드',
    desc: '학생(또는 보호자)이 직접 앱을 관리하는 방식입니다.',
    features: [
      '학생이 앱에서 직접 설정 변경',
      '탐지 이력 확인 가능',
      '학교 관리자 기능 사용 안 함',
      '학생정보 관리 없음',
    ],
    privacyEnabled: false,
  },
  {
    id: 'school',
    label: '학교관리 모드',
    desc: '학교 관리자가 학생을 직접 관리하는 방식입니다.',
    features: [
      '학교에서 학생 등록',
      '학생별 정책 관리',
      '탐지 현황 관리',
      '학생정보 표시 정책(실명/비식별) 설정 가능',
    ],
    privacyEnabled: true,
  },
  {
    id: 'mdm',
    label: 'MDM 연동 모드',
    desc: 'MDM을 통해 학생정보와 정책을 자동 연동하는 방식입니다.',
    features: [
      '학생정보 자동 수신',
      '기기 자동 등록',
      '정책 자동 적용',
      '학생정보 표시 정책(실명/비식별) 설정 가능',
    ],
    privacyEnabled: true,
  },
]

const NOTIF_LEVELS = ['안내', '주의', '경고']

/* ── 저장 버튼 공통 ── */
function SaveBar({ onSave }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 24, marginTop: 24, borderTop: '1px solid var(--bd)' }}>
      <button
        onClick={onSave}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
        onMouseLeave={e => e.currentTarget.style.background = '#111827'}
      >
        저장
      </button>
    </div>
  )
}

/* ── 섹션 타이틀 ── */
function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

/* ── 토글 스위치 ── */
function Toggle({ checked, onChange, disabled }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? 'var(--t1)' : 'var(--bg3)', transition: 'background 0.2s',
        opacity: disabled ? 0.4 : 1, flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s',
      }} />
    </div>
  )
}

/* ── 라디오 카드 ── */
function RadioCard({ selected, onClick, label, desc, features, disabled }) {
  return (
    <div
      onClick={() => !disabled && onClick()}
      style={{
        border: `2px solid ${selected ? 'var(--t1)' : 'var(--bd)'}`,
        borderRadius: 4, padding: '18px 20px', cursor: disabled ? 'not-allowed' : 'pointer',
        background: selected ? 'rgba(var(--t1-rgb, 17,24,39), 0.03)' : 'var(--bg1)',
        transition: 'border-color 0.15s, background 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${selected ? 'var(--t1)' : 'var(--bd)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t1)' }} />}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{label}</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--t2)', margin: '0 0 12px 28px', lineHeight: 1.6 }}>{desc}</p>
      <ul style={{ margin: '0 0 0 28px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--t3)' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1, color: selected ? 'var(--t1)' : 'var(--bd)' }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 탭 1: 운영모드 ── */
function OperationModeTab({ mode, onModeChange }) {
  return (
    <div>
      <SectionTitle sub="교육청에서 학교 전체의 운영 방식을 설정합니다. 각 정책은 교육청 단위로 일괄 적용되며, 학교에서는 변경할 수 없습니다.">
        운영 모드
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MODES.map(m => (
          <RadioCard
            key={m.id}
            selected={mode === m.id}
            onClick={() => onModeChange(m.id)}
            label={m.label}
            desc={m.desc}
            features={m.features}
            disabled={m.id === 'mdm'}
          />
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 4, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
        <div style={{ fontSize: 12, color: '#ea580c', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          운영 모드 변경 시 전체 학교에 즉시 반영됩니다. 신중하게 설정해 주세요.
        </div>
      </div>
      <SaveBar onSave={() => {}} />
    </div>
  )
}

/* ── 탭 2: 개인정보 ── */
function PrivacyTab({ mode, privacyMode, onPrivacyModeChange }) {
  const enabled = MODES.find(m => m.id === mode)?.privacyEnabled ?? false

  return (
    <div>
      {!enabled && (
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 4, background: 'var(--bg2)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--t3)', flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span style={{ fontSize: 13, color: 'var(--t3)' }}>직접관리 모드에서는 개인정보 설정을 사용할 수 없습니다. 학교관리 또는 MDM 연동 모드로 변경해 주세요.</span>
        </div>
      )}

      <SectionTitle sub={enabled ? '관리자 화면에서 학생 정보를 어떻게 표시할지 설정합니다.' : undefined}>
        학생정보 표시
      </SectionTitle>

      <div style={{ display: 'flex', gap: 12, opacity: enabled ? 1 : 0.4, pointerEvents: enabled ? 'auto' : 'none' }}>
        {/* 실명 */}
        <div
          onClick={() => enabled && onPrivacyModeChange('real')}
          style={{
            flex: 1, border: `2px solid ${privacyMode === 'real' ? 'var(--t1)' : 'var(--bd)'}`,
            borderRadius: 4, padding: '18px 20px', cursor: enabled ? 'pointer' : 'default',
            background: privacyMode === 'real' ? 'rgba(17,24,39,0.03)' : 'var(--bg1)', transition: 'border-color 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: `2px solid ${privacyMode === 'real' ? 'var(--t1)' : 'var(--bd)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {privacyMode === 'real' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t1)' }} />}
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>실명</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--t2)', margin: '0 0 16px', lineHeight: 1.6 }}>
            관리자가 학생의 이름, 학년, 반, 번호를 확인할 수 있습니다.
          </p>
          <div style={{ background: 'var(--bg2)', borderRadius: 4, padding: '14px 16px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>홍길동</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>2학년 3반 15번</div>
          </div>
        </div>

        {/* 비식별 */}
        <div
          onClick={() => enabled && onPrivacyModeChange('anonymous')}
          style={{
            flex: 1, border: `2px solid ${privacyMode === 'anonymous' ? 'var(--t1)' : 'var(--bd)'}`,
            borderRadius: 4, padding: '18px 20px', cursor: enabled ? 'pointer' : 'default',
            background: privacyMode === 'anonymous' ? 'rgba(17,24,39,0.03)' : 'var(--bg1)', transition: 'border-color 0.15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, border: `2px solid ${privacyMode === 'anonymous' ? 'var(--t1)' : 'var(--bd)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {privacyMode === 'anonymous' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--t1)' }} />}
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>비식별</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--t2)', margin: '0 0 16px', lineHeight: 1.6 }}>
            학생 이름은 숨기고 학년, 반, 번호(또는 학생 ID)만 표시합니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: 'var(--bg2)', borderRadius: 4, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>2학년 3반 15번</div>
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)' }}>또는</div>
            <div style={{ background: 'var(--bg2)', borderRadius: 4, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: 'var(--t3)', fontFamily: 'monospace' }}>STU-00152</div>
            </div>
          </div>
        </div>
      </div>

      {enabled && (
        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 4, background: 'var(--bg2)', border: '1px solid var(--bd)' }}>
          <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.7 }}>
            실제 시스템에는 학생정보가 저장되지만, 관리자 화면에서는 선택한 방식으로만 표시됩니다.
          </div>
        </div>
      )}

      <SaveBar onSave={() => {}} />
    </div>
  )
}

/* ── 탭 3: 학생 단말 알림 ── */
function DeviceNotifTab({ mode }) {
  const enabled = mode === 'school' || mode === 'mdm'

  const [notifEnabled, setNotifEnabled]   = useState(true)
  const [notifLevel, setNotifLevel]       = useState('주의')
  const [repeatAlert, setRepeatAlert]     = useState(true)
  const [displayType, setDisplayType]     = useState('popup')
  const [guideText, setGuideText]         = useState('해당 사이트는 교육청 정책에 의해 차단되었습니다.')

  const row = (label, sub, control) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--bd)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 3 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0, marginLeft: 24 }}>{control}</div>
    </div>
  )

  return (
    <div style={{ opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'auto' : 'none' }}>
      {!enabled && (
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 4, background: 'var(--bg2)', border: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--t3)', flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span style={{ fontSize: 13, color: 'var(--t3)' }}>학교관리 또는 MDM 연동 모드에서만 설정할 수 있습니다.</span>
        </div>
      )}

      <SectionTitle sub="학생 단말기에 표시되는 알림을 설정합니다.">학생 단말 알림 설정</SectionTitle>

      <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, padding: '0 20px' }}>
        {row(
          '탐지 알림 사용',
          '탐지 발생 시 학생 단말에 알림을 표시합니다.',
          <Toggle checked={notifEnabled} onChange={setNotifEnabled} />
        )}
        {row(
          '알림 단계',
          '학생에게 표시되는 알림의 심각도 수준입니다.',
          <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
            {NOTIF_LEVELS.map((lvl, i) => {
              const active = notifLevel === lvl
              return (
                <button key={lvl} onClick={() => setNotifLevel(lvl)}
                  style={{ padding: '6px 14px', fontSize: 12, border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`, marginLeft: i === 0 ? 0 : -1, background: active ? 'var(--t1)' : 'var(--bg2)', color: active ? '#fff' : 'var(--t2)', cursor: 'pointer', fontWeight: active ? 600 : 400, position: 'relative', zIndex: active ? 1 : 0 }}>
                  {lvl}
                </button>
              )
            })}
          </div>
        )}
        {row(
          '반복 탐지 시 알림',
          '동일 사이트 재탐지 시 알림을 반복 표시합니다.',
          <Toggle checked={repeatAlert} onChange={setRepeatAlert} />
        )}
        {row(
          '알림 표시 방식',
          '학생 화면에 표시되는 알림의 형태입니다.',
          <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
            {[{ id: 'popup', label: '팝업' }, { id: 'banner', label: '배너' }, { id: 'both', label: '모두' }].map((t, i) => {
              const active = displayType === t.id
              return (
                <button key={t.id} onClick={() => setDisplayType(t.id)}
                  style={{ padding: '6px 14px', fontSize: 12, border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`, marginLeft: i === 0 ? 0 : -1, background: active ? 'var(--t1)' : 'var(--bg2)', color: active ? '#fff' : 'var(--t2)', cursor: 'pointer', fontWeight: active ? 600 : 400, position: 'relative', zIndex: active ? 1 : 0 }}>
                  {t.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionTitle>학생 안내 문구</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            value={guideText}
            onChange={e => setGuideText(e.target.value)}
            rows={3}
            className="inp"
            style={{ resize: 'vertical', lineHeight: 1.6, fontSize: 13 }}
            placeholder="학생에게 표시될 안내 문구를 입력하세요."
          />
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>탐지 발생 시 학생 단말기에 표시되는 안내 메시지입니다.</div>
        </div>
      </div>

      <SaveBar onSave={() => {}} />
    </div>
  )
}

/* ── 메인 컴포넌트 ── */
export default function PolicySettings() {
  const [activeTab, setActiveTab]     = useState(0)
  const [mode, setMode]               = useState('school')
  const [privacyMode, setPrivacyMode] = useState('real')

  const handleModeChange = (newMode) => {
    setMode(newMode)
  }

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 탭 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '2px solid var(--bd)', marginBottom: 40 }}>
        <div style={{ display: 'flex' }}>
          {PAGE_TABS.map((tab, i) => {
            const active = activeTab === i
            const disabled = (i === 1 || i === 2) && !MODES.find(m => m.id === mode)?.privacyEnabled
            return (
              <button
                key={tab}
                onClick={() => !disabled && setActiveTab(i)}
                style={{
                  fontSize: 22, fontWeight: active ? 700 : 400,
                  color: disabled ? 'var(--bd)' : active ? 'var(--t1)' : 'var(--t3)',
                  borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                  borderBottom: active ? '2px solid var(--t1)' : '2px solid transparent',
                  marginBottom: -2, padding: '12px 20px',
                  background: 'none',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'color 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.color = 'var(--t2)' }}
                onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.color = 'var(--t3)' }}
              >
                {tab}
                {i === 1 && !MODES.find(m => m.id === mode)?.privacyEnabled && (
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--bd)' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ maxWidth: 720 }}>
        {activeTab === 0 && (
          <OperationModeTab mode={mode} onModeChange={handleModeChange} />
        )}
        {activeTab === 1 && (
          <PrivacyTab mode={mode} privacyMode={privacyMode} onPrivacyModeChange={setPrivacyMode} />
        )}
        {activeTab === 2 && (
          <DeviceNotifTab mode={mode} />
        )}
      </div>
    </div>
  )
}
