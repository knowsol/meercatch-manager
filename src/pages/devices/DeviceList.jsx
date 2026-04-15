import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import Table from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';
import DeviceDetailPanel from './DeviceDetailPanel';

export default function DeviceList() {
  const { openPanel } = usePanel();
  const toast = useToastCtx();
  const [search, setSearch] = useState('');
  const [groupId, setGroupId] = useState('');
  const [status, setStatus] = useState('');

  const active = DUMMY.devices.filter(d => d.status === 'online').length;

  const filtered = DUMMY.devices.filter(d => {
    const q = search.toLowerCase();
    if (q && !d.name.toLowerCase().includes(q) && !d.identifier.toLowerCase().includes(q)) return false;
    if (groupId && d.groupId !== groupId) return false;
    if (status && d.status !== status) return false;
    return true;
  });

  const cols = [
    { key: 'name',        label: '단말 이름', render: (v, r) => (
      <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); openPanel(<DeviceDetailPanel deviceId={r.deviceId} />); }}>{v}</a>
    )},
    { key: 'identifier',  label: '식별자', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{v}</span> },
    { key: 'os',          label: 'OS',     width: '110px' },
    { key: 'model',       label: '모델',   width: '120px' },
    { key: 'status',      label: '상태',   width: '90px', render: v => v === 'online' ? <Badge cls="bdg-ok">활성</Badge> : <Badge cls="bdg-err">비활성</Badge> },
    { key: 'lastContact', label: '최근 접속', render: v => fmtDT(v) },
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">단말기 관리</div>
          <div className="ph-sub">총 {DUMMY.devices.length}대 등록</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => toast('단말기 등록 기능은 MDM에서 처리됩니다.', 'info')}>+ 단말기 등록</button>
        </div>
      </div>

      <div className="section-gap">
        <div className="kpi" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
            <div>
              <div className="kpi-l">전체 라이선스</div>
              <div className="kpi-v">{DUMMY.licensesTotal}</div>
            </div>
            <div style={{ width: 1, background: 'var(--bd)', alignSelf: 'stretch', flexShrink: 0 }} />
            <div>
              <div className="kpi-l">활성 단말</div>
              <div className="kpi-v ok">{active}</div>
            </div>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="kpi-s">라이선스 한도 · 현재 접속 중</div>
            <button className="btn btn-outline btn-sm" style={{ padding: '2px 10px', fontSize: 11, height: 'auto', lineHeight: 1.6 }}
              onClick={() => toast('라이선스 현황 확인', 'info')}>현황 보기</button>
          </div>
        </div>
      </div>

      <div className="fb">
        <input className="inp search" placeholder="단말 이름 또는 식별자 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 160 }} value={groupId} onChange={e => setGroupId(e.target.value)}>
          <option value="">전체 그룹</option>
          {DUMMY.groups.map(g => <option key={g.groupId} value={g.groupId}>{g.name}</option>)}
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="online">활성</option>
          <option value="offline">비활성</option>
        </select>
      </div>

      <Table cols={cols} rows={filtered} onRowClick={row => openPanel(<DeviceDetailPanel deviceId={row.deviceId} />)} />
    </div>
  );
}
