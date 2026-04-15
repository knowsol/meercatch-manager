import { useState } from 'react';
import { useToastCtx } from '../../components/layout/Layout';
import { useTheme } from '../../context/ThemeContext';
import { DUMMY } from '../../data/dummy';

export default function Account() {
  const toast = useToastCtx();
  const { theme, setTheme } = useTheme();
  const user = DUMMY.users.find(u => u.role === 'admin') || DUMMY.users[0];

  const [name,    setName]    = useState(user.name);
  const [contact, setContact] = useState(user.contact);

  const [curPw,  setCurPw]  = useState('');
  const [newPw,  setNewPw]  = useState('');
  const [newPw2, setNewPw2] = useState('');

  function saveInfo() {
    if (!name.trim()) { toast('이름을 입력해주세요.', 'err'); return; }
    toast('계정 정보가 저장되었습니다.');
  }

  function changePw() {
    if (!curPw)              { toast('현재 비밀번호를 입력해주세요.', 'err'); return; }
    if (newPw.length < 8)    { toast('새 비밀번호는 8자 이상이어야 합니다.', 'err'); return; }
    if (newPw !== newPw2)    { toast('비밀번호가 일치하지 않습니다.', 'err'); return; }
    toast('비밀번호가 변경되었습니다.');
    setCurPw(''); setNewPw(''); setNewPw2('');
  }

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">내 계정</div>
          <div className="ph-sub">계정 정보를 확인하고 수정합니다</div>
        </div>
      </div>

      <div style={{maxWidth:'860px'}}>
        <div className="grid-2">
          {/* 기본 정보 카드 */}
          <div className="card">
            <div className="card-title">기본 정보</div>
            <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px'}}>
              <div style={{
                width:'56px', height:'56px', background:'var(--ac)', borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'22px', fontWeight:'700', flexShrink:0, color:'#fff'
              }}>{user.name.charAt(0)}</div>
              <div>
                <div style={{fontSize:'16px', fontWeight:'600', color:'var(--t1)'}}>{user.name}</div>
                <div style={{fontSize:'12px', color:'var(--t3)'}}>관리자 · {user.username}</div>
              </div>
            </div>
            <div className="section-gap">
              <div className="fg">
                <label>이름<span className="req"> *</span></label>
                <input className="inp" type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
            <div className="section-gap">
              <div className="fg">
                <label>아이디 (이메일)</label>
                <input className="inp" type="text" value={user.username} disabled />
              </div>
            </div>
            <div className="section-gap">
              <div className="fg">
                <label>연락처</label>
                <input className="inp" type="text" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
            </div>
            <div className="mt-16">
              <button className="btn btn-p" onClick={saveInfo}>저장</button>
            </div>
          </div>

          {/* 비밀번호 변경 카드 */}
          <div className="card">
            <div className="card-title">비밀번호 변경</div>
            <div className="section-gap">
              <div className="fg">
                <label>현재 비밀번호<span className="req"> *</span></label>
                <input className="inp" type="password" placeholder="현재 비밀번호"
                  value={curPw} onChange={e => setCurPw(e.target.value)} />
              </div>
            </div>
            <div className="section-gap">
              <div className="fg">
                <label>새 비밀번호<span className="req"> *</span></label>
                <input className="inp" type="password" placeholder="새 비밀번호 (8자 이상)"
                  value={newPw} onChange={e => setNewPw(e.target.value)} />
              </div>
            </div>
            <div className="section-gap">
              <div className="fg">
                <label>새 비밀번호 확인<span className="req"> *</span></label>
                <input className="inp" type="password" placeholder="새 비밀번호 확인"
                  value={newPw2} onChange={e => setNewPw2(e.target.value)} />
              </div>
            </div>
            <div className="text-t3" style={{fontSize:'11.5px', marginBottom:'16px'}}>
              비밀번호는 8자 이상, 영문+숫자+특수문자 조합을 권장합니다.
            </div>
            <button className="btn btn-p" onClick={changePw}>비밀번호 변경</button>
          </div>
        </div>

        {/* 화면 설정 카드 */}
        <div className="card" style={{marginTop:'20px'}}>
          <div className="card-title">화면 설정</div>
          <div style={{display:'flex', gap:'12px'}}>
            {[
              { id:'light', label:'라이트 모드', desc:'밝은 배경, 기본 설정' },
              { id:'dark',  label:'다크 모드',   desc:'어두운 배경, 눈 편한 화면' },
            ].map(opt => {
              const isActive = theme === opt.id;
              return (
                <div key={opt.id} onClick={() => {
                    setTheme(opt.id);
                    toast((opt.id === 'light' ? '라이트' : '다크') + ' 모드로 변경되었습니다.');
                  }}
                  style={{
                    display:'flex', alignItems:'center', gap:'14px',
                    padding:'14px 16px', borderRadius:'8px', cursor:'pointer',
                    border:`2px solid ${isActive ? 'var(--ac)' : 'var(--bd)'}`,
                    background: isActive ? 'rgba(99,102,241,.06)' : 'var(--bg2)',
                    transition:'all .15s', flex:'1'
                  }}>
                  <div style={{fontSize:'24px', lineHeight:'1'}}>
                    {opt.id === 'light' ? '☀' : '🌙'}
                  </div>
                  <div>
                    <div style={{fontSize:'13px', fontWeight:'600', color:'var(--t1)'}}>{opt.label}</div>
                    <div style={{fontSize:'12px', color:'var(--t3)', marginTop:'2px'}}>{opt.desc}</div>
                  </div>
                  {isActive && (
                    <div style={{marginLeft:'auto', width:'18px', height:'18px', borderRadius:'50%',
                      background:'var(--ac)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <div style={{width:'7px', height:'7px', borderRadius:'50%', background:'#fff'}} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
