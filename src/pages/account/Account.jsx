import { useState } from 'react';
import { useToastCtx } from '../../components/layout/Layout';
import { useTheme } from '../../context/ThemeContext';
import { currentUser } from '../../data/dummy';

export default function Account() {
  const toast = useToastCtx();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(currentUser.name);
  const [contact, setContact] = useState(currentUser.contact);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast('이름을 입력해주세요.', 'error');
      return;
    }
    toast('기본 정보가 저장되었습니다.', 'success');
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) {
      toast('모든 비밀번호 필드를 입력해주세요.', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      toast('새 비밀번호가 일치하지 않습니다.', 'error');
      return;
    }
    if (newPw.length < 6) {
      toast('새 비밀번호는 6자 이상이어야 합니다.', 'error');
      return;
    }
    toast('비밀번호가 변경되었습니다.', 'success');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <div>
      <div className="ph">
        <h1 className="ph-title">내 계정</h1>
      </div>

      <div style={{ maxWidth: 860 }}>

        {/* 기본 정보 */}
        <div className="card mb-24">
          <div className="card-hd"><span className="card-title">기본 정보</span></div>
          <div className="fg">
            <label>이름</label>
            <input className="inp" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="fg">
            <label>연락처</label>
            <input className="inp" value={contact} onChange={e => setContact(e.target.value)} placeholder="010-0000-0000" />
          </div>
          <div className="fg">
            <label>아이디</label>
            <input className="inp" value={currentUser.username} disabled />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn-p" onClick={handleSaveProfile}>저장</button>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="card mb-24">
          <div className="card-hd"><span className="card-title">비밀번호 변경</span></div>
          <div className="fg">
            <label>현재 비밀번호</label>
            <input className="inp" type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="현재 비밀번호" />
          </div>
          <div className="fg">
            <label>새 비밀번호</label>
            <input className="inp" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="새 비밀번호" />
          </div>
          <div className="fg">
            <label>새 비밀번호 확인</label>
            <input className="inp" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="새 비밀번호 확인" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn-p" onClick={handleChangePassword}>변경</button>
          </div>
        </div>

        {/* 테마 설정 */}
        <div className="card">
          <div className="card-hd"><span className="card-title">테마 설정</span></div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { id: 'light', icon: '☀️', label: '라이트 모드' },
              { id: 'dark', icon: '🌙', label: '다크 모드' },
            ].map(t => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  flex: 1,
                  padding: '20px 24px',
                  border: `2px solid ${theme === t.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: theme === t.id ? 'var(--primary-bg, rgba(99,102,241,0.06))' : 'transparent',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 600 }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
