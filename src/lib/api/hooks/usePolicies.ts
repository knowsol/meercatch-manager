import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Policy, PolicyFilters, PaginatedResponse, CreatePolicyRequest, UpdatePolicyRequest } from '@/types';

export const policyKeys = {
  all: ['policies'] as const,
  lists: () => [...policyKeys.all, 'list'] as const,
  list: (filters: PolicyFilters) => [...policyKeys.lists(), filters] as const,
  details: () => [...policyKeys.all, 'detail'] as const,
  detail: (id: string) => [...policyKeys.details(), id] as const,
};

export function usePolicies(
  filters: PolicyFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Policy>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: policyKeys.list(filters),
    queryFn: async (): Promise<PaginatedResponse<Policy>> => {
      const { data } = await apiClient.get(ENDPOINTS.POLICIES.LIST, { params: filters });
      return data;
    },
    ...options,
  });
}

export function usePolicy(
  id: string,
  options?: Omit<UseQueryOptions<Policy>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: policyKeys.detail(id),
    queryFn: async (): Promise<Policy> => {
      const { data } = await apiClient.get(ENDPOINTS.POLICIES.DETAIL(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policyData: CreatePolicyRequest): Promise<Policy> => {
      const { data } = await apiClient.post(ENDPOINTS.POLICIES.CREATE, policyData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...policyData }: UpdatePolicyRequest): Promise<Policy> => {
      const { data } = await apiClient.put(ENDPOINTS.POLICIES.UPDATE(id), policyData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: policyKeys.detail(variables.id) });
    },
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(ENDPOINTS.POLICIES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}

export function useTogglePolicyActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Policy> => {
      const { data } = await apiClient.patch(ENDPOINTS.POLICIES.TOGGLE_ACTIVE(id));
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: policyKeys.detail(id) });
    },
  });
}
