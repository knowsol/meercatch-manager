# MeerCatch Manager API 명세서

## 개요

이 문서는 MeerCatch Manager 프론트엔드에서 필요한 백엔드 API 목록입니다.  
**Base URL**: `{NEXT_PUBLIC_API_URL}/api` (기본값: `http://localhost:8080/api`)

---

## 인증 (Auth)

| Method | Endpoint | 설명 | Request Body | Response |
|--------|----------|------|--------------|----------|
| POST | `/auth/login` | 로그인 | `{ username, password }` | `{ token, user: { userId, name, role, ... } }` |
| POST | `/auth/logout` | 로그아웃 | - | `{ success: true }` |
| GET | `/auth/me` | 현재 사용자 정보 | - | `{ userId, name, role, ... }` |
| POST | `/auth/password` | 비밀번호 변경 | `{ currentPassword, newPassword }` | `{ success: true }` |

---

## 대시보드 (Dashboard)

| Method | Endpoint | 설명 | Query Params | Response |
|--------|----------|------|--------------|----------|
| GET | `/dashboard/stats` | 대시보드 통계 | - | `{ totalGroups, totalDevices, onlineDevices, todayDetections, weeklyDetections, activePauses, ... }` |
| GET | `/dashboard/recent-detections` | 최근 탐지 (5건) | `limit?` | `[{ detId, detectedAt, type, deviceName, status, ... }]` |
| GET | `/dashboard/active-pauses` | 활성 탐지 중단 | - | `[{ pauseId, groupId, pauseType, requester, endAt, ... }]` |
| GET | `/dashboard/license-summary` | 라이선스 요약 | - | `{ total, used, percentage, licenses: [...] }` |

---

## 단말기 (Devices)

| Method | Endpoint | 설명 | Query/Body | Response |
|--------|----------|------|------------|----------|
| GET | `/devices` | 단말 목록 | `?search=&groupId=&status=` | `{ data: [...], total, page, pageSize }` |
| GET | `/devices/:id` | 단말 상세 | - | `{ deviceId, name, identifier, groupId, os, model, status, lastContact, ... }` |
| POST | `/devices` | 단말 등록 | `{ name, identifier, groupId, ... }` | `{ deviceId, ... }` |
| PUT | `/devices/:id` | 단말 수정 | `{ name, groupId, ... }` | `{ deviceId, ... }` |
| DELETE | `/devices/:id` | 단말 삭제 | - | `{ success: true }` |

---

## 탐지 (Detections)

| Method | Endpoint | 설명 | Query/Body | Response |
|--------|----------|------|------------|----------|
| GET | `/detections` | 탐지 목록 | `?type=&search=&date=&page=&pageSize=` | `{ data: [...], total }` |
| GET | `/detections/:id` | 탐지 상세 | - | `{ detId, detectedAt, type, deviceId, deviceName, groupId, policy, status, content, thumb, ... }` |
| PATCH | `/detections/:id/status` | 탐지 상태 변경 | `{ status: 'confirmed'|'dismissed'|'reviewing' }` | `{ detId, status, ... }` |
| GET | `/detections/stats` | 탐지 통계 | `?period=` | `{ total, byType: { 선정성, 도박 }, byStatus: { ... } }` |

---

## 그룹 (Groups)

| Method | Endpoint | 설명 | Query/Body | Response |
|--------|----------|------|------------|----------|
| GET | `/groups` | 그룹 목록 | `?search=&schoolType=&status=` | `{ data: [...], total }` |
| GET | `/groups/:id` | 그룹 상세 | - | `{ groupId, name, schoolId, deviceCount, policyCount, pauseStatus, status, ... }` |
| POST | `/groups` | 그룹 생성 | `{ name, schoolId, ... }` | `{ groupId, ... }` |
| PUT | `/groups/:id` | 그룹 수정 | `{ name, ... }` | `{ groupId, ... }` |
| DELETE | `/groups/:id` | 그룹 삭제 | - | `{ success: true }` |
| GET | `/groups/:id/devices` | 그룹 소속 단말 | - | `[{ deviceId, name, ... }]` |
| GET | `/groups/:id/policies` | 그룹 적용 정책 | - | `[{ policyId, name, type, ... }]` |

---

## 정책 (Policies)

| Method | Endpoint | 설명 | Query/Body | Response |
|--------|----------|------|------------|----------|
| GET | `/policies` | 정책 목록 | `?type=&search=&active=` | `{ data: [...], total }` |
| GET | `/policies/:id` | 정책 상세 | - | `{ policyId, name, desc, type, detectionItems, exceptions, active, appliedCount, ... }` |
| POST | `/policies` | 정책 생성 | `{ name, desc, type, detectionItems?, grade?, exceptions, ... }` | `{ policyId, ... }` |
| PUT | `/policies/:id` | 정책 수정 | `{ name, desc, ... }` | `{ policyId, ... }` |
| DELETE | `/policies/:id` | 정책 삭제 | - | `{ success: true }` |
| PATCH | `/policies/:id/toggle` | 활성/비활성 토글 | - | `{ policyId, active, ... }` |

---

## 사용자/직원 (Users)

| Method | Endpoint | 설명 | Query/Body | Response |
|--------|----------|------|------------|----------|
| GET | `/users` | 사용자 목록 | `?search=&role=&status=` | `{ data: [...], total }` |
| GET | `/users/:id` | 사용자 상세 | - | `{ userId, name, username, role, contact, status, assignments, lastLogin, ... }` |
| POST | `/users` | 사용자 등록 | `{ name, username, password, role, contact, assignments }` | `{ userId, ... }` |
| PUT | `/users/:id` | 사용자 수정 | `{ name, contact, role, assignments, status }` | `{ userId, ... }` |
| DELETE | `/users/:id` | 사용자 삭제 | - | `{ success: true }` |

---

## 탐지 중단 (Pauses)

| Method | Endpoint | 설명 | Query/Body | Response |
|--------|----------|------|------------|----------|
| GET | `/pauses` | 탐지 중단 목록 | `?status=` | `{ data: [...], total }` |
| GET | `/pauses/:id` | 중단 상세 | - | `{ pauseId, groupId, pauseType, requester, requesterRole, startAt, endAt, status, reason, cancelReason, ... }` |
| POST | `/pauses` | 중단 생성 | `{ groupId, pauseType, startAt, endAt, reason }` | `{ pauseId, ... }` |
| PATCH | `/pauses/:id/cancel` | 중단 해제(취소) | `{ cancelReason }` | `{ pauseId, status: 'CANCELLED', ... }` |
| GET | `/pauses/history` | 중단 이력 | `?search=&schoolType=&status=` | `{ data: [...], total }` |

---

## 라이선스 (Licenses)

| Method | Endpoint | 설명 | Query/Body | Response |
|--------|----------|------|------------|----------|
| GET | `/licenses` | 라이선스 목록 | `?os=&search=` | `{ data: [...], total }` |
| GET | `/licenses/:id` | 라이선스 상세 | - | `{ os, detectionType, devices, usedDevices, validFrom, validTo, status, serialKey, school, ... }` |
| POST | `/licenses/:id/sync` | 라이선스 동기화 | - | `{ success: true, lastSync }` |
| GET | `/licenses/summary` | 라이선스 요약 | - | `{ total, used, remaining, items: [...] }` |

---

## 학교 (Schools)

| Method | Endpoint | 설명 | Query | Response |
|--------|----------|------|-------|----------|
| GET | `/schools` | 학교 목록 | `?type=&status=` | `[{ schoolId, name, type, status, address }]` |
| GET | `/schools/:id` | 학교 상세 | - | `{ schoolId, name, type, status, address, ... }` |

---

## 알림 설정 (Notifications)

| Method | Endpoint | 설명 | Body | Response |
|--------|----------|------|------|----------|
| GET | `/notifications/settings` | 알림 설정 조회 | - | `{ emailEnabled, emailAddress, smsEnabled, smsNumber, detectionAlert, dailyReport, weeklyReport, pauseAlert, alertThreshold, notiType }` |
| PUT | `/notifications/settings` | 알림 설정 저장 | `{ emailEnabled, emailAddress, ... }` | `{ success: true }` |
| POST | `/notifications/test` | 테스트 알림 발송 | `{ type: 'email'|'sms' }` | `{ success: true }` |

---

## 내 계정 (Account)

| Method | Endpoint | 설명 | Body | Response |
|--------|----------|------|------|----------|
| GET | `/account/profile` | 내 프로필 조회 | - | `{ userId, name, username, contact, role, ... }` |
| PUT | `/account/profile` | 프로필 수정 | `{ name, contact }` | `{ success: true }` |
| POST | `/account/password` | 비밀번호 변경 | `{ currentPassword, newPassword }` | `{ success: true }` |

---

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": { ... }
}
```

### 목록 응답 (페이지네이션)
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다."
  }
}
```

---

## 인증 헤더

모든 API 요청(로그인 제외)에는 다음 헤더가 필요합니다:

```
Authorization: Bearer {token}
```

---

## 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| UNAUTHORIZED | 401 | 인증 필요 또는 토큰 만료 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |

---

## 페이지별 필요 API 요약

| 페이지 | GET (조회) | POST/PUT/PATCH/DELETE (변경) |
|--------|-----------|------------------------------|
| 로그인 | - | `POST /auth/login` |
| 대시보드 | `stats`, `recent-detections`, `active-pauses`, `license-summary` | - |
| 단말기 | `devices`, `devices/:id` | `POST`, `PUT`, `DELETE devices` |
| 탐지 | `detections`, `detections/:id`, `detections/stats` | `PATCH detections/:id/status` |
| 그룹 | `groups`, `groups/:id`, `groups/:id/devices`, `groups/:id/policies` | `POST`, `PUT`, `DELETE groups` |
| 정책 | `policies`, `policies/:id` | `POST`, `PUT`, `DELETE`, `PATCH toggle` |
| 직원 | `users`, `users/:id` | `POST`, `PUT`, `DELETE users` |
| 탐지 중단 | `pauses`, `pauses/:id`, `pauses/history` | `POST pauses`, `PATCH cancel` |
| 라이선스 | `licenses`, `licenses/:id`, `licenses/summary` | `POST sync` |
| 알림 설정 | `notifications/settings` | `PUT settings`, `POST test` |
| 내 계정 | `account/profile` | `PUT profile`, `POST password` |

---

**작성일**: 2026-04-21  
**버전**: 1.0.0
