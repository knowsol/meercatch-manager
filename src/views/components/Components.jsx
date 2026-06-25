'use client'
import { useState, useEffect } from 'react';
import { StatusBadge, DetTypeBadge, Badge } from '../../components/common/Badge';

/* ─────────────────────────────────────────────────────────────
   REGISTRY DEFAULT  (v2 — Component Registry shape)
───────────────────────────────────────────────────────────── */
const REGISTRY_DEFAULT = {
  version: 2,
  publishedAt: null,
  components: {
    button: {
      label: 'Button', icon: 'Btn',
      description: '주요 액션을 트리거하는 버튼 컴포넌트',
      usageCount: 12,
      variants: ['Primary', 'Secondary', 'Danger', 'Success'],
      sizes: ['Small', 'Medium', 'Large'],
      states: ['Default', 'Hover', 'Disabled', 'Loading'],
      appearance: { colorToken: '--ac', radiusToken: '--radius-sm', shadowToken: null, typographyToken: '--font-size-sm' },
    },
    input: {
      label: 'Input', icon: 'Inp',
      description: '텍스트 입력, 셀렉트, 텍스트에어리어 컴포넌트',
      usageCount: 8,
      variants: ['Default', 'Error', 'Disabled'],
      sizes: ['Small', 'Medium'],
      states: ['Empty', 'Filled', 'Focused', 'Error'],
      appearance: { colorToken: '--bd', radiusToken: '--radius-sm', shadowToken: null, typographyToken: '--font-size-base' },
    },
    card: {
      label: 'Card', icon: 'Crd',
      description: '콘텐츠를 그룹화하는 카드 컨테이너',
      usageCount: 9,
      variants: ['Default', 'Bordered', 'Elevated'],
      sizes: ['Default', 'Compact'],
      states: ['Default', 'Hover'],
      appearance: { colorToken: '--bg1', radiusToken: '--radius', shadowToken: '--shadow-sm', typographyToken: '--font-size-base' },
    },
    table: {
      label: 'Table', icon: 'Tbl',
      description: '데이터를 행·열로 정렬하는 테이블 컴포넌트',
      usageCount: 6,
      variants: ['Default', 'Striped', 'Compact'],
      sizes: ['Default'],
      states: ['Default', 'Loading', 'Empty'],
      appearance: { colorToken: '--bg2', radiusToken: '--radius-sm', shadowToken: null, typographyToken: '--font-size-sm' },
    },
    modal: {
      label: 'Modal', icon: 'Mdl',
      description: '오버레이 위에 표시되는 다이얼로그',
      usageCount: 5,
      variants: ['Default', 'Alert', 'Confirm'],
      sizes: ['Small', 'Medium', 'Large'],
      states: ['Default', 'Loading'],
      appearance: { colorToken: '--bg1', radiusToken: '--radius', shadowToken: '--shadow-lg', typographyToken: '--font-size-md' },
    },
    dropdown: {
      label: 'Dropdown', icon: 'Drp',
      description: '옵션 목록에서 하나를 선택하는 드롭다운 컴포넌트',
      usageCount: 10,
      variants: ['Default', 'Disabled', 'Error'],
      sizes: ['Small', 'Medium', 'Large'],
      states: ['Closed', 'Open', 'Selected'],
      appearance: { colorToken: '--bg1', radiusToken: '--radius-sm', shadowToken: '--shadow-sm', typographyToken: '--font-size-base' },
    },
    navigation: {
      label: 'Navigation', icon: 'Nav',
      description: '상단 또는 사이드 네비게이션 바 컴포넌트',
      usageCount: 3,
      variants: ['Top', 'Side', 'Compact'],
      sizes: ['Default'],
      states: ['Default', 'Active', 'Collapsed'],
      appearance: { colorToken: '--bg1', radiusToken: '--radius', shadowToken: '--shadow-sm', typographyToken: '--font-size-sm' },
    },
    tabs: {
      label: 'Tabs', icon: 'Tab',
      description: '콘텐츠 구역을 전환하는 탭 컴포넌트',
      usageCount: 7,
      variants: ['Default', 'Pill', 'Underline'],
      sizes: ['Small', 'Medium'],
      states: ['Default', 'Active', 'Disabled'],
      appearance: { colorToken: '--ac', radiusToken: '--radius-sm', shadowToken: null, typographyToken: '--font-size-sm' },
    },
    checkbox: {
      label: 'Checkbox', icon: 'Chk',
      description: '다중 선택을 지원하는 체크박스 컴포넌트',
      usageCount: 6,
      variants: ['Default', 'Indeterminate'],
      sizes: ['Small', 'Medium'],
      states: ['Unchecked', 'Checked', 'Disabled'],
      appearance: { colorToken: '--ac', radiusToken: '--radius-sm', shadowToken: null, typographyToken: '--font-size-base' },
    },
    radio: {
      label: 'Radio', icon: 'Rad',
      description: '단일 선택을 지원하는 라디오 버튼 컴포넌트',
      usageCount: 4,
      variants: ['Default'],
      sizes: ['Small', 'Medium'],
      states: ['Unselected', 'Selected', 'Disabled'],
      appearance: { colorToken: '--ac', radiusToken: '--radius', shadowToken: null, typographyToken: '--font-size-base' },
    },
  },
  tokens: {
    colors: {
      label: 'Colors', icon: 'Clr',
      items: {
        '--ac':   { label: 'Primary',        value: '#E84035', hint: '주요 버튼·링크·강조' },
        '--ac2':  { label: 'Primary Hover',  value: '#C83020', hint: '버튼 호버 상태' },
        '--ok':   { label: 'Success',        value: '#10b981', hint: '성공, 활성 상태' },
        '--err':  { label: 'Error',          value: '#ef4444', hint: '오류, 삭제 동작' },
        '--warn': { label: 'Warning',        value: '#f59e0b', hint: '경고, 주의 사항' },
        '--bg0':  { label: 'App BG',         value: '#f1f3f6', hint: '앱 전체 배경색' },
        '--bg1':  { label: 'Surface 1',      value: '#ffffff', hint: '카드, 패널 배경' },
        '--bg2':  { label: 'Surface 2',      value: '#f5f6fa', hint: '테이블 헤더' },
        '--bg3':  { label: 'Surface 3',      value: '#ffffff', hint: '팝업, 드롭다운' },
        '--bd':   { label: 'Border',         value: '#e2e6ed', hint: '기본 테두리' },
        '--bd2':  { label: 'Border Dark',    value: '#c8cdd8', hint: '강조 테두리' },
        '--t1':   { label: 'Text Primary',   value: '#1a1d23', hint: '주요 본문' },
        '--t2':   { label: 'Text Secondary', value: '#5a6275', hint: '보조 텍스트' },
        '--t3':   { label: 'Text Muted',     value: '#9aa0b0', hint: '비활성' },
      },
    },
    typography: {
      label: 'Typography', icon: 'Typ',
      items: {
        '--font-size-xs':   { label: 'Font XS',   value: '11', unit: 'px', min: 8,  max: 14 },
        '--font-size-sm':   { label: 'Font SM',   value: '12', unit: 'px', min: 10, max: 16 },
        '--font-size-base': { label: 'Font Base', value: '13', unit: 'px', min: 10, max: 18 },
        '--font-size-md':   { label: 'Font MD',   value: '14', unit: 'px', min: 12, max: 20 },
        '--font-size-lg':   { label: 'Font LG',   value: '16', unit: 'px', min: 14, max: 24 },
        '--font-size-xl':   { label: 'Font XL',   value: '18', unit: 'px', min: 16, max: 32 },
        '--line-height':    { label: 'Line Height', value: '1.5', unit: '', min: 1.0, max: 2.5, step: 0.1 },
      },
    },
    spacing: {
      label: 'Spacing', icon: 'Spc',
      items: {
        '--space-1': { label: 'Space XS', value: '4',  unit: 'px', min: 0, max: 16 },
        '--space-2': { label: 'Space SM', value: '8',  unit: 'px', min: 0, max: 24 },
        '--space-3': { label: 'Space MD', value: '12', unit: 'px', min: 0, max: 32 },
        '--space-4': { label: 'Space LG', value: '16', unit: 'px', min: 0, max: 48 },
        '--space-5': { label: 'Space XL', value: '24', unit: 'px', min: 0, max: 64 },
        '--space-6': { label: 'Space 2XL',value: '32', unit: 'px', min: 0, max: 80 },
      },
    },
    radius: {
      label: 'Radius', icon: 'Rds',
      items: {
        '--radius':    { label: 'Radius (기본)', value: '8', unit: 'px', min: 0, max: 32 },
        '--radius-sm': { label: 'Radius Small',  value: '6', unit: 'px', min: 0, max: 24 },
      },
    },
    shadow: {
      label: 'Shadow', icon: 'Shd',
      items: {
        '--shadow-sm': { label: 'Shadow SM', value: '0 1px 3px rgba(0,0,0,.08)', type: 'text' },
        '--shadow':    { label: 'Shadow MD', value: '0 2px 8px rgba(0,0,0,.10)',  type: 'text' },
        '--shadow-lg': { label: 'Shadow LG', value: '0 4px 20px rgba(0,0,0,.15)', type: 'text' },
      },
    },
  },
};

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
      target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

function loadRegistry() {
  try {
    const raw = localStorage.getItem('meercatch_registry');
    if (!raw) return REGISTRY_DEFAULT;
    const saved = JSON.parse(raw);
    // Only merge if saved is the v2 shape; otherwise start fresh from default.
    if (!saved || saved.version !== 2) return REGISTRY_DEFAULT;
    return deepMerge(REGISTRY_DEFAULT, saved);
  } catch {
    return REGISTRY_DEFAULT;
  }
}

function applyTokensToDOM(registry) {
  try {
    Object.entries(registry.tokens).forEach(([, group]) => {
      Object.entries(group.items).forEach(([key, item]) => {
        const val = item.unit === 'px'
          ? `${item.value}px`
          : String(item.value);
        document.documentElement.style.setProperty(key, val);
      });
    });
  } catch {}
}

function generateRegistryJSON(registry) {
  return JSON.stringify({ ...registry, publishedAt: registry.publishedAt || new Date().toISOString() }, null, 2);
}

function generateTokensCSS(tokens) {
  const now = new Date().toLocaleString('ko-KR');
  const lines = ['/* Meercatch Design Tokens */', `/* Generated: ${now} */`, '', ':root {'];
  Object.entries(tokens).forEach(([, group]) => {
    lines.push(`  /* ${group.label} */`);
    Object.entries(group.items).forEach(([key, item]) => {
      const val = item.unit === 'px'
        ? `${item.value}px`
        : String(item.value);
      lines.push(`  ${key}: ${val};`);
    });
    lines.push('');
  });
  lines.push('}');
  return lines.join('\n');
}

function download(filename, content) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  a.download = filename;
  a.click();
}

/** Resolve a token key to its raw CSS value (e.g. '#E84035' or '8'). */
function resolveTokenValue(registry, tokenKey) {
  if (!tokenKey) return null;
  for (const group of Object.values(registry.tokens)) {
    if (group.items[tokenKey]) return group.items[tokenKey].value;
  }
  return null;
}

/** Resolve a token key to its human label (e.g. 'Primary'). */
function resolveTokenLabel(registry, tokenKey) {
  if (!tokenKey) return '없음';
  for (const group of Object.values(registry.tokens)) {
    if (group.items[tokenKey]) return group.items[tokenKey].label;
  }
  return tokenKey;
}

/** A px-resolved number for a typography token, with fallback. */
function resolveFontPx(registry, tokenKey, fallback) {
  const v = resolveTokenValue(registry, tokenKey);
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

/** A px-resolved number for a radius token, with fallback. */
function resolveRadiusPx(registry, tokenKey, fallback) {
  const v = resolveTokenValue(registry, tokenKey);
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

function shadeColor(hex, percent) {
  // percent < 0 darkens, > 0 lightens. Returns hex string.
  if (!hex || hex[0] !== '#' || hex.length < 7) return hex;
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  r = Math.round((t - r) * p) + r;
  g = Math.round((t - g) * p) + g;
  b = Math.round((t - b) * p) + b;
  const h = (n) => n.toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function readableText(hex) {
  // Returns black or white depending on bg luminance.
  if (!hex || hex[0] !== '#' || hex.length < 7) return '#fff';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? '#1a1d23' : '#ffffff';
}

/* ─────────────────────────────────────────────────────────────
   PALETTE  (sidebar dark theme constants)
───────────────────────────────────────────────────────────── */
const NAV_BG       = '#1e2028';
const NAV_TEXT     = '#c8cbd4';
const NAV_MUTED    = '#7c8090';
const NAV_HOVER    = 'rgba(255,255,255,0.05)';
const NAV_SEL_BG   = 'rgba(232,64,53,0.14)';
const ACCENT       = '#E84035';

/* checkered transparency tile for previews */
const CHECKER =
  'repeating-conic-gradient(#eceef2 0% 25%, #ffffff 0% 50%) 50% / 16px 16px';

/* ─────────────────────────────────────────────────────────────
   UI ATOMS
───────────────────────────────────────────────────────────── */
function PanelLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: '#9aa0b0', ...style,
    }}>
      {children}
    </div>
  );
}

function CountBadge({ n, active }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '1px 7px',
      minWidth: 18, textAlign: 'center',
      background: active ? 'rgba(232,64,53,0.18)' : 'rgba(255,255,255,0.07)',
      color: active ? ACCENT : NAV_MUTED,
    }}>{n}</span>
  );
}

function StatPill({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 999,
      border: '1px solid var(--bd)', background: 'var(--bg1)',
      fontSize: 12, color: 'var(--t2)', fontWeight: 500,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ITEM CHIP  (variant / size / state)
───────────────────────────────────────────────────────────── */
function ItemChip({ label, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, padding: '7px 10px',
        background: hover ? 'var(--bg2)' : 'var(--bg1)',
        border: '1px solid var(--bd)', borderRadius: 7,
        fontSize: 13, color: 'var(--t1)', transition: 'background 0.12s',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <button
        onClick={onDelete}
        title="삭제"
        style={{
          flexShrink: 0, width: 18, height: 18, borderRadius: 5, border: 'none',
          background: hover ? 'rgba(239,68,68,0.12)' : 'transparent',
          color: hover ? 'var(--err)' : 'var(--t3)',
          cursor: 'pointer', fontSize: 12, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hover ? 1 : 0.35, transition: 'all 0.12s',
        }}
      >✕</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ITEM COLUMN  (Variants | Sizes | States)
───────────────────────────────────────────────────────────── */
function ItemColumn({ title, items, sectionId, adding, addValue, setAddValue, onStartAdd, onCommitAdd, onCancelAdd, onDelete }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: 'var(--bg1)', border: '1px solid var(--bd)',
      borderRadius: 4, padding: 14,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <PanelLabel>{title}</PanelLabel>
        <span style={{
          fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '1px 7px',
          background: 'var(--bg2)', color: 'var(--t3)',
        }}>{items.length}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {items.map((it, i) => (
          <ItemChip key={`${it}-${i}`} label={it} onDelete={() => onDelete(sectionId, i)} />
        ))}
        {items.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--t3)', padding: '6px 2px' }}>항목 없음</div>
        )}
      </div>

      {adding === sectionId ? (
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <input
            autoFocus
            value={addValue}
            onChange={e => setAddValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') onCommitAdd(sectionId);
              if (e.key === 'Escape') onCancelAdd();
            }}
            placeholder="이름 입력"
            style={{
              flex: 1, minWidth: 0, padding: '6px 9px', borderRadius: 4,
              border: '1px solid var(--ac)', fontSize: 13,
              color: 'var(--t1)', background: 'var(--bg1)', outline: 'none',
            }}
          />
          <button
            onClick={() => onCommitAdd(sectionId)}
            style={{
              flexShrink: 0, padding: '0 12px', borderRadius: 4, border: 'none',
              background: 'var(--ac)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >추가</button>
          <button
            onClick={onCancelAdd}
            style={{
              flexShrink: 0, width: 30, borderRadius: 4, border: '1px solid var(--bd)',
              background: 'var(--bg1)', color: 'var(--t3)', fontSize: 13, cursor: 'pointer',
            }}
          >✕</button>
        </div>
      ) : (
        <button
          onClick={() => onStartAdd(sectionId)}
          style={{
            marginTop: 10, padding: '7px 0', borderRadius: 4,
            border: '1px dashed var(--bd2)', background: 'transparent',
            color: 'var(--t2)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ac)'; e.currentTarget.style.color = 'var(--ac)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd2)'; e.currentTarget.style.color = 'var(--t2)'; }}
        >+ 추가</button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOKEN SELECTOR  (dropdown with swatch + var subtitle)
───────────────────────────────────────────────────────────── */
function TokenSelect({ label, value, registry, groupKeys, allowNone, onChange }) {
  const [open, setOpen] = useState(false);

  // Build option list from the given token groups.
  const options = [];
  if (allowNone) options.push({ key: null, label: '없음', sub: '연결 안 함', color: null });
  groupKeys.forEach(gk => {
    const group = registry.tokens[gk];
    if (!group) return;
    Object.entries(group.items).forEach(([k, item]) => {
      const isColor = typeof item.value === 'string' && item.value[0] === '#';
      options.push({ key: k, label: item.label, sub: k, color: isColor ? item.value : null });
    });
  });

  const current = options.find(o => o.key === value) || { label: resolveTokenLabel(registry, value), sub: value || '연결 안 함', color: resolveTokenValue(registry, value) };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 0', borderBottom: '1px solid var(--bd)',
    }}>
      <div style={{ width: 140, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{label}</div>
      </div>

      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <button
          onClick={() => setOpen(o => !o)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 4,
            border: `1px solid ${open ? 'var(--ac)' : 'var(--bd)'}`,
            background: 'var(--bg1)', cursor: 'pointer', textAlign: 'left',
            boxShadow: open ? '0 0 0 3px rgba(232,64,53,0.10)' : 'none',
            transition: 'all 0.12s',
          }}
        >
          {current.color ? (
            <span style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              background: current.color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)',
            }} />
          ) : (
            <span style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              background: 'var(--bg2)', border: '1px dashed var(--bd2)',
            }} />
          )}
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 500 }}>{current.label}</span>
            <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'monospace' }}>{current.sub}</span>
          </span>
          <span style={{ flexShrink: 0, color: 'var(--t3)', fontSize: 10, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>▼</span>
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
            background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
            boxShadow: '0 8px 28px rgba(0,0,0,.16)', overflow: 'hidden',
            maxHeight: 280, overflowY: 'auto',
          }}>
            {options.map(opt => {
              const sel = opt.key === value;
              return (
                <button
                  key={opt.key || 'none'}
                  onMouseDown={(e) => { e.preventDefault(); onChange(opt.key); setOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: sel ? 'rgba(232,64,53,0.08)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'var(--bg2)'; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
                >
                  {opt.color ? (
                    <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: opt.color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)' }} />
                  ) : (
                    <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: 'var(--bg2)', border: '1px dashed var(--bd2)' }} />
                  )}
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, color: sel ? 'var(--ac)' : 'var(--t1)', fontWeight: sel ? 600 : 500 }}>{opt.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'monospace' }}>{opt.sub}</span>
                  </span>
                  {sel && <span style={{ flexShrink: 0, color: 'var(--ac)', fontSize: 12 }}>✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LIVE PREVIEW  RENDERERS
   (derive look from connected appearance tokens — no raw px UI)
───────────────────────────────────────────────────────────── */
function renderLiveComponent(compKey, comp, registry, sel) {
  const color  = resolveTokenValue(registry, comp.appearance.colorToken) || '#888';
  const radius = resolveRadiusPx(registry, comp.appearance.radiusToken, 8);
  const font   = resolveFontPx(registry, comp.appearance.typographyToken, 13);
  const shadow = comp.appearance.shadowToken ? resolveTokenValue(registry, comp.appearance.shadowToken) : 'none';

  const variant = sel.variant || comp.variants[0] || 'Default';
  const size    = sel.size    || comp.sizes[0]    || 'Medium';
  const state   = sel.state   || comp.states[0]   || 'Default';

  // size scaling factor
  const sizeScale = /small|compact|sm|xs/i.test(size) ? 0.85 : /large|lg|xl/i.test(size) ? 1.2 : 1;
  const fz = Math.round(font * sizeScale);
  const padY = Math.round(7 * sizeScale);
  const padX = Math.round(16 * sizeScale);

  /* ── BUTTON ── */
  if (compKey === 'button') {
    let bg = color;
    if (/secondary/i.test(variant)) bg = '#5a6275';
    if (/danger/i.test(variant))    bg = resolveTokenValue(registry, '--err') || '#ef4444';
    if (/success/i.test(variant))   bg = resolveTokenValue(registry, '--ok') || '#10b981';

    const disabled = /disabled/i.test(state);
    const loading  = /loading/i.test(state);
    const hovered  = /hover/i.test(state);
    if (hovered) bg = shadeColor(bg, -12);

    return (
      <button
        disabled={disabled}
        style={{
          fontSize: fz, fontWeight: 600,
          padding: `${padY}px ${padX}px`,
          background: disabled ? '#d4d8e0' : bg,
          color: disabled ? '#9aa0b0' : readableText(bg),
          border: 'none', borderRadius: radius,
          boxShadow: shadow !== 'none' ? shadow : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.85 : 1,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          transition: 'all 0.15s',
        }}
      >
        {loading && <span style={{
          width: fz - 2, height: fz - 2, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
          display: 'inline-block', animation: 'mc-spin 0.7s linear infinite',
        }} />}
        {loading ? '처리 중…' : variant}
      </button>
    );
  }

  /* ── INPUT ── */
  if (compKey === 'input') {
    const error = /error/i.test(variant) || /error/i.test(state);
    const focused = /focus/i.test(state);
    const disabled = /disabled/i.test(variant);
    const borderColor = error ? (resolveTokenValue(registry, '--err') || '#ef4444')
      : focused ? color : (resolveTokenValue(registry, '--bd') || '#e2e6ed');
    return (
      <div style={{ width: '100%', maxWidth: 240 }}>
        <input
          readOnly
          disabled={disabled}
          defaultValue={/filled/i.test(state) ? '입력된 텍스트' : ''}
          placeholder="텍스트를 입력하세요"
          style={{
            width: '100%', fontSize: fz, padding: `${padY + 1}px ${padX - 4}px`,
            border: `1.5px solid ${borderColor}`, borderRadius: radius,
            background: disabled ? '#f1f3f6' : '#fff',
            color: 'var(--t1)', outline: 'none',
            boxShadow: focused ? `0 0 0 3px ${color}22` : 'none',
            opacity: disabled ? 0.6 : 1,
          }}
        />
        {error && <div style={{ fontSize: 11, color: 'var(--err)', marginTop: 6 }}>올바른 값을 입력하세요</div>}
      </div>
    );
  }

  /* ── BADGE ── */
  if (compKey === 'badge') {
    let c = color;
    if (/success/i.test(variant)) c = resolveTokenValue(registry, '--ok') || '#10b981';
    if (/error/i.test(variant))   c = resolveTokenValue(registry, '--err') || '#ef4444';
    if (/warning/i.test(variant)) c = resolveTokenValue(registry, '--warn') || '#f59e0b';
    if (/info/i.test(variant))    c = resolveTokenValue(registry, '--ac') || '#E84035';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        fontSize: fz, fontWeight: 600,
        padding: `${Math.max(2, padY - 4)}px ${padX - 6}px`,
        borderRadius: radius,
        background: `${c}1f`, color: c, border: `1px solid ${c}40`,
      }}>{variant}</span>
    );
  }

  /* ── CARD ── */
  if (compKey === 'card') {
    const bordered = /bordered/i.test(variant);
    const elevated = /elevated/i.test(variant) || (comp.appearance.shadowToken && /default/i.test(variant));
    const hovered = /hover/i.test(state);
    return (
      <div style={{
        width: '100%', maxWidth: 260,
        background: resolveTokenValue(registry, '--bg1') || '#fff',
        border: `1px solid ${bordered ? (resolveTokenValue(registry, '--bd2') || '#c8cdd8') : (resolveTokenValue(registry, '--bd') || '#e2e6ed')}`,
        borderRadius: radius,
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,.14)' : (elevated && shadow !== 'none' ? shadow : 'none'),
        padding: 16, transition: 'box-shadow 0.18s',
      }}>
        <div style={{ fontSize: fz + 1, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>카드 제목</div>
        <p style={{ fontSize: fz, color: 'var(--t2)', margin: 0, lineHeight: 1.55 }}>
          콘텐츠를 그룹화하는 카드 컨테이너입니다. 연결된 토큰으로 표면·테두리·모서리가 결정됩니다.
        </p>
      </div>
    );
  }

  /* ── TABLE ── */
  if (compKey === 'table') {
    const striped = /striped/i.test(variant);
    const loading = /loading/i.test(state);
    const empty = /empty/i.test(state);
    const rows = [['홍길동', '활성'], ['김영희', '활성'], ['박철수', '대기']];
    return (
      <div style={{
        width: '100%', maxWidth: 260,
        border: `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}`,
        borderRadius: radius, overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fz }}>
          <thead>
            <tr style={{ background: resolveTokenValue(registry, '--bg2') || '#f5f6fa' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: fz - 1, color: 'var(--t2)', fontWeight: 700 }}>이름</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: fz - 1, color: 'var(--t2)', fontWeight: 700 }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {loading || empty ? (
              <tr><td colSpan={2} style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--t3)', fontSize: fz }}>
                {loading ? '불러오는 중…' : '데이터 없음'}
              </td></tr>
            ) : rows.map((r, i) => (
              <tr key={i} style={{
                borderTop: `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}`,
                background: striped && i % 2 ? (resolveTokenValue(registry, '--bg2') || '#f5f6fa') : 'transparent',
              }}>
                <td style={{ padding: '8px 12px', color: 'var(--t1)' }}>{r[0]}</td>
                <td style={{ padding: '8px 12px', color: 'var(--t2)' }}>{r[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ── MODAL ── */
  if (compKey === 'modal') {
    const loading = /loading/i.test(state);
    const isAlert = /alert/i.test(variant);
    return (
      <div style={{
        width: '100%', maxWidth: 280,
        background: resolveTokenValue(registry, '--bg1') || '#fff',
        border: `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}`,
        borderRadius: radius,
        boxShadow: shadow !== 'none' ? shadow : '0 10px 30px rgba(0,0,0,.18)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}`,
        }}>
          <span style={{ fontSize: fz + 1, fontWeight: 700, color: isAlert ? 'var(--err)' : 'var(--t1)' }}>
            {isAlert ? '⚠ 경고' : variant}
          </span>
          <span style={{ color: 'var(--t3)', fontSize: 15, cursor: 'pointer' }}>✕</span>
        </div>
        <div style={{ padding: 16, fontSize: fz, color: 'var(--t2)', lineHeight: 1.6 }}>
          {loading ? '처리 중입니다…' : '오버레이 위에 표시되는 다이얼로그 본문 영역입니다.'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 16px 16px' }}>
          <button style={{ fontSize: fz - 1, padding: '6px 12px', borderRadius: radius - 2, border: '1px solid var(--bd)', background: '#fff', color: 'var(--t2)', cursor: 'pointer' }}>취소</button>
          <button style={{ fontSize: fz - 1, padding: '6px 12px', borderRadius: radius - 2, border: 'none', background: color, color: readableText(color), cursor: 'pointer', fontWeight: 600 }}>확인</button>
        </div>
      </div>
    );
  }

  /* ── DROPDOWN ── */
  if (compKey === 'dropdown') {
    const isOpen = /open/i.test(state);
    const isDisabled = /disabled/i.test(variant);
    const isError = /error/i.test(variant);
    const bdColor = isError ? (resolveTokenValue(registry, '--err') || '#ef4444') : isOpen ? color : (resolveTokenValue(registry, '--bd') || '#e2e6ed');
    const options = ['옵션 1', '옵션 2', '옵션 3'];
    return (
      <div style={{ width: '100%', maxWidth: 240, position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${padY}px ${padX}px`,
          background: isDisabled ? 'var(--bg2)' : (resolveTokenValue(registry, '--bg1') || '#fff'),
          border: `1px solid ${bdColor}`,
          borderRadius: radius,
          fontSize: fz, color: isDisabled ? 'var(--t3)' : 'var(--t1)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.65 : 1,
        }}>
          <span>{isOpen ? '옵션 선택' : '선택하세요'}</span>
          <span style={{ fontSize: 10, color: 'var(--t3)', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▼</span>
        </div>
        {isOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
            background: resolveTokenValue(registry, '--bg1') || '#fff',
            border: `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}`,
            borderRadius: radius,
            boxShadow: shadow !== 'none' ? shadow : '0 4px 12px rgba(0,0,0,.1)',
            zIndex: 10, overflow: 'hidden',
          }}>
            {options.map((opt, i) => (
              <div key={opt} style={{
                padding: `${padY - 2}px ${padX}px`,
                fontSize: fz, color: i === 1 ? color : 'var(--t1)',
                background: i === 1 ? `${color}14` : 'transparent',
                borderBottom: i < options.length - 1 ? `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}` : 'none',
              }}>{opt}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── NAVIGATION ── */
  if (compKey === 'navigation') {
    const isSide = /side/i.test(variant);
    const isCompact = /compact/i.test(variant);
    const navItems = ['대시보드', '기관 관리', '보고서', '설정'];
    if (isSide) {
      return (
        <div style={{
          width: isCompact ? 56 : 140, background: '#1e2028',
          borderRadius: radius, overflow: 'hidden', padding: '8px 0',
        }}>
          {navItems.map((item, i) => (
            <div key={item} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: isCompact ? '8px 0' : '8px 12px',
              justifyContent: isCompact ? 'center' : 'flex-start',
              background: i === 0 ? `${color}20` : 'transparent',
              borderLeft: i === 0 ? `2px solid ${color}` : '2px solid transparent',
              color: i === 0 ? color : '#9aa0b0',
              fontSize: fz - 1, cursor: 'pointer',
            }}>
              <span style={{ fontSize: 13 }}>{'◾'}</span>
              {!isCompact && <span>{item}</span>}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div style={{
        width: '100%', maxWidth: 300,
        background: resolveTokenValue(registry, '--bg1') || '#fff',
        border: `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}`,
        borderRadius: radius, padding: '0 8px',
        display: 'flex', alignItems: 'center', gap: 4,
        boxShadow: shadow !== 'none' ? shadow : undefined,
      }}>
        {navItems.map((item, i) => (
          <div key={item} style={{
            padding: '10px 10px',
            fontSize: fz - 1,
            color: i === 0 ? color : 'var(--t2)',
            borderBottom: i === 0 ? `2px solid ${color}` : '2px solid transparent',
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{item}</div>
        ))}
      </div>
    );
  }

  /* ── TABS ── */
  if (compKey === 'tabs') {
    const isPill = /pill/i.test(variant);
    const isUnderline = /underline/i.test(variant);
    const tabItems = ['개요', '상세', '설정'];
    return (
      <div style={{ width: '100%', maxWidth: 280 }}>
        <div style={{
          display: 'flex', gap: isPill ? 4 : 0,
          background: isPill ? (resolveTokenValue(registry, '--bg2') || '#f5f6fa') : 'transparent',
          borderRadius: isPill ? radius : 0,
          borderBottom: !isPill ? `1px solid ${resolveTokenValue(registry, '--bd') || '#e2e6ed'}` : 'none',
          padding: isPill ? 4 : 0,
        }}>
          {tabItems.map((tab, i) => {
            const active = i === 0;
            return (
              <div key={tab} style={{
                padding: `${padY - 2}px ${padX - 2}px`,
                fontSize: fz,
                fontWeight: active ? 600 : 400,
                color: active ? (isPill ? '#fff' : color) : 'var(--t2)',
                background: active && isPill ? color : 'transparent',
                borderRadius: isPill ? radius - 2 : 0,
                borderBottom: active && isUnderline ? `2px solid ${color}` : active && !isPill ? `2px solid ${color}` : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: !isPill ? -1 : 0,
              }}>{tab}</div>
            );
          })}
        </div>
        <div style={{
          padding: '12px 4px', fontSize: fz - 1, color: 'var(--t3)',
        }}>탭 콘텐츠 영역</div>
      </div>
    );
  }

  /* ── CHECKBOX ── */
  if (compKey === 'checkbox') {
    const isChecked = /checked/i.test(state);
    const isIndeterminate = /indeterminate/i.test(variant);
    const isDisabled = /disabled/i.test(state);
    const boxSize = size === 'Small' ? 14 : 16;
    const items = ['항목 A', '항목 B', '항목 C'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => {
          const checked = i === 0 ? isChecked || isIndeterminate : i === 1;
          return (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: isDisabled && i === 2 ? 0.45 : 1 }}>
              <div style={{
                width: boxSize, height: boxSize, flexShrink: 0,
                border: `2px solid ${checked ? color : (resolveTokenValue(registry, '--bd2') || '#c8cdd8')}`,
                borderRadius: radius === 'none' ? 0 : 3,
                background: checked ? color : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: boxSize - 4, cursor: 'pointer',
              }}>
                {checked && (i === 0 && isIndeterminate ? '−' : '✓')}
              </div>
              <span style={{ fontSize: fz, color: isDisabled && i === 2 ? 'var(--t3)' : 'var(--t1)' }}>{item}</span>
            </div>
          );
        })}
      </div>
    );
  }

  /* ── RADIO ── */
  if (compKey === 'radio') {
    const isSelected = /selected/i.test(state);
    const isDisabled = /disabled/i.test(state);
    const dotSize = size === 'Small' ? 14 : 16;
    const items = ['옵션 A', '옵션 B', '옵션 C'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => {
          const active = i === 0 ? isSelected : i === 1;
          return (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: isDisabled && i === 2 ? 0.45 : 1 }}>
              <div style={{
                width: dotSize, height: dotSize, flexShrink: 0,
                border: `2px solid ${active ? color : (resolveTokenValue(registry, '--bd2') || '#c8cdd8')}`,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                {active && <div style={{ width: dotSize - 6, height: dotSize - 6, borderRadius: '50%', background: color }} />}
              </div>
              <span style={{ fontSize: fz, color: isDisabled && i === 2 ? 'var(--t3)' : 'var(--t1)' }}>{item}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   PREVIEW SELECTOR TABS  (variant / size / state)
───────────────────────────────────────────────────────────── */
function SelectorTabs({ label, options, value, onChange }) {
  if (!options || options.length === 0) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <PanelLabel style={{ marginBottom: 6 }}>{label}</PanelLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {options.map(opt => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: active ? 600 : 500,
                cursor: 'pointer', transition: 'all 0.12s',
                border: `1px solid ${active ? 'var(--ac)' : 'var(--bd)'}`,
                background: active ? 'rgba(232,64,53,0.10)' : 'var(--bg1)',
                color: active ? 'var(--ac)' : 'var(--t2)',
              }}
            >{opt}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT VIEW
───────────────────────────────────────────────────────────── */
function ComponentView({
  compKey, comp, registry,
  onRename, onDescChange, onAddItem, onDeleteItem, onAppearanceChange,
  adding, addValue, setAddValue, setAdding,
  preview, setPreview,
}) {
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [nameDraft, setNameDraft] = useState(comp.label);
  const [descDraft, setDescDraft] = useState(comp.description);

  useEffect(() => { setNameDraft(comp.label); setDescDraft(comp.description); setEditingName(false); setEditingDesc(false); }, [compKey]); // eslint-disable-line

  const startAdd = (sec) => { setAdding(sec); setAddValue(''); };
  const cancelAdd = () => { setAdding(null); setAddValue(''); };
  const commitAdd = (sec) => {
    const v = addValue.trim();
    if (v) onAddItem(compKey, sec, v);
    setAdding(null); setAddValue('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>

      {/* Overview — full width */}
      <div style={{
        background: 'var(--bg1)', border: '1px solid var(--bd)',
        borderRadius: 4, padding: 22,
      }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {editingName ? (
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={e => setNameDraft(e.target.value)}
                    onBlur={() => { onRename(compKey, nameDraft.trim() || comp.label); setEditingName(false); }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { onRename(compKey, nameDraft.trim() || comp.label); setEditingName(false); }
                      if (e.key === 'Escape') { setNameDraft(comp.label); setEditingName(false); }
                    }}
                    style={{
                      fontSize: 20, fontWeight: 700, color: 'var(--t1)',
                      border: '1px solid var(--ac)', borderRadius: 4, padding: '2px 8px',
                      outline: 'none', background: 'var(--bg1)', maxWidth: 260,
                    }}
                  />
                ) : (
                  <>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', margin: 0, letterSpacing: '-0.4px' }}>{comp.label}</h2>
                    <button
                      onClick={() => { setNameDraft(comp.label); setEditingName(true); }}
                      title="이름 편집"
                      style={{
                        width: 26, height: 26, borderRadius: 4, border: '1px solid var(--bd)',
                        background: 'var(--bg1)', color: 'var(--t3)', cursor: 'pointer', fontSize: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--ac)'; e.currentTarget.style.borderColor = 'var(--ac)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.borderColor = 'var(--bd)'; }}
                    >✎</button>
                  </>
                )}
              </div>

              {/* description */}
              <div style={{ marginTop: 6 }}>
                {editingDesc ? (
                  <input
                    autoFocus
                    value={descDraft}
                    onChange={e => setDescDraft(e.target.value)}
                    onBlur={() => { onDescChange(compKey, descDraft.trim()); setEditingDesc(false); }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { onDescChange(compKey, descDraft.trim()); setEditingDesc(false); }
                      if (e.key === 'Escape') { setDescDraft(comp.description); setEditingDesc(false); }
                    }}
                    style={{
                      width: '100%', maxWidth: 440, fontSize: 13, color: 'var(--t2)',
                      border: '1px solid var(--ac)', borderRadius: 4, padding: '4px 8px',
                      outline: 'none', background: 'var(--bg1)',
                    }}
                  />
                ) : (
                  <span
                    onClick={() => { setDescDraft(comp.description); setEditingDesc(true); }}
                    title="설명 편집"
                    style={{
                      fontSize: 13, color: 'var(--t2)', cursor: 'text',
                      borderBottom: '1px dashed transparent', paddingBottom: 1,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'var(--bd2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                  >{comp.description}</span>
                )}
              </div>

              {/* stat pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                <StatPill><b style={{ color: 'var(--t1)', fontWeight: 700 }}>{comp.usageCount}</b> 화면에서 사용</StatPill>
                <StatPill><b style={{ color: 'var(--t1)', fontWeight: 700 }}>{comp.variants.length}</b> Variants</StatPill>
                <StatPill><b style={{ color: 'var(--t1)', fontWeight: 700 }}>{comp.sizes.length}</b> Sizes</StatPill>
              </div>
            </div>
          </div>
        </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT: Live Preview + Variants/Sizes/States */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Live Preview */}
          <div style={{
            background: 'var(--bg1)', border: '1px solid var(--bd)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--bd)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Live Preview</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 1 }}>연결된 토큰으로 실시간 렌더링</div>
            </div>
            <div style={{
              margin: 16, marginTop: 16, borderRadius: 4,
              border: '1px solid var(--bd)', background: CHECKER,
              minHeight: 150, padding: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {renderLiveComponent(compKey, comp, registry, preview)}
            </div>
            <div style={{ padding: '4px 16px 12px' }}>
              <SelectorTabs label="Variant" options={comp.variants} value={preview.variant} onChange={v => setPreview(p => ({ ...p, variant: v }))} />
              <SelectorTabs label="Size" options={comp.sizes} value={preview.size} onChange={v => setPreview(p => ({ ...p, size: v }))} />
              <SelectorTabs label="State" options={comp.states} value={preview.state} onChange={v => setPreview(p => ({ ...p, state: v }))} />
            </div>
            <div style={{
              padding: '10px 16px 14px', borderTop: '1px solid var(--bd)',
              fontSize: 11, color: 'var(--t3)',
            }}>
              <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{comp.label}</span>
              {'  ·  '}
              {(preview.variant || '-')} / {(preview.size || '-')} / {(preview.state || '-')}
            </div>
          </div>

          {/* Variants / Sizes / States */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
            <ItemColumn
              title="Variants" items={comp.variants} sectionId="variants"
              adding={adding} addValue={addValue} setAddValue={setAddValue}
              onStartAdd={startAdd} onCommitAdd={commitAdd} onCancelAdd={cancelAdd}
              onDelete={(sec, i) => onDeleteItem(compKey, sec, i)}
            />
            <ItemColumn
              title="Sizes" items={comp.sizes} sectionId="sizes"
              adding={adding} addValue={addValue} setAddValue={setAddValue}
              onStartAdd={startAdd} onCommitAdd={commitAdd} onCancelAdd={cancelAdd}
              onDelete={(sec, i) => onDeleteItem(compKey, sec, i)}
            />
            <ItemColumn
              title="States" items={comp.states} sectionId="states"
              adding={adding} addValue={addValue} setAddValue={setAddValue}
              onStartAdd={startAdd} onCommitAdd={commitAdd} onCancelAdd={cancelAdd}
              onDelete={(sec, i) => onDeleteItem(compKey, sec, i)}
            />
          </div>
        </div>

        {/* RIGHT: Appearance */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: 'var(--bg1)', border: '1px solid var(--bd)',
            borderRadius: 4, padding: '6px 22px 18px',
          }}>
            <div style={{ paddingTop: 16, marginBottom: 4 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Appearance</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>컴포넌트 시각을 결정하는 토큰 연결</div>
            </div>
            <TokenSelect
              label="Color Token" value={comp.appearance.colorToken}
              registry={registry} groupKeys={['colors']} allowNone={false}
              onChange={(v) => onAppearanceChange(compKey, 'colorToken', v)}
            />
            <TokenSelect
              label="Radius Token" value={comp.appearance.radiusToken}
              registry={registry} groupKeys={['radius']} allowNone={false}
              onChange={(v) => onAppearanceChange(compKey, 'radiusToken', v)}
            />
            <TokenSelect
              label="Shadow Token" value={comp.appearance.shadowToken}
              registry={registry} groupKeys={['shadow']} allowNone={true}
              onChange={(v) => onAppearanceChange(compKey, 'shadowToken', v)}
            />
            <TokenSelect
              label="Typography Token" value={comp.appearance.typographyToken}
              registry={registry} groupKeys={['typography']} allowNone={false}
              onChange={(v) => onAppearanceChange(compKey, 'typographyToken', v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOKEN ROWS  (design tokens view)
───────────────────────────────────────────────────────────── */
function ColorTokenRow({ tokenKey, item, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '13px 0', borderBottom: '1px solid var(--bd)', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 1 }}>{item.label}</div>
        {item.hint && <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 2 }}>{item.hint}</div>}
        <code style={{ fontSize: 10, color: 'var(--ac)', fontFamily: 'monospace' }}>{tokenKey}</code>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--t2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.value}</span>
        <label style={{
          display: 'block', width: 48, height: 32, borderRadius: 4,
          background: item.value, border: '1px solid var(--bd2)',
          cursor: 'pointer', overflow: 'hidden', position: 'relative',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)', flexShrink: 0,
        }}>
          <input
            type="color"
            value={item.value}
            onChange={e => onChange(tokenKey, e.target.value)}
            style={{ position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%', opacity: 0, cursor: 'pointer' }}
          />
        </label>
      </div>
    </div>
  );
}

function NumberTokenRow({ tokenKey, item, onChange }) {
  const step = item.step || 1;
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 1 }}>{item.label}</div>
          <code style={{ fontSize: 10, color: 'var(--ac)', fontFamily: 'monospace' }}>{tokenKey}</code>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <input
            type="number"
            value={item.value}
            min={item.min}
            max={item.max}
            step={step}
            onChange={e => onChange(tokenKey, e.target.value)}
            style={{
              width: 62, padding: '5px 8px', borderRadius: 4,
              border: '1px solid var(--bd)', fontSize: 12,
              fontFamily: 'monospace', textAlign: 'center',
              color: 'var(--t1)', background: 'var(--bg2)', outline: 'none',
            }}
          />
          {item.unit && <span style={{ fontSize: 11, color: 'var(--t3)', width: 16 }}>{item.unit}</span>}
        </div>
      </div>
    </div>
  );
}

function TextTokenRow({ tokenKey, item, onChange }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{item.label}</div>
      <code style={{ fontSize: 10, color: 'var(--ac)', fontFamily: 'monospace', display: 'block', marginBottom: 8 }}>{tokenKey}</code>
      <input
        type="text"
        value={item.value}
        onChange={e => onChange(tokenKey, e.target.value)}
        style={{
          width: '100%', padding: '8px 10px', borderRadius: 4,
          border: '1px solid var(--bd)', fontSize: 12,
          fontFamily: 'monospace', color: 'var(--t1)',
          background: 'var(--bg2)', outline: 'none',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TYPOGRAPHY SCALE PREVIEW
───────────────────────────────────────────────────────────── */
const TYPE_SCALE = [
  { name: 'H1',       weight: 'semibold',                   size: 24, lineHeight: 32, letterSpacing: '-2%', usage: '페이지 타이틀' },
  { name: 'H2',       weight: 'semibold / medium',           size: 18, lineHeight: 26, letterSpacing: '-2%', usage: '섹션 타이틀' },
  { name: 'H3',       weight: 'medium / regular',            size: 15, lineHeight: 24, letterSpacing: '-2%', usage: 'LNB 타이틀, 서브타이틀' },
  { name: 'Body1',    weight: 'semibold / medium / regular', size: 15, lineHeight: 24, letterSpacing: '-2%', usage: '강조 및 기본 폰트' },
  { name: 'Body2',    weight: 'medium / regular',            size: 14, lineHeight: 22, letterSpacing: '-2%', usage: '라벨 및 안내문구' },
  { name: 'Caption1', weight: 'medium / regular',            size: 12, lineHeight: 18, letterSpacing: '-2%', usage: '안내 및 그래픽 타이틀' },
  { name: 'Link',     weight: 'regular',                     size: 15, lineHeight: 24, letterSpacing: '-2%', usage: '클릭할 수 있는 상태로 동작하는 텍스트', isLink: true },
];
const WEIGHT_MAP = { semibold: 600, medium: 500, regular: 400 };
const SAMPLE_TEXT = '올바른 기술로 차별없는 세상을 만듭니다.';

function TypographyPreviewTable() {
  const [scale, setScale] = useState(() => {
    try {
      const saved = localStorage.getItem('meercatch_typescale');
      if (saved) return JSON.parse(saved);
    } catch {}
    return TYPE_SCALE.map(r => ({ ...r }));
  });
  const [editCell, setEditCell] = useState(null);
  const [draft, setDraft] = useState('');

  const persist = (next) => {
    setScale(next);
    try { localStorage.setItem('meercatch_typescale', JSON.stringify(next)); } catch {}
  };

  const startEdit = (row, field, val) => { setEditCell({ row, field }); setDraft(String(val)); };

  const commitEdit = () => {
    if (!editCell) return;
    const { row, field } = editCell;
    const next = scale.map((r, i) => {
      if (i !== row) return r;
      if (field === 'size') { const n = parseInt(draft); return { ...r, size: Number.isFinite(n) && n > 0 ? n : r.size }; }
      return { ...r, [field]: draft };
    });
    persist(next);
    setEditCell(null);
  };

  const addRow = () => {
    const next = [...scale, { name: 'New', weight: 'regular', size: 14, lineHeight: 22, letterSpacing: '-2%', usage: '새 타입' }];
    persist(next);
    setEditCell({ row: next.length - 1, field: 'name' });
    setDraft('New');
  };

  const primaryFw = (w) => WEIGHT_MAP[w.split(' / ')[0].trim()] || 400;

  const inputStyle = (w) => ({
    width: w, padding: '3px 6px', borderRadius: 5,
    border: '1px solid var(--ac)', fontSize: 12,
    color: 'var(--t1)', background: 'var(--bg1)', outline: 'none',
  });
  const editableSpan = (row, field, val, style) => {
    const isEditing = editCell?.row === row && editCell?.field === field;
    if (isEditing) return (
      <input
        autoFocus
        type={field === 'size' ? 'number' : 'text'}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditCell(null); }}
        style={{ ...inputStyle(field === 'size' ? 52 : 80), fontFamily: field === 'size' ? 'monospace' : 'inherit', ...style }}
      />
    );
    return (
      <span
        onClick={() => startEdit(row, field, val)}
        title="클릭하여 편집"
        style={{ cursor: 'text', borderBottom: '1px dashed transparent', paddingBottom: 1, ...style }}
        onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'var(--bd2)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
      >{val}</span>
    );
  };

  return (
    <div style={{
      background: 'var(--bg1)', border: '1px solid var(--bd)',
      borderRadius: 4, overflow: 'hidden', marginTop: 24,
    }}>
      <div style={{ padding: '16px 22px 14px', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Type Scale</div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>폰트 스케일별 미리보기</div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg2)' }}>
            {['Scale', 'Weight', 'Size', 'Letter-spacing', 'Usage', ''].map((h, i) => (
              <th key={i} style={{
                padding: '10px 16px', textAlign: 'left', fontSize: 11,
                fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase',
                letterSpacing: '0.06em', borderBottom: '1px solid var(--bd)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scale.map((row, i) => (
            <tr key={i} style={{ borderTop: i > 0 ? '1px solid var(--bd)' : 'none' }}>
              <td style={{ padding: '16px 16px', fontWeight: 700, fontSize: 13, color: 'var(--t2)', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                {editableSpan(i, 'name', row.name)}
              </td>
              <td style={{ padding: '16px 16px', fontSize: 12, color: 'var(--t3)', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{row.weight}</td>
              <td style={{ padding: '16px 16px', fontSize: 12, color: 'var(--t2)', fontFamily: 'monospace', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                {editableSpan(i, 'size', row.size)}
              </td>
              <td style={{ padding: '16px 16px', fontSize: 12, color: 'var(--t3)', verticalAlign: 'middle' }}>{row.letterSpacing}</td>
              <td style={{ padding: '16px 16px', fontSize: 12, color: 'var(--t3)', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{row.usage}</td>
              <td style={{ padding: '16px 32px 16px 16px', verticalAlign: 'middle' }}>
                <span style={{
                  fontSize: row.size, lineHeight: `${row.lineHeight}px`,
                  fontWeight: primaryFw(row.weight), letterSpacing: '-0.02em',
                  color: row.isLink ? 'var(--ac)' : 'var(--t1)',
                  textDecoration: row.isLink ? 'underline' : 'none',
                  display: 'block',
                }}>{SAMPLE_TEXT}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--bd)' }}>
        <button
          onClick={addRow}
          style={{
            padding: '7px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600,
            border: '1px dashed var(--bd2)', background: 'transparent',
            color: 'var(--t2)', cursor: 'pointer', transition: 'all 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ac)'; e.currentTarget.style.color = 'var(--ac)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bd2)'; e.currentTarget.style.color = 'var(--t2)'; }}
        >+ 타입 추가</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOKEN GROUP VIEW
───────────────────────────────────────────────────────────── */
function TokenGroupView({ group, onTokenChange }) {
  const isColors = Object.values(group.items).some(it => typeof it.value === 'string' && it.value[0] === '#' && it.type !== 'text');
  const isTypography = Object.keys(group.items).some(k => k.startsWith('--font-size'));

  return (
    <div style={{ maxWidth: isTypography ? 'none' : 720 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', margin: 0, letterSpacing: '-0.4px' }}>
          {group.icon} {group.label}
        </h2>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>
          {Object.keys(group.items).length}개 토큰 · 변경하면 즉시 앱 전체에 반영됩니다
        </div>
      </div>

      {!isTypography && (
        <div style={{
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, padding: isColors ? '4px 22px' : '6px 22px',
        }}>
          {Object.entries(group.items).map(([key, item]) => {
            if (item.type === 'text') return <TextTokenRow key={key} tokenKey={key} item={item} onChange={onTokenChange} />;
            if (item.unit !== undefined) return <NumberTokenRow key={key} tokenKey={key} item={item} onChange={onTokenChange} />;
            return <ColorTokenRow key={key} tokenKey={key} item={item} onChange={onTokenChange} />;
          })}
        </div>
      )}
      {isTypography && <TypographyPreviewTable />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PUBLISH VIEW
───────────────────────────────────────────────────────────── */
function highlightJSON(text) {
  // lightweight token coloring for the code preview
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc(text)
    .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span style="color:#7ee0c0">$1</span>$2')
    .replace(/: ("(?:[^"\\]|\\.)*")/g, ': <span style="color:#f0a987">$1</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span style="color:#9ec5ff">$1</span>')
    .replace(/: (true|false|null)/g, ': <span style="color:#c792ea">$1</span>');
}

function highlightCSS(text) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc(text)
    .replace(/(\/\*.*?\*\/)/g, '<span style="color:#5c6370">$1</span>')
    .replace(/(--[\w-]+)(:)/g, '<span style="color:#7ee0c0">$1</span>$2')
    .replace(/: ([^;]+);/g, ': <span style="color:#f0a987">$1</span>;');
}

function PublishView({ registry, onPublish }) {
  const [tab, setTab] = useState('json');
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);

  const jsonContent = generateRegistryJSON(registry);
  const cssContent = generateTokensCSS(registry.tokens);
  const content = tab === 'json' ? jsonContent : cssContent;
  const filename = tab === 'json' ? 'design-registry.json' : 'design-tokens.css';
  const highlighted = tab === 'json' ? highlightJSON(content) : highlightCSS(content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePublish = () => {
    onPublish();
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  };

  const publishedAt = registry.publishedAt ? new Date(registry.publishedAt).toLocaleString('ko-KR') : null;

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', margin: 0, letterSpacing: '-0.4px' }}>발행 (Publish)</h2>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>
          {publishedAt ? `마지막 발행: ${publishedAt}` : '아직 발행되지 않음'}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 12, border: '1px solid var(--bd)', borderRadius: 4, overflow: 'hidden', width: 'fit-content' }}>
        {[['json', 'design-registry.json'], ['css', 'design-tokens.css']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '8px 18px', fontSize: 12, fontWeight: tab === id ? 600 : 500,
              background: tab === id ? 'var(--ac)' : 'var(--bg1)',
              color: tab === id ? '#fff' : 'var(--t2)',
              border: 'none', cursor: 'pointer', fontFamily: 'monospace',
              borderRight: id === 'json' ? '1px solid var(--bd)' : 'none',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Code block */}
      <div style={{
        background: '#16181f', borderRadius: 4,
        border: '1px solid #2a2d36', marginBottom: 16, overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{filename}</span>
        </div>
        <pre style={{
          padding: 18, overflow: 'auto', maxHeight: 400, fontSize: 12,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, margin: 0,
          scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent',
        }}>
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={handleCopy}
          style={{
            padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: '1px solid var(--bd)', background: 'var(--bg1)',
            color: copied ? 'var(--ok)' : 'var(--t2)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >{copied ? '✓ 복사됨' : '복사'}</button>
        <button
          onClick={() => download(filename, content)}
          style={{
            padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: '1px solid var(--bd)', background: 'var(--bg1)', color: 'var(--t2)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >다운로드</button>
        <div style={{ flex: 1 }} />
        <button
          onClick={handlePublish}
          style={{
            padding: '8px 22px', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            border: 'none', color: '#fff',
            background: published ? 'var(--ok)' : 'var(--ac)',
            boxShadow: published ? 'none' : '0 2px 8px rgba(232,64,53,0.3)',
          }}
        >{published ? '✓ 발행 완료' : '지금 발행'}</button>
      </div>

      {published && (
        <div style={{
          marginTop: 12, padding: '11px 14px',
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 4, fontSize: 12, color: 'var(--ok)',
        }}>
          디자인 시스템이 성공적으로 발행되었습니다. localStorage에 저장되고 앱 전체에 CSS 토큰이 적용되었습니다.
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────── */
export default function ComponentsPage() {
  const [registry, setRegistry] = useState(REGISTRY_DEFAULT);
  const [selected, setSelected] = useState('comp:button');
  const [hoverNav, setHoverNav] = useState(null);

  // live preview selection
  const [previewVariant, setPreviewVariant] = useState(null);
  const [previewSize, setPreviewSize] = useState(null);
  const [previewState, setPreviewState] = useState(null);

  // inline add
  const [addingTo, setAddingTo] = useState(null);
  const [addValue, setAddValue] = useState('');

  /* ── mount: load + apply tokens ── */
  useEffect(() => {
    const loaded = loadRegistry();
    setRegistry(loaded);
    applyTokensToDOM(loaded);
  }, []);

  /* ── persist registry on every change ── */
  const persist = (next) => {
    try { localStorage.setItem('meercatch_registry', JSON.stringify(next)); } catch {}
  };

  /* ── keep preview selection valid when switching component ── */
  const currentCompKey = selected.startsWith('comp:') ? selected.replace('comp:', '') : null;
  useEffect(() => {
    if (!currentCompKey) return;
    const c = registry.components[currentCompKey];
    if (!c) return;
    setPreviewVariant(c.variants[0] || null);
    setPreviewSize(c.sizes[0] || null);
    setPreviewState(c.states[0] || null);
    setAddingTo(null);
    setAddValue('');
  }, [currentCompKey]); // eslint-disable-line

  /* ── component mutations ── */
  const renameComponent = (compKey, label) => {
    setRegistry(prev => {
      const next = { ...prev, components: { ...prev.components, [compKey]: { ...prev.components[compKey], label } } };
      persist(next); return next;
    });
  };

  const changeDescription = (compKey, description) => {
    setRegistry(prev => {
      const next = { ...prev, components: { ...prev.components, [compKey]: { ...prev.components[compKey], description } } };
      persist(next); return next;
    });
  };

  const addItem = (compKey, section, value) => {
    setRegistry(prev => {
      const comp = prev.components[compKey];
      if (comp[section].includes(value)) return prev;
      const next = {
        ...prev,
        components: { ...prev.components, [compKey]: { ...comp, [section]: [...comp[section], value] } },
      };
      persist(next); return next;
    });
  };

  const deleteItem = (compKey, section, index) => {
    setRegistry(prev => {
      const comp = prev.components[compKey];
      const arr = comp[section].filter((_, i) => i !== index);
      const next = { ...prev, components: { ...prev.components, [compKey]: { ...comp, [section]: arr } } };
      persist(next); return next;
    });
    // keep preview selection valid
    if (section === 'variants') setPreviewVariant(p => (registry.components[compKey].variants[index] === p ? null : p));
    if (section === 'sizes')    setPreviewSize(p => (registry.components[compKey].sizes[index] === p ? null : p));
    if (section === 'states')   setPreviewState(p => (registry.components[compKey].states[index] === p ? null : p));
  };

  const changeAppearance = (compKey, field, tokenKey) => {
    setRegistry(prev => {
      const comp = prev.components[compKey];
      const next = {
        ...prev,
        components: { ...prev.components, [compKey]: { ...comp, appearance: { ...comp.appearance, [field]: tokenKey } } },
      };
      persist(next); return next;
    });
  };

  /* ── token mutations ── */
  const updateToken = (groupKey, tokenKey, value) => {
    setRegistry(prev => {
      const group = prev.tokens[groupKey];
      const item = group.items[tokenKey];
      const next = {
        ...prev,
        tokens: { ...prev.tokens, [groupKey]: { ...group, items: { ...group.items, [tokenKey]: { ...item, value } } } },
      };
      persist(next);
      return next;
    });
    // apply live to DOM + persist token map
    const item = registry.tokens[groupKey]?.items[tokenKey];
    const cssVal = item?.unit === 'px' ? `${value}px` : String(value);
    try { document.documentElement.style.setProperty(tokenKey, cssVal); } catch {}
    try {
      const raw = localStorage.getItem('meercatch_tokens');
      const map = raw ? JSON.parse(raw) : {};
      map[tokenKey] = cssVal;
      localStorage.setItem('meercatch_tokens', JSON.stringify(map));
    } catch {}
  };

  /* ── publish ── */
  const handlePublish = () => {
    const publishedAt = new Date().toISOString();
    const updated = { ...registry, publishedAt };
    try { localStorage.setItem('meercatch_registry', JSON.stringify(updated)); } catch {}

    const tokenMap = {};
    Object.entries(updated.tokens).forEach(([, group]) => {
      Object.entries(group.items).forEach(([key, item]) => {
        tokenMap[key] = item.unit === 'px' ? `${item.value}px` : String(item.value);
      });
    });
    try { localStorage.setItem('meercatch_tokens', JSON.stringify(tokenMap)); } catch {}

    applyTokensToDOM(updated);
    setRegistry(updated);
  };

  /* ── nav item ── */
  const NavItem = ({ id, icon, label, count }) => {
    const active = selected === id;
    const hovered = hoverNav === id;
    return (
      <div
        onClick={() => setSelected(id)}
        onMouseEnter={() => setHoverNav(id)}
        onMouseLeave={() => setHoverNav(null)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 16px', cursor: 'pointer', userSelect: 'none',
          background: active ? NAV_SEL_BG : hovered ? NAV_HOVER : 'transparent',
          borderLeft: `2px solid ${active ? ACCENT : 'transparent'}`,
          color: active ? '#fff' : NAV_TEXT,
          fontSize: 13, fontWeight: active ? 600 : 500,
          transition: 'background 0.12s',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {count != null && <CountBadge n={count} active={active} />}
      </div>
    );
  };

  const NavHead = ({ children }) => (
    <div style={{
      padding: '0 16px 8px', marginTop: 6,
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: NAV_MUTED,
    }}>{children}</div>
  );

  /* ── resolve current view ── */
  const isComp    = selected.startsWith('comp:');
  const isToken   = selected.startsWith('token:');
  const isPublish = selected === 'publish';
  const currentTokenKey   = isToken ? selected.replace('token:', '') : null;
  const currentComp       = currentCompKey ? registry.components[currentCompKey] : null;
  const currentTokenGroup = currentTokenKey ? registry.tokens[currentTokenKey] : null;

  const publishedAtShort = registry.publishedAt
    ? new Date(registry.publishedAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div style={{ display: 'flex', margin: '-24px', height: 'calc(100vh - 64px)', background: '#f4f5f8' }}>
      {/* spinner keyframes */}
      <style>{`@keyframes mc-spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── LEFT NAV ── */}
      <div style={{
        width: 220, flexShrink: 0,
        background: NAV_BG, color: NAV_TEXT,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* brand */}
        <div style={{
          padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>Component Registry</div>
          <div style={{ fontSize: 10.5, color: NAV_MUTED, marginTop: 2 }}>디자인 시스템 관리</div>
        </div>

        <div style={{ flex: 1, paddingTop: 14 }}>
          <NavHead>Components</NavHead>
          {Object.entries(registry.components).map(([key, comp]) => (
            <NavItem key={key} id={`comp:${key}`} label={comp.label} />
          ))}

          <NavHead>Design Tokens</NavHead>
          {Object.entries(registry.tokens).map(([key, group]) => (
            <NavItem key={key} id={`token:${key}`} label={group.label} count={Object.keys(group.items).length} />
          ))}
        </div>

        {/* publish footer */}
        <div style={{ padding: '14px 16px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setSelected('publish')}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 4,
              border: selected === 'publish' ? `1px solid ${ACCENT}` : 'none',
              background: selected === 'publish' ? NAV_SEL_BG : ACCENT,
              color: selected === 'publish' ? ACCENT : '#fff',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.12s',
            }}
          >
            <span style={{ fontSize: 9 }}>●</span> 발행
          </button>
          <div style={{ fontSize: 10, color: NAV_MUTED, textAlign: 'center', marginTop: 8 }}>
            {publishedAtShort ? `마지막 발행 · ${publishedAtShort}` : '아직 발행 안 됨'}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 28, minWidth: 0 }}>
        {isComp && currentComp && (
          <ComponentView
            compKey={currentCompKey}
            comp={currentComp}
            registry={registry}
            onRename={renameComponent}
            onDescChange={changeDescription}
            onAddItem={addItem}
            onDeleteItem={deleteItem}
            onAppearanceChange={changeAppearance}
            adding={addingTo}
            addValue={addValue}
            setAddValue={setAddValue}
            setAdding={setAddingTo}
            preview={{ variant: previewVariant, size: previewSize, state: previewState }}
            setPreview={(updater) => {
              const cur = { variant: previewVariant, size: previewSize, state: previewState };
              const next = typeof updater === 'function' ? updater(cur) : updater;
              setPreviewVariant(next.variant);
              setPreviewSize(next.size);
              setPreviewState(next.state);
            }}
          />
        )}

        {isToken && currentTokenGroup && (
          <TokenGroupView
            group={currentTokenGroup}
            onTokenChange={(tokenKey, value) => updateToken(currentTokenKey, tokenKey, value)}
          />
        )}

        {isPublish && (
          <PublishView registry={registry} onPublish={handlePublish} />
        )}
      </div>
    </div>
  );
}
