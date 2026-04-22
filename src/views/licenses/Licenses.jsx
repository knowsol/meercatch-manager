'use client'
import { useState, useEffect } from 'react';
import Pagination from '../../components/common/Pagination';
import { usePanel } from '../../context/PanelContext';
import { useToastCtx } from '../../components/layout/Layout';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { fmtD, fmtDT } from '../../components/common/helpers';
import { DUMMY } from '../../data/dummy';

function LicenseDetailPanel({ lic, onClose }) {
  const toast = useToastCtx();
  const pct = Math.round((lic.usedDevices / lic.devices) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mod-h">
        <button className="cx" onClick={onClose}>✕</button>
        <h2>{lic.os} · {lic.detectionType}</h2>
      </div>
      <div className="mod-b" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: 16 }}>
          {lic.status === 'active'
            ? <Badge cls="bdg-ok">활성</Badge>
            : <Badge cls="bdg-err">만료</Badge>
          }
        </div>
        <dl className="info-row">
          <dt>학교명</dt>        <dd>{lic.school}</dd>
          <dt>라이선스 유형</dt> <dd>{lic.type}</dd>
          <dt>OS</dt>            <dd>{lic.os}</dd>
          <dt>탐지 항목</dt>     <dd>{lic.detectionType}</dd>
          <dt>시리얼 키</dt>     <dd><span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--t2)' }}>{lic.serialKey}</span></dd>
          <dt>수량</dt>          <dd>{lic.devices}대</dd>
          <dt>사용 단말</dt>     <dd>{lic.usedDevices} / {lic.devices}대 ({pct}%)</dd>
          <dt>유효 시작</dt>     <dd>{fmtD(lic.validFrom)}</dd>
          <dt>유효 종료</dt>     <dd>{fmtD(lic.validTo)}</dd>
          <dt>최근 동기화</dt>   <dd>{fmtDT(lic.lastSync)}</dd>
        </dl>
        <div className="mt-12">
          <div className="progress-bar" style={{ height: 8 }}>
            <div
              className={`progress-fill ${pct > 90 ? 'err' : pct > 70 ? 'warn' : 'ok'}`}
              style={{ width: pct + '%' }}
            />
          </div>
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--bd)' }}>
          <div className="card-title">지원 정보</div>
          <dl className="info-row">
            <dt>담당자</dt>   <dd>{lic.manager}</dd>
            <dt>이메일</dt>   <dd><a href={`mailto:${lic.supportContact}`}>{lic.supportContact}</a></dd>
            <dt>전화번호</dt> <dd>{lic.supportTel}</dd>
          </dl>
        </div>
        <div className="mt-16" style={{ paddingTop: 16, borderTop: '1px solid var(--bd)' }}>
          <div className="card-title" style={{ marginBottom: 6 }}>갱신 문의</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="mailto:partners@knowwheresoft.com" style={{ fontSize: 13, color: 'var(--ac)' }}>
              partners@knowwheresoft.com
            </a>
            <button
              className="btn btn-outline btn-sm"
              style={{ padding: '1px 8px', fontSize: 11, height: 'auto', lineHeight: 1.6 }}
              onClick={() => { navigator.clipboard.writeText('partners@knowwheresoft.com'); toast('이메일이 복사되었습니다.', 'info'); }}
            >복사</button>
          </div>
        </div>
      </div>
      <div className="mod-f">
        <div />
        <div className="mod-f-right">
          <button className="btn btn-outline" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default function Licenses() {
  const { openPanel, closePanel } = usePanel();
  const toast = useToastCtx();
  const [search, setSearch] = useState('');
  const [osFilter, setOsFilter] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [search, osFilter]);

  const lics = DUMMY.licenses;
  const totDevices = DUMMY.licensesTotal;
  const totUsed    = DUMMY.licensesUsed;
  const totPct     = Math.round((totUsed / totDevices) * 100);
  const remaining  = totDevices - totUsed;

  const filtered = lics.filter(l => {
    if (osFilter && l.os !== osFilter) return false;
    const q = search.toLowerCase();
    if (q && !l.os.toLowerCase().includes(q) && !l.serialKey.toLowerCase().includes(q)) return false;
    return true;
  });

  const cols = [
    {
      key: 'os', label: 'OS', width: '120px',
      render: v => <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{v}</span>
    },
    {
      key: 'detectionType', label: '탐지 항목', width: '120px',
      render: v => {
        const color = v === '선정성' ? '#ef4444' : v === '도박' ? '#f59e0b' : '#3b82f6';
        return (
          <span style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: 4,
            fontSize: 12, fontWeight: 600,
            background: color + '18', color
          }}>{v}</span>
        );
      }
    },
    { key: 'devices',     label: '수량',     width: '80px',  render: v => `${v}대` },
    { key: 'usedDevices', label: '사용 단말', width: '100px', render: (v, r) => `${v} / ${r.devices}대` },
    { key: 'validFrom',   label: '유효 기간',               render: (v, r) => `${fmtD(v)} ~ ${fmtD(r.validTo)}` },
    {
      key: 'status', label: '상태', width: '80px',
      render: v => v === 'active'
        ? <Badge cls="bdg-ok">활성</Badge>
        : <Badge cls="bdg-err">만료</Badge>
    },
  ];

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">라이선스</div>
          <div className="ph-sub">총 {lics.length}개 라이선스 등록</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-p"
            onClick={() => toast('라이선스 등록은 관리자에게 문의하세요.', 'info')}>
            + 라이선스 등록
          </button>
        </div>
      </div>

      <div className="grid-4 section-gap">
        <KPI label="총 수량"  value={totDevices} sub="등록된 전체 라이선스" />
        <KPI label="사용 중"  value={totUsed}    sub={`${totPct}% 사용`}
          color={totPct > 90 ? 'err' : totPct > 70 ? 'warn' : 'ok'} />
        <KPI label="잔여"     value={remaining}  sub="추가 등록 가능" color="ac" />
        <KPI label="등록 수"  value={lics.length} sub="라이선스 항목" />
      </div>

      {/* 구분선 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--bd)' }} />
        <span style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap' }}>※ 위 수치는 전체 기준이며 아래 필터와 연동되지 않습니다</span>
        <div style={{ flex: 1, height: 1, background: 'var(--bd)' }} />
      </div>

      <div className="fb">
        <input className="inp search" placeholder="OS 또는 시리얼 키 검색..." type="text"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select className="inp" style={{ maxWidth: 140 }} value={osFilter} onChange={e => setOsFilter(e.target.value)}>
          <option value="">전체 OS</option>
          {['Android', 'iOS', 'Windows', 'ChromeBook', 'WhaleBook'].map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {filtered.length}개</div>
      <Table
        cols={cols}
        rows={filtered.slice((page - 1) * 15, page * 15)}
        onRowClick={row => openPanel(
          <LicenseDetailPanel lic={row} onClose={closePanel} />
        )}
      />
      <Pagination page={page} total={filtered.length} pageSize={15} onChange={setPage} />
    </div>
  );
}
