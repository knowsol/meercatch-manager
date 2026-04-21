import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { User, UserFilters, PaginatedResponse, CreateUserRequest, UpdateUserRequest } from '@/types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers(
  filters: UserFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<User>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      const { data } = await apiClient.get(ENDPOINTS.USERS.LIST, { params: filters });
      return data;
    },
    ...options,
  });
}

export function useUser(
  id: string,
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async (): Promise<User> => {
      const { data } = await apiClient.get(ENDPOINTS.USERS.DETAIL(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest): Promise<User> => {
      const { data } = await apiClient.post(ENDPOINTS.USERS.CREATE, userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...userData }: UpdateUserRequest): Promise<User> => {
      const { data } = await apiClient.put(ENDPOINTS.USERS.UPDATE(id), userData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(ENDPOINTS.USERS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
