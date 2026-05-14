import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import type { DetectionSearchResponse, DetectionSearchParams, DeviceDetectionResponse, DeviceDetectionParams } from '@/types';

export const detectionKeys = {
  all: ['detections'] as const,
  lists: () => [...detectionKeys.all, 'list'] as const,
  list: (params: DetectionSearchParams) => [...detectionKeys.lists(), params] as const,
  deviceDetections: () => [...detectionKeys.all, 'device'] as const,
  deviceDetection: (params: DeviceDetectionParams) => [...detectionKeys.deviceDetections(), params] as const,
};

export function useDetectionSearch(
  params: DetectionSearchParams,
  options?: Omit<UseQueryOptions<DetectionSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: detectionKeys.list(params),
    queryFn: async (): Promise<DetectionSearchResponse> => {
      const { data } = await apiClient.get('/detect', {
        params: {
          eventType: params.eventType || '',
          osType: params.osType || '',
          searchKeyword: params.searchKeyword || '',
          startDate: params.startDate || '',
          endDate: params.endDate || '',
          page: params.page + 1,
          size: params.size,
        },
      });
      return data;
    },
    ...options,
  });
}

export function useDeviceDetections(
  params: DeviceDetectionParams,
  options?: Omit<UseQueryOptions<DeviceDetectionResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: detectionKeys.deviceDetection(params),
    queryFn: async (): Promise<DeviceDetectionResponse> => {
      const body: Record<string, unknown> = {
        deviceUuid: params.deviceUuid,
        page: params.page + 1,
        size: params.size,
      };
      if (params.eventType !== undefined) {
        body.eventType = params.eventType;
      }
      if (params.startDate) {
        body.startDate = params.startDate;
      }
      if (params.endDate) {
        body.endDate = params.endDate;
      }
      const { data } = await apiClient.post('/devices/detects', body);
      return data;
    },
    enabled: !!params.deviceUuid,
    ...options,
  });
}

interface UpdateDetectionMemoParams {
  detectId: number;
  memo: string;
}

export function useUpdateDetectionMemo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateDetectionMemoParams) => {
      const { data } = await apiClient.post('/detect/memo', {
        detectId: params.detectId,
        memo: params.memo,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: detectionKeys.all });
    },
  });
}
