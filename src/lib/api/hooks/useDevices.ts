import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Device, DeviceFilters, PaginatedResponse, CreateDeviceRequest, UpdateDeviceRequest } from '@/types';

export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (filters: DeviceFilters) => [...deviceKeys.lists(), filters] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
};

export function useDevices(
  filters: DeviceFilters = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Device>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.list(filters),
    queryFn: async (): Promise<PaginatedResponse<Device>> => {
      const { data } = await apiClient.get(ENDPOINTS.DEVICES.LIST, { params: filters });
      return data;
    },
    ...options,
  });
}

export function useDevice(
  id: string,
  options?: Omit<UseQueryOptions<Device>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: async (): Promise<Device> => {
      const { data } = await apiClient.get(ENDPOINTS.DEVICES.DETAIL(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deviceData: CreateDeviceRequest): Promise<Device> => {
      const { data } = await apiClient.post(ENDPOINTS.DEVICES.CREATE, deviceData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
    },
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...deviceData }: UpdateDeviceRequest): Promise<Device> => {
      const { data } = await apiClient.put(ENDPOINTS.DEVICES.UPDATE(id), deviceData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: deviceKeys.detail(variables.id) });
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(ENDPOINTS.DEVICES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
    },
  });
}
