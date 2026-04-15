import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { PanelLayout } from '../../components/common/Panel';

export default function PauseNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();

  const [grade, setGrade] = useState('');
  const [cls, setCls] = useState('');
  const [pauseType, setPauseType] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!grade || !cls || !pauseType || !startAt || !endAt) {
      toast('모든 필드를 입력해주세요.', 'error');
      return;
    }
    if (new Date(endAt) <= new Date(startAt)) {
      toast('종료일시는 시작일시보다 이후여야 합니다.', 'error');
      return;
    }
    toast('중단 설정이 완료되었습니다.', 'success');
    closePanel();
  };

  const body = (
    <div>
      <div className="fg">
        <label>학년</label>
        <select className="inp" value={grade} onChange={e => setGrade(e.target.value)}>
          <option value="">선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>
      <div className="fg">
        <label>반</label>
        <select className="inp" value={cls} onChange={e => setCls(e.target.value)}>
          <option value="">선택</option>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}반</option>)}
        </select>
      </div>
      <div className="fg">
        <label>중단유형</label>
        <select className="inp" value={pauseType} onChange={e => setPauseType(e.target.value)}>
          <option value="">선택</option>
          <option value="전체">전체</option>
          <option value="선정성">선정성</option>
          <option value="도박">도박</option>
          <option value="폭력">폭력</option>
        </select>
      </div>
      <div className="fg">
        <label>시작일시</label>
        <input className="inp" type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} />
      </div>
      <div className="fg">
        <label>종료일시</label>
        <input className="inp" type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)} />
      </div>
      <div className="fg">
        <label>사유</label>
        <textarea className="inp" rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="중단 사유를 입력하세요" />
      </div>
    </div>
  );

  const footer = (
    <div className="mod-f-row">
      <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
      <div><button className="btn btn-p" onClick={handleSubmit}>중단 설정</button></div>
    </div>
  );

  return <PanelLayout title="중단 설정" body={body} footer={footer} />;
}
