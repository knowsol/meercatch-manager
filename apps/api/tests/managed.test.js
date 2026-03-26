/**
 * tests/managed.test.js
 * Qwen 생성 → Claude 검토 수정
 * - mock route 구성 제거 → 실제 route 사용
 * - db import 수정 ({ db } → db)
 * - deviceAuth 미들웨어 체인 mock 방식 수정
 * - assignedAt 타입 string으로 수정
 */
const request = require('supertest');
const express = require('express');

jest.mock('../utils/db', () => ({ query: jest.fn() }));
jest.mock('../utils/token', () => ({
  generateDeviceToken: jest.fn(() => 'tok'),
  signManagerToken:    jest.fn(),
  verifyManagerToken:  jest.fn(),
}));

const db = require('../utils/db');

// ── 공통 deviceAuth mock ───────────────────────────────────
function mockActiveDevice() {
  db.query
    .mockResolvedValueOnce({ rows: [{ device_id: 'dev-001', mode_type: 'MANAGED', status: 'ACTIVE' }] })
    .mockResolvedValueOnce({ rows: [] }); // last_active_at 업데이트
}

const app = express();
app.use(express.json());
app.use('/managed', require('../routes/managed'));

// ── Tests ─────────────────────────────────────────────────
describe('GET /managed/schools', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 학교 목록 반환', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({ rows: [{ school_id: 'sch-1', name: '미어캐치초등학교' }] });

    const res = await request(app)
      .get('/managed/schools')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app).get('/managed/schools');
    expect(res.status).toBe(401);
  });
});

describe('GET /managed/schools/:schoolId/grades', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 학년 목록 반환', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({ rows: [{ grade_id: 'grd-1', name: '1학년' }] });

    const res = await request(app)
      .get('/managed/schools/sch-1/grades')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app).get('/managed/schools/sch-1/grades');
    expect(res.status).toBe(401);
  });
});

describe('GET /managed/grades/:gradeId/classes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 반 목록 반환', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({ rows: [{ class_id: 'cls-1', name: '1반' }] });

    const res = await request(app)
      .get('/managed/grades/grd-1/classes')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app).get('/managed/grades/grd-1/classes');
    expect(res.status).toBe(401);
  });
});

describe('POST /managed/device-affiliations', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 소속 등록 → deviceAffiliationId 반환', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({ rows: [] });  // INACTIVE 기존 소속 처리
    db.query.mockResolvedValueOnce({               // INSERT
      rows: [{ affiliation_id: 'aff-001', assigned_at: '2026-03-17T10:00:00.000Z' }],
    });
    db.query.mockResolvedValueOnce({ rows: [] }); // mode_type 업데이트

    const res = await request(app)
      .post('/managed/device-affiliations')
      .set('X-Device-Token', 'valid-tok')
      .send({ schoolId: 'sch-1', gradeId: 'grd-1', classId: 'cls-1', studentNumber: '5', studentName: '홍길동' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('deviceAffiliationId', 'aff-001');
    expect(res.body).toHaveProperty('assignedAt');
  });

  it('실패: studentNumber 누락 → 400', async () => {
    mockActiveDevice();

    const res = await request(app)
      .post('/managed/device-affiliations')
      .set('X-Device-Token', 'valid-tok')
      .send({ schoolId: 'sch-1', gradeId: 'grd-1', classId: 'cls-1' });

    expect(res.status).toBe(400);
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app)
      .post('/managed/device-affiliations')
      .send({ schoolId: 'sch-1', gradeId: 'grd-1', classId: 'cls-1', studentNumber: '5' });

    expect(res.status).toBe(401);
  });
});

describe('GET /managed/device-affiliations/me', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 소속 정보 반환', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({
      rows: [{
        affiliation_id: 'aff-001', student_number: '5',
        school_name: '미어캐치초등학교', grade_name: '1학년', class_name: '1반',
      }],
    });

    const res = await request(app)
      .get('/managed/device-affiliations/me')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('school_name');
  });

  it('실패: 소속 없음 → 404', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .get('/managed/device-affiliations/me')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(404);
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app).get('/managed/device-affiliations/me');
    expect(res.status).toBe(401);
  });
});
