'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

function DetectedImage({ seed }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', background: '#0f172a', cursor: 'pointer' }}
      onClick={() => setRevealed(r => !r)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/480/320`}
        alt="탐지 이미지"
        style={{ width: '100%', display: 'block', filter: revealed ? 'none' : 'blur(18px)', transition: 'filter 0.25s', transform: 'scale(1.05)' }}
      />
      {!revealed && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'rgba(0,0,0,0.35)',
        }}>
          <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>클릭하여 이미지 확인</span>
        </div>
      )}
      {revealed && (
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          background: 'rgba(0,0,0,0.55)', borderRadius: 4, padding: '3px 10px',
          fontSize: 11, color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
        }}>
          클릭하여 블러 처리
        </div>
      )}
    </div>
  );
}

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

        {det.type === '선정성' && det.thumb && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600, marginBottom: 8 }}>탐지 이미지</div>
            <DetectedImage seed={det.thumb} />
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 6 }}>
              이미지는 기본 블러 처리됩니다. 클릭하여 원본을 확인하세요.
            </div>
          </div>
        )}

        {det.type === '도박' && det.content && det.content.length > 0 && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 4, border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>탐지 URL/도메인</div>
            {det.content.map((c, i) => (
              <div key={i} style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--warn)', marginBottom: 2 }}>{c}</div>
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
