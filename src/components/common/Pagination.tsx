'use client';
import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 5,
}: PaginationProps) {
  const actualTotalPages = Math.max(totalPages, 1);

  // 현재 페이지 그룹 계산 (0-indexed)
  const currentGroup = Math.floor(currentPage / visiblePages);
  const totalGroups = Math.ceil(actualTotalPages / visiblePages);

  // 현재 그룹의 페이지 번호들 계산
  const pageNumbers = useMemo(() => {
    const startPage = currentGroup * visiblePages;
    const endPage = Math.min(startPage + visiblePages - 1, actualTotalPages - 1);
    
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentGroup, visiblePages, actualTotalPages]);

  // 이전 그룹으로 이동
  const handlePrevGroup = () => {
    if (currentGroup > 0) {
      const prevGroupLastPage = currentGroup * visiblePages - 1;
      onPageChange(prevGroupLastPage);
    }
  };

  // 다음 그룹으로 이동
  const handleNextGroup = () => {
    if (currentGroup < totalGroups - 1) {
      const nextGroupFirstPage = (currentGroup + 1) * visiblePages;
      onPageChange(nextGroupFirstPage);
    }
  };

  // 맨 처음으로
  const handleFirst = () => {
    onPageChange(0);
  };

  // 맨 끝으로
  const handleLast = () => {
    onPageChange(actualTotalPages - 1);
  };

  return (
    <div className="pagination">
      {/* 맨 처음 */}
      <button
        className="pagination-btn"
        onClick={handleFirst}
        disabled={currentPage === 0}
        aria-label="맨 처음"
        title="맨 처음"
      >
        <DoubleChevronLeftIcon />
      </button>

      {/* 이전 그룹 */}
      <button
        className="pagination-btn"
        onClick={handlePrevGroup}
        disabled={currentGroup === 0}
        aria-label="이전"
        title="이전"
      >
        <ChevronLeftIcon />
      </button>

      {/* 페이지 번호들 */}
      <div className="pagination-pages">
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`pagination-page${currentPage === page ? ' active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}
      </div>

      {/* 다음 그룹 */}
      <button
        className="pagination-btn"
        onClick={handleNextGroup}
        disabled={currentGroup >= totalGroups - 1}
        aria-label="다음"
        title="다음"
      >
        <ChevronRightIcon />
      </button>

      {/* 맨 끝 */}
      <button
        className="pagination-btn"
        onClick={handleLast}
        disabled={currentPage >= actualTotalPages - 1}
        aria-label="맨 끝"
        title="맨 끝"
      >
        <DoubleChevronRightIcon />
      </button>
    </div>
  );
}

function DoubleChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function DoubleChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  );
}
