const router = require('express').Router();
const db     = require('../utils/db');

// POST /installations/start
router.post('/start', async (req, res) => {
  const { platformType, osVersion, appVersion } = req.body;
  if (!platformType) {
    return res.status(400).json({ error: 'platformType is required' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO installations (platform_type, os_version, app_version, status)
       VALUES ($1, $2, $3, 'STARTED')
       RETURNING installation_id`,
      [platformType, osVersion, appVersion]
    );
    res.status(201).json({ installationId: rows[0].installation_id });
  } catch (err) {
    console.error('[installations/start]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /installations/select-mode
router.post('/select-mode', async (req, res) => {
  const { installationId, modeType } = req.body;
  if (!installationId || !modeType) {
    return res.status(400).json({ error: 'installationId and modeType are required' });
  }
  if (!['SIMPLE', 'MANAGED'].includes(modeType)) {
    return res.status(400).json({ error: 'modeType must be SIMPLE or MANAGED' });
  }
  try {
    const { rowCount } = await db.query(
      `UPDATE installations
       SET mode_type = $1, status = 'MODE_SELECTED'
       WHERE installation_id = $2 AND status = 'STARTED'`,
      [modeType, installationId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Installation not found or already progressed' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[installations/select-mode]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /installations/complete
router.post('/complete', async (req, res) => {
  const { installationId } = req.body;
  if (!installationId) {
    return res.status(400).json({ error: 'installationId is required' });
  }
  try {
    const { rowCount } = await db.query(
      `UPDATE installations
       SET status = 'COMPLETED'
       WHERE installation_id = $1 AND status = 'MODE_SELECTED'`,
      [installationId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Installation not found or not ready' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[installations/complete]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
