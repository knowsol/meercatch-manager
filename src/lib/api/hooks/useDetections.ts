import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import type { DetectionSearchResponse, DetectionSearchParams } from '@/types';

export const detectionKeys = {
  all: ['detections'] as const,
  lists: () => [...detectionKeys.all, 'list'] as const,
  list: (params: DetectionSearchParams) => [...detectionKeys.lists(), params] as const,
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
