'use client'
import { useState } from 'react';
import Pagination from '../../components/common/Pagination';
import Table from '../../components/common/Table';

const DOMAINS_ADULT = ['xen9qorvi.life','smtb-0041.com','pdr-888.com','rv-0303.com','abc-3602.com','cms-8901.com','nd-0013.com','ag-3636.com','dtr-8225.com','888-pi.com','rb-003.com','miu1.casino','nrt-99.com','fox-4949.com','hot-vod99.com','adult-xyz.net','sxxx-1234.com','nude-leak.org','red-tube99.com','xvideos-kr.com','av18plus.net','sexfilm-hd.com','mature-lady.net','erotik-movie.com','18adult.kr'];
const DOMAINS_GAMBLE = ['casino77.kr','jackpot-bet.com','sportslive-bet.net','toto-king99.com','powerball-win.com','holdem-poker.net','baccarat-live.kr','slot-galaxy.com','bet365-mirror.net','1xbet-kr.com','casinoguru-kr.com','poker-star99.net','lotto-plus.kr','sports-king.net','wonbet.com','doubleu-casino.com','ace-casino99.kr','royal-casino.net','grand-slot.com','lucky-poker.kr','spin-win.com','mega-jackpot.net','diamond-bet.kr','crown-casino99.net','vip-holdem.com'];
const PATHS = ['/','/?code=8942','/?code=7784','/?ref=9596','/?code=8522','/?code=6500','/?code=0117','/?ref=9596','/login.asp','/?b=mtcatch','/?ref=4521','/main.php','/index.html','/home','/?from=kr'];
const ADULT_LONG_PATH = '/?gad_source=1&gad_campaignid=236187932888&gbraid=0AAAABDCABc-1LnqXjwvQxYbCxHMMTjXxG&gclid=CjwKCAjw857RBhAgEiwAI-1yKOu4IReKlNFvK3LL8I3fUcKOV80i6sEV6kelInIGC9BwuefdEYm3mBoCeSEQAvD_BwE';

function genUrls() {
  const items = [];
  let no = 250;
  for (let i = 0; i < 125; i++) {
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(9 + (i % 8)).padStart(2, '0');
    const min = String(i % 60).padStart(2, '0');
    items.push({ no: no--, domain: DOMAINS_ADULT[i % DOMAINS_ADULT.length], protocol: 'HTTP', port: 80, path: i === 0 ? ADULT_LONG_PATH : PATHS[i % PATHS.length], dbType: '선정성', accuracy: 99, registeredAt: `2026-06-${day} ${hour}:${min}`, id: `u-a-${i}` });
  }
  for (let i = 0; i < 125; i++) {
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(9 + (i % 8)).padStart(2, '0');
    const min = String(i % 60).padStart(2, '0');
    items.push({ no: no--, domain: DOMAINS_GAMBLE[i % DOMAINS_GAMBLE.length], protocol: 'HTTP', port: 80, path: PATHS[i % PATHS.length], dbType: '도박성', accuracy: 99, registeredAt: `2026-06-${day} ${hour}:${min}`, id: `u-g-${i}` });
  }
  return items;
}

function genSha256() {
  const hex = '0123456789abcdef';
  return Array.from({ length: 249 }, (_, i) => {
    let hash = '';
    for (let j = 0; j < 64; j++) hash += hex[(i * 31 + j * 17) % 16];
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(9 + (i % 8)).padStart(2, '0');
    const min = String(i % 60).padStart(2, '0');
    return { no: 249 - i, hash, dbType: i % 3 === 0 ? '선정성' : '도박성', accuracy: 95 + (i % 5), registeredAt: `2026-06-${day} ${hour}:${min}`, id: `sha-${i}` };
  });
}

const WHITELIST = [
  { no: 11, domain: 'youtube.com',    protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-01 09:00', id: 'wl-1' },
  { no: 10, domain: 'google.com',     protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-01 09:01', id: 'wl-2' },
  { no: 9,  domain: 'naver.com',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-01 09:02', id: 'wl-3' },
  { no: 8,  domain: 'kakao.com',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-02 09:00', id: 'wl-4' },
  { no: 7,  domain: 'daum.net',       protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-02 09:01', id: 'wl-5' },
  { no: 6,  domain: 'namu.wiki',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-03 10:00', id: 'wl-6' },
  { no: 5,  domain: 'bing.com',       protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-04 11:00', id: 'wl-7' },
  { no: 4,  domain: 'wikipedia.org',  protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-05 09:30', id: 'wl-8' },
  { no: 3,  domain: 'ebs.co.kr',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-10 08:00', id: 'wl-9' },
  { no: 2,  domain: 'khan.co.kr',     protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-05-15 14:00', id: 'wl-10' },
  { no: 1,  domain: 'moe.go.kr',      protocol: 'HTTPS', port: 443, path: '/', dbType: '전체', registeredAt: '2026-06-01 09:00', id: 'wl-11' },
];

const URL_DATA  = genUrls();
const SHA_DATA  = genSha256();
const EVENT_TYPES = ['전체', '선정성', '도박성'];

function DelBtn() {
  return <button className="btn btn-d btn-xs">삭제</button>;
}

const urlCols = [
  { key: 'no',           label: '#',        width: '52px' },
  { key: 'domain',       label: 'Domain',   width: '165px', render: v => <a href="#" style={{ color: '#3b82f6', fontSize: 13 }} onClick={e => e.preventDefault()}>{v}</a> },
  { key: 'protocol',     label: 'Protocol', width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'port',         label: 'Port',     width: '55px',  render: v => <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{v}</span> },
  { key: 'path',         label: 'Path',                     render: v => <span style={{ fontSize: 12, color: 'var(--t2)', wordBreak: 'break-all' }}>{v}</span> },
  { key: 'dbType',       label: 'DB Type',  width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'accuracy',     label: '정확도',   width: '70px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'registeredAt', label: '등록일',   width: '140px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
  { key: '_del',         label: '삭제',     width: '60px',  render: () => <DelBtn /> },
];

const shaCols = [
  { key: 'no',           label: '#',       width: '52px' },
  { key: 'hash',         label: 'SHA256',             render: v => <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--t2)', wordBreak: 'break-all' }}>{v}</span> },
  { key: 'dbType',       label: 'DB Type', width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'accuracy',     label: '정확도',  width: '70px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'registeredAt', label: '등록일',  width: '140px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
  { key: '_del',         label: '삭제',    width: '60px',  render: () => <DelBtn /> },
];

const whiteCols = [
  { key: 'no',           label: '#',        width: '52px' },
  { key: 'domain',       label: 'Domain',   width: '165px', render: v => <a href="#" style={{ color: '#3b82f6', fontSize: 13 }} onClick={e => e.preventDefault()}>{v}</a> },
  { key: 'protocol',     label: 'Protocol', width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'port',         label: 'Port',     width: '55px',  render: v => <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{v}</span> },
  { key: 'path',         label: 'Path',     width: '100px', render: v => <span style={{ fontSize: 12, color: 'var(--t2)' }}>{v}</span> },
  { key: 'dbType',       label: 'DB Type',  width: '80px',  render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'registeredAt', label: '등록일',   width: '140px', render: v => <span style={{ fontSize: 12 }}>{v}</span> },
  { key: '_del',         label: '삭제',     width: '60px',  render: () => <DelBtn /> },
];

export default function ValidUrlList() {
  const [tab, setTab]             = useState('url');
  const [eventType, setEventType] = useState('전체');
  const [page, setPage]           = useState(1);
  const PAGE_SIZE = 25;

  const TABS = [
    { id: 'url',       label: `URL 목록 (Text)`, count: URL_DATA.length },
    { id: 'sha256',    label: 'SHA256 목록',      count: SHA_DATA.length },
    { id: 'whitelist', label: '화이트리스트',      count: WHITELIST.length },
  ];

  const filtered =
    tab === 'url'       ? URL_DATA.filter(r => eventType === '전체' || r.dbType === eventType) :
    tab === 'sha256'    ? SHA_DATA.filter(r => eventType === '전체' || r.dbType === eventType) :
    WHITELIST;

  const cols =
    tab === 'url'    ? urlCols :
    tab === 'sha256' ? shaCols :
    whiteCols;

  function switchTab(id) { setTab(id); setPage(1); setEventType('전체'); }

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">유효 URL 관리</div>
          <div className="ph-sub">검증 URL 현황</div>
        </div>
      </div>

      <div className="tabs" style={{ margin: '0 0 16px' }}>
        {TABS.map(t => (
          <div key={t.id} className={`tab${tab === t.id ? ' a' : ''}`} onClick={() => switchTab(t.id)}>
            {t.label} ({t.count})
          </div>
        ))}
      </div>

      {tab !== 'whitelist' && (
        <div className="fb" style={{ marginBottom: 12, alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--t2)' }}>Event Type:</span>
          <select className="inp" style={{ maxWidth: 120 }} value={eventType} onChange={e => { setEventType(e.target.value); setPage(1); }}>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}

      <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>총 {filtered.length}건</div>
      <Table cols={cols} rows={filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)} />
      <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}
