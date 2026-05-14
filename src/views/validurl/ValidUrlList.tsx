'use client';
import { useState, useMemo, ReactNode, useCallback } from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import { fmtDT } from '../../components/common/helpers';
import { useKwsSha256, useKwsUrls, useDeleteKwsUrl, KwsSha256Item, KwsUrlItem } from '../../lib/api/hooks/useValidUrl';
import { useToastCtx } from '../../components/layout/Layout';
import { getPublicKwsBaseUrl } from '@/lib/kwsServer';

const EVENT_TYPE_LABELS: Record<number, string> = {
  0: '선정성',
  1: '도박',
};

const STATUS_LABELS: Record<string, string> = {
  I: '활성',
  A: '비활성',
};

const DB_TYPE_LABELS: Record<string, string> = {
  A: '전체',
  P: '부분',
};

interface TextModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

function TextModal({ title, content, onClose }: TextModalProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg1)',
          borderRadius: 12,
          padding: 24,
          maxWidth: 600,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--t1)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: 'var(--t3)',
              padding: '4px 8px',
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          background: 'var(--bg3)',
          borderRadius: 8,
          padding: 16,
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 1.6,
          wordBreak: 'break-all',
          color: 'var(--t1)',
          border: '1px solid var(--bd)',
        }}>
          {content}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          <button
            className="btn btn-outline"
            onClick={handleCopy}
          >
            복사
          </button>
          <button
            className="btn btn-primary"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

interface ClickableTextProps {
  text: string;
  displayText?: string;
  modalTitle: string;
  style?: React.CSSProperties;
}

function ClickableText({ text, displayText, modalTitle, style }: ClickableTextProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <span
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textUnderlineOffset: 3,
          ...style,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        title="클릭하여 전체 보기"
      >
        {displayText || text}
      </span>
      {showModal && (
        <TextModal
          title={modalTitle}
          content={text}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default function ValidUrlList() {
  const toast = useToastCtx();
  const [activeTab, setActiveTab] = useState<'sha256' | 'text'>('text');
  const [limit, setLimit] = useState(100);
  const [limitInput, setLimitInput] = useState('100');
  const [eventType, setEventType] = useState<number | undefined>(undefined);

  const { data: sha256Data, isLoading: sha256Loading, refetch: refetchSha256 } = useKwsSha256({ limit });
  const { data: urlData, isLoading: urlLoading, refetch: refetchUrls } = useKwsUrls({ limit, eventType });
  const deleteUrlMutation = useDeleteKwsUrl();

  const handleDeleteUrl = useCallback(
    async (row: KwsUrlItem) => {
      if (!window.confirm(`이 URL을 삭제할까요?\n\n${row.url}`)) return;
      try {
        await deleteUrlMutation.mutateAsync(row.id);
        toast('삭제되었습니다.', 'ok');
      } catch (err) {
        toast(err instanceof Error ? err.message : '삭제에 실패했습니다.', 'err');
      }
    },
    [deleteUrlMutation, toast],
  );

  const sha256List = sha256Data?.data ?? [];
  const urlList = urlData?.data ?? [];
  const sha256Count = sha256Data?.count ?? 0;
  const urlCount = urlData?.count ?? 0;

  const sha256Cols: Column<KwsSha256Item & Record<string, unknown>>[] = useMemo(() => [
    {
      key: 'id',
      label: 'ID',
      width: '5%',
    },
    {
      key: 'hash_code',
      label: 'Hash Code',
      width: '25%',
      render: (v) => {
        const hashCode = v as string;
        return (
          <ClickableText
            text={hashCode}
            displayText={`${hashCode?.slice(0, 24)}...`}
            modalTitle="Hash Code"
            style={{ fontFamily: 'monospace', fontSize: 11 }}
          />
        );
      },
    },
    {
      key: 'protocol',
      label: 'Protocol',
      width: '8%',
      render: (v) => (
        <span style={{
          background: v === 'https' ? '#dcfce7' : '#fef3c7',
          color: v === 'https' ? '#166534' : '#92400e',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 500,
        }}>
          {(v as string)?.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'port',
      label: 'Port',
      width: '6%',
    },
    {
      key: 'file_path',
      label: 'Path',
      width: '10%',
      render: (v) => (
        <span style={{ color: 'var(--t2)', fontSize: 12 }}>
          {v as string || '/'}
        </span>
      ),
    },
    {
      key: 'status',
      label: '상태',
      width: '7%',
      render: (v): ReactNode => (
        <span style={{
          background: v === 'I' ? '#dbeafe' : '#fee2e2',
          color: v === 'I' ? '#1d4ed8' : '#dc2626',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 500,
        }}>
          {STATUS_LABELS[v as string] || String(v)}
        </span>
      ),
    },
    {
      key: 'db_type',
      label: 'DB Type',
      width: '7%',
      render: (v): ReactNode => DB_TYPE_LABELS[v as string] || String(v),
    },
    {
      key: 'harmful_rating',
      label: '유해등급',
      width: '8%',
      render: (v) => {
        const rating = v as number;
        const color = rating > 0 ? '#dc2626' : '#6b7280';
        return <span style={{ color, fontWeight: rating > 0 ? 600 : 400 }}>{rating}</span>;
      },
    },
    {
      key: 'created_at',
      label: '등록일',
      width: '14%',
      render: (v) => fmtDT(v as string),
    },
  ], []);

  const urlCols: Column<KwsUrlItem & Record<string, unknown>>[] = useMemo(() => [
    {
      key: 'id',
      label: 'ID',
      width: '7%',
    },
    {
      key: 'url',
      label: 'URL',
      width: '45%',
      render: (v) => {
        const url = v as string;
        return (
          <ClickableText
            text={url}
            modalTitle="URL"
            style={{ color: 'var(--ac)', fontSize: 13 }}
          />
        );
      },
    },
    {
      key: 'event_type',
      label: '유형',
      width: '12%',
      render: (v) => {
        const type = v as number;
        const label = EVENT_TYPE_LABELS[type] || `유형 ${type}`;
        const isAdult = type === 0;
        return (
          <span style={{
            background: isAdult ? '#fee2e2' : '#fef3c7',
            color: isAdult ? '#dc2626' : '#92400e',
            padding: '3px 10px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
          }}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'created_at',
      label: '등록일',
      width: '18%',
      render: (v) => fmtDT(v as string),
    },
    {
      key: '_delete',
      label: '삭제',
      width: '10%',
      render: (_v, row) => {
        const r = row as KwsUrlItem;
        const pending =
          deleteUrlMutation.isPending && deleteUrlMutation.variables === r.id;
        return (
          <button
            type="button"
            className="btn btn-outline"
            style={{
              padding: '4px 10px',
              fontSize: 12,
              color: '#b91c1c',
              borderColor: '#fecaca',
            }}
            disabled={deleteUrlMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              void handleDeleteUrl(r);
            }}
          >
            {pending ? '삭제 중…' : '삭제'}
          </button>
        );
      },
    },
  ], [deleteUrlMutation.isPending, deleteUrlMutation.variables, handleDeleteUrl]);

  const handleSearch = () => {
    if (activeTab === 'sha256') {
      refetchSha256();
    } else {
      refetchUrls();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const kwsBase = getPublicKwsBaseUrl();

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">유효 URL 관리</div>
          <div className="ph-sub">KWS 데이터베이스 조회</div>
        </div>
      </div>

      <div className="tabs" style={{ margin: '16px 0' }}>
        <div
          className={`tab${activeTab === 'text' ? ' a' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          URL 목록 (Text) ({urlCount})
        </div>
        <div
          className={`tab${activeTab === 'sha256' ? ' a' : ''}`}
          onClick={() => setActiveTab('sha256')}
        >
          SHA256 목록 ({sha256Count})
        </div>
      </div>

      <div className="fb" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, color: 'var(--t2)', whiteSpace: 'nowrap' }}>Limit:</label>
          <input
            className="inp"
            type="text"
            inputMode="numeric"
            style={{ width: 100 }}
            value={limitInput}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || /^\d+$/.test(val)) {
                setLimitInput(val);
              }
            }}
            onBlur={() => {
              const num = parseInt(limitInput, 10);
              if (!isNaN(num) && num >= 1) {
                setLimit(Math.min(num, 1000));
                setLimitInput(String(Math.min(num, 1000)));
              } else {
                setLimitInput(String(limit));
              }
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {activeTab === 'text' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, color: 'var(--t2)', whiteSpace: 'nowrap' }}>Event Type:</label>
            <select
              className="inp"
              style={{ width: 140 }}
              value={eventType ?? ''}
              onChange={(e) => setEventType(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">전체</option>
              <option value="0">선정성</option>
              <option value="1">도박</option>
            </select>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSearch}>
          조회
        </button>
      </div>

      <div style={{
        background: 'var(--bg2)',
        padding: '12px 16px',
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 13,
        color: 'var(--t2)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontWeight: 600 }}>원본 API:</span>
        <code style={{
          background: 'var(--bg3)',
          padding: '4px 10px',
          borderRadius: 4,
          fontFamily: 'monospace',
          fontSize: 12,
          color: 'var(--ac)',
        }}>
          {activeTab === 'sha256'
            ? `${kwsBase}/api/kws-sha256/?limit=${limit}`
            : `${kwsBase}/api/kws-urls/?limit=${limit}${eventType !== undefined ? `&eventType=${eventType}` : ''}`
          }
        </code>
      </div>

      {activeTab === 'sha256' ? (
        <DataTable
          cols={sha256Cols}
          rows={sha256List as (KwsSha256Item & Record<string, unknown>)[]}
          loading={sha256Loading}
          rowKey="id"
          emptyMessage="SHA256 데이터가 없습니다"
          emptyIcon="🔐"
        />
      ) : (
        <DataTable
          cols={urlCols}
          rows={urlList as (KwsUrlItem & Record<string, unknown>)[]}
          loading={urlLoading}
          rowKey="id"
          emptyMessage="URL 데이터가 없습니다"
          emptyIcon="🔗"
        />
      )}
    </div>
  );
}
