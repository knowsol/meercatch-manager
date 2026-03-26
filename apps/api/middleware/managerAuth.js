const { verifyManagerToken } = require('../utils/token');

/**
 * Bearer JWT 검증 미들웨어 (매니저 전용)
 * req.manager 에 매니저 정보 주입
 */
function managerAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyManagerToken(token);
    req.manager = payload; // { managerId, schoolId, email }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = managerAuth;
