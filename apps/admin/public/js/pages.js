/* ============================================================
   pages.js — All page renderers
============================================================ */

/* ── Panel helper ─────────────────────────────────────── */
function mkPanel(title, bodyEl, onSave, saveLabel, extraBtns) {
  const rightBtns = [
    ...(extraBtns || []),
    onSave ? h('button', { class: 'btn btn-p', onClick: onSave }, saveLabel || '저장') : null
  ].filter(Boolean);
  return h('div', { style: 'display:flex;flex-direction:column;height:100%' },
    h('div', { class: 'mod-h' },
      h('button', { class: 'cx', onClick: () => closePanel() }, '✕'),
      h('h2', {}, title)
    ),
    h('div', { class: 'mod-b', style: 'flex:1;overflow-y:auto' }, bodyEl),
    rightBtns.length ? h('div', { class: 'mod-f' },
      h('div', {}),
      h('div', { class: 'mod-f-right' }, ...rightBtns)
    ) : h('div', {})
  );
}

/* ----------------------------------------------------------
   DASHBOARD
---------------------------------------------------------- */
function renderDirectDashboard() {
  const s = DUMMY.stats;
  const page = h('div', {});

  page.appendChild(h('div', { class:'grid-4 section-gap' },
    mkKPI('전체 라이선스', DUMMY.licensesTotal, '라이선스 한도', ''),
    mkKPI('활성 라이선스', DUMMY.licensesUsed, '현재 사용 중', 'ok'),
    mkKPI('오늘 탐지', s.todayDetections, '금일 유해 콘텐츠', 'err'),
    mkKPI('이번 주 탐지', s.weeklyDetections, '지난 7일', 'warn')
  ));

  const recentDets = DUMMY.detections.slice(0, 5);
  const detCard = h('div', { class:'card section-gap' },
    h('div', { class:'flex-between mb-16' },
      h('div', { class:'card-title', style:{marginBottom:0} }, '최근 탐지 현황'),
      h('button', { class:'btn btn-outline btn-sm', onClick:()=>navigate('detections') }, '전체 보기')
    ),
    mkTable([
      { key:'detectedAt', label:'탐지 시각', width:'160px', render: v=>fmtDT(v) },
      { key:'type', label:'유형', width:'80px', render: v=>detTypeBadge(v) },
      { key:'deviceName', label:'단말', width:'100px' },
      { key:'status', label:'상태', width:'80px', render: v=>statusBadge(v) },
    ], recentDets, ()=>navigate('detections'))
  );
  page.appendChild(detCard);

  const usePct = Math.round((DUMMY.licensesUsed / DUMMY.licensesTotal) * 100);
  const licCard = h('div', { class:'card' },
    h('div', { class:'card-title' }, '라이선스 현황'),
    h('dl', { class:'info-row' },
      h('dt',{},'라이선스 유형'), h('dd',{},DUMMY.licenses[0].type),
      h('dt',{},'OS 종류'), h('dd',{},`${DUMMY.licenses.length}종`),
      h('dt',{},'사용 현황'), h('dd',{},`${DUMMY.licensesUsed} / ${DUMMY.licensesTotal}대 (${usePct}%)`)
    ),
    h('div', { class:'mt-16' },
      h('div', { class:'progress-bar' },
        h('div', { class:'progress-fill'+(usePct>90?' err':usePct>70?' warn':' ok'), style:{width:usePct+'%'} })
      )
    )
  );

  page.appendChild(h('div', { class:'grid-1 mt-20' }, licCard));
  return page;
}

function renderDashboard() {
  if (D.loginRole === 'direct') return renderDirectDashboard();
  const s = DUMMY.stats;
  const page = h('div', {});

  // KPI row
  const kpiGrid = h('div', { class: 'grid-4 section-gap' },
    mkKPI('전체 그룹', s.totalGroups, '등록된 학급', 'ac'),
    mkKPI('등록 단말', s.totalDevices, `온라인 ${s.onlineDevices}대`, 'ok'),
    mkKPI('오늘 탐지', s.todayDetections, '금일 유해 콘텐츠', 'err'),
    mkKPI('활성 중단', s.activePauses, '현재 탐지 중단 중', 'warn')
  );
  page.appendChild(kpiGrid);

  // Weekly stats row
  const weeklyRow = h('div', { class: 'grid-3 section-gap' },
    mkKPI('이번 주 탐지', s.weeklyDetections, '지난 7일', ''),
    mkKPI('확인된 탐지', s.confirmedDetections, '총 누적 확인', 'ac'),
    mkKPI('적용 정책', s.totalPolicies, '활성 정책 수', '')
  );
  page.appendChild(weeklyRow);

  // Recent detections
  const recentDets = DUMMY.detections.slice(0, 5);
  const detTable = mkTable([
    { key:'detectedAt', label:'탐지 시각', width:'160px', render: v => fmtDT(v) },
    { key:'type', label:'유형', width:'80px', render: (v) => detTypeBadge(v) },
    { key:'deviceName', label:'단말', width:'100px' },
    { key:'status', label:'상태', width:'80px', render: v => statusBadge(v) },
  ], recentDets, (row) => navigate('detections'));

  const detCard = h('div', { class: 'card section-gap' },
    h('div', { class: 'flex-between mb-16' },
      h('div', { class: 'card-title', style:{marginBottom:0} }, '최근 탐지 현황'),
      h('button', { class: 'btn btn-outline btn-sm', onClick: () => navigate('detections') }, '전체 보기')
    ),
    detTable
  );
  page.appendChild(detCard);

  // Bottom row: active pauses + group status
  const activePauses = DUMMY.pauses.filter(p => p.status === 'ACTIVE');
  const pauseTable = mkTable([
    { key:'groupId', label:'학교', render: v => {
      const grp = DUMMY.groups.find(g => g.groupId === v);
      const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
      return sch ? sch.name : '—';
    }},
    { key:'pauseType', label:'중단 유형', width:'80px' },
    { key:'requester', label:'요청자', width:'80px' },
    { key:'endAt', label:'종료 시각', render: v => fmtDT(v) },
  ], activePauses, (row) => navigate('pauses-list'));

  const pauseCard = h('div', { class: 'card' },
    h('div', { class: 'flex-between mb-16' },
      h('div', { class: 'card-title', style:{marginBottom:0} }, '활성 탐지 중단'),
      h('button', { class: 'btn btn-outline btn-sm', onClick: () => navigate('pauses-list') }, '전체 보기')
    ),
    activePauses.length > 0 ? pauseTable :
      h('div', { class: 'empty' },
        h('div', { class: 'empty-icon' }, '—'),
        h('div', { class: 'empty-title' }, '현재 탐지 중단이 없습니다')
      )
  );

  // License status
  const licUsePct = Math.round((DUMMY.licensesUsed / DUMMY.licensesTotal) * 100);
  const licCard = h('div', { class: 'card' },
    h('div', { class: 'card-title' }, '라이선스 현황'),
    h('dl', { class: 'info-row' },
      h('dt', {}, '학교명'), h('dd', {}, DUMMY.licenses[0].school),
      h('dt', {}, '라이선스 유형'), h('dd', {}, DUMMY.licenses[0].type),
      h('dt', {}, 'OS 종류'), h('dd', {}, `${DUMMY.licenses.length}종`),
      h('dt', {}, '단말 사용'), h('dd', {}, `${DUMMY.licensesUsed} / ${DUMMY.licensesTotal}대 (${licUsePct}%)`)
    ),
    h('div', { class: 'mt-16' },
      h('div', { class: 'progress-bar' },
        h('div', { class: 'progress-fill' + (licUsePct > 90 ? ' err' : licUsePct > 70 ? ' warn' : ' ok'), style: { width: licUsePct + '%' } })
      )
    )
  );

  const bottomRow = h('div', { class: 'grid-2 mt-20' }, pauseCard, licCard);
  page.appendChild(bottomRow);

  return page;
}

/* ----------------------------------------------------------
   GROUP LIST
---------------------------------------------------------- */
function renderGroupList() {
  const page = h('div', {});
  const ph = h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '그룹 목록'),
      h('div', { class: 'ph-sub' }, `총 ${DUMMY.groups.length}개 그룹`)
    ),
    h('div', { class: 'ph-actions' },
      h('button', { class: 'btn btn-p', onClick: () => navigate('groups-new') }, '+ 그룹 생성')
    )
  );
  page.appendChild(ph);

  const active = DUMMY.groups.filter(g => g.status === 'active').length;
  const paused = DUMMY.groups.filter(g => g.pauseStatus === 'paused').length;
  const totalDevices = DUMMY.groups.reduce((a,g) => a + g.deviceCount, 0);
  page.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('전체 그룹', DUMMY.groups.length, '', ''),
    mkKPI('활성 그룹', active, '', 'ok'),
    mkKPI('탐지 중단', paused, '현재 중단 중인 그룹', 'warn'),
    mkKPI('총 단말', totalDevices, '등록된 총 단말 수', 'ac')
  ));

  const searchInp = h('input', { class: 'inp search', placeholder: '그룹 이름 검색...', type: 'text' });
  const schoolTypeSelect = h('select', { class: 'inp', style: 'max-width:120px' },
    h('option', { value: '' }, '전체 학교유형'),
    h('option', { value: '중학교' }, '중학교'),
    h('option', { value: '고등학교' }, '고등학교')
  );
  const statusSelect = h('select', { class: 'inp', style: 'max-width:120px' },
    h('option', { value: '' }, '전체 상태'),
    h('option', { value: 'active' }, '활성'),
    h('option', { value: 'inactive' }, '비활성')
  );

  const tableWrap = h('div', { style:'overflow-y:auto;max-height:calc(100vh - 340px)' });
  const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:center;margin-top:10px;font-size:13px;color:#64748b;flex-shrink:0' });

  const GRP_PAGE_SIZE = 20;
  let grpPage = 1;

  const cols = [
    { key:'_no', label:'No.', width:'50px' },
    { key:'schoolId', label:'학교', render: v => {
      const s = DUMMY.schools.find(sc => sc.schoolId === v);
      return s ? s.name : '—';
    }},
    { key:'schoolId', label:'학교유형', width:'90px', render: v => {
      const s = DUMMY.schools.find(sc => sc.schoolId === v);
      return s ? mkBd('bdg-ac', s.type) : '—';
    }},
    { key:'deviceCount', label:'단말 수', width:'80px', render: v => `${v}대` },
    { key:'policyCount', label:'적용 정책', width:'80px', render: v => `${v}개` },
    { key:'pauseStatus', label:'탐지 중단', width:'100px', render: v => v === 'paused' ? mkBd('bdg-warn','중단중') : mkBd('bdg-ok','정상') },
    { key:'status', label:'상태', width:'80px', render: v => statusBadge(v) },
    { key:'updatedAt', label:'최근 수정', render: v => fmtD(v) },
  ];

  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const tf = schoolTypeSelect.value;
    const sf = statusSelect.value;

    const filtered = DUMMY.groups.filter(gr => {
      if (q && !gr.name.toLowerCase().includes(q)) return false;
      if (sf && gr.status !== sf) return false;
      if (tf) {
        const s = DUMMY.schools.find(sc => sc.schoolId === gr.schoolId);
        if (!s || s.type !== tf) return false;
      }
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / GRP_PAGE_SIZE));
    if (grpPage > totalPages) grpPage = 1;
    const pageData = filtered.slice((grpPage-1)*GRP_PAGE_SIZE, grpPage*GRP_PAGE_SIZE)
      .map((r, i) => ({ ...r, _no: (grpPage-1)*GRP_PAGE_SIZE + i + 1 }));

    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable(cols, pageData, row => openPanel(renderGroupDetailPanel(row.groupId))));

    pageWrap.innerHTML = '';
    pageWrap.appendChild(mkPagination(grpPage, totalPages, (p) => { grpPage = p; renderTable(); }));
  }

  searchInp.addEventListener('input', () => { grpPage = 1; renderTable(); });
  schoolTypeSelect.addEventListener('change', () => { grpPage = 1; renderTable(); });
  statusSelect.addEventListener('change', () => { grpPage = 1; renderTable(); });

  const fb = h('div', { class: 'fb' }, searchInp, schoolTypeSelect, statusSelect);
  page.appendChild(fb);
  page.appendChild(tableWrap);
  page.appendChild(pageWrap);
  renderTable();
  return page;
}

/* ----------------------------------------------------------
   GROUP NEW
---------------------------------------------------------- */
function renderGroupNew() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '그룹 생성'),
      h('div', { class: 'ph-sub' }, '새로운 그룹을 등록합니다')
    )
  ));

  const schoolSelect = h('select', { class: 'inp' },
    h('option', { value: '' }, '학교 선택'),
    ...DUMMY.schools.map(s => h('option', { value: s.schoolId }, `${s.name} (${s.type})`))
  );
  const schoolTypeEl = h('div', { style: 'padding:6px 0;font-size:14px;color:#64748b' }, '—');
  schoolSelect.addEventListener('change', () => {
    const s = DUMMY.schools.find(sc => sc.schoolId === schoolSelect.value);
    schoolTypeEl.textContent = s ? s.type : '—';
  });
  const nameInp = h('input', { class: 'inp', placeholder: '그룹 이름', type: 'text' });
  const descInp = h('textarea', { class: 'inp', placeholder: '그룹 설명 (선택)', style: { minHeight: '80px' } });
  const policySelect = h('select', { class: 'inp' },
    h('option', { value: '' }, '정책 선택 (선택)'),
    ...DUMMY.policies.filter(p => p.active).map(p => h('option', { value: p.policyId }, p.name))
  );

  function submit() {
    let valid = true;
    [schoolSelect, nameInp].forEach(inp => inp.classList.remove('error'));
    if (!schoolSelect.value) { schoolSelect.classList.add('error'); valid = false; }
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); valid = false; }
    if (!valid) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('그룹이 생성되었습니다.');
    navigate('groups-list');
  }

  const card = h('div', { class: 'card', style: { maxWidth: '600px' } },
    h('div', { class: 'section-gap' }, fg('학교', schoolSelect, true)),
    h('div', { class: 'section-gap' }, fg('학교유형', schoolTypeEl, false)),
    h('div', { class: 'section-gap' }, fg('그룹 이름', nameInp, true)),
    h('div', { class: 'section-gap' }, fg('그룹 설명', descInp, false)),
    h('div', { class: 'section-gap' }, fg('기본 적용 정책', policySelect, false)),
    h('div', { class: 'flex gap-8 mt-20' },
      h('button', { class: 'btn btn-outline', onClick: () => navigate('groups-list') }, '취소'),
      h('button', { class: 'btn btn-p', onClick: submit }, '그룹 생성')
    )
  );
  page.appendChild(card);
  return page;
}

/* ----------------------------------------------------------
   GROUP DETAIL
---------------------------------------------------------- */
function renderGroupDetail(id) {
  const group = DUMMY.groups.find(g => g.groupId === id) || DUMMY.groups[0];
  const page = h('div', {});

  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, group.name),
      h('div', { class: 'ph-sub' }, `단말 ${group.deviceCount}대`)
    ),
    h('div', { class: 'ph-actions' },
      statusBadge(group.status),
      h('button', { class: 'btn btn-outline', onClick: () => navigate('groups-list') }, '← 목록'),
      h('button', { class: 'btn btn-s', onClick: () => toast('그룹 정보가 저장되었습니다.') }, '저장')
    )
  ));

  let activeTab = 'info';
  const tabContent = h('div', {});

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      const nameInp = h('input', { class: 'inp', value: group.name, type: 'text' });
      const descInp = h('textarea', { class: 'inp', style: { minHeight: '80px' } }, '학급 그룹입니다.');
      tabContent.appendChild(h('div', { class: 'card', style: { maxWidth: '560px' } },
        h('div', { class: 'section-gap' }, fg('그룹 이름', nameInp, true)),
        h('div', { class: 'section-gap' }, fg('설명', descInp, false)),
        h('dl', { class: 'info-row mt-16' },
          h('dt', {}, '상태'),       h('dd', {}, statusBadge(group.status)),
          h('dt', {}, '최근 수정'),  h('dd', {}, fmtD(group.updatedAt)),
          h('dt', {}, '탐지 중단'),  h('dd', {}, group.pauseStatus === 'paused' ? mkBd('bdg-warn','중단중') : mkBd('bdg-ok','정상'))
        ),
        h('div', { class: 'flex gap-8 mt-20' },
          h('button', { class: 'btn btn-p', onClick: () => toast('저장되었습니다.') }, '저장'),
          h('button', { class: 'btn btn-d', onClick: () => confirm('이 그룹을 삭제하시겠습니까?', () => { toast('삭제되었습니다.', 'warn'); navigate('groups-list'); }) }, '삭제')
        )
      ));
    } else if (activeTab === 'devices') {
      const groupDevices = DUMMY.devices.filter(d => d.groupId === id);
      tabContent.appendChild(mkTable([
        { key:'name', label:'단말 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();openPanel(renderDeviceDetailPanel(r.deviceId))});return a;}},
        { key:'identifier', label:'식별자' },
        { key:'status', label:'상태', width:'90px', render: v => statusBadge(v) },
        { key:'policyStatus', label:'정책 상태', width:'90px', render: v => statusBadge(v) },
        { key:'lastContact', label:'최근 접속', render: v => fmtDT(v) },
      ], groupDevices, (row) => openPanel(renderDeviceDetailPanel(row.deviceId))));
    } else if (activeTab === 'policies') {
      const applied = DUMMY.policies.filter(p => p.active).slice(0, group.policyCount);
      tabContent.appendChild(mkTable([
        { key:'name', label:'정책 이름' },
        { key:'desc', label:'설명' },
        { key:'type', label:'탐지 유형', width:'90px', render: (_,r) => policyTypeBadge(r) },
        { key:'appliedCount', label:'적용 그룹 수', width:'100px', render: v => `${v}개` },
        { key:'_action', label:'', width:'80px', render:(_,r)=>{const btn=h('button',{class:'btn btn-outline btn-xs'},'해제');btn.addEventListener('click',e=>{e.stopPropagation();toast('정책이 해제되었습니다.','warn');});return btn;}},
      ], applied));
      tabContent.appendChild(h('div', { class: 'mt-16' },
        h('button', { class: 'btn btn-p btn-sm', onClick: () => toast('정책 적용 다이얼로그 (구현예정)','info') }, '정책 추가')
      ));
    } else if (activeTab === 'pauses') {
      const groupPauses = DUMMY.pauses.filter(p => p.groupId === id);
      tabContent.appendChild(mkTable([
        { key:'pauseType', label:'중단 유형', width:'90px' },
        { key:'requester', label:'요청자' },
        { key:'startAt', label:'시작', render: v => fmtDT(v) },
        { key:'endAt', label:'종료', render: v => fmtDT(v) },
        { key:'reason', label:'사유' },
        { key:'status', label:'상태', width:'90px', render: v => {
          if (v==='ACTIVE') return mkBd('bdg-warn','진행중');
          if (v==='EXPIRED') return mkBd('bdg-muted','만료');
          return mkBd('bdg-muted','취소');
        }},
      ], groupPauses));
    }
  }

  const tabs = h('div', { class: 'tabs' },
    ...[
      { id:'info', label:'기본정보' },
      { id:'devices', label:`단말목록 (${group.deviceCount})` },
      { id:'policies', label:'적용정책' },
      { id:'pauses', label:'탐지중단현황' },
    ].map(t => {
      const tab = h('div', { class: 'tab' + (t.id === activeTab ? ' a' : '') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTab();
      });
      return tab;
    })
  );
  page.appendChild(tabs);
  page.appendChild(tabContent);
  renderTab();
  return page;
}

/* ----------------------------------------------------------
   DEVICE LIST
---------------------------------------------------------- */
function renderDeviceList() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '단말 목록'),
      h('div', { class: 'ph-sub' }, `총 ${DUMMY.devices.length}대 등록`)
    ),
    h('div', { class: 'ph-actions' },
      h('button', { class: 'btn btn-p', onClick: () => toast('단말기 등록 기능은 MDM에서 처리됩니다.','info') }, '+ 단말기 등록')
    )
  ));

  const active = DUMMY.devices.filter(d => d.status === 'online').length;
  const inactive = DUMMY.devices.filter(d => d.status === 'offline').length;

  function showLicensePopup() {
    const activeByOS = {};
    DUMMY.devices.forEach(d => { if (d.status==='online') activeByOS[d.os]=(activeByOS[d.os]||0)+1; });
    const TH = 'padding:10px 14px;font-size:12px;font-weight:600;color:var(--t2);border-bottom:2px solid var(--bd);text-align:center;background:#f8fafc';
    const TD = 'padding:10px 14px;font-size:13px;text-align:center;border-bottom:1px solid var(--bd)';
    const TDF = 'padding:10px 14px;font-size:13px;font-weight:700;text-align:center;background:#eff6ff;color:#1e40af';
    const totDevices = DUMMY.licenses.reduce((s,l)=>s+l.devices,0);
    const totUsed = DUMMY.licenses.reduce((s,l)=>s+l.usedDevices,0);
    const totActive = Object.values(activeByOS).reduce((s,v)=>s+v,0);
    const tbl = h('table', { style:'width:100%;border-collapse:collapse' },
      h('thead', {}, h('tr', {},
        h('th', { style:TH+';text-align:left' }, 'OS'),
        h('th', { style:TH }, '수량'),
        h('th', { style:TH }, '사용 단말'),
        h('th', { style:TH }, '활성 단말')
      )),
      h('tbody', {},
        ...DUMMY.licenses.map(l => h('tr', {},
          h('td', { style:TD+';text-align:left;font-weight:500;color:var(--t1)' }, l.os),
          h('td', { style:TD }, String(l.devices)),
          h('td', { style:TD }, `${l.usedDevices} / ${l.devices}`),
          h('td', { style:TD+';color:#22c55e;font-weight:600' }, activeByOS[l.os]||0)
        )),
        h('tr', {},
          h('td', { style:TDF+';text-align:left' }, '합계'),
          h('td', { style:TDF }, String(totDevices)),
          h('td', { style:TDF }, `${totUsed} / ${totDevices}`),
          h('td', { style:TDF }, totActive)
        )
      )
    );
    const overlay = h('div', { style:'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1000;display:flex;align-items:center;justify-content:center' });
    const modal = h('div', { style:'background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.18);width:560px;max-width:92vw;overflow:hidden' },
      h('div', { style:'display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid var(--bd)' },
        h('div', { style:'font-size:16px;font-weight:700;color:var(--t1)' }, '전체 라이선스 현황'),
        h('button', { style:'background:none;border:none;font-size:20px;color:var(--t2);cursor:pointer;line-height:1;padding:0 2px', onClick: () => overlay.remove() }, '×')
      ),
      h('div', { style:'padding:20px 24px' }, tbl)
    );
    overlay.appendChild(modal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // Merged KPI card: 전체 라이선스 + 활성 단말
  const mergedKpi = h('div', { class: 'kpi', style:'display:flex;flex-direction:column;gap:0' },
    h('div', { style:'display:flex;align-items:flex-start;justify-content:flex-start;gap:32px' },
      h('div', {},
        h('div', { class: 'kpi-l' }, '전체 라이선스'),
        h('div', { class: 'kpi-v' }, String(DUMMY.licenses.totalLicenses || DUMMY.devices.length))
      ),
      h('div', { style:'width:1px;background:var(--bd);align-self:stretch;flex-shrink:0' }),
      h('div', {},
        h('div', { class: 'kpi-l' }, '활성 단말'),
        h('div', { class: 'kpi-v ok' }, String(active))
      )
    ),
    h('div', { style:'display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--bd)' },
      h('div', { class: 'kpi-s' }, '라이선스 한도 · 현재 접속 중'),
      h('button', { class: 'btn btn-outline btn-sm', style:'padding:2px 10px;font-size:11px;height:auto;line-height:1.6', onClick: (e) => { e.stopPropagation(); showLicensePopup(); } }, '현황 보기')
    )
  );
  page.appendChild(h('div', { class: 'section-gap' }, mergedKpi));

  const searchInp = h('input', { class: 'inp search', placeholder: '단말 이름 또는 식별자 검색...', type: 'text' });
  const groupSelect = h('select', { class: 'inp', style: { maxWidth: '160px' } },
    h('option', { value: '' }, '전체 그룹'),
    ...DUMMY.groups.map(g => h('option', { value: g.groupId }, g.name))
  );
  const statusSelect = h('select', { class: 'inp', style: { maxWidth: '120px' } },
    h('option', { value: '' }, '전체 상태'),
    h('option', { value: 'online' }, '활성'),
    h('option', { value: 'offline' }, '비활성')
  );

  const DEV_PAGE_SIZE = 20;
  let devPage = 1;

  const tableWrap = h('div', { style:'overflow-y:auto;max-height:calc(100vh - 340px)' });
  const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:center;margin-top:8px;font-size:13px;color:#64748b;flex-shrink:0' });

  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const g = groupSelect.value;
    const s = statusSelect.value;
    const filtered = DUMMY.devices.filter(d => {
      if (q && !d.name.toLowerCase().includes(q) && !d.identifier.toLowerCase().includes(q)) return false;
      if (g && d.groupId !== g) return false;
      if (s && d.status !== s) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / DEV_PAGE_SIZE));
    if (devPage > totalPages) devPage = 1;
    const pageData = filtered.slice((devPage-1)*DEV_PAGE_SIZE, devPage*DEV_PAGE_SIZE);

    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'name', label:'단말 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();openPanel(renderDeviceDetailPanel(r.deviceId))});return a;}},
      { key:'identifier', label:'식별자', render: v => h('span', { class: 'text-t3', style:{fontFamily:'monospace',fontSize:'12px'} }, v) },
      { key:'os', label:'OS', width:'110px' },
      { key:'model', label:'모델', width:'120px' },
      { key:'status', label:'상태', width:'90px', render: v => v==='online' ? mkBd('bdg-ok','활성') : mkBd('bdg-err','비활성') },
      { key:'lastContact', label:'최근 접속', render: v => fmtDT(v) },
    ], pageData, (row) => openPanel(renderDeviceDetailPanel(row.deviceId))));

    pageWrap.innerHTML = '';
    pageWrap.appendChild(mkPagination(devPage, totalPages, (p) => { devPage = p; renderTable(); }));
  }
  searchInp.addEventListener('input', () => { devPage = 1; renderTable(); });
  groupSelect.addEventListener('change', () => { devPage = 1; renderTable(); });
  statusSelect.addEventListener('change', () => { devPage = 1; renderTable(); });

  page.appendChild(h('div', { class: 'fb' }, searchInp, groupSelect, statusSelect));
  page.appendChild(tableWrap);
  page.appendChild(pageWrap);
  renderTable();
  return page;
}

/* ----------------------------------------------------------
   DEVICE DETAIL
---------------------------------------------------------- */
function renderDeviceDetail(id) {
  const device = DUMMY.devices.find(d => d.deviceId === id) || DUMMY.devices[0];
  const page = h('div', {});

  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, device.name),
      h('div', { class: 'ph-sub' }, device.identifier)
    ),
    h('div', { class: 'ph-actions' },
      statusBadge(device.status),
      h('button', { class: 'btn btn-outline', onClick: () => navigate('devices-list') }, '← 목록')
    )
  ));

  let activeTab = 'info';
  const tabContent = h('div', {});

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      tabContent.appendChild(h('div', { class: 'card', style: { maxWidth: '560px' } },
        h('dl', { class: 'info-row' },
          h('dt',{},'단말 이름'),     h('dd',{},device.name),
          h('dt',{},'식별자'),        h('dd',{ style:{fontFamily:'monospace',fontSize:'12px',color:'var(--t2)'} }, device.identifier),
          h('dt',{},'모델'),          h('dd',{},device.model || '—'),
          h('dt',{},'OS 버전'),       h('dd',{},device.os || '—'),
          h('dt',{},'접속 상태'),     h('dd',{},statusBadge(device.status)),
          h('dt',{},'정책 상태'),     h('dd',{},statusBadge(device.policyStatus)),
          h('dt',{},'최근 접속'),     h('dd',{},fmtDT(device.lastContact))
        ),
        h('div', { class: 'flex gap-8 mt-20' },
          h('button', { class: 'btn btn-warn btn-sm', onClick: () => toast('원격 잠금이 실행됩니다.','warn') }, '🔒 원격 잠금'),
          h('button', { class: 'btn btn-outline btn-sm', onClick: () => toast('정책을 재전송합니다.','info') }, '정책 재전송')
        )
      ));
    } else if (activeTab === 'group') {
      const group = DUMMY.groups.find(g => g.groupId === device.groupId);
      tabContent.appendChild(h('div', { class: 'card', style: { maxWidth: '560px' } },
        h('div', { class: 'card-title' }, '소속 그룹 정보'),
        group ?
          h('dl', { class: 'info-row' },
            h('dt',{},'그룹 이름'), h('dd',{}, h('a',{href:'#',onClick:e=>{e.preventDefault();navigate('groups-detail',group.groupId)}},group.name)),
            h('dt',{},'학교'),      h('dd',{},(()=>{ const sc = DUMMY.schools.find(s=>s.schoolId===group.schoolId); return sc ? sc.name : '—'; })()),
            h('dt',{},'단말 수'),   h('dd',{},`${group.deviceCount}대`),
            h('dt',{},'상태'),      h('dd',{},statusBadge(group.status))
          ) :
          h('div', { class: 'empty' }, h('div',{class:'empty-title'},'소속 그룹 없음'))
        ,
        h('div', { class: 'mt-16' },
          h('button', { class: 'btn btn-s btn-sm', onClick: () => toast('그룹 변경 기능 (구현예정)','info') }, '그룹 변경')
        )
      ));
    } else if (activeTab === 'policy') {
      const policies = DUMMY.policies.filter(p => p.active).slice(0, 2);
      tabContent.appendChild(h('div', { class: 'card-title' }, '적용된 정책'));
      tabContent.appendChild(mkTable([
        { key:'name', label:'정책 이름' },
        { key:'desc', label:'설명' },
        { key:'types', label:'탐지 유형', render: v => h('div', { class: 'flex gap-8' }, ...v.map(t => detTypeBadge(t))) },
        { key:'updatedAt', label:'적용일', render: v => fmtD(v) },
      ], policies));
    } else if (activeTab === 'history') {
      const detHist = DUMMY.detections.filter(d => d.deviceId === id).slice(0, 8);
      if (detHist.length === 0) {
        tabContent.appendChild(h('div', { class: 'empty' },
          h('div',{class:'empty-icon'},'—'),
          h('div',{class:'empty-title'},'탐지 이력이 없습니다')
        ));
      } else {
        tabContent.appendChild(mkTable([
          { key:'detectedAt', label:'탐지 시각', render: v => fmtDT(v) },
          { key:'type', label:'유형', width:'80px', render: v => detTypeBadge(v) },
          { key:'policy', label:'정책' },
          { key:'status', label:'상태', width:'90px', render: v => statusBadge(v) },
        ], detHist));
      }
    }
  }

  const tabs = h('div', { class: 'tabs' },
    ...[
      {id:'info', label:'기본정보'},
      {id:'group', label:'그룹정보'},
      {id:'policy', label:'적용정책'},
      {id:'history', label:'탐지이력'},
    ].map(t => {
      const tab = h('div', { class: 'tab' + (t.id === activeTab ? ' a' : '') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTab();
      });
      return tab;
    })
  );
  page.appendChild(tabs);
  page.appendChild(tabContent);
  renderTab();
  return page;
}

/* ----------------------------------------------------------
   DEVICE GENERATOR
---------------------------------------------------------- */
const _MODELS = ['iPad 10th Gen','iPad 9th Gen','iPad Air 5','iPad mini 6','iPad Pro 11'];
const _OS     = ['iPadOS 17.4','iPadOS 17.3','iPadOS 17.2','iPadOS 16.7','iPadOS 16.5'];
const _DATES  = ['2026-03-17 14:','2026-03-17 13:','2026-03-17 12:','2026-03-16 17:','2026-03-16 15:','2026-03-15 09:'];
const _MINS   = ['05','12','18','22','30','35','45','55'];

function generateGroupDevices(group) {
  const real = DUMMY.devices.filter(d => d.groupId === group.groupId);
  const realIds = new Set(real.map(d => d.deviceId));
  const total = group.deviceCount;
  const result = [...real];
  for (let i = result.length; i < total; i++) {
    const n = i + 1;
    const isOnline = (i % 5) !== 3;
    const dateStr = _DATES[i % _DATES.length] + _MINS[i % _MINS.length];
    result.push({
      deviceId: `gen-${group.groupId}-${n}`,
      name: `iPad-${String(n).padStart(3,'0')}`,
      identifier: [...Array(10)].map((_,j)=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[(n*7+j*13)%36]).join(''),
      groupId: group.groupId,
      groupName: group.name,
      status: isOnline ? 'online' : 'offline',
      policyStatus: (i % 7 === 0) ? 'pending' : 'applied',
      lastContact: dateStr,
      model: _MODELS[i % _MODELS.length],
      os: _OS[i % _OS.length],
    });
  }
  return result;
}

/* ----------------------------------------------------------
   POLICY HELPERS
---------------------------------------------------------- */
const DETECTION_ITEMS = ['배','여성가슴','남성가슴','엉덩이','여성성기','남성성기'];
const GAMBLING_GRADES = ['상','중','하'];

function policyTypeBadge(policy) {
  const color = policy.type === '선정성' ? 'bdg-err' : 'bdg-warn';
  return mkBd(color, policy.type || '—');
}

function policyDetectSummary(policy) {
  if (policy.type === '선정성') {
    const items = policy.detectionItems || [];
    if (items.length === 0) return '—';
    return items.slice(0,2).join(', ') + (items.length > 2 ? ` 외 ${items.length - 2}개` : '');
  } else if (policy.type === '도박') {
    return policy.grade ? `탐지등급 ${policy.grade}` : '—';
  }
  return '—';
}

/* ----------------------------------------------------------
   POLICY LIST
---------------------------------------------------------- */
function renderPolicyList() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '정책 목록'),
      h('div', { class: 'ph-sub' }, `총 ${DUMMY.policies.length}개 정책`)
    ),
    h('div', { class: 'ph-actions' },
      h('button', { class: 'btn btn-p', onClick: () => navigate('policies-new') }, '+ 정책 생성')
    )
  ));

  // 탭
  let activeTab = '전체'; // '전체' | '선정성' | '도박'
  const tabBar = h('div', { style:'display:flex;gap:0;border-bottom:2px solid var(--bd);margin-bottom:16px' });
  ['전체','선정성','도박'].forEach(tab => {
    const tabEl = h('div', {
      style:`padding:8px 20px;font-size:14px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .15s,border-color .15s;color:#94a3b8`
    }, tab);
    if (tab === activeTab) {
      tabEl.style.color = 'var(--ac)';
      tabEl.style.borderBottomColor = 'var(--ac)';
    }
    tabEl.addEventListener('click', () => {
      activeTab = tab;
      polPage = 1;
      [...tabBar.children].forEach((c,i) => {
        const t = ['전체','선정성','도박'][i];
        c.style.color = t === activeTab ? 'var(--ac)' : '#94a3b8';
        c.style.borderBottomColor = t === activeTab ? 'var(--ac)' : 'transparent';
      });
      renderTable();
    });
    tabBar.appendChild(tabEl);
  });
  page.appendChild(tabBar);

  // 검색 필터
  const searchInp = h('input', { class: 'inp search', placeholder: '정책 이름 검색...', type: 'text' });
  const activeSelect = h('select', { class: 'inp', style: { maxWidth: '120px' } },
    h('option', { value: '' }, '전체'),
    h('option', { value: 'true' }, '활성'),
    h('option', { value: 'false' }, '비활성')
  );
  page.appendChild(h('div', { class: 'fb', style:'margin-bottom:16px' }, searchInp, activeSelect));

  // KPI 카드
  const active = DUMMY.policies.filter(p => p.active).length;
  const kpiWrap = h('div', { class: 'grid-4 section-gap' });
  function renderKPI() {
    const tabPolicies = activeTab === '전체' ? DUMMY.policies : DUMMY.policies.filter(p => p.type === activeTab);
    const act = tabPolicies.filter(p => p.active).length;
    kpiWrap.innerHTML = '';
    kpiWrap.appendChild(mkKPI('전체 정책', tabPolicies.length, '', ''));
    kpiWrap.appendChild(mkKPI('활성 정책', act, '', 'ok'));
    kpiWrap.appendChild(mkKPI('비활성', tabPolicies.length - act, '', 'err'));
    kpiWrap.appendChild(mkKPI('적용 그룹', tabPolicies.reduce((a,p)=>a+p.appliedCount,0), '총 그룹 적용 수', 'ac'));
  }
  page.appendChild(kpiWrap);

  const POL_PAGE_SIZE = 20;
  let polPage = 1;

  const tableWrap = h('div', { style:'overflow-y:auto;max-height:calc(100vh - 360px)' });
  const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:13px;color:#64748b;flex-shrink:0' });

  function renderTable() {
    renderKPI();
    const q = searchInp.value.toLowerCase();
    const a = activeSelect.value;
    const filtered = DUMMY.policies.filter(p => {
      if (activeTab !== '전체' && p.type !== activeTab) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (a !== '' && String(p.active) !== a) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / POL_PAGE_SIZE));
    if (polPage > totalPages) polPage = 1;
    const pageData = filtered.slice((polPage-1)*POL_PAGE_SIZE, polPage*POL_PAGE_SIZE);

    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'type', label:'탐지 유형', width:'90px', render:(_,r) => policyTypeBadge(r) },
      { key:'name', label:'정책 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openPanel(renderPolicyDetailPanel(r.policyId))});return a;}},
      { key:'desc', label:'설명' },
      { key:'_detect', label:'탐지 내용', render:(_,r) => h('span',{style:'font-size:13px;color:#374151'}, policyDetectSummary(r)) },
      { key:'appliedCount', label:'적용 그룹', width:'90px', render: v => `${v}개` },
      { key:'active', label:'상태', width:'80px', render: v => v ? mkBd('bdg-ok','활성') : mkBd('bdg-err','비활성') },
      { key:'updatedAt', label:'수정일', render: v => fmtD(v) },
    ], pageData, (row) => openPanel(renderPolicyDetailPanel(row.policyId))));

    pageWrap.innerHTML = '';
    pageWrap.appendChild(mkPagination(polPage, totalPages, (p) => { polPage = p; renderTable(); }));
  }
  searchInp.addEventListener('input', () => { polPage = 1; renderTable(); });
  activeSelect.addEventListener('change', () => { polPage = 1; renderTable(); });

  page.appendChild(tableWrap);
  page.appendChild(pageWrap);
  renderTable();
  return page;
}

/* ----------------------------------------------------------
   POLICY NEW
---------------------------------------------------------- */
function renderPolicyNew() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '정책 생성'),
      h('div', { class: 'ph-sub' }, '새로운 탐지 정책을 생성합니다')
    )
  ));

  const nameInp = h('input', { class: 'inp', placeholder: '정책 이름', type: 'text' });
  const descInp = h('textarea', { class: 'inp', placeholder: '정책 설명', style:{ minHeight:'80px' } });
  const activeCheck = h('input', { type: 'checkbox', checked: true });

  const typeChecks = ['선정성','도박','폭력','혐오','마약','기타'].map(t => {
    const chk = h('input', { type: 'checkbox' });
    const row = h('label', { class: 'checkbox-row' }, chk, t);
    return { el: row, input: chk, label: t };
  });

  function submit() {
    nameInp.classList.remove('error');
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); toast('정책 이름을 입력해주세요.','err'); return; }
    const selected = typeChecks.filter(t => t.input.checked).map(t => t.label);
    if (selected.length === 0) { toast('최소 하나 이상의 탐지 유형을 선택해주세요.','err'); return; }
    toast('정책이 생성되었습니다.');
    navigate('policies-list');
  }

  const card = h('div', { class: 'card', style: { maxWidth: '560px' } },
    h('div', { class: 'section-gap' }, fg('정책 이름', nameInp, true)),
    h('div', { class: 'section-gap' }, fg('정책 설명', descInp, false)),
    h('div', { class: 'fg section-gap' },
      h('label', {}, '탐지 유형', h('span', { class: 'req' }, ' *')),
      h('div', { style: { display:'flex', flexWrap:'wrap', gap:'12px', marginTop:'4px' } },
        ...typeChecks.map(t => t.el)
      )
    ),
    h('label', { class: 'checkbox-row mt-16' }, activeCheck, '활성화'),
    h('div', { class: 'flex gap-8 mt-20' },
      h('button', { class: 'btn btn-outline', onClick: () => navigate('policies-list') }, '취소'),
      h('button', { class: 'btn btn-p', onClick: submit }, '정책 생성')
    )
  );
  page.appendChild(card);
  return page;
}

/* ----------------------------------------------------------
   POLICY DETAIL (reused as edit page)
---------------------------------------------------------- */
function renderPolicyDetail(id) {
  const policy = DUMMY.policies.find(p => p.policyId === id) || DUMMY.policies[0];
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, policy.name),
      h('div', { class: 'ph-sub' }, policy.desc)
    ),
    h('div', { class: 'ph-actions' },
      policy.active ? mkBd('bdg-ok','활성') : mkBd('bdg-err','비활성'),
      h('button', { class: 'btn btn-outline', onClick: () => navigate('policies-list') }, '← 목록')
    )
  ));

  const nameInp = h('input', { class: 'inp', value: policy.name, type: 'text' });
  const descInp = h('textarea', { class: 'inp', style:{ minHeight:'80px' } }, policy.desc);
  const typeChecks = ['선정성','도박','폭력','혐오','마약','기타'].map(t => {
    const chk = h('input', { type: 'checkbox' });
    if (policy.type === t) chk.checked = true;
    return { el: h('label', { class: 'checkbox-row' }, chk, t), input: chk, label: t };
  });
  const activeCheck = h('input', { type: 'checkbox' });
  if (policy.active) activeCheck.checked = true;

  // Applied groups table
  const appliedGroups = DUMMY.groups.slice(0, policy.appliedCount);

  const card = h('div', { class: 'card', style: { maxWidth: '560px' } },
    h('div', { class: 'section-gap' }, fg('정책 이름', nameInp, true)),
    h('div', { class: 'section-gap' }, fg('정책 설명', descInp, false)),
    h('div', { class: 'fg section-gap' },
      h('label', {}, '탐지 유형'),
      h('div', { style: { display:'flex', flexWrap:'wrap', gap:'12px', marginTop:'4px' } }, ...typeChecks.map(t => t.el))
    ),
    h('label', { class: 'checkbox-row mt-16' }, activeCheck, '활성화'),
    h('div', { class: 'flex gap-8 mt-20' },
      h('button', { class: 'btn btn-p', onClick: () => toast('정책이 저장되었습니다.') }, '저장'),
      h('button', { class: 'btn btn-d', onClick: () => confirm('이 정책을 삭제하시겠습니까?', () => { toast('삭제되었습니다.','warn'); navigate('policies-list'); }) }, '삭제')
    )
  );
  page.appendChild(card);

  // Applied groups
  page.appendChild(h('div', { class: 'card-title mt-20 mb-16' }, `적용 그룹 (${policy.appliedCount}개)`));
  page.appendChild(mkTable([
    { key:'_school', label:'학교', render:(_,r)=>{
      const sch = DUMMY.schools.find(s => s.schoolId === r.schoolId) || {};
      const a = h('a',{href:'#'}, sch.name || r.name);
      a.addEventListener('click',e=>{e.preventDefault();navigate('groups-detail',r.groupId)});
      return a;
    }},
    { key:'_type', label:'학교유형', width:'90px', render:(_,r)=>{
      const sch = DUMMY.schools.find(s => s.schoolId === r.schoolId) || {};
      return sch.type || '—';
    }},
    { key:'deviceCount', label:'단말 수', width:'80px', render:v=>`${v}대`},
    { key:'status', label:'상태', width:'80px', render:v=>statusBadge(v)},
  ], appliedGroups));
  return page;
}

/* ----------------------------------------------------------
   DETECTIONS
---------------------------------------------------------- */
function renderDetections() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '탐지 현황'),
      h('div', { class: 'ph-sub' }, `총 ${DUMMY.detections.length}건`)
    )
  ));

  const typeCounts = DUMMY.detections.reduce((acc,d) => { acc[d.type]=(acc[d.type]||0)+1; return acc; }, {});
  page.appendChild(h('div', { class: 'grid-3 section-gap' },
    mkKPI('전체 탐지', DUMMY.detections.length, '', ''),
    mkKPI('선정성', typeCounts['선정성']||0, '', 'err'),
    mkKPI('도박', typeCounts['도박']||0, '', 'warn')
  ));

  const DET_PAGE_SIZE = 20;
  let detPage = 1;

  let activeTab = 'all';
  const tableWrap = h('div', { style:'overflow-y:auto;max-height:calc(100vh - 360px)' });
  const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:13px;color:#64748b;flex-shrink:0' });
  const searchInp = h('input', { class: 'inp search', placeholder: '단말 검색...', type: 'text' });
  const dateInp = h('input', { class: 'inp', type: 'date', style: { maxWidth: '160px' } });

  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const d = dateInp.value;
    let data = DUMMY.detections;
    if (activeTab !== 'all') data = data.filter(e => e.type === activeTab);
    data = data.filter(e => {
      if (q && !e.deviceName.toLowerCase().includes(q)) return false;
      if (d && !e.detectedAt.startsWith(d)) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(data.length / DET_PAGE_SIZE));
    if (detPage > totalPages) detPage = 1;
    const pageData = data.slice((detPage-1)*DET_PAGE_SIZE, detPage*DET_PAGE_SIZE);

    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'detectedAt', label:'탐지 시각', width:'150px', render: v => fmtDT(v) },
      { key:'type', label:'유형', width:'80px', render: v => detTypeBadge(v) },
      { key:'deviceName', label:'단말', width:'100px' },
      { key:'policy', label:'탐지 정책' },
      { key:'content', label:'URL/도메인', width:'160px', render:(v,r) => {
        if (!r || r.type !== '도박' || !v || !v.length) return h('span',{style:'color:#94a3b8'},'—');
        return h('span', { style:'font-size:12px;color:#475569;font-family:monospace' }, v[0]);
      }},
    ], pageData, row => navigate('detections-detail', row.detId)));

    pageWrap.innerHTML = '';
    pageWrap.appendChild(mkPagination(detPage, totalPages, (p) => { detPage = p; renderTable(); }));
  }
  searchInp.addEventListener('input', () => { detPage = 1; renderTable(); });
  dateInp.addEventListener('change', () => { detPage = 1; renderTable(); });

  const tabs = h('div', { class: 'tabs' },
    ...[
      { id:'all', label:`전체 (${DUMMY.detections.length})` },
      { id:'선정성', label:`선정성 (${typeCounts['선정성']||0})` },
      { id:'도박', label:`도박 (${typeCounts['도박']||0})` },
    ].map(t => {
      const tab = h('div', { class: 'tab' + (t.id === activeTab ? ' a' : '') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        detPage = 1;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTable();
      });
      return tab;
    })
  );
  page.appendChild(tabs);
  page.appendChild(h('div', { class: 'fb' }, searchInp, dateInp));
  page.appendChild(tableWrap);
  page.appendChild(pageWrap);
  renderTable();
  return page;
}

/* -- Detection Detail Panel -- */
function renderDetectionDetailPanel(id) {
  const det = DUMMY.detections.find(d => d.detId === id) || DUMMY.detections[0];

  let currentStatus = det.status;
  const statusEl = h('dd', {}, statusBadge(currentStatus));
  const noteInp = h('textarea', { class:'inp', placeholder:'처리 메모 입력...', style:'min-height:72px' });

  const body = h('div', {},
    h('dl', { class:'info-row' },
      h('dt',{},'탐지 시각'), h('dd',{},fmtDT(det.detectedAt)),
      h('dt',{},'탐지 유형'), h('dd',{},detTypeBadge(det.type)),
      h('dt',{},'그룹'),      h('dd',{},det.groupName),
      h('dt',{},'단말'),      h('dd',{},det.deviceName),
      h('dt',{},'탐지 정책'), h('dd',{},det.policy),
      h('dt',{},'처리 상태'), statusEl
    ),
    h('div', { class:'sep' }),
    fg('메모', noteInp, false)
  );

  function setStatus(val, label) {
    currentStatus = val;
    det.status = val;
    statusEl.innerHTML = '';
    statusEl.appendChild(statusBadge(val));
    toast(`${label} 처리되었습니다.`);
    closePanel();
  }

  const confirmBtn = h('button', { class:'btn btn-ok'      }, '확인');
  const reviewBtn  = h('button', { class:'btn btn-warn'    }, '검토');
  const dismissBtn = h('button', { class:'btn btn-outline' }, '무시');

  confirmBtn.addEventListener('click', () => setStatus('confirmed', '확인'));
  reviewBtn.addEventListener('click',  () => setStatus('reviewing', '검토'));
  dismissBtn.addEventListener('click', () => setStatus('dismissed', '무시'));

  return h('div', { style:'display:flex;flex-direction:column;height:100%' },
    h('div', { class:'mod-h' },
      h('button', { class:'cx', onClick: () => closePanel() }, '✕'),
      h('h2', {}, '탐지 상세')
    ),
    h('div', { class:'mod-b', style:'flex:1;overflow-y:auto' }, body),
    h('div', { class:'mod-f' },
      h('div', {}),
      h('div', { class:'mod-f-right' }, confirmBtn, reviewBtn, dismissBtn)
    )
  );
}

/* ----------------------------------------------------------
   USER LIST
---------------------------------------------------------- */
function renderUserList() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '사용자 목록'),
      h('div', { class: 'ph-sub' }, `총 ${DUMMY.users.length}명`)
    ),
    h('div', { class: 'ph-actions' },
      h('button', { class: 'btn btn-p', onClick: () => navigate('users-new') }, '+ 사용자 등록')
    )
  ));

  const roleCount = DUMMY.users.reduce((a,u) => { a[u.role]=(a[u.role]||0)+1; return a; }, {});
  page.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('전체 사용자', DUMMY.users.length, '', ''),
    mkKPI('관리자', roleCount['admin']||0, '', 'ac'),
    mkKPI('운영자', roleCount['staff']||0, '', ''),
    mkKPI('교사', roleCount['teacher']||0, '', 'ok')
  ));

  const searchInp = h('input', { class: 'inp search', placeholder: '이름 또는 아이디 검색...', type: 'text' });
  const roleSelect = h('select', { class: 'inp', style:{ maxWidth:'120px' } },
    h('option', { value: '' }, '전체 역할'),
    h('option', { value: 'admin' }, '관리자'),
    h('option', { value: 'staff' }, '운영자'),
    h('option', { value: 'teacher' }, '교사')
  );
  const statusSelect = h('select', { class: 'inp', style:{ maxWidth:'120px' } },
    h('option', { value: '' }, '전체 상태'),
    h('option', { value: 'active' }, '활성'),
    h('option', { value: 'inactive' }, '비활성')
  );

  const USR_PAGE_SIZE = 20;
  let usrPage = 1;

  const tableWrap = h('div', { style:'overflow-y:auto;max-height:calc(100vh - 340px)' });
  const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:13px;color:#64748b;flex-shrink:0' });

  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const r = roleSelect.value;
    const s = statusSelect.value;
    const filtered = DUMMY.users.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) && !u.username.toLowerCase().includes(q)) return false;
      if (r && u.role !== r) return false;
      if (s && u.status !== s) return false;
      return true;
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / USR_PAGE_SIZE));
    if (usrPage > totalPages) usrPage = 1;
    const pageData = filtered.slice((usrPage-1)*USR_PAGE_SIZE, usrPage*USR_PAGE_SIZE);

    const roleLabel = { admin:'관리자', staff:'운영자', teacher:'교사' };
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'name', label:'이름', render:(v,r2)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();navigate('users-detail',r2.userId)});return a;}},
      { key:'username', label:'아이디', render: v => h('span', { class: 'text-t2', style:{fontFamily:'monospace',fontSize:'12px'} }, v) },
      { key:'role', label:'역할', width:'80px', render: v => {
        const cls = v==='admin'?'bdg-ac':v==='staff'?'bdg-ok':'bdg-muted';
        return mkBd(cls, roleLabel[v]||v);
      }},
      { key:'contact', label:'연락처', width:'130px' },
      { key:'status', label:'상태', width:'80px', render: v => statusBadge(v) },
      { key:'assignments', label:'담당 학교', render: v => {
        if (!v || v.length === 0) return '—';
        return v.map(a => {
          const grp = DUMMY.groups.find(g => g.groupId === a.groupId);
          const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
          return sch ? sch.name : '—';
        }).filter((n,i,arr)=>arr.indexOf(n)===i).join(', ');
      }},
      { key:'lastLogin', label:'최근 로그인', render: v => fmtDT(v) },
    ], pageData, (row) => navigate('users-detail', row.userId)));

    pageWrap.innerHTML = '';
    pageWrap.appendChild(mkPagination(usrPage, totalPages, (p) => { usrPage = p; renderTable(); }));
  }
  searchInp.addEventListener('input', () => { usrPage = 1; renderTable(); });
  roleSelect.addEventListener('change', () => { usrPage = 1; renderTable(); });
  statusSelect.addEventListener('change', () => { usrPage = 1; renderTable(); });

  page.appendChild(h('div', { class: 'fb' }, searchInp, roleSelect, statusSelect));
  page.appendChild(tableWrap);
  page.appendChild(pageWrap);
  renderTable();
  return page;
}

/* ----------------------------------------------------------
   USER NEW
---------------------------------------------------------- */
function renderUserNew() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '사용자 등록'),
      h('div', { class: 'ph-sub' }, '새 관리자, 운영자, 또는 교사를 등록합니다')
    )
  ));

  const nameInp    = h('input', { class: 'inp', placeholder: '홍길동', type: 'text' });
  const usernameInp= h('input', { class: 'inp', placeholder: 'user@school.kr', type: 'text' });
  const pwInp      = h('input', { class: 'inp', placeholder: '비밀번호', type: 'password' });
  const pw2Inp     = h('input', { class: 'inp', placeholder: '비밀번호 확인', type: 'password' });
  const roleSelect = h('select', { class: 'inp' },
    h('option', { value: '' }, '역할 선택'),
    h('option', { value: 'admin' }, '관리자'),
    h('option', { value: 'staff' }, '운영자'),
    h('option', { value: 'teacher' }, '교사')
  );
  const contactInp = h('input', { class: 'inp', placeholder: '010-0000-0000', type: 'text' });

  // Assignments for teacher role
  const assignWrap = h('div', { style: { display: 'none' } });
  const gradeAssign = h('select', { class: 'inp' },
    h('option',{value:''},'학년 선택'),
    h('option',{value:'1'},'1학년'),h('option',{value:'2'},'2학년'),h('option',{value:'3'},'3학년')
  );
  const clsAssign = h('select', { class: 'inp' },
    h('option',{value:''},'반 선택'),
    ...[1,2,3,4,5].map(i=>h('option',{value:String(i)},i+'반'))
  );
  assignWrap.appendChild(h('div', { class: 'fg' },
    h('label',{},'담당 학급'),
    h('div', { class: 'flex gap-8' }, gradeAssign, clsAssign),
    h('div', { class: 'text-t3', style:{fontSize:'11.5px',marginTop:'4px'} }, '교사 역할 선택 시 담당 학급을 지정합니다')
  ));

  roleSelect.addEventListener('change', () => {
    assignWrap.style.display = roleSelect.value === 'teacher' ? 'block' : 'none';
  });

  function submit() {
    [nameInp, usernameInp, pwInp, roleSelect].forEach(el => el.classList.remove('error'));
    let valid = true;
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); valid = false; }
    if (!usernameInp.value.trim()) { usernameInp.classList.add('error'); valid = false; }
    if (!pwInp.value) { pwInp.classList.add('error'); valid = false; }
    if (!roleSelect.value) { roleSelect.classList.add('error'); valid = false; }
    if (!valid) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    if (pwInp.value !== pw2Inp.value) { pw2Inp.classList.add('error'); toast('비밀번호가 일치하지 않습니다.','err'); return; }
    toast('사용자가 등록되었습니다.');
    navigate('users-list');
  }

  const card = h('div', { class: 'card', style: { maxWidth: '600px' } },
    h('div', { class: 'form-row section-gap' }, fg('이름', nameInp, true), fg('아이디 (이메일)', usernameInp, true)),
    h('div', { class: 'form-row section-gap' }, fg('비밀번호', pwInp, true), fg('비밀번호 확인', pw2Inp, true)),
    h('div', { class: 'form-row section-gap' }, fg('역할', roleSelect, true), fg('연락처', contactInp, false)),
    assignWrap,
    h('div', { class: 'flex gap-8 mt-20' },
      h('button', { class: 'btn btn-outline', onClick: () => navigate('users-list') }, '취소'),
      h('button', { class: 'btn btn-p', onClick: submit }, '등록')
    )
  );
  page.appendChild(card);
  return page;
}

/* ----------------------------------------------------------
   USER DETAIL
---------------------------------------------------------- */
function renderUserDetail(id) {
  const user = DUMMY.users.find(u => u.userId === id) || DUMMY.users[0];
  const page = h('div', {});
  const roleLabel = { admin:'관리자', staff:'운영자', teacher:'교사' };

  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, user.name),
      h('div', { class: 'ph-sub' }, user.username)
    ),
    h('div', { class: 'ph-actions' },
      statusBadge(user.status),
      h('button', { class: 'btn btn-outline', onClick: () => navigate('users-list') }, '← 목록')
    )
  ));

  let activeTab = 'info';
  const tabContent = h('div', {});

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      const nameInp    = h('input', { class: 'inp', value: user.name, type: 'text' });
      const contactInp = h('input', { class: 'inp', value: user.contact, type: 'text' });
      const statusSelect = h('select', { class: 'inp' },
        h('option', { value: 'active', selected: user.status === 'active' }, '활성'),
        h('option', { value: 'inactive', selected: user.status === 'inactive' }, '비활성')
      );
      tabContent.appendChild(h('div', { class: 'card', style:{ maxWidth:'560px' } },
        h('dl', { class: 'info-row mb-16' },
          h('dt',{},'아이디'),      h('dd',{},user.username),
          h('dt',{},'역할'),        h('dd',{},roleLabel[user.role]||user.role),
          h('dt',{},'최근 로그인'), h('dd',{},fmtDT(user.lastLogin))
        ),
        h('div', { class: 'divider' }),
        h('div', { class: 'section-gap' }, fg('이름', nameInp, true)),
        h('div', { class: 'section-gap' }, fg('연락처', contactInp, false)),
        h('div', { class: 'section-gap' }, fg('상태', statusSelect, true)),
        h('div', { class: 'flex gap-8 mt-20' },
          h('button', { class: 'btn btn-p', onClick: () => toast('저장되었습니다.') }, '저장'),
          user.userId !== 'u1' ?
            h('button', { class: 'btn btn-d', onClick: () => confirm('이 사용자를 삭제하시겠습니까?', () => { toast('삭제되었습니다.','warn'); navigate('users-list'); }) }, '삭제') : null
        )
      ));
    } else if (activeTab === 'assignments') {
      const assignments = user.assignments || [];
      if (user.role !== 'teacher') {
        tabContent.appendChild(h('div', { class: 'alert alert-info' }, 'ℹ️ 교사 역할에만 담당 학급을 지정할 수 있습니다.'));
      } else if (assignments.length === 0) {
        tabContent.appendChild(h('div', { class: 'empty' },
          h('div',{class:'empty-icon'},'—'),
          h('div',{class:'empty-title'},'담당 학급이 없습니다')
        ));
      } else {
        const groups = assignments.map(a => DUMMY.groups.find(g => g.groupId===a.groupId)).filter(Boolean);
        tabContent.appendChild(mkTable([
          { key:'name', label:'그룹 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();navigate('groups-detail',r.groupId)});return a;}},
          { key:'schoolId', label:'학교', render:(v)=>{ const s=DUMMY.schools.find(sc=>sc.schoolId===v); return s?s.name:'—'; }},
          { key:'deviceCount', label:'단말 수', width:'80px', render:v=>`${v}대`},
          { key:'pauseStatus', label:'탐지 중단', width:'100px', render:v=>v==='paused'?mkBd('bdg-warn','중단중'):mkBd('bdg-ok','정상')},
        ], groups));
      }
    } else if (activeTab === 'pauseHistory') {
      const hist = DUMMY.pauses.filter(p => p.requester === user.name);
      tabContent.appendChild(mkTable([
        { key:'grade', label:'학년/반', render:(v,r)=>`${r.grade}학년 ${r.cls}반`},
        { key:'pauseType', label:'유형', width:'80px'},
        { key:'startAt', label:'시작', render:v=>fmtDT(v)},
        { key:'endAt', label:'종료', render:v=>fmtDT(v)},
        { key:'reason', label:'사유'},
        { key:'status', label:'상태', width:'90px', render:v=>v==='ACTIVE'?mkBd('bdg-warn','진행중'):v==='EXPIRED'?mkBd('bdg-muted','만료'):mkBd('bdg-muted','취소')},
      ], hist));
    }
  }

  const tabs = h('div', { class: 'tabs' },
    ...[
      {id:'info',label:'기본정보'},
      {id:'assignments',label:'담당범위'},
      {id:'pauseHistory',label:'탐지중단이력'},
    ].map(t => {
      const tab = h('div', { class: 'tab' + (t.id === activeTab ? ' a' : '') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTab();
      });
      return tab;
    })
  );
  page.appendChild(tabs);
  page.appendChild(tabContent);
  renderTab();
  return page;
}

/* ----------------------------------------------------------
   PAUSE LIST
---------------------------------------------------------- */
function renderPauseList() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '탐지 중단 현황'),
      h('div', { class: 'ph-sub' }, '현재 진행 중인 탐지 중단 상태를 확인합니다')
    ),
    h('div', { class: 'ph-actions' },
      h('button', { class: 'btn btn-p', onClick: () => openPanel(renderPauseNewPanel()) }, '+ 중단 설정')
    )
  ));

  const active = DUMMY.pauses.filter(p => p.status === 'ACTIVE');
  const expired = DUMMY.pauses.filter(p => p.status === 'EXPIRED');
  const cancelled = DUMMY.pauses.filter(p => p.status === 'CANCELLED');

  page.appendChild(h('div', { class: 'grid-3 section-gap' },
    mkKPI('진행중', active.length, '현재 탐지 중단 중', 'warn'),
    mkKPI('만료', expired.length, '자동 종료됨', ''),
    mkKPI('취소', cancelled.length, '수동 취소됨', '')
  ));

  const PAUSE_PAGE_SIZE = 20;
  let pausePage = 1;

  const tableWrap = h('div', { style:'overflow-y:auto;max-height:calc(100vh - 320px)' });
  const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:space-between;margin-top:8px;font-size:13px;color:#64748b;flex-shrink:0' });

  function renderTable() {
    const data = DUMMY.pauses;
    const totalPages = Math.max(1, Math.ceil(data.length / PAUSE_PAGE_SIZE));
    if (pausePage > totalPages) pausePage = 1;
    const pageData = data.slice((pausePage-1)*PAUSE_PAGE_SIZE, pausePage*PAUSE_PAGE_SIZE);

    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'groupId', label:'학교', width:'120px', render: v => {
        const grp = DUMMY.groups.find(g => g.groupId === v);
        const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
        return sch ? sch.name : '—';
      }},
      { key:'pauseType', label:'중단 유형', width:'90px' },
      { key:'requester', label:'요청자', width:'90px' },
      { key:'startAt', label:'시작 시각', render: v => fmtDT(v) },
      { key:'endAt',   label:'종료 시각', render: v => fmtDT(v) },
      { key:'reason',  label:'사유' },
      { key:'status',  label:'상태', width:'90px', render: v => {
        if (v==='ACTIVE') return mkBd('bdg-warn','진행중');
        if (v==='EXPIRED') return mkBd('bdg-muted','만료');
        return mkBd('bdg-muted','취소');
      }},
    ], pageData, row => openPanel(renderPauseDetailPanel(row, renderTable))));

    pageWrap.innerHTML = '';
    pageWrap.appendChild(mkPagination(pausePage, totalPages, (p) => { pausePage = p; renderTable(); }));
  }
  renderTable();
  page.appendChild(tableWrap);
  page.appendChild(pageWrap);
  return page;
}

/* ----------------------------------------------------------
   PAUSE NEW
---------------------------------------------------------- */
function genPauseCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function renderPauseNew() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '탐지 중단 설정'),
      h('div', { class: 'ph-sub' }, '단말기에서 인증 코드를 입력하면 설정한 시간까지 탐지가 중단됩니다')
    )
  ));

  page.appendChild(h('div', { class: 'alert alert-warn section-gap' },
    '⚠️ 탐지 중단 중에는 해당 그룹의 유해 콘텐츠가 탐지되지 않습니다. 반드시 사유를 명확히 기록해주세요.'
  ));

  // 4-digit code
  let code = genPauseCode();
  const codeDisplay = h('div', { style:'font-size:36px;font-weight:700;letter-spacing:12px;color:#1e293b;text-align:center;padding:16px 0' }, code);
  const regenBtn = h('button', { class:'btn btn-outline btn-sm' }, '재생성');
  regenBtn.addEventListener('click', () => { code = genPauseCode(); codeDisplay.textContent = code; });

  const inputTimeSelect = h('select', { class: 'inp' },
    h('option',{value:'1'},'1분'),
    h('option',{value:'3'},'3분'),
    h('option',{value:'5'},'5분'),
    h('option',{value:'10'},'10분')
  );
  inputTimeSelect.value = '3';

  const durHourSel = h('input', { class:'inp', type:'number', min:'0', max:'72', value:'1', style:'width:70px;text-align:center' });
  const durMinSel  = h('input', { class:'inp', type:'number', min:'0', max:'59', value:'0',  style:'width:70px;text-align:center' });
  const durationRow = h('div', { style:'display:flex;align-items:center;gap:6px' },
    durHourSel, h('span', { style:'color:#374151;font-size:14px' }, '시간'),
    durMinSel,  h('span', { style:'color:#374151;font-size:14px' }, '분 후')
  );

  const typeSelect = h('select', { class: 'inp' },
    h('option',{value:'전체'},'전체 탐지 중단'),
    h('option',{value:'선정성'},'선정성 탐지만'),
    h('option',{value:'도박'},'도박 탐지만')
  );

  const reasonInp = h('textarea', { class: 'inp', placeholder: '탐지 중단 사유를 입력하세요 (예: 성교육 수업, 체험학습 등)', style:{minHeight:'80px'} });
  const requesterEl = h('div', { style:'padding:6px 0;font-size:14px;color:#374151' }, D.user.name);

  function submit() {
    reasonInp.classList.remove('error');
    const totalMin = (parseInt(durHourSel.value)||0)*60 + (parseInt(durMinSel.value)||0);
    if (totalMin <= 0) { toast('해제 시간을 1분 이상 설정해주세요.','err'); return; }
    if (!reasonInp.value.trim()) { reasonInp.classList.add('error'); toast('중단 사유를 입력해주세요.','err'); return; }
    navigate('pauses-list');
    showPauseActiveModal(code, parseInt(inputTimeSelect.value));
  }

  const card = h('div', { class: 'card', style:{ maxWidth:'600px' } },
    h('div', { class:'section-gap', style:'text-align:center' },
      h('div', { style:'font-size:13px;color:#64748b;margin-bottom:4px' }, '단말기 입력 인증 코드'),
      codeDisplay,
      regenBtn
    ),
    h('div', { class: 'section-gap' }, fg('코드 입력 시간', inputTimeSelect, true)),
    h('div', { class: 'section-gap' }, fg('중단 유형', typeSelect, true)),
    h('div', { class: 'section-gap' }, h('div', { class:'fg' }, h('label',{},'탐지 중단 해제 *'), durationRow)),
    h('div', { class: 'section-gap' }, h('div', { class:'fg' }, h('label',{},'요청자'), requesterEl)),
    h('div', { class: 'section-gap' }, fg('중단 사유', reasonInp, true)),
    h('div', { class: 'flex gap-8 mt-20' },
      h('button', { class: 'btn btn-outline', onClick: () => navigate('pauses-list') }, '취소'),
      h('button', { class: 'btn btn-p', onClick: submit }, '탐지 중단 설정')
    )
  );
  page.appendChild(card);
  return page;
}

/* ----------------------------------------------------------
   PAUSE HISTORY
---------------------------------------------------------- */
function renderPauseHistory() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '탐지 중단 이력'),
      h('div', { class: 'ph-sub' }, '모든 탐지 중단 요청 이력을 확인합니다')
    )
  ));

  const searchInp = h('input', { class: 'inp search', placeholder: '요청자 검색...', type: 'text' });
  const schoolTypeSelect = h('select', { class: 'inp', style:{ maxWidth:'130px' } },
    h('option',{value:''},'전체 학교유형'),
    ...([...new Set(DUMMY.schools.map(s=>s.type))]).map(t=>h('option',{value:t},t))
  );
  const statusSelect = h('select', { class: 'inp', style:{ maxWidth:'120px' } },
    h('option',{value:''},'전체 상태'),
    h('option',{value:'ACTIVE'},'진행중'),
    h('option',{value:'EXPIRED'},'만료'),
    h('option',{value:'CANCELLED'},'취소')
  );

  const tableWrap = h('div', {});
  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const st = schoolTypeSelect.value;
    const s = statusSelect.value;
    const filtered = DUMMY.pauses.filter(p => {
      if (q && !p.requester.toLowerCase().includes(q)) return false;
      if (st) {
        const grp = DUMMY.groups.find(g => g.groupId === p.groupId);
        const sch = grp ? DUMMY.schools.find(sc => sc.schoolId === grp.schoolId) : null;
        if (!sch || sch.type !== st) return false;
      }
      if (s && p.status !== s) return false;
      return true;
    });
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'groupId', label:'학교', width:'110px', render: v => {
        const grp = DUMMY.groups.find(g => g.groupId === v);
        const sch = grp ? DUMMY.schools.find(sc => sc.schoolId === grp.schoolId) : null;
        return sch ? sch.name : '—';
      }},
      { key:'pauseType', label:'유형', width:'90px' },
      { key:'requester', label:'요청자', width:'90px' },
      { key:'startAt', label:'시작', render:v=>fmtDT(v) },
      { key:'endAt', label:'종료', render:v=>fmtDT(v) },
      { key:'reason', label:'사유' },
      { key:'cancelReason', label:'취소 사유', render:v=>v||'—' },
      { key:'status', label:'상태', width:'90px', render:v=>{
        if(v==='ACTIVE') return mkBd('bdg-warn','진행중');
        if(v==='EXPIRED') return mkBd('bdg-muted','만료');
        return mkBd('bdg-muted','취소');
      }},
    ], filtered));
  }
  searchInp.addEventListener('input', renderTable);
  schoolTypeSelect.addEventListener('change', renderTable);
  statusSelect.addEventListener('change', renderTable);

  page.appendChild(h('div', { class: 'fb' }, searchInp, schoolTypeSelect, statusSelect));
  page.appendChild(tableWrap);
  renderTable();
  return page;
}

/* ----------------------------------------------------------
   LICENSES
---------------------------------------------------------- */
function renderLicenses() {
  const lics = DUMMY.licenses;
  const page = h('div', {});

  const totDevices = DUMMY.licensesTotal;
  const totUsed    = DUMMY.licensesUsed;
  const totPct     = Math.round((totUsed / totDevices) * 100);
  const remaining  = totDevices - totUsed;

  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '라이선스'),
      h('div', { class: 'ph-sub' }, `총 ${lics.length}개 라이선스 등록`)
    ),
    h('div', { class: 'ph-actions' },
      h('button', { class: 'btn btn-p', onClick: () => toast('라이선스 등록은 관리자에게 문의하세요.', 'info') }, '+ 라이선스 등록')
    )
  ));

  page.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('총 수량', totDevices, '등록된 전체 라이선스', ''),
    mkKPI('사용 중', totUsed, `${totPct}% 사용`, totPct > 90 ? 'err' : totPct > 70 ? 'warn' : 'ok'),
    mkKPI('잔여', remaining, '추가 등록 가능', 'ac'),
    mkKPI('등록 수', lics.length, '라이선스 항목', '')
  ));

  const searchInp = h('input', { class: 'inp search', placeholder: 'OS 또는 탐지 항목 검색...', type: 'text' });
  const osSelect  = h('select', { class: 'inp', style: { maxWidth: '140px' } },
    h('option', { value: '' }, '전체 OS'),
    ...['Android','iOS','Windows','ChromeBook','WhaleBook'].map(o => h('option', { value: o }, o))
  );
  const tableWrap = h('div', {});

  function openLicDetail(lic) {
    const pct = Math.round((lic.usedDevices / lic.devices) * 100);
    const pnl = h('div', {},
      h('div', { style:'padding:24px 24px 16px;border-bottom:1px solid var(--bd)' },
        h('div', { style:'font-size:16px;font-weight:700;color:var(--t1);margin-bottom:6px' }, `${lic.os} · ${lic.detectionType}`),
        lic.status === 'active' ? mkBd('bdg-ok','활성') : mkBd('bdg-err','만료')
      ),
      h('div', { style:'padding:20px 24px' },
        h('dl', { class:'info-row' },
          h('dt',{},'학교명'),       h('dd',{},lic.school),
          h('dt',{},'라이선스 유형'), h('dd',{},lic.type),
          h('dt',{},'OS'),           h('dd',{},lic.os),
          h('dt',{},'탐지 항목'),    h('dd',{},lic.detectionType),
          h('dt',{},'시리얼 키'),    h('dd',{ style:{fontFamily:'monospace',fontSize:'12px',color:'var(--t2)'} }, lic.serialKey),
          h('dt',{},'수량'),         h('dd',{},`${lic.devices}대`),
          h('dt',{},'사용 단말'),    h('dd',{},`${lic.usedDevices} / ${lic.devices}대 (${pct}%)`),
          h('dt',{},'유효 시작'),    h('dd',{},fmtD(lic.validFrom)),
          h('dt',{},'유효 종료'),    h('dd',{},fmtD(lic.validTo)),
          h('dt',{},'최근 동기화'),  h('dd',{},fmtDT(lic.lastSync))
        ),
        h('div', { class:'mt-12' },
          h('div', { class:'progress-bar', style:{height:'8px'} },
            h('div', { class:`progress-fill${pct>90?' err':pct>70?' warn':' ok'}`, style:{width:pct+'%'} })
          )
        ),
        h('div', { style:'margin-top:20px;padding-top:16px;border-top:1px solid var(--bd)' },
          h('div', { class:'card-title' }, '지원 정보'),
          h('dl', { class:'info-row' },
            h('dt',{},'담당자'),   h('dd',{},lic.manager),
            h('dt',{},'이메일'),   h('dd',{},h('a',{href:'mailto:'+lic.supportContact},lic.supportContact)),
            h('dt',{},'전화번호'), h('dd',{},lic.supportTel)
          )
        ),
        h('div', { class:'mt-16' },
          h('button', { class:'btn btn-p btn-sm', onClick:()=>toast('라이선스 갱신 문의를 접수했습니다.','info') }, '갱신 문의'),
          h('button', { class:'btn btn-outline btn-sm', style:{marginLeft:'8px'}, onClick:()=>toast('동기화 중...','info') }, '🔄 동기화')
        )
      )
    );
    openPanel(pnl);
  }

  function renderTable() {
    const q  = searchInp.value.toLowerCase();
    const os = osSelect.value;
    const filtered = lics.filter(l => {
      if (os && l.os !== os) return false;
      if (q && !l.os.toLowerCase().includes(q) && !l.serialKey.toLowerCase().includes(q)) return false;
      return true;
    });
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'os',            label:'OS',       width:'120px', render: v => h('span', { style:'font-weight:600;color:var(--t1)' }, v) },
      { key:'detectionType', label:'탐지 항목', width:'120px', render: v => {
        const color = v==='선정성'?'#ef4444':v==='도박'?'#f59e0b':'#3b82f6';
        return h('span', { style:`display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;background:${color}18;color:${color}` }, v);
      }},
      { key:'devices',       label:'수량',      width:'80px',  render: v => `${v}대` },
      { key:'usedDevices',   label:'사용 단말',  width:'100px', render: (v,r) => `${v} / ${r.devices}대` },
      { key:'validFrom',     label:'유효 기간',             render: (v,r) => `${fmtD(v)} ~ ${fmtD(r.validTo)}` },
      { key:'status',        label:'상태',      width:'80px',  render: v => v==='active' ? mkBd('bdg-ok','활성') : mkBd('bdg-err','만료') },
    ], filtered, row => openLicDetail(row)));
  }

  searchInp.addEventListener('input', renderTable);
  osSelect.addEventListener('change', renderTable);

  page.appendChild(h('div', { class:'fb' }, searchInp, osSelect));
  page.appendChild(tableWrap);
  renderTable();

  if (D._autoOpenLicense) {
    const target = D._autoOpenLicense;
    D._autoOpenLicense = null;
    requestAnimationFrame(() => openLicDetail(target));
  }

  return page;
}

/* ----------------------------------------------------------
   NOTIFICATIONS
---------------------------------------------------------- */
function renderNotifications() {
  const s = DUMMY.notificationSettings;
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '알림 설정'),
      h('div', { class: 'ph-sub' }, '탐지 및 시스템 알림 방식을 설정합니다')
    )
  ));

  const emailCheck = h('input', { type: 'checkbox' }); if (s.emailEnabled) emailCheck.checked = true;
  const emailInp   = h('input', { class: 'inp', value: s.emailAddress, type: 'email' });
  const smsCheck   = h('input', { type: 'checkbox' }); if (s.smsEnabled) smsCheck.checked = true;
  const smsInp     = h('input', { class: 'inp', value: s.smsNumber, type: 'text' });

  const detCheck   = h('input', { type: 'checkbox' }); if (s.detectionAlert) detCheck.checked = true;
  const dailyCheck = h('input', { type: 'checkbox' }); if (s.dailyReport) dailyCheck.checked = true;
  const weeklyCheck= h('input', { type: 'checkbox' }); if (s.weeklyReport) weeklyCheck.checked = true;
  const pauseCheck = h('input', { type: 'checkbox' }); if (s.pauseAlert) pauseCheck.checked = true;
  const threshInp  = h('input', { class: 'inp', value: String(s.alertThreshold), type: 'number', min: '1', max: '100', style:{maxWidth:'100px'} });

  const card = h('div', { class: 'card', style:{maxWidth:'600px'} },
    h('div', { class: 'detail-section' },
      h('div', { class: 'detail-section-title' }, '이메일 알림'),
      h('label', { class: 'checkbox-row mb-16' }, emailCheck, '이메일 알림 활성화'),
      fg('알림 수신 이메일', emailInp, false)
    ),
    h('div', { class: 'divider' }),
    h('div', { class: 'detail-section' },
      h('div', { class: 'detail-section-title' }, 'SMS 알림'),
      h('label', { class: 'checkbox-row mb-16' }, smsCheck, 'SMS 알림 활성화'),
      fg('수신 번호', smsInp, false)
    ),
    h('div', { class: 'divider' }),
    h('div', { class: 'detail-section' },
      h('div', { class: 'detail-section-title' }, '알림 이벤트'),
      h('div', { style:{display:'flex',flexDirection:'column',gap:'10px'} },
        h('label', { class: 'checkbox-row' }, detCheck, '탐지 발생 시 즉시 알림'),
        h('label', { class: 'checkbox-row' }, pauseCheck, '탐지 중단 요청/해제 알림'),
        h('label', { class: 'checkbox-row' }, dailyCheck, '일일 탐지 리포트'),
        h('label', { class: 'checkbox-row' }, weeklyCheck, '주간 리포트')
      )
    ),
    h('div', { class: 'divider' }),
    h('div', { class: 'detail-section' },
      h('div', { class: 'detail-section-title' }, '알림 임계값'),
      fg('탐지 횟수 임계값 (n회 이상 시 알림)', threshInp, false),
      h('div', { class: 'text-t3', style:{fontSize:'11.5px',marginTop:'4px'} }, '동일 단말에서 n회 이상 탐지 시 긴급 알림이 발송됩니다')
    ),
    h('div', { class: 'divider' }),
    (() => {
      let selectedType = s.notiType || 'basic';
      const types = [
        { id:'basic',  label:'기본',  desc:'단말 상단에 일반 알림 배너로 표시됩니다' },
        { id:'popup',  label:'팝업',  desc:'화면 중앙에 팝업 창으로 즉시 표시됩니다' },
        { id:'strong', label:'강조',  desc:'전체 화면 오버레이로 강제 표시됩니다' },
      ];
      const optWrap = h('div', { style:{display:'flex',flexDirection:'column',gap:'8px'} });

      function renderOpts() {
        optWrap.innerHTML = '';
        types.forEach(t => {
          const isActive = selectedType === t.id;
          const opt = h('label', {
            style: `display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--radius-sm);cursor:pointer;border:1px solid ${isActive ? 'var(--ac)' : 'var(--bd)'};background:${isActive ? 'rgba(99,102,241,.07)' : 'var(--bg2)'};transition:border-color var(--trans),background var(--trans)`
          },
            h('input', { type:'radio', name:'noti-type', value:t.id, ...(isActive ? {checked:true} : {}), style:'accent-color:var(--ac);width:16px;height:16px;flex-shrink:0' }),
            h('div', { style:'flex:1' },
              h('div', { style:'font-size:14px;font-weight:600;color:var(--t1)' }, t.label),
              h('div', { style:'font-size:12px;color:var(--t2);margin-top:2px' }, t.desc)
            )
          );
          opt.querySelector('input').addEventListener('change', () => {
            selectedType = t.id;
            s.notiType = t.id;
            renderOpts();
          });
          optWrap.appendChild(opt);
        });
      }

      renderOpts();
      return h('div', { class: 'detail-section' },
        h('div', { class: 'detail-section-title' }, '알림 유형 설정'),
        h('div', { class: 'text-t2', style:{fontSize:'12px',marginBottom:'12px'} }, '학생 단말기에 표시될 알림 방식을 선택합니다. 설정 저장 시 모든 단말에 즉시 적용됩니다.'),
        optWrap
      );
    })(),
    h('div', { class: 'flex gap-8 mt-20' },
      h('button', { class: 'btn btn-p', onClick: () => toast('알림 설정이 저장되었습니다.') }, '저장'),
      h('button', { class: 'btn btn-outline', onClick: () => toast('테스트 알림을 발송했습니다.','info') }, '테스트 발송')
    )
  );
  page.appendChild(card);
  return page;
}

/* ----------------------------------------------------------
   ACCOUNT
---------------------------------------------------------- */
function renderAccount() {
  const user = DUMMY.users.find(u => u.role === 'admin') || DUMMY.users[0];
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '내 계정'),
      h('div', { class: 'ph-sub' }, '계정 정보를 확인하고 수정합니다')
    )
  ));

  const nameInp    = h('input', { class: 'inp', value: user.name, type: 'text' });
  const contactInp = h('input', { class: 'inp', value: user.contact, type: 'text' });
  const emailInp   = h('input', { class: 'inp', value: user.username, disabled: true, type: 'text' });

  const curPwInp   = h('input', { class: 'inp', placeholder: '현재 비밀번호', type: 'password' });
  const newPwInp   = h('input', { class: 'inp', placeholder: '새 비밀번호 (8자 이상)', type: 'password' });
  const newPw2Inp  = h('input', { class: 'inp', placeholder: '새 비밀번호 확인', type: 'password' });

  function saveInfo() {
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); toast('이름을 입력해주세요.','err'); return; }
    nameInp.classList.remove('error');
    D.user.name = nameInp.value.trim();
    // Update header
    const avatar = document.querySelector('.mh-user-avatar');
    const userName = document.querySelector('.mh-user-name');
    if (avatar) avatar.textContent = D.user.name.charAt(0);
    if (userName) userName.textContent = D.user.name;
    toast('계정 정보가 저장되었습니다.');
  }

  function changePw() {
    [curPwInp, newPwInp, newPw2Inp].forEach(el => el.classList.remove('error'));
    if (!curPwInp.value) { curPwInp.classList.add('error'); toast('현재 비밀번호를 입력해주세요.','err'); return; }
    if (newPwInp.value.length < 8) { newPwInp.classList.add('error'); toast('새 비밀번호는 8자 이상이어야 합니다.','err'); return; }
    if (newPwInp.value !== newPw2Inp.value) { newPw2Inp.classList.add('error'); toast('비밀번호가 일치하지 않습니다.','err'); return; }
    toast('비밀번호가 변경되었습니다.');
    curPwInp.value = ''; newPwInp.value = ''; newPw2Inp.value = '';
  }

  const wrap = h('div', { style: { maxWidth: '860px' } });
  wrap.appendChild(h('div', { class: 'grid-2' },
    h('div', { class: 'card' },
      h('div', { class: 'card-title' }, '기본 정보'),
      h('div', { style:{display:'flex',alignItems:'center',gap:'16px',marginBottom:'20px'} },
        h('div', { style:{width:'56px',height:'56px',background:'var(--ac)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:'700',flexShrink:0} }, user.name.charAt(0)),
        h('div', {},
          h('div', { style:{fontSize:'16px',fontWeight:'600',color:'var(--t1)'} }, user.name),
          h('div', { style:{fontSize:'12px',color:'var(--t3)'} }, '관리자 · ' + user.username)
        )
      ),
      h('div', { class: 'section-gap' }, fg('이름', nameInp, true)),
      h('div', { class: 'section-gap' }, fg('아이디 (이메일)', emailInp, false)),
      h('div', { class: 'section-gap' }, fg('연락처', contactInp, false)),
      h('div', { class: 'mt-16' },
        h('button', { class: 'btn btn-p', onClick: saveInfo }, '저장')
      )
    ),
    h('div', { class: 'card' },
      h('div', { class: 'card-title' }, '비밀번호 변경'),
      h('div', { class: 'section-gap' }, fg('현재 비밀번호', curPwInp, true)),
      h('div', { class: 'section-gap' }, fg('새 비밀번호', newPwInp, true)),
      h('div', { class: 'section-gap' }, fg('새 비밀번호 확인', newPw2Inp, true)),
      h('div', { class: 'text-t3', style:{fontSize:'11.5px',marginBottom:'16px'} }, '비밀번호는 8자 이상, 영문+숫자+특수문자 조합을 권장합니다.'),
      h('button', { class: 'btn btn-p', onClick: changePw }, '비밀번호 변경')
    )
  ));

  /* ── 화면 테마 설정 카드 ── */
  const themeCard = h('div', { class: 'card', style: { marginTop: '20px' } },
    h('div', { class: 'card-title' }, '화면 설정')
  );

  function mkThemeOption(value, icon, label, desc) {
    const isActive = getTheme() === value;
    const opt = h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '14px 16px', borderRadius: '8px', cursor: 'pointer',
        border: '2px solid ' + (isActive ? 'var(--ac)' : 'var(--bd)'),
        background: isActive ? 'rgba(99,102,241,.06)' : 'var(--bg2)',
        transition: 'all .15s', flex: '1'
      },
      onClick: () => {
        setTheme(value);
        themeCard.innerHTML = '';
        themeCard.appendChild(h('div', { class: 'card-title' }, '화면 설정'));
        buildThemeOptions();
        toast((value === 'light' ? '라이트' : '다크') + ' 모드로 변경되었습니다.');
      }
    },
      h('div', { style: { fontSize: '24px', lineHeight: '1' } }, icon),
      h('div', {},
        h('div', { style: { fontSize: '13px', fontWeight: '600', color: 'var(--t1)' } }, label),
        h('div', { style: { fontSize: '12px', color: 'var(--t3)', marginTop: '2px' } }, desc)
      ),
      isActive
        ? h('div', { style: { marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--ac)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
            h('div', { style: { width: '7px', height: '7px', borderRadius: '50%', background: '#fff' } })
          )
        : null
    );
    return opt;
  }

  function buildThemeOptions() {
    const row = h('div', { style: { display: 'flex', gap: '12px' } },
      mkThemeOption('light', (function(){ const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','20');s.setAttribute('height','20');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');s.innerHTML='<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';return s;})(), '라이트 모드', '밝은 배경, 기본 설정'),
      mkThemeOption('dark', (function(){ const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','20');s.setAttribute('height','20');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');s.innerHTML='<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';return s;})(), '다크 모드', '어두운 배경, 눈 편한 화면')
    );
    themeCard.appendChild(row);
  }

  buildThemeOptions();
  wrap.appendChild(themeCard);
  page.appendChild(wrap);

  return page;
}

/* ============================================================
   PANEL RENDER FUNCTIONS
============================================================ */

/* ── Device Info Modal ───────────────────────────────────── */
function showDeviceModal(deviceId) {
  const device = DUMMY.devices.find(d => d.deviceId === deviceId);
  if (!device) return;
  const group = DUMMY.groups.find(g => g.groupId === device.groupId);
  const detections = DUMMY.detections.filter(d => d.deviceId === deviceId);

  const closeBtn = h('button', { class: 'modal-close' }, '✕');
  const okBtn = h('button', { class: 'btn btn-p' }, '확인');

  const body = h('div', {},
    h('dl', { class: 'info-row' },
      h('dt',{},'단말명'), h('dd',{},device.name),
      h('dt',{},'식별자'), h('dd',{}, h('span',{style:'font-family:monospace;font-size:12px'},device.identifier)),
      h('dt',{},'소속 그룹'), h('dd',{},device.groupName || '—'),
      h('dt',{},'모델'), h('dd',{},device.model || '—'),
      h('dt',{},'OS'), h('dd',{},device.os || '—'),
      h('dt',{},'상태'), h('dd',{},statusBadge(device.status)),
      h('dt',{},'정책 상태'), h('dd',{},statusBadge(device.policyStatus)),
      h('dt',{},'최근 접속'), h('dd',{},fmtDT(device.lastContact))
    )
  );

  if (detections.length > 0) {
    body.appendChild(h('div', { style:'margin-top:20px;border-top:1px solid var(--bd);padding-top:16px' },
      h('div', { style:'font-size:14px;font-weight:700;color:#1e293b;margin-bottom:10px' }, `탐지 이력 (${detections.length}건)`),
      mkTable([
        { key:'detectedAt', label:'탐지 시각', render: v => fmtDT(v) },
        { key:'type', label:'유형', width:'80px', render: v => detTypeBadge(v) },
        { key:'policy', label:'정책' },
        { key:'status', label:'상태', width:'90px', render: v => statusBadge(v) },
      ], detections.slice(0, 5))
    ));
  }

  const modal = h('div', { class: 'modal', style:'max-width:560px' },
    h('div', { class: 'modal-hd' },
      h('div', { class: 'modal-title' }, device.name),
      closeBtn
    ),
    h('div', { class: 'modal-bd', style:'max-height:60vh;overflow-y:auto' }, body),
    h('div', { class: 'modal-ft', style:'justify-content:flex-end' }, okBtn)
  );

  const overlay = h('div', { class: 'modal-overlay' }, modal);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  function close() {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 220);
  }
  closeBtn.addEventListener('click', close);
  okBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}

/* ── Select Modal Helper ─────────────────────────────────── */
/**
 * showSelectModal(title, items, labelFn, onConfirm)
 * items: array of objects
 * labelFn: (item) => { name, sub? }
 * onConfirm: (selectedItems[]) => void
 */
function showSelectModal(title, items, labelFn, onConfirm, opts) {
  const selected = new Set();
  const options = opts || {};

  // 검색 필터 영역
  const filterBar = h('div', { style:'display:flex;gap:8px;margin-bottom:10px' });
  const searchInp = options.schoolFilter ? null : h('input', { class: 'inp', type: 'text', placeholder: '검색...', style:'flex:1' });
  if (searchInp) filterBar.appendChild(searchInp);

  // 그룹용 학교유형/학교 셀렉트
  let schoolTypeSelect = null, schoolNameSelect = null;
  if (options.schoolFilter) {
    const schools = DUMMY.schools;
    const types = [...new Set(schools.map(s => s.type))];
    schoolTypeSelect = h('select', { class:'inp', style:'min-width:110px' },
      h('option', { value:'' }, '전체 학교유형'),
      ...types.map(t => h('option', { value: t }, t))
    );
    schoolNameSelect = h('select', { class:'inp', style:'min-width:120px' },
      h('option', { value:'' }, '전체 학교'),
      ...schools.map(s => h('option', { value: s.schoolId }, s.name))
    );
    schoolTypeSelect.addEventListener('change', () => {
      const tv = schoolTypeSelect.value;
      schoolNameSelect.innerHTML = '';
      schoolNameSelect.appendChild(h('option', { value:'' }, '전체 학교'));
      schools.filter(s => !tv || s.type === tv).forEach(s => {
        schoolNameSelect.appendChild(h('option', { value: s.schoolId }, s.name));
      });
      renderList();
    });
    schoolNameSelect.addEventListener('change', renderList);
    filterBar.appendChild(schoolTypeSelect);
    filterBar.appendChild(schoolNameSelect);
  }

  const listEl = h('div', {});

  function renderList() {
    listEl.innerHTML = '';
    const q = searchInp ? searchInp.value.toLowerCase() : '';
    const stv = schoolTypeSelect ? schoolTypeSelect.value : '';
    const snv = schoolNameSelect ? schoolNameSelect.value : '';
    const filtered = items.filter(item => {
      if (q) {
        const lbl = labelFn(item);
        if (!lbl.name.toLowerCase().includes(q) && !(lbl.sub && lbl.sub.toLowerCase().includes(q))) return false;
      }
      if (stv) {
        const school = DUMMY.schools.find(s => s.schoolId === item.schoolId);
        if (!school || school.type !== stv) return false;
      }
      if (snv && item.schoolId !== snv) return false;
      return true;
    });
    if (filtered.length === 0) {
      listEl.appendChild(h('div', { class: 'empty' },
        h('div', { class: 'empty-icon' }, '—'),
        h('div', { class: 'empty-title' }, q || stv || snv ? '검색 결과가 없습니다.' : '추가 가능한 항목이 없습니다.')
      ));
    } else {
      filtered.forEach((item, idx) => {
        const chkId = 'mchk-' + idx + '-' + Date.now();
        const chk = h('input', { type: 'checkbox', id: chkId });
        chk.checked = selected.has(item);
        chk.addEventListener('change', () => {
          if (chk.checked) selected.add(item);
          else selected.delete(item);
        });
        const lbl = labelFn(item);
        const info = h('div', { class: 'modal-item-info' },
          h('div', { class: 'modal-item-name' }, lbl.name),
          ...(lbl.sub ? [h('div', { class: 'modal-item-sub' }, lbl.sub)] : [])
        );
        const row = h('label', { class: 'modal-item', for: chkId }, chk, info);
        listEl.appendChild(row);
      });
    }
  }
  if (searchInp) searchInp.addEventListener('input', renderList);
  renderList();

  const closeBtn = h('button', { class: 'modal-close' }, '✕');
  const cancelBtn = h('button', { class: 'btn btn-outline' }, '취소');
  const confirmBtn = h('button', { class: 'btn btn-p' }, '적용');

  const modal = h('div', { class: 'modal' },
    h('div', { class: 'modal-hd' },
      h('div', { class: 'modal-title' }, title),
      closeBtn
    ),
    h('div', { class: 'modal-bd' }, filterBar, listEl),
    h('div', { class: 'modal-ft' }, cancelBtn, confirmBtn)
  );

  const overlay = h('div', { class: 'modal-overlay' }, modal);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));

  function close() {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 220);
  }

  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  confirmBtn.addEventListener('click', () => {
    if (selected.size === 0) { toast('항목을 선택해주세요.', 'warn'); return; }
    onConfirm([...selected]);
    close();
  });
}

/* -- Group New Panel -- */
function renderGroupNewPanel() {
  const schoolSelect = h('select', { class:'inp' },
    h('option', { value:'' }, '학교 선택'),
    ...DUMMY.schools.map(s => h('option', { value:s.schoolId }, `${s.name} (${s.type})`))
  );
  const nameInp = h('input', { class:'inp', placeholder:'그룹 이름', type:'text' });
  const descInp = h('textarea', { class:'inp', placeholder:'그룹 설명 (선택)', style:'min-height:80px' });
  const policySelect = h('select', { class:'inp' },
    h('option', { value:'' }, '정책 선택 (선택)'),
    ...DUMMY.policies.filter(p=>p.active).map(p => h('option', { value:p.policyId }, p.name))
  );

  // 학교 선택 시 학교유형 자동 표시
  const schoolTypeEl = h('div', { style:'padding:6px 0;font-size:14px;color:#64748b' }, '—');
  schoolSelect.addEventListener('change', () => {
    const s = DUMMY.schools.find(sc => sc.schoolId === schoolSelect.value);
    schoolTypeEl.textContent = s ? s.type : '—';
  });

  const body = h('div', {},
    fg('학교', schoolSelect, true),
    h('div', { class:'fg' }, h('label',{},'학교유형'), schoolTypeEl),
    fg('그룹 이름', nameInp, true),
    fg('그룹 설명', descInp, false),
    fg('기본 적용 정책', policySelect, false)
  );

  function onSave() {
    [schoolSelect, nameInp].forEach(el => el.classList.remove('error'));
    let ok = true;
    if (!schoolSelect.value) { schoolSelect.classList.add('error'); ok = false; }
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); ok = false; }
    if (!ok) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('그룹이 생성되었습니다.');
    closePanel();
  }

  return mkPanel('그룹 생성', body, onSave, '그룹 생성');
}

/* -- Group Detail Panel -- */
function renderGroupDetailPanel(id) {
  const group = DUMMY.groups.find(g => g.groupId === id) || DUMMY.groups[0];
  let activeTab = 'info';
  let isEditing = false;
  const tabContent = h('div', {});

  // Local state: applied policies for this group
  const appliedPolicies = DUMMY.policies.filter(p => p.active).slice(0, group.policyCount);

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      const school = DUMMY.schools.find(s => s.schoolId === group.schoolId);
      const schoolName = school ? school.name : '—';

      const nameInp = h('input', { class:'inp', value:group.name, type:'text', disabled:!isEditing });
      const descInp = h('textarea', { class:'inp', style:'min-height:80px', disabled:!isEditing }, '학급 그룹입니다.');
      if (!isEditing) { nameInp.style.background = '#f8fafc'; descInp.style.background = '#f8fafc'; }

      const schoolRow = isEditing
        ? fg('학교', (function(){
            const sel = h('select', { class:'inp' },
              h('option', { value:'' }, '학교 선택'),
              ...DUMMY.schools.map(s => h('option', { value:s.schoolId, selected: s.schoolId === group.schoolId }, s.name))
            );
            return sel;
          })(), true)
        : h('div', { class:'fg' },
            h('label', {}, '학교'),
            h('div', { style:'padding:6px 0' }, schoolName)
          );

      const statusRow = isEditing
        ? fg('상태', (function(){
            const sel = h('select', { class:'inp' },
              h('option', { value:'active',   selected: group.status === 'active'   }, '활성'),
              h('option', { value:'inactive', selected: group.status === 'inactive' }, '비활성')
            );
            return sel;
          })())
        : h('div', { class:'fg' },
            h('label', {}, '상태'),
            h('div', { style:'padding:6px 0' }, statusBadge(group.status))
          );

      const schoolTypeVal = school ? school.type : '—';
      const schoolTypeRow = h('div', { class:'fg' },
        h('label',{},'학교유형'),
        h('div', { style:'padding:6px 0;font-size:14px;color:#64748b' }, schoolTypeVal)
      );
      tabContent.appendChild(h('div', {},
        schoolRow,
        schoolTypeRow,
        fg('그룹 이름', nameInp, true),
        fg('설명', descInp, false),
        statusRow,
        h('dl', { class:'info-row mt-16' },
          h('dt',{},'최근 수정'), h('dd',{},fmtD(group.updatedAt))
        )
      ));
    } else if (activeTab === 'devices') {
      const allDevs = generateGroupDevices(group);
      const searchInp = h('input', { class:'inp search', placeholder:'단말 이름 또는 식별자 검색...', type:'text', style:'margin-bottom:12px;width:100%' });
      const statusSel = h('select', { class:'inp', style:'margin-bottom:12px;max-width:120px' },
        h('option', { value:'' }, '전체 상태'),
        h('option', { value:'online' }, '온라인'),
        h('option', { value:'offline' }, '오프라인')
      );
      const filterBar = h('div', { style:'display:flex;gap:8px;margin-bottom:12px' }, searchInp, statusSel);
      const PAGE_SIZE = 20;
      let currentPage = 1;
      const tableWrap = h('div', {});
      const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-size:13px;color:#64748b' });

      function renderDevTable() {
        const q = searchInp.value.toLowerCase();
        const s = statusSel.value;
        const filtered = allDevs.filter(d => {
          if (q && !d.name.toLowerCase().includes(q) && !d.identifier.toLowerCase().includes(q)) return false;
          if (s && d.status !== s) return false;
          return true;
        });
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = 1;
        const pageData = filtered.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE)
          .map((r, i) => ({ ...r, _no: (currentPage-1)*PAGE_SIZE + i + 1 }));

        tableWrap.innerHTML = '';
        tableWrap.appendChild(mkTable([
          { key:'_no', label:'No.', width:'48px' },
          { key:'name', label:'단말 이름' },
          { key:'identifier', label:'식별자' },
          { key:'status', label:'상태', width:'80px', render: v => statusBadge(v) },
          { key:'lastContact', label:'최근 접속', render: v => fmtDT(v) },
        ], pageData, row => showDeviceModal(row.deviceId)));

        pageWrap.innerHTML = '';
        const prevBtn = h('button', { class:'btn btn-outline btn-sm' }, '← 이전');
        const nextBtn = h('button', { class:'btn btn-outline btn-sm' }, '다음 →');
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        prevBtn.addEventListener('click', () => { currentPage--; renderDevTable(); });
        nextBtn.addEventListener('click', () => { currentPage++; renderDevTable(); });
        pageWrap.appendChild(prevBtn);
        pageWrap.appendChild(h('span', {}, `${currentPage} / ${totalPages} 페이지 (${filtered.length}대)`));
        pageWrap.appendChild(nextBtn);
      }
      searchInp.addEventListener('input', () => { currentPage = 1; renderDevTable(); });
      statusSel.addEventListener('change', () => { currentPage = 1; renderDevTable(); });
      tabContent.appendChild(filterBar);
      tabContent.appendChild(tableWrap);
      tabContent.appendChild(pageWrap);
      renderDevTable();
    } else if (activeTab === 'policies') {
      let isPolicyEditing = tabContent._isPolicyEditing || false;

      // 수정 버튼
      const editPolicyBtn = h('button', { class:'btn btn-outline btn-sm' }, '수정');
      editPolicyBtn.addEventListener('click', () => {
        tabContent._isPolicyEditing = true;
        renderTab();
        renderFooter();
      });
      const actionBar = h('div', { style:'display:flex;gap:8px;justify-content:flex-end;margin-bottom:16px' });
      if (!isPolicyEditing) actionBar.appendChild(editPolicyBtn);

      // 적용된 정책 테이블
      const cols = [
        { key:'name', label:'정책 이름' },
        { key:'types', label:'탐지 유형', render: v => h('div',{class:'flex gap-8'},...v.map(t=>detTypeBadge(t))) },
        { key:'active', label:'상태', width:'80px', render: v => statusBadge(v ? 'active':'inactive') },
      ];
      if (isPolicyEditing) {
        cols.push({ key:'_act', label:'', width:'60px', render:(_,r) => {
          const btn = h('button', { class:'btn btn-d btn-xs' }, '해제');
          btn.addEventListener('click', e => {
            e.stopPropagation();
            const idx = appliedPolicies.findIndex(p => p.policyId === r.policyId);
            if (idx !== -1) appliedPolicies.splice(idx, 1);
            toast('정책이 해제되었습니다.', 'warn');
            tabContent._isPolicyEditing = true;
            renderTab(); renderFooter();
          });
          return btn;
        }});
      }
      const tbl = mkTable(cols, appliedPolicies);

      tabContent.appendChild(actionBar);
      tabContent.appendChild(tbl);

      // 수정 모드: 정책 검색 영역
      if (isPolicyEditing) {
        const searchWrap = h('div', { style:'margin-top:20px;border-top:1px solid var(--bd);padding-top:16px' });
        const searchTitle = h('div', { style:'font-size:14px;font-weight:700;color:#1e293b;margin-bottom:10px' }, '정책 검색 및 추가');
        const searchInp = h('input', { class:'inp', type:'text', placeholder:'정책 이름으로 검색...' });
        const resultWrap = h('div', { style:'margin-top:10px' });

        function renderSearchResults() {
          resultWrap.innerHTML = '';
          const q = searchInp.value.toLowerCase();
          const appliedIds = new Set(appliedPolicies.map(p => p.policyId));
          const candidates = DUMMY.policies.filter(p =>
            !appliedIds.has(p.policyId) && (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
          );
          if (candidates.length === 0) {
            resultWrap.appendChild(h('div', { style:'color:#94a3b8;font-size:13px;padding:12px 0' }, q ? '검색 결과가 없습니다.' : '추가할 수 있는 정책이 없습니다.'));
            return;
          }
          candidates.forEach(p => {
            const row = h('div', { style:'display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border:1px solid var(--bd);border-radius:8px;margin-bottom:6px;background:#fff' },
              h('div', {},
                h('div', { style:'font-size:14px;font-weight:600;color:#1e293b' }, p.name),
                h('div', { style:'font-size:12px;color:#64748b;margin-top:2px' }, p.desc)
              )
            );
            const addBtn = h('button', { class:'btn btn-p btn-xs' }, '추가');
            addBtn.addEventListener('click', () => {
              appliedPolicies.push(p);
              toast(`'${p.name}' 정책이 추가되었습니다.`);
              tabContent._isPolicyEditing = true;
              renderTab(); renderFooter();
            });
            row.appendChild(addBtn);
            resultWrap.appendChild(row);
          });
        }

        searchInp.addEventListener('input', renderSearchResults);
        searchWrap.appendChild(searchTitle);
        searchWrap.appendChild(searchInp);
        searchWrap.appendChild(resultWrap);
        tabContent.appendChild(searchWrap);
        renderSearchResults();
      }
    } else if (activeTab === 'pauses') {
      const allPauses = DUMMY.pauses.filter(p => p.groupId === group.groupId);
      const fromInp = h('input', { class:'inp', type:'date', style:'flex:1' });
      const toInp = h('input', { class:'inp', type:'date', style:'flex:1' });
      const statusSel = h('select', { class:'inp', style:'max-width:100px' },
        h('option', { value:'' }, '전체'),
        h('option', { value:'ACTIVE' }, '진행중'),
        h('option', { value:'EXPIRED' }, '만료'),
        h('option', { value:'CANCELLED' }, '취소')
      );
      const filterBar = h('div', { style:'display:flex;gap:8px;margin-bottom:12px;align-items:center' },
        h('span', { style:'font-size:12px;color:#64748b;white-space:nowrap' }, '기간'),
        fromInp, h('span', { style:'font-size:12px;color:#94a3b8' }, '~'), toInp, statusSel
      );
      const tableWrap = h('div', {});
      function renderPauseTable() {
        const from = fromInp.value ? new Date(fromInp.value) : null;
        const to = toInp.value ? new Date(toInp.value + 'T23:59:59') : null;
        const s = statusSel.value;
        const filtered = allPauses.filter(p => {
          if (from && new Date(p.startAt) < from) return false;
          if (to && new Date(p.startAt) > to) return false;
          if (s && p.status !== s) return false;
          return true;
        });
        tableWrap.innerHTML = '';
        tableWrap.appendChild(filtered.length
          ? mkTable([
              { key:'pauseType', label:'유형' },
              { key:'requester', label:'요청자' },
              { key:'startAt', label:'시작', render: v => fmtDT(v) },
              { key:'endAt', label:'종료', render: v => fmtDT(v) },
              { key:'status', label:'상태', render: v => statusBadge(v==='ACTIVE'?'active':'inactive') },
            ], filtered)
          : h('div',{class:'empty'},h('div',{class:'empty-title'},'탐지 중단 이력 없음'))
        );
      }
      fromInp.addEventListener('change', renderPauseTable);
      toInp.addEventListener('change', renderPauseTable);
      statusSel.addEventListener('change', renderPauseTable);
      tabContent.appendChild(filterBar);
      tabContent.appendChild(tableWrap);
      renderPauseTable();
    }
  }

  const footerEl = h('div', { class: 'mod-f' });

  function renderFooter() {
    footerEl.innerHTML = '';
    footerEl.style.display = '';
    if (activeTab === 'info') {
      if (isEditing) {
        const cancelBtn = h('button', { class:'btn btn-outline' }, '취소');
        cancelBtn.addEventListener('click', () => { isEditing = false; renderTab(); renderFooter(); });
        const saveBtn = h('button', { class:'btn btn-p', onClick: () => { toast('저장되었습니다.'); isEditing = false; renderTab(); renderFooter(); } }, '저장');
        footerEl.appendChild(h('div', {}));
        footerEl.appendChild(h('div', { class:'mod-f-right' }, cancelBtn, saveBtn));
      } else {
        const editBtn = h('button', { class:'btn btn-outline' }, '수정');
        const delBtn = h('button', { class:'btn btn-d' }, '삭제');
        editBtn.addEventListener('click', () => { isEditing = true; renderTab(); renderFooter(); });
        delBtn.addEventListener('click', () => { if(window.confirm('이 그룹을 삭제하시겠습니까?')){toast('삭제되었습니다.','warn');closePanel();} });
        footerEl.appendChild(h('div', {}));
        footerEl.appendChild(h('div', { class:'mod-f-right' }, editBtn, delBtn));
      }
    } else if (activeTab === 'policies') {
      if (tabContent._isPolicyEditing) {
        const cancelBtn = h('button', { class:'btn btn-outline' }, '취소');
        cancelBtn.addEventListener('click', () => { tabContent._isPolicyEditing = false; renderTab(); renderFooter(); });
        const saveBtn = h('button', { class:'btn btn-p', onClick: () => { toast('정책이 저장되었습니다.'); tabContent._isPolicyEditing = false; renderTab(); renderFooter(); } }, '저장');
        footerEl.appendChild(h('div', {}));
        footerEl.appendChild(h('div', { class:'mod-f-right' }, cancelBtn, saveBtn));
      } else {
        footerEl.style.display = 'none';
      }
    } else {
      footerEl.style.display = 'none';
    }
  }

  const tabs = h('div', { class:'tabs' },
    ...[
      { id:'info', label:'기본정보' },
      { id:'devices', label:`단말목록 (${group.deviceCount})` },
      { id:'policies', label:'적용정책' },
      { id:'pauses', label:'탐지중단현황' },
    ].map(t => {
      const tab = h('div', { class:'tab'+(t.id===activeTab?' a':'') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTab();
        renderFooter();
      });
      return tab;
    })
  );

  const body = h('div', {}, tabs, tabContent);
  renderTab();
  renderFooter();

  return h('div', { style:'display:flex;flex-direction:column;height:100%' },
    h('div', { class:'mod-h' },
      h('button', { class:'cx', onClick: () => closePanel() }, '✕'),
      h('h2', {}, (DUMMY.schools.find(s => s.schoolId === group.schoolId) || {}).name || group.name)
    ),
    h('div', { class:'mod-b', style:'flex:1;overflow-y:auto' }, body),
    footerEl
  );
}

/* -- Device Detail Panel -- */
function renderDeviceDetailPanel(id) {
  const device = DUMMY.devices.find(d => d.deviceId === id) || DUMMY.devices[0];
  let activeTab = 'info';
  const tabContent = h('div', {});

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      tabContent.appendChild(h('dl', { class:'info-row' },
        h('dt',{},'단말명'),       h('dd',{},device.name),
        h('dt',{},'식별자'),       h('dd',{},device.identifier),
        h('dt',{},'소속 그룹'),    h('dd',{},device.groupName || '미배정'),
        h('dt',{},'상태'),         h('dd',{},statusBadge(device.status)),
        h('dt',{},'정책 상태'),    h('dd',{},statusBadge(device.policyStatus)),
        h('dt',{},'최근 접속'),    h('dd',{},fmtDT(device.lastContact))
      ));
    } else if (activeTab === 'policy') {
      const policy = DUMMY.policies.find(p => p.active);
      tabContent.appendChild(policy
        ? h('div', { class:'card' },
            h('div',{class:'card-title'},policy.name),
            h('div',{style:'color:var(--t2);font-size:13px;margin-top:4px'},policy.desc),
            h('div',{class:'mt-16'},h('div',{class:'sub-label'},'탐지 설정'),
              h('div',{style:'display:flex;align-items:center;gap:8px;margin-top:8px'},
                policyTypeBadge(policy),
                h('span',{style:'font-size:13px;color:#374151'}, policyDetectSummary(policy))
              )
            )
          )
        : h('div',{class:'empty'},h('div',{class:'empty-title'},'적용된 정책 없음'))
      );
    } else if (activeTab === 'history') {
      const allDets = DUMMY.detections.filter(d => d.deviceName === device.name);
      const fromInp = h('input', { class:'inp', type:'date', style:'flex:1' });
      const toInp = h('input', { class:'inp', type:'date', style:'flex:1' });
      const typeSel = h('select', { class:'inp', style:'max-width:100px' },
        h('option', { value:'' }, '전체 유형'),
        h('option', { value:'선정성' }, '선정성'),
        h('option', { value:'도박' }, '도박'),
        h('option', { value:'폭력' }, '폭력'),
        h('option', { value:'기타' }, '기타')
      );
      const filterBar = h('div', { style:'display:flex;gap:8px;margin-bottom:12px;align-items:center' },
        h('span', { style:'font-size:12px;color:#64748b;white-space:nowrap' }, '기간'),
        fromInp, h('span', { style:'font-size:12px;color:#94a3b8' }, '~'), toInp, typeSel
      );
      const tableWrap = h('div', {});
      function renderHistTable() {
        const from = fromInp.value ? new Date(fromInp.value) : null;
        const to = toInp.value ? new Date(toInp.value + 'T23:59:59') : null;
        const t = typeSel.value;
        const filtered = allDets.filter(d => {
          if (from && new Date(d.detectedAt) < from) return false;
          if (to && new Date(d.detectedAt) > to) return false;
          if (t && d.type !== t) return false;
          return true;
        });
        tableWrap.innerHTML = '';
        tableWrap.appendChild(mkTable([
          { key:'detectedAt', label:'탐지 시각', render: v => fmtDT(v) },
          { key:'type', label:'유형', render: v => detTypeBadge(v) },
          { key:'status', label:'상태', render: v => statusBadge(v) },
        ], filtered));
      }
      fromInp.addEventListener('change', renderHistTable);
      toInp.addEventListener('change', renderHistTable);
      typeSel.addEventListener('change', renderHistTable);
      tabContent.appendChild(filterBar);
      tabContent.appendChild(tableWrap);
      renderHistTable();
    }
  }

  const tabs = h('div', { class:'tabs' },
    ...[
      { id:'info', label:'기본정보' },
      { id:'policy', label:'적용정책' },
      { id:'history', label:'탐지이력' },
    ].map(t => {
      const tab = h('div', { class:'tab'+(t.id===activeTab?' a':'') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTab();
      });
      return tab;
    })
  );

  const body = h('div', {}, tabs, tabContent);
  renderTab();
  return mkPanel(device.name, body, null, null);
}

/* -- Policy New Panel -- */
function renderPolicyNewPanel() {
  const nameInp = h('input', { class:'inp', placeholder:'정책 이름', type:'text' });
  const descInp = h('textarea', { class:'inp', placeholder:'설명', rows:3 });

  // 탐지 유형 상태
  let selectedType = ''; // '선정성' | '도박'
  const detState = {
    '선정성': { detectionItems:[...DETECTION_ITEMS] },
    '도박': { grade:'하', detectedUrls:[] },
  };

  const optionsArea = h('div', { style:'margin-top:12px' });

  // 선정성 옵션
  function renderAdultOptions() {
    const state = detState['선정성'];
    const allChk = h('input',{type:'checkbox'});
    const itemChks = [];
    function syncAllChk() {
      const checked = itemChks.filter(c=>c.checked).length;
      allChk.indeterminate = checked > 0 && checked < itemChks.length;
      allChk.checked = checked === itemChks.length;
    }
    const checks = DETECTION_ITEMS.map(item => {
      const chk = h('input',{type:'checkbox'});
      itemChks.push(chk);
      chk.checked = (state.detectionItems||[]).includes(item);
      chk.addEventListener('change', () => {
        if (!state.detectionItems) state.detectionItems = [];
        if (chk.checked) { if (!state.detectionItems.includes(item)) state.detectionItems.push(item); }
        else { state.detectionItems = state.detectionItems.filter(i=>i!==item); }
        syncAllChk();
      });
      return h('label',{style:'display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer'},chk,item);
    });
    allChk.checked = itemChks.every(c=>c.checked);
    allChk.addEventListener('change', () => {
      itemChks.forEach(c => { c.checked = allChk.checked; c.dispatchEvent(new Event('change')); });
    });
    const allLabel = h('label',{style:'display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;cursor:pointer;color:#374151'},allChk,'전체 선택');
    optionsArea.innerHTML = '';
    optionsArea.appendChild(h('div', { style:'border:1px solid var(--bd);border-radius:8px;padding:14px' },
      h('div',{style:'font-size:12px;font-weight:600;color:#64748b;margin-bottom:8px'},'탐지 항목'),
      h('div',{style:'display:flex;flex-wrap:wrap;gap:8px 16px'},allLabel,...checks)
    ));
  }

  // 도박 옵션
  function renderGamblingOptions() {
    const state = detState['도박'];
    const gradeSelect = h('select',{class:'inp',style:'max-width:120px'},
      ...GAMBLING_GRADES.map(g=>h('option',{value:g,selected:state.grade===g},g))
    );
    gradeSelect.addEventListener('change',()=>{ state.grade=gradeSelect.value; });

    optionsArea.innerHTML = '';
    optionsArea.appendChild(h('div',{style:'border:1px solid var(--bd);border-radius:8px;padding:14px'},
      h('div',{style:'font-size:12px;font-weight:600;color:#64748b;margin-bottom:4px'},'탐지 등급'),
      gradeSelect
    ));
  }

  // 유형 선택 라디오
  const typeArea = h('div',{style:'display:flex;gap:12px;margin-top:6px'});
  ['선정성','도박'].forEach(type => {
    const color = type==='선정성'?'#ef4444':'#f59e0b';
    const btn = h('div',{
      style:'padding:10px 20px;border:2px solid var(--bd);border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;color:#64748b;transition:all 0.15s'
    }, type);
    btn.addEventListener('click',()=>{
      selectedType = type;
      typeArea.querySelectorAll('div').forEach(b=>{ b.style.borderColor='var(--bd)'; b.style.color='#64748b'; b.style.background=''; });
      btn.style.borderColor = color;
      btn.style.color = color;
      btn.style.background = type==='선정성'?'#fef2f2':'#fffbeb';
      if (type==='선정성') renderAdultOptions();
      else renderGamblingOptions();
    });
    typeArea.appendChild(btn);
  });

  const activeToggle = h('input',{type:'checkbox',checked:true});
  const body = h('div',{style:'display:flex;flex-direction:column;gap:12px'},
    fg('정책 이름', nameInp, true),
    fg('설명', descInp, false),
    h('div',{class:'fg'},
      h('label',{},'탐지 유형'),
      typeArea
    ),
    optionsArea,
    h('div',{class:'fg'},h('label',{},'활성화'),
      h('label',{class:'tog'},
        h('div',{class:'tog-track on',onClick:function(){this.classList.toggle('on');activeToggle.checked=this.classList.contains('on');}},
          h('div',{class:'tog-thumb'})
        ),
        h('span',{style:'font-size:13px;color:var(--t1);margin-left:6px'},'활성')
      )
    )
  );

  function onSave() {
    nameInp.classList.remove('error');
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); toast('정책 이름을 입력하세요.','err'); return; }
    if (!selectedType) { toast('탐지 유형을 선택하세요.','err'); return; }
    if (selectedType==='선정성' && (detState['선정성'].detectionItems||[]).length===0) {
      toast('탐지 항목을 하나 이상 선택하세요.','err'); return;
    }
    toast('정책이 생성되었습니다.');
    closePanel();
  }

  return mkPanel('정책 생성', body, onSave, '정책 생성');
}

/* -- Policy Detail Panel -- */
function renderPolicyDetailPanel(id) {
  const policy = DUMMY.policies.find(p => p.policyId === id) || DUMMY.policies[0];
  let isEditing = false;
  const appliedGroups = DUMMY.groups.slice(0, policy.appliedCount);

  const contentEl = h('div', {});
  const footerEl = h('div', { class:'mod-f' });

  function renderContent() {
    contentEl.innerHTML = '';

    if (!isEditing) {
      contentEl.appendChild(h('dl', { class:'info-row' },
        h('dt',{},'정책 이름'), h('dd',{},policy.name),
        h('dt',{},'설명'), h('dd',{},policy.desc || '—'),
        h('dt',{},'탐지 유형'), h('dd',{}, policyTypeBadge(policy)),
        h('dt',{},'탐지 내용'), h('dd',{style:'font-size:13px'}, policyDetectSummary(policy)),
        h('dt',{},'상태'), h('dd',{},statusBadge(policy.active ? 'active':'inactive')),
        h('dt',{},'수정일'), h('dd',{},fmtD(policy.updatedAt))
      ));

      const groupSec = h('div', { style:'margin-top:24px;padding-top:16px;border-top:1px solid var(--bd)' },
        h('div', { style:'font-size:14px;font-weight:700;color:var(--t1);margin-bottom:12px' }, `적용 그룹 (${appliedGroups.length}개)`)
      );
      groupSec.appendChild(appliedGroups.length
        ? mkTable([
            { key:'_school', label:'학교', render:(_,r) => {
              const sch = DUMMY.schools.find(s => s.schoolId === r.schoolId) || {};
              return sch.name || '—';
            }},
            { key:'_type', label:'학교유형', width:'90px', render:(_,r) => {
              const sch = DUMMY.schools.find(s => s.schoolId === r.schoolId) || {};
              return sch.type || '—';
            }},
            { key:'deviceCount', label:'단말 수', width:'80px', render: v => v+'대' },
          ], appliedGroups)
        : h('div',{style:'font-size:13px;color:#94a3b8;padding:12px 0'},'적용된 그룹 없음')
      );
      contentEl.appendChild(groupSec);
    } else {
      const nameInp = h('input', { class:'inp', value:policy.name, type:'text' });
      const descInp = h('textarea', { class:'inp', rows:3 }, policy.desc);
      const activeToggle = h('input', { type:'checkbox' });
      activeToggle.checked = policy.active;

      contentEl.appendChild(h('div', { style:'display:flex;flex-direction:column;gap:16px' },
        fg('정책 이름', nameInp, true),
        fg('설명', descInp, false),
        fg('활성 상태', h('label', { style:'display:flex;align-items:center;gap:8px;font-size:14px' }, activeToggle, '활성'), false)
      ));

      const detSec = h('div',{style:'margin-top:20px;padding-top:16px;border-top:1px solid var(--bd)'});
      detSec.appendChild(h('div',{style:'font-size:14px;font-weight:700;color:var(--t1);margin-bottom:12px'}, '탐지 설정'));

      const editPolicy = JSON.parse(JSON.stringify(policy)); // deep copy for editing

      if (policy.type === '선정성') {
        // detectionItems 체크박스
        const allChkE = h('input',{type:'checkbox'});
        const itemChksE = [];
        function syncAllChkE() {
          const checked = itemChksE.filter(c=>c.checked).length;
          allChkE.indeterminate = checked > 0 && checked < itemChksE.length;
          allChkE.checked = checked === itemChksE.length;
        }
        const itemChecks = DETECTION_ITEMS.map(item => {
          const chk = h('input',{type:'checkbox'});
          itemChksE.push(chk);
          chk.checked = (editPolicy.detectionItems||[]).includes(item);
          chk.addEventListener('change',()=>{
            if (!editPolicy.detectionItems) editPolicy.detectionItems=[];
            if (chk.checked){if(!editPolicy.detectionItems.includes(item))editPolicy.detectionItems.push(item);}
            else{editPolicy.detectionItems=editPolicy.detectionItems.filter(i=>i!==item);}
            syncAllChkE();
          });
          return h('label',{style:'display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer'},chk,item);
        });
        allChkE.checked = itemChksE.every(c=>c.checked);
        allChkE.addEventListener('change', () => {
          itemChksE.forEach(c => { c.checked = allChkE.checked; c.dispatchEvent(new Event('change')); });
        });
        const allLabelE = h('label',{style:'display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;cursor:pointer;color:#374151'},allChkE,'전체 선택');
        detSec.appendChild(h('div',{},
          h('div',{style:'font-size:12px;font-weight:600;color:#64748b;margin-bottom:6px'},'탐지 항목'),
          h('div',{style:'display:flex;flex-wrap:wrap;gap:8px 16px;margin-bottom:12px'},allLabelE,...itemChecks)
        ));
      } else if (policy.type === '도박') {
        // grade select
        const gradeSelect = h('select',{class:'inp',style:'max-width:120px'},
          ...GAMBLING_GRADES.map(g=>h('option',{value:g,selected:editPolicy.grade===g},g))
        );
        gradeSelect.addEventListener('change',()=>{editPolicy.grade=gradeSelect.value;});
        detSec.appendChild(h('div',{},
          h('div',{style:'font-size:12px;font-weight:600;color:#64748b;margin-bottom:4px'},'탐지 등급'), gradeSelect
        ));
      }

      contentEl.appendChild(detSec);

      // 적용 그룹
      const groupSec = h('div', { style:'margin-top:24px;padding-top:16px;border-top:1px solid var(--bd)' });
      const groupHeader = h('div', { style:'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px' },
        h('div', { style:'font-size:14px;font-weight:700;color:var(--t1)' }, `적용 그룹 (${appliedGroups.length}개)`),
        h('button', { class:'btn btn-p btn-sm' }, '그룹 추가')
      );
      groupHeader.querySelector('.btn').addEventListener('click', () => {
        const appliedIds = new Set(appliedGroups.map(g => g.groupId));
        const candidates = DUMMY.groups.filter(g => !appliedIds.has(g.groupId));
        showSelectModal('그룹 추가', candidates,
          g => {
            const school = DUMMY.schools.find(s => s.schoolId === g.schoolId) || {};
            return { name: school.name || g.name, sub: `${school.type || ''} · 단말 ${g.deviceCount}대` };
          },
          selected => { selected.forEach(g => appliedGroups.push(g)); renderContent(); renderFooter(); },
          { schoolFilter: true }
        );
      });
      groupSec.appendChild(groupHeader);
      if (appliedGroups.length) {
        groupSec.appendChild(mkTable([
          { key:'_school', label:'학교', render:(_,r) => {
            const school = DUMMY.schools.find(s => s.schoolId === r.schoolId) || {};
            return school.name || '—';
          }},
          { key:'_type', label:'학교유형', width:'90px', render:(_,r) => {
            const school = DUMMY.schools.find(s => s.schoolId === r.schoolId) || {};
            return school.type || '—';
          }},
          { key:'deviceCount', label:'단말 수', width:'80px', render: v => v+'대' },
          { key:'_act', label:'', width:'60px', render:(_,r) => {
            const btn = h('button', { class:'btn btn-d btn-xs' }, '해제');
            btn.addEventListener('click', e => {
              e.stopPropagation();
              const idx = appliedGroups.findIndex(g => g.groupId === r.groupId);
              if (idx !== -1) appliedGroups.splice(idx, 1);
              toast('그룹이 해제되었습니다.', 'warn');
              renderContent(); renderFooter();
            });
            return btn;
          }},
        ], appliedGroups));
      } else {
        groupSec.appendChild(h('div',{style:'font-size:13px;color:#94a3b8;padding:12px 0'},'적용된 그룹 없음'));
      }
      contentEl.appendChild(groupSec);
    }
  }

  function renderFooter() {
    footerEl.innerHTML = '';
    footerEl.style.display = '';
    if (isEditing) {
      const cancelBtn = h('button', { class:'btn btn-outline' }, '취소');
      cancelBtn.addEventListener('click', () => { isEditing = false; renderContent(); renderFooter(); });
      const saveBtn = h('button', { class:'btn btn-p', onClick: () => { toast('저장되었습니다.'); isEditing = false; renderContent(); renderFooter(); } }, '저장');
      footerEl.appendChild(h('div', {}));
      footerEl.appendChild(h('div', { class:'mod-f-right' }, cancelBtn, saveBtn));
    } else {
      const editBtn = h('button', { class:'btn btn-outline' }, '수정');
      const delBtn = h('button', { class:'btn btn-d' }, '삭제');
      editBtn.addEventListener('click', () => { isEditing = true; renderContent(); renderFooter(); });
      delBtn.addEventListener('click', () => { toast('정책이 삭제되었습니다.','warn'); closePanel(); });
      footerEl.appendChild(h('div', {}));
      footerEl.appendChild(h('div', { class:'mod-f-right' }, editBtn, delBtn));
    }
  }

  renderContent();
  renderFooter();

  return h('div', { style:'display:flex;flex-direction:column;height:100%' },
    h('div', { class:'mod-h' },
      h('button', { class:'cx', onClick: () => closePanel() }, '✕'),
      h('h2', {}, policy.name)
    ),
    h('div', { class:'mod-b', style:'flex:1;overflow-y:auto' }, contentEl),
    footerEl
  );
}

/* -- User New Panel -- */
function renderUserNewPanel() {
  const nameInp  = h('input', { class:'inp', placeholder:'이름', type:'text' });
  const userInp  = h('input', { class:'inp', placeholder:'아이디', type:'text' });
  const pwInp    = h('input', { class:'inp', placeholder:'초기 비밀번호', type:'password' });
  const roleInp  = h('select', { class:'inp' },
    h('option',{value:''},'역할 선택'),
    h('option',{value:'admin'},'관리자'),
    h('option',{value:'staff'},'직원'),
    h('option',{value:'teacher'},'선생님')
  );
  const contactInp = h('input', { class:'inp', placeholder:'010-0000-0000', type:'text' });

  const gradeInp = h('select', { class:'inp' },
    h('option',{value:''},'학년 선택'),
    ...[1,2,3].map(i => h('option',{value:String(i)},i+'학년'))
  );
  const clsInp = h('select', { class:'inp' },
    h('option',{value:''},'반 선택 (전체)'),
    ...[1,2,3,4,5,6].map(i => h('option',{value:String(i)},i+'반'))
  );

  const body = h('div', {},
    h('div', { class:'form-row' }, fg('이름', nameInp, true), fg('아이디', userInp, true)),
    h('div', { class:'form-row section-gap' }, fg('비밀번호', pwInp, true), fg('역할', roleInp, true)),
    fg('연락처', contactInp, false),
    h('div', { class:'sep' }),
    h('div', { class:'sub-label' }, '담당 학년/반'),
    h('div', { class:'form-row section-gap' }, fg('학년', gradeInp, false), fg('반', clsInp, false))
  );

  function onSave() {
    [nameInp, userInp, pwInp, roleInp].forEach(el => el.classList.remove('error'));
    let ok = true;
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); ok = false; }
    if (!userInp.value.trim()) { userInp.classList.add('error'); ok = false; }
    if (!pwInp.value.trim())   { pwInp.classList.add('error'); ok = false; }
    if (!roleInp.value)        { roleInp.classList.add('error'); ok = false; }
    if (!ok) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('사용자가 등록되었습니다.');
    closePanel();
  }

  return mkPanel('사용자 등록', body, onSave, '등록');
}

/* -- User Detail Panel -- */
function renderUserDetailPanel(id) {
  const user = DUMMY.users.find(u => u.userId === id) || DUMMY.users[0];
  let activeTab = 'info';
  let isEditing = false;
  const tabContent = h('div', {});

  // Local state: assignments
  const assignments = (user.assignments || []).map(a => ({ ...a }));

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      if (!isEditing) {
        tabContent.appendChild(h('dl', { class:'info-row' },
          h('dt',{},'이름'),      h('dd',{},user.name),
          h('dt',{},'연락처'),    h('dd',{},user.contact),
          h('dt',{},'아이디'),    h('dd',{},user.username),
          h('dt',{},'역할'),      h('dd',{},user.role === 'admin' ? '관리자' : user.role === 'staff' ? '직원' : '선생님'),
          h('dt',{},'상태'),      h('dd',{},statusBadge(user.status)),
          h('dt',{},'최근 접속'), h('dd',{},fmtDT(user.lastLogin))
        ));
      } else {
        const nameInp    = h('input', { class:'inp', value:user.name, type:'text' });
        const contactInp = h('input', { class:'inp', value:user.contact, type:'text' });
        tabContent.appendChild(h('div', { style:'display:flex;flex-direction:column;gap:16px' },
          fg('이름', nameInp, true),
          fg('연락처', contactInp, false),
          h('dl', { class:'info-row mt-16' },
            h('dt',{},'아이디'),    h('dd',{},user.username),
            h('dt',{},'역할'),      h('dd',{},user.role === 'admin' ? '관리자' : user.role === 'staff' ? '직원' : '선생님'),
            h('dt',{},'상태'),      h('dd',{},statusBadge(user.status)),
            h('dt',{},'최근 접속'), h('dd',{},fmtDT(user.lastLogin))
          )
        ));
      }
    } else if (activeTab === 'assignments') {
      let isAssignEditing = tabContent._isAssignEditing || false;

      if (!isAssignEditing) {
        const actionBar = h('div', { style:'display:flex;gap:8px;justify-content:flex-end;margin-bottom:12px' });
        const editBtn = h('button', { class:'btn btn-outline btn-sm' }, '수정');
        editBtn.addEventListener('click', () => { tabContent._isAssignEditing = true; renderTab(); renderFooter(); });
        actionBar.appendChild(editBtn);
        tabContent.appendChild(actionBar);

        const assignGroups = assignments.map(a => {
          const grp = DUMMY.groups.find(g => g.groupId === a.groupId);
          const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
          return { groupId: a.groupId, groupName: grp ? grp.name : '—', schoolName: sch ? sch.name : '—' };
        });
        tabContent.appendChild(assignGroups.length
          ? mkTable([
              { key:'schoolName', label:'학교' },
              { key:'groupName',  label:'그룹 이름' },
            ], assignGroups)
          : h('div', { class:'empty' }, h('div', { class:'empty-title' }, '담당 범위 없음'))
        );
      } else {
        // 학년/반 추가 셀렉트
        const gradeAddSel = h('select', { class:'inp', style:'min-width:100px' },
          h('option', { value:'' }, '학년 선택'),
          h('option', { value:'1' }, '1학년'),
          h('option', { value:'2' }, '2학년'),
          h('option', { value:'3' }, '3학년')
        );
        const clsAddSel = h('select', { class:'inp', style:'min-width:90px' },
          h('option', { value:'' }, '반 선택'),
          h('option', { value:'0' }, '전체'),
          ...[1,2,3,4,5,6].map(c => h('option', { value:String(c) }, c+'반'))
        );
        const addBtn = h('button', { class:'btn btn-p btn-sm' }, '추가');
        addBtn.addEventListener('click', () => {
          const g = Number(gradeAddSel.value);
          const c = Number(clsAddSel.value);
          if (!gradeAddSel.value) { toast('학년을 선택해주세요.','warn'); return; }
          if (clsAddSel.value === '') { toast('반을 선택해주세요.','warn'); return; }
          if (assignments.some(a => a.grade === g && a.cls === c)) { toast('이미 추가된 범위입니다.','warn'); return; }
          assignments.push({ grade: g, cls: c });
          toast(`${g}학년 ${c === 0 ? '전체' : c+'반'}이 추가되었습니다.`);
          tabContent._isAssignEditing = true;
          renderTab(); renderFooter();
        });
        const addBar = h('div', { style:'display:flex;gap:8px;align-items:center;margin-bottom:16px' }, gradeAddSel, clsAddSel, addBtn);
        tabContent.appendChild(addBar);

        // 테이블 + 제거 버튼
        tabContent.appendChild(assignments.length
          ? mkTable([
              { key:'grade', label:'학년', render: v => v+'학년' },
              { key:'cls',   label:'반',   render: v => v === 0 ? '전체' : v+'반' },
              { key:'_act',  label:'', width:'60px', render:(_,r) => {
                const btn = h('button', { class:'btn btn-d btn-xs' }, '제거');
                btn.addEventListener('click', e => {
                  e.stopPropagation();
                  const idx = assignments.findIndex(a => a.grade === r.grade && a.cls === r.cls);
                  if (idx !== -1) assignments.splice(idx, 1);
                  toast('담당 범위가 제거되었습니다.', 'warn');
                  tabContent._isAssignEditing = true;
                  renderTab(); renderFooter();
                });
                return btn;
              }},
            ], assignments)
          : h('div', { class:'empty' }, h('div', { class:'empty-title' }, '담당 범위 없음'))
        );
      }
    } else if (activeTab === 'pauseHistory') {
      const allUserPauses = DUMMY.pauses.filter(p => p.requester === user.name);
      const fromInp = h('input', { class:'inp', type:'date', style:'flex:1' });
      const toInp = h('input', { class:'inp', type:'date', style:'flex:1' });
      const typeSel = h('select', { class:'inp', style:'min-width:90px' },
        h('option', { value:'' }, '전체 유형'),
        h('option', { value:'전체' }, '전체'),
        h('option', { value:'선정성' }, '선정성'),
        h('option', { value:'도박' }, '도박'),
        h('option', { value:'폭력' }, '폭력')
      );
      const filterBar = h('div', { style:'display:flex;gap:8px;margin-bottom:12px;align-items:center' },
        fromInp, h('span', { style:'font-size:12px;color:#94a3b8' }, '~'), toInp, typeSel
      );
      const tableWrap = h('div', {});
      function renderPauseTable() {
        tableWrap.innerHTML = '';
        const from = fromInp.value ? new Date(fromInp.value) : null;
        const to = toInp.value ? new Date(toInp.value + 'T23:59:59') : null;
        const t = typeSel.value;
        const filtered = allUserPauses.filter(p => {
          if (from && new Date(p.startAt) < from) return false;
          if (to && new Date(p.startAt) > to) return false;
          if (t && p.pauseType !== t) return false;
          return true;
        });
        tableWrap.appendChild(filtered.length
          ? mkTable([
              { key:'grade',     label:'학년/반', render:(v,r)=>`${r.grade}학년 ${r.cls}반` },
              { key:'pauseType', label:'유형' },
              { key:'startAt',   label:'시작', render: v => fmtDT(v) },
              { key:'status',    label:'상태', render: v => statusBadge(v==='ACTIVE'?'active':'inactive') },
            ], filtered)
          : h('div', { class:'empty' }, h('div', { class:'empty-title' }, '탐지 중단 이력 없음'))
        );
      }
      fromInp.addEventListener('change', renderPauseTable);
      toInp.addEventListener('change', renderPauseTable);
      typeSel.addEventListener('change', renderPauseTable);
      tabContent.appendChild(filterBar);
      tabContent.appendChild(tableWrap);
      renderPauseTable();
    }
  }

  const footerEl = h('div', { class:'mod-f' });

  function renderFooter() {
    footerEl.innerHTML = '';
    footerEl.style.display = '';
    if (activeTab === 'info') {
      if (isEditing) {
        const cancelBtn = h('button', { class:'btn btn-outline' }, '취소');
        cancelBtn.addEventListener('click', () => { isEditing = false; renderTab(); renderFooter(); });
        const saveBtn = h('button', { class:'btn btn-p', onClick: () => { toast('저장되었습니다.'); isEditing = false; renderTab(); renderFooter(); } }, '저장');
        footerEl.appendChild(h('div', {}));
        footerEl.appendChild(h('div', { class:'mod-f-right' }, cancelBtn, saveBtn));
      } else {
        const editBtn = h('button', { class:'btn btn-outline' }, '수정');
        const delBtn = h('button', { class:'btn btn-d' }, '삭제');
        editBtn.addEventListener('click', () => { isEditing = true; renderTab(); renderFooter(); });
        delBtn.addEventListener('click', () => { toast('사용자가 삭제되었습니다.','warn'); closePanel(); });
        footerEl.appendChild(h('div', {}));
        footerEl.appendChild(h('div', { class:'mod-f-right' }, editBtn, delBtn));
      }
    } else if (activeTab === 'assignments' && tabContent._isAssignEditing) {
      const cancelBtn = h('button', { class:'btn btn-outline' }, '취소');
      cancelBtn.addEventListener('click', () => { tabContent._isAssignEditing = false; renderTab(); renderFooter(); });
      const saveBtn = h('button', { class:'btn btn-p', onClick: () => { toast('저장되었습니다.'); tabContent._isAssignEditing = false; renderTab(); renderFooter(); } }, '저장');
      footerEl.appendChild(h('div', {}));
      footerEl.appendChild(h('div', { class:'mod-f-right' }, cancelBtn, saveBtn));
    } else {
      footerEl.style.display = 'none';
    }
  }

  const tabs = h('div', { class:'tabs' },
    ...[
      { id:'info',         label:'기본정보' },
      { id:'assignments',  label:'담당 범위' },
      { id:'pauseHistory', label:'탐지 중단 이력' },
    ].map(t => {
      const tab = h('div', { class:'tab'+(t.id===activeTab?' a':'') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTab();
        renderFooter();
      });
      return tab;
    })
  );

  const body = h('div', {}, tabs, tabContent);
  renderTab();
  renderFooter();

  return h('div', { style:'display:flex;flex-direction:column;height:100%' },
    h('div', { class:'mod-h' },
      h('button', { class:'cx', onClick: () => closePanel() }, '✕'),
      h('h2', {}, user.name)
    ),
    h('div', { class:'mod-b', style:'flex:1;overflow-y:auto' }, body),
    footerEl
  );
}

/* -- Pause New Panel -- */
function showPauseActiveModal(code, inputMinutes) {
  let totalSec = inputMinutes * 60;
  let connected = [];   // { dev, timeStr }
  let timerIv = null;
  let devIv = null;
  let devPage = 1;
  const DEV_PAGE_SIZE = 10;

  const overlay = h('div', { class:'mov', style:'z-index:1200' });
  const modal = h('div', { class:'mod', style:'width:580px;max-width:96vw;height:680px;max-height:96vh;display:flex;flex-direction:column;position:relative' });

  // Header
  const closeBtn = h('button', { class:'mod-close', style:'position:absolute;top:12px;right:12px;z-index:1' }, '✕');
  const header = h('div', { class:'mod-h' },
    h('div', { class:'mod-h-title' }, '탐지 중단 진행 중')
  );

  // Code
  const codeEl = h('div', {
    style:'font-size:44px;font-weight:800;letter-spacing:14px;text-align:center;padding:16px 0;background:#f0f9ff;border-radius:10px;border:2px dashed #3b82f6;color:#1e293b;margin-bottom:4px'
  }, code);

  // Timer
  const timerLabel = h('div', { style:'text-align:center;font-size:12px;color:#64748b;margin-bottom:2px' }, '코드 입력 시간');
  const timerEl = h('div', { style:'text-align:center;font-size:28px;font-weight:700;color:#ef4444;margin-bottom:12px' }, '');

  function fmtTime(s) {
    return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  }
  function tick() {
    if (totalSec <= 0) {
      timerEl.textContent = '00:00';
      timerEl.style.color = '#94a3b8';
      timerLabel.textContent = '코드 입력 시간 종료';
      clearInterval(timerIv);
      clearInterval(devIv);
      return;
    }
    timerEl.textContent = fmtTime(totalSec);
    totalSec--;
  }
  tick();
  timerIv = setInterval(tick, 1000);

  // Count badge
  const countBadge = h('span', { style:'background:#3b82f6;color:#fff;border-radius:20px;padding:2px 10px;font-size:13px' }, '0대');
  const countRow = h('div', { style:'font-size:14px;font-weight:600;color:#1e293b;margin-bottom:8px;display:flex;align-items:center;gap:8px' },
    h('span', {}, '연결된 단말'), countBadge
  );

  // Search
  const searchInp = h('input', { class:'inp search', type:'text', placeholder:'단말 이름 또는 식별자 검색...', style:'margin-bottom:8px;width:100%' });

  // Device list + pagination
  const devListEl = h('div', { style:'border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;flex:1' });
  const pageWrap = h('div', { style:'display:flex;align-items:center;justify-content:space-between;margin-top:6px;font-size:12px;color:#64748b' });

  function renderDevList() {
    const q = searchInp.value.toLowerCase();
    const filtered = connected.filter(e => !q || e.dev.name.toLowerCase().includes(q) || e.dev.identifier.toLowerCase().includes(q));
    const totalPages = Math.max(1, Math.ceil(filtered.length / DEV_PAGE_SIZE));
    if (devPage > totalPages) devPage = 1;
    const slice = filtered.slice((devPage-1)*DEV_PAGE_SIZE, devPage*DEV_PAGE_SIZE);

    devListEl.innerHTML = '';
    if (slice.length === 0) {
      devListEl.appendChild(h('div', { style:'padding:24px;text-align:center;color:#94a3b8;font-size:13px' },
        connected.length === 0 ? '단말기 연결 대기 중...' : '검색 결과 없음'));
    } else {
      slice.forEach(e => {
        const row = h('div', { style:'display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px' },
          h('span', { style:'font-weight:500;color:#1e293b;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, e.dev.name),
          h('span', { style:'color:#94a3b8;font-size:12px;width:100px;flex-shrink:0' }, e.dev.identifier),
          h('span', { style:'color:#64748b;font-size:12px;width:72px;flex-shrink:0' }, e.timeStr),
          h('span', { style:'background:#dcfce7;color:#16a34a;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:600;flex-shrink:0' }, '연결됨')
        );
        devListEl.appendChild(row);
      });
    }

    pageWrap.innerHTML = '';
    const btnS = 'padding:3px 8px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;font-size:12px;';
    const prev = h('button', { style: btnS }, '← 이전');
    const next = h('button', { style: btnS }, '다음 →');
    prev.disabled = devPage === 1;
    next.disabled = devPage >= totalPages;
    prev.addEventListener('click', () => { devPage--; renderDevList(); });
    next.addEventListener('click', () => { devPage++; renderDevList(); });
    pageWrap.appendChild(prev);
    pageWrap.appendChild(h('span', {}, `${devPage} / ${totalPages || 1} 페이지 (${filtered.length}대)`));
    pageWrap.appendChild(next);
  }
  renderDevList();
  searchInp.addEventListener('input', () => { devPage = 1; renderDevList(); });

  function addDevice(dev) {
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    connected.push({ dev, timeStr: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` });
    countBadge.textContent = `${connected.length}대`;
    renderDevList();
  }

  // Simulate
  const pool = [...DUMMY.devices];
  let pidx = 0;
  function simConnect() {
    if (totalSec <= 0 || pidx >= pool.length) { clearInterval(devIv); return; }
    if (Math.random() < 0.7) addDevice(pool[pidx++]);
  }
  setTimeout(() => { if (pool[pidx]) addDevice(pool[pidx++]); }, 800);
  setTimeout(() => { if (pool[pidx]) addDevice(pool[pidx++]); }, 2200);
  devIv = setInterval(simConnect, 2500);

  function closeModal() {
    clearInterval(timerIv);
    clearInterval(devIv);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
  closeBtn.addEventListener('click', closeModal);

  const body = h('div', { class:'mod-b', style:'flex:1;overflow-y:auto;display:flex;flex-direction:column' },
    codeEl, timerLabel, timerEl,
    countRow, searchInp, devListEl, pageWrap
  );

  modal.appendChild(closeBtn);
  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
}

function renderPauseNewPanel() {
  let code = genPauseCode();
  const codeDisplay = h('div', { style:'font-size:32px;font-weight:700;letter-spacing:10px;color:#1e293b;text-align:center;padding:12px 0;background:#f8fafc;border-radius:8px;border:1px dashed #cbd5e1;margin-bottom:4px' }, code);
  const regenBtn = h('button', { class:'btn btn-outline btn-sm', style:'width:100%;margin-bottom:4px' }, '코드 재생성');
  regenBtn.addEventListener('click', () => { code = genPauseCode(); codeDisplay.textContent = code; });

  const inputTimeInp = h('select', { class:'inp' },
    h('option',{value:'1'},'1분'),
    h('option',{value:'3'},'3분'),
    h('option',{value:'5'},'5분'),
    h('option',{value:'10'},'10분')
  );
  inputTimeInp.value = '3';

  const durHourInp = h('input', { class:'inp', type:'number', min:'0', max:'72', value:'1', style:'width:70px;text-align:center' });
  const durMinInp  = h('input', { class:'inp', type:'number', min:'0', max:'59', value:'0',  style:'width:70px;text-align:center' });
  const durationRow = h('div', { style:'display:flex;align-items:center;gap:6px' },
    durHourInp, h('span', { style:'color:#374151;font-size:14px' }, '시간'),
    durMinInp,  h('span', { style:'color:#374151;font-size:14px' }, '분 후')
  );

  const typeInp = h('select', { class:'inp' },
    h('option',{value:'전체'},'전체 탐지 중단'),
    h('option',{value:'선정성'},'선정성 탐지만'),
    h('option',{value:'도박'},'도박 탐지만')
  );

  const requesterEl = h('div', { style:'padding:6px 0;font-size:14px;color:#374151' }, D.user.name);
  const reasonInp = h('textarea', { class:'inp', placeholder:'중단 사유를 입력하세요', style:'min-height:80px' });

  const body = h('div', {},
    h('div', { class:'section-gap' },
      h('div', { style:'font-size:12px;color:#64748b;margin-bottom:6px;font-weight:500' }, '단말기 입력 인증 코드'),
      codeDisplay,
      regenBtn
    ),
    h('div', { class:'section-gap' }, fg('코드 입력 시간', inputTimeInp, true)),
    h('div', { class:'section-gap' }, fg('중단 유형', typeInp, true)),
    h('div', { class:'section-gap' }, h('div', { class:'fg' }, h('label',{},'탐지 중단 해제 *'), durationRow)),
    h('div', { class:'section-gap' }, h('div', { class:'fg' }, h('label', {}, '요청자'), requesterEl)),
    fg('중단 사유', reasonInp, true)
  );

  function onSave() {
    reasonInp.classList.remove('error');
    const totalMin = (parseInt(durHourInp.value)||0)*60 + (parseInt(durMinInp.value)||0);
    if (totalMin <= 0) { toast('해제 시간을 1분 이상 설정해주세요.', 'err'); return; }
    if (!reasonInp.value.trim()) { reasonInp.classList.add('error'); toast('필수 항목을 입력해주세요.', 'err'); return; }
    closePanel();
    showPauseActiveModal(code, parseInt(inputTimeInp.value));
  }

  return mkPanel('탐지 중단 설정', body, onSave, '중단 시작');
}

/* -- Pause Detail Panel -- */
function renderPauseDetailPanel(pause, onUpdate) {
  const grp = DUMMY.groups.find(g => g.groupId === pause.groupId);
  const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null;
  const schoolName = sch ? sch.name : '—';

  const ROW_S = 'display:flex;gap:0;border-bottom:1px solid var(--bd);padding:12px 0;align-items:flex-start';
  const LBL_S = 'min-width:110px;font-size:13px;color:var(--t3);flex-shrink:0';
  const VAL_S = 'font-size:13px;color:var(--t1);flex:1';

  function row(label, valueEl) {
    const valWrap = h('div', { style: VAL_S });
    if (valueEl instanceof Node) valWrap.appendChild(valueEl);
    else valWrap.textContent = valueEl ?? '—';
    return h('div', { style: ROW_S },
      h('div', { style: LBL_S }, label),
      valWrap
    );
  }

  const roleMap = { teacher:'교사', staff:'운영자', admin:'관리자' };

  const body = h('div', { style:'padding:4px 0' },
    row('학교', schoolName),
    row('중단 유형', pause.pauseType),
    row('요청자', pause.requester),
    row('요청자 역할', roleMap[pause.requesterRole] || pause.requesterRole || '—'),
    row('시작 시각', fmtDT(pause.startAt)),
    row('종료 시각', fmtDT(pause.endAt)),
    row('상태', statusBadge(pause.status)),
    row('사유', pause.reason || '—'),
    pause.cancelReason ? row('취소 사유', pause.cancelReason) : null,
  );

  // Remove null children
  [...body.children].forEach(c => { if (!c) body.removeChild(c); });

  // 해당 그룹의 단말 목록
  const pausedDevices = DUMMY.devices.filter(d => d.groupId === pause.groupId);
  if (pausedDevices.length > 0) {
    const devSection = h('div', { style:'margin-top:16px;padding-top:16px;border-top:1px solid var(--bd)' },
      h('div', { style:'font-size:13px;font-weight:600;color:var(--t1);margin-bottom:10px' },
        `중단 적용 단말 (${pausedDevices.length}대)`),
      mkTable([
        { key:'name', label:'단말 이름', width:'120px' },
        { key:'os', label:'OS', width:'100px' },
        { key:'status', label:'상태', width:'80px', render: v => v==='online' ? mkBd('bdg-ok','활성') : mkBd('bdg-err','비활성') },
      ], pausedDevices)
    );
    body.appendChild(devSection);
  }

  const extraBtns = [];
  if (pause.status === 'ACTIVE') {
    const releaseBtn = h('button', { class: 'btn btn-outline', style: 'color:#ef4444;border-color:#ef4444' }, '중단 해제');
    releaseBtn.addEventListener('click', () => {
      pause.status = 'CANCELLED';
      pause.cancelReason = '관리자 해제';
      if (onUpdate) onUpdate();
      closePanel();
      toast('탐지 중단이 해제되었습니다.', 'ok');
    });
    extraBtns.push(releaseBtn);
  }

  return mkPanel('탐지 중단 상세', body, null, null, extraBtns);
}
