import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge } from '../../components/common/Badge';
import SelectModal from '../../components/common/SelectModal';
import { fmtDT } from '../../components/common/helpers';
import { groups, devices, policies, pauses } from '../../data/dummy';

const TABS = ['기본정보', '단말목록', '적용정책', '탐지중단현황'];

export default function GroupDetailPanel({ groupId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [tab, setTab] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const group = groups.find(g => g.groupId === groupId) || {};
  const [name, setName] = useState(group.name || '');
  const [desc, setDesc] = useState(group.desc || '');

  const groupDevices = devices.filter(d => d.groupId === groupId);
  const groupPauses = pauses.filter(p => p.groupName === group.name);
  const appliedPolicies = policies.slice(0, group.policyCount || 0);
  const availablePolicies = policies.filter(p => !appliedPolicies.find(ap => ap.policyId === p.policyId));

  const deviceCols = [
    { key: 'name', label: '단말 이름' },
    { key: 'identifier', label: '식별자' },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
    { key: 'policyStatus', label: '정책 상태', render: r => <StatusBadge status={r.policyStatus} /> },
    { key: 'lastContact', label: '최근 접속', render: r => fmtDT(r.lastContact) },
  ];

  const policyCols = [
    { key: 'name', label: '정책명' },
    { key: 'desc', label: '설명' },
    { key: 'appliedCount', label: '적용 그룹 수' },
    {
      key: 'action', label: '',
      render: r => (
        <button className="btn btn-xs btn-d" onClick={e => { e.stopPropagation(); toast(`${r.name} 정책 해제됨`, 'success'); }}>해제</button>
      )
    },
  ];

  const pauseCols = [
    { key: 'pauseType', label: '유형' },
    { key: 'requester', label: '요청자' },
    { key: 'startAt', label: '시작', render: r => fmtDT(r.startAt) },
    { key: 'endAt', label: '종료', render: r => fmtDT(r.endAt) },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
  ];

  const renderBody = () => {
    if (tab === 0) return (
      <div>
        <div className="fg">
          <label>그룹명</label>
          <input className="inp" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="fg">
          <label>설명</label>
          <textarea className="inp" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="설명" />
        </div>
        <div className="fg">
          <label>학년</label>
          <input className="inp" value={`${group.grade}학년`} disabled />
        </div>
        <div className="fg">
          <label>반</label>
          <input className="inp" value={`${group.cls}반`} disabled />
        </div>
      </div>
    );
    if (tab === 1) return <Table cols={deviceCols} rows={groupDevices} />;
    if (tab === 2) return (
      <>
        <Table cols={policyCols} rows={appliedPolicies} />
        {showModal && (
          <SelectModal
            title="정책 추가"
            items={availablePolicies}
            getLabel={p => ({ name: p.name, sub: p.desc })}
            onConfirm={selected => { toast(`${selected.length}개 정책 추가됨`, 'success'); }}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
    if (tab === 3) return <Table cols={pauseCols} rows={groupPauses} />;
  };

  const renderFooter = () => {
    if (tab === 0) return (
      <div className="mod-f-row">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-d" onClick={() => { toast('그룹이 삭제되었습니다.', 'success'); closePanel(); }}>삭제</button>
          <button className="btn btn-p" onClick={() => { toast('저장되었습니다.', 'success'); }}>저장</button>
        </div>
      </div>
    );
    if (tab === 2) return (
      <div className="mod-f-row">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div><button className="btn btn-p" onClick={() => setShowModal(true)}>정책 추가</button></div>
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
        <h2>{group.name || '그룹 상세'}</h2>
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
