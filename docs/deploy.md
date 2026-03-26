# reservation - Deployment Guide

## 배포 환경

| 환경 | URL | 설명 |
|------|-----|------|
| Local | http://192.168.0.200 | 로컬 개발 서버 |
| Staging | - | 스테이징 |
| Production | - | 프로덕션 |

## 배포 절차

### 로컬 배포

```powershell
# 이미지 재빌드 후 배포
./scripts/rebuild.ps1

# 서비스 상태 확인
docker compose ps
```

### 프로덕션 배포

1. 환경 변수 확인 (`NODE_ENV=production`)
2. 이미지 빌드
3. `docker compose up -d`
4. 헬스 체크

## Rollback

```bash
# 이전 버전으로 롤백
docker compose down
docker compose up -d --no-build
```

## 체크리스트

- [ ] `.env` 프로덕션 값 설정
- [ ] DB 백업 완료
- [ ] 헬스 체크 통과
- [ ] 로그 모니터링 활성화
