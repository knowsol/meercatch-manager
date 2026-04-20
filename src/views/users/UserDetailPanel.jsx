'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

const roleLabel = { admin:'관리자', staff:'직원', teacher:'선생님' };

export default function UserDetailPanel({ userId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const user = DUMMY.users.find(u => u.userId === userId) || DUMMY.users[0];

  const [tab, setTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isAssignEditing, setIsAssignEditing] = useState(false);

  const [name,    setName]    = useState(user.name);
  const [contact, setContact] = useState(user.contact);

  const [assignments, setAssignments] = useState((user.assignments || []).map(a => ({ ...a })));
  const [groupAdd, setGroupAdd] = useState('');

  const allUserPauses = DUMMY.pauses.filter(p => p.requester === user.name);
  const [pauseFrom, setPauseFrom] = useState('');
  const [pauseTo,   setPauseTo]   = useState('');
  const [pauseType, setPauseType] = useState('');

  const TABS = [
    { id:'info',         label:'기본정보' },
    { id:'assignments',  label:'담당 범위' },
    { id:'pauseHistory', label:'탐지 중단 이력' },
  ];

  const handleTabChange = (id) => {
    setTab(id);
    setIsEditing(false);
    setIsAssignEditing(false);
  };

  // ── info tab ──
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

  // ── assignments tab ──
  function renderAssignments() {
    const getGroupInfo = (groupId) => {
      const grp = DUMMY.groups.find(g => g.groupId === groupId);
      const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
      return { groupName: grp ? grp.name : '—', schoolName: sch ? sch.name : '—' };
    };

    const rows = assignments.map(a => ({ ...a, ...getGroupInfo(a.groupId) }));

    const cols = [
      { key: 'schoolName', label: '학교' },
      { key: 'groupName',  label: '그룹 이름' },
    ];
    if (isAssignEditing) {
      cols.push({ key: '_act', label: '', width: '60px', render: (_, r) => (
        <button className="btn btn-d btn-xs" onClick={e => {
          e.stopPropagation();
          setAssignments(prev => prev.filter(a => a.groupId !== r.groupId));
          toast('담당 범위가 제거되었습니다.', 'warn');
        }}>제거</button>
      )});
    }

    const assignedIds = new Set(assignments.map(a => a.groupId));
    const availableGroups = DUMMY.groups.filter(g => !assignedIds.has(g.groupId));

    if (!isAssignEditing) {
      return (
        <div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 12 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setIsAssignEditing(true)}>수정</button>
          </div>
          {rows.length > 0
            ? <Table cols={cols} rows={rows} />
            : <div className="empty"><div className="empty-title">담당 범위 없음</div></div>
          }
        </div>
      );
    }
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <select className="inp" style={{ flex: 1 }} value={groupAdd} onChange={e => setGroupAdd(e.target.value)}>
            <option value="">그룹 선택</option>
            {availableGroups.map(g => {
              const sch = DUMMY.schools.find(s => s.schoolId === g.schoolId);
              return <option key={g.groupId} value={g.groupId}>{sch ? sch.name + ' · ' : ''}{g.name}</option>;
            })}
          </select>
          <button className="btn btn-p btn-sm" onClick={() => {
            if (!groupAdd) { toast('그룹을 선택해주세요.', 'warn'); return; }
            setAssignments(prev => [...prev, { groupId: groupAdd }]);
            setGroupAdd('');
            toast('담당 범위가 추가되었습니다.');
          }}>추가</button>
        </div>
        {rows.length > 0
          ? <Table cols={cols} rows={rows} />
          : <div className="empty"><div className="empty-title">담당 범위 없음</div></div>
        }
      </div>
    );
  }

  // ── pause history tab ──
  function renderPauseHistory() {
    const from = pauseFrom ? new Date(pauseFrom) : null;
    const to   = pauseTo   ? new Date(pauseTo + 'T23:59:59') : null;
    const filtered = allUserPauses.filter(p => {
      if (from && new Date(p.startAt) < from) return false;
      if (to   && new Date(p.startAt) > to)   return false;
      if (pauseType && p.pauseType !== pauseType) return false;
      return true;
    });
    const cols = [
      { key: 'groupId',  label: '그룹', render: v => {
        const grp = DUMMY.groups.find(g => g.groupId === v);
        const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
        return sch ? sch.name : '—';
      }},
      { key: 'pauseType', label: '유형' },
      { key: 'startAt',   label: '시작', render: v => fmtDT(v) },
      { key: 'status',    label: '상태', render: v => <StatusBadge status={v === 'ACTIVE' ? 'active' : 'inactive'} /> },
    ];
    return (
      <div>
        <div style={{display:'flex', gap:'8px', marginBottom:'12px', alignItems:'center'}}>
          <input className="inp" type="date" style={{flex:1}} value={pauseFrom} onChange={e => setPauseFrom(e.target.value)} />
          <span style={{fontSize:'12px', color:'#94a3b8'}}>~</span>
          <input className="inp" type="date" style={{flex:1}} value={pauseTo} onChange={e => setPauseTo(e.target.value)} />
          <select className="inp" style={{minWidth:'90px'}} value={pauseType} onChange={e => setPauseType(e.target.value)}>
            <option value="">전체 유형</option>
            <option value="전체">전체</option>
            <option value="선정성">선정성</option>
            <option value="도박">도박</option>
            <option value="폭력">폭력</option>
          </select>
        </div>
        {filtered.length > 0
          ? <Table cols={cols} rows={filtered} />
          : <div className="empty"><div className="empty-title">탐지 중단 이력 없음</div></div>
        }
      </div>
    );
  }

  // ── footer ──
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
    if (tab === 'assignments' && isAssignEditing) {
      return (
        <div className="mod-f">
          <div />
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => setIsAssignEditing(false)}>취소</button>
            <button className="btn btn-p" onClick={() => { toast('저장되었습니다.'); setIsAssignEditing(false); }}>저장</button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{user.name}</h2>
      </div>
      <div className="mod-b" style={{flex:1, overflowY:'auto'}}>
        <div className="tabs">
          {TABS.map(t => (
            <div key={t.id} className={`tab${tab === t.id ? ' a' : ''}`} onClick={() => handleTabChange(t.id)}>{t.label}</div>
          ))}
        </div>
        <div style={{marginTop:'16px'}}>
          {tab === 'info'         && renderInfo()}
          {tab === 'assignments'  && renderAssignments()}
          {tab === 'pauseHistory' && renderPauseHistory()}
        </div>
      </div>
      {renderFooter()}
    </div>
  );
}
