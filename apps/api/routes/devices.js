const router             = require('express').Router();
const db                 = require('../utils/db');
const { generateDeviceToken } = require('../utils/token');
const deviceAuth         = require('../middleware/deviceAuth');

// POST /devices/register
router.post('/register', async (req, res) => {
  const { platformType, osVersion, appVersion, modeType = 'SIMPLE' } = req.body;
  if (!platformType) {
    return res.status(400).json({ error: 'platformType is required' });
  }
  if (!['SIMPLE', 'MANAGED'].includes(modeType)) {
    return res.status(400).json({ error: 'modeType must be SIMPLE or MANAGED' });
  }

  try {
    const deviceToken = generateDeviceToken();
    const { rows } = await db.query(
      `INSERT INTO devices (platform_type, os_version, app_version, device_token, mode_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING device_id`,
      [platformType, osVersion, appVersion, deviceToken, modeType]
    );
    res.status(201).json({
      deviceId: rows[0].device_id,
      deviceToken,
    });
  } catch (err) {
    console.error('[devices/register]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /devices/me
router.get('/me', deviceAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT device_id, platform_type, os_version, app_version, mode_type, status, last_active_at
       FROM devices WHERE device_id = $1`,
      [req.device.device_id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('[devices/me]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
