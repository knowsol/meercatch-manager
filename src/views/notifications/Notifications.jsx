'use client'
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
  const [notiType, setNotiType] = useState(DUMMY.notificationSettings.notiType || 'basic');

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">알림 설정</div>
          <div className="ph-sub">학생 단말기에 표시될 알림 방식을 설정합니다</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="detail-section">
          <div className="detail-section-title">알림 유형 설정</div>
          <div className="text-t2" style={{ fontSize: '12px', marginBottom: '12px' }}>
            학생 단말기에 표시될 알림 방식을 선택합니다. 설정 저장 시 모든 단말에 즉시 적용됩니다.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {NOTI_TYPES.map(t => {
              const isActive = notiType === t.id;
              return (
                <label key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  border: `1px solid ${isActive ? 'var(--ac)' : 'var(--bd)'}`,
                  background: isActive ? 'rgba(99,102,241,.07)' : 'var(--bg2)',
                  transition: 'border-color var(--trans),background var(--trans)',
                }}>
                  <input type="radio" name="noti-type" value={t.id}
                    checked={isActive} onChange={() => setNotiType(t.id)}
                    style={{ accentColor: 'var(--ac)', width: '16px', height: '16px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--t1)' }}>{t.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '2px' }}>{t.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-8 mt-20">
          <button className="btn btn-p" onClick={() => toast('알림 설정이 저장되었습니다.')}>저장</button>
        </div>
      </div>
    </div>
  );
}
