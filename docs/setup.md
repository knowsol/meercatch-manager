# reservation - Setup Guide

## 사전 요구사항

- Docker Desktop 설치
- WSL2 활성화
- `ai-dev-network` Docker 네트워크 존재

## 초기 설정

### 1. 네트워크 확인

```bash
docker network ls | grep ai-dev-network
# 없으면 생성:
docker network create ai-dev-network
```

### 2. 환경 변수 설정

```bash
cp env/.env.example .env
# .env 파일을 편집하여 실제 값 입력
```

### 3. 서비스 시작

```powershell
./scripts/start.ps1
```

또는 직접:

```bash
docker compose up -d
```

### 4. 동작 확인

- Web:   http://192.168.0.200:3000
- API:   http://192.168.0.200:4000
- Admin: http://192.168.0.200:8080

## 개발 워크플로우

```powershell
# 시작
./scripts/start.ps1

# 로그 확인
./scripts/logs.ps1

# 컨테이너 재빌드
./scripts/rebuild.ps1

# DB 초기화
./scripts/reset-db.ps1
```
