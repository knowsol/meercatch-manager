'use client'
import { useRouter } from 'next/navigation';
import { usePanel } from '../context/PanelContext';
import { useAuth } from '../context/AuthContext';
import KPI from '../components/common/KPI';
import Table from '../components/common/Table';
import { StatusBadge, DetTypeBadge } from '../components/common/Badge';
import { fmtDT } from '../components/common/helpers';
import { DUMMY } from '../data/dummy';
import DetectionDetailPanel from './detections/DetectionDetailPanel';

export default function Dashboard() {
  const router = useRouter();
  const { openPanel } = usePanel();
  const { role } = useAuth();
  const s = DUMMY.stats;
  const recentDets = DUMMY.detections.slice(0, 5);
  const activePauses = DUMMY.pauses.filter(p => p.status === 'ACTIVE');
  const licUsePct = Math.round((DUMMY.licensesUsed / DUMMY.licensesTotal) * 100);
  const activeUsers = DUMMY.users.filter(u => u.status === 'active').length;

  const isDirect = role === 'direct';

  // 이번 주 탐지: 월요일 기준
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmtMD = d => `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
  const weekLabel = `${fmtMD(monday)} ~ ${fmtMD(sunday)}`;
  const weeklyCount = DUMMY.detections.filter(d => new Date(d.detectedAt) >= monday).length;

  const detCols = [
    { key: 'detectedAt', label: '탐지 시각', width: '160px', render: v => fmtDT(v) },
    { key: 'type',       label: '유형',       width: '80px',  render: v => <DetTypeBadge type={v} /> },
    { key: 'deviceName', label: '단말',       width: '100px' },
    { key: 'status',     label: '상태',       width: '80px',  render: v => <StatusBadge status={v} /> },
  ];

  const pauseCols = [
    { key: 'groupId',   label: '학교', render: v => {
      const grp = DUMMY.groups.find(g => g.groupId === v);
      const sch = grp ? DUMMY.schools.find(sc => sc.schoolId === grp.schoolId) : null;
      return sch ? sch.name : '—';
    }},
    { key: 'pauseType', label: '중단 유형', width: '80px' },
    { key: 'requester', label: '요청자',    width: '80px' },
    { key: 'endAt',     label: '종료 시각', render: v => fmtDT(v) },
  ];

  return (
    <div>
      {/* Row 1: 공통 */}
      <div className="grid-4 section-gap">
        <KPI label="전체 라이선스" value={DUMMY.licensesTotal} sub="총 발급 수량"       color="ac" />
        <KPI label="활성 라이선스" value={DUMMY.licensesUsed}  sub="현재 사용 중"       color="ok" />
        <KPI label="오늘 탐지"     value={s.todayDetections}   sub="금일 유해 콘텐츠"   color="err" />
        <KPI label="이번 주 탐지"  value={weeklyCount}  sub={weekLabel}  color="warn" />
      </div>

      {/* Row 2: 매니저관리 전용 */}
      {!isDirect && (
        <div className="grid-4 section-gap">
          <KPI label="전체 그룹"   value={s.totalGroups}   sub="등록된 학급" />
          <KPI label="활성 직원"   value={activeUsers}     sub="현재 활성 계정" color="ac" />
          <KPI label="등록 단말기" value={s.totalDevices}  sub={`온라인 ${s.onlineDevices}대`} color="ok" />
          <KPI label="활성 중단"   value={s.activePauses}  sub="현재 탐지 중단 중" color="warn" />
        </div>
      )}

      <div className="card section-gap">
        <div className="flex-between mb-16">
          <div className="card-title" style={{ marginBottom: 0 }}>최근 탐지 현황</div>
          <button className="btn btn-outline btn-sm" onClick={() => router.push('/detections')}>전체 보기</button>
        </div>
        <Table
          cols={detCols}
          rows={recentDets}
          onRowClick={row => openPanel(<DetectionDetailPanel detId={row.detId} />)}
        />
      </div>

      {isDirect && (
        <div className="card mt-20">
          <div className="card-title">라이선스 현황</div>
          <dl className="info-row">
            <dt>라이선스 유형</dt> <dd>{DUMMY.licenses[0].type}</dd>
            <dt>OS 종류</dt>      <dd>{DUMMY.licenses.length}종</dd>
            <dt>단말 사용</dt>    <dd>{DUMMY.licensesUsed} / {DUMMY.licensesTotal}대 ({licUsePct}%)</dd>
          </dl>
          <div className="mt-16">
            <div className="progress-bar">
              <div
                className={`progress-fill ${licUsePct > 90 ? 'err' : licUsePct > 70 ? 'warn' : 'ok'}`}
                style={{ width: licUsePct + '%' }}
              />
            </div>
          </div>
        </div>
      )}

      {!isDirect && (
        <div className="grid-2 mt-20">
          <div className="card">
            <div className="flex-between mb-16">
              <div className="card-title" style={{ marginBottom: 0 }}>활성 탐지 중단</div>
              <button className="btn btn-outline btn-sm" onClick={() => router.push('/pauses')}>전체 보기</button>
            </div>
            {activePauses.length > 0
              ? <Table cols={pauseCols} rows={activePauses} onRowClick={() => router.push('/pauses')} />
              : <div className="empty">
                  <div className="empty-icon">—</div>
                  <div className="empty-title">현재 탐지 중단이 없습니다</div>
                </div>
            }
          </div>

          <div className="card">
            <div className="card-title">라이선스 현황</div>
            <dl className="info-row">
              <dt>라이선스 유형</dt> <dd>{DUMMY.licenses[0].type}</dd>
              <dt>OS 종류</dt>      <dd>{DUMMY.licenses.length}종</dd>
              <dt>단말 사용</dt>    <dd>{DUMMY.licensesUsed} / {DUMMY.licensesTotal}대 ({licUsePct}%)</dd>
            </dl>
            <div className="mt-16">
              <div className="progress-bar">
                <div
                  className={`progress-fill ${licUsePct > 90 ? 'err' : licUsePct > 70 ? 'warn' : 'ok'}`}
                  style={{ width: licUsePct + '%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
