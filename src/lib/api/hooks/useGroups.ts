import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Group, GroupFilters, Device, Policy, PaginatedResponse, CreateGroupRequest, UpdateGroupRequest } from '@/types';

export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (filters: GroupFilters) => [...groupKeys.lists(), filters] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupKeys.details(), id] as const,
  devices: (id: string) => [...groupKeys.detail(id), 'devices'] as const,
  policies: (id: string) => [...groupKeys.detail(id), 'policies'] as const,
};

export function useGroups(
  filters: GroupFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Group>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: groupKeys.list(filters),
    queryFn: async (): Promise<PaginatedResponse<Group>> => {
      const { data } = await apiClient.get(ENDPOINTS.GROUPS.LIST, { params: filters });
      return data;
    },
    ...options,
  });
}

export function useGroup(
  id: string,
  options?: Omit<UseQueryOptions<Group>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: async (): Promise<Group> => {
      const { data } = await apiClient.get(ENDPOINTS.GROUPS.DETAIL(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useGroupDevices(
  id: string,
  options?: Omit<UseQueryOptions<Device[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: groupKeys.devices(id),
    queryFn: async (): Promise<Device[]> => {
      const { data } = await apiClient.get(ENDPOINTS.GROUPS.DEVICES(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useGroupPolicies(
  id: string,
  options?: Omit<UseQueryOptions<Policy[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: groupKeys.policies(id),
    queryFn: async (): Promise<Policy[]> => {
      const { data } = await apiClient.get(ENDPOINTS.GROUPS.POLICIES(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupData: CreateGroupRequest): Promise<Group> => {
      const { data } = await apiClient.post(ENDPOINTS.GROUPS.CREATE, groupData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...groupData }: UpdateGroupRequest): Promise<Group> => {
      const { data } = await apiClient.put(ENDPOINTS.GROUPS.UPDATE(id), groupData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(ENDPOINTS.GROUPS.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
}
