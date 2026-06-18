'use client'
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const IC = {
  dashboard:    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  groups:       '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  classes:      '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  devices:      '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>',
  policies:     '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  pauses:       '<circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/>',
  detections:   '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  reports:      '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  users:        '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  students:     '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  licenses:     '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  notifications:'<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  account:      '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  components:   '<rect x="3" y="3" width="7" height="4" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="3" y="11" width="7" height="10" rx="1"/><rect x="14" y="11" width="7" height="4" rx="1"/><rect x="14" y="19" width="7" height="4" rx="1"/>',
  urls:              '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
  'detection-policy':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  whitelist:         '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>',
  blacklist:         '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  'app-versions':    '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  'audit-logs':      '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
};

function SvgIcon({ paths }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

const MENU = [
  { section: '메인' },
  { id: 'dashboard',     icon: 'dashboard',     label: '대시보드',    path: '/',              roles: ['m', 'd'] },
  { section: '운영 관리' },
  { id: 'groups',        icon: 'groups',        label: '기관 관리',   path: '/groups',        roles: ['m'] },
  { id: 'classes',       icon: 'classes',       label: '그룹 관리',   path: '/classes',       roles: ['d'] },
  { id: 'students',      icon: 'students',      label: '학생 관리',   path: '/students',      roles: ['d'] },
  { id: 'devices',       icon: 'devices',       label: '단말기 관리', path: '/devices',       roles: ['d'] },
  { id: 'policies',      icon: 'policies',      label: '정책 관리',   path: '/policies',      roles: ['m'] },
  { section: '모니터링' },
  { id: 'detections',    icon: 'detections',    label: '탐지 현황',   path: '/detections',    roles: ['m', 'd'] },
  { id: 'reports',       icon: 'reports',       label: '보고서',      path: '/reports',       roles: ['m', 'd'] },
  { section: '직원 관리' },
  { id: 'users',         icon: 'users',         label: '직원 관리',   path: '/users',         roles: ['m', 'd'] },
  { section: '설정' },
  { id: 'licenses',      icon: 'licenses',      label: '라이선스',    path: '/licenses',      roles: ['m', 'd'] },
  { id: 'notifications', icon: 'notifications', label: '알림 설정',   path: '/notifications', roles: ['m'] },
  { id: 'account',       icon: 'account',       label: '내 계정',     path: '/account',       roles: ['m', 'd'] },
  { id: 'components',    icon: 'components',    label: '컴포넌트',    path: '/components',    roles: ['m', 'd'] },
  { section: '운영 설정' },
  { id: 'detection-policy', icon: 'detection-policy', label: '탐지정책설정',      path: '/detection-policy', roles: ['m'] },
  { id: 'whitelist',        icon: 'whitelist',         label: '화이트리스트 관리', path: '/whitelist',        roles: ['m'] },
  { id: 'blacklist',        icon: 'blacklist',         label: '블랙리스트 관리',   path: '/blacklist',        roles: ['m'] },
  { section: '관리자 전용' },
  { id: 'valid-urls',    icon: 'urls',          label: '유효 URL 관리', path: '/valid-urls',   roles: ['m'] },
  { id: 'app-versions',  icon: 'app-versions',  label: '앱 버전 관리',  path: '/app-versions', roles: ['m'] },
  { id: 'audit-logs',    icon: 'audit-logs',    label: '감사 로그',     path: '/audit-logs',   roles: ['m'] },
];

function filterMenu(menu, role) {
  const r = role === 'direct' ? 'd' : 'm';
  const result = [];
  for (let i = 0; i < menu.length; i++) {
    const item = menu[i];
    if (item.section) {
      const hasVisible = menu.slice(i + 1).some(
        x => !x.section && x.roles.includes(r)
          && !menu.slice(i + 1, menu.indexOf(x)).some(y => y.section)
      );
      if (hasVisible) result.push(item);
    } else {
      if (item.roles.includes(r)) result.push(item);
    }
  }
  return result;
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { role, userName, logout, switchRole } = useAuth();

  const visibleMenu = filterMenu(MENU, role);
  const initial = userName ? userName.charAt(0) : 'a';

  const handleNavigate = (path) => {
    router.push(path);
    onMobileClose?.();
  };

  return (
    <div className={`sb${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sb-h" onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
        <div className="sb-logo-row">
          <div className="sb-logo-icon">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ width: '76%', height: '76%' }}>
              <path d="M12 22C9 22 5 18.5 5 14.5C5 11.5 7.5 10 10 10C10.8 10 11.5 10.2 12 10.6C12.5 10.2 13.2 10 14 10C16.5 10 19 11.5 19 14.5C19 18.5 15 22 12 22Z"/>
              <ellipse cx="6.5" cy="8.5" rx="2.3" ry="2.9" transform="rotate(-20 6.5 8.5)"/>
              <ellipse cx="10.5" cy="6.2" rx="2.3" ry="2.9" transform="rotate(-5 10.5 6.2)"/>
              <ellipse cx="13.5" cy="6.2" rx="2.3" ry="2.9" transform="rotate(5 13.5 6.2)"/>
              <ellipse cx="17.5" cy="8.5" rx="2.3" ry="2.9" transform="rotate(20 17.5 8.5)"/>
            </svg>
          </div>
          <div className="sb-logo-text">Meercatch Manager</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {visibleMenu.map((item, i) => {
          if (item.section) return <div key={i} className="ns">{item.section}</div>;
          const isActive = item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path);
          return (
            <div key={item.id} className={`ni${isActive ? ' a' : ''}`} onClick={() => handleNavigate(item.path)}>
              <span className="ic"><SvgIcon paths={IC[item.icon]} /></span>
              <span className="ni-txt">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Bottom: role switcher + user */}
      <div className="sb-bottom">
        {/* Role switcher */}
        {!collapsed && (
          <div className="sb-role-row">
            {[
              { label: '교육청 관리자', value: 'manager' },
              { label: '학교 관리자',   value: 'direct'  },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => switchRole(value)}
                className={`sb-role-btn${role === value ? ' a' : ''}`}
              >{label}</button>
            ))}
          </div>
        )}

        {/* User row */}
        <div className="sb-user-row" style={{ position: 'relative' }}>
          {role !== 'direct' && (
            <button
              className="sb-bell"
              title="알림"
              onClick={() => router.push('/notifications')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="sb-notif-dot" />
            </button>
          )}

          <div
            className="sb-user"
            onClick={() => setShowDropdown(d => !d)}
          >
            <div className="sb-user-avatar">{initial}</div>
            {!collapsed && <span className="sb-user-name">{userName || 'admin'}</span>}
          </div>

          {showDropdown && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: '100%', left: 0, marginBottom: 6,
                background: 'var(--bg1)', border: '1px solid var(--bd)',
                borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,.25)',
                minWidth: 140, zIndex: 300, overflow: 'hidden',
              }}
            >
              <div
                onClick={() => { setShowDropdown(false); router.push('/account'); }}
                style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >마이페이지</div>
              <div
                onClick={() => { setShowDropdown(false); logout(); }}
                style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: '#ef4444', borderTop: '1px solid var(--bd)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >로그아웃</div>
            </div>
          )}
        </div>
      </div>

      <div className="sb-collapse-btn">
        <button className="sb-toggle" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
    </div>
  );
}
