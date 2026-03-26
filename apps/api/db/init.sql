-- ============================================================
-- Meercatch DB Schema
-- PostgreSQL 16
-- ============================================================

-- ── Schools / Grades / Classes ────────────────────────────
CREATE TABLE IF NOT EXISTS schools (
  school_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grades (
  grade_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  name        VARCHAR(50)  NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_groups (
  class_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id    UUID NOT NULL REFERENCES grades(grade_id) ON DELETE CASCADE,
  name        VARCHAR(50)  NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Devices ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS devices (
  device_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_type  VARCHAR(20)  NOT NULL,  -- ios / android / windows / chrome
  os_version     VARCHAR(50),
  app_version    VARCHAR(20),
  device_token   VARCHAR(256) NOT NULL UNIQUE,
  mode_type      VARCHAR(20)  NOT NULL DEFAULT 'SIMPLE', -- SIMPLE / MANAGED
  status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  last_active_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_affiliations (
  affiliation_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id       UUID NOT NULL REFERENCES devices(device_id),
  school_id       UUID NOT NULL REFERENCES schools(school_id),
  grade_id        UUID NOT NULL REFERENCES grades(grade_id),
  class_id        UUID NOT NULL REFERENCES class_groups(class_id),
  student_number  VARCHAR(10)  NOT NULL,
  student_name    VARCHAR(50),
  assigned_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
  UNIQUE (device_id) -- 디바이스는 하나의 반에만 소속
);

-- ── Detection Events ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS detection_events (
  detection_event_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id           UUID NOT NULL REFERENCES devices(device_id),
  detected_at         TIMESTAMPTZ  NOT NULL,
  detection_type      VARCHAR(50)  NOT NULL,
  severity_level      VARCHAR(20)  NOT NULL,
  notification_level  VARCHAR(20)  NOT NULL,  -- GUIDE / CAUTION / WARNING
  summary             TEXT,
  is_uploaded         BOOLEAN NOT NULL DEFAULT FALSE,
  is_false_positive   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_detection_events_device_id
  ON detection_events(device_id);
CREATE INDEX IF NOT EXISTS idx_detection_events_detected_at
  ON detection_events(detected_at);

-- ── False Positive Reports ────────────────────────────────
CREATE TABLE IF NOT EXISTS false_positive_reports (
  report_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detection_event_id  UUID NOT NULL REFERENCES detection_events(detection_event_id),
  device_id           UUID NOT NULL REFERENCES devices(device_id),
  report_reason       TEXT NOT NULL,
  note                TEXT,
  reported_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at         TIMESTAMPTZ,
  reviewed_by         UUID,  -- manager_id
  status              VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',  -- SUBMITTED/REVIEWED/APPLIED/REJECTED
  UNIQUE (detection_event_id)  -- 탐지 이벤트당 1건 신고
);

-- ── Notification Policies ─────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_policies (
  policy_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode_type          VARCHAR(20) NOT NULL UNIQUE,  -- SIMPLE / MANAGED
  guide_threshold    INT NOT NULL DEFAULT 1,
  caution_min        INT NOT NULL DEFAULT 2,
  caution_max        INT NOT NULL DEFAULT 4,
  warning_threshold  INT NOT NULL DEFAULT 5,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Detection Pauses ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS detection_pauses (
  pause_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type  VARCHAR(10) NOT NULL,  -- GRADE / CLASS
  scope_id    UUID NOT NULL,
  start_at    TIMESTAMPTZ NOT NULL,
  end_at      TIMESTAMPTZ NOT NULL,
  reason      TEXT,
  status      VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE / EXPIRED / CANCELLED
  created_by  UUID,  -- manager_id
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_detection_pauses_scope
  ON detection_pauses(scope_type, scope_id, status);

-- ── Managers ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS managers (
  manager_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id      UUID NOT NULL REFERENCES schools(school_id),
  email          VARCHAR(100) NOT NULL UNIQUE,
  password_hash  VARCHAR(256) NOT NULL,
  name           VARCHAR(50),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Installations (임시 상태 추적) ───────────────────────
CREATE TABLE IF NOT EXISTS installations (
  installation_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode_type        VARCHAR(20),
  status           VARCHAR(20) NOT NULL DEFAULT 'STARTED',  -- STARTED / MODE_SELECTED / COMPLETED
  platform_type    VARCHAR(20),
  os_version       VARCHAR(50),
  app_version      VARCHAR(20),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Seed Data
-- ============================================================

-- 정책 초기값 (확정된 OD-1 기준)
INSERT INTO notification_policies (mode_type, guide_threshold, caution_min, caution_max, warning_threshold)
VALUES
  ('SIMPLE',  1, 2, 4, 5),
  ('MANAGED', 1, 2, 4, 5)
ON CONFLICT (mode_type) DO NOTHING;

-- 샘플 학교/학년/반 데이터
INSERT INTO schools (school_id, name) VALUES
  ('11111111-0000-0000-0000-000000000001', '미어캐치초등학교'),
  ('11111111-0000-0000-0000-000000000002', '미어캐치중학교')
ON CONFLICT DO NOTHING;

INSERT INTO grades (grade_id, school_id, name) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '1학년'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '2학년'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', '3학년'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', '1학년'),
  ('22222222-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000002', '2학년')
ON CONFLICT DO NOTHING;

INSERT INTO class_groups (class_id, grade_id, name) VALUES
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '1반'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001', '2반'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002', '1반'),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002', '2반'),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003', '1반'),
  ('33333333-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000004', '1반'),
  ('33333333-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000005', '1반')
ON CONFLICT DO NOTHING;

-- 샘플 매니저 (password: manager1234)
INSERT INTO managers (school_id, email, password_hash, name) VALUES
  ('11111111-0000-0000-0000-000000000001',
   'admin@meercatch.com',
   '$2a$10$rQJ7rQdHqgFvQ8K9mZn3ruEOhU6rS8Z5F3NpKqD7T2w1vXlMoGpUe',
   '관리자')
ON CONFLICT DO NOTHING;
