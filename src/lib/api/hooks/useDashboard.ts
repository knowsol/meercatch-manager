import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { DashboardStats, Detection, Pause, License } from '@/types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  recentDetections: () => [...dashboardKeys.all, 'recentDetections'] as const,
  activePauses: () => [...dashboardKeys.all, 'activePauses'] as const,
  licenseSummary: () => [...dashboardKeys.all, 'licenseSummary'] as const,
};

export function useDashboardStats(options?: Omit<UseQueryOptions<DashboardStats>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.STATS);
      return data;
    },
    ...options,
  });
}

export function useRecentDetections(options?: Omit<UseQueryOptions<Detection[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: dashboardKeys.recentDetections(),
    queryFn: async (): Promise<Detection[]> => {
      const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.RECENT_DETECTIONS);
      return data;
    },
    ...options,
  });
}

export function useActivePauses(options?: Omit<UseQueryOptions<Pause[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: dashboardKeys.activePauses(),
    queryFn: async (): Promise<Pause[]> => {
      const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.ACTIVE_PAUSES);
      return data;
    },
    ...options,
  });
}

interface LicenseSummary {
  total: number;
  used: number;
  percentage: number;
  licenses: License[];
}

export function useLicenseSummary(options?: Omit<UseQueryOptions<LicenseSummary>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: dashboardKeys.licenseSummary(),
    queryFn: async (): Promise<LicenseSummary> => {
      const { data } = await apiClient.get(ENDPOINTS.DASHBOARD.LICENSE_SUMMARY);
      return data;
    },
    ...options,
  });
}
