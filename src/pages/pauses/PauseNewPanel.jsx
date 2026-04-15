import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function PauseNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [code, setCode] = useState(generateCode);
  const [codeTime, setCodeTime] = useState('5');
  const [pauseType, setPauseType] = useState('전체');
  const [durationH, setDurationH] = useState('1');
  const [durationM, setDurationM] = useState('0');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  const totalMinutes = Number(durationH) * 60 + Number(durationM);

  const onSave = () => {
    const errs = {};
    if (totalMinutes <= 0) errs.duration = true;
    if (!reason.trim()) errs.reason = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('탐지 중단이 시작되었습니다.');
    closePanel();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>탐지 중단 설정</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="fg">
          <label>인증 코드</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              flex: 1, padding: '8px 14px', borderRadius: 6, border: '1px solid var(--bd)',
              background: 'var(--bg2)', fontFamily: 'monospace', fontSize: 22, fontWeight: 700,
              letterSpacing: 6, color: 'var(--ac)', textAlign: 'center'
            }}>
              {code}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setCode(generateCode())}>재생성</button>
          </div>
        </div>

        <div className="fg">
          <label>코드입력시간</label>
          <select className="inp" value={codeTime} onChange={e => setCodeTime(e.target.value)}>
            <option value="1">1분</option>
            <option value="3">3분</option>
            <option value="5">5분</option>
            <option value="10">10분</option>
          </select>
        </div>

        <div className="fg">
          <label>중단유형</label>
          <select className="inp" value={pauseType} onChange={e => setPauseType(e.target.value)}>
            <option value="전체">전체</option>
            <option value="선정성">선정성</option>
            <option value="도박">도박</option>
          </select>
        </div>

        <div className="fg">
          <label>탐지중단해제 (시간)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                className={`inp${errors.duration ? ' error' : ''}`}
                type="number" min="0" max="24"
                style={{ maxWidth: 80 }}
                value={durationH}
                onChange={e => setDurationH(e.target.value)}
              />
              <span style={{ fontSize: 13, color: 'var(--t2)' }}>시간</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                className={`inp${errors.duration ? ' error' : ''}`}
                type="number" min="0" max="59"
                style={{ maxWidth: 80 }}
                value={durationM}
                onChange={e => setDurationM(e.target.value)}
              />
              <span style={{ fontSize: 13, color: 'var(--t2)' }}>분</span>
            </div>
          </div>
          {errors.duration && <div style={{ color: 'var(--err)', fontSize: 12, marginTop: 4 }}>중단 시간을 설정하세요.</div>}
        </div>

        <div className="fg">
          <label>요청자</label>
          <input className="inp" type="text" value="관리자" readOnly style={{ background: 'var(--bg2)', color: 'var(--t2)' }} />
        </div>

        <div className="fg">
          <label>중단사유<span className="req"> *</span></label>
          <textarea
            className={`inp${errors.reason ? ' error' : ''}`}
            placeholder="중단 사유를 입력하세요"
            style={{ minHeight: 80 }}
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={closePanel}>닫기</button>
          <button className="btn btn-p" onClick={onSave}>중단 시작</button>
        </div>
      </div>
    </div>
  );
}
