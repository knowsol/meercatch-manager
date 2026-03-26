const router      = require('express').Router();
const db          = require('../utils/db');
const deviceAuth  = require('../middleware/deviceAuth');
const managerAuth = require('../middleware/managerAuth');

// POST /detections/:id/false-positive — 앱 오탐 신고
router.post('/detections/:id/false-positive', deviceAuth, async (req, res) => {
  const { reportReason, note } = req.body;
  if (!reportReason) {
    return res.status(400).json({ error: 'reportReason is required' });
  }

  const deviceId         = req.device.device_id;
  const detectionEventId = req.params.id;

  try {
    // 탐지 이벤트 소유권 확인
    const { rows: evRows } = await db.query(
      `SELECT detection_event_id FROM detection_events
       WHERE detection_event_id = $1 AND device_id = $2`,
      [detectionEventId, deviceId]
    );
    if (evRows.length === 0) {
      return res.status(404).json({ error: 'Detection event not found' });
    }

    // 중복 신고 방지
    const { rows: existing } = await db.query(
      `SELECT report_id FROM false_positive_reports WHERE detection_event_id = $1`,
      [detectionEventId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already reported as false positive' });
    }

    const { rows } = await db.query(
      `INSERT INTO false_positive_reports
         (detection_event_id, device_id, report_reason, note)
       VALUES ($1, $2, $3, $4)
       RETURNING report_id, status, reported_at`,
      [detectionEventId, deviceId, reportReason, note || null]
    );

    res.status(201).json({
      reportId: rows[0].report_id,
      status: rows[0].status,
      reportedAt: rows[0].reported_at,
    });
  } catch (err) {
    console.error('[false-positive POST]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /false-positives — 매니저 오탐 목록 조회
router.get('/false-positives', managerAuth, async (req, res) => {
  const { status = 'SUBMITTED', page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const { rows } = await db.query(
      `SELECT
         fpr.report_id,
         fpr.detection_event_id,
         fpr.report_reason,
         fpr.note,
         fpr.reported_at,
         fpr.status,
         de.detection_type,
         de.severity_level,
         de.detected_at,
         de.summary,
         d.platform_type,
         da.student_number,
         da.student_name,
         s.name  AS school_name,
         g.name  AS grade_name,
         cg.name AS class_name
       FROM false_positive_reports fpr
       JOIN detection_events  de  ON de.detection_event_id = fpr.detection_event_id
       JOIN devices           d   ON d.device_id = fpr.device_id
       LEFT JOIN device_affiliations da ON da.device_id = fpr.device_id AND da.status = 'ACTIVE'
       LEFT JOIN schools      s   ON s.school_id = da.school_id
       LEFT JOIN grades       g   ON g.grade_id  = da.grade_id
       LEFT JOIN class_groups cg  ON cg.class_id = da.class_id
       WHERE fpr.status = $1
       ORDER BY fpr.reported_at DESC
       LIMIT $2 OFFSET $3`,
      [status, parseInt(limit), offset]
    );

    const { rows: countRows } = await db.query(
      `SELECT COUNT(*)::int AS total FROM false_positive_reports WHERE status = $1`,
      [status]
    );

    res.json({
      data: rows,
      total: countRows[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error('[false-positives GET]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /false-positives/:id/review — 매니저 오탐 검토 처리
router.patch('/false-positives/:id/review', managerAuth, async (req, res) => {
  const { decision, reviewNote } = req.body; // decision: 'APPLIED' | 'REJECTED'
  if (!decision || !['APPLIED', 'REJECTED'].includes(decision)) {
    return res.status(400).json({ error: 'decision must be APPLIED or REJECTED' });
  }

  try {
    const { rows, rowCount } = await db.query(
      `UPDATE false_positive_reports
       SET status      = $1,
           reviewed_at = NOW(),
           reviewed_by = $2,
           note        = COALESCE($3, note)
       WHERE report_id = $4 AND status = 'SUBMITTED'
       RETURNING report_id, status, detection_event_id`,
      [decision, req.manager.managerId, reviewNote || null, req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Report not found or already reviewed' });
    }

    // APPLIED: 탐지 이벤트 오탐 플래그 설정
    if (decision === 'APPLIED') {
      await db.query(
        `UPDATE detection_events SET is_false_positive = TRUE
         WHERE detection_event_id = $1`,
        [rows[0].detection_event_id]
      );
    }

    res.json({ reportId: rows[0].report_id, status: rows[0].status });
  } catch (err) {
    console.error('[false-positives/review PATCH]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
