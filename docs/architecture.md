# reservation - Architecture

## Overview

> 이 문서는 `reservation` workspace의 아키텍처를 설명합니다.

## Services

| 서비스 | 포트 | 설명 |
|--------|------|------|
| web    | 3000 | 사용자 프론트엔드 |
| api    | 4000 | 백엔드 API 서버 |
| admin  | 8080 | 관리자 패널 |

## Tech Stack

- **Frontend (web)**:
- **Admin**:
- **Backend (api)**:
- **Database**:
- **Container**: Docker + docker-compose

## Network

모든 서비스는 `ai-dev-network` Docker 네트워크를 통해 통신합니다.

```
[Client]
   │
   ▼
[Gateway :80/:443]
   │
   ├── /       → web  :3000
   ├── /api    → api  :4000
   └── /admin  → admin :8080
```

## Data Flow

```
web ──HTTP──▶ api ──▶ database
admin ──HTTP──▶ api ──▶ database
```
