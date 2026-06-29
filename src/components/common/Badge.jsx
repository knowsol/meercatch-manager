'use client'

const DOT_COLOR = {
  ok:   '#22c55e',
  err:  '#ef4444',
  warn: '#f97316',
  muted:'#94a3b8',
}

const STATUS_MAP = {
  active:    ['ok',    '활성'],
  inactive:  ['muted', '비활성'],
  online:    ['ok',    '온라인'],
  offline:   ['muted', '오프라인'],
  applied:   ['ok',    '적용됨'],
  pending:   ['warn',  '대기중'],
  paused:    ['warn',  '일시정지'],
  dormant:   ['warn',  '휴면'],
  ACTIVE:    ['warn',  '진행중'],
  EXPIRED:   ['muted', '만료'],
  CANCELLED: ['muted', '취소'],
  confirmed: ['err',   '확인됨'],
  reviewing: ['warn',  '검토중'],
  dismissed: ['muted', '무시됨'],
  normal:      ['ok',    '정상'],
  registered:  ['ok',    '등록완료'],
  unknown:     ['muted', '알수없음'],
}

export function StatusBadge({ status }) {
  const [type, label] = STATUS_MAP[status] || ['muted', status || '—']
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: DOT_COLOR[type], flexShrink: 0 }} />
      {label}
    </span>
  )
}

const DET_MAP = { '선정성':'bdg-err','도박':'bdg-warn','폭력':'bdg-err','마약':'bdg-err','혐오':'bdg-warn','기타':'bdg-muted' }

export function DetTypeBadge({ type }) {
  return <span className={`bdg ${DET_MAP[type] || 'bdg-muted'}`}>{type}</span>
}

export function Badge({ cls, children }) {
  return <span className={`bdg ${cls}`}>{children}</span>
}
