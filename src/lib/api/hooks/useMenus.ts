import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { 
  MenuListResponse, 
  MyMenuResponse, 
  MenuRegisterRequest, 
  MenuUpdateRequest,
  MenuApiResponse 
} from '@/types';

export const menuKeys = {
  all: ['menus'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  my: (permissionId: number) => [...menuKeys.all, 'my', permissionId] as const,
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
  permissionId: number | null,
  options?: Omit<UseQueryOptions<MyMenuResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: menuKeys.my(permissionId ?? 0),
    queryFn: async (): Promise<MyMenuResponse> => {
      const { data } = await apiClient.post(ENDPOINTS.MENU.MY, { permissionId });
      return data;
    },
    enabled: permissionId !== null,
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
