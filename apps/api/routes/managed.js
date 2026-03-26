const router     = require('express').Router();
const db         = require('../utils/db');
const deviceAuth = require('../middleware/deviceAuth');

// GET /managed/schools
router.get('/schools', deviceAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT school_id, name FROM schools WHERE status = 'ACTIVE' ORDER BY name`
    );
    res.json(rows);
  } catch (err) {
    console.error('[managed/schools]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /managed/schools/:schoolId/grades
router.get('/schools/:schoolId/grades', deviceAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT grade_id, name FROM grades
       WHERE school_id = $1 AND status = 'ACTIVE'
       ORDER BY name`,
      [req.params.schoolId]
    );
    res.json(rows);
  } catch (err) {
    console.error('[managed/grades]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /managed/grades/:gradeId/classes
router.get('/grades/:gradeId/classes', deviceAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT class_id, name FROM class_groups
       WHERE grade_id = $1 AND status = 'ACTIVE'
       ORDER BY name`,
      [req.params.gradeId]
    );
    res.json(rows);
  } catch (err) {
    console.error('[managed/classes]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /managed/device-affiliations
router.post('/device-affiliations', deviceAuth, async (req, res) => {
  const { schoolId, gradeId, classId, studentNumber, studentName } = req.body;
  if (!schoolId || !gradeId || !classId || !studentNumber) {
    return res.status(400).json({
      error: 'schoolId, gradeId, classId, studentNumber are required',
    });
  }

  const deviceId = req.device.device_id;

  try {
    // 기존 소속 있으면 비활성화 (재등록 허용)
    await db.query(
      `UPDATE device_affiliations SET status = 'INACTIVE'
       WHERE device_id = $1 AND status = 'ACTIVE'`,
      [deviceId]
    );

    // 신규 소속 등록
    const { rows } = await db.query(
      `INSERT INTO device_affiliations
         (device_id, school_id, grade_id, class_id, student_number, student_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (device_id) DO UPDATE
         SET school_id = EXCLUDED.school_id,
             grade_id  = EXCLUDED.grade_id,
             class_id  = EXCLUDED.class_id,
             student_number = EXCLUDED.student_number,
             student_name   = EXCLUDED.student_name,
             assigned_at    = NOW(),
             status         = 'ACTIVE'
       RETURNING affiliation_id, assigned_at`,
      [deviceId, schoolId, gradeId, classId, studentNumber, studentName || null]
    );

    // 디바이스 모드를 MANAGED로 업데이트
    await db.query(
      `UPDATE devices SET mode_type = 'MANAGED' WHERE device_id = $1`,
      [deviceId]
    );

    res.status(201).json({
      deviceAffiliationId: rows[0].affiliation_id,
      assignedAt: rows[0].assigned_at,
    });
  } catch (err) {
    console.error('[managed/device-affiliations POST]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /managed/device-affiliations/me
router.get('/device-affiliations/me', deviceAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
         da.affiliation_id,
         da.student_number,
         da.student_name,
         da.assigned_at,
         da.status,
         s.name  AS school_name,
         g.name  AS grade_name,
         cg.name AS class_name
       FROM device_affiliations da
       JOIN schools     s  ON s.school_id = da.school_id
       JOIN grades      g  ON g.grade_id  = da.grade_id
       JOIN class_groups cg ON cg.class_id = da.class_id
       WHERE da.device_id = $1 AND da.status = 'ACTIVE'`,
      [req.device.device_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No affiliation found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('[managed/device-affiliations/me]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
