"use client";
import { useState, useMemo } from "react";
import { usePanel } from "../../context/PanelContext";
import { useToastCtx } from "../../components/layout/Layout";
import KPI from "../../components/common/KPI";
import DataTable, { Column } from "../../components/common/DataTable";
import { Badge } from "../../components/common/Badge";
import { fmtD } from "../../components/common/helpers";
import { useLicenseSearch } from "../../lib/api/hooks/useLicenses";
import { OS_TYPE_MAP, parseDetectType } from "@/types";
import type { License, LicenseSearchParams } from "@/types";

const PAGE_SIZE = 10;

interface LicenseDetailPanelProps {
  lic: License;
  onClose: () => void;
}

function LicenseDetailPanel({ lic, onClose }: LicenseDetailPanelProps) {
  const toast = useToastCtx();
  const pct =
    lic.maxCount > 0 ? Math.round((lic.usedCount / lic.maxCount) * 100) : 0;
  const osName = OS_TYPE_MAP[lic.osType] || `OS ${lic.osType}`;
  const detectName = parseDetectType(lic.detectType);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="mod-h">
        <button className="cx" onClick={onClose}>
          ✕
        </button>
        <h2>
          {osName} · {detectName}
        </h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ marginBottom: 16 }}>
          <Badge cls="bdg-ok">활성</Badge>
        </div>
        <dl className="info-row">
          <dt>OS</dt>
          <dd>{osName}</dd>
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
              {lic.licenseKey}
            </span>
          </dd>
          <dt>수량</dt>
          <dd>{lic.maxCount}대</dd>
          <dt>사용 단말</dt>
          <dd>
            {lic.usedCount} / {lic.maxCount}대 ({pct}%)
          </dd>
          <dt>유효 시작</dt>
          <dd>{fmtD(lic.validFrom)}</dd>
          <dt>유효 종료</dt>
          <dd>{fmtD(lic.validUntil)}</dd>
        </dl>
        <div className="mt-12">
          <div className="progress-bar" style={{ height: 8 }}>
            <div
              className={`progress-fill ${pct > 90 ? "err" : pct > 70 ? "warn" : "ok"}`}
              style={{ width: pct + "%" }}
            />
          </div>
        </div>
        <div className="mt-16">
          <button
            className="btn btn-p btn-sm"
            onClick={() => toast("라이선스 갱신 문의를 접수했습니다.", "info")}
          >
            갱신 문의
          </button>
          <button
            className="btn btn-outline btn-sm"
            style={{ marginLeft: 8 }}
            onClick={() => toast("동기화 중...", "info")}
          >
            🔄 동기화
          </button>
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

export default function Licenses() {
  const { openPanel, closePanel } = usePanel();
  const toast = useToastCtx();

  const [search, setSearch] = useState("");
  const [osFilter, setOsFilter] = useState("");
  const [detectFilter, setDetectFilter] = useState("");
  const [page, setPage] = useState(0);

  const searchParams: LicenseSearchParams = useMemo(
    () => ({
      page,
      size: PAGE_SIZE,
    }),
    [page],
  );

  const { data, isLoading } = useLicenseSearch(searchParams);

  const licenses = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPage ?? 0;

  const totalCount = data?.totalCount ?? 0;
  const usedCount = data?.usedCount ?? 0;
  const usedPct =
    totalCount > 0 ? Math.round((usedCount / totalCount) * 100) : 0;
  const remaining = totalCount - usedCount;

  const filtered = licenses.filter((l) => {
    const osName = OS_TYPE_MAP[l.osType] || "";
    const detectName = parseDetectType(l.detectType);

    if (osFilter && osName !== osFilter) return false;
    if (detectFilter && detectName !== detectFilter) return false;

    const q = search.toLowerCase();
    if (
      q &&
      !osName.toLowerCase().includes(q) &&
      !l.licenseKey.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  const cols: Column<License & Record<string, unknown>>[] = useMemo(
    () => [
      {
        key: "osType",
        label: "OS",
        render: (v) => (
          <span style={{ fontWeight: 600, color: "var(--t1)" }}>
            {OS_TYPE_MAP[v as number] || `OS ${v}`}
          </span>
        ),
      },
      {
        key: "detectType",
        label: "탐지 항목",
        render: (v) => {
          const detectName = parseDetectType(v as string);
          const color =
            detectName === "선정성"
              ? "#ef4444"
              : detectName === "도박"
                ? "#f59e0b"
                : "#3b82f6";
          return (
            <span
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
              {detectName}
            </span>
          );
        },
      },
      {
        key: "maxCount",
        label: "수량",
        render: (v) => `${v}대`,
      },
      {
        key: "usedCount",
        label: "사용 단말",
        render: (v, r) => `${v} / ${r.maxCount}대`,
      },
      {
        key: "validFrom",
        label: "유효 기간",
        render: (v, r) =>
          `${fmtD(v as string)} ~ ${fmtD(r.validUntil as string)}`,
      },
      {
        key: "licenseId",
        label: "상태",
        render: () => <Badge cls="bdg-ok">활성</Badge>,
      },
    ],
    [],
  );

  const handleSearch = () => {
    setPage(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">라이선스</div>
          <div className="ph-sub">
            총 {meta?.totalCount ?? 0}개 라이선스 등록
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
        <KPI label="총 수량" value={totalCount} sub="등록된 전체 라이선스" />
        <KPI
          label="단말기 사용 중"
          value={usedCount}
          sub={`${usedPct}% 사용`}
          color={usedPct > 90 ? "err" : usedPct > 70 ? "warn" : "ok"}
        />
        <KPI label="잔여" value={remaining} sub="추가 등록 가능" color="ac" />
        <KPI
          label="라이선스 등록 수"
          value={meta?.totalCount ?? 0}
          sub="라이선스 항목"
        />
      </div>

      <div className="fb">
        <input
          className="inp search"
          placeholder="OS 또는 라이선스 키 검색..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="inp"
          style={{ maxWidth: 140 }}
          value={osFilter}
          onChange={(e) => {
            setOsFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">전체 OS</option>
          {Object.values(OS_TYPE_MAP).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <select
          className="inp"
          style={{ maxWidth: 140 }}
          value={detectFilter}
          onChange={(e) => {
            setDetectFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">전체 탐지</option>
          <option value="선정성">선정성</option>
          <option value="도박">도박</option>
          <option value="All-in-One">All-in-One</option>
        </select>
        <button className="btn btn-outline" onClick={handleSearch}>
          검색
        </button>
      </div>

      <DataTable
        cols={cols}
        rows={filtered as (License & Record<string, unknown>)[]}
        loading={isLoading}
        rowKey="licenseId"
        onRowClick={(row) =>
          openPanel(
            <LicenseDetailPanel lic={row as License} onClose={closePanel} />,
          )
        }
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
        }}
        emptyMessage="등록된 라이선스가 없습니다"
        emptyIcon="📜"
      />
    </div>
  );
}
