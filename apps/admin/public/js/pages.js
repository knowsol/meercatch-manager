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
      h('h2', {}, title),
      h('button', { class: 'cx', onClick: () => closePanel() }, '✕')
    ),
    h('div', { class: 'mod-b', style: 'flex:1;overflow-y:auto' }, bodyEl),
    h('div', { class: 'mod-f' },
      h('button', { class: 'btn', onClick: () => closePanel() }, '닫기'),
      rightBtns.length ? h('div', { class: 'mod-f-right' }, ...rightBtns) : h('div', {})
    )
  );
}

/* ----------------------------------------------------------
   DASHBOARD
---------------------------------------------------------- */
function renderDashboard() {
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
    { key:'groupName', label:'그룹', width:'110px' },
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
    { key:'grade', label:'학년/반', render: (v,r) => `${r.grade}학년 ${r.cls}반` },
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
        h('div', { class: 'empty-icon' }, '✅'),
        h('div', { class: 'empty-title' }, '현재 탐지 중단이 없습니다')
      )
  );

  // License status
  const lic = DUMMY.licenses;
  const usePct = Math.round((lic.usedDevices / lic.devices) * 100);
  const licCard = h('div', { class: 'card' },
    h('div', { class: 'card-title' }, '라이선스 현황'),
    h('dl', { class: 'info-row' },
      h('dt', {}, '학교명'), h('dd', {}, lic.school),
      h('dt', {}, '라이선스 유형'), h('dd', {}, lic.type),
      h('dt', {}, '유효 기간'), h('dd', {}, `${fmtD(lic.validFrom)} ~ ${fmtD(lic.validTo)}`),
      h('dt', {}, '단말 사용'), h('dd', {}, `${lic.usedDevices} / ${lic.devices}대 (${usePct}%)`)
    ),
    h('div', { class: 'mt-16' },
      h('div', { class: 'progress-bar' },
        h('div', { class: 'progress-fill' + (usePct > 90 ? ' err' : usePct > 70 ? ' warn' : ' ok'), style: { width: usePct + '%' } })
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
      h('button', { class: 'btn btn-p', onClick: () => navigate('groups-new') }, '➕ 그룹 생성')
    )
  );
  page.appendChild(ph);

  // Summary KPIs
  const active = DUMMY.groups.filter(g => g.status === 'active').length;
  const paused = DUMMY.groups.filter(g => g.pauseStatus === 'paused').length;
  const totalDevices = DUMMY.groups.reduce((a,g) => a + g.deviceCount, 0);
  page.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('전체 그룹', DUMMY.groups.length, '', ''),
    mkKPI('활성 그룹', active, '', 'ok'),
    mkKPI('탐지 중단', paused, '현재 중단 중인 그룹', 'warn'),
    mkKPI('총 단말', totalDevices, '등록된 총 단말 수', 'ac')
  ));

  // Filter bar
  let gradeFilter = '', statusFilter = '';
  const searchInp = h('input', { class: 'inp search', placeholder: '그룹 이름 검색...', type: 'text' });
  const gradeSelect = h('select', { class: 'inp', style: { maxWidth: '120px' } },
    h('option', { value: '' }, '전체 학년'),
    h('option', { value: '1' }, '1학년'),
    h('option', { value: '2' }, '2학년'),
    h('option', { value: '3' }, '3학년')
  );
  const statusSelect = h('select', { class: 'inp', style: { maxWidth: '120px' } },
    h('option', { value: '' }, '전체 상태'),
    h('option', { value: 'active' }, '활성'),
    h('option', { value: 'inactive' }, '비활성')
  );

  const tableWrap = h('div', {});
  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const g = gradeSelect.value;
    const s = statusSelect.value;
    const filtered = DUMMY.groups.filter(gr => {
      if (q && !gr.name.toLowerCase().includes(q)) return false;
      if (g && String(gr.grade) !== g) return false;
      if (s && gr.status !== s) return false;
      return true;
    });
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'name', label:'그룹 이름', render: (v,r) => {
        const a = h('a', { href: '#' }, v);
        a.addEventListener('click', (e) => { e.preventDefault(); navigate('groups-detail', r.groupId); });
        return a;
      }},
      { key:'grade', label:'학년', width:'60px', render: (v,r) => `${r.grade}학년 ${r.cls}반` },
      { key:'deviceCount', label:'단말 수', width:'80px', render: v => `${v}대` },
      { key:'policyCount', label:'적용 정책', width:'80px', render: v => `${v}개` },
      { key:'pauseStatus', label:'탐지 중단', width:'100px', render: v => v === 'paused' ? mkBd('bdg-warn','중단중') : mkBd('bdg-ok','정상') },
      { key:'status', label:'상태', width:'80px', render: v => statusBadge(v) },
      { key:'updatedAt', label:'최근 수정', render: v => fmtD(v) },
      { key:'_actions', label:'', width:'80px', render: (_,r) => {
        const btn = h('button', { class: 'btn btn-outline btn-xs' }, '상세');
        btn.addEventListener('click', (e) => { e.stopPropagation(); navigate('groups-detail', r.groupId); });
        return btn;
      }},
    ], filtered, (row) => navigate('groups-detail', row.groupId)));
  }
  searchInp.addEventListener('input', renderTable);
  gradeSelect.addEventListener('change', renderTable);
  statusSelect.addEventListener('change', renderTable);

  const fb = h('div', { class: 'fb' }, searchInp, gradeSelect, statusSelect);
  page.appendChild(fb);
  page.appendChild(tableWrap);
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
      h('div', { class: 'ph-sub' }, '새로운 학급 그룹을 등록합니다')
    )
  ));

  const gradeInp = h('select', { class: 'inp' },
    h('option', { value: '' }, '학년 선택'),
    h('option', { value: '1' }, '1학년'),
    h('option', { value: '2' }, '2학년'),
    h('option', { value: '3' }, '3학년')
  );
  const clsInp = h('select', { class: 'inp' },
    h('option', { value: '' }, '반 선택'),
    ...[1,2,3,4,5,6].map(i => h('option', { value: String(i) }, i + '반'))
  );
  const nameInp = h('input', { class: 'inp', placeholder: '예: 1학년 1반', type: 'text' });
  const descInp = h('textarea', { class: 'inp', placeholder: '그룹 설명 (선택)', style: { minHeight: '80px' } });
  const policySelect = h('select', { class: 'inp' },
    h('option', { value: '' }, '정책 선택 (선택)'),
    ...DUMMY.policies.filter(p => p.active).map(p => h('option', { value: p.policyId }, p.name))
  );

  gradeInp.addEventListener('change', () => {
    if (gradeInp.value && clsInp.value) {
      nameInp.value = `${gradeInp.value}학년 ${clsInp.value}반`;
    }
  });
  clsInp.addEventListener('change', () => {
    if (gradeInp.value && clsInp.value) {
      nameInp.value = `${gradeInp.value}학년 ${clsInp.value}반`;
    }
  });

  function submit() {
    let valid = true;
    [gradeInp, clsInp, nameInp].forEach(inp => inp.classList.remove('error'));
    if (!gradeInp.value) { gradeInp.classList.add('error'); valid = false; }
    if (!clsInp.value) { clsInp.classList.add('error'); valid = false; }
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); valid = false; }
    if (!valid) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('그룹이 생성되었습니다.');
    navigate('groups-list');
  }

  const card = h('div', { class: 'card', style: { maxWidth: '600px' } },
    h('div', { class: 'form-row section-gap' }, fg('학년', gradeInp, true), fg('반', clsInp, true)),
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
      h('div', { class: 'ph-sub' }, `${group.grade}학년 ${group.cls}반 · 단말 ${group.deviceCount}대`)
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
        h('div', { class: 'form-row section-gap' },
          fg('학년', h('input', { class: 'inp', value: group.grade + '학년', disabled: true, type: 'text' })),
          fg('반',   h('input', { class: 'inp', value: group.cls + '반',    disabled: true, type: 'text' }))
        ),
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
        { key:'name', label:'단말 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();navigate('devices-detail',r.deviceId)});return a;}},
        { key:'identifier', label:'식별자' },
        { key:'status', label:'상태', width:'90px', render: v => statusBadge(v) },
        { key:'policyStatus', label:'정책 상태', width:'90px', render: v => statusBadge(v) },
        { key:'lastContact', label:'최근 접속', render: v => fmtDT(v) },
      ], groupDevices, (row) => navigate('devices-detail', row.deviceId)));
    } else if (activeTab === 'policies') {
      const applied = DUMMY.policies.filter(p => p.active).slice(0, group.policyCount);
      tabContent.appendChild(mkTable([
        { key:'name', label:'정책 이름' },
        { key:'desc', label:'설명' },
        { key:'types', label:'탐지 유형', render: v => h('div', { class: 'flex gap-8' }, ...v.map(t => detTypeBadge(t))) },
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
      { id:'devices', label:`단말목록 (${DUMMY.devices.filter(d=>d.groupId===id).length})` },
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
      h('button', { class: 'btn btn-p', onClick: () => toast('단말기 등록 기능은 MDM에서 처리됩니다.','info') }, '➕ 단말기 등록')
    )
  ));

  const online = DUMMY.devices.filter(d => d.status === 'online').length;
  const offline = DUMMY.devices.filter(d => d.status === 'offline').length;
  const pending = DUMMY.devices.filter(d => d.policyStatus === 'pending').length;
  page.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('전체 단말', DUMMY.devices.length, '', ''),
    mkKPI('온라인', online, '현재 접속 중', 'ok'),
    mkKPI('오프라인', offline, '접속 없음', 'err'),
    mkKPI('정책 미적용', pending, '정책 대기 중', 'warn')
  ));

  const searchInp = h('input', { class: 'inp search', placeholder: '단말 이름 또는 식별자 검색...', type: 'text' });
  const groupSelect = h('select', { class: 'inp', style: { maxWidth: '160px' } },
    h('option', { value: '' }, '전체 그룹'),
    ...DUMMY.groups.map(g => h('option', { value: g.groupId }, g.name))
  );
  const statusSelect = h('select', { class: 'inp', style: { maxWidth: '120px' } },
    h('option', { value: '' }, '전체 상태'),
    h('option', { value: 'online' }, '온라인'),
    h('option', { value: 'offline' }, '오프라인')
  );

  const tableWrap = h('div', {});
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
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'name', label:'단말 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();navigate('devices-detail',r.deviceId)});return a;}},
      { key:'identifier', label:'식별자', render: v => h('span', { class: 'text-t3', style:{fontFamily:'monospace',fontSize:'12px'} }, v) },
      { key:'groupName', label:'그룹', width:'120px' },
      { key:'model', label:'모델', width:'120px' },
      { key:'status', label:'상태', width:'90px', render: v => statusBadge(v) },
      { key:'policyStatus', label:'정책', width:'90px', render: v => statusBadge(v) },
      { key:'lastContact', label:'최근 접속', render: v => fmtDT(v) },
    ], filtered, (row) => navigate('devices-detail', row.deviceId)));
  }
  searchInp.addEventListener('input', renderTable);
  groupSelect.addEventListener('change', renderTable);
  statusSelect.addEventListener('change', renderTable);

  page.appendChild(h('div', { class: 'fb' }, searchInp, groupSelect, statusSelect));
  page.appendChild(tableWrap);
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
            h('dt',{},'학년/반'),   h('dd',{},`${group.grade}학년 ${group.cls}반`),
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
          h('div',{class:'empty-icon'},'✅'),
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
      h('button', { class: 'btn btn-p', onClick: () => navigate('policies-new') }, '➕ 정책 생성')
    )
  ));

  const active = DUMMY.policies.filter(p => p.active).length;
  page.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('전체 정책', DUMMY.policies.length, '', ''),
    mkKPI('활성 정책', active, '', 'ok'),
    mkKPI('비활성', DUMMY.policies.length - active, '', 'err'),
    mkKPI('적용 그룹', DUMMY.policies.reduce((a,p)=>a+p.appliedCount,0), '총 그룹 적용 수', 'ac')
  ));

  const searchInp = h('input', { class: 'inp search', placeholder: '정책 이름 검색...', type: 'text' });
  const activeSelect = h('select', { class: 'inp', style: { maxWidth: '120px' } },
    h('option', { value: '' }, '전체'),
    h('option', { value: 'true' }, '활성'),
    h('option', { value: 'false' }, '비활성')
  );

  const tableWrap = h('div', {});
  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const a = activeSelect.value;
    const filtered = DUMMY.policies.filter(p => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (a !== '' && String(p.active) !== a) return false;
      return true;
    });
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'name', label:'정책 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();navigate('policies-detail',r.policyId)});return a;}},
      { key:'desc', label:'설명' },
      { key:'types', label:'탐지 유형', render: v => h('div', { class: 'flex gap-8' }, ...v.map(t => detTypeBadge(t))) },
      { key:'appliedCount', label:'적용 그룹', width:'90px', render: v => `${v}개` },
      { key:'active', label:'상태', width:'80px', render: v => v ? mkBd('bdg-ok','활성') : mkBd('bdg-err','비활성') },
      { key:'updatedAt', label:'수정일', render: v => fmtD(v) },
      { key:'_act', label:'', width:'80px', render:(_,r)=>{const btn=h('button',{class:'btn btn-outline btn-xs'},'편집');btn.addEventListener('click',e=>{e.stopPropagation();navigate('policies-detail',r.policyId);});return btn;}},
    ], filtered, (row) => navigate('policies-detail', row.policyId)));
  }
  searchInp.addEventListener('input', renderTable);
  activeSelect.addEventListener('change', renderTable);

  page.appendChild(h('div', { class: 'fb' }, searchInp, activeSelect));
  page.appendChild(tableWrap);
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
    if (policy.types.includes(t)) chk.checked = true;
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
    { key:'name', label:'그룹 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();navigate('groups-detail',r.groupId)});return a;}},
    { key:'grade', label:'학년/반', render:(v,r)=>`${r.grade}학년 ${r.cls}반`},
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
  page.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('전체 탐지', DUMMY.detections.length, '', ''),
    mkKPI('선정성', typeCounts['선정성']||0, '', 'err'),
    mkKPI('도박', typeCounts['도박']||0, '', 'warn'),
    mkKPI('기타 유해', (typeCounts['폭력']||0)+(typeCounts['혐오']||0)+(typeCounts['마약']||0), '폭력+혐오+마약', 'ac')
  ));

  let activeTab = 'all';
  const tableWrap = h('div', {});
  const searchInp = h('input', { class: 'inp search', placeholder: '그룹 또는 단말 검색...', type: 'text' });
  const statusSelect = h('select', { class: 'inp', style:{ maxWidth:'130px' } },
    h('option', { value: '' }, '전체 상태'),
    h('option', { value: 'confirmed' }, '확인됨'),
    h('option', { value: 'reviewing' }, '검토중'),
    h('option', { value: 'dismissed' }, '무시됨')
  );
  const dateInp = h('input', { class: 'inp', type: 'date', style: { maxWidth: '160px' } });

  function thumbEl(seed) {
    const img = h('img', {
      src: `https://picsum.photos/seed/${seed}/56/56`,
      style: 'width:44px;height:44px;object-fit:cover;border-radius:6px;border:1px solid var(--bd);flex-shrink:0;display:block',
      loading: 'lazy'
    });
    return img;
  }

  function renderTable() {
    const q = searchInp.value.toLowerCase();
    const s = statusSelect.value;
    const d = dateInp.value;
    let data = DUMMY.detections;
    if (activeTab !== 'all') data = data.filter(e => e.type === activeTab);
    data = data.filter(e => {
      if (q && !e.groupName.toLowerCase().includes(q) && !e.deviceName.toLowerCase().includes(q)) return false;
      if (s && e.status !== s) return false;
      if (d && !e.detectedAt.startsWith(d)) return false;
      return true;
    });
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'thumb', label:'', width:'60px', render:(_,r) => thumbEl(r.thumb) },
      { key:'detectedAt', label:'탐지 시각', width:'150px', render: v => fmtDT(v) },
      { key:'type', label:'유형', width:'80px', render: v => detTypeBadge(v) },
      { key:'groupName', label:'그룹', width:'110px' },
      { key:'deviceName', label:'단말', width:'100px' },
      { key:'policy', label:'탐지 정책' },
      { key:'status', label:'상태', width:'90px', render: v => statusBadge(v) },
    ], data, row => navigate('detections-detail', row.detId)));
  }
  searchInp.addEventListener('input', renderTable);
  statusSelect.addEventListener('change', renderTable);
  dateInp.addEventListener('change', renderTable);

  const tabs = h('div', { class: 'tabs' },
    ...[
      { id:'all', label:`전체 (${DUMMY.detections.length})` },
      { id:'선정성', label:`선정성 (${typeCounts['선정성']||0})` },
      { id:'도박', label:`도박 (${typeCounts['도박']||0})` },
      { id:'폭력', label:`폭력 (${typeCounts['폭력']||0})` },
    ].map(t => {
      const tab = h('div', { class: 'tab' + (t.id === activeTab ? ' a' : '') }, t.label);
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTable();
      });
      return tab;
    })
  );
  page.appendChild(tabs);
  page.appendChild(h('div', { class: 'fb' }, searchInp, statusSelect, dateInp));
  page.appendChild(tableWrap);
  renderTable();
  return page;
}

/* -- Detection Detail Panel -- */
function renderDetectionDetailPanel(id) {
  const det = DUMMY.detections.find(d => d.detId === id) || DUMMY.detections[0];

  let currentStatus = det.status;
  const statusEl = h('dd', {}, statusBadge(currentStatus));
  const noteInp = h('textarea', { class:'inp', placeholder:'처리 메모 입력...', style:'min-height:72px' });

  const img = h('img', {
    src: `https://picsum.photos/seed/${det.thumb}/480/270`,
    style: 'width:100%;height:200px;object-fit:cover;border-radius:var(--radius-sm);border:1px solid var(--bd);display:block;margin-bottom:16px',
    loading: 'lazy'
  });

  const body = h('div', {},
    img,
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
      h('h2', {}, '탐지 상세'),
      h('button', { class:'cx', onClick: () => closePanel() }, '✕')
    ),
    h('div', { class:'mod-b', style:'flex:1;overflow-y:auto' }, body),
    h('div', { class:'mod-f' },
      h('button', { class:'btn', onClick: () => closePanel() }, '닫기'),
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
      h('button', { class: 'btn btn-p', onClick: () => navigate('users-new') }, '➕ 사용자 등록')
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

  const tableWrap = h('div', {});
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
      { key:'assignments', label:'담당 학급', render: v => v.length > 0 ? v.map(a=>`${a.grade}학년 ${a.cls}반`).join(', ') : '—' },
      { key:'lastLogin', label:'최근 로그인', render: v => fmtDT(v) },
      { key:'_act', label:'', width:'60px', render:(_,r2)=>{const btn=h('button',{class:'btn btn-outline btn-xs'},'편집');btn.addEventListener('click',e=>{e.stopPropagation();navigate('users-detail',r2.userId);});return btn;}},
    ], filtered, (row) => navigate('users-detail', row.userId)));
  }
  searchInp.addEventListener('input', renderTable);
  roleSelect.addEventListener('change', renderTable);
  statusSelect.addEventListener('change', renderTable);

  page.appendChild(h('div', { class: 'fb' }, searchInp, roleSelect, statusSelect));
  page.appendChild(tableWrap);
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
          h('div',{class:'empty-icon'},'📋'),
          h('div',{class:'empty-title'},'담당 학급이 없습니다')
        ));
      } else {
        const groups = assignments.map(a => DUMMY.groups.find(g => g.grade===a.grade && g.cls===a.cls)).filter(Boolean);
        tabContent.appendChild(mkTable([
          { key:'name', label:'그룹 이름', render:(v,r)=>{const a=h('a',{href:'#'},v);a.addEventListener('click',e=>{e.preventDefault();navigate('groups-detail',r.groupId)});return a;}},
          { key:'grade', label:'학년/반', render:(v,r)=>`${r.grade}학년 ${r.cls}반`},
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
      h('button', { class: 'btn btn-p', onClick: () => navigate('pauses-new') }, '➕ 중단 설정')
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

  const tableWrap = h('div', {});
  function renderTable() {
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'grade', label:'학년/반', render:(v,r)=>`${r.grade}학년 ${r.cls}반` },
      { key:'pauseType', label:'중단 유형', width:'90px' },
      { key:'requester', label:'요청자', width:'90px' },
      { key:'requesterRole', label:'요청자 역할', width:'100px', render: v => {
        const map = { admin:'관리자', staff:'운영자', teacher:'교사' };
        return h('span', { class: 'text-t2' }, map[v] || v);
      }},
      { key:'startAt', label:'시작 시각', render: v => fmtDT(v) },
      { key:'endAt',   label:'종료 시각', render: v => fmtDT(v) },
      { key:'reason',  label:'사유' },
      { key:'status',  label:'상태', width:'90px', render: v => {
        if (v==='ACTIVE') return mkBd('bdg-warn','진행중');
        if (v==='EXPIRED') return mkBd('bdg-muted','만료');
        return mkBd('bdg-muted','취소');
      }},
      { key:'_act', label:'', width:'80px', render:(_,r)=>{
        if (r.status !== 'ACTIVE') return h('span',{class:'text-t3'},'—');
        const btn = h('button', { class: 'btn btn-xs btn-warn' }, '중단 해제');
        btn.addEventListener('click', e => {
          e.stopPropagation();
          confirm(`${r.grade}학년 ${r.cls}반 탐지 중단을 해제하시겠습니까?`, () => {
            r.status = 'CANCELLED';
            r.cancelReason = '관리자 수동 취소';
            toast('탐지 중단이 해제되었습니다.', 'warn');
            renderTable();
          });
        });
        return btn;
      }},
    ], DUMMY.pauses));
  }
  renderTable();
  page.appendChild(tableWrap);
  return page;
}

/* ----------------------------------------------------------
   PAUSE NEW
---------------------------------------------------------- */
function renderPauseNew() {
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '탐지 중단 설정'),
      h('div', { class: 'ph-sub' }, '특정 학급의 탐지를 일시적으로 중단합니다')
    )
  ));

  page.appendChild(h('div', { class: 'alert alert-warn section-gap' },
    '⚠️ 탐지 중단 중에는 해당 그룹의 유해 콘텐츠가 탐지되지 않습니다. 반드시 사유를 명확히 기록해주세요.'
  ));

  const gradeSelect = h('select', { class: 'inp' },
    h('option',{value:''},'학년 선택'),
    h('option',{value:'1'},'1학년'),h('option',{value:'2'},'2학년'),h('option',{value:'3'},'3학년')
  );
  const clsSelect = h('select', { class: 'inp' },
    h('option',{value:''},'반 선택'),
    ...[1,2,3,4,5].map(i=>h('option',{value:String(i)},i+'반'))
  );
  const typeSelect = h('select', { class: 'inp' },
    h('option',{value:'전체'},'전체 탐지 중단'),
    h('option',{value:'선정성'},'선정성 탐지만'),
    h('option',{value:'도박'},'도박 탐지만'),
    h('option',{value:'폭력'},'폭력 탐지만')
  );
  const startInp = h('input', { class: 'inp', type: 'datetime-local' });
  const endInp   = h('input', { class: 'inp', type: 'datetime-local' });
  const reasonInp= h('textarea', { class: 'inp', placeholder: '탐지 중단 사유를 입력하세요 (예: 성교육 수업, 체험학습 등)', style:{minHeight:'80px'} });

  // Set default values
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  startInp.value = nowStr;
  const end = new Date(now.getTime() + 4*60*60*1000);
  endInp.value = `${end.getFullYear()}-${pad(end.getMonth()+1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;

  function submit() {
    [gradeSelect, clsSelect, startInp, endInp, reasonInp].forEach(el => el.classList.remove('error'));
    let valid = true;
    if (!gradeSelect.value) { gradeSelect.classList.add('error'); valid = false; }
    if (!clsSelect.value) { clsSelect.classList.add('error'); valid = false; }
    if (!startInp.value) { startInp.classList.add('error'); valid = false; }
    if (!endInp.value) { endInp.classList.add('error'); valid = false; }
    if (!reasonInp.value.trim()) { reasonInp.classList.add('error'); valid = false; }
    if (!valid) { toast('필수 항목을 입력해주세요.','err'); return; }
    if (new Date(endInp.value) <= new Date(startInp.value)) {
      endInp.classList.add('error'); toast('종료 시각은 시작 시각보다 이후여야 합니다.','err'); return;
    }
    toast('탐지 중단이 설정되었습니다.');
    navigate('pauses-list');
  }

  const card = h('div', { class: 'card', style:{ maxWidth:'600px' } },
    h('div', { class: 'form-row section-gap' }, fg('학년', gradeSelect, true), fg('반', clsSelect, true)),
    h('div', { class: 'section-gap' }, fg('중단 유형', typeSelect, true)),
    h('div', { class: 'form-row section-gap' }, fg('시작 시각', startInp, true), fg('종료 시각', endInp, true)),
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
  const gradeSelect = h('select', { class: 'inp', style:{ maxWidth:'120px' } },
    h('option',{value:''},'전체 학년'),
    h('option',{value:'1'},'1학년'),h('option',{value:'2'},'2학년'),h('option',{value:'3'},'3학년')
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
    const g = gradeSelect.value;
    const s = statusSelect.value;
    const filtered = DUMMY.pauses.filter(p => {
      if (q && !p.requester.toLowerCase().includes(q)) return false;
      if (g && String(p.grade) !== g) return false;
      if (s && p.status !== s) return false;
      return true;
    });
    tableWrap.innerHTML = '';
    tableWrap.appendChild(mkTable([
      { key:'grade', label:'학년/반', width:'100px', render:(v,r)=>`${r.grade}학년 ${r.cls}반` },
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
  gradeSelect.addEventListener('change', renderTable);
  statusSelect.addEventListener('change', renderTable);

  page.appendChild(h('div', { class: 'fb' }, searchInp, gradeSelect, statusSelect));
  page.appendChild(tableWrap);
  renderTable();
  return page;
}

/* ----------------------------------------------------------
   LICENSES
---------------------------------------------------------- */
function renderLicenses() {
  const lic = DUMMY.licenses;
  const page = h('div', {});
  page.appendChild(h('div', { class: 'ph' },
    h('div', { class: 'ph-left' },
      h('div', { class: 'ph-title' }, '라이선스'),
      h('div', { class: 'ph-sub' }, '라이선스 정보를 확인합니다')
    )
  ));

  const usePct = Math.round((lic.usedDevices / lic.devices) * 100);
  const remaining = lic.devices - lic.usedDevices;
  const wrap = h('div', { style: { maxWidth: '860px' } });

  wrap.appendChild(h('div', { class: 'grid-4 section-gap' },
    mkKPI('총 단말 수', lic.devices, '라이선스 한도', ''),
    mkKPI('사용 단말', lic.usedDevices, `${usePct}% 사용 중`, usePct > 90 ? 'err' : usePct > 70 ? 'warn' : 'ok'),
    mkKPI('잔여 슬롯', remaining, '추가 등록 가능', 'ac'),
    mkKPI('유효 기간', fmtD(lic.validTo), `${fmtD(lic.validFrom)} 부터`, '')
  ));

  const statusBadgeEl = lic.status === 'active' ? mkBd('bdg-ok','활성') : mkBd('bdg-err','만료');

  wrap.appendChild(h('div', { class: 'grid-2 mt-20' },
    h('div', { class: 'card' },
      h('div', { class: 'card-title' }, '라이선스 상세'),
      h('dl', { class: 'info-row' },
        h('dt',{},'학교명'),       h('dd',{},lic.school),
        h('dt',{},'라이선스 유형'), h('dd',{},lic.type),
        h('dt',{},'시리얼 키'),    h('dd',{ style:{fontFamily:'monospace',fontSize:'12px',color:'var(--t2)'} }, lic.serialKey),
        h('dt',{},'상태'),         h('dd',{},statusBadgeEl),
        h('dt',{},'유효 시작'),    h('dd',{},fmtD(lic.validFrom)),
        h('dt',{},'유효 종료'),    h('dd',{},fmtD(lic.validTo)),
        h('dt',{},'최근 동기화'),  h('dd',{},fmtDT(lic.lastSync))
      )
    ),
    h('div', { class: 'card' },
      h('div', { class: 'card-title' }, '단말 사용 현황'),
      h('div', { class: 'flex-between mb-16' },
        h('span', { class: 'text-t2' }, `${lic.usedDevices}대 / ${lic.devices}대`),
        h('span', { class: 'text-t2' }, `${usePct}%`)
      ),
      h('div', { class: 'progress-bar', style:{height:'10px'} },
        h('div', { class: 'progress-fill' + (usePct > 90 ? ' err' : usePct > 70 ? ' warn' : ' ok'),
          style: { width: usePct + '%' } })
      ),
      h('div', { class: 'mt-20' },
        h('div', { class: 'card-title' }, '지원 정보'),
        h('dl', { class: 'info-row' },
          h('dt',{},'담당자'),   h('dd',{},lic.manager),
          h('dt',{},'이메일'),   h('dd',{},h('a',{href:'mailto:'+lic.supportContact},lic.supportContact)),
          h('dt',{},'전화번호'), h('dd',{},lic.supportTel)
        )
      ),
      h('div', { class: 'mt-16' },
        h('button', { class: 'btn btn-p btn-sm', onClick: () => toast('라이선스 갱신 문의를 접수했습니다.','info') }, '갱신 문의'),
        h('button', { class: 'btn btn-outline btn-sm', style:{marginLeft:'8px'}, onClick: () => toast('동기화 중...','info') }, '🔄 동기화')
      )
    )
  ));
  page.appendChild(wrap);
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
      mkThemeOption('light', '☀️', '라이트 모드', '밝은 배경, 기본 설정'),
      mkThemeOption('dark',  '🌙', '다크 모드',   '어두운 배경, 눈 편한 화면')
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

/* ── Select Modal Helper ─────────────────────────────────── */
/**
 * showSelectModal(title, items, labelFn, onConfirm)
 * items: array of objects
 * labelFn: (item) => { name, sub? }
 * onConfirm: (selectedItems[]) => void
 */
function showSelectModal(title, items, labelFn, onConfirm) {
  const selected = new Set();

  const listEl = h('div', {});
  if (items.length === 0) {
    listEl.appendChild(h('div', { class: 'empty' },
      h('div', { class: 'empty-icon' }, '📋'),
      h('div', { class: 'empty-title' }, '추가 가능한 항목이 없습니다.')
    ));
  } else {
    items.forEach((item, idx) => {
      const chkId = 'mchk-' + idx;
      const chk = h('input', { type: 'checkbox', id: chkId });
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

  const closeBtn = h('button', { class: 'modal-close' }, '✕');
  const cancelBtn = h('button', { class: 'btn btn-outline' }, '취소');
  const confirmBtn = h('button', { class: 'btn btn-p' }, '적용');

  const modal = h('div', { class: 'modal' },
    h('div', { class: 'modal-hd' },
      h('div', { class: 'modal-title' }, title),
      closeBtn
    ),
    h('div', { class: 'modal-bd' }, listEl),
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
  const gradeInp = h('select', { class: 'inp' },
    h('option', { value:'' }, '학년 선택'),
    ...[1,2,3].map(i => h('option', { value:String(i) }, i+'학년'))
  );
  const clsInp = h('select', { class: 'inp' },
    h('option', { value:'' }, '반 선택'),
    ...[1,2,3,4,5,6].map(i => h('option', { value:String(i) }, i+'반'))
  );
  const nameInp = h('input', { class:'inp', placeholder:'예: 1학년 1반', type:'text' });
  const descInp = h('textarea', { class:'inp', placeholder:'그룹 설명 (선택)', style:'min-height:80px' });
  const policySelect = h('select', { class:'inp' },
    h('option', { value:'' }, '정책 선택 (선택)'),
    ...DUMMY.policies.filter(p=>p.active).map(p => h('option', { value:p.policyId }, p.name))
  );
  const autoName = () => {
    if (gradeInp.value && clsInp.value) nameInp.value = `${gradeInp.value}학년 ${clsInp.value}반`;
  };
  gradeInp.addEventListener('change', autoName);
  clsInp.addEventListener('change', autoName);

  const body = h('div', {},
    h('div', { class:'form-row section-gap' }, fg('학년', gradeInp, true), fg('반', clsInp, true)),
    fg('그룹 이름', nameInp, true),
    fg('그룹 설명', descInp, false),
    fg('기본 적용 정책', policySelect, false)
  );

  function onSave() {
    [gradeInp, clsInp, nameInp].forEach(el => el.classList.remove('error'));
    let ok = true;
    if (!gradeInp.value) { gradeInp.classList.add('error'); ok = false; }
    if (!clsInp.value) { clsInp.classList.add('error'); ok = false; }
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
  const tabContent = h('div', {});

  // Local state: applied policies for this group
  const appliedPolicies = DUMMY.policies.filter(p => p.active).slice(0, group.policyCount);

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      const nameInp = h('input', { class:'inp', value:group.name, type:'text' });
      const descInp = h('textarea', { class:'inp', style:'min-height:80px' }, '학급 그룹입니다.');
      tabContent.appendChild(h('div', {},
        fg('그룹 이름', nameInp, true),
        fg('설명', descInp, false),
        h('div', { class:'form-row section-gap' },
          fg('학년', h('input', { class:'inp', value:group.grade+'학년', disabled:true, type:'text' })),
          fg('반',   h('input', { class:'inp', value:group.cls+'반',    disabled:true, type:'text' }))
        ),
        h('dl', { class:'info-row mt-16' },
          h('dt',{},'상태'), h('dd',{},statusBadge(group.status)),
          h('dt',{},'단말 수'), h('dd',{},group.deviceCount+'대'),
          h('dt',{},'최근 수정'), h('dd',{},fmtD(group.updatedAt))
        )
      ));
    } else if (activeTab === 'devices') {
      const devs = DUMMY.devices.filter(d => d.groupId === id);
      tabContent.appendChild(mkTable([
        { key:'name', label:'단말 이름' },
        { key:'identifier', label:'식별자' },
        { key:'status', label:'상태', width:'90px', render: v => statusBadge(v) },
        { key:'lastContact', label:'최근 접속', render: v => fmtDT(v) },
      ], devs, row => { closePanel(); navigate('devices-detail', row.deviceId); }));
    } else if (activeTab === 'policies') {
      const tbl = mkTable([
        { key:'name', label:'정책 이름' },
        { key:'types', label:'탐지 유형', render: v => h('div',{class:'flex gap-8'},...v.map(t=>detTypeBadge(t))) },
        { key:'active', label:'상태', width:'80px', render: v => statusBadge(v ? 'active':'inactive') },
        { key:'_act', label:'', width:'60px', render:(_,r) => {
          const btn = h('button', { class:'btn btn-outline btn-xs' }, '해제');
          btn.addEventListener('click', e => {
            e.stopPropagation();
            const idx = appliedPolicies.findIndex(p => p.policyId === r.policyId);
            if (idx !== -1) appliedPolicies.splice(idx, 1);
            toast('정책이 해제되었습니다.', 'warn');
            renderTab();
          });
          return btn;
        }},
      ], appliedPolicies);

      tabContent.appendChild(tbl);
    } else if (activeTab === 'pauses') {
      const pauses = DUMMY.pauses.filter(p => p.grade === group.grade && p.cls === group.cls);
      tabContent.appendChild(pauses.length
        ? mkTable([
            { key:'pauseType', label:'유형' },
            { key:'requester', label:'요청자' },
            { key:'startAt', label:'시작', render: v => fmtDT(v) },
            { key:'endAt', label:'종료', render: v => fmtDT(v) },
            { key:'status', label:'상태', render: v => statusBadge(v==='ACTIVE'?'active':'inactive') },
          ], pauses)
        : h('div',{class:'empty'},h('div',{class:'empty-title'},'탐지 중단 이력 없음'))
      );
    }
  }

  const footerEl = h('div', { class: 'mod-f' });

  function renderFooter() {
    footerEl.innerHTML = '';
    const closeBtn = h('button', { class:'btn', onClick: () => closePanel() }, '닫기');

    if (activeTab === 'info') {
      const delBtn = h('button', { class:'btn btn-d' }, '삭제');
      delBtn.addEventListener('click', () => {
        if (window.confirm('이 그룹을 삭제하시겠습니까?')) {
          toast('삭제되었습니다.', 'warn'); closePanel();
        }
      });
      const saveBtn = h('button', { class:'btn btn-p', onClick: () => toast('저장되었습니다.') }, '저장');
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }, delBtn, saveBtn));

    } else if (activeTab === 'devices') {
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }));

    } else if (activeTab === 'policies') {
      const addPolicyBtn = h('button', { class:'btn btn-p' }, '정책 추가');
      addPolicyBtn.addEventListener('click', () => {
        const appliedIds = new Set(appliedPolicies.map(p => p.policyId));
        const candidates = DUMMY.policies.filter(p => !appliedIds.has(p.policyId));
        showSelectModal('정책 추가', candidates,
          p => ({ name: p.name, sub: p.desc }),
          selected => {
            selected.forEach(p => appliedPolicies.push(p));
            toast(`정책 ${selected.length}개가 적용되었습니다.`);
            renderTab();
          }
        );
      });
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }, addPolicyBtn));

    } else {
      // 탐지중단현황 — 닫기만
      footerEl.appendChild(closeBtn);
    }
  }

  const tabs = h('div', { class:'tabs' },
    ...[
      { id:'info', label:'기본정보' },
      { id:'devices', label:`단말목록 (${DUMMY.devices.filter(d=>d.groupId===id).length})` },
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
      h('h2', {}, group.name),
      h('button', { class:'cx', onClick: () => closePanel() }, '✕')
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
            h('div',{class:'mt-16'},h('div',{class:'sub-label'},'탐지 유형'),
              h('div',{class:'flex gap-8 mt-8'},...policy.types.map(t=>detTypeBadge(t)))
            )
          )
        : h('div',{class:'empty'},h('div',{class:'empty-title'},'적용된 정책 없음'))
      );
    } else if (activeTab === 'history') {
      const devDets = DUMMY.detections.filter(d => d.deviceName === device.name).slice(0, 10);
      tabContent.appendChild(mkTable([
        { key:'detectedAt', label:'탐지 시각', render: v => fmtDT(v) },
        { key:'type', label:'유형', render: v => detTypeBadge(v) },
        { key:'status', label:'상태', render: v => statusBadge(v) },
      ], devDets));
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
  const descInp = h('textarea', { class:'inp', placeholder:'설명' });
  const typeOpts = ['선정성','도박','폭력','기타'];
  const selectedTypes = new Set();
  const typeRow = h('div', { class:'flex gap-8' },
    ...typeOpts.map(t => {
      const chip = h('div', { class:'chip' }, t);
      chip.addEventListener('click', () => {
        if (selectedTypes.has(t)) { selectedTypes.delete(t); chip.classList.remove('sel-wl'); }
        else { selectedTypes.add(t); chip.classList.add('sel-wl'); }
      });
      return chip;
    })
  );
  const activeToggle = h('input', { type:'checkbox', checked:true });
  const body = h('div', {},
    fg('정책 이름', nameInp, true),
    fg('설명', descInp, false),
    h('div', { class:'fg' }, h('label',{},'탐지 유형'), typeRow),
    h('div', { class:'fg' }, h('label',{},'활성화'), h('label',{class:'tog'},
      h('div', { class:'tog-track on', onClick: function(){ this.classList.toggle('on'); activeToggle.checked = this.classList.contains('on'); }},
        h('div',{class:'tog-thumb'})
      ),
      h('span',{style:'font-size:13px;color:var(--t1)'},'활성')
    ))
  );

  function onSave() {
    nameInp.classList.remove('error');
    if (!nameInp.value.trim()) { nameInp.classList.add('error'); toast('정책 이름을 입력하세요.', 'err'); return; }
    if (selectedTypes.size === 0) { toast('탐지 유형을 선택하세요.', 'err'); return; }
    toast('정책이 생성되었습니다.');
    closePanel();
  }

  return mkPanel('정책 생성', body, onSave, '정책 생성');
}

/* -- Policy Detail Panel -- */
function renderPolicyDetailPanel(id) {
  const policy = DUMMY.policies.find(p => p.policyId === id) || DUMMY.policies[0];
  let activeTab = 'info';
  const tabContent = h('div', {});

  // Local state: applied groups for this policy
  const appliedGroups = DUMMY.groups.slice(0, policy.appliedCount);

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      const nameInp = h('input', { class:'inp', value:policy.name, type:'text' });
      const descInp = h('textarea', { class:'inp' }, policy.desc);
      tabContent.appendChild(h('div', {},
        fg('정책 이름', nameInp, true),
        fg('설명', descInp, false),
        h('dl', { class:'info-row mt-16' },
          h('dt',{},'탐지 유형'), h('dd',{},h('div',{class:'flex gap-8'},...policy.types.map(t=>detTypeBadge(t)))),
          h('dt',{},'상태'), h('dd',{},statusBadge(policy.active ? 'active':'inactive')),
          h('dt',{},'적용 그룹'), h('dd',{},policy.appliedCount+'개'),
          h('dt',{},'수정일'), h('dd',{},fmtD(policy.updatedAt))
        )
      ));
    } else if (activeTab === 'applied') {
      const tbl = mkTable([
        { key:'name', label:'그룹' },
        { key:'grade', label:'학년', width:'70px', render: v => v+'학년' },
        { key:'cls', label:'반', width:'50px', render: v => v+'반' },
        { key:'deviceCount', label:'단말 수', width:'80px', render: v => v+'대' },
        { key:'_act', label:'', width:'60px', render:(_,r) => {
          const btn = h('button', { class:'btn btn-outline btn-xs' }, '해제');
          btn.addEventListener('click', e => {
            e.stopPropagation();
            const idx = appliedGroups.findIndex(g => g.groupId === r.groupId);
            if (idx !== -1) appliedGroups.splice(idx, 1);
            toast('그룹 적용이 해제되었습니다.', 'warn');
            renderTabAndCount();
          });
          return btn;
        }},
      ], appliedGroups);
      tabContent.appendChild(tbl);
    }
  }

  const footerEl = h('div', { class:'mod-f' });

  function openAddGroupModal() {
    const appliedIds = new Set(appliedGroups.map(g => g.groupId));
    const candidates = DUMMY.groups.filter(g => !appliedIds.has(g.groupId));
    showSelectModal('그룹 추가', candidates,
      g => ({ name: g.name, sub: `${g.grade}학년 ${g.cls}반 · 단말 ${g.deviceCount}대` }),
      selected => {
        selected.forEach(g => appliedGroups.push(g));
        toast(`그룹 ${selected.length}개에 정책이 적용되었습니다.`);
        renderTabAndCount();
      }
    );
  }

  function renderFooter() {
    footerEl.innerHTML = '';
    const closeBtn = h('button', { class:'btn', onClick: () => closePanel() }, '닫기');
    if (activeTab === 'info') {
      const saveBtn = h('button', { class:'btn btn-p', onClick: () => toast('저장되었습니다.') }, '저장');
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }, saveBtn));
    } else {
      const addGroupBtn = h('button', { class:'btn btn-p' }, '그룹 추가');
      addGroupBtn.addEventListener('click', openAddGroupModal);
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }, addGroupBtn));
    }
  }

  let appliedTabEl = null;
  const tabs = h('div', { class:'tabs' },
    ...[{id:'info',label:'기본정보'},{id:'applied',label:`적용 그룹 (${appliedGroups.length})`}].map(t => {
      const tab = h('div', { class:'tab'+(t.id===activeTab?' a':'') }, t.label);
      if (t.id === 'applied') appliedTabEl = tab;
      tab.addEventListener('click', () => {
        activeTab = t.id;
        tabs.querySelectorAll('.tab').forEach(el => el.classList.remove('a'));
        tab.classList.add('a');
        renderTabAndCount();
        renderFooter();
      });
      return tab;
    })
  );

  function renderTabAndCount() {
    renderTab();
    if (appliedTabEl) appliedTabEl.textContent = `적용 그룹 (${appliedGroups.length})`;
  }

  const body = h('div', {}, tabs, tabContent);
  renderTabAndCount();
  renderFooter();

  return h('div', { style:'display:flex;flex-direction:column;height:100%' },
    h('div', { class:'mod-h' },
      h('h2', {}, policy.name),
      h('button', { class:'cx', onClick: () => closePanel() }, '✕')
    ),
    h('div', { class:'mod-b', style:'flex:1;overflow-y:auto' }, body),
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
  const tabContent = h('div', {});

  // Local state: assignments
  const assignments = (user.assignments || []).map(a => ({ ...a }));

  function renderTab() {
    tabContent.innerHTML = '';
    if (activeTab === 'info') {
      const nameInp    = h('input', { class:'inp', value:user.name, type:'text' });
      const contactInp = h('input', { class:'inp', value:user.contact, type:'text' });
      tabContent.appendChild(h('div', {},
        fg('이름', nameInp, true),
        fg('연락처', contactInp, false),
        h('dl', { class:'info-row mt-16' },
          h('dt',{},'아이디'),    h('dd',{},user.username),
          h('dt',{},'역할'),      h('dd',{},user.role === 'admin' ? '관리자' : user.role === 'staff' ? '직원' : '선생님'),
          h('dt',{},'상태'),      h('dd',{},statusBadge(user.status)),
          h('dt',{},'최근 접속'), h('dd',{},fmtDT(user.lastLogin))
        )
      ));
    } else if (activeTab === 'assignments') {
      tabContent.appendChild(assignments.length
        ? mkTable([
            { key:'grade', label:'학년', render: v => v+'학년' },
            { key:'cls',   label:'반',   render: v => v === 0 ? '전체' : v+'반' },
            { key:'_act',  label:'', width:'60px', render:(_,r) => {
              const btn = h('button', { class:'btn btn-outline btn-xs' }, '제거');
              btn.addEventListener('click', e => {
                e.stopPropagation();
                const idx = assignments.findIndex(a => a.grade === r.grade && a.cls === r.cls);
                if (idx !== -1) assignments.splice(idx, 1);
                toast('담당 범위가 제거되었습니다.', 'warn');
                renderTab();
              });
              return btn;
            }},
          ], assignments)
        : h('div', { class:'empty' }, h('div', { class:'empty-title' }, '담당 범위 없음'))
      );
    } else if (activeTab === 'pauseHistory') {
      const userPauses = DUMMY.pauses.filter(p => p.requester === user.name);
      tabContent.appendChild(userPauses.length
        ? mkTable([
            { key:'grade',     label:'학년/반', render:(v,r)=>`${r.grade}학년 ${r.cls}반` },
            { key:'pauseType', label:'유형' },
            { key:'startAt',   label:'시작', render: v => fmtDT(v) },
            { key:'status',    label:'상태', render: v => statusBadge(v==='ACTIVE'?'active':'inactive') },
          ], userPauses)
        : h('div', { class:'empty' }, h('div', { class:'empty-title' }, '탐지 중단 이력 없음'))
      );
    }
  }

  const footerEl = h('div', { class:'mod-f' });

  function renderFooter() {
    footerEl.innerHTML = '';
    const closeBtn = h('button', { class:'btn', onClick: () => closePanel() }, '닫기');

    if (activeTab === 'info') {
      const saveBtn = h('button', { class:'btn btn-p', onClick: () => toast('저장되었습니다.') }, '저장');
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }, saveBtn));

    } else if (activeTab === 'assignments') {
      const addBtn = h('button', { class:'btn btn-p' }, '학년 추가');
      addBtn.addEventListener('click', () => {
        const allSlots = [];
        [1,2,3].forEach(g => [0,1,2,3,4,5,6].forEach(c => allSlots.push({ grade:g, cls:c })));
        const existing = new Set(assignments.map(a => `${a.grade}-${a.cls}`));
        const candidates = allSlots.filter(s => !existing.has(`${s.grade}-${s.cls}`));
        showSelectModal('학년/반 추가', candidates,
          s => ({ name: `${s.grade}학년 ${s.cls === 0 ? '전체' : s.cls+'반'}` }),
          selected => {
            selected.forEach(s => assignments.push(s));
            toast(`담당 범위 ${selected.length}개가 추가되었습니다.`);
            renderTab();
          }
        );
      });
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }, addBtn));

    } else {
      // 탐지 중단 이력 — 닫기만
      footerEl.appendChild(closeBtn);
      footerEl.appendChild(h('div', { class:'mod-f-right' }));
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
      h('h2', {}, user.name),
      h('button', { class:'cx', onClick: () => closePanel() }, '✕')
    ),
    h('div', { class:'mod-b', style:'flex:1;overflow-y:auto' }, body),
    footerEl
  );
}

/* -- Pause New Panel -- */
function renderPauseNewPanel() {
  const gradeInp = h('select', { class:'inp' },
    h('option',{value:''},'학년 선택'),
    ...[1,2,3].map(i => h('option',{value:String(i)},i+'학년'))
  );
  const clsInp = h('select', { class:'inp' },
    h('option',{value:''},'반 선택'),
    ...[1,2,3,4,5,6].map(i => h('option',{value:String(i)},i+'반'))
  );
  const typeInp = h('select', { class:'inp' },
    h('option',{value:''},'중단 유형'),
    h('option',{value:'전체'},'전체'),
    h('option',{value:'선정성'},'선정성'),
    h('option',{value:'도박'},'도박'),
    h('option',{value:'폭력'},'폭력')
  );
  const startInp = h('input', { class:'inp', type:'datetime-local' });
  const endInp   = h('input', { class:'inp', type:'datetime-local' });
  const reasonInp = h('textarea', { class:'inp', placeholder:'중단 사유를 입력하세요', style:'min-height:80px' });

  const body = h('div', {},
    h('div', { class:'form-row' }, fg('학년', gradeInp, true), fg('반', clsInp, true)),
    h('div', { class:'section-gap' }, fg('중단 유형', typeInp, true)),
    h('div', { class:'form-row section-gap' }, fg('시작 일시', startInp, true), fg('종료 일시', endInp, true)),
    fg('중단 사유', reasonInp, true)
  );

  function onSave() {
    [gradeInp, clsInp, typeInp, startInp, reasonInp].forEach(el => el.classList.remove('error'));
    let ok = true;
    if (!gradeInp.value)  { gradeInp.classList.add('error');  ok = false; }
    if (!clsInp.value)    { clsInp.classList.add('error');    ok = false; }
    if (!typeInp.value)   { typeInp.classList.add('error');   ok = false; }
    if (!startInp.value)  { startInp.classList.add('error');  ok = false; }
    if (!reasonInp.value.trim()) { reasonInp.classList.add('error'); ok = false; }
    if (!ok) { toast('필수 항목을 입력해주세요.', 'err'); return; }
    toast('탐지 중단이 설정되었습니다.');
    closePanel();
  }

  return mkPanel('탐지 중단 설정', body, onSave, '중단 설정');
}
