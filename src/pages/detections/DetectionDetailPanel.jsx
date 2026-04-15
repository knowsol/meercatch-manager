import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { PanelLayout } from '../../components/common/Panel';
import { StatusBadge, DetTypeBadge } from '../../components/common/Badge';
import { fmtDT } from '../../components/common/helpers';
import { detections } from '../../data/dummy';

export default function DetectionDetailPanel({ detId }) {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [memo, setMemo] = useState('');

  const det = detections.find(d => d.detId === detId) || {};

  const body = (
    <div>
      <img
        src={`https://picsum.photos/seed/${det.thumb}/480/270`}
        alt="탐지 이미지"
        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 16, display: 'block' }}
      />
      <dl className="info-row">
        <dt>탐지시각</dt><dd>{fmtDT(det.detectedAt)}</dd>
        <dt>탐지유형</dt><dd><DetTypeBadge type={det.type} /></dd>
        <dt>그룹</dt><dd>{det.groupName}</dd>
        <dt>단말</dt><dd>{det.deviceName}</dd>
        <dt>탐지정책</dt><dd>{det.policy}</dd>
        <dt>처리상태</dt><dd><StatusBadge status={det.status} /></dd>
      </dl>
      <div className="sep" />
      <div className="fg">
        <label>메모</label>
        <textarea
          className="inp"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="메모를 입력하세요"
          style={{ minHeight: 72 }}
        />
      </div>
    </div>
  );

  const footer = (
    <div className="mod-f-row">
      <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn btn-ok"
          onClick={() => { toast('탐지가 확인 처리되었습니다.', 'success'); closePanel(); }}
        >
          확인
        </button>
        <button
          className="btn btn-warn"
          onClick={() => { toast('검토 중으로 변경되었습니다.', 'warn'); closePanel(); }}
        >
          검토
        </button>
        <button
          className="btn btn-outline"
          onClick={() => { toast('탐지가 무시 처리되었습니다.', 'info'); closePanel(); }}
        >
          무시
        </button>
      </div>
    </div>
  );

  return <PanelLayout title="탐지 상세" body={body} footer={footer} />;
}
