/* ============================================================
   layout.js — App shell, sidebar, header
============================================================ */

function svgIcon(paths, size) {
  const s = size || 18;
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('width', s); svg.setAttribute('height', s); svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','2');
  svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
  svg.innerHTML = paths;
  return svg;
}
const IC = {
  dashboard:   '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  groups:      '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  devices:     '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/>',
  policies:    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  pauses:      '<circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/>',
  detections:  '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  history:     '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  users:       '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
  licenses:    '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  notifications:'<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  account:     '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};

const MENU = [
  { section: '메인' },
  { id:'dashboard', iconKey:'dashboard', label:'대시보드' },
  { section: '운영 관리' },
  { id:'groups',      iconKey:'groups',    label:'그룹 관리' },
  { id:'devices',     iconKey:'devices',   label:'단말기 관리' },
  { id:'policies',    iconKey:'policies',  label:'정책 관리' },
  { id:'pauses-list', iconKey:'pauses',    label:'탐지중단' },
  { section: '모니터링' },
  { id:'detections',    iconKey:'detections',  label:'탐지 현황' },
  { section: '직원 관리' },
  { id:'users',       iconKey:'users',     label:'직원 관리' },
  { section: '설정' },
  { id:'licenses',      iconKey:'licenses',      label:'라이선스' },
  { id:'notifications', iconKey:'notifications', label:'알림 설정' },
  { id:'account',       iconKey:'account',       label:'내 계정' },
];

// Track expanded state for parent menu items
const _expanded = {};

function buildApp() {
  const sb = buildSidebar();
  const mn = h('div', { class: 'mn' },
    h('div', { class: 'mh', id: 'main-header' },
      h('button', { class: 'hamburger', id: 'hamburger', onClick: toggleMobileSidebar }, '☰'),
      h('div', { class: 'mh-title', id: 'page-title' }, '대시보드'),
      h('div', { class: 'mh-actions' },
        h('button', { class: 'mh-icon-btn', title: '알림', onClick: () => navigate('notifications') },
          (function(){ const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','18');s.setAttribute('height','18');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');s.innerHTML='<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>';return s;})(),
          h('span', { class: 'mh-notif-dot' })
        ),
        (function(){
          const dropdown = h('div', { style:'display:none;position:absolute;top:100%;right:0;margin-top:6px;background:#fff;border:1px solid var(--bd);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.1);min-width:140px;z-index:200;overflow:hidden' },
            h('div', { style:'padding:10px 14px;font-size:13px;cursor:pointer;transition:background .1s', onMouseEnter:function(){this.style.background='#f1f5f9'}, onMouseLeave:function(){this.style.background='transparent'}, onClick: () => { dropdown.style.display='none'; navigate('account'); } }, '마이페이지'),
            h('div', { style:'padding:10px 14px;font-size:13px;cursor:pointer;color:#ef4444;border-top:1px solid var(--bd);transition:background .1s', onMouseEnter:function(){this.style.background='#fef2f2'}, onMouseLeave:function(){this.style.background='transparent'}, onClick: () => { dropdown.style.display='none'; showLoginPage(); } }, '로그아웃')
          );
          const userBtn = h('div', { class: 'mh-user', style:'position:relative;cursor:pointer', onClick: (e) => { e.stopPropagation(); dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none'; } },
            h('div', { class: 'mh-user-avatar' }, D.user.name.charAt(0)),
            h('span', { class: 'mh-user-name' }, D.user.name),
            dropdown
          );
          document.addEventListener('click', () => { dropdown.style.display = 'none'; });
          return userBtn;
        })()
      )
    ),
    h('div', { class: 'mb', id: 'page-body' })
  );

  const app = h('div', { class: 'app' }, sb, mn);
  document.getElementById('app').innerHTML = '';
  document.getElementById('app').appendChild(app);

  // Expiry banner — show if any license expires within 14 days
  (function() {
    const today = new Date(); today.setHours(0,0,0,0);
    const deadline = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const expiring = (DUMMY.licenses || []).filter(l => {
      const d = new Date(l.validTo); d.setHours(0,0,0,0);
      return d >= today && d <= deadline;
    }).sort((a,b) => new Date(a.validTo) - new Date(b.validTo));
    if (!expiring.length) return;
    const top = expiring[0];
    const days = Math.ceil((new Date(top.validTo) - today) / 86400000);
    const banner = h('div', { id:'expiry-banner', style:'background:#fef3c7;border-bottom:1px solid #f59e0b;padding:10px 20px;display:flex;align-items:center;gap:10px;font-size:13px;color:#92400e;flex-shrink:0' },
      h('span', { style:'font-size:15px;flex-shrink:0' }, '⚠️'),
      h('span', { style:'flex:1' },
        `라이선스 만료 임박: ${expiring.length}개 라이선스가 14일 이내에 만료됩니다. (가장 빠른 만료: `,
        h('strong', {}, top.os),
        ` — ${days}일 후)`
      ),
      h('button', { style:'background:none;border:none;cursor:pointer;color:#b45309;font-size:12px;font-weight:600;padding:4px 10px;border:1px solid #f59e0b;border-radius:6px;white-space:nowrap', onClick: () => { D._autoOpenLicense = top; render('licenses', null); } }, '라이선스 보기'),
      h('button', { style:'background:none;border:none;cursor:pointer;color:#92400e;font-size:18px;padding:0 2px 0 8px;line-height:1', onClick: function(){ this.closest('#expiry-banner').remove(); } }, '×')
    );
    const mn = document.querySelector('.mn');
    const mb = document.getElementById('page-body');
    if (mn && mb) mn.insertBefore(banner, mb);
  })();

  // Mobile sidebar overlay
  document.getElementById('sb-overlay').addEventListener('click', toggleMobileSidebar);

  // Panel overlay + panel container
  document.getElementById('pnl-overlay')?.remove();
  document.getElementById('pnl')?.remove();

  const pnlOverlay = h('div', { id: 'pnl-overlay', class: 'pnl-overlay' });
  const pnl = h('div', { id: 'pnl', class: 'pnl' });
  pnlOverlay.addEventListener('click', () => typeof closePanel === 'function' && closePanel());
  document.body.appendChild(pnlOverlay);
  document.body.appendChild(pnl);
}

function buildSidebar() {
  const nav = h('div', { class: 'sb-nav', id: 'sb-nav' });
  buildMenuItems(nav);

  const roleLabel = { admin:'관리자', staff:'운영자', teacher:'교사' };

  const sb = h('div', { class: 'sb' + (D.sbCollapsed ? ' collapsed' : ''), id: 'sidebar' },
    h('div', { class: 'sb-h' },
      h('div', { class: 'sb-logo-row' },
        h('div', { class: 'sb-logo-icon' }, 'M'),
        h('div', { class: 'sb-logo-text' }, 'Meercatch Manager')
      )
    ),
    h('div', { class: 'sb-u', style:'display:none' }
    ),
    nav
  );

  return sb;
}

const DIRECT_MENU_IDS = new Set(['dashboard', 'devices', 'detections', 'users', 'licenses']);

function buildMenuItems(container) {
  const isDirect = D.loginRole === 'direct';
  MENU.forEach(item => {
    if (isDirect && item.id && !DIRECT_MENU_IDS.has(item.id)) return;
    if (isDirect && item.section && !['메인', '운영 관리', '모니터링', '직원 관리', '설정'].includes(item.section)) return;
    if (item.section) {
      container.appendChild(h('div', { class: 'ns' }, item.section));
      return;
    }
    if (item.children) {
      const isExpanded = _expanded[item.id] !== false; // default open
      const sub = h('div', { class: 'ni-sub' + (isExpanded ? ' open' : ''), id: 'sub-' + item.id });
      const arr = h('span', { class: 'arr' + (isExpanded ? ' open' : '') }, '▾');
      const parentIcEl = h('span', { class: 'ic' }); if (item.iconKey && IC[item.iconKey]) parentIcEl.appendChild(svgIcon(IC[item.iconKey]));
      const parent = h('div', { class: 'ni', id: 'ni-' + item.id,
        onClick: () => toggleParent(item.id)
      },
        parentIcEl,
        h('span', { class: 'ni-txt' }, item.label),
        arr
      );

      item.children.forEach(child => {
        const childIcEl = h('span', { class: 'ic' }); if (child.iconKey && IC[child.iconKey]) childIcEl.appendChild(svgIcon(IC[child.iconKey]));
        const childEl = h('div', { class: 'ni', id: 'ni-' + child.id,
          onClick: () => navigate(child.id)
        },
          childIcEl,
          h('span', { class: 'ni-txt' }, child.label)
        );
        sub.appendChild(childEl);
      });

      container.appendChild(parent);
      container.appendChild(sub);
    } else {
      const niIcEl = h('span', { class: 'ic' }); if (item.iconKey && IC[item.iconKey]) niIcEl.appendChild(svgIcon(IC[item.iconKey]));
      const ni = h('div', { class: 'ni', id: 'ni-' + item.id,
        onClick: () => navigate(item.id)
      },
        niIcEl,
        h('span', { class: 'ni-txt' }, item.label)
      );
      container.appendChild(ni);
    }
  });
}

function toggleParent(id) {
  _expanded[id] = !(_expanded[id] !== false);
  const sub = document.getElementById('sub-' + id);
  const ni = document.getElementById('ni-' + id);
  const arr = ni ? ni.querySelector('.arr') : null;
  if (sub) sub.classList.toggle('open');
  if (arr) arr.classList.toggle('open');
}

function toggleSidebar() {
  D.sbCollapsed = !D.sbCollapsed;
  const sb = document.getElementById('sidebar');
  const btn = document.getElementById('sb-toggle');
  if (sb) sb.classList.toggle('collapsed', D.sbCollapsed);
  if (btn) btn.textContent = D.sbCollapsed ? '▶' : '◀';
}

function toggleMobileSidebar() {
  const sb = document.getElementById('sidebar');
  const overlay = document.getElementById('sb-overlay');
  if (!sb) return;
  const open = sb.classList.toggle('mobile-open');
  if (overlay) overlay.classList.toggle('show', open);
}

function setActive(pageId) {
  // Remove all active states
  document.querySelectorAll('.ni').forEach(el => {
    el.classList.remove('a', 'parent-active');
  });

  // Find and activate the target
  const target = document.getElementById('ni-' + pageId);
  if (target) {
    target.classList.add('a');
    // Auto-expand parent
    MENU.forEach(item => {
      if (item.children) {
        const child = item.children.find(c => c.id === pageId);
        if (child) {
          const parentEl = document.getElementById('ni-' + item.id);
          const sub = document.getElementById('sub-' + item.id);
          const arr = parentEl ? parentEl.querySelector('.arr') : null;
          if (parentEl) parentEl.classList.add('parent-active');
          if (sub && !sub.classList.contains('open')) {
            sub.classList.add('open');
            if (arr) arr.classList.add('open');
            _expanded[item.id] = true;
          }
        }
      }
    });
    // Scroll menu item into view
    target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  } else {
    // Maybe it's a parent page like 'groups' — set the first child
    const parentItem = MENU.find(m => m.id === pageId);
    if (parentItem) {
      const el = document.getElementById('ni-' + pageId);
      if (el) el.classList.add('a');
    }
  }
}

function setPageTitle(title) {
  const el = document.getElementById('page-title');
  if (el) el.textContent = title;
}

function getPageTitle(pageId) {
  const titleMap = {
    'dashboard':        '대시보드',
    'groups-list':      '그룹 목록',
    'groups-new':       '그룹 생성',
    'groups-detail':    '그룹 상세',
    'devices-list':     '단말기 목록',
    'devices-detail':   '단말기 상세',
    'policies-list':    '정책 목록',
    'policies-new':     '정책 생성',
    'policies-detail':  '정책 상세',
    'detections':       '탐지 현황',
    'users-list':       '직원 목록',
    'users-new':        '직원 등록',
    'users-detail':     '직원 상세',
    'pauses-list':      '탐지 중단 현황',
    'pauses-new':       '중단 설정',
    'pauses-history':   '중단 이력',
    'licenses':         '라이선스',
    'notifications':    '알림 설정',
    'account':          '내 계정',
  };
  return titleMap[pageId] || pageId;
}
