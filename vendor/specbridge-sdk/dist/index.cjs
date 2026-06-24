"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AnnotList: () => AnnotList,
  AnnotPanel: () => AnnotPanel,
  AnnotPin: () => AnnotPin,
  AnnotationToolbar: () => AnnotationToolbar,
  AuthorModal: () => AuthorModal,
  COLORS: () => COLORS,
  DEFAULT_LABELS: () => DEFAULT_LABELS,
  FALLBACK_LABEL_COLOR: () => FALLBACK_LABEL_COLOR,
  LABEL_COLOR_PRESETS: () => LABEL_COLOR_PRESETS,
  LabelManagerModal: () => LabelManagerModal,
  SDK_VERSION: () => SDK_VERSION,
  STORAGE_KEYS: () => STORAGE_KEYS,
  SpecBridgeAnnotation: () => SpecBridgeAnnotation,
  httpAdapter: () => httpAdapter,
  localStorageAdapter: () => localStorageAdapter,
  useAnnotations: () => useAnnotations,
  useAuthor: () => useAuthor,
  useLabels: () => useLabels,
  whoami: () => whoami
});
module.exports = __toCommonJS(src_exports);

// src/SpecBridgeAnnotation.tsx
var import_react12 = require("react");

// src/AnnotList.tsx
var import_react = require("react");

// src/constants.ts
var STORAGE_KEYS = {
  annotations: "cs_annot_v4",
  author: "cs_annot_author",
  labels: "cs_annot_labels_v3",
  lastLabel: "cs_annot_last_label_v1",
  defaultLabel: "cs_annot_author_default_label",
  sessions: "cs_annot_sessions_v1",
  currentSession: "cs_annot_current_session"
};
var COLORS = {
  pri: "#3B82F6",
  priL: "#EFF6FF",
  priD: "#2563EB",
  side: "#111827",
  white: "#fff",
  bg: "#f3f4f6",
  brd: "#e5e7eb",
  txt: "#1f2937",
  txS: "#6b7280",
  txL: "#9ca3af",
  red: "#dc2626",
  redL: "#fef2f2",
  green: "#16a34a",
  greenL: "#f0fdf4",
  amber: "#d97706",
  amberL: "#fffbeb",
  indigo: "#3B82F6",
  indigoL: "#EFF6FF",
  slate: "#1e293b"
};
var DEFAULT_LABELS = [
  { id: "lbl-plan", name: "\uAE30\uD68D", color: "#60A5FA" },
  { id: "lbl-design", name: "\uB514\uC790\uC778", color: "#F472B6" },
  { id: "lbl-dev", name: "\uAC1C\uBC1C", color: "#34D399" },
  { id: "lbl-qa", name: "QA", color: "#A78BFA" }
];
var FALLBACK_LABEL_COLOR = "#9ca3af";
var DARK = {
  bg: "#0E0E0E",
  bg2: "#121212",
  bg3: "#202020",
  brd: "rgba(255,255,255,.09)",
  brd2: "rgba(255,255,255,.15)",
  txt: "rgba(255,255,255,.88)",
  txS: "rgba(255,255,255,.5)",
  txL: "rgba(255,255,255,.3)"
};
var FONT_FAMILY = "'Pretendard Variable', Pretendard, system-ui, sans-serif";
var LABEL_COLOR_PRESETS = [
  "#d97706",
  // amber
  "#dc2626",
  // red
  "#2563eb",
  // blue
  "#16a34a",
  // green
  "#7c3aed",
  // violet
  "#db2777",
  // pink
  "#0891b2",
  // cyan
  "#6b7280"
  // gray
];
var SESSION_STATUS_CONFIG = {
  active: { label: "\uC9C4\uD589\uC911", color: "#60a5fa", bg: "rgba(96,165,250,.18)", border: "rgba(96,165,250,.45)" },
  done: { label: "\uAC80\uD1A0\uC644\uB8CC", color: "#4ade80", bg: "rgba(74,222,128,.18)", border: "rgba(74,222,128,.45)" },
  pending: { label: "\uC218\uC815\uB300\uAE30", color: "#fbbf24", bg: "rgba(251,191,36,.18)", border: "rgba(251,191,36,.45)" }
};
var SESSION_VIEWPORT_CONFIG = {
  desktop: { label: "Desktop", icon: "\u{1F5A5}" },
  tablet: { label: "Tablet", icon: "\u{1F4DF}" },
  mobile: { label: "Mobile", icon: "\u{1F4F1}" }
};

// src/AnnotList.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function AnnotList({
  pins,
  labels,
  pageId,
  selectedId,
  hoveredId,
  showResolved,
  resolvedCount,
  onSelect,
  onHover,
  onToggleShowResolved,
  onClose
}) {
  const labelById = new Map(labels.map((l) => [l.id, l]));
  const [authorFilter, setAuthorFilter] = (0, import_react.useState)(null);
  const uniqueAuthors = Array.from(new Set(pins.map((p) => p.author).filter((a) => !!a)));
  const filteredPins = authorFilter ? pins.filter((p) => p.author === authorFilter) : pins;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      style: {
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 252,
        background: DARK.bg,
        borderRight: `1px solid ${DARK.brd}`,
        boxShadow: "4px 0 24px rgba(0,0,0,.3)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT_FAMILY
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .sb-scroll::-webkit-scrollbar{width:4px;height:4px}
        .sb-scroll::-webkit-scrollbar-track{background:transparent}
        .sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:10px}
        .sb-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.26)}
        .sb-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent}
      ` }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "14px 16px", background: DARK.bg2, flexShrink: 0, borderBottom: `1px solid ${DARK.brd}` }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 12, fontWeight: 700, color: DARK.txt }, children: "\u{1F4CB} \uBC88\uD638 \uBAA9\uB85D" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 10, color: DARK.txL, marginTop: 2, fontFamily: "monospace" }, children: pageId })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                onClick: onClose,
                style: {
                  background: "rgba(255,255,255,.08)",
                  border: "none",
                  color: DARK.txS,
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  cursor: "pointer",
                  fontSize: 14
                },
                children: "\xD7"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 11, color: DARK.txL }, children: [
              "\uCD1D ",
              filteredPins.length,
              "\uAC1C"
            ] }),
            resolvedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                onClick: onToggleShowResolved,
                title: showResolved ? "\uD574\uACB0\uB41C \uD56D\uBAA9 \uC228\uAE30\uAE30" : "\uD574\uACB0\uB41C \uD56D\uBAA9 \uBCF4\uAE30",
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 8px",
                  borderRadius: 2,
                  border: `1px solid ${showResolved ? "rgba(22,163,74,.5)" : DARK.brd}`,
                  background: showResolved ? "rgba(22,163,74,.15)" : "rgba(255,255,255,.04)",
                  color: showResolved ? "#4ade80" : DARK.txL,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .15s"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 11 }, children: showResolved ? "\u2713" : "\u25CB" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\uD574\uACB0 ",
                    resolvedCount
                  ] })
                ]
              }
            )
          ] }),
          uniqueAuthors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { marginTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "select",
            {
              value: authorFilter ?? "",
              onChange: (e) => setAuthorFilter(e.target.value || null),
              style: {
                width: "100%",
                padding: "4px 8px",
                background: DARK.bg3,
                border: `1px solid ${authorFilter ? "rgba(59,130,246,.5)" : DARK.brd}`,
                borderRadius: 2,
                color: authorFilter ? DARK.txt : DARK.txL,
                fontSize: 11,
                cursor: "pointer",
                outline: "none",
                fontFamily: FONT_FAMILY
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "", style: { background: DARK.bg3, color: DARK.txL }, children: "\uC804\uCCB4 \uC791\uC131\uC790" }),
                uniqueAuthors.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: a, style: { background: DARK.bg3, color: DARK.txt }, children: a }, a))
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: 8 }, children: filteredPins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              textAlign: "center",
              color: DARK.txL,
              fontSize: 12,
              marginTop: 36,
              lineHeight: 1.8
            },
            children: authorFilter ? "\uC120\uD0DD\uD55C \uC791\uC131\uC790\uC758 \uD540\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
              "\uC544\uC9C1 \uCD94\uAC00\uB41C \uB808\uC774\uBE14\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
              "\uD654\uBA74\uC744 \uD074\uB9AD\uD574\uC11C \uCD94\uAC00\uD558\uC138\uC694."
            ] })
          }
        ) : filteredPins.map((p) => {
          const sel = p.id === selectedId;
          const hov = p.id === hoveredId;
          const label = p.labelId ? labelById.get(p.labelId) : void 0;
          const color = label?.color ?? FALLBACK_LABEL_COLOR;
          const resolved = p.status === "resolved";
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              onClick: () => onSelect(p.id),
              onMouseEnter: () => onHover?.(p.id),
              onMouseLeave: () => onHover?.(null),
              style: {
                padding: "10px 12px",
                borderRadius: 2,
                marginBottom: 4,
                cursor: "pointer",
                border: `1px solid ${sel ? color : hov ? color : DARK.brd}`,
                background: sel ? `${color}1a` : hov ? `${color}0d` : DARK.bg2,
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                transition: "all .12s",
                opacity: resolved ? 0.6 : 1
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    style: {
                      position: "relative",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: color,
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    },
                    children: [
                      p.num,
                      resolved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "span",
                        {
                          style: {
                            position: "absolute",
                            top: -3,
                            right: -3,
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            background: "#16a34a",
                            color: "#fff",
                            fontSize: 7,
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1.5px solid #fff"
                          },
                          children: "\u2713"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: DARK.txt, overflow: "hidden" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "span",
                      {
                        style: {
                          padding: "1px 7px",
                          borderRadius: 999,
                          background: `${color}22`,
                          color,
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                          textDecoration: resolved ? "line-through" : "none"
                        },
                        children: label?.name ?? "\uBBF8\uBD84\uB958"
                      }
                    ),
                    resolved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 9, padding: "1px 5px", background: "rgba(22,163,74,.2)", color: "#4ade80", borderRadius: 5, fontWeight: 700, flexShrink: 0 }, children: "\uD574\uACB0" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, marginTop: 2 }, children: [
                    p.author && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: 10, color: DARK.txL }, children: p.author }),
                    p.comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 9, padding: "1px 5px", background: "rgba(59,130,246,.2)", color: "#93C5FD", borderRadius: 5, fontWeight: 700 }, children: [
                      "\u{1F4AC} ",
                      p.comments.length
                    ] })
                  ] }),
                  p.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { fontSize: 11, color: DARK.txL, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: p.note })
                ] })
              ]
            },
            p.id
          );
        }) })
      ]
    }
  );
}

// src/AnnotPanel.tsx
var import_react2 = require("react");

// src/Markdown.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var COLOR_MAP = {
  red: "#ef4444",
  green: "#34D399",
  blue: "#60A5FA",
  yellow: "#FCD34D",
  orange: "#FB923C",
  purple: "#A78BFA",
  pink: "#F472B6",
  gray: "#9CA3AF"
};
function parseInline(text, theme) {
  const codeStyle = theme === "dark" ? { background: "rgba(255,255,255,.13)", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", fontSize: "0.88em" } : { background: "rgba(0,0,0,.07)", padding: "1px 5px", borderRadius: 3, fontFamily: "monospace", fontSize: "0.88em" };
  const parts = [];
  let i = 0;
  let buf = "";
  let keyN = 0;
  const flush = () => {
    if (buf) {
      parts.push(buf);
      buf = "";
    }
  };
  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: text.slice(i + 2, end) }, keyN++));
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] !== "*") {
      const end = text.indexOf("*", i + 1);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("em", { children: text.slice(i + 1, end) }, keyN++));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "_" && text[i + 1] === "_") {
      const end = text.indexOf("__", i + 2);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("strong", { children: text.slice(i + 2, end) }, keyN++));
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "_" && text[i + 1] !== "_") {
      const end = text.indexOf("_", i + 1);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("em", { children: text.slice(i + 1, end) }, keyN++));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        flush();
        parts.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { style: codeStyle, children: text.slice(i + 1, end) }, keyN++));
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "{") {
      const colon = text.indexOf(":", i + 1);
      const close = text.indexOf("}", i + 1);
      if (colon !== -1 && close !== -1 && colon < close) {
        const colorKey = text.slice(i + 1, colon).trim();
        const colorVal = COLOR_MAP[colorKey] ?? (colorKey.startsWith("#") ? colorKey : null);
        if (colorVal) {
          flush();
          parts.push(
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: colorVal }, children: text.slice(colon + 1, close) }, keyN++)
          );
          i = close + 1;
          continue;
        }
      }
    }
    if (text[i] === "[") {
      const cb = text.indexOf("]", i + 1);
      if (cb !== -1 && text[cb + 1] === "(") {
        const cp = text.indexOf(")", cb + 2);
        if (cp !== -1) {
          flush();
          parts.push(
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "a",
              {
                href: text.slice(cb + 2, cp),
                target: "_blank",
                rel: "noopener noreferrer",
                style: { color: "inherit", textDecoration: "underline" },
                children: text.slice(i + 1, cb)
              },
              keyN++
            )
          );
          i = cp + 1;
          continue;
        }
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return parts.length === 1 ? parts[0] : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: parts });
}
function Markdown({ children, theme = "light", style }) {
  const isDark = theme === "dark";
  const t = theme;
  const codeBlockStyle = {
    display: "block",
    background: isDark ? "rgba(0,0,0,.3)" : "#f3f4f6",
    color: isDark ? "#e2e8f0" : "#374151",
    padding: "8px 10px",
    borderRadius: 6,
    fontFamily: "monospace",
    fontSize: "0.85em",
    whiteSpace: "pre",
    overflowX: "auto",
    margin: "4px 0"
  };
  const blockquoteStyle = {
    borderLeft: `3px solid ${isDark ? "rgba(255,255,255,.28)" : "#d1d5db"}`,
    margin: "3px 0",
    paddingLeft: 10,
    color: isDark ? "rgba(255,255,255,.48)" : "#6b7280",
    fontStyle: "italic"
  };
  const hrStyle = {
    border: "none",
    borderTop: `1px solid ${isDark ? "rgba(255,255,255,.18)" : "#e5e7eb"}`,
    margin: "8px 0"
  };
  const lines = children.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trimStart().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { style: codeBlockStyle, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("code", { children: codeLines.join("\n") }) }, `cb${i}`)
      );
      i++;
      continue;
    }
    if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      elements.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("hr", { style: hrStyle }, `hr${i}`));
      i++;
      continue;
    }
    const hm = line.match(/^(#{1,3})\s+(.+)/);
    if (hm) {
      const level = hm[1].length;
      const sizes = [17, 14, 13];
      const marginTops = [8, 6, 4];
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: sizes[level - 1], fontWeight: 700, margin: `${marginTops[level - 1]}px 0 2px`, lineHeight: 1.3 }, children: parseInline(hm[2], t) }, `h${i}`)
      );
      i++;
      continue;
    }
    if (line.startsWith(">")) {
      const text = line.replace(/^>\s?/, "");
      elements.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: blockquoteStyle, children: parseInline(text, t) }, `bq${i}`));
      i++;
      continue;
    }
    if (/^(\s*)[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^(\s*)[-*]\s+/.test(lines[i])) {
        const m = lines[i].match(/^(\s*)[-*]\s+(.+)/);
        if (m) items.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { style: { marginBottom: 1 }, children: parseInline(m[2], t) }, `li${i}`));
        i++;
      }
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ul", { style: { margin: "3px 0", paddingLeft: 18, lineHeight: 1.6 }, children: items }, `ul${i}`)
      );
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const m = lines[i].match(/^\d+\.\s+(.+)/);
        if (m) items.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { style: { marginBottom: 1 }, children: parseInline(m[1], t) }, `li${i}`));
        i++;
      }
      elements.push(
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("ol", { style: { margin: "3px 0", paddingLeft: 18, lineHeight: 1.6 }, children: items }, `ol${i}`)
      );
      continue;
    }
    if (line.trim() === "") {
      elements.push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { height: 6 } }, `sp${i}`));
      i++;
      continue;
    }
    elements.push(
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { lineHeight: 1.65 }, children: parseInline(line, t) }, `p${i}`)
    );
    i++;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style, children: elements });
}

// src/AnnotPanel.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var PANEL_W_SINGLE = 400;
var PANEL_W_DOUBLE = 680;
var LEFT_COL_W = 360;
var PIN_W = 26;
var OFFSET = 14;
var EDGE_MARGIN = 10;
var TOOLBAR_RESERVE = 72;
var fmtTime = (iso) => new Date(iso).toLocaleString("ko-KR", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});
function AnnotPanel({
  pins,
  selectedId,
  anchor,
  labels,
  currentAuthor,
  leftBound = 0,
  onClose,
  onUpdate,
  onDelete,
  onManageLabels,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onResolve,
  onReopen
}) {
  const pin = pins.find((p) => p.id === selectedId);
  const num = pin?.num ?? 0;
  const [panelMode, setPanelMode] = (0, import_react2.useState)("view");
  const [showThreadTooltip, setShowThreadTooltip] = (0, import_react2.useState)(false);
  const [showMoreMenu, setShowMoreMenu] = (0, import_react2.useState)(false);
  const [note, setNote] = (0, import_react2.useState)("");
  const [noteMode, setNoteMode] = (0, import_react2.useState)("write");
  const [saved, setSaved] = (0, import_react2.useState)(false);
  const [newComment, setNewComment] = (0, import_react2.useState)("");
  const [threadOpen, setThreadOpen] = (0, import_react2.useState)(false);
  const [pos, setPos] = (0, import_react2.useState)(null);
  const noteRef = (0, import_react2.useRef)(null);
  const commentInputRef = (0, import_react2.useRef)(null);
  const panelRef = (0, import_react2.useRef)(null);
  const commentsEndRef = (0, import_react2.useRef)(null);
  const moreMenuRef = (0, import_react2.useRef)(null);
  const hasComments = (pin?.comments.length ?? 0) > 0;
  const showThread = threadOpen && panelMode === "view";
  const panelWidth = showThread ? PANEL_W_DOUBLE : PANEL_W_SINGLE;
  (0, import_react2.useEffect)(() => {
    if (!pin) return;
    const mode = (pin.note ?? "").length > 0 ? "view" : "edit";
    setPanelMode(mode);
    setNote(pin.note ?? "");
    setSaved(false);
    setNewComment("");
    setThreadOpen((pin?.comments.length ?? 0) > 0);
    setNoteMode("write");
  }, [selectedId]);
  (0, import_react2.useEffect)(() => {
    if (panelMode === "edit" && noteMode === "write") {
      const id = window.setTimeout(() => noteRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [panelMode, noteMode]);
  (0, import_react2.useEffect)(() => {
    if (threadOpen) {
      const id = window.setTimeout(() => commentInputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
  }, [threadOpen]);
  (0, import_react2.useEffect)(() => {
    if (showThread) {
      commentsEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [pin?.comments.length, showThread]);
  (0, import_react2.useEffect)(() => {
    if (!showMoreMenu) return;
    const onDown = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showMoreMenu]);
  (0, import_react2.useEffect)(() => {
    const onKey = (e) => {
      const t = e.target;
      const inInput = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape") {
        if (showMoreMenu) {
          setShowMoreMenu(false);
          return;
        }
        if (panelMode === "edit") {
          setNote(pin?.note ?? "");
          setPanelMode("view");
          return;
        }
        if (inInput) return;
        onClose();
        return;
      }
      if (inInput) return;
      if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        setPanelMode("edit");
        setNoteMode("write");
        return;
      }
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setThreadOpen((v) => !v);
        return;
      }
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        if (!pin) return;
        if (pin.status === "resolved") onReopen(pin.id);
        else onResolve(pin.id);
        return;
      }
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        if (!pin) return;
        if (window.confirm("\uC774 \uC5B4\uB178\uD14C\uC774\uC158\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) onDelete(pin.id);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onDelete, onReopen, onResolve, panelMode, pin, showMoreMenu]);
  (0, import_react2.useLayoutEffect)(() => {
    const compute = () => {
      const panelH = panelRef.current?.getBoundingClientRect().height ?? 480;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const minLeft = Math.max(EDGE_MARGIN, leftBound + EDGE_MARGIN);
      let left = anchor.x + PIN_W + OFFSET;
      let side = "right";
      if (left + panelWidth > vw - EDGE_MARGIN) {
        left = anchor.x - OFFSET - panelWidth;
        side = "left";
      }
      if (left < minLeft) {
        left = minLeft;
        side = "right";
      }
      left = Math.max(minLeft, Math.min(left, vw - panelWidth - EDGE_MARGIN));
      let top = anchor.y - 8;
      const maxTop = vh - TOOLBAR_RESERVE - panelH;
      if (top > maxTop) top = maxTop;
      top = Math.max(EDGE_MARGIN, top);
      setPos({ left, top, side });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [anchor.x, anchor.y, selectedId, leftBound, panelWidth]);
  if (!pin) return null;
  const currentLabel = labels.find((l) => l.id === pin.labelId);
  const headerColor = currentLabel?.color ?? FALLBACK_LABEL_COLOR;
  const isResolved = pin.status === "resolved";
  const noteChanged = note !== (pin.note ?? "");
  const handleSaveNote = () => {
    if (!noteChanged && !(!pin.note && note)) return;
    onUpdate(pin.id, { note });
    setSaved(true);
    setPanelMode("view");
    window.setTimeout(() => setSaved(false), 2e3);
  };
  const handleSelectLabel = (labelId) => {
    onUpdate(pin.id, { labelId });
  };
  const handleSubmitComment = () => {
    const t = newComment.trim();
    if (!t || !currentAuthor) return;
    onAddComment(pin.id, t);
    setNewComment("");
  };
  const closeBtnStyle = {
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    color: "rgba(255,255,255,.45)",
    width: 22,
    height: 22,
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  };
  const inp = {
    width: "100%",
    padding: "8px 10px",
    border: `1px solid ${DARK.brd}`,
    borderRadius: 7,
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: DARK.bg3,
    color: DARK.txt
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      ref: panelRef,
      style: {
        position: "fixed",
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        width: panelWidth,
        minHeight: 500,
        maxHeight: `calc(100vh - ${TOOLBAR_RESERVE + EDGE_MARGIN}px)`,
        zIndex: 1e4,
        background: "#1A1A1A",
        borderRadius: 14,
        border: `1px solid ${DARK.brd2}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 18px 48px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.15)",
        animation: "specbridgeAnnotIn .16s ease",
        visibility: pos ? "visible" : "hidden",
        transformOrigin: pos?.side === "left" ? "right top" : "left top"
      },
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("style", { children: `
        @keyframes specbridgeAnnotIn{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
        .sb-scroll::-webkit-scrollbar{width:4px;height:4px}
        .sb-scroll::-webkit-scrollbar-track{background:transparent}
        .sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:10px}
        .sb-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.26)}
        .sb-scroll{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent}
        .sb-md-editor{caret-color:#fff}
        .sb-md-editor h1{font-size:15px;font-weight:700;margin:3px 0;color:rgba(255,255,255,.92);line-height:1.4}
        .sb-md-editor h2{font-size:13px;font-weight:700;margin:2px 0;color:rgba(255,255,255,.85)}
        .sb-md-editor li{display:list-item;list-style:disc;margin-left:18px;padding:1px 0}
        .sb-md-editor p{margin:0;padding:1px 0;min-height:1.2em}
        .sb-md-editor strong{font-weight:700;color:rgba(255,255,255,.9)}
        .sb-md-editor em{font-style:italic;color:rgba(255,255,255,.8)}
        .sb-md-editor code{font-family:monospace;background:rgba(255,255,255,.1);padding:1px 4px;border-radius:3px;font-size:11px;color:#86efac}
        .sb-md-editor:empty::before{content:attr(data-placeholder);color:rgba(255,255,255,.25);pointer-events:none;white-space:pre-line}
      ` }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            style: {
              padding: "12px 14px",
              color: COLORS.white,
              background: "rgba(0,0,0,.18)",
              borderRadius: "14px 14px 0 0",
              borderBottom: `1px solid ${DARK.brd}`,
              flexShrink: 0
            },
            children: panelMode === "view" ? (
              /* 상세보기 헤더: [번호원형] [작성자 · 날짜] [상태] spacer [...] [×] */
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 7, minWidth: 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "div",
                  {
                    style: {
                      width: 16,
                      height: 16,
                      borderRadius: 5,
                      background: headerColor,
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    },
                    children: num
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 13, fontWeight: 600, color: DARK.txt, whiteSpace: "nowrap", flexShrink: 0 }, children: (() => {
                  const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(pin.author);
                  const limit = hasKorean ? 5 : 10;
                  return pin.author.length > limit ? pin.author.slice(0, limit) + "\u2026" : pin.author;
                })() }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: DARK.txL, flexShrink: 0, whiteSpace: "nowrap", paddingTop: 4 }, children: fmtTime(pin.createdAt) }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1, minWidth: 0 } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative", flexShrink: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                      "button",
                      {
                        onClick: () => setThreadOpen((v) => !v),
                        onMouseEnter: () => setShowThreadTooltip(true),
                        onMouseLeave: () => setShowThreadTooltip(false),
                        style: {
                          ...closeBtnStyle,
                          width: hasComments ? "auto" : 22,
                          padding: hasComments ? "0 6px" : 0,
                          gap: 4,
                          background: threadOpen ? "rgba(59,130,246,.22)" : "transparent",
                          color: threadOpen ? "#93C5FD" : "rgba(255,255,255,.45)",
                          borderRadius: 6
                        },
                        title: "\uC2A4\uB808\uB4DC (M)",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { width: "13", height: "13", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M13 1H3C2.45 1 2 1.45 2 2v8c0 .55.45 1 1 1h2.5l2.5 3 2.5-3H13c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z", fill: "currentColor" }) }),
                          hasComments && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, fontWeight: 700, lineHeight: 1 }, children: pin.comments.length })
                        ]
                      }
                    ),
                    showThreadTooltip && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 6, background: "rgba(15,23,42,.95)", color: "rgba(255,255,255,.85)", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap", pointerEvents: "none", border: "1px solid rgba(255,255,255,.1)" }, children: "\uC2A4\uB808\uB4DC" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { ref: moreMenuRef, style: { position: "relative", flexShrink: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: () => setShowMoreMenu((v) => !v),
                        style: { ...closeBtnStyle, fontSize: 16, letterSpacing: 1, background: showMoreMenu ? "rgba(255,255,255,.09)" : "transparent" },
                        title: "\uB354\uBCF4\uAE30",
                        children: "\xB7\xB7\xB7"
                      }
                    ),
                    showMoreMenu && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "absolute", top: "calc(100% + 4px)", right: 0, background: DARK.bg3, border: `1px solid ${DARK.brd2}`, borderRadius: 9, padding: 4, zIndex: 10001, minWidth: 130, boxShadow: "0 8px 28px rgba(0,0,0,.45)" }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        MoreMenuItem,
                        {
                          icon: isResolved ? "\u21BA" : "\u2713",
                          label: isResolved ? "\uBBF8\uD574\uACB0\uB85C \uBCC0\uACBD" : "\uD574\uACB0\uD558\uAE30",
                          shortcut: "C",
                          color: isResolved ? "#4ade80" : void 0,
                          onClick: () => {
                            isResolved ? onReopen(pin.id) : onResolve(pin.id);
                            setShowMoreMenu(false);
                          }
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        MoreMenuItem,
                        {
                          icon: "\u270F",
                          label: "\uC218\uC815\uD558\uAE30",
                          shortcut: "E",
                          onClick: () => {
                            setPanelMode("edit");
                            setNoteMode("write");
                            setShowMoreMenu(false);
                          }
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.08)", margin: "3px 6px" } }),
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                        MoreMenuItem,
                        {
                          icon: "\u{1F5D1}",
                          label: "\uC0AD\uC81C",
                          shortcut: "D",
                          color: "#f87171",
                          onClick: () => {
                            setShowMoreMenu(false);
                            if (window.confirm("\uC774 \uC5B4\uB178\uD14C\uC774\uC158\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) onDelete(pin.id);
                          }
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { width: 1, height: 14, background: DARK.brd2, flexShrink: 0, margin: "0 2px" } }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: onClose, style: closeBtnStyle, title: "\uB2EB\uAE30 (ESC)", children: "\xD7" })
                ] })
              ] })
            ) : (
              /* 수정 헤더: [#N] [작성/수정하기] spacer [작성자·날짜] [×] */
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "div",
                  {
                    style: {
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: headerColor,
                      color: COLORS.white,
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    },
                    children: num
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 13, fontWeight: 700 }, children: (pin.note ?? "").length > 0 ? "\uC218\uC815\uD558\uAE30" : "\uC791\uC131\uD558\uAE30" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1 } }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { style: { fontSize: 9, color: DARK.txL }, children: [
                  pin.author,
                  " \xB7 ",
                  fmtTime(pin.createdAt)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: onClose, style: closeBtnStyle, children: "\xD7" })
              ] })
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, display: "flex", minHeight: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              style: {
                width: showThread ? LEFT_COL_W : "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                flexShrink: 0
              },
              children: panelMode === "view" ? (
                /* ── 상세보기 ── */
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: "16px 18px" }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(StatusBadge, { resolved: isResolved, resolvedBy: pin.resolvedBy, resolvedAt: pin.resolvedAt }),
                  (pin.note ?? "").length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Markdown, { theme: "dark", style: { fontSize: 13, color: DARK.txt, lineHeight: 1.75 }, children: pin.note }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { color: DARK.txL, fontSize: 12, textAlign: "center", padding: "28px 0" }, children: [
                    "\uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("br", {}),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: () => {
                          setPanelMode("edit");
                          setNoteMode("write");
                        },
                        style: { marginTop: 10, fontSize: 12, color: COLORS.pri, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" },
                        children: "\uB0B4\uC6A9 \uC791\uC131\uD558\uAE30"
                      }
                    )
                  ] })
                ] }) })
              ) : (
                /* ── 작성/수정하기 ── */
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: "12px 14px", gap: 10 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flexShrink: 0 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }, children: [
                    labels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 11, color: DARK.txL }, children: "\uB4F1\uB85D\uB41C \uB808\uC774\uBE14\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) : labels.map((l) => {
                      const selected = pin.labelId === l.id;
                      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                        "button",
                        {
                          onClick: () => handleSelectLabel(selected ? null : l.id),
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 10px",
                            height: 20,
                            borderRadius: 1,
                            border: `1px solid ${selected ? `${l.color}99` : "rgba(255,255,255,.15)"}`,
                            background: selected ? `${l.color}22` : "transparent",
                            color: selected ? l.color : "rgba(255,255,255,.45)",
                            fontSize: 11,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all .15s",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            fontFamily: "inherit"
                          },
                          onMouseEnter: (e) => {
                            if (!selected) {
                              e.currentTarget.style.borderColor = `${l.color}66`;
                              e.currentTarget.style.color = l.color;
                            }
                          },
                          onMouseLeave: (e) => {
                            if (!selected) {
                              e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                              e.currentTarget.style.color = "rgba(255,255,255,.45)";
                            }
                          },
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { width: 5, height: 5, borderRadius: "50%", background: selected ? l.color : "rgba(255,255,255,.3)", flexShrink: 0 } }),
                            l.name
                          ]
                        },
                        l.id
                      );
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { flex: 1 } }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: onManageLabels,
                        style: {
                          fontSize: 10,
                          padding: "2px 8px",
                          border: `1px solid ${DARK.brd}`,
                          borderRadius: 5,
                          background: DARK.bg3,
                          color: DARK.txS,
                          cursor: "pointer",
                          flexShrink: 0
                        },
                        children: "\uAD00\uB9AC"
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, position: "relative", minHeight: 0, display: "flex", flexDirection: "column" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      MarkdownEditor,
                      {
                        editorRef: noteRef,
                        value: note,
                        onChange: setNote,
                        onCtrlEnter: handleSaveNote,
                        placeholder: "\uAE30\uB2A5 \uC815\uCC45, \uC694\uAD6C\uC0AC\uD56D, \uC0AC\uC591 \uB4F1\uC744 \uC791\uC131\uD558\uC138\uC694.\n\n**\uAD75\uAC8C**, *\uAE30\uC6B8\uC784*, `\uCF54\uB4DC`\n# \uC81C\uBAA9, - \uBAA9\uB85D, > \uC778\uC6A9",
                        className: "sb-scroll sb-md-editor",
                        style: { ...inp, flex: 1, lineHeight: 1.65, minHeight: 0, paddingBottom: 32, overflowY: "auto", cursor: "text" }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                      "button",
                      {
                        onClick: handleSaveNote,
                        disabled: !noteChanged,
                        style: {
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          padding: "3px 10px",
                          border: "none",
                          borderRadius: 2,
                          background: saved ? COLORS.green : noteChanged ? COLORS.pri : "rgba(255,255,255,.1)",
                          color: saved || noteChanged ? COLORS.white : DARK.txL,
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: noteChanged ? "pointer" : "default",
                          transition: "background .2s"
                        },
                        children: saved ? "\u2713 \uC800\uC7A5\uB428" : "\uC800\uC7A5"
                      }
                    )
                  ] })
                ] }) })
              )
            }
          ),
          showThread && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { width: 1, background: DARK.brd, alignSelf: "stretch", flexShrink: 0 } }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: DARK.bg }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { padding: "11px 14px 9px", borderBottom: `1px solid ${DARK.brd}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: DARK.txt }, children: "Comment" }),
                pin.comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 10, color: DARK.txL, fontWeight: 500 }, children: pin.comments.length })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 2 }, children: [
                pin.comments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 11, color: DARK.txL, textAlign: "center", padding: "32px 0", opacity: 0.6 }, children: "\uC2A4\uB808\uB4DC\uB97C \uC2DC\uC791\uD574\uBCF4\uC138\uC694" }) : pin.comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  CommentItem,
                  {
                    comment: c,
                    canEdit: c.author === currentAuthor,
                    onUpdate: (text) => onUpdateComment(pin.id, c.id, text),
                    onDelete: () => onDeleteComment(pin.id, c.id)
                  },
                  c.id
                )),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { ref: commentsEndRef })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { padding: "8px 10px 10px", flexShrink: 0, borderTop: `1px solid ${DARK.brd}`, background: DARK.bg }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { position: "relative" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "textarea",
                  {
                    ref: commentInputRef,
                    className: "sb-scroll",
                    value: newComment,
                    onChange: (e) => setNewComment(e.target.value),
                    onKeyDown: (e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmitComment();
                      if (e.key === "Escape") onClose();
                    },
                    placeholder: currentAuthor ? "\uC2A4\uB808\uB4DC\uC5D0\uC11C \uD68C\uC2E0\u2026" : "\uBA3C\uC800 \uC791\uC131\uC790\uB97C \uB4F1\uB85D\uD558\uC138\uC694",
                    disabled: !currentAuthor,
                    rows: 2,
                    style: {
                      ...inp,
                      width: "100%",
                      resize: "none",
                      lineHeight: 1.6,
                      paddingTop: 6,
                      paddingBottom: 32,
                      borderRadius: 2,
                      boxSizing: "border-box"
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "button",
                  {
                    onClick: handleSubmitComment,
                    disabled: !newComment.trim() || !currentAuthor,
                    style: {
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      padding: "3px 10px",
                      border: "none",
                      borderRadius: 2,
                      background: newComment.trim() && currentAuthor ? COLORS.pri : "rgba(255,255,255,.1)",
                      color: newComment.trim() && currentAuthor ? COLORS.white : DARK.txL,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: newComment.trim() && currentAuthor ? "pointer" : "default",
                      transition: "background .2s"
                    },
                    children: "\uC800\uC7A5"
                  }
                )
              ] }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function MoreMenuItem({
  icon,
  label,
  shortcut,
  color,
  onClick
}) {
  const [hov, setHov] = (0, import_react2.useState)(false);
  const base = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    width: "100%",
    padding: "6px 10px",
    border: "none",
    borderRadius: 5,
    background: hov ? "rgba(255,255,255,.07)" : "transparent",
    color: color ?? "rgba(255,255,255,.78)",
    fontSize: 12,
    cursor: "pointer",
    textAlign: "left",
    transition: "background .1s",
    fontFamily: "inherit",
    boxSizing: "border-box"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { style: base, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), onClick, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { width: 14, textAlign: "center", fontSize: 13 }, children: icon }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { flex: 1 }, children: label }),
    shortcut && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.28)", fontFamily: "monospace", marginLeft: 4 }, children: shortcut })
  ] });
}
function StatusBadge({ resolved, resolvedBy, resolvedAt }) {
  if (!resolved) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { marginBottom: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "3px 10px",
        borderRadius: 2,
        fontSize: 10,
        fontWeight: 700,
        background: "rgba(22,163,74,.18)",
        color: "#86efac",
        border: "1px solid rgba(22,163,74,.35)",
        whiteSpace: "nowrap"
      },
      children: [
        "\u2713 \uD574\uACB0",
        resolvedBy ? ` - ${resolvedBy}` : "",
        resolvedAt ? ` \xB7 ${fmtTime(resolvedAt)}` : ""
      ]
    }
  ) });
}
function htmlTableToMd(html) {
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const table = doc.querySelector("table");
    if (!table) return "";
    const rows = Array.from(table.querySelectorAll("tr"));
    if (!rows.length) return "";
    const toRow = (cells) => "| " + cells.map((c) => (c.textContent ?? "").trim().replace(/\|/g, "\\|")).join(" | ") + " |";
    const headerCells = Array.from(rows[0].querySelectorAll("th,td"));
    const lines = [
      toRow(headerCells),
      "| " + headerCells.map(() => "---").join(" | ") + " |"
    ];
    for (let i = 1; i < rows.length; i++)
      lines.push(toRow(Array.from(rows[i].querySelectorAll("td,th"))));
    return lines.join("\n");
  } catch {
    return "";
  }
}
function mdToEditorHtml(md) {
  if (!md.trim()) return "";
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s) => {
    let h = esc(s);
    h = h.replace(/\{([^}:]+):([^}]*)\}/g, (match, key, text) => {
      const val = key.startsWith("#") ? key : null;
      return val ? `<span style="color:${val}" data-color="${val}">${text}</span>` : match;
    });
    h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\*(.+?)\*/g, "<em>$1</em>");
    h = h.replace(/`(.+?)`/g, "<code>$1</code>");
    return h;
  };
  return md.split("\n").map((line) => {
    if (/^# /.test(line)) return `<h1>${inline(line.slice(2))}</h1>`;
    if (/^## /.test(line)) return `<h2>${inline(line.slice(3))}</h2>`;
    if (/^- /.test(line)) return `<li>${inline(line.slice(2))}</li>`;
    return `<p>${inline(line) || "<br>"}</p>`;
  }).join("");
}
function domToMd(root) {
  function inlineMd(node) {
    if (node.nodeType === Node.TEXT_NODE)
      return (node.textContent ?? "").replace(/\u200B/g, "");
    if (!(node instanceof HTMLElement)) return "";
    const inner = Array.from(node.childNodes).map(inlineMd).join("");
    switch (node.tagName.toLowerCase()) {
      case "strong":
      case "b":
        return `**${inner}**`;
      case "em":
      case "i":
        return `*${inner}*`;
      case "code":
        return `\`${inner}\``;
      case "br":
        return "";
      case "span": {
        const c = node.getAttribute("data-color");
        return c ? `{${c}:${inner}}` : inner;
      }
      default:
        return inner;
    }
  }
  const lines = [];
  for (const child of Array.from(root.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const t = (child.textContent ?? "").replace(/\u200B/g, "");
      if (t.trim()) lines.push(t);
      continue;
    }
    if (!(child instanceof HTMLElement)) continue;
    const tag = child.tagName.toLowerCase();
    if (tag === "ul" || tag === "ol") {
      for (const li of Array.from(child.children)) lines.push(`- ${inlineMd(li)}`);
    } else if (tag === "li") {
      lines.push(`- ${inlineMd(child)}`);
    } else if (tag === "h1") {
      lines.push(`# ${inlineMd(child)}`);
    } else if (tag === "h2") {
      lines.push(`## ${inlineMd(child)}`);
    } else if (tag === "p" || tag === "div") {
      const t = inlineMd(child);
      lines.push(t);
    } else {
      const t = inlineMd(child);
      if (t) lines.push(t);
    }
  }
  return lines.join("\n");
}
var MD_PALETTE = ["#f87171", "#fb923c", "#fbbf24", "#4ade80", "#60a5fa", "#a78bfa", "#f472b6"];
function MarkdownEditor({ value, onChange, onCtrlEnter, placeholder, style, className, editorRef }) {
  const inner = (0, import_react2.useRef)(null);
  const ref = editorRef ?? inner;
  const lastMd = (0, import_react2.useRef)("");
  const composing = (0, import_react2.useRef)(false);
  const [hovColor, setHovColor] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    const el = ref.current;
    if (!el || lastMd.current === value) return;
    lastMd.current = value;
    el.innerHTML = mdToEditorHtml(value);
  }, [value]);
  const emit = () => {
    const el = ref.current;
    if (!el) return;
    const md = domToMd(el);
    lastMd.current = md;
    onChange(md);
  };
  const getCaretBlock = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return null;
    let node = sel.getRangeAt(0).startContainer;
    while (node && node !== ref.current) {
      if (node instanceof HTMLElement && /^(P|H[1-6]|LI|DIV)$/.test(node.tagName)) return node;
      node = node.parentNode;
    }
    return null;
  };
  const transformBlock = (block, tag) => {
    const el = document.createElement(tag);
    el.innerHTML = "<br>";
    block.replaceWith(el);
    const r = document.createRange();
    r.setStart(el, 0);
    r.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    emit();
  };
  const tryInlineTransform = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return false;
    const range = sel.getRangeAt(0);
    if (!range.collapsed || range.startContainer.nodeType !== Node.TEXT_NODE) return false;
    const textNode = range.startContainer;
    const before = textNode.textContent.slice(0, range.startOffset);
    const after = textNode.textContent.slice(range.startOffset);
    const patterns = [
      [/^(.*)\*\*([^*\n]+)\*\*$/, "strong"],
      [/^(.*[^*]|^)\*([^*\n]+)\*$/, "em"],
      [/^(.*)`([^`\n]+)`$/, "code"]
    ];
    for (const [re, tag] of patterns) {
      const m = before.match(re);
      if (!m) continue;
      const frag = document.createDocumentFragment();
      if (m[1]) frag.appendChild(document.createTextNode(m[1]));
      const el = document.createElement(tag);
      el.textContent = m[2];
      frag.appendChild(el);
      const cursorNode = document.createTextNode("\u200B");
      frag.appendChild(cursorNode);
      if (after) frag.appendChild(document.createTextNode(after));
      textNode.parentNode.replaceChild(frag, textNode);
      const r = document.createRange();
      r.setStart(cursorNode, 1);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      return true;
    }
    return false;
  };
  const applyColor = (color) => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    const span = document.createElement("span");
    span.setAttribute("data-color", color);
    span.style.color = color;
    const fragment = range.extractContents();
    fragment.querySelectorAll("[data-color]").forEach((el) => el.replaceWith(...Array.from(el.childNodes)));
    span.appendChild(fragment);
    range.insertNode(span);
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);
    emit();
    ref.current?.focus();
  };
  const clearColor = () => {
    const sel = window.getSelection();
    if (!sel?.rangeCount) return;
    const range = sel.getRangeAt(0);
    const root = ref.current;
    if (range.collapsed) {
      let node = range.startContainer;
      while (node && node !== root) {
        if (node instanceof HTMLElement && node.hasAttribute("data-color")) {
          node.replaceWith(...Array.from(node.childNodes));
          emit();
          return;
        }
        node = node.parentNode;
      }
      return;
    }
    const fragment = range.extractContents();
    fragment.querySelectorAll("[data-color]").forEach((el) => el.replaceWith(...Array.from(el.childNodes)));
    range.insertNode(fragment);
    emit();
    ref.current?.focus();
  };
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onCtrlEnter?.();
      return;
    }
    if (composing.current) return;
    if (e.key === " ") {
      const block = getCaretBlock();
      const text = (block?.textContent ?? "").replace(/\u200B/g, "").trim();
      if (text === "#") {
        e.preventDefault();
        transformBlock(block, "h1");
        return;
      }
      if (text === "##") {
        e.preventDefault();
        transformBlock(block, "h2");
        return;
      }
      if (text === "-") {
        e.preventDefault();
        transformBlock(block, "li");
        return;
      }
      if (tryInlineTransform()) {
        e.preventDefault();
        emit();
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      const block = getCaretBlock();
      if (block?.tagName.toLowerCase() === "li" && !block.textContent?.replace(/\u200B/g, "").trim()) {
        e.preventDefault();
        transformBlock(block, "p");
      }
    }
  };
  const handlePaste = (e) => {
    const html = e.clipboardData.getData("text/html");
    if (html?.includes("<table")) {
      e.preventDefault();
      const md = htmlTableToMd(html);
      if (md) document.execCommand("insertText", false, md);
      emit();
      return;
    }
    const text = e.clipboardData.getData("text/plain");
    if (text) {
      e.preventDefault();
      document.execCommand("insertText", false, text);
      emit();
    }
  };
  const { overflowY, cursor, paddingBottom, lineHeight, padding: _padding, ...wrapperStyle } = style ?? {};
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", flexDirection: "column", ...wrapperStyle }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 8px 4px",
      borderBottom: "1px solid rgba(255,255,255,.08)",
      flexShrink: 0
    }, children: [
      MD_PALETTE.map((c) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          title: c,
          onMouseDown: (e) => {
            e.preventDefault();
            applyColor(c);
          },
          onMouseEnter: () => setHovColor(c),
          onMouseLeave: () => setHovColor(null),
          style: {
            width: hovColor === c ? 14 : 11,
            height: hovColor === c ? 14 : 11,
            borderRadius: "50%",
            background: c,
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            transition: "width .12s, height .12s"
          }
        },
        c
      )),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "button",
        {
          title: "\uC0C9\uC0C1 \uC81C\uAC70",
          onMouseDown: (e) => {
            e.preventDefault();
            clearColor();
          },
          onMouseEnter: () => setHovColor("clear"),
          onMouseLeave: () => setHovColor(null),
          style: {
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "transparent",
            border: `1px solid ${hovColor === "clear" ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)"}`,
            color: hovColor === "clear" ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.3)",
            cursor: "pointer",
            padding: 0,
            fontSize: 9,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color .12s, color .12s"
          },
          children: "\u2715"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        ref,
        contentEditable: true,
        suppressContentEditableWarning: true,
        className,
        onInput: () => {
          if (!composing.current) emit();
        },
        onKeyDown: handleKeyDown,
        onPaste: handlePaste,
        onCompositionStart: () => {
          composing.current = true;
        },
        onCompositionEnd: () => {
          composing.current = false;
          emit();
        },
        "data-placeholder": placeholder,
        style: {
          flex: 1,
          padding: "8px 10px",
          paddingBottom,
          overflowY,
          cursor,
          lineHeight,
          outline: "none",
          wordBreak: "break-word"
        }
      }
    )
  ] });
}
function getAvatarColor(name) {
  const palette = ["#D97757", "#B85E3F", "#E8956D", "#C75B39", "#A0522D", "#CF7A5A", "#E8A87C", "#8B4513"];
  let h = 0;
  for (const ch of name) h = h * 31 + ch.charCodeAt(0) & 255;
  return palette[h % palette.length];
}
function CommentItem({ comment, canEdit, onUpdate, onDelete }) {
  const [editing, setEditing] = (0, import_react2.useState)(false);
  const [draft, setDraft] = (0, import_react2.useState)(comment.text);
  const [hov, setHov] = (0, import_react2.useState)(false);
  const commit = () => {
    const t = draft.trim();
    if (t && t !== comment.text) onUpdate(t);
    else setDraft(comment.text);
    setEditing(false);
  };
  const labelColor = getAvatarColor(comment.author);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      style: {
        padding: "6px 4px",
        borderRadius: 6,
        background: hov ? "rgba(255,255,255,.03)" : "transparent"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 8px",
            borderRadius: 2,
            fontSize: 10,
            fontWeight: 700,
            background: `${labelColor}22`,
            color: labelColor,
            border: `1px solid ${labelColor}44`,
            whiteSpace: "nowrap"
          }, children: comment.author }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: DARK.txL }, children: fmtTime(comment.createdAt) }),
          comment.updatedAt && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: { fontSize: 9, color: DARK.txL }, children: "(\uC218\uC815\uB428)" }),
          canEdit && !editing && hov && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 3, marginLeft: "auto" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                onClick: () => {
                  setDraft(comment.text);
                  setEditing(true);
                },
                style: { padding: "0 4px", height: 16, border: `1px solid ${DARK.brd}`, borderRadius: 3, background: "transparent", color: DARK.txS, cursor: "pointer", display: "inline-flex", alignItems: "center" },
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { width: "10", height: "10", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M11.06 2.06a1.5 1.5 0 0 1 2.12 0l.76.76a1.5 1.5 0 0 1 0 2.12L5.5 13.5 2 14l.5-3.5 8.56-8.44z", fill: "currentColor", fillOpacity: ".85" }) })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                onClick: () => {
                  if (window.confirm("\uC774 \uB313\uAE00\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) onDelete();
                },
                style: { fontSize: 10, padding: "0 5px", height: 16, border: `1px solid ${DARK.brd}`, borderRadius: 3, background: "transparent", color: "#f87171", cursor: "pointer", lineHeight: 1 },
                children: "\xD7"
              }
            )
          ] })
        ] }),
        editing ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "textarea",
            {
              autoFocus: true,
              className: "sb-scroll",
              value: draft,
              onChange: (e) => setDraft(e.target.value),
              rows: 2,
              style: { width: "100%", padding: "6px 8px", border: `1px solid ${COLORS.pri}`, borderRadius: 6, fontSize: 12, outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.5, boxSizing: "border-box", background: DARK.bg3, color: DARK.txt },
              onKeyDown: (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") commit();
                if (e.key === "Escape") {
                  setDraft(comment.text);
                  setEditing(false);
                }
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { display: "flex", gap: 4, marginTop: 4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: () => {
              setDraft(comment.text);
              setEditing(false);
            }, style: { fontSize: 10, padding: "3px 8px", border: `1px solid ${DARK.brd}`, borderRadius: 4, background: "transparent", color: DARK.txS, cursor: "pointer" }, children: "\uCDE8\uC18C" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("button", { onClick: commit, style: { fontSize: 10, padding: "3px 10px", border: "none", borderRadius: 2, background: COLORS.pri, color: "#fff", cursor: "pointer", fontWeight: 600 }, children: "\uC800\uC7A5" })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontSize: 12, color: DARK.txt, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word", padding: "2px 4px 0 4px" }, children: comment.text })
      ]
    }
  );
}

// src/AnnotPin.tsx
var import_react_dom = require("react-dom");
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 6e4) return "\uBC29\uAE08";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}\uBD84 \uC804`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}\uC2DC\uAC04 \uC804`;
  return `${Math.floor(diff / 864e5)}\uC77C \uC804`;
}
function renderInlineMarkdown(text) {
  const lines = text.split("\n");
  const nodes = [];
  lines.forEach((rawLine, lineIdx) => {
    const line = rawLine.replace(/^#{1,6}\s+/, "").replace(/^```.*/, "").replace(/^>\s?/, "").replace(/^[-*+]\s+/, "");
    const inline = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let last = 0;
    let m;
    let k = 0;
    while ((m = regex.exec(line)) !== null) {
      if (m.index > last) inline.push(line.slice(last, m.index));
      if (m[0].startsWith("**")) {
        inline.push(
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { style: { fontWeight: 700, color: "rgba(255,255,255,.8)" }, children: m[2] }, k++)
        );
      } else if (m[0].startsWith("*")) {
        inline.push(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)("em", { children: m[3] }, k++));
      } else {
        inline.push(
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "code",
            {
              style: {
                fontFamily: "monospace",
                background: "rgba(255,255,255,.12)",
                padding: "0 3px",
                borderRadius: 3,
                fontSize: 9
              },
              children: m[4]
            },
            k++
          )
        );
      }
      last = m.index + m[0].length;
    }
    if (last < line.length) inline.push(line.slice(last));
    nodes.push(...inline);
    if (lineIdx < lines.length - 1) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime4.jsx)("br", {}, `br-${lineIdx}`));
  });
  return nodes;
}
var EXPAND_W = 220;
function AnnotPin({
  pin,
  num,
  label,
  layerId,
  isSelected,
  isHovered,
  onSelect,
  onMove,
  onHoverEnter,
  onHoverLeave
}) {
  const color = label?.color ?? FALLBACK_LABEL_COLOR;
  const isResolved = pin.status === "resolved";
  const emphasized = isSelected || isHovered;
  const expanded = !isSelected && !!isHovered;
  const hasNote = !!pin.note;
  const hasComments = pin.comments.length > 0;
  const { containerX, containerY, containerH, viewportX, viewportY, expandLeft } = (() => {
    const el = document.getElementById(layerId);
    const r = el?.getBoundingClientRect() ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const cx = pin.x * r.width;
    const cy = pin.y * r.height;
    const vx = r.left + cx;
    const vy = r.top + cy;
    return {
      containerX: cx,
      containerY: cy,
      containerH: r.height,
      viewportX: vx,
      viewportY: vy,
      expandLeft: expanded && vx + EXPAND_W > window.innerWidth - 8
    };
  })();
  const EDGE = 8;
  const MIN_UP = 120;
  const expandDown = expanded && viewportY + 28 - EDGE < MIN_UP;
  const maxExpandH = expanded ? expandDown ? Math.min(400, window.innerHeight - viewportY - EDGE) : Math.min(400, viewportY + 28 - EDGE) : 28;
  const [contentReady, setContentReady] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    if (!expanded) {
      setContentReady(false);
      return;
    }
    const raf = requestAnimationFrame(() => setContentReady(true));
    return () => cancelAnimationFrame(raf);
  }, [expanded]);
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    if (!isSelected) {
      e.stopPropagation();
      onSelect();
      return;
    }
    e.stopPropagation();
    const container = document.getElementById(layerId);
    if (!container) return;
    const base = container.getBoundingClientRect();
    let moved = false;
    const startX = e.clientX - base.left - pin.x * base.width;
    const startY = e.clientY - base.top - pin.y * base.height;
    const onMoveHandler = (ev) => {
      moved = true;
      const newPx = ev.clientX - base.left - startX;
      const newPy = ev.clientY - base.top - startY;
      onMove({
        x: Math.max(0, Math.min(1, newPx / base.width)),
        y: Math.max(0, Math.min(1, newPy / base.height))
      });
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMoveHandler);
      document.removeEventListener("mouseup", onUp);
      if (!moved) onSelect();
    };
    document.addEventListener("mousemove", onMoveHandler);
    document.addEventListener("mouseup", onUp);
  };
  const portalLeft = expandLeft ? viewportX - (EXPAND_W - 28) : viewportX;
  const portalVertical = expandDown ? { top: viewportY } : { bottom: window.innerHeight - viewportY - 28 };
  const expandedBorderRadius = "16px 16px 16px 4px";
  const Badge = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      style: {
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1 }, children: num })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        onMouseDown,
        onMouseEnter: () => onHoverEnter(pin.id),
        onMouseLeave: () => onHoverLeave(pin.id),
        style: {
          position: "absolute",
          left: containerX,
          ...expandDown ? { top: containerY } : { bottom: containerH - containerY - 28 },
          width: 28,
          height: 28,
          borderRadius: "80px 80px 80px 12px",
          background: "#1A1A1A",
          boxShadow: isSelected ? `0 0 0 2.5px ${isResolved ? "#6b7280" : color}, 0 0 0 4.5px rgba(255,255,255,.8), 0 4px 14px rgba(0,0,0,.38)` : "0 2px 8px rgba(0,0,0,.28)",
          cursor: isSelected ? "grab" : "pointer",
          userSelect: "none",
          opacity: isResolved && !emphasized ? 0.4 : 1,
          filter: isResolved && !emphasized ? "grayscale(1)" : "none",
          zIndex: isSelected ? 9993 : isHovered ? 9992 : 9991,
          fontFamily: FONT_FAMILY,
          pointerEvents: "all",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box"
        },
        children: Badge
      }
    ),
    expanded && typeof document !== "undefined" && (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "div",
        {
          onMouseDown,
          onMouseEnter: () => onHoverEnter(pin.id),
          onMouseLeave: () => onHoverLeave(pin.id),
          style: {
            position: "fixed",
            left: portalLeft,
            ...portalVertical,
            width: EXPAND_W,
            maxHeight: maxExpandH,
            minHeight: 28,
            borderRadius: expandedBorderRadius,
            background: "#1A1A1A",
            boxShadow: "0 6px 18px rgba(0,0,0,.38)",
            cursor: "pointer",
            userSelect: "none",
            opacity: isResolved && !emphasized ? 0.4 : 1,
            filter: isResolved && !emphasized ? "grayscale(1)" : "none",
            zIndex: 9992,
            fontFamily: FONT_FAMILY,
            pointerEvents: "all",
            display: "flex",
            flexDirection: expandLeft ? "row-reverse" : "row",
            alignItems: "flex-start",
            overflow: "hidden",
            padding: "8px",
            boxSizing: "border-box"
          },
          children: [
            Badge,
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "div",
              {
                style: {
                  flex: 1,
                  minWidth: 0,
                  paddingLeft: expandLeft ? 0 : 7,
                  paddingRight: expandLeft ? 7 : 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  opacity: contentReady ? 1 : 0,
                  transform: contentReady ? "none" : `translateX(${expandLeft ? 5 : -5}px)`,
                  transition: "opacity 0.32s ease-out, transform 0.32s ease-out"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, minWidth: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      "span",
                      {
                        style: {
                          fontSize: 10,
                          color: "rgba(255,255,255,.75)",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flexShrink: 1,
                          minWidth: 0
                        },
                        children: pin.author || "\u2014"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      "span",
                      {
                        style: {
                          fontSize: 9,
                          color: "rgba(255,255,255,.3)",
                          flexShrink: 0,
                          whiteSpace: "nowrap"
                        },
                        children: timeAgo(pin.createdAt)
                      }
                    ),
                    isResolved && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      "span",
                      {
                        style: {
                          marginLeft: "auto",
                          flexShrink: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 2,
                          padding: "1px 5px",
                          borderRadius: 2,
                          background: "rgba(22,163,74,.22)",
                          border: "1px solid rgba(22,163,74,.4)",
                          color: "#4ade80",
                          fontSize: 8,
                          fontWeight: 700,
                          whiteSpace: "nowrap"
                        },
                        children: "\u2713 \uD574\uACB0"
                      }
                    )
                  ] }),
                  hasNote && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                    "div",
                    {
                      style: {
                        fontSize: 10,
                        color: "rgba(255,255,255,.5)",
                        lineHeight: 1.5,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 10,
                        WebkitBoxOrient: "vertical",
                        wordBreak: "break-word"
                      },
                      children: renderInlineMarkdown(pin.note)
                    }
                  ),
                  hasComments && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.08)", margin: "2px 0" } }),
                    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,.45)" }, children: [
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { width: "11", height: "11", viewBox: "0 0 16 16", fill: "none", style: { color: "#93c5fd" }, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M13 1H3C2.45 1 2 1.45 2 2v8c0 .55.45 1 1 1h2.5l2.5 3 2.5-3H13c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1z", fill: "currentColor" }) }),
                      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,.55)" }, children: pin.comments.length })
                    ] })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      document.body
    )
  ] });
}

// src/AnnotationToolbar.tsx
var import_react4 = require("react");

// src/version.ts
var SDK_VERSION = true ? "0.7.15" : "0.7.15";

// src/AnnotationToolbar.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var IPlus = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
] });
var IClose = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
] });
var IList = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
] });
var IDownload = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("polyline", { points: "7 10 12 15 17 10" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
] });
function TBtn({ icon, label, active, activeColor = "#3B82F6", badge, disabled, onClick, title, dataGuide }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "button",
    {
      onClick,
      title,
      disabled,
      "data-guide": dataGuide,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: label ? 3 : 0,
        padding: "5px 8px",
        border: `1px solid ${active ? `${activeColor}66` : "rgba(255,255,255,.07)"}`,
        borderRadius: 2,
        cursor: disabled ? "not-allowed" : "pointer",
        background: active ? `${activeColor}25` : "transparent",
        color: disabled ? "rgba(255,255,255,.2)" : active ? activeColor : "rgba(255,255,255,.7)",
        transition: "all .15s",
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        minWidth: 26,
        height: 26,
        fontFamily: FONT_FAMILY
      },
      onMouseEnter: (e) => {
        if (!active && !disabled) {
          e.currentTarget.style.background = "rgba(255,255,255,.07)";
          e.currentTarget.style.color = "rgba(255,255,255,1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
        }
      },
      onMouseLeave: (e) => {
        if (!active && !disabled) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,.7)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
        }
      },
      children: [
        icon,
        label && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }, children: label }),
        badge != null && badge > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "span",
          {
            style: {
              minWidth: 14,
              height: 14,
              borderRadius: 3,
              background: active ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.18)",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 3px",
              flexShrink: 0
            },
            children: badge
          }
        )
      ]
    }
  );
}
function shortVer(v) {
  const [major = "0", minor = "0", patch = "0"] = v.replace(/^v/, "").split(".");
  return `v${major}.${minor}${patch.padStart(3, "0")}`;
}
function isNewer(a, b) {
  if (!a) return false;
  const parse = (v) => v.replace(/^v/, "").split(".").map(Number);
  const [ma, mi, pa] = parse(a);
  const [mb, mi2, pb] = parse(b);
  if (ma !== mb) return ma > mb;
  if (mi !== mi2) return mi > mi2;
  return pa > pb;
}
function UpdateModal({
  currentVersion,
  latestVersion,
  onClose
}) {
  const [copied, setCopied] = (0, import_react4.useState)(null);
  const copyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd).catch(() => {
    });
    setCopied(cmd);
    setTimeout(() => setCopied(null), 2e3);
  };
  const gitCmd = `pnpm add git+https://github.com/knowsol/specBridge.git#v${latestVersion}`;
  const npmCmd = `npm install git+https://github.com/knowsol/specBridge.git#v${latestVersion}`;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2e4,
        fontFamily: FONT_FAMILY
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: "#0f172a",
            border: "1px solid rgba(251,191,36,.3)",
            borderRadius: 4,
            padding: 28,
            width: 460,
            boxShadow: "0 24px 64px rgba(0,0,0,.6)"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 15, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }, children: "\u{1F680} \uC0C8 \uBC84\uC804 \uC5C5\uB370\uC774\uD2B8 \uC548\uB0B4" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { fontSize: 12, color: "rgba(255,255,255,.5)" }, children: [
                  "\uD604\uC7AC\xA0",
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { style: { fontFamily: "monospace", color: "rgba(255,255,255,.75)" }, children: [
                    "v",
                    currentVersion
                  ] }),
                  "\xA0\u2192\xA0\uCD5C\uC2E0\xA0",
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { style: { fontFamily: "monospace", color: "#34d399", fontWeight: 700 }, children: [
                    "v",
                    latestVersion
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  onClick: onClose,
                  style: { background: "transparent", border: "none", color: "rgba(255,255,255,.4)", fontSize: 18, cursor: "pointer", padding: "0 4px" },
                  children: "\u2715"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 8 }, children: "\uC544\uB798 \uBA85\uB839\uC5B4\uB85C \uC5C5\uADF8\uB808\uC774\uB4DC \uD6C4 \uC571\uC744 \uC7AC\uBC30\uD3EC\uD558\uC138\uC694:" }),
            [{ label: "pnpm", cmd: gitCmd }, { label: "npm", cmd: npmCmd }].map(({ label, cmd }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { background: "#1e293b", borderRadius: 4, padding: "10px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,.06)" }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: "#64748b", width: 30, flexShrink: 0, textTransform: "uppercase" }, children: label }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("code", { style: { flex: 1, fontSize: 11, color: "#a5f3fc", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: cmd }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  onClick: () => copyCmd(cmd),
                  style: { background: copied === cmd ? "#16a34a" : "rgba(255,255,255,.07)", border: "none", borderRadius: 2, color: copied === cmd ? "#fff" : "rgba(255,255,255,.5)", fontSize: 10, padding: "4px 8px", cursor: "pointer", flexShrink: 0, transition: "all .15s" },
                  children: copied === cmd ? "\u2713 \uBCF5\uC0AC\uB428" : "\uBCF5\uC0AC"
                }
              )
            ] }, label)),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 10, color: "rgba(255,255,255,.25)", marginTop: 12 }, children: "\uC5C5\uADF8\uB808\uC774\uB4DC \uD6C4 SDK\uB97C \uC7AC\uBE4C\uB4DC\uD558\uACE0 \uC571\uC744 \uC7AC\uBC30\uD3EC\uD574\uC57C \uC801\uC6A9\uB429\uB2C8\uB2E4." })
          ]
        }
      )
    }
  );
}
var STATUS_CYCLE = ["active", "done", "pending"];
var IEdit = () => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
] });
var IBookmark = ({ size = 13 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }) });
var IDesktop = ({ size = 12 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
] });
var ITablet = ({ size = 12 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "18", x2: "12.01", y2: "18" })
] });
var IMobile = ({ size = 12 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("rect", { x: "5", y: "2", width: "14", height: "20", rx: "2" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "12", y1: "18", x2: "12.01", y2: "18" })
] });
var VIEWPORT_ICON = {
  desktop: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IDesktop, {}),
  tablet: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ITablet, {}),
  mobile: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IMobile, {})
};
function SessionPickerItem({
  session,
  isActive,
  progress,
  onClick,
  onDelete,
  onStatusChange,
  onEdit
}) {
  const [hov, setHov] = (0, import_react4.useState)(false);
  const [confirming, setConfirming] = (0, import_react4.useState)(false);
  const [editing, setEditing] = (0, import_react4.useState)(false);
  const [editName, setEditName] = (0, import_react4.useState)("");
  const [editViewport, setEditViewport] = (0, import_react4.useState)(null);
  const startEdit = (e) => {
    e.stopPropagation();
    setEditName(session.name);
    setEditViewport(session.viewport ?? null);
    setConfirming(false);
    setEditing(true);
  };
  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditing(false);
  };
  const saveEdit = async (e) => {
    e.stopPropagation();
    const trimmed = editName.trim();
    if (!trimmed || !onEdit) {
      setEditing(false);
      return;
    }
    await onEdit(trimmed, editViewport);
    setEditing(false);
  };
  const status = session.status ?? "active";
  const sc = SESSION_STATUS_CONFIG[status];
  const vp = session.viewport ? SESSION_VIEWPORT_CONFIG[session.viewport] : null;
  const pct = progress && progress.total > 0 ? Math.round(progress.resolved / progress.total * 100) : 0;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      onClick,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => {
        if (!editing) {
          setHov(false);
          setConfirming(false);
        }
      },
      style: {
        padding: "8px 12px",
        cursor: "pointer",
        background: isActive ? "rgba(255,255,255,.07)" : hov ? "rgba(255,255,255,.04)" : "transparent",
        transition: "background .12s"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 10, color: isActive ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.18)", flexShrink: 0, width: 12, textAlign: "center" }, children: isActive ? "\u2713" : "" }),
          vp && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "rgba(255,255,255,.45)", flexShrink: 0, display: "flex", alignItems: "center" }, title: vp.label, children: VIEWPORT_ICON[session.viewport ?? ""] ?? null }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { flex: 1, fontSize: 12, color: isActive ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.55)", fontWeight: isActive ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: FONT_FAMILY }, children: session.name }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                if (!onStatusChange) return;
                const idx = STATUS_CYCLE.indexOf(status);
                onStatusChange(STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]);
              },
              title: "\uC0C1\uD0DC \uBCC0\uACBD (\uD074\uB9AD)",
              style: {
                background: sc.bg,
                border: `1px solid ${sc.border}`,
                borderRadius: 2,
                color: sc.color,
                fontSize: 9,
                fontWeight: 700,
                padding: "2px 6px",
                cursor: "pointer",
                flexShrink: 0,
                fontFamily: FONT_FAMILY,
                transition: "all .12s"
              },
              children: sc.label
            }
          ),
          hov && !confirming && !editing && onEdit && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              onClick: startEdit,
              title: "\uD68C\uCC28 \uC218\uC815",
              style: { background: "transparent", border: "1px solid rgba(255,255,255,.12)", borderRadius: 2, color: "rgba(255,255,255,.3)", fontSize: 9, padding: "2px 5px", cursor: "pointer", flexShrink: 0, fontFamily: FONT_FAMILY, transition: "all .12s", display: "flex", alignItems: "center" },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.3)";
                e.currentTarget.style.color = "rgba(255,255,255,.7)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                e.currentTarget.style.color = "rgba(255,255,255,.3)";
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IEdit, {})
            }
          ),
          hov && !confirming && !editing && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                setConfirming(true);
              },
              title: "\uD68C\uCC28 \uC0AD\uC81C",
              style: { background: "transparent", border: "1px solid rgba(255,255,255,.12)", borderRadius: 2, color: "rgba(255,255,255,.3)", fontSize: 9, padding: "2px 5px", cursor: "pointer", flexShrink: 0, fontFamily: FONT_FAMILY, transition: "all .12s" },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(220,38,38,.15)";
                e.currentTarget.style.borderColor = "rgba(220,38,38,.3)";
                e.currentTarget.style.color = "#f87171";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                e.currentTarget.style.color = "rgba(255,255,255,.3)";
              },
              children: "\uC0AD\uC81C"
            }
          ),
          confirming && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { onClick: (e) => e.stopPropagation(), style: { display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 9, color: "#f87171", fontFamily: FONT_FAMILY, whiteSpace: "nowrap" }, children: "\uC0AD\uC81C\uD560\uAE4C\uC694?" }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setConfirming(false);
                },
                style: { background: "transparent", border: "1px solid rgba(255,255,255,.15)", borderRadius: 2, color: "rgba(255,255,255,.45)", fontSize: 9, padding: "2px 6px", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uCDE8\uC18C"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "button",
              {
                onClick: onDelete,
                style: { background: "rgba(220,38,38,.2)", border: "1px solid rgba(220,38,38,.4)", borderRadius: 2, color: "#f87171", fontSize: 9, fontWeight: 700, padding: "2px 6px", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uD655\uC778"
              }
            )
          ] })
        ] }),
        progress && progress.total > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { marginTop: 6, paddingLeft: 18 }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { flex: 1, height: 3, background: "rgba(255,255,255,.18)", borderRadius: 2, overflow: "hidden" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { width: `${pct}%`, height: "100%", background: pct === 100 ? "#16a34a" : COLORS.pri, borderRadius: 2, transition: "width .3s" } }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { style: { fontSize: 9, color: "rgba(255,255,255,.3)", flexShrink: 0, fontFamily: FONT_FAMILY }, children: [
            progress.resolved,
            "/",
            progress.total
          ] })
        ] }) }),
        editing && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { onClick: (e) => e.stopPropagation(), style: { marginTop: 8, paddingLeft: 18 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "input",
            {
              autoFocus: true,
              value: editName,
              onChange: (e) => setEditName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") saveEdit(e);
                if (e.key === "Escape") {
                  e.stopPropagation();
                  setEditing(false);
                }
              },
              style: {
                width: "100%",
                boxSizing: "border-box",
                background: "rgba(255,255,255,.07)",
                border: "1px solid rgba(255,255,255,.18)",
                borderRadius: 2,
                padding: "4px 7px",
                color: "#fff",
                fontSize: 11,
                fontFamily: FONT_FAMILY,
                outline: "none",
                marginBottom: 6
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { display: "flex", gap: 4, marginBottom: 6 }, children: Object.entries(SESSION_VIEWPORT_CONFIG).map(([vp2, cfg]) => {
            const isVpActive = editViewport === vp2;
            return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setEditViewport(isVpActive ? null : vp2);
                },
                style: {
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "3px 0",
                  borderRadius: 2,
                  border: `1px solid ${isVpActive ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.18)"}`,
                  background: isVpActive ? "rgba(255,255,255,.12)" : "transparent",
                  color: isVpActive ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.3)",
                  fontSize: 10,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  transition: "all .12s"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { display: "flex", alignItems: "center" }, children: VIEWPORT_ICON[vp2] }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: cfg.label })
                ]
              },
              vp2
            );
          }) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", gap: 5 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "button",
              {
                onClick: cancelEdit,
                style: { flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 2, color: "rgba(255,255,255,.4)", fontSize: 11, padding: "3px 0", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uCDE8\uC18C"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "button",
              {
                onClick: saveEdit,
                style: { flex: 2, background: COLORS.pri, border: "none", borderRadius: 2, color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 0", cursor: "pointer", fontFamily: FONT_FAMILY },
                children: "\uC800\uC7A5"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function SessionPicker({
  sessions,
  currentSessionId,
  sessionProgress,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onSetSessionStatus,
  onUpdateSession
}) {
  const [open, setOpen] = (0, import_react4.useState)(false);
  const [creating, setCreating] = (0, import_react4.useState)(false);
  const [newName, setNewName] = (0, import_react4.useState)("");
  const [newViewport, setNewViewport] = (0, import_react4.useState)(null);
  const ref = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setCreating(false);
        setNewName("");
        setNewViewport(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const triggerLabel = currentSession ? currentSession.name : "\uC804\uCCB4";
  const triggerVp = currentSession?.viewport ? SESSION_VIEWPORT_CONFIG[currentSession.viewport] : null;
  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await onCreateSession(trimmed, { viewport: newViewport });
    setNewName("");
    setNewViewport(null);
    setCreating(false);
    setOpen(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { ref, style: { position: "relative", flexShrink: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        title: "\uAC80\uD1A0 \uD68C\uCC28 \uC120\uD0DD",
        "data-guide": "sb-session",
        style: {
          display: "flex",
          alignItems: "center",
          gap: 3,
          padding: "5px 8px",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,.07)",
          background: open ? "rgba(255,255,255,.07)" : "transparent",
          color: "rgba(255,255,255,.7)",
          fontSize: 11,
          fontWeight: 500,
          cursor: "pointer",
          height: 26,
          fontFamily: FONT_FAMILY,
          whiteSpace: "nowrap",
          maxWidth: 160,
          transition: "all .15s"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "rgba(255,255,255,.07)";
          e.currentTarget.style.color = "rgba(255,255,255,1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = open ? "rgba(255,255,255,.07)" : "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,.7)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center" }, children: triggerVp ? VIEWPORT_ICON[currentSession?.viewport ?? ""] : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IBookmark, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 110 }, children: triggerLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 8, opacity: 0.6, marginLeft: 1 }, children: "\u25BE" })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        style: {
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: 0,
          minWidth: 260,
          background: "rgba(10,10,10,.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 4,
          boxShadow: "0 -8px 40px rgba(0,0,0,.6)",
          overflow: "hidden",
          zIndex: 2e4,
          fontFamily: FONT_FAMILY
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { padding: "8px 12px 6px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.3)", letterSpacing: ".5px", textTransform: "uppercase" }, children: "\uAC80\uD1A0 \uD68C\uCC28" }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)" } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "div",
            {
              onClick: () => {
                onSelectSession(null);
                setOpen(false);
              },
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                cursor: "pointer",
                background: currentSessionId === null ? "rgba(255,255,255,.07)" : "transparent",
                transition: "background .12s"
              },
              onMouseEnter: (e) => {
                if (currentSessionId !== null) e.currentTarget.style.background = "rgba(255,255,255,.04)";
              },
              onMouseLeave: (e) => {
                if (currentSessionId !== null) e.currentTarget.style.background = "transparent";
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 10, color: currentSessionId === null ? "rgba(255,255,255,.5)" : "transparent", width: 12, textAlign: "center", flexShrink: 0 }, children: "\u2713" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 12, color: currentSessionId === null ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.45)", fontWeight: currentSessionId === null ? 600 : 400, fontFamily: FONT_FAMILY }, children: "\uC804\uCCB4 (\uBAA8\uB4E0 \uD68C\uCC28)" })
              ]
            }
          ),
          sessions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.06)", margin: "2px 0" } }),
          sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            SessionPickerItem,
            {
              session: s,
              isActive: s.id === currentSessionId,
              progress: sessionProgress?.[s.id],
              onClick: () => {
                onSelectSession(s.id);
                setOpen(false);
              },
              onDelete: (e) => {
                e.stopPropagation();
                onDeleteSession(s.id);
              },
              onStatusChange: onSetSessionStatus ? (st) => onSetSessionStatus(s.id, st) : void 0,
              onEdit: onUpdateSession ? (name, viewport) => onUpdateSession(s.id, { name, viewport }) : void 0
            },
            s.id
          )),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { height: 1, background: "rgba(255,255,255,.07)", margin: "2px 0" } }),
          creating ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { padding: "8px 10px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "input",
              {
                autoFocus: true,
                value: newName,
                onChange: (e) => setNewName(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreate();
                  }
                  if (e.key === "Escape") {
                    setCreating(false);
                    setNewName("");
                    setNewViewport(null);
                  }
                },
                placeholder: "\uD68C\uCC28 \uC774\uB984 \uC785\uB825\u2026",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.18)",
                  borderRadius: 2,
                  padding: "5px 8px",
                  color: "#fff",
                  fontSize: 11,
                  fontFamily: FONT_FAMILY,
                  outline: "none",
                  marginBottom: 7
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { display: "flex", gap: 4, marginBottom: 8 }, children: Object.entries(SESSION_VIEWPORT_CONFIG).map(([vp, cfg]) => {
              const isVpActive = newViewport === vp;
              return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "button",
                {
                  onClick: () => setNewViewport(isVpActive ? null : vp),
                  style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    padding: "4px 0",
                    borderRadius: 2,
                    border: `1px solid ${isVpActive ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.18)"}`,
                    background: isVpActive ? "rgba(255,255,255,.12)" : "transparent",
                    color: isVpActive ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.3)",
                    fontSize: 10,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                    transition: "all .12s"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { display: "flex", alignItems: "center" }, children: VIEWPORT_ICON[vp] }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: cfg.label })
                  ]
                },
                vp
              );
            }) }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  onClick: () => {
                    setCreating(false);
                    setNewName("");
                    setNewViewport(null);
                  },
                  style: { flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,.1)", borderRadius: 2, color: "rgba(255,255,255,.4)", fontSize: 11, padding: "4px 0", cursor: "pointer", fontFamily: FONT_FAMILY },
                  children: "\uCDE8\uC18C"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  onClick: handleCreate,
                  style: { flex: 2, background: COLORS.pri, border: "none", borderRadius: 2, color: "#fff", fontSize: 11, padding: "4px 0", cursor: "pointer", fontFamily: FONT_FAMILY, fontWeight: 600 },
                  children: "\uCD94\uAC00"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "button",
            {
              onClick: () => setCreating(true),
              style: {
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,.38)",
                fontSize: 11,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: FONT_FAMILY,
                transition: "all .12s"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.05)";
                e.currentTarget.style.color = "rgba(255,255,255,.7)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,.38)";
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 13 }, children: "\uFF0B" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "\uC0C8 \uAC80\uD1A0 \uD68C\uCC28" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function SBLogo({ size = 28 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: size, height: size, viewBox: "-10 -10 170 172", fill: "none", style: { display: "block", flexShrink: 0 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { opacity: "0.69", d: "M111.309 79.6218C116.002 96.9372 100.191 112.84 82.8489 108.247L21.3533 91.961C4.01096 87.3681 -1.85607 65.7239 10.7927 53.0015L55.6448 7.88791C68.2936 -4.83456 89.9715 0.906559 94.6651 18.2219L111.309 79.6218Z", fill: "#3078FF" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { opacity: "0.5", d: "M101.327 142.828C86.0562 152.245 66.3188 141.599 65.7993 123.666L64.723 86.5136C64.2035 68.5809 83.2915 56.8106 99.0814 65.3271L131.795 82.9713C147.585 91.4877 148.234 113.904 132.964 123.32L101.327 142.828Z", fill: "#4CD3FF" })
  ] });
}
function AnnotationToolbar({
  enabled,
  onToggleEnabled,
  author,
  onEditAuthor,
  adding,
  onToggleAdd,
  pinCount,
  showList,
  onToggleList,
  onExport,
  labels,
  filterLabelIds,
  onToggleLabelFilter,
  onClearLabelFilter,
  latestSdkVersion,
  onShowGuide,
  showLogoTip,
  sessions,
  currentSessionId,
  sessionProgress,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onSetSessionStatus,
  onUpdateSession
}) {
  const [showUpdateModal, setShowUpdateModal] = (0, import_react4.useState)(false);
  const hasUpdate = isNewer(latestSdkVersion ?? null, SDK_VERSION);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1e4, fontFamily: FONT_FAMILY }, children: [
    enabled && adding && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", justifyContent: "center", marginBottom: 6, pointerEvents: "none" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "div",
        {
          style: {
            background: "rgba(180,83,9,.95)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 12,
            color: "#fef3c7",
            fontWeight: 500,
            boxShadow: "0 4px 16px rgba(0,0,0,.3)",
            border: "1px solid rgba(251,191,36,.3)",
            animation: "specbridgeTbHint .15s ease"
          },
          children: "\u{1F4CC} \uD654\uBA74 \uC544\uBB34 \uACF3\uC774\uB098 \uD074\uB9AD\uD558\uBA74 \uBC88\uD638\uAC00 \uBC30\uCE58\uB429\uB2C8\uB2E4 \u2014 ESC / N / \uCDE8\uC18C \uBC84\uD2BC\uC73C\uB85C \uC911\uB2E8"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("style", { children: `@keyframes specbridgeTbHint{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}` })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 -4px 24px rgba(0,0,0,.4)",
          height: 45,
          padding: "0 8px 0 16px",
          gap: 0
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "div",
            {
              style: {
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 7
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { position: "relative", flexShrink: 0 }, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "div",
                    {
                      onClick: onShowGuide,
                      title: "\uC0AC\uC6A9 \uAC00\uC774\uB4DC \uBCF4\uAE30",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: onShowGuide ? "pointer" : "default",
                        transition: "opacity .15s"
                      },
                      onMouseEnter: (e) => {
                        if (onShowGuide) e.currentTarget.style.opacity = ".72";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.opacity = "1";
                      },
                      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SBLogo, { size: 28 })
                    }
                  ),
                  showLogoTip && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        bottom: "calc(100% + 10px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(10,10,10,.97)",
                        border: "1px solid rgba(255,255,255,.15)",
                        borderRadius: 4,
                        padding: "8px 12px",
                        fontSize: 11,
                        color: "rgba(255,255,255,.82)",
                        whiteSpace: "nowrap",
                        boxShadow: "0 8px 24px rgba(0,0,0,.55)",
                        pointerEvents: "none",
                        zIndex: 20001,
                        fontFamily: FONT_FAMILY,
                        lineHeight: 1.5
                      },
                      children: [
                        "\uB85C\uACE0\uB97C \uD074\uB9AD\uD558\uBA74 \uAC00\uC774\uB4DC\uB97C \uB2E4\uC2DC \uBCFC \uC218 \uC788\uC5B4\uC694 \u{1F446}",
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                          "div",
                          {
                            style: {
                              position: "absolute",
                              bottom: -5,
                              left: "50%",
                              transform: "translateX(-50%) rotate(45deg)",
                              width: 8,
                              height: 8,
                              background: "rgba(10,10,10,.97)",
                              borderRight: "1px solid rgba(255,255,255,.15)",
                              borderBottom: "1px solid rgba(255,255,255,.15)"
                            }
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "button",
                  {
                    onClick: hasUpdate ? () => setShowUpdateModal(true) : void 0,
                    title: hasUpdate ? `\uC5C5\uB370\uC774\uD2B8 \uAC00\uB2A5: ${shortVer(latestSdkVersion ?? "")} \u2014 \uD074\uB9AD\uD558\uC5EC \uC548\uB0B4 \uBCF4\uAE30` : `SpecBridge SDK ${shortVer(SDK_VERSION)}`,
                    style: { background: "transparent", border: "none", padding: 0, cursor: hasUpdate ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3 },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.7)", letterSpacing: ".2px", lineHeight: 1, whiteSpace: "nowrap" }, children: "SpecBridge" }),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 1 }, children: [
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 9, fontWeight: 700, color: COLORS.pri, lineHeight: 1 }, children: "Beta" }),
                        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 9, fontFamily: "monospace", color: hasUpdate ? "#fbbf24" : "rgba(255,255,255,.55)", lineHeight: 1 }, children: shortVer(SDK_VERSION) }),
                        hasUpdate && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { style: { fontSize: 7, fontWeight: 700, background: "#f59e0b", color: "#0f172a", borderRadius: 3, padding: "1px 3px", lineHeight: 1.4, whiteSpace: "nowrap" }, children: [
                          "\u2191 ",
                          shortVer(latestSdkVersion ?? "")
                        ] })
                      ] })
                    ]
                  }
                ),
                enabled && sessions && onSelectSession && onCreateSession && onDeleteSession && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { width: 1, height: 22, background: "rgba(255,255,255,.18)", flexShrink: 0, marginLeft: 4 } }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    SessionPicker,
                    {
                      sessions,
                      currentSessionId: currentSessionId ?? null,
                      sessionProgress,
                      onSelectSession,
                      onCreateSession,
                      onDeleteSession,
                      onSetSessionStatus,
                      onUpdateSession
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { "data-guide": "sb-label-filter", style: { flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }, children: enabled && labels && labels.length > 0 && (() => {
            const allActive = !filterLabelIds || filterLabelIds.size === 0;
            return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  onClick: onClearLabelFilter,
                  title: "\uC804\uCCB4 \uBCF4\uAE30",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    padding: "2px 10px",
                    borderRadius: 1,
                    border: `1px solid ${allActive ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.15)"}`,
                    background: allActive ? "rgba(255,255,255,.12)" : "transparent",
                    color: allActive ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.45)",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                    height: 20,
                    transition: "all .15s",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    fontFamily: FONT_FAMILY
                  },
                  onMouseEnter: (e) => {
                    if (!allActive) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.3)";
                      e.currentTarget.style.color = "rgba(255,255,255,.75)";
                    }
                  },
                  onMouseLeave: (e) => {
                    if (!allActive) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                      e.currentTarget.style.color = "rgba(255,255,255,.45)";
                    }
                  },
                  children: "\uC804\uCCB4"
                }
              ),
              labels.map((l) => {
                const active = filterLabelIds?.has(l.id) ?? false;
                const color = l.color || FALLBACK_LABEL_COLOR;
                return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "button",
                  {
                    onClick: () => onToggleLabelFilter?.(l.id),
                    title: active ? `${l.name} \uD544\uD130 \uD574\uC81C` : `${l.name}\uB9CC \uBCF4\uAE30`,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 10px",
                      borderRadius: 1,
                      border: `1px solid ${active ? `${color}99` : "rgba(255,255,255,.15)"}`,
                      background: active ? `${color}22` : "transparent",
                      color: active ? color : "rgba(255,255,255,.45)",
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      height: 20,
                      transition: "all .15s",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      fontFamily: FONT_FAMILY
                    },
                    onMouseEnter: (e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = `${color}66`;
                        e.currentTarget.style.color = color;
                      }
                    },
                    onMouseLeave: (e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                        e.currentTarget.style.color = "rgba(255,255,255,.45)";
                      }
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { width: 5, height: 5, borderRadius: "50%", background: active ? color : "rgba(255,255,255,.3)", flexShrink: 0 } }),
                      l.name
                    ]
                  },
                  l.id
                );
              })
            ] });
          })() }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }, children: [
            enabled && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                TBtn,
                {
                  icon: adding ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IClose, {}) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IPlus, {}),
                  label: adding ? "\uCDE8\uC18C" : "\uCD94\uAC00",
                  active: adding,
                  activeColor: COLORS.pri,
                  onClick: onToggleAdd,
                  title: adding ? "\uBC88\uD638 \uBC30\uCE58 \uCDE8\uC18C (ESC)" : "\uBC88\uD638 \uCD94\uAC00 \u2014 \uB2E8\uCD95\uD0A4 N",
                  dataGuide: "sb-add-pin"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                TBtn,
                {
                  icon: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IList, {}),
                  label: "\uBAA9\uB85D",
                  active: showList,
                  activeColor: COLORS.pri,
                  badge: pinCount,
                  onClick: onToggleList,
                  title: "\uD604\uC7AC \uD398\uC774\uC9C0 \uBC88\uD638 \uBAA9\uB85D \u2014 \uB2E8\uCD95\uD0A4 L",
                  dataGuide: "sb-pin-list"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                TBtn,
                {
                  icon: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IDownload, {}),
                  label: "JSON",
                  onClick: onExport,
                  title: "\uC804\uCCB4 \uC5B4\uB178\uD14C\uC774\uC158 JSON \uB0B4\uBCF4\uB0B4\uAE30"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
              "button",
              {
                onClick: onToggleEnabled,
                title: enabled ? "Annotation \uB044\uAE30 \u2014 \uB2E8\uCD95\uD0A4 A" : "Annotation \uCF1C\uAE30 \u2014 \uB2E8\uCD95\uD0A4 A",
                "data-guide": "sb-annotation",
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "5px 8px",
                  border: `1px solid ${enabled ? `${COLORS.pri}66` : "rgba(255,255,255,.07)"}`,
                  borderRadius: 2,
                  cursor: "pointer",
                  background: enabled ? `${COLORS.pri}25` : "transparent",
                  color: enabled ? COLORS.pri : "rgba(255,255,255,.7)",
                  fontSize: 11,
                  fontWeight: 600,
                  height: 26,
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontFamily: FONT_FAMILY
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { cx: "12", cy: "10", r: "3" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: "Annotation" })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
              "button",
              {
                onClick: onEditAuthor,
                title: author ? `\uC791\uC131\uC790: ${author}` : "\uC791\uC131\uC790 \uC124\uC815",
                "data-guide": "sb-author",
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "5px 8px",
                  borderRadius: 2,
                  background: author ? "transparent" : "rgba(251,191,36,.15)",
                  color: author ? "rgba(255,255,255,.7)" : "#fbbf24",
                  fontSize: 11,
                  cursor: "pointer",
                  height: 26,
                  border: author ? "1px solid rgba(255,255,255,.07)" : "1px solid rgba(251,191,36,.4)",
                  maxWidth: 130,
                  flexShrink: 0,
                  transition: "all .15s",
                  fontFamily: FONT_FAMILY
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.15)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = author ? "transparent" : "rgba(251,191,36,.15)";
                  e.currentTarget.style.color = author ? "rgba(255,255,255,.7)" : "#fbbf24";
                  e.currentTarget.style.borderColor = author ? "rgba(255,255,255,.07)" : "rgba(251,191,36,.4)";
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("circle", { cx: "12", cy: "7", r: "4" })
                  ] }),
                  !author && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { fontSize: 9, background: "#dc2626", color: "#fff", borderRadius: 3, padding: "1px 3px", flexShrink: 0, fontWeight: 700 }, children: "!" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    showUpdateModal && latestSdkVersion && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      UpdateModal,
      {
        currentVersion: SDK_VERSION,
        latestVersion: latestSdkVersion,
        onClose: () => setShowUpdateModal(false)
      }
    )
  ] });
}

// src/AuthorModal.tsx
var import_react5 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
function AuthorModal({
  currentAuthor,
  currentDefaultLabelId,
  labels,
  onSave,
  onCancel
}) {
  const [name, setName] = (0, import_react5.useState)(currentAuthor);
  const [selectedLabelId, setSelectedLabelId] = (0, import_react5.useState)(
    currentDefaultLabelId ?? labels[0]?.id ?? null
  );
  const inputRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, []);
  (0, import_react5.useEffect)(() => {
    if (!selectedLabelId && labels.length > 0) {
      setSelectedLabelId(labels[0].id);
    }
  }, [labels, selectedLabelId]);
  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selectedLabelId);
  };
  const activeLabel = labels.find((l) => l.id === selectedLabelId);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 11e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.55)",
        fontFamily: FONT_FAMILY
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          style: {
            background: DARK.bg,
            border: `1px solid ${DARK.brd}`,
            borderRadius: 14,
            padding: "28px 32px",
            width: 360,
            boxShadow: "0 20px 60px rgba(0,0,0,.5)"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { fontSize: 16, fontWeight: 700, marginBottom: 5, color: DARK.txt }, children: "\uC791\uC131\uC790 \uB4F1\uB85D" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { fontSize: 12, color: DARK.txS, marginBottom: 20 }, children: "\uC774\uB984\uACFC \uAE30\uBCF8 \uB808\uC774\uBE14\uC740 \uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uACC4\uC18D \uC720\uC9C0\uB429\uB2C8\uB2E4." }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: DARK.txS, marginBottom: 5 }, children: "\uC774\uB984" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "input",
              {
                ref: inputRef,
                value: name,
                onChange: (e) => {
                  const v = e.target.value;
                  const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(v);
                  const limit = hasKorean ? 5 : 10;
                  if (v.length <= limit) setName(v);
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter" && name.trim()) handleSave();
                },
                placeholder: "\uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694 (\uD55C\uAE00 5\uC790 / \uC601\uBB38 10\uC790)",
                style: {
                  width: "100%",
                  padding: "10px 12px",
                  border: `1px solid ${DARK.brd2}`,
                  borderRadius: 8,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 20,
                  background: DARK.bg3,
                  color: DARK.txt,
                  fontFamily: FONT_FAMILY
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("label", { style: { display: "block", fontSize: 11, fontWeight: 600, color: DARK.txS, marginBottom: 8 }, children: [
              "\uAE30\uBCF8 \uB808\uC774\uBE14",
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontWeight: 400, color: DARK.txL, marginLeft: 6 }, children: "(\uBC88\uD638 \uCD94\uAC00 \uC2DC \uC790\uB3D9 \uC120\uD0DD)" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }, children: labels.map((l) => {
              const active = selectedLabelId === l.id;
              const color = l.color || FALLBACK_LABEL_COLOR;
              return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
                "button",
                {
                  onClick: () => setSelectedLabelId(l.id),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 13px",
                    borderRadius: 20,
                    border: `1.5px solid ${active ? color : DARK.brd}`,
                    background: active ? `${color}22` : DARK.bg2,
                    color: active ? color : DARK.txS,
                    fontSize: 12,
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    transition: "all .12s"
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 } }),
                    l.name,
                    active && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { fontSize: 11 }, children: "\u2713" })
                  ]
                },
                l.id
              );
            }) }),
            activeLabel && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "div",
              {
                style: {
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: `${activeLabel.color}12`,
                  border: `1px solid ${activeLabel.color}30`,
                  fontSize: 11,
                  color: DARK.txS,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { width: 8, height: 8, borderRadius: "50%", background: activeLabel.color, flexShrink: 0 } }),
                  "\uBC88\uD638 \uCD94\uAC00 \uC2DC \uAE30\uBCF8\uC73C\uB85C\xA0",
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { style: { color: activeLabel.color, fontWeight: 700 }, children: activeLabel.name }),
                  "\xA0\uB808\uC774\uBE14\uC774 \uC120\uD0DD\uB429\uB2C8\uB2E4."
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  onClick: onCancel,
                  style: {
                    flex: 1,
                    padding: "9px 0",
                    border: `1px solid ${DARK.brd}`,
                    borderRadius: 8,
                    background: DARK.bg2,
                    fontSize: 13,
                    cursor: "pointer",
                    color: DARK.txS,
                    fontFamily: FONT_FAMILY
                  },
                  children: "\uCDE8\uC18C"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  onClick: handleSave,
                  disabled: !name.trim(),
                  style: {
                    flex: 2,
                    padding: "9px 0",
                    border: "none",
                    borderRadius: 8,
                    background: name.trim() ? COLORS.pri : DARK.bg2,
                    color: name.trim() ? "#fff" : DARK.txL,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: name.trim() ? "pointer" : "not-allowed",
                    transition: "background .15s",
                    fontFamily: FONT_FAMILY
                  },
                  children: "\uB4F1\uB85D"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}

// src/LabelManagerModal.tsx
var import_react6 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
function LabelManagerModal({ labels, pinUsage, onAdd, onUpdate, onDelete, onClose }) {
  const [newName, setNewName] = (0, import_react6.useState)("");
  const [newColor, setNewColor] = (0, import_react6.useState)(LABEL_COLOR_PRESETS[0]);
  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    onAdd(name, newColor);
    setNewName("");
    setNewColor(LABEL_COLOR_PRESETS[0]);
  };
  const inp = {
    padding: "7px 10px",
    border: `1px solid ${DARK.brd2}`,
    borderRadius: 6,
    fontSize: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: DARK.bg3,
    color: DARK.txt
  };
  (0, import_react6.useEffect)(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onClose]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 11e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.55)"
      },
      onClick: onClose,
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            background: DARK.bg,
            border: `1px solid ${DARK.brd}`,
            borderRadius: 14,
            width: 440,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              "div",
              {
                style: {
                  padding: "14px 18px",
                  background: DARK.bg2,
                  borderBottom: `1px solid ${DARK.brd}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { fontSize: 13, fontWeight: 700, color: DARK.txt }, children: "\u{1F3F7}\uFE0F \uB808\uC774\uBE14 \uAD00\uB9AC" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { fontSize: 10, color: DARK.txL, marginTop: 2 }, children: "\uC804\uCCB4 \uD398\uC774\uC9C0\uC5D0 \uACF5\uD1B5 \uC801\uC6A9\uB429\uB2C8\uB2E4" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                    "button",
                    {
                      onClick: onClose,
                      style: {
                        background: "rgba(255,255,255,.08)",
                        border: "none",
                        color: DARK.txS,
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 16
                      },
                      children: "\xD7"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "sb-scroll", style: { flex: 1, overflowY: "auto", padding: "14px 18px" }, children: labels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { padding: "24px 0", textAlign: "center", color: DARK.txL, fontSize: 12 }, children: "\uB4F1\uB85D\uB41C \uB808\uC774\uBE14\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uCD94\uAC00\uD558\uC138\uC694." }) : labels.map((label) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              LabelRow,
              {
                label,
                usage: pinUsage[label.id] ?? 0,
                onUpdate: (patch) => onUpdate(label.id, patch),
                onDelete: () => onDelete(label.id)
              },
              label.id
            )) }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              "div",
              {
                style: {
                  borderTop: `1px solid ${DARK.brd}`,
                  padding: "12px 18px",
                  background: DARK.bg2,
                  flexShrink: 0
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: { fontSize: 11, fontWeight: 600, color: DARK.txS, marginBottom: 6 }, children: "+ \uB808\uC774\uBE14 \uCD94\uAC00" }),
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ColorDot, { color: newColor, onChange: setNewColor, title: "\uC0C9\uC0C1 \uC120\uD0DD" }),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                      "input",
                      {
                        value: newName,
                        onChange: (e) => setNewName(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Enter") handleAdd();
                        },
                        placeholder: "\uB808\uC774\uBE14 \uC774\uB984 (\uC608: UI \uC774\uC288)",
                        style: { ...inp, flex: 1 }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                      "button",
                      {
                        onClick: handleAdd,
                        disabled: !newName.trim(),
                        style: {
                          padding: "7px 14px",
                          border: "none",
                          borderRadius: 6,
                          background: newName.trim() ? COLORS.pri : DARK.bg3,
                          color: newName.trim() ? "#fff" : DARK.txL,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: newName.trim() ? "pointer" : "not-allowed"
                        },
                        children: "\uCD94\uAC00"
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function LabelRow({ label, usage, onUpdate, onDelete }) {
  const [editing, setEditing] = (0, import_react6.useState)(false);
  const [draftName, setDraftName] = (0, import_react6.useState)(label.name);
  const commit = () => {
    const n = draftName.trim();
    if (n && n !== label.name) onUpdate({ name: n });
    else setDraftName(label.name);
    setEditing(false);
  };
  const handleDelete = () => {
    if (usage > 0) {
      const ok = window.confirm(
        `\uC774 \uB808\uC774\uBE14\uC744 \uC0AC\uC6A9 \uC911\uC778 \uD540\uC774 ${usage}\uAC1C \uC788\uC2B5\uB2C8\uB2E4.
\uC0AD\uC81C\uD558\uBA74 \uD574\uB2F9 \uD540\uB4E4\uC740 "\uBBF8\uBD84\uB958"\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4. \uACC4\uC18D\uD560\uAE4C\uC694?`
      );
      if (!ok) return;
    }
    onDelete();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 6px",
        borderBottom: `1px solid ${DARK.brd}`
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ColorDot, { color: label.color, onChange: (c) => onUpdate({ color: c }), title: "\uC0C9\uC0C1 \uBCC0\uACBD" }),
        editing ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "input",
          {
            autoFocus: true,
            value: draftName,
            onChange: (e) => setDraftName(e.target.value),
            onBlur: commit,
            onKeyDown: (e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraftName(label.name);
                setEditing(false);
              }
            },
            style: {
              flex: 1,
              padding: "4px 8px",
              border: `1px solid ${DARK.brd2}`,
              borderRadius: 5,
              fontSize: 12,
              outline: "none",
              fontFamily: "inherit",
              background: DARK.bg3,
              color: DARK.txt
            }
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "div",
          {
            onClick: () => setEditing(true),
            style: { flex: 1, fontSize: 13, fontWeight: 500, color: DARK.txt, cursor: "text", padding: "4px 2px" },
            title: "\uD074\uB9AD\uD558\uC5EC \uC218\uC815",
            children: label.name
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { style: { fontSize: 10, color: usage > 0 ? DARK.txS : DARK.txL, minWidth: 40, textAlign: "right" }, children: [
          usage,
          "\uAC1C \uC0AC\uC6A9"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            onClick: handleDelete,
            title: "\uB808\uC774\uBE14 \uC0AD\uC81C",
            style: {
              padding: "4px 8px",
              border: `1px solid ${DARK.brd}`,
              borderRadius: 5,
              background: "transparent",
              color: "#f87171",
              fontSize: 11,
              cursor: "pointer"
            },
            children: "\uC0AD\uC81C"
          }
        )
      ]
    }
  );
}
function ColorDot({ color, onChange, title }) {
  const [open, setOpen] = (0, import_react6.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        title,
        style: {
          width: 22,
          height: 22,
          borderRadius: 5,
          background: color,
          border: `1px solid ${DARK.brd}`,
          cursor: "pointer",
          padding: 0,
          flexShrink: 0
        }
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { onClick: () => setOpen(false), style: { position: "fixed", inset: 0, zIndex: 1 } }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "div",
        {
          style: {
            position: "absolute",
            top: 26,
            left: 0,
            zIndex: 2,
            background: DARK.bg2,
            border: `1px solid ${DARK.brd}`,
            borderRadius: 7,
            padding: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 22px)",
            gap: 6
          },
          children: LABEL_COLOR_PRESETS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              onClick: () => {
                onChange(c);
                setOpen(false);
              },
              style: {
                width: 22,
                height: 22,
                borderRadius: 4,
                background: c,
                border: c === color ? `2px solid #fff` : `1px solid ${DARK.brd}`,
                cursor: "pointer",
                padding: 0
              }
            },
            c
          ))
        }
      )
    ] })
  ] });
}

// src/OnboardingGuide.tsx
var import_react7 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var SB_LOGO_PATHS = /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { opacity: "0.69", d: "M111.309 79.6218C116.002 96.9372 100.191 112.84 82.8489 108.247L21.3533 91.961C4.01096 87.3681 -1.85607 65.7239 10.7927 53.0015L55.6448 7.88791C68.2936 -4.83456 89.9715 0.906559 94.6651 18.2219L111.309 79.6218Z", fill: "#3078FF" }),
  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { opacity: "0.5", d: "M101.327 142.828C86.0562 152.245 66.3188 141.599 65.7993 123.666L64.723 86.5136C64.2035 68.5809 83.2915 56.8106 99.0814 65.3271L131.795 82.9713C147.585 91.4877 148.234 113.904 132.964 123.32L101.327 142.828Z", fill: "#4CD3FF" })
] });
var SB_LOGO_VIEWBOX = "-10 -10 170 172";
var GIcon = ({ children, size = 32 }) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,.75)", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", children }) });
function IntroLogo() {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("svg", { width: 54, height: 54, viewBox: SB_LOGO_VIEWBOX, fill: "none", style: { display: "block", margin: "0 auto", position: "relative", left: -3 }, children: SB_LOGO_PATHS });
}
var GUIDE_KEY = "cs_annot_guide_v1";
function hasDismissedForever() {
  try {
    return localStorage.getItem(GUIDE_KEY) === "1";
  } catch {
    return false;
  }
}
function markDismissedForever() {
  try {
    localStorage.setItem(GUIDE_KEY, "1");
  } catch {
  }
}
var STEPS = [
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IntroLogo, {}),
    title: "SpecBridge",
    badge: "\uC5B4\uB178\uD14C\uC774\uC158 \uD611\uC5C5 \uD234",
    desc: "\uAE30\uD68D\uC790\xB7\uB514\uC790\uC774\uB108\xB7\uAC1C\uBC1C\uC790\uAC00 \uD654\uBA74\uC5D0 \uC9C1\uC811 \uBC88\uD638(\uD540)\uB97C \uB0A8\uAE30\uACE0, \uCF54\uBA58\uD2B8\uC640 \uAC80\uD1A0 \uD68C\uCC28\uB97C \uD300\uC6D0\uACFC \uD568\uAED8 \uAD00\uB9AC\uD558\uB294 \uD611\uC5C5 \uC5B4\uB178\uD14C\uC774\uC158 \uD234\uC785\uB2C8\uB2E4. \uC544\uB798 \uAC00\uC774\uB4DC\uB85C \uD575\uC2EC \uAE30\uB2A5\uC744 \uC0B4\uD3B4\uBCF4\uC138\uC694.",
    target: null
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("circle", { cx: "12", cy: "7", r: "4" })
    ] }),
    title: "\uC774\uB984 \uC124\uC815",
    badge: "\uAE30\uBCF8 \uC124\uC815",
    desc: "\uC6B0\uCE21 '\uC791\uC131\uC790' \uBC84\uD2BC\uC744 \uD074\uB9AD\uD574 \uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694. \uD540\uC5D0 \uC791\uC131\uC790 \uC815\uBCF4\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.",
    target: "sb-author"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("circle", { cx: "12", cy: "10", r: "3" })
    ] }),
    title: "\uC5B4\uB178\uD14C\uC774\uC158 \uBAA8\uB4DC",
    badge: "\uAE30\uBCF8 \uC124\uC815",
    desc: "Annotation \uBC84\uD2BC\uC73C\uB85C \uC5B4\uB178\uD14C\uC774\uC158 \uBAA8\uB4DC\uB97C ON/OFF \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB2E8\uCD95\uD0A4 A",
    target: "sb-annotation"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
    ] }),
    title: "\uD540 \uB4F1\uB85D",
    badge: "\uD540 \uAD00\uB9AC",
    desc: "+ \uBC84\uD2BC \uB610\uB294 N\uD0A4\uB97C \uB20C\uB7EC \uD540 \uBC30\uCE58 \uBAA8\uB4DC\uB97C \uC2DC\uC791\uD558\uC138\uC694. \uD654\uBA74\uC758 \uC6D0\uD558\uB294 \uC704\uCE58\uB97C \uD074\uB9AD\uD558\uBA74 \uBC88\uD638\uAC00 \uCC0D\uD799\uB2C8\uB2E4.",
    target: "sb-add-pin"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
    ] }),
    title: "\uBC88\uD638 \uD655\uC778",
    badge: "\uBAA9\uB85D & \uD544\uD130",
    desc: "\uBAA9\uB85D \uBC84\uD2BC\uC744 \uD074\uB9AD\uD558\uBA74 \uD604\uC7AC \uD398\uC774\uC9C0\uC758 \uBAA8\uB4E0 \uD540 \uBAA9\uB85D\uC744 \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    target: "sb-pin-list"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M7 7h.01" })
    ] }),
    title: "\uB808\uC774\uBE14 \uD544\uD130",
    badge: "\uBAA9\uB85D & \uD544\uD130",
    desc: "\uC911\uC559\uC758 \uB808\uC774\uBE14 \uBC84\uD2BC\uC73C\uB85C \uD2B9\uC815 \uB808\uC774\uBE14\uC758 \uD540\uB9CC \uACE8\uB77C\uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB808\uC774\uBE14\uBCC4\uB85C \uD3EC\uC778\uD2B8\uB97C \uBD84\uB958\xB7\uAD00\uB9AC\uD558\uC138\uC694.",
    target: "sb-label-filter"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }) }),
    title: "\uAC80\uD1A0 \uD68C\uCC28",
    badge: "\uAC80\uD1A0 \uD68C\uCC28",
    desc: "\uAC80\uD1A0 \uD68C\uCC28 \uBC84\uD2BC\uC73C\uB85C \uD68C\uCC28\uB97C \uB098\uB20C \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uD654\uBA74\uC774 \uBCC0\uACBD\uB3FC\uB3C4 \uC774\uC804 \uD68C\uCC28\uAC00 \uBCF4\uC874\uB429\uB2C8\uB2E4.",
    target: "sb-session"
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(GIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" }) }),
    title: "\uCF54\uBA58\uD2B8 & \uC2A4\uB808\uB4DC",
    badge: "\uD611\uC5C5",
    desc: "\uD540\uC744 \uD074\uB9AD\uD558\uBA74 \uB178\uD2B8 \uC791\uC131\uACFC \uD300\uC6D0 \uC2A4\uB808\uB4DC \uB313\uAE00, \uD574\uACB0 \uCC98\uB9AC\uAC00 \uAC00\uB2A5\uD569\uB2C8\uB2E4.",
    target: null
  },
  {
    icon: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(GIcon, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("path", { d: "M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" })
    ] }),
    title: "\uB2E8\uCD95\uD0A4",
    badge: "\uB2E8\uCD95\uD0A4",
    desc: "A \u2014 Annotation ON/OFF  \xB7  N \u2014 \uD540 \uCD94\uAC00  \xB7  L \u2014 \uBAA9\uB85D  \xB7  D \u2014 \uD540 \uC0AD\uC81C  \xB7  C \u2014 \uD574\uACB0/\uBBF8\uD574\uACB0",
    target: null
  }
];
var SPOTLIGHT_PADDING = 8;
function getSpotRect(target) {
  if (!target) return null;
  const el = document.querySelector(`[data-guide="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}
function OnboardingGuide({ onClose }) {
  const [step, setStep] = (0, import_react7.useState)(0);
  const [hideForever, setHideForever] = (0, import_react7.useState)(false);
  const [spotRect, setSpotRect] = (0, import_react7.useState)(null);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  (0, import_react7.useEffect)(() => {
    const raf = requestAnimationFrame(() => {
      setSpotRect(getSpotRect(current.target));
    });
    return () => cancelAnimationFrame(raf);
  }, [step, current.target]);
  (0, import_react7.useEffect)(() => {
    const onResize = () => setSpotRect(getSpotRect(current.target));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current.target]);
  const handleClose = () => {
    if (hideForever) markDismissedForever();
    onClose(hideForever);
  };
  const handleNext = () => {
    if (isLast) {
      handleClose();
      return;
    }
    setStep((v) => v + 1);
  };
  const handlePrev = () => setStep((v) => v - 1);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "div",
      {
        onClick: handleClose,
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 19996,
          background: spotRect ? "transparent" : "rgba(0,0,0,.70)",
          fontFamily: FONT_FAMILY
        }
      }
    ),
    spotRect && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "div",
      {
        style: {
          position: "fixed",
          top: spotRect.top - SPOTLIGHT_PADDING,
          left: spotRect.left - SPOTLIGHT_PADDING,
          width: spotRect.width + SPOTLIGHT_PADDING * 2,
          height: spotRect.height + SPOTLIGHT_PADDING * 2,
          borderRadius: 10,
          boxShadow: "0 0 0 9999px rgba(0,0,0,.70)",
          border: "2px solid rgba(59,130,246,.75)",
          zIndex: 19997,
          transition: "top .3s cubic-bezier(.4,0,.2,1), left .3s cubic-bezier(.4,0,.2,1), width .3s cubic-bezier(.4,0,.2,1), height .3s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none"
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 19999,
          background: "rgba(12,12,12,.98)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 16,
          padding: "20px 26px 18px",
          width: 340,
          height: 390,
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,.75)",
          fontFamily: FONT_FAMILY
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "button",
            {
              onClick: handleClose,
              style: {
                position: "absolute",
                top: 13,
                right: 14,
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,.28)",
                fontSize: 15,
                cursor: "pointer",
                lineHeight: 1,
                padding: 4
              },
              children: "\u2715"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { display: "flex", gap: 5, justifyContent: "center", marginBottom: 14, flexShrink: 0 }, children: STEPS.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "div",
            {
              onClick: () => setStep(i),
              style: {
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? "#3B82F6" : "rgba(255,255,255,.16)",
                cursor: "pointer",
                transition: "all .22s"
              }
            },
            i
          )) }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { height: 68, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: current.icon }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: {
            textAlign: "center",
            fontSize: step === 0 ? 20 : 16,
            fontWeight: 700,
            color: "rgba(255,255,255,.92)",
            marginBottom: 8,
            lineHeight: 1.3,
            flexShrink: 0
          }, children: current.title }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { display: "flex", justifyContent: "center", marginBottom: 8, flexShrink: 0 }, children: step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { style: {
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".6px",
            color: "#6B82F6",
            background: "rgba(107,130,246,.15)",
            border: "1px solid rgba(107,130,246,.3)",
            borderRadius: 20,
            padding: "3px 10px",
            fontFamily: FONT_FAMILY
          }, children: current.badge }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { style: {
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: ".4px",
            color: "rgba(255,255,255,.28)",
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 20,
            padding: "3px 10px",
            fontFamily: FONT_FAMILY
          }, children: current.badge }) }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: {
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 12.5,
            color: "rgba(255,255,255,.48)",
            lineHeight: 1.75
          }, children: current.desc }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { textAlign: "center", fontSize: 10, color: "rgba(255,255,255,.22)", marginBottom: 10, flexShrink: 0 }, children: [
            step + 1,
            " / ",
            STEPS.length
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { style: { display: "flex", gap: 8, marginBottom: 10, flexShrink: 0 }, children: [
            step > 0 && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "button",
              {
                onClick: handlePrev,
                style: {
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,.1)",
                  color: "rgba(255,255,255,.4)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY
                },
                children: "\uC774\uC804"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "button",
              {
                onClick: handleNext,
                style: {
                  flex: 2,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: "#3B82F6",
                  border: "none",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT_FAMILY,
                  transition: "background .15s"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "#2563EB";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "#3B82F6";
                },
                children: isLast ? "\uC2DC\uC791\uD558\uAE30 \u{1F680}" : "\uB2E4\uC74C"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
            "label",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                cursor: "pointer",
                userSelect: "none",
                flexShrink: 0
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: hideForever,
                    onChange: (e) => setHideForever(e.target.checked),
                    style: { width: 13, height: 13, cursor: "pointer", accentColor: "#3B82F6" }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { style: { fontSize: 11, color: "rgba(255,255,255,.28)", fontFamily: FONT_FAMILY }, children: "\uC55E\uC73C\uB85C \uBCF4\uC774\uC9C0 \uC54A\uC74C" })
              ]
            }
          )
        ]
      }
    )
  ] });
}

// src/storage.ts
var loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};
var saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
};
function genId(prefix = "") {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function readAll() {
  return loadJson(STORAGE_KEYS.annotations, {});
}
function writeAll(data) {
  saveJson(STORAGE_KEYS.annotations, data);
}
function readSessions() {
  return loadJson(STORAGE_KEYS.sessions, []);
}
function writeSessions(sessions) {
  saveJson(STORAGE_KEYS.sessions, sessions);
}
function readLabels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.labels);
    if (raw == null) return DEFAULT_LABELS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
  }
  return DEFAULT_LABELS;
}
function writeLabels(labels) {
  saveJson(STORAGE_KEYS.labels, labels);
}
function replacePinEverywhere(data, pinId, mutator) {
  const out = {};
  for (const [pageId, arr] of Object.entries(data)) {
    out[pageId] = arr.map((p) => p.id === pinId ? mutator(p) : p);
  }
  return out;
}
async function updatePinLocal(id, patch) {
  const data = readAll();
  let updated = null;
  const next = replacePinEverywhere(data, id, (p) => {
    updated = { ...p, ...patch };
    return updated;
  });
  writeAll(next);
  if (!updated) throw new Error(`pin not found: ${id}`);
  return updated;
}
var localStorageAdapter = {
  async loadAnnotations() {
    const data = readAll();
    const allPins = Object.values(data).flat();
    const hasUnnum = allPins.some((p) => !p.num);
    if (hasUnnum) {
      let maxNum = allPins.reduce((m, p) => Math.max(m, p.num ?? 0), 0);
      const unnum = allPins.filter((p) => !p.num).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      for (const p of unnum) p.num = ++maxNum;
      writeAll(data);
    }
    return data;
  },
  async loadLabels() {
    return readLabels();
  },
  async loadAuthor() {
    try {
      return localStorage.getItem(STORAGE_KEYS.author) ?? "";
    } catch {
      return "";
    }
  },
  async loadLastLabelId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.lastLabel);
    } catch {
      return null;
    }
  },
  async saveAuthor(name) {
    try {
      localStorage.setItem(STORAGE_KEYS.author, name);
    } catch {
    }
  },
  async saveLastLabelId(id) {
    try {
      if (id == null) localStorage.removeItem(STORAGE_KEYS.lastLabel);
      else localStorage.setItem(STORAGE_KEYS.lastLabel, id);
    } catch {
    }
  },
  async loadAuthorDefaultLabelId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.defaultLabel);
    } catch {
      return null;
    }
  },
  async saveAuthorDefaultLabelId(id) {
    try {
      if (id == null) localStorage.removeItem(STORAGE_KEYS.defaultLabel);
      else localStorage.setItem(STORAGE_KEYS.defaultLabel, id);
    } catch {
    }
  },
  async createLabel({ name, color }) {
    const label = { id: genId("lbl-"), name: name.trim(), color };
    const labels = readLabels();
    writeLabels([...labels, label]);
    return label;
  },
  async updateLabel(id, patch) {
    const labels = readLabels();
    const next = labels.map(
      (l) => l.id === id ? { ...l, ...patch, name: patch.name?.trim() ?? l.name } : l
    );
    writeLabels(next);
    const found = next.find((l) => l.id === id);
    if (!found) throw new Error(`label not found: ${id}`);
    return found;
  },
  async deleteLabel(id) {
    const labels = readLabels();
    writeLabels(labels.filter((l) => l.id !== id));
  },
  async createPin({ pageId, x, y, labelId, author, sessionId }) {
    const data = readAll();
    const maxNum = Object.values(data).flat().reduce((m, p) => Math.max(m, p.num ?? 0), 0);
    const pin = {
      id: genId(),
      num: maxNum + 1,
      x,
      y,
      labelId,
      note: "",
      author,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "open",
      comments: [],
      sessionId: sessionId ?? null
    };
    data[pageId] = [...data[pageId] ?? [], pin];
    writeAll(data);
    return pin;
  },
  async updatePin(id, patch) {
    return updatePinLocal(id, patch);
  },
  async deletePin(id) {
    const data = readAll();
    const out = {};
    for (const [pageId, arr] of Object.entries(data)) {
      out[pageId] = arr.filter((p) => p.id !== id);
    }
    writeAll(out);
  },
  async resolvePin(id, by) {
    return updatePinLocal(id, {
      status: "resolved",
      resolvedBy: by,
      resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  },
  async reopenPin(id) {
    return updatePinLocal(id, {
      status: "open",
      resolvedBy: void 0,
      resolvedAt: void 0
    });
  },
  async addComment(pinId, author, text) {
    const comment = {
      id: genId("c-"),
      author,
      text: text.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const data = readAll();
    const next = replacePinEverywhere(data, pinId, (p) => ({
      ...p,
      comments: [...p.comments, comment]
    }));
    writeAll(next);
    return comment;
  },
  async updateComment(commentId, text) {
    const data = readAll();
    let updated = null;
    const next = {};
    for (const [pageId, arr] of Object.entries(data)) {
      next[pageId] = arr.map((p) => ({
        ...p,
        comments: p.comments.map((c) => {
          if (c.id !== commentId) return c;
          updated = { ...c, text: text.trim(), updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
          return updated;
        })
      }));
    }
    writeAll(next);
    if (!updated) throw new Error(`comment not found: ${commentId}`);
    return updated;
  },
  async deleteComment(commentId) {
    const data = readAll();
    const next = {};
    for (const [pageId, arr] of Object.entries(data)) {
      next[pageId] = arr.map((p) => ({
        ...p,
        comments: p.comments.filter((c) => c.id !== commentId)
      }));
    }
    writeAll(next);
  },
  // ── Sessions ─────────────────────────────────────────────
  async loadSessions() {
    return readSessions();
  },
  async createSession(name, options) {
    const session = {
      id: genId("ses-"),
      name: name.trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "active",
      viewport: options?.viewport ?? null,
      note: options?.note ?? null
    };
    writeSessions([...readSessions(), session]);
    return session;
  },
  async updateSession(id, patch) {
    const sessions = readSessions();
    const next = sessions.map(
      (s) => s.id === id ? { ...s, ...patch, ...patch.name ? { name: patch.name.trim() } : {} } : s
    );
    writeSessions(next);
    const found = next.find((s) => s.id === id);
    if (!found) throw new Error(`session not found: ${id}`);
    return found;
  },
  async deleteSession(id) {
    writeSessions(readSessions().filter((s) => s.id !== id));
  },
  async loadCurrentSessionId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.currentSession);
    } catch {
      return null;
    }
  },
  async saveCurrentSessionId(id) {
    try {
      if (id == null) localStorage.removeItem(STORAGE_KEYS.currentSession);
      else localStorage.setItem(STORAGE_KEYS.currentSession, id);
    } catch {
    }
  }
};

// src/useAnnotations.ts
var import_react8 = require("react");
function useAnnotations(pageId, storage) {
  const [allAnnots, setAllAnnots] = (0, import_react8.useState)({});
  const [loading, setLoading] = (0, import_react8.useState)(true);
  (0, import_react8.useEffect)(() => {
    let cancelled = false;
    storage.loadAnnotations().then((data) => {
      if (!cancelled) setAllAnnots(data);
    }).catch((e) => console.error("[specbridge] loadAnnotations failed", e)).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const pins = (0, import_react8.useMemo)(() => allAnnots[pageId] ?? [], [allAnnots, pageId]);
  const replacePin = (0, import_react8.useCallback)((pin) => {
    setAllAnnots((prev) => {
      const out = {};
      for (const [pid, arr] of Object.entries(prev)) {
        out[pid] = arr.map((p) => p.id === pin.id ? pin : p);
      }
      return out;
    });
  }, []);
  const removePinEverywhere = (0, import_react8.useCallback)((pinId) => {
    setAllAnnots((prev) => {
      const out = {};
      for (const [pid, arr] of Object.entries(prev)) {
        out[pid] = arr.filter((p) => p.id !== pinId);
      }
      return out;
    });
  }, []);
  const addPin = (0, import_react8.useCallback)(
    async (x, y, author, labelId, sessionId) => {
      try {
        const pin = await storage.createPin({ pageId, x, y, labelId, author, sessionId });
        setAllAnnots((prev) => ({
          ...prev,
          [pageId]: [...prev[pageId] ?? [], pin]
        }));
        return pin;
      } catch (e) {
        console.error("[specbridge] createPin failed", e);
        return null;
      }
    },
    [pageId, storage]
  );
  const updatePin = (0, import_react8.useCallback)(
    async (id, patch) => {
      try {
        const pin = await storage.updatePin(id, patch);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] updatePin failed", e);
      }
    },
    [storage, replacePin]
  );
  const deletePin = (0, import_react8.useCallback)(
    async (id) => {
      try {
        await storage.deletePin(id);
        removePinEverywhere(id);
      } catch (e) {
        console.error("[specbridge] deletePin failed", e);
      }
    },
    [storage, removePinEverywhere]
  );
  const movePin = (0, import_react8.useCallback)(
    async (id, pos) => {
      try {
        const pin = await storage.updatePin(id, pos);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] movePin failed", e);
      }
    },
    [storage, replacePin]
  );
  const resolvePin = (0, import_react8.useCallback)(
    async (id, by) => {
      try {
        const pin = await storage.resolvePin(id, by);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] resolvePin failed", e);
      }
    },
    [storage, replacePin]
  );
  const reopenPin = (0, import_react8.useCallback)(
    async (id) => {
      try {
        const pin = await storage.reopenPin(id);
        replacePin(pin);
      } catch (e) {
        console.error("[specbridge] reopenPin failed", e);
      }
    },
    [storage, replacePin]
  );
  const addComment = (0, import_react8.useCallback)(
    async (pinId, author, text) => {
      try {
        const comment = await storage.addComment(pinId, author, text);
        setAllAnnots((prev) => {
          const out = {};
          for (const [pid, arr] of Object.entries(prev)) {
            out[pid] = arr.map(
              (p) => p.id === pinId ? { ...p, comments: [...p.comments, comment] } : p
            );
          }
          return out;
        });
        return comment;
      } catch (e) {
        console.error("[specbridge] addComment failed", e);
        return null;
      }
    },
    [storage]
  );
  const updateComment = (0, import_react8.useCallback)(
    async (pinId, commentId, text) => {
      try {
        const comment = await storage.updateComment(commentId, text);
        setAllAnnots((prev) => {
          const out = {};
          for (const [pid, arr] of Object.entries(prev)) {
            out[pid] = arr.map(
              (p) => p.id === pinId ? { ...p, comments: p.comments.map((c) => c.id === commentId ? comment : c) } : p
            );
          }
          return out;
        });
      } catch (e) {
        console.error("[specbridge] updateComment failed", e);
      }
    },
    [storage]
  );
  const deleteComment = (0, import_react8.useCallback)(
    async (pinId, commentId) => {
      try {
        await storage.deleteComment(commentId);
        setAllAnnots((prev) => {
          const out = {};
          for (const [pid, arr] of Object.entries(prev)) {
            out[pid] = arr.map(
              (p) => p.id === pinId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
            );
          }
          return out;
        });
      } catch (e) {
        console.error("[specbridge] deleteComment failed", e);
      }
    },
    [storage]
  );
  return {
    loading,
    allAnnots,
    pins,
    addPin,
    updatePin,
    deletePin,
    movePin,
    addComment,
    updateComment,
    deleteComment,
    resolvePin,
    reopenPin
  };
}

// src/useAuthor.ts
var import_react9 = require("react");
function useAuthor(storage) {
  const [author, setAuthorState] = (0, import_react9.useState)("");
  const [defaultLabelId, setDefaultLabelIdState] = (0, import_react9.useState)(null);
  const [loading, setLoading] = (0, import_react9.useState)(true);
  (0, import_react9.useEffect)(() => {
    let cancelled = false;
    Promise.all([
      storage.loadAuthor(),
      storage.loadAuthorDefaultLabelId?.() ?? Promise.resolve(null)
    ]).then(([name, labelId]) => {
      if (!cancelled) {
        setAuthorState(name);
        setDefaultLabelIdState(labelId);
      }
    }).catch((e) => console.error("[specbridge] useAuthor load failed", e)).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const setAuthor = (0, import_react9.useCallback)(
    async (name) => {
      setAuthorState(name);
      try {
        await storage.saveAuthor(name);
      } catch (e) {
        console.error("[specbridge] saveAuthor failed", e);
      }
    },
    [storage]
  );
  const setDefaultLabelId = (0, import_react9.useCallback)(
    async (id) => {
      setDefaultLabelIdState(id);
      try {
        await storage.saveAuthorDefaultLabelId?.(id);
      } catch (e) {
        console.error("[specbridge] saveAuthorDefaultLabelId failed", e);
      }
    },
    [storage]
  );
  return { author, setAuthor, defaultLabelId, setDefaultLabelId, loading };
}

// src/useLabels.ts
var import_react10 = require("react");
function useLabels(storage) {
  const [labels, setLabels] = (0, import_react10.useState)([]);
  const [loading, setLoading] = (0, import_react10.useState)(true);
  (0, import_react10.useEffect)(() => {
    let cancelled = false;
    storage.loadLabels().then((v) => {
      if (!cancelled) setLabels(v);
    }).catch((e) => console.error("[specbridge] loadLabels failed", e)).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const addLabel = (0, import_react10.useCallback)(
    async (name, color) => {
      try {
        const trimmed = name.trim();
        if (!trimmed) return null;
        const created = await storage.createLabel({ name: trimmed, color });
        setLabels((prev) => [...prev, created]);
        return created;
      } catch (e) {
        console.error("[specbridge] createLabel failed", e);
        return null;
      }
    },
    [storage]
  );
  const updateLabel = (0, import_react10.useCallback)(
    async (id, patch) => {
      try {
        const updated = await storage.updateLabel(id, patch);
        setLabels((prev) => prev.map((l) => l.id === id ? updated : l));
      } catch (e) {
        console.error("[specbridge] updateLabel failed", e);
      }
    },
    [storage]
  );
  const deleteLabel = (0, import_react10.useCallback)(
    async (id) => {
      try {
        await storage.deleteLabel(id);
        setLabels((prev) => prev.filter((l) => l.id !== id));
      } catch (e) {
        console.error("[specbridge] deleteLabel failed", e);
      }
    },
    [storage]
  );
  return { labels, addLabel, updateLabel, deleteLabel, loading };
}

// src/useSessions.ts
var import_react11 = require("react");
function useSessions(storage) {
  const [sessions, setSessions] = (0, import_react11.useState)([]);
  (0, import_react11.useEffect)(() => {
    let cancelled = false;
    storage.loadSessions().then(async (v) => {
      if (cancelled) return;
      if (v.length > 0) {
        setSessions(v);
      } else {
        try {
          const session = await storage.createSession("1\uCC28 \uAC80\uD1A0");
          if (!cancelled) setSessions([session]);
        } catch {
          if (!cancelled) setSessions([]);
        }
      }
    }).catch((e) => console.error("[specbridge] loadSessions failed", e));
    return () => {
      cancelled = true;
    };
  }, [storage]);
  const addSession = (0, import_react11.useCallback)(
    async (name, options) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      try {
        const session = await storage.createSession(trimmed, options);
        setSessions((prev) => [...prev, session]);
        return session;
      } catch (e) {
        console.error("[specbridge] createSession failed", e);
        return null;
      }
    },
    [storage]
  );
  const updateSession = (0, import_react11.useCallback)(
    async (id, patch) => {
      if (patch.name !== void 0 && !patch.name.trim()) return;
      try {
        const updated = await storage.updateSession(id, patch);
        setSessions((prev) => prev.map((s) => s.id === id ? updated : s));
      } catch (e) {
        console.error("[specbridge] updateSession failed", e);
      }
    },
    [storage]
  );
  const setSessionStatus = (0, import_react11.useCallback)(
    async (id, status) => {
      await updateSession(id, { status });
    },
    [updateSession]
  );
  const setSessionViewport = (0, import_react11.useCallback)(
    async (id, viewport) => {
      await updateSession(id, { viewport });
    },
    [updateSession]
  );
  const deleteSession = (0, import_react11.useCallback)(
    async (id) => {
      try {
        await storage.deleteSession(id);
        const remaining = await storage.loadSessions();
        if (remaining.length === 0) {
          const session = await storage.createSession("1\uCC28 \uAC80\uD1A0");
          setSessions([session]);
        } else {
          setSessions(remaining);
        }
      } catch (e) {
        console.error("[specbridge] deleteSession failed", e);
      }
    },
    [storage]
  );
  return { sessions, addSession, updateSession, setSessionStatus, setSessionViewport, deleteSession };
}

// src/SpecBridgeAnnotation.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var LAYER_ID = "specbridge-annot-layer";
var CONTAINER_ID = "specbridge-annot-container";
var LOGO_TIP_KEY = "cs_annot_logo_tip_v1";
function hasShownLogoTip() {
  try {
    return localStorage.getItem(LOGO_TIP_KEY) === "1";
  } catch {
    return false;
  }
}
function markLogoTipShown() {
  try {
    localStorage.setItem(LOGO_TIP_KEY, "1");
  } catch {
  }
}
function SpecBridgeAnnotation({
  pageId,
  enabled: initialEnabled = true,
  storage = localStorageAdapter,
  onExport,
  children
}) {
  const [enabled, setEnabled] = (0, import_react12.useState)(initialEnabled);
  const [showGuide, setShowGuide] = (0, import_react12.useState)(() => !hasDismissedForever());
  const [showLogoTip, setShowLogoTip] = (0, import_react12.useState)(false);
  const [adding, setAdding] = (0, import_react12.useState)(false);
  const [showList, setShowList] = (0, import_react12.useState)(false);
  const [showResolved, setShowResolved] = (0, import_react12.useState)(false);
  const [selectedId, setSelectedId] = (0, import_react12.useState)(null);
  const [filterLabelIds, setFilterLabelIds] = (0, import_react12.useState)(/* @__PURE__ */ new Set());
  const [currentSessionId, setCurrentSessionId] = (0, import_react12.useState)(null);
  const [hoveredId, setHoveredId] = (0, import_react12.useState)(null);
  const hoverTimer = (0, import_react12.useRef)(null);
  const [showAuthorModal, setShowAuthorModal] = (0, import_react12.useState)(false);
  const [showLabelModal, setShowLabelModal] = (0, import_react12.useState)(false);
  const [lastLabelId, setLastLabelIdState] = (0, import_react12.useState)(null);
  const [latestSdkVersion, setLatestSdkVersion] = (0, import_react12.useState)(null);
  const [, setResizeTick] = (0, import_react12.useState)(0);
  (0, import_react12.useEffect)(() => {
    const onResize = () => setResizeTick((t) => t + 1);
    const onScroll = () => setResizeTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  (0, import_react12.useEffect)(() => {
    const id = "specbridge-pretendard";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css";
    document.head.appendChild(link);
  }, []);
  (0, import_react12.useEffect)(() => {
    if (!storage.checkSdkVersion) return;
    storage.checkSdkVersion().then(({ latest }) => {
      if (latest) setLatestSdkVersion(latest);
    }).catch(() => {
    });
  }, []);
  (0, import_react12.useEffect)(() => {
    let cancelled = false;
    storage.loadLastLabelId().then((v) => {
      if (!cancelled) setLastLabelIdState(v);
    }).catch((e) => console.error("[specbridge] loadLastLabelId failed", e));
    return () => {
      cancelled = true;
    };
  }, [storage]);
  (0, import_react12.useEffect)(() => {
    storage.loadCurrentSessionId().then((id) => {
      if (id) setCurrentSessionId(id);
    }).catch(() => {
    });
  }, []);
  const { author, setAuthor, defaultLabelId, setDefaultLabelId } = useAuthor(storage);
  const { labels, addLabel, updateLabel, deleteLabel } = useLabels(storage);
  const { sessions, addSession, updateSession, setSessionStatus, setSessionViewport, deleteSession } = useSessions(storage);
  const handleSelectSession = (0, import_react12.useCallback)((id) => {
    setCurrentSessionId(id);
    storage.saveCurrentSessionId(id).catch(() => {
    });
    setSelectedId(null);
  }, [storage]);
  const handleCreateSession = (0, import_react12.useCallback)(
    async (name, options) => {
      const session = await addSession(name, options);
      if (!session) return null;
      handleSelectSession(session.id);
      return session.id;
    },
    [addSession, handleSelectSession]
  );
  const handleDeleteSession = (0, import_react12.useCallback)(async (id) => {
    await deleteSession(id);
    if (currentSessionId === id) handleSelectSession(null);
  }, [deleteSession, currentSessionId, handleSelectSession]);
  const {
    allAnnots,
    pins: allPagePins,
    addPin,
    updatePin,
    deletePin,
    movePin,
    addComment,
    updateComment,
    deleteComment,
    resolvePin,
    reopenPin
  } = useAnnotations(pageId, storage);
  const labelById = (0, import_react12.useMemo)(() => new Map(labels.map((l) => [l.id, l])), [labels]);
  const visiblePins = (0, import_react12.useMemo)(() => {
    let pins = allPagePins;
    if (currentSessionId !== null) {
      pins = pins.filter((p) => p.id === selectedId || p.sessionId === currentSessionId);
    }
    if (!showResolved) {
      pins = pins.filter((p) => p.status !== "resolved" || p.id === selectedId);
    }
    if (filterLabelIds.size > 0) {
      pins = pins.filter((p) => p.id === selectedId || p.labelId != null && filterLabelIds.has(p.labelId));
    }
    return pins;
  }, [allPagePins, showResolved, selectedId, filterLabelIds, currentSessionId]);
  const resolvedCountThisPage = (0, import_react12.useMemo)(
    () => allPagePins.filter((p) => p.status === "resolved").length,
    [allPagePins]
  );
  const sessionProgress = (0, import_react12.useMemo)(() => {
    const progress = {};
    for (const pins of Object.values(allAnnots)) {
      for (const pin of pins) {
        const sid = pin.sessionId ?? "__none__";
        if (!progress[sid]) progress[sid] = { total: 0, resolved: 0 };
        progress[sid].total++;
        if (pin.status === "resolved") progress[sid].resolved++;
      }
    }
    return progress;
  }, [allAnnots]);
  const pinUsage = (0, import_react12.useMemo)(() => {
    const usage = {};
    for (const list of Object.values(allAnnots)) {
      for (const p of list) {
        if (p.labelId) usage[p.labelId] = (usage[p.labelId] ?? 0) + 1;
      }
    }
    return usage;
  }, [allAnnots]);
  const rememberLastLabel = (0, import_react12.useCallback)(
    (id) => {
      if (!id) return;
      setLastLabelIdState(id);
      storage.saveLastLabelId(id);
    },
    [storage]
  );
  (0, import_react12.useEffect)(() => {
    if (!defaultLabelId && labels.length > 0) {
      setDefaultLabelId(labels[0].id);
    }
  }, [labels, defaultLabelId, setDefaultLabelId]);
  (0, import_react12.useEffect)(() => {
    if (lastLabelId && !labels.some((l) => l.id === lastLabelId)) {
      setLastLabelIdState(null);
      storage.saveLastLabelId(null);
    }
  }, [labels, lastLabelId, storage]);
  (0, import_react12.useEffect)(() => {
    setSelectedId(null);
    setAdding(false);
  }, [pageId]);
  (0, import_react12.useEffect)(() => {
    if (!enabled) {
      setAdding(false);
      setShowList(false);
      setSelectedId(null);
      setShowLabelModal(false);
    }
  }, [enabled]);
  (0, import_react12.useEffect)(() => {
    if (selectedId && !visiblePins.some((p) => p.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, visiblePins]);
  (0, import_react12.useEffect)(() => {
    if (!adding) return;
    const onKey = (e) => {
      if (e.key === "Escape") setAdding(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [adding]);
  (0, import_react12.useEffect)(() => {
    const onKey = (e) => {
      if (e.code !== "KeyA") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      e.preventDefault();
      setEnabled((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  (0, import_react12.useEffect)(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.code !== "KeyN") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      e.preventDefault();
      if (!author) {
        setShowAuthorModal(true);
        return;
      }
      setAdding((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, author]);
  (0, import_react12.useEffect)(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.code !== "KeyL") return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      setShowList((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
  const handleLayerClick = (0, import_react12.useCallback)(
    async (e) => {
      if (!adding) return;
      if (!author) {
        setShowAuthorModal(true);
        return;
      }
      const layer = document.getElementById(CONTAINER_ID);
      if (!layer) return;
      const rect = layer.getBoundingClientRect();
      const defaultExists = defaultLabelId && labels.some((l) => l.id === defaultLabelId);
      const lastExists = lastLabelId && labels.some((l) => l.id === lastLabelId);
      const resolvedLabelId = defaultExists ? defaultLabelId : lastExists ? lastLabelId : labels[0]?.id ?? null;
      const PIN_SIZE = 28;
      const MARGIN = 4;
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top - PIN_SIZE;
      const clampedX = Math.max(MARGIN, Math.min(rawX, rect.width - PIN_SIZE - MARGIN));
      const clampedY = Math.max(MARGIN, Math.min(rawY, rect.height - PIN_SIZE - MARGIN));
      const pin = await addPin(clampedX / rect.width, clampedY / rect.height, author, resolvedLabelId, currentSessionId);
      if (!pin) return;
      if (!defaultExists) rememberLastLabel(resolvedLabelId);
      setSelectedId(pin.id);
      setAdding(false);
    },
    [adding, author, addPin, labels, lastLabelId, defaultLabelId, rememberLastLabel]
  );
  const handlePanelClose = (0, import_react12.useCallback)(() => {
    const pin = allPagePins.find((p) => p.id === selectedId);
    if (pin && !pin.note?.trim()) deletePin(pin.id);
    setSelectedId(null);
  }, [allPagePins, selectedId, deletePin]);
  const handleUpdatePin = (0, import_react12.useCallback)(
    async (id, patch) => {
      await updatePin(id, patch);
      if (patch.labelId !== void 0) rememberLastLabel(patch.labelId);
    },
    [updatePin, rememberLastLabel]
  );
  const handleResolve = (0, import_react12.useCallback)(
    (pinId) => {
      if (!author) {
        setShowAuthorModal(true);
        return;
      }
      void resolvePin(pinId, author);
    },
    [author, resolvePin]
  );
  const handleExport = (0, import_react12.useCallback)(() => {
    const payload = {
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      annotations: allAnnots,
      labels
    };
    if (onExport) {
      onExport(payload);
      return;
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [allAnnots, labels, onExport]);
  const handlePinHoverEnter = (0, import_react12.useCallback)((id) => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHoveredId(id);
  }, []);
  const handlePinHoverLeave = (0, import_react12.useCallback)((_id) => {
    hoverTimer.current = setTimeout(() => {
      setHoveredId(null);
      hoverTimer.current = null;
    }, 60);
  }, []);
  (0, import_react12.useEffect)(() => {
    if (currentSessionId !== null && sessions.length > 0 && !sessions.some((s) => s.id === currentSessionId)) {
      handleSelectSession(null);
    }
  }, [sessions, currentSessionId, handleSelectSession]);
  (0, import_react12.useEffect)(() => {
    if (sessions.length === 1 && currentSessionId === null) {
      handleSelectSession(sessions[0].id);
    }
  }, [sessions, currentSessionId, handleSelectSession]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "div",
    {
      id: CONTAINER_ID,
      style: {
        position: "relative",
        minHeight: "100%",
        overflow: "hidden"
        // 절대 위치 자식이 문서 스크롤 높이에 영향주지 않도록
      },
      children: [
        children,
        enabled && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "div",
          {
            id: LAYER_ID,
            onClick: handleLayerClick,
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 9990,
              cursor: adding ? "crosshair" : "default",
              pointerEvents: adding ? "all" : "none"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { style: { pointerEvents: "none" }, children: visiblePins.map((pin) => {
              const label = pin.labelId ? labelById.get(pin.labelId) : void 0;
              const isHov = pin.id === hoveredId;
              const isSel = pin.id === selectedId;
              return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                AnnotPin,
                {
                  pin,
                  num: pin.num,
                  label,
                  layerId: CONTAINER_ID,
                  isSelected: isSel,
                  isHovered: isHov,
                  onSelect: () => setSelectedId(isSel ? null : pin.id),
                  onMove: (pos) => movePin(pin.id, pos),
                  onHoverEnter: handlePinHoverEnter,
                  onHoverLeave: handlePinHoverLeave
                },
                pin.id
              );
            }) })
          }
        ),
        enabled && showList && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          AnnotList,
          {
            pins: visiblePins,
            labels,
            pageId,
            selectedId,
            hoveredId,
            showResolved,
            resolvedCount: resolvedCountThisPage,
            onSelect: (id) => setSelectedId(id),
            onHover: (id) => setHoveredId(id ?? null),
            onToggleShowResolved: () => setShowResolved((v) => !v),
            onClose: () => setShowList(false)
          }
        ),
        enabled && selectedId && (() => {
          const selectedPin = allPagePins.find((p) => p.id === selectedId);
          if (!selectedPin) return null;
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "div",
              {
                style: { position: "fixed", inset: 0, zIndex: 9989 },
                onClick: handlePanelClose
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              AnnotPanel,
              {
                pins: allPagePins,
                selectedId,
                anchor: (() => {
                  const el = document.getElementById(CONTAINER_ID);
                  const r = el?.getBoundingClientRect();
                  return {
                    x: r ? r.left + selectedPin.x * r.width : selectedPin.x * window.innerWidth,
                    y: r ? r.top + selectedPin.y * r.height : selectedPin.y * window.innerHeight
                  };
                })(),
                labels,
                currentAuthor: author,
                leftBound: showList ? 252 : 0,
                onClose: handlePanelClose,
                onUpdate: handleUpdatePin,
                onDelete: (id) => {
                  deletePin(id);
                  setSelectedId(null);
                },
                onManageLabels: () => setShowLabelModal(true),
                onAddComment: (pinId, text) => addComment(pinId, author, text),
                onUpdateComment: updateComment,
                onDeleteComment: deleteComment,
                onResolve: handleResolve,
                onReopen: reopenPin
              }
            )
          ] });
        })(),
        showAuthorModal && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          AuthorModal,
          {
            currentAuthor: author,
            currentDefaultLabelId: defaultLabelId,
            labels,
            onSave: (name, labelId) => {
              setAuthor(name);
              setDefaultLabelId(labelId);
              setShowAuthorModal(false);
            },
            onCancel: () => setShowAuthorModal(false)
          }
        ),
        showLabelModal && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          LabelManagerModal,
          {
            labels,
            pinUsage,
            onAdd: addLabel,
            onUpdate: updateLabel,
            onDelete: deleteLabel,
            onClose: () => setShowLabelModal(false)
          }
        ),
        showGuide && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          OnboardingGuide,
          {
            onClose: (forever) => {
              setShowGuide(false);
              if (!forever && !hasShownLogoTip()) {
                markLogoTipShown();
                setShowLogoTip(true);
                setTimeout(() => setShowLogoTip(false), 5e3);
              }
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          AnnotationToolbar,
          {
            enabled,
            onToggleEnabled: () => setEnabled((v) => !v),
            author,
            onEditAuthor: () => setShowAuthorModal(true),
            adding,
            onToggleAdd: () => {
              if (!author) {
                setShowAuthorModal(true);
                return;
              }
              setAdding((v) => !v);
            },
            pinCount: visiblePins.length,
            showList,
            onToggleList: () => {
              setShowList((v) => !v);
              setSelectedId(null);
            },
            onExport: handleExport,
            labels,
            filterLabelIds,
            onToggleLabelFilter: (id) => setFilterLabelIds((prev) => {
              const next = new Set(prev);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            }),
            onClearLabelFilter: () => setFilterLabelIds(/* @__PURE__ */ new Set()),
            latestSdkVersion,
            onShowGuide: () => {
              setShowGuide(true);
              setShowLogoTip(false);
            },
            showLogoTip,
            sessions,
            currentSessionId,
            sessionProgress,
            onSelectSession: handleSelectSession,
            onCreateSession: handleCreateSession,
            onDeleteSession: handleDeleteSession,
            onUpdateSession: updateSession,
            onSetSessionStatus: setSessionStatus,
            onSetSessionViewport: setSessionViewport
          }
        )
      ]
    }
  );
}

// src/httpAdapter.ts
function httpAdapter(options) {
  const base = options.baseUrl.replace(/\/+$/, "");
  const apiKey = options.apiKey;
  if (!apiKey) {
    throw new Error("[specbridge] httpAdapter: apiKey is required");
  }
  const onError = options.onError ?? ((e, ctx) => console.error("[specbridge:http]", ctx, e));
  async function request(method, path, body) {
    const url = `${base}${path}`;
    const init = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-SpecBridge-SDK-Version": SDK_VERSION
      },
      body: body === void 0 ? void 0 : JSON.stringify(body),
      ...options.fetchInit?.(path) ?? {}
    };
    const res = await fetch(url, init);
    if (!res.ok) {
      let detail = "";
      try {
        detail = JSON.stringify(await res.json());
      } catch {
        try {
          detail = await res.text();
        } catch {
        }
      }
      const err = new Error(`${method} ${path} \u2192 ${res.status} ${detail}`);
      onError(err, { method, path });
      throw err;
    }
    if (res.status === 204) return void 0;
    return await res.json();
  }
  return {
    async loadAnnotations() {
      return request("GET", "/api/annotations");
    },
    async loadLabels() {
      return request("GET", "/api/labels");
    },
    async loadAuthor() {
      try {
        return localStorage.getItem("cs_annot_author") ?? "";
      } catch {
        return "";
      }
    },
    async loadLastLabelId() {
      try {
        return localStorage.getItem("cs_annot_last_label_v1");
      } catch {
        return null;
      }
    },
    async saveAuthor(name) {
      try {
        localStorage.setItem("cs_annot_author", name);
      } catch {
      }
    },
    async saveLastLabelId(id) {
      try {
        if (id == null) localStorage.removeItem("cs_annot_last_label_v1");
        else localStorage.setItem("cs_annot_last_label_v1", id);
      } catch {
      }
    },
    async loadAuthorDefaultLabelId() {
      try {
        return localStorage.getItem("cs_annot_author_default_label");
      } catch {
        return null;
      }
    },
    async saveAuthorDefaultLabelId(id) {
      try {
        if (id == null) localStorage.removeItem("cs_annot_author_default_label");
        else localStorage.setItem("cs_annot_author_default_label", id);
      } catch {
      }
    },
    async createLabel(input) {
      return request("POST", "/api/labels", input);
    },
    async updateLabel(id, patch) {
      return request("PATCH", `/api/labels/${encodeURIComponent(id)}`, patch);
    },
    async deleteLabel(id) {
      await request("DELETE", `/api/labels/${encodeURIComponent(id)}`);
    },
    async createPin(input) {
      return request("POST", "/api/pins", input);
    },
    async updatePin(id, patch) {
      return request("PATCH", `/api/pins/${encodeURIComponent(id)}`, patch);
    },
    async deletePin(id) {
      await request("DELETE", `/api/pins/${encodeURIComponent(id)}`);
    },
    async resolvePin(id, by) {
      return request("POST", `/api/pins/${encodeURIComponent(id)}/resolve`, { by });
    },
    async reopenPin(id) {
      return request("POST", `/api/pins/${encodeURIComponent(id)}/reopen`);
    },
    async addComment(pinId, author, text) {
      return request(
        "POST",
        `/api/pins/${encodeURIComponent(pinId)}/comments`,
        { author, text }
      );
    },
    async updateComment(commentId, text) {
      return request("PATCH", `/api/comments/${encodeURIComponent(commentId)}`, { text });
    },
    async deleteComment(commentId) {
      await request("DELETE", `/api/comments/${encodeURIComponent(commentId)}`);
    },
    // ── Sessions ─────────────────────────────────────────────
    async loadSessions() {
      return request("GET", "/api/sessions");
    },
    async createSession(name, options2) {
      return request("POST", "/api/sessions", { name, ...options2 });
    },
    async updateSession(id, patch) {
      return request("PATCH", `/api/sessions/${encodeURIComponent(id)}`, patch);
    },
    async deleteSession(id) {
      await request("DELETE", `/api/sessions/${encodeURIComponent(id)}`);
    },
    async loadCurrentSessionId() {
      try {
        return localStorage.getItem("cs_annot_current_session");
      } catch {
        return null;
      }
    },
    async saveCurrentSessionId(id) {
      try {
        if (id == null) localStorage.removeItem("cs_annot_current_session");
        else localStorage.setItem("cs_annot_current_session", id);
      } catch {
      }
    },
    async checkSdkVersion() {
      try {
        const res = await fetch(`${base}/api/sdk/version`, {
          headers: { Accept: "application/json" }
        });
        if (!res.ok) return { latest: null, minimum: null };
        const data = await res.json();
        return { latest: data.latest ?? null, minimum: data.minimum ?? null };
      } catch {
        return { latest: null, minimum: null };
      }
    }
  };
}

// src/whoami.ts
async function whoami(options) {
  const url = `${options.baseUrl.replace(/\/+$/, "")}/api/whoami`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${options.apiKey}`
    }
  });
  if (!res.ok) {
    throw new Error(`whoami failed: ${res.status}`);
  }
  return await res.json();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AnnotList,
  AnnotPanel,
  AnnotPin,
  AnnotationToolbar,
  AuthorModal,
  COLORS,
  DEFAULT_LABELS,
  FALLBACK_LABEL_COLOR,
  LABEL_COLOR_PRESETS,
  LabelManagerModal,
  SDK_VERSION,
  STORAGE_KEYS,
  SpecBridgeAnnotation,
  httpAdapter,
  localStorageAdapter,
  useAnnotations,
  useAuthor,
  useLabels,
  whoami
});
//# sourceMappingURL=index.cjs.map