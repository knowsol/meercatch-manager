'use client';
import { useState, useMemo } from 'react';
import { usePanel } from '../../context/PanelContext';
import KPI from '../../components/common/KPI';
import DataTable, { Column } from '../../components/common/DataTable';
import { StatusBadge, Badge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { useAccountSearch } from '../../lib/api/hooks/useAccounts';
import type { Account, AccountRole, AccountSearchRequest } from '@/types';
import UserNewPanel from './UserNewPanel';
import UserDetailPanel from './UserDetailPanel';

const ROLE_LABEL: Record<AccountRole, string> = {
  SUPER_ADMIN: '슈퍼관리자',
  ADMIN: '관리자',
  MANAGER: '매니저',
  USER: '사용자',
};

const ROLE_CLS: Record<AccountRole, string> = {
  SUPER_ADMIN: 'bdg-err',
  ADMIN: 'bdg-ac',
  MANAGER: 'bdg-ok',
  USER: 'bdg-muted',
};

const PAGE_SIZE = 10;

export default function UserList() {
  const { openPanel } = usePanel();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<AccountRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<'Y' | 'N' | ''>('');
  const [page, setPage] = useState(0);

  const searchParams: AccountSearchRequest = useMemo(() => ({
    page,
    size: PAGE_SIZE,
    keyword: search || undefined,
    role: roleFilter || undefined,
    activeYn: statusFilter || undefined,
  }), [page, search, roleFilter, statusFilter]);

  const { data, isLoading } = useAccountSearch(searchParams);

  const accounts = data?.data ?? [];
  const meta = data?.meta;
  const totalCount = meta?.totalCount ?? 0;
  const totalPages = meta?.totalPage ?? 0;

  const roleCount = accounts.reduce((acc, a) => {
    acc[a.role] = (acc[a.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleOpenDetail = (account: Account) => {
    openPanel(<UserDetailPanel account={account} />);
  };

  const cols: Column<Account & Record<string, unknown>>[] = useMemo(() => [
    {
      key: 'name',
      label: '이름',
      render: (v, row) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenDetail(row as Account);
          }}
        >
          {v as string}
        </a>
      ),
    },
    {
      key: 'username',
      label: '아이디',
      render: (v) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v as string}</span>
      ),
    },
    {
      key: 'role',
      label: '역할',
      render: (v) => {
        const role = v as AccountRole;
        return <Badge cls={ROLE_CLS[role] || 'bdg-muted'}>{ROLE_LABEL[role] || role}</Badge>;
      },
    },
    {
      key: 'email',
      label: '이메일',
    },
    {
      key: 'phoneNo',
      label: '연락처',
    },
    {
      key: 'activeYn',
      label: '상태',
      render: (v) => <StatusBadge status={v === 'Y' ? 'active' : 'inactive'} />,
    },
    {
      key: 'lastLoginAt',
      label: '최근로그인',
      render: (v) => fmtDT(v as string),
    },
  ], []);

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
          <div className="ph-title">직원 관리</div>
          <div className="ph-sub">총 {totalCount}명</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p" onClick={() => openPanel(<UserNewPanel />)}>
            + 직원 등록
          </button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 16 }}>
        <KPI label="전체 직원" value={totalCount} />
        <KPI label="슈퍼관리자" value={roleCount['SUPER_ADMIN'] || 0} color="err" />
        <KPI label="관리자" value={roleCount['ADMIN'] || 0} color="ac" />
        <KPI label="매니저" value={roleCount['MANAGER'] || 0} color="ok" />
      </div>

      <div className="fb">
        <input
          className="inp search"
          placeholder="이름 또는 아이디 검색..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="inp"
          style={{ maxWidth: 140 }}
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as AccountRole | '');
            setPage(0);
          }}
        >
          <option value="">전체 역할</option>
          <option value="SUPER_ADMIN">슈퍼관리자</option>
          <option value="ADMIN">관리자</option>
          <option value="MANAGER">매니저</option>
          <option value="USER">사용자</option>
        </select>
        <select
          className="inp"
          style={{ maxWidth: 120 }}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'Y' | 'N' | '');
            setPage(0);
          }}
        >
          <option value="">전체 상태</option>
          <option value="Y">활성</option>
          <option value="N">비활성</option>
        </select>
        <button className="btn btn-outline" onClick={handleSearch}>
          검색
        </button>
      </div>

      <DataTable
        cols={cols}
        rows={accounts as (Account & Record<string, unknown>)[]}
        loading={isLoading}
        rowKey="accountId"
        onRowClick={(row) => handleOpenDetail(row as Account)}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="등록된 직원이 없습니다"
        emptyIcon="👤"
      />
    </div>
  );
}
