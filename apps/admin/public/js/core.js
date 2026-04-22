/* ============================================================
   core.js — DOM helpers, toast, modal, table builder
============================================================ */

/** h(tag, attrs, ...children) — lightweight DOM builder */
function h(tag, attrs) {
  const el = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'html') el.innerHTML = v;
      else if (v !== null && v !== undefined && v !== false) el.setAttribute(k, v);
    });
  }
  for (let i = 2; i < arguments.length; i++) {
    const child = arguments[i];
    if (child == null || child === false) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(c => {
        if (c == null) return;
        if (typeof c === 'string' || typeof c === 'number') el.appendChild(document.createTextNode(c));
        else if (c instanceof Node) el.appendChild(c);
      });
    }
  }
  return el;
}

/** mkBd(cls, text) — colored badge element */
function mkBd(cls, text) {
  return h('span', { class: 'bdg ' + (cls || 'bdg-muted') }, text);
}

/** mkKPI(label, value, sub, colorClass) — KPI card element */
function mkKPI(label, value, sub, colorClass) {
  return h('div', { class: 'kpi' },
    h('div', { class: 'kpi-l' }, label),
    h('div', { class: 'kpi-v' + (colorClass ? ' ' + colorClass : '') }, String(value)),
    sub ? h('div', { class: 'kpi-s' }, sub) : null
  );
}

/** toast(msg, type) — show toast. type: 'ok'|'err'|'warn'|'info' */
function toast(msg, type) {
  type = type || 'ok';
  const icons = { ok: '✓', err: '✕', warn: '!', info: 'i' };
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = h('div', { class: 'toast ' + type },
    h('span', { class: 'toast-icon' }, icons[type] || '✓'),
    h('span', { class: 'toast-msg' }, msg)
  );
  container.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'opacity 0.25s, transform 0.25s';
    setTimeout(() => el.remove(), 280);
  }, 3200);
}

/** ov(title, bodyEl, onSave, onCancel) — modal overlay */
function ov(title, bodyEl, onSave, onCancel) {
  let overlay = null;

  function show() {
    overlay = h('div', { class: 'mov' },
      h('div', { class: 'mod' },
        h('div', { class: 'mod-h' },
          h('div', { class: 'mod-h-title' }, title),
          h('button', { class: 'mod-close', onClick: hide }, '✕')
        ),
        h('div', { class: 'mod-b' }, bodyEl),
        onSave ? h('div', { class: 'mod-f' },
          h('button', { class: 'btn btn-outline', onClick: hide }, '취소'),
          h('button', { class: 'btn btn-p', onClick: () => { onSave(); hide(); } }, '저장')
        ) : h('div', { class: 'mod-f' },
          h('button', { class: 'btn btn-s', onClick: hide }, '닫기')
        )
      )
    );
    overlay.addEventListener('click', (e) => { if (e.target === overlay) hide(); });
    document.body.appendChild(overlay);
  }

  function hide() {
    if (overlay) { overlay.remove(); overlay = null; }
    if (onCancel) onCancel();
  }

  return { show, hide };
}

/** fg(label, inputEl, required) — form group wrapper */
function fg(label, inputEl, required) {
  const lbl = h('label', {},
    label,
    required ? h('span', { class: 'req' }, ' *') : null
  );
  const wrapper = h('div', { class: 'fg' }, lbl, inputEl);
  return wrapper;
}

/** mkTable(cols, rows, onRowClick) — build .dt table */
function mkTable(cols, rows, onRowClick) {
  const thead = h('thead', {},
    h('tr', {},
      ...cols.map(c => {
        const isNodeLabel = c.label instanceof Node;
        const th = h('th', { style: Object.assign(c.width ? { width: c.width } : {}, isNodeLabel ? { textAlign:'center' } : {}) });
        if (isNodeLabel) th.appendChild(c.label);
        else if (c.label != null) th.textContent = c.label;
        return th;
      })
    )
  );
  const tbody = h('tbody', {});
  if (!rows || rows.length === 0) {
    const td = h('td', { colspan: cols.length, style: { padding: '0' } },
      h('div', { class: 'empty' },
        h('div', { class: 'empty-icon' }, '📭'),
        h('div', { class: 'empty-title' }, '데이터가 없습니다')
      )
    );
    tbody.appendChild(h('tr', {}, td));
  } else {
    rows.forEach(row => {
      const tr = h('tr', { class: onRowClick ? 'clickable' : '' });
      if (onRowClick) tr.addEventListener('click', () => onRowClick(row));
      cols.forEach(c => {
        const val = c.render ? c.render(row[c.key], row) : (row[c.key] != null ? row[c.key] : '—');
        const td = h('td', { style: c.align ? { textAlign: c.align } : {} });
        if (val instanceof Node) td.appendChild(val);
        else td.textContent = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  const table = h('table', { class: 'dt' }, thead, tbody);
  return h('div', { class: 'dt-wrap' }, table);
}

/**
 * mkPagination(currentPage, totalPages, onPageChange)
 * Renders: |< < 1 2 3 [4] 5 6 7 > >|
 */
function mkPagination(currentPage, totalPages, onPageChange) {
  const S = {
    wrap: 'display:flex;align-items:center;justify-content:center;gap:4px;padding:8px 0;flex-shrink:0',
    btn: (active, disabled) =>
      `min-width:32px;height:32px;padding:0 6px;border-radius:6px;border:1px solid ${active?'#3b82f6':disabled?'#e2e8f0':'#e2e8f0'};` +
      `background:${active?'#3b82f6':'#fff'};color:${active?'#fff':disabled?'#cbd5e1':'#374151'};` +
      `cursor:${disabled?'default':'pointer'};font-size:13px;font-weight:${active?'600':'400'};` +
      `display:inline-flex;align-items:center;justify-content:center;transition:all .15s`,
  };

  const wrap = h('div', { style: S.wrap });

  function mkBtn(label, page, active=false, disabled=false) {
    const btn = h('button', { style: S.btn(active, disabled) }, label);
    if (!disabled && !active) btn.addEventListener('click', () => onPageChange(page));
    btn.disabled = disabled;
    return btn;
  }

  // |< first, < prev
  wrap.appendChild(mkBtn('|◀', 1, false, currentPage === 1));
  wrap.appendChild(mkBtn('◀', currentPage - 1, false, currentPage === 1));

  // page number buttons (show up to 7 around current)
  const delta = 3;
  let start = Math.max(1, currentPage - delta);
  let end = Math.min(totalPages, currentPage + delta);
  if (end - start < 6) {
    if (start === 1) end = Math.min(totalPages, start + 6);
    else start = Math.max(1, end - 6);
  }
  for (let p = start; p <= end; p++) {
    wrap.appendChild(mkBtn(String(p), p, p === currentPage, false));
  }

  // > next, >| last
  wrap.appendChild(mkBtn('▶', currentPage + 1, false, currentPage === totalPages));
  wrap.appendChild(mkBtn('▶|', totalPages, false, currentPage === totalPages));

  return wrap;
}

/** confirm(msg, onOk) — confirmation modal */
function confirm(msg, onOk) {
  const overlay = h('div', { class: 'mov' },
    h('div', { class: 'mod mod-sm' },
      h('div', { class: 'mod-h' },
        h('div', { class: 'mod-h-title' }, '확인'),
        h('button', { class: 'mod-close', onClick: close }, '✕')
      ),
      h('div', { class: 'mod-b' },
        h('p', { style: { color: 'var(--t1)', lineHeight: '1.6' } }, msg)
      ),
      h('div', { class: 'mod-f' },
        h('button', { class: 'btn btn-outline', onClick: close }, '취소'),
        h('button', { class: 'btn btn-p', onClick: () => { close(); onOk(); } }, '확인')
      )
    )
  );
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.body.appendChild(overlay);
  function close() { overlay.remove(); }
}

/** fmtD(d) — format date string "2026.03.15" */
function fmtD(d) {
  if (!d) return '—';
  const dt = typeof d === 'string' ? d : d.toISOString();
  const m = dt.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return d;
  return `${m[1]}.${m[2]}.${m[3]}`;
}

/** fmtDT(d) — format datetime "2026.03.15 14:30" */
function fmtDT(d) {
  if (!d) return '—';
  const m = String(d).match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (!m) return d;
  return `${m[1]}.${m[2]}.${m[3]} ${m[4]}:${m[5]}`;
}

/** fmt(n) — number format with commas */
function fmt(n) {
  if (n == null) return '0';
  return Number(n).toLocaleString('ko-KR');
}

/** mkPagination(total, page, perPage, onChange) */
function mkPagination(total, page, perPage, onChange) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const wrap = h('div', { class: 'pagination' });
  const prev = h('button', { class: 'pg-btn' }, '‹');
  if (page <= 1) prev.disabled = true;
  prev.addEventListener('click', () => onChange(page - 1));
  wrap.appendChild(prev);
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) {
    const btn = h('button', { class: 'pg-btn' + (i === page ? ' a' : '') }, String(i));
    btn.addEventListener('click', (p => () => onChange(p))(i));
    wrap.appendChild(btn);
  }
  const next = h('button', { class: 'pg-btn' }, '›');
  if (page >= totalPages) next.disabled = true;
  next.addEventListener('click', () => onChange(page + 1));
  wrap.appendChild(next);
  const info = h('span', { style: { fontSize: '12px', color: 'var(--t3)', marginLeft: '8px' } },
    `총 ${fmt(total)}건`
  );
  wrap.appendChild(info);
  return wrap;
}

/** statusBadge(status) — returns appropriate badge for common statuses */
function statusBadge(status) {
  const map = {
    'active': ['bdg-ok', '활성'],
    'inactive': ['bdg-err', '비활성'],
    'online': ['bdg-ok', '온라인'],
    'offline': ['bdg-err', '오프라인'],
    'applied': ['bdg-ok', '적용됨'],
    'pending': ['bdg-warn', '대기중'],
    'paused': ['bdg-warn', '일시정지'],
    'ACTIVE': ['bdg-warn', '진행중'],
    'EXPIRED': ['bdg-muted', '만료'],
    'CANCELLED': ['bdg-muted', '취소'],
    'confirmed': ['bdg-err', '확인됨'],
    'reviewing': ['bdg-warn', '검토중'],
    'dismissed': ['bdg-muted', '무시됨'],
    'normal': ['bdg-ok', '정상'],
    'warning': ['bdg-warn', '경고'],
  };
  const entry = map[status];
  if (entry) return mkBd(entry[0], entry[1]);
  return mkBd('bdg-muted', status || '—');
}

/** detTypeBadge(type) */
function detTypeBadge(type) {
  const map = {
    '선정성': 'bdg-err',
    '도박': 'bdg-warn',
    '폭력': 'bdg-err',
    '마약': 'bdg-err',
    '혐오': 'bdg-warn',
    '기타': 'bdg-muted',
  };
  return mkBd(map[type] || 'bdg-muted', type);
}

/* ── Theme ──────────────────────────────────────────────── */
function getTheme() {
  return localStorage.getItem('mc_theme') || 'light';
}
function setTheme(t) {
  localStorage.setItem('mc_theme', t);
  document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
