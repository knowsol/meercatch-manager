import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import SelectModal from '../../components/common/SelectModal';
import { fmtDT } from '../../components/common/helpers';
import { users, pauses } from '../../data/dummy';

const TABS = ['기본정보', '담당 범위', '탐지 중단 이력'];
const ROLE_LABEL = { admin: '관리자', staff: '직원', teacher: '교사' };

const GRADE_SLOTS = [
  { id: 'g1c1', grade: 1, cls: 1 },
  { id: 'g1c2', grade: 1, cls: 2 },
  { id: 'g2c1', grade: 2, cls: 1 },
  { id: 'g2c2', grade: 2, cls: 2 },
  { id: 'g3c1', grade: 3, cls: 1 },
  { id: 'g3c2', grade: 3, cls: 2 },
];

export default function UserDetailPanel({ userId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [tab, setTab] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const user = users.find(u => u.userId === userId) || {};
  const [name, setName] = useState(user.name || '');
  const [contact, setContact] = useState(user.contact || '');
  const [assignments, setAssignments] = useState(user.assignments || []);

  const userPauses = pauses.filter(p => p.requester === user.name);

  const assignmentCols = [
    { key: 'grade', label: '학년', render: r => `${r.grade}학년` },
    { key: 'cls', label: '반', render: r => `${r.cls}반` },
    {
      key: 'action', label: '',
      render: (r, i) => (
        <button
          className="btn btn-xs btn-d"
          onClick={e => {
            e.stopPropagation();
            setAssignments(prev => prev.filter((_, idx) => idx !== i));
            toast('담당 범위가 제거되었습니다.', 'success');
          }}
        >
          제거
        </button>
      )
    },
  ];

  const pauseCols = [
    { key: 'groupName', label: '학년/반' },
    { key: 'pauseType', label: '유형' },
    { key: 'startAt', label: '시작', render: r => fmtDT(r.startAt) },
    { key: 'endAt', label: '종료', render: r => fmtDT(r.endAt) },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
  ];

  const assignmentsWithIdx = assignments.map((a, i) => ({ ...a, _idx: i }));

  const renderBody = () => {
    if (tab === 0) return (
      <div>
        <div className="fg">
          <label>이름</label>
          <input className="inp" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="fg">
          <label>연락처</label>
          <input className="inp" value={contact} onChange={e => setContact(e.target.value)} />
        </div>
        <dl className="info-row">
          <dt>아이디</dt><dd>{user.username}</dd>
          <dt>역할</dt><dd>{ROLE_LABEL[user.role] || user.role}</dd>
          <dt>상태</dt><dd><StatusBadge status={user.status} /></dd>
          <dt>최근접속</dt><dd>{fmtDT(user.lastLogin)}</dd>
        </dl>
      </div>
    );
    if (tab === 1) return (
      <>
        <Table
          cols={assignmentCols}
          rows={assignmentsWithIdx}
        />
        {showModal && (
          <SelectModal
            title="학년 추가"
            items={GRADE_SLOTS.filter(s => !assignments.find(a => a.grade === s.grade && a.cls === s.cls))}
            getLabel={s => ({ name: `${s.grade}학년 ${s.cls}반` })}
            onConfirm={selected => {
              setAssignments(prev => [...prev, ...selected.map(s => ({ grade: s.grade, cls: s.cls }))]);
              toast(`${selected.length}개 담당 범위 추가됨`, 'success');
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
    if (tab === 2) return <Table cols={pauseCols} rows={userPauses} />;
  };

  const renderFooter = () => {
    if (tab === 0) return (
      <div className="mod-f-row">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div><button className="btn btn-p" onClick={() => toast('저장되었습니다.', 'success')}>저장</button></div>
      </div>
    );
    if (tab === 1) return (
      <div className="mod-f-row">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div><button className="btn btn-p" onClick={() => setShowModal(true)}>학년 추가</button></div>
      </div>
    );
    return (
      <div className="mod-f-row">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{user.name || '사용자 상세'}</h2>
      </div>
      <div className="tabs mb-0">
        {TABS.map((t, i) => (
          <button key={t} className={`tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>
      <div className="mod-b">{renderBody()}</div>
      <div className="mod-f">{renderFooter()}</div>
    </div>
  );
}
