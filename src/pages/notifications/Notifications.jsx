import { useState } from 'react';
import { useToastCtx } from '../../components/layout/Layout';
import { notificationSettings } from '../../data/dummy';

const NOTI_TYPES = [
  { id: 'basic', label: '기본', desc: '기본 알림 방식' },
  { id: 'popup', label: '팝업', desc: '팝업으로 즉시 표시' },
  { id: 'highlight', label: '강조', desc: '강조 표시 + 소리' },
];

export default function Notifications() {
  const toast = useToastCtx();

  const [emailEnabled, setEmailEnabled] = useState(notificationSettings.emailEnabled);
  const [emailAddress, setEmailAddress] = useState(notificationSettings.emailAddress);
  const [smsEnabled, setSmsEnabled] = useState(notificationSettings.smsEnabled);
  const [smsNumber, setSmsNumber] = useState(notificationSettings.smsNumber);
  const [detectionAlert, setDetectionAlert] = useState(notificationSettings.detectionAlert);
  const [dailyReport, setDailyReport] = useState(notificationSettings.dailyReport);
  const [weeklyReport, setWeeklyReport] = useState(notificationSettings.weeklyReport);
  const [pauseAlert, setPauseAlert] = useState(notificationSettings.pauseAlert);
  const [alertThreshold, setAlertThreshold] = useState(notificationSettings.alertThreshold);
  const [notiType, setNotiType] = useState(notificationSettings.notiType);

  const handleSave = () => {
    toast('알림 설정이 저장되었습니다.', 'success');
  };

  const handleTestSend = () => {
    toast('테스트 알림이 발송되었습니다.', 'info');
  };

  return (
    <div>
      <div className="ph">
        <h1 className="ph-title">알림 설정</h1>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>

        {/* 이메일 알림 */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>이메일 알림</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={emailEnabled} onChange={e => setEmailEnabled(e.target.checked)} />
            이메일 알림 사용
          </label>
          <div className="fg">
            <label>알림 수신 이메일</label>
            <input
              className="inp"
              type="email"
              value={emailAddress}
              onChange={e => setEmailAddress(e.target.value)}
              disabled={!emailEnabled}
              placeholder="example@school.ac.kr"
            />
          </div>
        </div>

        <div className="divider" />

        {/* SMS 알림 */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>SMS 알림</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} />
            SMS 알림 사용
          </label>
          <div className="fg">
            <label>수신 번호</label>
            <input
              className="inp"
              value={smsNumber}
              onChange={e => setSmsNumber(e.target.value)}
              disabled={!smsEnabled}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <div className="divider" />

        {/* 알림 이벤트 */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>알림 이벤트</div>
          {[
            { label: '탐지 발생 시 즉시 알림', value: detectionAlert, set: setDetectionAlert },
            { label: '탐지 중단 요청/해제 알림', value: pauseAlert, set: setPauseAlert },
            { label: '일일 탐지 리포트', value: dailyReport, set: setDailyReport },
            { label: '주간 리포트', value: weeklyReport, set: setWeeklyReport },
          ].map(item => (
            <label key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={item.value} onChange={e => item.set(e.target.checked)} />
              {item.label}
            </label>
          ))}
        </div>

        <div className="divider" />

        {/* 알림 임계값 */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>알림 임계값</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <input
              className="inp"
              type="number"
              min={1}
              max={100}
              value={alertThreshold}
              onChange={e => setAlertThreshold(Number(e.target.value))}
              style={{ maxWidth: 100 }}
            />
            <span style={{ color: 'var(--text-sub)', fontSize: 14 }}>건 이상 탐지 시 즉시 알림 발송</span>
          </div>
          <p style={{ color: 'var(--text-sub)', fontSize: 13, margin: 0 }}>
            설정한 임계값 이상의 탐지가 발생하면 즉시 알림을 발송합니다.
          </p>
        </div>

        <div className="divider" />

        {/* 알림 유형 설정 */}
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>알림 유형 설정</div>
          <p style={{ color: 'var(--text-sub)', fontSize: 13, marginBottom: 12 }}>화면에 표시되는 알림 유형을 선택합니다.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {NOTI_TYPES.map(type => (
              <div
                key={type.id}
                onClick={() => setNotiType(type.id)}
                style={{
                  flex: 1,
                  minWidth: 120,
                  padding: '12px 16px',
                  border: `2px solid ${notiType === type.id ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: notiType === type.id ? 'var(--primary-bg, rgba(99,102,241,0.06))' : 'transparent',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{type.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-sub)' }}>{type.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="fb">
          <button className="btn btn-p" onClick={handleSave}>저장</button>
          <button className="btn btn-outline" onClick={handleTestSend}>테스트 발송</button>
        </div>
      </div>
    </div>
  );
}
