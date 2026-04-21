import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { School } from '@/types';

interface SchoolFilters {
  type?: string;
  status?: string;
}

export const schoolKeys = {
  all: ['schools'] as const,
  lists: () => [...schoolKeys.all, 'list'] as const,
  list: (filters: SchoolFilters) => [...schoolKeys.lists(), filters] as const,
  details: () => [...schoolKeys.all, 'detail'] as const,
  detail: (id: string) => [...schoolKeys.details(), id] as const,
};

export function useSchools(
  filters: SchoolFilters = {},
  options?: Omit<UseQueryOptions<School[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: schoolKeys.list(filters),
    queryFn: async (): Promise<School[]> => {
      const { data } = await apiClient.get(ENDPOINTS.SCHOOLS.LIST, { params: filters });
      return data;
    },
    ...options,
  });
}

export function useSchool(
  id: string,
  options?: Omit<UseQueryOptions<School>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: schoolKeys.detail(id),
    queryFn: async (): Promise<School> => {
      const { data } = await apiClient.get(ENDPOINTS.SCHOOLS.DETAIL(id));
      return data;
    },
    enabled: !!id,
    ...options,
  });
}
