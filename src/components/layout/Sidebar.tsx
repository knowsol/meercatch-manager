'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const IC: Record<string, string> = {
  dashboard:    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  groups:       '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  devices:      '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>',
  policies:     '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  pauses:       '<circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/>',
  detections:   '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  users:        '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  licenses:     '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  notifications:'<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  account:      '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  components:   '<rect x="3" y="3" width="7" height="4" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="3" y="11" width="7" height="10" rx="1"/><rect x="14" y="11" width="7" height="4" rx="1"/><rect x="14" y="19" width="7" height="4" rx="1"/>',
};

interface SvgIconProps {
  paths: string;
}

function SvgIcon({ paths }: SvgIconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  );
}

type RoleCode = 'm' | 'd';

interface SectionItem {
  section: string;
  id?: never;
  icon?: never;
  label?: never;
  path?: never;
  roles?: never;
}

interface MenuItem {
  section?: never;
  id: string;
  icon: string;
  label: string;
  path: string;
  roles: RoleCode[];
}

type MenuEntry = SectionItem | MenuItem;

const MENU: MenuEntry[] = [
  { section: '메인' },
  { id: 'dashboard',     icon: 'dashboard',     label: '대시보드',    path: '/',              roles: ['m', 'd'] },
  { section: '운영 관리' },
  { id: 'groups',        icon: 'groups',        label: '그룹 관리',   path: '/groups',        roles: ['m'] },
  { id: 'devices',       icon: 'devices',       label: '단말기 관리', path: '/devices',       roles: ['m', 'd'] },
  { id: 'policies',      icon: 'policies',      label: '정책 관리',   path: '/policies',      roles: ['m'] },
  { id: 'pauses',        icon: 'pauses',        label: '탐지중단',    path: '/pauses',        roles: ['m'] },
  { section: '모니터링' },
  { id: 'detections',    icon: 'detections',    label: '탐지 현황',   path: '/detections',    roles: ['m', 'd'] },
  { section: '직원 관리' },
  { id: 'users',         icon: 'users',         label: '직원 관리',   path: '/users',         roles: ['m', 'd'] },
  { section: '설정' },
  { id: 'licenses',      icon: 'licenses',      label: '라이선스',    path: '/licenses',      roles: ['m', 'd'] },
  { id: 'notifications', icon: 'notifications', label: '알림 설정',   path: '/notifications', roles: ['m'] },
  { id: 'account',       icon: 'account',       label: '내 계정',     path: '/account',       roles: ['m', 'd'] },
  { id: 'components',    icon: 'components',    label: '컴포넌트',    path: '/components',    roles: ['m', 'd'] },
];

function filterMenu(menu: MenuEntry[], role: string | null): MenuEntry[] {
  const r: RoleCode = role === 'direct' ? 'd' : 'm';
  const result: MenuEntry[] = [];
  for (let i = 0; i < menu.length; i++) {
    const item = menu[i];
    if (item.section) {
      const hasVisible = menu.slice(i + 1).some(
        x => !x.section && x.roles?.includes(r)
          && !menu.slice(i + 1, menu.indexOf(x)).some(y => y.section)
      );
      if (hasVisible) result.push(item);
    } else {
      if (item.roles?.includes(r)) result.push(item);
    }
  }
  return result;
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAuth();

  const visibleMenu = filterMenu(MENU, role);

  const handleNavigate = (path: string) => {
    router.push(path);
    onMobileClose?.();
  };

  return (
    <div className={`sb${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      <div className="sb-h" onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
        <div className="sb-logo-row">
          <div className="sb-logo-icon">
            <img src="/logo.png" alt="Meercatch" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6, boxSizing: 'border-box' }} />
          </div>
          <div className="sb-logo-text">Meercatch Manager</div>
        </div>
      </div>

      <nav className="sb-nav">
        {visibleMenu.map((item, i) => {
          if (item.section) return <div key={i} className="ns">{item.section}</div>;
          const isActive = item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path!);
          return (
            <div key={item.id} className={`ni${isActive ? ' a' : ''}`} onClick={() => handleNavigate(item.path!)}>
              <span className="ic"><SvgIcon paths={IC[item.icon!]} /></span>
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
