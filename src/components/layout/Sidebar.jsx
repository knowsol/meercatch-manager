import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { currentUser } from '../../data/dummy';

const MENU = [
  { section: '메인' },
  { id: 'dashboard',       icon: '📊', label: '대시보드',    path: '/' },
  { section: '운영 관리' },
  { id: 'groups',          icon: '🏫', label: '그룹 관리',   path: '/groups' },
  { id: 'devices',         icon: '📱', label: '단말기 관리', path: '/devices' },
  { id: 'policies',        icon: '🛡️', label: '정책 관리',   path: '/policies' },
  { id: 'pauses',          icon: '⏸️', label: '탐지중단',    path: '/pauses' },
  { section: '모니터링' },
  { id: 'detections',      icon: '🔍', label: '탐지 현황',   path: '/detections' },
  { id: 'pauses-history',  icon: '📜', label: '중단 이력',   path: '/pauses-history' },
  { section: '사용자 관리' },
  { id: 'users',           icon: '👥', label: '사용자 관리', path: '/users' },
  { section: '설정' },
  { id: 'licenses',        icon: '🔑', label: '라이선스',    path: '/licenses' },
  { id: 'notifications',   icon: '🔔', label: '알림 설정',   path: '/notifications' },
  { id: 'account',         icon: '👤', label: '내 계정',     path: '/account' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`sb${collapsed ? ' collapsed' : ''}`}>
      <div className="sb-h">
        <div className="sb-logo-row">
          <div className="sb-logo-icon">M</div>
          <div className="sb-logo-text">Meercatch Manager</div>
        </div>
      </div>

      <div className="sb-u">
        <div className="sb-u-info">
          <div className="sb-u-avatar">{currentUser.name.charAt(0)}</div>
          <div className="sb-u-detail">
            <div className="sb-u-name">{currentUser.name}</div>
            <div className="sb-u-role">관리자</div>
          </div>
        </div>
        <div className="sb-u-actions">
          <button className="sb-u-btn" onClick={() => navigate('/account')}>내 계정</button>
          <button className="sb-u-btn">로그아웃</button>
        </div>
      </div>

      <nav className="sb-nav">
        {MENU.map((item, i) => {
          if (item.section) return <div key={i} className="ns">{item.section}</div>;
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          return (
            <div key={item.id} className={`ni${isActive ? ' a' : ''}`} onClick={() => navigate(item.path)}>
              <span className="ic">{item.icon}</span>
              <span className="ni-txt">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sb-collapse-btn">
        <button className="sb-toggle" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
    </div>
  );
}
