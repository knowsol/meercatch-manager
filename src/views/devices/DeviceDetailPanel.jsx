'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { StatusBadge, DetTypeBadge, Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

function policyDetectSummary(policy) {
  if (!policy) return '—';
  if (policy.type === '선정성') {
    const items = policy.detectionItems || [];
    if (!items.length) return '—';
    return items.slice(0, 2).join(', ') + (items.length > 2 ? ' 외 ' + (items.length - 2) + '개' : '');
  }
  if (policy.type === '도박') return policy.grade ? '탐지등급 ' + policy.grade : '—';
  return '—';
}

export default function DeviceDetailPanel({ deviceId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [activeTab, setActiveTab] = useState('info');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [detType, setDetType] = useState('');

  const device = DUMMY.devices.find(d => d.deviceId === deviceId) || DUMMY.devices[0];
  const policy = DUMMY.policies.find(p => p.active);
  const allDets = DUMMY.detections.filter(d => d.deviceName === device.name);
  const filteredDets = allDets.filter(d => {
    if (fromDate && d.detectedAt < fromDate) return false;
    if (toDate && d.detectedAt > toDate + ' 23:59:59') return false;
    if (detType && d.type !== detType) return false;
    return true;
  });

  const tabs = [
    { id: 'info',    label: '기본정보' },
    { id: 'policy',  label: '적용정책' },
    { id: 'history', label: '탐지이력' },
  ];

  const histCols = [
    { key: 'detectedAt', label: '탐지 시각', render: v => fmtDT(v) },
    { key: 'type',       label: '유형',  render: v => <DetTypeBadge type={v} /> },
    { key: 'status',     label: '상태',  render: v => <StatusBadge status={v} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>{device.name}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.id} className={'tab' + (activeTab === t.id ? ' a' : '')}
              onClick={() => setActiveTab(t.id)}>{t.label}</div>
          ))}
        </div>

        {activeTab === 'info' && (
          <div style={{ marginTop: 16 }}>
            <dl className="info-row">
              <dt>단말명</dt>     <dd>{device.name}</dd>
              <dt>식별자</dt>     <dd><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{device.identifier}</span></dd>
              <dt>소속 그룹</dt>  <dd>{device.groupName || '미배정'}</dd>
              <dt>모델</dt>       <dd>{device.model || '—'}</dd>
              <dt>OS</dt>         <dd>{device.os || '—'}</dd>
              <dt>상태</dt>       <dd><StatusBadge status={device.status} /></dd>
              <dt>정책 상태</dt>  <dd><StatusBadge status={device.policyStatus} /></dd>
              <dt>최근 접속</dt>  <dd>{fmtDT(device.lastContact)}</dd>
            </dl>
            <div className="flex gap-8 mt-20">
              <button className="btn btn-warn btn-sm" onClick={() => toast('원격 잠금이 실행됩니다.', 'warn')}>🔒 원격 잠금</button>
              <button className="btn btn-outline btn-sm" onClick={() => toast('정책을 재전송합니다.', 'info')}>정책 재전송</button>
            </div>
          </div>
        )}

        {activeTab === 'policy' && (
          <div style={{ marginTop: 16 }}>
            {policy ? (
              <div className="card">
                <div className="card-title">{policy.name}</div>
                <div style={{ color: 'var(--t2)', fontSize: 13, marginTop: 4 }}>{policy.desc}</div>
                <div className="mt-16">
                  <div className="sub-label">탐지 설정</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <Badge cls={policy.type === '선정성' ? 'bdg-err' : 'bdg-warn'}>{policy.type}</Badge>
                    <span style={{ fontSize: 13, color: '#374151' }}>{policyDetectSummary(policy)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty"><div className="empty-title">적용된 정책 없음</div></div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>기간</span>
              <input className="inp" type="date" style={{ flex: 1 }} value={fromDate} onChange={e => setFromDate(e.target.value)} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>~</span>
              <input className="inp" type="date" style={{ flex: 1 }} value={toDate} onChange={e => setToDate(e.target.value)} />
              <select className="inp" style={{ maxWidth: 100 }} value={detType} onChange={e => setDetType(e.target.value)}>
                <option value="">전체 유형</option>
                <option value="선정성">선정성</option>
                <option value="도박">도박</option>
              </select>
            </div>
            <Table cols={histCols} rows={filteredDets} />
          </div>
        )}
      </div>
      <div className="mod-f">
        <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
        <div />
      </div>
    </div>
  );
}
