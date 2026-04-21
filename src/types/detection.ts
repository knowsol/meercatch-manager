// Detection API 타입 정의

export interface Detection {
  deviceUuid: string;
  osType: number;
  hardwareName: string | null;
  eventType: number;
  eventUrl: string;
  eventTime: string;
}

export interface EventTypeCount {
  eventType: number;
  totalCount: number;
}

export interface DetectionSearchResponse {
  meta: {
    createAt: string;
    size: number;
    totalCount: number;
    page: number;
    totalPage: number;
  };
  data: Detection[];
  eventTypeCounts: EventTypeCount[];
}

export interface DetectionSearchParams {
  eventType?: string;
  osType?: string;
  searchKeyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
}

// eventType 매핑 (0: 선정성, 1: 도박)
export const EVENT_TYPE_MAP: Record<number, string> = {
  0: '선정성',
  1: '도박',
};

// osType 매핑 (1: Android, 2: iOS, 3: ChromeOS, 4: WhaleOS, 5: Windows)
export const DETECT_OS_TYPE_MAP: Record<number, string> = {
  1: 'Android',
  2: 'iOS',
  3: 'ChromeOS',
  4: 'WhaleOS',
  5: 'Windows',
};

// URL 축약 함수
export function truncateUrl(url: string, maxLength: number = 40): string {
  if (!url || url.length <= maxLength) return url;
  return url.slice(0, maxLength) + '...';
}
