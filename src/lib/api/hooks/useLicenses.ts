import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import type { LicenseSearchResponse, LicenseSearchParams } from '@/types';

export const licenseKeys = {
  all: ['licenses'] as const,
  lists: () => [...licenseKeys.all, 'list'] as const,
  list: (params: LicenseSearchParams) => [...licenseKeys.lists(), params] as const,
};

export function useLicenseSearch(
  params: LicenseSearchParams = {},
  options?: Omit<UseQueryOptions<LicenseSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: licenseKeys.list(params),
    queryFn: async (): Promise<LicenseSearchResponse> => {
      const { data } = await apiClient.post('/license', null, {
        params: {
          page: (params.page ?? 0) + 1,
          size: params.size ?? 10,
          sort: params.sort ?? ['osType,ASC'],
        },
      });
      return data;
    },
    ...options,
  });
}
