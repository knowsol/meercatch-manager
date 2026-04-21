// Account API 타입 정의 (백엔드 Swagger 기반)

export interface PermissionInfo {
  permissionId: number;
  permissionCode: string;
  permissionName: string;
  description: string;
  permissionLevel: number;
  activeYn: string;
}

export type AccountRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER';

export interface Account {
  accountId: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  phoneNo: string;
  role: AccountRole;
  permissionInfo: PermissionInfo;
  lastLoginAt: string;
  activeYn: string;
}

// API 공통 메타 정보 (페이지네이션)
export interface PaginationMeta {
  createAt: string;
  size: number;
  totalCount: number;
  page: number;
  totalPage: number;
}

// Account 목록 검색 응답
export interface AccountSearchResponse {
  meta: PaginationMeta;
  data: Account[];
}

// Account 검색 요청 Body
export interface AccountSearchRequest {
  page?: number;
  size?: number;
  keyword?: string;
  role?: AccountRole | '';
  activeYn?: 'Y' | 'N' | '';
}
