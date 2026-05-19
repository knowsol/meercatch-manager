'use client';
import { useState, useMemo, ReactNode, useCallback } from 'react';
import DataTable, { Column } from '../../components/common/DataTable';
import { fmtDT } from '../../components/common/helpers';
import type { KwsSha256Item, KwsUrlItem } from '../../lib/api/hooks/useValidUrl';
import { useToastCtx } from '../../components/layout/Layout';
import { usePanel } from '../../context/PanelContext';

const STATUS_LABELS: Record<string, string> = {
  I: '활성',
  A: '비활성',
};

/** URL v2 행: 표시용 protocol / port / path / 정확도 / DB유형 + 상세(탐지원인·탐지근거) */
interface ValidUrlV2Row extends KwsUrlItem {
  protocol: string;
  port: number;
  file_path: string;
  /** 0–100 */
  accuracy: number;
  /** DB Type 표기 */
  db_category: '선정성' | '도박성';
  /** API 명칭 유지 — UI에서는 탐지원인 */
  triggered_features: string;
  /** API 명칭 유지 — UI에서는 탐지근거 (matched_keyword 미사용) */
  reason: string;
}

const ACCENT = '#2563eb';
const ACCENT_TRACK = '#dbeafe';

function AccuracyRing({ value }: Readonly<{ value: number }>) {
  const n = Math.max(0, Math.min(100, Math.round(Number(value))));
  const size = 44;
  const stroke = 3.5;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2 - 0.5;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * (n / 100);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        margin: '0 auto',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={ACCENT_TRACK}
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={ACCENT}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          color: ACCENT,
          pointerEvents: 'none',
        }}
      >
        {n}
      </span>
    </div>
  );
}

const MOCK_SHA256: KwsSha256Item[] = [
  {
    id: 1001,
    hash_code: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    replace_w: '',
    protocol: 'https',
    port: 443,
    file_path: '/video/sample',
    nude_rating: 0,
    sex_rating: 1,
    violence_rating: 0,
    language_rating: 0,
    illegal_rating: 0,
    harmful_rating: 2,
    coverage: '',
    status: 'I',
    db_type: '선정성',
    created_at: '2026-05-01T09:00:00.000Z',
  },
  {
    id: 1002,
    hash_code: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    replace_w: '',
    protocol: 'http',
    port: 80,
    file_path: '/',
    nude_rating: 0,
    sex_rating: 0,
    violence_rating: 0,
    language_rating: 0,
    illegal_rating: 0,
    harmful_rating: 0,
    coverage: '',
    status: 'A',
    db_type: '도박성',
    created_at: '2026-05-02T11:30:00.000Z',
  },
  {
    id: 1003,
    hash_code: '00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
    replace_w: '',
    protocol: 'https',
    port: 8443,
    file_path: '/stream/live',
    nude_rating: 0,
    sex_rating: 0,
    violence_rating: 0,
    language_rating: 0,
    illegal_rating: 0,
    harmful_rating: 1,
    coverage: '',
    status: 'I',
    db_type: '선정성',
    created_at: '2026-05-10T08:15:00.000Z',
  },
];

const MOCK_URL_ROWS: ValidUrlV2Row[] = [
  {
    id: 2001,
    url: 'https://example.com/adult/content/page',
    event_type: 0,
    protocol: 'https',
    port: 443,
    file_path: '/adult/content/page',
    accuracy: 88,
    db_category: '선정성',
    created_at: '2026-05-03T10:00:00.000Z',
    triggered_features: '-',
    reason: 'URL 전체 패턴 기반 판단',
  },
  {
    id: 2002,
    url: 'https://demo.kr/gambling/promo',
    event_type: 1,
    protocol: 'https',
    port: 443,
    file_path: '/gambling/promo',
    accuracy: 91,
    db_category: '도박성',
    created_at: '2026-05-04T14:20:00.000Z',
    triggered_features: '숫자로 끝나는 도메인 | 성인 키워드 | 도박 복합 신호',
    reason: '도박 복합 신호(숫자끝+일반TLD) / 성인 키워드(yadong) / 높은 엔트로피(3.32) — 랜덤 도메인',
  },
  {
    id: 2003,
    url: 'https://cdn.sample.io/static/asset.js',
    event_type: 0,
    protocol: 'https',
    port: 443,
    file_path: '/static/asset.js',
    accuracy: 52,
    db_category: '선정성',
    created_at: '2026-05-05T16:45:00.000Z',
    triggered_features: '숫자로 끝나는 도메인 | 하이픈+숫자 패턴 | 하이픈 분리 구조 | 도박 복합 신호',
    reason: '도박 복합 신호(숫자끝+일반TLD)',
  },
  {
    id: 2004,
    url: 'http://legacy.test:8080/path/to/resource',
    event_type: 1,
    protocol: 'http',
    port: 8080,
    file_path: '/path/to/resource',
    accuracy: 86,
    db_category: '도박성',
    created_at: '2026-05-08T09:10:00.000Z',
    triggered_features: '의심 TLD | 의심 서브도메인(구조)',
    reason: '고위험 TLD(.xyz) / 의심 서브도메인',
  },
  {
    id: 2005,
    url: 'https://secure.example/path?query=1',
    event_type: 0,
    protocol: 'https',
    port: 443,
    file_path: '/path',
    accuracy: 60,
    db_category: '선정성',
    created_at: '2026-05-12T12:00:00.000Z',
    triggered_features: '숫자로 끝나는 도메인 | 하이픈+숫자 패턴 | 반복 숫자(777/888) | 하이픈 분리 구조 | 도박 복합 신호',
    reason: '도박 복합 신호(숫자끝+일반TLD) / 도박 행운수/반복숫자',
  },
  {
    id: 2006,
    url: 'https://host6.example/long/nested/deep/page',
    event_type: 1,
    protocol: 'https',
    port: 443,
    file_path: '/long/nested/deep/page',
    accuracy: 89,
    db_category: '도박성',
    created_at: '2026-05-06T08:00:00.000Z',
    triggered_features: '자음군 반복 | 도박 키워드',
    reason: '도박 키워드(toto) / 자음군 반복(bsbs/mtgg 등)',
  },
  {
    id: 2007,
    url: 'https://host7.example/api/v1/stream',
    event_type: 0,
    protocol: 'https',
    port: 443,
    file_path: '/api/v1/stream',
    accuracy: 97,
    db_category: '선정성',
    created_at: '2026-05-07T11:11:00.000Z',
    triggered_features: '하이픈 분리 구조 | 도박 키워드',
    reason: '높은 엔트로피(3.33) — 랜덤 도메인',
  },
  {
    id: 2008,
    url: 'http://host8.example:3000/',
    event_type: 1,
    protocol: 'http',
    port: 3000,
    file_path: '/',
    accuracy: 33,
    db_category: '도박성',
    created_at: '2026-05-09T15:30:00.000Z',
    triggered_features: '숫자로 끝나는 도메인 | 짧은알파+숫자 | 의심 서브도메인(알파+숫자) | 도박 복합 신호',
    reason: '도박 키워드(bet)',
  },
  {
    id: 2009,
    url: 'https://host9.example/cdn/img.png',
    event_type: 0,
    protocol: 'https',
    port: 443,
    file_path: '/cdn/img.png',
    accuracy: 87,
    db_category: '선정성',
    created_at: '2026-05-11T09:45:00.000Z',
    triggered_features: '숫자로 끝나는 도메인 | 의심 서브도메인(구조) | 불법스트리밍 키워드 | 도박 복합 신호',
    reason: '도박 복합 신호(숫자끝+일반TLD) / 불법스트리밍 키워드(torrent)',
  },
  {
    id: 2010,
    url: 'https://host10.example/end',
    event_type: 1,
    protocol: 'https',
    port: 443,
    file_path: '/end',
    accuracy: 94,
    db_category: '도박성',
    created_at: '2026-05-13T18:00:00.000Z',
    triggered_features: '숫자로 끝나는 도메인 | 반복 숫자(777/888) | 짧은알파+숫자 | 도박 행운수 | 도박 복합 신호',
    reason: '도박 복합 신호(숫자끝+일반TLD) / 불법스트리밍 키워드(torrent) / 의심 서브도메인 / 높은 엔트로피',
  },
];

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

function renderDbCategoryLabel(label: string): ReactNode {
  const isAdult = label === '선정성';
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
}

function detailProtocolBadge(protocol: string) {
  return (
    <span style={{
      background: protocol === 'https' ? '#dcfce7' : '#fef3c7',
      color: protocol === 'https' ? '#166534' : '#92400e',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 500,
    }}>
      {protocol.toUpperCase()}
    </span>
  );
}

interface ValidUrlV2DetailPanelProps {
  row: ValidUrlV2Row;
  onClose: () => void;
}

function ValidUrlV2DetailPanel({ row, onClose }: ValidUrlV2DetailPanelProps) {
  const blockStyle: React.CSSProperties = {
    marginTop: 24,
    paddingTop: 20,
    borderTop: '1px solid var(--bd)',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--t1)',
    marginBottom: 8,
  };
  const textStyle: React.CSSProperties = {
    fontSize: 13,
    lineHeight: 1.65,
    color: 'var(--t2)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button type="button" className="cx" onClick={onClose}>
          ✕
        </button>
        <h2>URL 상세</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <dl className="info-row">
          <dt>ID</dt>
          <dd>{row.id}</dd>
          <dt>URL</dt>
          <dd style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: 12 }}>{row.url}</dd>
          <dt>Protocol</dt>
          <dd>{detailProtocolBadge(row.protocol)}</dd>
          <dt>Port</dt>
          <dd>{row.port}</dd>
          <dt>Path</dt>
          <dd style={{ color: 'var(--t2)' }}>{row.file_path || '/'}</dd>
          <dt>DB Type</dt>
          <dd>{renderDbCategoryLabel(row.db_category)}</dd>
          <dt>정확도</dt>
          <dd style={{ display: 'flex', alignItems: 'center' }}>
            <AccuracyRing value={row.accuracy} />
          </dd>
          <dt>등록일</dt>
          <dd>{fmtDT(row.created_at)}</dd>
        </dl>

        <div style={blockStyle}>
          <div style={labelStyle}>탐지원인</div>
          <div style={textStyle}>{row.triggered_features}</div>
        </div>

        <div style={blockStyle}>
          <div style={labelStyle}>탐지근거</div>
          <div style={textStyle}>{row.reason}</div>
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ValidUrlListV2() {
  const toast = useToastCtx();
  const { openPanel, closePanel } = usePanel();
  const [activeTab, setActiveTab] = useState<'sha256' | 'text'>('text');
  const [limit, setLimit] = useState(100);
  const [limitInput, setLimitInput] = useState('100');
  const [eventType, setEventType] = useState<number | undefined>(undefined);
  const [hiddenUrlIds, setHiddenUrlIds] = useState<Set<number>>(() => new Set());

  const urlsAlive = useMemo(
    () => MOCK_URL_ROWS.filter((u) => !hiddenUrlIds.has(u.id)),
    [hiddenUrlIds],
  );

  const urlsFiltered = useMemo(
    () =>
      eventType === undefined
        ? urlsAlive
        : urlsAlive.filter((u) => u.event_type === eventType),
    [urlsAlive, eventType],
  );

  const urlList = useMemo(() => urlsFiltered.slice(0, limit), [urlsFiltered, limit]);
  const urlCount = urlsFiltered.length;

  const sha256List = useMemo(() => MOCK_SHA256.slice(0, limit), [limit]);
  const sha256Count = MOCK_SHA256.length;

  const handleDeleteUrl = useCallback(
    (row: ValidUrlV2Row) => {
      if (!window.confirm(`이 URL을 삭제할까요?\n\n${row.url}`)) return;
      setHiddenUrlIds((prev) => new Set(prev).add(row.id));
      toast('삭제되었습니다.', 'ok');
    },
    [toast],
  );

  const sha256Cols: Column<KwsSha256Item & Record<string, unknown>>[] = useMemo(() => [
    {
      key: 'id',
      label: 'ID',
      width: '5%',
    },
    {
      key: 'hash_code',
      label: 'Hash Code',
      width: '22%',
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
      width: '9%',
      render: (v): ReactNode => renderDbCategoryLabel(String(v)),
    },
    {
      key: 'created_at',
      label: '등록일',
      width: '14%',
      render: (v) => fmtDT(v as string),
    },
  ], []);

  const urlCols: Column<ValidUrlV2Row & Record<string, unknown>>[] = useMemo(() => [
    {
      key: 'id',
      label: 'ID',
      width: '4%',
    },
    {
      key: 'url',
      label: 'URL',
      width: '22%',
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
      key: 'protocol',
      label: 'Protocol',
      width: '7%',
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
      width: '5%',
    },
    {
      key: 'file_path',
      label: 'Path',
      width: '12%',
      render: (v) => (
        <span style={{ color: 'var(--t2)', fontSize: 12 }}>
          {v as string || '/'}
        </span>
      ),
    },
    {
      key: 'db_category',
      label: 'DB Type',
      width: '9%',
      render: (v): ReactNode => renderDbCategoryLabel(v as string),
    },
    {
      key: 'accuracy',
      label: '정확도',
      width: '8%',
      render: (v) => <AccuracyRing value={v as number} />,
    },
    {
      key: 'created_at',
      label: '등록일',
      width: '14%',
      render: (v) => fmtDT(v as string),
    },
    {
      key: '_delete',
      label: '삭제',
      width: '8%',
      render: (_v, row) => {
        const r = row as ValidUrlV2Row;
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
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUrl(r);
            }}
          >
            삭제
          </button>
        );
      },
    },
  ], [handleDeleteUrl]);

  const handleSearch = () => {
    const num = Number.parseInt(limitInput, 10);
    if (!Number.isNaN(num) && num >= 1) {
      const capped = Math.min(num, 1000);
      setLimit(capped);
      setLimitInput(String(capped));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">유효 URL 관리 v2</div>
          <div className="ph-sub">검증 URL 현황</div>
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
              const num = Number.parseInt(limitInput, 10);
              if (!Number.isNaN(num) && num >= 1) {
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

      {activeTab === 'sha256' ? (
        <DataTable
          cols={sha256Cols}
          rows={sha256List as (KwsSha256Item & Record<string, unknown>)[]}
          loading={false}
          rowKey="id"
          emptyMessage="SHA256 데이터가 없습니다"
          emptyIcon="🔐"
        />
      ) : (
        <DataTable
          cols={urlCols}
          rows={urlList as (ValidUrlV2Row & Record<string, unknown>)[]}
          loading={false}
          rowKey="id"
          onRowClick={(r) =>
            openPanel(
              <ValidUrlV2DetailPanel row={r as ValidUrlV2Row} onClose={closePanel} />,
            )
          }
          emptyMessage="URL 데이터가 없습니다"
          emptyIcon="🔗"
        />
      )}
    </div>
  );
}
