# Meercatch 설계 검증 및 구현 단위 분해

## 1. 설계 검증

### 1.1 검증 결과 요약
| 항목 | 상태 | 비고 |
|------|------|------|
| 엔티티 정의 | ✅ 완료 | 7개 엔티티 명확 |
| API 엔드포인트 | ✅ 완료 | 18개 엔드포인트 |
| 상태값 정의 | ✅ 완료 | 6개 상태 enum |
| 인증 구조 | ⚠️ 미정 | 디바이스 기반 — 토큰 방식 명세 필요 |
| 탐지 누적 기준 | ⚠️ 미정 | Open Decision #2 |
| 노티 임계값 | ⚠️ 미정 | Open Decision #1 |
| 매니저 인증 | ⚠️ 미정 | 매니저 로그인 방식 미정의 |

### 1.2 설계 보완 사항
1. **디바이스 인증 토큰** — `POST /devices/register` 응답에 `deviceToken` 발급, 이후 모든 요청 Header에 포함
2. **매니저 인증** — 별도 `POST /manager/auth/login` 엔드포인트 필요
3. **탐지 중단 중 탐지 이벤트 처리** — PauseStatus ACTIVE 시 탐지 이벤트 로컬 저장은 유지, 서버 전송 및 노티만 억제
4. **ClassGroup 명칭** — DB 예약어 충돌 방지를 위해 테이블명 `class_groups` 사용

---

## 2. 폴더 구조

```
workspaces/reservation/
├── apps/
│   ├── api/                          ← Node.js + Express (메인 백엔드)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── server.js                 ← 진입점
│   │   ├── db/
│   │   │   └── init.sql              ← PostgreSQL 스키마 + 초기 데이터
│   │   ├── routes/
│   │   │   ├── installations.js      ← POST /installations/*
│   │   │   ├── devices.js            ← POST|GET /devices/*
│   │   │   ├── managed.js            ← GET|POST /managed/*
│   │   │   ├── detections.js         ← POST|GET /detections/*
│   │   │   ├── falsePositive.js      ← POST /detections/:id/false-positive
│   │   │   └── manager.js            ← GET|POST|DELETE /manager/*
│   │   ├── middleware/
│   │   │   ├── deviceAuth.js         ← deviceToken 검증
│   │   │   └── managerAuth.js        ← 매니저 JWT 검증
│   │   ├── services/
│   │   │   ├── detectionService.js   ← 탐지 단계 계산 로직
│   │   │   ├── notificationService.js← 노티 레벨 결정
│   │   │   └── pauseService.js       ← 탐지 중단 상태 관리
│   │   └── utils/
│   │       ├── db.js                 ← PostgreSQL 연결 풀
│   │       └── token.js              ← 디바이스 토큰 생성/검증
│   │
│   ├── web/                          ← 매니저 대시보드 (Admin Web)
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── server.js
│   │   └── public/
│   │       ├── index.html            ← 매니저 로그인
│   │       ├── dashboard.html        ← 반별/학년별 탐지 현황
│   │       └── assets/
│   │
│   └── admin/                        ← 내부 운영 어드민
│       ├── Dockerfile
│       ├── package.json
│       ├── server.js
│       └── public/
│           ├── index.html
│           └── assets/
│
├── docs/
│   ├── spec.md                       ← 원본 기능 명세
│   └── design.md                     ← 본 설계 문서
│
├── docker-compose.yml                ← web + api + admin + db
├── .env                              ← 포트/DB 환경변수
└── scripts/
    └── db-migrate.sh                 ← DB 초기화 스크립트
```

---

## 3. API 스펙 정리

### 인증 구조
```
디바이스 → deviceToken (register 시 발급, Header: X-Device-Token)
매니저   → JWT Bearer Token (login 시 발급, Header: Authorization)
```

### 3.1 Installation
| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| POST | /installations/start | - | `{ platformType, osVersion, appVersion }` | `{ installationId }` |
| POST | /installations/select-mode | - | `{ installationId, modeType }` | `{ ok }` |
| POST | /installations/complete | - | `{ installationId }` | `{ ok }` |

### 3.2 Device
| Method | Endpoint | Auth | Request Body | Response |
|--------|----------|------|-------------|----------|
| POST | /devices/register | - | `{ platformType, osVersion, appVersion }` | `{ deviceId, deviceToken }` |
| GET | /devices/me | deviceToken | - | `{ deviceId, platformType, status, lastActiveAt }` |

### 3.3 Managed Registration
| Method | Endpoint | Auth | 설명 |
|--------|----------|------|------|
| GET | /managed/schools | deviceToken | 학교 목록 |
| GET | /managed/schools/:schoolId/grades | deviceToken | 학년 목록 |
| GET | /managed/grades/:gradeId/classes | deviceToken | 반 목록 |
| POST | /managed/device-affiliations | deviceToken | 소속 등록 |
| GET | /managed/device-affiliations/me | deviceToken | 내 소속 조회 |

**POST /managed/device-affiliations**
```json
Request:  { "schoolId", "gradeId", "classId", "studentNumber", "studentName?" }
Response: { "deviceAffiliationId", "assignedAt" }
```

### 3.4 Detection
| Method | Endpoint | Auth | 설명 |
|--------|----------|------|------|
| POST | /detections | deviceToken | 탐지 이벤트 등록 |
| GET | /detections?limit=100 | deviceToken | 탐지 이력 조회 |
| GET | /detections/:id | deviceToken | 탐지 상세 조회 |

**POST /detections**
```json
Request: {
  "detectionType": "string",
  "detectedAt": "ISO8601",
  "severityLevel": "string",
  "summary": "string"
}
Response: {
  "detectionEventId": "string",
  "notificationLevel": "GUIDE | CAUTION | WARNING"
}
```

### 3.5 False Positive
| Method | Endpoint | Auth | 설명 |
|--------|----------|------|------|
| POST | /detections/:id/false-positive | deviceToken | 오탐 신고 |

```json
Request:  { "reportReason": "string", "note?": "string" }
Response: { "reportId", "status": "SUBMITTED" }
```

### 3.6 Manager
| Method | Endpoint | Auth | 설명 |
|--------|----------|------|------|
| POST | /manager/auth/login | - | 매니저 로그인 |
| GET | /manager/classes/:classId/detections | managerJWT | 반별 탐지 현황 |
| GET | /manager/grades/:gradeId/detections | managerJWT | 학년별 탐지 현황 |
| POST | /manager/classes/:classId/pause | managerJWT | 반 탐지 중단 |
| POST | /manager/grades/:gradeId/pause | managerJWT | 학년 탐지 중단 |
| DELETE | /manager/detection-pauses/:id | managerJWT | 탐지 중단 해제 |

---

## 4. DB 스키마 (PostgreSQL)

```sql
-- 학교/학년/반
schools (school_id, name, status)
grades (grade_id, school_id, name, status)
class_groups (class_id, grade_id, name, status)

-- 디바이스
devices (device_id, platform_type, os_version, app_version, device_token, status, last_active_at)
device_affiliations (affiliation_id, device_id, school_id, grade_id, class_id, student_number, student_name, assigned_at, status)

-- 탐지
detection_events (detection_event_id, device_id, detected_at, detection_type, severity_level, notification_level, summary, is_uploaded, is_false_positive)
false_positive_reports (report_id, detection_event_id, device_id, report_reason, note, reported_at, status)

-- 정책/중단
notification_policies (policy_id, mode_type, guide_threshold, caution_threshold, warning_threshold)
detection_pauses (pause_id, scope_type, scope_id, start_at, end_at, reason, status)

-- 매니저
managers (manager_id, school_id, email, password_hash, created_at)
```

---

## 5. 구현 작업 리스트

### Phase 1 — 인프라 & DB (우선순위 최상)
- [ ] **T-01** `docker-compose.yml` db 서비스 활성화 (PostgreSQL)
- [ ] **T-02** `apps/api/db/init.sql` 작성 — 전체 스키마 생성
- [ ] **T-03** `apps/api/utils/db.js` — PostgreSQL 연결 풀 (pg 모듈)
- [ ] **T-04** 초기 데이터 시딩 — schools / grades / class_groups 샘플 데이터

### Phase 2 — 디바이스 & 설치 (핵심 플로우)
- [ ] **T-05** `routes/devices.js` — POST /devices/register (deviceToken 발급)
- [ ] **T-06** `routes/devices.js` — GET /devices/me
- [ ] **T-07** `utils/token.js` — deviceToken 생성/검증 유틸
- [ ] **T-08** `middleware/deviceAuth.js` — X-Device-Token 검증 미들웨어
- [ ] **T-09** `routes/installations.js` — start / select-mode / complete

### Phase 3 — Managed 등록 플로우
- [ ] **T-10** `routes/managed.js` — GET /managed/schools
- [ ] **T-11** `routes/managed.js` — GET /managed/schools/:id/grades
- [ ] **T-12** `routes/managed.js` — GET /managed/grades/:id/classes
- [ ] **T-13** `routes/managed.js` — POST /managed/device-affiliations (단일 반 제약 검증 포함)
- [ ] **T-14** `routes/managed.js` — GET /managed/device-affiliations/me

### Phase 4 — 탐지 이벤트
- [ ] **T-15** `services/notificationService.js` — 탐지 횟수 누적 및 단계 계산
- [ ] **T-16** `services/pauseService.js` — 탐지 중단 상태 확인
- [ ] **T-17** `routes/detections.js` — POST /detections (단계 계산 + pause 체크)
- [ ] **T-18** `routes/detections.js` — GET /detections?limit=100
- [ ] **T-19** `routes/detections.js` — GET /detections/:id

### Phase 5 — 오탐 신고
- [ ] **T-20** `routes/falsePositive.js` — POST /detections/:id/false-positive (앱 → 서버 신고)
- [ ] **T-21** `routes/falsePositive.js` — GET /false-positives (매니저 목록 조회)
- [ ] **T-22** `routes/falsePositive.js` — PATCH /false-positives/:id/review (매니저 검토 처리)

### Phase 6 — 매니저
- [ ] **T-23** `routes/manager.js` — POST /manager/auth/login (JWT 발급)
- [ ] **T-24** `middleware/managerAuth.js` — Bearer JWT 검증
- [ ] **T-25** `routes/manager.js` — GET 반별/학년별 탐지 현황
- [ ] **T-26** `routes/manager.js` — POST 탐지 중단 (학년/반)
- [ ] **T-27** `routes/manager.js` — DELETE 탐지 중단 해제
- [ ] **T-28** `services/pauseService.js` — 기간 만료 자동 처리 (매주 월요일 00:00 리셋 기준)

### Phase 7 — 매니저 웹 UI
- [ ] **T-29** `apps/web/public/index.html` — 매니저 로그인 페이지
- [ ] **T-30** `apps/web/public/dashboard.html` — 탐지 현황 대시보드 (반별/학년별)
- [ ] **T-31** `apps/web/public/false-positive.html` — 오탐 검토 전용 메뉴
- [ ] **T-32** 탐지 중단 설정 UI

### Phase 8 — 정책 설정 (확정값 반영)
- [ ] **T-33** `notification_policies` 초기값 삽입 (GUIDE=1, CAUTION_MIN=2, CAUTION_MAX=4, WARNING=5)
- [ ] **T-34** DB 데이터 보관 60일 자동 삭제 cron 또는 트리거 설정

---

## 6. Confirmed Decisions (확정)

| # | 항목 | 확정값 | 영향 태스크 |
|---|------|--------|------------|
| ✅ OD-1 | 노티 단계별 횟수 기준 | GUIDE=1회 / CAUTION=2~4회 / WARNING=5회 이상 | T-15, T-33 |
| ✅ OD-2 | 탐지 횟수 누적 기간 | **1주일 리셋** (매주 월요일 00:00 초기화) | T-15, T-28 |
| ✅ OD-3 | 서버 데이터 보관 기간 | **60일** 후 자동 삭제 | T-34 |
| ✅ OD-4 | 오탐 처리 플로우 | 앱 신고 → **매니저 전용 오탐 검토 메뉴** → APPLIED/REJECTED | T-20~T-22, T-31 |
