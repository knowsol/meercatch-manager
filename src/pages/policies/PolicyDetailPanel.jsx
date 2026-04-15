import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge, DetTypeBadge } from '../../components/common/Badge';
import SelectModal from '../../components/common/SelectModal';
import { fmtD } from '../../components/common/helpers';
import { policies, groups } from '../../data/dummy';

const TABS = ['기본정보', '적용 그룹'];

export default function PolicyDetailPanel({ policyId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [tab, setTab] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const policy = policies.find(p => p.policyId === policyId) || {};
  const [name, setName] = useState(policy.name || '');
  const [desc, setDesc] = useState(policy.desc || '');

  const appliedGroups = groups.slice(0, policy.appliedCount || 0);
  const availableGroups = groups.filter(g => !appliedGroups.find(ag => ag.groupId === g.groupId));

  const groupCols = [
    { key: 'name', label: '그룹명' },
    { key: 'grade', label: '학년', render: r => `${r.grade}학년` },
    { key: 'cls', label: '반', render: r => `${r.cls}반` },
    { key: 'deviceCount', label: '단말 수' },
    {
      key: 'action', label: '',
      render: r => (
        <button className="btn btn-xs btn-d" onClick={e => { e.stopPropagation(); toast(`${r.name} 적용 해제됨`, 'success'); }}>해제</button>
      )
    },
  ];

  const renderBody = () => {
    if (tab === 0) return (
      <div>
        <div className="fg">
          <label>정책이름</label>
          <input className="inp" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="fg">
          <label>설명</label>
          <textarea className="inp" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <dl className="info-row">
          <dt>탐지 유형</dt>
          <dd>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(policy.types || []).map(t => <DetTypeBadge key={t} type={t} />)}
            </div>
          </dd>
          <dt>상태</dt><dd><StatusBadge status={policy.active ? 'active' : 'inactive'} /></dd>
          <dt>적용 그룹</dt><dd>{policy.appliedCount}개</dd>
          <dt>수정일</dt><dd>{fmtD(policy.updatedAt)}</dd>
        </dl>
      </div>
    );
    if (tab === 1) return (
      <>
        <Table cols={groupCols} rows={appliedGroups} />
        {showModal && (
          <SelectModal
            title="그룹 추가"
            items={availableGroups}
            getLabel={g => ({ name: g.name, sub: `단말 ${g.deviceCount}대` })}
            onConfirm={selected => { toast(`${selected.length}개 그룹 추가됨`, 'success'); }}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  };

  const renderFooter = () => {
    if (tab === 0) return (
      <div className="mod-f-row">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div><button className="btn btn-p" onClick={() => toast('저장되었습니다.', 'success')}>저장</button></div>
      </div>
    );
    return (
      <div className="mod-f-row">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div><button className="btn btn-p" onClick={() => setShowModal(true)}>그룹 추가</button></div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{policy.name || '정책 상세'}</h2>
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
