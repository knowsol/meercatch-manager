import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { 
  MenuListResponse, 
  MyMenuResponse, 
  MenuRegisterRequest, 
  MenuUpdateRequest,
  MenuApiResponse,
  Menu
} from '@/types';

export const menuKeys = {
  all: ['menus'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  my: () => [...menuKeys.all, 'my'] as const,
};

export function useMenuAll(
  options?: Omit<UseQueryOptions<MenuListResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: menuKeys.lists(),
    queryFn: async (): Promise<MenuListResponse> => {
      const { data } = await apiClient.post(ENDPOINTS.MENU.ALL);
      return data;
    },
    ...options,
  });
}

export function useMyMenu(
  options?: Omit<UseQueryOptions<MyMenuResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: menuKeys.my(),
    queryFn: async (): Promise<MyMenuResponse> => {
      const { data } = await apiClient.post(ENDPOINTS.MENU.MY);
      return data;
    },
    ...options,
  });
}

export function useMenuRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: MenuRegisterRequest): Promise<MenuApiResponse<object>> => {
      const { data } = await apiClient.post(ENDPOINTS.MENU.REGISTER, request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}

export function useMenuUpdate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: MenuUpdateRequest): Promise<MenuApiResponse<object>> => {
      const { data } = await apiClient.post(ENDPOINTS.MENU.UPDATE, request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}

export function useMenuDelete() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (menuId: number): Promise<MenuApiResponse<object>> => {
      const { data } = await apiClient.post(ENDPOINTS.MENU.DELETE, { menuId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}

/**
 * 메뉴 배열을 계층 구조로 변환
 * API가 이미 트리 구조로 반환하면 그대로 반환
 * 플랫 배열이면 계층 구조로 변환
 */
export function buildMenuTree(menus: Menu[]): Menu[] {
  if (!menus || menus.length === 0) return [];
  
  // API가 이미 트리 구조로 반환하는 경우 (children이 있는 경우)
  const hasTreeStructure = menus.some(m => m.children && m.children.length > 0);
  if (hasTreeStructure) {
    return [...menus].sort((a, b) => a.sortingOrder - b.sortingOrder);
  }
  
  // 플랫 배열인 경우 트리 구조로 변환
  const sorted = [...menus].sort((a, b) => a.sortingOrder - b.sortingOrder);
  const parentMenus = sorted.filter(m => m.depth === 0);
  const childMenus = sorted.filter(m => m.depth === 1);
  
  return parentMenus.map(parent => ({
    ...parent,
    children: childMenus.filter(child => child.parentId === parent.id),
  }));
}
