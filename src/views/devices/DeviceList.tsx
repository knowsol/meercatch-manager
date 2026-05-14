'use client'
import { useState, useMemo } from 'react';
import { usePanel } from '../../context/PanelContext';
import DataTable, { Column } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import DeviceDetailPanel from './DeviceDetailPanel';
import { useDevices, OS_TYPE_MAP } from '../../lib/api/hooks/useDevices';
import type { DeviceFilters, Device } from '@/types';

const PAGE_SIZE = 10;

export default function DeviceList() {
  const { openPanel } = usePanel();
  const [search, setSearch] = useState('');
  const [osType, setOsType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);

  const filters: DeviceFilters = {
    page: String(page + 1),
    size: String(PAGE_SIZE),
    ...(search && { searchKeyword: search }),
    ...(osType && { osType }),
    ...(status && { deviceStatus: status }),
  };

  const { data: devicesData, isLoading } = useDevices(filters);

  const totalCount = devicesData?.meta?.totalCount ?? 0;
  const totalPages = devicesData?.meta?.totalPage ?? 0;
  const devices = devicesData?.data ?? [];

  const cols: Column<Device & Record<string, unknown>>[] = useMemo(() => [
    { key: 'deviceUuid', label: '식별자', width: '35%', render: (v) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{v as string}</span> },
    { key: 'osType', label: 'OS', width: '12%', render: (v) => OS_TYPE_MAP[v as number] || '-' },
    { key: 'hardwareName', label: '모델', width: '18%', render: (v) => (v as string) || '-' },
    { key: 'deviceStatus', label: '상태', width: '10%', render: (v) => (v as number) === 1 ? <Badge cls="bdg-ok">활성</Badge> : <Badge cls="bdg-err">비활성</Badge> },
    { key: 'lastLoginAt', label: '최근 접속', width: '25%', render: (v) => fmtDT(v as string) },
  ], []);

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">단말기 관리</div>
          <div className="ph-sub">총 {totalCount}대 등록</div>
        </div>
      </div>

      <div className="fb">
        <input className="inp search" placeholder="UUID 검색..." type="text"
          value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        <select className="inp" style={{ maxWidth: 160 }} value={osType} onChange={e => { setOsType(e.target.value); setPage(0); }}>
          <option value="">전체 OS</option>
          <option value="1">Android</option>
          <option value="2">iOS</option>
          <option value="3">ChromeOS</option>
          <option value="4">WhaleOS</option>
          <option value="5">Windows</option>
        </select>
        <select className="inp" style={{ maxWidth: 120 }} value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}>
          <option value="">전체 상태</option>
          <option value="1">활성</option>
          <option value="0">비활성</option>
        </select>
      </div>

      <DataTable
        cols={cols}
        rows={devices as (Device & Record<string, unknown>)[]}
        loading={isLoading}
        rowKey="deviceUuid"
        onRowClick={(row) => openPanel(<DeviceDetailPanel device={row as Device} />)}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="등록된 단말기가 없습니다"
        emptyIcon="📱"
      />
    </div>
  );
}
