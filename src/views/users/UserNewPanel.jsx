'use client'
import { useState } from 'react';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';

export default function UserNewPanel() {
  const { closePanel } = usePanel();
  const toast = useToastCtx();
  const [name,     setName]     = useState('');
  const [username, setUsername] = useState('');
  const [pw,       setPw]       = useState('');
  const [contact,  setContact]  = useState('');
  const [errors,   setErrors]   = useState({});

  const onSave = () => {
    const errs = {};
    if (!name.trim())     errs.name     = true;
    if (!username.trim()) errs.username = true;
    if (!pw.trim())       errs.pw       = true;
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
        <div className="fg">
          <label>비밀번호<span className="req"> *</span></label>
          <input className={`inp${errors.pw ? ' error' : ''}`} placeholder="초기 비밀번호" type="password"
            value={pw} onChange={e => setPw(e.target.value)} />
        </div>
        <div className="fg">
          <label>연락처</label>
          <input className="inp" placeholder="010-0000-0000" type="text"
            value={contact} onChange={e => setContact(e.target.value)} />
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
