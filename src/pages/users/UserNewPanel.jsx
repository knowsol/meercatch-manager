import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';

export default function UserNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [name,     setName]     = useState('');
  const [username, setUsername] = useState('');
  const [pw,       setPw]       = useState('');
  const [role,     setRole]     = useState('');
  const [contact,  setContact]  = useState('');
  const [grade,    setGrade]    = useState('');
  const [cls,      setCls]      = useState('');
  const [errors,   setErrors]   = useState({});

  const onSave = () => {
    const errs = {};
    if (!name.trim())     errs.name     = true;
    if (!username.trim()) errs.username = true;
    if (!pw.trim())       errs.pw       = true;
    if (!role)            errs.role     = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('사용자가 등록되었습니다.');
    closePanel();
  };

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>✕</button>
        <h2>사용자 등록</h2>
      </div>
      <div className="mod-b" style={{flex:1, overflowY:'auto'}}>
        <div className="form-row">
          <div className="fg">
            <label>이름<span className="req"> *</span></label>
            <input className={`inp${errors.name ? ' error' : ''}`} placeholder="홍길동" type="text"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="fg">
            <label>아이디<span className="req"> *</span></label>
            <input className={`inp${errors.username ? ' error' : ''}`} placeholder="아이디" type="text"
              value={username} onChange={e => setUsername(e.target.value)} />
          </div>
        </div>
        <div className="form-row section-gap">
          <div className="fg">
            <label>비밀번호<span className="req"> *</span></label>
            <input className={`inp${errors.pw ? ' error' : ''}`} placeholder="초기 비밀번호" type="password"
              value={pw} onChange={e => setPw(e.target.value)} />
          </div>
          <div className="fg">
            <label>역할<span className="req"> *</span></label>
            <select className={`inp${errors.role ? ' error' : ''}`} value={role} onChange={e => setRole(e.target.value)}>
              <option value="">역할 선택</option>
              <option value="admin">관리자</option>
              <option value="staff">직원</option>
              <option value="teacher">선생님</option>
            </select>
          </div>
        </div>
        <div className="fg">
          <label>연락처</label>
          <input className="inp" placeholder="010-0000-0000" type="text"
            value={contact} onChange={e => setContact(e.target.value)} />
        </div>
        <div className="sep" />
        <div className="sub-label">담당 학년/반</div>
        <div className="form-row section-gap">
          <div className="fg">
            <label>학년</label>
            <select className="inp" value={grade} onChange={e => setGrade(e.target.value)}>
              <option value="">학년 선택</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
          </div>
          <div className="fg">
            <label>반</label>
            <select className="inp" value={cls} onChange={e => setCls(e.target.value)}>
              <option value="">반 선택 (전체)</option>
              {[1,2,3,4,5,6].map(i => <option key={i} value={String(i)}>{i}반</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-p" onClick={onSave}>등록</button>
        </div>
      </div>
    </div>
  );
}
