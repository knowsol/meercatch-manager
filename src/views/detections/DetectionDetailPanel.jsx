'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

export default function DetectionDetailPanel({ detId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const det = DUMMY.detections.find(d => d.detId === detId) || DUMMY.detections[0];

  const [memo, setMemo] = useState('');

  const handleAction = (val, label) => {
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
          <dt>탐지시각</dt><dd>{fmtDT(det.detectedAt)}</dd>
          <dt>탐지유형</dt><dd><DetTypeBadge type={det.type} /></dd>
          <dt>단말</dt><dd>{det.deviceName}</dd>
        </dl>

        {det.type === '도박' && det.content && det.content.length > 0 && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 6, border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>탐지 URL/도메인</div>
            {det.content.map((c, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--warn)', marginBottom: 2 }}>{c}</div>
            ))}
          </div>
        )}

        <div className="fg" style={{ marginTop: 16 }}>
          <label>메모</label>
          <textarea
            className="inp"
            placeholder="처리 메모 입력..."
            style={{ minHeight: 72 }}
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={closePanel}>닫기</button>
          <button className="btn btn-p" onClick={() => handleAction('confirmed', '저장')}>저장</button>
        </div>
      </div>
    </div>
  );
}
