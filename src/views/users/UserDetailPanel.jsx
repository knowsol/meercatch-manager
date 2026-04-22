'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useAuth } from '../../context/AuthContext';
import { useToastCtx } from '../../components/layout/Layout';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

const roleLabel = { admin:'관리자', staff:'직원', teacher:'선생님' };

function maskContact(v) {
  if (!v) return '—';
  return v.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
}

function maskEmail(v) {
  if (!v) return '—';
  const [local, domain] = v.split('@');
  const masked = local.length <= 2 ? local + '****' : local.slice(0, 2) + '****';
  return masked + '@' + domain;
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function UserDetailPanel({ userId }) {
  const { closePanel } = usePanel();
  const { role } = useAuth();
  const toast = useToastCtx();
  const user = DUMMY.users.find(u => u.userId === userId) || DUMMY.users[0];

  const isDirect = role === 'direct';

  const [isEditing, setIsEditing] = useState(false);
  const [name,      setName]      = useState(user.name);
  const [contact,   setContact]   = useState(user.contact);
  const [showContact, setShowContact] = useState(false);
  const [showEmail,   setShowEmail]   = useState(false);

  // ── info ──
  function renderInfo() {
    if (!isEditing) {
      return (
        <dl className="info-row">
          <dt>이름</dt>      <dd>{user.name}</dd>
          <dt>연락처</dt>
          <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isDirect
              ? <>{showContact ? user.contact : maskContact(user.contact)}
                  <button
                    onClick={() => setShowContact(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#64748b', display: 'flex', alignItems: 'center' }}
                    title={showContact ? '숨기기' : '보기'}
                  ><EyeIcon visible={showContact} /></button>
                </>
              : user.contact
            }
          </dd>
          {isDirect && (
            <>
              <dt>이메일</dt>
              <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {showEmail ? user.email : maskEmail(user.email)}
                <button
                  onClick={() => setShowEmail(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#64748b', display: 'flex', alignItems: 'center' }}
                  title={showEmail ? '숨기기' : '보기'}
                ><EyeIcon visible={showEmail} /></button>
              </dd>
            </>
          )}
          <dt>아이디</dt>    <dd>{user.username}</dd>
          <dt>역할</dt>      <dd>{roleLabel[user.role] || user.role}</dd>
          <dt>상태</dt>      <dd><StatusBadge status={user.status} /></dd>
          <dt>최근 접속</dt> <dd>{fmtDT(user.lastLogin)}</dd>
        </dl>
      );
    }
    return (
      <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
        <div className="fg">
          <label>이름<span className="req"> *</span></label>
          <input className="inp" value={name} type="text" onChange={e => setName(e.target.value)} />
        </div>
        <div className="fg">
          <label>연락처</label>
          <input className="inp" value={contact} type="text" onChange={e => setContact(e.target.value)} />
        </div>
        <dl className="info-row mt-16">
          <dt>아이디</dt>    <dd>{user.username}</dd>
          <dt>역할</dt>      <dd>{roleLabel[user.role] || user.role}</dd>
          <dt>상태</dt>      <dd><StatusBadge status={user.status} /></dd>
          <dt>최근 접속</dt> <dd>{fmtDT(user.lastLogin)}</dd>
        </dl>
      </div>
    );
  }

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{user.name}</h2>
      </div>
      <div className="mod-b" style={{flex:1, overflowY:'auto'}}>
        {renderInfo()}
      </div>
      {isEditing ? (
        <div className="mod-f">
          <div />
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>취소</button>
            <button className="btn btn-p" onClick={() => { toast('저장되었습니다.'); setIsEditing(false); }}>저장</button>
          </div>
        </div>
      ) : (
        <div className="mod-f">
          <div />
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => setIsEditing(true)}>수정</button>
            <button className="btn btn-d" onClick={() => { toast('사용자가 삭제되었습니다.', 'warn'); closePanel(); }}>삭제</button>
          </div>
        </div>
      )}
    </div>
  );
}
