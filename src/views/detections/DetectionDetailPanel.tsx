'use client';
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { EVENT_TYPE_MAP, DETECT_OS_TYPE_MAP } from '@/types';
import type { Detection } from '@/types';

interface DetectionDetailPanelProps {
  detection: Detection;
}

export default function DetectionDetailPanel({ detection }: DetectionDetailPanelProps) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();

  const [memo, setMemo] = useState('');

  const eventTypeName = EVENT_TYPE_MAP[detection.eventType] || '기타';
  const osTypeName = DETECT_OS_TYPE_MAP[detection.osType] || `OS ${detection.osType}`;

  const handleAction = (label: string) => {
    toast(`${label} 처리되었습니다.`);
    closePanel();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>탐지 상세</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <dl className="info-row">
          <dt>탐지시각</dt>
          <dd>{fmtDT(detection.eventTime)}</dd>
          <dt>탐지유형</dt>
          <dd><DetTypeBadge type={eventTypeName} /></dd>
          <dt>단말 UUID</dt>
          <dd>
            <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{detection.deviceUuid}</span>
          </dd>
          <dt>OS</dt>
          <dd>{osTypeName}</dd>
          <dt>하드웨어</dt>
          <dd>{detection.hardwareName || '—'}</dd>
        </dl>

        {detection.eventUrl && (
          <div
            style={{
              marginTop: 16,
              padding: '10px 14px',
              background: 'var(--bg2)',
              borderRadius: 6,
              border: '1px solid var(--bd)',
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>탐지 URL</div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 13,
                color: eventTypeName === '도박' ? 'var(--warn)' : 'var(--err)',
                wordBreak: 'break-all',
              }}
            >
              {detection.eventUrl}
            </div>
          </div>
        )}

        <div className="fg" style={{ marginTop: 16 }}>
          <label>메모</label>
          <textarea
            className="inp"
            placeholder="처리 메모 입력..."
            style={{ minHeight: 72 }}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={closePanel}>닫기</button>
          <button className="btn btn-p" onClick={() => handleAction('확인')}>확인</button>
          <button className="btn btn-warn" onClick={() => handleAction('검토')}>검토</button>
          <button className="btn btn-outline" onClick={() => handleAction('무시')}>무시</button>
        </div>
      </div>
    </div>
  );
}
