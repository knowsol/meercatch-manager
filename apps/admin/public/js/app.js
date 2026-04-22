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
 * showLoginPage() — show login screen before app
 */
function showLoginPage() {
  D.loginRole = null;
  const appEl = document.getElementById('app');
  appEl.innerHTML = '';

  const BG = 'min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)';
  const page = h('div', { style: BG });
  appEl.appendChild(page);

  function mkLogo(subtitle) {
    return h('div', { style:'text-align:center;margin-bottom:40px' },
      h('div', { style:'font-size:32px;font-weight:800;color:#1e293b;letter-spacing:-1px;margin-bottom:6px' }, 'Meercatch Manager'),
      h('div', { style:'font-size:14px;color:#64748b' }, subtitle)
    );
  }

  function svgIcon40(paths) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','40');svg.setAttribute('height','40');svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('fill','none');svg.setAttribute('stroke','#3b82f6');svg.setAttribute('stroke-width','1.5');
    svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
    svg.innerHTML = paths; return svg;
  }

  function backBtn(onClick) {
    const btn = h('button', { style:'background:none;border:none;color:#64748b;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:4px;margin-bottom:24px;padding:0' }, '← 뒤로');
    btn.addEventListener('click', onClick);
    return btn;
  }

  /* ── Screen: card selection ── */
  function showCards() {
    page.innerHTML = '';
    page.appendChild(mkLogo('로그인 유형을 선택하세요'));

    function loginCard(label, desc, iconPath, onClick) {
      const card = h('div', { style:'width:220px;padding:32px 24px;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);cursor:pointer;transition:box-shadow .2s,transform .2s;text-align:center;border:2px solid transparent' });
      card.appendChild(svgIcon40(iconPath));
      card.appendChild(h('div', { style:'font-size:18px;font-weight:700;color:#1e293b;margin:12px 0 4px' }, label));
      card.appendChild(h('div', { style:'font-size:13px;color:#64748b;line-height:1.5' }, desc));
      card.addEventListener('mouseenter', () => { card.style.boxShadow='0 8px 32px rgba(59,130,246,.2)'; card.style.transform='translateY(-3px)'; card.style.borderColor='#3b82f6'; });
      card.addEventListener('mouseleave', () => { card.style.boxShadow='0 4px 24px rgba(0,0,0,.08)'; card.style.transform=''; card.style.borderColor='transparent'; });
      card.addEventListener('click', onClick);
      return card;
    }

    page.appendChild(h('div', { style:'display:flex;gap:24px;flex-wrap:wrap;justify-content:center' },
      loginCard('직접 관리', '',
        '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>',
        () => showPinLogin()),
      loginCard('매니저 관리', '',
        '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
        () => showManagerLogin())
    ));
  }

  /* ── Screen: Manager ID / PW login ── */
  function showManagerLogin() {
    page.innerHTML = '';

    const box = h('div', { style:'width:360px;background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.1);padding:40px 36px' });
    box.appendChild(backBtn(showCards));
    box.appendChild(mkLogo('매니저 관리 로그인'));

    const INP = 'width:100%;box-sizing:border-box;padding:11px 14px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;transition:border .15s';
    const idInp = h('input', { type:'text', placeholder:'아이디', style:INP });
    const pwInp = h('input', { type:'password', placeholder:'비밀번호', style:INP });
    [idInp, pwInp].forEach(inp => {
      inp.addEventListener('focus', () => inp.style.border='1px solid #3b82f6');
      inp.addEventListener('blur', () => inp.style.border='1px solid #e2e8f0');
    });

    const errMsg = h('div', { style:'font-size:12px;color:#ef4444;min-height:18px;margin-top:4px' });

    const loginBtn = h('button', { style:'width:100%;padding:12px;background:#3b82f6;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px;transition:background .15s' }, '로그인');
    loginBtn.addEventListener('mouseenter', () => loginBtn.style.background='#2563eb');
    loginBtn.addEventListener('mouseleave', () => loginBtn.style.background='#3b82f6');
    loginBtn.addEventListener('click', () => {
      const id = idInp.value.trim() || '매니저';
      D.loginRole = 'manager';
      D.user.name = id;
      buildApp();
      navigate('dashboard');
    });

    pwInp.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });

    box.appendChild(h('div', { style:'display:flex;flex-direction:column;gap:12px' },
      h('div', {}, idInp),
      h('div', {}, pwInp),
      errMsg,
      loginBtn
    ));

    page.appendChild(box);
  }

  /* ── Screen: Direct ID/PW login ── */
  function showPinLogin() {
    page.innerHTML = '';

    const box = h('div', { style:'width:360px;background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.1);padding:40px 36px' });
    box.appendChild(backBtn(showCards));
    box.appendChild(mkLogo('직접 관리 로그인'));

    const INP = 'width:100%;box-sizing:border-box;padding:11px 14px;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;transition:border .15s';
    const idInp = h('input', { type:'text', placeholder:'아이디', style:INP });
    const pwInp = h('input', { type:'password', placeholder:'비밀번호', style:INP });
    [idInp, pwInp].forEach(inp => {
      inp.addEventListener('focus', () => inp.style.border='1px solid #3b82f6');
      inp.addEventListener('blur',  () => inp.style.border='1px solid #e2e8f0');
    });

    const loginBtn = h('button', { style:'width:100%;padding:12px;background:#3b82f6;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-top:8px;transition:background .15s' }, '로그인');
    loginBtn.addEventListener('mouseenter', () => loginBtn.style.background='#2563eb');
    loginBtn.addEventListener('mouseleave', () => loginBtn.style.background='#3b82f6');
    loginBtn.addEventListener('click', () => {
      const id = idInp.value.trim() || '직접관리자';
      D.loginRole = 'direct';
      D.user.name = id;
      buildApp();
      navigate('dashboard');
    });

    pwInp.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });

    box.appendChild(h('div', { style:'display:flex;flex-direction:column;gap:12px' },
      h('div', {}, idInp),
      h('div', {}, pwInp),
      loginBtn
    ));

    page.appendChild(box);
  }

  showCards();
}

/**
 * Init on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  showLoginPage();
});
