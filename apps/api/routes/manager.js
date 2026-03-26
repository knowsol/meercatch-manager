const router      = require('express').Router();
const bcrypt      = require('bcryptjs');
const db          = require('../utils/db');
const { signManagerToken } = require('../utils/token');
const managerAuth = require('../middleware/managerAuth');

// POST /manager/auth/login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  try {
    const { rows } = await db.query(
      `SELECT manager_id, school_id, email, password_hash, name
       FROM managers WHERE email = $1`,
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const manager = rows[0];
    const valid = await bcrypt.compare(password, manager.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signManagerToken({
      managerId: manager.manager_id,
      schoolId:  manager.school_id,
      email:     manager.email,
    });

    res.json({ token, name: manager.name, schoolId: manager.school_id });
  } catch (err) {
    console.error('[manager/auth/login]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /manager/classes/:classId/detections — 반별 탐지 현황
router.get('/classes/:classId/detections', managerAuth, async (req, res) => {
  const { from, to, limit = 50, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const { rows } = await db.query(
      `SELECT
         de.detection_event_id,
         de.detected_at,
         de.detection_type,
         de.severity_level,
         de.notification_level,
         de.summary,
         de.is_false_positive,
         da.student_number,
         da.student_name,
         d.platform_type
       FROM detection_events de
       JOIN devices d ON d.device_id = de.device_id
       JOIN device_affiliations da ON da.device_id = de.device_id AND da.status = 'ACTIVE'
       WHERE da.class_id = $1
         AND ($2::timestamptz IS NULL OR de.detected_at >= $2)
         AND ($3::timestamptz IS NULL OR de.detected_at <= $3)
       ORDER BY de.detected_at DESC
       LIMIT $4 OFFSET $5`,
      [req.params.classId, from || null, to || null, parseInt(limit), offset]
    );
    res.json(rows);
  } catch (err) {
    console.error('[manager/classes/detections]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /manager/grades/:gradeId/detections — 학년별 탐지 현황
router.get('/grades/:gradeId/detections', managerAuth, async (req, res) => {
  const { from, to, limit = 100, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const { rows } = await db.query(
      `SELECT
         de.detection_event_id,
         de.detected_at,
         de.detection_type,
         de.severity_level,
         de.notification_level,
         de.summary,
         de.is_false_positive,
         da.student_number,
         da.student_name,
         cg.name AS class_name,
         d.platform_type
       FROM detection_events de
       JOIN devices d ON d.device_id = de.device_id
       JOIN device_affiliations da ON da.device_id = de.device_id AND da.status = 'ACTIVE'
       JOIN class_groups cg ON cg.class_id = da.class_id
       WHERE da.grade_id = $1
         AND ($2::timestamptz IS NULL OR de.detected_at >= $2)
         AND ($3::timestamptz IS NULL OR de.detected_at <= $3)
       ORDER BY de.detected_at DESC
       LIMIT $4 OFFSET $5`,
      [req.params.gradeId, from || null, to || null, parseInt(limit), offset]
    );
    res.json(rows);
  } catch (err) {
    console.error('[manager/grades/detections]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /manager/classes/:classId/pause — 반 탐지 중단
router.post('/classes/:classId/pause', managerAuth, async (req, res) => {
  const { startAt, endAt, reason } = req.body;
  if (!startAt || !endAt) {
    return res.status(400).json({ error: 'startAt and endAt are required' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO detection_pauses (scope_type, scope_id, start_at, end_at, reason, created_by)
       VALUES ('CLASS', $1, $2, $3, $4, $5)
       RETURNING pause_id, status, start_at, end_at`,
      [req.params.classId, startAt, endAt, reason || null, req.manager.managerId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[manager/classes/pause]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /manager/grades/:gradeId/pause — 학년 탐지 중단
router.post('/grades/:gradeId/pause', managerAuth, async (req, res) => {
  const { startAt, endAt, reason } = req.body;
  if (!startAt || !endAt) {
    return res.status(400).json({ error: 'startAt and endAt are required' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO detection_pauses (scope_type, scope_id, start_at, end_at, reason, created_by)
       VALUES ('GRADE', $1, $2, $3, $4, $5)
       RETURNING pause_id, status, start_at, end_at`,
      [req.params.gradeId, startAt, endAt, reason || null, req.manager.managerId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[manager/grades/pause]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /manager/detection-pauses — 중단 목록 조회
// Qwen 생성 → Claude 검토 수정 (scope_type 기반 동적 JOIN, 경로 수정)
router.get('/detection-pauses', managerAuth, async (req, res) => {
  const status = req.query.status || 'ACTIVE';
  try {
    const { rows } = await db.query(
      `SELECT
         dp.pause_id,
         dp.scope_type,
         CASE dp.scope_type
           WHEN 'GRADE' THEN g.name
           WHEN 'CLASS' THEN cg.name
         END AS scope_name,
         CASE dp.scope_type
           WHEN 'GRADE' THEN gr_s.name
           WHEN 'CLASS' THEN cl_s.name
         END AS school_name,
         dp.start_at,
         dp.end_at,
         dp.reason,
         dp.status,
         dp.created_at
       FROM detection_pauses dp
       LEFT JOIN grades       g   ON dp.scope_type = 'GRADE' AND g.grade_id  = dp.scope_id
       LEFT JOIN schools      gr_s ON g.school_id  = gr_s.school_id
       LEFT JOIN class_groups cg  ON dp.scope_type = 'CLASS' AND cg.class_id = dp.scope_id
       LEFT JOIN grades       cg_g ON cg.grade_id  = cg_g.grade_id
       LEFT JOIN schools      cl_s ON cg_g.school_id = cl_s.school_id
       WHERE dp.status = $1
       ORDER BY dp.created_at DESC`,
      [status]
    );
    res.json(rows);
  } catch (err) {
    console.error('[manager/detection-pauses GET]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /manager/detection-pauses/:id — 탐지 중단 해제
router.delete('/detection-pauses/:id', managerAuth, async (req, res) => {
  try {
    const { rowCount } = await db.query(
      `UPDATE detection_pauses
       SET status = 'CANCELLED'
       WHERE pause_id = $1 AND status = 'ACTIVE'`,
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Pause not found or already inactive' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[manager/detection-pauses DELETE]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
