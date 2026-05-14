// ============================================
// Menu Types
// ============================================

export interface Menu {
  id: number;
  title: string;
  path: string;
  icon: string | null;
  parentId: number | null;
  depth: number;
  sortingOrder: number;
  children?: Menu[];
}

export interface MenuRegisterRequest {
  title: string;
  path?: string;
  icon?: string;
  parentId?: number | null;
  depth: number;
  sortingOrder: number;
}

export interface MenuUpdateRequest {
  menuId: number;
  title?: string;
  path?: string;
  icon?: string;
  parentId?: number | null;
  depth?: number;
  sortingOrder?: number;
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
