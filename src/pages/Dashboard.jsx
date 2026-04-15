import { usePanel } from '../context/PanelContext';
import { useToastCtx } from '../components/layout/Layout';
import KPI from '../components/common/KPI';
import Table from '../components/common/Table';
import { StatusBadge, DetTypeBadge } from '../components/common/Badge';
import { fmtD, fmtDT } from '../components/common/helpers';
import { stats, detections, pauses, licenses } from '../data/dummy';
import DetectionDetailPanel from './detections/DetectionDetailPanel';

export default function Dashboard() {
  const { openPanel } = usePanel();
  const toast = useToastCtx();

  const last5 = detections.slice(0, 5);
  const activePauses = pauses.filter(p => p.status === 'ACTIVE');

  const detCols = [
    { key: 'detectedAt', label: '탐지시각', render: r => fmtDT(r.detectedAt) },
    { key: 'type', label: '유형', render: r => <DetTypeBadge type={r.type} /> },
    { key: 'groupName', label: '그룹' },
    { key: 'deviceName', label: '단말' },
    { key: 'status', label: '상태', render: r => <StatusBadge status={r.status} /> },
  ];

  const pauseCols = [
    { key: 'groupName', label: '그룹' },
    { key: 'pauseType', label: '중단 유형' },
    { key: 'startAt', label: '시작', render: r => fmtDT(r.startAt) },
    { key: 'endAt', label: '종료', render: r => fmtDT(r.endAt) },
  ];

  const usePct = Math.round((licenses.usedDevices / licenses.devices) * 100);

  return (
    <div>
      <div className="ph">
        <h1 className="ph-title">대시보드</h1>
      </div>

      <div className="grid-4 mb-24">
        <KPI label="전체 그룹" value={stats.totalGroups} />
        <KPI label="등록 단말" value={stats.totalDevices} sub="온라인 11대" color="ok" />
        <KPI label="오늘 탐지" value={stats.todayDetections} color="err" />
        <KPI label="활성 중단" value={stats.activeDetections} sub="현재 탐지 중단 중" color="warn" />
      </div>

      <div className="grid-4 mb-24">
        <KPI label="이번 주 탐지" value={stats.weeklyDetections} />
        <KPI label="확인된 탐지" value={stats.confirmedDetections} sub="총 누적 확인" color="ac" />
        <KPI label="적용 정책" value={stats.totalPolicies} sub="활성 정책 수" />
        <div />
      </div>

      <div className="card mb-24">
        <div className="card-hd"><span className="card-title">최근 탐지 현황</span></div>
        <Table
          cols={detCols}
          rows={last5}
          onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
        />
      </div>

      <div className="card mb-24">
        <div className="card-hd"><span className="card-title">활성 탐지 중단</span></div>
        <Table cols={pauseCols} rows={activePauses} />
      </div>

      <div className="card mb-24">
        <div className="card-hd"><span className="card-title">라이선스 현황</span></div>
        <dl className="info-row">
          <dt>학교명</dt><dd>{licenses.school}</dd>
          <dt>유형</dt><dd>{licenses.type}</dd>
          <dt>단말 사용</dt><dd>{licenses.usedDevices} / {licenses.devices}대 ({usePct}%)</dd>
          <dt>유효기간</dt><dd>{fmtD(licenses.validFrom)} ~ {fmtD(licenses.validTo)}</dd>
        </dl>
      </div>
    </div>
  );
}
