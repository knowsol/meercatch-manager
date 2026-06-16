'use client'
import { useState } from 'react';
import { DUMMY } from '../../data/dummy';

/* ── SVG Line Chart ── */
function LineChart({ data }) {
  const W = 820, H = 160;
  const pad = { t: 20, r: 20, b: 30, l: 36 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const max = Math.max(...data.map(d => d.v), 1);
  const x = i => pad.l + (i / (data.length - 1)) * iW;
  const y = v => pad.t + iH - (v / max) * iH;
  const pts = data.map((d, i) => `${x(i)},${y(d.v)}`).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + iH} stroke="#e2e8f0" strokeWidth={1} />
      <line x1={pad.l} y1={pad.t + iH} x2={pad.l + iW} y2={pad.t + iH} stroke="#e2e8f0" strokeWidth={1} />
      <text x={pad.l - 4} y={pad.t + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{max}</text>
      <text x={pad.l - 4} y={pad.t + iH} textAnchor="end" fontSize={10} fill="#94a3b8">0</text>
      {data.map((d, i) => i % 2 === 0 && (
        <text key={i} x={x(i)} y={pad.t + iH + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">{d.label}</text>
      ))}
      <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth={2} />
      {data.map((d, i) => d.v > 0 && (
        <circle key={i} cx={x(i)} cy={y(d.v)} r={3} fill="#3b82f6" />
      ))}
    </svg>
  );
}

/* ── Stat boxes ── */
function Stats({ items }) {
  return (
    <div style={{ display: 'flex', background: '#f8fafc', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', marginTop: 12 }}>
      {items.map((it, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center', padding: '18px 8px', borderRight: i < items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{it.label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>
            {it.value} <span style={{ fontSize: 15, fontWeight: 400 }}>건</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Two-month group table ── */
function GroupTable({ title, prev, curr, rows, cols }) {
  // cols: [{key, label}]
  return (
    <div style={{ marginTop: 16 }}>
      {title && <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{title}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[{ label: prev, side: 'prev' }, { label: curr, side: 'curr' }].map(({ label, side }) => (
          <div key={side}>
            <div style={{ fontSize: 12, color: '#3b82f6', marginBottom: 6 }}>{label}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '6px 8px', color: '#94a3b8', fontWeight: 500, width: 28 }}></th>
                  <th style={{ padding: '6px 8px', color: '#94a3b8', fontWeight: 500, textAlign: 'left' }}>그룹</th>
                  {cols.map(c => (
                    <th key={c.key} style={{ padding: '6px 8px', color: '#94a3b8', fontWeight: 500, textAlign: 'center' }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px', color: '#94a3b8' }}>{i + 1}</td>
                    <td style={{ padding: '6px 8px' }}>{r.group || '-'}</td>
                    {cols.map(c => {
                      const val = r[side + '_' + c.key];
                      return (
                        <td key={c.key} style={{ padding: '6px 8px', textAlign: 'center', color: val > 0 ? '#ef4444' : '#94a3b8' }}>
                          {c.key === 'time' ? val + '분' : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section card ── */
function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '20px 24px', marginBottom: 16 }}>
      {title && <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  );
}

/* ── Data helpers ── */
function computeMonthData(detections, yearMonth) {
  // yearMonth: '2026-03'
  const filtered = detections.filter(d => d.detectedAt.startsWith(yearMonth));
  const byDay = {};
  filtered.forEach(d => {
    const day = parseInt(d.detectedAt.split('-')[2]);
    byDay[day] = (byDay[day] || 0) + 1;
  });
  return { filtered, byDay };
}

function topGroups(detections, n = 5) {
  const byGroup = {};
  detections.forEach(d => {
    if (!byGroup[d.groupName]) byGroup[d.groupName] = { det: 0, action: 0 };
    byGroup[d.groupName].det++;
    if (d.status === 'confirmed') byGroup[d.groupName].action++;
  });
  const sorted = Object.entries(byGroup).sort((a, b) => b[1].det - a[1].det).slice(0, n);
  while (sorted.length < n) sorted.push([null, { det: 0, action: 0 }]);
  return sorted;
}

/* ── Main ── */
export default function ReportView() {
  const [school, setSchool] = useState('전체');

  const dets = DUMMY.detections;
  const PREV = '2026-02';
  const CURR = '2026-03';
  const prevLabel = '2026년 2월';
  const currLabel = '2026년 3월';

  const { filtered: prevAll } = computeMonthData(dets, PREV);
  const { filtered: currAll, byDay: currByDay } = computeMonthData(dets, CURR);

  // Chart: days 1~31 for current month
  const chartData = Array.from({ length: 17 }, (_, i) => ({
    label: `${i + 1}일`, v: currByDay[i + 1] || 0,
  }));

  // All stats
  const prevSexual = prevAll.filter(d => d.type === '선정성').length;
  const prevGamble = prevAll.filter(d => d.type === '도박').length;
  const currSexual = currAll.filter(d => d.type === '선정성').length;
  const currGamble = currAll.filter(d => d.type === '도박').length;

  // Grade stats
  const gradeCount = (arr, g) => arr.filter(d => d.grade === g).length;

  // Group rows for all/sexual/gamble
  function buildGroupRows(arr, prevArr) {
    const currGroups = topGroups(arr);
    const prevGroups = topGroups(prevArr);
    return currGroups.map(([grp, cData], i) => {
      const [pGrp, pData] = prevGroups[i] || [null, { det: 0, action: 0 }];
      return {
        group: grp || pGrp,
        prev_det: pData.det,
        prev_action: pData.action,
        curr_det: cData.det,
        curr_action: cData.action,
      };
    });
  }

  const allRows     = buildGroupRows(currAll, prevAll);
  const sexualRows  = buildGroupRows(currAll.filter(d => d.type === '선정성'), prevAll.filter(d => d.type === '선정성'));
  const gambleRows  = buildGroupRows(currAll.filter(d => d.type === '도박'), prevAll.filter(d => d.type === '도박'));

  // Pause rows
  const pauseGroups = DUMMY.groups.slice(0, 5).map((g, i) => {
    const sch = DUMMY.schools.find(s => s.schoolId === g.schoolId);
    return {
      group: sch ? sch.name : g.name,
      prev_cnt: 0, prev_time: 0,
      curr_cnt: DUMMY.pauses.filter(p => p.groupId === g.groupId && p.startAt.startsWith(CURR)).length,
      curr_time: 0,
    };
  });

  const detCols = [{ key: 'det', label: '탐지' }, { key: 'action', label: '조치' }];
  const pauseCols = [{ key: 'cnt', label: '횟수' }, { key: 'time', label: '시간' }];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">보고서</div>
        </div>
      </div>

      {/* 학교/교육청 선택 + PDF */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 20px', marginBottom: 16 }}>
        <select className="inp" style={{ maxWidth: 220, fontWeight: 600 }} value={school} onChange={e => setSchool(e.target.value)}>
          <option value="전체">전체</option>
          {DUMMY.schools.map(s => <option key={s.schoolId} value={s.name}>{s.name}</option>)}
        </select>
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          PDF 내보내기
        </button>
      </div>

      {/* 전체 */}
      <Section title="전체">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>탐지 현황 그래프</div>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '12px 8px' }}>
          <LineChart data={chartData} />
        </div>
        <Stats items={[
          { label: '전체탐지', value: currAll.length },
          { label: '선정성탐지', value: currSexual },
          { label: '도박탐지', value: currGamble },
        ]} />
        <GroupTable title="탐지현황 - 그룹별" prev={prevLabel} curr={currLabel} rows={allRows} cols={detCols} />
      </Section>

      {/* 선정성 */}
      <Section title="선정성">
        <Stats items={[
          { label: '선정성탐지', value: currSexual },
          { label: '유해등급 상', value: gradeCount(currAll.filter(d => d.type === '선정성'), '상') },
          { label: '유해등급 중', value: gradeCount(currAll.filter(d => d.type === '선정성'), '중') },
          { label: '유해등급 하', value: gradeCount(currAll.filter(d => d.type === '선정성'), '하') },
        ]} />
        <GroupTable title="탐지현황 - 그룹별" prev={prevLabel} curr={currLabel} rows={sexualRows} cols={detCols} />
      </Section>

      {/* 도박 */}
      <Section title="도박">
        <Stats items={[
          { label: '도박탐지', value: currGamble },
          { label: '유해등급 상', value: gradeCount(currAll.filter(d => d.type === '도박'), '상') },
          { label: '유해등급 중', value: gradeCount(currAll.filter(d => d.type === '도박'), '중') },
          { label: '유해등급 하', value: gradeCount(currAll.filter(d => d.type === '도박'), '하') },
        ]} />
        <GroupTable title="탐지현황 - 그룹별" prev={prevLabel} curr={currLabel} rows={gambleRows} cols={detCols} />
      </Section>

      {/* 기타 */}
      <Section title="기타">
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>탐지제어</div>
        <GroupTable prev={prevLabel} curr={currLabel} rows={pauseGroups} cols={pauseCols} />
      </Section>
    </div>
  );
}
