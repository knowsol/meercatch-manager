/* ============================================================
   app.js — Router + App initialization
============================================================ */

/* ── Panel System ───────────────────────────────────────── */
const PANEL_PAGES = {
  'groups-new':      { parent: 'groups-list',   renderFn: ()   => renderGroupNewPanel() },
  'groups-detail':   { parent: 'groups-list',   renderFn: (id) => renderGroupDetailPanel(id) },
  'devices-detail':  { parent: 'devices-list',  renderFn: (id) => renderDeviceDetailPanel(id) },
  'policies-new':    { parent: 'policies-list', renderFn: ()   => renderPolicyNewPanel() },
  'policies-detail': { parent: 'policies-list', renderFn: (id) => renderPolicyDetailPanel(id) },
  'users-new':       { parent: 'users-list',    renderFn: ()   => renderUserNewPanel() },
  'users-detail':    { parent: 'users-list',    renderFn: (id) => renderUserDetailPanel(id) },
  'pauses-new':      { parent: 'pauses-list',   renderFn: ()   => renderPauseNewPanel() },
  'detections-detail': { parent: 'detections', renderFn: (id) => renderDetectionDetailPanel(id) },
};

function openPanel(contentEl) {
  const pnl = document.getElementById('pnl');
  const overlay = document.getElementById('pnl-overlay');
  if (!pnl || !overlay) return;
  pnl.innerHTML = '';
  pnl.appendChild(contentEl);
  overlay.classList.add('open');
  requestAnimationFrame(() => pnl.classList.add('open'));
}

function closePanel() {
  const pnl = document.getElementById('pnl');
  const overlay = document.getElementById('pnl-overlay');
  if (!pnl || !overlay) return;
  pnl.classList.remove('open');
  overlay.classList.remove('open');
  setTimeout(() => { if (!pnl.classList.contains('open')) pnl.innerHTML = ''; }, 300);
}

/**
 * navigate(pageId, paramId)
 * Update hash and trigger render.
 */
function navigate(pageId, paramId) {
  const hash = paramId ? `#${pageId}/${paramId}` : `#${pageId}`;
  window.location.hash = hash;
}

/**
 * parseHash() — parse current hash
 * Returns { pageId, paramId }
 */
function parseHash() {
  const raw = window.location.hash.slice(1); // remove '#'
  if (!raw) return { pageId: 'dashboard', paramId: null };
  const parts = raw.split('/');
  return { pageId: parts[0], paramId: parts[1] || null };
}

/**
 * renderPageContent(pageId, paramId) — mount a full page into #page-body
 */
function renderPageContent(pageId, paramId) {
  D.currentPage = pageId;

  const body = document.getElementById('page-body');
  if (!body) return;

  // Close mobile sidebar on navigation
  const sb = document.getElementById('sidebar');
  const sbOverlay = document.getElementById('sb-overlay');
  if (sb && sb.classList.contains('mobile-open')) {
    sb.classList.remove('mobile-open');
    if (sbOverlay) sbOverlay.classList.remove('show');
  }

  // Set active menu + title
  setActive(pageId);
  setPageTitle(getPageTitle(pageId));

  // Render page content
  let pageEl = null;
  switch (pageId) {
    case 'dashboard':      pageEl = renderDashboard(); break;
    case 'groups':
    case 'groups-list':    pageEl = renderGroupList(); break;
    case 'devices':
    case 'devices-list':   pageEl = renderDeviceList(); break;
    case 'policies':
    case 'policies-list':  pageEl = renderPolicyList(); break;
    case 'detections':     pageEl = renderDetections(); break;
    case 'users':
    case 'users-list':     pageEl = renderUserList(); break;
    case 'pauses':
    case 'pauses-list':    pageEl = renderPauseList(); break;
    case 'pauses-history': pageEl = renderPauseHistory(); break;
    case 'licenses':       pageEl = renderLicenses(); break;
    case 'notifications':  pageEl = renderNotifications(); break;
    case 'account':        pageEl = renderAccount(); break;
    default:
      pageEl = h('div', { class: 'empty' },
        h('div', { class: 'empty-icon' }, '🔍'),
        h('div', { class: 'empty-title' }, '페이지를 찾을 수 없습니다'),
        h('button', { class: 'btn btn-p', style: { marginTop: '16px' }, onClick: () => navigate('dashboard') }, '대시보드로')
      );
  }

  // Scroll to top and mount
  body.scrollTop = 0;
  body.innerHTML = '';
  if (pageEl) body.appendChild(pageEl);
}

/**
 * render(pageId, paramId) — route to panel or full page
 */
function render(pageId, paramId) {
  if (PANEL_PAGES[pageId]) {
    const { parent, renderFn } = PANEL_PAGES[pageId];
    if (D.currentPage !== parent) {
      renderPageContent(parent, null);
    }
    openPanel(renderFn(paramId));
    return;
  }
  closePanel();
  renderPageContent(pageId, paramId);
}

/**
 * Hash change handler
 */
window.addEventListener('hashchange', () => {
  const { pageId, paramId } = parseHash();
  render(pageId, paramId);
});

/**
 * Init on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Build app shell
  buildApp();

  // Route to initial page
  const { pageId, paramId } = parseHash();
  render(pageId, paramId);
});
