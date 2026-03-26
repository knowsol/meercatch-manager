const crypto = require('crypto');
const jwt    = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

/**
 * 디바이스 토큰 생성 (256-bit random hex)
 */
function generateDeviceToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * 매니저 JWT 발급
 */
function signManagerToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

/**
 * 매니저 JWT 검증
 */
function verifyManagerToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateDeviceToken, signManagerToken, verifyManagerToken };
