'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import DataTable, { Column } from '../../components/common/DataTable';
import { DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { useDetectionSearch } from '../../lib/api/hooks/useDetections';
import { EVENT_TYPE_MAP, DETECT_OS_TYPE_MAP, truncateUrl } from '@/types';
import type { Detection, DetectionSearchParams } from '@/types';
import DetectionDetailPanel from './DetectionDetailPanel';

const PAGE_SIZE = 10;

export default function DetectionList() {
  const { openPanel } = usePanel();

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [osFilter, setOsFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  const statsCache = useRef<{ total: number; adult: number; gambling: number } | null>(null);
  const isInitialized = useRef(false);

  const searchParams: DetectionSearchParams = useMemo(() => ({
    eventType: activeTab === 'all' ? '' : activeTab === '선정성' ? '0' : '1',
    osType: osFilter,
    searchKeyword: search,
    startDate: startDate,
    endDate: endDate,
    page,
    size: PAGE_SIZE,
  }), [activeTab, osFilter, search, startDate, endDate, page]);

  const { data, isLoading } = useDetectionSearch(searchParams);

  const detections = data?.data ?? [];
  const meta = data?.meta;
  const eventTypeCounts = data?.eventTypeCounts ?? [];
  const totalCount = meta?.totalCount ?? 0;
  const totalPages = meta?.totalPage ?? 0;

  const adultCount = eventTypeCounts.find(e => e.eventType === 0)?.totalCount ?? 0;
  const gamblingCount = eventTypeCounts.find(e => e.eventType === 1)?.totalCount ?? 0;

  useEffect(() => {
    if (!isInitialized.current && eventTypeCounts.length > 0) {
      statsCache.current = { total: totalCount, adult: adultCount, gambling: gamblingCount };
      isInitialized.current = true;
    }
  }, [eventTypeCounts, totalCount, adultCount, gamblingCount]);

  const stats = statsCache.current ?? { total: totalCount, adult: adultCount, gambling: gamblingCount };

  const TABS = useMemo(() => [
    { id: 'all', label: `전체 (${stats.total})` },
    { id: '선정성', label: `선정성 (${stats.adult})` },
    { id: '도박', label: `도박 (${stats.gambling})` },
  ], [stats.total, stats.adult, stats.gambling]);

  const cols: Column<Detection & Record<string, unknown>>[] = useMemo(() => [
    {
      key: 'eventTime',
      label: '탐지 시각',
      width: '15%',
      render: (v) => fmtDT(v as string),
    },
    {
      key: 'eventType',
      label: '유형',
      width: '10%',
      render: (v) => <DetTypeBadge type={EVENT_TYPE_MAP[v as number] || '기타'} />,
    },
    {
      key: 'deviceUuid',
      label: '단말 UUID',
      width: '20%',
      render: (v) => (
        <span
          style={{ fontFamily: 'monospace', fontSize: 12 }}
          title={v as string}
        >
          {(v as string)?.slice(0, 16)}...
        </span>
      ),
    },
    {
      key: 'osType',
      label: 'OS',
      width: '10%',
      render: (v) => DETECT_OS_TYPE_MAP[v as number] || `OS ${v}`,
    },
    {
      key: 'eventUrl',
      label: 'URL/도메인',
      width: '45%',
      render: (v) =>
        v ? (
          <span
            style={{ color: 'var(--t2)', fontSize: 12 }}
            title={v as string}
          >
            {truncateUrl(v as string, 50)}
          </span>
        ) : (
          <span style={{ color: 'var(--t3)' }}>—</span>
        ),
    },
  ], []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(0);
  };

  const handleSearch = () => {
    setPage(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">탐지 현황</div>
          <div className="ph-sub">총 {totalCount}건</div>
        </div>
      </div>

      <div className="grid-3 section-gap">
        <KPI label="전체 탐지" value={stats.total} />
        <KPI label="선정성" value={stats.adult} color="err" />
        <KPI label="도박" value={stats.gambling} color="warn" />
      </div>

      <div className="tabs" style={{ margin: '16px 0' }}>
        {TABS.map((t) => (
          <div
            key={t.id}
            className={`tab${activeTab === t.id ? ' a' : ''}`}
            onClick={() => handleTabChange(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div className="fb">
        <input
          className="inp search"
          placeholder="URL 검색..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="inp"
          style={{ maxWidth: 140 }}
          value={osFilter}
          onChange={(e) => {
            setOsFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">전체 OS</option>
          {Object.entries(DETECT_OS_TYPE_MAP).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <input
          className="inp"
          type="date"
          style={{ maxWidth: 160 }}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(0);
          }}
        />
        <span style={{ color: 'var(--t3)', fontSize: 12 }}>~</span>
        <input
          className="inp"
          type="date"
          style={{ maxWidth: 160 }}
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(0);
          }}
        />
        <button className="btn btn-outline" onClick={handleSearch}>
          검색
        </button>
      </div>

      <DataTable
        cols={cols}
        rows={detections as (Detection & Record<string, unknown>)[]}
        loading={isLoading}
        rowKey="deviceUuid"
        onRowClick={(row) => openPanel(<DetectionDetailPanel detection={row as Detection} />)}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="탐지 내역이 없습니다"
        emptyIcon="🔍"
      />
    </div>
  );
}
