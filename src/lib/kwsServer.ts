/**
 * KWS 백엔드 베이스 URL (공통).
 * - 서버: `.env.local`의 `NEXT_PUBLIC_KWS_BASE_URL` 또는 `KWS_API_BASE_URL`
 * - 변경 시 한 곳만 수정: `NEXT_PUBLIC_KWS_BASE_URL` 권장 (클라이언트 표시와 API 프록시 동일)
 */
export const KWS_BASE_URL_DEFAULT = "http://192.168.0.98:8000";

/** Next.js API 라우트(프록시)에서 백엔드로 요청할 때 */
export function getKwsBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_KWS_BASE_URL ||
    process.env.KWS_API_BASE_URL ||
    KWS_BASE_URL_DEFAULT
  );
}

/** 클라이언트 컴포넌트에서 “원본 API” 미리보기 등 표시용 (NEXT_PUBLIC만 사용) */
export function getPublicKwsBaseUrl(): string {
  return process.env.NEXT_PUBLIC_KWS_BASE_URL || KWS_BASE_URL_DEFAULT;
}
