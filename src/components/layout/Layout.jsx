import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import PanelShell from '../common/Panel';
import ToastContainer from '../common/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { DUMMY } from '../../data/dummy';
import { createContext, useContext } from 'react';

const ToastCtx = createContext(() => {});
export const useToastCtx = () => useContext(ToastCtx);

const PAGE_TITLES = {
  '/':              '대시보드',
  '/groups':        '그룹 관리',
  '/devices':       '단말기 관리',
  '/policies':      '정책 관리',
  '/pauses':        '탐지중단',
  '/pauses-history':'탐지 중단 이력',
  '/detections':    '탐지 현황',
  '/users':         '직원 관리',
  '/licenses':      '라이선스',
  '/notifications': '알림 설정',
  '/account':       '내 계정',
  '/components':    '컴포넌트',
};

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  );
}

function ExpiryBanner({ onDismiss }) {
  const navigate = useNavigate();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const deadline = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const expiring = (DUMMY.licenses || [])
    .filter(l => { const d = new Date(l.validTo); d.setHours(0, 0, 0, 0); return d >= today && d <= deadline; })
    .sort((a, b) => new Date(a.validTo) - new Date(b.validTo));
  if (!expiring.length) return null;
  const top = expiring[0];
  const days = Math.ceil((new Date(top.validTo) - today) / 86400000);
  return (
    <div style={{
      background: '#fef3c7', borderBottom: '1px solid #f59e0b',
      padding: '10px 20px', display: 'flex', alignItems: 'center',
      gap: 10, fontSize: 13, color: '#92400e', flexShrink: 0,
    }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>⚠️</span>
      <span style={{ flex: 1 }}>
        라이선스 만료 임박: {expiring.length}개 라이선스가 14일 이내에 만료됩니다.
        {' '}(가장 빠른 만료: <strong>{top.os}</strong> — {days}일 후)
      </span>
      <button
        onClick={() => navigate('/licenses')}
        style={{
          background: 'none', border: '1px solid #f59e0b', cursor: 'pointer',
          color: '#b45309', fontSize: 12, fontWeight: 600,
          padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap',
        }}
      >라이선스 보기</button>
      <button
        onClick={onDismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', fontSize: 18, padding: '0 2px 0 8px', lineHeight: 1 }}
      >×</button>
    </div>
  );
}

export default function Layout({ children }) {
  const { toasts, toast } = useToast();
  const { userName, logout, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const title = PAGE_TITLES[location.pathname] || '대시보드';
  const initial = userName ? userName.charAt(0) : 'a';

  return (
    <ToastCtx.Provider value={toast}>
      <div className="app">
        <Sidebar />
        <div className="mn">
          {/* Header */}
          <div className="mh">
            <div className="mh-title">{title}</div>
            <div className="mh-actions">
              {role !== 'direct' && (
                <button className="mh-icon-btn" title="알림" onClick={() => navigate('/notifications')} style={{ position: 'relative' }}>
                  <BellIcon />
                  <span className="mh-notif-dot" />
                </button>
              )}
              <div
                className="mh-user"
                style={{ position: 'relative' }}
                onClick={() => setShowDropdown(d => !d)}
              >
                <div className="mh-user-avatar">{initial}</div>
                <span className="mh-user-name">{userName || 'admin'}</span>
                {showDropdown && (
                  <div onClick={e => e.stopPropagation()} style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 6,
                    background: 'var(--bg1)', border: '1px solid var(--bd)',
                    borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.1)',
                    minWidth: 140, zIndex: 200, overflow: 'hidden',
                  }}>
                    <div
                      onClick={() => { setShowDropdown(false); navigate('/account'); }}
                      style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
                      onMouseEnter={e => e.target.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >마이페이지</div>
                    <div
                      onClick={() => { setShowDropdown(false); logout(); }}
                      style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: '#ef4444', borderTop: '1px solid var(--bd)' }}
                      onMouseEnter={e => e.target.style.background = '#fef2f2'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >로그아웃</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* License expiry banner */}
          {!bannerDismissed && <ExpiryBanner onDismiss={() => setBannerDismissed(true)} />}

          {/* Page body */}
          <div className="mb">{children}</div>
        </div>
        <PanelShell />
        <ToastContainer toasts={toasts} />
      </div>
    </ToastCtx.Provider>
  );
}
