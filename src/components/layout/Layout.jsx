'use client'
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import PanelShell from '../common/Panel';
import ToastContainer from '../common/Toast';
import { useToast } from '../../hooks/useToast';
import { DUMMY } from '../../data/dummy';
import { createContext, useContext } from 'react';

const ToastCtx = createContext(() => {});
export const useToastCtx = () => useContext(ToastCtx);

const PageActionsCtx = createContext(() => {});
export const useSetPageActions = () => useContext(PageActionsCtx);

const PAGE_TITLES = {
  '/':              '대시보드',
  '/groups':        '기관 관리',
  '/classes':       '그룹 관리',
  '/devices':       '단말기 관리',
  '/policies':      '정책 관리',
  '/pauses':        '탐지중단',
  '/pauses-history':'탐지 중단 이력',
  '/students':      '학생 관리',
  '/detections':    '탐지 현황',
  '/reports':       '보고서',
  '/users':         '직원 관리',
  '/licenses':          '라이선스',
  '/notifications':     '알림 설정',
  '/policy-settings':   '정책 설정',
  '/account':           '내 계정',
  '/components':              '컴포넌트',
  '/components/table':        '기본 레이아웃',
  '/components/image':        '이미지 레이아웃',
  '/components/tab':          '탭 레이아웃',
  '/detection-policy':  '예외 서비스 관리',
  '/whitelist':         '화이트리스트 관리',
  '/blacklist':         '블랙리스트 관리',
  '/valid-urls':        '유효 URL 관리',
  '/app-versions':      '앱 버전 관리',
  '/audit-logs':        '감사 로그',
};


function ExpiryBanner({ onDismiss }) {
  const router = useRouter();
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
      <svg width="16" height="16" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span style={{ flex: 1 }}>
        라이선스 만료 임박: {expiring.length}개 라이선스가 14일 이내에 만료됩니다.
        {' '}(가장 빠른 만료: <strong>{top.os}</strong> — {days}일 후)
      </span>
      <button
        onClick={() => router.push('/licenses')}
        style={{
          background: 'none', border: '1px solid #f59e0b', cursor: 'pointer',
          color: '#b45309', fontSize: 12, fontWeight: 600,
          padding: '4px 10px', borderRadius: 4, whiteSpace: 'nowrap',
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
  const pathname = usePathname();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageActions, setPageActions] = useState(null);

  const title = PAGE_TITLES[pathname] || '대시보드';

  return (
    <ToastCtx.Provider value={toast}>
      <div className="app">
        {mobileOpen && <div className="sb-overlay" onClick={() => setMobileOpen(false)} />}
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="mn">
          {/* Header */}
          <div className="mh">
            <button className="mh-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="메뉴 열기">
              <span /><span /><span />
            </button>
            <div className="mh-page-title">{title}</div>
            {pageActions && <div className="mh-actions">{pageActions}</div>}
          </div>

          {/* License expiry banner */}
          {!bannerDismissed && <ExpiryBanner onDismiss={() => setBannerDismissed(true)} />}

          {/* Page body */}
          <PageActionsCtx.Provider value={setPageActions}>
            <div className="mb">{children}</div>
          </PageActionsCtx.Provider>
        </div>
        <PanelShell />
        <ToastContainer toasts={toasts} />
      </div>
    </ToastCtx.Provider>
  );
}
