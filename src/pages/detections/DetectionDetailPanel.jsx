import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { StatusBadge, DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

export default function DetectionDetailPanel({ detId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const det = DUMMY.detections.find(d => d.detId === detId) || DUMMY.detections[0];

  const [currentStatus, setCurrentStatus] = useState(det.status);
  const [memo, setMemo] = useState('');

  const handleAction = (val, label) => {
    setCurrentStatus(val);
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
          <dt>그룹</dt><dd>{det.groupName}</dd>
          <dt>단말</dt><dd>{det.deviceName}</dd>
          <dt>탐지정책</dt><dd>{det.policy}</dd>
          <dt>처리상태</dt><dd><StatusBadge status={currentStatus} /></dd>
        </dl>

        {det.type === '도박' && det.content && det.content.length > 0 && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 6, border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>탐지 URL/도메인</div>
            {det.content.map((c, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--warn)', marginBottom: 2 }}>{c}</div>
            ))}
          </div>
        )}

        {det.type === '선정성' && det.content && det.content.length > 0 && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 6, border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6 }}>탐지 항목</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {det.content.map((c, i) => (
                <span key={i} style={{ padding: '3px 10px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', color: 'var(--err)', fontSize: 12, fontWeight: 600 }}>{c}</span>
              ))}
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
            onChange={e => setMemo(e.target.value)}
          />
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={closePanel}>닫기</button>
          <button className="btn btn-p" onClick={() => handleAction('confirmed', '확인')}>확인</button>
          <button className="btn btn-warn" onClick={() => handleAction('reviewing', '검토')}>검토</button>
          <button className="btn btn-outline" onClick={() => handleAction('dismissed', '무시')}>무시</button>
        </div>
      </div>
    </div>
  );
}
