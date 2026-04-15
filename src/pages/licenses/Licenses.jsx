import { useToastCtx } from '../../components/layout/Layout';
import KPI from '../../components/common/KPI';
import { StatusBadge } from '../../components/common/Badge';
import { fmtD, fmtDT } from '../../components/common/helpers';
import { licenses } from '../../data/dummy';

export default function Licenses() {
  const toast = useToastCtx();

  const usePct = Math.round((licenses.usedDevices / licenses.devices) * 100);
  const remaining = licenses.devices - licenses.usedDevices;
  const pctColor = usePct >= 90 ? 'err' : usePct >= 75 ? 'warn' : 'ok';

  return (
    <div>
      <div className="ph">
        <h1 className="ph-title">라이선스</h1>
      </div>

      <div style={{ maxWidth: 860 }}>
        <div className="grid-4 mb-24">
          <KPI label="총 단말" value={licenses.devices} />
          <KPI label="사용 단말" value={`${usePct}%`} sub={`${licenses.usedDevices}대 사용 중`} color={pctColor} />
          <KPI label="잔여 슬롯" value={remaining} color="ac" />
          <KPI label="유효기간" value={fmtD(licenses.validTo)} />
        </div>

        <div className="grid-2 mb-24">
          <div className="card">
            <div className="card-hd"><span className="card-title">라이선스 상세</span></div>
            <dl className="info-row">
              <dt>학교명</dt><dd>{licenses.school}</dd>
              <dt>유형</dt><dd>{licenses.type}</dd>
              <dt>시리얼키</dt><dd><code style={{ fontFamily: 'monospace', fontSize: 13 }}>{licenses.serialKey}</code></dd>
              <dt>상태</dt><dd><StatusBadge status={licenses.status} /></dd>
              <dt>유효시작</dt><dd>{fmtD(licenses.validFrom)}</dd>
              <dt>유효종료</dt><dd>{fmtD(licenses.validTo)}</dd>
              <dt>최근동기화</dt><dd>{fmtDT(licenses.lastSync)}</dd>
            </dl>
          </div>

          <div className="card">
            <div className="card-hd"><span className="card-title">단말 사용 현황</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-sub)' }}>사용대수 / 전체</span>
              <span style={{ fontWeight: 600 }}>{licenses.usedDevices} / {licenses.devices}대</span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 6, height: 10, overflow: 'hidden', marginBottom: 20 }}>
              <div
                style={{
                  width: `${usePct}%`,
                  height: '100%',
                  background: usePct >= 90 ? 'var(--err)' : usePct >= 75 ? 'var(--warn)' : 'var(--ok)',
                  borderRadius: 6,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <div className="card-hd" style={{ marginBottom: 8 }}><span className="card-title" style={{ fontSize: 13 }}>지원 정보</span></div>
            <dl className="info-row">
              <dt>담당자</dt><dd>{licenses.manager}</dd>
              <dt>이메일</dt>
              <dd>
                <a href={`mailto:${licenses.supportContact}`} style={{ color: 'var(--primary)' }}>
                  {licenses.supportContact}
                </a>
              </dd>
              <dt>전화번호</dt><dd>{licenses.supportTel}</dd>
            </dl>
            <div className="sep" />
            <div className="fb">
              <button className="btn btn-p btn-sm" onClick={() => toast('갱신 문의 이메일이 전송되었습니다.', 'success')}>갱신 문의</button>
              <button className="btn btn-outline btn-sm" onClick={() => toast('라이선스 동기화 완료', 'success')}>동기화</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
