/**
 * tests/manager.test.js
 * Qwen 생성 → Claude 검토 수정
 * - db 선언 추가 (const db = require)
 * - POST /pause 상태코드 200 → 201 수정
 * - login 응답 구조 수정 (token + name + schoolId)
 * - bcrypt mock 구조 수정
 */
const request = require('supertest');
const express = require('express');

jest.mock('../utils/db', () => ({ query: jest.fn() }));
jest.mock('../utils/token', () => ({
  generateDeviceToken: jest.fn(),
  signManagerToken:    jest.fn(() => 'mocked-jwt-token'),
  verifyManagerToken:  jest.fn(() => ({ managerId: 'mgr-1', schoolId: 'sch-1', email: 'a@b.com' })),
}));
jest.mock('bcryptjs', () => ({
  compare:  jest.fn().mockResolvedValue(true),
  hashSync: jest.fn(() => '$2a$10$mockhash'),
}));

const db     = require('../utils/db');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use('/manager', require('../routes/manager'));

const AUTH_HEADER = 'Bearer valid-token';

// ── POST /manager/auth/login ──────────────────────────────
describe('POST /manager/auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: JWT 토큰 반환', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ manager_id: 'mgr-1', school_id: 'sch-1', email: 'a@b.com', password_hash: '$2a$10$mockhash', name: '관리자' }],
    });

    const res = await request(app)
      .post('/manager/auth/login')
      .send({ email: 'a@b.com', password: 'manager1234' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'mocked-jwt-token');
    expect(res.body).toHaveProperty('name', '관리자');
    expect(res.body).toHaveProperty('schoolId', 'sch-1');
  });

  it('실패: 존재하지 않는 이메일 → 401', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/manager/auth/login')
      .send({ email: 'nobody@x.com', password: 'pw' });

    expect(res.status).toBe(401);
  });

  it('실패: 비밀번호 불일치 → 401', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ manager_id: 'mgr-1', school_id: 'sch-1', email: 'a@b.com', password_hash: '$2a$10$mockhash', name: '관리자' }],
    });
    bcrypt.compare.mockResolvedValueOnce(false);

    const res = await request(app)
      .post('/manager/auth/login')
      .send({ email: 'a@b.com', password: 'wrongpw' });

    expect(res.status).toBe(401);
  });
});

// ── GET /manager/classes/:classId/detections ─────────────
describe('GET /manager/classes/:classId/detections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 탐지 목록 배열 반환', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ detection_event_id: 'ev-1' }, { detection_event_id: 'ev-2' }] });

    const res = await request(app)
      .get('/manager/classes/cls-1/detections')
      .set('Authorization', AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it('실패: Authorization 없음 → 401', async () => {
    const res = await request(app).get('/manager/classes/cls-1/detections');
    expect(res.status).toBe(401);
  });
});

// ── GET /manager/grades/:gradeId/detections ──────────────
describe('GET /manager/grades/:gradeId/detections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 학년별 탐지 목록 반환', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ detection_event_id: 'ev-3' }] });

    const res = await request(app)
      .get('/manager/grades/grd-1/detections')
      .set('Authorization', AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('실패: Authorization 없음 → 401', async () => {
    const res = await request(app).get('/manager/grades/grd-1/detections');
    expect(res.status).toBe(401);
  });
});

// ── POST /manager/classes/:classId/pause ─────────────────
describe('POST /manager/classes/:classId/pause', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: pause_id 반환 (201)', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ pause_id: 'pause-001', status: 'ACTIVE', start_at: '2026-03-17T12:00:00Z', end_at: '2026-03-17T18:00:00Z' }],
    });

    const res = await request(app)
      .post('/manager/classes/cls-1/pause')
      .set('Authorization', AUTH_HEADER)
      .send({ startAt: '2026-03-17T12:00:00Z', endAt: '2026-03-17T18:00:00Z', reason: '체험학습' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('pause_id', 'pause-001');
  });

  it('실패: startAt/endAt 누락 → 400', async () => {
    const res = await request(app)
      .post('/manager/classes/cls-1/pause')
      .set('Authorization', AUTH_HEADER)
      .send({ reason: '이유만 있음' });

    expect(res.status).toBe(400);
  });

  it('실패: Authorization 없음 → 401', async () => {
    const res = await request(app)
      .post('/manager/classes/cls-1/pause')
      .send({ startAt: '2026-03-17T12:00:00Z', endAt: '2026-03-17T18:00:00Z' });

    expect(res.status).toBe(401);
  });
});

// ── DELETE /manager/detection-pauses/:id ─────────────────
describe('DELETE /manager/detection-pauses/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: ok:true 반환', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app)
      .delete('/manager/detection-pauses/pause-001')
      .set('Authorization', AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('실패: 존재하지 않는 ID → 404', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app)
      .delete('/manager/detection-pauses/non-exist')
      .set('Authorization', AUTH_HEADER);

    expect(res.status).toBe(404);
  });

  it('실패: Authorization 없음 → 401', async () => {
    const res = await request(app).delete('/manager/detection-pauses/pause-001');
    expect(res.status).toBe(401);
  });
});

// ── GET /manager/detection-pauses ────────────────────────
describe('GET /manager/detection-pauses', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 중단 목록 배열 반환', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ pause_id: 'pause-001', scope_type: 'CLASS', scope_name: '1반', status: 'ACTIVE' }],
    });

    const res = await request(app)
      .get('/manager/detection-pauses')
      .set('Authorization', AUTH_HEADER);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('scope_type', 'CLASS');
  });

  it('실패: Authorization 없음 → 401', async () => {
    const res = await request(app).get('/manager/detection-pauses');
    expect(res.status).toBe(401);
  });
});
