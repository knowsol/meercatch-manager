const db = require('../utils/db');

/**
 * 특정 디바이스(classId 기준)의 탐지 중단 여부 확인
 */
async function isPaused(classId, gradeId) {
  const { rows } = await db.query(
    `SELECT pause_id FROM detection_pauses
     WHERE status = 'ACTIVE'
       AND end_at > NOW()
       AND (
         (scope_type = 'CLASS' AND scope_id = $1)
         OR
         (scope_type = 'GRADE' AND scope_id = $2)
       )
     LIMIT 1`,
    [classId, gradeId]
  );
  return rows.length > 0;
}

/**
 * 만료된 pause 상태를 EXPIRED로 업데이트
 * cron 또는 요청 시 호출
 */
async function expireOldPauses() {
  const { rowCount } = await db.query(
    `UPDATE detection_pauses
     SET status = 'EXPIRED'
     WHERE status = 'ACTIVE' AND end_at <= NOW()`
  );
  if (rowCount > 0) {
    console.log(`[pauseService] ${rowCount} pauses expired`);
  }
  return rowCount;
}

module.exports = { isPaused, expireOldPauses };
