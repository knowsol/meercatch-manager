'use client'
import { useState } from 'react';
import KPI from '../../components/common/KPI';
import Table from '../../components/common/Table';
import { StatusBadge, DetTypeBadge, Badge } from '../../components/common/Badge';

/* ── 섹션 래퍼 ── */
function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-title" style={{ fontSize: 15, marginBottom: 20, borderBottom: '1px solid var(--bd)', paddingBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, children, style }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  );
}

function CodeTag({ children }) {
  return (
    <code style={{
      background: 'var(--bg0)', border: '1px solid var(--bd)', borderRadius: 4,
      padding: '1px 6px', fontSize: 11, color: 'var(--ac2)', fontFamily: 'monospace',
    }}>
      {children}
    </code>
  );
}

/* ── 샘플 테이블 데이터 ── */
const SAMPLE_COLS = [
  { key: 'name', label: '이름' },
  { key: 'role', label: '역할', width: 90, render: v => <Badge cls={v === 'admin' ? 'bdg-ac' : v === 'staff' ? 'bdg-ok' : 'bdg-muted'}>{v}</Badge> },
  { key: 'status', label: '상태', width: 80, render: v => <StatusBadge status={v} /> },
  { key: 'score', label: '점수', width: 60 },
];
const SAMPLE_ROWS = [
  { id: 1, name: '홍길동', role: 'admin', status: 'active', score: 98 },
  { id: 2, name: '김영희', role: 'staff', status: 'active', score: 84 },
  { id: 3, name: '박철수', role: 'teacher', status: 'inactive', score: 61 },
];

export default function Components() {
  const [tab, setTab] = useState('btn');
  const [inputVal, setInputVal] = useState('');
  const [selectVal, setSelectVal] = useState('');

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="ph" style={{ marginBottom: 24 }}>
        <div className="ph-left">
          <div className="ph-title">디자인 컴포넌트</div>
          <div className="ph-sub">현재 프로젝트에서 사용 중인 모든 UI 구성요소</div>
        </div>
      </div>

      {/* ── 버튼 ── */}
      <Section title="Button">
        <Row label="변형 (Variant)">
          <button className="btn btn-p">btn-p (Primary)</button>
          <button className="btn btn-d">btn-d (Danger)</button>
          <button className="btn btn-s">btn-s (Secondary)</button>
          <button className="btn btn-outline">btn-outline</button>
          <button className="btn btn-warn">btn-warn</button>
          <button className="btn btn-ok">btn-ok</button>
        </Row>
        <Row label="크기 (Size)">
          <button className="btn btn-p">기본</button>
          <button className="btn btn-p btn-sm">btn-sm</button>
          <button className="btn btn-p btn-xs">btn-xs</button>
        </Row>
        <Row label="상태 (State)">
          <button className="btn btn-p" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>비활성</button>
          <button className="btn btn-s">+ 추가</button>
          <button className="btn btn-d btn-sm">삭제</button>
          <button className="btn btn-outline btn-sm">닫기</button>
        </Row>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <CodeTag>.btn .btn-p</CodeTag>
          <CodeTag>.btn .btn-d</CodeTag>
          <CodeTag>.btn .btn-s</CodeTag>
          <CodeTag>.btn .btn-outline</CodeTag>
          <CodeTag>.btn .btn-warn</CodeTag>
          <CodeTag>.btn .btn-ok</CodeTag>
          <CodeTag>.btn-sm</CodeTag>
          <CodeTag>.btn-xs</CodeTag>
        </div>
      </Section>

      {/* ── 배지 ── */}
      <Section title="Badge">
        <Row label="StatusBadge">
          <StatusBadge status="active" />
          <StatusBadge status="inactive" />
          <StatusBadge status="pending" />
        </Row>
        <Row label="DetTypeBadge">
          <DetTypeBadge type="선정성" />
          <DetTypeBadge type="도박" />
          <DetTypeBadge type="폭력" />
          <DetTypeBadge type="마약" />
          <DetTypeBadge type="혐오" />
          <DetTypeBadge type="기타" />
        </Row>
        <Row label="Badge (범용)">
          <Badge cls="bdg-ok">bdg-ok</Badge>
          <Badge cls="bdg-err">bdg-err</Badge>
          <Badge cls="bdg-warn">bdg-warn</Badge>
          <Badge cls="bdg-muted">bdg-muted</Badge>
          <Badge cls="bdg-ac">bdg-ac</Badge>
        </Row>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <CodeTag>&lt;StatusBadge status="active" /&gt;</CodeTag>
          <CodeTag>&lt;DetTypeBadge type="harmful" /&gt;</CodeTag>
          <CodeTag>&lt;Badge cls="bdg-ok"&gt;</CodeTag>
        </div>
      </Section>

      {/* ── KPI 카드 ── */}
      <Section title="KPI Card">
        <div className="grid-4" style={{ marginBottom: 12 }}>
          <KPI label="전체" value={128} sub="대" />
          <KPI label="정상" value={104} color="ok" sub="대" />
          <KPI label="탐지" value={17} color="err" sub="건" />
          <KPI label="경고" value={7} color="warn" sub="건" />
        </div>
        <div className="grid-3" style={{ marginBottom: 12 }}>
          <KPI label="라이선스" value={300} color="ac" sub="개" />
          <KPI label="사용중" value={245} />
          <KPI label="잔여" value={55} color="ok" />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <CodeTag>&lt;KPI label="전체" value={'{128}'} /&gt;</CodeTag>
          <CodeTag>color: "ok" | "err" | "warn" | "ac"</CodeTag>
          <CodeTag>.grid-2 / .grid-3 / .grid-4</CodeTag>
        </div>
      </Section>

      {/* ── 입력 폼 ── */}
      <Section title="Form Input">
        <Row label="텍스트 입력">
          <div style={{ flex: 1, minWidth: 200 }}>
            <input className="inp" placeholder="기본 입력" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input className="inp error" placeholder="오류 상태" defaultValue="잘못된 값" />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <input className="inp" placeholder="비활성" disabled />
          </div>
        </Row>
        <Row label="셀렉트 / 텍스트에어리어">
          <div style={{ flex: 1, minWidth: 180 }}>
            <select className="inp" value={selectVal} onChange={e => setSelectVal(e.target.value)}>
              <option value="">전체 선택</option>
              <option value="a">항목 A</option>
              <option value="b">항목 B</option>
              <option value="c">항목 C</option>
            </select>
          </div>
          <div style={{ flex: 2, minWidth: 240 }}>
            <textarea className="inp" rows={3} placeholder="텍스트에어리어" style={{ resize: 'vertical' }} />
          </div>
        </Row>
        <Row label="검색 바 (fb 패턴)">
          <div className="fb" style={{ paddingBottom: 0, width: '100%' }}>
            <input className="inp search" placeholder="이름 또는 아이디 검색..." type="text" style={{ flex: 1 }} />
            <select className="inp" style={{ maxWidth: 120 }}>
              <option>전체 역할</option>
              <option>관리자</option>
            </select>
            <button className="btn btn-p btn-sm">검색</button>
          </div>
        </Row>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <CodeTag>.inp</CodeTag>
          <CodeTag>.inp.error</CodeTag>
          <CodeTag>.inp:disabled</CodeTag>
          <CodeTag>.inp.search (fb 안에서 280px)</CodeTag>
        </div>
      </Section>

      {/* ── 탭 ── */}
      <Section title="Tabs">
        <div className="tabs" style={{ marginBottom: 12 }}>
          {['전체', '활성', '비활성', '대기'].map(t => (
            <div key={t} className={`tab${tab === t ? ' a' : ''}`} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--t2)', padding: '8px 0' }}>
          선택됨: <strong style={{ color: 'var(--t1)' }}>{tab}</strong>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <CodeTag>.tabs &gt; .tab</CodeTag>
          <CodeTag>.tab.a (활성)</CodeTag>
        </div>
      </Section>

      {/* ── 카드 ── */}
      <Section title="Card">
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <div className="card">
            <div className="card-title">카드 제목</div>
            <p style={{ fontSize: 13, color: 'var(--t2)', margin: 0 }}>
              카드 내용이 여기에 들어갑니다. 배경과 테두리, 그림자가 적용된 기본 카드 컴포넌트입니다.
            </p>
          </div>
          <div className="card">
            <div className="card-title">진행률 예시</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', marginBottom: 5 }}>
                  <span>정상</span><span>80%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill ok" style={{ width: '80%' }} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', marginBottom: 5 }}>
                  <span>경고</span><span>55%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill warn" style={{ width: '55%' }} /></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', marginBottom: 5 }}>
                  <span>위험</span><span>25%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill err" style={{ width: '25%' }} /></div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <CodeTag>.card</CodeTag>
          <CodeTag>.card-title</CodeTag>
          <CodeTag>.progress-bar &gt; .progress-fill</CodeTag>
          <CodeTag>.progress-fill.ok / .warn / .err</CodeTag>
        </div>
      </Section>

      {/* ── Info Row ── */}
      <Section title="Info Row (상세 정보)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <dl className="info-row">
            <dt>학교명</dt><dd>서울초등학교</dd>
            <dt>학년/반</dt><dd>3학년 2반</dd>
            <dt>담당교사</dt><dd>김선생</dd>
            <dt>상태</dt><dd><StatusBadge status="active" /></dd>
          </dl>
          <dl className="info-row">
            <dt>라이선스</dt><dd>Windows — 150개</dd>
            <dt>사용중</dt><dd>132개</dd>
            <dt>잔여</dt><dd>18개</dd>
            <dt>만료일</dt><dd>2026-12-31</dd>
          </dl>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <CodeTag>dl.info-row &gt; dt + dd</CodeTag>
        </div>
      </Section>

      {/* ── Empty State ── */}
      <Section title="Empty State">
        <div className="empty">
          <div className="empty-icon">📭</div>
          <div className="empty-title">데이터가 없습니다</div>
          <div style={{ fontSize: 13, color: 'var(--t3)' }}>검색 조건을 변경하거나 새 항목을 추가해보세요.</div>
          <button className="btn btn-p btn-sm">+ 새로 추가</button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <CodeTag>.empty &gt; .empty-icon + .empty-title</CodeTag>
        </div>
      </Section>

      {/* ── 테이블 ── */}
      <Section title="Table">
        <Table
          cols={SAMPLE_COLS}
          rows={SAMPLE_ROWS}
          onRowClick={row => {}}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <CodeTag>&lt;Table cols={'{[...]}'} rows={'{[...]}'} onRowClick={'{fn}'} /&gt;</CodeTag>
          <CodeTag>col: key, label, width?, render?</CodeTag>
        </div>
      </Section>

      {/* ── 색상 토큰 ── */}
      <Section title="Color Tokens">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
          {[
            { name: '--ac', label: 'Primary (ac)' },
            { name: '--ok', label: 'Success (ok)' },
            { name: '--err', label: 'Error (err)' },
            { name: '--warn', label: 'Warning (warn)' },
            { name: '--t1', label: 'Text 1 (t1)' },
            { name: '--t2', label: 'Text 2 (t2)' },
            { name: '--t3', label: 'Text 3 (t3)' },
            { name: '--bg1', label: 'Background 1' },
            { name: '--bg2', label: 'Background 2' },
            { name: '--bg3', label: 'Background 3' },
          ].map(({ name, label }) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{
                height: 36, borderRadius: 6, background: `var(${name})`,
                border: '1px solid var(--bd)',
              }} />
              <div style={{ fontSize: 11, color: 'var(--t2)', fontWeight: 500 }}>{label}</div>
              <CodeTag>{name}</CodeTag>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 페이지 헤더 패턴 ── */}
      <Section title="Page Header Pattern (ph)">
        <div className="card" style={{ background: 'var(--bg0)', marginBottom: 12 }}>
          <div className="ph" style={{ marginBottom: 0 }}>
            <div className="ph-left">
              <div className="ph-title">페이지 제목</div>
              <div className="ph-sub">부제목 또는 통계 요약</div>
            </div>
            <div className="ph-actions">
              <button className="btn btn-s btn-sm">내보내기</button>
              <button className="btn btn-p btn-sm">+ 추가</button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <CodeTag>.ph &gt; .ph-left (.ph-title + .ph-sub) + .ph-actions</CodeTag>
        </div>
      </Section>
    </div>
  );
}
