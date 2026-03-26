# Meercatch Spec v1.0

## 1. Overview
본 문서는 미어캐치 애플리케이션의 UI/UX 단순화 및 운영 구조 재정의를 위한 기능 명세입니다.
기존 멀티 플랫폼(Windows, iOS, Android, Chrome) 간 불일치한 사용자 경험을 통합하고, 운영 방식을 "심플형"과 "매니저 관리형"으로 분리하여 구조를 단순화합니다.

## 2. Product Structure

### 2.1 Operation Modes

#### (1) SIMPLE
- 개인/보호자 중심 독립형 사용
- 앱 내 정책 설정 가능
- 탐지 이력 확인 가능

#### (2) MANAGED
- 학교/기관 중심 관리형
- 앱은 최소 기능만 제공
- 관리 기능은 매니저에서 수행

## 3. Core Flow

### 3.1 Installation Flow
1. 앱 설치
2. 앱 실행
3. 운영 방식 선택 (SIMPLE / MANAGED)
4. 초기 설정 진행
5. 디바이스 등록
6. 설정 완료
7. 탐지 시작

### 3.2 Managed Mode Registration Flow
1. 매니저 관리형 선택
2. 학교 선택
3. 학년 선택
4. 반 선택
5. 학생 식별 정보 입력
   - 학생 번호 선택 (필수)
   - 학생 이름 입력 (선택)
6. 디바이스 소속 등록 완료
7. 홈 진입

※ 개인 로그인 없이 디바이스 기반 등록 구조

## 4. Functional Scope

### 4.1 Common
- 앱 설치 및 초기 설정
- 운영 방식 선택
- 디바이스 등록
- 탐지 이벤트 기록
- 탐지 단계별 노티 제공
- 탐지 이력 조회 (최대 100건)
- 오탐 신고 기능

### 4.2 Simple Mode
- 탐지 정책 설정
- 탐지 이력 조회
- 탐지 상세 조회
- 오탐 신고
- 상태 확인

### 4.3 Managed Mode (App)
- 학교/학년/반 선택
- 학생 번호 선택
- 학생 이름 입력
- 디바이스 소속 등록
- 탐지 상태 확인
- 탐지 이력 조회
- 오탐 신고

### 4.4 Manager
- 학년/반 관리
- 반별 탐지 현황 조회
- 학생별 탐지 현황 조회
- 탐지 중단 설정 (학년/반 단위)
- 탐지 중단 해제
- 탐지 중단 이력 관리

## 5. Entity Definition

### 5.1 Device
| 필드 | 설명 |
|------|------|
| deviceId | 디바이스 고유 ID |
| platformType | 플랫폼 종류 |
| osVersion | OS 버전 |
| appVersion | 앱 버전 |
| status | 상태 (ACTIVE/INACTIVE) |
| lastActiveAt | 마지막 활성 시각 |

### 5.2 DeviceAffiliation
| 필드 | 설명 |
|------|------|
| deviceAffiliationId | 소속 ID |
| deviceId | 디바이스 ID |
| schoolId | 학교 ID |
| gradeId | 학년 ID |
| classId | 반 ID |
| studentNumber | 학생 번호 (필수) |
| studentName | 학생 이름 (선택) |
| assignedAt | 등록 시각 |
| status | 상태 |

### 5.3 DetectionEvent
| 필드 | 설명 |
|------|------|
| detectionEventId | 탐지 이벤트 ID |
| deviceId | 디바이스 ID |
| detectedAt | 탐지 시각 |
| detectionType | 탐지 유형 |
| severityLevel | 심각도 |
| notificationLevel | 알림 단계 (GUIDE/CAUTION/WARNING) |
| summary | 요약 |
| isUploaded | 서버 전송 여부 |
| isFalsePositive | 오탐 여부 |

### 5.4 FalsePositiveReport
| 필드 | 설명 |
|------|------|
| reportId | 신고 ID |
| detectionEventId | 탐지 이벤트 ID |
| deviceId | 디바이스 ID |
| reportReason | 신고 사유 |
| note | 비고 |
| reportedAt | 신고 시각 |
| status | 상태 (SUBMITTED/REVIEWED/APPLIED/REJECTED) |

### 5.5 NotificationPolicy
| 필드 | 설명 |
|------|------|
| policyId | 정책 ID |
| modeType | 모드 (SIMPLE/MANAGED) |
| guideThreshold | GUIDE 기준 횟수 |
| cautionThreshold | CAUTION 기준 횟수 |
| warningThreshold | WARNING 기준 횟수 |

### 5.6 DetectionPause
| 필드 | 설명 |
|------|------|
| pauseId | 중단 ID |
| scopeType | 범위 (GRADE/CLASS) |
| scopeId | 범위 대상 ID |
| startAt | 시작 시각 |
| endAt | 종료 시각 |
| reason | 사유 |
| status | 상태 (ACTIVE/EXPIRED/CANCELLED) |

### 5.7 School / Grade / ClassGroup
| 엔티티 | 필드 |
|--------|------|
| School | schoolId, name, status |
| Grade | gradeId, schoolId, name, status |
| ClassGroup | classId, gradeId, name, status |

## 6. API Specification

### 6.1 Installation
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /installations/start | 설치 시작 |
| POST | /installations/select-mode | 모드 선택 |
| POST | /installations/complete | 설치 완료 |

### 6.2 Device
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /devices/register | 디바이스 등록 |
| GET | /devices/me | 내 디바이스 조회 |

### 6.3 Managed Registration
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /managed/schools | 학교 목록 |
| GET | /managed/schools/{schoolId}/grades | 학년 목록 |
| GET | /managed/grades/{gradeId}/classes | 반 목록 |
| POST | /managed/device-affiliations | 소속 등록 |
| GET | /managed/device-affiliations/me | 내 소속 조회 |

**POST /managed/device-affiliations body:**
```json
{
  "schoolId": "string (required)",
  "gradeId": "string (required)",
  "classId": "string (required)",
  "studentNumber": "string (required)",
  "studentName": "string (optional)"
}
```

### 6.4 Detection
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /detections | 탐지 이벤트 등록 |
| GET | /detections?limit=100 | 탐지 이력 조회 |
| GET | /detections/{id} | 탐지 상세 조회 |

### 6.5 False Positive
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /detections/{id}/false-positive | 오탐 신고 |

### 6.6 Manager
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /manager/classes/{classId}/detections | 반별 탐지 현황 |
| GET | /manager/grades/{gradeId}/detections | 학년별 탐지 현황 |
| POST | /manager/classes/{classId}/pause | 반 탐지 중단 |
| POST | /manager/grades/{gradeId}/pause | 학년 탐지 중단 |
| DELETE | /manager/detection-pauses/{id} | 탐지 중단 해제 |

## 7. State Definition

### 7.1 ModeType
- `SIMPLE` — 개인/보호자형
- `MANAGED` — 학교/기관형

### 7.2 NotificationLevel
- `GUIDE` — 안내
- `CAUTION` — 주의
- `WARNING` — 경고

### 7.3 DetectionStatus
- `DETECTED` — 탐지됨
- `NOTIFIED` — 알림 발송
- `ACKNOWLEDGED` — 확인됨

### 7.4 FalsePositiveStatus
- `SUBMITTED` — 제출됨
- `REVIEWED` — 검토 중
- `APPLIED` — 적용됨
- `REJECTED` — 반려됨

### 7.5 DeviceStatus
- `ACTIVE` — 활성
- `INACTIVE` — 비활성

### 7.6 PauseStatus
- `ACTIVE` — 진행 중
- `EXPIRED` — 기간 만료
- `CANCELLED` — 취소됨

## 8. Detection & Notification Logic

### 8.1 Notification Rule
탐지 횟수를 기준으로 단계 결정 (1주일 단위 리셋)

| 단계 | 기준 | 설명 |
|------|------|------|
| `GUIDE` | 1회 | 안내 |
| `CAUTION` | 2회 ~ 4회 | 주의 |
| `WARNING` | 5회 이상 | 경고 |

※ 기준값은 NotificationPolicy 테이블로 관리 (변경 가능)
※ 탐지 횟수 누적 기간: **1주일** (매주 월요일 00:00 초기화)

### 8.2 Detection Flow
1. 탐지 이벤트 발생
2. 로컬 저장
3. 탐지 횟수 누적
4. 단계 계산
5. 노티 표시
6. 이력 반영
7. 일부 데이터 서버 전송

## 9. Data Policy

### 9.1 Local Storage
- 최대 100건 유지
- 초과 시 오래된 데이터 삭제

### 9.2 Server Transmission
서버 전송 데이터 (익명):
- detectionType
- timestamp
- platform
- anonymized source data
- severity

※ 개인정보는 포함하지 않음
※ 서버 보관 기간: **60일** 후 자동 삭제

## 10. False Positive Flow

### 앱 (사용자 신고)
1. 탐지 이력 상세 진입
2. 오탐 신고 선택
3. 사유 입력
4. 서버 전송 → 상태: `SUBMITTED`

### 매니저 (검토)
1. 매니저 웹 **오탐 검토 전용 메뉴** 진입
2. 신고 목록 조회 (SUBMITTED 상태)
3. 상세 내용 확인
4. 검토 결과 처리
   - `APPLIED` — 오탐으로 인정, 탐지 이벤트 무효화
   - `REJECTED` — 오탐 아님으로 반려

## 11. Detection Pause Flow
1. 매니저 설정
2. 범위 선택 (학년/반)
3. 기간 설정
4. 적용
5. 기간 종료 시 자동 해제

## 12. Constraints & Rules
- 디바이스는 하나의 반에만 소속 가능
- 반 변경 시 재등록 필요
- 학생 계정 없음 (디바이스 기반)
- 탐지 이력은 앱 기준 100건 제한
- 서버 전송 데이터는 익명 처리

## 13. Confirmed Decisions

모든 항목 확정 완료.

| # | 항목 | 확정값 |
|---|------|--------|
| 1 | 노티 단계별 횟수 기준 | GUIDE=1회 / CAUTION=2~4회 / WARNING=5회 이상 |
| 2 | 탐지 횟수 누적 기간 | 1주일 리셋 (매주 월요일 00:00 초기화) |
| 3 | 서버 데이터 보관 기간 | 60일 후 자동 삭제 |
| 4 | 오탐 처리 플로우 | 앱 신고 → 매니저 전용 메뉴 검토 → APPLIED/REJECTED |
