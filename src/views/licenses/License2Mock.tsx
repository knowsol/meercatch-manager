"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { usePanel } from "../../context/PanelContext";
import { useToastCtx } from "../../components/layout/Layout";
import Kpi from "../../components/common/KPI";
import Pagination from "../../components/common/Pagination";
import { Badge } from "../../components/common/Badge";
import { fmtD } from "../../components/common/helpers";
import { OS_TYPE_MAP, parseDetectType, parseDetectTypeFlags } from "@/types";

/** 한 사업(년도-벤더-차수) 아래 OS별 라이선스 한 줄 */
export interface License2OsLine {
  lineId: string;
  osType: number;
  detectType: string;
  maxCount: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  licenseKey: string;
}

export type License2Vendor = "KT" | "LG";

/** 사업 단위 그룹 (테이블에서 부모 행 + OS별 자식 행) */
export interface License2Group {
  groupId: number;
  businessYear: number;
  businessVendor: License2Vendor;
  businessRound: number;
  /** 예: 2026-KT-1 */
  businessName: string;
  lines: License2OsLine[];
}

function groupName(y: number, v: License2Vendor, r: number) {
  return `${y}-${v}-${r}`;
}

function compareGroups(a: License2Group, b: License2Group): number {
  if (b.businessYear !== a.businessYear) {
    return b.businessYear - a.businessYear;
  }
  if (a.businessVendor !== b.businessVendor) {
    return a.businessVendor.localeCompare(b.businessVendor);
  }
  return a.businessRound - b.businessRound;
}

function OsGlyph({ osType }: { osType: number }) {
  const label = OS_TYPE_MAP[osType] || `OS ${osType}`;
  const wrap = (node: ReactNode) => (
    <span
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: 6,
        background: "var(--bg3)",
        border: "1px solid var(--bd)",
        flexShrink: 0,
      }}
    >
      {node}
    </span>
  );

  switch (osType) {
    case 1:
      return wrap(
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#3DDC84"
            d="M9 3c0-.55.45-1 1-1s1 .45 1 1v1h2V3c0-.55.45-1 1-1s1 .45 1 1v1.07C17.94 5.58 20 8.62 20 12v7H4v-7c0-3.38 2.06-6.42 5-7.93V3zm-2 9.5c-.83 0-1.5.67-1.5 1.5S6.17 15.5 7 15.5 8.5 14.83 8.5 14 7.83 12.5 7 12.5zm10 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"
          />
        </svg>,
      );
    case 2:
      return wrap(
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="none"
            stroke="#555"
            strokeWidth="2"
            d="M12 3c-4 0-7 3.5-7 8.5C5 17 7 20 12 20s7-3 7-8.5C19 6.5 16 3 12 3z"
          />
          <path
            fill="none"
            stroke="#555"
            strokeWidth="1.5"
            d="M9 19c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5"
          />
        </svg>,
      );
    case 3:
      return wrap(
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#0ea5e9"
            d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h5v2H8v-2z"
          />
        </svg>,
      );
    case 4:
      return wrap(
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
          <rect x="3" y="4" width="18" height="12" rx="2" fill="#4285F4" />
          <path d="M8 20h8v2H8z" fill="#94a3b8" />
          <circle cx="8" cy="10" r="1.5" fill="#fff" />
          <circle cx="12" cy="10" r="1.5" fill="#FBBC04" />
          <circle cx="16" cy="10" r="1.5" fill="#34A853" />
        </svg>,
      );
    case 5:
      return wrap(
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#0078D4"
            d="M3 3h9v9H3V3zm9 0h9v9h-9V3zM3 12h9v9H3v-9zm9 0h9v9h-9v-9z"
          />
        </svg>,
      );
    default:
      return wrap(
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)" }}>
          ?
        </span>,
      );
  }
}

/** 사업에 포함된 OS를 라인 순서대로(아이콘 나열용) */
function groupOsTypesInLineOrder(g: License2Group): number[] {
  return g.lines.map((ln) => ln.osType);
}

/** 트리 펼침 토글 — 우측 셰브론, 펼침 시 90° 회전 */
function TreeExpandChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "block",
      }}
      aria-hidden
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function OsIconRow({ osTypes }: { osTypes: number[] }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        flexWrap: "wrap",
      }}
    >
      {osTypes.map((t) => (
        <OsGlyph key={t} osType={t} />
      ))}
    </span>
  );
}

function renderDetectPills(detectType: string) {
  const f = parseDetectTypeFlags(detectType);
  const pill = (label: string, color: string) => (
    <span
      key={label}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        background: color + "18",
        color,
      }}
    >
      {label}
    </span>
  );
  if (!f.adult && !f.gambling) {
    return pill("알 수 없음", "#64748b");
  }
  return (
    <span
      style={{
        display: "inline-flex",
        gap: 6,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {f.adult ? pill("선정성", "#ef4444") : null}
      {f.gambling ? pill("도박", "#f59e0b") : null}
    </span>
  );
}

const GROUPS_PER_PAGE = 3;

const LICENSE2_GROUPS: License2Group[] = [
  {
    groupId: 1,
    businessYear: 2026,
    businessVendor: "KT",
    businessRound: 1,
    businessName: groupName(2026, "KT", 1),
    lines: [
      {
        lineId: "1-1",
        osType: 1,
        detectType: "11000000",
        maxCount: 2100,
        usedCount: 1890,
        validFrom: "2025-01-01",
        validUntil: "2026-12-31",
        licenseKey: "MC-2026-KT-01-A",
      },
      {
        lineId: "1-2",
        osType: 2,
        detectType: "10000000",
        maxCount: 980,
        usedCount: 720,
        validFrom: "2025-02-10",
        validUntil: "2026-06-30",
        licenseKey: "MC-2026-KT-01-I",
      },
      {
        lineId: "1-3",
        osType: 3,
        detectType: "01000000",
        maxCount: 640,
        usedCount: 112,
        validFrom: "2025-03-01",
        validUntil: "2027-02-28",
        licenseKey: "MC-2026-KT-01-W",
      },
      {
        lineId: "1-4",
        osType: 4,
        detectType: "11000000",
        maxCount: 880,
        usedCount: 801,
        validFrom: "2024-11-01",
        validUntil: "2026-05-31",
        licenseKey: "MC-2026-KT-01-C",
      },
      {
        lineId: "1-5",
        osType: 5,
        detectType: "10000000",
        maxCount: 400,
        usedCount: 298,
        validFrom: "2025-06-15",
        validUntil: "2026-11-15",
        licenseKey: "MC-2026-KT-01-P",
      },
    ],
  },
  {
    groupId: 2,
    businessYear: 2026,
    businessVendor: "KT",
    businessRound: 2,
    businessName: groupName(2026, "KT", 2),
    lines: [
      {
        lineId: "2-1",
        osType: 1,
        detectType: "10000000",
        maxCount: 520,
        usedCount: 410,
        validFrom: "2025-03-15",
        validUntil: "2026-03-14",
        licenseKey: "MC-2026-KT-02-A",
      },
      {
        lineId: "2-2",
        osType: 2,
        detectType: "11000000",
        maxCount: 280,
        usedCount: 202,
        validFrom: "2025-04-01",
        validUntil: "2026-08-31",
        licenseKey: "MC-2026-KT-02-I",
      },
    ],
  },
  {
    groupId: 3,
    businessYear: 2026,
    businessVendor: "KT",
    businessRound: 3,
    businessName: groupName(2026, "KT", 3),
    lines: [
      {
        lineId: "3-2",
        osType: 2,
        detectType: "01000000",
        maxCount: 220,
        usedCount: 88,
        validFrom: "2025-09-01",
        validUntil: "2026-08-31",
        licenseKey: "MC-2026-KT-03-I",
      },
      {
        lineId: "3-5",
        osType: 5,
        detectType: "11000000",
        maxCount: 380,
        usedCount: 113,
        validFrom: "2025-10-01",
        validUntil: "2027-09-30",
        licenseKey: "MC-2026-KT-03-P",
      },
    ],
  },
  {
    groupId: 4,
    businessYear: 2026,
    businessVendor: "LG",
    businessRound: 1,
    businessName: groupName(2026, "LG", 1),
    lines: [
      {
        lineId: "4-4",
        osType: 4,
        detectType: "11000000",
        maxCount: 320,
        usedCount: 298,
        validFrom: "2024-09-01",
        validUntil: "2025-08-31",
        licenseKey: "MC-2026-LG-01-C",
      },
    ],
  },
  {
    groupId: 5,
    businessYear: 2026,
    businessVendor: "LG",
    businessRound: 2,
    businessName: groupName(2026, "LG", 2),
    lines: [
      {
        lineId: "5-4",
        osType: 4,
        detectType: "10000000",
        maxCount: 540,
        usedCount: 520,
        validFrom: "2025-01-10",
        validUntil: "2026-01-09",
        licenseKey: "MC-2026-LG-02-C",
      },
    ],
  },
  {
    groupId: 6,
    businessYear: 2025,
    businessVendor: "KT",
    businessRound: 1,
    businessName: groupName(2025, "KT", 1),
    lines: [
      {
        lineId: "6-3",
        osType: 3,
        detectType: "01000000",
        maxCount: 720,
        usedCount: 310,
        validFrom: "2025-06-01",
        validUntil: "2027-05-31",
        licenseKey: "MC-2025-KT-01-W",
      },
      {
        lineId: "6-5",
        osType: 5,
        detectType: "10000000",
        maxCount: 480,
        usedCount: 135,
        validFrom: "2025-07-01",
        validUntil: "2026-12-31",
        licenseKey: "MC-2025-KT-01-P",
      },
    ],
  },
  {
    groupId: 7,
    businessYear: 2025,
    businessVendor: "KT",
    businessRound: 2,
    businessName: groupName(2025, "KT", 2),
    lines: [
      {
        lineId: "7-4",
        osType: 4,
        detectType: "11000000",
        maxCount: 120,
        usedCount: 45,
        validFrom: "2025-07-01",
        validUntil: "2026-06-30",
        licenseKey: "MC-2025-KT-02-C",
      },
      {
        lineId: "7-5",
        osType: 5,
        detectType: "01000000",
        maxCount: 90,
        usedCount: 42,
        validFrom: "2025-08-01",
        validUntil: "2026-07-31",
        licenseKey: "MC-2025-KT-02-P",
      },
    ],
  },
  {
    groupId: 8,
    businessYear: 2025,
    businessVendor: "LG",
    businessRound: 1,
    businessName: groupName(2025, "LG", 1),
    lines: [
      {
        lineId: "8-1",
        osType: 1,
        detectType: "11000000",
        maxCount: 90,
        usedCount: 88,
        validFrom: "2025-02-01",
        validUntil: "2026-01-31",
        licenseKey: "MC-2025-LG-01-A",
      },
      {
        lineId: "8-4",
        osType: 4,
        detectType: "10000000",
        maxCount: 60,
        usedCount: 53,
        validFrom: "2025-03-01",
        validUntil: "2026-02-28",
        licenseKey: "MC-2025-LG-01-C",
      },
    ],
  },
  {
    groupId: 9,
    businessYear: 2024,
    businessVendor: "LG",
    businessRound: 2,
    businessName: groupName(2024, "LG", 2),
    lines: [
      {
        lineId: "9-2",
        osType: 2,
        detectType: "10000000",
        maxCount: 400,
        usedCount: 120,
        validFrom: "2024-01-01",
        validUntil: "2025-06-30",
        licenseKey: "MC-2024-LG-02-I",
      },
      {
        lineId: "9-5",
        osType: 5,
        detectType: "11000000",
        maxCount: 200,
        usedCount: 81,
        validFrom: "2024-03-01",
        validUntil: "2025-12-31",
        licenseKey: "MC-2024-LG-02-P",
      },
    ],
  },
];

function aggregateTotals(groups: License2Group[]) {
  let totalQty = 0;
  let totalUsed = 0;
  for (const g of groups) {
    for (const ln of g.lines) {
      totalQty += ln.maxCount;
      totalUsed += ln.usedCount;
    }
  }
  return { totalQty, totalUsed };
}

interface License2LineDetailPanelProps {
  group: License2Group;
  line: License2OsLine;
  onClose: () => void;
}

function License2LineDetailPanel({
  group,
  line,
  onClose,
}: License2LineDetailPanelProps) {
  const toast = useToastCtx();
  const pct =
    line.maxCount > 0
      ? Math.round((line.usedCount / line.maxCount) * 100)
      : 0;
  const detectName = parseDetectType(line.detectType);
  const osName = OS_TYPE_MAP[line.osType] || `OS ${line.osType}`;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast("이메일이 복사되었습니다.", "ok");
  };

  let progressTone: "err" | "warn" | "ok" = "ok";
  if (pct > 90) progressTone = "err";
  else if (pct > 70) progressTone = "warn";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="mod-h">
        <button className="cx" onClick={onClose}>
          ✕
        </button>
        <h2>
          {group.businessName} · {osName}
        </h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <Badge cls="bdg-ok">활성</Badge>
        </div>
        <dl className="info-row">
          <dt>사업명</dt>
          <dd style={{ fontWeight: 600 }}>{group.businessName}</dd>
          <dt>OS</dt>
          <dd>
            <OsGlyph osType={line.osType} />{" "}
            <span style={{ marginLeft: 8 }}>{osName}</span>
          </dd>
          <dt>탐지 항목</dt>
          <dd>{detectName}</dd>
          <dt>라이선스 키</dt>
          <dd>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "var(--t2)",
              }}
            >
              {line.licenseKey}
            </span>
          </dd>
          <dt>수량</dt>
          <dd>{line.maxCount}대</dd>
          <dt>사용 단말</dt>
          <dd>
            {line.usedCount} / {line.maxCount}대 ({pct}%)
          </dd>
          <dt>유효 시작</dt>
          <dd>{fmtD(line.validFrom)}</dd>
          <dt>유효 종료</dt>
          <dd>{fmtD(line.validUntil)}</dd>
        </dl>
        <div className="mt-12">
          <div className="progress-bar" style={{ height: 8 }}>
            <div
              className={`progress-fill ${progressTone}`}
              style={{ width: pct + "%" }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: "1px solid var(--bd)",
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--t1)",
              marginBottom: 16,
            }}
          >
            갱신 문의
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, color: "var(--ac)" }}>
              partners@knowwheresoft.com
            </span>
            <button
              type="button"
              onClick={() => handleCopyEmail("partners@knowwheresoft.com")}
              style={{
                padding: "4px 10px",
                fontSize: 12,
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                borderRadius: 4,
                color: "var(--t2)",
                cursor: "pointer",
              }}
            >
              복사
            </button>
          </div>
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

interface License2GroupDetailPanelProps {
  group: License2Group;
  onClose: () => void;
}

function License2GroupDetailPanel({
  group,
  onClose,
}: License2GroupDetailPanelProps) {
  const toast = useToastCtx();
  const { totalQty, totalUsed } = aggregateTotals([group]);
  const pct =
    totalQty > 0 ? Math.round((totalUsed / totalQty) * 100) : 0;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast("이메일이 복사되었습니다.", "ok");
  };

  let progressTone: "err" | "warn" | "ok" = "ok";
  if (pct > 90) progressTone = "err";
  else if (pct > 70) progressTone = "warn";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="mod-h">
        <button className="cx" onClick={onClose}>
          ✕
        </button>
        <h2>{group.businessName}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <Badge cls="bdg-ok">활성</Badge>
        </div>
        <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 16 }}>
          OS별 라이선스 {group.lines.length}건이 등록되어 있습니다. 아래 표에서
          항목을 확인하세요.
        </p>
        <dl className="info-row">
          <dt>사업명</dt>
          <dd style={{ fontWeight: 600 }}>{group.businessName}</dd>
          <dt>합산 수량</dt>
          <dd>{totalQty}대</dd>
          <dt>합산 사용</dt>
          <dd>
            {totalUsed}대 ({pct}%)
          </dd>
        </dl>
        <div className="mt-12">
          <div className="progress-bar" style={{ height: 8 }}>
            <div
              className={`progress-fill ${progressTone}`}
              style={{ width: pct + "%" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--t1)",
              marginBottom: 10,
            }}
          >
            OS별 요약
          </h3>
          <table
            style={{
              width: "100%",
              fontSize: 12,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ color: "var(--t3)", textAlign: "left" }}>
                <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--bd)" }}>
                  OS
                </th>
                <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--bd)" }}>
                  키
                </th>
                <th style={{ padding: "6px 8px", borderBottom: "1px solid var(--bd)" }}>
                  사용
                </th>
              </tr>
            </thead>
            <tbody>
              {group.lines.map((ln) => (
                <tr key={ln.lineId}>
                  <td style={{ padding: "8px", borderBottom: "1px solid var(--bd)" }}>
                    {OS_TYPE_MAP[ln.osType] || ln.osType}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid var(--bd)",
                      fontFamily: "monospace",
                      color: "var(--t2)",
                    }}
                  >
                    {ln.licenseKey}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid var(--bd)" }}>
                    {ln.usedCount}/{ln.maxCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: "1px solid var(--bd)",
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--t1)",
              marginBottom: 16,
            }}
          >
            갱신 문의
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, color: "var(--ac)" }}>
              partners@knowwheresoft.com
            </span>
            <button
              type="button"
              onClick={() => handleCopyEmail("partners@knowwheresoft.com")}
              style={{
                padding: "4px 10px",
                fontSize: 12,
                background: "var(--bg3)",
                border: "1px solid var(--bd)",
                borderRadius: 4,
                color: "var(--t2)",
                cursor: "pointer",
              }}
            >
              복사
            </button>
          </div>
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function License2Mock() {
  const { openPanel, closePanel } = usePanel();
  const toast = useToastCtx();

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [roundFilter, setRoundFilter] = useState("");
  const [page, setPage] = useState(0);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<number>>(
    () => new Set(),
  );

  const allGroups = LICENSE2_GROUPS;

  const yearOptions = useMemo(() => {
    const ys = [...new Set(allGroups.map((g) => g.businessYear))];
    ys.sort((a, b) => b - a);
    return ys;
  }, [allGroups]);

  const roundOptionsForYear = useMemo(() => {
    if (!yearFilter) return [];
    const y = Number(yearFilter);
    const rs = [
      ...new Set(
        allGroups
          .filter((g) => g.businessYear === y)
          .map((g) => g.businessRound),
      ),
    ];
    rs.sort((a, b) => a - b);
    return rs;
  }, [allGroups, yearFilter]);

  const { totalQty, totalUsed } = useMemo(
    () => aggregateTotals(allGroups),
    [allGroups],
  );
  const usedPct =
    totalQty > 0 ? Math.round((totalUsed / totalQty) * 100) : 0;
  const remaining = totalQty - totalUsed;

  const filteredGroups = useMemo(() => {
    const yf = yearFilter ? Number(yearFilter) : null;
    const rf = roundFilter ? Number(roundFilter) : null;
    const q = search.toLowerCase();

    const list = allGroups.filter((g) => {
      if (yf !== null && g.businessYear !== yf) return false;
      if (rf !== null && g.businessRound !== rf) return false;
      if (q) {
        const inName = g.businessName.toLowerCase().includes(q);
        const inKeys = g.lines.some((ln) =>
          ln.licenseKey.toLowerCase().includes(q),
        );
        if (!inName && !inKeys) return false;
      }
      return true;
    });
    list.sort(compareGroups);
    return list;
  }, [allGroups, yearFilter, roundFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGroups.length / GROUPS_PER_PAGE),
  );

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const pageGroups = useMemo(() => {
    const start = page * GROUPS_PER_PAGE;
    return filteredGroups.slice(start, start + GROUPS_PER_PAGE);
  }, [filteredGroups, page]);

  const toggleGroupExpanded = (groupId: number) => {
    setExpandedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const handleSearch = () => {
    setPage(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  let kpiColor: "err" | "warn" | "ok" | undefined = "ok";
  if (usedPct > 90) kpiColor = "err";
  else if (usedPct > 70) kpiColor = "warn";

  const cellCenter = {
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
  };

  const cellLeft = {
    textAlign: "left" as const,
    verticalAlign: "middle" as const,
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">라이선스</div>
          <div className="ph-sub">
            총 {allGroups.length}개 사업 · OS 라이선스{" "}
            {allGroups.reduce((n, g) => n + g.lines.length, 0)}건
          </div>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-p"
            onClick={() =>
              toast("라이선스 등록은 관리자에게 문의하세요.", "info")
            }
          >
            + 라이선스 등록
          </button>
        </div>
      </div>

      <div className="grid-4 section-gap">
        <Kpi label="총 수량" value={totalQty} sub="등록된 전체 라이선스" />
        <Kpi
          label="단말기 사용 중"
          value={totalUsed}
          sub={`${usedPct}% 사용`}
          color={kpiColor}
        />
        <Kpi label="잔여" value={remaining} sub="추가 등록 가능" color="ac" />
        <Kpi
          label="사업 수"
          value={allGroups.length}
          sub="년도·벤더·차수 단위"
        />
      </div>

      <div className="fb" style={{ flexWrap: "wrap", gap: 10 }}>
        <input
          className="inp search"
          placeholder="사업명 또는 라이선스 키 검색..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          id="license2-filter-year"
          className="inp"
          style={{ maxWidth: 140 }}
          value={yearFilter}
          onChange={(e) => {
            setYearFilter(e.target.value);
            setRoundFilter("");
            setPage(0);
          }}
        >
          <option value="">전체 년도</option>
          {yearOptions.map((y) => (
            <option key={y} value={String(y)}>
              {y}년
            </option>
          ))}
        </select>
        <select
          id="license2-filter-round"
          className="inp"
          style={{ maxWidth: 160 }}
          value={roundFilter}
          disabled={!yearFilter}
          aria-disabled={!yearFilter}
          onChange={(e) => {
            setRoundFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">
            {yearFilter ? "전체 차수" : "년도를 선택하세요"}
          </option>
          {roundOptionsForYear.map((r) => (
            <option key={r} value={String(r)}>
              {r}차
            </option>
          ))}
        </select>
        <button className="btn btn-outline" onClick={handleSearch}>
          검색
        </button>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="dt-wrap">
          <div className="empty">
            <div className="empty-icon">📜</div>
            <div className="empty-title">조건에 맞는 라이선스가 없습니다</div>
          </div>
        </div>
      ) : (
        <>
          <div className="dt-wrap">
            <table className="dt">
              <thead>
                <tr>
                  <th style={{ ...cellLeft }}>사업명</th>
                  <th style={{ ...cellCenter }}>OS</th>
                  <th style={{ ...cellCenter }}>탐지 항목</th>
                  <th style={{ ...cellCenter }}>수량</th>
                  <th style={{ ...cellCenter }}>사용 단말</th>
                  <th style={{ ...cellCenter }}>유효 기간</th>
                  <th style={{ ...cellCenter }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {pageGroups.map((g) => {
                  const isExpanded = expandedGroupIds.has(g.groupId);
                  return (
                  <Fragment key={g.groupId}>
                    <tr style={{ background: "var(--bg2)" }}>
                      <td style={cellLeft}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <button
                            type="button"
                            className="l2-tree-toggle"
                            aria-expanded={isExpanded}
                            aria-controls={`license2-os-lines-${g.groupId}`}
                            id={`license2-toggle-${g.groupId}`}
                            title={
                              isExpanded
                                ? "OS별 상세 접기"
                                : "OS별 상세 펼치기"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGroupExpanded(g.groupId);
                            }}
                          >
                            <TreeExpandChevron expanded={isExpanded} />
                          </button>
                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                              textAlign: "left",
                            }}
                          >
                            <span
                              style={{ fontWeight: 700, color: "var(--t1)" }}
                            >
                              {g.businessName}
                            </span>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--t3)",
                                marginTop: 4,
                                fontWeight: 500,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span>OS {g.lines.length}건</span>
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{
                                  padding: "2px 8px",
                                  fontSize: 11,
                                  minHeight: 0,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPanel(
                                    <License2GroupDetailPanel
                                      group={g}
                                      onClose={closePanel}
                                    />,
                                  );
                                }}
                              >
                                사업 상세
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={cellCenter}>
                        {isExpanded ? (
                          "—"
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              minHeight: 28,
                              flexWrap: "wrap",
                              gap: 4,
                            }}
                          >
                            <OsIconRow osTypes={groupOsTypesInLineOrder(g)} />
                          </div>
                        )}
                      </td>
                      <td style={cellCenter}>—</td>
                      <td style={cellCenter}>—</td>
                      <td style={cellCenter}>—</td>
                      <td style={cellCenter}>—</td>
                      <td style={cellCenter}>—</td>
                      <td style={cellCenter}>
                        <Badge cls="bdg-ok">활성</Badge>
                      </td>
                    </tr>
                    {isExpanded ? (
                      <Fragment key={`${g.groupId}-lines`}>
                    {g.lines.map((ln) => (
                      <tr
                        key={ln.lineId}
                        id={
                          g.lines[0]?.lineId === ln.lineId
                            ? `license2-os-lines-${g.groupId}`
                            : undefined
                        }
                        className="clickable"
                        onClick={() =>
                          openPanel(
                            <License2LineDetailPanel
                              group={g}
                              line={ln}
                              onClose={closePanel}
                            />,
                          )
                        }
                      >
                        <td style={cellLeft}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              paddingLeft: 18,
                            }}
                          >
                            <span
                              style={{
                                color: "var(--t3)",
                                fontSize: 13,
                                flexShrink: 0,
                              }}
                              aria-hidden
                            >
                              └
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--t2)",
                                fontWeight: 500,
                              }}
                            >
                              {OS_TYPE_MAP[ln.osType] || `OS ${ln.osType}`}
                            </span>
                          </div>
                        </td>
                        <td style={cellCenter}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              minHeight: 28,
                            }}
                          >
                            <OsGlyph osType={ln.osType} />
                          </div>
                        </td>
                        <td style={cellCenter}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              minHeight: 28,
                              flexWrap: "wrap",
                              gap: 4,
                            }}
                          >
                            {renderDetectPills(ln.detectType)}
                          </div>
                        </td>
                        <td style={cellCenter}>{ln.maxCount}대</td>
                        <td style={cellCenter}>
                          {ln.usedCount} / {ln.maxCount}대
                        </td>
                        <td style={cellCenter}>
                          {fmtD(ln.validFrom)} ~ {fmtD(ln.validUntil)}
                        </td>
                        <td style={cellCenter}>
                          <Badge cls="bdg-ok">활성</Badge>
                        </td>
                      </tr>
                    ))}
                      </Fragment>
                    ) : null}
                  </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
