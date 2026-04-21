'use client';
import { ReactNode } from 'react';

const STATUS_MAP: Record<string, [string, string]> = {
  active: ['bdg-ok','활성'], inactive: ['bdg-err','비활성'],
  online: ['bdg-ok','온라인'], offline: ['bdg-err','오프라인'],
  applied: ['bdg-ok','적용됨'], pending: ['bdg-warn','대기중'],
  paused: ['bdg-warn','일시정지'], ACTIVE: ['bdg-warn','진행중'],
  EXPIRED: ['bdg-muted','만료'], CANCELLED: ['bdg-muted','취소'],
  confirmed: ['bdg-err','확인됨'], reviewing: ['bdg-warn','검토중'],
  dismissed: ['bdg-muted','무시됨'], normal: ['bdg-ok','정상'],
};

const DET_MAP: Record<string, string> = { 
  '선정성':'bdg-err','도박':'bdg-warn','폭력':'bdg-err','마약':'bdg-err','혐오':'bdg-warn','기타':'bdg-muted' 
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const [cls, label] = STATUS_MAP[status] || ['bdg-muted', status || '—'];
  return <span className={`bdg ${cls}`}>{label}</span>;
}

interface DetTypeBadgeProps {
  type: string;
}

export function DetTypeBadge({ type }: DetTypeBadgeProps) {
  return <span className={`bdg ${DET_MAP[type] || 'bdg-muted'}`}>{type}</span>;
}

interface BadgeProps {
  cls: string;
  children: ReactNode;
}

export function Badge({ cls, children }: BadgeProps) {
  return <span className={`bdg ${cls}`}>{children}</span>;
}
