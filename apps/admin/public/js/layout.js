/* ============================================================
   layout.js — App shell, sidebar, header
============================================================ */

const MENU = [
  { section: '메인' },
  { id:'dashboard', icon:'📊', label:'대시보드' },
  { section: '운영 관리' },
  { id:'groups',      icon:'🏫', label:'그룹 관리' },
  { id:'devices',     icon:'📱', label:'단말기 관리' },
  { id:'policies',    icon:'🛡️', label:'정책 관리' },
  { id:'pauses-list', icon:'⏸️', label:'탐지중단' },
  { section: '모니터링' },
  { id:'detections',    icon:'🔍', label:'탐지 현황' },
  { id:'pauses-history',icon:'📜', label:'중단 이력' },
  { section: '사용자 관리' },
  { id:'users',       icon:'👥', label:'사용자 관리' },
  { section: '설정' },
  { id:'licenses',      icon:'🔑', label:'라이선스' },
  { id:'notifications', icon:'🔔', label:'알림 설정' },
  { id:'account',       icon:'👤', label:'내 계정' },
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
          '🔔',
          h('span', { class: 'mh-notif-dot' })
        ),
        h('div', { class: 'mh-user', onClick: () => navigate('account') },
          h('div', { class: 'mh-user-avatar' }, D.user.name.charAt(0)),
          h('span', { class: 'mh-user-name' }, D.user.name)
        )
      )
    ),
    h('div', { class: 'mb', id: 'page-body' })
  );

  const app = h('div', { class: 'app' }, sb, mn);
  document.getElementById('app').innerHTML = '';
  document.getElementById('app').appendChild(app);

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
        h('div', { class: 'sb-logo-icon' }, '🦦'),
        h('div', { class: 'sb-logo-text' }, 'Meercatch Manager')
      )
    ),
    h('div', { class: 'sb-u' },
      h('div', { class: 'sb-u-info' },
        h('div', { class: 'sb-u-avatar' }, D.user.name.charAt(0)),
        h('div', { class: 'sb-u-detail' },
          h('div', { class: 'sb-u-name' }, D.user.name),
          h('div', { class: 'sb-u-role' }, roleLabel[D.role] || D.role)
        )
      ),
      h('div', { class: 'sb-u-actions' },
        h('button', { class: 'sb-u-btn', onClick: () => navigate('account') }, '내 계정'),
        h('button', { class: 'sb-u-btn', onClick: () => toast('로그아웃되었습니다.', 'info') }, '로그아웃')
      )
    ),
    nav,
    h('div', { class: 'sb-collapse-btn' },
      h('button', { class: 'sb-toggle', id: 'sb-toggle', onClick: toggleSidebar, title: '사이드바 접기' }, '◀')
    )
  );

  return sb;
}

function buildMenuItems(container) {
  MENU.forEach(item => {
    if (item.section) {
      container.appendChild(h('div', { class: 'ns' }, item.section));
      return;
    }
    if (item.children) {
      const isExpanded = _expanded[item.id] !== false; // default open
      const sub = h('div', { class: 'ni-sub' + (isExpanded ? ' open' : ''), id: 'sub-' + item.id });
      const arr = h('span', { class: 'arr' + (isExpanded ? ' open' : '') }, '▾');
      const parent = h('div', { class: 'ni', id: 'ni-' + item.id,
        onClick: () => toggleParent(item.id)
      },
        h('span', { class: 'ic' }, item.icon),
        h('span', { class: 'ni-txt' }, item.label),
        arr
      );

      item.children.forEach(child => {
        const childEl = h('div', { class: 'ni', id: 'ni-' + child.id,
          onClick: () => navigate(child.id)
        },
          h('span', { class: 'ic' }, child.icon),
          h('span', { class: 'ni-txt' }, child.label)
        );
        sub.appendChild(childEl);
      });

      container.appendChild(parent);
      container.appendChild(sub);
    } else {
      const ni = h('div', { class: 'ni', id: 'ni-' + item.id,
        onClick: () => navigate(item.id)
      },
        h('span', { class: 'ic' }, item.icon),
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
    'users-list':       '사용자 목록',
    'users-new':        '사용자 등록',
    'users-detail':     '사용자 상세',
    'pauses-list':      '탐지 중단 현황',
    'pauses-new':       '중단 설정',
    'pauses-history':   '중단 이력',
    'licenses':         '라이선스',
    'notifications':    '알림 설정',
    'account':          '내 계정',
  };
  return titleMap[pageId] || pageId;
}
