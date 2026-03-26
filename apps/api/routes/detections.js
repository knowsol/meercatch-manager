const router     = require('express').Router();
const db         = require('../utils/db');
const deviceAuth = require('../middleware/deviceAuth');
const { calculateNotificationLevel } = require('../services/notificationService');
const { isPaused }                   = require('../services/pauseService');

// POST /detections — 탐지 이벤트 등록
router.post('/', deviceAuth, async (req, res) => {
  const { detectionType, detectedAt, severityLevel, summary } = req.body;
  if (!detectionType || !detectedAt || !severityLevel) {
    return res.status(400).json({
      error: 'detectionType, detectedAt, severityLevel are required',
    });
  }

  const deviceId = req.device.device_id;
  const modeType = req.device.mode_type;

  try {
    // MANAGED 모드: 탐지 중단 여부 확인
    let paused = false;
    if (modeType === 'MANAGED') {
      const { rows: affRows } = await db.query(
        `SELECT class_id, grade_id FROM device_affiliations
         WHERE device_id = $1 AND status = 'ACTIVE'`,
        [deviceId]
      );
      if (affRows.length > 0) {
        paused = await isPaused(affRows[0].class_id, affRows[0].grade_id);
      }
    }

    // 탐지 횟수 기반 노티 레벨 계산 (pause 중이면 NONE)
    const notificationLevel = paused
      ? 'NONE'
      : await calculateNotificationLevel(deviceId, modeType);

    // DB 저장
    const { rows } = await db.query(
      `INSERT INTO detection_events
         (device_id, detected_at, detection_type, severity_level, notification_level, summary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING detection_event_id`,
      [deviceId, detectedAt, detectionType, severityLevel, notificationLevel, summary || null]
    );

    res.status(201).json({
      detectionEventId: rows[0].detection_event_id,
      notificationLevel,
      paused,
    });
  } catch (err) {
    console.error('[detections POST]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /detections?limit=100 — 탐지 이력 조회
router.get('/', deviceAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 100);
  try {
    const { rows } = await db.query(
      `SELECT
         detection_event_id,
         detected_at,
         detection_type,
         severity_level,
         notification_level,
         summary,
         is_false_positive,
         created_at
       FROM detection_events
       WHERE device_id = $1
       ORDER BY detected_at DESC
       LIMIT $2`,
      [req.device.device_id, limit]
    );
    res.json(rows);
  } catch (err) {
    console.error('[detections GET]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /detections/:id — 탐지 상세 조회
router.get('/:id', deviceAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
         de.*,
         fpr.report_id,
         fpr.report_reason,
         fpr.status AS false_positive_status,
         fpr.reported_at
       FROM detection_events de
       LEFT JOIN false_positive_reports fpr ON fpr.detection_event_id = de.detection_event_id
       WHERE de.detection_event_id = $1 AND de.device_id = $2`,
      [req.params.id, req.device.device_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Detection event not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('[detections/:id GET]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
