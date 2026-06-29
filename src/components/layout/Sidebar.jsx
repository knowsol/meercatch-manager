'use client'
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const IC = {
  dashboard:         '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  groups:            '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  classes:           '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  devices:           '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>',
  policies:          '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  pauses:            '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  detections:        '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  reports:           '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  users:             '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  students:          '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  licenses:          '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  notifications:     '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  account:           '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  components:        '<rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/><rect x="2" y="15" width="6" height="6" rx="1"/><rect x="10" y="3" width="4" height="18"/>',
  urls:              '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
  'detection-policy':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  whitelist:         '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
  blacklist:         '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>',
  'app-versions':    '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  'audit-logs':      '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
  'policy-settings': '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
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
  { id: 'dashboard',        icon: 'dashboard',        label: '대시보드',        short: '홈',       path: '/',                 common: true  },
  { section: '운영 관리' },
  { id: 'groups',           icon: 'groups',           label: '기관 관리',       short: '기관',     path: '/groups',           common: false },
  { id: 'classes',          icon: 'classes',          label: '그룹 관리',       short: '그룹',     path: '/classes',          common: true  },
  { id: 'students',         icon: 'students',         label: '학생 관리',       short: '학생',     path: '/students',         common: true  },
  { id: 'devices',          icon: 'devices',          label: '단말기 관리',     short: '단말기',   path: '/devices',          common: true  },
  { id: 'policies',         icon: 'policies',         label: '정책 관리',       short: '정책',     path: '/policies',         common: false },
  { section: '모니터링' },
  { id: 'detections',       icon: 'detections',       label: '탐지 현황',       short: '탐지',     path: '/detections',       common: true  },
  { id: 'reports',          icon: 'reports',          label: '보고서',          short: '보고서',   path: '/reports',          common: true  },
  { section: '직원 관리' },
  { id: 'users',            icon: 'users',            label: '계정 현황',       short: '계정',     path: '/users',            common: true  },
  { section: '설정' },
  { id: 'licenses',         icon: 'licenses',         label: '라이선스',        short: '라이선스', path: '/licenses',         common: true  },
  { id: 'policy-settings',  icon: 'policy-settings',  label: '정책 설정',       short: '정책설정', path: '/policy-settings',  common: false, isNew: true },
  { id: 'account',          icon: 'account',          label: '내 계정',         short: '내계정',   path: '/account',          common: true  },
  { section: '운영 설정' },
  { id: 'detection-policy', icon: 'detection-policy', label: '예외 서비스 관리', short: '예외서비스', path: '/detection-policy', common: true  },
  { id: 'whitelist',        icon: 'whitelist',        label: '화이트리스트 관리', short: '화이트',  path: '/whitelist',       common: true  },
  { id: 'blacklist',        icon: 'blacklist',        label: '블랙리스트 관리', short: '블랙',     path: '/blacklist',        common: true  },
  { section: '관리자 전용' },
  { id: 'audit-logs',       icon: 'audit-logs',       label: '감사 로그',       short: '감사로그', path: '/audit-logs',       common: true,  isSystem: true },
  { id: 'app-versions',     icon: 'app-versions',     label: '앱 버전 관리',    short: '앱버전',   path: '/app-versions',     common: true,  isSystem: true },
  { id: 'valid-urls',       icon: 'urls',             label: '검증 URL 현황',   short: 'URL',      path: '/valid-urls',       common: false, isSystem: true },
  { section: '참고자료' },
  { id: 'components',      icon: 'components',       label: '컴포넌트 모음',   short: '컴포넌트', path: '/components',       common: true },
  { id: 'table-guide',     icon: 'reports',          label: '기본 레이아웃',   short: '기본',     path: '/components/table', common: true },
  { id: 'image-guide',     icon: 'reports',          label: '이미지 레이아웃', short: '이미지',   path: '/components/image', common: true },
  { id: 'tab-guide',       icon: 'reports',          label: '탭 레이아웃',     short: '탭',       path: '/components/tab',   common: true },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { userName, logout } = useAuth();

  const initial = userName ? userName.charAt(0) : 'a';

  const handleNavigate = (path) => {
    router.push(path);
    onMobileClose?.();
  };

  return (
    <div className={`sb${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sb-h" style={{ cursor: 'pointer' }}>
        <div className="sb-logo-row" onClick={() => handleNavigate('/')}>
          <div className="sb-logo-icon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/symbol.png" alt="symbol" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} />
          </div>
          <div className="sb-logo-text">Meercatch Manager</div>
        </div>
        <button
          className="sb-toggle"
          onClick={e => { e.stopPropagation(); setCollapsed(c => !c); }}
          style={{ marginLeft: 'auto', flexShrink: 0 }}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* 학년도 / 학교 선택 */}
      {!collapsed && (
        <div style={{ padding: '10px 8px', display: 'flex', gap: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <select
            defaultValue="2026"
            disabled
            style={{
              flex: 2, minWidth: 0, padding: '7px 6px', fontSize: 12,
              background: 'rgb(16 19 30)', color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgb(51 51 51)', borderRadius: 4,
              cursor: 'not-allowed', outline: 'none', opacity: 1,
            }}
          >
            <option value="2026">2026 학년도</option>
            <option value="2025">2025 학년도</option>
            <option value="2024">2024 학년도</option>
            <option value="2023">2023 학년도</option>
          </select>
          <select
            defaultValue="1"
            style={{
              flex: 3, minWidth: 0, padding: '7px 6px', fontSize: 12,
              background: 'rgb(16 19 30)', color: '#fff',
              border: '1px solid rgb(51 51 51)', borderRadius: 4,
              cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="1">부산광역시교육청</option>
            <option value="2">부산초등학교</option>
            <option value="3">해운대중학교</option>
            <option value="4">동래고등학교</option>
            <option value="5">부산진초등학교</option>
            <option value="6">사직중학교</option>
            <option value="7">경남고등학교</option>
            <option value="8">연제초등학교</option>
            <option value="9">금정중학교</option>
            <option value="10">부산여자고등학교</option>
            <option value="11">남산초등학교</option>
          </select>
        </div>
      )}

      {/* Nav */}
      <nav className="sb-nav">
        {MENU.map((item, i) => {
          if (item.section) return <div key={i} className="ns">{item.section}</div>;
          const isActive = item.path === '/'
            ? pathname === '/'
            : pathname === item.path || (pathname.startsWith(item.path + '/') && item.path !== '/');
          return (
            <div key={item.id} className={`ni${isActive ? ' a' : ''}`} onClick={() => handleNavigate(item.path)}>
              <span className="ic"><SvgIcon paths={IC[item.icon]} /></span>
              <span className="ni-txt">{item.label}</span>
              <span className="ni-short">{item.short}</span>
              {!collapsed && item.isNew && (
                <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '1px 5px', borderRadius: 3, marginLeft: 'auto', flexShrink: 0 }}>NEW</span>
              )}
              {!collapsed && item.isSystem && (
                <span style={{ fontSize: 10, fontWeight: 600, background: 'rgba(100,116,139,0.25)', color: 'rgba(148,163,184,0.9)', padding: '1px 5px', borderRadius: 3, marginLeft: 'auto', flexShrink: 0 }}>시스템</span>
              )}
              {!collapsed && !item.common && !item.isNew && !item.isSystem && (
                <span style={{ fontSize: 10, fontWeight: 600, background: 'rgba(99,102,241,0.25)', color: 'rgba(165,168,255,0.9)', padding: '1px 5px', borderRadius: 3, marginLeft: 'auto', flexShrink: 0 }}>교육청</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom: user */}
      <div className="sb-bottom">
        {/* User row */}
        <div className="sb-user-row" style={{ position: 'relative' }}>
          <div className="sb-user" onClick={() => setShowDropdown(d => !d)}>
            <div className="sb-user-avatar">{initial}</div>
            {!collapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                <span className="sb-user-name">{userName || '홍길동'}</span>
                <span style={{ fontSize: 11, color: 'var(--t3)', opacity: 0.7 }}>관리자</span>
              </div>
            )}
          </div>

          {showDropdown && (
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: '100%', left: 0, marginBottom: 6,
                background: 'var(--bg1)', border: '1px solid var(--bd)',
                borderRadius: 4, boxShadow: '0 4px 16px rgba(0,0,0,.25)',
                minWidth: 140, zIndex: 300, overflow: 'hidden',
              }}
            >
              <div
                onClick={() => { setShowDropdown(false); router.push('/account'); }}
                style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >정보수정</div>
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

    </div>
  );
}
