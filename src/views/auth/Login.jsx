'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { DUMMY } from '../../data/dummy';

const BG = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)',
};

const CARD_STYLE = {
  width: 380,
  background: '#fff',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(0,0,0,.1)',
  padding: '40px 36px',
};

function Logo() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', letterSpacing: -1, marginBottom: 4 }}>
        Meercatch Manager
      </div>
      <div style={{ fontSize: 13, color: '#64748b' }}>관리자 포털에 로그인하세요</div>
    </div>
  );
}

function RoleToggle({ value, onChange }) {
  const roles = [
    { key: 'direct',  label: '직접 관리' },
    { key: 'manager', label: '매니저 관리' },
  ];
  return (
    <div style={{
      display: 'flex', background: '#f1f5f9',
      borderRadius: 10, padding: 3, marginBottom: 20, gap: 2,
    }}>
      {roles.map(r => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          style={{
            flex: 1, padding: '8px 0', fontSize: 13, fontWeight: 600,
            border: 'none', borderRadius: 8, cursor: 'pointer',
            background: value === r.key ? '#fff' : 'transparent',
            color: value === r.key ? '#1e293b' : '#64748b',
            boxShadow: value === r.key ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
            transition: 'all .15s',
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function InputField({ type, placeholder, value, onChange, onEnter, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '11px 14px',
          border: error
            ? '1.5px solid #ef4444'
            : focused ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
          borderRadius: 10, fontSize: 14, outline: 'none',
          background: error ? '#fff5f5' : '#fff',
          transition: 'border-color .15s',
        }}
      />
      {error && (
        <div style={{ color: '#ef4444', fontSize: 12, marginTop: 4, paddingLeft: 2 }}>
          {error}
        </div>
      )}
    </div>
  );
}

function HintBox({ loginRole }) {
  const items = loginRole === 'manager'
    ? [
        { label: '관리자', id: 'admin',    pw: 'admin1234' },
        { label: '직원',   id: 'staff1',   pw: '1234' },
      ]
    : [
        { label: '교사',   id: 'teacher1', pw: '1234' },
        { label: '교사',   id: 'teacher2', pw: '1234' },
      ];
  return (
    <div style={{
      marginTop: 18, padding: '11px 14px',
      background: '#f0f9ff', borderRadius: 10,
      border: '1px solid #bae6fd', fontSize: 12, color: '#0369a1',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 5 }}>🔑 테스트 계정</div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span>{it.label}</span>
          <span style={{ fontFamily: 'monospace', color: '#0284c7' }}>{it.id} / {it.pw}</span>
        </div>
      ))}
    </div>
  );
}

function validateCredentials(id, pw) {
  if (!id.trim()) return { field: 'id', msg: '아이디를 입력해주세요.' };
  if (!pw.trim()) return { field: 'pw', msg: '비밀번호를 입력해주세요.' };
  const user = DUMMY.users.find(u => u.username === id.trim());
  if (!user)      return { field: 'id', msg: '존재하지 않는 아이디입니다.' };
  if (user.password !== pw) return { field: 'pw', msg: '비밀번호가 올바르지 않습니다.' };
  if (user.status !== 'active') return { field: 'id', msg: '비활성화된 계정입니다. 관리자에게 문의하세요.' };
  return null;
}

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [loginRole, setLoginRole] = useState('direct');
  const [id, setId] = useState('admin');
  const [pw, setPw] = useState('admin1234');
  const [errors, setErrors] = useState({});

  const handleRoleChange = (role) => {
    setLoginRole(role);
    setId('admin');
    setPw('admin1234');
    setErrors({});
  };

  function handleLogin() {
    setErrors({});
    const err = validateCredentials(id, pw);
    if (err) { setErrors({ [err.field]: err.msg }); return; }
    const user = DUMMY.users.find(u => u.username === id.trim());
    login(loginRole, user.name, user.role, user.userId);
    router.push('/');
  }

  return (
    <div style={BG}>
      <div style={CARD_STYLE}>
        <Logo />
        <RoleToggle value={loginRole} onChange={handleRoleChange} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <InputField
            type="text" placeholder="아이디"
            value={id} onChange={setId}
            onEnter={handleLogin}
            error={errors.id}
          />
          <InputField
            type="password" placeholder="비밀번호"
            value={pw} onChange={setPw}
            onEnter={handleLogin}
            error={errors.pw}
          />
          <button
            onClick={handleLogin}
            style={{
              width: '100%', padding: 12, marginTop: 2,
              background: 'var(--ac)', color: '#fff',
              border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.88)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
          >
            로그인
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94a3b8' }}>
          © {new Date().getFullYear()} Meercat.ch
        </div>
      </div>
    </div>
  );
}
