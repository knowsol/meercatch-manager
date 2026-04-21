'use client';
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import type { Account, AccountRole } from '@/types';

const ROLE_LABEL: Record<AccountRole, string> = {
  SUPER_ADMIN: '슈퍼관리자',
  ADMIN: '관리자',
  MANAGER: '매니저',
  USER: '사용자',
};

interface UserDetailPanelProps {
  account: Account;
}

export default function UserDetailPanel({ account }: UserDetailPanelProps) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();

  const [tab, setTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);

  // 폼 상태
  const [name, setName] = useState(account.name);
  const [contact, setContact] = useState(account.phoneNo || '');

  const TABS = [
    { id: 'info', label: '기본정보' },
    { id: 'assignments', label: '담당 범위' },
    { id: 'pauseHistory', label: '탐지 중단 이력' },
  ];

  const handleTabChange = (id: string) => {
    setTab(id);
    setIsEditing(false);
  };

  function renderInfo() {
    if (!isEditing) {
      return (
        <dl className="info-row">
          <dt>이름</dt>
          <dd>{account.name}</dd>
          <dt>연락처</dt>
          <dd>{account.phoneNo || '—'}</dd>
          <dt>아이디</dt>
          <dd>{account.username}</dd>
          <dt>역할</dt>
          <dd>{ROLE_LABEL[account.role] || account.role}</dd>
          <dt>상태</dt>
          <dd><StatusBadge status={account.activeYn === 'Y' ? 'active' : 'inactive'} /></dd>
          <dt>최근 접속</dt>
          <dd>{fmtDT(account.lastLoginAt)}</dd>
        </dl>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="fg">
          <label>이름<span className="req"> *</span></label>
          <input className="inp" value={name} type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="fg">
          <label>연락처</label>
          <input className="inp" value={contact} type="text" onChange={(e) => setContact(e.target.value)} />
        </div>
        <dl className="info-row mt-16">
          <dt>아이디</dt>
          <dd>{account.username}</dd>
          <dt>역할</dt>
          <dd>{ROLE_LABEL[account.role] || account.role}</dd>
          <dt>상태</dt>
          <dd><StatusBadge status={account.activeYn === 'Y' ? 'active' : 'inactive'} /></dd>
          <dt>최근 접속</dt>
          <dd>{fmtDT(account.lastLoginAt)}</dd>
        </dl>
      </div>
    );
  }

  function renderAssignments() {
    return (
      <div className="empty">
        <div className="empty-title">담당 범위 없음</div>
      </div>
    );
  }

  function renderPauseHistory() {
    return (
      <div className="empty">
        <div className="empty-title">탐지 중단 이력 없음</div>
      </div>
    );
  }

  function renderFooter() {
    if (tab === 'info') {
      if (isEditing) {
        return (
          <div className="mod-f">
            <div />
            <div className="mod-f-right">
              <button className="btn btn-outline" onClick={() => setIsEditing(false)}>취소</button>
              <button className="btn btn-p" onClick={() => { toast('저장되었습니다.'); setIsEditing(false); }}>저장</button>
            </div>
          </div>
        );
      }
      return (
        <div className="mod-f">
          <div />
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => setIsEditing(true)}>수정</button>
            <button className="btn btn-d" onClick={() => { toast('사용자가 삭제되었습니다.', 'warn'); closePanel(); }}>삭제</button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{account.name}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="tabs">
          {TABS.map((t) => (
            <div key={t.id} className={`tab${tab === t.id ? ' a' : ''}`} onClick={() => handleTabChange(t.id)}>
              {t.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px' }}>
          {tab === 'info' && renderInfo()}
          {tab === 'assignments' && renderAssignments()}
          {tab === 'pauseHistory' && renderPauseHistory()}
        </div>
      </div>
      {renderFooter()}
    </div>
  );
}
