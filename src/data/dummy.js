// ── Dummy Data ─────────────────────────────────────────────

export const currentUser = { userId: 'u001', name: '관리자', username: 'admin', role: 'admin', contact: '010-1234-5678', status: 'active', lastLogin: '2026-04-15T09:30:00' };

export const stats = { totalGroups: 18, totalDevices: 143, todayDetections: 12, activeDetections: 2, weeklyDetections: 47, confirmedDetections: 34, totalPolicies: 3 };

export const groups = [
  { groupId:'g001', name:'1학년 1반', grade:1, cls:1, deviceCount:8, policyCount:1, pauseStatus:'normal', status:'active', updatedAt:'2026-04-10' },
  { groupId:'g002', name:'1학년 2반', grade:1, cls:2, deviceCount:7, policyCount:1, pauseStatus:'paused', status:'active', updatedAt:'2026-04-09' },
  { groupId:'g003', name:'2학년 1반', grade:2, cls:1, deviceCount:9, policyCount:2, pauseStatus:'normal', status:'active', updatedAt:'2026-04-08' },
  { groupId:'g004', name:'2학년 2반', grade:2, cls:2, deviceCount:6, policyCount:1, pauseStatus:'normal', status:'active', updatedAt:'2026-04-07' },
  { groupId:'g005', name:'3학년 1반', grade:3, cls:1, deviceCount:8, policyCount:0, pauseStatus:'normal', status:'inactive', updatedAt:'2026-04-06' },
  { groupId:'g006', name:'3학년 2반', grade:3, cls:2, deviceCount:7, policyCount:1, pauseStatus:'normal', status:'active', updatedAt:'2026-04-05' },
];

export const devices = [
  { deviceId:'d001', name:'iPad-001', identifier:'A1B2C3D4', groupId:'g001', groupName:'1학년 1반', status:'online', policyStatus:'applied', lastContact:'2026-04-15T09:25:00', thumb:'device1' },
  { deviceId:'d002', name:'iPad-002', identifier:'B2C3D4E5', groupId:'g001', groupName:'1학년 1반', status:'offline', policyStatus:'applied', lastContact:'2026-04-14T17:00:00', thumb:'device2' },
  { deviceId:'d003', name:'iPad-003', identifier:'C3D4E5F6', groupId:'g002', groupName:'1학년 2반', status:'online', policyStatus:'pending', lastContact:'2026-04-15T08:45:00', thumb:'device3' },
  { deviceId:'d004', name:'iPad-004', identifier:'D4E5F6G7', groupId:'g002', groupName:'1학년 2반', status:'online', policyStatus:'applied', lastContact:'2026-04-15T09:10:00', thumb:'device4' },
  { deviceId:'d005', name:'iPad-005', identifier:'E5F6G7H8', groupId:'g003', groupName:'2학년 1반', status:'offline', policyStatus:'applied', lastContact:'2026-04-13T15:30:00', thumb:'device5' },
  { deviceId:'d006', name:'iPad-006', identifier:'F6G7H8I9', groupId:'g003', groupName:'2학년 1반', status:'online', policyStatus:'applied', lastContact:'2026-04-15T09:20:00', thumb:'device6' },
  { deviceId:'d007', name:'iPad-007', identifier:'G7H8I9J0', groupId:'g004', groupName:'2학년 2반', status:'online', policyStatus:'applied', lastContact:'2026-04-15T09:15:00', thumb:'device7' },
  { deviceId:'d008', name:'iPad-008', identifier:'H8I9J0K1', groupId:null, groupName:'미배정', status:'offline', policyStatus:'pending', lastContact:'2026-04-12T10:00:00', thumb:'device8' },
];

export const policies = [
  { policyId:'p001', name:'기본 탐지 정책', desc:'선정성 및 도박 콘텐츠 탐지', types:['선정성','도박'], active:true, appliedCount:4, updatedAt:'2026-04-01' },
  { policyId:'p002', name:'강화 탐지 정책', desc:'모든 유해 콘텐츠 탐지', types:['선정성','도박','폭력','기타'], active:true, appliedCount:2, updatedAt:'2026-03-25' },
  { policyId:'p003', name:'시험 기간 정책', desc:'시험 기간 중 강화 탐지', types:['선정성','도박'], active:false, appliedCount:0, updatedAt:'2026-03-15' },
];

export const detections = [
  { detId:'det001', type:'선정성', groupName:'1학년 1반', deviceName:'iPad-001', policy:'기본 탐지 정책', status:'confirmed', detectedAt:'2026-04-15T09:10:00', thumb:'42' },
  { detId:'det002', type:'도박', groupName:'2학년 3반', deviceName:'iPad-009', policy:'강화 탐지 정책', status:'reviewing', detectedAt:'2026-04-15T08:55:00', thumb:'86' },
  { detId:'det003', type:'선정성', groupName:'3학년 1반', deviceName:'iPad-013', policy:'기본 탐지 정책', status:'reviewing', detectedAt:'2026-04-15T08:30:00', thumb:'24' },
  { detId:'det004', type:'폭력', groupName:'1학년 2반', deviceName:'iPad-003', policy:'강화 탐지 정책', status:'dismissed', detectedAt:'2026-04-14T16:45:00', thumb:'55' },
  { detId:'det005', type:'선정성', groupName:'2학년 2반', deviceName:'iPad-007', policy:'기본 탐지 정책', status:'confirmed', detectedAt:'2026-04-14T15:20:00', thumb:'71' },
  { detId:'det006', type:'도박', groupName:'2학년 1반', deviceName:'iPad-005', policy:'강화 탐지 정책', status:'confirmed', detectedAt:'2026-04-14T14:10:00', thumb:'33' },
  { detId:'det007', type:'선정성', groupName:'1학년 1반', deviceName:'iPad-002', policy:'기본 탐지 정책', status:'confirmed', detectedAt:'2026-04-13T11:30:00', thumb:'19' },
  { detId:'det008', type:'기타', groupName:'3학년 2반', deviceName:'iPad-014', policy:'기본 탐지 정책', status:'dismissed', detectedAt:'2026-04-13T10:00:00', thumb:'63' },
];

export const pauses = [
  { pauseId:'ps001', grade:1, cls:2, groupName:'1학년 2반', pauseType:'전체', requester:'김선생', startAt:'2026-04-15T08:00:00', endAt:'2026-04-15T12:00:00', reason:'중간고사', status:'ACTIVE' },
  { pauseId:'ps002', grade:2, cls:1, groupName:'2학년 1반', pauseType:'선정성', requester:'이선생', startAt:'2026-04-14T09:00:00', endAt:'2026-04-14T17:00:00', reason:'특별 수업', status:'EXPIRED' },
  { pauseId:'ps003', grade:3, cls:2, groupName:'3학년 2반', pauseType:'도박', requester:'박선생', startAt:'2026-04-16T08:00:00', endAt:'2026-04-16T12:00:00', reason:'예약됨', status:'ACTIVE' },
];

export const users = [
  { userId:'u001', name:'관리자', username:'admin', role:'admin', contact:'010-1234-5678', status:'active', lastLogin:'2026-04-15T09:30:00', assignments:[] },
  { userId:'u002', name:'김선생', username:'teacher01', role:'teacher', contact:'010-2345-6789', status:'active', lastLogin:'2026-04-15T08:00:00', assignments:[{grade:1,cls:2},{grade:1,cls:1}] },
  { userId:'u003', name:'이선생', username:'teacher02', role:'teacher', contact:'010-3456-7890', status:'active', lastLogin:'2026-04-14T17:30:00', assignments:[{grade:2,cls:1}] },
  { userId:'u004', name:'박직원', username:'staff01', role:'staff', contact:'010-4567-8901', status:'active', lastLogin:'2026-04-15T07:50:00', assignments:[] },
  { userId:'u005', name:'최선생', username:'teacher03', role:'teacher', contact:'010-5678-9012', status:'inactive', lastLogin:'2026-03-20T10:00:00', assignments:[{grade:3,cls:1},{grade:3,cls:2}] },
];

export const licenses = {
  school:'A중학교', type:'연간 라이선스', serialKey:'MC-2026-ABCD-EFGH-IJKL',
  devices:150, usedDevices:143, validFrom:'2026-01-01', validTo:'2026-12-31',
  status:'active', lastSync:'2026-04-15T06:00:00', manager:'홍길동',
  supportContact:'support@meercatch.io', supportTel:'02-1234-5678',
};

export const notificationSettings = {
  emailEnabled:true, emailAddress:'admin@school.ac.kr',
  smsEnabled:false, smsNumber:'010-1234-5678',
  detectionAlert:true, dailyReport:true, weeklyReport:false, pauseAlert:true,
  alertThreshold:3, notiType:'basic',
};
