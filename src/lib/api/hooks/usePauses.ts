import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { dashboardKeys } from './useDashboard';
import type { Pause, PauseFilters, PauseHistoryFilters, PaginatedResponse, CreatePauseRequest, CancelPauseRequest } from '@/types';

export const pauseKeys = {
  all: ['pauses'] as const,
  lists: () => [...pauseKeys.all, 'list'] as const,
  list: (filters: PauseFilters) => [...pauseKeys.lists(), filters] as const,
  details: () => [...pauseKeys.all, 'detail'] as const,
  detail: (id: string) => [...pauseKeys.details(), id] as const,
  history: (filters: PauseHistoryFilters) => [...pauseKeys.all, 'history', filters] as const,
};

export function usePauses(
  filters: PauseFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Pause>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pauseKeys.list(filters),
    queryFn: async (): Promise<PaginatedResponse<Pause>> => {
      const { data } = await apiClient.get(ENDPOINTS.PAUSES.LIST, { params: filters });
      return data;
    },
    ...options,
  });
}

export function usePause(
  id: string,
  options?: Omit<UseQueryOptions<Pause>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pauseKeys.detail(id),
    queryFn: async (): Promise<Pause> => {
      const { data } = await apiClient.get(ENDPOINTS.PAUSES.DETAIL(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

export function usePauseHistory(
  filters: PauseHistoryFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Pause>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: pauseKeys.history(filters),
    queryFn: async (): Promise<PaginatedResponse<Pause>> => {
      const { data } = await apiClient.get(ENDPOINTS.PAUSES.HISTORY, { params: filters });
      return data;
    },
    ...options,
  });
}

export function useCreatePause() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pauseData: CreatePauseRequest): Promise<Pause> => {
      const { data } = await apiClient.post(ENDPOINTS.PAUSES.CREATE, pauseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pauseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.activePauses() });
    },
  });
}

export function useCancelPause() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: CancelPauseRequest): Promise<Pause> => {
      const { data } = await apiClient.patch(ENDPOINTS.PAUSES.CANCEL(id), { cancelReason: reason });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pauseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pauseKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.activePauses() });
    },
  });
}
