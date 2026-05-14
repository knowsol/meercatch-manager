// License API 타입 정의

/** 라이선스 API(`/license`) 한 건 — 대시보드용 `License`(index.ts)과 구분 */
export interface LicenseApi {
  licenseId: number;
  licenseKey: string;
  osType: number;
  detectType: string;
  maxCount: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
}

export interface LicenseSearchResponse {
  meta: {
    createAt: string;
    totalCount: number;
    page: number;
    totalPage: number;
  };
  data: LicenseApi[];
  totalCount: number;
  usedCount: number;
  userCount: number;
}

export interface LicenseSearchParams {
  page?: number;
  size?: number;
  sort?: string[];
}

// OS 타입 매핑
export const OS_TYPE_MAP: Record<number, string> = {
  1: 'Android',
  2: 'iOS',
  3: 'WhaleBook',
  4: 'ChromeBook',
  5: 'Windows',
};

/** detectType 앞 2자리: [0]=선정성, [1]=도박 (예: "11000000" → 둘 다 활성) */
export function parseDetectTypeFlags(detectType: string | undefined): {
  adult: boolean;
  gambling: boolean;
} {
  const s = detectType ?? '';
  return {
    adult: s.charAt(0) === '1',
    gambling: s.charAt(1) === '1',
  };
}

// 탐지 타입 표시 문자열 (10… → 선정성, 01… → 도박, 11… → "선정성, 도박")
export function parseDetectType(detectType: string): string {
  const { adult, gambling } = parseDetectTypeFlags(detectType);
  const parts: string[] = [];
  if (adult) parts.push('선정성');
  if (gambling) parts.push('도박');
  if (parts.length === 0) return '알 수 없음';
  return parts.join(', ');
}
