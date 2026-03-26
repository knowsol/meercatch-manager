const db = require('../utils/db');

/**
 * 디바이스의 현재 주간 탐지 횟수 조회 후 노티 레벨 계산
 * OD-1: GUIDE=1, CAUTION=2~4, WARNING≥5
 * OD-2: 1주일 리셋 (매주 월요일 00:00 기준)
 */
async function calculateNotificationLevel(deviceId, modeType = 'MANAGED') {
  // 이번 주 월요일 00:00 계산
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=일, 1=월
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  // 이번 주 탐지 횟수 (오탐 제외)
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS cnt
     FROM detection_events
     WHERE device_id = $1
       AND detected_at >= $2
       AND is_false_positive = FALSE`,
    [deviceId, monday.toISOString()]
  );

  // +1: 현재 저장 예정인 이벤트 포함 (INSERT 전 호출되므로)
  const count = rows[0].cnt + 1;

  // 정책 조회 (캐싱 미적용, 단순 조회)
  const { rows: policies } = await db.query(
    `SELECT guide_threshold, caution_min, caution_max, warning_threshold
     FROM notification_policies
     WHERE mode_type = $1`,
    [modeType]
  );

  const policy = policies[0] || {
    guide_threshold: 1,
    caution_min: 2,
    caution_max: 4,
    warning_threshold: 5,
  };

  // 레벨 결정
  if (count < policy.guide_threshold) return 'NONE';
  if (count === policy.guide_threshold) return 'GUIDE';
  if (count >= policy.caution_min && count <= policy.caution_max) return 'CAUTION';
  if (count >= policy.warning_threshold) return 'WARNING';
  return 'GUIDE';
}

module.exports = { calculateNotificationLevel };
