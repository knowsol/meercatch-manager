/**
 * tests/devices.test.js
 * Qwen 생성 → Claude 검토 수정
 * - TypeScript 문법(as jest.Mock) 제거
 * - db.query mock으로 교체 (registerDevice 없음)
 * - deviceAuth 미들웨어 체인 처리
 * - 상태코드 201로 수정
 */
const request = require('supertest');
const express = require('express');

// ── Mock 설정 ─────────────────────────────────────────────
jest.mock('../utils/db', () => ({
  query: jest.fn(),
}));
jest.mock('../utils/token', () => ({
  generateDeviceToken: jest.fn(() => 'mock-device-token-abc123'),
  signManagerToken:    jest.fn(),
  verifyManagerToken:  jest.fn(),
}));

const db = require('../utils/db');

// ── App 구성 ──────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use('/devices', require('../routes/devices'));

// ── 테스트 ────────────────────────────────────────────────
describe('POST /devices/register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: deviceId와 deviceToken 반환', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ device_id: 'uuid-device-001' }],
    });

    const res = await request(app)
      .post('/devices/register')
      .send({ platformType: 'android', osVersion: '14', appVersion: '1.0.0', modeType: 'MANAGED' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('deviceId', 'uuid-device-001');
    expect(res.body).toHaveProperty('deviceToken', 'mock-device-token-abc123');
  });

  it('실패: platformType 누락 → 400', async () => {
    const res = await request(app)
      .post('/devices/register')
      .send({ osVersion: '14', appVersion: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('실패: 잘못된 modeType → 400', async () => {
    const res = await request(app)
      .post('/devices/register')
      .send({ platformType: 'android', modeType: 'INVALID' });

    expect(res.status).toBe(400);
  });
});

describe('GET /devices/me', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 디바이스 정보 반환', async () => {
    // deviceAuth 미들웨어 → devices 조회 mock
    db.query
      .mockResolvedValueOnce({
        rows: [{ device_id: 'uuid-001', mode_type: 'MANAGED', status: 'ACTIVE' }],
      })
      // last_active_at 업데이트 (fire-and-forget)
      .mockResolvedValueOnce({ rows: [] })
      // GET /devices/me 본체 조회
      .mockResolvedValueOnce({
        rows: [{ device_id: 'uuid-001', platform_type: 'android', status: 'ACTIVE' }],
      });

    const res = await request(app)
      .get('/devices/me')
      .set('X-Device-Token', 'valid-token');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('device_id', 'uuid-001');
  });

  it('실패: X-Device-Token 헤더 없음 → 401', async () => {
    const res = await request(app).get('/devices/me');
    expect(res.status).toBe(401);
  });

  it('실패: 유효하지 않은 토큰 → 401', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // 토큰 조회 결과 없음

    const res = await request(app)
      .get('/devices/me')
      .set('X-Device-Token', 'invalid-token');

    expect(res.status).toBe(401);
  });

  it('실패: INACTIVE 디바이스 → 403', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ device_id: 'uuid-002', mode_type: 'SIMPLE', status: 'INACTIVE' }],
    });

    const res = await request(app)
      .get('/devices/me')
      .set('X-Device-Token', 'inactive-token');

    expect(res.status).toBe(403);
  });
});
