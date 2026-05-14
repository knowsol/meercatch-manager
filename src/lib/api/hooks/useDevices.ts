import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { DeviceFilters, CreateDeviceRequest, UpdateDeviceRequest, DevicePaginatedResponse, DeviceApiResponse } from '@/types';

export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (filters: DeviceFilters) => [...deviceKeys.lists(), filters] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
};

// OS Type 매핑 (1: Android, 2: iOS, 3: ChromeOS, 4: WhaleOS, 5: Windows)
export const OS_TYPE_MAP: Record<number, string> = {
  1: 'Android',
  2: 'iOS',
  3: 'ChromeOS',
  4: 'WhaleOS',
  5: 'Windows',
};

export function useDevices(
  filters: DeviceFilters = {},
  options?: Omit<UseQueryOptions<DevicePaginatedResponse>, 'queryKey' | 'queryFn'>
) {
  const queryFilters = {
    page: filters.page || '1',
    size: filters.size || '10',
    ...(filters.deviceStatus && { deviceStatus: filters.deviceStatus }),
    ...(filters.osType && { osType: filters.osType }),
    ...(filters.searchKeyword && { searchKeyword: filters.searchKeyword }),
  };

  return useQuery({
    queryKey: deviceKeys.list(filters),
    queryFn: async (): Promise<DevicePaginatedResponse> => {
      const { data } = await apiClient.get(ENDPOINTS.DEVICES.LIST, { params: queryFilters });
      return data;
    },
    ...options,
  });
}

export function useDevice(
  id: string,
  options?: Omit<UseQueryOptions<DeviceApiResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: async (): Promise<DeviceApiResponse> => {
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
    mutationFn: async (deviceData: CreateDeviceRequest): Promise<DeviceApiResponse> => {
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
    mutationFn: async ({ id, ...deviceData }: UpdateDeviceRequest): Promise<DeviceApiResponse> => {
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
