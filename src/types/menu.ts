// ============================================
// Menu Types
// ============================================

export interface Menu {
  id: number;
  title: string;
  path: string;
  icon: string | null;
  sortingOrder: number;
}

export interface MenuRegisterRequest {
  title: string;
  path: string;
  icon?: string;
  sortingOrder: number;
}

export interface MenuUpdateRequest {
  menuId: number;
  title?: string;
  path?: string;
  icon?: string;
  sortingOrder?: number;
}

export interface MyMenuRequest {
  permissionId: number;
}

export interface MenuDeleteRequest {
  menuId: number;
}

export interface MenuApiResponse<T> {
  meta: {
    createdAt: string;
  };
  data: T;
}

export interface MenuListResponse {
  meta: {
    createdAt: string;
    size: number;
  };
  data: Menu[];
}

export interface MyMenuResponse {
  meta: {
    createdAt: string;
    size: number;
  };
  data: Menu[];
}
