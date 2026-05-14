'use client';
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
// import { useToastCtx } from '../../components/layout/Layout';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import type { Account, AccountRole } from '@/types';

const ROLE_LABEL: Record<AccountRole, string> = {
  SUPER_ADMIN: '슈퍼관리자',
  ADMIN: '관리자',
  MANAGER: '매니저',
  USER: '사용자',
};

// 이메일 마스킹: 앞 2자리 이후 @ 전까지 마스킹
function maskEmail(email: string | null | undefined): string {
  if (!email) return '—';
  const atIndex = email.indexOf('@');
  if (atIndex <= 2) return email;
  const visible = email.slice(0, 2);
  const masked = '*'.repeat(atIndex - 2);
  const domain = email.slice(atIndex);
  return `${visible}${masked}${domain}`;
}

// 연락처 마스킹: 가운데 자리 마스킹 (010-****-1234)
function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '—';
  const cleaned = phone.replaceAll(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-****-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-***-${cleaned.slice(6)}`;
  }
  return phone;
}

interface UserDetailPanelProps {
  account: Account;
}

export default function UserDetailPanel({ account }: UserDetailPanelProps) {
  const { closePanel } = usePanel();

  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <h1 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          color: 'var(--t1)', 
          margin: '0 0 24px 0',
          paddingBottom: 16,
          borderBottom: '1px solid var(--bd)'
        }}>
          {account.name}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>이름</div>
            <div style={{ fontSize: 15, color: 'var(--t1)' }}>{account.name}</div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>연락처</div>
            <div style={{ fontSize: 15, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {showPhone ? (account.phoneNo || '—') : maskPhone(account.phoneNo)}
              {account.phoneNo && (
                <button
                  type="button"
                  onClick={() => setShowPhone(!showPhone)}
                  style={{
                    padding: '2px 8px',
                    fontSize: 11,
                    background: 'var(--bg3)',
                    border: '1px solid var(--bd)',
                    borderRadius: 4,
                    color: 'var(--t2)',
                    cursor: 'pointer',
                  }}
                >
                  {showPhone ? '숨기기' : '보기'}
                </button>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>이메일</div>
            <div style={{ fontSize: 15, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {showEmail ? (account.email || '—') : maskEmail(account.email)}
              {account.email && (
                <button
                  type="button"
                  onClick={() => setShowEmail(!showEmail)}
                  style={{
                    padding: '2px 8px',
                    fontSize: 11,
                    background: 'var(--bg3)',
                    border: '1px solid var(--bd)',
                    borderRadius: 4,
                    color: 'var(--t2)',
                    cursor: 'pointer',
                  }}
                >
                  {showEmail ? '숨기기' : '보기'}
                </button>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>아이디</div>
            <div style={{ fontSize: 15, color: 'var(--t1)' }}>{account.username}</div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>역할</div>
            <div style={{ fontSize: 15, color: 'var(--t1)' }}>{ROLE_LABEL[account.role] || account.role}</div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>상태</div>
            <div><StatusBadge status={account.activeYn === 'Y' ? 'active' : 'inactive'} /></div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 6 }}>최근 접속</div>
            <div style={{ fontSize: 15, color: 'var(--ac)' }}>{fmtDT(account.lastLoginAt)}</div>
          </div>
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={closePanel}>닫기</button>
        </div>
      </div>
    </div>
  );
}
