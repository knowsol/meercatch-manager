import { useState } from 'react';
import { useToastCtx } from '../../components/layout/Layout';
import { DUMMY } from '../../data/dummy';

const NOTI_TYPES = [
  { id: 'basic',  label: '기본',  desc: '단말 상단에 일반 알림 배너로 표시됩니다' },
  { id: 'popup',  label: '팝업',  desc: '화면 중앙에 팝업 창으로 즉시 표시됩니다' },
  { id: 'strong', label: '강조',  desc: '전체 화면 오버레이로 강제 표시됩니다' },
];

export default function Notifications() {
  const toast = useToastCtx();
  const s = DUMMY.notificationSettings;

  const [emailEnabled,    setEmailEnabled]    = useState(s.emailEnabled);
  const [emailAddress,    setEmailAddress]    = useState(s.emailAddress);
  const [smsEnabled,      setSmsEnabled]      = useState(s.smsEnabled);
  const [smsNumber,       setSmsNumber]       = useState(s.smsNumber);
  const [detectionAlert,  setDetectionAlert]  = useState(s.detectionAlert);
  const [dailyReport,     setDailyReport]     = useState(s.dailyReport);
  const [weeklyReport,    setWeeklyReport]    = useState(s.weeklyReport);
  const [pauseAlert,      setPauseAlert]      = useState(s.pauseAlert);
  const [alertThreshold,  setAlertThreshold]  = useState(String(s.alertThreshold));
  const [notiType,        setNotiType]        = useState(s.notiType || 'basic');

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">알림 설정</div>
          <div className="ph-sub">탐지 및 시스템 알림 방식을 설정합니다</div>
        </div>
      </div>

      <div className="card" style={{maxWidth:'600px'}}>

        {/* 이메일 알림 */}
        <div className="detail-section">
          <div className="detail-section-title">이메일 알림</div>
          <label className="checkbox-row mb-16">
            <input type="checkbox" checked={emailEnabled} onChange={e => setEmailEnabled(e.target.checked)} />
            이메일 알림 활성화
          </label>
          <div className="fg">
            <label>알림 수신 이메일</label>
            <input className="inp" type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        {/* SMS 알림 */}
        <div className="detail-section">
          <div className="detail-section-title">SMS 알림</div>
          <label className="checkbox-row mb-16">
            <input type="checkbox" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} />
            SMS 알림 활성화
          </label>
          <div className="fg">
            <label>수신 번호</label>
            <input className="inp" type="text" value={smsNumber} onChange={e => setSmsNumber(e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        {/* 알림 이벤트 */}
        <div className="detail-section">
          <div className="detail-section-title">알림 이벤트</div>
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <label className="checkbox-row">
              <input type="checkbox" checked={detectionAlert} onChange={e => setDetectionAlert(e.target.checked)} />
              탐지 발생 시 즉시 알림
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={pauseAlert} onChange={e => setPauseAlert(e.target.checked)} />
              탐지 중단 요청/해제 알림
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={dailyReport} onChange={e => setDailyReport(e.target.checked)} />
              일일 탐지 리포트
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={weeklyReport} onChange={e => setWeeklyReport(e.target.checked)} />
              주간 리포트
            </label>
          </div>
        </div>

        <div className="divider" />

        {/* 알림 임계값 */}
        <div className="detail-section">
          <div className="detail-section-title">알림 임계값</div>
          <div className="fg">
            <label>탐지 횟수 임계값 (n회 이상 시 알림)</label>
            <input className="inp" type="number" min="1" max="100"
              value={alertThreshold} onChange={e => setAlertThreshold(e.target.value)}
              style={{maxWidth:'100px'}} />
          </div>
          <div className="text-t3" style={{fontSize:'11.5px', marginTop:'4px'}}>동일 단말에서 n회 이상 탐지 시 긴급 알림이 발송됩니다</div>
        </div>

        <div className="divider" />

        {/* 알림 유형 설정 */}
        <div className="detail-section">
          <div className="detail-section-title">알림 유형 설정</div>
          <div className="text-t2" style={{fontSize:'12px', marginBottom:'12px'}}>학생 단말기에 표시될 알림 방식을 선택합니다. 설정 저장 시 모든 단말에 즉시 적용됩니다.</div>
          <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
            {NOTI_TYPES.map(t => {
              const isActive = notiType === t.id;
              return (
                <label key={t.id} style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  padding:'12px 14px', borderRadius:'var(--radius-sm)', cursor:'pointer',
                  border:`1px solid ${isActive ? 'var(--ac)' : 'var(--bd)'}`,
                  background: isActive ? 'rgba(99,102,241,.07)' : 'var(--bg2)',
                  transition:'border-color var(--trans),background var(--trans)'
                }}>
                  <input type="radio" name="noti-type" value={t.id}
                    checked={isActive} onChange={() => setNotiType(t.id)}
                    style={{accentColor:'var(--ac)', width:'16px', height:'16px', flexShrink:0}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:'14px', fontWeight:'600', color:'var(--t1)'}}>{t.label}</div>
                    <div style={{fontSize:'12px', color:'var(--t2)', marginTop:'2px'}}>{t.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-8 mt-20">
          <button className="btn btn-p" onClick={() => toast('알림 설정이 저장되었습니다.')}>저장</button>
          <button className="btn btn-outline" onClick={() => toast('테스트 알림을 발송했습니다.', 'info')}>테스트 발송</button>
        </div>
      </div>
    </div>
  );
}
