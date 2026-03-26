/**
 * tests/falsePositive.test.js
 * Qwen 생성 → Claude 전면 재작성
 * - mock route 제거 → 실제 route 사용
 * - db.query mock 순서 기반으로 미들웨어+라우트 전체 커버
 * - req.device 주입 위해 deviceAuth 미들웨어 체인 mock
 * - 404/409/APPLIED 케이스 정확히 구현
 */
const request = require('supertest');
const express = require('express');

jest.mock('../utils/db', () => ({ query: jest.fn() }));
jest.mock('../utils/token', () => ({
  generateDeviceToken: jest.fn(),
  signManagerToken:    jest.fn(),
  verifyManagerToken:  jest.fn(() => ({ managerId: 'mgr-1', schoolId: 'sch-1', email: 'a@b.com' })),
}));

const db = require('../utils/db');

// ── 공통 헬퍼 ─────────────────────────────────────────────
function mockActiveDevice() {
  db.query
    .mockResolvedValueOnce({ rows: [{ device_id: 'dev-001', mode_type: 'MANAGED', status: 'ACTIVE' }] })
    .mockResolvedValueOnce({ rows: [] }); // last_active_at 업데이트
}

const AUTH = 'Bearer valid-manager-token';

// ── App 구성 ──────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use('/', require('../routes/falsePositive'));

// ─────────────────────────────────────────────────────────
// POST /detections/:id/false-positive
// ─────────────────────────────────────────────────────────
describe('POST /detections/:id/false-positive', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 오탐 신고 → 201 + reportId/status/reportedAt', async () => {
    mockActiveDevice();
    // 탐지 이벤트 소유권 확인 → 존재함
    db.query.mockResolvedValueOnce({ rows: [{ detection_event_id: 'evt-001' }] });
    // 중복 신고 확인 → 없음
    db.query.mockResolvedValueOnce({ rows: [] });
    // INSERT false_positive_reports
    db.query.mockResolvedValueOnce({
      rows: [{ report_id: 'rep-001', status: 'SUBMITTED', reported_at: '2026-03-17T10:00:00.000Z' }],
    });

    const res = await request(app)
      .post('/detections/evt-001/false-positive')
      .set('X-Device-Token', 'valid-tok')
      .send({ reportReason: '정상적인 학습 콘텐츠', note: '교과서 내용' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('reportId', 'rep-001');
    expect(res.body).toHaveProperty('status', 'SUBMITTED');
    expect(res.body).toHaveProperty('reportedAt');
  });

  it('실패: reportReason 없음 → 400', async () => {
    mockActiveDevice();

    const res = await request(app)
      .post('/detections/evt-001/false-positive')
      .set('X-Device-Token', 'valid-tok')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('실패: 탐지 이벤트 없음(소유권 불일치) → 404', async () => {
    mockActiveDevice();
    // 탐지 이벤트 조회 → 없음
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/detections/non-exist/false-positive')
      .set('X-Device-Token', 'valid-tok')
      .send({ reportReason: '오탐입니다' });

    expect(res.status).toBe(404);
  });

  it('실패: 중복 신고 → 409', async () => {
    mockActiveDevice();
    // 탐지 이벤트 조회 → 존재
    db.query.mockResolvedValueOnce({ rows: [{ detection_event_id: 'evt-001' }] });
    // 중복 신고 확인 → 이미 존재
    db.query.mockResolvedValueOnce({ rows: [{ report_id: 'rep-existing' }] });

    const res = await request(app)
      .post('/detections/evt-001/false-positive')
      .set('X-Device-Token', 'valid-tok')
      .send({ reportReason: '또 신고' });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app)
      .post('/detections/evt-001/false-positive')
      .send({ reportReason: '오탐' });

    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────
// GET /false-positives
// ─────────────────────────────────────────────────────────
describe('GET /false-positives', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 오탐 목록 반환 (data + total + page + limit)', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ report_id: 'rep-001', status: 'SUBMITTED', detection_type: 'EXPLICIT' }] })
      .mockResolvedValueOnce({ rows: [{ total: 1 }] });

    const res = await request(app)
      .get('/false-positives')
      .set('Authorization', AUTH);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total', 1);
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('limit', 20);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('성공: status 필터 파라미터 적용', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 0 }] });

    const res = await request(app)
      .get('/false-positives?status=APPLIED&page=2&limit=10')
      .set('Authorization', AUTH);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 2);
    expect(res.body).toHaveProperty('limit', 10);
  });

  it('실패: Authorization 없음 → 401', async () => {
    const res = await request(app).get('/false-positives');
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────
// PATCH /false-positives/:id/review
// ─────────────────────────────────────────────────────────
describe('PATCH /false-positives/:id/review', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: REJECTED 처리 → reportId + status 반환', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ report_id: 'rep-001', status: 'REJECTED', detection_event_id: 'evt-001' }],
      rowCount: 1,
    });

    const res = await request(app)
      .patch('/false-positives/rep-001/review')
      .set('Authorization', AUTH)
      .send({ decision: 'REJECTED', reviewNote: '오탐 아님' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reportId', 'rep-001');
    expect(res.body).toHaveProperty('status', 'REJECTED');
  });

  it('성공: APPLIED 처리 → detection_events 업데이트 호출', async () => {
    db.query
      // UPDATE false_positive_reports
      .mockResolvedValueOnce({
        rows: [{ report_id: 'rep-001', status: 'APPLIED', detection_event_id: 'evt-001' }],
        rowCount: 1,
      })
      // UPDATE detection_events (is_false_positive = TRUE)
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });

    const res = await request(app)
      .patch('/false-positives/rep-001/review')
      .set('Authorization', AUTH)
      .send({ decision: 'APPLIED' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'APPLIED');
    // db.query 2번 호출 확인 (UPDATE report + UPDATE detection_events)
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it('실패: 잘못된 decision → 400', async () => {
    const res = await request(app)
      .patch('/false-positives/rep-001/review')
      .set('Authorization', AUTH)
      .send({ decision: 'INVALID' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('실패: 존재하지 않거나 이미 검토된 신고 → 404', async () => {
    db.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const res = await request(app)
      .patch('/false-positives/non-exist/review')
      .set('Authorization', AUTH)
      .send({ decision: 'APPLIED' });

    expect(res.status).toBe(404);
  });

  it('실패: Authorization 없음 → 401', async () => {
    const res = await request(app)
      .patch('/false-positives/rep-001/review')
      .send({ decision: 'APPLIED' });

    expect(res.status).toBe(401);
  });
});
