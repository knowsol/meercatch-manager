'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { fmtD } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

const DETECTION_ITEMS = ['배', '여성가슴', '남성가슴', '엉덩이', '여성성기', '남성성기'];

function policyTypeBadge(type) {
  return type === '선정성'
    ? <Badge cls="bdg-err">{type}</Badge>
    : <Badge cls="bdg-warn">{type}</Badge>;
}

function policyDetectSummary(policy) {
  if (policy.type === '선정성') {
    const items = policy.detectionItems || [];
    if (!items.length) return '—';
    return items.slice(0, 2).join(', ') + (items.length > 2 ? ` 외 ${items.length - 2}개` : '');
  } else if (policy.type === '도박') {
    return policy.grade ? `탐지등급 ${policy.grade}` : '—';
  }
  return '—';
}

export default function PolicyDetailPanel({ policyId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const policy = DUMMY.policies.find(p => p.policyId === policyId) || DUMMY.policies[0];

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(policy.name);
  const [desc, setDesc] = useState(policy.desc || '');
  const [activeVal, setActiveVal] = useState(policy.active);
  const [selectedItems, setSelectedItems] = useState(new Set(policy.detectionItems || []));
  const [gradeVal, setGradeVal] = useState(policy.grade || '');

  const appliedGroups = DUMMY.groups.slice(0, policy.appliedCount);

  const toggleItem = (item) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const groupCols = [
    {
      key: 'schoolId', label: '학교', render: v => {
        const sch = DUMMY.schools.find(s => s.schoolId === v);
        return sch ? sch.name : '—';
      }
    },
    {
      key: 'schoolId', label: '학교유형', render: v => {
        const sch = DUMMY.schools.find(s => s.schoolId === v);
        return sch ? <Badge cls="bdg-ac">{sch.type}</Badge> : '—';
      }
    },
    { key: 'deviceCount', label: '단말수', width: 80, render: v => `${v}대` },
  ];

  function renderView() {
    return (
      <div>
        <dl className="info-row">
          <dt>정책이름</dt><dd>{policy.name}</dd>
          <dt>설명</dt><dd>{policy.desc || '—'}</dd>
          <dt>탐지유형</dt><dd>{policyTypeBadge(policy.type)}</dd>
          <dt>탐지내용</dt><dd>{policyDetectSummary(policy)}</dd>
          <dt>상태</dt><dd><StatusBadge status={policy.active ? 'active' : 'inactive'} /></dd>
          <dt>수정일</dt><dd>{fmtD(policy.updatedAt)}</dd>
        </dl>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--bd)' }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>적용 그룹 ({appliedGroups.length}개)</div>
          <Table cols={groupCols} rows={appliedGroups} />
        </div>
      </div>
    );
  }

  function renderEdit() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="fg">
          <label>정책이름<span className="req"> *</span></label>
          <input className="inp" type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="fg">
          <label>설명</label>
          <textarea className="inp" style={{ minHeight: 70 }} value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="fg">
          <label>활성화</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={activeVal} onChange={e => setActiveVal(e.target.checked)} />
            <span style={{ fontSize: 13 }}>활성</span>
          </label>
        </div>

        {policy.type === '선정성' && (
          <div className="fg">
            <label>탐지항목</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DETECTION_ITEMS.map(item => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedItems.has(item)} onChange={() => toggleItem(item)} />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}

        {policy.type === '도박' && (
          <div className="fg">
            <label>탐지등급</label>
            <select className="inp" value={gradeVal} onChange={e => setGradeVal(e.target.value)}>
              <option value="">등급 선택</option>
              <option value="상">상</option>
              <option value="중">중</option>
              <option value="하">하</option>
            </select>
          </div>
        )}

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--bd)' }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>적용 그룹 ({appliedGroups.length}개)</div>
          <Table
            cols={[
              ...groupCols,
              {
                key: '_act', label: '', width: 60, render: (_, r) => (
                  <button className="btn btn-d btn-xs" onClick={e => { e.stopPropagation(); toast('그룹이 해제되었습니다.', 'warn'); }}>
                    해제
                  </button>
                )
              }
            ]}
            rows={appliedGroups}
          />
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => toast('그룹 추가 기능은 준비 중입니다.')}>
              그룹추가
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{policy.name}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        {isEditing ? renderEdit() : renderView()}
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={closePanel}>닫기</button>
          {isEditing ? (
            <>
              <button className="btn btn-outline" onClick={() => setIsEditing(false)}>취소</button>
              <button className="btn btn-p" onClick={() => { toast('저장되었습니다.'); setIsEditing(false); }}>저장</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => setIsEditing(true)}>수정</button>
              <button className="btn btn-d" onClick={() => { toast('정책이 삭제되었습니다.', 'warn'); closePanel(); }}>삭제</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
