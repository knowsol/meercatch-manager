import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { fmtD, fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

function policyTypeBadge(policy) {
  return policy.type === '선정성'
    ? <Badge cls="bdg-err">{policy.type}</Badge>
    : <Badge cls="bdg-warn">{policy.type}</Badge>;
}

export default function GroupDetailPanel({ groupId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const group = DUMMY.groups.find(g => g.groupId === groupId) || DUMMY.groups[0];
  const school = DUMMY.schools.find(s => s.schoolId === group.schoolId);
  const schoolName = school ? school.name : '—';

  const devices = DUMMY.devices.filter(d => d.groupId === groupId);
  const appliedPolicies = DUMMY.policies.filter(p => p.active).slice(0, group.policyCount);
  const pauses = DUMMY.pauses.filter(p => p.groupId === groupId);

  const tabs = [
    { id: 'info',     label: '기본정보' },
    { id: 'devices',  label: `단말목록 (${group.deviceCount})` },
    { id: 'policies', label: '적용정책' },
    { id: 'pauses',   label: '탐지중단현황' },
  ];

  const devCols = [
    { key: '_no',        label: 'No.', width: '48px' },
    { key: 'name',       label: '단말 이름' },
    { key: 'identifier', label: '식별자' },
    { key: 'status',     label: '상태', width: '80px', render: v => <StatusBadge status={v} /> },
    { key: 'lastContact',label: '최근 접속', render: v => fmtDT(v) },
  ];

  const polCols = [
    { key: 'name',   label: '정책 이름' },
    { key: 'type',   label: '탐지 유형', width: '90px', render: (_, r) => policyTypeBadge(r) },
    { key: 'active', label: '상태', width: '80px', render: v => <StatusBadge status={v ? 'active' : 'inactive'} /> },
  ];

  const pauseCols = [
    { key: 'pauseType', label: '유형' },
    { key: 'requester', label: '요청자' },
    { key: 'startAt',   label: '시작', render: v => fmtDT(v) },
    { key: 'endAt',     label: '종료', render: v => fmtDT(v) },
    { key: 'status',    label: '상태', width: '90px', render: v => {
      if (v === 'ACTIVE') return <Badge cls="bdg-warn">진행중</Badge>;
      if (v === 'EXPIRED') return <Badge cls="bdg-muted">만료</Badge>;
      return <Badge cls="bdg-muted">취소</Badge>;
    }},
  ];

  function renderFooter() {
    if (activeTab === 'info') {
      if (isEditing) return (
        <div className="mod-f">
          <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => setIsEditing(false)}>취소</button>
            <button className="btn btn-p" onClick={() => { toast('저장되었습니다.'); setIsEditing(false); }}>저장</button>
          </div>
        </div>
      );
      return (
        <div className="mod-f">
          <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
          <div className="mod-f-right">
            <button className="btn btn-outline" onClick={() => { setName(group.name); setDesc(''); setIsEditing(true); }}>수정</button>
            <button className="btn btn-d" onClick={() => { if (window.confirm('이 그룹을 삭제하시겠습니까?')) { toast('삭제되었습니다.', 'warn'); closePanel(); } }}>삭제</button>
          </div>
        </div>
      );
    }
    if (activeTab === 'policies') return (
      <div className="mod-f">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div className="mod-f-right">
          <button className="btn btn-p" onClick={() => toast('정책 추가 기능', 'info')}>정책 추가</button>
        </div>
      </div>
    );
    return (
      <div className="mod-f">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{schoolName}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.id} className={`tab${activeTab === t.id ? ' a' : ''}`}
              onClick={() => { setActiveTab(t.id); setIsEditing(false); }}>
              {t.label}
            </div>
          ))}
        </div>

        {activeTab === 'info' && (
          <div style={{ marginTop: 16 }}>
            {isEditing ? (
              <>
                <div className="fg"><label>학교</label>
                  <select className="inp" defaultValue={group.schoolId}>
                    {DUMMY.schools.map(s => <option key={s.schoolId} value={s.schoolId}>{s.name}</option>)}
                  </select>
                </div>
                <div className="fg"><label>학교유형</label>
                  <div style={{ padding: '6px 0', color: '#64748b', fontSize: 14 }}>{school ? school.type : '—'}</div>
                </div>
                <div className="fg"><label>그룹 이름 <span className="req">*</span></label>
                  <input className="inp" type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="fg"><label>설명</label>
                  <textarea className="inp" style={{ minHeight: 80 }} value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <dl className="info-row">
                  <dt>학교</dt>       <dd>{schoolName}</dd>
                  <dt>학교유형</dt>   <dd>{school ? school.type : '—'}</dd>
                  <dt>그룹 이름</dt>  <dd>{group.name}</dd>
                  <dt>상태</dt>       <dd><StatusBadge status={group.status} /></dd>
                  <dt>탐지 중단</dt>  <dd>{group.pauseStatus === 'paused' ? <Badge cls="bdg-warn">중단중</Badge> : <Badge cls="bdg-ok">정상</Badge>}</dd>
                  <dt>최근 수정</dt>  <dd>{fmtD(group.updatedAt)}</dd>
                </dl>
              </>
            )}
          </div>
        )}

        {activeTab === 'devices' && (
          <Table cols={devCols} rows={devices.map((d, i) => ({ ...d, _no: i + 1 }))} />
        )}

        {activeTab === 'policies' && (
          <Table cols={polCols} rows={appliedPolicies} />
        )}

        {activeTab === 'pauses' && (
          <Table cols={pauseCols} rows={pauses} />
        )}
      </div>
      {renderFooter()}
    </div>
  );
}
