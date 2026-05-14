"use client";
import { useState } from "react";
import { usePanel } from "../../context/PanelContext";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { DetTypeBadge, Badge } from "../../components/common/Badge";
import { fmtDT } from "../../components/common/helpers";
import { OS_TYPE_MAP } from "../../lib/api/hooks/useDevices";
import { useDeviceDetections } from "../../lib/api/hooks/useDetections";
import { EVENT_TYPE_MAP } from "@/types/detection";
import type { DeviceApiResponse } from "@/types";

interface DeviceDetailPanelProps {
  readonly device: DeviceApiResponse;
}

const PAGE_SIZE = 10;

export default function DeviceDetailPanel({ device }: DeviceDetailPanelProps) {
  const { closePanel } = usePanel();
  const [activeTab, setActiveTab] = useState("info");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [detType, setDetType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);

  const { data: detectionsData, isLoading: detectionsLoading } = useDeviceDetections({
    deviceUuid: device.deviceUuid,
    eventType: detType ? Number(detType) : undefined,
    startDate: fromDate || undefined,
    endDate: toDate || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const tabs = [
    { id: "info", label: "기본정보" },
    { id: "history", label: "탐지이력" },
  ];

  const histCols = [
    { key: "eventTime", label: "탐지 시각", render: (v: string) => fmtDT(v) },
    {
      key: "eventType",
      label: "유형",
      render: (v: number) => <DetTypeBadge type={EVENT_TYPE_MAP[v] || "알 수 없음"} />,
    },
    {
      key: "eventUrl",
      label: "URL",
      render: (v: string) => (
        <span style={{ fontSize: 12, color: "#64748b", wordBreak: "break-all" }}>
          {v ? (v.length > 50 ? v.slice(0, 50) + "..." : v) : "—"}
        </span>
      ),
    },
  ];

  const handleFilterChange = () => {
    setCurrentPage(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="mod-h">
        <button className="cx" onClick={closePanel}>
          ✕
        </button>
        <h2>{device.deviceUuid}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: "auto" }}>
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              className={"tab" + (activeTab === t.id ? " a" : "")}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div style={{ marginTop: 16 }}>
            <dl className="info-row">
              <dt>식별자</dt>{" "}
              <dd>
                <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                  {device.deviceUuid}
                </span>
              </dd>
              <dt>모델</dt> <dd>{device.hardwareName || "—"}</dd>
              <dt>OS</dt> <dd>{OS_TYPE_MAP[device.osType] || "—"}</dd>
              <dt>상태</dt>{" "}
              <dd>
                {device.deviceStatus === 1 ? (
                  <Badge cls="bdg-ok">온라인</Badge>
                ) : (
                  <Badge cls="bdg-err">오프라인</Badge>
                )}
              </dd>
              <dt>최근 접속</dt> <dd>{fmtDT(device.lastLoginAt)}</dd>
            </dl>
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}
              >
                기간
              </span>
              <input
                className="inp"
                type="date"
                style={{ flex: 1 }}
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  handleFilterChange();
                }}
              />
              <span style={{ fontSize: 12, color: "#94a3b8" }}>~</span>
              <input
                className="inp"
                type="date"
                style={{ flex: 1 }}
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  handleFilterChange();
                }}
              />
              <select
                className="inp"
                style={{ maxWidth: 100 }}
                value={detType}
                onChange={(e) => {
                  setDetType(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">전체 유형</option>
                <option value="0">선정성</option>
                <option value="1">도박</option>
              </select>
            </div>
            {detectionsLoading ? (
              <div className="empty">
                <div className="empty-title">로딩 중...</div>
              </div>
            ) : (
              <>
                <Table cols={histCols} rows={detectionsData?.data || []} />
                {detectionsData && detectionsData.meta.totalPage > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={detectionsData.meta.totalPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="mod-f">
        <div>
          <button className="btn btn-outline" onClick={closePanel}>
            닫기
          </button>
        </div>
        <div />
      </div>
    </div>
  );
}
