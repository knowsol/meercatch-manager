'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { StatusBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

const roleLabel = { admin:'관리자', staff:'직원', teacher:'선생님' };

export default function UserDetailPanel({ userId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const user = DUMMY.users.find(u => u.userId === userId) || DUMMY.users[0];

  const [isEditing, setIsEditing] = useState(false);

  const [name,    setName]    = useState(user.name);
  const [contact, setContact] = useState(user.contact);

  // ── info ──
  function renderInfo() {
    if (!isEditing) {
      return (
        <dl className="info-row">
          <dt>이름</dt>      <dd>{user.name}</dd>
          <dt>연락처</dt>    <dd>{user.contact}</dd>
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
