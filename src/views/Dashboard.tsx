'use client'
import { useRouter } from 'next/navigation';
import { usePanel } from '../context/PanelContext';
import { useAuth } from '../context/AuthContext';
import KPI from '../components/common/KPI';
import Table from '../components/common/Table';
import { DetTypeBadge } from '../components/common/Badge';
import { fmtDT } from '../components/common/helpers';
import { DUMMY } from '../data/dummy';
import { useLicenseSearch } from '../lib/api/hooks/useLicenses';
import { useDetectionSearch } from '../lib/api/hooks/useDetections';
import { EVENT_TYPE_MAP, DETECT_OS_TYPE_MAP } from '@/types';
import type { Detection } from '@/types';
import DetectionDetailPanel from './detections/DetectionDetailPanel';

export default function Dashboard() {
  const router = useRouter();
  const { openPanel } = usePanel();
  const { role } = useAuth();

  const { data: licenseData } = useLicenseSearch({ page: 0, size: 10 });
  const { data: detectionData } = useDetectionSearch({ page: 0, size: 5, eventType: '', osType: '', searchKeyword: '', startDate: '', endDate: '' });

  const totalLicenseCount = licenseData?.totalCount ?? 0;
  const usedLicenseCount = licenseData?.usedCount ?? 0;
  const licUsePct = totalLicenseCount > 0 ? Math.round((usedLicenseCount / totalLicenseCount) * 100) : 0;

  const recentDetections = detectionData?.data ?? [];
  const eventTypeCounts = detectionData?.eventTypeCounts ?? [];
  const totalDetections = detectionData?.meta?.totalCount ?? 0;
  const adultCount = eventTypeCounts.find(e => e.eventType === 0)?.totalCount ?? 0;
  const gamblingCount = eventTypeCounts.find(e => e.eventType === 1)?.totalCount ?? 0;

  const s = DUMMY.stats;
  const activePauses = DUMMY.pauses.filter(p => p.status === 'ACTIVE');
  const activeUsers = DUMMY.users.filter(u => u.status === 'active').length;

  const isDirect = role === 'direct';

  const detCols = [
    { key: 'eventTime', label: '탐지 시각', width: '25%', render: (v: string) => fmtDT(v) },
    { key: 'eventType', label: '유형', width: '15%', render: (v: number) => <DetTypeBadge type={EVENT_TYPE_MAP[v] || '기타'} /> },
    { key: 'deviceUuid', label: '단말', width: '30%', render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{v?.slice(0, 12)}...</span> },
    { key: 'osType', label: 'OS', width: '30%', render: (v: number) => DETECT_OS_TYPE_MAP[v] || `OS ${v}` },
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
        <KPI label="전체 라이선스" value={totalLicenseCount} sub="총 발급 수량" color="ac" />
        <KPI label="활성 라이선스" value={usedLicenseCount} sub="현재 사용 중" color="ok" />
        <KPI label="오늘 탐지" value={totalDetections} sub="전체 탐지 건수" color="err" />
        <KPI label="이번 주 탐지" value={adultCount + gamblingCount} sub={`선정성 ${adultCount} / 도박 ${gamblingCount}`} color="warn" />
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
          rows={recentDetections}
          onRowClick={(row: Detection) => openPanel(<DetectionDetailPanel detection={row} />)}
        />
      </div>

      {isDirect && (
        <div className="card mt-20">
          <div className="card-title">라이선스 현황</div>
          <dl className="info-row">
            <dt>라이선스 유형</dt> <dd>{licenseData?.data?.[0]?.detectType === '11' ? 'All-in-One' : licenseData?.data?.[0]?.detectType === '10' ? '선정성' : '도박'}</dd>
            <dt>OS 종류</dt>      <dd>{licenseData?.meta?.totalCount ?? 0}종</dd>
            <dt>단말 사용</dt>    <dd>{usedLicenseCount} / {totalLicenseCount}대 ({licUsePct}%)</dd>
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
              <dt>라이선스 유형</dt> <dd>{licenseData?.data?.[0]?.detectType === '11' ? 'All-in-One' : licenseData?.data?.[0]?.detectType === '10' ? '선정성' : '도박'}</dd>
              <dt>OS 종류</dt>      <dd>{licenseData?.meta?.totalCount ?? 0}종</dd>
              <dt>단말 사용</dt>    <dd>{usedLicenseCount} / {totalLicenseCount}대 ({licUsePct}%)</dd>
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
