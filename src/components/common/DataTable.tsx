'use client';
import { ReactNode } from 'react';
import Pagination from './Pagination';

// ============================================
// Column 타입
// ============================================
export interface Column<T> {
  key: string;
  label: string;
  width?: string | number;
  render?: (value: unknown, row: T) => ReactNode;
}

// ============================================
// Props
// ============================================
interface DataTableProps<T extends Record<string, unknown>> {
  cols: Column<T>[];
  rows: T[];
  /** 로딩 상태 */
  loading?: boolean;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: T) => void;
  /** 고유 키로 사용할 필드명 (기본: 'id') */
  rowKey?: string;
  /** 페이지네이션 (없으면 표시 안함) */
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  /** 빈 데이터 메시지 */
  emptyMessage?: string;
  /** 빈 데이터 아이콘 */
  emptyIcon?: string;
}

// ============================================
// Loading Skeleton
// ============================================
function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <div className="dt-wrap">
      <table className="dt">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <div className="skeleton" style={{ height: 14, width: '60%' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx}>
                  <div
                    className="skeleton"
                    style={{ height: 14, width: colIdx === 0 ? '70%' : '50%' }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// Empty State
// ============================================
function EmptyState({ icon = '📭', message = '데이터가 없습니다' }: { icon?: string; message?: string }) {
  return (
    <div className="dt-wrap">
      <div className="empty">
        <div className="empty-icon">{icon}</div>
        <div className="empty-title">{message}</div>
      </div>
    </div>
  );
}

// ============================================
// DataTable Component
// ============================================
export default function DataTable<T extends Record<string, unknown>>({
  cols,
  rows,
  loading = false,
  onRowClick,
  rowKey = 'id',
  pagination,
  emptyMessage = '데이터가 없습니다',
  emptyIcon = '📭',
}: DataTableProps<T>) {
  // 로딩 중
  if (loading) {
    return (
      <>
        <TableSkeleton cols={cols.length} />
        {pagination && pagination.totalPages > 1 && (
          <div className="pagination" style={{ opacity: 0.5, pointerEvents: 'none' }}>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={() => {}}
            />
          </div>
        )}
      </>
    );
  }

  // 빈 데이터
  if (!rows || rows.length === 0) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} />;
  }

  return (
    <>
      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.key} style={c.width ? { width: c.width } : {}}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const key = (row[rowKey] as string | number) ?? i;
              return (
                <tr
                  key={key}
                  className={onRowClick ? 'clickable' : ''}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {cols.map((c) => {
                    const val = c.render
                      ? c.render(row[c.key], row)
                      : row[c.key] != null
                      ? String(row[c.key])
                      : '—';
                    return <td key={c.key}>{val}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={Math.max(pagination.totalPages, 1)}
          onPageChange={pagination.onPageChange}
        />
      )}
    </>
  );
}
