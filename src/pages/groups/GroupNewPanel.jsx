import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { PanelLayout } from '../../components/common/Panel';
import { policies } from '../../data/dummy';

export default function GroupNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();

  const [grade, setGrade] = useState('');
  const [cls, setCls] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [policyId, setPolicyId] = useState('');

  const handleGradeChange = (v) => {
    setGrade(v);
    if (v && cls) setName(`${v}학년 ${cls}반`);
    else if (v) setName(`${v}학년 `);
  };

  const handleClsChange = (v) => {
    setCls(v);
    if (grade && v) setName(`${grade}학년 ${v}반`);
    else if (v) setName(` ${v}반`);
  };

  const handleSubmit = () => {
    if (!grade || !cls || !name.trim()) {
      toast('학년, 반, 그룹이름을 입력해주세요.', 'error');
      return;
    }
    toast('그룹이 생성되었습니다.', 'success');
    closePanel();
  };

  const body = (
    <div>
      <div className="fg">
        <label>학년</label>
        <select className="inp" value={grade} onChange={e => handleGradeChange(e.target.value)}>
          <option value="">선택</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>
      <div className="fg">
        <label>반</label>
        <select className="inp" value={cls} onChange={e => handleClsChange(e.target.value)}>
          <option value="">선택</option>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}반</option>)}
        </select>
      </div>
      <div className="fg">
        <label>그룹이름</label>
        <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="그룹이름" />
      </div>
      <div className="fg">
        <label>설명</label>
        <textarea className="inp" rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="설명을 입력하세요" />
      </div>
      <div className="fg">
        <label>기본 적용 정책</label>
        <select className="inp" value={policyId} onChange={e => setPolicyId(e.target.value)}>
          <option value="">정책 선택 (선택사항)</option>
          {policies.map(p => <option key={p.policyId} value={p.policyId}>{p.name}</option>)}
        </select>
      </div>
    </div>
  );

  const footer = (
    <div className="mod-f-row">
      <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
      <div><button className="btn btn-p" onClick={handleSubmit}>그룹 생성</button></div>
    </div>
  );

  return <PanelLayout title="그룹 생성" body={body} footer={footer} />;
}
