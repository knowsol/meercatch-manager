const db = require('../utils/db');

/**
 * X-Device-Token 헤더 검증 미들웨어
 * req.device 에 디바이스 정보 주입
 */
async function deviceAuth(req, res, next) {
  const token = req.headers['x-device-token'];
  if (!token) {
    return res.status(401).json({ error: 'Missing X-Device-Token header' });
  }

  try {
    const { rows } = await db.query(
      `SELECT device_id, mode_type, status FROM devices WHERE device_token = $1`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid device token' });
    }
    if (rows[0].status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Device is inactive' });
    }

    req.device = rows[0];

    // 마지막 활성 시각 갱신 (비동기, 응답 블로킹 없음)
    db.query(
      `UPDATE devices SET last_active_at = NOW() WHERE device_id = $1`,
      [rows[0].device_id]
    ).catch(() => {});

    next();
  } catch (err) {
    console.error('[deviceAuth]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = deviceAuth;
