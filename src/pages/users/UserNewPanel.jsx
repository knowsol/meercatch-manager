import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import { PanelLayout } from '../../components/common/Panel';

export default function UserNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [contact, setContact] = useState('');
  const [grade, setGrade] = useState('');
  const [cls, setCls] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !username.trim() || !password.trim() || !role) {
      toast('이름, 아이디, 비밀번호, 역할을 입력해주세요.', 'error');
      return;
    }
    toast('사용자가 등록되었습니다.', 'success');
    closePanel();
  };

  const body = (
    <div>
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="fg">
          <label>이름</label>
          <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="이름" />
        </div>
        <div className="fg">
          <label>아이디</label>
          <input className="inp" value={username} onChange={e => setUsername(e.target.value)} placeholder="아이디" />
        </div>
      </div>
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="fg">
          <label>비밀번호</label>
          <input className="inp" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" />
        </div>
        <div className="fg">
          <label>역할</label>
          <select className="inp" value={role} onChange={e => setRole(e.target.value)}>
            <option value="">역할 선택</option>
            <option value="admin">관리자</option>
            <option value="staff">직원</option>
            <option value="teacher">교사</option>
          </select>
        </div>
      </div>
      <div className="fg">
        <label>연락처</label>
        <input className="inp" value={contact} onChange={e => setContact(e.target.value)} placeholder="010-0000-0000" />
      </div>
      <div className="sep" />
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="fg">
          <label>담당 학년</label>
          <select className="inp" value={grade} onChange={e => setGrade(e.target.value)}>
            <option value="">선택 (선택사항)</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </select>
        </div>
        <div className="fg">
          <label>담당 반</label>
          <select className="inp" value={cls} onChange={e => setCls(e.target.value)}>
            <option value="">선택 (선택사항)</option>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}반</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="mod-f-row">
      <div><button className="btn btn-outline" onClick={closePanel}>닫기</button></div>
      <div><button className="btn btn-p" onClick={handleSubmit}>등록</button></div>
    </div>
  );

  return <PanelLayout title="사용자 등록" body={body} footer={footer} />;
}
