// License API 타입 정의

export interface License {
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
  data: License[];
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
  3: 'Windows',
  4: 'ChromeBook',
  5: 'WhaleBook',
};

// 탐지 타입 파싱 (detectType: "10" → 선정성, "01" → 도박, "11" → All-in-One)
export function parseDetectType(detectType: string): string {
  if (detectType === '11') return 'All-in-One';
  if (detectType?.charAt(0) === '1') return '선정성';
  if (detectType?.charAt(1) === '1') return '도박';
  return '알 수 없음';
}
