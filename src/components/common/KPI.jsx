'use client'
export default function KPI({ label, value, sub, color }) {
  return (
    <div className="kpi">
      <div className="kpi-l">{label}</div>
      <div className={`kpi-v${color ? ` ${color}` : ''}`}>{String(value)}</div>
      {sub && <div className="kpi-s">{sub}</div>}
    </div>
  );
}
