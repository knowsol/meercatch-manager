'use client';
import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  width?: string | number;
  render?: (value: unknown, row: T) => ReactNode;
}

interface TableProps<T extends Record<string, unknown>> {
  cols: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
}

export default function Table<T extends Record<string, unknown>>({ cols, rows, onRowClick }: TableProps<T>) {
  if (!rows || rows.length === 0) {
    return (
      <div className="dt-wrap">
        <div className="empty">
          <div className="empty-icon">📭</div>
          <div className="empty-title">데이터가 없습니다</div>
        </div>
      </div>
    );
  }
  return (
    <div className="dt-wrap">
      <table className="dt">
        <thead>
          <tr>
            {cols.map(c => <th key={c.key} style={c.width ? { width: c.width } : {}}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr 
              key={(row.id as string) || i} 
              className={onRowClick ? 'clickable' : ''} 
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {cols.map(c => {
                const val = c.render ? c.render(row[c.key], row) : (row[c.key] != null ? String(row[c.key]) : '—');
                return <td key={c.key}>{val}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
