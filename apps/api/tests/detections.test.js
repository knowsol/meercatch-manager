/**
 * tests/detections.test.js
 * Qwen 생성 → Claude 검토 수정
 * - controller 패턴 제거 → route 직접 테스트
 * - db.query mock으로 미들웨어+라우트 전체 커버
 * - notificationService, pauseService mock 구조 수정
 */
const request = require('supertest');
const express = require('express');

// ── Mock 설정 ─────────────────────────────────────────────
jest.mock('../utils/db', () => ({ query: jest.fn() }));
jest.mock('../utils/token', () => ({
  generateDeviceToken: jest.fn(() => 'tok'),
  signManagerToken:    jest.fn(),
  verifyManagerToken:  jest.fn(),
}));
jest.mock('../services/notificationService', () => ({
  calculateNotificationLevel: jest.fn().mockResolvedValue('GUIDE'),
}));
jest.mock('../services/pauseService', () => ({
  isPaused:        jest.fn().mockResolvedValue(false),
  expireOldPauses: jest.fn().mockResolvedValue(0),
}));

const db = require('../utils/db');

// ── 공통 deviceAuth mock 헬퍼 ──────────────────────────────
function mockActiveDevice() {
  db.query.mockResolvedValueOnce({
    rows: [{ device_id: 'dev-uuid-001', mode_type: 'MANAGED', status: 'ACTIVE' }],
  });
  // last_active_at 업데이트 (fire-and-forget)
  db.query.mockResolvedValueOnce({ rows: [] });
}

// ── App 구성 ──────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use('/detections', require('../routes/detections'));

// ── 테스트 ────────────────────────────────────────────────
describe('POST /detections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: detectionEventId와 notificationLevel 반환', async () => {
    mockActiveDevice();
    // affiliation 조회 (MANAGED 모드 pause 체크용)
    db.query.mockResolvedValueOnce({ rows: [{ class_id: 'cls-1', grade_id: 'grd-1' }] });
    // INSERT detection_events
    db.query.mockResolvedValueOnce({ rows: [{ detection_event_id: 'evt-uuid-001' }] });

    const res = await request(app)
      .post('/detections')
      .set('X-Device-Token', 'valid-tok')
      .send({
        detectionType: 'EXPLICIT_CONTENT',
        detectedAt:    '2026-03-17T10:00:00Z',
        severityLevel: 'HIGH',
        summary:       '유해 콘텐츠',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('detectionEventId', 'evt-uuid-001');
    expect(res.body).toHaveProperty('notificationLevel', 'GUIDE');
    expect(res.body).toHaveProperty('paused', false);
  });

  it('실패: 필수 필드 누락 → 400', async () => {
    mockActiveDevice();

    const res = await request(app)
      .post('/detections')
      .set('X-Device-Token', 'valid-tok')
      .send({ detectionType: 'EXPLICIT_CONTENT' }); // detectedAt, severityLevel 누락

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app)
      .post('/detections')
      .send({ detectionType: 'X', detectedAt: '2026-01-01T00:00:00Z', severityLevel: 'LOW' });

    expect(res.status).toBe(401);
  });
});

describe('GET /detections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 탐지 이력 배열 반환', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({
      rows: [
        { detection_event_id: 'e1', detection_type: 'EXPLICIT_CONTENT', notification_level: 'GUIDE' },
        { detection_event_id: 'e2', detection_type: 'ADULT_CONTENT',    notification_level: 'CAUTION' },
      ],
    });

    const res = await request(app)
      .get('/detections?limit=10')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it('실패: 토큰 없음 → 401', async () => {
    const res = await request(app).get('/detections');
    expect(res.status).toBe(401);
  });
});

describe('GET /detections/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('성공: 탐지 이벤트 상세 반환', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({
      rows: [{
        detection_event_id: 'evt-uuid-001',
        detection_type:     'EXPLICIT_CONTENT',
        notification_level: 'GUIDE',
        is_false_positive:  false,
      }],
    });

    const res = await request(app)
      .get('/detections/evt-uuid-001')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('detection_event_id', 'evt-uuid-001');
  });

  it('실패: 존재하지 않는 ID → 404', async () => {
    mockActiveDevice();
    db.query.mockResolvedValueOnce({ rows: [] }); // 결과 없음

    const res = await request(app)
      .get('/detections/non-existent-id')
      .set('X-Device-Token', 'valid-tok');

    expect(res.status).toBe(404);
  });
});
