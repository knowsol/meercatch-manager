import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge, DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { devices, detections, policies } from '../../data/dummy';

const TABS = ['기본정보', '적용정책', '탐지이력'];

export default function DeviceDetailPanel({ deviceId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [tab, setTab] = useState(0);

  const device = devices.find(d => d.deviceId === deviceId) || {};
  const deviceDetections = detections.filter(d => d.deviceName === device.name);
  const appliedPolicy = policies.find(p => p.active);

  const detCols = [
    { key: 'detectedAt', label: '탐지시각', render: r => fmtDT(r.detectedAt) },
    { key: 'type', label: '유형', render: r => <DetTypeBadge type={r.type} /> },
    { key: 'policy', label: '탐지정책' },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
  ];

  const renderBody = () => {
    if (tab === 0) return (
      <div>
        <dl className="info-row">
          <dt>단말명</dt><dd>{device.name || '—'}</dd>
          <dt>식별자</dt><dd>{device.identifier || '—'}</dd>
          <dt>소속그룹</dt><dd>{device.groupName || '—'}</dd>
          <dt>상태</dt><dd><StatusBadge status={device.status} /></dd>
          <dt>정책상태</dt><dd><StatusBadge status={device.policyStatus} /></dd>
          <dt>최근접속</dt><dd>{fmtDT(device.lastContact)}</dd>
        </dl>
        <div className="sep" />
        <div className="fb">
          <button className="btn btn-outline" onClick={() => toast('원격 잠금 명령 전송됨', 'success')}>원격잠금</button>
          <button className="btn btn-outline" onClick={() => toast('정책 재전송 완료', 'success')}>정책재전송</button>
        </div>
      </div>
    );
    if (tab === 1) return (
      <div>
        {appliedPolicy ? (
          <div className="card">
            <div className="card-hd"><span className="card-title">{appliedPolicy.name}</span></div>
            <dl className="info-row">
              <dt>설명</dt><dd>{appliedPolicy.desc}</dd>
              <dt>탐지 유형</dt><dd>{appliedPolicy.types.join(', ')}</dd>
              <dt>적용 그룹</dt><dd>{appliedPolicy.appliedCount}개 그룹</dd>
            </dl>
          </div>
        ) : (
          <div className="empty"><div className="empty-title">적용된 정책이 없습니다.</div></div>
        )}
      </div>
    );
    if (tab === 2) return <Table cols={detCols} rows={deviceDetections} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{device.name || '단말 상세'}</h2>
      </div>
      <div className="tabs mb-0">
        {TABS.map((t, i) => (
          <button key={t} className={`tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>
      <div className="mod-b">{renderBody()}</div>
      <div className="mod-f">
        <div className="mod-f-row">
          <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        </div>
      </div>
    </div>
  );
}
