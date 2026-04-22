'use client'
import { useState } from 'react';
import Pagination from '../../components/common/Pagination';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import PauseNewPanel from './PauseNewPanel';

function PauseDetailPanel({ pauseId, onClose, onRelease }) {
  const p = DUMMY.pauses.find(x => x.pauseId === pauseId);
  if (!p) return null;

  const grp = DUMMY.groups.find(g => g.groupId === p.groupId);
  const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;

  const roleMap = { admin: '관리자', staff: '운영자', teacher: '교사' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={onClose}>✕</button>
        <h2>탐지 중단 상세</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <dl className="info-row">
          <dt>학교</dt><dd>{sch ? sch.name : '—'}</dd>
          <dt>중단유형</dt><dd>{p.pauseType}</dd>
          <dt>요청자</dt><dd>{p.requester}</dd>
          <dt>요청자역할</dt><dd>{roleMap[p.requesterRole] || p.requesterRole}</dd>
          <dt>시작</dt><dd>{fmtDT(p.startAt)}</dd>
          <dt>종료</dt><dd>{fmtDT(p.endAt)}</dd>
          <dt>상태</dt>
          <dd>
            {p.status === 'ACTIVE' && <Badge cls="bdg-warn">진행중</Badge>}
            {p.status === 'EXPIRED' && <Badge cls="bdg-muted">만료</Badge>}
            {p.status === 'CANCELLED' && <Badge cls="bdg-muted">취소</Badge>}
          </dd>
          <dt>사유</dt><dd>{p.reason}</dd>
          <dt>취소사유</dt><dd>{p.cancelReason || '—'}</dd>
        </dl>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={onClose}>닫기</button>
          {p.status === 'ACTIVE' && (
            <button className="btn btn-warn" onClick={() => onRelease(pauseId)}>중단 해제</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PauseList() {
  const { openPanel, closePanel } = usePanel();
  const toast = useToastCtx();
  const [pauses, setPauses] = useState(DUMMY.pauses);
  const [page, setPage] = useState(1);

  const active = pauses.filter(p => p.status === 'ACTIVE').length;
  const expired = pauses.filter(p => p.status === 'EXPIRED').length;
  const cancelled = pauses.filter(p => p.status === 'CANCELLED').length;

  const handleRelease = (pauseId) => {
    if (window.confirm('탐지 중단을 해제하시겠습니까?')) {
      setPauses(prev => prev.map(p => p.pauseId === pauseId
        ? { ...p, status: 'CANCELLED', cancelReason: '관리자 수동 취소' }
        : p
      ));
      toast('탐지 중단이 해제되었습니다.', 'warn');
      closePanel();
    }
  };

  const cols = [
    {
      key: 'groupId', label: '학교', render: v => {
        const grp = DUMMY.groups.find(g => g.groupId === v);
        const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
        return sch ? sch.name : '—';
      }
    },
    { key: 'pauseType', label: '중단유형' },
    { key: 'requester', label: '요청자' },
    { key: 'startAt', label: '시작시각', render: v => fmtDT(v) },
    { key: 'endAt', label: '종료시각', render: v => fmtDT(v) },
    { key: 'reason', label: '사유' },
    {
      key: 'status', label: '상태', width: 90, render: v => {
        if (v === 'ACTIVE') return <Badge cls="bdg-warn">진행중</Badge>;
        if (v === 'EXPIRED') return <Badge cls="bdg-muted">만료</Badge>;
        return <Badge cls="bdg-muted">취소</Badge>;
      }
    },
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">탐지 중단 현황</div>
          <div className="ph-sub">총 {pauses.length}건</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<PauseNewPanel />)}>+ 중단 설정</button>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        <KPI label="진행중" value={active} color="warn" />
        <KPI label="만료" value={expired} />
        <KPI label="취소" value={cancelled} />
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {pauses.length}건</div>
      <Table
        cols={cols}
        rows={pauses.slice((page - 1) * 15, page * 15)}
        onRowClick={row => openPanel(
          <PauseDetailPanel
            pauseId={row.pauseId}
            onClose={closePanel}
            onRelease={handleRelease}
          />
        )}
      />
      <Pagination page={page} total={pauses.length} pageSize={15} onChange={setPage} />
    </div>
  );

}
